/**
 * Users Repository
 * Database operations for users
 */

import { prisma } from '@/libs/prisma';
import { Prisma, User } from '@prisma/client';
import { calculateOffset } from '@/shared/helpers/pagination';
import type { UserListFilters } from './users.types';

/**
 * Find user by ID
 */
export async function findById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

/**
 * Find user by email
 */
export async function findByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

/**
 * List users with filters and pagination
 */
export async function findMany(
  filters: UserListFilters,
  page: number,
  limit: number
): Promise<{ users: User[]; total: number }> {
  const where: Prisma.UserWhereInput = {};

  // Apply filters
  if (filters.role) {
    where.role = filters.role;
  }

  if (filters.isReseller !== undefined) {
    where.isReseller = filters.isReseller;
  }

  if (filters.isVip !== undefined) {
    where.isVip = filters.isVip;
  }

  if (filters.search) {
    where.OR = [
      { email: { contains: filters.search } },
      { firstName: { contains: filters.search } },
      { lastName: { contains: filters.search } },
    ];
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: calculateOffset(page, limit),
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total };
}

/**
 * Update user
 */
export async function update(
  id: string,
  data: Prisma.UserUpdateInput
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data,
  });
}

/**
 * Update user balance
 */
export async function updateBalance(
  id: string,
  amount: Prisma.Decimal
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: { balance: amount },
  });
}

/**
 * Increment user balance (for credits)
 */
export async function incrementBalance(
  id: string,
  amount: Prisma.Decimal
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: {
      balance: {
        increment: amount,
      },
    },
  });
}

/**
 * Decrement user balance (for spending credits)
 */
export async function decrementBalance(
  id: string,
  amount: Prisma.Decimal
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });
}
