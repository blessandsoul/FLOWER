/**
 * Orders Routes
 * Order management endpoints
 */

import { FastifyInstance } from 'fastify';
import { authenticate } from '@/plugins/auth';
import { USER_ROLES } from '@/config/constants';
import * as ordersController from './orders.controller';

/**
 * Orders routes plugin
 * Prefix: /api/v1/orders
 */
export default async function ordersRoutes(fastify: FastifyInstance) {
  // Customer routes
  fastify.post('/calculate', {
    preHandler: authenticate(),
  }, ordersController.calculatePrice);

  fastify.post('/', {
    preHandler: authenticate(),
  }, ordersController.createOrder);

  fastify.get('/my', {
    preHandler: authenticate(),
  }, ordersController.getMyOrders);

  fastify.get('/my/:id', {
    preHandler: authenticate(),
  }, ordersController.getMyOrder);

  // Admin/Operator routes
  fastify.get('/', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR]),
  }, ordersController.listOrders);

  fastify.get('/pending', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR]),
  }, ordersController.getPendingOrders);

  fastify.get('/:id', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR]),
  }, ordersController.getOrder);

  fastify.patch('/:id/status', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR]),
  }, ordersController.updateOrderStatus);
}
