'use client';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import {
  X,
  RotateCcw,
  Search,
  ChevronDown,
  Palette,
  Factory,
  Globe,
  Tag,
  Package,
  DollarSign,
} from 'lucide-react';
import { useFilterOptions } from '../hooks';
import type { CatalogParams } from '../hooks';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';

interface ProductFiltersProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  params: CatalogParams;
  onApplyFilters: (filters: Partial<CatalogParams>) => void;
  onClearFilters: () => void;
}

/* ------------------------------------------------------------------
 * FilterSelect — Radix DropdownMenu with RadioGroup (portaled)
 * ----------------------------------------------------------------*/
function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  value?: string;
  onChange: (value: string | undefined) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  disabled?: boolean;
}) {
  const selected = options.find((o) => o.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            'flex h-8 w-full items-center justify-between rounded-lg bg-muted/50 px-3 text-sm outline-none transition-colors duration-150',
            'hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50',
            'data-[state=open]:bg-muted',
            selected ? 'text-foreground' : 'text-muted-foreground',
          )}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          <ChevronDown className={cn('h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200')} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[var(--radix-dropdown-menu-trigger-width)] max-h-64">
        <DropdownMenuItem
          onSelect={() => onChange(undefined)}
          className={cn('text-muted-foreground', !value && 'text-primary font-medium')}
        >
          {placeholder}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={value ?? ''} onValueChange={(v) => onChange(v || undefined)}>
          {options.map((opt) => (
            <DropdownMenuRadioItem key={opt.value} value={opt.value} className="text-sm">
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------------------------------------------------
 * FilterBody — rendered inside sidebar (desktop) or Sheet (mobile)
 * ----------------------------------------------------------------*/
function FilterBody({
  params,
  onApplyFilters,
  onClearFilters,
  colors,
  growers,
  origins,
  tags,
  isLoading,
  showSearch,
  onSearchChange,
}: {
  params: CatalogParams;
  onApplyFilters: (f: Partial<CatalogParams>) => void;
  onClearFilters: () => void;
  colors: { id: number; name: string }[];
  growers: { id: number; name: string }[];
  origins: { id: number; name: string }[];
  tags: { id: number; name: string }[];
  isLoading: boolean;
  showSearch?: boolean;
  onSearchChange?: (value: string) => void;
}) {
  const activeFilterCount = [
    params.colorId,
    params.growerId,
    params.originId,
    params.tagIds && params.tagIds.length > 0,
    params.inStock !== undefined,
    params.minPrice !== undefined,
    params.maxPrice !== undefined,
  ].filter(Boolean).length;

  const toggleTag = (tagId: number) => {
    const current = params.tagIds ?? [];
    const next = current.includes(tagId)
      ? current.filter((id) => id !== tagId)
      : [...current, tagId];
    onApplyFilters({ tagIds: next.length > 0 ? next : undefined });
  };

  const debouncedPriceMin = useDebouncedCallback((val: string) => {
    onApplyFilters({ minPrice: val ? parseFloat(val) : undefined });
  }, 500);

  const debouncedPriceMax = useDebouncedCallback((val: string) => {
    onApplyFilters({ maxPrice: val ? parseFloat(val) : undefined });
  }, 500);

  const selectedColor = colors.find((c) => c.id === params.colorId);
  const selectedGrower = growers.find((g) => g.id === params.growerId);
  const selectedOrigin = origins.find((o) => o.id === params.originId);

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-sm font-bold tracking-tight text-foreground">
            ფილტრები
          </h2>
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-[11px] text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            გასუფთავება
          </button>
        )}
      </div>

      {/* Search */}
      {showSearch && onSearchChange && (
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="ძიება..."
            className="pl-8 h-9 text-sm bg-muted/30 border-transparent focus-visible:bg-white focus-visible:border-input transition-all"
            defaultValue={params.search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}

      {/* Filter sections in Accordion */}
      <Accordion type="multiple" defaultValue={['color', 'grower', 'origin', 'tags', 'stock', 'price']} className="space-y-0">

        {/* Color */}
        <AccordionItem value="color" className="border-b-0 border-t border-border/40">
          <AccordionTrigger className="py-2.5 hover:no-underline group/trigger">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover/trigger:text-foreground transition-colors">
              <Palette className="h-3.5 w-3.5" />
              ფერი
              {selectedColor && (
                <span className="normal-case tracking-normal font-medium text-primary text-[11px]">
                  — {selectedColor.name}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 pt-0">
            <FilterSelect
              placeholder="ყველა ფერი"
              value={params.colorId?.toString()}
              onChange={(val) => onApplyFilters({ colorId: val ? parseInt(val, 10) : undefined })}
              options={colors.map((c) => ({ value: c.id.toString(), label: c.name }))}
              disabled={isLoading}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Grower */}
        <AccordionItem value="grower" className="border-b-0 border-t border-border/40">
          <AccordionTrigger className="py-2.5 hover:no-underline group/trigger">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover/trigger:text-foreground transition-colors">
              <Factory className="h-3.5 w-3.5" />
              მწარმოებელი
              {selectedGrower && (
                <span className="normal-case tracking-normal font-medium text-primary text-[11px]">
                  — {selectedGrower.name}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 pt-0">
            <FilterSelect
              placeholder="ყველა მწარმოებელი"
              value={params.growerId?.toString()}
              onChange={(val) => onApplyFilters({ growerId: val ? parseInt(val, 10) : undefined })}
              options={growers.map((g) => ({ value: g.id.toString(), label: g.name }))}
              disabled={isLoading}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Origin */}
        <AccordionItem value="origin" className="border-b-0 border-t border-border/40">
          <AccordionTrigger className="py-2.5 hover:no-underline group/trigger">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover/trigger:text-foreground transition-colors">
              <Globe className="h-3.5 w-3.5" />
              წარმოშობა
              {selectedOrigin && (
                <span className="normal-case tracking-normal font-medium text-primary text-[11px]">
                  — {selectedOrigin.name}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 pt-0">
            <FilterSelect
              placeholder="ყველა ქვეყანა"
              value={params.originId?.toString()}
              onChange={(val) => onApplyFilters({ originId: val ? parseInt(val, 10) : undefined })}
              options={origins.map((o) => ({ value: o.id.toString(), label: o.name }))}
              disabled={isLoading}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Tags */}
        <AccordionItem value="tags" className="border-b-0 border-t border-border/40">
          <AccordionTrigger className="py-2.5 hover:no-underline group/trigger">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover/trigger:text-foreground transition-colors">
              <Tag className="h-3.5 w-3.5" />
              ტეგები
              {params.tagIds && params.tagIds.length > 0 && (
                <span className="inline-flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                  {params.tagIds.length}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 pt-0">
            <div className="flex flex-wrap gap-1.5">
              {isLoading ? (
                <span className="text-xs text-muted-foreground">იტვირთება...</span>
              ) : tags.length === 0 ? (
                <span className="text-xs text-muted-foreground">ტეგები არ არის</span>
              ) : (
                tags.map((tag) => {
                  const isSelected = params.tagIds?.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      className={cn(
                        'inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-all duration-150',
                        isSelected
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground',
                      )}
                    >
                      {tag.name}
                      {isSelected && <X className="h-2.5 w-2.5" />}
                    </button>
                  );
                })
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Stock */}
        <AccordionItem value="stock" className="border-b-0 border-t border-border/40">
          <AccordionTrigger className="py-2.5 hover:no-underline group/trigger">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover/trigger:text-foreground transition-colors">
              <Package className="h-3.5 w-3.5" />
              მარაგი
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 pt-0">
            <div className="flex rounded-lg border border-border/60 overflow-hidden">
              {([
                { label: 'ყველა', value: undefined },
                { label: 'მარაგშია', value: true },
                { label: 'არ არის', value: false },
              ] as const).map((opt, i) => (
                <button
                  key={String(opt.value)}
                  type="button"
                  onClick={() => onApplyFilters({ inStock: opt.value })}
                  className={cn(
                    'flex-1 py-1.5 text-xs font-medium transition-all duration-150',
                    i > 0 && 'border-l border-border/60',
                    params.inStock === opt.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price" className="border-b-0 border-t border-border/40">
          <AccordionTrigger className="py-2.5 hover:no-underline group/trigger">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover/trigger:text-foreground transition-colors">
              <DollarSign className="h-3.5 w-3.5" />
              ფასი
              {(params.minPrice !== undefined || params.maxPrice !== undefined) && (
                <span className="normal-case tracking-normal font-medium text-primary text-[11px]">
                  — {params.minPrice ?? 0}₾ – {params.maxPrice ?? '∞'}₾
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-3 pt-0">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <Input
                  type="number"
                  placeholder="0"
                  min={0}
                  step={0.01}
                  defaultValue={params.minPrice ?? ''}
                  onChange={(e) => debouncedPriceMin(e.target.value)}
                  className="h-8 text-sm pr-6"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">₾</span>
              </div>
              <span className="text-muted-foreground text-xs font-medium">—</span>
              <div className="flex-1 relative">
                <Input
                  type="number"
                  placeholder="∞"
                  min={0}
                  step={0.01}
                  defaultValue={params.maxPrice ?? ''}
                  onChange={(e) => debouncedPriceMax(e.target.value)}
                  className="h-8 text-sm pr-6"
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground pointer-events-none">₾</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

/* ------------------------------------------------------------------
 * Main export — desktop sidebar + mobile Sheet
 * ----------------------------------------------------------------*/
export function ProductFilters({
  open,
  onOpenChange,
  params,
  onApplyFilters,
  onClearFilters,
}: ProductFiltersProps) {
  const { colors, growers, origins, tags, isLoading } = useFilterOptions();

  const sharedProps = {
    params,
    onApplyFilters,
    onClearFilters,
    colors,
    growers,
    origins,
    tags,
    isLoading,
  };

  return (
    <>
      {/* Desktop: inline sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0">
        <div className="sticky top-24">
          <ScrollArea className="h-[calc(100vh-7rem)] pr-2">
            <FilterBody {...sharedProps} showSearch onSearchChange={(val) => onApplyFilters({ search: val })} />
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile/Tablet: Sheet */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-sm p-0">
          <SheetHeader className="px-5 pt-5 pb-0">
            <SheetTitle className="text-base font-bold">ფილტრები</SheetTitle>
            <SheetDescription className="text-xs">
              აირჩიეთ ფილტრები პროდუქტების მოსაძებნად
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-100px)] px-5 mt-3">
            <FilterBody {...sharedProps} />
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
