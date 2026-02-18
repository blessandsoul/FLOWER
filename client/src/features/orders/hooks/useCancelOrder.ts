import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../services/orders.api';
import { orderKeys } from './useOrders';
import { walletKeys } from '@/features/wallet/hooks';

export function useCancelOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (orderId: string) => ordersApi.cancelOrder(orderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: walletKeys.all });
        },
    });
}
