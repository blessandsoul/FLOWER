/**
 * Pagination Utilities
 */

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
  page: number;
  limit: number;
}

/**
 * Calculate pagination offset
 *
 * @param page - Current page (1-indexed)
 * @param limit - Items per page
 * @returns Offset for database query
 *
 * @example
 * const offset = calculateOffset(2, 10); // Returns 10
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Calculate total pages
 *
 * @param totalItems - Total count of items
 * @param limit - Items per page
 * @returns Total number of pages
 *
 * @example
 * const totalPages = calculateTotalPages(237, 10); // Returns 24
 */
export function calculateTotalPages(totalItems: number, limit: number): number {
  return Math.ceil(totalItems / limit);
}

/**
 * Validate pagination parameters
 *
 * @param page - Page number
 * @param limit - Items per page
 * @param maxLimit - Maximum allowed limit (default: 100)
 * @returns Validated pagination parameters
 * @throws Error if parameters are invalid
 *
 * @example
 * const { page, limit } = validatePagination(2, 10);
 */
export function validatePagination(
  page: number,
  limit: number,
  maxLimit: number = 100
): PaginationParams {
  if (page < 1) {
    throw new Error('Page must be at least 1');
  }

  if (limit < 1) {
    throw new Error('Limit must be at least 1');
  }

  if (limit > maxLimit) {
    throw new Error(`Limit cannot exceed ${maxLimit}`);
  }

  return { page, limit };
}

/**
 * Check if there is a next page
 *
 * @param page - Current page
 * @param totalPages - Total number of pages
 * @returns True if next page exists
 */
export function hasNextPage(page: number, totalPages: number): boolean {
  return page < totalPages;
}

/**
 * Check if there is a previous page
 *
 * @param page - Current page
 * @returns True if previous page exists
 */
export function hasPreviousPage(page: number): boolean {
  return page > 1;
}
