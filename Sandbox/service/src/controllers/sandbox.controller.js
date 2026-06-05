import { v7 as uuid } from 'uuid'
import { createPod } from '../kubernetes/pod.js';
import { createService } from '../kubernetes/service.js';
import { ProjectModel } from '../models/project.model.js';
import { createSandboxKey } from '../config/redis.js';

/**
 * Handler to create a new project for the authenticated user.
 * 
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<import("express").Response>} Express response containing the execution status and new project.
 */
export async function handleCreateProject(req, res) {
    const { title } = req.body;
    const id = req.user.id;
    if (!id || !title) return res.status(400).json({ message: "All fields are required" });
    const newProject = await ProjectModel.create({
        userId: id,
        title,
    })
    if (!newProject) return res.status(500).json({ message: "Failed to create project" });
    return res.status(200).json({
        success: true,
        message: "Project created successfully",
        project: newProject
    })


}

/**
 * Handler to start/create a Kubernetes sandbox for a given project ID.
 * 
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<import("express").Response>} Express response containing the sandbox ID and preview URL.
 */
export async function handleCreateSandbox(req, res) {
    const { projectId } = req.body;
    const sandboxId = uuid();
    const project = await ProjectModel.findById(projectId);
    if (!project) return res.status(404).json({ message: "Project Not Found" });
    await Promise.all([
        createPod(sandboxId, projectId),
        createService(sandboxId),
        createSandboxKey(sandboxId)

    ])

    return res.status(200).json({
        success: true,
        message: "Sandbox created successfully",
        sandboxId,
        previewUrl: `http://${sandboxId}.preview.localhost`,
        projectId
    })
}

/**
 * Handler to fetch all projects belonging to the authenticated user.
 * 
 * @param {import("express").Request} req - Express request object.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<import("express").Response>} Express response containing the user's projects.
 */
export async function handleGetAllProjects(req, res) {
    const id = req.user.id;
    if (!id) return res.status(400).json({ message: "User ID Not Present" });
    const projects = await ProjectModel.find({ userId: id });
    if (!projects) return res.status(500).json({ message: "Failed to fetch projects" });
    return res.status(200).json({
        success: true,
        message: "Projects fetched successfully",
        projects
    })
}