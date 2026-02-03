/**
 * Invoices API Service
 * HTTP calls to the invoices endpoints
 */

const API_BASE = '/api/v1/invoices';

/**
 * Fetch function wrapper that handles JSON responses
 */
async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: { message: 'Request failed' } }));
        throw new Error(error.error?.message || 'Request failed');
    }

    return response.json();
}

/**
 * Get auth headers from stored token
 */
function getAuthHeaders(): Record<string, string> {
    // Token retrieval will depend on auth implementation
    const token = typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;

    return token ? { Authorization: `Bearer ${token}` } : {};
}

// Customer endpoints
export const invoicesApi = {
    getMyInvoices: (page = 1, limit = 10) =>
        apiFetch(`${API_BASE}/my?page=${page}&limit=${limit}`, {
            headers: getAuthHeaders(),
        }),

    getMyInvoice: (id: string) =>
        apiFetch(`${API_BASE}/my/${id}`, {
            headers: getAuthHeaders(),
        }),

    downloadMyPdf: async (id: string): Promise<Blob> => {
        const response = await fetch(`${API_BASE}/my/${id}/pdf`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to download PDF');
        return response.blob();
    },

    // Admin/Operator/Accountant endpoints
    listInvoices: (params: { page?: number; limit?: number; userId?: string; status?: string; fromDate?: string; toDate?: string } = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) searchParams.set(key, String(value));
        });
        return apiFetch(`${API_BASE}?${searchParams.toString()}`, {
            headers: getAuthHeaders(),
        });
    },

    getInvoice: (id: string) =>
        apiFetch(`${API_BASE}/${id}`, {
            headers: getAuthHeaders(),
        }),

    downloadPdf: async (id: string): Promise<Blob> => {
        const response = await fetch(`${API_BASE}/${id}/pdf`, {
            headers: getAuthHeaders(),
        });
        if (!response.ok) throw new Error('Failed to download PDF');
        return response.blob();
    },

    getByOrder: (orderId: string) =>
        apiFetch(`${API_BASE}/order/${orderId}`, {
            headers: getAuthHeaders(),
        }),
};
