const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface ApiSuccessResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

let csrfToken: string | null = null;

async function ensureCsrfToken(): Promise<string> {
    if (csrfToken) return csrfToken;

    const response = await fetch(`${API_BASE_URL}/auth/csrf-token`, {
        credentials: 'include',
    });

    const json = await response.json();
    csrfToken = json.data?.csrfToken ?? null;

    if (!csrfToken) {
        throw new Error('Failed to fetch CSRF token');
    }

    return csrfToken;
}

export function clearCsrfToken(): void {
    csrfToken = null;
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const method = options?.method?.toUpperCase() ?? 'GET';
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
    };

    // Add CSRF token for state-changing requests
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        try {
            const token = await ensureCsrfToken();
            headers['X-CSRF-Token'] = token;
        } catch {
            // Continue without CSRF token - the server will reject if needed
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: 'include',
        headers,
    });

    const json = await response.json().catch(() => ({
        success: false,
        error: { message: 'Request failed' },
    }));

    if (!response.ok) {
        // If CSRF token was invalid, clear it and retry once
        if (response.status === 403 && json.error?.code === 'INVALID_CSRF_TOKEN') {
            clearCsrfToken();
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
                const retryToken = await ensureCsrfToken();
                headers['X-CSRF-Token'] = retryToken;

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

        throw new Error(
            json.error?.message || json.message || `HTTP error! status: ${response.status}`
        );
    }

    return json as T;
}

export function unwrapData<T>(json: ApiSuccessResponse<T>): T {
    return json.data;
}
