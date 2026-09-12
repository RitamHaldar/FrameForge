import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUp,
  Search,
  BookOpen,
  Server,
  Code2,
  Settings,
  ChevronRight,
  Check,
  Copy,
  Terminal,
  HelpCircle,
  ExternalLink,
  Sparkles,
  Command,
  X,
  Menu,
  FileCode,
  Layers,
  Zap,
  ShieldCheck,
  Link2,
  Hash
} from 'lucide-react';
import Lenis from 'lenis';

const DOCS_SECTIONS = [
  {
    id: 'welcome',
    title: 'Getting Started',
    icon: <BookOpen className="w-4 h-4 text-cyanAccent" />,
    items: [
      {
        id: 'overview',
        title: 'Platform Overview',
        badge: 'Core Concept',
        content: `FrameForge is an ultra-premium, AI-orchestrated cloud IDE and sandboxing environment that allows developers to design, develop, and preview React/Vite micro-apps in real-time.

Featuring a glassmorphic dashboard interface, high-performance execution, and seamless Kubernetes orchestration, FrameForge is engineered for top-tier interface designers and engineering architects. By bridging conversational prompt streams and dynamic isolated pods, engineers can generate, customize, and deploy interactive user interfaces in seconds without local configuration.`
      },
      {
        id: 'setup',
        title: 'Installation & Local Setup',
        badge: 'Dev Setup',
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
npm run dev`,
        language: 'bash'
      },
      {
        id: 'flow',
        title: 'Core Workflow',
        badge: 'Lifecycle',
        content: `The development lifecycle in FrameForge runs in three simple steps:
1. **Forge Sandbox**: Create a Kubernetes-managed pod workspace container from the Projects page.
2. **Conversation & Prompting**: Instruct the Forge AI Engine to synthesize pages, adjust styles, or install components.
3. **Save & Sync**: Review code modifications in the integrated Monaco Editor, view live updates in the preview panel, and manually optimize code.`,
        code: `// Flow representation
[User Prompt] -> [AI-Worker Orchestrates Changes] -> [Files saved in Sandbox Pod] -> [Hot Module Reloading (HMR) triggers in Browser preview]`,
        language: 'javascript'
      },
      {
        id: 'frontend-arch',
        title: 'Frontend Client Architecture',
        badge: 'React 19',
        content: `The FrameForge Frontend is a high-fidelity client SPA built using React 19 and Vite 8. It functions as the visual control cockpit for developers:
- **State Management**: Redux Toolkit manages auth slices, active sandbox details, terminal sessions, and visual toast indicators.
- **Scroll Kinetics**: Lenis coordinates smooth scrolling across full pages and content panels.
- **Micro-Animations**: Framer Motion handles dynamic card popups and drawer entrances, while GSAP handles timeline-based hero card parallaxes.
- **Monaco Editor**: Exposes standard editor instances synced to files over API sockets.
- **CRT Terminal Client**: Runs Xterm.js with customized visual CRT scanlines overlays to display real-time pseudo-terminal (node-pty) outputs from container pods.
- **Obsidian Theme**: Deep slate palettes (#08090A, #0D0F11) combined with subtle cyan accents and dynamic interactive background glow orbs.`,
        code: `// Redux global store reducer registrations
const store = configureStore({
  reducer: {
    auth: authReducer,
    toast: toastReducer
  }
});`,
        language: 'javascript'
      }
    ]
  },
  {
    id: 'architecture',
    title: 'Core Architecture',
    icon: <Server className="w-4 h-4 text-emerald-400" />,
    items: [
      {
        id: 'mesh',
        title: 'Microservices Mesh Overview',
        badge: 'Kubernetes',
        content: `FrameForge operates on a scalable, cloud-native microservices mesh coordinated under Kubernetes. It features clean boundaries, asynchronous event queues, and real-time socket connections. The identity, sandbox allocation, AI code generation, and mailer alerts are entirely separated and hosted in isolated pods.`
      },
      {
        id: 'auth-service',
        title: 'Authentication Service',
        badge: 'Security',
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
});`,
        language: 'javascript'
      },
      {
        id: 'sandbox-service',
        title: 'Sandbox Service & Architecture',
        badge: 'Compute',
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
│   └── template/  # React 19 + Vite 8 boilerplate canvas workspace`,
        language: 'bash'
      },
      {
        id: 'boilerplate',
        title: 'Boilerplate Canvas Template',
        badge: 'Vite 8',
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
});`,
        language: 'javascript'
      },
      {
        id: 'ai-worker-service',
        title: 'AI-Worker Service',
        badge: 'LangChain',
        content: `The AI-Worker is a high-performance orchestration service built on Node.js and LangChain. It handles conversational prompts and plan synthesis:
- **Inference Engines**: Bridges connections to OpenAI, Groq, and Mistral AI models.
- **Structured Output**: Employs Zod schema models to enforce structure on generated file patches.
- **Real-time Streaming**: Uses Socket.IO 4 WebSockets to stream completed component tokens, planning logs, and suggestions down to the workspace.`,
        code: `// Zod schema model validation for edits
const FileEditSchema = z.object({
  path: z.string(),
  content: z.string(),
  action: z.enum(["create", "modify", "delete"])
});`,
        language: 'typescript'
      },
      {
        id: 'notification-service',
        title: 'Notification Service',
        badge: 'RabbitMQ',
        content: `The Notification Service is an asynchronous, event-driven worker:
- **Event Consumer**: Connects to the CloudAMQP broker, listening for verification OTP payloads inside the \`AUTH_NOTIFICATION_QUEUE\`.
- **Gmail OAuth2 API**: Uses secure access tokens, automatic refresh cycles, and base64-encoded MIME envelopes.
- **Safe Acknowledgements**: Executes \`channel.ack(msg)\` only after successful email dispatch, ensuring no task is lost.
- **Premium Templates**: Styled in dark-mode with high-contrast inline tables matching our obsidian theme.`,
        code: `// Payload consumed by notification service
{
  "to": "user@example.com",
  "otp": "852914"
}`,
        language: 'json'
      },
      {
        id: 'k8s',
        title: 'Kubernetes Ingress & RBAC',
        badge: 'Networking',
        content: `Kubernetes coordinates networking, deployments, and security permissions across the cluster:
- **ingress-nginx**: Exposes path-based and host-based routing. Handles regular APIs, plus dynamic routes like \`*.preview.localhost\` and \`*.agent.localhost\` to forward preview and WebSocket terminal traffic to routers.
- **rbac.yml**: Configures Roles and Bindings granting the \`sandbox\` service account explicit permission to create, read, list, and delete pods, services, and deployments inside the cluster.`,
        code: `# Ingress routing mappings
/api/auth            -> auth-service:80
/api/sandbox         -> sandbox-service:80
/api/ai              -> ai-worker-service:80
*.preview.localhost  -> router-service:80 (Vite app preview)
*.agent.localhost    -> router-service:80 (Terminal WebSockets)`,
        language: 'nginx'
      }
    ]
  },
  {
    id: 'guides',
    title: 'Developer Guides',
    icon: <Settings className="w-4 h-4 text-amber-400" />,
    items: [
      {
        id: 'secrets',
        title: 'Secrets Configuration',
        badge: 'Config',
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
  JWT_SECRET: eW91ci1qd3Qtc2VjcmV0...`,
        language: 'yaml'
      },
      {
        id: 'jsdoc',
        title: 'Code Documentation Standards',
        badge: 'JSDoc',
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
}`,
        language: 'javascript'
      }
    ]
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: <Code2 className="w-4 h-4 text-purple-400" />,
    items: [
      {
        id: 'auth-api',
        title: 'Authentication API',
        badge: 'REST Endpoints',
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
}`,
        language: 'json'
      },
      {
        id: 'sandbox-api',
        title: 'Sandbox & Files API',
        badge: 'REST Endpoints',
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
}`,
        language: 'json'
      },
      {
        id: 'ai-api',
        title: 'AI Worker socket stream',
        badge: 'WebSocket Events',
        content: `The AI Worker handles dynamic prompt engineering and live streaming components:
- **WebSocket Route**: Connects directly to \`/api/ai/socket.io\`.
- **Streaming Pipeline**: Emits real-time completion chunks, planning events, and autocomplete logs. It validates structural updates using Zod schema models before writing code files inside sandboxes.`,
        code: `// Socket completion event structure
socket.emit("ai-event", {
  step: "Updating files...",
  status: "running",
  files: ["src/components/Button.jsx"]
});`,
        language: 'javascript'
      }
    ]
  }
];

