import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../services/orders.api';
import { orderKeys } from './useOrders';

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) =>
            ordersApi.updateOrderStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: orderKeys.all });
            queryClient.invalidateQueries({ queryKey: orderKeys.adminAll });
        },
    });
}
