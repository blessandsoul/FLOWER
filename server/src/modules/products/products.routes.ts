/**
 * Products Routes
 * Product management endpoints
 */

import { FastifyInstance } from 'fastify';
import { authenticate, optionalAuth } from '@/plugins/auth';
import { USER_ROLES } from '@/config/constants';
import * as productsController from './products.controller';

/**
 * Products routes plugin
 * Prefix: /api/v1/products
 */
export default async function productsRoutes(fastify: FastifyInstance) {
  // Public routes (with optional auth for personalized pricing)
  fastify.get('/', {
    preHandler: optionalAuth(),
  }, productsController.listProducts);

  fastify.get('/categories', productsController.getCategories);

  fastify.get('/:id', {
    preHandler: optionalAuth(),
  }, productsController.getProduct);

  // Admin/Operator routes
  fastify.post('/', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR]),
  }, productsController.createProduct);

  fastify.patch('/:id', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR]),
  }, productsController.updateProduct);

  // Stock management (admin/operator/logistics)
  fastify.post('/:id/stock', {
    preHandler: authenticate([
      USER_ROLES.ADMIN,
      USER_ROLES.OPERATOR,
      USER_ROLES.LOGISTICS,
    ]),
  }, productsController.adjustStock);
}
