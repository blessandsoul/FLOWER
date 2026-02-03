/**
 * Products Repository
 * Database operations for products
 */

import { prisma } from '@/libs/prisma';
import { Prisma, Product } from '@prisma/client';
import { calculateOffset } from '@/shared/helpers/pagination';
import type { ProductListFilters } from './products.types';

/** Product with the category relation included */
export type ProductWithCategory = Prisma.ProductGetPayload<{
  include: { category: true };
}>;

/**
 * Find product by ID
 */
export async function findById(id: string): Promise<ProductWithCategory | null> {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
    },
  });
}

/**
 * List products with filters and pagination
 */
export async function findMany(
  filters: ProductListFilters,
  page: number,
  limit: number,
  sortBy: string = 'createdAt',
  sortOrder: 'asc' | 'desc' = 'desc'
): Promise<{ products: ProductWithCategory[]; total: number }> {
  const where: Prisma.ProductWhereInput = {};

  // Apply filters
  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.origin) {
    where.origin = filters.origin;
  }

  if (filters.colorGroup) {
    where.colorGroup = filters.colorGroup;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.isActive !== undefined) {
    where.isActive = filters.isActive;
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search } },
      { nameFa: { contains: filters.search } },
      { description: { contains: filters.search } },
    ];
  }

  if (filters.minPrice !== undefined) {
    where.priceEur = {
      ...((where.priceEur as Prisma.DecimalFilter) || {}),
      gte: filters.minPrice,
    };
  }

  if (filters.maxPrice !== undefined) {
    where.priceEur = {
      ...((where.priceEur as Prisma.DecimalFilter) || {}),
      lte: filters.maxPrice,
    };
  }

  if (filters.inStock) {
    where.availableQty = { gt: 0 };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput = {
    [sortBy]: sortOrder,
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      skip: calculateOffset(page, limit),
      take: limit,
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  return { products, total };
}

/**
 * Create product
 */
export async function create(data: Prisma.ProductCreateInput): Promise<ProductWithCategory> {
  return prisma.product.create({
    data,
    include: { category: true },
  });
}

/**
 * Update product
 */
export async function update(
  id: string,
  data: Prisma.ProductUpdateInput
): Promise<ProductWithCategory> {
  return prisma.product.update({
    where: { id },
    data,
    include: { category: true },
  });
}

/**
 * Update product stock
 */
export async function updateStock(
  id: string,
  quantity: number
): Promise<ProductWithCategory> {
  return prisma.product.update({
    where: { id },
    data: { availableQty: quantity },
    include: { category: true },
  });
}

/**
 * Increment product stock
 */
export async function incrementStock(
  id: string,
  amount: number
): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data: {
      availableQty: { increment: amount },
    },
  });
}

/**
 * Decrement product stock
 */
export async function decrementStock(
  id: string,
  amount: number
): Promise<Product> {
  return prisma.product.update({
    where: { id },
    data: {
      availableQty: { decrement: amount },
    },
  });
}

/**
 * Get all product categories
 */
export async function findAllCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
}

/**
 * Find products by IDs
 */
export async function findByIds(ids: string[]): Promise<Product[]> {
  return prisma.product.findMany({
    where: { id: { in: ids } },
  });
}
