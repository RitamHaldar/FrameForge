import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  BrainCircuit,
  Activity,
  Zap,
  Terminal,
  Lock,
  ChevronRight,
  Check,
  FileText,
  ChevronDown,
  RefreshCw,
  Play,
  Layers,
  Sparkles,
} from 'lucide-react';
import CyberGridBackground from '../components/CyberGridBackground';

gsap.registerPlugin(ScrollTrigger);

const FEATURE_CARDS = [
  {
    icon: <BrainCircuit className="w-6 h-6 text-cyanAccent" />,
    title: "Neural Orchestration",
    description: "LLM-driven component synthesis that understands your design system tokens and architectural patterns instantly.",
    color: "from-cyanAccent/20 to-transparent",
    spotlight: "rgba(0, 240, 255, 0.14)",
    badge: "AST Semantics"
  },
  {
    icon: <Activity className="w-6 h-6 text-emerald-400" />,
    title: "Real-time Telemetry",
    description: "Deep-level engine metrics tracking render cycles, hydration speed, and memory pressure in a real-time stream.",
    color: "from-emerald-400/20 to-transparent",
    spotlight: "rgba(52, 211, 153, 0.14)",
    badge: "Sub-ms RTT"
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-400" />,
    title: "Zero-latency Deploys",
    description: "Instant global edge distribution using our proprietary protocol. See your changes live in under 200ms.",
    color: "from-amber-400/20 to-transparent",
    spotlight: "rgba(251, 191, 36, 0.14)",
    badge: "Edge KVM"
  }
];

const LOG_STEPS = [
  { text: "Initializing AI Sandbox Runtime...", duration: "11.3s" },
  { text: "Listing repository tree...", duration: "0.0s" },
  { text: "Tree scanned", badge: "20 files", duration: "0.6s" },
  { text: "Reading dependency graph...", duration: "0.0s" },
  { text: "Dependencies verified", badge: "4 manifests", duration: "85.7s" },
  { text: "Updating AST references", badge: "1 file", duration: "0.0s" },
  { text: "AST cache synced.", duration: "8.2s" },
  { text: "Hot-patching microVM nodes", badge: "2 files", duration: "0.0s" },
  { text: "Nodes reloaded successfully.", duration: "1.3s" },
  { text: "Inspecting changed modules...", duration: "0.0s" },
  {
    text: "Hot-reload active modules",
    badge: "3 files",
    duration: "9.0s",
    files: [
      "src/components/TicTacToe.jsx",
      "src/App.jsx",
      "src/index.css"
    ]
  }
];

