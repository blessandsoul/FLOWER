'use client';

import { AdminOrdersTable } from './AdminOrdersTable';

export function AdminDashboard() {
    return (
        <div className="space-y-6">
            <AdminOrdersTable />
        </div>
    );
}
