import { createSlice } from "@reduxjs/toolkit";

const DEFAULT_AVATAR = "https://ik.imagekit.io/9yt9khgb0/istockphoto-1451587807-612x612.jpg";

const initialState = {
    user: null,
    err: null,
    avatar: DEFAULT_AVATAR,
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
            state.avatar = action.payload || DEFAULT_AVATAR;
        }
    }
})

export const { setUser, setLoading, setError, setAvatar } = authSlice.actions;
export default authSlice.reducer;