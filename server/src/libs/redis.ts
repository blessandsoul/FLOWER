import { createClient, RedisClientType } from 'redis';
import { REDIS_URL, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, isDevelopment } from '../config';
import { logger } from './logger';

/**
 * Redis Client Singleton
 *
 * Used for:
 * - Caching (GlobalSettings, product listings)
 * - Session storage
 * - Rate limiting
 */

let redisClient: RedisClientType | null = null;

export const getRedisClient = async (): Promise<RedisClientType> => {
  if (redisClient) {
    return redisClient;
  }

  // Create Redis client
  redisClient = createClient({
    url: REDIS_URL,
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
    password: REDIS_PASSWORD,
  });

  // Error handler
  redisClient.on('error', (err) => {
    logger.error({ err }, 'Redis client error');
  });

  // Connection handler
  redisClient.on('connect', () => {
    logger.info('Redis client connecting...');
  });

  redisClient.on('ready', () => {
    logger.info('Redis client ready');
  });

  // Disconnection handler
  redisClient.on('end', () => {
    logger.info('Redis client disconnected');
  });

  // Connect
  await redisClient.connect();

  return redisClient;
};

/**
 * Redis wrapper with helper methods
 */
export const redis = {
  /**
   * Get value by key
   */
  async get(key: string): Promise<string | null> {
    const client = await getRedisClient();
    return client.get(key);
  },

  /**
   * Set value with optional TTL (seconds)
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    const client = await getRedisClient();
    if (ttl) {
      await client.setEx(key, ttl, value);
    } else {
      await client.set(key, value);
    }
  },

  /**
   * Set value with TTL (seconds) - alias for compatibility
   */
  async setex(key: string, ttl: number, value: string): Promise<void> {
    return redis.set(key, value, ttl);
  },

  /**
   * Delete key
   */
  async del(key: string): Promise<void> {
    const client = await getRedisClient();
    await client.del(key);
  },

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    const client = await getRedisClient();
    const result = await client.exists(key);
    return result === 1;
  },

  /**
   * Increment value (for counters)
   */
  async incr(key: string): Promise<number> {
    const client = await getRedisClient();
    return client.incr(key);
  },

  /**
   * Expire key after TTL (seconds)
   */
  async expire(key: string, ttl: number): Promise<void> {
    const client = await getRedisClient();
    await client.expire(key, ttl);
  },

  /**
   * Get TTL of key (seconds)
   */
  async ttl(key: string): Promise<number> {
    const client = await getRedisClient();
    return client.ttl(key);
  },

  /**
   * Flush all keys (use with caution!)
   */
  async flushAll(): Promise<void> {
    if (isDevelopment()) {
      const client = await getRedisClient();
      await client.flushAll();
      logger.warn('Redis flushed (all keys deleted)');
    } else {
      logger.error('Cannot flush Redis in production');
    }
  },

  /**
   * Quit Redis connection
   */
  async quit(): Promise<void> {
    if (redisClient) {
      await redisClient.quit();
      redisClient = null;
      logger.info('Redis connection closed');
    }
  },

  /**
   * Disconnect Redis (forceful)
   */
  async disconnect(): Promise<void> {
    if (redisClient) {
      await redisClient.disconnect();
      redisClient = null;
      logger.info('Redis forcefully disconnected');
    }
  },
};

/**
 * Named export for disconnecting Redis (used in server.ts shutdown)
 */
export const disconnectRedis = async (): Promise<void> => {
  await redis.quit();
};

/**
 * Graceful shutdown - disconnect Redis on process exit
 */
process.on('beforeExit', async () => {
  await redis.quit();
});
