/**
 * Auth Module Types
 */

import type { UserRole } from '@/config/constants';

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register Request
 */
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

/**
 * Token Pair Response
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Auth Response (with user data)
 */
export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    balance: string; // Decimal as string
    emailVerified: boolean;
  };
  tokens: TokenPair;
}

/**
 * Refresh Token Request
 */
export interface RefreshTokenRequest {
  refreshToken: string;
}

/**
 * Password Reset Request
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Password Reset Confirm Request
 */
export interface PasswordResetConfirmRequest {
  token: string;
  newPassword: string;
}

/**
 * Email Verification Request
 */
export interface EmailVerificationRequest {
  token: string;
}
