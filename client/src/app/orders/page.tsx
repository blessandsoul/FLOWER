'use client';

import { useState } from 'react';
import { Package, ChevronDown, ChevronUp, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrders, useCancelOrder } from '@/features/orders/hooks';
import type { OrderFilters, OrderStatus, Order } from '@/features/orders/types';

const STATUS_TABS: { label: string; value: OrderStatus | undefined }[] = [
    { label: 'ყველა', value: undefined },
    { label: 'მომლოდინე', value: 'PENDING' },
    { label: 'დამტკიცებული', value: 'APPROVED' },
    { label: 'გაგზავნილი', value: 'SHIPPED' },
    { label: 'ჩაბარებული', value: 'DELIVERED' },
    { label: 'გაუქმებული', value: 'CANCELLED' },
];

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PENDING: { label: 'მომლოდინე', variant: 'secondary' },
    APPROVED: { label: 'დამტკიცებული', variant: 'default' },
    SHIPPED: { label: 'გაგზავნილი', variant: 'outline' },
    DELIVERED: { label: 'ჩაბარებული', variant: 'default' },
    CANCELLED: { label: 'გაუქმებული', variant: 'destructive' },
};

function OrderCard({ order }: { order: Order }) {
    const [expanded, setExpanded] = useState(false);
    const cancelOrder = useCancelOrder();
    const st = STATUS_MAP[order.status];

    return (
        <Card>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-semibold">{order.orderNumber}</span>
                            <Badge variant={st.variant}>{st.label}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString('ka-GE', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <div className="font-bold text-lg">{parseFloat(order.totalAmount).toFixed(2)} ₾</div>
                            <p className="text-[11px] text-muted-foreground">
                                {order.items.length} პროდუქტი
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setExpanded(!expanded)}
                            className="h-8 w-8"
                        >
                            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </Button>
                    </div>
                </div>

                {expanded && (
                    <div className="mt-4 space-y-3">
                        <div className="rounded-md border overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/50">
                                        <th className="h-9 px-3 text-left font-medium text-muted-foreground">პროდუქტი</th>
                                        <th className="h-9 px-3 text-right font-medium text-muted-foreground">რაოდენობა</th>
                                        <th className="h-9 px-3 text-right font-medium text-muted-foreground">ფასი</th>
                                        <th className="h-9 px-3 text-right font-medium text-muted-foreground">ჯამი</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.items.map((item) => (
                                        <tr key={item.id} className="border-b last:border-0">
                                            <td className="p-3">{item.productName}</td>
                                            <td className="p-3 text-right">{item.quantity}</td>
                                            <td className="p-3 text-right">{parseFloat(item.unitPrice).toFixed(2)} ₾</td>
                                            <td className="p-3 text-right font-medium">{parseFloat(item.totalPrice).toFixed(2)} ₾</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-between text-sm pt-1">
                            <span className="text-muted-foreground">ქვეჯამი</span>
                            <span>{parseFloat(order.subtotal).toFixed(2)} ₾</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">საკომისიო (5%)</span>
                            <span>{parseFloat(order.serviceFee).toFixed(2)} ₾</span>
                        </div>
                        <div className="flex justify-between font-bold border-t pt-2">
                            <span>სულ</span>
                            <span>{parseFloat(order.totalAmount).toFixed(2)} ₾</span>
                        </div>

                        {order.notes && (
                            <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-2">
                                {order.notes}
                            </p>
                        )}

                        {order.status === 'PENDING' && (
                            <Button
                                variant="destructive"
                                size="sm"
                                disabled={cancelOrder.isPending}
                                onClick={() => cancelOrder.mutate(order.id)}
                                className="mt-2"
                            >
                                <XCircle className="mr-1.5 h-3.5 w-3.5" />
                                {cancelOrder.isPending ? 'გაუქმება...' : 'შეკვეთის გაუქმება'}
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function OrdersSkeleton() {
    return (
        <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                    <CardContent className="pt-6">
                        <div className="flex justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-40" />
                                <Skeleton className="h-3 w-28" />
                            </div>
                            <Skeleton className="h-8 w-24" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function OrdersPage() {
    const [filters, setFilters] = useState<OrderFilters>({ page: 1, limit: 20 });
    const { data, isLoading } = useOrders(filters);

    const orders = data?.data?.items ?? [];
    const pagination = data?.data?.pagination;

    return (
        <div className="container max-w-3xl mx-auto py-8 px-4">
            <div className="flex items-center gap-3 mb-6">
                <Package className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">ჩემი შეკვეთები</h1>
            </div>

            {/* Status filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {STATUS_TABS.map((tab) => (
                    <Button
                        key={tab.label}
                        variant={filters.status === tab.value ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilters({ ...filters, page: 1, status: tab.value })}
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>

            {isLoading ? (
                <OrdersSkeleton />
            ) : orders.length === 0 ? (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>შეკვეთები არ მოიძებნა</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center gap-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!pagination.hasPreviousPage}
                                onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) - 1 })}
                            >
                                წინა
                            </Button>
                            <span className="flex items-center text-sm text-muted-foreground px-3">
                                {pagination.page} / {pagination.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={!pagination.hasNextPage}
                                onClick={() => setFilters({ ...filters, page: (filters.page ?? 1) + 1 })}
                            >
                                შემდეგი
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
