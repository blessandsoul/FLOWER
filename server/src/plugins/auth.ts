/**
 * Authentication Plugin
 * Fastify plugin for JWT authentication and authorization
 */

import { FastifyRequest, FastifyReply, FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import { verifyAccessToken, extractTokenFromHeader } from '@/libs/auth';
import { UnauthorizedError, ForbiddenError } from '@/shared/errors/errors';
import type { UserRole } from '@/config/constants';
import type { TokenPayload } from '@/libs/auth';

/**
 * Extend Fastify Request type to include user
 */
declare module 'fastify' {
  interface FastifyRequest {
    user?: TokenPayload;
  }
}

/**
 * Authentication plugin
 * Registers authentication decorators and hooks
 */
const authPlugin: FastifyPluginAsync = async (fastify) => {
  // Decorate request with authenticate method
  fastify.decorateRequest('user', null);
};

/**
 * Authentication preHandler hook
 * Verifies JWT token and attaches user to request
 *
 * @param allowedRoles - Optional array of roles allowed to access the route
 * @returns Fastify preHandler function
 *
 * @example
 * // Require authentication
 * fastify.get('/protected', { preHandler: authenticate() }, handler);
 *
 * @example
 * // Require specific roles
 * fastify.post('/admin', { preHandler: authenticate(['ADMIN']) }, handler);
 */
export function authenticate(allowedRoles?: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      // Extract token from Authorization header
      const token = extractTokenFromHeader(request.headers.authorization);

      if (!token) {
        throw new UnauthorizedError(
          'AUTH_TOKEN_MISSING',
          'Authorization token is required'
        );
      }

      // Verify and decode token
      const payload = verifyAccessToken(token);

      // Attach user to request
      request.user = payload;

      // Check role authorization if roles specified
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(payload.role)) {
          throw new ForbiddenError(
            'AUTH_INSUFFICIENT_PERMISSIONS',
            'You do not have permission to access this resource'
          );
        }
      }
    } catch (error) {
      if (error instanceof UnauthorizedError || error instanceof ForbiddenError) {
        throw error;
      }

      // Handle JWT errors
      if (error instanceof Error) {
        if (error.message === 'AUTH_TOKEN_EXPIRED') {
          throw new UnauthorizedError(
            'AUTH_TOKEN_EXPIRED',
            'Access token has expired'
          );
        }
        if (error.message === 'AUTH_TOKEN_INVALID') {
          throw new UnauthorizedError(
            'AUTH_TOKEN_INVALID',
            'Invalid access token'
          );
        }
      }

      // Generic auth error
      throw new UnauthorizedError(
        'AUTH_FAILED',
        'Authentication failed'
      );
    }
  };
}

/**
 * Optional authentication preHandler
 * Attaches user if token is valid, but doesn't require authentication
 *
 * @example
 * fastify.get('/products', { preHandler: optionalAuth() }, handler);
 */
export function optionalAuth() {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const token = extractTokenFromHeader(request.headers.authorization);

      if (token) {
        const payload = verifyAccessToken(token);
        request.user = payload;
      }
    } catch (error) {
      // Silently ignore auth errors for optional auth
      // User remains undefined
    }
  };
}

export default fp(authPlugin);