// Reusable Spotlight Card Component with dynamic cursor tracking & illuminated border sheen
function SpotlightCard({ children, className = '', spotlightColor = 'rgba(0, 240, 255, 0.12)', ...props }) {
  const cardRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -999, y: -999, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1
    });
  };

  const handleMouseLeave = () => {
    setMousePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className={`relative overflow-hidden group ${className}`}
      {...props}
    >
      {/* Interactive Cursor Spotlight Sheen */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity: mousePos.opacity,
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, ${spotlightColor}, transparent 65%)`,
        }}
      />
      {/* Dynamic Cursor Border Glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-0"
        style={{
          opacity: mousePos.opacity,
          border: '1px solid rgba(0, 240, 255, 0.3)',
          maskImage: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, black 35%, transparent 100%)`,
          WebkitMaskImage: `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, black 35%, transparent 100%)`,
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </motion.div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // 1. Fast Preloader with smooth easing curve
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [preloadPercent, setPreloadPercent] = useState(0);

  // 2. Navigation & Smooth Scroll
  const [navCompacted, setNavCompacted] = useState(false);
  const [hoveredNav, setHoveredNav] = useState(null);
  const lenisRef = useRef(null);

  // 3. Telemetry & Interactive Jitter
  const [telemetry, setTelemetry] = useState({ cpu: 18, mem: 412, uptime: "04:21", ops: 142890 });
  const [isCreating, setIsCreating] = useState(false);

  // 4. Monaco Editor & Inline AI completion
  const [activeEditorTab, setActiveEditorTab] = useState('App.tsx');
  const [ghostAccepted, setGhostAccepted] = useState(false);
  const [justAccepted, setJustAccepted] = useState(false);

  // 5. IDE Terminal Simulation
  const [heroTerminalLines, setHeroTerminalLines] = useState([
    { type: 'cmd', text: '$ frameforge sandbox init --runtime node-20' },
    { type: 'info', text: 'Provisioning microVM sandbox container...' },
    { type: 'info', text: 'Allocating virtual namespaces & cgroups...' },
    { type: 'ok', text: 'Sync agent connected (127.0.0.1:9092)' },
    { type: 'ok', text: 'Hot-reloading active on http://localhost:3000' }
  ]);
  const [isRestartingTerminal, setIsRestartingTerminal] = useState(false);

  // 6. Large CLI Deploy Simulation
  const [deployLines, setDeployLines] = useState([
    { type: 'cmd', text: '$ frameforge deploy --environment production --auto-warm' },
    { type: 'info', text: '› Analyzing repository dependency tree (TypeScript 5.4, Vite, Dockerfile)...' },
    { type: 'info', text: '› Packaging layer tarballs: 24.1 MB (reused 18 cached layers)' },
    { type: 'info', text: '› Provisioning isolated Kubernetes micro-pod in cluster "us-east-prod-1"...' },
    { type: 'ok', text: '✓ MicroVM container spun up in 68ms' },
    { type: 'ok', text: '✓ Port 443 bound with Let\'s Encrypt automated TLS certificate' },
    { type: 'ok', text: '✓ Health checks passed: 3 of 3 replicas responding with HTTP 200' },
    { type: 'url', text: 'https://production-app.frameforge.cloud' }
  ]);
  const [isDeploying, setIsDeploying] = useState(false);

  const containerRef = useRef(null);
  const ideContainerRef = useRef(null);
  const ideSpecularRef = useRef(null);
  const ambientLightRef = useRef(null);
  const deployTerminalBodyRef = useRef(null);
  const mouseRef = useRef({ targetX: -999, targetY: -999, currentX: -999, currentY: -999 });

  // Disable browser automatic scroll jump fighting Lenis on reload
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Smooth Preloader progression with eased cubic interpolation
  useEffect(() => {
    const startTime = performance.now();
    const duration = 750;

    const updatePreload = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = Math.floor(eased * 100);
      setPreloadPercent(val);

      if (progress < 1) {
        requestAnimationFrame(updatePreload);
      } else {
        setPreloadPercent(100);
        setTimeout(() => setPreloaderDone(true), 120);
      }
    };

    const frameId = requestAnimationFrame(updatePreload);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Refresh ScrollTrigger and resize Lenis when preloader is done
  useEffect(() => {
    if (preloaderDone) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
        lenisRef.current?.resize();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [preloaderDone]);

  // Unified Lenis Smooth Scroll + GSAP ScrollTrigger + Liquid Cursor Lerp Loop
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      lerp: isReduced ? 1.0 : 0.085,
      duration: isReduced ? 0 : 1.1,
      smoothWheel: !isReduced,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.15,
      syncTouch: false,
      autoResize: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', (e) => {
      ScrollTrigger.update();
      setNavCompacted(e.scroll > 40);
    });

    const tickerUpdate = (time) => {
      lenis.raf(time * 1000);

      // Silky smooth lerp for ambient spotlight
      if (ambientLightRef.current && mouseRef.current.targetX !== -999) {
        if (mouseRef.current.currentX === -999) {
          mouseRef.current.currentX = mouseRef.current.targetX;
          mouseRef.current.currentY = mouseRef.current.targetY;
        } else {
          const dx = mouseRef.current.targetX - mouseRef.current.currentX;
          const dy = mouseRef.current.targetY - mouseRef.current.currentY;
          mouseRef.current.currentX += dx * 0.08;
          mouseRef.current.currentY += dy * 0.08;
        }
        ambientLightRef.current.style.transform = `translate3d(${mouseRef.current.currentX}px, ${mouseRef.current.currentY}px, 0)`;
      }
    };

    gsap.ticker.add(tickerUpdate);
    gsap.ticker.lagSmoothing(0);

    // Scroll-triggered 3D perspective tilt on centerpiece Hero IDE with smooth scrub inertia
    if (ideContainerRef.current && !isReduced) {
      gsap.fromTo(
        ideContainerRef.current,
        { rotateX: 7, scale: 0.93, opacity: 0.8 },
        {
          rotateX: 0,
          scale: 1,
          opacity: 1,
          ease: 'power1.out',
          scrollTrigger: {
            trigger: ideContainerRef.current,
            start: 'top 85%',
            end: 'top 32%',
            scrub: 1.2, // Momentum damping prevents harsh 1:1 scroll lock
            fastScrollEnd: true,
          }
        }
      );
    }

    const onWindowResize = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onWindowResize, { passive: true });

    return () => {
      window.removeEventListener('resize', onWindowResize);
      gsap.ticker.remove(tickerUpdate);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // Liquid Mouse Tracking Event Listener
  useEffect(() => {
    const onMouseMove = (e) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Keyboard shortcut listener for Tab key to accept AI Ghost completion
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Tab' && !ghostAccepted) {
        const ide = ideContainerRef.current;
        if (ide && ide.matches(':hover')) {
          e.preventDefault();
          handleAcceptGhost();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [ghostAccepted]);

  const handleAcceptGhost = () => {
    if (ghostAccepted) return;
    setGhostAccepted(true);
    setJustAccepted(true);
    setTimeout(() => setJustAccepted(false), 2000);
  };

  // Interactive 3D tilt on Hero IDE showcase
  const handleIdeMouseMove = (e) => {
    if (!ideContainerRef.current) return;
    const rect = ideContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 4.5;

    gsap.to(ideContainerRef.current, {
      rotateX,
      rotateY,
      duration: 0.45,
      ease: 'power2.out',
      transformPerspective: 1200,
      overwrite: 'auto'
    });

    if (ideSpecularRef.current) {
      ideSpecularRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, rgba(255, 255, 255, 0.06), transparent 60%)`;
      ideSpecularRef.current.style.opacity = '1';
    }
  };

  const handleIdeMouseLeave = () => {
    if (!ideContainerRef.current) return;
    gsap.to(ideContainerRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.75,
      ease: 'elastic.out(1, 0.65)',
      overwrite: 'auto'
    });

    if (ideSpecularRef.current) {
      ideSpecularRef.current.style.opacity = '0';
    }
  };

  // Real-time telemetry jitter simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTelemetry(prev => ({
        cpu: Math.floor(Math.random() * 8) + 14,
        mem: Math.floor(Math.random() * 12) + 406,
        uptime: "04:21",
        ops: prev.ops + Math.floor(Math.random() * 18) + 4
      }));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleCreateSandbox = () => {
    setIsCreating(true);
    setTimeout(() => {
      if (!user) {
        navigate('/auth');
      } else {
        navigate('/projects');
      }
      setIsCreating(false);
    }, 400);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -80, duration: 1.0 });
    }
  };

  // Rerun Hero Terminal simulation with staggered line entrances
  const restartTerminalLog = () => {
    if (isRestartingTerminal) return;
    setIsRestartingTerminal(true);
    setHeroTerminalLines([{ type: 'cmd', text: '$ frameforge sandbox init --runtime node-20' }]);

    const sequence = [
      { type: 'info', text: 'Provisioning microVM sandbox container...' },
      { type: 'info', text: 'Allocating virtual namespaces & cgroups...' },
      { type: 'ok', text: 'Sync agent connected (127.0.0.1:9092)' },
      { type: 'ok', text: 'Hot-reloading active on http://localhost:3000' }
    ];

    sequence.forEach((step, idx) => {
      setTimeout(() => {
        setHeroTerminalLines(prev => [...prev, step]);
        if (idx === sequence.length - 1) {
          setIsRestartingTerminal(false);
        }
      }, (idx + 1) * 320);
    });
  };

  // Replay Production Deployment simulation with smooth terminal line streaming
  const simulateFullDeploy = () => {
    if (isDeploying) return;
    setIsDeploying(true);
    setDeployLines([{ type: 'cmd', text: '$ frameforge deploy --environment production --auto-warm' }]);

    const steps = [
      { type: 'info', text: '› Compiling TypeScript AST across 14 modules...' },
      { type: 'info', text: '› Packaging layer tarballs: 24.1 MB (reused 18 cached layers)' },
      { type: 'info', text: '› Provisioning isolated Kubernetes micro-pod in cluster "us-east-prod-1"...' },
      { type: 'ok', text: '✓ MicroVM container spun up in 68ms' },
      { type: 'ok', text: '✓ Port 443 bound with Let\'s Encrypt automated TLS certificate' },
      { type: 'ok', text: '✓ Health checks passed: 3 of 3 replicas responding with HTTP 200' },
      { type: 'url', text: 'https://production-app.frameforge.cloud' }
    ];

    steps.forEach((s, i) => {
      setTimeout(() => {
        setDeployLines(prev => [...prev, s]);
        if (deployTerminalBodyRef.current) {
          deployTerminalBodyRef.current.scrollTo({
            top: deployTerminalBodyRef.current.scrollHeight,
            behavior: 'smooth'
          });
        }
        if (i === steps.length - 1) {
          setIsDeploying(false);
        }
      }, (i + 1) * 350);
    });
  };

  // Framer Motion Hero Stagger Variants
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.08,
      }
    }
  };

  const heroItemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.72,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  const heroBadgeVariants = {
    hidden: { opacity: 0, scale: 0.88, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 420,
        damping: 24
      }
    }
  };

  return (
    <div ref={containerRef} className="bg-obsidian text-textPrimary antialiased selection:bg-cyanAccent/20 selection:text-white relative overflow-x-hidden font-sans min-h-screen">

      {/* ULTRA-FAST & SMOOTH PRELOADER */}
      <AnimatePresence>
        {!preloaderDone && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }}
            className="fixed inset-0 z-50 bg-[#08090A] flex flex-col items-center justify-center pointer-events-auto"
          >
            <div className="w-full max-w-sm px-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-7 h-7 rounded bg-[#111418] border border-white/15 flex items-center justify-center relative overflow-hidden">
                  <div className="w-3.5 h-3.5 border border-cyanAccent/70 rotate-45 transition-transform duration-500"></div>
                  <div className="absolute inset-0 bg-cyanAccent/10"></div>
                </div>
                <span className="text-xs tracking-[0.25em] font-semibold text-white font-mono">FRAMEFORGE</span>
              </div>
              <div className="text-[11px] font-mono text-textSecondary flex items-center justify-between mb-2">
                <span>Initializing sandbox runtime...</span>
                <span className="text-cyanAccent font-semibold tabular-nums">{preloadPercent}%</span>
              </div>
              <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 via-cyanAccent to-sky-300"
                  style={{ width: `${preloadPercent}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
              <div className="grid grid-cols-4 gap-2 mt-4 text-[10px] font-mono text-textMuted">
                <span className="flex items-center gap-1"><span className="text-emerald-400">✓</span> Runtime</span>
                <span className="flex items-center gap-1"><span className="text-emerald-400">✓</span> Workspace</span>
                <span className="flex items-center gap-1"><span className="text-emerald-400">✓</span> Mistral AI</span>
                <span className="flex items-center gap-1"><span className="text-emerald-400">✓</span> Sandbox</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Ambient Spotlight Tracking Mouse with Liquid Lerp */}
      <div
        ref={ambientLightRef}
        className="fixed -top-[275px] -left-[275px] w-[550px] h-[550px] rounded-full pointer-events-none z-0 opacity-45 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, rgba(15, 23, 42, 0) 70%)',
          transform: 'translate3d(-999px, -999px, 0)'
        }}
      />

      {/* 3D WebGL Particle Constellation Canvas */}
      <CyberGridBackground />

      {/* Technical Grid & Ambient Dots Layers */}
      <div className="fixed inset-0 tech-grid pointer-events-none z-0 opacity-40"></div>
      <div className="fixed inset-0 tech-dots pointer-events-none z-0 opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_35%,#000_70%,transparent_100%)]"></div>

      {/* Horizon Volumetric Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-cyanAccent/5 via-sky-500/[0.015] to-transparent rounded-full blur-3xl pointer-events-none z-0"></div>

      {/* FLOATING NAVIGATION */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 pt-5 transition-all duration-200"
      >
        <div className="max-w-6xl mx-auto">
          <nav
            className={`relative flex items-center justify-between px-3.5 sm:px-5 rounded-full bg-[#0D0F11]/85 backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 ${
              navCompacted ? 'py-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.75)] border-white/[0.12]' : 'py-2.5'
            }`}
          >
            {/* Logo with micro-hover shine */}
            <div
              onClick={() => lenisRef.current?.scrollTo(0, { duration: 1.0 })}
              className="flex items-center space-x-2.5 group pl-1.5 cursor-pointer focus:outline-none select-none"
            >
              <div className="w-6 h-6 rounded bg-[#15181C] border border-white/15 flex items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:border-cyanAccent/40 group-hover:shadow-[0_0_12px_rgba(0,240,255,0.25)]">
                <svg className="w-3.5 h-3.5 text-cyanAccent transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.5 9.4 7.55 4.24a1.8 1.8 0 0 0-2.55 1.56v12.4a1.8 1.8 0 0 0 2.55 1.56L16.5 14.6a1.8 1.8 0 0 0 0-3.2Z"/>
                  <path d="M19 8v8"/>
                </svg>
              </div>
              <span className="text-sm font-semibold tracking-tight text-white group-hover:text-cyanAccent/90 transition-colors font-sans">FrameForge</span>
              <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-medium tracking-wider bg-white/5 border border-white/10 text-cyanAccent/90 group-hover:border-cyanAccent/30 transition-colors">v2.4</span>
            </div>

            {/* Sliding Pill Indicator Nav Items */}
            <div className="hidden md:flex items-center relative" onMouseLeave={() => setHoveredNav(null)}>
              {[
                { label: 'Product', id: 'product' },
                { label: 'Architecture', id: 'architecture' },
                { label: 'Sandboxes', id: 'sandbox' },
                { label: 'Terminal', id: 'terminal' },
                { label: 'Solutions', onClick: () => navigate('/solutions') },
                { label: 'Docs', onClick: () => navigate('/docs') }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => item.id ? scrollToSection(item.id) : item.onClick?.()}
                  onMouseEnter={() => setHoveredNav(item.label)}
                  className="relative text-xs font-medium text-textSecondary hover:text-white px-3.5 py-1.5 rounded-full transition-colors z-10 cursor-pointer"
                >
                  {hoveredNav === item.label && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/[0.09] shadow-[0_0_15px_rgba(255,255,255,0.05)] -z-10"
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                  {item.label}
                </button>
              ))}
            </div>

            {/* Action CTAs */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={handleCreateSandbox}
                className="text-xs font-medium text-textSecondary hover:text-white px-2.5 py-1.5 transition-colors cursor-pointer"
              >
                {user ? 'My Projects' : 'Sign In'}
              </button>

              <motion.button
                onClick={handleCreateSandbox}
                disabled={isCreating}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="btn-shimmer group relative inline-flex items-center justify-center px-4 py-1.5 text-xs font-medium rounded-full bg-white text-black hover:bg-neutral-100 transition-all duration-150 shadow-[0_0_20px_rgba(255,255,255,0.2)] cursor-pointer disabled:opacity-50"
              >
                <span>{isCreating ? 'Booting...' : (user ? 'Launch IDE' : 'Start Building')}</span>
                <ChevronRight className="w-3 h-3 ml-1 transition-transform duration-200 group-hover:translate-x-0.5" />
              </motion.button>
            </div>
          </nav>
        </div>
      </motion.header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 pt-28 sm:pt-36 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HERO SECTION WITH STAGGERED ENTRANCE CHOREOGRAPHY */}
        <motion.section
          variants={heroContainerVariants}
          initial="hidden"
          animate={preloaderDone ? "visible" : "hidden"}
          className="text-center relative max-w-4xl mx-auto pt-6 pb-12"
        >
          {/* Operational Status Badge */}
          <motion.div
            variants={heroBadgeVariants}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111418] border border-white/[0.08] mb-6 shadow-inner text-[11px] font-mono text-textSecondary hover:border-cyanAccent/30 hover:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all select-none"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="tracking-widest uppercase text-[10px] text-textMuted font-semibold">ALL SYSTEMS OPERATIONAL</span>
            <span className="text-white/20">|</span>
            <span className="text-cyanAccent/90 font-medium flex items-center gap-1">
              CLOUD RUNTIME V2.4
            </span>
          </motion.div>

          {/* Hero Heading */}
          <motion.h1
            variants={heroItemVariants}
            className="text-5xl sm:text-7xl lg:text-[84px] font-extrabold tracking-[-0.035em] leading-[1.03] text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-100 to-neutral-400 mb-6 max-w-4xl mx-auto select-none"
          >
            Build. Run. Ship.<br />
            <span className="text-textSecondary/90 font-light">Without the setup.</span>
          </motion.h1>

          {/* Narrow elegant copy */}
          <motion.p
            variants={heroItemVariants}
            className="text-base sm:text-lg text-textSecondary font-normal max-w-2xl mx-auto leading-relaxed mb-8"
          >
            An AI-powered cloud IDE with isolated micro-VM sandboxes, millisecond container boot times, and instant zero-latency collaborative previews.
          </motion.p>

          {/* Hero CTA Actions */}
          <motion.div
            variants={heroItemVariants}
            id="hero-cta"
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-14"
          >
            <motion.button
              onClick={handleCreateSandbox}
              disabled={isCreating}
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="btn-shimmer w-full sm:w-auto group relative inline-flex items-center justify-center px-6 py-3 rounded-full bg-gradient-to-b from-white via-neutral-100 to-neutral-200 text-black text-sm font-semibold shadow-[0_0_30px_rgba(0,240,255,0.18)] hover:shadow-[0_0_35px_rgba(0,240,255,0.35)] transition-all cursor-pointer"
            >
              <span>{isCreating ? 'Waking the Engine...' : 'Launch Cloud Workspace'}</span>
              <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1 text-black" />
            </motion.button>

            <motion.button
              onClick={() => scrollToSection('architecture')}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#111418] border border-white/[0.1] text-sm font-medium text-textSecondary hover:text-white hover:border-cyanAccent/30 hover:bg-[#161a20] transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]"
            >
              <Layers className="w-4 h-4 mr-2 text-cyanAccent/80" />
              Explore Architecture
            </motion.button>
          </motion.div>

          {/* Quick Metrics Strip */}
          <motion.div
            variants={heroItemVariants}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-[11px] font-mono text-textMuted select-none"
          >
            <div className="hover:text-textSecondary transition-colors"><span className="text-white font-medium">&lt; 85ms</span> sandbox spin-up</div>
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
            <div className="hover:text-textSecondary transition-colors"><span className="text-white font-medium">Monaco</span> engine</div>
            <div className="w-1 h-1 rounded-full bg-white/20"></div>
            <div className="hover:text-textSecondary transition-colors flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyanAccent" />
              <span className="text-cyanAccent font-medium">Mistral Large</span> AI copilot
            </div>
          </motion.div>
        </motion.section>

        {/* CENTERPIECE: FLOATING HERO IDE VISUAL WITH INTERACTIVE 3D TILT */}
        <section
          className="relative my-6 max-w-6xl mx-auto"
          id="ide-showcase"
          onMouseMove={handleIdeMouseMove}
          onMouseLeave={handleIdeMouseLeave}
        >
          {/* Glowing Atmospheric Underlay */}
          <div className="absolute -inset-1 bg-gradient-to-r from-cyanAccent/20 via-sky-500/10 to-indigo-500/20 rounded-2xl blur-xl opacity-45 pointer-events-none -z-10 transition-opacity duration-500"></div>

          {/* Main IDE Window Container */}
          <div
            ref={ideContainerRef}
            className="rounded-xl bg-[#0A0C0E] border border-white/[0.09] shadow-[0_30px_100px_rgba(0,0,0,0.85)] overflow-hidden transition-shadow duration-500 will-change-transform relative"
            style={{ perspective: 1200 }}
          >
            {/* Interactive Glass Specular Glare Sheen */}
            <div
              ref={ideSpecularRef}
              className="pointer-events-none absolute inset-0 rounded-xl z-30 opacity-0 transition-opacity duration-300"
              style={{ mixBlendMode: 'overlay' }}
            />

            {/* IDE Top Window Chrome */}
            <div className="h-10 px-4 bg-[#0D0F12] border-b border-white/[0.07] flex items-center justify-between select-none relative z-10">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80 hover:bg-rose-500 transition-colors"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80 hover:bg-amber-500 transition-colors"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-500 transition-colors"></div>
                </div>
                <div className="h-3 w-px bg-white/10"></div>
                <div className="flex items-center space-x-2 text-xs font-mono text-textSecondary">
                  <span className="text-white font-medium">frameforge-cloud</span>
                  <span className="text-textMuted">/</span>
                  <span className="flex items-center text-[11px] text-textMuted">
                    <Zap className="w-3 h-3 mr-1 text-cyanAccent" />
                    main
                  </span>
                </div>
              </div>

              {/* Sandbox Live Telemetry with micro-pulse */}
              <div className="flex items-center space-x-3 text-[11px] font-mono">
                <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded bg-[#111418] border border-white/[0.07] hover:border-cyanAccent/30 transition-colors">
                  <span className="flex h-1.5 w-1.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-emerald-400 font-medium">Sandbox Online</span>
                  <span className="text-textMuted">|</span>
                  <span className="text-textSecondary">us-east-1a</span>
                </div>

                <div className="hidden md:flex items-center space-x-3 text-textMuted tabular-nums">
                  <div>CPU <span className="text-textSecondary transition-colors">{telemetry.cpu}%</span></div>
                  <div>MEM <span className="text-textSecondary transition-colors">{telemetry.mem} MB</span></div>
                  <div>UPTIME <span className="text-textSecondary">{telemetry.uptime}</span></div>
                </div>
              </div>
            </div>

            {/* IDE Main Layout: File Explorer / Monaco Editor / Live Preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 min-h-[480px] text-xs font-mono relative z-10">
              
              {/* LEFT SIDEBAR: File Tree */}
              <div className="md:col-span-2 bg-[#090A0C] border-r border-white/[0.06] p-3 select-none flex flex-col justify-between">
                <div>
                  <div className="text-[10px] tracking-widest uppercase font-semibold text-textMuted mb-2 px-1 flex items-center justify-between">
                    <span>EXPLORER</span>
                    <span className="text-[9px] hover:text-white cursor-pointer transition-colors">+</span>
                  </div>
                  <div className="space-y-0.5 text-textSecondary text-[11px]">
                    <div className="flex items-center py-1 px-1.5 rounded hover:bg-white/[0.03] text-white cursor-pointer transition-colors">
                      <ChevronDown className="w-3.5 h-3.5 mr-1 text-textMuted" />
                      <span className="text-cyanAccent/80 font-medium">src</span>
                    </div>
                    <div className="pl-4 space-y-0.5">
                      <div className="flex items-center py-0.5 px-1.5 rounded hover:bg-white/[0.03] cursor-pointer text-textMuted hover:text-textSecondary transition-colors">
                        <ChevronRight className="w-3 h-3 mr-1 opacity-60" />
                        <span>components/</span>
                      </div>
                      <div className="flex items-center py-0.5 px-1.5 rounded hover:bg-white/[0.03] cursor-pointer text-textMuted hover:text-textSecondary transition-colors">
                        <ChevronRight className="w-3 h-3 mr-1 opacity-60" />
                        <span>services/</span>
                      </div>
                      <div
                        onClick={() => setActiveEditorTab('App.tsx')}
                        className={`flex items-center py-0.5 px-1.5 rounded cursor-pointer transition-all ${
                          activeEditorTab === 'App.tsx' ? 'bg-white/[0.08] text-cyanAccent font-medium shadow-sm' : 'text-textSecondary hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="w-3 text-[10px] text-cyanAccent mr-1.5">⚡</span>
                        <span>App.tsx</span>
                      </div>
                      <div
                        onClick={() => setActiveEditorTab('sandbox.ts')}
                        className={`flex items-center py-0.5 px-1.5 rounded cursor-pointer transition-all ${
                          activeEditorTab === 'sandbox.ts' ? 'bg-white/[0.08] text-cyanAccent font-medium shadow-sm' : 'text-textSecondary hover:bg-white/[0.03]'
                        }`}
                      >
                        <span className="w-3 text-[10px] text-blue-400 mr-1.5">◈</span>
                        <span>sandbox.ts</span>
                      </div>
                    </div>

                    <div className="pt-2 text-textMuted space-y-0.5">
                      <div className="flex items-center py-0.5 px-1.5 rounded hover:bg-white/[0.03] cursor-pointer transition-colors">
                        <span className="w-3 text-[10px] text-amber-400/80 mr-1.5">{}</span>
                        <span>package.json</span>
                      </div>
                      <div className="flex items-center py-0.5 px-1.5 rounded hover:bg-white/[0.03] cursor-pointer transition-colors">
                        <span className="w-3 text-[10px] text-sky-400/80 mr-1.5">⚙</span>
                        <span>forge.config.json</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Micro Pod Info */}
                <div className="border-t border-white/[0.06] pt-2 text-[10px] text-textMuted">
                  <div className="flex items-center justify-between mb-1">
                    <span>POD REPLICA</span>
                    <span className="text-white font-medium">1/1</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyanAccent/70 w-3/4 animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* CENTER: MONACO CODE EDITOR */}
              <div className="md:col-span-6 bg-[#08090B] flex flex-col justify-between border-r border-white/[0.06]">
                
                {/* Editor Tabs with Sliding Pill Glider */}
                <div className="h-8 bg-[#0B0D0F] border-b border-white/[0.06] flex items-center px-2 space-x-1 select-none">
                  <button
                    onClick={() => setActiveEditorTab('App.tsx')}
                    className={`relative flex items-center space-x-2 px-3.5 py-1 text-[11px] cursor-pointer transition-colors ${
                      activeEditorTab === 'App.tsx' ? 'text-white font-medium' : 'text-textMuted hover:text-white'
                    }`}
                  >
                    {activeEditorTab === 'App.tsx' && (
                      <motion.div
                        layoutId="activeEditorTabPill"
                        className="absolute inset-0 bg-[#08090B] border-t border-t-cyanAccent border-r border-l border-white/[0.06] -z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 text-cyanAccent text-[10px]">⚛</span>
                    <span className="relative z-10">App.tsx</span>
                  </button>
                  <button
                    onClick={() => setActiveEditorTab('sandbox.ts')}
                    className={`relative flex items-center space-x-2 px-3.5 py-1 text-[11px] cursor-pointer transition-colors ${
                      activeEditorTab === 'sandbox.ts' ? 'text-white font-medium' : 'text-textMuted hover:text-white'
                    }`}
                  >
                    {activeEditorTab === 'sandbox.ts' && (
                      <motion.div
                        layoutId="activeEditorTabPill"
                        className="absolute inset-0 bg-[#08090B] border-t border-t-cyanAccent border-r border-l border-white/[0.06] -z-0"
                        transition={{ type: "spring", stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10 text-blue-400 text-[10px]">◈</span>
                    <span className="relative z-10">sandbox.ts</span>
                  </button>

                  <div className="ml-auto flex items-center space-x-1.5 px-2 py-0.5 rounded bg-cyanAccent/10 border border-cyanAccent/20 text-[10px] text-cyanAccent">
                    <span className="animate-pulse">⌁</span>
                    <span>AI READY</span>
                  </div>
                </div>

                {/* Code Lines Container with smooth tab switching */}
                <AnimatePresence mode="wait">
                  {activeEditorTab === 'App.tsx' ? (
                    <motion.div
                      key="app-code"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.16 }}
                      className="p-3 text-[12px] font-mono leading-relaxed overflow-x-auto flex-1 select-text"
                      style={{ counterReset: 'editor-counter' }}
                    >
                      <div className="editor-line"><span className="text-purple-400">import</span> <span className="text-textPrimary">React, &#123; useState, useEffect &#125;</span> <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;react&apos;</span>;</div>
                      <div className="editor-line"><span className="text-purple-400">import</span> &#123; <span className="text-cyan-300">SandboxCluster</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;@frameforge/runtime&apos;</span>;</div>
                      <div className="editor-line"></div>
                      <div className="editor-line"><span className="text-purple-400">export default function</span> <span className="text-yellow-300">CloudWorkspace</span>() &#123;</div>
                      <div className="editor-line pl-4"><span className="text-purple-400">const</span> [<span className="text-textPrimary">status</span>, <span className="text-textPrimary">setStatus</span>] = <span className="text-yellow-300">useState</span>(<span className="text-emerald-300">&apos;initialized&apos;</span>);</div>
                      <div className="editor-line pl-4"></div>
                      <div className="editor-line pl-4"><span className="text-yellow-300">useEffect</span>(() =&gt; &#123;</div>
                      <div className="editor-line pl-8"><span className="text-purple-400">const</span> <span className="text-textPrimary">cluster</span> = <span className="text-purple-400">new</span> <span className="text-cyan-300">SandboxCluster</span>(&#123;</div>
                      <div className="editor-line pl-12"><span className="text-sky-300">region</span>: <span className="text-emerald-300">&apos;us-east-1&apos;</span>,</div>
                      <div className="editor-line pl-12"><span className="text-sky-300">microVM</span>: <span className="text-purple-400">true</span>,</div>
                      <div className="editor-line pl-12"><span className="text-sky-300">warmMemoryMB</span>: <span className="text-amber-300">512</span></div>
                      <div className="editor-line pl-8">&#125;);</div>
                      <div className="editor-line pl-4"></div>
                      
                      {/* AI Ghost Completion Segment with Tab Key Support & Celebratory Flash */}
                      <div
                        onClick={handleAcceptGhost}
                        className={`editor-line pl-8 rounded cursor-pointer group transition-all duration-300 relative ${
                          justAccepted ? 'accepted-highlight' : 'bg-cyanAccent/[0.04] hover:bg-cyanAccent/[0.08]'
                        }`}
                        title="Click or press Tab to accept"
                      >
                        <span className="text-purple-400">const</span>&nbsp;
                        <span className="text-textPrimary">workspace</span>&nbsp;=&nbsp;
                        <span className="text-purple-400">await</span>&nbsp;
                        cluster.<span className="text-yellow-300">create</span>(&#123;
                        {!ghostAccepted ? (
                          <>
                            <span className="cursor-caret"></span>
                            <span className="ghost-completion ml-1">projectId: &quot;forge-89&quot;, runtime: &quot;node-20&quot; &#125;);</span>
                            <motion.span
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-cyanAccent/20 text-cyanAccent font-mono border border-cyanAccent/30 shadow-[0_0_10px_rgba(0,240,255,0.2)] inline-flex items-center gap-1"
                            >
                              <span>Tab ⇥</span>
                            </motion.span>
                          </>
                        ) : (
                          <>
                            <span className="text-emerald-300 ml-1">projectId: &quot;forge-89&quot;, runtime: &quot;node-20&quot; &#125;);</span>
                            {justAccepted && (
                              <motion.span
                                initial={{ opacity: 0, scale: 0.8, x: 4 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0 }}
                                className="ml-2 text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 inline-flex items-center gap-1 font-mono"
                              >
                                <Check className="w-2.5 h-2.5 stroke-[3]" /> Accepted
                              </motion.span>
                            )}
                          </>
                        )}
                      </div>
                      <div className="editor-line pl-8"><span className="text-textPrimary">setStatus</span>(<span className="text-emerald-300">&apos;container_synced&apos;</span>);</div>
                      <div className="editor-line pl-4">&#125;, []);</div>
                      <div className="editor-line pl-4"></div>
                      <div className="editor-line pl-4"><span className="text-purple-400">return</span> &lt;<span className="text-cyan-300">AppSandboxStage</span> <span className="text-sky-300">active</span>=&#123;status === <span className="text-emerald-300">&apos;container_synced&apos;</span>&#125; /&gt;;</div>
                      <div className="editor-line">&#125;</div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="sandbox-code"
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.16 }}
                      className="p-3 text-[12px] font-mono leading-relaxed overflow-x-auto flex-1 select-text"
                      style={{ counterReset: 'editor-counter' }}
                    >
                      <div className="editor-line"><span className="text-purple-400">import</span> &#123; <span className="text-cyan-300">VMSandbox</span>, <span className="text-cyan-300">KVMConfig</span> &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">&apos;@frameforge/engine&apos;</span>;</div>
                      <div className="editor-line"></div>
                      <div className="editor-line"><span className="text-purple-400">export async function</span> <span className="text-yellow-300">provisionNode</span>(<span className="text-sky-300">podId</span>: <span className="text-cyan-300">string</span>) &#123;</div>
                      <div className="editor-line pl-4"><span className="text-purple-400">const</span> <span className="text-textPrimary">vm</span> = <span className="text-purple-400">await</span> <span className="text-cyan-300">VMSandbox</span>.<span className="text-yellow-300">allocate</span>(&#123;</div>
                      <div className="editor-line pl-8"><span className="text-sky-300">cgroups</span>: <span className="text-emerald-300">&apos;strict&apos;</span>,</div>
                      <div className="editor-line pl-8"><span className="text-sky-300">memoryLimit</span>: <span className="text-amber-300">512</span>,</div>
                      <div className="editor-line pl-8"><span className="text-sky-300">kernelBridge</span>: <span className="text-emerald-300">&apos;webrtc-p2p&apos;</span></div>
                      <div className="editor-line pl-4">&#125;);</div>
                      <div className="editor-line pl-4"></div>
                      <div className="editor-line pl-4"><span className="text-purple-400">return</span> <span className="text-textPrimary">vm</span>.<span className="text-yellow-300">connect</span>();</div>
                      <div className="editor-line">&#125;</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Inline Terminal Drawer with animated line entrances */}
                <div className="border-t border-white/[0.08] bg-[#07080A]">
                  <div className="h-6 px-3 bg-[#0B0D0F] border-b border-white/[0.06] flex items-center justify-between text-[10px] text-textMuted select-none">
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> TERMINAL: bash
                      </span>
                      <span>PORTS: 3000 (Open)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        onClick={restartTerminalLog}
                        whileTap={{ scale: 0.92 }}
                        className="text-cyanAccent cursor-pointer hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className={`w-2.5 h-2.5 transition-transform ${isRestartingTerminal ? 'animate-spin' : ''}`} />
                        <span>Rerun</span>
                      </motion.button>
                      <span className="text-textMuted">|</span>
                      <span className="text-textSecondary">100% Synced</span>
                    </div>
                  </div>
                  <div className="p-3 text-[11px] font-mono leading-tight space-y-1">
                    <AnimatePresence>
                      {heroTerminalLines.map((line, idx) => (
                        <motion.div
                          key={`${idx}-${line.text}`}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2 }}
                          className={
                            line.type === 'cmd' ? 'text-textMuted' :
                            line.type === 'ok' ? 'text-emerald-400 flex items-center gap-1.5' :
                            'text-textSecondary flex items-center gap-1.5'
                          }
                        >
                          {line.type === 'ok' && <span>✓</span>}
                          {line.type === 'info' && <span className="text-cyanAccent">›</span>}
                          <span>{line.text}</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div className="flex items-center text-textMuted text-[11px] pt-0.5">
                      <span className="text-cyanAccent mr-1">›</span>
                      <span className="cursor-caret inline-block"></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: LIVE PREVIEW BROWSER */}
              <div className="md:col-span-4 bg-[#090A0D] flex flex-col">
                <div className="h-8 bg-[#0B0D0F] border-b border-white/[0.06] flex items-center px-3 justify-between select-none">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                    <div className="w-2 h-2 rounded-full bg-white/20"></div>
                  </div>
                  <div className="h-5 px-3 rounded-full bg-[#13161A] border border-white/[0.08] text-[10px] text-textMuted flex items-center justify-between w-48 font-mono truncate hover:border-cyanAccent/30 transition-colors">
                    <span className="flex items-center text-textSecondary truncate">
                      <Lock className="w-2.5 h-2.5 text-emerald-400 mr-1" /> https://forge-89.preview.app
                    </span>
                    <span className="text-cyanAccent text-[9px]">3000</span>
                  </div>
                  <div className="text-[10px] text-textMuted cursor-pointer hover:text-white transition-colors">↗</div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#090A0D] to-[#0D0F13]">
                  <div className="p-3 rounded-lg border border-white/[0.08] bg-[#101317]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full bg-cyanAccent animate-pulse"></div>
                        <span className="text-[11px] font-semibold text-white">Preview Canvas</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">LIVE HOT-RELOAD</span>
                    </div>

                    <div className="bg-[#08090A] p-3 rounded border border-white/[0.06] space-y-2">
                      <div className="text-[10px] text-textMuted font-mono">FRAMEFORGE CLUSTER STATE</div>
                      <div className="text-xl font-bold text-white tracking-tight flex items-baseline justify-between font-mono">
                        <span className="tabular-nums">{telemetry.ops.toLocaleString()}</span>
                        <span className="text-[10px] font-mono text-emerald-400 font-normal">+18.4% ops</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex">
                        <div className="bg-cyanAccent h-full w-2/3 transition-all duration-300"></div>
                        <div className="bg-sky-600 h-full w-1/4"></div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-[10px] text-textMuted">
                    <div className="flex items-center space-x-2">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyanAccent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyanAccent"></span>
                      </span>
                      <span>WebRTC DataChannel</span>
                    </div>
                    <span className="font-mono text-white">2.4ms RTT</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* TRUST / TECH INFRASTRUCTURE STRIP */}
        <section className="py-14 text-center border-b border-white/[0.06]">
          <p className="text-[11px] font-mono tracking-[0.2em] uppercase text-textMuted mb-8 select-none">
            ENGINEERED ON PROVEN CLOUD & VIRTUALIZATION PRIMITIVES
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 text-textSecondary opacity-75">
            {[
              { icon: '⚛', name: 'React 19', color: 'text-cyanAccent' },
              { icon: '⬢', name: 'Node.js v20', color: 'text-emerald-400' },
              { icon: '🐳', name: 'Docker MicroVM', color: 'text-blue-400' },
              { icon: '☸', name: 'Kubernetes', color: 'text-indigo-400' },
              { icon: '❖', name: 'Redis Streams', color: 'text-red-400' },
              { icon: '⚡', name: 'Mistral AI', color: 'text-amber-400' },
              { icon: '☁', name: 'AWS Firecracker', color: 'text-orange-400' },
            ].map((tech) => (
              <motion.div
                key={tech.name}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="flex items-center space-x-2 text-xs font-mono group hover:text-white transition-colors cursor-default select-none"
              >
                <span className={`${tech.color} font-bold group-hover:scale-110 transition-transform`}>{tech.icon}</span>
                <span>{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* PRODUCT CAPABILITIES: 3 ASYMMETRIC PANELS WITH SPOTLIGHT HOVER */}
        <section id="product" className="py-20 sm:py-28">
          <div className="max-w-3xl mb-16">
            <div className="text-[11px] font-mono tracking-widest text-cyanAccent uppercase mb-2">Capabilities</div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              Everything you need to build.
            </h2>
            <p className="text-textSecondary text-base sm:text-lg">
              Zero context switching. Instant compute instances orchestrated per session with sub-millisecond file streaming.
            </p>
          </div>

          <div className="space-y-12">
            
            {/* PANEL 01: AI-Powered Development */}
            <SpotlightCard className="obsidian-card rounded-2xl p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-cyanAccent px-2 py-0.5 rounded bg-cyanAccent/10 border border-cyanAccent/20">01</span>
                    <span className="text-xs font-mono text-textMuted uppercase tracking-wider">INTELLIGENCE</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    AI-Powered Development with Full AST Awareness
                  </h3>
                  <p className="text-sm text-textSecondary leading-relaxed">
                    Not just next-token prediction. FrameForge injects the entire sandbox state, dependency graph, and runtime console errors directly into our low-latency inference engine.
                  </p>
                  
                  <ul className="space-y-2 pt-2 text-xs font-mono text-textMuted">
                    <li className="flex items-center text-textSecondary"><span className="text-cyanAccent mr-2">›</span> Whole-repository AST semantic indexing</li>
                    <li className="flex items-center text-textSecondary"><span className="text-cyanAccent mr-2">›</span> Automatic self-repairing runtime exceptions</li>
                    <li className="flex items-center text-textSecondary"><span className="text-cyanAccent mr-2">›</span> Zero data retention on training models</li>
                  </ul>
                </div>

                {/* Monaco AI Copilot snippet */}
                <div className="lg:col-span-7 bg-[#07080A] rounded-xl border border-white/[0.08] p-4 text-xs font-mono">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3 text-[11px] text-textMuted">
                    <span>copilot-runtime.ts</span>
                    <span className="text-cyanAccent flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyanAccent animate-pulse"></span>
                      Inference latency: 12ms
                    </span>
                  </div>
                  <div className="space-y-1 text-[12px] leading-relaxed">
                    <div><span className="text-purple-400">async function</span> <span className="text-yellow-300">optimizeContainerPipeline</span>(<span className="text-sky-300">podId</span>: <span className="text-cyan-300">string</span>) &#123;</div>
                    <div className="pl-4 text-textMuted">// AI generated zero-overhead snapshot routine</div>
                    <div className="pl-4"><span className="text-purple-400">const</span> <span className="text-textPrimary">snapshot</span> = <span className="text-purple-400">await</span> sandbox.<span className="text-yellow-300">freezeMemoryState</span>();</div>
                    <div className="pl-4 p-2.5 rounded bg-cyanAccent/[0.04] border border-cyanAccent/20 my-1">
                      <div className="text-[10px] text-cyanAccent mb-1 font-semibold flex items-center gap-1">
                        <span>✨ SUGGESTED COMPLETION</span>
                        <span className="text-textMuted font-normal">[Tab to accept]</span>
                      </div>
                      <span className="text-textSecondary">return snapshot.replicateToEdge(&#123;</span><br />
                      <span className="text-textMuted pl-4">regions: [&apos;iad1&apos;, &apos;fra1&apos;, &apos;hnd1&apos;],</span><br />
                      <span className="text-textMuted pl-4">eagerMount: true</span><br />
                      <span className="text-textSecondary">&#125;);</span>
                    </div>
                    <div>&#125;</div>
                  </div>
                </div>

              </div>
            </SpotlightCard>

            {/* PANEL 02: KUBERNETES SANDBOX TOPOLOGY VISUALIZATION WITH LIVE FLOW STREAM */}
            <SpotlightCard id="sandbox" className="obsidian-card rounded-2xl p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-5 space-y-4 order-last lg:order-first">
                  <div className="bg-[#07080A] rounded-xl border border-white/[0.08] p-5 text-xs font-mono relative overflow-hidden">
                    <div className="text-[10px] font-mono text-textMuted uppercase mb-4 flex items-center justify-between">
                      <span>SANDBOX TOPOLOGY MESH</span>
                      <span className="text-emerald-400">● 100% HEALTHY</span>
                    </div>

                    {/* Topology Flow with Animated Data Streams */}
                    <div className="relative py-2 flex flex-col items-center">
                      <div className="px-3.5 py-1.5 rounded bg-[#15191E] border border-cyanAccent/40 text-cyanAccent text-[11px] font-semibold flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.15)] relative">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyanAccent"></span>
                        FRAMEFORGE CLUSTER
                      </div>

                      {/* Vertical Stream Pipe 1 */}
                      <div className="w-px h-7 bg-gradient-to-b from-cyanAccent/40 to-white/20 relative overflow-hidden">
                        <div className="w-1.5 h-3 bg-cyanAccent rounded-full -left-[2px] absolute shadow-[0_0_8px_#00f0ff] packet-stream-v"></div>
                      </div>

                      <div className="px-3 py-1 rounded bg-[#101317] border border-white/20 text-white text-[10px] relative">
                        SANDBOX CONTROLLER
                      </div>

                      {/* Horizontal Distribution Pipe */}
                      <div className="w-4/5 h-px bg-white/15 my-3 relative overflow-hidden">
                        <div className="w-6 h-1 bg-cyanAccent rounded-full -top-[1.5px] absolute shadow-[0_0_8px_#00f0ff] packet-stream-h"></div>
                      </div>

                      {/* 3 Worker Nodes with interactive hover highlights */}
                      <div className="grid grid-cols-3 gap-2 sm:gap-4 w-full text-center">
                        <div className="p-2 rounded bg-[#0D0F12] border border-white/[0.08] hover:border-cyanAccent/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all cursor-default">
                          <div className="text-[9px] text-textMuted">NODE 01</div>
                          <div className="text-[10px] text-white font-medium">TEMPLATE</div>
                          <div className="text-[9px] text-emerald-400 mt-1">Ready</div>
                        </div>

                        <div className="p-2 rounded bg-[#0D0F12] border border-white/[0.08] hover:border-cyanAccent/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all cursor-default">
                          <div className="text-[9px] text-textMuted">NODE 02</div>
                          <div className="text-[10px] text-white font-medium">AGENT SYNC</div>
                          <div className="text-[9px] text-cyanAccent mt-1">4.2ms</div>
                        </div>

                        <div className="p-2 rounded bg-[#0D0F12] border border-white/[0.08] hover:border-cyanAccent/50 hover:shadow-[0_0_15px_rgba(0,240,255,0.15)] transition-all cursor-default">
                          <div className="text-[9px] text-textMuted">NODE 03</div>
                          <div className="text-[10px] text-white font-medium">PREVIEW BUS</div>
                          <div className="text-[9px] text-emerald-400 mt-1">HTTP/3</div>
                        </div>
                      </div>

                      {/* Vertical Stream Pipe 2 */}
                      <div className="w-px h-6 bg-white/15 my-2 relative overflow-hidden">
                        <div className="w-1.5 h-3 bg-emerald-400 rounded-full -left-[2px] absolute shadow-[0_0_8px_#34d399] packet-stream-v"></div>
                      </div>

                      <div className="px-3 py-1 rounded bg-[#15191E] border border-emerald-500/40 text-emerald-300 text-[10px] font-mono flex items-center gap-1.5 shadow-[0_0_12px_rgba(52,211,153,0.15)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                        INSTANT PREVIEW DISPATCH
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-textMuted">
                      <span>CGROUP ISOLATION: STRICT</span>
                      <span className="text-white">vCPU: 4 Core / 8GB</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-cyanAccent px-2 py-0.5 rounded bg-cyanAccent/10 border border-cyanAccent/20">02</span>
                    <span className="text-xs font-mono text-textMuted uppercase tracking-wider">ISOLATION</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Isolated Sandboxes with Sub-Second Ephemeral Compute
                  </h3>
                  <p className="text-sm text-textSecondary leading-relaxed">
                    Every developer session boots into a hardened microVM isolated by Linux KVM. No shared filesystems. No dirty build state. Spin up 10 independent feature branches in seconds without bogging down your machine.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-3 text-xs font-mono">
                    <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors">
                      <div className="text-textMuted text-[10px]">COLD BOOT TIME</div>
                      <div className="text-lg font-bold text-white mt-0.5">&lt; 85 milliseconds</div>
                    </div>
                    <div className="p-3 rounded bg-white/[0.02] border border-white/[0.06] hover:border-white/15 transition-colors">
                      <div className="text-textMuted text-[10px]">SECURITY LEVEL</div>
                      <div className="text-lg font-bold text-emerald-400 mt-0.5">Firecracker KVM</div>
                    </div>
                  </div>
                </div>

              </div>
            </SpotlightCard>

            {/* PANEL 03: Real-Time Multiplayer & Tunnel Routing */}
            <SpotlightCard className="obsidian-card rounded-2xl p-6 sm:p-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono text-cyanAccent px-2 py-0.5 rounded bg-cyanAccent/10 border border-cyanAccent/20">03</span>
                    <span className="text-xs font-mono text-textMuted uppercase tracking-wider">COLLABORATION</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Bidirectional Multiplayer Terminals & Edge Ports
                  </h3>
                  <p className="text-sm text-textSecondary leading-relaxed">
                    Expose internal microservices with instant public tunnel URLs. Share your terminal with teammates in real-time with granular write/read permissions.
                  </p>
                  
                  <div className="space-y-2 pt-2 text-xs font-mono text-textMuted">
                    <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.06] hover:border-emerald-500/30 transition-colors">
                      <span className="text-textSecondary">Port 3000 (Vite)</span>
                      <span className="text-emerald-400">Public SSL Active</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-white/[0.02] border border-white/[0.06]">
                      <span className="text-textSecondary">Port 5432 (Postgres)</span>
                      <span className="text-textMuted">Localhost Bound</span>
                    </div>
                  </div>
                </div>

                {/* Tunnel Routing Table */}
                <div className="lg:col-span-7 bg-[#07080A] rounded-xl border border-white/[0.08] p-5 text-xs font-mono">
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3 text-[11px] text-textMuted">
                    <span>TUNNEL ROUTING TABLE</span>
                    <span className="text-emerald-400">● 4 EDGES LIVE</span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-2.5 rounded bg-[#0D0F12] border border-white/[0.06] flex items-center justify-between hover:border-cyanAccent/40 transition-colors">
                      <div>
                        <span className="text-white font-medium">us-east.forge.dev</span>
                        <div className="text-[10px] text-textMuted">Routed to MicroVM #991 • 1.2ms</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">200 OK</span>
                    </div>
                    <div className="p-2.5 rounded bg-[#0D0F12] border border-white/[0.06] flex items-center justify-between hover:border-cyanAccent/40 transition-colors">
                      <div>
                        <span className="text-white font-medium">eu-central.forge.dev</span>
                        <div className="text-[10px] text-textMuted">Routed to Frankfurt replica • 8.4ms</div>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">200 OK</span>
                    </div>
                  </div>
                </div>

              </div>
            </SpotlightCard>

          </div>
        </section>

        {/* HIGH-CONVERTING FEATURE CARDS WITH SPOTLIGHT & HOVER ELEVATION */}
        <section className="py-20 border-t border-white/[0.06]">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl text-white font-bold mb-4 tracking-tight">
              Designed for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyanAccent via-sky-300 to-white">Elite.</span>
            </h2>
            <p className="text-textSecondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Every pixel, every millisecond, engineered for architects who demand absolute perfection and raw power.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURE_CARDS.map((feature, idx) => (
              <SpotlightCard
                key={idx}
                spotlightColor={feature.spotlight}
                className="p-8 rounded-2xl bg-[#0D0F11] border border-white/[0.07] hover:border-white/[0.18] transition-colors shadow-lg hover:shadow-[0_16px_36px_-12px_rgba(0,0,0,0.7)]"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-15 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.04] border border-white/10 group-hover:scale-105 group-hover:border-cyanAccent/30 transition-all duration-300">
                      {feature.icon}
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-textMuted border border-white/10 group-hover:border-white/20 transition-colors">{feature.badge}</span>
                  </div>
                  <h3 className="text-xl text-white mb-2 font-semibold tracking-tight group-hover:text-cyanAccent transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-textSecondary text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* LARGE PRODUCTION TERMINAL SECTION */}
        <section id="terminal" className="py-20 sm:py-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-[11px] font-mono tracking-widest text-cyanAccent uppercase mb-2">DEVELOPER CLI & RUNTIME</div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
              Deploy from your terminal in one command.
            </h2>
            <p className="text-textSecondary text-sm sm:text-base">
              Prefer your local terminal or NeoVim? Connect FrameForge CLI straight into cloud compute without opening a browser.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
            
            {/* Left: Interactive Bash Deployment Terminal */}
            <div className="lg:col-span-7 rounded-xl bg-[#08090C] border border-white/[0.09] shadow-2xl overflow-hidden font-mono text-xs">
              <div className="h-9 px-4 bg-[#0E1013] border-b border-white/[0.08] flex items-center justify-between select-none">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                  <span className="text-textMuted text-[11px] ml-2">bash — frameforge deploy --prod</span>
                </div>
                <div className="text-[10px] text-textMuted flex items-center gap-2">
                  <motion.button
                    onClick={simulateFullDeploy}
                    disabled={isDeploying}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.92 }}
                    className="text-cyanAccent cursor-pointer hover:underline flex items-center gap-1 font-mono"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>{isDeploying ? 'Deploying...' : 'Replay Deploy'}</span>
                  </motion.button>
                </div>
              </div>
              <div
                ref={deployTerminalBodyRef}
                className="p-5 space-y-1.5 leading-relaxed min-h-[260px] max-h-[360px] overflow-y-auto text-[12px] bg-[#07080A]"
              >
                <AnimatePresence>
                  {deployLines.map((line, i) => (
                    <motion.div
                      key={`${i}-${line.text}`}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={
                        line.type === 'cmd' ? 'text-textMuted' :
                        line.type === 'ok' ? 'text-emerald-400' :
                        line.type === 'url' ? 'pt-2 text-white font-medium' :
                        'text-textSecondary'
                      }
                    >
                      {line.type === 'url' ? (
                        <span>
                          🚀 Production URL: <a href="#url" onClick={(e) => { e.preventDefault(); handleCreateSandbox(); }} className="text-cyanAccent underline decoration-cyanAccent/40 hover:decoration-cyanAccent transition-colors">{line.text}</a>
                        </span>
                      ) : (
                        line.text
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="h-9 px-4 bg-[#0B0D10] border-t border-white/[0.07] flex items-center justify-between text-[11px] text-textMuted select-none">
                <div className="flex items-center space-x-4 tabular-nums">
                  <span>CPU <span className="text-white">{telemetry.cpu}%</span></span>
                  <span>MEM <span className="text-white">{telemetry.mem} MB</span></span>
                  <span>NETWORK <span className="text-white">1.2 MB/s</span></span>
                </div>
                <div className="flex items-center space-x-2 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>AGENT RUNNING</span>
                </div>
              </div>
            </div>

            {/* Right: AI Log Timeline & Performance Telemetry */}
            <div className="lg:col-span-5 rounded-xl bg-[#08090C] border border-white/[0.09] p-5 shadow-2xl font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] text-[11px] text-textMuted">
                <span className="flex items-center gap-2 text-white font-medium">
                  <Terminal className="w-3.5 h-3.5 text-cyanAccent" /> AI KERNEL LOGS
                </span>
                <span className="text-emerald-400 font-medium">UPTIME 99.99%</span>
              </div>

              {/* Fixed height container preventing dynamic page inflation */}
              <AILogTimeline />

              <div className="pt-2 border-t border-white/[0.06] space-y-2">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-textMuted">CORE CLOCK SYNC</span>
                  <span className="text-white font-semibold">3.8 GHZ</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-textMuted">LATENCY THRESHOLD</span>
                  <span className="text-cyanAccent font-semibold">&lt; 0.4ms</span>
                </div>
                <div className="flex justify-between items-center text-[11px]">
                  <span className="text-textMuted">RENDER LOAD</span>
                  <span className="text-white font-semibold">144 FPS</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ARCHITECTURE MATRIX */}
        <section id="architecture" className="py-20 border-t border-white/[0.06]">
          <div className="max-w-3xl mb-14">
            <div className="text-[11px] font-mono tracking-widest text-cyanAccent uppercase mb-2">INFRASTRUCTURE SPECIFICATIONS</div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
              Built for teams with enterprise compliance and speed limits.
            </h2>
            <p className="text-textSecondary text-sm sm:text-base">
              Compare the FrameForge architecture against standard legacy container providers.
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.08] overflow-hidden bg-[#0A0C0E]">
            <div className="grid grid-cols-12 text-xs font-mono p-3.5 bg-[#0F1216] border-b border-white/[0.08] text-textMuted select-none">
              <div className="col-span-5 sm:col-span-4 uppercase tracking-wider">CAPABILITY</div>
              <div className="col-span-4 sm:col-span-4 text-cyanAccent font-semibold">FRAMEFORGE ENGINE</div>
              <div className="col-span-3 sm:col-span-4 text-textMuted">TRADITIONAL CONTAINER HOSTS</div>
            </div>

            <div className="divide-y divide-white/[0.06] text-xs font-mono">
              {[
                { title: 'Boot Latency', forge: '< 85ms (KVM MicroVM)', forgeColor: 'text-emerald-400 font-bold', host: '45s – 3 mins (Docker daemon)' },
                { title: 'Kernel Isolation', forge: 'Full Virtual Hardware Boundary', forgeColor: 'text-white', host: 'Shared OS Namespaces' },
                { title: 'AI Code Awareness', forge: 'Deep AST + Memory Runtime Context', forgeColor: 'text-cyanAccent font-medium', host: 'Basic Text File Prompting' },
                { title: 'Multiplayer Terminal', forge: 'Sub-10ms P2P WebRTC data', forgeColor: 'text-emerald-400', host: 'High Latency WebSocket polling' },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 p-3.5 items-center hover:bg-white/[0.03] transition-colors group">
                  <div className="col-span-5 sm:col-span-4 text-white font-medium group-hover:text-cyanAccent transition-colors">{row.title}</div>
                  <div className={`col-span-4 sm:col-span-4 ${row.forgeColor}`}>{row.forge}</div>
                  <div className="col-span-3 sm:col-span-4 text-textMuted">{row.host}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL HERO CALL TO ACTION */}
        <section className="py-24 sm:py-32 text-center relative overflow-hidden">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-cyanAccent/10 via-sky-500/5 to-transparent blur-3xl pointer-events-none rounded-full"></div>

          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <div className="text-[11px] font-mono tracking-widest uppercase text-cyanAccent mb-3">
              READY WHEN YOU ARE
            </div>
            <h2 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-6">
              Your environment.<br />
              <span className="text-textSecondary/90 font-light">Already running.</span>
            </h2>
            <p className="text-textSecondary text-base sm:text-lg max-w-xl mx-auto mb-9">
              Start building without spending your first hour configuring local toolchains, Docker engines, or broken npm packages.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={handleCreateSandbox}
                disabled={isCreating}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="btn-shimmer w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.25)] cursor-pointer"
              >
                <span>{isCreating ? 'Provisioning...' : 'Start Building in Sandbox'}</span>
                <ChevronRight className="w-4 h-4 ml-2" />
              </motion.button>
              <motion.button
                onClick={() => navigate('/docs')}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-full bg-[#111418] border border-white/[0.1] text-sm font-medium text-textSecondary hover:text-white hover:border-cyanAccent/30 transition-all cursor-pointer"
              >
                Read Documentation
              </motion.button>
            </div>
          </div>
        </section>

      </main>

      {/* COMPACT PRODUCTION FOOTER */}
      <footer className="border-t border-white/[0.08] bg-[#07080A] py-12 text-xs font-mono relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 rounded bg-[#111418] border border-white/20 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 border border-cyanAccent rotate-45"></div>
                </div>
                <span className="font-bold text-white text-sm font-sans tracking-tight">FrameForge</span>
              </div>
              <span className="text-white/20">|</span>
              <div className="flex items-center space-x-1.5 text-textSecondary text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>All systems operational</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-textMuted">
              <button onClick={() => scrollToSection('product')} className="hover:text-white transition-colors cursor-pointer">Product</button>
              <button onClick={() => navigate('/docs')} className="hover:text-white transition-colors cursor-pointer">Docs</button>
              <button onClick={() => navigate('/solutions')} className="hover:text-white transition-colors cursor-pointer">Solutions</button>
              <button onClick={() => scrollToSection('architecture')} className="hover:text-white transition-colors cursor-pointer">Architecture</button>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
              <button onClick={() => navigate('/docs')} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
            </div>

            <div className="text-textMuted text-[11px]">
              © {new Date().getFullYear()} FrameForge Inc. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

// Subcomponent: AI Log Timeline with smooth accordion height transition via Framer Motion AnimatePresence
function AILogTimeline() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="space-y-2 font-mono text-xs text-textSecondary select-none">
      {LOG_STEPS.map((step, idx) => {
        const isExpanded = expandedIndex === idx;
        return (
          <div 
            key={idx}
            className="flex flex-col"
          >
            <div className="flex items-center justify-between py-0.5 group">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-4 h-4 rounded-full bg-cyanAccent/10 border border-cyanAccent/20 group-hover:border-cyanAccent/40 transition-colors">
                  <Check className="w-2.5 h-2.5 text-cyanAccent stroke-[3]" />
                </div>
                
                <span className="text-textPrimary font-normal group-hover:text-white transition-colors">{step.text}</span>
                
                {step.badge && (
                  <button 
                    onClick={() => {
                      if (step.files) {
                        setExpandedIndex(isExpanded ? null : idx);
                      }
                    }}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] tracking-wide transition-all ${
                      step.files 
                        ? 'bg-cyanAccent/10 hover:bg-cyanAccent/20 border-cyanAccent/30 text-cyanAccent cursor-pointer' 
                        : 'bg-white/5 border-white/10 text-textMuted cursor-default'
                    }`}
                  >
                    <span>{step.badge}</span>
                    {step.files && (
                      <ChevronDown
                        className="w-2.5 h-2.5 transition-transform duration-250"
                        style={{
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                        }}
                      />
                    )}
                  </button>
                )}
              </div>
              
              <span className="text-textMuted text-[10px] tabular-nums">{step.duration}</span>
            </div>
            
            {/* Smooth Accordion Height Expansion */}
            <AnimatePresence initial={false}>
              {step.files && isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pl-6 mt-1.5 border-l border-white/10 ml-2 space-y-1.5 py-1">
                    {step.files.map((file, fIdx) => (
                      <motion.div 
                        key={fIdx}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: fIdx * 0.04 }}
                        className="flex items-center gap-2 text-[11px] text-textSecondary hover:text-cyanAccent transition-colors py-0.5 cursor-pointer group/file"
                      >
                        <FileText className="w-3 h-3 text-textMuted group-hover/file:text-cyanAccent transition-colors" />
                        <span>{file}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
