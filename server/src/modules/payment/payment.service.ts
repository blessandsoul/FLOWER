import * as paymentRepo from "./payment.repo.js";
import * as bogClient from "./bog.client.js";
import * as walletRepo from "../wallet/wallet.repo.js";
import { Decimal } from "@prisma/client/runtime/library";
import { prisma } from "../../libs/prisma.js";
import { env } from "../../config/env.js";
import { logger } from "../../libs/logger.js";
import { NotFoundError } from "../../libs/errors.js";
import type { PaymentOrder, BogCallbackPayload } from "./payment.types.js";
import type { PaymentOrderStatus } from "@prisma/client";

export async function createTopUp(
  userId: string,
  amount: number
): Promise<{ order: PaymentOrder; redirectUrl: string }> {
  // Ensure user has a wallet
  let wallet = await walletRepo.findWalletByUserId(userId);
  if (!wallet) {
    wallet = await walletRepo.createWallet(userId);
  }

  // Create local payment order
  const order = await paymentRepo.create(userId, amount, env.BOG_PAYMENT_CURRENCY);

  // Create BOG order
  const bogOrder = await bogClient.createOrder(
    order.id,
    amount,
    env.BOG_PAYMENT_CURRENCY
  );

  // Update our order with BOG's order ID and redirect URL
  const updatedOrder = await paymentRepo.updateBogOrderId(
    order.id,
    bogOrder.id,
    bogOrder._links.redirect.href
  );

  return {
    order: updatedOrder,
    redirectUrl: bogOrder._links.redirect.href,
  };
}

export async function handleCallback(
  payload: BogCallbackPayload
): Promise<void> {
  const bogOrderId = payload.body.order_id;
  const statusKey = payload.body.order_status.key;

  logger.info({ bogOrderId, statusKey }, "BOG callback received");

  const order = await paymentRepo.findByBogOrderId(bogOrderId);
  if (!order) {
    logger.warn({ bogOrderId }, "BOG callback for unknown order");
    return;
  }

  // Don't process already-completed or already-failed orders
  if (order.status !== "PENDING") {
    logger.info(
      { orderId: order.id, currentStatus: order.status },
      "Ignoring callback for non-pending order"
    );
    return;
  }

  if (statusKey === "completed") {
    // Credit the user's wallet in a transaction
    await prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { userId: order.userId },
      });

      if (!wallet) {
        logger.error({ userId: order.userId }, "Wallet not found during callback");
        throw new Error("Wallet not found");
      }

      const amount = new Decimal(order.amount);
      const balanceBefore = wallet.balance;
      const balanceAfter = wallet.balance.add(amount);

      // Create wallet transaction
      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: "DEPOSIT",
          amount,
          balanceBefore,
          balanceAfter,
          description: `Wallet top-up via BOG payment`,
          referenceId: order.id,
        },
      });

      // Update wallet balance
      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: balanceAfter },
      });

      // Mark order as completed
      await tx.paymentOrder.update({
        where: { id: order.id },
        data: {
          status: "COMPLETED",
          callbackPayload: payload as object,
        },
      });
    });

    logger.info({ orderId: order.id, amount: order.amount }, "Top-up completed");
  } else if (statusKey === "rejected") {
    await paymentRepo.updateStatus(order.id, "FAILED", payload);
    logger.info({ orderId: order.id }, "Payment rejected");
  } else {
    logger.info({ orderId: order.id, statusKey }, "Unhandled BOG status");
  }
}

export async function getOrderById(
  orderId: string,
  userId: string
): Promise<PaymentOrder> {
  const order = await paymentRepo.findById(orderId);
  if (!order || order.userId !== userId) {
    throw new NotFoundError("Payment order not found", "PAYMENT_ORDER_NOT_FOUND");
  }
  return order;
}

export async function getOrders(
  userId: string,
  page: number,
  limit: number,
  status?: PaymentOrderStatus
): Promise<{ items: PaymentOrder[]; totalItems: number }> {
  const offset = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    paymentRepo.findByUserId(userId, offset, limit, status),
    paymentRepo.countByUserId(userId, status),
  ]);

  return { items, totalItems };
}
