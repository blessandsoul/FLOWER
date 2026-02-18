'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { walletKeys, transactionKeys, paymentOrderKeys } from '../hooks';

export function PaymentStatusHandler() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const hasHandled = useRef(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (hasHandled.current) return;

        const paymentStatus = searchParams.get('payment');

        if (paymentStatus === 'success') {
            hasHandled.current = true;
            // Small delay to allow the server callback to process
            setTimeout(() => {
                toast.success('გადახდა წარმატებით დასრულდა! ბალანსი განახლდა.');
                queryClient.invalidateQueries({ queryKey: walletKeys.all });
                queryClient.invalidateQueries({ queryKey: transactionKeys.all });
                queryClient.invalidateQueries({ queryKey: paymentOrderKeys.all });
            }, 1000);
            router.replace(pathname, { scroll: false });
        } else if (paymentStatus === 'failed') {
            hasHandled.current = true;
            toast.error('გადახდა წარუმატებელი. გთხოვთ, სცადოთ ხელახლა.');
            queryClient.invalidateQueries({ queryKey: paymentOrderKeys.all });
            router.replace(pathname, { scroll: false });
        }
    }, [searchParams, router, pathname, queryClient]);

    return null;
}
