import type { FastifyRequest, FastifyReply } from "fastify";
import { successResponse, paginatedResponse } from "../../libs/response.js";
import { ValidationError } from "../../libs/errors.js";
import * as walletService from "./wallet.service.js";
import {
  depositSchema,
  walletTransactionQuerySchema,
  userIdParamSchema,
} from "./wallet.schemas.js";

// Authenticated user: get own wallet
export async function getOwnWallet(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const wallet = await walletService.getWalletByUserId(request.user.id);

  return reply.send(successResponse("Wallet retrieved successfully", wallet));
}

// Authenticated user: get own transaction history
export async function getOwnTransactions(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const queryParsed = walletTransactionQuerySchema.safeParse(request.query);
  if (!queryParsed.success) {
    throw new ValidationError(queryParsed.error.errors[0].message);
  }

  const { page, limit, type } = queryParsed.data;
  const { items, totalItems } = await walletService.getTransactions(
    request.user.id,
    page,
    limit,
    type
  );

  return reply.send(
    paginatedResponse("Transactions retrieved successfully", items, page, limit, totalItems)
  );
}

// Admin: get any user's wallet
export async function getUserWallet(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const paramsParsed = userIdParamSchema.safeParse(request.params);
  if (!paramsParsed.success) {
    throw new ValidationError(paramsParsed.error.errors[0].message);
  }

  const wallet = await walletService.getWalletByUserId(paramsParsed.data.id);

  return reply.send(successResponse("Wallet retrieved successfully", wallet));
}

// Admin: get any user's transaction history
export async function getUserTransactions(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const paramsParsed = userIdParamSchema.safeParse(request.params);
  if (!paramsParsed.success) {
    throw new ValidationError(paramsParsed.error.errors[0].message);
  }

  const queryParsed = walletTransactionQuerySchema.safeParse(request.query);
  if (!queryParsed.success) {
    throw new ValidationError(queryParsed.error.errors[0].message);
  }

  const { page, limit, type } = queryParsed.data;
  const { items, totalItems } = await walletService.getTransactions(
    paramsParsed.data.id,
    page,
    limit,
    type
  );

  return reply.send(
    paginatedResponse("Transactions retrieved successfully", items, page, limit, totalItems)
  );
}

// Admin: deposit funds into a user's wallet
export async function depositToUserWallet(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const paramsParsed = userIdParamSchema.safeParse(request.params);
  if (!paramsParsed.success) {
    throw new ValidationError(paramsParsed.error.errors[0].message);
  }

  const bodyParsed = depositSchema.safeParse(request.body);
  if (!bodyParsed.success) {
    throw new ValidationError(bodyParsed.error.errors[0].message);
  }

  const { wallet, transaction } = await walletService.deposit(
    paramsParsed.data.id,
    bodyParsed.data.amount,
    bodyParsed.data.description,
    request.user.id
  );

  return reply.status(200).send(
    successResponse("Deposit successful", { wallet, transaction })
  );
}
