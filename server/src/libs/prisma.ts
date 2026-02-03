import { PrismaClient, Prisma } from '@prisma/client';
import { logger } from './logger';

/**
 * Prisma Client Singleton
 *
 * Ensures only one instance of PrismaClient exists throughout the application lifecycle.
 * Prevents connection pool exhaustion and improves performance.
 */

// Prevent multiple instances in development with hot reload
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [
      {
        emit: 'stdout',
        level: 'error',
      },
      {
        emit: 'stdout',
        level: 'warn',
      },
    ],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Graceful shutdown - disconnect Prisma on process exit
 */
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  logger.info('Prisma disconnected');
});
