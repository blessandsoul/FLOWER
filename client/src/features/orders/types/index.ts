export type OrderStatus = 'PENDING' | 'APPROVED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface OrderItem {
    id: string;
    orderId: string;
    productId: number;
    productName: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
}

export interface Order {
    id: string;
    userId: string;
    orderNumber: string;
    status: OrderStatus;
    subtotal: string;
    serviceFee: string;
    totalAmount: string;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    items: OrderItem[];
}

export interface OrderWithUser extends Order {
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export interface PlaceOrderInput {
    items: { productId: number; quantity: number }[];
    notes?: string;
}

export interface OrderFilters {
    page?: number;
    limit?: number;
    status?: OrderStatus;
}

export type SortableOrderColumn = 'createdAt' | 'totalAmount' | 'orderNumber' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface AdminOrderFilters {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    search?: string;
    minTotal?: number;
    maxTotal?: number;
    dateFrom?: string;
    dateTo?: string;
    sortBy?: SortableOrderColumn;
    sortOrder?: SortOrder;
}

export type { PaginatedResponse } from '@/features/wallet/types';
