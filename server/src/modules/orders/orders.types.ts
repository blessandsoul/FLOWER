/**
 * Orders Module Types
 */

import type { OrderStatus, PaymentStatus, PaymentMethod } from '@/config/constants';

/**
 * Order item response
 */
export interface OrderItemResponse {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPriceGel: string;
  totalPriceGel: string;
}

/**
 * Order response
 */
export interface OrderResponse {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  userName: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod | null;
  subtotalGel: string;
  discountGel: string;
  creditsUsedGel: string;
  totalGel: string;
  shippingAddress: string | null;
  notes: string | null;
  items: OrderItemResponse[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Order summary (for lists)
 */
export interface OrderSummary {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalGel: string;
  itemCount: number;
  createdAt: string;
}

/**
 * Create order request
 */
export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
  }[];
  shippingAddress?: string;
  notes?: string;
  useCredits?: boolean;
  paymentMethod?: PaymentMethod;
}

/**
 * Order list filters
 */
export interface OrderListFilters {
  userId?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  fromDate?: string;
  toDate?: string;
}

/**
 * Update order status request
 */
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
  notes?: string;
}

/**
 * Order price calculation result
 */
export interface OrderPriceCalculation {
  subtotalGel: string;
  discountGel: string;
  discountPercentage: number;
  creditsAvailable: string;
  creditsToUse: string;
  totalGel: string;
}
