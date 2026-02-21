const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

interface ApiSuccessResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
    };

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
        throw new Error(
            json.error?.message || json.message || `HTTP error! status: ${response.status}`
        );
    }

    return json as T;
}

export function unwrapData<T>(json: ApiSuccessResponse<T>): T {
    return json.data;
}
