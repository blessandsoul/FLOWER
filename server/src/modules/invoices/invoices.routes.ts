/**
 * Invoices Routes
 * Invoice management endpoints
 */

import { FastifyInstance } from 'fastify';
import { authenticate } from '@/plugins/auth';
import { USER_ROLES } from '@/config/constants';
import * as invoicesController from './invoices.controller';

/**
 * Invoices routes plugin
 * Prefix: /api/v1/invoices
 */
export default async function invoicesRoutes(fastify: FastifyInstance) {
  fastify.get('/ping', async () => ({ status: 'pong' }));

  // Customer routes
  fastify.get('/my', {
    preHandler: authenticate(),
  }, invoicesController.getMyInvoices);

  fastify.get('/my/:id', {
    preHandler: authenticate(),
  }, invoicesController.getMyInvoice);

  fastify.get('/my/:id/pdf', {
    preHandler: authenticate(),
  }, invoicesController.downloadMyInvoicePdf);

  // Admin/Operator/Accountant routes
  fastify.get('/demo', {
    preHandler: authenticate(),
  }, invoicesController.downloadDemoInvoice);

  fastify.get('/', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR, USER_ROLES.ACCOUNTANT]),
  }, invoicesController.listInvoices);

  fastify.get('/order/:orderId', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR, USER_ROLES.ACCOUNTANT]),
  }, invoicesController.getInvoiceByOrder);

  fastify.get('/:id', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR, USER_ROLES.ACCOUNTANT]),
  }, invoicesController.getInvoice);

  fastify.get('/:id/pdf', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR, USER_ROLES.ACCOUNTANT]),
  }, invoicesController.downloadInvoicePdf);
}
