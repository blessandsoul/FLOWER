import { prisma } from "../../libs/prisma.js";
import { Decimal } from "@prisma/client/runtime/library";
import { BadRequestError, NotFoundError } from "../../libs/errors.js";
import type { OrderStatus } from "@prisma/client";
import type {
  Order,
  OrderItem,
  OrderWithUser,
} from "./order.types.js";

// ==========================================
// Decimal -> string normalizers
// ==========================================

function toOrderItem(item: {
  id: string;
  orderId: string;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: Decimal;
  totalPrice: Decimal;
}): OrderItem {
  return {
    id: item.id,
    orderId: item.orderId,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPrice: item.unitPrice.toString(),
    totalPrice: item.totalPrice.toString(),
  };
}

function toOrder(dbOrder: any): Order {
  return {
    id: dbOrder.id,
    userId: dbOrder.userId,
    orderNumber: dbOrder.orderNumber,
    status: dbOrder.status,
    subtotal: dbOrder.subtotal.toString(),
    serviceFee: dbOrder.serviceFee.toString(),
    totalAmount: dbOrder.totalAmount.toString(),
    notes: dbOrder.notes,
    createdAt: dbOrder.createdAt,
    updatedAt: dbOrder.updatedAt,
    items: (dbOrder.items ?? []).map(toOrderItem),
  };
}

function toOrderWithUser(dbOrder: any): OrderWithUser {
  return {
    ...toOrder(dbOrder),
    user: {
      id: dbOrder.user.id,
      email: dbOrder.user.email,
      firstName: dbOrder.user.firstName,
      lastName: dbOrder.user.lastName,
    },
  };
}

// ==========================================
// Include clauses
// ==========================================

const orderInclude = {
  items: true,
};

const orderWithUserInclude = {
  items: true,
  user: {
    select: { id: true, email: true, firstName: true, lastName: true },
  },
};

// ==========================================
// Order number generation
// ==========================================

function generateOrderNumber(sequenceNum: number): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const seq = String(sequenceNum).padStart(5, "0");
  return `ORD-${year}${month}-${seq}`;
}

// ==========================================
// Price tier resolution
// ==========================================

function resolveUnitPrice(
  priceTiers: { minQuantity: number; price: Decimal }[],
  quantity: number
): Decimal {
  // Sort descending by minQuantity, find the highest tier the quantity qualifies for
  const sorted = [...priceTiers].sort(
    (a, b) => b.minQuantity - a.minQuantity
  );
  for (const tier of sorted) {
    if (quantity >= tier.minQuantity) {
      return tier.price;
    }
  }
  // Fallback: lowest tier (smallest minQuantity)
  const lowest = [...priceTiers].sort(
    (a, b) => a.minQuantity - b.minQuantity
  );
  if (lowest.length > 0) {
    return lowest[0].price;
  }
  throw new BadRequestError("Product has no price tiers configured");
}

// ==========================================
// Place order (atomic transaction)
// ==========================================

const SERVICE_FEE_RATE = new Decimal("0.05");

