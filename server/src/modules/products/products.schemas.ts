/**
 * Products Module Zod Schemas
 */

import { z } from 'zod';
import {
  PaginationSchema,
  UUIDSchema,
  DecimalStringSchema,
  PositiveNumberSchema,
  NonNegativeNumberSchema,
  SortOrderSchema,
} from '@/shared/schemas/common';
import { PRODUCT_STATUS, FLOWER_ORIGIN } from '@/config/constants';

/**
 * Create product schema
 */
export const CreateProductSchema = z.object({
  name: z.string().min(1).max(255),
  nameFa: z.string().max(255).optional(),
  description: z.string().max(2000).optional(),
  categoryId: UUIDSchema.optional(),
  origin: z.nativeEnum(FLOWER_ORIGIN),
  stemLengthCm: z.number().int().min(10).max(200),
  stemsPerBunch: z.number().int().min(1).max(100),
  colorGroup: z.string().max(50).optional(),
  imageUrl: z.string().url().optional(),
  priceEur: DecimalStringSchema,
  markupPercentage: z.number().min(0).max(500).optional(),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

/**
 * Update product schema
 */
export const UpdateProductSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  nameFa: z.string().max(255).optional(),
  description: z.string().max(2000).optional(),
  categoryId: UUIDSchema.nullable().optional(),
  origin: z.nativeEnum(FLOWER_ORIGIN).optional(),
  stemLengthCm: z.number().int().min(10).max(200).optional(),
  stemsPerBunch: z.number().int().min(1).max(100).optional(),
  colorGroup: z.string().max(50).optional(),
  imageUrl: z.string().url().nullable().optional(),
  priceEur: DecimalStringSchema.optional(),
  markupPercentage: z.number().min(0).max(500).optional(),
  status: z.nativeEnum(PRODUCT_STATUS).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

/**
 * Product list query parameters
 */
export const ProductListQuerySchema = PaginationSchema.extend({
  categoryId: UUIDSchema.optional(),
  origin: z.nativeEnum(FLOWER_ORIGIN).optional(),
  colorGroup: z.string().max(50).optional(),
  status: z.nativeEnum(PRODUCT_STATUS).optional(),
  isActive: z.coerce.boolean().optional(),
  search: z.string().max(100).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  inStock: z.coerce.boolean().optional(),
  sortBy: z.enum(['name', 'priceEur', 'createdAt', 'availableQty']).optional(),
  sortOrder: SortOrderSchema,
});

export type ProductListQueryInput = z.infer<typeof ProductListQuerySchema>;

/**
 * Product ID parameter
 */
export const ProductIdParamSchema = z.object({
  id: UUIDSchema,
});

export type ProductIdParam = z.infer<typeof ProductIdParamSchema>;

/**
 * Stock adjustment schema
 */
export const StockAdjustmentSchema = z.object({
  quantity: z.number().int(),
  reason: z.string().min(1).max(255),
});

export type StockAdjustmentInput = z.infer<typeof StockAdjustmentSchema>;

/**
 * Bulk stock update schema
 */
export const BulkStockUpdateSchema = z.object({
  items: z.array(
    z.object({
      productId: UUIDSchema,
      quantity: z.number().int().min(0),
    })
  ).min(1).max(100),
});

export type BulkStockUpdateInput = z.infer<typeof BulkStockUpdateSchema>;
