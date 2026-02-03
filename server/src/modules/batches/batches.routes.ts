/**
 * Batches Routes
 * Import batch management endpoints
 */

import { FastifyInstance } from 'fastify';
import { authenticate } from '@/plugins/auth';
import { USER_ROLES } from '@/config/constants';
import * as batchesController from './batches.controller';

/**
 * Batches routes plugin
 * Prefix: /api/v1/batches
 */
export default async function batchesRoutes(fastify: FastifyInstance) {
  // List batches (operator/logistics/admin)
  fastify.get('/', {
    preHandler: authenticate([
      USER_ROLES.ADMIN,
      USER_ROLES.OPERATOR,
      USER_ROLES.LOGISTICS,
    ]),
  }, batchesController.listBatches);

  // Get pending batches for dashboard
  fastify.get('/pending', {
    preHandler: authenticate([
      USER_ROLES.ADMIN,
      USER_ROLES.OPERATOR,
      USER_ROLES.LOGISTICS,
    ]),
  }, batchesController.getPendingBatches);

  // Get batch by ID
  fastify.get('/:id', {
    preHandler: authenticate([
      USER_ROLES.ADMIN,
      USER_ROLES.OPERATOR,
      USER_ROLES.LOGISTICS,
    ]),
  }, batchesController.getBatch);

  // Create batch (operator only)
  fastify.post('/', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR]),
  }, batchesController.createBatch);

  // Update batch (operator only)
  fastify.patch('/:id', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR]),
  }, batchesController.updateBatch);

  // Receive batch items (logistics/operator)
  fastify.post('/:id/receive', {
    preHandler: authenticate([
      USER_ROLES.ADMIN,
      USER_ROLES.OPERATOR,
      USER_ROLES.LOGISTICS,
    ]),
  }, batchesController.receiveBatchItems);
}
