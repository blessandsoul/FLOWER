import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';

// Load from localStorage
const loadAuthState = () => {
    try {
        if (typeof window === 'undefined') return undefined; // Server-side check
        const state = localStorage.getItem('auth');
        return state ? JSON.parse(state) : undefined;
    } catch {
        return undefined;
    }
};

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // Add other reducers here
    },
    preloadedState: {
        auth: loadAuthState(),
    },
});

// Save to localStorage
store.subscribe(() => {
    try {
        if (typeof window !== 'undefined') {
            localStorage.setItem('auth', JSON.stringify(store.getState().auth));
        }
    } catch { }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
