import type { FastifyInstance } from "fastify";
import * as productsController from "./products.controller.js";
import { authGuard, requireRole } from "../../middlewares/authGuard.js";

export async function productRoutes(fastify: FastifyInstance): Promise<void> {
  // ==========================================
  // PRODUCTS - Public GET, Admin CUD
  // ==========================================

  // Public: List all products with filters and pagination
  fastify.get("/products", productsController.getProducts);

  // Public: Get product by ID
  fastify.get("/products/:id", productsController.getProductById);

  // Admin: Create product
  fastify.post(
    "/products",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    productsController.createProduct
  );

  // Admin: Update product
  fastify.patch(
    "/products/:id",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    productsController.updateProduct
  );

  // Admin: Delete product
  fastify.delete(
    "/products/:id",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    productsController.deleteProduct
  );

  // ==========================================
  // COLORS - Public GET, Admin CUD
  // ==========================================

  // Public: List all colors
  fastify.get("/colors", productsController.getColors);

  // Admin: Create color
  fastify.post(
    "/colors",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    productsController.createColor
  );

  // Admin: Delete color
  fastify.delete(
    "/colors/:id",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    productsController.deleteColor
  );

  // ==========================================
  // GROWERS - Public GET, Admin CUD
  // ==========================================

  // Public: List all growers
  fastify.get("/growers", productsController.getGrowers);

  // Admin: Create grower
  fastify.post(
    "/growers",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    productsController.createGrower
  );

  // Admin: Delete grower
  fastify.delete(
    "/growers/:id",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    productsController.deleteGrower
  );

  // ==========================================
  // ORIGINS - Public GET, Admin CUD
  // ==========================================

  // Public: List all origins
  fastify.get("/origins", productsController.getOrigins);

  // Admin: Create origin
  fastify.post(
    "/origins",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    productsController.createOrigin
  );

  // Admin: Delete origin
  fastify.delete(
    "/origins/:id",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    productsController.deleteOrigin
  );

  // ==========================================
  // TAGS - Public GET, Admin CUD
  // ==========================================

  // Public: List all tags
  fastify.get("/tags", productsController.getTags);

  // Admin: Create tag
  fastify.post(
    "/tags",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    productsController.createTag
  );

  // Admin: Delete tag
  fastify.delete(
    "/tags/:id",
    { preHandler: [authGuard, requireRole("ADMIN")] },
    productsController.deleteTag
  );
}
