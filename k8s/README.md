# FrameForge Kubernetes Manifests 🎡

This folder contains all declarations and service descriptions required to host the FrameForge cloud development environment inside a local or production Kubernetes cluster. The orchestrator (Skaffold) reads these manifests to set up bindings, deploy containers, and route ingress paths.

---

## 📂 File Explanations

Here is a list of all manifest files and their functional descriptions:

### 1. [ai-worker-deployment.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/ai-worker-deployment.yml) & [ai-worker-service.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/ai-worker-service.yml)
- **Deployment**: Spins up the Express & LangChain-driven AI orchestration pods. Binds environment variables from `secrets.yml`.
- **Service**: Exposes port `80` inside the cluster, targeting container port `3000` (HTTP and WebSocket path `/api/ai/socket.io`).

### 2. [sandbox-deployment.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/sandbox-deployment.yml) & [sandbox-service.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/sandbox-service.yml)
- **Deployment**: Deploys the Sandbox provisioner API controller service (`Sandbox/service`). Binds to the host's `/var/run/docker.sock` to enable isolated developer pod scheduling.
- **Service**: Exposes port `80` inside the cluster, targeting container port `3000` (`/api/sandbox`).

### 3. [router-deployment.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/router-deployment.yml) & [router-service.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/router-service.yml)
- **Deployment**: Spins up the gateway socket proxy to bridge terminal inputs/outputs and files between users and specific isolated developer sandbox containers.
- **Service**: Exposes port `80` inside the cluster, targeting container port `3000`.

### 4. [auth-deployment.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/auth-deployment.yml) & [auth-service.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/auth-service.yml)
- **Deployment**: Manages secure email-password registration/login and Passport.js Google OAuth identity flows. Binds variables from `secrets.yml`.
- **Service**: Exposes port `80` inside the cluster, targeting container port `3000`.

### 5. [ingress.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/ingress.yml)
- Sets up path-based and host-based routing via `ingress-nginx`. Maps incoming traffic:
  - `/api/sandbox` -> maps to `sandbox-service` (port `80`)
  - `/api/ai` -> maps to `ai-worker-service` (port `80`)
  - `/api/auth` -> maps to `auth-service` (port `80`)
  - `*.preview.localhost` -> routes live sandbox preview requests to `router-service` (port `80`)
  - `*.agent.localhost` -> routes WebSocket terminal/agent requests to `router-service` (port `80`)

### 6. [rbac.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/rbac.yml)
- Declares ServiceAccount permissions. Grants the `sandbox` service account access to create, read, list, and delete pods, services, and deployments inside the cluster dynamically.

### 7. [secrets.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/secrets.yml)
- Stores Base64-encoded environment secrets such as OpenAI API Keys, Groq API Keys, and Mistral keys. Make sure to encode your keys before editing:
  ```bash
  echo -n "your_api_key" | base64
  ```

---

## 🚀 Running Deployment

The standard pipeline uses Skaffold to coordinate these deployments locally. Follow the steps:

```bash
# 1. Apply secrets first
kubectl apply -f k8s/secrets.yml

# 2. Run Skaffold for automated compiling & launching
skaffold dev
```
Skaffold tracks changes in real-time, rebuilding images and updating deployment YAML specifications automatically.
