import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/store/authSlice';

// No localStorage persistence - auth state comes from httpOnly cookies via /auth/me
export const store = configureStore({
    reducer: {
        auth: authReducer,
        // Add other reducers here
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
