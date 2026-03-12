const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

// One-time cleanup of legacy localStorage token
try { localStorage.removeItem('accessToken'); } catch {}

interface ApiSuccessResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

// Deduplicates concurrent refresh attempts into a single request
let refreshPromise: Promise<boolean> | null = null;

async function tryRefreshToken(): Promise<boolean> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
    })
        .then((res) => res.ok)
        .catch(() => false)
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
        ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options?.headers as Record<string, string>),
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers,
    });

    // On 401, attempt a token refresh and retry the original request once
    if (response.status === 401 && !endpoint.startsWith('/auth/refresh')) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
            const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                credentials: 'include',
                headers,
            });

            const retryJson = await retryResponse.json().catch(() => ({
                success: false,
                error: { message: 'Request failed' },
            }));

            if (!retryResponse.ok) {
                throw new Error(
                    retryJson.error?.message || retryJson.message || `HTTP error! status: ${retryResponse.status}`
                );
            }

            return retryJson as T;
        }
    }

    const json = await response.json().catch(() => ({
        success: false,
        error: { message: 'Request failed' },
    }));

    if (!response.ok) {
        throw new Error(
            json.error?.message || json.message || `HTTP error! status: ${response.status}`
        );
    }

    return json as T;
}

export function unwrapData<T>(json: ApiSuccessResponse<T>): T {
    return json.data;
}
