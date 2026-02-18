import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { walletApi } from '../services/wallet.api';
import type { WalletTransactionFilters } from '../types';

export const transactionKeys = {
    all: ['wallet-transactions'] as const,
    list: (filters: WalletTransactionFilters) => [...transactionKeys.all, filters] as const,
};

export function useWalletTransactions(filters: WalletTransactionFilters) {
    return useQuery({
        queryKey: transactionKeys.list(filters),
        queryFn: () => walletApi.getTransactions(filters),
        placeholderData: keepPreviousData,
    });
}
