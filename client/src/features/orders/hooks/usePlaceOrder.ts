import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../services/orders.api';
import { orderKeys } from './useOrders';
import { walletKeys } from '@/features/wallet/hooks';

export function usePlaceOrder() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ordersApi.placeOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: walletKeys.all });
        },
    });
}
