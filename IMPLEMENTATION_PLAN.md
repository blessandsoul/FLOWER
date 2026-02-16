# ADMIN + USER Role System Implementation Plan

## Overview
Simplify FLOWER project to a two-role system (ADMIN, USER). Server is **already complete** - this plan focuses on client-side alignment.

---

## Part 1: Server (NO CHANGES NEEDED)

The server already has a complete two-role system:

| Component | Location | Status |
|-----------|----------|--------|
| Role enum | `server/prisma/schema.prisma:19-22` | `enum UserRole { USER, ADMIN }` |
| Multi-role support | `UserRoleAssignment` junction table | Complete |
| Auth middleware | `server/src/middlewares/authGuard.ts` | `requireRole()`, `requireSelfOrAdmin()` |
| JWT tokens | Access (15min) + Refresh (7d) with roles array | Complete |
| Auth endpoints | `/auth/register`, `/login`, `/refresh`, `/me`, `/logout` | Complete |
| User endpoints | CRUD + role management (admin-only) | Complete |

**No server changes required.**

---

## Part 2: Client Implementation Steps

### Step 1: Update Types
**Files to modify:**
- `client/src/types/index.ts`
- Create `client/src/types/auth.ts` (new)

**Changes to `types/index.ts`:**
```typescript
// Simplify Role type
export type Role = 'USER' | 'ADMIN';  // Remove RESELLER, OPERATOR, LOGISTICS, ACCOUNTANT

// Update User type to match server
export type User = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string | null;
    roles: Role[];              // Changed from single role to array
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
};
// Remove: isVip, isReseller, balance, address, companyName, taxId, personalId
```

**New file `types/auth.ts`:**
```typescript
import type { User } from './index';

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
    warnings?: string[];
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}
```

---

### Step 2: Create Auth Hooks
**Files to create:**
- `client/src/hooks/useAuth.ts`
- `client/src/hooks/usePermission.ts`
- `client/src/hooks/index.ts`

**useAuth.ts:**
```typescript
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCredentials, logout as logoutAction } from '@/features/auth/store/authSlice';
import type { LoginCredentials, RegisterCredentials } from '@/types/auth';

export function useAuth() {
    const dispatch = useAppDispatch();
    const { user, tokens, isAuthenticated } = useAppSelector((state) => state.auth);

    const login = async (credentials: LoginCredentials) => {
        // API call + dispatch setCredentials
    };

    const logout = async () => {
        // API call + dispatch logoutAction
    };

    return {
        user,
        tokens,
        isAuthenticated,
        isAdmin: user?.roles?.includes('ADMIN') ?? false,
        isUser: user?.roles?.includes('USER') ?? false,
        login,
        logout,
    };
}
```

**usePermission.ts:**
```typescript
import { useAuth } from './useAuth';
import type { Role } from '@/types';

export function usePermission() {
    const { user, isAuthenticated } = useAuth();

    const hasRole = (role: Role): boolean => {
        return user?.roles?.includes(role) ?? false;
    };

    const hasAnyRole = (roles: Role[]): boolean => {
        return roles.some(role => hasRole(role));
    };

    const canAccess = (requiredRoles: Role[]): boolean => {
        if (!isAuthenticated) return false;
        return hasAnyRole(requiredRoles);
    };

    return {
        hasRole,
        hasAnyRole,
        canAccess,
        isAdmin: hasRole('ADMIN'),
        isUser: hasRole('USER'),
    };
}
```

---

### Step 3: Update Auth Slice
**File:** `client/src/features/auth/store/authSlice.ts`

**Changes:**
```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';
import type { AuthTokens } from '@/types/auth';

interface AuthState {
    user: User | null;           // Was: any | null
    tokens: AuthTokens | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: User; tokens: AuthTokens }>) => {
            state.user = action.payload.user;
            state.tokens = action.payload.tokens;
            state.isAuthenticated = true;
            state.error = null;
        },
        updateUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.tokens = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setCredentials, updateUser, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
```

