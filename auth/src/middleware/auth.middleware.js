import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

/**
 * Verifies the JWT token provided in the request cookies or headers.
 * If the token is valid, attaches the decoded user information to the request object.
 * 
 * @async
 * @function authMiddleware
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @param {import("express").NextFunction} next - Express next middleware function.
 * @returns {Promise<import("express").Response>} Express response or calls next() if successful.
 */
export async function authMiddleware(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decodedToken = jwt.verify(token, config.jwtSecret);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}
