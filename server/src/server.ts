/**
 * Server Bootstrap
 * Starts the Fastify server and handles graceful shutdown
 */

import buildApp from './app';
import { PORT, HOST } from '@/config';
import { logger } from '@/libs/logger';
import { prisma } from '@/libs/prisma';
import { disconnectRedis } from '@/libs/redis';

/**
 * Start server
 */
const start = async () => {
  try {
    const app = await buildApp();

    // Start listening
    await app.listen({ port: PORT, host: HOST });

    logger.info(
      {
        port: PORT,
        host: HOST,
        env: process.env.NODE_ENV,
      },
      'Server started successfully'
    );

    // Signal PM2 that app is ready (for zero-downtime deployments)
    if (process.send) {
      process.send('ready');
    }
  } catch (error) {
    logger.error({ error }, 'Failed to start server');
    process.exit(1);
  }
};

/**
 * Graceful shutdown handler
 */
const shutdown = async (signal: string) => {
  logger.info(`${signal} received, shutting down gracefully...`);

  try {
    // Disconnect Prisma
    await prisma.$disconnect();
    logger.info('Database disconnected');

    // Disconnect Redis
    await disconnectRedis();
    logger.info('Redis disconnected');

    logger.info('Graceful shutdown complete');
    process.exit(0);
  } catch (error) {
    logger.error({ error }, 'Error during shutdown');
    process.exit(1);
  }
};

// Register shutdown handlers
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  logger.fatal({ error }, 'Uncaught exception');
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.fatal({ reason }, 'Unhandled rejection');
  process.exit(1);
});

// Start server
start();
