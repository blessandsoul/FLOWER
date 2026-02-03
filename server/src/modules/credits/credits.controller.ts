/**
 * Credits Controller
 * Handles HTTP requests for credit management
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { successResponse, paginatedResponse } from '@/shared/helpers/response';
import * as creditsService from './credits.service';
import {
  AddCreditsSchema,
  CreditTransactionListQuerySchema,
  UserIdParamSchema,
} from './credits.schemas';
import { PaginationSchema } from '@/shared/schemas/common';

/**
 * GET /credits/balance
 * Get current user's balance
 */
export async function getMyBalance(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const balance = await creditsService.getUserBalance(userId);

  return reply.send(
    successResponse('Balance retrieved', balance)
  );
}

/**
 * GET /credits/transactions
 * Get current user's transaction history
 */
export async function getMyTransactions(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const { page, limit } = PaginationSchema.parse(request.query);

  const { transactions, total } = await creditsService.getUserTransactions(
    userId,
    page,
    limit
  );

  return reply.send(
    paginatedResponse('Transactions retrieved', transactions, page, limit, total)
  );
}

/**
 * GET /credits/admin/transactions
 * List all transactions (admin)
 */
export async function listTransactions(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = CreditTransactionListQuerySchema.parse(request.query);
  const { page, limit, ...filters } = query;

  const { transactions, total } = await creditsService.listTransactions(
    filters,
    page,
    limit
  );

  return reply.send(
    paginatedResponse('Transactions retrieved', transactions, page, limit, total)
  );
}

/**
 * GET /credits/admin/users/:userId/balance
 * Get specific user's balance (admin)
 */
export async function getUserBalance(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = UserIdParamSchema.parse(request.params);
  const balance = await creditsService.getUserBalance(userId);

  return reply.send(
    successResponse('Balance retrieved', balance)
  );
}

/**
 * POST /credits/admin/add
 * Add credits to user (admin)
 */
export async function addCredits(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const input = AddCreditsSchema.parse(request.body);
  const balance = await creditsService.addCredits(input);

  return reply.send(
    successResponse('Credits added', balance)
  );
}
