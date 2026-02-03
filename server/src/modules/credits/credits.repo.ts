/**
 * Credits Repository
 * Database operations for credit transactions
 */

import { prisma } from '@/libs/prisma';
import { Prisma, CreditTransaction, TransactionType } from '@prisma/client';
import { calculateOffset } from '@/shared/helpers/pagination';
import type { CreditTransactionFilters } from './credits.types';

/**
 * Find transaction by ID
 */
export async function findById(id: string): Promise<CreditTransaction | null> {
  return prisma.creditTransaction.findUnique({
    where: { id },
  });
}

/**
 * List transactions with filters
 */
export async function findMany(
  filters: CreditTransactionFilters,
  page: number,
  limit: number
): Promise<{ transactions: CreditTransaction[]; total: number }> {
  const where: Prisma.CreditTransactionWhereInput = {};

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.type) {
    where.type = filters.type;
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

  const [transactions, total] = await Promise.all([
    prisma.creditTransaction.findMany({
      where,
      skip: calculateOffset(page, limit),
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.creditTransaction.count({ where }),
  ]);

  return { transactions, total };
}

/**
 * Create credit transaction
 */
export async function create(
  data: Prisma.CreditTransactionCreateInput
): Promise<CreditTransaction> {
  return prisma.creditTransaction.create({ data });
}

/**
 * Get user's recent transactions
 */
export async function findRecentByUserId(
  userId: string,
  limit: number = 10
): Promise<CreditTransaction[]> {
  return prisma.creditTransaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

/**
 * Get total credits by type for user
 */
export async function sumByTypeForUser(
  userId: string,
  type: TransactionType
): Promise<Prisma.Decimal> {
  const result = await prisma.creditTransaction.aggregate({
    where: { userId, type },
    _sum: { amount: true },
  });

  return result._sum?.amount ?? new Prisma.Decimal(0);
}
