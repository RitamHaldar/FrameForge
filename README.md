# FrameForge 🚀

FrameForge is an ultra-premium, AI-orchestrated cloud IDE and sandboxing environment that allows developers to design, develop, and preview React/Vite micro-apps in real-time. Featuring a glassmorphic dashboard interface, high-performance execution, and seamless Kubernetes orchestration, FrameForge is engineered for top-tier interface designers and engineering architects.

---

## 🌟 New Feature Releases

### 🎛️ Workspace Menu Sidebar
A premium, right-side drawer overlay sliding in with spring physics.
*   **Active Workspace Switcher**: Instantly syncs and restarts user containers (`initWorkspace(projectId, true)`) dynamically from the dashboard.
*   **Google Account Profile**: Displays Google account user names and avatars. Fixes cross-origin blocking via standard `referrerPolicy="no-referrer"` headers and adds automated `onError` image loading error fallback cards.
*   **Secure Session Termination**: Adds a logout link triggering state resets and backend HTTP cookie clears.

### 📖 Interactive Documentation Hub (`/docs`)
An industry-grade, beautiful documentation reader.
*   **Smooth Motion & Navigation**: Sidebar tracking sections with smooth scrolling Lenis wrapper integration.
*   **Interactive Search**: Real-time log query search filtering contents dynamically.
*   **Architecture & REST References**: In-depth explanations of microservice boundaries, pod execution logic, and full REST schemas.

### 🚀 Enterprise Solutions Hub (`/solutions`)
An interactive, high-fidelity system architecture dashboard detailing internal microservices.
*   **Visual Pipeline Process Tracker**: Real-time interactive node graphs with dynamic status updates (`PENDING`, `PROCESSING`, `SUCCESS`), pulsing loading rings, and glowing green connector lines representing system data streams.
*   **Real-time Operations Simulator**: Integrated black-box terminal displaying simulated synchronous server logs (e.g. RabbitMQ queue events, Vite dev server watch polling, and LangChain model tokens).
*   **Deep-Dive Technical Panels**: Organized views mapping problem-solution summaries, technical specs, API routes, and codebase structures directly from project README documents.

### 🎨 Premium Landing Page Modernization
Aesthetic refinement aligned with top-tier interface engineering standards.
*   **Aesthetic Alignment**: Retuned typography with negative tracking, larger display headings (`96px`), softer contrast text colors, and refined spacing.
*   **Fluid Custom Buttons**: Replaced blocky rectangular elements with larger, pill-shaped (`rounded-full`) buttons featuring subtle glassmorphic backdrop-blurs and hover glows.
*   **Micro-Animations**: Enhanced feature card hover triggers with smoother float offsets (`y-10`) and slight icon rotations.

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

## 📊 Empirical System Benchmarks & Performance Verification

FrameForge features rigorous performance validation across microservices, sandbox provisioning pipelines, and client build systems:

### ⚡ Kubernetes Sandbox & Terminal Provisioning Latency
Measured via automated end-to-end integration tests ([`scripts/benchmark-sandbox.js`](file:///c:/Users/RH/Desktop/FrameForge/scripts/benchmark-sandbox.js)) against local Kubernetes clusters:

| Provisioning Pipeline Phase | Latency (ms) | Status |
| :--- | ---: | :--- |
| **API Project Creation** | `369.61 ms` | 🟢 Verified |
| **K8s Pod & Service Allocation Request** | `379.30 ms` | 🟢 Verified |
| **Pod Ready Polling (Init + 3 Containers)** | `3,209.73 ms` | 🟢 Verified |
| **WebSocket Terminal PTY Handshake** | `15.35 ms` | 🟢 Verified |
| **Total End-to-End Sandbox Provisioning** | **`3,594.68 ms` (~3.59s)** | 🟢 Verified (<10s claim) |

### 🚀 API Load & Latency Benchmarks (Autocannon - 50 Concurrent Connections, 10s)
Tested against backend authentication and health microservices:

| Metric | Measured Value | Standard Deviation / Notes |
| :--- | ---: | :--- |
| **Total Requests Handled** | `10,000 requests` | Completed in 10.05 seconds |
| **Average Throughput** | **`956.9 req/sec`** | Peak: `1,148 req/sec` |
| **Data Throughput** | `578 kB/sec` | `5.78 MB` total read |
| **Average Latency** | **`51.68 ms`** | Stdev: `61.9 ms` |
| **Median Latency (P50)** | **`46.00 ms`** | 50th percentile |
| **97.5th Percentile (P97.5)** | `131.00 ms` | Near tail latency |
| **99th Percentile (P99)** | `149.00 ms` | Tail latency bound |

### 📦 Client Bundle & Build Metrics (Vite 8 / React 19)
Production compilation breakdown:

| Asset | Size | Gzip Size | Transformation Time |
| :--- | ---: | ---: | :--- |
| `dist/assets/index-*.js` | `1,179.01 kB` | `351.94 kB` | 2,284 modules transformed |
| `dist/assets/index-*.css` | `109.38 kB` | `15.84 kB` | Tailwind v4 compiled |
| `dist/assets/logo-*.png` | `149.77 kB` | N/A | Asset static copy |
| `dist/index.html` | `1.00 kB` | `0.50 kB` | HTML viewport manifest |
| **Vite Incremental Build Time** | **`630 ms`** | N/A | Cached production build |

### 🎯 Lighthouse Audit Scores
| Category | Score | Metric / Rating |
| :--- | ---: | :--- |
| ♿ **Accessibility** | **`100 / 100`** | Perfect compliance |
| 🛡️ **Best Practices** | **`96 / 100`** | Security & modern standards |
| 🔍 **SEO** | **`83 / 100`** | Search index readiness |
| ⚡ **Performance** | **`52 / 100`** | Rich Monaco/Xterm SPA payload |

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

---

## 📖 Code Documentation Standards

To ensure clean, maintainable, and self-documenting codebases across all microservices, FrameForge strictly adheres to standard **JSDoc** schemas for routes, middlewares, controllers, and Kubernetes helper utilities:

*   **API Routes**: Every route is documented with `@route`, request `@param` types, and response `@returns` formats.
*   **Helper Utilities**: Functions mapping Kubernetes Pod and Service configurations are explicitly documented with parameters and API response structures.

When extending or introducing new services, please follow the uniform JSDoc template defined in each sub-package's README.


