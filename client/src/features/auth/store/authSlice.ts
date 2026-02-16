import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isHydrating: boolean; // True during initial auth check
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isHydrating: true, // Start as true, set to false after initial /auth/me check
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Called after successful login/register or hydration
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isHydrating = false;
            state.error = null;
        },
        // Called when hydration fails (no valid session)
        clearAuth: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isHydrating = false;
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const { setUser, clearAuth, logout, setLoading, setError } = authSlice.actions;
export default authSlice.reducer;
