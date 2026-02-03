/**
 * Products Module Types
 */

import type { ProductStatus, FlowerOrigin } from '@/config/constants';

/**
 * Product public response
 */
export interface ProductResponse {
  id: string;
  name: string;
  nameFa: string | null; // Farsi name
  description: string | null;
  categoryId: string | null;
  categoryName: string | null;
  origin: FlowerOrigin;
  stemLengthCm: number;
  stemsPerBunch: number;
  colorGroup: string | null;
  imageUrl: string | null;
  priceEur: string; // Base price in EUR
  priceGel: string; // Customer price in GEL
  availableQty: number; // Actual stock
  displayQty: number; // Visible stock (after visibility %)
  status: ProductStatus;
  isActive: boolean;
  createdAt: string;
}

/**
 * Product list filters
 */
export interface ProductListFilters {
  categoryId?: string;
  origin?: FlowerOrigin;
  colorGroup?: string;
  status?: ProductStatus;
  isActive?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

/**
 * Create product request
 */
export interface CreateProductRequest {
  name: string;
  nameFa?: string;
  description?: string;
  categoryId?: string;
  origin: FlowerOrigin;
  stemLengthCm: number;
  stemsPerBunch: number;
  colorGroup?: string;
  imageUrl?: string;
  priceEur: string;
  markupPercentage?: number;
}

/**
 * Update product request
 */
export interface UpdateProductRequest {
  name?: string;
  nameFa?: string;
  description?: string;
  categoryId?: string;
  origin?: FlowerOrigin;
  stemLengthCm?: number;
  stemsPerBunch?: number;
  colorGroup?: string;
  imageUrl?: string;
  priceEur?: string;
  markupPercentage?: number;
  status?: ProductStatus;
  isActive?: boolean;
}

/**
 * Stock adjustment request
 */
export interface StockAdjustmentRequest {
  productId: string;
  quantity: number; // Positive to add, negative to remove
  reason: string;
}