---

### Step 4: Create Auth API Service
**File to create:** `client/src/features/auth/services/auth.api.ts`

```typescript
import type { AuthResponse, AuthTokens, LoginCredentials, RegisterCredentials } from '@/types/auth';
import type { User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const authApi = {
    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    },

    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    logout: async (refreshToken: string): Promise<void> => {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });
    },

    refresh: async (refreshToken: string): Promise<AuthTokens> => {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });
        if (!response.ok) throw new Error('Token refresh failed');
        return response.json();
    },

    me: async (accessToken: string): Promise<User> => {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });
        if (!response.ok) throw new Error('Failed to get user');
        const data = await response.json();
        return data.data;
    },
};
```

---

### Step 5: Create Route Protection
**Files to create:**
- `client/src/middleware.ts`
- `client/src/components/auth/RouteGuard.tsx`

**middleware.ts (Next.js middleware):**
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/orders', '/profile'];
const ADMIN_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get('accessToken')?.value;
    const userRoles = request.cookies.get('userRoles')?.value;

    const isAuthenticated = !!accessToken;
    const roles: string[] = userRoles ? JSON.parse(userRoles) : [];
    const isAdmin = roles.includes('ADMIN');

    // Redirect authenticated users away from auth pages
    if (AUTH_ROUTES.some(route => pathname.startsWith(route))) {
        if (isAuthenticated) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Protect admin routes
    if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (!isAdmin) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    // Protect user routes
    if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
        if (!isAuthenticated) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
```

**RouteGuard.tsx:**
```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, usePermission } from '@/hooks';
import type { Role } from '@/types';

interface RouteGuardProps {
    children: React.ReactNode;
    requiredRoles?: Role[];
    requireAuth?: boolean;
    redirectTo?: string;
}

export function RouteGuard({
    children,
    requiredRoles,
    requireAuth = true,
    redirectTo = '/login',
}: RouteGuardProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { canAccess } = usePermission();

    useEffect(() => {
        if (requireAuth && !isAuthenticated) {
            router.push(redirectTo);
            return;
        }
        if (requiredRoles && !canAccess(requiredRoles)) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, requiredRoles, requireAuth, router, redirectTo, canAccess]);

    if (requireAuth && !isAuthenticated) return null;
    if (requiredRoles && !canAccess(requiredRoles)) return null;

    return <>{children}</>;
}
```

---

### Step 6: Simplify Dashboard
**File:** `client/src/app/dashboard/page.tsx`

**Current:** 750 lines with 5 role-specific dashboards
**Target:** ~50 lines with 2 dashboards

```typescript
'use client';

import { useAuth, usePermission } from '@/hooks';
import { AdminDashboard } from '@/features/dashboard/components/AdminDashboard';
import { UserDashboard } from '@/features/dashboard/components/UserDashboard';

export default function DashboardPage() {
    const { user } = useAuth();
    const { isAdmin } = usePermission();

    if (!user) return <DashboardSkeleton />;

    return isAdmin ? <AdminDashboard /> : <UserDashboard user={user} />;
}
```

**Components to extract:**
- Move `AdminDashboard` function to `client/src/features/dashboard/components/AdminDashboard.tsx`
- Rename `CustomerDashboard` to `UserDashboard` and move to `client/src/features/dashboard/components/UserDashboard.tsx`

**Remove these functions:**
- `OperatorDashboard`
- `LogisticsDashboard`
- `AccountantDashboard`
- VIP/Reseller special handling

---

### Step 7: Update Mock Data
**File:** `client/src/lib/mock-data.ts`

**Current:** 7 test accounts
**Target:** 2 test accounts

```typescript
import type { User } from '@/types';

