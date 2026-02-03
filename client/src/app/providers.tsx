'use client';

import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { store } from '@/store';
import { useState } from 'react';
import { DevLoginPanel } from '@/components/dev/DevLoginPanel';

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000,
                refetchOnWindowFocus: false,
            },
        },
    }));

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster position="top-right" />
                <DevLoginPanel />
            </QueryClientProvider>
        </Provider>
    );
};
