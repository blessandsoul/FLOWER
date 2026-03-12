import type { UserRole } from "@prisma/client";

export interface AccessTokenPayload {
  userId: string;
  roles: UserRole[];
  tokenVersion: number;
  emailVerified: boolean;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
  tokenVersion: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface SafeUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  roles: UserRole[];
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
  warnings?: string[];
}

/** Response shape sent to the client (tokens are in httpOnly cookies, never in body) */
export interface ClientAuthResponse {
  user: SafeUser;
  warnings?: string[];
}

// JWT decoded user (used in auth middleware)
export interface JwtUser {
  id: string;
  roles: UserRole[];
  emailVerified: boolean;
}
