import { z } from "zod";

export const depositSchema = z.object({
  amount: z
    .number()
    .positive("Amount must be positive")
    .max(999999999.99, "Amount exceeds maximum allowed"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
});

export type DepositInput = z.infer<typeof depositSchema>;

export const walletTransactionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  type: z.enum(["DEPOSIT", "WITHDRAWAL", "PURCHASE", "REFUND", "ADJUSTMENT"]).optional(),
});

export type WalletTransactionQuery = z.infer<typeof walletTransactionQuerySchema>;

export const userIdParamSchema = z.object({
  id: z.string().uuid("Invalid user ID format"),
});
