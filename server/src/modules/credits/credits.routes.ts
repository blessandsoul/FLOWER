/**
 * Credits Routes
 * Credit/balance management endpoints
 */

import { FastifyInstance } from 'fastify';
import { authenticate } from '@/plugins/auth';
import { USER_ROLES } from '@/config/constants';
import * as creditsController from './credits.controller';

/**
 * Credits routes plugin
 * Prefix: /api/v1/credits
 */
export default async function creditsRoutes(fastify: FastifyInstance) {
  // Customer routes
  fastify.get('/balance', {
    preHandler: authenticate(),
  }, creditsController.getMyBalance);

  fastify.get('/transactions', {
    preHandler: authenticate(),
  }, creditsController.getMyTransactions);

  // Admin routes
  fastify.get('/admin/transactions', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.ACCOUNTANT]),
  }, creditsController.listTransactions);

  fastify.get('/admin/users/:userId/balance', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.ACCOUNTANT]),
  }, creditsController.getUserBalance);

  fastify.post('/admin/add', {
    preHandler: authenticate([USER_ROLES.ADMIN]),
  }, creditsController.addCredits);
}
