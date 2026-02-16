import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { productsApi } from '../services/products.api';
import type { ProductFilters } from '../types';

export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsApi.getProducts(filters),
    placeholderData: keepPreviousData,
  });
}
