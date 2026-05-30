# FrameForge AI-Worker Service 🤖

The AI-Worker is a high-performance orchestration service built on Node.js and LangChain. It connects LLM capabilities (OpenAI, Groq, Mistral AI) directly to the FrameForge sandbox, allowing developers to generate and synthesize React/Vite micro-apps dynamically via interactive prompt engineering.

---

## 🛠️ Tech Stack & Architecture

- **Runtime**: Node.js v18+
- **Server Framework**: Express.js
- **Real-time Pipeline**: Socket.IO (WebSockets) for low-latency streaming of JIT-compiled components and code autocompletions.
- **LLM Orchestration**: LangChain (`langchain`, `@langchain/openai`, `@langchain/groq`, `@langchain/mistralai`)
- **JSON Schema Validation**: Zod (`zod`) for absolute type safety when generating file edits and project trees.

---

## 📂 Codebase Structure

```bash
├── src/
│   ├── agents/             # LangChain custom agent logic & prompt systems
│   ├── config/             # Environment variable parsing & LLM configurations
│   ├── routes/             # REST Endpoints for system health checks
│   └── sockets/            # Socket.io handlers streaming JIT completions
├── dockerfile              # Container building instruction
├── server.js               # Entry server launcher
└── package.json            # Dependencies & script setups
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
The server will start listening on port `5001` (or your configured port).

### Running in Kubernetes (via Skaffold)
Skaffold handles compiling and updating this service inside the cluster. Just run the global launch command from the repository root:
```bash
skaffold dev
```
Skaffold tracks changes inside the `/src` folder and hot-syncs them immediately to the cluster.
