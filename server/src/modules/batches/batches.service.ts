/**
 * Batches Service
 * Business logic for import batch management
 */

import { Prisma } from '@prisma/client';
import { logger } from '@/libs/logger';
import { prisma } from '@/libs/prisma';
import { NotFoundError, BadRequestError, ConflictError } from '@/shared/errors/errors';
import * as batchesRepo from './batches.repo';
import * as productsRepo from '../products/products.repo';
import type {
  BatchResponse,
  BatchDetailResponse,
  BatchItemResponse,
  BatchListFilters,
} from './batches.types';
import type {
  CreateBatchInput,
  UpdateBatchInput,
  ReceiveBatchItemsInput,
} from './batches.schemas';

/**
 * Map batch to response
 */
function toBatchResponse(batch: Prisma.BatchGetPayload<{}>): BatchResponse {
  return {
    id: batch.id,
    batchNumber: batch.batchNumber,
    origin: batch.origin,
    supplier: batch.supplier,
    expectedArrivalDate: batch.expectedArrivalDate.toISOString(),
    actualArrivalDate: batch.actualArrivalDate?.toISOString() ?? null,
    status: batch.status,
    totalItems: batch.totalItems,
    totalCostEur: batch.totalCostEur.toString(),
    notes: batch.notes,
    createdAt: batch.createdAt.toISOString(),
    updatedAt: batch.updatedAt.toISOString(),
  };
}

/**
 * Map batch item to response
 */
function toBatchItemResponse(
  item: Prisma.BatchItemGetPayload<{ include: { product: { select: { name: true } } } }>
): BatchItemResponse {
  const totalCost = item.unitCostEur.mul(item.quantityOrdered);
  return {
    id: item.id,
    batchId: item.batchId,
    productId: item.productId,
    productName: item.product.name,
    quantityOrdered: item.quantityOrdered,
    quantityReceived: item.quantityReceived,
    unitCostEur: item.unitCostEur.toString(),
    totalCostEur: totalCost.toString(),
  };
}

/**
 * Get batch by ID with items
 */
export async function getById(batchId: string): Promise<BatchDetailResponse> {
  const batch = await batchesRepo.findById(batchId);

  if (!batch) {
    throw new NotFoundError('BATCH_NOT_FOUND', 'Batch not found');
  }

  return {
    ...toBatchResponse(batch),
    items: batch.items.map(toBatchItemResponse),
  };
}

/**
 * List batches with filters
 */
export async function listBatches(
  filters: BatchListFilters,
  page: number,
  limit: number
): Promise<{ batches: BatchResponse[]; total: number }> {
  const { batches, total } = await batchesRepo.findMany(filters, page, limit);

  return {
    batches: batches.map(toBatchResponse),
    total,
  };
}

/**
 * Create new batch
 */
export async function createBatch(input: CreateBatchInput): Promise<BatchDetailResponse> {
  // Check if batch number already exists
  const existingBatch = await batchesRepo.findByBatchNumber(input.batchNumber);
  if (existingBatch) {
    throw new ConflictError('BATCH_NUMBER_EXISTS', 'Batch number already exists');
  }

  // Validate all products exist
  const productIds = input.items.map((item) => item.productId);
  const products = await productsRepo.findByIds(productIds);

  if (products.length !== productIds.length) {
    throw new BadRequestError('PRODUCT_NOT_FOUND', 'One or more products not found');
  }

  // Calculate totals
  const totalItems = input.items.reduce((sum, item) => sum + item.quantityOrdered, 0);
  const totalCostEur = input.items.reduce((sum, item) => {
    const cost = new Prisma.Decimal(item.unitCostEur).mul(item.quantityOrdered);
    return sum.add(cost);
  }, new Prisma.Decimal(0));

  // Create batch with items
  const batch = await batchesRepo.create(
    {
      batchNumber: input.batchNumber,
      origin: input.origin,
      supplier: input.supplier,
      expectedArrivalDate: new Date(input.expectedArrivalDate),
      notes: input.notes,
      status: 'ORDERED',
      totalItems,
      totalCostEur,
    },
    input.items.map((item) => ({
      productId: item.productId,
      quantityOrdered: item.quantityOrdered,
      unitCostEur: new Prisma.Decimal(item.unitCostEur),
    }))
  );

  logger.info(
    { batchId: batch.id, batchNumber: batch.batchNumber, totalItems },
    'Batch created'
  );

  return {
    ...toBatchResponse(batch),
    items: batch.items.map(toBatchItemResponse),
  };
}

