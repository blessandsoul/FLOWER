/**
 * Users Routes
 * User management endpoints
 */

import { FastifyInstance } from 'fastify';
import { authenticate } from '@/plugins/auth';
import { USER_ROLES } from '@/config/constants';
import * as usersController from './users.controller';

/**
 * Users routes plugin
 * Prefix: /api/v1/users
 */
export default async function usersRoutes(fastify: FastifyInstance) {
  // Current user routes (authenticated)
  fastify.patch('/me', {
    preHandler: authenticate(),
  }, usersController.updateMe);

  fastify.patch('/me/billing', {
    preHandler: authenticate(),
  }, usersController.updateBilling);

  fastify.get('/me/balance', {
    preHandler: authenticate(),
  }, usersController.getMyBalance);

  // Admin routes
  fastify.get('/', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR]),
  }, usersController.listUsers);

  fastify.get('/:id', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR]),
  }, usersController.getUser);

  fastify.patch('/:id', {
    preHandler: authenticate([USER_ROLES.ADMIN]),
  }, usersController.updateUser);
}
