import { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setUser, logout as logoutAction } from '@/features/auth/store/authSlice';
import { authApi } from '@/features/auth/services/auth.api';
import type { User } from '@/types';

/**
 * Auth hook using httpOnly cookies for secure token storage.
 * - Tokens are stored in httpOnly cookies by the server
 * - Client only stores user info in Redux for display purposes
 * - All auth operations go through the server which manages cookies
 */
export function useAuth() {
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isHydrating } = useAppSelector((state) => state.auth);

    /**
     * Called after successful login/register response.
     * Server has already set httpOnly cookies - we just update Redux with user data.
     */
    const login = useCallback((userData: User) => {
        dispatch(setUser(userData));
    }, [dispatch]);

    /**
     * Logout - calls server to invalidate session and clear cookies.
     */
    const logout = useCallback(async () => {
        try {
            // Call server to invalidate refresh token and clear httpOnly cookies
            await authApi.logout();
        } catch {
            // Ignore errors - we still want to clear local state
        }
        // Clear Redux state
        dispatch(logoutAction());
    }, [dispatch]);

    return {
        user: user as User | null,
        isAuthenticated,
        isHydrating, // True during initial auth check
        isAdmin: (user as User | null)?.roles?.includes('ADMIN') ?? false,
        isUser: (user as User | null)?.roles?.includes('USER') ?? false,
        login,
        logout,
    };
}
