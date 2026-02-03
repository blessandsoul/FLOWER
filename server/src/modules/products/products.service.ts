/**
 * Products Service
 * Business logic for product management
 */

import { Prisma } from '@prisma/client';
import { logger } from '@/libs/logger';
import { redis } from '@/libs/redis';
import { NotFoundError, BadRequestError } from '@/shared/errors/errors';
import {
  EUR_TO_GEL_RATE,
  DEFAULT_MARKUP_PERCENTAGE,
  DEFAULT_VISIBILITY_PERCENTAGE,
} from '@/config';
import * as productsRepo from './products.repo';
import type { ProductResponse, ProductListFilters } from './products.types';
import type { CreateProductInput, UpdateProductInput, StockAdjustmentInput } from './products.schemas';

// Cache key for global settings
const SETTINGS_CACHE_KEY = 'global_settings';

/**
 * Get visibility percentage from cache or use default
 */
async function getVisibilityPercentage(): Promise<number> {
  try {
    const cached = await redis.get(SETTINGS_CACHE_KEY);
    if (cached) {
      const settings = JSON.parse(cached);
      return settings.stockVisibilityPercentage ?? DEFAULT_VISIBILITY_PERCENTAGE;
    }
  } catch (error) {
    logger.warn({ error }, 'Failed to get visibility from cache');
  }
  return DEFAULT_VISIBILITY_PERCENTAGE;
}

/**
 * Calculate display quantity based on visibility percentage
 */
function calculateDisplayQty(availableQty: number, visibilityPercentage: number): number {
  return Math.floor(availableQty * (visibilityPercentage / 100));
}

/**
 * Calculate GEL price from EUR
 */
function calculateGelPrice(
  priceEur: Prisma.Decimal,
  markupPercentage: number = DEFAULT_MARKUP_PERCENTAGE
): Prisma.Decimal {
  const eurAmount = priceEur.toNumber();
  const withMarkup = eurAmount * (1 + markupPercentage / 100);
  const gelPrice = withMarkup * EUR_TO_GEL_RATE;
  return new Prisma.Decimal(gelPrice.toFixed(2));
}

/**
 * Map product entity to response
 */
async function toProductResponse(
  product: Prisma.ProductGetPayload<{ include: { category: true } }>
): Promise<ProductResponse> {
  const visibilityPercentage = await getVisibilityPercentage();
  const displayQty = calculateDisplayQty(product.availableQty, visibilityPercentage);

  return {
    id: product.id,
    name: product.name,
    nameFa: product.nameFa,
    description: product.description,
    categoryId: product.categoryId,
    categoryName: product.category?.name ?? null,
    origin: product.origin,
    stemLengthCm: product.stemLengthCm,
    stemsPerBunch: product.stemsPerBunch,
    colorGroup: product.colorGroup,
    imageUrl: product.imageUrl,
    priceEur: product.priceEur.toString(),
    priceGel: product.priceGel.toString(),
    availableQty: product.availableQty,
    displayQty,
    status: product.status,
    isActive: product.isActive,
    createdAt: product.createdAt.toISOString(),
  };
}

/**
 * Get product by ID
 */
export async function getById(productId: string): Promise<ProductResponse> {
  const product = await productsRepo.findById(productId);

  if (!product) {
    throw new NotFoundError('PRODUCT_NOT_FOUND', 'Product not found');
  }

  return toProductResponse(product);
}

/**
 * List products with filters
 */
export async function listProducts(
  filters: ProductListFilters,
  page: number,
  limit: number,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc'
): Promise<{ products: ProductResponse[]; total: number }> {
  const { products, total } = await productsRepo.findMany(
    filters,
    page,
    limit,
    sortBy,
    sortOrder
  );

  const productResponses = await Promise.all(products.map(toProductResponse));

  return { products: productResponses, total };
}

/**
 * Create product
 */
