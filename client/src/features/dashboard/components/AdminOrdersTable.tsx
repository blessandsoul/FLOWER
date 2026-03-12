'use client';

import { useState, useCallback } from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Check,
    XCircle,
    Package,
    Truck,
    PackageCheck,
    Clock,
    TrendingUp,
} from 'lucide-react';
import { AdminOrdersFilterBar } from './AdminOrdersFilterBar';
import { StatCard } from './StatCard';
import { useAdminOrders, useUpdateOrderStatus } from '@/features/orders/hooks';
import { STATUS_CONFIG, formatItemsSummary } from '@/features/orders/constants';
import type {
    AdminOrderFilters,
    SortableOrderColumn,
    OrderStatus,
    OrderWithUser,
} from '@/features/orders/types';
import { cn } from '@/lib/utils';

const DEFAULT_FILTERS: AdminOrderFilters = {
    page: 1,
    limit: 15,
    sortBy: 'createdAt',
    sortOrder: 'desc',
};

/* ── Sortable header ── */

function SortableHeader({
    column,
    label,
    currentSort,
    currentOrder,
    onSort,
    className,
}: {
    column: SortableOrderColumn;
    label: string;
    currentSort?: SortableOrderColumn;
    currentOrder?: string;
    onSort: (col: SortableOrderColumn) => void;
    className?: string;
}) {
    const isActive = currentSort === column;
    return (
        <TableHead
            className={cn('cursor-pointer select-none hover:bg-muted/50 transition-colors', className)}
            onClick={() => onSort(column)}
        >
            <div className="flex items-center gap-1.5">
                {label}
                {isActive ? (
                    currentOrder === 'asc' ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                    ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                    )
                ) : (
                    <ArrowUpDown className="h-3.5 w-3.5 opacity-30" />
                )}
            </div>
        </TableHead>
    );
}

/* ── Action buttons per status ── */

function OrderActions({
    order,
    onStatusChange,
    isUpdating,
}: {
    order: OrderWithUser;
    onStatusChange: (id: string, status: OrderStatus) => void;
    isUpdating: boolean;
}) {
    switch (order.status) {
        case 'PENDING':
            return (
                <div className="flex gap-1.5">
                    <Button
                        size="sm"
                        variant="default"
                        className="h-7 text-xs px-2.5"
                        disabled={isUpdating}
                        onClick={() => onStatusChange(order.id, 'APPROVED')}
                    >
                        <Check className="mr-1 h-3 w-3" />
                        დამტკიცება
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs px-2.5"
                        disabled={isUpdating}
                        onClick={() => onStatusChange(order.id, 'CANCELLED')}
                    >
                        <XCircle className="mr-1 h-3 w-3" />
                        უარყოფა
                    </Button>
                </div>
            );
        case 'APPROVED':
            return (
                <div className="flex gap-1.5">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs px-2.5"
                        disabled={isUpdating}
                        onClick={() => onStatusChange(order.id, 'SHIPPED')}
                    >
                        <Truck className="mr-1 h-3 w-3" />
                        გაგზავნა
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs px-2.5"
                        disabled={isUpdating}
                        onClick={() => onStatusChange(order.id, 'CANCELLED')}
                    >
                        <XCircle className="mr-1 h-3 w-3" />
                    </Button>
                </div>
            );
        case 'SHIPPED':
            return (
                <div className="flex gap-1.5">
                    <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs px-2.5"
                        disabled={isUpdating}
                        onClick={() => onStatusChange(order.id, 'DELIVERED')}
                    >
                        <PackageCheck className="mr-1 h-3 w-3" />
                        ჩაბარება
                    </Button>
                    <Button
                        size="sm"
                        variant="destructive"
                        className="h-7 text-xs px-2.5"
                        disabled={isUpdating}
                        onClick={() => onStatusChange(order.id, 'CANCELLED')}
                    >
                        <XCircle className="mr-1 h-3 w-3" />
                    </Button>
                </div>
            );
        default:
            return <span className="text-xs text-muted-foreground">—</span>;
    }
}

/* ── Loading skeleton ── */

function TableSkeleton() {
    return (
        <>
            {Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell>
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-3 w-36" />
                        </div>
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-7 w-32" /></TableCell>
                </TableRow>
            ))}
        </>
    );
}

/* ── Main component ── */

