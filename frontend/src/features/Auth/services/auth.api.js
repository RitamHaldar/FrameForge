import axios from "axios";

const axiosIntance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
})

export const register = async (data) => {
    return await axiosIntance.post("/register", data);
}
export const verifyOtp = async (data) => {
    return await axiosIntance.post("/verify-otp", data);
}
export const login = async (data) => {
    return await axiosIntance.post("/login", data);
}
export const getMe = async () => {
    return await axiosIntance.get("/get-me");
}
