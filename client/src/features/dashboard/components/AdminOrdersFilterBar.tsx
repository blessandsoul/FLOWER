'use client';

import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { STATUS_OPTIONS } from '@/features/orders/constants';
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback';
import type { AdminOrderFilters } from '@/features/orders/types';

interface AdminOrdersFilterBarProps {
    filters: AdminOrderFilters;
    onFiltersChange: (filters: Partial<AdminOrderFilters>) => void;
    onReset: () => void;
}

export function AdminOrdersFilterBar({ filters, onFiltersChange, onReset }: AdminOrdersFilterBarProps) {
    const debouncedSearch = useDebouncedCallback((value: string) => {
        onFiltersChange({ search: value || undefined });
    }, 300);

    const hasActiveFilters = !!(
        filters.status ||
        filters.search ||
        filters.minTotal !== undefined ||
        filters.maxTotal !== undefined ||
        filters.dateFrom ||
        filters.dateTo
    );

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        key={filters.search ?? ''}
                        defaultValue={filters.search ?? ''}
                        placeholder="ძიება (სახელი, ელ-ფოსტა, შეკვეთა)..."
                        onChange={(e) => debouncedSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="w-[180px]">
                    <Select
                        options={[...STATUS_OPTIONS]}
                        placeholder="სტატუსი"
                        value={filters.status ?? ''}
                        onChange={(val) => onFiltersChange({ status: val as AdminOrderFilters['status'] })}
                    />
                </div>
            </div>

            <div className="flex flex-wrap gap-3 items-end">
                <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">მინ. თანხა</label>
                    <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        step={0.01}
                        value={filters.minTotal ?? ''}
                        onChange={(e) => onFiltersChange({ minTotal: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-[120px]"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">მაქს. თანხა</label>
                    <Input
                        type="number"
                        placeholder="∞"
                        min={0}
                        step={0.01}
                        value={filters.maxTotal ?? ''}
                        onChange={(e) => onFiltersChange({ maxTotal: e.target.value ? Number(e.target.value) : undefined })}
                        className="w-[120px]"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">თარიღიდან</label>
                    <Input
                        type="date"
                        value={filters.dateFrom ?? ''}
                        onChange={(e) => onFiltersChange({ dateFrom: e.target.value || undefined })}
                        className="w-[160px]"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">თარიღამდე</label>
                    <Input
                        type="date"
                        value={filters.dateTo ?? ''}
                        onChange={(e) => onFiltersChange({ dateTo: e.target.value || undefined })}
                        className="w-[160px]"
                    />
                </div>
                {hasActiveFilters && (
                    <Button variant="ghost" size="sm" onClick={onReset} className="h-9 gap-1.5">
                        <X className="h-3.5 w-3.5" />
                        გასუფთავება
                    </Button>
                )}
            </div>
        </div>
    );
}
