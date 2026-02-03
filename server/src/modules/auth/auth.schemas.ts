/**
 * Auth Module Zod Schemas
 * Request/response validation schemas
 */

import { z } from 'zod';
import { EmailSchema, PasswordSchema, UUIDSchema } from '@/shared/schemas/common';
import { USER_ROLES } from '@/config/constants';

/**
 * Login Schema
 */
export const LoginSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

/**
 * Register Schema
 */
export const RegisterSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  role: z.enum([USER_ROLES.USER, USER_ROLES.RESELLER]).default(USER_ROLES.USER),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

/**
 * Refresh Token Schema
 */
export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

/**
 * Password Reset Request Schema
 */
export const PasswordResetRequestSchema = z.object({
  email: EmailSchema,
});

export type PasswordResetRequestInput = z.infer<typeof PasswordResetRequestSchema>;

/**
 * Password Reset Confirm Schema
 */
export const PasswordResetConfirmSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: PasswordSchema,
});

export type PasswordResetConfirmInput = z.infer<typeof PasswordResetConfirmSchema>;

/**
 * Email Verification Schema
 */
export const EmailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export type EmailVerificationInput = z.infer<typeof EmailVerificationSchema>;
