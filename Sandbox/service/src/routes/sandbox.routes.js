import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { handleCreateProject, handleCreateSandbox, handleGetAllProjects } from "../controllers/sandbox.controller.js";

const router = Router();

/**
 * Route to create a new project.
 * 
 * @route POST /api/sandbox/create
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {import("express").Response} Express response containing the created project.
 */
router.post("/create", authMiddleware, handleCreateProject);

/**
 * Route to start/create a new sandbox.
 * 
 * @route POST /api/sandbox/start
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {import("express").Response} Express response containing the sandbox details and preview URL.
 */
router.post("/start", authMiddleware, handleCreateSandbox);

/**
 * Route to retrieve all projects created by the authenticated user.
 * 
 * @route GET /api/sandbox/projects
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {import("express").Response} Express response containing the list of projects.
 */
router.get("/projects", authMiddleware, handleGetAllProjects);

export default router;