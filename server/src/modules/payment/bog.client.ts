import { env } from "../../config/env.js";
import { logger } from "../../libs/logger.js";
import type {
  BogTokenResponse,
  BogCreateOrderRequest,
  BogCreateOrderResponse,
  BogPaymentDetails,
  BogRefundResponse,
} from "./payment.types.js";

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid (with 30s buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 30000) {
    return cachedToken;
  }

  const credentials = Buffer.from(
    `${env.BOG_CLIENT_ID}:${env.BOG_SECRET_KEY}`
  ).toString("base64");

  const response = await fetch(`${env.BOG_BASE_URL}/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const text = await response.text();
    logger.error({ status: response.status, body: text }, "BOG auth failed");
    throw new Error(`BOG authentication failed: ${response.status}`);
  }

  const data = (await response.json()) as BogTokenResponse;
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;

  return cachedToken;
}

export async function createOrder(
  externalOrderId: string,
  amount: number,
  currency: string
): Promise<BogCreateOrderResponse> {
  const token = await getAccessToken();

  const body: BogCreateOrderRequest = {
    callback_url: env.BOG_CALLBACK_URL,
    external_order_id: externalOrderId,
    purchase_units: {
      currency,
      total_amount: amount,
      basket: [
        {
          product_id: "wallet-topup",
          quantity: 1,
          unit_price: amount,
          description: "Wallet top-up",
        },
      ],
    },
    redirect_urls: {
      success: env.BOG_SUCCESS_REDIRECT_URL,
      fail: env.BOG_FAIL_REDIRECT_URL,
    },
  };

  const response = await fetch(
    `${env.BOG_BASE_URL}/payments/v1/ecommerce/orders`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    logger.error(
      { status: response.status, body: text },
      "BOG create order failed"
    );
    throw new Error(`BOG create order failed: ${response.status}`);
  }

  return (await response.json()) as BogCreateOrderResponse;
}

export async function getPaymentDetails(
  orderId: string
): Promise<BogPaymentDetails> {
  const token = await getAccessToken();

  const response = await fetch(
    `${env.BOG_BASE_URL}/payments/v1/receipt/${orderId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const text = await response.text();
    logger.error(
      { status: response.status, body: text },
      "BOG get payment details failed"
    );
    throw new Error(`BOG get payment details failed: ${response.status}`);
  }

  return (await response.json()) as BogPaymentDetails;
}

export async function refundPayment(
  orderId: string,
  amount?: number
): Promise<BogRefundResponse> {
  const token = await getAccessToken();

  const response = await fetch(
    `${env.BOG_BASE_URL}/payments/v1/payment/refund/${orderId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: amount !== undefined ? JSON.stringify({ amount }) : "{}",
    }
  );

  if (!response.ok) {
    const text = await response.text();
    logger.error(
      { status: response.status, body: text },
      "BOG refund failed"
    );
    throw new Error(`BOG refund failed: ${response.status}`);
  }

  return (await response.json()) as BogRefundResponse;
}
