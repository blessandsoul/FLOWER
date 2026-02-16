'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Loader2, X } from 'lucide-react';
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
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">კვირის აუქციონის კატალოგი</h1>
          <p className="text-muted-foreground mt-2">
            შეუკვეთეთ ერთად, დაზოგეთ ერთად. შემდეგი ტრანსპორტირება{' '}
            <span className="text-primary font-bold">2 დღეში</span>.
          </p>
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="მოძებნეთ ყვავილები..."
              className="pl-9 bg-white"
              defaultValue={params.search}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setFiltersOpen(true)}
            className="relative"
          >
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
            )}
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-sm text-muted-foreground">აქტიური ფილტრები:</span>
          {params.colorId && (
            <Badge variant="secondary" className="gap-1">
              ფერი
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setParams({ colorId: undefined })}
              />
            </Badge>
          )}
          {params.growerId && (
            <Badge variant="secondary" className="gap-1">
              მწარმოებელი
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setParams({ growerId: undefined })}
              />
            </Badge>
          )}
          {params.originId && (
            <Badge variant="secondary" className="gap-1">
              წარმოშობა
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setParams({ originId: undefined })}
              />
            </Badge>
          )}
          {params.tagIds && params.tagIds.length > 0 && (
            <Badge variant="secondary" className="gap-1">
              {params.tagIds.length} ტეგი
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setParams({ tagIds: undefined })}
              />
            </Badge>
          )}
          {params.inStock !== undefined && (
            <Badge variant="secondary" className="gap-1">
              {params.inStock ? 'მარაგშია' : 'არ არის მარაგში'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setParams({ inStock: undefined })}
              />
            </Badge>
          )}
          {(params.minPrice !== undefined || params.maxPrice !== undefined) && (
            <Badge variant="secondary" className="gap-1">
              ფასი: {params.minPrice ?? 0}₾ - {params.maxPrice ?? '∞'}₾
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setParams({ minPrice: undefined, maxPrice: undefined })}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs text-muted-foreground"
            onClick={clearFilters}
          >
            ყველას გასუფთავება
          </Button>
        </div>
      )}

      <Separator className="my-6" />

      {/* Filter Sheet */}
      <ProductFilters
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        params={params}
        onApplyFilters={setParams}
        onClearFilters={clearFilters}
      />

      {isFetching && !isLoading && (
        <div className="flex justify-center mb-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Loader2 className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-red-600">პროდუქტების ჩატვირთვა ვერ მოხერხდა</h3>
          <p className="text-muted-foreground">გთხოვთ, სცადოთ მოგვიანებით.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            თავიდან ცდა
          </Button>
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-4 text-4xl">
                {params.search || hasActiveFilters ? '🥀' : '🌱'}
              </div>
              <h3 className="text-lg font-bold">
                {params.search || hasActiveFilters ? 'შედეგები არ მოიძებნა' : 'პროდუქტები არ არის'}
              </h3>
              <p className="text-muted-foreground">
                {params.search || hasActiveFilters
                  ? 'სცადეთ სხვა ფილტრები ან საძიებო სიტყვა.'
                  : 'კატალოგი ჯერ ცარიელია.'}
              </p>
              {(params.search || hasActiveFilters) && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  ფილტრების გასუფთავება
                </Button>
              )}
            </div>
          )}

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                hasNextPage={pagination.hasNextPage}
                hasPreviousPage={pagination.hasPreviousPage}
              />
              <p className="text-sm text-muted-foreground">
                გვერდი {pagination.page} / {pagination.totalPages} (სულ {pagination.totalItems}{' '}
                პროდუქტი)
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function CatalogSkeleton() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <Skeleton className="h-10 w-64 mb-2" />
      <Skeleton className="h-5 w-96 mb-8" />
      <Separator className="my-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
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
