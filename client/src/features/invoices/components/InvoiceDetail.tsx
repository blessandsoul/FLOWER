'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download } from 'lucide-react';
import { InvoiceHeader } from './InvoiceHeader';
import { InvoiceStatusBadge } from './InvoiceStatusBadge';
import { CompanyCard } from './CompanyCard';
import { OrderInfoGrid } from './OrderInfoGrid';
import { ItemsTable } from './ItemsTable';
import { TotalsSection } from './TotalsSection';
import type { Invoice } from '@/types';

interface InvoiceDetailProps {
  invoice: Invoice;
  onDownloadPdf?: () => void;
}

/**
 * Premium invoice detail view with FLORCA Blue branding
 * Matches the design of PDF invoices for visual consistency
 */
export function InvoiceDetail({ invoice, onDownloadPdf }: InvoiceDetailProps) {
  return (
    <Card className="max-w-4xl mx-auto shadow-lg print:shadow-none">
      {/* Premium Header with Gradient */}
      <InvoiceHeader invoiceNumber={invoice.invoiceNumber} status={invoice.status} />

      <CardContent className="p-8 space-y-6">
        {/* Status Badge and Download Button */}
        <div className="flex justify-between items-center -mt-2">
          <InvoiceStatusBadge status={invoice.status} />
          {onDownloadPdf && (
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadPdf}
              className="border-[#175eeb] text-[#175eeb] hover:bg-blue-50 print:hidden"
            >
              <Download className="h-4 w-4 mr-2" />
              PDF ჩამოტვირთვა
            </Button>
          )}
        </div>

        <Separator />

        {/* Seller & Buyer Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CompanyCard type="seller" data={invoice.seller} />
          <CompanyCard type="buyer" data={invoice} />
        </div>

        <Separator />

        {/* Order Information Grid */}
        <OrderInfoGrid
          orderNumber={invoice.orderNumber}
          invoiceNumber={invoice.invoiceNumber}
          issueDate={invoice.issueDate}
        />

        <Separator />

        {/* Line Items Table */}
        <ItemsTable items={invoice.items} />

        <Separator />

        {/* Totals Section */}
        <TotalsSection
          subtotalGel={invoice.subtotalGel}
          vatAmount={invoice.vatAmount}
          discountGel={invoice.discountGel}
          creditsUsedGel={invoice.creditsUsedGel}
          totalGel={invoice.totalGel}
        />

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 pt-6 border-t border-gray-200 mt-8">
          <p>ეს ინვოისი ავტომატურად გენერირებულია FLORCA-ს სისტემის მიერ.</p>
          <p className="mt-1">
            {invoice.seller.companyName} | {invoice.seller.phone} | {invoice.seller.email}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
