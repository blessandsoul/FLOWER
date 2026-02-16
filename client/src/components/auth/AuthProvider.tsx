'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setUser, clearAuth } from '@/features/auth/store/authSlice';
import { authApi } from '@/features/auth/services/auth.api';

/**
 * AuthProvider hydrates auth state from httpOnly cookies on mount.
 * It calls /auth/me to check if the user has a valid session.
 */
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();
    const { isHydrating } = useAppSelector((state) => state.auth);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Call /auth/me - cookies are sent automatically with credentials: 'include'
                const user = await authApi.me();
                dispatch(setUser(user));
            } catch {
                // No valid session or token expired - clear auth state
                dispatch(clearAuth());
            }
        };

        checkAuth();
    }, [dispatch]);

    // Optionally show a loading state during hydration
    // For now, we render children immediately to avoid flash
    // The isHydrating state can be used by components to show skeleton states

    return <>{children}</>;
};
