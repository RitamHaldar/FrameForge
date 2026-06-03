import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BrainCircuit, Activity, Zap, Lock, Server, Mail, Terminal, 
  Code2, Check, ChevronRight, Play, RefreshCw, Cpu, Database, 
  Layers, Settings, Shield, ExternalLink, Globe, FileCode 
} from 'lucide-react';
import Lenis from 'lenis';

const SOLUTIONS = [
  {
    id: 'ai-orchestrator',
    title: 'AI Component Synthesis',
    tagline: 'LangChain & Socket.IO Orchestration',
    icon: <BrainCircuit className="w-6 h-6" />,
    shortDesc: 'Low-latency real-time streaming of JIT-completed React components validated by strict Zod schema constraints.',
    badge: 'LangChain + Socket.IO',
    color: 'from-primary/10 to-primary/5',
    borderColor: 'group-hover:border-primary/45',
    iconBg: 'bg-primary/10 text-primary border border-primary/20',
    readmeRef: 'ai-worker/README.md',
    details: {
      problem: 'Traditional AI generation workflows suffer from slow turnaround times, lacking real-time developer feedback, and exposing unstructured code output prone to system crashes.',
      solution: 'FrameForge decouples prompt interpretation from code compilation. The Node.js Express service acts as a broker using LangChain for multi-model inference and streams code snippets over low-latency Socket.IO WebSockets directly to active workspaces, checking formatting at compile-time.',
      techStack: [
        { name: 'Inference Orchestrator', value: 'LangChain Node.js CLI' },
        { name: 'Model Providers', value: 'OpenAI, Groq, Mistral AI' },
        { name: 'Live Streaming Client', value: 'Socket.IO v4 WebSockets' },
        { name: 'Validation Middleware', value: 'Zod JSON Schemas' },
        { name: 'Editor Integration', value: '@monaco-editor/react' }
      ],
      endpoints: [
        { method: 'WS', route: '/api/ai/socket.io', access: 'Protected', desc: 'Connects workspace sockets for live component editing.' },
        { method: 'POST', route: '/api/ai/suggest', access: 'Protected', desc: 'Generates inline autocomplete tips based on cursor coordinates.' }
      ],
      codebase: [
        { path: 'src/agents/', desc: 'Custom LangChain planning chains & prompts.' },
        { path: 'src/config/', desc: 'Model configurations & client credential loading.' },
        { path: 'src/routes/', desc: 'REST endpoints triggering agents synchronously.' },
        { path: 'src/app.js', desc: 'Express app hooks and Socket server registrations.' }
      ]
    }
  },
  {
    id: 'sandbox-engine',
    title: 'Isolated Sandboxing',
    tagline: 'Dynamic Pod Allocation & High-Speed Sync',
    icon: <Server className="w-6 h-6" />,
    shortDesc: 'On-demand spawning of isolated container workspaces inside Kubernetes clusters with aggressive HMR watcher tuning.',
    badge: 'K8s + Vite HMR',
    color: 'from-secondary-container/10 to-transparent',
    borderColor: 'group-hover:border-secondary-container/45',
    iconBg: 'bg-secondary-container/10 text-secondary-container border border-secondary-container/20',
    readmeRef: 'Sandbox/README.md',
    details: {
      problem: 'Hosting concurrent browser-based developer previews creates heavy server resource consumption, security exploits, and sluggish hot module replacements.',
      solution: 'FrameForge uses a sandboxing system running inside Kubernetes. A Node.js provisioner uses the host K8s API to spin up isolated container pods running an agent. Each pod mounts a Vite 8 + React 19 boilerplate config tuned with aggressive watch polling, delivering changes to browser previews in under 200ms.',
      techStack: [
        { name: 'Cluster Engine', value: 'Kubernetes API client' },
        { name: 'Development Sync', value: 'Skaffold CLI Sync points' },
        { name: 'Shell Terminal Emulator', value: 'node-pty Pseudo-Terminal' },
        { name: 'Boilerplate framework', value: 'React 19 & Vite 8' },
        { name: 'Styling Core', value: 'Tailwind CSS v4' }
      ],
      endpoints: [
        { method: 'POST', route: '/api/sandbox/create', access: 'Protected', desc: 'Saves project info into MongoDB database.' },
        { method: 'POST', route: '/api/sandbox/start', access: 'Protected', desc: 'Spawns Kubernetes Pods & ClusterIP services for target project.' },
        { method: 'GET', route: '/api/sandbox/projects', access: 'Protected', desc: 'Returns user projects with active sandbox states.' }
      ],
      codebase: [
        { path: 'service/', desc: 'Kubernetes pod provisioner controller.' },
        { path: 'router/', desc: 'Proxy router serving terminal sockets & sandbox assets.' },
        { path: 'agent/', desc: 'Interactive filesystem watcher & node-pty client inside pod.' },
        { path: 'template/', desc: 'React 19 Vite 8 custom boilerplate canvas project.' }
      ]
    }
  },
  {
    id: 'auth-pipeline',
    title: 'Async Verification Pipeline',
    tagline: 'RabbitMQ Message Brokering & OTP Deliveries',
    icon: <Shield className="w-6 h-6" />,
    shortDesc: 'High-throughput secure registration flow utilizing decoupled auth servers, RabbitMQ queues, and OAuth2 Gmail client workers.',
    badge: 'RabbitMQ + Gmail OAuth2',
    color: 'from-tertiary-container/10 to-transparent',
    borderColor: 'group-hover:border-tertiary-container/45',
    iconBg: 'bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20',
    readmeRef: 'auth/README.md & notification/README.md',
    details: {
      problem: 'Sending verification emails synchronously during registration slows user requests, leading to server timeouts if mail transports act sluggish.',
      solution: 'Decoupled services: User logs into an Express service using passport.js; registration automatically pushes an OTP event payload down the RabbitMQ broker queue. A dedicated consumer node processes this message in the background, communicating with Google Mail APIs via OAuth2 refresh tokens to fire premium styled dark-mode HTML templates.',
      techStack: [
        { name: 'Identity Layer', value: 'Passport.js Google OAuth 2.0' },
        { name: 'Data Hashing', value: 'bcryptjs (10-round salt)' },
        { name: 'Message Broker', value: 'RabbitMQ (CloudAMQP Instance)' },
        { name: 'Mail Dispatch API', value: 'Google Client Library (Gmail OAuth2)' },
        { name: 'Email Template design', value: 'Premium Inline HTML tables' }
      ],
      endpoints: [
        { method: 'POST', route: '/api/auth/register', access: 'Public', desc: 'Saves user credentials and triggers OTP publish events.' },
        { method: 'POST', route: '/api/auth/verify-otp', access: 'Protected', desc: 'Verifies the 6-digit user input token.' },
        { method: 'GET', route: '/api/notification/health', access: 'Public', desc: 'Returns worker health status metrics.' }
      ],
      codebase: [
        { path: 'auth/src/', desc: 'Auth Express app routes, Google passport strategies & schemas.' },
        { path: 'notification/src/', desc: 'RabbitMQ event handler loop, mailer utilities & email layouts.' },
        { path: 'k8s/auth-*.yml', desc: 'Kubernetes configurations declaring Auth deployment pods.' }
      ]
    }
  }
];

