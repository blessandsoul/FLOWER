/**
 * Auth Repository
 * Database operations for authentication
 */

import { prisma } from '@/libs/prisma';
import type { User } from '@prisma/client';
import type { UserRole } from '@/config/constants';

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

/**
 * Create new user
 */
export async function createUser(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}): Promise<User> {
  return prisma.user.create({
    data: {
      email: data.email.toLowerCase(),
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      balance: 0, // Initialize with zero balance
      emailVerified: false,
    },
  });
}

/**
 * Update user email verification status
 */
export async function markEmailAsVerified(userId: string): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  });
}

/**
 * Update user password
 */
export async function updateUserPassword(
  userId: string,
  hashedPassword: string
): Promise<User> {
  return prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { updatedAt: new Date() },
  });
}
