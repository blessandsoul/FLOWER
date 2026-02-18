import { prisma } from "../../libs/prisma.js";
import { env } from "../../config/env.js";
import { Decimal } from "@prisma/client/runtime/library";
import type { TransactionType } from "@prisma/client";
import type { Wallet, WalletTransaction } from "./wallet.types.js";

function toWallet(prismaWallet: {
  id: string;
  userId: string;
  balance: Decimal;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}): Wallet {
  return {
    id: prismaWallet.id,
    userId: prismaWallet.userId,
    balance: prismaWallet.balance.toString(),
    currency: prismaWallet.currency,
    createdAt: prismaWallet.createdAt,
    updatedAt: prismaWallet.updatedAt,
  };
}

function toTransaction(prismaTx: {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: Decimal;
  balanceBefore: Decimal;
  balanceAfter: Decimal;
  description: string | null;
  referenceId: string | null;
  createdById: string | null;
  createdAt: Date;
}): WalletTransaction {
  return {
    id: prismaTx.id,
    walletId: prismaTx.walletId,
    type: prismaTx.type,
    amount: prismaTx.amount.toString(),
    balanceBefore: prismaTx.balanceBefore.toString(),
    balanceAfter: prismaTx.balanceAfter.toString(),
    description: prismaTx.description,
    referenceId: prismaTx.referenceId,
    createdById: prismaTx.createdById,
    createdAt: prismaTx.createdAt,
  };
}

export async function createWallet(userId: string): Promise<Wallet> {
  const wallet = await prisma.wallet.create({
    data: {
      userId,
      currency: env.WALLET_CURRENCY,
    },
  });

  return toWallet(wallet);
}

export async function findWalletByUserId(userId: string): Promise<Wallet | null> {
  const wallet = await prisma.wallet.findUnique({
    where: { userId },
  });

  return wallet ? toWallet(wallet) : null;
}

export async function deposit(
  walletId: string,
  amount: number,
  description: string | undefined,
  createdById: string
): Promise<{ wallet: Wallet; transaction: WalletTransaction }> {
  const result = await prisma.$transaction(async (tx) => {
    // Lock the wallet row by reading it inside the transaction
    const wallet = await tx.wallet.findUniqueOrThrow({
      where: { id: walletId },
    });

    const balanceBefore = wallet.balance;
    const balanceAfter = wallet.balance.add(new Decimal(amount));

    // Create the transaction record
    const transaction = await tx.walletTransaction.create({
      data: {
        walletId,
        type: "DEPOSIT",
        amount: new Decimal(amount),
        balanceBefore,
        balanceAfter,
        description: description || null,
        createdById,
      },
    });

    // Update the cached balance
    const updatedWallet = await tx.wallet.update({
      where: { id: walletId },
      data: { balance: balanceAfter },
    });

    return { wallet: updatedWallet, transaction };
  });

  return {
    wallet: toWallet(result.wallet),
    transaction: toTransaction(result.transaction),
  };
}

export async function findTransactions(
  walletId: string,
  skip: number,
  take: number,
  type?: TransactionType
): Promise<WalletTransaction[]> {
  const where: { walletId: string; type?: TransactionType } = { walletId };
  if (type) {
    where.type = type;
  }

  const transactions = await prisma.walletTransaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  return transactions.map(toTransaction);
}

export async function countTransactions(
  walletId: string,
  type?: TransactionType
): Promise<number> {
  const where: { walletId: string; type?: TransactionType } = { walletId };
  if (type) {
    where.type = type;
  }

  return prisma.walletTransaction.count({ where });
}
