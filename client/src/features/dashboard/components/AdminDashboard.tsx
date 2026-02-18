'use client';

import { MOCK_BATCHES, MOCK_PRODUCTS, MOCK_DASHBOARD_STATS, MOCK_INVOICES } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clock, TrendingUp, Users, Plane } from 'lucide-react';
import { InvoicesTable } from '@/features/invoices/components/InvoicesTable';
import { DemoInvoiceGenerator } from '@/features/invoices/components/DemoInvoiceGenerator';
import { StatCard } from './StatCard';
import { OrdersTable } from './OrdersTable';
import { BatchesTable } from './BatchesTable';
import { ProductsTable } from './ProductsTable';
import { SettingsPanel } from './SettingsPanel';
import { useAdminOrders, useUpdateOrderStatus } from '@/features/orders/hooks';

export function AdminDashboard() {
    const stats = MOCK_DASHBOARD_STATS;
    const { data, isLoading } = useAdminOrders({ page: 1, limit: 20 });
    const updateStatus = useUpdateOrderStatus();
    const orders = data?.data?.items ?? [];

    const pendingCount = orders.filter(o => o.status === 'PENDING').length;

    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard icon={<Clock />} label="მომლოდინე შეკვეთები" value={isLoading ? '...' : pendingCount} sub="დასამტკიცებელი" accent="text-orange-600" />
                <StatCard icon={<TrendingUp />} label="დღევანდელი შემოსავალი" value={`${stats.revenue.today} ₾`} sub={`კვირა: ${stats.revenue.thisWeek} ₾`} accent="text-green-600" />
                <StatCard icon={<Users />} label="აქტიური პროდუქტები" value={stats.products.total} sub={`${stats.products.lowStock} მცირე მარაგი`} accent="text-blue-600" />
                <StatCard icon={<Plane />} label="პარტიები ტრანზიტში" value={stats.batches.inTransit} sub={`${stats.batches.expectedThisWeek} ამ კვირას`} accent="text-purple-600" />
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-4">
                <DemoInvoiceGenerator />
            </div>

            <Tabs defaultValue="orders">
                <TabsList>
                    <TabsTrigger value="orders">ყველა შეკვეთა</TabsTrigger>
                    <TabsTrigger value="invoices">ინვოისები</TabsTrigger>
                    <TabsTrigger value="products">პროდუქტები</TabsTrigger>
                    <TabsTrigger value="batches">პარტიები</TabsTrigger>
                    <TabsTrigger value="settings">პარამეტრები</TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                    <OrdersTable
                        orders={orders}
                        showUser
                        showActions
                        isLoading={isLoading}
                        onApprove={(id) => updateStatus.mutate({ id, status: 'APPROVED' })}
                        onCancel={(id) => updateStatus.mutate({ id, status: 'CANCELLED' })}
                    />
                </TabsContent>
                <TabsContent value="invoices"><InvoicesTable invoices={MOCK_INVOICES} /></TabsContent>
                <TabsContent value="products"><ProductsTable /></TabsContent>
                <TabsContent value="batches"><BatchesTable /></TabsContent>
                <TabsContent value="settings"><SettingsPanel /></TabsContent>
            </Tabs>
        </div>
    );
}
