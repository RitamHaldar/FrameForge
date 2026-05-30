import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import passport from "passport";
import authRouter from "./routes/auth.routes.js";
/**
 * Express Application Instance
 * Configured with standard middleware (CORS, body-parser, cookie-parser, morgan, passport)
 * and authentication routes.
 */
const app = express();


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());

/**
 * Health check route to verify service availability.
 * 
 * @route GET /api/auth/healthz
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {import("express").Response} Express response containing the status.
 */
app.get("/api/auth/healthz", (req, res) => {
    res.json({
        status: "ok",
        message: "Auth is healthy",
        success: true
    });
})

app.use("/api/auth", authRouter)
export default app;