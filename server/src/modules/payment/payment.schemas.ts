import { z } from "zod";

export const topUpSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .min(0.5, "Minimum top-up amount is 0.50")
    .max(50000, "Maximum top-up amount is 50,000"),
});

export type TopUpInput = z.infer<typeof topUpSchema>;

export const paymentOrderQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(["PENDING", "COMPLETED", "FAILED", "REFUNDED"]).optional(),
});

export type PaymentOrderQuery = z.infer<typeof paymentOrderQuerySchema>;

export const paymentOrderIdParamSchema = z.object({
  id: z.string().uuid("Invalid payment order ID format"),
});

// BOG callback body validation (loose — we store raw payload)
export const bogCallbackSchema = z.object({
  event: z.string(),
  zoned_request_time: z.string(),
  body: z.object({
    order_id: z.string(),
    order_status: z.object({
      key: z.string(),
      value: z.string(),
    }),
    purchase_units: z.object({
      request_amount: z.string(),
      transfer_amount: z.string().optional(),
      refund_amount: z.string().optional(),
      currency_code: z.string(),
    }),
  }).passthrough(),
});
