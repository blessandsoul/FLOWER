'use client';

import { useAuth } from '@/hooks';
import { RouteGuard } from '@/components/auth/RouteGuard';
import { AdminDashboard, UserDashboard } from '@/features/dashboard/components';

export default function DashboardPage() {
    const { user, isAdmin } = useAuth();

    return (
        <RouteGuard>
            <div className="container py-6 px-4 space-y-6">
                {user && (isAdmin ? <AdminDashboard /> : <UserDashboard user={user} />)}
            </div>
        </RouteGuard>
    );
}
