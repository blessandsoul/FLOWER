import type { TransactionType } from "@prisma/client";

export type { TransactionType } from "@prisma/client";

export interface Wallet {
  id: string;
  userId: string;
  balance: string; // Decimal as string for precision
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: TransactionType;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  description: string | null;
  referenceId: string | null;
  createdById: string | null;
  createdAt: Date;
}

export interface WalletWithTransactions extends Wallet {
  transactions: WalletTransaction[];
}
