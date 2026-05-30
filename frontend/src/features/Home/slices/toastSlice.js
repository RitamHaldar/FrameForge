import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    addToast: (state, action) => {
      // action.payload: { id, message, type, duration }
      state.messages.push({
        id: action.payload.id || Date.now().toString(),
        message: action.payload.message,
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