export function AdminOrdersTable() {
    const [filters, setFilters] = useState<AdminOrderFilters>(DEFAULT_FILTERS);
    const { data, isLoading } = useAdminOrders(filters);
    const { data: pendingData } = useAdminOrders({ status: 'PENDING', limit: 1 });
    const updateStatus = useUpdateOrderStatus();

    const orders = data?.data?.items ?? [];
    const pagination = data?.data?.pagination;
    const pendingCount = pendingData?.data?.pagination?.totalItems ?? 0;

    const handleSort = useCallback((column: SortableOrderColumn) => {
        setFilters((prev) => ({
            ...prev,
            page: 1,
            sortBy: column,
            sortOrder: prev.sortBy === column && prev.sortOrder === 'desc' ? 'asc' : 'desc',
        }));
    }, []);

    const handleFiltersChange = useCallback((newFilters: Partial<AdminOrderFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
    }, []);

    const handleReset = useCallback(() => {
        setFilters(DEFAULT_FILTERS);
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setFilters((prev) => ({ ...prev, page }));
    }, []);

    const mutate = updateStatus.mutate;
    const handleStatusChange = useCallback(
        (id: string, status: OrderStatus) => {
            mutate({ id, status });
        },
        [mutate]
    );

    return (
        <div className="space-y-5">
            {/* Stat cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <StatCard
                    icon={<Clock />}
                    label="მომლოდინე შეკვეთები"
                    value={isLoading ? '...' : pendingCount}
                    sub="დასამტკიცებელი"
                    accent="text-orange-600"
                />
                <StatCard
                    icon={<TrendingUp />}
                    label="ჯამური შეკვეთები"
                    value={isLoading ? '...' : (pagination?.totalItems ?? orders.length)}
                    sub="სულ"
                    accent="text-blue-600"
                />
            </div>

            {/* Filters */}
            <AdminOrdersFilterBar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleReset}
            />

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <SortableHeader
                                    column="orderNumber"
                                    label="#"
                                    currentSort={filters.sortBy}
                                    currentOrder={filters.sortOrder}
                                    onSort={handleSort}
                                    className="w-[140px]"
                                />
                                <TableHead className="w-[180px]">მომხმარებელი</TableHead>
                                <SortableHeader
                                    column="status"
                                    label="სტატუსი"
                                    currentSort={filters.sortBy}
                                    currentOrder={filters.sortOrder}
                                    onSort={handleSort}
                                    className="w-[130px]"
                                />
                                <TableHead>პროდუქტები</TableHead>
                                <SortableHeader
                                    column="totalAmount"
                                    label="თანხა"
                                    currentSort={filters.sortBy}
                                    currentOrder={filters.sortOrder}
                                    onSort={handleSort}
                                    className="w-[110px] text-right"
                                />
                                <SortableHeader
                                    column="createdAt"
                                    label="თარიღი"
                                    currentSort={filters.sortBy}
                                    currentOrder={filters.sortOrder}
                                    onSort={handleSort}
                                    className="w-[150px]"
                                />
                                <TableHead className="w-[180px]">მოქმედება</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableSkeleton />
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-40">
                                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                                            <Package className="h-10 w-10 mb-2 opacity-20" />
                                            <p className="text-sm">შეკვეთები არ მოიძებნა</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders.map((order) => {
                                    const cfg = STATUS_CONFIG[order.status];
                                    const StatusIcon = cfg.icon;

                                    return (
                                        <TableRow key={order.id}>
                                            <TableCell className="font-mono text-xs font-semibold tracking-tight">
                                                {order.orderNumber}
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-medium leading-none">
                                                        {order.user.firstName} {order.user.lastName}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {order.user.email}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className={cn(
                                                        'text-[11px] font-medium gap-1 px-2 py-0.5',
                                                        cfg.badgeClass
                                                    )}
                                                >
                                                    <StatusIcon className="h-3 w-3" />
                                                    {cfg.label}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm text-foreground/70 truncate max-w-[280px]">
                                                    {formatItemsSummary(order.items)}
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    {order.items.length} პროდუქტი
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <span className="font-semibold tabular-nums text-sm">
                                                    {parseFloat(order.totalAmount).toFixed(2)} ₾
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString('ka-GE', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <OrderActions
                                                    order={order}
                                                    onStatusChange={handleStatusChange}
                                                    isUpdating={updateStatus.isPending && updateStatus.variables?.id === order.id}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        სულ: {pagination.totalItems} შეკვეთა
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!pagination.hasPreviousPage}
                            onClick={() => handlePageChange(pagination.page - 1)}
                        >
                            წინა
                        </Button>
                        <span className="text-sm text-muted-foreground px-3 tabular-nums">
                            {pagination.page} / {pagination.totalPages}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={!pagination.hasNextPage}
                            onClick={() => handlePageChange(pagination.page + 1)}
                        >
                            შემდეგი
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
