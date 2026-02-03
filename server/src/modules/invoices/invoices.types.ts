/**
 * Invoices Module Types
 */

import type { InvoiceStatus } from '@/config/constants';

/**
 * Seller details (FLORCA company info)
 */
export interface SellerDetails {
  companyName: string;
  taxId: string;
  address: string;
  phone: string;
  bankName: string;
  iban: string;
  email: string;
}

/**
 * Invoice item response
 */
export interface InvoiceItemResponse {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPriceGel: string;
  vatAmount: string;
  totalGel: string;
}

/**
 * Invoice response (full detail)
 */
export interface InvoiceResponse {
  id: string;
  invoiceNumber: string;
  orderId: string;
  orderNumber: string;
  userId: string;
  status: InvoiceStatus;
  issueDate: string;

  // Buyer details
  buyerName: string;
  buyerTaxId: string | null;
  buyerPersonalId: string | null;
  buyerAddress: string | null;
  buyerPhone: string | null;
  buyerEmail: string | null;

  // Seller details
  seller: SellerDetails;

  // Financials
  subtotalGel: string;
  vatAmount: string;
  discountGel: string;
  creditsUsedGel: string;
  totalGel: string;

  items: InvoiceItemResponse[];
  notes: string | null;
  createdAt: string;
}

/**
 * Invoice summary (for lists)
 */
export interface InvoiceSummary {
  id: string;
  invoiceNumber: string;
  orderNumber: string;
  buyerName: string;
  totalGel: string;
  issueDate: string;
  status: InvoiceStatus;
}

/**
 * Invoice list filters
 */
export interface InvoiceListFilters {
  userId?: string;
  status?: InvoiceStatus;
  fromDate?: string;
  toDate?: string;
}
