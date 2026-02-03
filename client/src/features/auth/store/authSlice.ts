import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
    user: any | null; // Placeholder until user types are defined
    tokens: { accessToken: string; refreshToken: string } | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ user: any; tokens: any }>) => {
            state.user = action.payload.user;
            state.tokens = action.payload.tokens;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.tokens = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
