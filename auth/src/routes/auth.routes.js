import { Router } from "express";
import { GoogleAuth, Login, Register } from "../controllers/auth.controller.js";
import passport from "passport";

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


export default authRouter;