export async function placeOrder(
  userId: string,
  items: { productId: number; quantity: number }[],
  notes?: string
): Promise<Order> {
  const result = await prisma.$transaction(async (tx) => {
    // 1. Fetch wallet
    const wallet = await tx.wallet.findUnique({
      where: { userId },
    });
    if (!wallet) {
      throw new BadRequestError(
        "Wallet not found. Please set up your wallet first.",
        "WALLET_NOT_FOUND"
      );
    }

    // 2. Fetch & validate products, resolve prices
    let subtotal = new Decimal(0);
    const orderItemsData: {
      productId: number;
      productName: string;
      quantity: number;
      unitPrice: Decimal;
      totalPrice: Decimal;
    }[] = [];

    for (const item of items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        include: {
          priceTiers: {
            select: { minQuantity: true, price: true },
            orderBy: { minQuantity: "asc" },
          },
        },
      });

      if (!product) {
        throw new BadRequestError(
          `Product with ID ${item.productId} not found`,
          "PRODUCT_NOT_FOUND"
        );
      }

      if (product.stock < item.quantity) {
        throw new BadRequestError(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
          "INSUFFICIENT_STOCK"
        );
      }

      if (product.priceTiers.length === 0) {
        throw new BadRequestError(
          `Product "${product.name}" has no pricing configured`,
          "NO_PRICE_TIERS"
        );
      }

      const unitPrice = resolveUnitPrice(product.priceTiers, item.quantity);
      const totalPrice = unitPrice.mul(item.quantity);

      orderItemsData.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice,
        totalPrice,
      });

      subtotal = subtotal.add(totalPrice);
    }

    // 3. Compute fees and total
    const serviceFee = subtotal.mul(SERVICE_FEE_RATE);
    const totalAmount = subtotal.add(serviceFee);

    // 4. Check wallet balance
    if (wallet.balance.lessThan(totalAmount)) {
      throw new BadRequestError(
        `Insufficient wallet balance. Required: ${totalAmount.toFixed(2)}, available: ${wallet.balance.toFixed(2)}`,
        "INSUFFICIENT_BALANCE"
      );
    }

    // 5. Generate order number
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const orderCount = await tx.order.count({
      where: {
        createdAt: { gte: startOfMonth },
      },
    });
    const orderNumber = generateOrderNumber(orderCount + 1);

    // 6. Create order + items
    const order = await tx.order.create({
      data: {
        userId,
        orderNumber,
        subtotal,
        serviceFee,
        totalAmount,
        notes: notes || null,
        items: {
          create: orderItemsData.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: orderInclude,
    });

    // 7. Deduct stock for each product
    for (const item of orderItemsData) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // 8. Deduct wallet balance + create transaction
    const balanceBefore = wallet.balance;
    const balanceAfter = wallet.balance.sub(totalAmount);

    await tx.walletTransaction.create({
      data: {
        walletId: wallet.id,
        type: "PURCHASE",
        amount: totalAmount,
        balanceBefore,
        balanceAfter,
        description: `Order ${orderNumber}`,
        referenceId: order.id,
      },
    });

    await tx.wallet.update({
      where: { id: wallet.id },
      data: { balance: balanceAfter },
    });

    return order;
  });

  return toOrder(result);
}

// ==========================================
// Cancel order (atomic: refund wallet, restore stock)
// ==========================================

export async function cancelOrder(orderId: string): Promise<Order> {
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({
      where: { id: orderId },
      include: orderInclude,
    });

    if (!order) {
      throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");
    }

    // Restore stock for each item
    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    // Refund wallet
    const wallet = await tx.wallet.findUnique({
      where: { userId: order.userId },
    });

    if (wallet) {
      const balanceBefore = wallet.balance;
      const balanceAfter = wallet.balance.add(order.totalAmount);

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "REFUND",
          amount: order.totalAmount,
          balanceBefore,
          balanceAfter,
          description: `Refund for order ${order.orderNumber}`,
          referenceId: order.id,
        },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter },
      });
    }

    // Update status
    const updated = await tx.order.update({
      where: { id: orderId },
      data: { status: "CANCELLED" },
      include: orderInclude,
    });

    return updated;
  });

  return toOrder(result);
}

// ==========================================
// Query functions
// ==========================================

export async function findOrderById(id: string): Promise<Order | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });
  return order ? toOrder(order) : null;
}

export async function findOrdersByUserId(
  userId: string,
  skip: number,
  take: number,
  status?: OrderStatus
): Promise<Order[]> {
  const where: { userId: string; status?: OrderStatus } = { userId };
  if (status) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    include: orderInclude,
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  return orders.map(toOrder);
}

export async function countOrdersByUserId(
  userId: string,
  status?: OrderStatus
): Promise<number> {
  const where: { userId: string; status?: OrderStatus } = { userId };
  if (status) where.status = status;
  return prisma.order.count({ where });
}

export async function findAllOrders(
  skip: number,
  take: number,
  status?: OrderStatus
): Promise<OrderWithUser[]> {
  const where: { status?: OrderStatus } = {};
  if (status) where.status = status;

  const orders = await prisma.order.findMany({
    where,
    include: orderWithUserInclude,
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  return orders.map(toOrderWithUser);
}

export async function countAllOrders(
  status?: OrderStatus
): Promise<number> {
  const where: { status?: OrderStatus } = {};
  if (status) where.status = status;
  return prisma.order.count({ where });
}

export async function findOrderByIdWithUser(
  id: string
): Promise<OrderWithUser | null> {
  const order = await prisma.order.findUnique({
    where: { id },
    include: orderWithUserInclude,
  });
  return order ? toOrderWithUser(order) : null;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: orderInclude,
  });
  return toOrder(order);
}
