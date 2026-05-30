import express from "express";
import morgan from "morgan";
import agentRoutes from "./routes/agent.routes.js";
import http from "http"
import { Server } from "socket.io"
import { agent3 } from "./agents/agent.code.js"

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    path: "/api/ai/socket.io",
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"]
    }
});


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

io.on("connection", (socket) => {
    socket.on("code", async (data) => {
        try {
            const res = await agent3.invoke({
                messages: [
                    {
                        role: "user",
                        content: data
                    }
                ]
            });
            socket.emit("suggestion", res.messages[res.messages.length - 1].content);
        } catch (err) {
            console.error("Failed to generate autocomplete suggestion:", err);
            socket.emit("suggestion-error", err.message);
        }
    })
})
/**
 * @description
 * This route will invoke the agent and return the response.
 * @param {
 * message: string,
 * projectId: string
 * }
 */

app.use("/api/ai", agentRoutes);

export default server;