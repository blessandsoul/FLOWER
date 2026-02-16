import type { FastifyRequest, FastifyReply } from "fastify";
import * as productsService from "./products.service.js";
import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  productFiltersSchema,
  createColorSchema,
  createGrowerSchema,
  createOriginSchema,
  createTagSchema,
} from "./products.schemas.js";
import { successResponse, paginatedResponse } from "../../libs/response.js";
import { ValidationError } from "../../libs/errors.js";

// ==========================================
// Product Controllers
// ==========================================

export async function getProducts(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = productFiltersSchema.safeParse(request.query);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const { page, limit, ...filters } = parsed.data;
  const { items, total } = await productsService.getProducts(filters, page, limit);

  reply.send(paginatedResponse("Products retrieved successfully", items, page, limit, total));
}

export async function getProductById(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = productIdSchema.safeParse(request.params);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const product = await productsService.getProductById(parsed.data.id);
  reply.send(successResponse("Product retrieved successfully", product));
}

export async function createProduct(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = createProductSchema.safeParse(request.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const product = await productsService.createProduct(parsed.data);
  reply.status(201).send(successResponse("Product created successfully", product));
}

export async function updateProduct(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const paramsParsed = productIdSchema.safeParse(request.params);
  if (!paramsParsed.success) {
    throw new ValidationError(paramsParsed.error.errors[0].message);
  }

  const bodyParsed = updateProductSchema.safeParse(request.body);
  if (!bodyParsed.success) {
    throw new ValidationError(bodyParsed.error.errors[0].message);
  }

  const product = await productsService.updateProduct(paramsParsed.data.id, bodyParsed.data);
  reply.send(successResponse("Product updated successfully", product));
}

export async function deleteProduct(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = productIdSchema.safeParse(request.params);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  await productsService.deleteProduct(parsed.data.id);
  reply.send(successResponse("Product deleted successfully", null));
}

// ==========================================
// Color Controllers
// ==========================================

export async function getColors(
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const colors = await productsService.getAllColors();
  reply.send(successResponse("Colors retrieved successfully", colors));
}

export async function createColor(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = createColorSchema.safeParse(request.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const color = await productsService.createColor(parsed.data.name);
  reply.status(201).send(successResponse("Color created successfully", color));
}

export async function deleteColor(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = productIdSchema.safeParse(request.params);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  await productsService.deleteColor(parsed.data.id);
  reply.send(successResponse("Color deleted successfully", null));
}

// ==========================================
// Grower Controllers
// ==========================================

export async function getGrowers(
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const growers = await productsService.getAllGrowers();
  reply.send(successResponse("Growers retrieved successfully", growers));
}

export async function createGrower(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = createGrowerSchema.safeParse(request.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const grower = await productsService.createGrower(parsed.data.name);
  reply.status(201).send(successResponse("Grower created successfully", grower));
}

export async function deleteGrower(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = productIdSchema.safeParse(request.params);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  await productsService.deleteGrower(parsed.data.id);
  reply.send(successResponse("Grower deleted successfully", null));
}

// ==========================================
// Origin Controllers
// ==========================================

export async function getOrigins(
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const origins = await productsService.getAllOrigins();
  reply.send(successResponse("Origins retrieved successfully", origins));
}

export async function createOrigin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = createOriginSchema.safeParse(request.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const origin = await productsService.createOrigin(parsed.data.name);
  reply.status(201).send(successResponse("Origin created successfully", origin));
}

export async function deleteOrigin(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = productIdSchema.safeParse(request.params);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  await productsService.deleteOrigin(parsed.data.id);
  reply.send(successResponse("Origin deleted successfully", null));
}

// ==========================================
// Tag Controllers
// ==========================================

export async function getTags(
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const tags = await productsService.getAllTags();
  reply.send(successResponse("Tags retrieved successfully", tags));
}

export async function createTag(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = createTagSchema.safeParse(request.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const tag = await productsService.createTag(parsed.data.name, parsed.data.slug);
  reply.status(201).send(successResponse("Tag created successfully", tag));
}

export async function deleteTag(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = productIdSchema.safeParse(request.params);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  await productsService.deleteTag(parsed.data.id);
  reply.send(successResponse("Tag deleted successfully", null));
}
