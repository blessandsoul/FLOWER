import { useCallback } from 'react';
import { useAuth } from './useAuth';
import type { Role } from '@/types';

export function usePermission() {
    const { user, isAuthenticated } = useAuth();

    const hasRole = useCallback((role: Role): boolean => {
        return user?.roles?.includes(role) ?? false;
    }, [user?.roles]);

    const hasAnyRole = useCallback((roles: Role[]): boolean => {
        return roles.some(role => user?.roles?.includes(role));
    }, [user?.roles]);

    const canAccess = useCallback((requiredRoles: Role[]): boolean => {
        if (!isAuthenticated) return false;
        return hasAnyRole(requiredRoles);
    }, [isAuthenticated, hasAnyRole]);

    return {
        hasRole,
        hasAnyRole,
        canAccess,
        isAdmin: hasRole('ADMIN'),
        isUser: hasRole('USER'),
    };
}
