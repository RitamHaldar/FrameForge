# FrameForge Sandbox Engine 🧪

The Sandbox directory contains the core custom infrastructure enabling isolated containerized development workspaces in FrameForge. It dynamically orchestrates Kubernetes pods, provides WebSocket traffic routing, and exposes terminal-redirection endpoints directly to the frontend.

---

## 🏗️ Architecture Breakdown

The Sandboxing system is split into four distinct subcomponents:

### 1. `service/` (Sandbox Provisioner)
- **Tech Stack**: Node.js, Express, `@kubernetes/client-node`.
- **Purpose**: Exposes API endpoints for provisioning, checking, and destroying sandbox resources dynamically. It communicates with the host Kubernetes API to spin up isolated container pods containing the target workspace and template app.

### 2. `router/` (Gateway Proxy)
- **Tech Stack**: Node.js, Socket.io, HTTP Proxy.
- **Purpose**: Routes traffic from the frontend directly to the correct isolated pod inside the Kubernetes network. It handles incoming web socket connections (terminal feedback, file changes) and serves preview traffic securely.

### 3. `agent/` (Pod Controller)
- **Tech Stack**: Node.js, Socket.io, `node-pty`.
- **Purpose**: Included in every compiled sandbox image. It runs inside the isolated pod to execute shell commands (sending inputs/outputs via a Pseudo-Terminal), monitor file systems, read/write workspace files, and report back JIT terminal render frames.

### 4. `template/` (App Boilerplate)
- **Tech Stack**: React 19, Vite 8, TailwindCSS 4.
- **Purpose**: A high-performance Vite starter app cloned inside every new sandbox space upon boot. Features custom polling configurations for ultra-fast, local JIT file sync hot-reloads within Kubernetes pods.

### 5. `sync-agent/` (State Synchronizer)
- **Tech Stack**: Node.js, `@aws-sdk/client-s3`, `chokidar`.
- **Purpose**: Runs inside the isolated sandbox pod alongside the workspace and agent. It downloads existing workspace files from Amazon S3 on boot, and watches `/workspace` for real-time edits, syncing additions and changes back to S3 under the project's ID.

---

## 📂 Subfolder Tree

```bash
├── agent/                # Pod execution agent
│   ├── src/              # Terminal (node-pty) & file managers
│   └── server.js         # Socket server entry point
├── router/               # Gateway proxy Router
│   ├── src/              # Target endpoints resolver & proxy pipelines
│   └── server.js         # Proxy launcher
├── service/              # Pod provisioner controller
│   ├── src/              # K8s Pod/Service manifest definitions
│   └── server.js         # API launcher
├── sync-agent/           # Workspace state S3 synchronizer
│   ├── sync.js           # File watcher & S3 syncer entry point
│   └── dockerfile        # Container recipe
└── template/             # Boilerplate Vite workspace canvas
    ├── src/              # React components, index.css, and main.jsx
    ├── index.html        # App entry point
    ├── package.json      # Dependencies and scripts (React 19, Vite 8, Tailwind 4)
    └── vite.config.js    # Vite dev server with aggressive file polling enabled
```

---

## 🚀 Development & Orchestration

Skaffold handles compiling all sandbox images simultaneously. From the root directory, simply run:
```bash
skaffold dev
```

Skaffold coordinates each Dockerfile and mounts code-sync points:
- Changes inside `/Sandbox/service/src/**` are dynamically synchronized and restarted on the K8s pod.
- Changes inside `/Sandbox/router/src/**` are synced and re-executed instantly.
- Changes inside `/Sandbox/agent/src/**` sync into running agents seamlessly.

---

## 🔌 Sandbox API Documentation

The Sandbox Service exposes the following endpoints (all routes are prefixed with `/api/sandbox`):

| HTTP Method | Route | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/health` | Public | Liveness/readiness check returning service health status. |
| **POST** | `/create` | Protected | Creates a new user project database entry with the given title. |
| **POST** | `/start` | Protected | Spins up an isolated Kubernetes Pod and ClusterIP Service for the project and returns a unique preview URL. |
| **GET** | `/projects` | Protected | Retrieves all active projects belonging to the logged-in user. |

---

## 📖 Code Documentation & JSDoc Standards

All routes, controllers, middleware, and Kubernetes helper functions in this microservice are documented using standard JSDoc blocks to enforce type safety and clarity. When extending the service, ensure JSDoc is present in the following format:

```javascript
/**
 * Short description of function or route.
 * 
 * @route [Method] [Endpoint] (if Express route)
 * @param {Type} paramName - Parameter description.
 * @returns {Type} Return value description.
 */
```

