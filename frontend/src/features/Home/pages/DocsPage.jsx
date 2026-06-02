import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, BookOpen, Cpu, Shield, HelpCircle, Server, Terminal, Code2, Layers, Check, ChevronRight, Key, Settings, Mail, RefreshCw } from 'lucide-react';
import Lenis from 'lenis';

const DOCS_SECTIONS = [
  {
    id: 'welcome',
    title: 'Getting Started',
    icon: <BookOpen className="w-4 h-4" />,
    items: [
      {
        id: 'overview',
        title: 'Platform Overview',
        content: `FrameForge is an ultra-premium, AI-orchestrated cloud IDE and sandboxing environment that allows developers to design, develop, and preview React/Vite micro-apps in real-time.

Featuring a glassmorphic dashboard interface, high-performance execution, and seamless Kubernetes orchestration, FrameForge is engineered for top-tier interface designers and engineering architects. By bridging conversational prompt streams and dynamic isolated pods, engineers can generate, customize, and deploy interactive user interfaces in seconds without local configuration.`
      },
      {
        id: 'setup',
        title: 'Installation & Local Setup',
        content: `FrameForge runs development workflows smoothly inside a local Kubernetes cluster using Skaffold. Follow these steps to spin up the local environment:

### Prerequisites:
- **Docker Desktop** (with Kubernetes enabled) or **Minikube**
- **Node.js** (v18+ or v20+)
- **Skaffold CLI**
- **kubectl**

### Step-by-Step Instructions:
1. Clone the repository and navigate to root.
2. Initialize secrets by running: \`kubectl apply -f k8s/secrets.yml\`.
3. Launch the development orchestrator: \`skaffold dev\`. Skaffold compiles images and hot-syncs development changes straight to Kubernetes pods.
4. Launch the frontend: In a separate terminal, run \`npm run dev\` inside the \`frontend/\` directory. The application will be accessible at \`http://localhost:5173\`.`,
        code: `# Clone and launch
git clone https://github.com/your-username/FrameForge.git
cd FrameForge

# Apply secrets & startup skaffold
kubectl apply -f k8s/secrets.yml
skaffold dev

# Launch client dev server
cd frontend
npm install
npm run dev`
      },
      {
        id: 'flow',
        title: 'Core Workflow',
        content: `The development lifecycle in FrameForge runs in three simple steps:
1. **Forge Sandbox**: Create a Kubernetes-managed pod workspace container from the Projects page.
2. **Conversation & Prompting**: Instruct the Forge AI Engine to synthesize pages, adjust styles, or install components.
3. **Save & Sync**: Review code modifications in the integrated Monaco Editor, view live updates in the preview panel, and manually optimize code.`,
        code: `// Flow representation
[User Prompt] -> [AI-Worker Orchestrates Changes] -> [Files saved in Sandbox Pod] -> [Hot Module Reloading (HMR) triggers in Browser preview]`
      },
      {
        id: 'frontend-arch',
        title: 'Frontend Client Architecture',
        content: `The FrameForge Frontend is a high-fidelity client SPA built using React 19 and Vite 8. It functions as the visual control cockpit for developers:
- **State Management**: Redux Toolkit manages auth slices, active sandbox details, terminal sessions, and visual toast indicators.
- **Scroll Kinetics**: Lenis coordinates smooth scrolling across full pages and content panels.
- **Micro-Animations**: Framer Motion handles dynamic card popups and drawer entrances, while GSAP handles timeline-based hero card paralaxes.
- **Monaco Editor**: Exposes standard editor instances synced to files over API sockets.
- **CRT Terminal Client**: Runs Xterm.js with customized visual CRT scanlines overlays to display real-time pseudo-terminal (node-pty) outputs from container pods.
- **Obsidian Theme**: Deep slate palettes (#131313, #0e0e0e) combined with white/5 borders and dynamic interactive background glow orbs mapping client mouse movement.`,
        code: `// Redux global store reducer registrations
const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer
  }
})`
      }
    ]
  },
  {
    id: 'architecture',
    title: 'Core Architecture',
    icon: <Server className="w-4 h-4" />,
    items: [
      {
        id: 'mesh',
        title: 'Microservices Mesh Overview',
        content: `FrameForge operates on a scalable, cloud-native microservices mesh coordinated under Kubernetes. It features clean boundaries, asynchronous event queues, and real-time socket connections. The identity, sandbox allocation, AI code generation, and mailer alerts are entirely separated and hosted in isolated pods.`
      },
      {
        id: 'auth-service',
        title: 'Authentication Service',
        content: `The Auth Service manages identity verification, OAuth integrations, and session storage:
- **Framework & Database**: Built with Express.js, MongoDB, and Mongoose.
- **Passport Strategies**: Links local email-password registration alongside social Google OAuth 2.0.
- **Password Security**: Implements secure pre-save hooks to hash credentials using bcryptjs (10 rounds of salt generation).
- **Session Tokens**: Issues JWT tokens with 1-day expirations set directly in secure, HTTP-only cookie headers to prevent XSS.
- **Verification Trigger**: Generates 6-digit OTP codes on registration and publishes payload blocks to the message broker.`,
        code: `// Password hashing pre-save hook
userSchema.pre("save", async function () {
    if (!this.password || !this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
})`
      },
      {
        id: 'sandbox-service',
        title: 'Sandbox Service & Architecture',
        content: `The sandboxing service manages workspaces, virtual filesystem paths, and pseudo-terminals:
- **service/ (Sandbox Provisioner)**: Node.js controller using \`@kubernetes/client-node\` to communicate with the cluster host.
- **router/ (Gateway Proxy)**: HTTP and Socket.IO proxy routing frontend requests to the correct pod.
- **agent/ (Pod Controller)**: Embedded node agent executing commands inside sandboxes via pseudo-terminal instances (\`node-pty\`) and piping file streams.
- **template/ (App Boilerplate)**: React 19 + Vite 8 boilerplate template featuring custom aggressive hot reload polling.`,
        code: `// Directory architecture
├── Sandbox/
│   ├── service/   # API controller provisioning Kubernetes pods
│   ├── router/    # Gateway proxy resolver
│   ├── agent/     # node-pty terminal & file sync client running inside pod
│   └── template/  # React 19 + Vite 8 boilerplate canvas workspace`
      },
      {
        id: 'boilerplate',
        title: 'Boilerplate Canvas Template',
        content: `The Sandbox contains a specialized React/Vite/Tailwind boilerplate app cloned dynamically into every isolated workspace pod. This boilerplate acts as the live visual canvas for AI-orchestrated code synthesis.

### Tech Stack Specifications:
- **Core Library**: React 19 (^19.2.6) for lightweight virtual DOM rendering.
- **Bundler & Server**: Vite 8 (^8.0.12) with zero-latency dev compilations.
- **Styling Core**: Tailwind CSS v4 (@tailwindcss/vite ^4.3.0) for zero-config visual compilations.

### Real-time Hot Module Replacement (HMR) Sync Tuning:
To support instant preview synchronization across container boundaries in Kubernetes, the Vite configuration is heavily optimized:
- **Aggressive Watch Polling**: Watcher is configured with \`usePolling: true\` and check interval set to \`1000ms\`.
- **HMR Stability Threshold**: Dev watcher stability threshold set to \`500ms\` and poll interval set to \`100ms\` to ensure code modifications written by the sandbox agent are parsed immediately.
- **Allowed Hosts Wildcard**: Configured with \`allowedHosts: true\` to permit routing dynamic subdomains like \`*.preview.localhost\` through the cluster gateway proxy.`,
        code: `// vite.config.js watcher settings
export default defineConfig({
  server: {
    allowedHosts: true,
    watch: {
      usePolling: true,
      stabilityThreshold: 500,
      pollInterval: 100
    }
  }
})`
      },
      {
        id: 'ai-worker-service',
        title: 'AI-Worker Service',
        content: `The AI-Worker is a high-performance orchestration service built on Node.js and LangChain. It handles conversational prompts and plan synthesis:
- **Inference Engines**: Bridges connections to OpenAI, Groq, and Mistral AI models.
- **Structured Output**: Employs Zod schema models to enforce structure on generated file patches.
- **Real-time Streaming**: Uses Socket.IO 4 WebSockets to stream completed component tokens, planning logs, and suggestions down to the workspace.`,
        code: `// Zod schema model validation for edits
const FileEditSchema = z.object({
  path: z.string(),
  content: z.string(),
  action: z.enum(["create", "modify", "delete"])
})`
      },
      {
        id: 'notification-service',
        title: 'Notification Service',
        content: `The Notification Service is an asynchronous, event-driven worker:
- **Event Consumer**: Connects to the CloudAMQP broker, listening for verification OTP payloads inside the \`AUTH_NOTIFICATION_QUEUE\`.
- **Gmail OAuth2 API**: Uses secure access tokens, automatic refresh cycles, and base64-encoded MIME envelopes.
- **Safe Acknowledgements**: Executes \`channel.ack(msg)\` only after successful email dispatch, ensuring no task is lost.
- **Premium Templates**: Styled in dark-mode with high-contrast inline tables matching our obsidian theme.`,
        code: `// Payload consumed by notification service
{
  "to": "user@example.com",
  "otp": "852914"
}`
      },
      {
        id: 'k8s',
        title: 'Kubernetes Ingress & RBAC',
        content: `Kubernetes coordinates networking, deployments, and security permissions across the cluster:
- **ingress-nginx**: Exposes path-based and host-based routing. Handles regular APIs, plus dynamic routes like \`*.preview.localhost\` and \`*.agent.localhost\` to forward preview and WebSocket terminal traffic to routers.
- **rbac.yml**: Configures Roles and Bindings granting the \`sandbox\` service account explicit permission to create, read, list, and delete pods, services, and deployments inside the cluster.`,
        code: `# Ingress routing mappings
/api/auth      -> auth-service:80
/api/sandbox   -> sandbox-service:80
/api/ai        -> ai-worker-service:80
*.preview.localhost -> router-service:80 (Vite app preview)
*.agent.localhost   -> router-service:80 (Terminal WebSockets)`
      }
    ]
  },
  {
    id: 'guides',
    title: 'Developer Guides',
    icon: <Settings className="w-4 h-4" />,
    items: [
      {
        id: 'secrets',
        title: 'Secrets Configuration',
        content: `Secret variables are aggregated inside \`k8s/secrets.yml\` in Base64-encoded format. 
To run locally, you can create a \`.env\` file in the service directories containing the following variables:

### Database & Auth:
- **MONGO_URL**: MongoDB connection string.
- **JWT_SECRET**: Session token encryption key.
- **GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET**: OAuth applications keys.

### Messaging & Queues:
- **CLOUD_AMQP_URL**: CloudAMQP managed RabbitMQ connection string.
- **GOOGLE_REFRESH_TOKEN**: OAuth2 refresh token for Gmail scope mailers.

### AI Engine API Keys:
- **OPENAI_API_KEY / GROQ_API_KEY / MISTRAL_API_KEY**: AI worker client keys.`,
        code: `# Encoding secrets to Base64
echo -n "your-secret-key" | base64

# secrets.yml format:
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  MONGO_URL: bW9uZ29kYitzcnY6Ly8...
  JWT_SECRET: eW91ci1qd3Qtc2VjcmV0...`
      },
      {
        id: 'jsdoc',
        title: 'Code Documentation Standards',
        content: `To ensure self-documenting codebases, FrameForge strictly enforces standard JSDoc definitions. Any new controller, helper, route, or middleware function must specify parameter types and return details.`,
        code: `/**
 * Gets the profile of the currently logged-in user.
 * 
 * @async
 * @function GetMe
 * @param {import("express").Request} req - Express request object containing user ID.
 * @param {import("express").Response} res - Express response object.
 * @returns {Promise<import("express").Response>} Express JSON response.
 */
export async function GetMe(req, res) {
    const { id } = req.user;
    const user = await User.findById(id);
    return res.status(200).json({ success: true, user });
}`
      }
    ]
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: <Code2 className="w-4 h-4" />,
    items: [
      {
        id: 'auth-api',
        title: 'Authentication API',
        content: `The Auth microservice runs identity management under \`/api/auth\`:
- **POST /register**: Registers new user. Generates OTP verification keys.
- **POST /login**: Validates credentials. Sets HTTP-Only JWT cookie.
- **POST /verify-otp**: Validates verification codes. Updates user verified status.
- **GET /get-me**: Retrieves username and avatar details for current session.
- **POST /logout**: Drops cookie sessions.`,
        code: `// Response for GET /api/auth/get-me
{
  "success": true,
  "message": "User found successfully",
  "user": {
    "username": "coder_john",
    "avatar": "https://lh3.googleusercontent.com/..."
  }
}`
      },
      {
        id: 'sandbox-api',
        title: 'Sandbox & Files API',
        content: `The Sandbox microservice handles workspaces and files under \`/api/sandbox\` proxies:
- **POST /start**: Launches a pod container and ClusterIP service for the project, returning a preview URL.
- **GET /projects**: Fetches all projects matching user context.
- **GET /list-files**: Recursively scans container files directory inside active sandboxes.
- **POST /update-file**: Writes editor changes directly to container files.
- **POST /delete-file**: Deletes files or folders from container workspace.`,
        code: `// Response for GET /api/sandbox/list-files
{
  "status": "success",
  "files": [
    { "name": "package.json", "path": "/app/package.json", "type": "file" },
    { "name": "src", "path": "/app/src", "type": "directory" }
  ]
}`
      },
      {
        id: 'ai-api',
        title: 'AI Worker socket stream',
        content: `The AI Worker handles dynamic prompt engineering and live streaming components:
- **WebSocket Route**: Connects directly to \`/api/ai/socket.io\`.
- **Streaming Pipeline**: Emits real-time completion chunks, planning events, and autocomplete logs. It validates structural updates using Zod schema models before writing code files inside sandboxes.`,
        code: `// Socket completion event structure
socket.emit("ai-event", {
  step: "Updating files...",
  status: "running",
  files: ["src/components/Button.jsx"]
})`
      }
    ]
  }
];

