import express from 'express';
import morgan from 'morgan';
import sandboxRouter from './routes/sandbox.routes.js';
import cookieParser from 'cookie-parser';
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Health check route to verify Sandbox API service availability.
 * 
 * @route GET /api/sandbox/health
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {import("express").Response} Express response containing the status.
 */
app.get("/api/sandbox/health", (req, res) => {
    res.status(200).json({
        message: "Sandbox Api is Running",
        status: "Ok"
    })
})

/**
 * Main router for all sandbox-related API endpoints.
 * Mounted on /api/sandbox.
 * 
 * @namespace sandboxRouter
 */

app.use("/api/sandbox", sandboxRouter)

export default app;