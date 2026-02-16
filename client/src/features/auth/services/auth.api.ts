/**
 * Auth API Service
 * Connects to the server auth endpoints
 */

import type { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth';
import type { User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// Server response wrapper type
interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include', // Send httpOnly cookies with requests
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    const json = await response.json().catch(() => ({ success: false, error: { message: 'Request failed' } }));

    if (!response.ok) {
        throw new Error(json.error?.message || json.message || `HTTP error! status: ${response.status}`);
    }

    // Unwrap the data field from server response envelope
    return (json as ApiResponse<T>).data;
}

export const authApi = {
    /**
     * Register a new user
     */
    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        return fetchApi<AuthResponse>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    /**
     * Login with email and password
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        return fetchApi<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    },

    /**
     * Logout and invalidate refresh token (token sent via httpOnly cookie)
     */
    logout: async (): Promise<void> => {
        await fetchApi<null>('/auth/logout', {
            method: 'POST',
        });
    },

    /**
     * Refresh access token (tokens sent/received via httpOnly cookies)
     */
    refresh: async (): Promise<void> => {
        await fetchApi<null>('/auth/refresh', {
            method: 'POST',
        });
    },

    /**
     * Get current authenticated user (token sent via httpOnly cookie)
     */
    me: async (): Promise<User> => {
        return fetchApi<User>('/auth/me');
    },
};
