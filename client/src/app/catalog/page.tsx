'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, Loader2, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useProducts, useCatalogParams } from '@/features/products/hooks';
import { ProductFilters } from '@/features/products/components';
import { mapServerProductsToClient } from '@/features/products/utils/productMapper';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

function CatalogContent() {
  const { params, setParams, clearFilters, hasActiveFilters } = useCatalogParams();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { data, isLoading, isError, isFetching } = useProducts({
    page: params.page,
    limit: params.limit,
    search: params.search || undefined,
    colorId: params.colorId,
    growerId: params.growerId,
    originId: params.originId,
    tagIds: params.tagIds?.join(','),
    inStock: params.inStock,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
  });

  const products = useMemo(() => {
    if (!data?.data?.items) return [];
    return mapServerProductsToClient(data.data.items);
  }, [data?.data?.items]);

  const pagination = data?.data?.pagination;

  const handleSearchChange = useDebouncedCallback((value: string) => {
    setParams({ search: value });
  }, 300);

  const handlePageChange = useCallback(
    (page: number) => {
      setParams({ page });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [setParams]
  );

  return (
    <div className="container py-6 px-4 md:px-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-5 gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">კატალოგი</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            შემდეგი ტრანსპორტირება{' '}
            <span className="text-primary font-semibold">2 დღეში</span>
          </p>
        </div>

        {/* Mobile: search + filter button (hidden on desktop — search is in sidebar) */}
        <div className="flex w-full sm:w-auto lg:hidden gap-2">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="მოძებნეთ ყვავილები..."
              className="pl-9 h-9 bg-white text-sm"
              defaultValue={params.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltersOpen(true)}
            className="relative gap-1.5 h-9 px-3"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="text-sm">ფილტრები</span>
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
            )}
          </Button>
        </div>
      </div>

      {/* Active filter chips (mobile/tablet only — desktop has sidebar) */}
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 flex-wrap mb-4 lg:hidden">
          {params.colorId && (
            <Badge variant="secondary" className="gap-1 text-xs h-6">
              ფერი
              <X className="h-3 w-3 cursor-pointer" onClick={() => setParams({ colorId: undefined })} />
            </Badge>
          )}
          {params.growerId && (
            <Badge variant="secondary" className="gap-1 text-xs h-6">
              მწარმოებელი
              <X className="h-3 w-3 cursor-pointer" onClick={() => setParams({ growerId: undefined })} />
            </Badge>
          )}
          {params.originId && (
            <Badge variant="secondary" className="gap-1 text-xs h-6">
              წარმოშობა
              <X className="h-3 w-3 cursor-pointer" onClick={() => setParams({ originId: undefined })} />
            </Badge>
          )}
          {params.tagIds && params.tagIds.length > 0 && (
            <Badge variant="secondary" className="gap-1 text-xs h-6">
              {params.tagIds.length} ტეგი
              <X className="h-3 w-3 cursor-pointer" onClick={() => setParams({ tagIds: undefined })} />
            </Badge>
          )}
          {params.inStock !== undefined && (
            <Badge variant="secondary" className="gap-1 text-xs h-6">
              {params.inStock ? 'მარაგშია' : 'არ არის'}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setParams({ inStock: undefined })} />
            </Badge>
          )}
          {(params.minPrice !== undefined || params.maxPrice !== undefined) && (
            <Badge variant="secondary" className="gap-1 text-xs h-6">
              {params.minPrice ?? 0}₾–{params.maxPrice ?? '∞'}₾
              <X className="h-3 w-3 cursor-pointer" onClick={() => setParams({ minPrice: undefined, maxPrice: undefined })} />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-[11px] text-muted-foreground px-2"
            onClick={clearFilters}
          >
            გასუფთავება
          </Button>
        </div>
      )}

      <Separator className="mb-5" />

      {/* Main layout: sidebar + content */}
      <div className="flex gap-6">
        {/* Sidebar filter (rendered inline on desktop) */}
        <ProductFilters
          open={filtersOpen}
          onOpenChange={setFiltersOpen}
          params={params}
          onApplyFilters={setParams}
          onClearFilters={clearFilters}
        />

        {/* Product content area */}
        <div className="flex-1 min-w-0">
          {/* Fetching indicator */}
          {isFetching && !isLoading && (
            <div className="flex justify-center mb-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          )}

          {/* Loading skeleton */}
          {isLoading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-7 w-full" />
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {isError && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-3">
                <Loader2 className="h-8 w-8 text-red-400" />
              </div>
              <h3 className="text-sm font-semibold text-red-600">ჩატვირთვა ვერ მოხერხდა</h3>
              <p className="text-xs text-muted-foreground mt-1">გთხოვთ, სცადოთ მოგვიანებით.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => window.location.reload()}>
                თავიდან ცდა
              </Button>
            </div>
          )}

          {/* Product grid */}
          {!isLoading && !isError && (
            <>
              {/* Results count */}
              {pagination && (
                <p className="text-xs text-muted-foreground mb-3">
                  {pagination.totalItems} პროდუქტი
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Empty state */}
              {products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-3 text-3xl">
                    {params.search || hasActiveFilters ? '🥀' : '🌱'}
                  </div>
                  <h3 className="text-sm font-semibold">
                    {params.search || hasActiveFilters ? 'შედეგები არ მოიძებნა' : 'კატალოგი ცარიელია'}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {params.search || hasActiveFilters
                      ? 'სცადეთ სხვა ფილტრები ან საძიებო სიტყვა.'
                      : 'პროდუქტები ჯერ არ არის დამატებული.'}
                  </p>
                  {(params.search || hasActiveFilters) && (
                    <Button variant="outline" size="sm" className="mt-3" onClick={clearFilters}>
                      ფილტრების გასუფთავება
                    </Button>
                  )}
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 flex flex-col items-center gap-2">
                  <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    hasNextPage={pagination.hasNextPage}
                    hasPreviousPage={pagination.hasPreviousPage}
                  />
                  <p className="text-xs text-muted-foreground">
                    გვერდი {pagination.page} / {pagination.totalPages}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="container py-6 px-4 md:px-6">
      <Skeleton className="h-8 w-48 mb-1" />
      <Skeleton className="h-4 w-72 mb-5" />
      <Separator className="mb-5" />
      <div className="flex gap-6">
        {/* Sidebar skeleton */}
        <div className="hidden lg:block w-[250px] shrink-0 space-y-4">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-7 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogContent />
    </Suspense>
  );
}
