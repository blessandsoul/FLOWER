/**
 * Orders Controller
 * Handles HTTP requests for order management
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { successResponse, paginatedResponse } from '@/shared/helpers/response';
import * as ordersService from './orders.service';
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
  OrderListQuerySchema,
  OrderIdParamSchema,
  CalculatePriceSchema,
} from './orders.schemas';
import { PaginationSchema } from '@/shared/schemas/common';

/**
 * POST /orders/calculate
 * Calculate order price before checkout
 */
export async function calculatePrice(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const input = CalculatePriceSchema.parse(request.body);

  const calculation = await ordersService.calculatePrice(userId, input);

  return reply.send(
    successResponse('Price calculated', calculation)
  );
}

/**
 * POST /orders
 * Create new order
 */
export async function createOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const input = CreateOrderSchema.parse(request.body);

  const order = await ordersService.createOrder(userId, input);

  return reply.status(201).send(
    successResponse('Order created', order)
  );
}

/**
 * GET /orders
 * List all orders (admin/operator)
 */
export async function listOrders(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = OrderListQuerySchema.parse(request.query);
  const { page, limit, ...filters } = query;

  const { orders, total } = await ordersService.listOrders(filters, page, limit);

  return reply.send(
    paginatedResponse('Orders retrieved', orders, page, limit, total)
  );
}

/**
 * GET /orders/my
 * Get current user's orders
 */
export async function getMyOrders(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const { page, limit } = PaginationSchema.parse(request.query);

  const { orders, total } = await ordersService.getUserOrders(userId, page, limit);

  return reply.send(
    paginatedResponse('Orders retrieved', orders, page, limit, total)
  );
}

/**
 * GET /orders/pending
 * Get pending orders for operator dashboard
 */
export async function getPendingOrders(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const orders = await ordersService.getPendingOrders();

  return reply.send(
    successResponse('Pending orders retrieved', orders)
  );
}

/**
 * GET /orders/:id
 * Get order by ID (admin/operator or owner)
 */
export async function getOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = OrderIdParamSchema.parse(request.params);
  const order = await ordersService.getById(id);

  return reply.send(
    successResponse('Order retrieved', order)
  );
}

/**
 * GET /orders/my/:id
 * Get own order by ID
 */
export async function getMyOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const { id } = OrderIdParamSchema.parse(request.params);

  const order = await ordersService.getByIdForUser(id, userId);

  return reply.send(
    successResponse('Order retrieved', order)
  );
}

/**
 * PATCH /orders/:id/status
 * Update order status (admin/operator)
 */
export async function updateOrderStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = OrderIdParamSchema.parse(request.params);
  const input = UpdateOrderStatusSchema.parse(request.body);

  const order = await ordersService.updateOrderStatus(id, input);

  return reply.send(
    successResponse('Order status updated', order)
  );
}
