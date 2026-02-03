/**
 * Credits Module Zod Schemas
 */

import { z } from 'zod';
import {
  PaginationSchema,
  UUIDSchema,
  DecimalStringSchema,
  DateStringSchema,
} from '@/shared/schemas/common';
import { TRANSACTION_TYPES } from '@/config/constants';

/**
 * Add credits schema (admin)
 */
export const AddCreditsSchema = z.object({
  userId: UUIDSchema,
  amount: DecimalStringSchema,
  description: z.string().max(500).optional(),
});

export type AddCreditsInput = z.infer<typeof AddCreditsSchema>;

/**
 * Credit transaction list query
 */
export const CreditTransactionListQuerySchema = PaginationSchema.extend({
  userId: UUIDSchema.optional(),
  type: z.nativeEnum(TRANSACTION_TYPES).optional(),
  fromDate: DateStringSchema.optional(),
  toDate: DateStringSchema.optional(),
});

export type CreditTransactionListQueryInput = z.infer<typeof CreditTransactionListQuerySchema>;

/**
 * User ID parameter
 */
export const UserIdParamSchema = z.object({
  userId: UUIDSchema,
});

export type UserIdParam = z.infer<typeof UserIdParamSchema>;