export const TEST_ACCOUNTS: User[] = [
    {
        id: 'u-admin',
        email: 'admin@florca.ge',
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: null,
        roles: ['ADMIN'],
        isActive: true,
        emailVerified: true,
        createdAt: '2026-01-01T00:00:00Z',
        updatedAt: '2026-01-01T00:00:00Z',
    },
    {
        id: 'u-user',
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'Customer',
        phoneNumber: '+995555123456',
        roles: ['USER'],
        isActive: true,
        emailVerified: true,
        createdAt: '2026-01-15T00:00:00Z',
        updatedAt: '2026-01-15T00:00:00Z',
    },
];

export const MOCK_USER = TEST_ACCOUNTS[1];
```

---

### Step 8: Update DevLoginPanel
**File:** `client/src/components/dev/DevLoginPanel.tsx`

**Simplify to 2 buttons:**
```typescript
const TEST_ACCOUNTS = [
    { email: 'admin@florca.ge', label: 'Admin', color: 'bg-red-500 hover:bg-red-600' },
    { email: 'user@example.com', label: 'User', color: 'bg-blue-500 hover:bg-blue-600' },
];
```

---

### Step 9: Create Auth Pages (Optional)
**Files to create:**
- `client/src/app/(auth)/layout.tsx`
- `client/src/app/(auth)/login/page.tsx`
- `client/src/app/(auth)/register/page.tsx`

---

## Part 3: Testing Guide

### Server Verification

```bash
# Start server
cd server && npm run dev

# 1. Register user (returns USER role by default)
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","firstName":"Test","lastName":"User"}'

# Expected response:
# { "user": { "id": "...", "roles": ["USER"], ... }, "accessToken": "...", "refreshToken": "..." }

# 2. Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'

# 3. Get current user
curl http://localhost:8000/api/v1/auth/me \
  -H "Authorization: Bearer <accessToken>"

# 4. Token refresh
curl -X POST http://localhost:8000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"<refreshToken>"}'
```

### Client Manual Testing

| Test | Steps | Expected |
|------|-------|----------|
| Types compile | `cd client && npm run build` | No type errors |
| USER login | Click "User" in DevLoginPanel | See UserDashboard |
| ADMIN login | Click "Admin" in DevLoginPanel | See AdminDashboard |
| Route protection | Visit `/dashboard` logged out | Redirect to `/login` |
| Admin route | Visit `/admin` as USER | Redirect to `/dashboard` |
| Admin access | Visit `/admin` as ADMIN | Show admin page |
| useAuth hook | Check `isAdmin` value | Correct for role |
| Logout | Click logout | Clear state, redirect |

### Automated Tests

```typescript
// hooks/__tests__/useAuth.test.ts
describe('useAuth', () => {
    it('returns isAuthenticated false when no user');
    it('returns isAdmin true for admin user');
    it('returns isAdmin false for regular user');
});
```

### E2E Tests (Playwright)

```typescript
test('user login flow', async ({ page }) => {
    await page.goto('/login');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
});

test('admin blocked from admin routes', async ({ page }) => {
    // Login as user, navigate to /admin
    await expect(page).toHaveURL('/dashboard');
});
```

---

## Summary: Files to Create/Modify

| File | Action |
|------|--------|
| `client/src/types/index.ts` | MODIFY - simplify Role, User |
| `client/src/types/auth.ts` | CREATE |
| `client/src/hooks/useAuth.ts` | CREATE |
| `client/src/hooks/usePermission.ts` | CREATE |
| `client/src/hooks/index.ts` | CREATE |
| `client/src/features/auth/store/authSlice.ts` | MODIFY - add types |
| `client/src/features/auth/services/auth.api.ts` | CREATE |
| `client/src/middleware.ts` | CREATE |
| `client/src/components/auth/RouteGuard.tsx` | CREATE |
| `client/src/features/dashboard/components/AdminDashboard.tsx` | CREATE (extract) |
| `client/src/features/dashboard/components/UserDashboard.tsx` | CREATE (extract) |
| `client/src/app/dashboard/page.tsx` | MODIFY - simplify |
| `client/src/lib/mock-data.ts` | MODIFY - 2 accounts |
| `client/src/components/dev/DevLoginPanel.tsx` | MODIFY - 2 buttons |
