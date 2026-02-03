/**
 * Rate Limiting Plugin
 * Fastify plugin for API rate limiting
 */

import { FastifyPluginAsync, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import rateLimit from '@fastify/rate-limit';
import { RATE_LIMIT_MAX, RATE_LIMIT_TIME_WINDOW } from '@/config';

/**
 * Rate limiting plugin
 *
 * Configuration:
 * - max: Maximum requests per time window (from env: RATE_LIMIT_MAX)
 * - timeWindow: Time window duration (from env: RATE_LIMIT_TIME_WINDOW)
 *
 * Default: 100 requests per minute per IP
 */
const rateLimitPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(rateLimit, {
    max: RATE_LIMIT_MAX,
    timeWindow: RATE_LIMIT_TIME_WINDOW,

    // Key generator - use IP address
    keyGenerator: (request: FastifyRequest) => {
      return request.ip;
    },

    // Error message when rate limit exceeded
    errorResponseBuilder: (_request: FastifyRequest, context: { max: number; after: string }) => {
      return {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Limit: ${context.max} requests per ${context.after}`,
        },
      };
    },

    // Add rate limit headers
    addHeaders: {
      'x-ratelimit-limit': true,
      'x-ratelimit-remaining': true,
      'x-ratelimit-reset': true,
    },
  });
};

export default fp(rateLimitPlugin);
