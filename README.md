# FrameForge 🚀

FrameForge is an ultra-premium, AI-orchestrated cloud IDE and sandboxing environment that allows developers to design, develop, and preview React/Vite micro-apps in real-time. Featuring a glassmorphic dashboard interface, high-performance execution, and seamless Kubernetes orchestration, FrameForge is engineered for top-tier interface designers and engineering architects.

---

## 🏗️ Architecture Overview

The system is designed as a highly scalable microservice infrastructure running inside a Kubernetes cluster, developed with local multi-container syncing using Skaffold. The authentication layer is decoupled from notifications using an asynchronous RabbitMQ message queue.

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
 └──────────┬───────────┘           └──────────┬───────────┘
            │                                  │
            ▼ (Spawns dynamically)             ▼
 ┌──────────────────────┐           ┌──────────────────────┐
 │  Isolated Sandbox    │           │     Auth Service     │ (JWT Sessions & Google OAuth)
 │  (Vite + Node Agent) │           └──────────┬───────────┘
 └──────────┬───────────┘                      │ (Produces OTP Queue Messages)
                                               ▼
                                    ┌──────────────────────┐
                                    │   RabbitMQ Broker    │ (CloudAMQP Queue Pipeline)
                                    └──────────┬───────────┘
                                               │ (AUTH_NOTIFICATION_QUEUE)
                                               ▼ (Consumes message async)
                                    ┌──────────────────────┐
                                    │ Notification Service │ (Vetted Alpine Node Runtime)
                                    └──────────┬───────────┘
                                               │ (Gmail API integration)
                                               ▼
                                    ┌──────────────────────┐
                                    │      Gmail API       │ (Premium Inline HTML Emails)
                                    └──────────┬───────────┘
```

---

## 📁 Repository Directory Structure

```bash
├── .git/                 # Git repository history
├── ai-worker/            # Node.js Express service for AI orchestration
├── auth/                 # Node.js Express service for identity management, Google OAuth & OTP creation
├── notification/         # Node.js Express consumer service for sending email alerts
│   ├── src/
│   │   ├── config/       # Queue definitions & broker connection configurations
│   │   ├── services/     # Gmail OAuth2 mailer integrations
│   │   └── template/     # Premium Inline HTML/CSS verification email templates
│   ├── server.js         # Entrypoint for running the notification worker
│   └── dockerfile        # Lightweight alpine execution environment
├── frontend/             # Core React & Vite frontend client SPA
│   ├── src/
│   │   ├── features/
│   │   │   ├── Auth/     # State-bound Login, Register, and Verify OTP screens
│   │   │   └── Home/     # Glassmorphic Workspace Canvas, File Explorers & Terminal
│   └── index.html        # Smart viewport & loaded design systems
├── k8s/                  # Kubernetes configuration manifests
│   ├── secrets.yml       # Ingress, Google Credentials, and database secret keys
│   ├── auth-*.yml        # Auth service deployment and services config
│   ├── notification-*.yml# Notification service deployment and services config
│   └── ...
└── skaffold.yml          # Skaffold orchestration pipeline for local development
```

---

## 💻 Tech Stack

### Frontend Core
- **Framework**: React 19 + Vite 8
- **State Management**: Redux Toolkit (`@reduxjs/toolkit` & `react-redux`)
- **Routing**: React Router 7 (`react-router` 7.x)
- **Animations**: Framer Motion 12 (spring dynamics) & GSAP (timeline choreography)
- **Scroll Kinetics**: Lenis (smooth scrolling)
- **Editor**: `@monaco-editor/react` (Monaco VS Code core engine integration)
- **Terminal Client**: `xterm` & `xterm-addon-fit` (with glowing scanline CRT visual overlays)
- **Networking**: `socket.io-client` & `axios`
- **Styling**: TailwindCSS 4.0

### Identity, Auth & Queues
- **Runtime**: Node.js v18+ & Node.js v20 (Alpine containers)
- **Server Framework**: Express.js (v5.x)
- **Database & ORM**: MongoDB via Mongoose
- **Message Broker**: RabbitMQ via `amqplib` (CloudAMQP managed layer)
- **Email Delivery**: Google API Client (`googleapis` v173) for OAuth2 secure mail transport
- **Authentication**: Passport.js (local & Google OAuth 2.0 social federation)
- **Security**: `bcryptjs` (password hashing) & `jsonwebtoken` (session JWTs)

### AI & Orchestration
- **Framework**: Express.js (v5.x) & Socket.IO 4
- **AI Core**: LangChain (`@langchain/openai`, `@langchain/groq`, `@langchain/mistralai`)
- **Validation**: Zod schema validation

### Sandbox Infrastructure
- **Deployments**: Kubernetes (Local / Cloud)
- **Orchestration Tool**: Skaffold (hot reloading container syncing)
- **Containerization**: Docker
- **Sandbox Agents**: Node.js, Socket.IO 4 & node-pty (interactive terminals)

---

## 🔒 Security & Verification Pipeline (OTP)

FrameForge implements a secure, asynchronous sign-up and validation pipeline:
1. **Request Initiation**: Upon registration via `RegisterForm`, a 6-digit cryptographic OTP is generated by the `auth` controller and saved on the User model.
2. **Queueing**: The `auth` service writes a message containing the recipient and the OTP code to the `AUTH_NOTIFICATION_QUEUE` on CloudAMQP.
3. **Consumption**: The `notification` service consumes the message asynchronously, preventing signup delays for the end-user.
4. **Email Dispatch**: The `notification` service compiles our highly-polished, dark-mode matching email template (`emailTemplate.js`) and transmits it securely via the Gmail OAuth2 API.
5. **Two-Way Binding Verification**: The client is transitioned automatically to our custom **Verify OTP Page**, which provides individual focused inputs with auto-tabbing, clipboard paste support, and real-time validation via `useAuth` hook. On successful submission, the account is activated and the user is routed to `/dashboard`.

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

