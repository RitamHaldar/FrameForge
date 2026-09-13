import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      // action.payload: { id, message, type, duration, url, title }
      state.messages.push({
        id: action.payload.id || `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        message: action.payload.message,
        title: action.payload.title,
        url: action.payload.url,
        type: action.payload.type || 'info',
        duration: action.payload.duration || 4500,
      });
    },
    removeToast: (state, action) => {
      // action.payload: id
      state.messages = state.messages.filter(msg => msg.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;
