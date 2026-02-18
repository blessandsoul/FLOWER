'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order, OrderWithUser } from '@/features/orders/types';

const ORDER_STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
    PENDING: { label: 'მომლოდინე', variant: 'secondary' },
    APPROVED: { label: 'დამტკიცებული', variant: 'default' },
    SHIPPED: { label: 'გაგზავნილი', variant: 'outline' },
    DELIVERED: { label: 'ჩაბარებული', variant: 'default' },
    CANCELLED: { label: 'გაუქმებული', variant: 'destructive' },
};

interface OrdersTableProps {
    orders: (Order | OrderWithUser)[];
    showUser?: boolean;
    showActions?: boolean;
    isLoading?: boolean;
    onApprove?: (orderId: string) => void;
    onCancel?: (orderId: string) => void;
}

function isOrderWithUser(order: Order | OrderWithUser): order is OrderWithUser {
    return 'user' in order && order.user !== undefined;
}

export function OrdersTable({ orders, showUser, showActions, isLoading, onApprove, onCancel }: OrdersTableProps) {
    if (isLoading) {
        return (
            <Card className="mt-4">
                <CardContent className="pt-6">
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="mt-4">
            <CardContent className="pt-6">
                <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">შეკვეთა</th>
                                {showUser && <th className="h-10 px-4 text-left font-medium text-muted-foreground">მომხმარებელი</th>}
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">თარიღი</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">ერთეული</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">თანხა</th>
                                <th className="h-10 px-4 text-left font-medium text-muted-foreground">სტატუსი</th>
                                {showActions && <th className="h-10 px-4 text-right font-medium text-muted-foreground">მოქმედებები</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => {
                                const st = ORDER_STATUS_MAP[order.status];
                                return (
                                    <tr key={order.id} className="border-b hover:bg-muted/50">
                                        <td className="p-3 font-mono text-xs">{order.orderNumber}</td>
                                        {showUser && (
                                            <td className="p-3 text-xs text-muted-foreground">
                                                {isOrderWithUser(order)
                                                    ? `${order.user.firstName} ${order.user.lastName}`
                                                    : '—'}
                                            </td>
                                        )}
                                        <td className="p-3 text-xs">
                                            {new Date(order.createdAt).toLocaleDateString('ka-GE')}
                                        </td>
                                        <td className="p-3">{order.items.length}</td>
                                        <td className="p-3 font-semibold">{parseFloat(order.totalAmount).toFixed(2)} ₾</td>
                                        <td className="p-3"><Badge variant={st.variant}>{st.label}</Badge></td>
                                        {showActions && (
                                            <td className="p-3 text-right space-x-1">
                                                {order.status === 'PENDING' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            className="h-7 text-xs"
                                                            onClick={() => onApprove?.(order.id)}
                                                        >
                                                            დამტკიცება
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-7 text-xs"
                                                            onClick={() => onCancel?.(order.id)}
                                                        >
                                                            უარყოფა
                                                        </Button>
                                                    </>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                            {orders.length === 0 && (
                                <tr><td colSpan={showActions ? 7 : 6} className="p-8 text-center text-muted-foreground">შეკვეთები არ არის</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
