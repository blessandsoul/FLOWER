import type { FastifyInstance } from "fastify";
import * as orderController from "./order.controller.js";
import { authGuard, requireRole } from "../../middlewares/authGuard.js";

export async function orderRoutes(fastify: FastifyInstance): Promise<void> {
  // User: place a new order
  fastify.post(
    "/orders",
    { preHandler: [authGuard] },
    orderController.placeOrder
  );

  // User: list own orders
  fastify.get(
    "/orders",
    { preHandler: [authGuard] },
    orderController.getOwnOrders
  );

  // User: get own order detail
  fastify.get(
    "/orders/:id",
    { preHandler: [authGuard] },
    orderController.getOwnOrderById
  );

  // User: cancel own pending order
  fastify.post(
    "/orders/:id/cancel",
    { preHandler: [authGuard] },
    orderController.cancelOwnOrder
  );

  // Admin: list all orders
  fastify.get(
    "/admin/orders",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    orderController.getAllOrders
  );

  // Admin: get any order detail
  fastify.get(
    "/admin/orders/:id",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    orderController.getOrderByIdAdmin
  );

  // Admin: update order status
  fastify.patch(
    "/admin/orders/:id/status",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    orderController.updateOrderStatus
  );
}
