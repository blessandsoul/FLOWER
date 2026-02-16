// User roles enum (matches database ENUM)
export type UserRole = "USER" | "ADMIN";

// Full user from database
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  isActive: boolean;
  tokenVersion: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  roles?: UserRole[];

  // Email verification
  emailVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpiresAt: Date | null;

  // Password reset
  resetPasswordToken: string | null;
  resetPasswordTokenExpiresAt: Date | null;

  // Account lockout
  failedLoginAttempts: number;
  lockedUntil: Date | null;
}

// Safe user (without sensitive fields) for API responses
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

export interface CreateUserData {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface UpdateUserData {
  email?: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string | null;
  isActive?: boolean;
  tokenVersion?: number;
  // Email verification
  emailVerified?: boolean;
  verificationToken?: string | null;
  verificationTokenExpiresAt?: Date | null;
  // Password reset
  resetPasswordToken?: string | null;
  resetPasswordTokenExpiresAt?: Date | null;
  // Account lockout
  failedLoginAttempts?: number;
  lockedUntil?: Date | null;
}
