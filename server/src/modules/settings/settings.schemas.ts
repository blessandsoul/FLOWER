/**
 * Settings Module Zod Schemas
 */

import { z } from 'zod';

/**
 * Update global settings schema
 */
export const UpdateGlobalSettingsSchema = z.object({
  stockVisibilityPercentage: z.number().min(1).max(100).optional(),
  defaultMarkupPercentage: z.number().min(0).max(500).optional(),
  eurToGelRate: z.number().positive().optional(),
  minOrderAmount: z.number().min(0).optional(),
  maxOrderItems: z.number().int().min(1).max(1000).optional(),
  orderCutoffHour: z.number().int().min(0).max(23).optional(),
  maintenanceMode: z.boolean().optional(),
});

export type UpdateGlobalSettingsInput = z.infer<typeof UpdateGlobalSettingsSchema>;
