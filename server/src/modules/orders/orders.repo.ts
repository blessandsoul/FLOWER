/**
 * Orders Repository
 * Database operations for orders
 */

import { prisma } from '@/libs/prisma';
import { Prisma, Order, OrderItem, OrderStatus as PrismaOrderStatus } from '@prisma/client';
import { calculateOffset } from '@/shared/helpers/pagination';
import type { OrderListFilters } from './orders.types';

type OrderWithItems = Order & {
  items: (OrderItem & { product: { name: string } })[];
  user: { email: string; firstName: string; lastName: string };
};

/**
 * Generate unique order number
 */
export async function generateOrderNumber(): Promise<string> {
  const date = new Date();
  const prefix = `ORD-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;

  // Get count of orders this month
  const count = await prisma.order.count({
    where: {
      orderNumber: { startsWith: prefix },
    },
  });

  return `${prefix}-${String(count + 1).padStart(5, '0')}`;
}

/**
 * Find order by ID with items
 */
export async function findById(id: string): Promise<OrderWithItems | null> {
  return prisma.order.findUnique({
    where: { id },
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
}

/**
 * Find order by order number
 */
export async function findByOrderNumber(orderNumber: string): Promise<Order | null> {
  return prisma.order.findUnique({
    where: { orderNumber },
  });
}

/**
 * List orders with filters and pagination
 */
export async function findMany(
  filters: OrderListFilters,
  page: number,
  limit: number
): Promise<{ orders: OrderWithItems[]; total: number }> {
  const where: Prisma.OrderWhereInput = {};

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.paymentStatus) {
    where.paymentStatus = filters.paymentStatus;
  }

  if (filters.fromDate) {
    where.createdAt = {
      ...((where.createdAt as Prisma.DateTimeFilter) || {}),
      gte: new Date(filters.fromDate),
    };
  }

  if (filters.toDate) {
    where.createdAt = {
      ...((where.createdAt as Prisma.DateTimeFilter) || {}),
      lte: new Date(filters.toDate),
    };
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
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
      skip: calculateOffset(page, limit),
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.count({ where }),
  ]);

  return { orders, total };
}

/**
 * Create order with items
 */
export async function create(
  data: Prisma.OrderCreateInput
): Promise<OrderWithItems> {
  return prisma.order.create({
    data,
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
}

/**
 * Update order
 */
export async function update(
  id: string,
  data: Prisma.OrderUpdateInput
): Promise<OrderWithItems> {
  return prisma.order.update({
    where: { id },
    data,
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
}

/**
 * Get user's orders
 */
export async function findByUserId(
  userId: string,
  page: number,
  limit: number
): Promise<{ orders: OrderWithItems[]; total: number }> {
  return findMany({ userId }, page, limit);
}

/**
 * Get orders by status (for operator dashboard)
 */
export async function findByStatus(status: PrismaOrderStatus): Promise<OrderWithItems[]> {
  return prisma.order.findMany({
    where: { status },
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
    orderBy: { createdAt: 'asc' },
    take: 50,
  });
}