export async function createProduct(input: CreateProductInput): Promise<ProductResponse> {
  const priceEur = new Prisma.Decimal(input.priceEur);
  const markupPercentage = input.markupPercentage ?? DEFAULT_MARKUP_PERCENTAGE;
  const priceGel = calculateGelPrice(priceEur, markupPercentage);

  const product = await productsRepo.create({
    name: input.name,
    nameFa: input.nameFa,
    description: input.description,
    category: input.categoryId ? { connect: { id: input.categoryId } } : undefined,
    origin: input.origin,
    stemLengthCm: input.stemLengthCm,
    stemsPerBunch: input.stemsPerBunch,
    colorGroup: input.colorGroup,
    imageUrl: input.imageUrl,
    priceEur,
    priceGel,
    markupPercentage,
    availableQty: 0,
    status: 'ACTIVE',
    isActive: true,
  });

  logger.info({ productId: product.id, name: product.name }, 'Product created');

  return toProductResponse(product);
}

/**
 * Update product
 */
export async function updateProduct(
  productId: string,
  input: UpdateProductInput
): Promise<ProductResponse> {
  const existingProduct = await productsRepo.findById(productId);

  if (!existingProduct) {
    throw new NotFoundError('PRODUCT_NOT_FOUND', 'Product not found');
  }

  const updateData: Prisma.ProductUpdateInput = {};

  if (input.name !== undefined) updateData.name = input.name;
  if (input.nameFa !== undefined) updateData.nameFa = input.nameFa;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.categoryId !== undefined) {
    updateData.category = input.categoryId
      ? { connect: { id: input.categoryId } }
      : { disconnect: true };
  }
  if (input.origin !== undefined) updateData.origin = input.origin;
  if (input.stemLengthCm !== undefined) updateData.stemLengthCm = input.stemLengthCm;
  if (input.stemsPerBunch !== undefined) updateData.stemsPerBunch = input.stemsPerBunch;
  if (input.colorGroup !== undefined) updateData.colorGroup = input.colorGroup;
  if (input.imageUrl !== undefined) updateData.imageUrl = input.imageUrl;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.isActive !== undefined) updateData.isActive = input.isActive;

  // Recalculate GEL price if EUR price or markup changed
  if (input.priceEur !== undefined || input.markupPercentage !== undefined) {
    const newPriceEur = input.priceEur
      ? new Prisma.Decimal(input.priceEur)
      : existingProduct.priceEur;
    const newMarkup = input.markupPercentage ?? existingProduct.markupPercentage;

    updateData.priceEur = newPriceEur;
    updateData.markupPercentage = newMarkup;
    updateData.priceGel = calculateGelPrice(newPriceEur, newMarkup);
  }

  const product = await productsRepo.update(productId, updateData);

  logger.info({ productId, changes: Object.keys(updateData) }, 'Product updated');

  return toProductResponse(product);
}

/**
 * Adjust product stock
 */
export async function adjustStock(
  productId: string,
  input: StockAdjustmentInput
): Promise<ProductResponse> {
  const product = await productsRepo.findById(productId);

  if (!product) {
    throw new NotFoundError('PRODUCT_NOT_FOUND', 'Product not found');
  }

  const newQty = product.availableQty + input.quantity;

  if (newQty < 0) {
    throw new BadRequestError(
      'PRODUCT_INSUFFICIENT_STOCK',
      `Cannot reduce stock below 0. Current: ${product.availableQty}, Adjustment: ${input.quantity}`
    );
  }

  const updatedProduct = await productsRepo.updateStock(productId, newQty);

  logger.info(
    {
      productId,
      previousQty: product.availableQty,
      adjustment: input.quantity,
      newQty,
      reason: input.reason,
    },
    'Stock adjusted'
  );

  return toProductResponse(updatedProduct);
}

/**
 * Get all categories
 */
export async function getCategories() {
  return productsRepo.findAllCategories();
}
