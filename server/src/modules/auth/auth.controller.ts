/**
 * Auth Controller
 * Handles HTTP requests for authentication
 */

import { FastifyRequest, FastifyReply } from 'fastify';
import { successResponse } from '@/shared/helpers/response';
import * as authService from './auth.service';
import {
  LoginSchema,
  RegisterSchema,
  RefreshTokenSchema,
  type LoginInput,
  type RegisterInput,
  type RefreshTokenInput,
} from './auth.schemas';

/**
 * POST /auth/register
 * Register a new user
 */
export async function register(
  request: FastifyRequest<{ Body: RegisterInput }>,
  reply: FastifyReply
) {
  const input = RegisterSchema.parse(request.body);
  const result = await authService.register(input);

  return reply.status(201).send(
    successResponse('Registration successful', result)
  );
}

/**
 * POST /auth/login
 * Login with email and password
 */
export async function login(
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) {
  const input = LoginSchema.parse(request.body);
  const result = await authService.login(input);

  return reply.send(
    successResponse('Login successful', result)
  );
}

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
export async function refreshToken(
  request: FastifyRequest<{ Body: RefreshTokenInput }>,
  reply: FastifyReply
) {
  const { refreshToken } = RefreshTokenSchema.parse(request.body);
  const tokens = await authService.refreshAccessToken(refreshToken);

  return reply.send(
    successResponse('Token refreshed', tokens)
  );
}

/**
 * GET /auth/me
 * Get current authenticated user
 */
export async function getMe(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const userId = request.user!.sub;
  const user = await authService.getMe(userId);

  return reply.send(
    successResponse('User profile retrieved', user)
  );
}

/**
 * POST /auth/logout
 * Logout current user (client-side token removal)
 */
export async function logout(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // JWT is stateless - logout is handled client-side
  // This endpoint exists for consistency and future token blacklisting
  return reply.send(
    successResponse('Logout successful', null)
  );
}
