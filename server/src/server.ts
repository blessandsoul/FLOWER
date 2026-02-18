import "dotenv/config";
import { env } from "./config/env.js";
import { logger } from "./libs/logger.js";
import { connectRedis, disconnectRedis, isRedisConnected } from "./libs/redis.js";
import { testDatabaseConnection } from "./libs/prisma.js";
import buildApp from "./app.js";
import { startMockBogServer } from "./mock/bog-mock.js";

const app = buildApp();

// Track service availability
let redisAvailable = false;
let databaseAvailable = false;

async function start(): Promise<void> {
  try {
    // Test database connection (non-fatal)
    databaseAvailable = await testDatabaseConnection();
    if (!databaseAvailable) {
      logger.warn("Database unavailable - API endpoints may not work properly");
    }

    // Connect to Redis (non-fatal)
    redisAvailable = await connectRedis();
    if (!redisAvailable) {
      logger.warn("Redis unavailable - caching, rate limiting, and real-time features disabled");
    }

    // Start mock BOG server if enabled (development only)
    if (env.BOG_MOCK_ENABLED) {
      await startMockBogServer();
    }

    // Start Fastify server (this should always succeed if port is available)
    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    logger.info(`Server started on port ${env.PORT}`);

    // Signal PM2 that the app is ready (for cluster mode with wait_ready: true)
    if (process.send) {
      process.send("ready");
    }

    // Log service status
    logger.info({
      database: databaseAvailable ? "Connected" : "Unavailable",
      redis: redisAvailable ? "Connected" : "Unavailable",
    }, "Service Status:");
  } catch (err) {
    logger.fatal(err, "Failed to start server");
    process.exit(1);
  }
}

async function shutdown(): Promise<void> {
  logger.info("Shutting down server...");
  try {
    // Disconnect Redis (only if connected)
    if (redisAvailable && isRedisConnected()) {
      await disconnectRedis();
    }

    // Close Fastify
    await app.close();

    logger.info("Server shut down gracefully");
    process.exit(0);
  } catch (err) {
    logger.error(err, "Error during shutdown");
    process.exit(1);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
