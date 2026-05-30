# FrameForge AI-Worker Service 🤖

The AI-Worker is a high-performance orchestration service built on Node.js and LangChain. It connects LLM capabilities (OpenAI, Groq, Mistral AI) directly to the FrameForge sandbox, allowing developers to generate and synthesize React/Vite micro-apps dynamically via interactive prompt engineering.

---

## 🛠️ Tech Stack & Architecture

- **Runtime**: Node.js v18+ (ES modules enabled)
- **Server Framework**: Express.js (v5.x)
- **Real-time Pipeline**: Socket.IO 4 (WebSockets) for low-latency streaming of JIT-completed components and custom autocomplete suggestions via the `/api/ai/socket.io` websocket path.
- **LLM Orchestration**: LangChain (`langchain`, `@langchain/openai`, `@langchain/groq`, `@langchain/mistralai`)
- **JSON Schema Validation**: Zod (`zod`) for absolute type safety when generating file edits and project structures.

---

## 📂 Codebase Structure

```bash
├── src/
│   ├── agents/             # LangChain custom agent logic, systems, and prompt engineering
│   ├── config/             # Environment variable parsing & LLM client initialization
│   ├── routes/             # REST Endpoints (agent.routes.js for orchestrator trigger)
│   └── app.js              # Express app initialization, server instance, & Socket.IO handlers
├── dockerfile              # Microservice Docker container instruction
├── server.js               # Entry point starting the HTTP server
└── package.json            # Scripts, dependency libraries, and engine constraints
```

---

## 🔒 Secret Configuration

The AI-Worker connects dynamically to external inference models. Place your API keys inside `.env` (for local runs) or configure them inside [secrets.yml](file:///c:/Users/RH/Desktop/FrameForge/k8s/secrets.yml) (for Kubernetes deployments):

```env
OPENAI_API_KEY=your_openai_key
GROQ_API_KEY=your_groq_key
MISTRAL_API_KEY=your_mistral_key
```

---

## 🚀 Execution & Setup

### Running Locally (Without Docker)

#### 1. Install dependencies
```bash
cd ai-worker
npm install
```

#### 2. Run in Development Mode
```bash
npm run dev
```
The server will start listening on port `3000` (or your configured port). Note: both the AI Worker and Authentication services listen on port `3000` in their respective environments. In local development outside Kubernetes/Docker, they should be run on separate ports if run at the same time.

### Running in Kubernetes (via Skaffold)
Skaffold handles compiling and updating this service inside the cluster. Just run the global launch command from the repository root:
```bash
skaffold dev
```
Skaffold tracks changes inside the `/src` folder and hot-syncs them immediately to the cluster.
