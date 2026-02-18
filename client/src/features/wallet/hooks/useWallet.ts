import { useQuery } from '@tanstack/react-query';
import { walletApi } from '../services/wallet.api';

export const walletKeys = {
    all: ['wallet'] as const,
    balance: () => [...walletKeys.all, 'balance'] as const,
};

export function useWallet() {
    return useQuery({
        queryKey: walletKeys.balance(),
        queryFn: () => walletApi.getWallet(),
    });
}
