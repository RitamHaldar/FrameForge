import { configureStore } from '@reduxjs/toolkit';
import toastReducer from '../../features/Home/slices/toastSlice';

export const store = configureStore({
  reducer: {
    toast: toastReducer,
  },
});
