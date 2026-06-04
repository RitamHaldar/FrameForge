import { Router } from "express";
import { GoogleAuth, GetMe, Login, Register, VerifyOtp, Logout } from "../controllers/auth.controller.js";
import passport from "passport";
import { authMiddleware } from "../middleware/auth.middleware.js"

/**
 * Express router to mount authentication related routes.
 * @type {import("express").Router}
 */
const authRouter = Router();


/**
 * @route POST /api/auth/register
 * @desc Registers a new user account
 * @access Public
 */
authRouter.post("/register", Register)

/**
 * @route POST /api/auth/login
 * @desc Authenticates a user and returns a token
 * @access Public
 */
authRouter.post("/login", Login)

/**
 * @route GET /api/auth/google
 * @desc Initiates the Google OAuth authentication flow
 * @access Public
 */
authRouter.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}))

/**
 * @route GET /api/auth/google/callback
 * @desc Handles callback redirection from Google OAuth authentication
 * @access Public
 */
authRouter.get("/google/callback", passport.authenticate("google", {
    failureRedirect: "http://localhost:5173",
    session: false
}), GoogleAuth)

/**
 * @route POST /api/auth/verify-otp
 * @desc Verifies the OTP sent to the user for email verification
 * @access Public
 */
authRouter.post("/verify-otp", VerifyOtp);

/**
 * @route GET /api/auth/get-me
 * @desc Gets the profile of the currently logged-in user
 * @access Public
 */
authRouter.get("/get-me", authMiddleware, GetMe);

/**
 * @route POST /api/auth/logout
 * @desc Logs out the user and clears JWT token cookie
 * @access Public
 */
authRouter.post("/logout", Logout);

export default authRouter;
