'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks';
import { authApi } from '@/features/auth/services/auth.api';

interface TestAccount {
  email: string;
  password: string;
  role: string;
  label: string;
  color: string;
}

const TEST_ACCOUNTS: TestAccount[] = [
  {
    email: 'admin@florca.ge',
    password: 'password123',
    role: 'ADMIN',
    label: 'Admin',
    color: 'bg-red-500 hover:bg-red-600',
  },
  {
    email: 'user@example.com',
    password: 'password123',
    role: 'USER',
    label: 'User',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
];

export function DevLoginPanel() {
  const { login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Only show in development
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const handleLogin = async (account: TestAccount) => {
    setLoading(account.email);
    setError(null);

    try {
      // Use real auth API - server sets httpOnly cookies automatically
      const response = await authApi.login({
        email: account.email,
        password: account.password,
      });

      login(response.user);
      setIsOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-50 bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
        title="Dev Login Panel"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" x2="3" y1="12" y2="12" />
        </svg>
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-80 bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                🧪 Dev Login
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" x2="6" y1="6" y2="18" />
                  <line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Quick login to test accounts
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-4 mt-3 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded">
              {error}
            </div>
          )}

          {/* Account Buttons */}
          <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
            {TEST_ACCOUNTS.map((account) => (
              <button
                key={account.email}
                onClick={() => handleLogin(account)}
                disabled={loading !== null}
                className={`w-full px-4 py-3 rounded-lg text-white font-medium transition-all ${account.color} disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{account.label}</span>
                  <span className="text-xs opacity-80">{account.role}</span>
                </div>
                <div className="flex items-center gap-2">
                  {loading === account.email && (
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Password: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">password123</code>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
