import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRES_IN } from '../config';
import { UserRole } from '../config/constants';

/**
 * JWT Authentication Utilities
 *
 * Handles token generation, verification, and decoding for the FLORCA system.
 */

/**
 * JWT Token Payload
 */
export interface TokenPayload {
  sub: string;      // User ID
  role: UserRole;   // User role
  iat: number;      // Issued at timestamp
  exp: number;      // Expiration timestamp
}

/**
 * Token Pair (Access + Refresh)
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate Access Token
 */
export const generateAccessToken = (userId: string, role: UserRole): string => {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN as string & jwt.SignOptions['expiresIn'],
      algorithm: 'HS256',
    }
  );
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (userId: string, role: UserRole): string => {
  const secret = JWT_REFRESH_SECRET || JWT_SECRET;

  return jwt.sign(
    {
      sub: userId,
      role,
    },
    secret,
    {
      expiresIn: JWT_REFRESH_EXPIRES_IN as string & jwt.SignOptions['expiresIn'],
      algorithm: 'HS256',
    }
  );
};

/**
 * Generate Token Pair (Access + Refresh)
 */
export const generateTokenPair = (userId: string, role: UserRole): TokenPair => {
  return {
    accessToken: generateAccessToken(userId, role),
    refreshToken: generateRefreshToken(userId, role),
  };
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as TokenPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('AUTH_TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('AUTH_TOKEN_INVALID');
    }
    throw new Error('AUTH_TOKEN_INVALID');
  }
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const secret = JWT_REFRESH_SECRET || JWT_SECRET;

    const decoded = jwt.verify(token, secret, {
      algorithms: ['HS256'],
    }) as TokenPayload;

    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('AUTH_REFRESH_TOKEN_EXPIRED');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('AUTH_REFRESH_TOKEN_INVALID');
    }
    throw new Error('AUTH_REFRESH_TOKEN_INVALID');
  }
};

/**
 * Decode Token (without verification)
 * Useful for extracting payload without checking signature/expiration
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.decode(token) as TokenPayload;
    return decoded;
  } catch {
    return null;
  }
};

/**
 * Extract Token from Authorization Header
 * Format: "Bearer <token>"
 */
export const extractTokenFromHeader = (authorizationHeader: string | undefined): string | null => {
  if (!authorizationHeader) {
    return null;
  }

  const parts = authorizationHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }

  return parts[1];
};

/**
 * Hash Password (using bcrypt)
 */
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Compare Password
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};
