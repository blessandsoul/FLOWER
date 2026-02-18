'use client';

import Link from 'next/link';
import { useWallet } from '../hooks';
import { formatBalance } from '../utils/format';

export function WalletBadge({ className }: { className?: string }) {
    const { data: wallet, isLoading } = useWallet();

    return (
        <Link
            href="/wallet"
            className={`flex flex-col items-end hover:opacity-80 transition-opacity ${className ?? ''}`}
        >
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                ბალანსი
            </span>
            <span className="text-sm font-bold text-green-600 font-mono">
                {isLoading ? '...' : `${formatBalance(wallet?.balance ?? '0')} ₾`}
            </span>
        </Link>
    );
}
