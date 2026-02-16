/**
 * Products API Service
 * Connects to the server products API
 */

import type {
  ServerProduct,
  ServerProductDetail,
  PaginatedResponse,
  SingleResponse,
  ProductFilters,
  LookupItem,
} from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const filtered = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

  return filtered.length > 0 ? `?${filtered.join('&')}` : '';
}

export const productsApi = {
  /**
   * Get paginated list of products with optional filters
   */
  getProducts: async (filters?: ProductFilters): Promise<PaginatedResponse<ServerProduct>> => {
    const queryString = buildQueryString({
      search: filters?.search,
      page: filters?.page,
      limit: filters?.limit,
      colorId: filters?.colorId,
      growerId: filters?.growerId,
      originId: filters?.originId,
      tagIds: filters?.tagIds,
      inStock: filters?.inStock,
      minPrice: filters?.minPrice,
      maxPrice: filters?.maxPrice,
    });

    return fetchApi<PaginatedResponse<ServerProduct>>(`/products${queryString}`);
  },

  /**
   * Get a single product by ID
   */
  getProduct: async (id: string | number): Promise<SingleResponse<ServerProductDetail>> => {
    return fetchApi<SingleResponse<ServerProductDetail>>(`/products/${id}`);
  },

  /**
   * Get all available colors
   */
  getColors: async (): Promise<SingleResponse<LookupItem[]>> => {
    return fetchApi<SingleResponse<LookupItem[]>>('/colors');
  },

  /**
   * Get all available growers
   */
  getGrowers: async (): Promise<SingleResponse<LookupItem[]>> => {
    return fetchApi<SingleResponse<LookupItem[]>>('/growers');
  },

  /**
   * Get all available origins
   */
  getOrigins: async (): Promise<SingleResponse<LookupItem[]>> => {
    return fetchApi<SingleResponse<LookupItem[]>>('/origins');
  },

  /**
   * Get all available tags
   */
  getTags: async (): Promise<SingleResponse<LookupItem[]>> => {
    return fetchApi<SingleResponse<LookupItem[]>>('/tags');
  },
};
