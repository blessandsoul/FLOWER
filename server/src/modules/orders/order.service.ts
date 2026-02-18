import * as orderRepo from "./order.repo.js";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../../libs/errors.js";
import type { Order, OrderWithUser, OrderStatus } from "./order.types.js";

// ==========================================
// User operations
// ==========================================

export async function placeOrder(
  userId: string,
  items: { productId: number; quantity: number }[],
  notes?: string
): Promise<Order> {
  return orderRepo.placeOrder(userId, items, notes);
}

export async function getUserOrders(
  userId: string,
  page: number,
  limit: number,
  status?: OrderStatus
): Promise<{ items: Order[]; totalItems: number }> {
  const offset = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    orderRepo.findOrdersByUserId(userId, offset, limit, status),
    orderRepo.countOrdersByUserId(userId, status),
  ]);

  return { items, totalItems };
}

export async function getUserOrderById(
  userId: string,
  orderId: string
): Promise<Order> {
  const order = await orderRepo.findOrderById(orderId);
  if (!order) {
    throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");
  }
  if (order.userId !== userId) {
    throw new ForbiddenError("Access denied", "ORDER_ACCESS_DENIED");
  }
  return order;
}

export async function cancelOrder(
  userId: string,
  orderId: string
): Promise<Order> {
  const order = await orderRepo.findOrderById(orderId);
  if (!order) {
    throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");
  }
  if (order.userId !== userId) {
    throw new ForbiddenError("Access denied", "ORDER_ACCESS_DENIED");
  }
  if (order.status !== "PENDING") {
    throw new BadRequestError(
      "Only pending orders can be cancelled",
      "ORDER_NOT_CANCELLABLE"
    );
  }
  return orderRepo.cancelOrder(orderId);
}

// ==========================================
// Admin operations
// ==========================================

const VALID_TRANSITIONS: Record<string, OrderStatus[]> = {
  PENDING: ["APPROVED", "CANCELLED"],
  APPROVED: ["SHIPPED", "CANCELLED"],
  SHIPPED: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

export async function getAllOrders(
  page: number,
  limit: number,
  status?: OrderStatus
): Promise<{ items: OrderWithUser[]; totalItems: number }> {
  const offset = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    orderRepo.findAllOrders(offset, limit, status),
    orderRepo.countAllOrders(status),
  ]);

  return { items, totalItems };
}

export async function getOrderByIdAdmin(
  orderId: string
): Promise<OrderWithUser> {
  const order = await orderRepo.findOrderByIdWithUser(orderId);
  if (!order) {
    throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");
  }
  return order;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<Order | OrderWithUser> {
  const order = await orderRepo.findOrderById(orderId);
  if (!order) {
    throw new NotFoundError("Order not found", "ORDER_NOT_FOUND");
  }

  const allowed = VALID_TRANSITIONS[order.status] ?? [];
  if (!allowed.includes(newStatus)) {
    throw new BadRequestError(
      `Cannot transition from ${order.status} to ${newStatus}`,
      "INVALID_STATUS_TRANSITION"
    );
  }

  // Cancellation requires refund + stock restore
  if (newStatus === "CANCELLED") {
    return orderRepo.cancelOrder(orderId);
  }

  return orderRepo.updateOrderStatus(orderId, newStatus);
}
