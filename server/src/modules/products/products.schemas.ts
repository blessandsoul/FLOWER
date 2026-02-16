import { z } from "zod";

// ==========================================
// Price Tier Schema
// ==========================================

export const priceTierSchema = z.object({
  minQuantity: z.number().int().positive("Minimum quantity must be positive"),
  price: z.number().positive("Price must be positive"),
});

// ==========================================
// Product Schemas
// ==========================================

export const createProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(500),
  colorId: z.number().int().positive().nullable().optional(),
  growerId: z.number().int().positive().nullable().optional(),
  originId: z.number().int().positive().nullable().optional(),
  stock: z.number().int().nonnegative().default(0),
  orderPer: z.number().int().positive().default(1),
  imageUrl: z.string().url().max(500).nullable().optional(),
  imageFilename: z.string().max(255).nullable().optional(),
  sourceScrapedAt: z.coerce.date().nullable().optional(),
  tagIds: z.array(z.number().int().positive()).optional(),
  priceTiers: z.array(priceTierSchema).optional(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Product name is required").max(500).optional(),
  colorId: z.number().int().positive().nullable().optional(),
  growerId: z.number().int().positive().nullable().optional(),
  originId: z.number().int().positive().nullable().optional(),
  stock: z.number().int().nonnegative().optional(),
  orderPer: z.number().int().positive().optional(),
  imageUrl: z.string().url().max(500).nullable().optional(),
  imageFilename: z.string().max(255).nullable().optional(),
  sourceScrapedAt: z.coerce.date().nullable().optional(),
  tagIds: z.array(z.number().int().positive()).optional(),
  priceTiers: z.array(priceTierSchema).optional(),
});

export const productIdSchema = z.object({
  id: z.coerce.number().int().positive("Product ID must be a positive integer"),
});

// ==========================================
// Filter & Query Schemas
// ==========================================

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  colorId: z.coerce.number().int().positive().optional(),
  growerId: z.coerce.number().int().positive().optional(),
  originId: z.coerce.number().int().positive().optional(),
  tagIds: z
    .string()
    .transform((val) => val.split(",").map(Number).filter((n) => !isNaN(n) && n > 0))
    .optional(),
  inStock: z
    .string()
    .transform((val) => val === "true")
    .optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().positive().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// ==========================================
// Lookup Table Schemas
// ==========================================

export const createColorSchema = z.object({
  name: z.string().min(1, "Color name is required").max(100),
});

export const createGrowerSchema = z.object({
  name: z.string().min(1, "Grower name is required").max(255),
});

export const createOriginSchema = z.object({
  name: z.string().min(1, "Origin name is required").max(255),
});

export const createTagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(100),
  slug: z.string().min(1, "Tag slug is required").max(100).regex(/^[a-z0-9-]+$/, "Slug must be lowercase with hyphens only"),
});

// ==========================================
// Type Exports
// ==========================================

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductFilters = z.infer<typeof productFiltersSchema>;
