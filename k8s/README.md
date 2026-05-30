# FrameForge Kubernetes Manifests 🎡

This folder contains all declarations and service descriptions required to host the FrameForge cloud development environment inside a local or production Kubernetes cluster. The orchestrator (Skaffold) reads these manifests to set up bindings, deploy containers, and route ingress paths.

---

## 📂 File Explanations

Here is a list of all manifest files and their functional descriptions:

### 1. [ai-worker-deployment.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/ai-worker-deployment.yml) & [ai-worker-service.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/ai-worker-service.yml)
- **Deployment**: Spins up the Express & LangChain-driven AI orchestration pods. It binds environment variables from `secrets.yml`.
- **Service**: Exposes port `5001` (HTTP/WS) inside the cluster.

### 2. [sandbox-deployment.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/sandbox-deployment.yml) & [sandbox-service.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/sandbox-service.yml)
- **Deployment**: Deploys the Sandbox provisioner service (`Sandbox/service`). It binds to the host's `/var/run/docker.sock` to enable Docker-in-Docker or spins pods directly inside Kubernetes.
- **Service**: Exposes port `5000` inside the cluster.

### 3. [router-deployment.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/router-deployment.yml) & [router-service.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/router-service.yml)
- **Deployment**: Spins up the gateway socket proxy to bridge connections between users and specific pods.
- **Service**: Exposes port `8080` internally.

### 4. [ingress.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/ingress.yml)
- Sets up ingress paths using `ingress-nginx`. Maps incoming traffic:
  - `/api/sandbox` -> maps to `sandbox` service (`port 5000`)
  - `/api/ai` -> maps to `ai-worker` service (`port 5001`)
  - `/socket.io` -> maps to `router` service (`port 8080`)
  - Wildcard / Preview subdomains map directly to target sandboxes via the router gateway.

### 5. [rbac.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/rbac.yml)
- Declares ServiceAccount permissions. Grants the `sandbox` service account access to create, read, list, and delete pods, namespaces, services, and deployments inside the cluster dynamically.

### 6. [secrets.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/secrets.yml)
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
