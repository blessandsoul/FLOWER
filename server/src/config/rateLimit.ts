import type { RouteShorthandOptions } from "fastify";
import { rateLimitConfigs, RateLimitPreset } from "./rateLimits.js";

/**
 * Create rate limit configuration for a route
 * @param preset - Predefined rate limit preset name
 * @returns Route config with rate limit settings
 */
export function createRateLimitConfig(preset: RateLimitPreset): RouteShorthandOptions["config"] {
  const config = rateLimitConfigs[preset];

  return {
    rateLimit: {
      max: config.max,
      timeWindow: config.timeWindow,
    },
  };
}
