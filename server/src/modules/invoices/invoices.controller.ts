/**
 * Invoices Controller
 * Handles HTTP requests for invoice management
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { successResponse, paginatedResponse } from '@/shared/helpers/response';
import * as invoicesService from './invoices.service';
import { generateInvoicePdf } from '@/libs/pdf-generator';
import { logger } from '@/libs/logger';
import {
  InvoiceIdParamSchema,
  InvoiceListQuerySchema,
  OrderIdParamSchema,
} from './invoices.schemas';
import { PaginationSchema } from '@/shared/schemas/common';

/**
 * GET /invoices/my
 * Get current user's invoices
 */
export async function getMyInvoices(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const { page, limit } = PaginationSchema.parse(request.query);

  const { invoices, total } = await invoicesService.getUserInvoices(userId, page, limit);

  return reply.send(
    paginatedResponse('Invoices retrieved', invoices, page, limit, total)
  );
}

/**
 * GET /invoices/my/:id
 * Get own invoice detail
 */
export async function getMyInvoice(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const { id } = InvoiceIdParamSchema.parse(request.params);

  const invoice = await invoicesService.getByIdForUser(id, userId);

  return reply.send(
    successResponse('Invoice retrieved', invoice)
  );
}

/**
 * GET /invoices/my/:id/pdf
 * Download own invoice as PDF
 */
export async function downloadMyInvoicePdf(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const { id } = InvoiceIdParamSchema.parse(request.params);

  const invoice = await invoicesService.getByIdForUser(id, userId);
  const pdfBuffer = await generateInvoicePdf(invoice);

  return reply
    .header('Content-Type', 'application/pdf')
    .header('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`)
    .send(pdfBuffer);
}

/**
 * GET /invoices
 * List all invoices (admin/operator/accountant)
 */
export async function listInvoices(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = InvoiceListQuerySchema.parse(request.query);
  const { page, limit, ...filters } = query;

  const { invoices, total } = await invoicesService.listInvoices(filters, page, limit);

  return reply.send(
    paginatedResponse('Invoices retrieved', invoices, page, limit, total)
  );
}

/**
 * GET /invoices/:id
 * Get invoice detail (admin/operator/accountant)
 */
export async function getInvoice(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = InvoiceIdParamSchema.parse(request.params);
  const invoice = await invoicesService.getById(id);

  return reply.send(
    successResponse('Invoice retrieved', invoice)
  );
}

/**
 * GET /invoices/:id/pdf
 * Download invoice as PDF (admin/operator/accountant)
 */
export async function downloadInvoicePdf(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = InvoiceIdParamSchema.parse(request.params);

  const invoice = await invoicesService.getById(id);
  const pdfBuffer = await generateInvoicePdf(invoice);

  return reply
    .header('Content-Type', 'application/pdf')
    .header('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`)
    .send(pdfBuffer);
}

/**
 * GET /invoices/order/:orderId
 * Get invoice by order ID (admin/operator/accountant)
 */
export async function getInvoiceByOrder(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { orderId } = OrderIdParamSchema.parse(request.params);
  const invoice = await invoicesService.getByOrderId(orderId);

  return reply.send(
    successResponse('Invoice retrieved', invoice)
  );
}

/**
 * GET /invoices/demo
 * Download a demo invoice PDF
 */
export async function downloadDemoInvoice(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const pdfBuffer = await invoicesService.generateDemoInvoicePdf();

    return reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', 'attachment; filename="demo-invoice.pdf"')
      .send(pdfBuffer);
  } catch (error: any) {
    logger.error({ err: error }, 'Failed to generate demo invoice PDF');
    return reply.status(500).send({
      message: 'PDF Generation Failed',
      error: error.message,
      stack: error.stack, // Temporary for debugging
    });
  }
}
