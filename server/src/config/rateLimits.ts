/**
 * Rate Limit Configuration Presets
 *
 * These presets define different rate limiting strategies for various endpoint types.
 * Adjust values based on expected traffic and security requirements.
 */

export type RateLimitPreset = keyof typeof rateLimitConfigs;

export const rateLimitConfigs = {
  // Authentication - Strict limits to prevent brute force
  login: {
    max: 5,
    timeWindow: "15 minutes",
    description: "Login attempts - strict to prevent brute force",
  },
  register: {
    max: 10,
    timeWindow: "1 hour",
    description: "Registration - moderate limit",
  },
  refresh: {
    max: 20,
    timeWindow: "1 hour",
    description: "Token refresh - moderate limit",
  },
  logout: {
    max: 30,
    timeWindow: "1 hour",
    description: "Logout - light limit",
  },

  // Password management - Strict for security
  forgotPassword: {
    max: 3,
    timeWindow: "1 hour",
    description: "Password reset requests - strict",
  },
  resetPassword: {
    max: 5,
    timeWindow: "1 hour",
    description: "Password reset completion - strict",
  },

  // Email verification
  resendVerification: {
    max: 3,
    timeWindow: "1 hour",
    description: "Email verification resend - strict to prevent spam",
  },

  // Default for other endpoints
  default: {
    max: 100,
    timeWindow: "1 minute",
    description: "Default rate limit for general endpoints",
  },
} as const;
