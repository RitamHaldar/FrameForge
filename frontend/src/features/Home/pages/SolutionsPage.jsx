import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, BrainCircuit, Activity, Zap, Lock, Server, Mail, Terminal, 
  Code2, Check, ChevronRight, Play, RefreshCw, Cpu, Database, 
  Layers, Settings, Shield, ExternalLink, Globe, FileCode,
  Copy, Sparkles, ArrowUp, CheckCircle2, AlertCircle, FolderTree, Network
} from 'lucide-react';
import Lenis from 'lenis';

const SOLUTIONS = [
  {
    id: 'ai-orchestrator',
    title: 'AI Component Synthesis',
    tagline: 'LangChain & Socket.IO Orchestration',
    icon: <BrainCircuit className="w-5 h-5 text-cyanAccent" />,
    shortDesc: 'Low-latency real-time streaming of JIT-completed React components validated by strict Zod schema constraints.',
    badge: 'LangChain + Socket.IO',
    accentColor: '#00F0FF',
    accentClass: 'text-cyanAccent border-cyanAccent/30 bg-cyanAccent/10',
    readmeRef: 'ai-worker/README.md',
    details: {
      problem: 'Traditional AI generation workflows suffer from slow turnaround times, lacking real-time developer feedback, and exposing unstructured code output prone to syntax breaks and system crashes.',
      solution: 'FrameForge decouples prompt interpretation from code compilation. The Node.js Express service acts as a broker using LangChain for multi-model inference and streams code snippets over low-latency Socket.IO WebSockets directly to active workspaces, validating AST structures at compile-time.',
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
    icon: <Server className="w-5 h-5 text-emerald-400" />,
    shortDesc: 'On-demand spawning of isolated container workspaces inside Kubernetes clusters with aggressive HMR watcher tuning.',
    badge: 'K8s + Vite HMR',
    accentColor: '#34D399',
    accentClass: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
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
    icon: <Shield className="w-5 h-5 text-purple-400" />,
    shortDesc: 'High-throughput secure registration flow utilizing decoupled auth servers, RabbitMQ queues, and OAuth2 Gmail client workers.',
    badge: 'RabbitMQ + Gmail OAuth2',
    accentColor: '#C084FC',
    accentClass: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
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
    { name: 'Vite Sandbox HMR', desc: 'Syncs code JIT & reloads client in <200ms', icon: <Zap className="w-4 h-4" /> }
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
  const [readingProgress, setReadingProgress] = useState(0);
  const [copiedItem, setCopiedItem] = useState('');

  const scrollContainerRef = useRef(null);
  const logTerminalEndRef = useRef(null);
  const terminalContainerRef = useRef(null);
  const ambientLightRef = useRef(null);
  const lenisRef = useRef(null);
  const timeoutsRef = useRef([]);

  // GPU-Accelerated Cursor Tracking Light
  useEffect(() => {
    const onMouseMove = (e) => {
      if (ambientLightRef.current) {
        ambientLightRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  // Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      smoothTouch: false,
      touchMultiplier: 1.5,
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

  // Cleanup simulation timeouts
  const clearSimulationTimeouts = () => {
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    return () => clearSimulationTimeouts();
  }, []);

  // Auto-scroll simulation logs internally
  useEffect(() => {
    if (terminalContainerRef.current) {
      terminalContainerRef.current.scrollTo({
        top: terminalContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [simLogs]);

  // Run simulation sequence with realistic micro-delays
  const startSimulation = () => {
    clearSimulationTimeouts();
    setSimState('running');
    setSimLogs([]);
    setActiveNodeIndex(0);

    const logSteps = {
      'ai-orchestrator': [
        { text: '[system] Initializing LLM Orchestrator engine...', delay: 350, nodeIdx: 0 },
        { text: '[system] Connecting to Socket.IO path /api/ai/socket.io... [OK]', delay: 750, nodeIdx: 0 },
        { text: '[agent] User prompt stream received: "Synthesize dark obsidian button component with ripple"', delay: 1250, nodeIdx: 0 },
        { text: '[agent] Scanning AST project workspace tree...', delay: 1750, nodeIdx: 1 },
        { text: '[agent] Transmitting inference payload to model: Groq LLaMA-3.3-70B...', delay: 2350, nodeIdx: 1 },
        { text: '[model] Streaming token patch: 142 tokens/sec generated...', delay: 2950, nodeIdx: 1 },
        { text: '[validation] Synthesizing file patch: /src/components/CyberButton.jsx', delay: 3450, nodeIdx: 2 },
        { text: '[validation] Enforcing Zod structure checks: verifying AST exports... [Valid]', delay: 3950, nodeIdx: 2 },
        { text: '[agent] Writing component file updates down socket connection... [Completed]', delay: 4450, nodeIdx: 2 },
        { text: '[sandbox] Aggressive Vite watcher triggered hot reload... [Synced in 184ms]', delay: 4950, nodeIdx: 3 },
        { text: '[system] Simulation finished. UI hydrated at 144 FPS.', delay: 5350, nodeIdx: 3 }
      ],
      'sandbox-engine': [
        { text: '[service] POST /api/sandbox/start received... validating session credentials', delay: 350, nodeIdx: 0 },
        { text: '[service] Connecting to Kubernetes Cluster API...', delay: 750, nodeIdx: 0 },
        { text: '[rbac] ServiceAccount permissions verified... [Authorized]', delay: 1150, nodeIdx: 0 },
        { text: '[service] Spawning Isolated Container Pod: "sandbox-usr-alpha-09"...', delay: 1650, nodeIdx: 1 },
        { text: '[k8s] Mounting node-pty execution Agent container...', delay: 2150, nodeIdx: 1 },
        { text: '[agent] Initializing shell pseudo-terminal controller & filesystem monitor...', delay: 2650, nodeIdx: 2 },
        { text: '[k8s] Allocation of Service IP bindings mapping target: 3000 -> 80...', delay: 3150, nodeIdx: 2 },
        { text: '[router] Gateway proxy bound subdomain "*.preview.localhost"...', delay: 3750, nodeIdx: 3 },
        { text: '[agent] Cloned react19-vite8-tailwind4 boilerplate app template successfully...', delay: 4250, nodeIdx: 3 },
        { text: '[agent] Vite watcher configured with polling interval: 1000ms... [Ready]', delay: 4850, nodeIdx: 3 },
        { text: '[system] Sandbox online. Preview URL: http://alpha-09.preview.localhost', delay: 5350, nodeIdx: 3 }
      ],
      'auth-pipeline': [
        { text: '[auth] POST /api/auth/register triggered... parsing username/password payload', delay: 350, nodeIdx: 0 },
        { text: '[auth] Pre-save database middleware active: hashing credentials via bcryptjs (10 rounds)...', delay: 750, nodeIdx: 0 },
        { text: '[auth] Database User record created. Verification OTP generated: 792401', delay: 1250, nodeIdx: 0 },
        { text: '[queue] Publishing payload to AUTH_NOTIFICATION_QUEUE on CloudAMQP...', delay: 1750, nodeIdx: 1 },
        { text: '[broker] RabbitMQ acknowledged message receipt... [Queue size: 1]', delay: 2250, nodeIdx: 1 },
        { text: '[notification] Background consumer worker reading queue payload...', delay: 2850, nodeIdx: 2 },
        { text: '[notification] Refreshing Google OAuth2 secure mailer credentials...', delay: 3350, nodeIdx: 2 },
        { text: '[notification] Compiling premium dark-mode inline HTML email template...', delay: 3850, nodeIdx: 2 },
        { text: '[notification] Secure MIME-base64 envelope dispatched via Gmail API...', delay: 4450, nodeIdx: 3 },
        { text: '[queue] Mail delivery confirmed. channel.ack(msg) executed.', delay: 4950, nodeIdx: 3 },
        { text: '[system] Pipeline clear. Session cookie set with HttpOnly, Secure flags.', delay: 5350, nodeIdx: 3 }
      ]
    };

    const steps = logSteps[activeSol];
    steps.forEach((step) => {
      const timer = setTimeout(() => {
        setSimLogs(prev => [...prev, step.text]);
        setActiveNodeIndex(step.nodeIdx);
        if (step.text.includes('Simulation finished') || step.text.includes('Sandbox online') || step.text.includes('Pipeline clear')) {
          setSimState('completed');
        }
      }, step.delay);
      timeoutsRef.current.push(timer);
    });
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(''), 2000);
  };

  const handleCopyTerminalLogs = () => {
    if (simLogs.length === 0) return;
    navigator.clipboard.writeText(simLogs.join('\n'));
    setCopiedItem('terminal-logs');
    setTimeout(() => setCopiedItem(''), 2000);
  };

  const selectedSolution = SOLUTIONS.find(s => s.id === activeSol);

  return (
    <div className="min-h-screen w-full bg-obsidian text-textPrimary relative font-sans flex flex-col selection:bg-cyanAccent/20 selection:text-white antialiased">
      
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[320px] bg-gradient-to-b from-cyanAccent/5 to-transparent rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* SOLUTIONS HEADER */}
      <header className="sticky top-0 z-40 w-full bg-[#0D0F11]/90 border-b border-white/[0.08] backdrop-blur-xl px-4 sm:px-8 py-3 flex items-center justify-between shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Back to Landing Button */}
          <motion.button
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/')}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/[0.08] hover:border-cyanAccent/40 bg-white/[0.02] hover:bg-white/[0.06] text-xs font-mono text-textSecondary hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={13} className="text-cyanAccent transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Landing</span>
          </motion.button>
          
          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          {/* Minimalist Brand Logo */}
          <div 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-6 h-6 rounded bg-[#15181C] border border-white/15 flex items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:border-cyanAccent/40 shadow-inner">
              <div className="w-3 h-3 border border-cyanAccent rotate-45 transition-transform duration-300 group-hover:rotate-90"></div>
            </div>
            <span className="text-sm font-semibold tracking-tight text-white group-hover:text-cyanAccent/90 transition-colors">FrameForge</span>
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium tracking-wider bg-cyanAccent/10 border border-cyanAccent/20 text-cyanAccent shadow-[0_0_8px_rgba(0,240,255,0.15)]">
              SOLUTIONS
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/docs')}
            className="px-3.5 py-1.5 rounded-full border border-white/[0.08] hover:border-cyanAccent/40 bg-white/[0.02] hover:bg-white/[0.06] text-xs text-textSecondary hover:text-white font-mono transition-all cursor-pointer"
          >
            Documentation
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/projects')}
            className="px-4 py-1.5 rounded-full bg-cyanAccent text-[#08090A] hover:bg-cyanAccent/90 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] text-xs font-semibold tracking-tight transition-all cursor-pointer font-sans"
          >
            Launch Space
          </motion.button>
        </div>
      </header>

      {/* Top Reading Progress Bar */}
      <div className="w-full h-[2px] bg-white/[0.04] relative z-30">
        <div
          className="h-full bg-gradient-to-r from-cyan-400 to-cyanAccent transition-all duration-100 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-10 z-10 max-w-7xl mx-auto space-y-12">
        
        {/* Header Hero Banner */}
        <section className="text-center sm:text-left space-y-3 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyanAccent/20 bg-cyanAccent/10 text-cyanAccent text-[11px] font-mono uppercase tracking-wider shadow-[0_0_12px_rgba(0,240,255,0.12)]">
            <Sparkles size={11} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>Enterprise Architecture Solutions</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl text-white font-extrabold tracking-tight leading-[1.1]">
            Engineered <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyanAccent/90 to-cyanAccent">Cloud Compute.</span>
          </h1>
          <p className="text-textSecondary text-sm sm:text-base font-light max-w-3xl leading-relaxed">
            Explore how FrameForge orchestrates isolated Kubernetes microVM pods, asynchronous RabbitMQ message queues, and LangChain model pipelines into an ultra-fast real-time developer environment.
          </p>
        </section>

        {/* 3 Solution Selector Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {SOLUTIONS.map((sol) => {
            const isSelected = activeSol === sol.id;
            return (
              <motion.button
                key={sol.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  clearSimulationTimeouts();
                  setActiveSol(sol.id);
                  setSimState('idle');
                  setSimLogs([]);
                  setActiveNodeIndex(-1);
                }}
                className={`group text-left p-5 sm:p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden backdrop-blur-xl cursor-pointer ${
                  isSelected 
                    ? 'bg-[#0E1116] border-cyanAccent/50 shadow-[0_12px_36px_-8px_rgba(0,240,255,0.15)] ring-1 ring-cyanAccent/30' 
                    : 'bg-[#0A0C0E]/80 border-white/[0.07] hover:border-white/20 hover:bg-[#0D0F12]'
                }`}
              >
                {/* Active Solution Background Glow */}
                {isSelected && (
                  <motion.div
                    layoutId="activeSolutionGlow"
                    className="absolute inset-0 bg-gradient-to-br from-cyanAccent/[0.06] via-transparent to-transparent pointer-events-none"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}

                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                    isSelected ? sol.accentClass : 'bg-white/[0.03] border border-white/10 text-textSecondary group-hover:text-white'
                  }`}>
                    {sol.icon}
                  </div>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase tracking-wider font-semibold border ${
                    isSelected ? 'bg-cyanAccent/10 text-cyanAccent border-cyanAccent/30' : 'bg-white/5 text-textMuted border-white/10'
                  }`}>
                    {sol.badge}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-cyanAccent transition-colors relative z-10">
                  {sol.title}
                </h3>
                <p className="text-xs text-textSecondary font-light leading-relaxed relative z-10">
                  {sol.shortDesc}
                </p>

                {/* Bottom Active Indicator Line */}
                {isSelected && (
                  <motion.div
                    layoutId="activeSolutionLine"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-cyanAccent to-cyan-300"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
              </motion.button>
            );
          })}
        </section>

        {/* Active Solution Deep Dive & Interactive Playground */}
        <AnimatePresence mode="wait">
          {selectedSolution && (
            <motion.section
              key={selectedSolution.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start pb-16"
            >
              
              {/* LEFT: Deep-dive Documentation Panel */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Main Overview Card */}
                <div className="obsidian-card rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col gap-6">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyanAccent/[0.08] to-transparent rounded-full blur-3xl pointer-events-none" />
                  
                  {/* Header Title & Tagline */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-cyanAccent uppercase tracking-widest">
                      <Network size={12} />
                      <span>Architecture Breakdown</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">{selectedSolution.title}</h2>
                    <p className="text-xs sm:text-sm text-cyanAccent/80 font-mono mt-0.5">{selectedSolution.tagline}</p>
                  </div>

                  {/* Split Problem vs Solution Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-white/[0.08] pt-5">
                    
                    {/* The Challenge */}
                    <div className="p-4 rounded-xl bg-rose-500/[0.03] border border-rose-500/20 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-rose-400 font-mono uppercase tracking-wider">
                        <AlertCircle size={13} />
                        <span>The Challenge</span>
                      </div>
                      <p className="text-xs text-textSecondary font-light leading-relaxed">
                        {selectedSolution.details.problem}
                      </p>
                    </div>

                    {/* The FrameForge Resolution */}
                    <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/20 flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 font-mono uppercase tracking-wider">
                        <CheckCircle2 size={13} />
                        <span>FrameForge Architecture</span>
                      </div>
                      <p className="text-xs text-textSecondary font-light leading-relaxed">
                        {selectedSolution.details.solution}
                      </p>
                    </div>

                  </div>

                  {/* Technical Architecture Specs Grid */}
                  <div className="border-t border-white/[0.08] pt-5">
                    <h4 className="text-xs font-bold text-white mb-3 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                      <Cpu size={13} className="text-cyanAccent" />
                      <span>Technical Architecture Specifications</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {selectedSolution.details.techStack.map((tech, i) => (
                        <div key={i} className="flex flex-col p-3 rounded-lg bg-[#0A0C0F] border border-white/[0.06] font-mono text-xs">
                          <span className="text-[10px] text-textMuted uppercase tracking-wider">{tech.name}</span>
                          <span className="text-white mt-0.5 font-medium text-xs truncate">{tech.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* API Routing Endpoints & Codebase Structures */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  
                  {/* Routes Card */}
                  <div className="obsidian-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono uppercase tracking-wider">
                      <Globe size={13} className="text-cyanAccent" />
                      <span>API Routing Endpoints</span>
                    </h4>
                    
                    <div className="space-y-2.5 font-mono text-xs">
                      {selectedSolution.details.endpoints.map((ep, i) => (
                        <div key={i} className="flex flex-col gap-1 pb-2.5 border-b border-white/[0.06] last:border-0 last:pb-0 group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider font-mono ${
                                ep.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                ep.method === 'WS' ? 'bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/20' : 
                                'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                              }`}>
                                {ep.method}
                              </span>
                              <span className="text-white font-medium text-xs truncate">{ep.route}</span>
                            </div>

                            <button
                              onClick={() => handleCopyText(ep.route, `ep-${i}`)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-textMuted hover:text-cyanAccent cursor-pointer"
                              title="Copy route path"
                            >
                              {copiedItem === `ep-${i}` ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            </button>
                          </div>
                          <p className="text-[10px] text-textSecondary font-sans font-light pl-1">{ep.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Codebase Tree Structure Card */}
                  <div className="obsidian-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono uppercase tracking-wider">
                      <FolderTree size={13} className="text-cyanAccent" />
                      <span>Codebase Architecture</span>
                    </h4>
                    
                    <div className="space-y-2.5 font-mono text-xs">
                      {selectedSolution.details.codebase.map((cb, i) => (
                        <div key={i} className="flex flex-col pb-2.5 border-b border-white/[0.06] last:border-0 last:pb-0 group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-white font-medium min-w-0">
                              <div className="w-1.5 h-1.5 rounded-full bg-cyanAccent" />
                              <span className="truncate text-xs">{cb.path}</span>
                            </div>
                            <button
                              onClick={() => handleCopyText(cb.path, `cb-${i}`)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-textMuted hover:text-cyanAccent cursor-pointer"
                              title="Copy directory path"
                            >
                              {copiedItem === `cb-${i}` ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
                            </button>
                          </div>
                          <p className="text-[10px] text-textSecondary font-sans font-light pl-3 mt-0.5">{cb.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

              {/* RIGHT: Live Interactive Pipeline Simulator */}
              <div className="lg:col-span-5 flex flex-col gap-4 h-full lg:sticky lg:top-20">
                <div className="obsidian-card rounded-2xl p-5 sm:p-6 flex flex-col gap-5 relative overflow-hidden shadow-2xl">
                  
                  {/* Simulator Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Activity className="w-4 h-4 text-cyanAccent animate-pulse" />
                        <span>Pipeline Live Simulator</span>
                      </h3>
                      <p className="text-[11px] text-textSecondary mt-0.5 font-light">
                        Simulate real-time microVM scheduling, queue events, and streaming logs.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px]">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        simState === 'running' ? 'bg-cyanAccent animate-ping' :
                        simState === 'completed' ? 'bg-emerald-400' : 'bg-textMuted'
                      }`} />
                      <span className="uppercase text-textSecondary">{simState}</span>
                    </div>
                  </div>

                  {/* Visual Node Pipeline */}
                  <div className="flex flex-col gap-3 py-1">
                    <div className="text-[10px] font-mono font-semibold text-cyanAccent uppercase tracking-wider">
                      Process Pipeline Nodes
                    </div>
                    
                    <div className="flex flex-col gap-3.5 relative">
                      {PIPELINE_STEPS[activeSol].map((step, idx) => {
                        const isCompleted = simState === 'completed' || activeNodeIndex > idx;
                        const isActive = simState === 'running' && activeNodeIndex === idx;

                        return (
                          <div key={idx} className="flex items-start gap-3 relative group">
                            
                            {/* Vertical Glowing Connector Line */}
                            {idx < PIPELINE_STEPS[activeSol].length - 1 && (
                              <div className={`absolute left-4 top-8 bottom-[-18px] w-[2px] z-0 transition-colors duration-300 ${
                                isCompleted ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]' :
                                isActive ? 'bg-gradient-to-b from-cyanAccent to-white/10 shadow-[0_0_8px_rgba(0,240,255,0.4)]' :
                                'bg-white/10'
                              }`} />
                            )}

                            {/* Node Status Indicator Circle */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border z-10 transition-all duration-300 relative ${
                              isCompleted 
                                ? 'bg-emerald-400/10 border-emerald-400 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]'
                                : isActive
                                ? 'bg-cyanAccent/20 border-cyanAccent text-cyanAccent shadow-[0_0_16px_rgba(0,240,255,0.4)] animate-pulse'
                                : 'bg-[#08090C] border-white/10 text-textMuted'
                            }`}>
                              {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.icon}
                              
                              {/* Spinning indicator ring for active node */}
                              {isActive && (
                                <div className="absolute inset-[-2px] border border-cyanAccent border-t-transparent rounded-full animate-spin" />
                              )}
                            </div>

                            {/* Node Info Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className={`text-xs font-bold transition-colors ${
                                  isCompleted ? 'text-white' : isActive ? 'text-cyanAccent' : 'text-textMuted'
                                }`}>
                                  {step.name}
                                </span>
                                <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded uppercase tracking-wider font-semibold border ${
                                  isCompleted ? 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20' :
                                  isActive ? 'bg-cyanAccent/10 text-cyanAccent border-cyanAccent/20' :
                                  'bg-white/5 text-textMuted border-white/5'
                                }`}>
                                  {isCompleted ? 'SUCCESS' : isActive ? 'RUNNING' : 'PENDING'}
                                </span>
                              </div>
                              <p className={`text-[10px] font-light mt-0.5 transition-colors leading-relaxed truncate ${
                                isCompleted ? 'text-textSecondary' : isActive ? 'text-white' : 'text-textMuted'
                              }`}>
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* CRT/Monaco Live Terminal Console */}
                  <div className="rounded-xl bg-[#08090C] border border-white/[0.08] overflow-hidden font-mono text-xs flex flex-col shadow-inner">
                    
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between px-3 py-1.5 bg-[#0D0F12] border-b border-white/[0.06] text-[10px] text-textMuted select-none">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-rose-500/70"></div>
                          <div className="w-2 h-2 rounded-full bg-amber-500/70"></div>
                          <div className="w-2 h-2 rounded-full bg-emerald-500/70"></div>
                        </div>
                        <span className="ml-1 text-textSecondary font-mono">frameforge_kernel_sim</span>
                      </div>

                      {simLogs.length > 0 && (
                        <button
                          onClick={handleCopyTerminalLogs}
                          className="flex items-center gap-1 text-[10px] text-textMuted hover:text-cyanAccent transition-colors cursor-pointer"
                        >
                          {copiedItem === 'terminal-logs' ? (
                            <Check size={10} className="text-emerald-400" />
                          ) : (
                            <Copy size={10} />
                          )}
                          <span>{copiedItem === 'terminal-logs' ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>

                    {/* Terminal Stream Body */}
                    <div 
                      ref={terminalContainerRef} 
                      className="p-3.5 h-[220px] overflow-y-auto space-y-1.5 text-[11px] leading-relaxed scrollbar-thin select-text bg-[#07080A]"
                    >
                      {simLogs.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center text-[11px] text-textMuted/60 italic select-none space-y-1">
                          <Terminal size={20} className="text-textMuted/40 mb-1" />
                          <span>Simulation pipeline idle.</span>
                          <span className="text-[10px]">Click &quot;Trigger Simulation Run&quot; to test.</span>
                        </div>
                      )}

                      {simLogs.map((log, index) => {
                        let colorClass = 'text-textSecondary';
                        if (log.includes('[system]')) colorClass = 'text-cyanAccent font-medium';
                        if (log.includes('[validation]') || log.includes('[rbac]')) colorClass = 'text-amber-400';
                        if (log.includes('[model]')) colorClass = 'text-purple-400';
                        if (log.includes('[OK]') || log.includes('[Valid]') || log.includes('[Ready]') || log.includes('[Completed]') || log.includes('[Synced') || log.includes('SUCCESS')) {
                          colorClass = 'text-emerald-400 font-medium';
                        }
                        return (
                          <div key={index} className={`whitespace-pre-wrap ${colorClass}`}>
                            {log}
                          </div>
                        );
                      })}
                      <div ref={logTerminalEndRef} />
                    </div>
                  </div>

                  {/* Simulator Controls */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: simState === 'running' ? 1 : 1.02 }}
                      whileTap={{ scale: simState === 'running' ? 1 : 0.98 }}
                      onClick={startSimulation}
                      disabled={simState === 'running'}
                      className={`flex-1 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md ${
                        simState === 'running'
                          ? 'bg-white/5 border border-white/10 text-textMuted cursor-not-allowed'
                          : 'bg-cyanAccent text-[#08090A] hover:bg-cyanAccent/90 hover:shadow-[0_0_24px_rgba(0,240,255,0.3)] font-semibold'
                      }`}
                    >
                      {simState === 'running' ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Simulating Pipeline...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>{simState === 'completed' ? 'Re-run Simulation' : 'Trigger Simulation Run'}</span>
                        </>
                      )}
                    </motion.button>

                    {simLogs.length > 0 && (
                      <button
                        onClick={() => {
                          clearSimulationTimeouts();
                          setSimState('idle');
                          setSimLogs([]);
                          setActiveNodeIndex(-1);
                        }}
                        className="px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-textSecondary hover:text-white text-xs font-mono cursor-pointer transition-colors"
                        title="Reset simulator"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                </div>
              </div>

            </motion.section>
          )}
        </AnimatePresence>

      </main>

      {/* Floating Back to Top & Reading Progress Pill */}
      <AnimatePresence>
        {readingProgress > 15 && (
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

      {/* FOOTER */}
      <footer className="relative bg-[#07080A] border-t border-white/[0.06] w-full py-8 z-20">
        <div className="px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs text-textSecondary">
              SYSTEM COMPONENT MAPPING ONLINE — ALL SERVICES HEALTHY
            </span>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono text-textMuted">
            <span>K8s Cluster v1.30</span>
            <span>•</span>
            <span>RabbitMQ v3.13</span>
            <span>•</span>
            <span>LangChain v0.3</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
