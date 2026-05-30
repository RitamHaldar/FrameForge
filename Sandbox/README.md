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
- **Tech Stack**: React 18, Vite, TailwindCSS.
- **Purpose**: A clean Vite starter app cloned inside every new sandbox space upon boot. It acts as the developer's canvas, allowing instant previews of edits right after generation.

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
└── template/             # Boilerplate Vite workspace
    ├── src/              # Template components
    └── index.html        # App entry point
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
