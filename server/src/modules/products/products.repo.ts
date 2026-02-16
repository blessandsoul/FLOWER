import { prisma } from "../../libs/prisma.js";
import type { Prisma } from "@prisma/client";
import type {
  CreateProductInput,
  UpdateProductInput,
  ProductFilters,
  ProductWithRelations,
  Color,
  Grower,
  Origin,
  Tag,
} from "./products.types.js";

// ==========================================
// Product include clause for relations
// ==========================================

const productInclude = {
  color: { select: { id: true, name: true } },
  grower: { select: { id: true, name: true } },
  origin: { select: { id: true, name: true } },
  tags: {
    select: {
      tag: { select: { id: true, name: true, slug: true } },
    },
  },
  priceTiers: {
    select: { id: true, minQuantity: true, price: true },
    orderBy: { minQuantity: "asc" as const },
  },
} satisfies Prisma.ProductInclude;

// ==========================================
// Helper to transform DB result to typed object
// ==========================================

function transformProduct(dbProduct: any): ProductWithRelations {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    stock: dbProduct.stock,
    orderPer: dbProduct.orderPer,
    imageUrl: dbProduct.imageUrl,
    imageFilename: dbProduct.imageFilename,
    sourceScrapedAt: dbProduct.sourceScrapedAt,
    createdAt: dbProduct.createdAt,
    updatedAt: dbProduct.updatedAt,
    color: dbProduct.color,
    grower: dbProduct.grower,
    origin: dbProduct.origin,
    tags: dbProduct.tags.map((pt: any) => pt.tag),
    priceTiers: dbProduct.priceTiers.map((pt: any) => ({
      id: pt.id,
      minQuantity: pt.minQuantity,
      price: Number(pt.price),
    })),
  };
}

/**
 * For products missing imageFilename, fill it from the product_images table.
 * This handles the case where the scraper stores images only in product_images.
 */
async function fillMissingImageFilenames(products: ProductWithRelations[]): Promise<ProductWithRelations[]> {
  const missing = products.filter((p) => !p.imageFilename);
  if (missing.length === 0) return products;

  const missingIds = missing.map((p) => p.id);
  const rows: Array<{ product_id: number; image_filename: string }> = await prisma.$queryRawUnsafe(
    `SELECT product_id, image_filename FROM product_images
     WHERE product_id IN (${missingIds.join(",")})
       AND image_filename IS NOT NULL
       AND display_order = 0`
  );

  const imageMap = new Map(rows.map((r) => [Number(r.product_id), r.image_filename]));

  return products.map((p) => {
    if (!p.imageFilename && imageMap.has(p.id)) {
      return { ...p, imageFilename: imageMap.get(p.id)! };
    }
    return p;
  });
}

// ==========================================
// Product Repository Functions
// ==========================================

export async function findProductById(id: number): Promise<ProductWithRelations | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      ...productInclude,
      images: {
        select: { id: true, imageUrl: true, imageFilename: true, displayOrder: true },
        orderBy: { displayOrder: "asc" },
      },
    },
  });

  if (!product) return null;

  const transformed = transformProduct(product);
  // Attach images from the ProductImage table
  (transformed as any).images = (product as any).images.map((img: any) => ({
    id: img.id,
    imageUrl: img.imageUrl,
    imageFilename: img.imageFilename,
    displayOrder: img.displayOrder,
  }));

  const [filled] = await fillMissingImageFilenames([transformed]);
  return filled;
}

