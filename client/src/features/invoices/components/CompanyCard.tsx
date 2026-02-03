import type { Invoice, SellerDetails } from '@/types';

interface CompanyCardProps {
  type: 'seller' | 'buyer';
  data: SellerDetails | Pick<Invoice, 'buyerName' | 'buyerTaxId' | 'buyerPersonalId' | 'buyerAddress' | 'buyerPhone' | 'buyerEmail'>;
}

/**
 * Reusable card component for displaying seller or buyer information
 * Matches the card design in PDF invoices
 */
export function CompanyCard({ type, data }: CompanyCardProps) {
  const title = type === 'seller' ? 'გამყიდველი / SELLER' : 'მყიდველი / BUYER';
  const isSeller = type === 'seller';

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Section Header */}
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
        {title}
      </h3>

      {/* Company/Buyer Name */}
      <div className="space-y-2">
        <p className="font-semibold text-base text-gray-900">
          {isSeller ? (data as SellerDetails).companyName : (data as any).buyerName}
        </p>

        {/* Details */}
        <div className="space-y-1.5 text-sm text-gray-600">
          {isSeller ? (
            <>
              {/* Seller Details */}
              <p>ს/კ: {(data as SellerDetails).taxId}</p>
              <p>{(data as SellerDetails).address}</p>
              <p>ტელ: {(data as SellerDetails).phone}</p>
              <p>{(data as SellerDetails).email}</p>
              <p className="mt-2">{(data as SellerDetails).bankName}</p>
              <p className="font-mono text-xs">IBAN: {(data as SellerDetails).iban}</p>
            </>
          ) : (
            <>
              {/* Buyer Details */}
              {(data as any).buyerTaxId && <p>ს/კ: {(data as any).buyerTaxId}</p>}
              {(data as any).buyerPersonalId && <p>პ/ნ: {(data as any).buyerPersonalId}</p>}
              {(data as any).buyerAddress && <p>{(data as any).buyerAddress}</p>}
              {(data as any).buyerPhone && <p>ტელ: {(data as any).buyerPhone}</p>}
              {(data as any).buyerEmail && <p>{(data as any).buyerEmail}</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
