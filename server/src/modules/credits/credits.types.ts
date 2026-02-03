/**
 * Credits Module Types
 */

import type { TransactionType } from '@/config/constants';

/**
 * Credit transaction response
 */
export interface CreditTransactionResponse {
  id: string;
  userId: string;
  type: TransactionType;
  amount: string;
  description: string | null;
  createdAt: string;
}

/**
 * User balance response
 */
export interface UserBalanceResponse {
  balance: string;
  recentTransactions: CreditTransactionResponse[];
}

/**
 * Add credits request (admin)
 */
export interface AddCreditsRequest {
  userId: string;
  amount: string;
  description?: string;
}

/**
 * Credit transaction filters
 */
export interface CreditTransactionFilters {
  userId?: string;
  type?: TransactionType;
  fromDate?: string;
  toDate?: string;
}
