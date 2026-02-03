/**
 * Invoices Repository
 * Database operations for invoices
 */

import { prisma } from '@/libs/prisma';
import { Prisma, Invoice, InvoiceItem, InvoiceStatus as PrismaInvoiceStatus } from '@prisma/client';
import { calculateOffset } from '@/shared/helpers/pagination';
import type { InvoiceListFilters } from './invoices.types';

type InvoiceWithDetails = Invoice & {
  items: (InvoiceItem & { product: { name: true } })[];
  order: { orderNumber: string };
  user: { email: string; firstName: string; lastName: string };
};

const invoiceInclude = {
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
} satisfies Prisma.InvoiceInclude;

/**
 * Generate unique invoice number
 */
export async function generateInvoiceNumber(): Promise<string> {
  const date = new Date();
  const prefix = `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;

  const count = await prisma.invoice.count({
    where: {
      invoiceNumber: { startsWith: prefix },
    },
  });

  return `${prefix}-${String(count + 1).padStart(5, '0')}`;
}

/**
 * Find invoice by ID with details
 */
export async function findById(id: string) {
  return prisma.invoice.findUnique({
    where: { id },
    include: invoiceInclude,
  });
}

/**
 * Find invoice by order ID
 */
export async function findByOrderId(orderId: string) {
  return prisma.invoice.findUnique({
    where: { orderId },
    include: invoiceInclude,
  });
}

/**
 * List invoices with filters and pagination
 */
export async function findMany(
  filters: InvoiceListFilters,
  page: number,
  limit: number
) {
  const where: Prisma.InvoiceWhereInput = {};

  if (filters.userId) {
    where.userId = filters.userId;
  }

  if (filters.status) {
    where.status = filters.status as PrismaInvoiceStatus;
  }

  if (filters.fromDate) {
    where.issueDate = {
      ...((where.issueDate as Prisma.DateTimeFilter) || {}),
      gte: new Date(filters.fromDate),
    };
  }

  if (filters.toDate) {
    where.issueDate = {
      ...((where.issueDate as Prisma.DateTimeFilter) || {}),
      lte: new Date(filters.toDate),
    };
  }

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where,
      include: invoiceInclude,
      skip: calculateOffset(page, limit),
      take: limit,
      orderBy: { issueDate: 'desc' },
    }),
    prisma.invoice.count({ where }),
  ]);

  return { invoices, total };
}

/**
 * Find invoices by user ID
 */
export async function findByUserId(
  userId: string,
  page: number,
  limit: number
) {
  return findMany({ userId }, page, limit);
}

/**
 * Create invoice with items
 */
export async function create(data: Prisma.InvoiceCreateInput) {
  return prisma.invoice.create({
    data,
    include: invoiceInclude,
  });
}

/**
 * Update invoice status
 */
export async function updateStatus(id: string, status: PrismaInvoiceStatus) {
  return prisma.invoice.update({
    where: { id },
    data: { status },
    include: invoiceInclude,
  });
}
