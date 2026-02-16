import { z } from "zod";

// ==========================================
// VALIDATION HELPERS
// ==========================================

// Email: lowercase and trimmed for consistent matching
export const emailSchema = z.string()
  .email("Invalid email address")
  .max(255, "Email is too long")
  .transform((val) => val.toLowerCase().trim());

// Strong password requirements
export const strongPasswordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password is too long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// Name validation
export const nameSchema = z.string()
  .min(1, "Name is required")
  .max(100, "Name is too long")
  .transform((val) => val.trim());

// Token validation
export const tokenSchema = z.string()
  .min(1, "Token is required")
  .max(128, "Token is too long");

// ==========================================
// USER REGISTRATION (default USER role)
// ==========================================

export const registerSchema = z.object({
  email: emailSchema,
  password: strongPasswordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
});

// ==========================================
// LOGIN & TOKEN MANAGEMENT
// ==========================================

// Login - only requires password presence (don't validate strength on login)
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const logoutSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

// ==========================================
// EMAIL VERIFICATION
// ==========================================

export const verifyEmailSchema = z.object({
  token: tokenSchema,
});

export const resendVerificationSchema = z.object({
  email: emailSchema,
});

// ==========================================
// PASSWORD RESET
// ==========================================

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: tokenSchema,
  newPassword: strongPasswordSchema,
});

// ==========================================
// TYPE EXPORTS
// ==========================================

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type LogoutInput = z.infer<typeof logoutSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationInput = z.infer<typeof resendVerificationSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export interface LoginMeta {
  userAgent?: string;
  ipAddress?: string;
}
