import { createClient, RedisClientType } from "redis";
import { env } from "../config/env.js";
import { logger } from "./logger.js";

let _redisClient: RedisClientType | null = null;

/**
 * Get the Redis client instance
 */
export const redisClient = {
  get isOpen() {
    return _redisClient !== null && _redisClient.isOpen;
  },
  async ping() {
    if (!_redisClient) {
      throw new Error("Redis client not connected");
    }
    return _redisClient.ping();
  },
};

/**
 * Connect to Redis
 * @returns true if connected successfully, false otherwise
 */
export async function connectRedis(): Promise<boolean> {
  if (_redisClient && _redisClient.isOpen) {
    return true;
  }

  try {
    const url = env.REDIS_PASSWORD
      ? `redis://:${env.REDIS_PASSWORD}@${env.REDIS_HOST}:${env.REDIS_PORT}`
      : `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`;

    _redisClient = createClient({ url });

    _redisClient.on("error", (err) => {
      logger.error({ err }, "Redis connection error");
    });

    _redisClient.on("reconnecting", () => {
      logger.warn("Redis reconnecting...");
    });

    await _redisClient.connect();
    logger.info("Redis connected");
    return true;
  } catch (err) {
    logger.error({ err }, "Failed to connect to Redis");
    return false;
  }
}

/**
 * Get or create Redis client instance
 */
export async function getRedisClient(): Promise<RedisClientType> {
  if (_redisClient && _redisClient.isOpen) {
    return _redisClient;
  }

  const success = await connectRedis();
  if (!success || !_redisClient) {
    throw new Error("Failed to connect to Redis");
  }

  return _redisClient;
}

/**
 * Disconnect from Redis
 */
export async function disconnectRedis(): Promise<void> {
  if (_redisClient && _redisClient.isOpen) {
    await _redisClient.quit();
    _redisClient = null;
    logger.info("Redis connection closed");
  }
}

/**
 * Check if Redis is connected
 */
export function isRedisConnected(): boolean {
  return _redisClient !== null && _redisClient.isOpen;
}
