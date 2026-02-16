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
