/**
 * Orders Module Zod Schemas
 */

import { z } from 'zod';
import {
  PaginationSchema,
  UUIDSchema,
  DateStringSchema,
} from '@/shared/schemas/common';
import { ORDER_STATUS, PAYMENT_STATUS, PAYMENT_METHODS } from '@/config/constants';

/**
 * Order item input
 */
const OrderItemInputSchema = z.object({
  productId: UUIDSchema,
  quantity: z.number().int().min(1),
});

/**
 * Create order schema
 */
export const CreateOrderSchema = z.object({
  items: z.array(OrderItemInputSchema).min(1).max(100),
  shippingAddress: z.string().max(500).optional(),
  notes: z.string().max(1000).optional(),
  useCredits: z.boolean().default(false),
  paymentMethod: z.nativeEnum(PAYMENT_METHODS).optional(),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

/**
 * Update order status schema
 */
export const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(ORDER_STATUS),
  notes: z.string().max(1000).optional(),
});

export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusSchema>;

/**
 * Order list query parameters
 */
export const OrderListQuerySchema = PaginationSchema.extend({
  userId: UUIDSchema.optional(),
  status: z.nativeEnum(ORDER_STATUS).optional(),
  paymentStatus: z.nativeEnum(PAYMENT_STATUS).optional(),
  fromDate: DateStringSchema.optional(),
  toDate: DateStringSchema.optional(),
});

export type OrderListQueryInput = z.infer<typeof OrderListQuerySchema>;

/**
 * Order ID parameter
 */
export const OrderIdParamSchema = z.object({
  id: UUIDSchema,
});

export type OrderIdParam = z.infer<typeof OrderIdParamSchema>;

/**
 * Calculate price schema
 */
export const CalculatePriceSchema = z.object({
  items: z.array(OrderItemInputSchema).min(1).max(100),
  useCredits: z.boolean().default(false),
});

export type CalculatePriceInput = z.infer<typeof CalculatePriceSchema>;
