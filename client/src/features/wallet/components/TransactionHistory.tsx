'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { ArrowDownUp } from 'lucide-react';
import { useWalletTransactions } from '../hooks';
import { formatBalance, formatTransactionAmount, TRANSACTION_TYPE_LABELS } from '../utils/format';
import type { TransactionType } from '../types';

const TYPE_OPTIONS = [
    { value: 'DEPOSIT', label: 'შეტანა' },
    { value: 'WITHDRAWAL', label: 'გატანა' },
    { value: 'PURCHASE', label: 'შესყიდვა' },
    { value: 'REFUND', label: 'დაბრუნება' },
    { value: 'ADJUSTMENT', label: 'კორექცია' },
];

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ka-GE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function TransactionHistory() {
    const [page, setPage] = useState(1);
    const [typeFilter, setTypeFilter] = useState<TransactionType | undefined>(undefined);

    const { data, isLoading, isError } = useWalletTransactions({
        page,
        limit: 10,
        type: typeFilter,
    });

    const transactions = data?.data?.items ?? [];
    const pagination = data?.data?.pagination;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <ArrowDownUp className="h-5 w-5" />
                    ტრანზაქციები
                </CardTitle>
                <div className="w-48">
                    <Select
                        options={TYPE_OPTIONS}
                        placeholder="ყველა ტიპი"
                        value={typeFilter}
                        onChange={(val) => {
                            setTypeFilter(val as TransactionType | undefined);
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
                        ტრანზაქციების ჩატვირთვა ვერ მოხერხდა
                    </p>
                ) : transactions.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                        ტრანზაქციები არ მოიძებნა
                    </p>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="pb-3 font-medium">თარიღი</th>
                                        <th className="pb-3 font-medium">ტიპი</th>
                                        <th className="pb-3 font-medium text-right">თანხა</th>
                                        <th className="pb-3 font-medium text-right">ბალანსი</th>
                                        <th className="pb-3 font-medium">აღწერა</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx) => {
                                        const isCredit = tx.type === 'DEPOSIT' || tx.type === 'REFUND' || tx.type === 'ADJUSTMENT';
                                        return (
                                            <tr key={tx.id} className="border-b last:border-0">
                                                <td className="py-3 text-muted-foreground whitespace-nowrap">
                                                    {formatDate(tx.createdAt)}
                                                </td>
                                                <td className="py-3">
                                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${isCredit
                                                        ? 'bg-green-50 text-green-700'
                                                        : 'bg-red-50 text-red-700'
                                                        }`}>
                                                        {TRANSACTION_TYPE_LABELS[tx.type]}
                                                    </span>
                                                </td>
                                                <td className={`py-3 text-right font-mono font-medium ${isCredit ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                    {formatTransactionAmount(tx.amount, tx.type)} ₾
                                                </td>
                                                <td className="py-3 text-right font-mono text-muted-foreground">
                                                    {formatBalance(tx.balanceAfter)} ₾
                                                </td>
                                                <td className="py-3 text-muted-foreground max-w-[200px] truncate">
                                                    {tx.description || '—'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden space-y-3">
                            {transactions.map((tx) => {
                                const isCredit = tx.type === 'DEPOSIT' || tx.type === 'REFUND' || tx.type === 'ADJUSTMENT';
                                return (
                                    <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="space-y-1">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${isCredit
                                                ? 'bg-green-50 text-green-700'
                                                : 'bg-red-50 text-red-700'
                                                }`}>
                                                {TRANSACTION_TYPE_LABELS[tx.type]}
                                            </span>
                                            <p className="text-xs text-muted-foreground">
                                                {tx.description || formatDate(tx.createdAt)}
                                            </p>
                                        </div>
                                        <span className={`font-mono font-medium ${isCredit ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {formatTransactionAmount(tx.amount, tx.type)} ₾
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
