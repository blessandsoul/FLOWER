import { FlowerIcon } from './FlowerIcon';
import type { InvoiceStatus } from '@/types';

interface InvoiceHeaderProps {
  invoiceNumber: string;
  status: InvoiceStatus;
}

/**
 * Premium invoice header with FLORCA Blue gradient and branding
 */
export function InvoiceHeader({ invoiceNumber, status }: InvoiceHeaderProps) {
  return (
    <div className="relative bg-gradient-to-r from-[#175eeb] to-[#1e3a8a] text-white p-8 rounded-t-xl print:rounded-none">
      <div className="flex justify-between items-start">
        {/* Left side: Company branding with flower icon */}
        <div className="flex items-start gap-3">
          <FlowerIcon size={40} color="white" className="mt-1 opacity-25" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">FLORCA</h1>
            <p className="text-sm text-white/80 mt-1">PREMIUM FLOWERS & LOGISTICS</p>
          </div>
        </div>

        {/* Right side: Invoice title and number */}
        <div className="text-right">
          <h2 className="text-2xl font-bold">ინვოისი</h2>
          <p className="text-sm mt-1 font-mono opacity-90">{invoiceNumber}</p>
        </div>
      </div>
    </div>
  );
}
