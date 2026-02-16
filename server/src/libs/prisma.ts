import { PrismaClient } from "@prisma/client";
import { logger } from "./logger.js";

// Global variable to store the Prisma client instance
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Create or reuse the Prisma client instance
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? [
            { emit: "event", level: "query" },
            { emit: "stdout", level: "error" },
            { emit: "stdout", level: "warn" },
          ]
        : [{ emit: "stdout", level: "error" }],
  });

// Log queries in development
if (process.env.NODE_ENV === "development") {
  prisma.$on("query" as never, (e: { query: string; duration: number }) => {
    logger.debug({ query: e.query, duration: `${e.duration}ms` }, "Prisma Query");
  });
}

// Prevent multiple instances in development (hot reload)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Test database connection
 * @returns true if connected successfully, false otherwise
 */
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info("Database connected");
    return true;
  } catch (err) {
    logger.error({ err }, "Failed to connect to database");
    return false;
  }
}
