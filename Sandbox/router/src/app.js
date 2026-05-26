import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { createProxyServer } from "httpxy";

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
            changeOrigin: true
        });
    }
    return proxies[sandboxId];
}

function addAgentProxy(sandboxId) {
    if (!agentproxies[sandboxId]) {
        agentproxies[sandboxId] = createProxyMiddleware({
            target: `http://sandbox-service-${sandboxId}:3000`,
            changeOrigin: true
        });
    }
    return agentproxies[sandboxId];
}
const wsProxy = createProxyServer({ changeOrigin: true });
wsProxy.on('error', (err, req, socket) => {
    console.error('WS proxy error:', err.message);
    socket?.destroy();
});
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
const server = http.createServer(app);

server.on('upgrade', (req, socket, head) => {
    const host = req.headers.host;
    if (!host) { socket.destroy(); return; }
    socket.on('error', () => socket.destroy());

    const sandboxId = host.split('.')[0];
    const type = host.split('.')[1];

    console.log(`WS upgrade request: ${host}, sandboxId: ${sandboxId}, type: ${type}`);

    if (type === 'agent') {
        wsProxy.ws(req, socket, { target: `http://sandbox-service-${sandboxId}:3000` }, head)
            .catch(() => socket.destroy());
    } else if (type === 'preview') {
        wsProxy.ws(req, socket, { target: `http://sandbox-service-${sandboxId}` }, head)
            .catch(() => socket.destroy());
    } else {
        socket.destroy();
    }
});

export default server