export async function findProducts(
  filters: ProductFilters,
  page: number,
  limit: number
): Promise<{ items: ProductWithRelations[]; total: number }> {
  const where: Prisma.ProductWhereInput = {};

  // Search by name
  if (filters.search) {
    where.name = { contains: filters.search };
  }

  // Filter by color
  if (filters.colorId) {
    where.colorId = filters.colorId;
  }

  // Filter by grower
  if (filters.growerId) {
    where.growerId = filters.growerId;
  }

  // Filter by origin
  if (filters.originId) {
    where.originId = filters.originId;
  }

  // Filter by tags (products must have ALL specified tags)
  if (filters.tagIds && filters.tagIds.length > 0) {
    where.tags = {
      some: {
        tagId: { in: filters.tagIds },
      },
    };
  }

  // Filter by stock availability
  if (filters.inStock !== undefined) {
    where.stock = filters.inStock ? { gt: 0 } : { equals: 0 };
  }

  // Filter by price range (using priceTiers)
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.priceTiers = {
      some: {
        ...(filters.minPrice !== undefined && { price: { gte: filters.minPrice } }),
        ...(filters.maxPrice !== undefined && { price: { lte: filters.maxPrice } }),
      },
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: productInclude,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  const items = await fillMissingImageFilenames(products.map(transformProduct));

  return {
    items,
    total,
  };
}

export async function createProduct(input: CreateProductInput): Promise<ProductWithRelations> {
  const { tagIds, priceTiers, ...productData } = input;

  const product = await prisma.product.create({
    data: {
      ...productData,
      ...(tagIds && tagIds.length > 0
        ? {
            tags: {
              create: tagIds.map((tagId) => ({ tagId })),
            },
          }
        : {}),
      ...(priceTiers && priceTiers.length > 0
        ? {
            priceTiers: {
              create: priceTiers.map((tier) => ({
                minQuantity: tier.minQuantity,
                price: tier.price,
              })),
            },
          }
        : {}),
    },
    include: productInclude,
  });

  return transformProduct(product);
}

export async function updateProduct(
  id: number,
  input: UpdateProductInput
): Promise<ProductWithRelations> {
  const { tagIds, priceTiers, ...productData } = input;

  // Use transaction to handle tags and price tiers updates
  const product = await prisma.$transaction(async (tx) => {
    // Update tags if provided
    if (tagIds !== undefined) {
      // Delete existing tags
      await tx.productTag.deleteMany({ where: { productId: id } });

      // Create new tags
      if (tagIds.length > 0) {
        await tx.productTag.createMany({
          data: tagIds.map((tagId) => ({ productId: id, tagId })),
        });
      }
    }

    // Update price tiers if provided
    if (priceTiers !== undefined) {
      // Delete existing price tiers
      await tx.priceTier.deleteMany({ where: { productId: id } });

      // Create new price tiers
      if (priceTiers.length > 0) {
        await tx.priceTier.createMany({
          data: priceTiers.map((tier) => ({
            productId: id,
            minQuantity: tier.minQuantity,
            price: tier.price,
          })),
        });
      }
    }

    // Update product data
    return tx.product.update({
      where: { id },
      data: productData,
      include: productInclude,
    });
  });

  return transformProduct(product);
}

export async function deleteProduct(id: number): Promise<void> {
  await prisma.product.delete({ where: { id } });
}

// ==========================================
// Lookup Table Repository Functions
// ==========================================

// Colors
export async function findAllColors(): Promise<Color[]> {
  return prisma.color.findMany({ orderBy: { name: "asc" } });
}

export async function findColorById(id: number): Promise<Color | null> {
  return prisma.color.findUnique({ where: { id } });
}

export async function findColorByName(name: string): Promise<Color | null> {
  return prisma.color.findUnique({ where: { name } });
}

export async function createColor(name: string): Promise<Color> {
  return prisma.color.create({ data: { name } });
}

export async function deleteColor(id: number): Promise<void> {
  await prisma.color.delete({ where: { id } });
}

// Growers
export async function findAllGrowers(): Promise<Grower[]> {
  return prisma.grower.findMany({ orderBy: { name: "asc" } });
}

export async function findGrowerById(id: number): Promise<Grower | null> {
  return prisma.grower.findUnique({ where: { id } });
}

export async function findGrowerByName(name: string): Promise<Grower | null> {
  return prisma.grower.findUnique({ where: { name } });
}

export async function createGrower(name: string): Promise<Grower> {
  return prisma.grower.create({ data: { name } });
}

export async function deleteGrower(id: number): Promise<void> {
  await prisma.grower.delete({ where: { id } });
}

// Origins
export async function findAllOrigins(): Promise<Origin[]> {
  return prisma.origin.findMany({ orderBy: { name: "asc" } });
}

export async function findOriginById(id: number): Promise<Origin | null> {
  return prisma.origin.findUnique({ where: { id } });
}

export async function findOriginByName(name: string): Promise<Origin | null> {
  return prisma.origin.findUnique({ where: { name } });
}

export async function createOrigin(name: string): Promise<Origin> {
  return prisma.origin.create({ data: { name } });
}

export async function deleteOrigin(id: number): Promise<void> {
  await prisma.origin.delete({ where: { id } });
}

// Tags
export async function findAllTags(): Promise<Tag[]> {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}

export async function findTagById(id: number): Promise<Tag | null> {
  return prisma.tag.findUnique({ where: { id } });
}

export async function findTagBySlug(slug: string): Promise<Tag | null> {
  return prisma.tag.findUnique({ where: { slug } });
}

export async function createTag(name: string, slug: string): Promise<Tag> {
  return prisma.tag.create({ data: { name, slug } });
}

export async function deleteTag(id: number): Promise<void> {
  await prisma.tag.delete({ where: { id } });
}