const PIPELINE_STEPS = {
  'ai-orchestrator': [
    { name: 'Browser Client', desc: 'Dispatches UI generation prompt requests', icon: <Globe className="w-4 h-4" /> },
    { name: 'LangChain AI Agent', desc: 'Orchestrates multi-model code synthesis plan', icon: <Cpu className="w-4 h-4" /> },
    { name: 'Zod Validator', desc: 'Verifies structured JSON file patch schemas', icon: <Check className="w-4 h-4" /> },
    { name: 'Vite Sandbox HMR', desc: 'Syncs code JIT & reloads client at 144 FPS', icon: <Zap className="w-4 h-4" /> }
  ],
  'sandbox-engine': [
    { name: 'Sandbox Controller', desc: 'Performs identity & DB project registration', icon: <Database className="w-4 h-4" /> },
    { name: 'K8s Cluster Host', desc: 'Schedules dynamic user workspace pods', icon: <Server className="w-4 h-4" /> },
    { name: 'node-pty Agent', desc: 'Spawns internal terminal and file watcher', icon: <Terminal className="w-4 h-4" /> },
    { name: 'Gateway Proxy', desc: 'Maps domain routing for browser previews', icon: <Globe className="w-4 h-4" /> }
  ],
  'auth-pipeline': [
    { name: 'Auth Controller', desc: 'Express register routes & bcrypt salts', icon: <Lock className="w-4 h-4" /> },
    { name: 'RabbitMQ Broker', desc: 'Dispatches event down secure AMQP queues', icon: <Layers className="w-4 h-4" /> },
    { name: 'Notification Worker', desc: 'Background queue event payload consumer', icon: <Settings className="w-4 h-4" /> },
    { name: 'Gmail SMTP API', desc: 'Refreshes OAuth2 credentials & mails HTML', icon: <Mail className="w-4 h-4" /> }
  ]
};

