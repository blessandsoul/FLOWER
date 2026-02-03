/**
 * Batches Repository
 * Database operations for import batches
 */

import { prisma } from '@/libs/prisma';
import { Prisma, Batch, BatchItem } from '@prisma/client';
import { calculateOffset } from '@/shared/helpers/pagination';
import type { BatchListFilters } from './batches.types';

type BatchWithItems = Batch & {
  items: (BatchItem & { product: { name: string } })[];
};

/**
 * Find batch by ID with items
 */
export async function findById(id: string): Promise<BatchWithItems | null> {
  return prisma.batch.findUnique({
    where: { id },
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
    },
  });
}

/**
 * Find batch by batch number
 */
export async function findByBatchNumber(batchNumber: string): Promise<Batch | null> {
  return prisma.batch.findUnique({
    where: { batchNumber },
  });
}

/**
 * List batches with filters and pagination
 */
export async function findMany(
  filters: BatchListFilters,
  page: number,
  limit: number
): Promise<{ batches: Batch[]; total: number }> {
  const where: Prisma.BatchWhereInput = {};

  if (filters.origin) {
    where.origin = filters.origin;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.fromDate) {
    where.expectedArrivalDate = {
      ...((where.expectedArrivalDate as Prisma.DateTimeFilter) || {}),
      gte: new Date(filters.fromDate),
    };
  }

  if (filters.toDate) {
    where.expectedArrivalDate = {
      ...((where.expectedArrivalDate as Prisma.DateTimeFilter) || {}),
      lte: new Date(filters.toDate),
    };
  }

  const [batches, total] = await Promise.all([
    prisma.batch.findMany({
      where,
      skip: calculateOffset(page, limit),
      take: limit,
      orderBy: { expectedArrivalDate: 'desc' },
    }),
    prisma.batch.count({ where }),
  ]);

  return { batches, total };
}

/**
 * Create batch with items
 */
export async function create(
  data: Prisma.BatchCreateInput,
  items: { productId: string; quantityOrdered: number; unitCostEur: Prisma.Decimal }[]
): Promise<BatchWithItems> {
  return prisma.batch.create({
    data: {
      ...data,
      items: {
        create: items.map((item) => ({
          product: { connect: { id: item.productId } },
          quantityOrdered: item.quantityOrdered,
          quantityReceived: 0,
          unitCostEur: item.unitCostEur,
        })),
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
    },
  });
}

/**
 * Update batch
 */
export async function update(
  id: string,
  data: Prisma.BatchUpdateInput
): Promise<Batch> {
  return prisma.batch.update({
    where: { id },
    data,
  });
}

/**
 * Find batch item by ID
 */
export async function findBatchItemById(id: string): Promise<BatchItem | null> {
  return prisma.batchItem.findUnique({
    where: { id },
  });
}

/**
 * Update batch item received quantity
 */
export async function updateBatchItemReceived(
  id: string,
  quantityReceived: number
): Promise<BatchItem> {
  return prisma.batchItem.update({
    where: { id },
    data: { quantityReceived },
  });
}

/**
 * Get pending batches (for operator dashboard)
 */
export async function findPendingBatches(): Promise<Batch[]> {
  return prisma.batch.findMany({
    where: {
      status: { in: ['ORDERED', 'IN_TRANSIT'] },
    },
    orderBy: { expectedArrivalDate: 'asc' },
    take: 10,
  });
}
