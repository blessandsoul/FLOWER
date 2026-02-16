import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../services/products.api';

export function useProduct(id: string | number) {
  return useQuery({
    queryKey: ['product', String(id)],
    queryFn: () => productsApi.getProduct(id),
    enabled: !!id,
  });
}
