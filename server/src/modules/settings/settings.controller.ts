/**
 * Settings Controller
 * Handles HTTP requests for settings and dashboard
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { successResponse } from '@/shared/helpers/response';
import * as settingsService from './settings.service';
import { UpdateGlobalSettingsSchema } from './settings.schemas';

/**
 * GET /settings
 * Get global settings
 */
export async function getSettings(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const settings = await settingsService.getSettings();

  return reply.send(
    successResponse('Settings retrieved', settings)
  );
}

/**
 * PATCH /settings
 * Update global settings (admin only)
 */
export async function updateSettings(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const input = UpdateGlobalSettingsSchema.parse(request.body);
  const settings = await settingsService.updateSettings(input);

  return reply.send(
    successResponse('Settings updated', settings)
  );
}

/**
 * GET /settings/dashboard
 * Get dashboard stats (admin/operator)
 */
export async function getDashboardStats(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const stats = await settingsService.getDashboardStats();

  return reply.send(
    successResponse('Dashboard stats retrieved', stats)
  );
}
