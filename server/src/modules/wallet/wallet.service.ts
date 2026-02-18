import * as walletRepo from "./wallet.repo.js";
import { NotFoundError } from "../../libs/errors.js";
import type { Wallet, WalletTransaction } from "./wallet.types.js";
import type { TransactionType } from "@prisma/client";

export async function createWallet(userId: string): Promise<Wallet> {
  return walletRepo.createWallet(userId);
}

export async function getWalletByUserId(userId: string): Promise<Wallet> {
  const wallet = await walletRepo.findWalletByUserId(userId);
  if (!wallet) {
    throw new NotFoundError("Wallet not found", "WALLET_NOT_FOUND");
  }

  return wallet;
}

export async function deposit(
  userId: string,
  amount: number,
  description: string | undefined,
  adminId: string
): Promise<{ wallet: Wallet; transaction: WalletTransaction }> {
  const wallet = await walletRepo.findWalletByUserId(userId);
  if (!wallet) {
    throw new NotFoundError("Wallet not found for this user", "WALLET_NOT_FOUND");
  }

  return walletRepo.deposit(wallet.id, amount, description, adminId);
}

export async function getTransactions(
  userId: string,
  page: number,
  limit: number,
  type?: TransactionType
): Promise<{ items: WalletTransaction[]; totalItems: number }> {
  const wallet = await walletRepo.findWalletByUserId(userId);
  if (!wallet) {
    throw new NotFoundError("Wallet not found", "WALLET_NOT_FOUND");
  }

  const offset = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    walletRepo.findTransactions(wallet.id, offset, limit, type),
    walletRepo.countTransactions(wallet.id, type),
  ]);

  return { items, totalItems };
}
