import express from "express";
import morgan from "morgan";
import agentRoutes from "./routes/agent.routes.js";

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));

app.get("/api/ai/healthz", (req, res) => {
    res.status(200).json({
        message: "ok",
        service: "AI Worker",
        timestamp: new Date().toISOString(),
        success: true
    })
});

/**
 * @description
 * This route will invoke the agent and return the response.
 * @param {
 * message: string,
 * projectId: string
 * }
 */

app.use("/api/ai", agentRoutes);

export default app;