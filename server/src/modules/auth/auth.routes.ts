import type { FastifyInstance } from "fastify";
import * as authController from "./auth.controller.js";
import { authGuard } from "../../middlewares/authGuard.js";
import { createRateLimitConfig } from "../../config/rateLimit.js";

export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // ==========================================
  // CSRF TOKEN ENDPOINT
  // ==========================================

  // Get CSRF token for state-changing requests
  // Client should call this and include the token in X-CSRF-Token header
  fastify.get("/auth/csrf-token", authController.getCsrfToken);

  // ==========================================
  // CORE AUTH ENDPOINTS
  // ==========================================

  // User Registration (default USER role)
  fastify.post(
    "/auth/register",
    { config: createRateLimitConfig("register") },
    authController.register
  );

  // Login - strict limit (5 requests per 15 minutes per IP)
  fastify.post(
    "/auth/login",
    { config: createRateLimitConfig("login") },
    authController.login
  );

  // Token refresh - moderate limit
  fastify.post(
    "/auth/refresh",
    { config: createRateLimitConfig("refresh") },
    authController.refresh
  );

  // Logout - light limit
  fastify.post(
    "/auth/logout",
    { config: createRateLimitConfig("logout") },
    authController.logout
  );

  // Logout all - requires auth, light limit
  fastify.post(
    "/auth/logout-all",
    { preHandler: [authGuard], config: createRateLimitConfig("logout") },
    authController.logoutAll
  );

  // Get current user - no rate limit (protected by auth)
  fastify.get("/auth/me", { preHandler: [authGuard] }, authController.me);

  // ==========================================
  // EMAIL VERIFICATION
  // ==========================================

  // Verify email with token
  fastify.post(
    "/auth/verify-email",
    { config: createRateLimitConfig("resendVerification") },
    authController.verifyEmail
  );

  // Resend verification email
  fastify.post(
    "/auth/resend-verification",
    { config: createRateLimitConfig("resendVerification") },
    authController.resendVerification
  );

  // ==========================================
  // PASSWORD RESET
  // ==========================================

  // Request password reset (forgot password)
  fastify.post(
    "/auth/forgot-password",
    { config: createRateLimitConfig("forgotPassword") },
    authController.forgotPassword
  );

  // Reset password with token
  fastify.post(
    "/auth/reset-password",
    { config: createRateLimitConfig("resetPassword") },
    authController.resetPassword
  );
}
