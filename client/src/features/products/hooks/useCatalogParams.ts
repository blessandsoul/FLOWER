'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export interface CatalogParams {
  page: number;
  search: string;
  limit: number;
  colorId?: number;
  growerId?: number;
  originId?: number;
  tagIds?: number[];
  inStock?: boolean;
  minPrice?: number;
  maxPrice?: number;
}

const DEFAULT_LIMIT = 20;

function parseIntOrUndefined(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
}

function parseFloatOrUndefined(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? undefined : parsed;
}

function parseBooleanOrUndefined(value: string | null): boolean | undefined {
  if (value === 'true') return true;
  if (value === 'false') return false;
  return undefined;
}

function parseTagIds(value: string | null): number[] | undefined {
  if (!value) return undefined;
  const ids = value.split(',').map(Number).filter((n) => !isNaN(n) && n > 0);
  return ids.length > 0 ? ids : undefined;
}

export function useCatalogParams() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const params: CatalogParams = useMemo(() => {
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    return {
      page: Math.max(1, parseInt(pageParam || '1', 10) || 1),
      search: searchParams.get('search') || '',
      limit: Math.min(100, Math.max(1, parseInt(limitParam || String(DEFAULT_LIMIT), 10) || DEFAULT_LIMIT)),
      colorId: parseIntOrUndefined(searchParams.get('colorId')),
      growerId: parseIntOrUndefined(searchParams.get('growerId')),
      originId: parseIntOrUndefined(searchParams.get('originId')),
      tagIds: parseTagIds(searchParams.get('tagIds')),
      inStock: parseBooleanOrUndefined(searchParams.get('inStock')),
      minPrice: parseFloatOrUndefined(searchParams.get('minPrice')),
      maxPrice: parseFloatOrUndefined(searchParams.get('maxPrice')),
    };
  }, [searchParams]);

  const setParams = useCallback((updates: Partial<CatalogParams>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    let shouldResetPage = false;

    // Handle page
    if (updates.page !== undefined) {
      if (updates.page <= 1) {
        newParams.delete('page');
      } else {
        newParams.set('page', String(updates.page));
      }
    }

    // Handle search
    if (updates.search !== undefined) {
      if (updates.search === '') {
        newParams.delete('search');
      } else {
        newParams.set('search', updates.search);
      }
      shouldResetPage = true;
    }

    // Handle limit
    if (updates.limit !== undefined) {
      if (updates.limit === DEFAULT_LIMIT) {
        newParams.delete('limit');
      } else {
        newParams.set('limit', String(Math.min(100, Math.max(1, updates.limit))));
      }
    }

    // Handle colorId
    if ('colorId' in updates) {
      if (updates.colorId === undefined) {
        newParams.delete('colorId');
      } else {
        newParams.set('colorId', String(updates.colorId));
      }
      shouldResetPage = true;
    }

    // Handle growerId
    if ('growerId' in updates) {
      if (updates.growerId === undefined) {
        newParams.delete('growerId');
      } else {
        newParams.set('growerId', String(updates.growerId));
      }
      shouldResetPage = true;
    }

    // Handle originId
    if ('originId' in updates) {
      if (updates.originId === undefined) {
        newParams.delete('originId');
      } else {
        newParams.set('originId', String(updates.originId));
      }
      shouldResetPage = true;
    }

    // Handle tagIds
    if ('tagIds' in updates) {
      if (!updates.tagIds || updates.tagIds.length === 0) {
        newParams.delete('tagIds');
      } else {
        newParams.set('tagIds', updates.tagIds.join(','));
      }
      shouldResetPage = true;
    }

    // Handle inStock
    if ('inStock' in updates) {
      if (updates.inStock === undefined) {
        newParams.delete('inStock');
      } else {
        newParams.set('inStock', String(updates.inStock));
      }
      shouldResetPage = true;
    }

    // Handle minPrice
    if ('minPrice' in updates) {
      if (updates.minPrice === undefined) {
        newParams.delete('minPrice');
      } else {
        newParams.set('minPrice', String(updates.minPrice));
      }
      shouldResetPage = true;
    }

    // Handle maxPrice
    if ('maxPrice' in updates) {
      if (updates.maxPrice === undefined) {
        newParams.delete('maxPrice');
      } else {
        newParams.set('maxPrice', String(updates.maxPrice));
      }
      shouldResetPage = true;
    }

    // Reset page when filters change
    if (shouldResetPage && updates.page === undefined) {
      newParams.delete('page');
    }

    const queryString = newParams.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
  }, [searchParams, router, pathname]);

  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  const hasActiveFilters = useMemo(() => {
    return !!(
      params.search ||
      params.colorId !== undefined ||
      params.growerId !== undefined ||
      params.originId !== undefined ||
      (params.tagIds && params.tagIds.length > 0) ||
      params.inStock !== undefined ||
      params.minPrice !== undefined ||
      params.maxPrice !== undefined
    );
  }, [params]);

  return { params, setParams, clearFilters, hasActiveFilters };
}
