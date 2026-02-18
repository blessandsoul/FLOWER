import { prisma } from "../../libs/prisma.js";
import { Decimal } from "@prisma/client/runtime/library";
import type { PaymentOrderStatus } from "@prisma/client";
import type { PaymentOrder } from "./payment.types.js";

function toPaymentOrder(row: {
  id: string;
  userId: string;
  bogOrderId: string | null;
  amount: Decimal;
  currency: string;
  status: PaymentOrderStatus;
  callbackPayload: unknown;
  redirectUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}): PaymentOrder {
  return {
    id: row.id,
    userId: row.userId,
    bogOrderId: row.bogOrderId,
    amount: row.amount.toString(),
    currency: row.currency,
    status: row.status,
    redirectUrl: row.redirectUrl,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function create(
  userId: string,
  amount: number,
  currency: string
): Promise<PaymentOrder> {
  const order = await prisma.paymentOrder.create({
    data: {
      userId,
      amount: new Decimal(amount),
      currency,
    },
  });
  return toPaymentOrder(order);
}

export async function updateBogOrderId(
  id: string,
  bogOrderId: string,
  redirectUrl: string
): Promise<PaymentOrder> {
  const order = await prisma.paymentOrder.update({
    where: { id },
    data: { bogOrderId, redirectUrl },
  });
  return toPaymentOrder(order);
}

export async function updateStatus(
  id: string,
  status: PaymentOrderStatus,
  callbackPayload?: unknown
): Promise<PaymentOrder> {
  const order = await prisma.paymentOrder.update({
    where: { id },
    data: {
      status,
      ...(callbackPayload !== undefined ? { callbackPayload: callbackPayload as object } : {}),
    },
  });
  return toPaymentOrder(order);
}

export async function findByBogOrderId(
  bogOrderId: string
): Promise<PaymentOrder | null> {
  const order = await prisma.paymentOrder.findUnique({
    where: { bogOrderId },
  });
  return order ? toPaymentOrder(order) : null;
}

export async function findById(id: string): Promise<PaymentOrder | null> {
  const order = await prisma.paymentOrder.findUnique({
    where: { id },
  });
  return order ? toPaymentOrder(order) : null;
}

export async function findByUserId(
  userId: string,
  skip: number,
  take: number,
  status?: PaymentOrderStatus
): Promise<PaymentOrder[]> {
  const where: { userId: string; status?: PaymentOrderStatus } = { userId };
  if (status) {
    where.status = status;
  }

  const orders = await prisma.paymentOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
  return orders.map(toPaymentOrder);
}

export async function countByUserId(
  userId: string,
  status?: PaymentOrderStatus
): Promise<number> {
  const where: { userId: string; status?: PaymentOrderStatus } = { userId };
  if (status) {
    where.status = status;
  }
  return prisma.paymentOrder.count({ where });
}
