/**
 * Users Service
 * Business logic for user management
 */

import { Prisma } from '@prisma/client';
import { logger } from '@/libs/logger';
import { NotFoundError, ForbiddenError } from '@/shared/errors/errors';
import * as usersRepo from './users.repo';
import type { UserProfile, UserListFilters } from './users.types';
import type { UpdateProfileInput, AdminUpdateUserInput, UpdateBillingInput } from './users.schemas';

/**
 * Map user entity to public profile
 */
function toUserProfile(user: Prisma.UserGetPayload<{}>): UserProfile {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    balance: user.balance.toString(),
    emailVerified: user.emailVerified,
    isReseller: user.isReseller,
    isVip: user.isVip,
    phone: user.phone,
    address: user.address,
    companyName: user.companyName,
    taxId: user.taxId,
    personalId: user.personalId,
    createdAt: user.createdAt.toISOString(),
  };
}

/**
 * Get user by ID
 */
export async function getById(userId: string): Promise<UserProfile> {
  const user = await usersRepo.findById(userId);

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  return toUserProfile(user);
}

/**
 * List users with filters (admin only)
 */
export async function listUsers(
  filters: UserListFilters,
  page: number,
  limit: number
): Promise<{ users: UserProfile[]; total: number }> {
  const { users, total } = await usersRepo.findMany(filters, page, limit);

  return {
    users: users.map(toUserProfile),
    total,
  };
}

/**
 * Update current user profile
 */
export async function updateProfile(
  userId: string,
  input: UpdateProfileInput
): Promise<UserProfile> {
  const user = await usersRepo.findById(userId);

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  const updatedUser = await usersRepo.update(userId, {
    firstName: input.firstName,
    lastName: input.lastName,
  });

  logger.info({ userId }, 'User profile updated');

  return toUserProfile(updatedUser);
}

/**
 * Admin update user
 */
export async function adminUpdateUser(
  userId: string,
  input: AdminUpdateUserInput
): Promise<UserProfile> {
  const user = await usersRepo.findById(userId);

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  const updateData: Prisma.UserUpdateInput = {};

  if (input.firstName !== undefined) updateData.firstName = input.firstName;
  if (input.lastName !== undefined) updateData.lastName = input.lastName;
  if (input.role !== undefined) updateData.role = input.role;
  if (input.isReseller !== undefined) updateData.isReseller = input.isReseller;
  if (input.isVip !== undefined) updateData.isVip = input.isVip;
  if (input.balance !== undefined) updateData.balance = new Prisma.Decimal(input.balance);

  const updatedUser = await usersRepo.update(userId, updateData);

  logger.info({ userId, changes: Object.keys(updateData) }, 'User updated by admin');

  return toUserProfile(updatedUser);
}

/**
 * Update billing details
 */
export async function updateBilling(
  userId: string,
  input: UpdateBillingInput
): Promise<UserProfile> {
  const user = await usersRepo.findById(userId);

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  const updatedUser = await usersRepo.update(userId, {
    phone: input.phone,
    address: input.address,
    companyName: input.companyName,
    taxId: input.taxId,
    personalId: input.personalId,
  });

  logger.info({ userId }, 'User billing details updated');

  return toUserProfile(updatedUser);
}

/**
 * Get user balance
 */
export async function getBalance(userId: string): Promise<string> {
  const user = await usersRepo.findById(userId);

  if (!user) {
    throw new NotFoundError('USER_NOT_FOUND', 'User not found');
  }

  return user.balance.toString();
}
