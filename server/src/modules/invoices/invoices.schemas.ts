/**
 * Invoices Module Zod Schemas
 */

import { z } from 'zod';
import {
  PaginationSchema,
  UUIDSchema,
  DateStringSchema,
} from '@/shared/schemas/common';
import { INVOICE_STATUS } from '@/config/constants';

/**
 * Invoice ID parameter
 */
export const InvoiceIdParamSchema = z.object({
  id: UUIDSchema,
});

export type InvoiceIdParam = z.infer<typeof InvoiceIdParamSchema>;

/**
 * Order ID parameter (for getting invoice by order)
 */
export const OrderIdParamSchema = z.object({
  orderId: UUIDSchema,
});

export type OrderIdParam = z.infer<typeof OrderIdParamSchema>;

/**
 * Invoice list query parameters
 */
export const InvoiceListQuerySchema = PaginationSchema.extend({
  userId: UUIDSchema.optional(),
  status: z.nativeEnum(INVOICE_STATUS).optional(),
  fromDate: DateStringSchema.optional(),
  toDate: DateStringSchema.optional(),
});

export type InvoiceListQueryInput = z.infer<typeof InvoiceListQuerySchema>;
