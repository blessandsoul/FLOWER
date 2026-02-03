/**
 * Auth Routes
 * Authentication and authorization endpoints
 */

import { FastifyInstance } from 'fastify';
import { authenticate } from '@/plugins/auth';
import * as authController from './auth.controller';

/**
 * Auth routes plugin
 * Prefix: /api/v1/auth
 */
export default async function authRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.post('/register', authController.register);
  fastify.post('/login', authController.login);
  fastify.post('/refresh', authController.refreshToken);

  // Protected routes
  fastify.get('/me', {
    preHandler: authenticate(),
  }, authController.getMe);

  fastify.post('/logout', {
    preHandler: authenticate(),
  }, authController.logout);
}
