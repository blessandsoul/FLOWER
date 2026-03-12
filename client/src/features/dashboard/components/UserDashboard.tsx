'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Package, ShieldCheck } from 'lucide-react';
import { StatCard } from './StatCard';
import { OrdersTable } from './OrdersTable';
import { useOrders, useCancelOrder } from '@/features/orders/hooks';
import type { User } from '@/types';

interface UserDashboardProps {
    user: User;
}

export function UserDashboard({ user }: UserDashboardProps) {
    const [page, setPage] = useState(1);
    const { data, isLoading } = useOrders({ page, limit: 10 });
    const cancelOrder = useCancelOrder();
    const orders = data?.data?.items ?? [];
    const pagination = data?.data?.pagination;

    const activeOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'APPROVED').length;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <StatCard
                    icon={<Clock />}
                    label="აქტიური შეკვეთები"
                    value={isLoading ? '...' : activeOrders}
                    sub="მიმდინარე"
                    accent="text-blue-600"
                />
                <StatCard
                    icon={<Package />}
                    label="ჯამური შეკვეთები"
                    value={isLoading ? '...' : (pagination?.totalItems ?? orders.length)}
                    sub="სულ"
                    accent="text-purple-600"
                />
                <StatCard
                    icon={<ShieldCheck />}
                    label="სტატუსი"
                    value={user.isActive ? 'აქტიური' : 'არააქტიური'}
                    sub={user.emailVerified ? 'ვერიფიცირებული' : 'დაუდასტურებელი'}
                    accent="text-blue-600"
                />
            </div>

            <Tabs defaultValue="orders">
                <TabsList>
                    <TabsTrigger value="orders">ჩემი შეკვეთები</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                    <OrdersTable
                        orders={orders}
                        isLoading={isLoading}
                        pagination={pagination}
                        onPageChange={setPage}
                        onCancel={(id) => cancelOrder.mutate(id)}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