export default function SolutionsPage() {
  const navigate = useNavigate();
  const [activeSol, setActiveSol] = useState('ai-orchestrator');
  const [simState, setSimState] = useState('idle'); // idle, running, completed
  const [simLogs, setSimLogs] = useState([]);
  const [activeNodeIndex, setActiveNodeIndex] = useState(-1);
  const scrollContainerRef = useRef(null);
  const logTerminalEndRef = useRef(null);
  const terminalContainerRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => lenis.destroy();
  }, []);

  // Scroll to bottom of simulation logs terminal internally
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTo({
        top: terminalContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [simLogs]);

  // Run simulation sequence
  const startSimulation = () => {
    setSimState('running');
    setSimLogs([]);
    setActiveNodeIndex(0);

    const logSteps = {
      'ai-orchestrator': [
        { text: '[system] Initializing LLM Orchestrator engine...', delay: 400, nodeIdx: 0 },
        { text: '[system] Connecting to Socket.IO path /api/ai/socket.io... [OK]', delay: 800, nodeIdx: 0 },
        { text: '[agent] User input received: "Build a premium glassmorphic button component"', delay: 1300, nodeIdx: 0 },
        { text: '[agent] Analysing project context directories...', delay: 1800, nodeIdx: 1 },
        { text: '[agent] Sending inference request to model: Groq LLaMA-3.1-70B...', delay: 2400, nodeIdx: 1 },
        { text: '[model] Streaming token payload patch response...', delay: 3000, nodeIdx: 1 },
        { text: '[validation] Synthesizing file patch: /src/components/GlassButton.jsx', delay: 3400, nodeIdx: 2 },
        { text: '[validation] Enforcing Zod structure checks: verifying file actions... [Valid]', delay: 3900, nodeIdx: 2 },
        { text: '[agent] Writing component file updates down socket connection... [Completed]', delay: 4400, nodeIdx: 2 },
        { text: '[sandbox] Aggressive Vite watcher triggered hot reload... [Synced in 186ms]', delay: 5000, nodeIdx: 3 },
        { text: '[system] Simulation finished. UI fully hydrated.', delay: 5400, nodeIdx: 3 }
      ],
      'sandbox-engine': [
        { text: '[service] POST /api/sandbox/start received... auth token checked', delay: 400, nodeIdx: 0 },
        { text: '[service] Connecting to Kubernetes Cluster API...', delay: 800, nodeIdx: 0 },
        { text: '[rbac] ServiceAccount permissions verified... [Authorized]', delay: 1200, nodeIdx: 0 },
        { text: '[service] Spawning Isolated Container Pod: "sandbox-usr-nexus"...', delay: 1700, nodeIdx: 1 },
        { text: '[k8s] Mounting node-pty execution Agent container...', delay: 2200, nodeIdx: 1 },
        { text: '[agent] Initializing shell terminal controller & filesystem monitor...', delay: 2700, nodeIdx: 2 },
        { text: '[k8s] Allocation of Service IP bindings mapping target: 3000 -> 80...', delay: 3200, nodeIdx: 2 },
        { text: '[router] Gateway proxy bound subdomain "*.preview.localhost"...', delay: 3800, nodeIdx: 3 },
        { text: '[agent] Cloned react19-vite8-tailwind4 boilerplate app template successfully...', delay: 4300, nodeIdx: 3 },
        { text: '[agent] Vite watcher configured with polling interval: 1000ms... [Ready]', delay: 4900, nodeIdx: 3 },
        { text: '[system] Sandbox online. Preview URL: http://nexus-workspace.preview.localhost', delay: 5400, nodeIdx: 3 }
      ],
      'auth-pipeline': [
        { text: '[auth] POST /api/auth/register triggered... parsing username/password', delay: 400, nodeIdx: 0 },
        { text: '[auth] Pre-save database middleware active: hashing password via bcrypt...', delay: 800, nodeIdx: 0 },
        { text: '[auth] Database User record created. OTP code generated: 482019', delay: 1300, nodeIdx: 0 },
        { text: '[queue] Publishing event to AUTH_NOTIFICATION_QUEUE on CloudAMQP...', delay: 1800, nodeIdx: 1 },
        { text: '[broker] RabbitMQ acknowledged message receipt... [Queue size: 1]', delay: 2300, nodeIdx: 1 },
        { text: '[notification] Background consumer thread reading queue payload...', delay: 2900, nodeIdx: 2 },
        { text: '[notification] Refreshing Google OAuth2 secure credentials...', delay: 3400, nodeIdx: 2 },
        { text: '[notification] Compiling premium dark-mode inline email template...', delay: 3900, nodeIdx: 2 },
        { text: '[notification] Secure MIME-base64 payload transmitted via Gmail Client APIs...', delay: 4500, nodeIdx: 3 },
        { text: '[queue] Mail dispatch successful. Queue message acknowledged and purged.', delay: 5000, nodeIdx: 3 },
        { text: '[system] Pipeline clear. Client auto-tabbing Verify OTP inputs active.', delay: 5400, nodeIdx: 3 }
      ]
    };

    const steps = logSteps[activeSol];
    steps.forEach((step) => {
      setTimeout(() => {
        setSimLogs(prev => [...prev, step.text]);
        setActiveNodeIndex(step.nodeIdx);
        if (step.text.includes('Simulation finished') || step.text.includes('Sandbox online') || step.text.includes('Pipeline clear')) {
          setSimState('completed');
        }
      }, step.delay);
    });
  };

  const selectedSolution = SOLUTIONS.find(s => s.id === activeSol);

  return (
    <div className="min-h-screen w-full bg-background text-on-background relative font-body-md flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/4 rounded-full blur-[130px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-tertiary-container/3 rounded-full blur-[150px] animate-pulse" style={{ animationDuration: '15s' }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwb2x5Z29uIHBvaW50cz0iMCA2MCA2MCA2MCA2MCAwIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      {/* Solutions Header Nav */}
      <header className="sticky top-0 z-40 w-full bg-background/80 border-b border-outline-variant/15 backdrop-blur-xl px-6 md:px-12 py-5 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant/20 hover:border-primary/40 hover:bg-primary/5 text-xs text-on-surface-variant font-medium tracking-wide transition-all cursor-pointer select-none active:scale-95 bg-surface/5"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Landing</span>
          </button>
          
          <div className="h-4 w-px bg-outline-variant/30 hidden sm:block" />

          <div className="items-center gap-2.5 hidden sm:flex">
            <Layers className="w-4 h-4 text-primary" />
            <span className="font-display-lg text-sm font-bold text-white tracking-widest uppercase">System Solutions</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/docs')}
            className="px-4 py-2 rounded-full border border-outline-variant/20 hover:border-primary/40 hover:bg-primary/5 text-xs text-on-surface-variant font-medium transition-all cursor-pointer backdrop-blur-md"
          >
            Developer Docs
          </button>
          <button 
            onClick={() => navigate('/projects')}
            className="px-4 py-2 rounded-full bg-primary text-background hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] text-xs font-semibold transition-all cursor-pointer"
          >
            Launch Space
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className="flex-1 w-full px-6 md:px-16 py-12 z-10 max-w-7xl mx-auto"
      >
        {/* Header Title Hero */}
        <section className="mb-16 text-center lg:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-on-surface font-bold mb-4 tracking-tight leading-[1.1]">
            Engineered <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-outline-variant">Enterprise Solutions.</span>
          </h1>
          <p className="text-on-surface-variant/70 text-lg md:text-xl font-light max-w-3xl leading-relaxed">
            Explore how FrameForge maps isolated containers, RabbitMQ queues, and LangChain model streams into a seamless, high-performance developer sandbox.
          </p>
        </section>

        {/* Solution Selector Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {SOLUTIONS.map((sol) => {
            const isSelected = activeSol === sol.id;
            return (
              <button
                key={sol.id}
                onClick={() => {
                  setActiveSol(sol.id);
                  setSimState('idle');
                  setSimLogs([]);
                  setActiveNodeIndex(-1);
                }}
                className={`group text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden backdrop-blur-sm cursor-pointer ${
                  isSelected 
                    ? 'bg-surface-container/60 border-primary/45 shadow-xl shadow-primary/5 ring-1 ring-primary/20' 
                    : 'bg-surface/5 border-outline-variant/10 hover:border-outline-variant/30 hover:bg-surface/10'
                }`}
              >
                <div className={`w-12 h-12 flex items-center justify-center rounded-xl mb-4 ${sol.iconBg} group-hover:scale-105 transition-transform duration-300`}>
                  {sol.icon}
                </div>
                <div className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">{sol.badge}</div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary transition-colors">{sol.title}</h3>
                <p className="text-xs text-on-surface-variant/65 leading-relaxed font-light">{sol.shortDesc}</p>
              </button>
            );
          })}
        </section>

        {/* Active Solution Details and Playground */}
        {selectedSolution && (
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            
            {/* Deep-dive Documentation Panel */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="p-8 glass-panel rounded-3xl border border-white/5 bg-[#0e0e11]/40 flex flex-col gap-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-2xl pointer-events-none" />
                
                {/* Title and Tagline */}
                <div>
                  <span className="text-xs font-semibold text-primary/80 tracking-widest uppercase font-mono-data">Solution Overview</span>
                  <h2 className="text-2xl font-bold text-white mt-1 mb-2">{selectedSolution.title}</h2>
                  <p className="text-sm text-primary italic font-light">{selectedSolution.tagline}</p>
                </div>

                {/* Problem & Solution breakdown */}
                <div className="space-y-4 border-t border-white/5 pt-4 text-xs font-light leading-[1.6]">
                  <div>
                    <h4 className="font-bold text-white mb-1 flex items-center gap-1.5"><Settings className="w-3.5 h-3.5 text-primary" /> The Problem</h4>
                    <p className="text-on-surface-variant/70">{selectedSolution.details.problem}</p>
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1 flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-green-500" /> FrameForge Core Solution</h4>
                    <p className="text-on-surface-variant/70">{selectedSolution.details.solution}</p>
                  </div>
                </div>

                {/* Tech stack items mapping */}
                <div className="border-t border-white/5 pt-4">
                  <h4 className="font-bold text-xs text-white mb-3 flex items-center gap-1.5"><Cpu className="w-3.5 h-3.5 text-primary" /> Technical Architecture Specs</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedSolution.details.techStack.map((tech, i) => (
                      <div key={i} className="flex flex-col p-3 rounded-lg bg-black/20 border border-white/5 font-mono-data text-[10px]">
                        <span className="text-on-surface-variant/50 uppercase tracking-wide">{tech.name}</span>
                        <span className="text-white mt-0.5 font-medium">{tech.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* API endpoints and Codebase paths */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Routes Card */}
                <div className="p-6 glass-panel rounded-2xl border border-white/5 bg-[#0e0e11]/40 flex flex-col gap-4">
                  <h4 className="font-bold text-xs text-white flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-primary" /> API Routing Endpoints</h4>
                  <div className="space-y-3">
                    {selectedSolution.details.endpoints.map((ep, i) => (
                      <div key={i} className="flex flex-col gap-1 pb-2 border-b border-white/5 last:border-0 last:pb-0 font-mono-data text-[10px]">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                              ep.method === 'POST' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                              ep.method === 'WS' ? 'bg-primary/10 text-primary border border-primary/20' : 'bg-white/5 text-gray-400'
                            }`}>{ep.method}</span>
                            <span className="text-white font-medium">{ep.route}</span>
                          </div>
                          <p className="text-[9px] text-on-surface-variant/60 font-sans font-light mt-0.5">{ep.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Directory mapping Card */}
                <div className="p-6 glass-panel rounded-2xl border border-white/5 bg-[#0e0e11]/40 flex flex-col gap-4">
                  <h4 className="font-bold text-xs text-white flex items-center gap-1.5"><FileCode className="w-3.5 h-3.5 text-primary" /> Codebase Structure</h4>
                  <div className="space-y-3 font-mono-data text-[10px]">
                    {selectedSolution.details.codebase.map((cb, i) => (
                      <div key={i} className="flex flex-col pb-2 border-b border-white/5 last:border-0 last:pb-0">
                        <div className="flex items-center gap-1.5 text-white font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>{cb.path}</span>
                        </div>
                        <p className="text-[9px] text-on-surface-variant/60 font-sans font-light mt-0.5 pl-3">{cb.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* Simulation Playground Panel */}
            <div className="lg:col-span-5 flex flex-col gap-4 h-full lg:sticky lg:top-24">
              <div className="p-6 bg-surface-container/30 border border-white/10 rounded-3xl flex flex-col gap-5 backdrop-blur-xl h-full shadow-lg relative overflow-hidden">
                
                <div>
                  <h3 className="text-md font-bold text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary animate-pulse" />
                    Pipeline Live Simulator
                  </h3>
                  <p className="text-[11px] text-on-surface-variant/65 mt-1 font-light leading-relaxed">
                    Trigger a real-time walkthrough representing container, queue, and model operations logged synchronously.
                  </p>
                </div>

                {/* Visual Process Pipeline */}
                <div className="flex flex-col gap-3 py-2 border-b border-white/5 pb-5">
                  <h4 className="text-[10px] font-bold text-primary tracking-widest uppercase mb-1">
                    Visual Pipeline Process
                  </h4>
                  <div className="flex flex-col gap-4">
                    {PIPELINE_STEPS[activeSol].map((step, idx) => {
                      const isCompleted = simState === 'completed' || activeNodeIndex > idx;
                      const isActive = simState === 'running' && activeNodeIndex === idx;
                      const isPending = !isCompleted && !isActive;

                      return (
                        <div key={idx} className="flex items-start gap-3 relative">
                          {/* Visual Connector Line */}
                          {idx < PIPELINE_STEPS[activeSol].length - 1 && (
                            <div className={`absolute left-5 top-9 bottom-[-20px] w-0.5 z-0 ${
                              isCompleted ? 'bg-green-500' : 'bg-white/10 border-dashed border-l border-white/20'
                            }`} />
                          )}

                          {/* Node Status Indicator Circle */}
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border z-10 transition-all duration-300 relative ${
                            isCompleted 
                              ? 'bg-green-500/10 border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
                              : isActive
                              ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_rgba(255,255,255,0.2)] animate-pulse'
                              : 'bg-black/40 border-white/10 text-on-surface-variant/40'
                          }`}>
                            {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.icon}
                            
                            {/* Spinning indicator ring for active node */}
                            {isActive && (
                              <div className="absolute inset-[-2px] border border-primary border-t-transparent rounded-full animate-spin" />
                            )}
                          </div>

                          {/* Node Info Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold transition-colors ${
                                isCompleted ? 'text-white' : isActive ? 'text-primary' : 'text-on-surface-variant/40'
                              }`}>
                                {step.name}
                              </span>
                              <span className={`text-[8px] font-mono-data px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold ${
                                isCompleted ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                isActive ? 'bg-primary/10 text-primary border border-primary/20' :
                                'bg-white/5 text-on-surface-variant/20'
                              }`}>
                                {isCompleted ? 'SUCCESS' : isActive ? 'PROCESSING' : 'PENDING'}
                              </span>
                            </div>
                            <p className={`text-[10px] font-light mt-0.5 transition-colors leading-relaxed truncate ${
                              isCompleted ? 'text-on-surface-variant/70' : isActive ? 'text-on-surface-variant/80' : 'text-on-surface-variant/20'
                            }`}>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Terminal Console View */}
                <div ref={terminalContainerRef} className="flex-1 min-h-[300px] max-h-[380px] bg-black/80 rounded-2xl border border-white/10 p-4 font-mono-data text-[11px] text-on-surface-variant flex flex-col overflow-y-auto relative scrollbar-thin">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5 opacity-40 mb-3 select-none">
                    <span className="flex items-center gap-1.5"><Terminal className="w-3.5 h-3.5" /> frameforge_sim_v1</span>
                    <span className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                    </span>
                  </div>

                  <div className="flex-1 space-y-2 select-text">
                    {simLogs.length === 0 && (
                      <div className="text-center text-[10px] text-on-surface-variant/45 py-24 italic select-none">
                        Terminal idle. Click "Trigger Simulation Run" below.
                      </div>
                    )}
                    {simLogs.map((log, index) => {
                      let colorClass = 'text-on-surface-variant/75';
                      if (log.includes('[system]')) colorClass = 'text-primary font-semibold';
                      if (log.includes('[validation]') || log.includes('[rbac]')) colorClass = 'text-yellow-500/80';
                      if (log.includes('[model]')) colorClass = 'text-purple-400';
                      if (log.includes('[OK]') || log.includes('[Valid]') || log.includes('[Ready]') || log.includes('[Completed]') || log.includes('[Sent]')) {
                        colorClass = 'text-green-400';
                      }
                      return (
                        <div key={index} className={`leading-relaxed whitespace-pre-wrap ${colorClass}`}>
                          {log}
                        </div>
                      );
                    })}
                    <div ref={logTerminalEndRef} />
                  </div>
                </div>

                {/* Simulator Control Trigger */}
                <button
                  onClick={startSimulation}
                  disabled={simState === 'running'}
                  className={`w-full py-3.5 rounded-full font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    simState === 'running'
                      ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                      : 'bg-primary text-background hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-98'
                  }`}
                >
                  {simState === 'running' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Running Simulation Pipeline...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>Trigger Simulation Run</span>
                    </>
                  )}
                </button>

              </div>
            </div>

          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="relative bg-[#050505] border-t border-outline-variant/10 w-full py-8 z-20">
        <div className="px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono-data text-[10px] text-on-surface-variant/40">
            SYSTEM COMPONENT MAPPING SUCCESSFUL. READY FOR DEPLOYMENT.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono-data text-[10px] text-on-surface-variant/50">ALL QUEUES & INGRESS HEALTHY</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
