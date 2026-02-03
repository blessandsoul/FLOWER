/**
 * Fastify Application Instance
 * Registers plugins, routes, and error handlers
 */

import fastify, { FastifyInstance, FastifyError, FastifyRequest, FastifyReply, FastifyBaseLogger } from 'fastify';
import cors from '@fastify/cors';
import { CORS_ORIGIN, API_PREFIX, isDevelopment } from '@/config';
import { logger } from '@/libs/logger';
import { prisma } from '@/libs/prisma';
import authPlugin from '@/plugins/auth';
import rateLimitPlugin from '@/plugins/rate-limit';
import { AppError } from '@/shared/errors/app-error';
import { successResponse } from '@/shared/helpers/response';
import { authRoutes } from '@/modules/auth';
import { usersRoutes } from '@/modules/users';
import { productsRoutes } from '@/modules/products';
import { batchesRoutes } from '@/modules/batches';
import { ordersRoutes } from '@/modules/orders';
import { creditsRoutes } from '@/modules/credits';
import { settingsRoutes } from '@/modules/settings';
import { invoicesRoutes } from '@/modules/invoices';


const buildApp = async (): Promise<FastifyInstance> => {
  const app = fastify({
    logger: logger as unknown as FastifyBaseLogger,
    disableRequestLogging: false,
    requestIdHeader: 'x-request-id',
    requestIdLogLabel: 'requestId',
  });

  // CORS Plugin
  await app.register(cors, {
    origin: CORS_ORIGIN,
    credentials: true,
  });

  // Rate Limiting Plugin
  await app.register(rateLimitPlugin);

  // Authentication Plugin
  await app.register(authPlugin);

  // Health Check Endpoint
  app.get('/health', async (_request, reply) => {
    try {
      // Check database connection
      await prisma.$queryRaw`SELECT 1`;

      return reply.send(
        successResponse('Service healthy', {
          status: 'ok',
          timestamp: new Date().toISOString(),
          environment: isDevelopment() ? 'development' : 'production',
        })
      );
    } catch (error) {
      return reply.status(503).send({
        success: false,
        error: {
          code: 'SERVICE_UNHEALTHY',
          message: 'Database connection failed',
        },
      });
    }
  });

  // API Routes
  await app.register(authRoutes, { prefix: `${API_PREFIX}/auth` });
  await app.register(usersRoutes, { prefix: `${API_PREFIX}/users` });
  await app.register(productsRoutes, { prefix: `${API_PREFIX}/products` });
  await app.register(batchesRoutes, { prefix: `${API_PREFIX}/batches` });
  await app.register(ordersRoutes, { prefix: `${API_PREFIX}/orders` });
  await app.register(creditsRoutes, { prefix: `${API_PREFIX}/credits` });
  await app.register(settingsRoutes, { prefix: `${API_PREFIX}/settings` });
  await app.register(invoicesRoutes, { prefix: `${API_PREFIX}/invoices` });

  // Global Error Handler
  app.setErrorHandler((error: FastifyError, request, reply) => {
    // Handle AppError instances
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
    }

    // Handle Zod validation errors
    if (error.name === 'ZodError') {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
        },
      });
    }

    // Handle Fastify validation errors
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: error.message || 'Invalid request data',
        },
      });
    }

    // Log unexpected errors
    logger.error(
      {
        error: {
          message: error.message,
          stack: error.stack,
          code: error.code,
        },
        requestId: request.id,
        url: request.url,
        method: request.method,
      },
      'Unhandled error'
    );

    // Generic error response (hide internals in production)
    return reply.status(error.statusCode || 500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: isDevelopment()
          ? error.message
          : 'An unexpected error occurred',
      },
    });
  });

  return app;
};

export default buildApp;
