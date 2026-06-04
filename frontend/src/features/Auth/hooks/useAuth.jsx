import { register, verifyOtp, login, getMe, logout } from "../services/auth.api";
import { useDispatch } from "react-redux";
import { setLoading, setUser, setError, setAvatar } from "../auth.slice";

export const useAuth = () => {
    const dispatch = useDispatch();

    const registerUser = async ({ username, email, password }) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await register({ username, email, password });
            dispatch(setUser(response.data.user.username));
            dispatch(setAvatar(response.data.user.avatar));
            sessionStorage.setItem("register_email", email);
            return true;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }
    const verifyOtpUser = async ({ email, otp }) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await verifyOtp({ email, otp });
            dispatch(setUser(response.data.user.username));
            dispatch(setAvatar(response.data.user.avatar));
            sessionStorage.removeItem("register_email");
            return true;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }
    const loginUser = async ({ username, email, password }) => {
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const response = await login({ username, email, password });
            dispatch(setUser(response.data.user.username));
            dispatch(setAvatar(response.data.user.avatar));
            return true;
        } catch (error) {
            dispatch(setError(error.response?.data?.message || error.message));
            return false;
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
            dispatch(setUser(null));
            dispatch(setAvatar(null));
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
            dispatch(setError(error.response?.data?.message || error.message));
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
