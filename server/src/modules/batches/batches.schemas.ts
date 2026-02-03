/**
 * Batches Module Zod Schemas
 */

import { z } from 'zod';
import {
  PaginationSchema,
  UUIDSchema,
  DecimalStringSchema,
  DateStringSchema,
} from '@/shared/schemas/common';
import { BATCH_STATUS, FLOWER_ORIGIN } from '@/config/constants';

/**
 * Batch item input schema
 */
const BatchItemInputSchema = z.object({
  productId: UUIDSchema,
  quantityOrdered: z.number().int().min(1),
  unitCostEur: DecimalStringSchema,
});

/**
 * Create batch schema
 */
export const CreateBatchSchema = z.object({
  batchNumber: z.string().min(1).max(50),
  origin: z.nativeEnum(FLOWER_ORIGIN),
  supplier: z.string().max(255).optional(),
  expectedArrivalDate: DateStringSchema,
  notes: z.string().max(2000).optional(),
  items: z.array(BatchItemInputSchema).min(1).max(500),
});

export type CreateBatchInput = z.infer<typeof CreateBatchSchema>;

/**
 * Update batch schema
 */
export const UpdateBatchSchema = z.object({
  supplier: z.string().max(255).optional(),
  expectedArrivalDate: DateStringSchema.optional(),
  actualArrivalDate: DateStringSchema.optional(),
  status: z.nativeEnum(BATCH_STATUS).optional(),
  notes: z.string().max(2000).optional(),
});

export type UpdateBatchInput = z.infer<typeof UpdateBatchSchema>;

/**
 * Receive batch items schema
 */
export const ReceiveBatchItemsSchema = z.object({
  items: z.array(
    z.object({
      batchItemId: UUIDSchema,
      quantityReceived: z.number().int().min(0),
    })
  ).min(1),
});

export type ReceiveBatchItemsInput = z.infer<typeof ReceiveBatchItemsSchema>;

/**
 * Batch list query parameters
 */
export const BatchListQuerySchema = PaginationSchema.extend({
  origin: z.nativeEnum(FLOWER_ORIGIN).optional(),
  status: z.nativeEnum(BATCH_STATUS).optional(),
  fromDate: DateStringSchema.optional(),
  toDate: DateStringSchema.optional(),
});

export type BatchListQueryInput = z.infer<typeof BatchListQuerySchema>;

/**
 * Batch ID parameter
 */
export const BatchIdParamSchema = z.object({
  id: UUIDSchema,
});

export type BatchIdParam = z.infer<typeof BatchIdParamSchema>;
