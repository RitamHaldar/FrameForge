import express from "express"
import morgan from "morgan"
import fs from "node:fs/promises"

const app = express();

const WORKSPACE_DIR = "/workspace";

app.use(morgan("combined"));

app.get("/api/agent/health", (req, res) => {
    res.status(200).json({ status: "Agent server is healthy", service: "agent" });
})

app.get("/api/agent/ready", (req, res) => {
    res.status(200).json({ status: "Agent server is ready", service: "agent" });
})

app.get("/api/agent/listFiles", async (req, res) => {

    const elements = await fs.readdir(WORKSPACE_DIR);

    res.status(200).json({
        message: "Files listed successfully",
        status: "success",
        data: elements
    });
})

export default app;
