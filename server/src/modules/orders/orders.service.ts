/**
 * Orders Service
 * Business logic for order management
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/libs/prisma';
import { logger } from '@/libs/logger';
import {
  NotFoundError,
  BadRequestError,
  ForbiddenError,
} from '@/shared/errors/errors';
import { VOLUME_DISCOUNTS, ORDER_STATUS } from '@/config/constants';
import * as ordersRepo from './orders.repo';
import * as productsRepo from '../products/products.repo';
import * as usersRepo from '../users/users.repo';
import * as invoicesService from '../invoices/invoices.service';
import type {
  OrderResponse,
  OrderSummary,
  OrderItemResponse,
  OrderListFilters,
  OrderPriceCalculation,
} from './orders.types';
import type {
  CreateOrderInput,
  UpdateOrderStatusInput,
  CalculatePriceInput,
} from './orders.schemas';

/**
 * Map order item to response
 */
function toOrderItemResponse(
  item: Prisma.OrderItemGetPayload<{ include: { product: { select: { name: true } } } }>
): OrderItemResponse {
  return {
    id: item.id,
    productId: item.productId,
    productName: item.product.name,
    quantity: item.quantity,
    unitPriceGel: item.unitPriceGel.toString(),
    totalPriceGel: item.unitPriceGel.mul(item.quantity).toString(),
  };
}

/**
 * Map order to response
 */
function toOrderResponse(
  order: Prisma.OrderGetPayload<{
    include: {
      items: { include: { product: { select: { name: true } } } };
      user: { select: { email: true; firstName: true; lastName: true } };
    };
  }>
): OrderResponse {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    userId: order.userId,
    userEmail: order.user.email,
    userName: `${order.user.firstName} ${order.user.lastName}`,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    subtotalGel: order.subtotalGel.toString(),
    discountGel: order.discountGel.toString(),
    creditsUsedGel: order.creditsUsedGel.toString(),
    totalGel: order.totalGel.toString(),
    shippingAddress: order.shippingAddress,
    notes: order.notes,
    items: order.items.map(toOrderItemResponse),
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  };
}

/**
 * Map order to summary
 */
function toOrderSummary(
  order: Prisma.OrderGetPayload<{
    include: {
      items: { include: { product: { select: { name: true } } } };
      user: { select: { email: true; firstName: true; lastName: true } };
    };
  }>
): OrderSummary {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    userId: order.userId,
    userEmail: order.user.email,
    status: order.status,
    paymentStatus: order.paymentStatus,
    totalGel: order.totalGel.toString(),
    itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
    createdAt: order.createdAt.toISOString(),
  };
}

/**
 * Calculate volume discount percentage
 */
function calculateVolumeDiscount(totalStems: number): number {
  for (const tier of VOLUME_DISCOUNTS) {
    if (totalStems >= tier.minQty) {
      return tier.discountPercentage;
    }
  }
  return 0;
}

/**
 * Calculate order price
 */
export async function calculatePrice(
  userId: string,
  input: CalculatePriceInput
): Promise<OrderPriceCalculation> {
  // Get user for credits
  const user = await usersRepo.findById(userId);
  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  // Get products
  const productIds = input.items.map((item) => item.productId);
  const products = await productsRepo.findByIds(productIds);

  if (products.length !== productIds.length) {
    throw new BadRequestError('PRODUCT_NOT_FOUND', 'One or more products not found');
  }

  // Calculate subtotal and total stems
  let subtotal = new Prisma.Decimal(0);
  let totalStems = 0;

  for (const item of input.items) {
    const product = products.find((p) => p.id === item.productId)!;
    subtotal = subtotal.add(product.priceGel.mul(item.quantity));
    totalStems += item.quantity * product.stemsPerBunch;
  }

  // Apply volume discount
  const discountPercentage = calculateVolumeDiscount(totalStems);
  const discountAmount = subtotal.mul(discountPercentage).div(100);
  let total = subtotal.sub(discountAmount);

  // Calculate credits to use
  let creditsToUse = new Prisma.Decimal(0);
  if (input.useCredits && user.balance.gt(0)) {
    creditsToUse = Prisma.Decimal.min(user.balance, total);
    total = total.sub(creditsToUse);
  }

  return {
    subtotalGel: subtotal.toString(),
    discountGel: discountAmount.toString(),
    discountPercentage,
    creditsAvailable: user.balance.toString(),
    creditsToUse: creditsToUse.toString(),
    totalGel: total.toString(),
  };
}

