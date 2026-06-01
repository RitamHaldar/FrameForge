import { configureStore } from '@reduxjs/toolkit';
import toastReducer from '../../features/Home/slices/toastSlice';
import authReducer from '../../features/Auth/auth.slice';

export const store = configureStore({
    reducer: {
        toast: toastReducer,
        auth: authReducer
    },
});
