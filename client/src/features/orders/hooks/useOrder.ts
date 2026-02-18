import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../services/orders.api';
import { orderKeys } from './useOrders';

export function useOrder(id: string) {
    return useQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => ordersApi.getOrder(id),
        enabled: !!id,
    });
}
