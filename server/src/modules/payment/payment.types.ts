import type { PaymentOrderStatus } from "@prisma/client";

export type { PaymentOrderStatus } from "@prisma/client";

export interface PaymentOrder {
  id: string;
  userId: string;
  bogOrderId: string | null;
  amount: string; // Decimal as string for precision
  currency: string;
  status: PaymentOrderStatus;
  redirectUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// BOG API types

export interface BogTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface BogCreateOrderRequest {
  callback_url: string;
  external_order_id: string;
  purchase_units: {
    currency: string;
    total_amount: number;
    basket: Array<{
      product_id: string;
      quantity: number;
      unit_price: number;
      description?: string;
    }>;
  };
  redirect_urls: {
    success: string;
    fail: string;
  };
}

export interface BogCreateOrderResponse {
  id: string;
  _links: {
    details: { href: string };
    redirect: { href: string };
  };
}

export interface BogPaymentDetails {
  order_id: string;
  order_status: {
    key: string;
    value: string;
  };
  purchase_units: {
    request_amount: string;
    transfer_amount: string;
    refund_amount: string;
    currency_code: string;
  };
  payment_detail?: {
    transfer_method?: { key: string; value: string };
    transaction_id?: string;
    card_type?: string;
  };
}

export interface BogCallbackPayload {
  event: string;
  zoned_request_time: string;
  body: BogPaymentDetails;
}

export interface BogRefundResponse {
  key: string;
  message: string;
  action_id: string;
}
