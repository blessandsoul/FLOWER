/**
 * Batches Controller
 * Handles HTTP requests for batch management
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { successResponse, paginatedResponse } from '@/shared/helpers/response';
import * as batchesService from './batches.service';
import {
  CreateBatchSchema,
  UpdateBatchSchema,
  ReceiveBatchItemsSchema,
  BatchListQuerySchema,
  BatchIdParamSchema,
} from './batches.schemas';

/**
 * GET /batches
 * List all batches with filters
 */
export async function listBatches(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = BatchListQuerySchema.parse(request.query);
  const { page, limit, ...filters } = query;

  const { batches, total } = await batchesService.listBatches(filters, page, limit);

  return reply.send(
    paginatedResponse('Batches retrieved', batches, page, limit, total)
  );
}

/**
 * GET /batches/pending
 * Get pending batches for dashboard
 */
export async function getPendingBatches(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const batches = await batchesService.getPendingBatches();

  return reply.send(
    successResponse('Pending batches retrieved', batches)
  );
}

/**
 * GET /batches/:id
 * Get batch by ID with items
 */
export async function getBatch(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = BatchIdParamSchema.parse(request.params);
  const batch = await batchesService.getById(id);

  return reply.send(
    successResponse('Batch retrieved', batch)
  );
}

/**
 * POST /batches
 * Create new batch (operator only)
 */
export async function createBatch(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const input = CreateBatchSchema.parse(request.body);
  const batch = await batchesService.createBatch(input);

  return reply.status(201).send(
    successResponse('Batch created', batch)
  );
}

/**
 * PATCH /batches/:id
 * Update batch (operator only)
 */
export async function updateBatch(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = BatchIdParamSchema.parse(request.params);
  const input = UpdateBatchSchema.parse(request.body);

  const batch = await batchesService.updateBatch(id, input);

  return reply.send(
    successResponse('Batch updated', batch)
  );
}

/**
 * POST /batches/:id/receive
 * Receive batch items and update stock (logistics/operator)
 */
export async function receiveBatchItems(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = BatchIdParamSchema.parse(request.params);
  const input = ReceiveBatchItemsSchema.parse(request.body);

  const batch = await batchesService.receiveBatchItems(id, input);

  return reply.send(
    successResponse('Batch items received', batch)
  );
}
