import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../services/products.api';

export function useColors() {
  return useQuery({
    queryKey: ['colors'],
    queryFn: () => productsApi.getColors(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGrowers() {
  return useQuery({
    queryKey: ['growers'],
    queryFn: () => productsApi.getGrowers(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useOrigins() {
  return useQuery({
    queryKey: ['origins'],
    queryFn: () => productsApi.getOrigins(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => productsApi.getTags(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useFilterOptions() {
  const colors = useColors();
  const growers = useGrowers();
  const origins = useOrigins();
  const tags = useTags();

  return {
    colors: colors.data?.data ?? [],
    growers: growers.data?.data ?? [],
    origins: origins.data?.data ?? [],
    tags: tags.data?.data ?? [],
    isLoading: colors.isLoading || growers.isLoading || origins.isLoading || tags.isLoading,
  };
}
