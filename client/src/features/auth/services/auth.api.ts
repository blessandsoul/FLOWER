/**
 * Auth API Service
 * Connects to the server auth endpoints
 */

import type { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth';
import type { User } from '@/types';
import { fetchApi, unwrapData } from '@/lib/api';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const authApi = {
    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const json = await fetchApi<ApiResponse<AuthResponse>>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        return unwrapData(json);
    },

    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const json = await fetchApi<ApiResponse<AuthResponse>>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        return unwrapData(json);
    },

    logout: async (): Promise<void> => {
        await fetchApi<ApiResponse<null>>('/auth/logout', {
            method: 'POST',
        });
    },

    refresh: async (): Promise<void> => {
        await fetchApi<ApiResponse<null>>('/auth/refresh', {
            method: 'POST',
        });
    },

    me: async (): Promise<User> => {
        const json = await fetchApi<ApiResponse<User>>('/auth/me');
        return unwrapData(json);
    },
};
