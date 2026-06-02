import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

/**
 * Middleware to authenticate requests using JWT tokens.
 * 
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @param {import("express").NextFunction} next - Express next middleware function.
 * @returns {import("express").Response|void} Express response if unauthorized, or calls next().
 */
export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization").replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "Token Not Present" });
    }
    try {
        const user = jwt.verify(token, config.JWT_SECRET,);
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "UnAuthorized Access" });
    }
}