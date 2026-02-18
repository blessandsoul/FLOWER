/**
 * Mock BOG (Bank of Georgia) Payment Server
 *
 * Simulates the real BOG API so you can develop and test
 * the full payment flow without merchant credentials.
 *
 * Controlled via BOG_MOCK_ENABLED and BOG_MOCK_PORT in .env
 */

import Fastify from "fastify";
import { v4 as uuid } from "uuid";
import { logger } from "../libs/logger.js";
import { env } from "../config/env.js";

interface MockOrder {
  id: string;
  externalOrderId: string;
  amount: number;
  currency: string;
  callbackUrl: string;
  successRedirect: string;
  failRedirect: string;
  status: "created" | "completed" | "rejected";
}

const orders = new Map<string, MockOrder>();

function buildPaymentPage(order: MockOrder): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BOG Mock Payment</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f0f2f5;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 2px 16px rgba(0,0,0,0.1);
      text-align: center;
    }
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a2e;
      margin-bottom: 8px;
    }
    .mock-badge {
      display: inline-block;
      background: #ff6b35;
      color: white;
      padding: 2px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .amount {
      font-size: 36px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 16px 0;
    }
    .currency { color: #666; font-size: 18px; }
    .details {
      text-align: left;
      background: #f8f9fa;
      border-radius: 8px;
      padding: 16px;
      margin: 20px 0;
      font-size: 13px;
      color: #555;
    }
    .details div { margin-bottom: 6px; }
    .details span { color: #1a1a2e; font-weight: 500; }
    .actions { display: flex; gap: 12px; margin-top: 24px; }
    .btn {
      flex: 1;
      padding: 14px;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn:hover { opacity: 0.85; }
    .btn-pay { background: #00875a; color: white; }
    .btn-decline { background: #de350b; color: white; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">Bank of Georgia</div>
    <div class="mock-badge">MOCK SERVER</div>
    <div class="amount">${order.amount.toFixed(2)} <span class="currency">${order.currency}</span></div>
    <div class="details">
      <div>Order: <span>${order.id.slice(0, 8)}...</span></div>
      <div>Merchant ref: <span>${order.externalOrderId.slice(0, 8)}...</span></div>
    </div>
    <div class="actions">
      <button class="btn btn-pay" onclick="complete('success')">Pay</button>
      <button class="btn btn-decline" onclick="complete('fail')">Decline</button>
    </div>
  </div>
  <script>
    async function complete(result) {
      document.querySelectorAll('.btn').forEach(b => b.disabled = true);
      try {
        await fetch('/mock/complete/${order.id}?result=' + result, { method: 'POST' });
      } catch(e) { console.error(e); }
      const redirect = result === 'success'
        ? '${order.successRedirect}'
        : '${order.failRedirect}';
      window.location.href = redirect;
    }
  </script>
</body>
</html>`;
}

export async function startMockBogServer(): Promise<void> {
  if (!env.BOG_MOCK_ENABLED) return;

  const mock = Fastify({ logger: false });

  // Parse application/x-www-form-urlencoded (used by OAuth2 token endpoint)
  mock.addContentTypeParser(
    "application/x-www-form-urlencoded",
    { parseAs: "string" },
    (_req, body, done) => {
      const parsed: Record<string, string> = {};
      for (const pair of (body as string).split("&")) {
        const [key, value] = pair.split("=");
        if (key) parsed[decodeURIComponent(key)] = decodeURIComponent(value || "");
      }
      done(null, parsed);
    }
  );

  // OAuth2 token endpoint
  mock.post("/oauth2/token", async (_request, reply) => {
    return reply.send({
      access_token: "mock-bog-token-" + uuid(),
      token_type: "Bearer",
      expires_in: 3600,
    });
  });

  // Create order
  mock.post("/payments/v1/ecommerce/orders", async (request, reply) => {
    const body = request.body as {
      callback_url: string;
      external_order_id: string;
      purchase_units: { currency: string; total_amount: number };
      redirect_urls: { success: string; fail: string };
    };

    const orderId = uuid();
    const order: MockOrder = {
      id: orderId,
      externalOrderId: body.external_order_id,
      amount: body.purchase_units.total_amount,
      currency: body.purchase_units.currency || "GEL",
      callbackUrl: body.callback_url,
      successRedirect: body.redirect_urls?.success || "",
      failRedirect: body.redirect_urls?.fail || "",
      status: "created",
    };

    orders.set(orderId, order);

    logger.info(
      { mockOrderId: orderId, amount: order.amount },
      "[BOG Mock] Order created"
    );

    return reply.send({
      id: orderId,
      _links: {
        details: {
          href: `http://localhost:${env.BOG_MOCK_PORT}/payments/v1/receipt/${orderId}`,
        },
        redirect: {
          href: `http://localhost:${env.BOG_MOCK_PORT}/pay?order_id=${orderId}`,
        },
      },
    });
  });

  // Payment page (user sees this)
  mock.get("/pay", async (request, reply) => {
    const { order_id } = request.query as { order_id: string };
    const order = orders.get(order_id);

    if (!order) {
      return reply.status(404).send("Order not found");
    }

    return reply.type("text/html").send(buildPaymentPage(order));
  });

  // Complete payment (called by the payment page buttons)
  mock.post("/mock/complete/:orderId", async (request, reply) => {
    const { orderId } = request.params as { orderId: string };
    const { result } = request.query as { result: string };
    const order = orders.get(orderId);

    if (!order) {
      return reply.status(404).send({ error: "Order not found" });
    }

    order.status = result === "success" ? "completed" : "rejected";

    // Send callback to the real server (same as real BOG would)
    const callbackPayload = {
      event: "order_payment",
      zoned_request_time: new Date().toISOString(),
      body: {
        order_id: order.id,
        order_status: {
          key: order.status,
          value: order.status === "completed" ? "Completed" : "Rejected",
        },
        purchase_units: {
          request_amount: order.amount.toString(),
          transfer_amount: order.status === "completed" ? order.amount.toString() : "0",
          refund_amount: "0",
          currency_code: order.currency,
        },
      },
    };

    try {
      await fetch(order.callbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(callbackPayload),
      });
      logger.info(
        { mockOrderId: orderId, status: order.status },
        "[BOG Mock] Callback sent"
      );
    } catch (err) {
      logger.error(
        { err, callbackUrl: order.callbackUrl },
        "[BOG Mock] Failed to send callback"
      );
    }

    return reply.send({ ok: true });
  });

  // Get payment details (receipt)
  mock.get("/payments/v1/receipt/:orderId", async (request, reply) => {
    const { orderId } = request.params as { orderId: string };
    const order = orders.get(orderId);

    if (!order) {
      return reply.status(404).send({ error: "Order not found" });
    }

    return reply.send({
      order_id: order.id,
      order_status: {
        key: order.status,
        value: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      },
      purchase_units: {
        request_amount: order.amount.toString(),
        transfer_amount: order.status === "completed" ? order.amount.toString() : "0",
        refund_amount: "0",
        currency_code: order.currency,
      },
      payment_detail: {
        transfer_method: { key: "card", value: "Card" },
        transaction_id: "mock-tx-" + orderId.slice(0, 8),
        card_type: "visa",
      },
    });
  });

  // Refund
  mock.post("/payments/v1/payment/refund/:orderId", async (request, reply) => {
    const { orderId } = request.params as { orderId: string };
    const order = orders.get(orderId);

    if (!order) {
      return reply.status(404).send({ error: "Order not found" });
    }

    order.status = "rejected"; // simplified

    logger.info({ mockOrderId: orderId }, "[BOG Mock] Refund processed");

    return reply.send({
      key: "request_received",
      message: "Refund request received",
      action_id: uuid(),
    });
  });

  await mock.listen({ port: env.BOG_MOCK_PORT, host: "0.0.0.0" });
  logger.info(
    `[BOG Mock] Payment server running on http://localhost:${env.BOG_MOCK_PORT}`
  );
  logger.info(
    `[BOG Mock] Payment page: http://localhost:${env.BOG_MOCK_PORT}/pay?order_id=<id>`
  );
}
