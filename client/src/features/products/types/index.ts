/**
 * Server Product Types
 * These types match the API response from the server
 */

export interface ServerPriceTier {
  id: number;
  minQuantity: number;
  price: number;
}

export interface ServerProduct {
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
  priceTiers: ServerPriceTier[];
}

export interface ServerProductImage {
  id: number;
  imageUrl: string | null;
  imageFilename: string | null;
  displayOrder: number;
}

export interface ServerProductDetail extends ServerProduct {
  imageUrl: string | null;
  sourceScrapedAt: string | null;
  createdAt: string;
  updatedAt: string;
  images: ServerProductImage[];
}

export interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    pagination: PaginationInfo;
  };
}

export interface SingleResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProductFilters {
  search?: string;
  page?: number;
  limit?: number;
  colorId?: number;
  growerId?: number;
  originId?: number;
  tagIds?: string;
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

export interface LookupItem {
  id: number;
  name: string;
}