export default function DocsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState('');

  const scrollContainerRef = useRef(null);
  const scrollContentRef = useRef(null);
  const searchInputRef = useRef(null);
  const ambientLightRef = useRef(null);
  const lenisRef = useRef(null);
  const isManualScrollRef = useRef(false);
  const manualScrollTimerRef = useRef(null);

  // Keyboard shortcut (⌘K, Ctrl+K, or /) to focus search, Esc to blur/clear
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      } else if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        e.preventDefault();
        if (searchQuery) {
          setSearchQuery('');
        } else {
          searchInputRef.current?.blur();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchQuery]);

  // Ambient mouse cursor tracking light (GPU-accelerated translate3d)
  useEffect(() => {
    const onMouseMove = (e) => {
      if (ambientLightRef.current) {
        ambientLightRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Lenis Smooth Scroll initialized on the docs scroll container
  useEffect(() => {
    const wrapper = scrollContainerRef.current;
    if (!wrapper) return;

    const lenis = new Lenis({
      wrapper: wrapper,
      content: scrollContentRef.current,
      duration: 0.85,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      syncTouch: false,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', (e) => {
      if (e.limit > 0) {
        setReadingProgress(Math.min(100, Math.max(0, (e.scroll / e.limit) * 100)));
      }
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  // ScrollSpy: Automatically update activeItem in sidebar as user scrolls through doc topics
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const allItemIds = DOCS_SECTIONS.flatMap(s => s.items.map(i => i.id));
    
    const handleScroll = () => {
      if (isManualScrollRef.current) return;
      
      const containerRect = container.getBoundingClientRect();
      const targetThreshold = containerRect.top + 160;

      let currentActive = allItemIds[0];
      for (const id of allItemIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= targetThreshold) {
            currentActive = id;
          } else {
            break;
          }
        }
      }
      if (currentActive) {
        setActiveItem(currentActive);
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter sections based on search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return DOCS_SECTIONS;
    const q = searchQuery.toLowerCase().trim();

    return DOCS_SECTIONS.map(section => {
      const matchingItems = section.items.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.content.toLowerCase().includes(q) ||
        (item.badge && item.badge.toLowerCase().includes(q)) ||
        (item.code && item.code.toLowerCase().includes(q))
      );
      return { ...section, items: matchingItems };
    }).filter(section => section.items.length > 0);
  }, [searchQuery]);

  const totalMatches = useMemo(() => {
    return filteredSections.reduce((acc, sec) => acc + sec.items.length, 0);
  }, [filteredSections]);

  // Smooth scroll to active content block
  const handleItemClick = useCallback((itemId) => {
    setActiveItem(itemId);
    setMobileMenuOpen(false);

    isManualScrollRef.current = true;
    if (manualScrollTimerRef.current) clearTimeout(manualScrollTimerRef.current);
    manualScrollTimerRef.current = setTimeout(() => {
      isManualScrollRef.current = false;
    }, 900);

    const element = document.getElementById(itemId);
    if (element && lenisRef.current) {
      lenisRef.current.scrollTo(element, {
        offset: -25,
        duration: 0.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    }
  }, []);

  // Copy Permalink Handler
  const handleCopyLink = useCallback((itemId) => {
    const url = `${window.location.origin}${window.location.pathname}#${itemId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(itemId);
    setTimeout(() => setCopiedLink(''), 2200);
  }, []);

  // Handle hash on initial mount
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      setTimeout(() => {
        handleItemClick(hash);
      }, 350);
    }
  }, [handleItemClick]);

  return (
    <div className="h-screen w-full bg-obsidian text-textPrimary antialiased selection:bg-cyanAccent/20 selection:text-white relative overflow-hidden font-sans flex flex-col min-h-screen">
      
      {/* GPU-Accelerated Cursor Tracking Light */}
      <div
        ref={ambientLightRef}
        className="fixed -top-[275px] -left-[275px] w-[550px] h-[550px] rounded-full pointer-events-none z-0 opacity-40 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, rgba(15, 23, 42, 0) 70%)',
          transform: 'translate3d(-999px, -999px, 0)'
        }}
      />

      {/* Technical Background Grid & Ambient Dots */}
      <div className="fixed inset-0 tech-grid pointer-events-none z-0 opacity-40"></div>
      <div className="fixed inset-0 tech-dots pointer-events-none z-0 opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)]"></div>

      {/* Subtle Top Horizon Volumetric Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-gradient-to-b from-cyanAccent/5 to-transparent rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* DOCS HEADER */}
      <header className="sticky top-0 z-40 w-full bg-[#0D0F11]/90 border-b border-white/[0.08] backdrop-blur-xl px-4 sm:px-8 py-3 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Back Button */}
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/')}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] hover:border-cyanAccent/40 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-mono text-textSecondary hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={13} className="text-cyanAccent transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Landing</span>
          </motion.button>

          <div className="h-4 w-px bg-white/10" />

          {/* Minimalist Brand Logo */}
          <div
            onClick={() => navigate('/')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-6 h-6 rounded bg-[#15181C] border border-white/15 flex items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:border-cyanAccent/40 shadow-inner">
              <div className="w-3 h-3 border border-cyanAccent rotate-45 transition-transform duration-300 group-hover:rotate-90"></div>
            </div>
            <span className="text-sm font-semibold tracking-tight text-white group-hover:text-cyanAccent/90 transition-colors">FrameForge</span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium tracking-wider bg-cyanAccent/10 border border-cyanAccent/20 text-cyanAccent shadow-[0_0_8px_rgba(0,240,255,0.15)]">
              DOCS v2.4
            </span>
          </div>
        </div>

        {/* Search Input Bar with Shortcut Indicator */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="relative w-48 sm:w-80 group">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted group-focus-within:text-cyanAccent transition-colors" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search docs (AST, microVM, API)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-12 py-1.5 bg-[#090A0D] text-white placeholder-textMuted rounded-full border border-white/[0.08] focus:border-cyanAccent/50 focus:ring-1 focus:ring-cyanAccent/30 focus:outline-none transition-all text-xs font-mono"
            />
            <AnimatePresence mode="wait">
              {searchQuery ? (
                <motion.button
                  key="clear-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-textMuted hover:text-white cursor-pointer p-0.5"
                  title="Clear search (Esc)"
                >
                  <X size={12} />
                </motion.button>
              ) : (
                <div key="shortcut-badge" className="hidden sm:flex items-center gap-0.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-textMuted bg-white/5 border border-white/10 px-1.5 py-0.5 rounded pointer-events-none">
                  <Command size={9} />
                  <span>K</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg border border-white/10 bg-white/5 text-textSecondary hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </motion.button>
        </div>
      </header>

      {/* Reading Progress Indicator Bar */}
      <div className="w-full h-[2px] bg-white/[0.04] relative z-30">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-cyanAccent transition-all duration-100 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex min-h-0 relative z-10">
        
        {/* Mobile Backdrop */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 z-20 bg-black/70 backdrop-blur-sm"
            />
          )}
        </AnimatePresence>

        {/* LEFT SIDEBAR: Topic Navigator */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30 w-72 bg-[#090A0D]/95 lg:bg-[#090A0D]/50 backdrop-blur-2xl lg:backdrop-blur-none
            border-r border-white/[0.06] flex flex-col justify-between select-none
            transition-transform duration-300 lg:translate-x-0
            ${mobileMenuOpen ? 'translate-x-0 top-[50px]' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Section Navigation Items */}
          <div className="p-4 overflow-y-auto space-y-6 scrollbar-none flex-1">
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-[10px] font-mono text-cyanAccent px-2.5 py-1.5 rounded-lg bg-cyanAccent/10 border border-cyanAccent/20 flex items-center justify-between"
                >
                  <span className="font-semibold tracking-wider">FILTER RESULTS</span>
                  <span className="bg-cyanAccent/20 px-1.5 py-0.5 rounded text-[9px] font-bold">{totalMatches} topics</span>
                </motion.div>
              )}
            </AnimatePresence>

            {filteredSections.map((section) => (
              <div key={section.id} className="space-y-1.5">
                <div className="flex items-center gap-2 px-2 text-[10px] font-mono font-semibold tracking-wider text-textMuted uppercase">
                  {section.icon}
                  <span>{section.title}</span>
                </div>
                
                <div className="space-y-0.5 pl-2 border-l border-white/[0.06] ml-2">
                  {section.items.map((item) => {
                    const isSelected = activeItem === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item.id)}
                        className={`relative w-full text-left text-xs py-1.5 px-3 rounded-lg transition-colors cursor-pointer font-sans flex items-center justify-between group`}
                      >
                        {/* Framer Motion Fluid Sliding Indicator */}
                        {isSelected && (
                          <motion.div
                            layoutId="activeDocsPill"
                            className="absolute inset-0 rounded-lg bg-cyanAccent/10 border border-cyanAccent/30 shadow-[0_0_14px_rgba(0,240,255,0.12)]"
                            transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                          />
                        )}

                        <span className={`relative z-10 truncate transition-colors ${
                          isSelected ? 'text-cyanAccent font-medium' : 'text-textSecondary group-hover:text-white'
                        }`}>
                          {item.title}
                        </span>

                        {isSelected && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="relative z-10 w-1.5 h-1.5 rounded-full bg-cyanAccent shadow-[0_0_6px_#00f0ff]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-4 border-t border-white/[0.06] bg-[#07080A]/60 text-[10px] font-mono text-textMuted flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Cluster API Online</span>
            </div>
            <span className="text-textMuted/80">v2.4.0</span>
          </div>
        </aside>

        {/* RIGHT: Document Content Stream */}
        <main
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-10 min-h-0 bg-[#08090A]/30 relative"
        >
          <div ref={scrollContentRef} className="max-w-4xl mx-auto space-y-14 pb-28">
            
            {filteredSections.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-24 text-center flex flex-col items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-textMuted">
                  <HelpCircle size={24} className="animate-pulse text-cyanAccent" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">No documentation matches &quot;{searchQuery}&quot;</h3>
                  <p className="text-xs text-textSecondary font-light">Try searching for keywords like &quot;KVM&quot;, &quot;Zod&quot;, &quot;Skaffold&quot;, &quot;AST&quot;, or &quot;JWT&quot;.</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSearchQuery('')}
                  className="mt-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-xs text-white font-mono cursor-pointer transition-colors border border-white/10"
                >
                  Clear search filter
                </motion.button>
              </motion.div>
            ) : (
              filteredSections.map((section) => (
                <section key={section.id} className="space-y-6">
                  
                  {/* Category Header Strip */}
                  <div className="flex items-center gap-2.5 pb-3 border-b border-white/[0.08]">
                    <div className="p-1.5 rounded-lg bg-white/[0.04] border border-white/10">
                      {section.icon}
                    </div>
                    <h2 className="text-lg font-bold text-white tracking-tight">{section.title}</h2>
                    <span className="text-[10px] font-mono text-textMuted uppercase tracking-widest ml-auto">
                      {section.items.length} {section.items.length === 1 ? 'topic' : 'topics'}
                    </span>
                  </div>

                  {/* Topic Cards */}
                  <div className="space-y-6">
                    {section.items.map((item) => (
                      <motion.div
                        id={item.id}
                        key={item.id}
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="obsidian-card rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300 group"
                      >
                        {/* Corner Accent Glow */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-cyanAccent/[0.07] to-transparent rounded-full blur-2xl pointer-events-none" />

                        {/* Card Header & Badge */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                              <span className="text-cyanAccent font-mono text-sm">›</span>
                              {item.title}
                            </h3>

                            {/* Copy Permalink Action Button */}
                            <button
                              onClick={() => handleCopyLink(item.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-white/10 text-textMuted hover:text-cyanAccent cursor-pointer text-xs"
                              title="Copy section link"
                            >
                              {copiedLink === item.id ? (
                                <Check size={12} className="text-emerald-400" />
                              ) : (
                                <Hash size={12} />
                              )}
                            </button>
                          </div>

                          {item.badge && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/20 shadow-[0_0_8px_rgba(0,240,255,0.08)]">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        {/* Formatted Content */}
                        <div className="text-xs text-textSecondary leading-relaxed font-sans space-y-3">
                          {item.content.split('\n\n').map((paragraph, pIdx) => {
                            if (paragraph.startsWith('###')) {
                              return (
                                <h4 key={pIdx} className="text-sm font-semibold text-white font-mono pt-3 pb-1 border-b border-white/[0.06] flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-cyanAccent"></span>
                                  {paragraph.replace('### ', '')}
                                </h4>
                              );
                            }
                            if (paragraph.startsWith('-')) {
                              return (
                                <ul key={pIdx} className="space-y-1.5 my-2 pl-2">
                                  {paragraph.split('\n').map((li, liIdx) => {
                                    const cleaned = li.replace('- ', '');
                                    const [boldPart, ...rest] = cleaned.split(':**');
                                    if (rest.length > 0) {
                                      return (
                                        <li key={liIdx} className="flex items-start gap-2">
                                          <span className="text-cyanAccent mt-1 text-[9px]">▪</span>
                                          <span>
                                            <strong className="text-white font-medium">{boldPart.replace('**', '')}:</strong>
                                            {rest.join(':**')}
                                          </span>
                                        </li>
                                      );
                                    }
                                    return (
                                      <li key={liIdx} className="flex items-start gap-2">
                                        <span className="text-cyanAccent mt-1 text-[9px]">▪</span>
                                        <span>{cleaned}</span>
                                      </li>
                                    );
                                  })}
                                </ul>
                              );
                            }
                            return <p key={pIdx} className="leading-relaxed">{paragraph}</p>;
                          })}
                        </div>

                        {/* Syntax-Highlighted Code Block with Copy Button */}
                        {item.code && (
                          <CodeBlock code={item.code} language={item.language || 'bash'} />
                        )}
                      </motion.div>
                    ))}
                  </div>

                </section>
              ))
            )}

          </div>

          {/* Floating Back to Top & Reading Progress Action Button */}
          <AnimatePresence>
            {readingProgress > 12 && (
              <motion.button
                initial={{ opacity: 0, y: 16, scale: 0.85 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 16, scale: 0.85 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => lenisRef.current?.scrollTo(0, { duration: 0.75 })}
                className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-[#0E1116]/90 border border-white/10 hover:border-cyanAccent/40 backdrop-blur-xl shadow-2xl text-xs font-mono text-textSecondary hover:text-white transition-colors cursor-pointer group"
              >
                <div className="relative w-4 h-4 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="3" />
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#00F0FF"
                      strokeWidth="3"
                      strokeDasharray="88"
                      strokeDashoffset={88 - (88 * readingProgress) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-150"
                    />
                  </svg>
                  <ArrowUp size={8} className="absolute text-cyanAccent group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <span className="text-[10px] text-cyanAccent font-semibold">{Math.round(readingProgress)}%</span>
              </motion.button>
            )}
          </AnimatePresence>

        </main>
      </div>

    </div>
  );
}

// Subcomponent: Production Monaco-Style Code Block with Copy Action & Visual Detail
function CodeBlock({ code, language = 'bash' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-4 rounded-xl bg-[#08090C] border border-white/[0.08] overflow-hidden font-mono text-xs shadow-lg group/code">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-[#0C0E11] border-b border-white/[0.06] text-[10px] text-textMuted select-none">
        <div className="flex items-center space-x-2">
          {/* macOS window dots */}
          <div className="flex items-center space-x-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70 border border-rose-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70 border border-amber-500/40"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70 border border-emerald-500/40"></div>
          </div>
          <span className="ml-2 text-textSecondary uppercase font-medium tracking-wider">{language}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-textSecondary hover:text-cyanAccent transition-colors px-2 py-0.5 rounded hover:bg-white/5 cursor-pointer"
          title="Copy code snippet"
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="copied"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1 text-emerald-400 font-semibold"
              >
                <Check size={11} />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-1"
              >
                <Copy size={11} />
                <span>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Code Lines with High-Contrast Syntax Color Tokens */}
      <pre className="p-4 text-[11px] font-mono leading-relaxed text-cyanAccent/90 overflow-x-auto selection:bg-cyanAccent/20">
        <code>{code}</code>
      </pre>
    </div>
  );
}
