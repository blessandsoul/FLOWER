'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, RotateCcw } from 'lucide-react';
import { useFilterOptions } from '../hooks';
import type { CatalogParams } from '../hooks';

interface ProductFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  params: CatalogParams;
  onApplyFilters: (filters: Partial<CatalogParams>) => void;
  onClearFilters: () => void;
}

export function ProductFilters({
  open,
  onOpenChange,
  params,
  onApplyFilters,
  onClearFilters,
}: ProductFiltersProps) {
  const { colors, growers, origins, tags, isLoading } = useFilterOptions();

  // Local state for filter values (before applying)
  const [localFilters, setLocalFilters] = useState({
    colorId: params.colorId,
    growerId: params.growerId,
    originId: params.originId,
    tagIds: params.tagIds ?? [],
    inStock: params.inStock,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
  });

  // Sync local state when params change
  useEffect(() => {
    setLocalFilters({
      colorId: params.colorId,
      growerId: params.growerId,
      originId: params.originId,
      tagIds: params.tagIds ?? [],
      inStock: params.inStock,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
    });
  }, [params]);

  const handleApply = () => {
    onApplyFilters({
      colorId: localFilters.colorId,
      growerId: localFilters.growerId,
      originId: localFilters.originId,
      tagIds: localFilters.tagIds.length > 0 ? localFilters.tagIds : undefined,
      inStock: localFilters.inStock,
      minPrice: localFilters.minPrice,
      maxPrice: localFilters.maxPrice,
    });
    onOpenChange(false);
  };

  const handleClear = () => {
    setLocalFilters({
      colorId: undefined,
      growerId: undefined,
      originId: undefined,
      tagIds: [],
      inStock: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    });
    onClearFilters();
    onOpenChange(false);
  };

  const toggleTag = (tagId: number) => {
    setLocalFilters((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const activeFilterCount = [
    localFilters.colorId,
    localFilters.growerId,
    localFilters.originId,
    localFilters.tagIds.length > 0,
    localFilters.inStock !== undefined,
    localFilters.minPrice !== undefined,
    localFilters.maxPrice !== undefined,
  ].filter(Boolean).length;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            ფილტრები
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount}
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            აირჩიეთ ფილტრები პროდუქტების მოსაძებნად
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] pr-4 mt-6">
          <div className="space-y-6">
            {/* Color Filter */}
            <div className="space-y-2">
              <Label htmlFor="color-filter">ფერი</Label>
              <Select
                id="color-filter"
                placeholder="აირჩიეთ ფერი"
                value={localFilters.colorId?.toString()}
                onChange={(val) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    colorId: val ? parseInt(val, 10) : undefined,
                  }))
                }
                options={colors.map((c) => ({ value: c.id.toString(), label: c.name }))}
                disabled={isLoading}
              />
            </div>

            {/* Grower Filter */}
            <div className="space-y-2">
              <Label htmlFor="grower-filter">მწარმოებელი</Label>
              <Select
                id="grower-filter"
                placeholder="აირჩიეთ მწარმოებელი"
                value={localFilters.growerId?.toString()}
                onChange={(val) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    growerId: val ? parseInt(val, 10) : undefined,
                  }))
                }
                options={growers.map((g) => ({ value: g.id.toString(), label: g.name }))}
                disabled={isLoading}
              />
            </div>

            {/* Origin Filter */}
            <div className="space-y-2">
              <Label htmlFor="origin-filter">წარმოშობა</Label>
              <Select
                id="origin-filter"
                placeholder="აირჩიეთ ქვეყანა"
                value={localFilters.originId?.toString()}
                onChange={(val) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    originId: val ? parseInt(val, 10) : undefined,
                  }))
                }
                options={origins.map((o) => ({ value: o.id.toString(), label: o.name }))}
                disabled={isLoading}
              />
            </div>

            <Separator />

            {/* Tags Filter */}
            <div className="space-y-2">
              <Label>ტეგები</Label>
              <div className="flex flex-wrap gap-2">
                {isLoading ? (
                  <span className="text-sm text-muted-foreground">იტვირთება...</span>
                ) : tags.length === 0 ? (
                  <span className="text-sm text-muted-foreground">ტეგები არ არის</span>
                ) : (
                  tags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={localFilters.tagIds.includes(tag.id) ? 'default' : 'outline'}
                      className="cursor-pointer hover:bg-primary/80 transition-colors"
                      onClick={() => toggleTag(tag.id)}
                    >
                      {tag.name}
                      {localFilters.tagIds.includes(tag.id) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            <Separator />

            {/* Stock Filter */}
            <div className="space-y-2">
              <Label>მარაგი</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant={localFilters.inStock === undefined ? 'default' : 'outline'}
                  onClick={() =>
                    setLocalFilters((prev) => ({ ...prev, inStock: undefined }))
                  }
                >
                  ყველა
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={localFilters.inStock === true ? 'default' : 'outline'}
                  onClick={() =>
                    setLocalFilters((prev) => ({ ...prev, inStock: true }))
                  }
                >
                  მარაგშია
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={localFilters.inStock === false ? 'default' : 'outline'}
                  onClick={() =>
                    setLocalFilters((prev) => ({ ...prev, inStock: false }))
                  }
                >
                  არ არის მარაგში
                </Button>
              </div>
            </div>

            <Separator />

            {/* Price Range Filter */}
            <div className="space-y-4">
              <Label>ფასის დიაპაზონი (₾)</Label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="მინ"
                    min={0}
                    step={0.01}
                    value={localFilters.minPrice ?? ''}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        minPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>
                <span className="text-muted-foreground">-</span>
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="მაქს"
                    min={0}
                    step={0.01}
                    value={localFilters.maxPrice ?? ''}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        maxPrice: e.target.value ? parseFloat(e.target.value) : undefined,
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <SheetFooter className="mt-6 gap-2 sm:gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
            className="flex-1"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            გასუფთავება
          </Button>
          <Button type="button" onClick={handleApply} className="flex-1">
            გამოყენება
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
