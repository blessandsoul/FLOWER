/**
 * Users Module Types
 */

import type { UserRole } from '@/config/constants';

/**
 * User public profile (no sensitive data)
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  balance: string;
  emailVerified: boolean;
  isReseller: boolean;
  isVip: boolean;
  phone: string | null;
  address: string | null;
  companyName: string | null;
  taxId: string | null;
  personalId: string | null;
  createdAt: string;
}

/**
 * User update request
 */
export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
}

/**
 * Admin user update request
 */
export interface AdminUpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  isReseller?: boolean;
  isVip?: boolean;
  balance?: string;
}

/**
 * User list filters
 */
export interface UserListFilters {
  role?: UserRole;
  isReseller?: boolean;
  isVip?: boolean;
  search?: string;
}