/**
 * Create order
 */
export async function createOrder(
  userId: string,
  input: CreateOrderInput
): Promise<OrderResponse> {
  // Calculate price first
  const priceCalc = await calculatePrice(userId, {
    items: input.items,
    useCredits: input.useCredits ?? false,
  });

  // Get products for stock check
  const productIds = input.items.map((item) => item.productId);
  const products = await productsRepo.findByIds(productIds);

  // Check stock availability
  for (const item of input.items) {
    const product = products.find((p) => p.id === item.productId)!;
    if (product.availableQty < item.quantity) {
      throw new BadRequestError(
        'PRODUCT_INSUFFICIENT_STOCK',
        `Insufficient stock for ${product.name}. Available: ${product.availableQty}`
      );
    }
  }

  // Generate order number
  const orderNumber = await ordersRepo.generateOrderNumber();

  // Create order in transaction
  const order = await prisma.$transaction(async (tx) => {
    // Deduct stock
    for (const item of input.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          availableQty: { decrement: item.quantity },
        },
      });
    }

    // Deduct credits if used
    const creditsUsed = new Prisma.Decimal(priceCalc.creditsToUse);
    if (creditsUsed.gt(0)) {
      await tx.user.update({
        where: { id: userId },
        data: {
          balance: { decrement: creditsUsed },
        },
      });

      // Record credit transaction
      await tx.creditTransaction.create({
        data: {
          userId,
          type: 'SPEND',
          amount: creditsUsed,
          description: `Used for order ${orderNumber}`,
        },
      });
    }

    // Create order with items
    return tx.order.create({
      data: {
        orderNumber,
        user: { connect: { id: userId } },
        status: 'PENDING',
        paymentStatus: 'PENDING',
        paymentMethod: input.paymentMethod,
        subtotalGel: new Prisma.Decimal(priceCalc.subtotalGel),
        discountGel: new Prisma.Decimal(priceCalc.discountGel),
        creditsUsedGel: creditsUsed,
        totalGel: new Prisma.Decimal(priceCalc.totalGel),
        shippingAddress: input.shippingAddress,
        notes: input.notes,
        items: {
          create: input.items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              product: { connect: { id: item.productId } },
              quantity: item.quantity,
              unitPriceGel: product.priceGel,
            };
          }),
        },
      },
      include: {
        items: {
          include: {
            product: {
              select: { name: true },
            },
          },
        },
        user: {
          select: { email: true, firstName: true, lastName: true },
        },
      },
    });
  });

  logger.info(
    { orderId: order.id, orderNumber, userId, total: priceCalc.totalGel },
    'Order created'
  );

  return toOrderResponse(order);
}

/**
 * Get order by ID
 */
export async function getById(orderId: string): Promise<OrderResponse> {
  const order = await ordersRepo.findById(orderId);

  if (!order) {
    throw new NotFoundError('ORDER_NOT_FOUND', 'Order not found');
  }

  return toOrderResponse(order);
}

/**
 * Get order for user (checks ownership)
 */
export async function getByIdForUser(
  orderId: string,
  userId: string
): Promise<OrderResponse> {
  const order = await ordersRepo.findById(orderId);

  if (!order) {
    throw new NotFoundError('ORDER_NOT_FOUND', 'Order not found');
  }

  if (order.userId !== userId) {
    throw new ForbiddenError('ORDER_ACCESS_DENIED', 'Access denied to this order');
  }

  return toOrderResponse(order);
}

/**
 * List orders with filters
 */
export async function listOrders(
  filters: OrderListFilters,
  page: number,
  limit: number
): Promise<{ orders: OrderSummary[]; total: number }> {
  const { orders, total } = await ordersRepo.findMany(filters, page, limit);

  return {
    orders: orders.map(toOrderSummary),
    total,
  };
}

