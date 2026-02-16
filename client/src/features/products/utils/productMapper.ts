/**
 * Product Mapper
 * Transforms server product data to client Product type
 */

import type { Product, ProductDetail } from '@/types';
import type { ServerProduct, ServerProductDetail } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Resolves the best available image URL for a product.
 * Priority: imageUrl (external DB URL) > imageFilename (local upload) > null
 */
function resolveImageUrl(imageUrl: string | null, imageFilename: string | null): string | null {
  if (imageUrl) return imageUrl;
  if (imageFilename) return `${API_BASE_URL}/uploads/${imageFilename}`;
  return null;
}

/**
 * Maps a server product to the client Product type
 */
export function mapServerProductToClient(server: ServerProduct): Product {
  return {
    id: String(server.id),
    name: server.name,
    photoUrl: resolveImageUrl(server.imageUrl, server.imageFilename) ?? '',
    price: server.priceFrom ?? server.priceTiers[0]?.price ?? 0,
    minBoxSize: server.orderPer,
    stock: server.stock,
    color: server.color ?? 'Unknown',
    category: server.tags[0] ?? 'Flower',
    grower: server.grower ?? undefined,
    origin: server.origin ?? undefined,
    priceTiers: server.priceTiers.map((tier) => ({
      minQuantity: tier.minQuantity,
      price: tier.price,
    })),
  };
}

/**
 * Maps an array of server products to client Product types
 */
export function mapServerProductsToClient(serverProducts: ServerProduct[]): Product[] {
  return serverProducts.map(mapServerProductToClient);
}

/**
 * Maps a server product detail to the client ProductDetail type
 */
export function mapServerProductDetailToClient(server: ServerProductDetail): ProductDetail {
  const base = mapServerProductToClient(server);

  // Build images array: main image first, then additional images
  const images: string[] = [];
  if (base.photoUrl) {
    images.push(base.photoUrl);
  }
  for (const img of server.images ?? []) {
    const url = resolveImageUrl(img.imageUrl, img.imageFilename);
    if (url && !images.includes(url)) {
      images.push(url);
    }
  }

  return {
    ...base,
    images,
    tags: server.tags ?? [],
  };
}
