'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { Receipt } from 'lucide-react';
import { usePaymentOrders } from '../hooks';
import { formatBalance, PAYMENT_STATUS_LABELS } from '../utils/format';
import type { PaymentOrderStatus } from '../types';

const STATUS_OPTIONS = [
    { value: 'PENDING', label: 'მოლოდინში' },
    { value: 'COMPLETED', label: 'დასრულებული' },
    { value: 'FAILED', label: 'წარუმატებელი' },
    { value: 'REFUNDED', label: 'დაბრუნებული' },
];

const STATUS_STYLES: Record<PaymentOrderStatus, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
    PENDING: { variant: 'outline', className: 'border-yellow-300 text-yellow-700 bg-yellow-50' },
    COMPLETED: { variant: 'default', className: 'bg-green-600 text-white border-green-600' },
    FAILED: { variant: 'destructive', className: '' },
    REFUNDED: { variant: 'secondary', className: '' },
};

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ka-GE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function truncateId(id: string): string {
    return id.length > 8 ? `${id.slice(0, 8)}...` : id;
}

export function PaymentOrders() {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<PaymentOrderStatus | undefined>(undefined);

    const { data, isLoading, isError } = usePaymentOrders({
        page,
        limit: 10,
        status: statusFilter,
    });

    const orders = data?.data?.items ?? [];
    const pagination = data?.data?.pagination;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Receipt className="h-5 w-5" />
                    გადახდის ისტორია
                </CardTitle>
                <div className="w-48">
                    <Select
                        options={STATUS_OPTIONS}
                        placeholder="ყველა სტატუსი"
                        value={statusFilter}
                        onChange={(val) => {
                            setStatusFilter(val as PaymentOrderStatus | undefined);
                            setPage(1);
                        }}
                    />
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                        ))}
                    </div>
                ) : isError ? (
                    <p className="text-center text-muted-foreground py-8">
                        გადახდის ისტორიის ჩატვირთვა ვერ მოხერხდა
                    </p>
                ) : orders.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        გადახდები არ მოიძებნა
                    </p>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="pb-3 font-medium">თარიღი</th>
                                        <th className="pb-3 font-medium">ID</th>
                                        <th className="pb-3 font-medium text-right">თანხა</th>
                                        <th className="pb-3 font-medium">ვალუტა</th>
                                        <th className="pb-3 font-medium">სტატუსი</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => {
                                        const style = STATUS_STYLES[order.status];
                                        return (
                                            <tr key={order.id} className="border-b last:border-0">
                                                <td className="py-3 text-muted-foreground whitespace-nowrap">
                                                    {formatDate(order.createdAt)}
                                                </td>
                                                <td className="py-3 font-mono text-xs text-muted-foreground">
                                                    {truncateId(order.id)}
                                                </td>
                                                <td className="py-3 text-right font-mono font-medium">
                                                    {formatBalance(order.amount)} ₾
                                                </td>
                                                <td className="py-3 text-muted-foreground">
                                                    {order.currency}
                                                </td>
                                                <td className="py-3">
                                                    <Badge variant={style.variant} className={style.className}>
                                                        {PAYMENT_STATUS_LABELS[order.status]}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden space-y-3">
                            {orders.map((order) => {
                                const style = STATUS_STYLES[order.status];
                                return (
                                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="space-y-1">
                                            <Badge variant={style.variant} className={style.className}>
                                                {PAYMENT_STATUS_LABELS[order.status]}
                                            </Badge>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <span className="font-mono font-medium">
                                            {formatBalance(order.amount)} ₾
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {pagination && pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                hasNextPage={pagination.hasNextPage}
                                hasPreviousPage={pagination.hasPreviousPage}
                                onPageChange={setPage}
                                className="mt-6"
                            />
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
