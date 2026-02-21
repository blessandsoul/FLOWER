import type { FastifyRequest, FastifyReply } from "fastify";
import { successResponse } from "../../libs/response.js";
import { ValidationError } from "../../libs/errors.js";
import { env } from "../../config/env.js";
import * as authService from "./auth.service.js";
import * as securityService from "./security.service.js";
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendVerificationSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schemas.js";

// Cookie secure flag: explicit env var overrides, otherwise based on NODE_ENV
const cookieSecure = env.COOKIE_SECURE ?? (env.NODE_ENV === "production");

// Cookie configuration
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: cookieSecure,
  sameSite: "lax" as const,
  path: "/",
};

function setAuthCookies(reply: FastifyReply, accessToken: string, refreshToken: string, userRoles: string[]) {
  // Access token cookie (short-lived)
  reply.setCookie("accessToken", accessToken, {
    ...COOKIE_OPTIONS,
    maxAge: 15 * 60, // 15 minutes in seconds
  });

  // Refresh token cookie (longer-lived)
  reply.setCookie("refreshToken", refreshToken, {
    ...COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });

  // User roles cookie (for middleware route protection - not httpOnly so middleware can read)
  reply.setCookie("userRoles", JSON.stringify(userRoles), {
    ...COOKIE_OPTIONS,
    httpOnly: false, // Middleware needs to read this
    maxAge: 7 * 24 * 60 * 60,
  });
}

function clearAuthCookies(reply: FastifyReply) {
  reply.clearCookie("accessToken", { path: "/" });
  reply.clearCookie("refreshToken", { path: "/" });
  reply.clearCookie("userRoles", { path: "/" });
}

function getLoginMeta(request: FastifyRequest) {
  return {
    userAgent: request.headers["user-agent"],
    ipAddress: request.ip,
  };
}

// ==========================================
// CSRF TOKEN
// ==========================================

export async function getCsrfToken(
  _request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // CSRF disabled for review deployment
  return reply.send(successResponse("CSRF disabled", { csrfToken: "disabled" }));
}

// ==========================================
// USER REGISTRATION (default USER role)
// ==========================================

export async function register(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = registerSchema.safeParse(request.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const result = await authService.register(parsed.data, getLoginMeta(request));

  // Set httpOnly cookies
  setAuthCookies(reply, result.accessToken, result.refreshToken, result.user.roles);

  return reply.status(201).send(
    successResponse("User registered successfully. Please check your email to verify your account.", {
      user: result.user,
      // Don't send tokens in response body - they're in cookies now
    })
  );
}

// ==========================================
// LOGIN
// ==========================================

export async function login(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = loginSchema.safeParse(request.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const result = await authService.login(parsed.data, getLoginMeta(request));

  // Set httpOnly cookies
  setAuthCookies(reply, result.accessToken, result.refreshToken, result.user.roles);

  return reply.send(successResponse("Logged in successfully", {
    user: result.user,
    // Don't send tokens in response body - they're in cookies now
  }));
}

// ==========================================
// TOKEN MANAGEMENT
// ==========================================

export async function refresh(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Get refresh token from cookie
  const refreshToken = request.cookies.refreshToken;
  if (!refreshToken) {
    throw new ValidationError("Refresh token is required");
  }

  const tokens = await authService.refresh(refreshToken);

  // Get user roles from existing cookie to preserve them
  const userRolesStr = request.cookies.userRoles;
  const userRoles = userRolesStr ? JSON.parse(userRolesStr) : [];

  // Set new cookies
  setAuthCookies(reply, tokens.accessToken, tokens.refreshToken, userRoles);

  return reply.send(successResponse("Token refreshed", null));
}

export async function logout(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  // Get refresh token from cookie
  const refreshToken = request.cookies.refreshToken;
  if (refreshToken) {
    try {
      await authService.logout(refreshToken);
    } catch {
      // Ignore errors - we still want to clear cookies
    }
  }

  // Clear all auth cookies
  clearAuthCookies(reply);

  return reply.send(successResponse("Logged out successfully", null));
}

export async function me(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const user = await authService.getCurrentUser(request.user.id);

  return reply.send(successResponse("Current user retrieved", user));
}

export async function logoutAll(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const result = await authService.logoutAll(request.user.id);

  return reply.send(
    successResponse("Logged out from all devices", result)
  );
}

// ==========================================
// EMAIL VERIFICATION
// ==========================================

export async function verifyEmail(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = verifyEmailSchema.safeParse(request.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const result = await securityService.verifyEmail(parsed.data.token);

  return reply.send(successResponse(result.message, null));
}

export async function resendVerification(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = resendVerificationSchema.safeParse(request.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const result = await securityService.resendVerification(parsed.data.email);

  return reply.send(successResponse(result.message, null));
}

// ==========================================
// PASSWORD RESET
// ==========================================

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = forgotPasswordSchema.safeParse(request.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const result = await securityService.requestPasswordReset(parsed.data.email);

  return reply.send(successResponse(result.message, null));
}

export async function resetPassword(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const parsed = resetPasswordSchema.safeParse(request.body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error.errors[0].message);
  }

  const result = await securityService.resetPassword(
    parsed.data.token,
    parsed.data.newPassword
  );

  return reply.send(successResponse(result.message, null));
}
