/**
 * Credits Service
 * Business logic for credit/balance management
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/libs/prisma';
import { logger } from '@/libs/logger';
import { NotFoundError, BadRequestError } from '@/shared/errors/errors';
import * as creditsRepo from './credits.repo';
import * as usersRepo from '../users/users.repo';
import type {
  CreditTransactionResponse,
  UserBalanceResponse,
  CreditTransactionFilters,
} from './credits.types';
import type { AddCreditsInput } from './credits.schemas';

/**
 * Map transaction to response
 */
function toTransactionResponse(
  transaction: Prisma.CreditTransactionGetPayload<{}>
): CreditTransactionResponse {
  return {
    id: transaction.id,
    userId: transaction.userId,
    type: transaction.type,
    amount: transaction.amount.toString(),
    description: transaction.description,
    createdAt: transaction.createdAt.toISOString(),
  };
}

/**
 * Get user balance with recent transactions
 */
export async function getUserBalance(userId: string): Promise<UserBalanceResponse> {
  const user = await usersRepo.findById(userId);

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  const recentTransactions = await creditsRepo.findRecentByUserId(userId, 10);

  return {
    balance: user.balance.toString(),
    recentTransactions: recentTransactions.map(toTransactionResponse),
  };
}

/**
 * List credit transactions (admin)
 */
export async function listTransactions(
  filters: CreditTransactionFilters,
  page: number,
  limit: number
): Promise<{ transactions: CreditTransactionResponse[]; total: number }> {
  const { transactions, total } = await creditsRepo.findMany(filters, page, limit);

  return {
    transactions: transactions.map(toTransactionResponse),
    total,
  };
}

/**
 * Add credits to user (admin)
 */
export async function addCredits(input: AddCreditsInput): Promise<UserBalanceResponse> {
  const user = await usersRepo.findById(input.userId);

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  const amount = new Prisma.Decimal(input.amount);

  if (amount.lte(0)) {
    throw new BadRequestError('CREDITS_INVALID_AMOUNT', 'Amount must be positive');
  }

  await prisma.$transaction(async (tx) => {
    // Update user balance
    await tx.user.update({
      where: { id: input.userId },
      data: {
        balance: { increment: amount },
      },
    });

    // Create transaction record
    await tx.creditTransaction.create({
      data: {
        userId: input.userId,
        type: 'DEPOSIT',
        amount,
        description: input.description ?? 'Manual credit deposit by admin',
      },
    });
  });

  logger.info(
    { userId: input.userId, amount: input.amount },
    'Credits added by admin'
  );

  return getUserBalance(input.userId);
}

/**
 * Deduct credits from user (admin)
 */
export async function deductCredits(
  userId: string,
  amount: string,
  description?: string
): Promise<UserBalanceResponse> {
  const user = await usersRepo.findById(userId);

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  const deductAmount = new Prisma.Decimal(amount);

  if (deductAmount.lte(0)) {
    throw new BadRequestError('CREDITS_INVALID_AMOUNT', 'Amount must be positive');
  }

  if (user.balance.lt(deductAmount)) {
    throw new BadRequestError(
      'CREDITS_INSUFFICIENT',
      `Insufficient credits. Available: ${user.balance.toString()}`
    );
  }

  await prisma.$transaction(async (tx) => {
    // Update user balance
    await tx.user.update({
      where: { id: userId },
      data: {
        balance: { decrement: deductAmount },
      },
    });

    // Create transaction record
    await tx.creditTransaction.create({
      data: {
        userId,
        type: 'FEE',
        amount: deductAmount,
        description: description ?? 'Manual credit deduction by admin',
      },
    });
  });

  logger.info(
    { userId, amount },
    'Credits deducted by admin'
  );

  return getUserBalance(userId);
}

/**
 * Get user's transaction history
 */
export async function getUserTransactions(
  userId: string,
  page: number,
  limit: number
): Promise<{ transactions: CreditTransactionResponse[]; total: number }> {
  const user = await usersRepo.findById(userId);

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  const { transactions, total } = await creditsRepo.findMany({ userId }, page, limit);

  return {
    transactions: transactions.map(toTransactionResponse),
    total,
  };
}
