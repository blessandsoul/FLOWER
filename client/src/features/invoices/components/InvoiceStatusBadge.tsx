'use client';

import type { InvoiceStatus } from '@/types';

/**
 * Status badge configuration matching Premium Modern design
 * Uses FLORCA Blue color scheme
 */
const STATUS_CONFIG: Record<
  InvoiceStatus,
  {
    label: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
  }
> = {
  DRAFT: {
    label: 'დრაფტი',
    bgClass: 'bg-gray-100',
    textClass: 'text-gray-600',
    borderClass: 'border-gray-400',
  },
  ISSUED: {
    label: 'გამოწერილი',
    bgClass: 'bg-blue-100',
    textClass: 'text-[#175eeb]',
    borderClass: 'border-[#175eeb]',
  },
  CANCELLED: {
    label: 'გაუქმებული',
    bgClass: 'bg-red-100',
    textClass: 'text-red-600',
    borderClass: 'border-red-500',
  },
};

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

/**
 * Premium invoice status badge with pill shape and FLORCA Blue colors
 * Matches the status badge design in PDF invoices
 */
export function InvoiceStatusBadge({ status, className = '' }: InvoiceStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.ISSUED;

  return (
    <div
      className={`inline-flex items-center px-4 py-1.5 rounded-full border-2 font-semibold text-sm transition-all duration-200 ${config.bgClass} ${config.textClass} ${config.borderClass} ${className}`}
    >
      {config.label}
    </div>
  );
}
