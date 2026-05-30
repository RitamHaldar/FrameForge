# FrameForge 🚀

FrameForge is an ultra-premium, AI-orchestrated cloud IDE and sandboxing environment that allows developers to design, develop, and preview React/Vite micro-apps in real-time. Featuring a glassmorphic dashboard interface, high-performance execution, and seamless Kubernetes orchestration, FrameForge is engineered for top-tier interface designers and engineering architects.

---

## 🏗️ Architecture Overview

The system is designed as a highly scalable microservice infrastructure running inside a Kubernetes cluster, developed with local multi-container syncing using Skaffold.

```
                  ┌──────────────────────┐
                  │       Browser        │
                  │ (React SPA Frontend) │
                  └──────────┬───────────┘
                             │ (Ingress / WebSocket)
                             ▼
                  ┌──────────────────────┐
                  │    Sandbox Router    │ (Dynamic Traffic routing)
                  └──────────┬───────────┘
                             │
            ┌────────────────┴────────────────┐
            ▼                                 ▼
┌──────────────────────┐           ┌──────────────────────┐
│   Sandbox Service    │           │    AI-Worker Agent   │
│ (K8s Pod Provisioner)│           │ (LangChain Orchestr) │
└──────────┬───────────┘           └──────────────────────┘
           │
           ▼ (Spawns dynamically)
┌──────────────────────┐
│  Isolated Sandbox    │
│  (Vite + Node Agent) │
└──────────────────────┘
```

---

## 📁 Repository Directory Structure

```bash
├── .git/                 # Git repository history
├── ai-worker/            # Node.js Express service for AI orchestration
├── frontend/             # Core React & Vite frontend client SPA
├── k8s/                  # Kubernetes configuration manifests
├── Sandbox/              # Isolated developer workspace services
│   ├── agent/            # Node.js socket agent executed inside sandbox pods
│   ├── router/           # WebSocket and traffic router to target sandboxes
│   ├── service/          # API layer controlling pod creations and deletions
│   └── template/         # React/Vite/Tailwind boilerplate for new sandboxes
└── skaffold.yml          # Skaffold orchestration pipeline for local development
```

---

## 💻 Tech Stack

### Frontend Core
- **Framework**: React 19 + Vite 8
- **State Management**: Redux Toolkit (`@reduxjs/toolkit` & `react-redux`)
- **Animations**: `framer-motion` (spring dynamics) & `gsap` (timeline choreography)
- **Scroll Kinetics**: `lenis` (smooth scrolling)
- **Editor**: `@monaco-editor/react` (VS Code core engine integration)
- **Terminal client**: `xterm` & `xterm-addon-fit`
- **Networking**: `socket.io-client` & `axios`
- **Styling**: TailwindCSS 4.0

### AI & Orchestration
- **Framework**: Express (Node.js) & Socket.IO
- **AI Core**: LangChain (`@langchain/openai`, `@langchain/groq`, `@langchain/mistralai`)
- **Validation**: Zod schema validation

### Sandbox Infrastructure
- **Deployments**: Kubernetes (Local / Cloud)
- **Orchestration Tool**: Skaffold
- **Containerization**: Docker
- **Sandbox Agents**: Node.js & node-pty (interactive terminals)

---

## 🛠️ GitHub Ready Installation & Setup

FrameForge runs local development smoothly inside a local Kubernetes cluster using Skaffold. Follow these steps to get everything online:

### Prerequisites
Make sure you have the following installed on your machine:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (with Kubernetes enabled) OR [Minikube](https://minikube.sigs.k8s.io/)
- [Node.js](https://nodejs.org/) (v18+)
- [Skaffold CLI](https://skaffold.dev/docs/install/)
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [Helm](https://helm.sh/) (optional, if customizing ingress)

---

### Step-by-Step Installation

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/FrameForge.git
cd FrameForge
```

#### 2. Configure Local Kubernetes Cluster
Ensure Kubernetes is active:
```bash
# If using Docker Desktop
kubectl config use-context docker-desktop

# If using Minikube
minikube start
minikube addons enable ingress
```

#### 3. Setup Secret Variables
Apply secrets in Kubernetes:
```bash
kubectl apply -f k8s/secrets.yml
```
*(Optionally, modify `k8s/secrets.yml` to include your specific API keys for OpenAI, Groq, or Mistral AI).*

#### 4. Run Development Engine (Skaffold)
Skaffold compiles images and hot-syncs development changes straight to the Kubernetes pod in real-time.
```bash
skaffold dev
```

#### 5. Launch the Frontend
In a separate terminal, navigate to the frontend folder, install dependencies, and run the developer server locally:
```bash
cd frontend
npm install
npm run dev
```

The application will be accessible at: `http://localhost:5173`.

---

## 🔒 License
Licensed under the ISC License. © 2026 FrameForge OS. All rights reserved.
