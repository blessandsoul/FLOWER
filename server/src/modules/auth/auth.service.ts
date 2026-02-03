/**
 * Auth Service
 * Business logic for authentication and authorization
 */

import {
  hashPassword,
  comparePassword,
  generateTokenPair,
  verifyRefreshToken,
} from '@/libs/auth';
import { logger } from '@/libs/logger';
import {
  BadRequestError,
  UnauthorizedError,
  ConflictError,
  NotFoundError,
} from '@/shared/errors/errors';
import * as authRepo from './auth.repo';
import type { AuthResponse } from './auth.types';
import type { RegisterInput, LoginInput } from './auth.schemas';

/**
 * Register new user
 */
export async function register(input: RegisterInput): Promise<AuthResponse> {
  // Check if user already exists
  const existingUser = await authRepo.findUserByEmail(input.email);
  if (existingUser) {
    throw new ConflictError('USER_ALREADY_EXISTS', 'Email already registered');
  }

  // Hash password
  const hashedPassword = await hashPassword(input.password);

  // Create user
  const user = await authRepo.createUser({
    email: input.email,
    password: hashedPassword,
    firstName: input.firstName,
    lastName: input.lastName,
    role: input.role,
  });

  logger.info({ userId: user.id, email: user.email }, 'User registered');

  // Generate tokens
  const tokens = generateTokenPair(user.id, user.role);

  // TODO: Send email verification email

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      balance: user.balance.toString(),
      emailVerified: user.emailVerified,
    },
    tokens,
  };
}

/**
 * Login user
 */
export async function login(input: LoginInput): Promise<AuthResponse> {
  // Find user
  const user = await authRepo.findUserByEmail(input.email);
  if (!user) {
    throw new UnauthorizedError(
      'AUTH_INVALID_CREDENTIALS',
      'Invalid email or password'
    );
  }

  // Verify password
  const isPasswordValid = await comparePassword(input.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError(
      'AUTH_INVALID_CREDENTIALS',
      'Invalid email or password'
    );
  }

  // Update last login
  await authRepo.updateLastLogin(user.id);

  logger.info({ userId: user.id, email: user.email }, 'User logged in');

  // Generate tokens
  const tokens = generateTokenPair(user.id, user.role);

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      balance: user.balance.toString(),
      emailVerified: user.emailVerified,
    },
    tokens,
  };
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  try {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Check if user still exists
    const user = await authRepo.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedError(
        'AUTH_USER_NOT_FOUND',
        'User no longer exists'
      );
    }

    // Generate new token pair
    const tokens = generateTokenPair(user.id, user.role);

    logger.info({ userId: user.id }, 'Access token refreshed');

    return tokens;
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'AUTH_TOKEN_EXPIRED' ||
        error.message === 'AUTH_TOKEN_INVALID'
      ) {
        throw new UnauthorizedError(
          'AUTH_REFRESH_TOKEN_INVALID',
          'Invalid or expired refresh token'
        );
      }
    }
    throw error;
  }
}

/**
 * Get current user profile
 */
export async function getMe(userId: string): Promise<AuthResponse['user']> {
  const user = await authRepo.findUserById(userId);
  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    balance: user.balance.toString(),
    emailVerified: user.emailVerified,
  };
}

/**
 * Verify email with token
 * TODO: Implement email verification token logic
 */
export async function verifyEmail(token: string): Promise<void> {
  // TODO: Verify token and mark email as verified
  throw new BadRequestError(
    'NOT_IMPLEMENTED',
    'Email verification not yet implemented'
  );
}

/**
 * Request password reset
 * TODO: Implement password reset token logic
 */
export async function requestPasswordReset(email: string): Promise<void> {
  // TODO: Generate reset token and send email
  throw new BadRequestError(
    'NOT_IMPLEMENTED',
    'Password reset not yet implemented'
  );
}

/**
 * Confirm password reset
 * TODO: Implement password reset token verification
 */
export async function confirmPasswordReset(
  token: string,
  newPassword: string
): Promise<void> {
  // TODO: Verify token, hash new password, update user
  throw new BadRequestError(
    'NOT_IMPLEMENTED',
    'Password reset not yet implemented'
  );
}
