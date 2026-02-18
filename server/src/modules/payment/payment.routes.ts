import type { FastifyInstance } from "fastify";
import * as paymentController from "./payment.controller.js";
import { authGuard } from "../../middlewares/authGuard.js";

export async function paymentRoutes(fastify: FastifyInstance): Promise<void> {
  // User: create a wallet top-up payment
  fastify.post(
    "/payment/topup",
    { preHandler: [authGuard] },
    paymentController.createTopUp
  );

  // User: list own payment orders
  fastify.get(
    "/payment/orders",
    { preHandler: [authGuard] },
    paymentController.getOrders
  );

  // User: get single payment order
  fastify.get(
    "/payment/orders/:id",
    { preHandler: [authGuard] },
    paymentController.getOrderById
  );

  // BOG callback (no auth — called by BOG's servers)
  fastify.post("/payment/bog/callback", paymentController.bogCallback);
}
