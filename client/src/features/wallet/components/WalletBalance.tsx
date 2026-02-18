'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet as WalletIcon } from 'lucide-react';
import { useWallet } from '../hooks';
import { formatBalance, getCurrencySymbol } from '../utils/format';

export function WalletBalance() {
    const { data: wallet, isLoading, isError } = useWallet();

    if (isLoading) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <Skeleton className="h-5 w-24 mb-3" />
                    <Skeleton className="h-12 w-48" />
                </CardContent>
            </Card>
        );
    }

    if (isError || !wallet) {
        return (
            <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                    ბალანსის ჩატვირთვა ვერ მოხერხდა
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                    <WalletIcon className="h-4 w-4" />
                    <span className="text-sm font-medium uppercase tracking-wider">ბალანსი</span>
                </div>
                <p className="text-4xl font-bold font-mono text-primary">
                    {formatBalance(wallet.balance)} {getCurrencySymbol(wallet.currency)}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                    ვალუტა: {wallet.currency}
                </p>
            </CardContent>
        </Card>
    );
}
