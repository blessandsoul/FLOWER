/**
 * Invoices Service
 * Business logic for invoice generation and management
 */

import { Prisma } from '@prisma/client';
import { prisma } from '@/libs/prisma';
import { logger } from '@/libs/logger';
import {
  NotFoundError,
  ConflictError,
  ForbiddenError,
} from '@/shared/errors/errors';
import { VAT_RATE } from '@/config/constants';
import {
  COMPANY_NAME,
  COMPANY_TAX_ID,
  COMPANY_ADDRESS,
  COMPANY_PHONE,
  COMPANY_BANK_NAME,
  COMPANY_IBAN,
  COMPANY_EMAIL,
} from '@/config/env';
import * as invoicesRepo from './invoices.repo';
import * as ordersRepo from '../orders/orders.repo';
import { generateInvoicePdf } from '@/libs/pdf-generator';
import type {
  InvoiceResponse,
  InvoiceItemResponse,
  InvoiceSummary,
  InvoiceListFilters,
  SellerDetails,
} from './invoices.types';

/**
 * Get seller (FLORCA) details from config
 */
function getSellerDetails(): SellerDetails {
  return {
    companyName: COMPANY_NAME,
    taxId: COMPANY_TAX_ID,
    address: COMPANY_ADDRESS,
    phone: COMPANY_PHONE,
    bankName: COMPANY_BANK_NAME,
    iban: COMPANY_IBAN,
    email: COMPANY_EMAIL,
  };
}

/**
 * Calculate VAT breakdown from a VAT-inclusive amount
 * Georgian standard: 18% VAT included in price
 */
function calculateVatBreakdown(totalInclVat: Prisma.Decimal): {
  subtotal: Prisma.Decimal;
  vat: Prisma.Decimal;
} {
  const vatDivisor = new Prisma.Decimal(1 + VAT_RATE / 100); // 1.18
  const subtotal = totalInclVat.div(vatDivisor);
  const vat = totalInclVat.sub(subtotal);
  return { subtotal, vat };
}

/**
 * Map invoice to full response
 */
function toInvoiceResponse(invoice: NonNullable<Awaited<ReturnType<typeof invoicesRepo.findById>>>): InvoiceResponse {
  const items: InvoiceItemResponse[] = invoice.items.map((item) => ({
    id: item.id,
    productId: item.productId,
    productName: item.productName,
    quantity: item.quantity,
    unitPriceGel: item.unitPriceGel.toString(),
    vatAmount: item.vatAmount.toString(),
    totalGel: item.totalGel.toString(),
  }));

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    orderId: invoice.orderId,
    orderNumber: invoice.order.orderNumber,
    userId: invoice.userId,
    status: invoice.status,
    issueDate: invoice.issueDate.toISOString(),
    buyerName: invoice.buyerName,
    buyerTaxId: invoice.buyerTaxId,
    buyerPersonalId: invoice.buyerPersonalId,
    buyerAddress: invoice.buyerAddress,
    buyerPhone: invoice.buyerPhone,
    buyerEmail: invoice.buyerEmail,
    seller: getSellerDetails(),
    subtotalGel: invoice.subtotalGel.toString(),
    vatAmount: invoice.vatAmount.toString(),
    discountGel: invoice.discountGel.toString(),
    creditsUsedGel: invoice.creditsUsedGel.toString(),
    totalGel: invoice.totalGel.toString(),
    items,
    notes: invoice.notes,
    createdAt: invoice.createdAt.toISOString(),
  };
}

/**
 * Map invoice to summary
 */
function toInvoiceSummary(invoice: NonNullable<Awaited<ReturnType<typeof invoicesRepo.findById>>>): InvoiceSummary {
  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    orderNumber: invoice.order.orderNumber,
    buyerName: invoice.buyerName,
    totalGel: invoice.totalGel.toString(),
    issueDate: invoice.issueDate.toISOString(),
    status: invoice.status,
  };
}

/**
 * Auto-generate invoice when order transitions to APPROVED
 */
export async function generateInvoiceForOrder(orderId: string): Promise<InvoiceResponse> {
  // Check if invoice already exists for this order
  const existing = await invoicesRepo.findByOrderId(orderId);
  if (existing) {
    throw new ConflictError(
      'INVOICE_ALREADY_EXISTS',
      `Invoice already exists for order ${orderId}`
    );
  }

  // Fetch order with items and user (including billing fields)
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: {
            select: { id: true, name: true },
          },
        },
      },
      user: {
        select: {
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          address: true,
          companyName: true,
          taxId: true,
          personalId: true,
        },
      },
    },
  });

  if (!order) {
    throw new NotFoundError('ORDER_NOT_FOUND', 'Order not found');
  }

  // Generate invoice number
  const invoiceNumber = await invoicesRepo.generateInvoiceNumber();

  // Determine buyer name: use company name for B2B, or full name for B2C
  const buyerName = order.user.companyName || `${order.user.firstName} ${order.user.lastName}`;

  // Calculate VAT breakdown for total
  const orderTotal = order.totalGel;
  const { subtotal: invoiceSubtotal, vat: invoiceVat } = calculateVatBreakdown(orderTotal);

  // Build invoice items with VAT breakdown
  const invoiceItemsData = order.items.map((item) => {
    const itemTotal = item.unitPriceGel.mul(item.quantity);
    const { subtotal: itemSubtotal, vat: itemVat } = calculateVatBreakdown(itemTotal);

    return {
      product: { connect: { id: item.productId } },
      productName: item.product.name,
      quantity: item.quantity,
      unitPriceGel: item.unitPriceGel,
      vatAmount: itemVat,
      totalGel: itemTotal,
    };
  });

  // Create invoice with items in a transaction
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber,
      order: { connect: { id: orderId } },
      user: { connect: { id: order.userId } },
      status: 'ISSUED',
      buyerName,
      buyerTaxId: order.user.taxId,
      buyerPersonalId: order.user.personalId,
      buyerAddress: order.user.address,
      buyerPhone: order.user.phone,
      buyerEmail: order.user.email,
      subtotalGel: invoiceSubtotal,
      vatAmount: invoiceVat,
      discountGel: order.discountGel,
      creditsUsedGel: order.creditsUsedGel,
      totalGel: orderTotal,
      items: {
        create: invoiceItemsData,
      },
    },
    include: {
      items: {
        include: {
          product: {
            select: { name: true },
          },
        },
      },
      order: {
        select: { orderNumber: true },
      },
      user: {
        select: { email: true, firstName: true, lastName: true },
      },
    },
  });

  logger.info(
    { invoiceId: invoice.id, invoiceNumber, orderId },
    'Invoice generated'
  );

  return toInvoiceResponse(invoice);
}

