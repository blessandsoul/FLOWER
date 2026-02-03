/**
 * Users Module Zod Schemas
 */

import { z } from 'zod';
import { PaginationSchema, UUIDSchema, DecimalStringSchema } from '@/shared/schemas/common';
import { USER_ROLES } from '@/config/constants';

/**
 * Update current user profile
 */
export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
});

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

/**
 * Admin update user
 */
export const AdminUpdateUserSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  role: z.nativeEnum(USER_ROLES).optional(),
  isReseller: z.boolean().optional(),
  isVip: z.boolean().optional(),
  balance: DecimalStringSchema.optional(),
});

export type AdminUpdateUserInput = z.infer<typeof AdminUpdateUserSchema>;

/**
 * User list query parameters
 */
export const UserListQuerySchema = PaginationSchema.extend({
  role: z.nativeEnum(USER_ROLES).optional(),
  isReseller: z.coerce.boolean().optional(),
  isVip: z.coerce.boolean().optional(),
  search: z.string().max(100).optional(),
});

export type UserListQueryInput = z.infer<typeof UserListQuerySchema>;

/**
 * User ID parameter
 */
export const UserIdParamSchema = z.object({
  id: UUIDSchema,
});

export type UserIdParam = z.infer<typeof UserIdParamSchema>;

/**
 * Update billing details
 */
export const UpdateBillingSchema = z.object({
  phone: z.string().max(20).optional(),
  address: z.string().max(500).optional(),
  companyName: z.string().max(200).optional(),
  taxId: z.string().max(20).optional(),
  personalId: z.string().max(20).optional(),
});

export type UpdateBillingInput = z.infer<typeof UpdateBillingSchema>;
