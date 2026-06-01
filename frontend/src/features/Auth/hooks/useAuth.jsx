import { register, verifyOtp, login, getMe } from "../services/auth.api";
import { useDispatch } from "react-redux";
import { setLoading, setUser, setError, setAvatar } from "../auth.slice";
import { useNavigate } from "react-router";

export const useAuth = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const registerUser = async ({ username, email, password }) => {
        try {
            dispatch(setLoading(true));
            const response = await register({ username, email, password });
            dispatch(setUser(response.data.user.username));
            dispatch(setAvatar(response.data.user.avatar));
            navigate("/verify-otp");
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
            navigate("/dashboard");
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
            navigate("/verify-otp");
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
            navigate("/dashboard");
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
    }
}