export default function DocsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState('overview');
  const scrollContainerRef = useRef(null);
  const lenisRef = useRef(null);

  useEffect(() => {
    // Initialize Lenis smooth scrolling for DocsPage
    const lenis = new Lenis({
      wrapper: scrollContainerRef.current,
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Filter sections based on search query
  const filteredSections = DOCS_SECTIONS.map(section => {
    const matchingItems = section.items.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...section, items: matchingItems };
  }).filter(section => section.items.length > 0);

  // Scroll to active content block
  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    const element = document.getElementById(itemId);
    const container = scrollContainerRef.current;
    if (element && container) {
      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
      
      container.scrollTo({
        top: relativeTop - 30,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="h-screen w-full bg-background text-on-background relative overflow-hidden font-body-md flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      {/* Background Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-15%] w-[45vw] h-[45vw] bg-primary/4 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] bg-tertiary-container/3 rounded-full blur-[160px]" />
      </div>

      {/* Docs Header */}
      <header className="sticky top-0 z-40 w-full bg-background/50 border-b border-outline-variant/15 backdrop-blur-xl px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-outline-variant/20 hover:border-primary/40 hover:bg-primary/5 text-xs text-on-surface-variant font-label-caps tracking-wider transition-all cursor-pointer select-none active:scale-95"
          >
            <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Landing</span>
          </button>
          
          <div className="h-4 w-px bg-outline-variant/30 hidden sm:block" />

          <div className="items-center gap-2.5 hidden sm:flex">
            <span className="font-display-lg text-sm font-bold text-white tracking-widest uppercase">Forge Docs</span>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/3 hover:bg-white/5 focus:bg-white/5 text-white placeholder-gray-500 rounded-xl border border-white/10 focus:border-primary/45 focus:outline-none transition-all text-xs font-mono-data"
          />
        </div>
      </header>

      {/* Main Panel Content Area */}
      <div className="flex-1 flex min-h-0 relative z-10">
        
        {/* Left Sidebar Category Navigator */}
        <aside className="w-68 hidden lg:flex flex-col border-r border-outline-variant/10 px-5 py-8 overflow-y-auto select-none bg-black/10">
          <div className="flex flex-col gap-6">
            {filteredSections.map((section) => (
              <div key={section.id} className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-2 text-[10px] font-bold text-primary tracking-widest uppercase opacity-85">
                  {section.icon}
                  <span>{section.title}</span>
                </div>
                
                <div className="flex flex-col pl-2 border-l border-white/5 ml-2 gap-1.5">
                  {section.items.map((item) => {
                    const isSelected = activeItem === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`text-left text-xs py-1.5 px-3.5 rounded-lg transition-all cursor-pointer font-medium ${
                          isSelected
                            ? 'bg-primary/10 text-white font-bold border border-primary/25 shadow-sm'
                            : 'text-on-surface-variant/70 hover:text-white hover:bg-white/2 border border-transparent'
                        }`}
                      >
                        {item.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Right-side dynamic content logs */}
        <main
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-6 md:px-16 py-10 flex flex-col gap-14 min-h-0 scrollbar-thin bg-black/5"
        >
          {filteredSections.length === 0 ? (
            <div className="py-24 text-center flex flex-col items-center gap-4">
              <HelpCircle size={40} className="text-gray-600 animate-bounce" />
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-white">No documents match search query</h3>
                <p className="text-xs text-gray-500 font-light">Try entering a different keyword like "API", "microservices" or "sandbox".</p>
              </div>
            </div>
          ) : (
            filteredSections.map((section) => (
              <section key={section.id} className="flex flex-col gap-6">
                <div className="flex items-center gap-2.5 pb-2.5 border-b border-white/5">
                  <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20">
                    {section.icon}
                  </div>
                  <h2 className="text-lg font-bold text-white tracking-wide">{section.title}</h2>
                </div>

                <div className="flex flex-col gap-8">
                  {section.items.map((item) => (
                    <motion.div
                      id={item.id}
                      key={item.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-10%" }}
                      transition={{ duration: 0.5 }}
                      className="p-7 glass-panel rounded-2xl border border-white/5 bg-[#0e0e11]/40 hover:border-white/10 transition-all flex flex-col gap-4 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-xl pointer-events-none" />

                      <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
                        <ChevronRight size={14} className="text-primary" />
                        {item.title}
                      </h3>

                      <div className="text-xs text-on-surface-variant/85 leading-relaxed font-light whitespace-pre-line space-y-4">
                        {item.content.split('\n\n').map((paragraph, pIdx) => {
                          if (paragraph.startsWith('###')) {
                            return (
                              <h4 key={pIdx} className="text-sm font-bold text-white mt-4 mb-2">
                                {paragraph.replace('### ', '')}
                              </h4>
                            );
                          }
                          if (paragraph.startsWith('-')) {
                            return (
                              <ul key={pIdx} className="list-disc pl-5 space-y-1.5 my-2">
                                {paragraph.split('\n').map((li, liIdx) => (
                                  <li key={liIdx}>{li.replace('- ', '')}</li>
                                ))}
                              </ul>
                            );
                          }
                          return <p key={pIdx}>{paragraph}</p>;
                        })}
                      </div>

                      {item.code && (
                        <div className="relative mt-2">
                          <div className="absolute top-3 right-3 text-[9px] font-mono-data text-gray-600 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded border border-white/5">
                            schema / logs
                          </div>
                          <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-[10px] font-mono-data text-[#8bdeff] overflow-x-auto leading-relaxed scrollbar-thin">
                            <code>{item.code}</code>
                          </pre>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </section>
            ))
          )}
        </main>
      </div>
    </div>
  );
}
