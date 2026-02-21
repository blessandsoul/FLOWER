/**
 * Auth API Service
 * Connects to the server auth endpoints
 */

import type { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth';
import type { User } from '@/types';
import { fetchApi, unwrapData, setAccessToken } from '@/lib/api';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface AuthResponseWithTokens extends AuthResponse {
    accessToken?: string;
    refreshToken?: string;
}

export const authApi = {
    register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
        const json = await fetchApi<ApiResponse<AuthResponseWithTokens>>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        const data = unwrapData(json);
        if (data.accessToken) setAccessToken(data.accessToken);
        return data;
    },

    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const json = await fetchApi<ApiResponse<AuthResponseWithTokens>>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        const data = unwrapData(json);
        if (data.accessToken) setAccessToken(data.accessToken);
        return data;
    },

    logout: async (): Promise<void> => {
        await fetchApi<ApiResponse<null>>('/auth/logout', {
            method: 'POST',
        });
        setAccessToken(null);
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
