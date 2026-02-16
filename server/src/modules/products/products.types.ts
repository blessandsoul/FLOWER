import type { Decimal } from "@prisma/client/runtime/library";

// ==========================================
// Price Tier Types
// ==========================================

export interface PriceTierInput {
  minQuantity: number;
  price: number;
}

export interface PriceTier {
  id: number;
  minQuantity: number;
  price: number;
}

// ==========================================
// Lookup Table Types
// ==========================================

export interface Color {
  id: number;
  name: string;
  createdAt: Date;
}

export interface Grower {
  id: number;
  name: string;
  createdAt: Date;
}

export interface Origin {
  id: number;
  name: string;
  createdAt: Date;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
}

// ==========================================
// Product Types
// ==========================================

export interface ProductBase {
  id: number;
  name: string;
  stock: number;
  orderPer: number;
  imageUrl: string | null;
  imageFilename: string | null;
  sourceScrapedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product extends ProductBase {
  colorId: number | null;
  growerId: number | null;
  originId: number | null;
}

export interface ProductWithRelations extends ProductBase {
  color: { id: number; name: string } | null;
  grower: { id: number; name: string } | null;
  origin: { id: number; name: string } | null;
  tags: { id: number; name: string; slug: string }[];
  priceTiers: PriceTier[];
}

// ==========================================
// Input Types
// ==========================================

export interface CreateProductInput {
  name: string;
  colorId?: number | null;
  growerId?: number | null;
  originId?: number | null;
  stock?: number;
  orderPer?: number;
  imageUrl?: string | null;
  imageFilename?: string | null;
  sourceScrapedAt?: Date | null;
  tagIds?: number[];
  priceTiers?: PriceTierInput[];
}

export interface UpdateProductInput {
  name?: string;
  colorId?: number | null;
  growerId?: number | null;
  originId?: number | null;
  stock?: number;
  orderPer?: number;
  imageUrl?: string | null;
  imageFilename?: string | null;
  sourceScrapedAt?: Date | null;
  tagIds?: number[];
  priceTiers?: PriceTierInput[];
}

// ==========================================
// Filter Types
// ==========================================

export interface ProductFilters {
  search?: string;
  colorId?: number;
  growerId?: number;
  originId?: number;
  tagIds?: number[];
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

// ==========================================
// API Response Types
// ==========================================

export interface ProductListItem {
  id: number;
  name: string;
  color: string | null;
  grower: string | null;
  origin: string | null;
  stock: number;
  orderPer: number;
  imageUrl: string | null;
  imageFilename: string | null;
  tags: string[];
  priceFrom: number | null;
  priceTiers: PriceTier[];
}

export interface ProductImageItem {
  id: number;
  imageUrl: string | null;
  imageFilename: string | null;
  displayOrder: number;
}

export interface ProductDetail extends ProductListItem {
  imageUrl: string | null;
  sourceScrapedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  images: ProductImageItem[];
}

// ==========================================
// Helper to convert Decimal to number
// ==========================================

export function decimalToNumber(decimal: Decimal | null): number | null {
  if (decimal === null) return null;
  return Number(decimal);
}
