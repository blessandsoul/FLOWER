/**
 * Users Controller
 * Handles HTTP requests for user management
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { successResponse, paginatedResponse } from '@/shared/helpers/response';
import * as usersService from './users.service';
import {
  UpdateProfileSchema,
  UpdateBillingSchema,
  AdminUpdateUserSchema,
  UserListQuerySchema,
  UserIdParamSchema,
} from './users.schemas';

/**
 * GET /users
 * List all users (admin only)
 */
export async function listUsers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const query = UserListQuerySchema.parse(request.query);
  const { page, limit, ...filters } = query;

  const { users, total } = await usersService.listUsers(filters, page, limit);

  return reply.send(
    paginatedResponse('Users retrieved', users, page, limit, total)
  );
}

/**
 * GET /users/:id
 * Get user by ID (admin only)
 */
export async function getUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = UserIdParamSchema.parse(request.params);
  const user = await usersService.getById(id);

  return reply.send(
    successResponse('User retrieved', user)
  );
}

/**
 * PATCH /users/:id
 * Update user (admin only)
 */
export async function updateUser(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = UserIdParamSchema.parse(request.params);
  const input = AdminUpdateUserSchema.parse(request.body);

  const user = await usersService.adminUpdateUser(id, input);

  return reply.send(
    successResponse('User updated', user)
  );
}

/**
 * PATCH /users/me
 * Update current user profile
 */
export async function updateMe(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const input = UpdateProfileSchema.parse(request.body);

  const user = await usersService.updateProfile(userId, input);

  return reply.send(
    successResponse('Profile updated', user)
  );
}

/**
 * PATCH /users/me/billing
 * Update current user's billing details
 */
export async function updateBilling(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const input = UpdateBillingSchema.parse(request.body);

  const user = await usersService.updateBilling(userId, input);

  return reply.send(
    successResponse('Billing details updated', user)
  );
}

/**
 * GET /users/me/balance
 * Get current user's balance
 */
export async function getMyBalance(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const balance = await usersService.getBalance(userId);

  return reply.send(
    successResponse('Balance retrieved', { balance })
  );
}