/**
 * Update batch
 */
export async function updateBatch(
  batchId: string,
  input: UpdateBatchInput
): Promise<BatchResponse> {
  const existingBatch = await batchesRepo.findById(batchId);

  if (!existingBatch) {
    throw new NotFoundError('BATCH_NOT_FOUND', 'Batch not found');
  }

  const updateData: Prisma.BatchUpdateInput = {};

  if (input.supplier !== undefined) updateData.supplier = input.supplier;
  if (input.expectedArrivalDate !== undefined) {
    updateData.expectedArrivalDate = new Date(input.expectedArrivalDate);
  }
  if (input.actualArrivalDate !== undefined) {
    updateData.actualArrivalDate = new Date(input.actualArrivalDate);
  }
  if (input.status !== undefined) updateData.status = input.status;
  if (input.notes !== undefined) updateData.notes = input.notes;

  const batch = await batchesRepo.update(batchId, updateData);

  logger.info({ batchId, changes: Object.keys(updateData) }, 'Batch updated');

  return toBatchResponse(batch);
}

/**
 * Receive batch items and update product stock
 */
export async function receiveBatchItems(
  batchId: string,
  input: ReceiveBatchItemsInput
): Promise<BatchDetailResponse> {
  const batch = await batchesRepo.findById(batchId);

  if (!batch) {
    throw new NotFoundError('BATCH_NOT_FOUND', 'Batch not found');
  }

  // Process each item in a transaction
  await prisma.$transaction(async (tx) => {
    for (const item of input.items) {
      const batchItem = batch.items.find((bi) => bi.id === item.batchItemId);

      if (!batchItem) {
        throw new BadRequestError('BATCH_ITEM_NOT_FOUND', `Batch item ${item.batchItemId} not found`);
      }

      // Update batch item received quantity
      await tx.batchItem.update({
        where: { id: item.batchItemId },
        data: { quantityReceived: item.quantityReceived },
      });

      // Update product stock (add received quantity)
      const qtyDiff = item.quantityReceived - batchItem.quantityReceived;
      if (qtyDiff !== 0) {
        await tx.product.update({
          where: { id: batchItem.productId },
          data: {
            availableQty: { increment: qtyDiff },
          },
        });
      }
    }

    // Update batch status to RECEIVED if all items received
    const allReceived = batch.items.every((bi) => {
      const inputItem = input.items.find((i) => i.batchItemId === bi.id);
      const received = inputItem?.quantityReceived ?? bi.quantityReceived;
      return received >= bi.quantityOrdered;
    });

    if (allReceived) {
      await tx.batch.update({
        where: { id: batchId },
        data: {
          status: 'RECEIVED',
          actualArrivalDate: new Date(),
        },
      });
    }
  });

  // Fetch updated batch
  const updatedBatch = await batchesRepo.findById(batchId);

  logger.info(
    { batchId, itemsReceived: input.items.length },
    'Batch items received'
  );

  return {
    ...toBatchResponse(updatedBatch!),
    items: updatedBatch!.items.map(toBatchItemResponse),
  };
}

/**
 * Get pending batches for dashboard
 */
export async function getPendingBatches(): Promise<BatchResponse[]> {
  const batches = await batchesRepo.findPendingBatches();
  return batches.map(toBatchResponse);
}
