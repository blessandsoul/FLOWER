import { z } from "zod";

export const placeOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.number().int().positive("Product ID must be positive"),
        quantity: z.number().int().positive("Quantity must be positive"),
      })
    )
    .min(1, "At least one item is required"),
  notes: z
    .string()
    .max(500, "Notes must be 500 characters or less")
    .optional(),
});

export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;

export const orderIdParamSchema = z.object({
  id: z.string().uuid("Invalid order ID format"),
});

export const orderListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z
    .enum(["PENDING", "APPROVED", "SHIPPED", "DELIVERED", "CANCELLED"])
    .optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["APPROVED", "SHIPPED", "DELIVERED", "CANCELLED"]),
});
