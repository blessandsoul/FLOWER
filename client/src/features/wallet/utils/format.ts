import type { TransactionType } from '../types';

export function formatBalance(balance: string): string {
    const num = parseFloat(balance);
    if (isNaN(num)) return '0.00';
    return num.toLocaleString('ka-GE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

export function formatTransactionAmount(amount: string, type: TransactionType): string {
    const num = parseFloat(amount);
    if (isNaN(num)) return '0.00';

    const isDebit = type === 'WITHDRAWAL' || type === 'PURCHASE';
    const prefix = isDebit ? '-' : '+';
    const formatted = num.toLocaleString('ka-GE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return `${prefix}${formatted}`;
}

export function getCurrencySymbol(currency: string): string {
    if (currency === 'GEL') return '₾';
    if (currency === 'USD') return '$';
    if (currency === 'EUR') return '€';
    if (currency === 'GBP') return '£';
    return currency;
}

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
    DEPOSIT: 'შეტანა',
    WITHDRAWAL: 'გატანა',
    PURCHASE: 'შესყიდვა',
    REFUND: 'დაბრუნება',
    ADJUSTMENT: 'კორექცია',
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
    PENDING: 'მოლოდინში',
    COMPLETED: 'დასრულებული',
    FAILED: 'წარუმატებელი',
    REFUNDED: 'დაბრუნებული',
};
