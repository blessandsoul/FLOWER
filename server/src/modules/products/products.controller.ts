/**
 * Products Controller
 * Handles HTTP requests for product management
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { successResponse, paginatedResponse } from '@/shared/helpers/response';
import * as productsService from './products.service';
import {
  CreateProductSchema,
  UpdateProductSchema,
  ProductListQuerySchema,
  ProductIdParamSchema,
  StockAdjustmentSchema,
} from './products.schemas';

/**
 * GET /products
 * List all products with filters
 */
export async function listProducts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = ProductListQuerySchema.parse(request.query);
  const { page, limit, sortBy, sortOrder, ...filters } = query;

  const { products, total } = await productsService.listProducts(
    filters,
    page,
    limit,
    sortBy,
    sortOrder
  );

  return reply.send(
    paginatedResponse('Products retrieved', products, page, limit, total)
  );
}

/**
 * GET /products/:id
 * Get product by ID
 */
export async function getProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = ProductIdParamSchema.parse(request.params);
  const product = await productsService.getById(id);

  return reply.send(
    successResponse('Product retrieved', product)
  );
}

/**
 * POST /products
 * Create new product (admin/operator only)
 */
export async function createProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const input = CreateProductSchema.parse(request.body);
  const product = await productsService.createProduct(input);

  return reply.status(201).send(
    successResponse('Product created', product)
  );
}

/**
 * PATCH /products/:id
 * Update product (admin/operator only)
 */
export async function updateProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = ProductIdParamSchema.parse(request.params);
  const input = UpdateProductSchema.parse(request.body);

  const product = await productsService.updateProduct(id, input);

  return reply.send(
    successResponse('Product updated', product)
  );
}

/**
 * POST /products/:id/stock
 * Adjust product stock (admin/operator/logistics only)
 */
export async function adjustStock(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = ProductIdParamSchema.parse(request.params);
  const input = StockAdjustmentSchema.parse(request.body);

  const product = await productsService.adjustStock(id, input);

  return reply.send(
    successResponse('Stock adjusted', product)
  );
}

/**
 * GET /products/categories
 * Get all product categories
 */
export async function getCategories(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const categories = await productsService.getCategories();

  return reply.send(
    successResponse('Categories retrieved', categories)
  );
}
