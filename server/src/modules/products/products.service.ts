import * as productsRepo from "./products.repo.js";
import { NotFoundError, ConflictError } from "../../libs/errors.js";
import { env } from "../../config/env.js";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  ProductWithRelations,
  ProductListItem,
  ProductDetail,
  Color,
  Grower,
  Origin,
  Tag,
} from "./products.types.js";

// ==========================================
// Transform functions for API responses
// ==========================================

/**
 * Stock data is scraped and may be stale. We display a reduced percentage
 * to avoid overselling. Controlled via STOCK_DISPLAY_RATIO env var (default 0.6 = 60%).
 */
function adjustStock(scrapedStock: number): number {
  return Math.floor(scrapedStock * env.STOCK_DISPLAY_RATIO);
}

function toProductListItem(product: ProductWithRelations): ProductListItem {
  const priceFrom = product.priceTiers.length > 0
    ? Math.min(...product.priceTiers.map((t) => t.price))
    : null;

  return {
    id: product.id,
    name: product.name,
    color: product.color?.name ?? null,
    grower: product.grower?.name ?? null,
    origin: product.origin?.name ?? null,
    stock: adjustStock(product.stock),
    orderPer: product.orderPer,
    imageFilename: product.imageFilename,
    tags: product.tags.map((t) => t.name),
    priceFrom,
    priceTiers: product.priceTiers,
  };
}

function toProductDetail(product: ProductWithRelations): ProductDetail {
  const listItem = toProductListItem(product);

  return {
    ...listItem,
    imageUrl: product.imageUrl,
    sourceScrapedAt: product.sourceScrapedAt,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    images: (product as any).images ?? [],
  };
}

// ==========================================
// Product Service Functions
// ==========================================

export async function getProductById(id: number): Promise<ProductDetail> {
  const product = await productsRepo.findProductById(id);

  if (!product) {
    throw new NotFoundError(`Product with ID ${id} not found`);
  }

  return toProductDetail(product);
}

export async function getProducts(
  filters: ProductFilters,
  page: number,
  limit: number
): Promise<{ items: ProductListItem[]; total: number }> {
  const { items, total } = await productsRepo.findProducts(filters, page, limit);

  return {
    items: items.map(toProductListItem),
    total,
  };
}

export async function createProduct(input: CreateProductInput): Promise<ProductDetail> {
  // Validate foreign keys exist if provided
  if (input.colorId) {
    const color = await productsRepo.findColorById(input.colorId);
    if (!color) {
      throw new NotFoundError(`Color with ID ${input.colorId} not found`);
    }
  }

  if (input.growerId) {
    const grower = await productsRepo.findGrowerById(input.growerId);
    if (!grower) {
      throw new NotFoundError(`Grower with ID ${input.growerId} not found`);
    }
  }

  if (input.originId) {
    const origin = await productsRepo.findOriginById(input.originId);
    if (!origin) {
      throw new NotFoundError(`Origin with ID ${input.originId} not found`);
    }
  }

  // Validate tags exist if provided
  if (input.tagIds && input.tagIds.length > 0) {
    for (const tagId of input.tagIds) {
      const tag = await productsRepo.findTagById(tagId);
      if (!tag) {
        throw new NotFoundError(`Tag with ID ${tagId} not found`);
      }
    }
  }

  const product = await productsRepo.createProduct(input);
  return toProductDetail(product);
}

export async function updateProduct(
  id: number,
  input: UpdateProductInput
): Promise<ProductDetail> {
  // Check if product exists
  const existingProduct = await productsRepo.findProductById(id);
  if (!existingProduct) {
    throw new NotFoundError(`Product with ID ${id} not found`);
  }

  // Validate foreign keys exist if provided
  if (input.colorId !== undefined && input.colorId !== null) {
    const color = await productsRepo.findColorById(input.colorId);
    if (!color) {
      throw new NotFoundError(`Color with ID ${input.colorId} not found`);
    }
  }

  if (input.growerId !== undefined && input.growerId !== null) {
    const grower = await productsRepo.findGrowerById(input.growerId);
    if (!grower) {
      throw new NotFoundError(`Grower with ID ${input.growerId} not found`);
    }
  }

  if (input.originId !== undefined && input.originId !== null) {
    const origin = await productsRepo.findOriginById(input.originId);
    if (!origin) {
      throw new NotFoundError(`Origin with ID ${input.originId} not found`);
    }
  }

  // Validate tags exist if provided
  if (input.tagIds && input.tagIds.length > 0) {
    for (const tagId of input.tagIds) {
      const tag = await productsRepo.findTagById(tagId);
      if (!tag) {
        throw new NotFoundError(`Tag with ID ${tagId} not found`);
      }
    }
  }

  const product = await productsRepo.updateProduct(id, input);
  return toProductDetail(product);
}

export async function deleteProduct(id: number): Promise<void> {
  const product = await productsRepo.findProductById(id);
  if (!product) {
    throw new NotFoundError(`Product with ID ${id} not found`);
  }

  await productsRepo.deleteProduct(id);
}

// ==========================================
// Lookup Table Service Functions
// ==========================================

// Colors
export async function getAllColors(): Promise<Color[]> {
  return productsRepo.findAllColors();
}

export async function createColor(name: string): Promise<Color> {
  const existing = await productsRepo.findColorByName(name);
  if (existing) {
    throw new ConflictError(`Color "${name}" already exists`);
  }
  return productsRepo.createColor(name);
}

export async function deleteColor(id: number): Promise<void> {
  const color = await productsRepo.findColorById(id);
  if (!color) {
    throw new NotFoundError(`Color with ID ${id} not found`);
  }
  await productsRepo.deleteColor(id);
}

// Growers
export async function getAllGrowers(): Promise<Grower[]> {
  return productsRepo.findAllGrowers();
}

export async function createGrower(name: string): Promise<Grower> {
  const existing = await productsRepo.findGrowerByName(name);
  if (existing) {
    throw new ConflictError(`Grower "${name}" already exists`);
  }
  return productsRepo.createGrower(name);
}

export async function deleteGrower(id: number): Promise<void> {
  const grower = await productsRepo.findGrowerById(id);
  if (!grower) {
    throw new NotFoundError(`Grower with ID ${id} not found`);
  }
  await productsRepo.deleteGrower(id);
}

// Origins
export async function getAllOrigins(): Promise<Origin[]> {
  return productsRepo.findAllOrigins();
}

export async function createOrigin(name: string): Promise<Origin> {
  const existing = await productsRepo.findOriginByName(name);
  if (existing) {
    throw new ConflictError(`Origin "${name}" already exists`);
  }
  return productsRepo.createOrigin(name);
}

export async function deleteOrigin(id: number): Promise<void> {
  const origin = await productsRepo.findOriginById(id);
  if (!origin) {
    throw new NotFoundError(`Origin with ID ${id} not found`);
  }
  await productsRepo.deleteOrigin(id);
}

// Tags
export async function getAllTags(): Promise<Tag[]> {
  return productsRepo.findAllTags();
}

export async function createTag(name: string, slug: string): Promise<Tag> {
  const existingBySlug = await productsRepo.findTagBySlug(slug);
  if (existingBySlug) {
    throw new ConflictError(`Tag with slug "${slug}" already exists`);
  }
  return productsRepo.createTag(name, slug);
}

export async function deleteTag(id: number): Promise<void> {
  const tag = await productsRepo.findTagById(id);
  if (!tag) {
    throw new NotFoundError(`Tag with ID ${id} not found`);
  }
  await productsRepo.deleteTag(id);
}
