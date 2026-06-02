import { register, verifyOtp, login, getMe, logout } from "../services/auth.api";
import { useDispatch } from "react-redux";
import { setLoading, setUser, setError, setAvatar } from "../auth.slice";

export const useAuth = () => {
    const dispatch = useDispatch();

    const registerUser = async ({ username, email, password }) => {
        try {
            dispatch(setLoading(true));
            const response = await register({ username, email, password });
            dispatch(setUser(response.data.user.username));
            dispatch(setAvatar(response.data.user.avatar));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }
    const verifyOtpUser = async ({ otp }) => {
        try {
            dispatch(setLoading(true));
            const response = await verifyOtp({ otp });
            dispatch(setUser(response.data.user.username));
            dispatch(setAvatar(response.data.user.avatar));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }
    const loginUser = async ({ username, email, password }) => {
        try {
            dispatch(setLoading(true));
            const response = await login({ username, email, password });
            dispatch(setUser(response.data.user.username));
            dispatch(setAvatar(response.data.user.avatar));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }
    const getMeUser = async () => {
        try {
            dispatch(setLoading(true));
            const response = await getMe();
            dispatch(setUser(response.data.user.username));
            dispatch(setAvatar(response.data.user.avatar));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }
    const logoutUser = async () => {
        try {
            dispatch(setLoading(true));
            await logout();
            dispatch(setUser(null));
            dispatch(setAvatar(null));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setLoading(false));
        }
    }
    return {
        registerUser,
        verifyOtpUser,
        loginUser,
        getMeUser,
        logoutUser,
    }
}
