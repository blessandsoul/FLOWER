/**
 * Settings Routes
 * Global settings and dashboard endpoints
 */

import { FastifyInstance } from 'fastify';
import { authenticate } from '@/plugins/auth';
import { USER_ROLES } from '@/config/constants';
import * as settingsController from './settings.controller';

/**
 * Settings routes plugin
 * Prefix: /api/v1/settings
 */
export default async function settingsRoutes(fastify: FastifyInstance) {
  // Get settings (admin/operator)
  fastify.get('/', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR]),
  }, settingsController.getSettings);

  // Update settings (admin only)
  fastify.patch('/', {
    preHandler: authenticate([USER_ROLES.ADMIN]),
  }, settingsController.updateSettings);

  // Dashboard stats (admin/operator)
  fastify.get('/dashboard', {
    preHandler: authenticate([USER_ROLES.ADMIN, USER_ROLES.OPERATOR]),
  }, settingsController.getDashboardStats);
}
