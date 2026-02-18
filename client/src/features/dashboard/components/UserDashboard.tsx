'use client';

import { MOCK_INVOICES } from '@/lib/mock-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Package, ShieldCheck } from 'lucide-react';
import { InvoicesTable } from '@/features/invoices/components/InvoicesTable';
import { StatCard } from './StatCard';
import { OrdersTable } from './OrdersTable';
import { useOrders } from '@/features/orders/hooks';
import type { User } from '@/types';

interface UserDashboardProps {
    user: User;
}

export function UserDashboard({ user }: UserDashboardProps) {
    const { data, isLoading } = useOrders({ page: 1, limit: 20 });
    const orders = data?.data?.items ?? [];

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
                    value={isLoading ? '...' : orders.length}
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
                    <TabsTrigger value="invoices">ინვოისები</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                    <OrdersTable orders={orders} isLoading={isLoading} />
                </TabsContent>
                <TabsContent value="invoices"><InvoicesTable invoices={MOCK_INVOICES} /></TabsContent>
            </Tabs>
        </div>
    );
}