/**
 * Get user's orders
 */
export async function getUserOrders(
  userId: string,
  page: number,
  limit: number
): Promise<{ orders: OrderSummary[]; total: number }> {
  const { orders, total } = await ordersRepo.findByUserId(userId, page, limit);

  return {
    orders: orders.map(toOrderSummary),
    total,
  };
}

/**
 * Update order status (admin/operator)
 */
export async function updateOrderStatus(
  orderId: string,
  input: UpdateOrderStatusInput
): Promise<OrderResponse> {
  const existingOrder = await ordersRepo.findById(orderId);

  if (!existingOrder) {
    throw new NotFoundError('ORDER_NOT_FOUND', 'Order not found');
  }

  // Validate status transition
  const validTransitions: Record<string, string[]> = {
    [ORDER_STATUS.PENDING]: [ORDER_STATUS.APPROVED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.APPROVED]: [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED],
    [ORDER_STATUS.SHIPPED]: [ORDER_STATUS.DELIVERED],
    [ORDER_STATUS.DELIVERED]: [],
    [ORDER_STATUS.CANCELLED]: [],
  };

  if (!validTransitions[existingOrder.status].includes(input.status)) {
    throw new BadRequestError(
      'ORDER_INVALID_STATUS_TRANSITION',
      `Cannot transition from ${existingOrder.status} to ${input.status}`
    );
  }

  // Handle cancellation - restore stock and credits
  if (input.status === ORDER_STATUS.CANCELLED) {
    await prisma.$transaction(async (tx) => {
      // Restore stock
      for (const item of existingOrder.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            availableQty: { increment: item.quantity },
          },
        });
      }

      // Restore credits if used
      if (existingOrder.creditsUsedGel.gt(0)) {
        await tx.user.update({
          where: { id: existingOrder.userId },
          data: {
            balance: { increment: existingOrder.creditsUsedGel },
          },
        });

        await tx.creditTransaction.create({
          data: {
            userId: existingOrder.userId,
            type: 'REFUND',
            amount: existingOrder.creditsUsedGel,
            description: `Refund for cancelled order ${existingOrder.orderNumber}`,
          },
        });
      }

      // Award credits for the order total (no cash refunds)
      if (existingOrder.totalGel.gt(0)) {
        await tx.user.update({
          where: { id: existingOrder.userId },
          data: {
            balance: { increment: existingOrder.totalGel },
          },
        });

        await tx.creditTransaction.create({
          data: {
            userId: existingOrder.userId,
            type: 'DEPOSIT',
            amount: existingOrder.totalGel,
            description: `Credit for cancelled order ${existingOrder.orderNumber}`,
          },
        });
      }

      // Update order status
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: input.status,
          notes: input.notes ? `${existingOrder.notes ?? ''}\n${input.notes}` : existingOrder.notes,
        },
      });
    });
  } else {
    await ordersRepo.update(orderId, {
      status: input.status,
      notes: input.notes ? `${existingOrder.notes ?? ''}\n${input.notes}` : existingOrder.notes,
    });
  }

  // Auto-generate invoice when order transitions to APPROVED
  if (input.status === ORDER_STATUS.APPROVED) {
    try {
      await invoicesService.generateInvoiceForOrder(orderId);
      logger.info({ orderId }, 'Invoice auto-generated for approved order');
    } catch (error) {
      // Log error but do NOT fail the status update
      logger.error({ orderId, error }, 'Failed to auto-generate invoice');
    }
  }

  const updatedOrder = await ordersRepo.findById(orderId);

  logger.info(
    { orderId, previousStatus: existingOrder.status, newStatus: input.status },
    'Order status updated'
  );

  return toOrderResponse(updatedOrder!);
}

/**
 * Get pending orders for operator dashboard
 */
export async function getPendingOrders(): Promise<OrderSummary[]> {
  const orders = await ordersRepo.findByStatus(ORDER_STATUS.PENDING);
  return orders.map(toOrderSummary);
}
