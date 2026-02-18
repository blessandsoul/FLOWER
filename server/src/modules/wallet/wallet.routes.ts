import type { FastifyInstance } from "fastify";
import * as walletController from "./wallet.controller.js";
import { authGuard, requireRole } from "../../middlewares/authGuard.js";

export async function walletRoutes(fastify: FastifyInstance): Promise<void> {
  // Authenticated user: get own wallet balance
  fastify.get(
    "/wallet",
    { preHandler: [authGuard] },
    walletController.getOwnWallet
  );

  // Authenticated user: get own transaction history
  fastify.get(
    "/wallet/transactions",
    { preHandler: [authGuard] },
    walletController.getOwnTransactions
  );

  // Admin: get any user's wallet
  fastify.get(
    "/users/:id/wallet",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    walletController.getUserWallet
  );

  // Admin: get any user's transaction history
  fastify.get(
    "/users/:id/wallet/transactions",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    walletController.getUserTransactions
  );

  // Admin: deposit funds into a user's wallet
  fastify.post(
    "/users/:id/wallet/deposit",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    walletController.depositToUserWallet
  );
}
