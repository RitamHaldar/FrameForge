import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";


const app = express();
app.use(morgan("combined"));

app.get("/api/router/health", (req, res) => {
    res.status(200).json({ status: "Router server is healthy", service: "router" });
})

app.get("/api/router/ready", (req, res) => {
    res.status(200).json({ status: "Router server is ready", service: "router" });
})

let proxies = {}

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

app.use((req, res, next) => {
    const host = req.headers.host;

    const sandboxId = host.split('.')[0];

    if (!sandboxId) {
        return res.status(404).send("Sandbox not found");
    }
    return addProxy(sandboxId)(req, res, next)
});
export default app