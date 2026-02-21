import type {
    Wallet,
    WalletTransaction,
    PaymentOrder,
    TopUpResponse,
    WalletTransactionFilters,
    PaymentOrderFilters,
    PaginatedResponse,
} from '../types';
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

export const walletApi = {
    getWallet: async (): Promise<Wallet> => {
        const json = await fetchApi<ApiResponse<Wallet>>('/wallet');
        return unwrapData(json);
    },

    getTransactions: async (filters?: WalletTransactionFilters): Promise<PaginatedResponse<WalletTransaction>> => {
        const qs = buildQueryString({
            page: filters?.page,
            limit: filters?.limit,
            type: filters?.type,
        });
        return fetchApi<PaginatedResponse<WalletTransaction>>(`/wallet/transactions${qs}`);
    },
};

export const paymentApi = {
    createTopUp: async (amount: number): Promise<TopUpResponse> => {
        const json = await fetchApi<ApiResponse<TopUpResponse>>('/payment/topup', {
            method: 'POST',
            body: JSON.stringify({ amount }),
        });
        return unwrapData(json);
    },

    getOrders: async (filters?: PaymentOrderFilters): Promise<PaginatedResponse<PaymentOrder>> => {
        const qs = buildQueryString({
            page: filters?.page,
            limit: filters?.limit,
            status: filters?.status,
        });
        return fetchApi<PaginatedResponse<PaymentOrder>>(`/payment/orders${qs}`);
    },

    getOrder: async (id: string): Promise<PaymentOrder> => {
        const json = await fetchApi<ApiResponse<PaymentOrder>>(`/payment/orders/${id}`);
        return unwrapData(json);
    },

    /** Simulate BOG callback to complete/reject a payment (mock mode) */
    simulateBogCallback: async (
        bogOrderId: string,
        amount: number,
        currency: string,
        status: 'completed' | 'rejected'
    ): Promise<void> => {
        await fetchApi('/payment/bog/callback', {
            method: 'POST',
            body: JSON.stringify({
                event: 'order_payment',
                zoned_request_time: new Date().toISOString(),
                body: {
                    order_id: bogOrderId,
                    order_status: {
                        key: status,
                        value: status === 'completed' ? 'Completed' : 'Rejected',
                    },
                    purchase_units: {
                        request_amount: amount.toFixed(2),
                        currency_code: currency,
                    },
                },
            }),
        });
    },
};
