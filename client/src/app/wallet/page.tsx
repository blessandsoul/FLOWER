'use client';

import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    WalletBalance,
    TopUpForm,
    TransactionHistory,
    PaymentOrders,
    PaymentStatusHandler,
} from '@/features/wallet/components';

function WalletContent() {
    return (
        <div className="container py-8 px-4 md:px-6 max-w-5xl mx-auto">
            <PaymentStatusHandler />

            <h1 className="text-3xl font-extrabold tracking-tight mb-2">საფულე</h1>
            <p className="text-muted-foreground mb-8">
                მართეთ თქვენი ბალანსი და შეავსეთ საფულე
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <WalletBalance />
                <TopUpForm />
            </div>

            <Tabs defaultValue="transactions" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md">
                    <TabsTrigger value="transactions">ტრანზაქციები</TabsTrigger>
                    <TabsTrigger value="orders">გადახდის ისტორია</TabsTrigger>
                </TabsList>
                <TabsContent value="transactions" className="mt-6">
                    <TransactionHistory />
                </TabsContent>
                <TabsContent value="orders" className="mt-6">
                    <PaymentOrders />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function WalletSkeleton() {
    return (
        <div className="container py-8 px-4 md:px-6 max-w-5xl mx-auto">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-80 mb-8" />
            <div className="grid md:grid-cols-2 gap-6 mb-8">
                <Skeleton className="h-40 rounded-lg" />
                <Skeleton className="h-40 rounded-lg" />
            </div>
            <Skeleton className="h-10 w-64 mb-6" />
            <Skeleton className="h-64 rounded-lg" />
        </div>
    );
}

export default function WalletPage() {
    return (
        <Suspense fallback={<WalletSkeleton />}>
            <WalletContent />
        </Suspense>
    );
}
