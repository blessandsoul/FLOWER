import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../services/wallet.api';
import { walletKeys } from './useWallet';
import { paymentOrderKeys } from './usePaymentOrders';

export function useTopUp() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (amount: number) => paymentApi.createTopUp(amount),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: walletKeys.all });
            queryClient.invalidateQueries({ queryKey: paymentOrderKeys.all });
        },
    });
}
