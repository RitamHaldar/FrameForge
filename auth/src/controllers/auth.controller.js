import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";
/**
 * Registers a new user with the provided credentials.
 * Checks for existing username/email, creates a new user record, and sets a JWT cookie.
 * 
 * @async
 * @function Register
 * @param {import("express").Request} req - Express request object containing username, email, and password in req.body.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<import("express").Response>} Express response.
 */
export async function Register(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email) {
        return res.status(400).json({ message: "Username and email are required" });
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
        username,
        email,
        password,
        isVerified: true
    });
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1d" })
    res.cookie("token", token, { httpOnly: true, secure: true })
    return res.status(200).json({ message: "User registered successfully" });

}
/**
 * Authenticates an existing user with username/email and password.
 * Generates and sets a JWT in an HTTP-only cookie upon successful login.
 * 
 * @async
 * @function Login
 * @param {import("express").Request} req - Express request object containing username/email and password in req.body.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<import("express").Response>} Express response.
 */
export async function Login(req, res) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email and password are required" });
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    });

    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await user.comparePassword(password);
    if (!validPassword) {
        return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1d" })
    res.cookie("token", token, { httpOnly: true, secure: true })
    return res.status(200).json({ message: "User logged in successfully" });
}

/**
 * Handles Google OAuth authentication.
 * If the user already exists, logs them in; otherwise, registers them.
 * Sets a JWT in an HTTP-only cookie and redirects to the frontend.
 * 
 * @async
 * @function GoogleAuth
 * @param {import("express").Request} req - Express request object containing authenticated Google profile in req.user.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<void>} Redirects the user to the application dashboard.
 */
export async function GoogleAuth(req, res) {
    const { id, displayName, emails, photos } = req.user;
    if (!id || !displayName || !emails[0].value || !photos[0].value) {
        return res.status(400).json({ message: "User data is incomplete" });
    }
    const existingUser = await User.findOne({
        $or: [{ username: displayName }, { email: emails[0].value }]
    });
    if (existingUser) {
        const token = jwt.sign({ id: existingUser._id }, config.jwtSecret, { expiresIn: "1d" });
        res.cookie("token", token, { httpOnly: true, secure: true });
        return res.redirect("http://localhost:5173");
    }
    const user = await User.create({
        username: displayName,
        email: emails[0].value,
        avatar: photos[0].value,
        isVerified: true,
        googleId: id
    });
    const token = jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: "1d" })
    res.cookie("token", token, { httpOnly: true, secure: true })
    res.redirect("http://localhost:5173")
}