import type { Order, OrderWithUser, PlaceOrderInput, OrderFilters } from '../types';
import type { PaginatedResponse } from '@/features/wallet/types';
import { fetchApi, unwrapData } from '@/lib/api';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

function buildQueryString(params: Record<string, string | number | undefined>): string {
    const filtered = Object.entries(params)
        .filter(([, value]) => value !== undefined && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    return filtered.length > 0 ? `?${filtered.join('&')}` : '';
}

export const ordersApi = {
    placeOrder: async (input: PlaceOrderInput): Promise<Order> => {
        const json = await fetchApi<ApiResponse<Order>>('/orders', {
            method: 'POST',
            body: JSON.stringify(input),
        });
        return unwrapData(json);
    },

    getOrders: async (filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
        const qs = buildQueryString({
            page: filters?.page,
            limit: filters?.limit,
            status: filters?.status,
        });
        return fetchApi<PaginatedResponse<Order>>(`/orders${qs}`);
    },

    getOrder: async (id: string): Promise<Order> => {
        const json = await fetchApi<ApiResponse<Order>>(`/orders/${id}`);
        return unwrapData(json);
    },

    cancelOrder: async (id: string): Promise<Order> => {
        const json = await fetchApi<ApiResponse<Order>>(`/orders/${id}/cancel`, {
            method: 'POST',
        });
        return unwrapData(json);
    },

    getAdminOrders: async (filters?: OrderFilters): Promise<PaginatedResponse<OrderWithUser>> => {
        const qs = buildQueryString({
            page: filters?.page,
            limit: filters?.limit,
            status: filters?.status,
        });
        return fetchApi<PaginatedResponse<OrderWithUser>>(`/admin/orders${qs}`);
    },

    getAdminOrder: async (id: string): Promise<OrderWithUser> => {
        const json = await fetchApi<ApiResponse<OrderWithUser>>(`/admin/orders/${id}`);
        return unwrapData(json);
    },

    updateOrderStatus: async (id: string, status: string): Promise<Order> => {
        const json = await fetchApi<ApiResponse<Order>>(`/admin/orders/${id}/status`, {
            method: 'PATCH',
            body: JSON.stringify({ status }),
        });
        return unwrapData(json);
    },
};
