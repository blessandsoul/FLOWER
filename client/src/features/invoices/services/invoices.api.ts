/**
 * Invoices API Service
 *
 * NOTE: This is a mock implementation for standalone client development.
 * Replace with real API calls when server is connected.
 */

import { MOCK_INVOICES } from '@/lib/mock-data';

// Customer endpoints
export const invoicesApi = {
    getMyInvoices: async (page = 1, limit = 10) => {
        // Mock paginated response
        const start = (page - 1) * limit;
        const end = start + limit;
        const items = MOCK_INVOICES.slice(start, end);
        return {
            success: true,
            data: {
                items,
                pagination: {
                    page,
                    limit,
                    total: MOCK_INVOICES.length,
                    totalPages: Math.ceil(MOCK_INVOICES.length / limit),
                },
            },
        };
    },

    getMyInvoice: async (id: string) => {
        const invoice = MOCK_INVOICES.find(inv => inv.id === id);
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        return { success: true, data: invoice };
    },

    downloadMyPdf: async (_id: string): Promise<Blob> => {
        // Return empty blob - PDF generation requires server
        console.warn('PDF download requires server connection');
        return new Blob(['PDF generation requires server'], { type: 'text/plain' });
    },

    // Admin/Operator/Accountant endpoints
    listInvoices: async (params: { page?: number; limit?: number; userId?: string; status?: string; fromDate?: string; toDate?: string } = {}) => {
        const { page = 1, limit = 10, status } = params;
        let filtered = [...MOCK_INVOICES];

        if (status) {
            filtered = filtered.filter(inv => inv.status === status);
        }

        const start = (page - 1) * limit;
        const end = start + limit;
        const items = filtered.slice(start, end);

        return {
            success: true,
            data: {
                items,
                pagination: {
                    page,
                    limit,
                    total: filtered.length,
                    totalPages: Math.ceil(filtered.length / limit),
                },
            },
        };
    },

    getInvoice: async (id: string) => {
        const invoice = MOCK_INVOICES.find(inv => inv.id === id);
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        return { success: true, data: invoice };
    },

    downloadPdf: async (_id: string): Promise<Blob> => {
        // Return empty blob - PDF generation requires server
        console.warn('PDF download requires server connection');
        return new Blob(['PDF generation requires server'], { type: 'text/plain' });
    },

    getByOrder: async (orderId: string) => {
        const invoice = MOCK_INVOICES.find(inv => inv.orderNumber === orderId);
        if (!invoice) {
            throw new Error('Invoice not found for order');
        }
        return { success: true, data: invoice };
    },
};
