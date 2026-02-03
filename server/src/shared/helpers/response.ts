/**
 * Unified Response Helpers
 * All API responses use these helpers for consistency
 */

/**
 * Success Response Structure
 */
export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

/**
 * Pagination Metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated Data Structure
 */
export interface PaginatedData<T> {
  items: T[];
  pagination: PaginationMeta;
}

/**
 * Success response helper
 *
 * @param message - Human-readable success message
 * @param data - Response data (object, array, or null)
 * @returns Unified success response
 *
 * @example
 * return reply.send(successResponse('Product created successfully', product));
 */
export function successResponse<T>(
  message: string,
  data: T
): SuccessResponse<T> {
  return {
    success: true,
    message,
    data,
  };
}

/**
 * Paginated response helper
 *
 * @param message - Human-readable success message
 * @param items - Array of items for current page
 * @param page - Current page number (1-indexed)
 * @param limit - Items per page
 * @param totalItems - Total count across all pages
 * @returns Unified paginated response
 *
 * @example
 * return reply.send(
 *   paginatedResponse('Products retrieved', products, 2, 10, 237)
 * );
 */
export function paginatedResponse<T>(
  message: string,
  items: T[],
  page: number,
  limit: number,
  totalItems: number
): SuccessResponse<PaginatedData<T>> {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    success: true,
    message,
    data: {
      items,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    },
  };
}
