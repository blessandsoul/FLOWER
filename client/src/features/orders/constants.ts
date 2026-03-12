import {
    Clock,
    CheckCircle2,
    Truck,
    PackageCheck,
    Ban,
} from 'lucide-react';
import type { OrderStatus, OrderItem } from './types';

export const STATUS_CONFIG: Record<
    OrderStatus,
    {
        label: string;
        icon: typeof Clock;
        badgeClass: string;
        borderClass: string;
    }
> = {
    PENDING: {
        label: 'მომლოდინე',
        icon: Clock,
        badgeClass:
            'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
        borderClass: 'border-l-amber-400',
    },
    APPROVED: {
        label: 'დამტკიცებული',
        icon: CheckCircle2,
        badgeClass:
            'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800',
        borderClass: 'border-l-blue-400',
    },
    SHIPPED: {
        label: 'გაგზავნილი',
        icon: Truck,
        badgeClass:
            'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800',
        borderClass: 'border-l-indigo-400',
    },
    DELIVERED: {
        label: 'ჩაბარებული',
        icon: PackageCheck,
        badgeClass:
            'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
        borderClass: 'border-l-emerald-500',
    },
    CANCELLED: {
        label: 'გაუქმებული',
        icon: Ban,
        badgeClass:
            'bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800',
        borderClass: 'border-l-red-400',
    },
};

export const STATUS_OPTIONS = (Object.entries(STATUS_CONFIG) as [OrderStatus, (typeof STATUS_CONFIG)[OrderStatus]][]).map(
    ([value, cfg]) => ({ value, label: cfg.label }),
);

export function formatItemsSummary(items: OrderItem[]): string {
    const MAX = 2;
    const shown = items.slice(0, MAX);
    const summary = shown.map((i) => `${i.productName} ×${i.quantity}`).join(', ');
    const rest = items.length - MAX;
    return rest > 0 ? `${summary} +${rest} სხვა` : summary;
}
