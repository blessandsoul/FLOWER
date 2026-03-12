'use client';

import { useState } from 'react';
import {
    ChevronDown,
    XCircle,
    Package,
    Check,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, OrderWithUser } from '@/features/orders/types';
import { STATUS_CONFIG, formatItemsSummary } from '@/features/orders/constants';
import { cn } from '@/lib/utils';

/* ── Helpers ── */

function isOrderWithUser(order: Order | OrderWithUser): order is OrderWithUser {
    return 'user' in order && order.user !== undefined;
}

/* ── Single order card ── */

function OrderRow({
    order,
    showUser,
    showActions,
    onApprove,
    onCancel,
}: {
    order: Order | OrderWithUser;
    showUser?: boolean;
    showActions?: boolean;
    onApprove?: (id: string) => void;
    onCancel?: (id: string) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const cfg = STATUS_CONFIG[order.status];
    const StatusIcon = cfg.icon;

    return (
        <Card
            className={cn(
                'border-l-4 transition-all duration-200 hover:shadow-md',
                cfg.borderClass,
                expanded && 'shadow-md',
            )}
        >
            <CardContent className="pt-5 pb-4">
                {/* ── Collapsed summary ── */}
                <button
                    type="button"
                    className="w-full flex items-start justify-between gap-4 text-left cursor-pointer"
                    onClick={() => setExpanded((v) => !v)}
                >
                    <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-mono text-sm font-semibold tracking-tight">
                                {order.orderNumber}
                            </span>
                            <Badge
                                variant="outline"
                                className={cn('text-[11px] font-medium gap-1 px-2 py-0.5', cfg.badgeClass)}
                            >
                                <StatusIcon className="h-3 w-3" />
                                {cfg.label}
                            </Badge>
                        </div>

                        {/* Product summary */}
                        <p className="text-sm text-foreground/70 truncate leading-snug">
                            {formatItemsSummary(order.items)}
                        </p>

                        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span>
                                {new Date(order.createdAt).toLocaleDateString('ka-GE', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                            {showUser && isOrderWithUser(order) && (
                                <>
                                    <span className="text-muted-foreground/40">|</span>
                                    <span>{order.user.firstName} {order.user.lastName}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 pt-0.5">
                        <div className="text-right">
                            <span className="font-bold text-lg tabular-nums leading-tight">
                                {parseFloat(order.totalAmount).toFixed(2)} ₾
                            </span>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                                {order.items.length} პროდუქტი
                            </p>
                        </div>
                        <ChevronDown
                            className={cn(
                                'h-4 w-4 text-muted-foreground transition-transform duration-200',
                                expanded && 'rotate-180',
                            )}
                        />
                    </div>
                </button>

                {/* ── Expanded details ── */}
                {expanded && (
                    <div className="mt-5 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="h-px bg-border" />

                        {/* Item rows */}
                        <div className="space-y-2">
                            {order.items.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/40"
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                            {item.productName}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {item.quantity} ერთ. × {parseFloat(item.unitPrice).toFixed(2)} ₾
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold tabular-nums ml-4">
                                        {parseFloat(item.totalPrice).toFixed(2)} ₾
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Totals */}
                        <div className="rounded-lg border bg-muted/20 p-3 space-y-1.5">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">ქვეჯამი</span>
                                <span className="tabular-nums">
                                    {parseFloat(order.subtotal).toFixed(2)} ₾
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">საკომისიო (5%)</span>
                                <span className="tabular-nums">
                                    {parseFloat(order.serviceFee).toFixed(2)} ₾
                                </span>
                            </div>
                            <div className="h-px bg-border my-1" />
                            <div className="flex justify-between font-bold">
                                <span>სულ</span>
                                <span className="tabular-nums">
                                    {parseFloat(order.totalAmount).toFixed(2)} ₾
                                </span>
                            </div>
                        </div>

                        {order.notes && (
                            <div className="rounded-lg bg-muted/40 p-3">
                                <p className="text-[11px] font-medium text-muted-foreground mb-1">
                                    შენიშვნა
                                </p>
                                <p className="text-sm">{order.notes}</p>
                            </div>
                        )}

                        {/* Admin actions */}
                        {showActions && order.status === 'PENDING' && (
                            <div className="flex gap-2 pt-1">
                                <Button
                                    size="sm"
                                    variant="default"
                                    className="h-8 text-xs"
                                    onClick={() => onApprove?.(order.id)}
                                >
                                    <Check className="mr-1.5 h-3.5 w-3.5" />
                                    დამტკიცება
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-8 text-xs"
                                    onClick={() => onCancel?.(order.id)}
                                >
                                    <XCircle className="mr-1.5 h-3.5 w-3.5" />
                                    უარყოფა
                                </Button>
                            </div>
                        )}

                        {/* User cancel */}
                        {!showActions && onCancel && order.status === 'PENDING' && (
                            <Button
                                size="sm"
                                variant="destructive"
                                className="h-8 text-xs"
                                onClick={() => onCancel(order.id)}
                            >
                                <XCircle className="mr-1.5 h-3.5 w-3.5" />
                                შეკვეთის გაუქმება
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

/* ── Loading skeleton ── */

function OrdersSkeleton() {
    return (
        <div className="space-y-3 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="border-l-4 border-l-muted">
                    <CardContent className="pt-5 pb-4">
                        <div className="flex justify-between">
                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-36" />
                                    <Skeleton className="h-5 w-20 rounded-full" />
                                </div>
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <div className="text-right space-y-1.5">
                                <Skeleton className="h-6 w-20 ml-auto" />
                                <Skeleton className="h-3 w-16 ml-auto" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

/* ── Pagination ── */

interface PaginationInfo {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

/* ── Main component ── */

interface OrdersTableProps {
    orders: (Order | OrderWithUser)[];
    showUser?: boolean;
    showActions?: boolean;
    isLoading?: boolean;
    pagination?: PaginationInfo;
    onPageChange?: (page: number) => void;
    onApprove?: (orderId: string) => void;
    onCancel?: (orderId: string) => void;
}

export function OrdersTable({
    orders,
    showUser,
    showActions,
    isLoading,
    pagination,
    onPageChange,
    onApprove,
    onCancel,
}: OrdersTableProps) {
    if (isLoading) {
        return <OrdersSkeleton />;
    }

    if (orders.length === 0) {
        return (
            <Card className="mt-4">
                <CardContent className="py-12 text-center text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>შეკვეთები არ არის</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-3 mt-4">
            {orders.map((order) => (
                <OrderRow
                    key={order.id}
                    order={order}
                    showUser={showUser}
                    showActions={showActions}
                    onApprove={onApprove}
                    onCancel={onCancel}
                />
            ))}

            {pagination && pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-3">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!pagination.hasPreviousPage}
                        onClick={() => onPageChange?.(pagination.page - 1)}
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
                        onClick={() => onPageChange?.(pagination.page + 1)}
                    >
                        შემდეგი
                    </Button>
                </div>
            )}
        </div>
    );
}
