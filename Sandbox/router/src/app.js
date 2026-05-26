import express from "express";
import { createProxyMiddleware } from "httpxy";
import morgan from "morgan";
import cors from "cors";

const app = express();
app.use(morgan("combined"));
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

app.get("/api/router/health", (req, res) => {
    res.status(200).json({ status: "Router server is healthy", service: "router" });
})

app.get("/api/router/ready", (req, res) => {
    res.status(200).json({ status: "Router server is ready", service: "router" });
})

let proxies = {}
let agentproxies = {}
function addProxy(sandboxId) {
    if (!proxies[sandboxId]) {
        proxies[sandboxId] = createProxyMiddleware({
            target: `http://sandbox-service-${sandboxId}`,
            changeOrigin: true,
            ws: true,
        });
    }
    return proxies[sandboxId];
}

function addAgentProxy(sandboxId) {
    if (!agentproxies[sandboxId]) {
        agentproxies[sandboxId] = createProxyMiddleware({
            target: `http://sandbox-service-${sandboxId}:3000`,
            changeOrigin: true,
            ws: true,
        });
    }
    return agentproxies[sandboxId];
}
app.use((req, res, next) => {
    const host = req.headers.host;

    const sandboxId = host.split('.')[0];

    if (!sandboxId) {
        return res.status(404).send("Sandbox not found");
    }
    if (host.split('.')[1] == "agent") {
        return addAgentProxy(sandboxId)(req, res, next)
    }
    else if (host.split('.')[1] == "preview") {
        return addProxy(sandboxId)(req, res, next)
    }

});
export default app