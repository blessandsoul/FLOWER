/**
 * Settings Repository
 * Database operations for global settings
 */

import { prisma } from '@/libs/prisma';
import { Prisma, GlobalSettings, Order, Product, Batch } from '@prisma/client';

// Singleton settings ID
const SETTINGS_ID = 'global-settings';

/**
 * Get global settings (creates default if not exists)
 */
export async function getSettings(): Promise<GlobalSettings> {
  let settings = await prisma.globalSettings.findUnique({
    where: { id: SETTINGS_ID },
  });

  if (!settings) {
    // Create default settings
    settings = await prisma.globalSettings.create({
      data: {
        id: SETTINGS_ID,
        stockVisibilityPercentage: 40,
        defaultMarkupPercentage: 40,
        eurToGelRate: new Prisma.Decimal('3.50'),
        minOrderAmount: new Prisma.Decimal('0'),
        maxOrderItems: 100,
        orderCutoffHour: 18,
        maintenanceMode: false,
      },
    });
  }

  return settings;
}

/**
 * Update global settings
 */
export async function updateSettings(
  data: Prisma.GlobalSettingsUpdateInput
): Promise<GlobalSettings> {
  return prisma.globalSettings.update({
    where: { id: SETTINGS_ID },
    data,
  });
}

/**
 * Get order stats for dashboard
 */
export async function getOrderStats(): Promise<{
  pending: number;
  approved: number;
  shipped: number;
  todayTotal: number;
}> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [pending, approved, shipped, todayTotal] = await Promise.all([
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'APPROVED' } }),
    prisma.order.count({ where: { status: 'SHIPPED' } }),
    prisma.order.count({
      where: {
        createdAt: { gte: today },
      },
    }),
  ]);

  return { pending, approved, shipped, todayTotal };
}

/**
 * Get product stats for dashboard
 */
export async function getProductStats(): Promise<{
  total: number;
  lowStock: number;
  outOfStock: number;
}> {
  const [total, lowStock, outOfStock] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({
      where: {
        isActive: true,
        availableQty: { gt: 0, lte: 10 },
      },
    }),
    prisma.product.count({
      where: {
        isActive: true,
        availableQty: 0,
      },
    }),
  ]);

  return { total, lowStock, outOfStock };
}

/**
 * Get batch stats for dashboard
 */
export async function getBatchStats(): Promise<{
  inTransit: number;
  expectedThisWeek: number;
}> {
  const now = new Date();
  const endOfWeek = new Date();
  endOfWeek.setDate(now.getDate() + 7);

  const [inTransit, expectedThisWeek] = await Promise.all([
    prisma.batch.count({ where: { status: 'IN_TRANSIT' } }),
    prisma.batch.count({
      where: {
        status: { in: ['ORDERED', 'IN_TRANSIT'] },
        expectedArrivalDate: {
          gte: now,
          lte: endOfWeek,
        },
      },
    }),
  ]);

  return { inTransit, expectedThisWeek };
}

/**
 * Get revenue stats for dashboard
 */
export async function getRevenueStats(): Promise<{
  today: Prisma.Decimal;
  thisWeek: Prisma.Decimal;
  thisMonth: Prisma.Decimal;
}> {
  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  weekStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [todayResult, weekResult, monthResult] = await Promise.all([
    prisma.order.aggregate({
      where: {
        createdAt: { gte: todayStart },
        status: { not: 'CANCELLED' },
      },
      _sum: { totalGel: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: weekStart },
        status: { not: 'CANCELLED' },
      },
      _sum: { totalGel: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: monthStart },
        status: { not: 'CANCELLED' },
      },
      _sum: { totalGel: true },
    }),
  ]);

  return {
    today: todayResult._sum.totalGel ?? new Prisma.Decimal(0),
    thisWeek: weekResult._sum.totalGel ?? new Prisma.Decimal(0),
    thisMonth: monthResult._sum.totalGel ?? new Prisma.Decimal(0),
  };
}
