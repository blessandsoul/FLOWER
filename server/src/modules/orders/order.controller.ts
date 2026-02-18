import type { FastifyRequest, FastifyReply } from "fastify";
import { successResponse, paginatedResponse } from "../../libs/response.js";
import { ValidationError } from "../../libs/errors.js";
import * as orderService from "./order.service.js";
import {
  placeOrderSchema,
  orderIdParamSchema,
  orderListQuerySchema,
  updateOrderStatusSchema,
} from "./order.schemas.js";

// ==========================================
// User endpoints
// ==========================================

export async function placeOrder(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const bodyParsed = placeOrderSchema.safeParse(request.body);
  if (!bodyParsed.success) {
    throw new ValidationError(bodyParsed.error.errors[0].message);
  }

  const order = await orderService.placeOrder(
    request.user.id,
    bodyParsed.data.items,
    bodyParsed.data.notes
  );

  return reply
    .status(201)
    .send(successResponse("Order placed successfully", order));
}

export async function getOwnOrders(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const queryParsed = orderListQuerySchema.safeParse(request.query);
  if (!queryParsed.success) {
    throw new ValidationError(queryParsed.error.errors[0].message);
  }

  const { page, limit, status } = queryParsed.data;
  const { items, totalItems } = await orderService.getUserOrders(
    request.user.id,
    page,
    limit,
    status
  );

  return reply.send(
    paginatedResponse("Orders retrieved", items, page, limit, totalItems)
  );
}

export async function getOwnOrderById(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const paramsParsed = orderIdParamSchema.safeParse(request.params);
  if (!paramsParsed.success) {
    throw new ValidationError(paramsParsed.error.errors[0].message);
  }

  const order = await orderService.getUserOrderById(
    request.user.id,
    paramsParsed.data.id
  );

  return reply.send(successResponse("Order retrieved", order));
}

export async function cancelOwnOrder(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const paramsParsed = orderIdParamSchema.safeParse(request.params);
  if (!paramsParsed.success) {
    throw new ValidationError(paramsParsed.error.errors[0].message);
  }

  const order = await orderService.cancelOrder(
    request.user.id,
    paramsParsed.data.id
  );

  return reply.send(successResponse("Order cancelled", order));
}

// ==========================================
// Admin endpoints
// ==========================================

export async function getAllOrders(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const queryParsed = orderListQuerySchema.safeParse(request.query);
  if (!queryParsed.success) {
    throw new ValidationError(queryParsed.error.errors[0].message);
  }

  const { page, limit, status } = queryParsed.data;
  const { items, totalItems } = await orderService.getAllOrders(
    page,
    limit,
    status
  );

  return reply.send(
    paginatedResponse("Orders retrieved", items, page, limit, totalItems)
  );
}

export async function getOrderByIdAdmin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const paramsParsed = orderIdParamSchema.safeParse(request.params);
  if (!paramsParsed.success) {
    throw new ValidationError(paramsParsed.error.errors[0].message);
  }

  const order = await orderService.getOrderByIdAdmin(paramsParsed.data.id);
  return reply.send(successResponse("Order retrieved", order));
}

export async function updateOrderStatus(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const paramsParsed = orderIdParamSchema.safeParse(request.params);
  if (!paramsParsed.success) {
    throw new ValidationError(paramsParsed.error.errors[0].message);
  }

  const bodyParsed = updateOrderStatusSchema.safeParse(request.body);
  if (!bodyParsed.success) {
    throw new ValidationError(bodyParsed.error.errors[0].message);
  }

  const order = await orderService.updateOrderStatus(
    paramsParsed.data.id,
    bodyParsed.data.status
  );

  return reply.send(successResponse("Order status updated", order));
}
