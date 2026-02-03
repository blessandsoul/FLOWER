/**
 * Common Zod Schemas
 * Shared validation schemas used across modules
 */

import { z } from 'zod';

/**
 * Pagination Schema
 * Validates page and limit query parameters
 *
 * @example
 * const { page, limit } = PaginationSchema.parse(request.query);
 */
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationParams = z.infer<typeof PaginationSchema>;

/**
 * UUID Schema
 * Validates UUID v4 strings
 *
 * @example
 * const id = UUIDSchema.parse(request.params.id);
 */
export const UUIDSchema = z.string().uuid();

/**
 * Email Schema
 * Validates email addresses
 *
 * @example
 * const email = EmailSchema.parse(input.email);
 */
export const EmailSchema = z.string().email().max(255);

/**
 * Password Schema
 * Validates password strength (min 8 chars)
 *
 * @example
 * const password = PasswordSchema.parse(input.password);
 */
export const PasswordSchema = z.string().min(8).max(100);

/**
 * Decimal String Schema
 * Validates decimal numbers as strings (for Prisma Decimal)
 *
 * @example
 * const price = DecimalStringSchema.parse(input.price);
 */
export const DecimalStringSchema = z.string().regex(/^\d+(\.\d{1,2})?$/);

/**
 * Positive Number Schema
 * Validates positive numbers
 */
export const PositiveNumberSchema = z.number().positive();

/**
 * Non-Negative Number Schema
 * Validates non-negative numbers (>= 0)
 */
export const NonNegativeNumberSchema = z.number().min(0);

/**
 * Date String Schema (ISO 8601)
 * Validates ISO date strings
 *
 * @example
 * const date = DateStringSchema.parse(input.date);
 */
export const DateStringSchema = z.string().datetime();

/**
 * Sort Order Schema
 * Validates sort order (asc/desc)
 */
export const SortOrderSchema = z.enum(['asc', 'desc']).default('desc');

/**
 * Boolean from String Schema
 * Coerces string 'true'/'false' to boolean
 *
 * @example
 * const isActive = BooleanFromStringSchema.parse(request.query.isActive);
 */
export const BooleanFromStringSchema = z
  .string()
  .transform((val) => val === 'true')
  .pipe(z.boolean());
