import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    err: null,
    avatar: null,
    isLoading: true
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.err = action.payload;
        },
        setAvatar: (state, action) => {
            state.avatar = action.payload;
        }
    }
})

export const { setUser, setLoading, setError, setAvatar } = authSlice.actions;
export default authSlice.reducer;