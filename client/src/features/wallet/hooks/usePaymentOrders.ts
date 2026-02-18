import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { paymentApi } from '../services/wallet.api';
import type { PaymentOrderFilters } from '../types';

export const paymentOrderKeys = {
    all: ['payment-orders'] as const,
    list: (filters: PaymentOrderFilters) => [...paymentOrderKeys.all, filters] as const,
};

export function usePaymentOrders(filters: PaymentOrderFilters) {
    return useQuery({
        queryKey: paymentOrderKeys.list(filters),
        queryFn: () => paymentApi.getOrders(filters),
        placeholderData: keepPreviousData,
    });
}
