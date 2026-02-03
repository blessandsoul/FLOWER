/**
 * Settings Service
 * Business logic for global settings and dashboard
 */

import { Prisma } from '@prisma/client';
import { logger } from '@/libs/logger';
import { redis } from '@/libs/redis';
import * as settingsRepo from './settings.repo';
import type {
  GlobalSettingsResponse,
  DashboardStatsResponse,
} from './settings.types';
import type { UpdateGlobalSettingsInput } from './settings.schemas';

// Cache key and TTL
const SETTINGS_CACHE_KEY = 'global_settings';
const SETTINGS_CACHE_TTL = 300; // 5 minutes

/**
 * Map settings to response
 */
function toSettingsResponse(
  settings: Prisma.GlobalSettingsGetPayload<{}>
): GlobalSettingsResponse {
  return {
    stockVisibilityPercentage: settings.stockVisibilityPercentage,
    defaultMarkupPercentage: settings.defaultMarkupPercentage,
    eurToGelRate: settings.eurToGelRate.toNumber(),
    minOrderAmount: settings.minOrderAmount.toNumber(),
    maxOrderItems: settings.maxOrderItems,
    orderCutoffHour: settings.orderCutoffHour,
    maintenanceMode: settings.maintenanceMode,
    updatedAt: settings.updatedAt.toISOString(),
  };
}

/**
 * Get global settings (cached)
 */
export async function getSettings(): Promise<GlobalSettingsResponse> {
  // Try cache first
  try {
    const cached = await redis.get(SETTINGS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached);
    }
  } catch (error) {
    logger.warn({ error }, 'Failed to read settings from cache');
  }

  // Fetch from database
  const settings = await settingsRepo.getSettings();
  const response = toSettingsResponse(settings);

  // Update cache
  try {
    await redis.setex(SETTINGS_CACHE_KEY, SETTINGS_CACHE_TTL, JSON.stringify(response));
  } catch (error) {
    logger.warn({ error }, 'Failed to cache settings');
  }

  return response;
}

/**
 * Update global settings
 */
export async function updateSettings(
  input: UpdateGlobalSettingsInput
): Promise<GlobalSettingsResponse> {
  const updateData: Prisma.GlobalSettingsUpdateInput = {};

  if (input.stockVisibilityPercentage !== undefined) {
    updateData.stockVisibilityPercentage = input.stockVisibilityPercentage;
  }
  if (input.defaultMarkupPercentage !== undefined) {
    updateData.defaultMarkupPercentage = input.defaultMarkupPercentage;
  }
  if (input.eurToGelRate !== undefined) {
    updateData.eurToGelRate = new Prisma.Decimal(input.eurToGelRate);
  }
  if (input.minOrderAmount !== undefined) {
    updateData.minOrderAmount = new Prisma.Decimal(input.minOrderAmount);
  }
  if (input.maxOrderItems !== undefined) {
    updateData.maxOrderItems = input.maxOrderItems;
  }
  if (input.orderCutoffHour !== undefined) {
    updateData.orderCutoffHour = input.orderCutoffHour;
  }
  if (input.maintenanceMode !== undefined) {
    updateData.maintenanceMode = input.maintenanceMode;
  }

  const settings = await settingsRepo.updateSettings(updateData);
  const response = toSettingsResponse(settings);

  // Invalidate cache
  try {
    await redis.del(SETTINGS_CACHE_KEY);
    // Re-cache immediately
    await redis.setex(SETTINGS_CACHE_KEY, SETTINGS_CACHE_TTL, JSON.stringify(response));
  } catch (error) {
    logger.warn({ error }, 'Failed to update settings cache');
  }

  logger.info({ changes: Object.keys(input) }, 'Global settings updated');

  return response;
}

/**
 * Get dashboard stats
 */
export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  const [orderStats, productStats, batchStats, revenueStats] = await Promise.all([
    settingsRepo.getOrderStats(),
    settingsRepo.getProductStats(),
    settingsRepo.getBatchStats(),
    settingsRepo.getRevenueStats(),
  ]);

  return {
    orders: orderStats,
    products: productStats,
    batches: batchStats,
    revenue: {
      today: revenueStats.today.toString(),
      thisWeek: revenueStats.thisWeek.toString(),
      thisMonth: revenueStats.thisMonth.toString(),
    },
  };
}
