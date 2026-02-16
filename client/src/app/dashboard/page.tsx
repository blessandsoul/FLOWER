'use client';

import { useState } from 'react';
import { TEST_ACCOUNTS } from '@/lib/mock-data';
import { AdminDashboard, UserDashboard } from '@/features/dashboard/components';
import type { User } from '@/types';

const ROLE_CONFIG: Record<string, { label: string; color: string; activeBg: string; border: string }> = {
    ADMIN: { label: 'ადმინი', color: 'text-red-700', activeBg: 'bg-red-100', border: 'border-red-300' },
    USER: { label: 'მომხმარებელი', color: 'text-blue-700', activeBg: 'bg-blue-100', border: 'border-blue-300' },
};

function getAccountKey(user: User): string {
    return user.roles.includes('ADMIN') ? 'ADMIN' : 'USER';
}

export default function DashboardPage() {
    const [activeUser, setActiveUser] = useState<User>(TEST_ACCOUNTS[0]);
    const isAdmin = activeUser.roles.includes('ADMIN');

    return (
        <div className="container py-6 px-4 space-y-6">
            {/* Role Switcher */}
            <div className="flex flex-wrap gap-1.5">
                {TEST_ACCOUNTS.map((account) => {
                    const key = getAccountKey(account);
                    const cfg = ROLE_CONFIG[key];
                    const isActive = activeUser.id === account.id;

                    return (
                        <button
                            key={account.id}
                            onClick={() => setActiveUser(account)}
                            className={`
                                px-3 py-1.5 rounded-full text-xs font-semibold transition-all
                                ${isActive
                                    ? `${cfg.activeBg} ${cfg.color} ${cfg.border} border shadow-sm`
                                    : 'bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted'
                                }
                            `}
                        >
                            {cfg.label}
                        </button>
                    );
                })}
            </div>

            {/* Role-Specific Dashboard */}
            {isAdmin ? <AdminDashboard /> : <UserDashboard user={activeUser} />}
        </div>
    );
}
