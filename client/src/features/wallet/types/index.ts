// === Wallet Types (matching server wallet.types.ts) ===

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'PURCHASE' | 'REFUND' | 'ADJUSTMENT';

export interface Wallet {
    id: string;
    userId: string;
    balance: string;
    currency: string;
    createdAt: string;
    updatedAt: string;
}

export interface WalletTransaction {
    id: string;
    walletId: string;
    type: TransactionType;
    amount: string;
    balanceBefore: string;
    balanceAfter: string;
    description: string | null;
    referenceId: string | null;
    createdById: string | null;
    createdAt: string;
}

// === Payment Types (matching server payment.types.ts) ===

export type PaymentOrderStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';

export interface PaymentOrder {
    id: string;
    userId: string;
    bogOrderId: string | null;
    amount: string;
    currency: string;
    status: PaymentOrderStatus;
    redirectUrl: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface TopUpResponse {
    order: PaymentOrder;
    redirectUrl: string;
}

// === Filter Types ===

export interface WalletTransactionFilters {
    page?: number;
    limit?: number;
    type?: TransactionType;
}

export interface PaymentOrderFilters {
    page?: number;
    limit?: number;
    status?: PaymentOrderStatus;
}

// === API Response Types ===

export interface PaginationMeta {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
    success: boolean;
    message: string;
    data: {
        items: T[];
        pagination: PaginationMeta;
    };
}
