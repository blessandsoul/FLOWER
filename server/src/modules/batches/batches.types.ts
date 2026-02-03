/**
 * Batches Module Types
 * Import batches from Holland/Ecuador suppliers
 */

import type { BatchStatus, FlowerOrigin } from '@/config/constants';

/**
 * Batch response
 */
export interface BatchResponse {
  id: string;
  batchNumber: string;
  origin: FlowerOrigin;
  supplier: string | null;
  expectedArrivalDate: string;
  actualArrivalDate: string | null;
  status: BatchStatus;
  totalItems: number;
  totalCostEur: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Batch item (product in batch)
 */
export interface BatchItemResponse {
  id: string;
  batchId: string;
  productId: string;
  productName: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCostEur: string;
  totalCostEur: string;
}

/**
 * Batch with items
 */
export interface BatchDetailResponse extends BatchResponse {
  items: BatchItemResponse[];
}

/**
 * Create batch request
 */
export interface CreateBatchRequest {
  batchNumber: string;
  origin: FlowerOrigin;
  supplier?: string;
  expectedArrivalDate: string;
  notes?: string;
  items: {
    productId: string;
    quantityOrdered: number;
    unitCostEur: string;
  }[];
}

/**
 * Update batch request
 */
export interface UpdateBatchRequest {
  supplier?: string;
  expectedArrivalDate?: string;
  actualArrivalDate?: string;
  status?: BatchStatus;
  notes?: string;
}

/**
 * Receive batch items request
 */
export interface ReceiveBatchItemsRequest {
  items: {
    batchItemId: string;
    quantityReceived: number;
  }[];
}

/**
 * Batch list filters
 */
export interface BatchListFilters {
  origin?: FlowerOrigin;
  status?: BatchStatus;
  fromDate?: string;
  toDate?: string;
}
