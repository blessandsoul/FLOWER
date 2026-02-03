/**
 * Settings Module Types
 */

/**
 * Global settings response
 */
export interface GlobalSettingsResponse {
  stockVisibilityPercentage: number;
  defaultMarkupPercentage: number;
  eurToGelRate: number;
  minOrderAmount: number;
  maxOrderItems: number;
  orderCutoffHour: number;
  maintenanceMode: boolean;
  updatedAt: string;
}

/**
 * Update global settings request
 */
export interface UpdateGlobalSettingsRequest {
  stockVisibilityPercentage?: number;
  defaultMarkupPercentage?: number;
  eurToGelRate?: number;
  minOrderAmount?: number;
  maxOrderItems?: number;
  orderCutoffHour?: number;
  maintenanceMode?: boolean;
}

/**
 * Dashboard stats response
 */
export interface DashboardStatsResponse {
  orders: {
    pending: number;
    approved: number;
    shipped: number;
    todayTotal: number;
  };
  products: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
  batches: {
    inTransit: number;
    expectedThisWeek: number;
  };
  revenue: {
    today: string;
    thisWeek: string;
    thisMonth: string;
  };
}
