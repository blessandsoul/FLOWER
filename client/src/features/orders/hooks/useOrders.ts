import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { ordersApi } from '../services/orders.api';
import type { OrderFilters } from '../types';

export const orderKeys = {
    all: ['orders'] as const,
    list: (filters: OrderFilters) => [...orderKeys.all, 'list', filters] as const,
    detail: (id: string) => [...orderKeys.all, 'detail', id] as const,
    adminAll: ['admin-orders'] as const,
    adminList: (filters: OrderFilters) => [...orderKeys.adminAll, 'list', filters] as const,
    adminDetail: (id: string) => [...orderKeys.adminAll, 'detail', id] as const,
};

export function useOrders(filters: OrderFilters) {
    return useQuery({
        queryKey: orderKeys.list(filters),
        queryFn: () => ordersApi.getOrders(filters),
        placeholderData: keepPreviousData,
    });
}

export function useAdminOrders(filters: OrderFilters) {
    return useQuery({
        queryKey: orderKeys.adminList(filters),
        queryFn: () => ordersApi.getAdminOrders(filters),
        placeholderData: keepPreviousData,
    });
}