/**
 * Get invoice by ID
 */
export async function getById(invoiceId: string): Promise<InvoiceResponse> {
  const invoice = await invoicesRepo.findById(invoiceId);

  if (!invoice) {
    throw new NotFoundError('INVOICE_NOT_FOUND', 'Invoice not found');
  }

  return toInvoiceResponse(invoice);
}

/**
 * Get invoice by ID for user (checks ownership)
 */
export async function getByIdForUser(
  invoiceId: string,
  userId: string
): Promise<InvoiceResponse> {
  const invoice = await invoicesRepo.findById(invoiceId);

  if (!invoice) {
    throw new NotFoundError('INVOICE_NOT_FOUND', 'Invoice not found');
  }

  if (invoice.userId !== userId) {
    throw new ForbiddenError('INVOICE_ACCESS_DENIED', 'Access denied to this invoice');
  }

  return toInvoiceResponse(invoice);
}

/**
 * Get invoice by order ID
 */
export async function getByOrderId(orderId: string): Promise<InvoiceResponse> {
  const invoice = await invoicesRepo.findByOrderId(orderId);

  if (!invoice) {
    throw new NotFoundError('INVOICE_NOT_FOUND', 'No invoice found for this order');
  }

  return toInvoiceResponse(invoice);
}

/**
 * List invoices with filters
 */
export async function listInvoices(
  filters: InvoiceListFilters,
  page: number,
  limit: number
): Promise<{ invoices: InvoiceSummary[]; total: number }> {
  const { invoices, total } = await invoicesRepo.findMany(filters, page, limit);

  return {
    invoices: invoices.map(toInvoiceSummary),
    total,
  };
}

/**
 * Get user's invoices
 */
export async function getUserInvoices(
  userId: string,
  page: number,
  limit: number
): Promise<{ invoices: InvoiceSummary[]; total: number }> {
  const { invoices, total } = await invoicesRepo.findByUserId(userId, page, limit);

  return {
    invoices: invoices.map(toInvoiceSummary),
    total,
  };
}
/**
 * Generate a demo invoice PDF for testing
 */
export async function generateDemoInvoicePdf(): Promise<Buffer> {
  // Create a mock invoice object matching InvoiceResponse interface
  const demoInvoice: InvoiceResponse = {
    id: 'demo-id',
    invoiceNumber: 'INV-DEMO-001',
    orderId: 'demo-order-id',
    orderNumber: 'ORD-2024-DEMO',
    userId: 'demo-user-id',
    status: 'ISSUED',
    issueDate: new Date().toISOString(),
    buyerName: 'შპს დემო კომპანია',
    buyerTaxId: '123456789',
    buyerPersonalId: null,
    buyerAddress: 'თბილისი, რუსთაველის გამზ. 1',
    buyerPhone: '599 00 00 00',
    buyerEmail: 'demo@example.com',
    seller: getSellerDetails(), // Reuse existing helper
    subtotalGel: '100.00',
    vatAmount: '18.00',
    discountGel: '0.00',
    creditsUsedGel: '0.00',
    totalGel: '118.00',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'ვარდი "Red Naomi" (60სმ)',
        quantity: 50,
        unitPriceGel: '2.00',
        vatAmount: '0.36',
        totalGel: '118.00', // 2 * 50 + vat? No, totalGel is usually inclusive. Let's make it consistent.
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        productName: 'ტიტები (მიქსი)',
        quantity: 100,
        unitPriceGel: '1.50',
        vatAmount: '27.00', // (150 / 1.18) * 0.18 appx
        totalGel: '150.00', // 1.5 * 100
      }
    ],
    notes: 'ეს არის სატესტო ინვოისი',
    createdAt: new Date().toISOString(),
  };

  // Recalculate totals to be mathematically correct for the PDF
  // Item 1: 50 * 2.00 = 100.00. VAT = 100 - (100/1.18) = 15.25...
  // Let's use the helper calculateVatBreakdown
  const item1Total = new Prisma.Decimal(100);
  const { vat: item1Vat } = calculateVatBreakdown(item1Total);

  const item2Total = new Prisma.Decimal(150);
  const { vat: item2Vat } = calculateVatBreakdown(item2Total);

  demoInvoice.items[0].totalGel = '100.00';
  demoInvoice.items[0].vatAmount = item1Vat.toFixed(2);

  demoInvoice.items[1].totalGel = '150.00';
  demoInvoice.items[1].vatAmount = item2Vat.toFixed(2);

  demoInvoice.subtotalGel = new Prisma.Decimal(250).div(1.18).toFixed(2);
  demoInvoice.vatAmount = new Prisma.Decimal(250).sub(new Prisma.Decimal(250).div(1.18)).toFixed(2);
  demoInvoice.totalGel = '250.00';

  return generateInvoicePdf(demoInvoice);
}
