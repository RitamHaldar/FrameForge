import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useHome } from '../Hooks/useHome';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Lenis from 'lenis';
import { BrainCircuit, Activity, Zap, Terminal, Lock, ChevronRight, Sparkles, Code2, Globe, Check, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const FEATURE_CARDS = [
  {
    icon: <BrainCircuit className="w-6 h-6" />,
    title: "Neural Orchestration",
    description: "LLM-driven component synthesis that understands your design system tokens and architectural patterns instantly.",
    color: "from-primary/20 to-transparent",
    iconBg: "bg-primary-container text-on-primary-container"
  },
  {
    icon: <Activity className="w-6 h-6" />,
    title: "Real-time Telemetry",
    description: "Deep-level engine metrics tracking render cycles, hydration speed, and memory pressure in a real-time stream.",
    color: "from-tertiary-container/20 to-transparent",
    iconBg: "bg-tertiary-container text-on-tertiary-container"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Zero-latency Deploys",
    description: "Instant global edge distribution using our proprietary protocol. See your changes live in under 200ms.",
    color: "from-secondary-container/20 to-transparent",
    iconBg: "bg-secondary-container text-on-secondary-container"
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { initWorkspace } = useHome();
  const [isCreating, setIsCreating] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const containerRef = useRef(null);
  const mockupRef = useRef(null);

  // Parallax calculations for the Mockup
  const { scrollYProgress: mockupProgress } = useScroll({
    target: mockupRef,
    offset: ["start end", "center center"]
  });

  const rotateX = useSpring(useTransform(mockupProgress, [0, 1], [30, 0]), { stiffness: 60, damping: 20 });
  const scale = useSpring(useTransform(mockupProgress, [0, 1], [0.85, 1]), { stiffness: 60, damping: 20 });
  const opacity = useSpring(useTransform(mockupProgress, [0, 0.5], [0, 1]), { stiffness: 60, damping: 20 });
  const translateY = useSpring(useTransform(mockupProgress, [0, 1], [150, 0]), { stiffness: 60, damping: 20 });

  useEffect(() => {
    // Initialize Lenis for smooth scroll
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

    // Mouse position for atmospheric glows
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.body.style.setProperty('--mouse-x', `${x}%`);
      document.body.style.setProperty('--mouse-y', `${y}%`);
    };
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      lenis.destroy();
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleCreateSandbox = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    navigate('/projects');
  };

  return (
    <div ref={containerRef} className="font-body-md text-body-md selection:bg-tertiary-container selection:text-on-tertiary-container bg-background relative overflow-hidden">

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[10%] w-[60vw] h-[60vw] bg-primary/3 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDuration: '15s' }}></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-tertiary-container/3 rounded-full blur-[150px] animate-pulse-glow" style={{ animationDuration: '20s' }}></div>

        {/* Mouse interactive glow */}
        <div
          className="absolute w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] transition-transform duration-1000 ease-out"
          style={{
            left: 'calc(var(--mouse-x, 50%) - 400px)',
            top: 'calc(var(--mouse-y, 50%) - 400px)'
          }}
        ></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDMpIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwb2x5Z29uIHBvaW50cz0iMCA2MCA2MCA2MCA2MCAwIi8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-5xl z-50 bg-background/70 backdrop-blur-xl border border-outline-variant/20 shadow-2xl rounded-3xl"
      >
        <div className="flex justify-between items-center h-20 px-8 mx-auto">
          <div className="flex items-center">
            <img src="/logo/logo.png" className="h-8 md:h-10 w-auto object-contain" alt="FrameForge" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a className="text-on-surface hover:text-primary transition-colors text-sm font-medium tracking-wide" href="#">Platform</a>
            <button 
              onClick={() => navigate('/solutions')} 
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium tracking-wide cursor-pointer"
            >
              Solutions
            </button>
            <button 
              onClick={() => navigate('/docs')} 
              className="text-on-surface-variant hover:text-primary transition-colors text-sm font-medium tracking-wide cursor-pointer"
            >
              Docs
            </button>
          </div>
          <button
            onClick={handleCreateSandbox}
            disabled={isCreating}
            className="group relative px-6 py-2.5 rounded-full text-sm font-semibold overflow-hidden disabled:opacity-50 cursor-pointer border border-outline-variant/30 bg-surface-container/50 hover:bg-surface-container-high hover:border-primary/50 transition-all backdrop-blur-md shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            <span className="relative z-10 text-on-surface flex items-center gap-2 group-hover:text-primary transition-colors">
              {isCreating ? 'Booting...' : (user ? 'Launch IDE' : 'Sign In')} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="relative pt-40 pb-20 z-10">

        {/* Hero Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop text-center mb-32 relative">
          <motion.div
            variants={STAGGER_CONTAINER}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="inline-flex items-center gap-2.5 px-4 py-1.5 mb-12 rounded-full border border-outline-variant/30 bg-surface-container/30 text-on-surface-variant text-xs font-medium tracking-wide shadow-sm select-none backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              v3.0.0 Orion Engine Online
            </motion.div>

            <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-6xl md:text-[96px] leading-[1.05] text-on-surface mb-8 tracking-[-0.04em] font-bold max-w-5xl">
              Forge the <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/90 to-primary/50 inline-block drop-shadow-sm">Future of Code.</span>
            </motion.h1>

            <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-xl md:text-2xl text-on-surface-variant/70 max-w-3xl mx-auto mb-14 leading-[1.6] font-light">
              The ultimate glassmorphic sandbox environment for AI-orchestrated UI development. Deploy stunning micro-apps in milliseconds with zero configuration.
            </motion.p>

            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20 w-full">
              <button
                onClick={handleCreateSandbox}
                disabled={isCreating}
                className="relative group w-full sm:w-auto px-10 py-4 rounded-full bg-primary text-background font-medium text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer overflow-hidden shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)]"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out"></div>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isCreating ? <span className="animate-pulse">Initializing Core...</span> : 'Initialize Workspace'}
                </span>
              </button>

              <button 
                onClick={() => navigate('/docs')}
                className="w-full sm:w-auto px-10 py-4 rounded-full bg-surface/5 border border-outline-variant/20 text-on-surface font-medium hover:bg-surface/10 transition-all cursor-pointer backdrop-blur-xl flex items-center justify-center gap-2 hover:border-outline-variant/50 group text-lg shadow-sm"
              >
                <Code2 className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
                Read the Docs
              </button>
            </motion.div>
          </motion.div>

          {/* 3D Dashboard Mockup */}
          <div className="relative max-w-6xl mx-auto" style={{ perspective: '2000px' }}>
            <motion.div
              ref={mockupRef}
              style={{
                rotateX,
                scale,
                opacity,
                y: translateY,
                transformStyle: 'preserve-3d'
              }}
              className="relative w-full"
            >
              {/* Massive ambient glow behind mockup */}
              <div className="absolute -inset-10 bg-gradient-to-b from-primary/20 via-tertiary-container/10 to-transparent rounded-3xl blur-[100px] opacity-50 z-[-1]"></div>

              {/* The Mockup Panel */}
              <div className="relative bg-[#0e0e0e]/80 backdrop-blur-xl rounded-2xl p-2 border border-outline-variant/40 overflow-hidden shadow-[0_20px_80px_-20px_rgba(255,255,255,0.1)] hero-glow">
                {/* Mac OS style top bar */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-outline-variant/30 bg-[#0e0e0e]/90">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  </div>
                  <div className="mx-auto flex items-center gap-2 px-4 py-1.5 bg-[#1a1a1a] border border-outline-variant/30 rounded-lg text-[11px] font-label-caps text-on-surface-variant shadow-inner">
                    <Lock className="w-3 h-3 text-primary/70" />
                    frameforge.dev/workspace/nexus-core
                  </div>
                  <div className="w-[52px]"></div> {/* Spacer for center alignment */}
                </div>
                <img
                  alt="FrameForge Dashboard"
                  className="w-full h-auto rounded-b-xl border-t-0 opacity-90 object-cover"
                  src="/logo/dashboard.png"
                />

                {/* Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.03] to-transparent rounded-2xl pointer-events-none"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Grid Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop py-32 relative">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl text-on-surface font-bold mb-6 tracking-tight">Designed for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-on-surface/50">Elite.</span></h2>
            <p className="text-on-surface-variant/70 max-w-2xl mx-auto text-xl font-light leading-relaxed">Every pixel, every millisecond, engineered for architects who demand absolute perfection and raw power.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURE_CARDS.map((feature, idx) => (
              <FeatureCard key={idx} feature={feature} index={idx} />
            ))}
          </div>
        </section>

        {/* Performance/Terminal Section */}
        <section className="relative py-32 border-y border-outline-variant/10 bg-[#0a0a0a]">
          <div className="max-w-container-max mx-auto px-margin-desktop grid grid-cols-1 lg:grid-cols-2 items-center gap-16 lg:gap-24">

            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full bg-primary/10 text-primary font-medium tracking-wide text-xs border border-primary/20">
                <Activity className="w-3.5 h-3.5" /> PERFORMANCE METRICS
              </div>
              <h2 className="text-4xl md:text-6xl text-on-surface font-bold mb-8 tracking-tight">Unrivaled <br /><span className="text-primary italic font-light pr-2">Execution.</span></h2>
              <p className="text-xl text-on-surface-variant/70 mb-12 leading-[1.7] font-light">
                Standard tools crack under pressure. FrameForge uses a proprietary V8-optimized kernel bridge to deliver synchronous 144FPS rendering cycles and sub-millisecond latency.
              </p>

              <div className="space-y-4">
                <StatRow label="CORE CLOCK SYNC" value="3.8 GHZ" />
                <StatRow label="LATENCY THRESHOLD" value="< 0.4ms" highlight />
                <StatRow label="RENDER LOAD" value="144 FPS" />
                <StatRow label="EDGE DISTRIBUTED" value="GLOBAL" />
              </div>
            </motion.div>

            {/* Terminal Window */}
            <motion.div
              initial={{ opacity: 0, x: 50, rotateY: 10 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative perspective-1000"
            >
              <div className="absolute -inset-4 bg-primary/5 blur-[50px] rounded-full"></div>
              <div className="relative bg-[#090909] rounded-2xl border border-outline-variant/30 p-6 font-mono-data text-sm shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden glass-panel backdrop-blur-2xl">

                <div className="flex items-center justify-between mb-8 opacity-50 pb-4 border-b border-outline-variant/20">
                  <span className="flex items-center gap-2"><Terminal className="w-4 h-4" /> frameforge_os // kernel</span>
                  <span className="flex gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
                    <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
                    <span className="w-2 h-2 rounded-full bg-outline-variant"></span>
                  </span>
                </div>

                <div className="text-on-surface-variant/80">
                  <AILogTimeline />
                </div>

                {/* Floating HUD Overlay */}
                <div className="absolute bottom-4 right-4 bg-[#111] border border-outline-variant/30 px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-2 font-mono-data shadow-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.8)] animate-pulse"></div>
                  UPTIME: 99.999%
                </div>
              </div>
            </motion.div>

          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-container-max mx-auto px-margin-desktop py-32 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, type: "spring" }}
            className="relative bg-[#111] border border-outline-variant/20 rounded-3xl p-12 md:p-24 text-center overflow-hidden shadow-2xl"
          >
            {/* Animated Grid Background for CTA */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwb2x5Z29uIHBvaW50cz0iMCA0MCA0MCA0MCA0MCAwIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>

            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-50"></div>

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <Globe className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-4xl md:text-6xl text-primary font-bold mb-6 tracking-tight">Ready to ascend?</h2>
              <p className="text-on-surface-variant/80 mb-12 text-xl font-light leading-[1.7]">
                Join the exclusive vanguard of architects building the next generation of absolute high-performance web applications.
              </p>

              <button
                onClick={handleCreateSandbox}
                disabled={isCreating}
                className="group relative bg-primary text-background px-10 py-5 rounded-full font-medium text-lg hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] transition-all duration-300 active:scale-95 disabled:opacity-50 cursor-pointer overflow-hidden flex items-center gap-3"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 flex items-center gap-2">
                  {isCreating ? 'Waking the Engine...' : 'Launch Editor'}
                  {!isCreating && <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />}
                </span>
              </button>
            </div>
          </motion.div>
        </section>

      </main>

      {/* Footer */}
      <footer className="relative bg-[#050505] border-t border-outline-variant/10 w-full pt-16 pb-8 z-20">
        <div className="px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="flex flex-col gap-3">
            <div className="flex items-center">
              <img src="/logo/logo.png" className="h-6 w-auto object-contain" alt="FrameForge" />
            </div>
            <p className="font-body-md text-sm text-on-surface-variant/60 max-w-xs">
              The premier AI-orchestrated environment for interface engineering.
            </p>
          </div>

          <div className="flex flex-wrap gap-12 md:gap-20">
            <div className="flex flex-col gap-4">
              <h4 className="font-label-caps text-xs text-on-surface font-bold">PRODUCT</h4>
              <a href="#" className="text-sm text-on-surface-variant/70 hover:text-primary transition-colors">Engine</a>
              <a href="#" className="text-sm text-on-surface-variant/70 hover:text-primary transition-colors">Architecture</a>
              <a href="#" className="text-sm text-on-surface-variant/70 hover:text-primary transition-colors">Changelog</a>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="font-label-caps text-xs text-on-surface font-bold">LEGAL</h4>
              <a href="#" className="text-sm text-on-surface-variant/70 hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-on-surface-variant/70 hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>

        <div className="px-margin-desktop max-w-container-max mx-auto pt-8 border-t border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-mono-data text-[11px] text-on-surface-variant/40">
            © {new Date().getFullYear()} FRAMEFORGE OS. SYSTEM INITIALIZED.
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <span className="font-mono-data text-[11px] text-on-surface-variant/50">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Subcomponents for cleaner code

function FeatureCard({ feature, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
      whileHover={{ y: -10, transition: { duration: 0.3, ease: "easeOut" } }}
      className="group relative p-10 bg-surface/5 backdrop-blur-sm rounded-3xl border border-outline-variant/10 hover:border-outline-variant/30 transition-all duration-500 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-primary/5"
    >
      {/* Hover background glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-700`}></div>

      <div className="relative z-10">
        <div className={`w-14 h-14 flex items-center justify-center rounded-2xl ${feature.iconBg} mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
          {feature.icon}
        </div>
        <h3 className="text-2xl text-on-surface mb-4 font-semibold tracking-tight group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
        <p className="text-on-surface-variant/70 text-base leading-[1.7] font-light">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
}

function StatRow({ label, value, highlight }) {
  return (
    <div className="flex items-center gap-4 group">
      <div className={`flex-1 bg-[#111] border ${highlight ? 'border-primary/30' : 'border-outline-variant/20'} p-4 rounded-xl flex justify-between items-center border-l-2 ${highlight ? 'border-l-primary shadow-[inset_4px_0_10px_rgba(255,255,255,0.05)]' : 'border-l-outline-variant'} group-hover:bg-[#151515] transition-colors`}>
        <span className="font-label-caps text-[11px] text-on-surface-variant/80 tracking-wider">{label}</span>
        <span className={`font-mono-data text-sm font-bold ${highlight ? 'text-primary' : 'text-on-surface'}`}>{value}</span>
      </div>
    </div>
  );
}

const LOG_STEPS = [
  { text: "Initializing AI...", duration: "11.3s" },
  { text: "Listing files...", duration: "0.0s" },
  { text: "Listing files", badge: "20 files", duration: "0.6s" },
  { text: "Reading files...", duration: "0.0s" },
  { text: "Reading files", badge: "4 files", duration: "85.7s" },
  { text: "Updating files", badge: "1 file", duration: "0.0s" },
  { text: "Files updated.", duration: "8.2s" },
  { text: "Updating files", badge: "2 files", duration: "0.0s" },
  { text: "Files updated.", duration: "1.3s" },
  { text: "Reading files...", duration: "0.0s" },
  { 
    text: "Reading files", 
    badge: "3 files", 
    duration: "9.0s", 
    files: [
      "src/components/TicTacToe.jsx",
      "src/App.jsx",
      "src/index.css"
    ] 
  }
];

function AILogTimeline() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState(10); // expand last item by default
  const containerRef = useRef(null);
  const inView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let count = 0;
      const interval = setInterval(() => {
        setVisibleCount(prev => {
          if (prev < LOG_STEPS.length) {
            return prev + 1;
          } else {
            clearInterval(interval);
            return prev;
          }
        });
      }, 350); // delay between step appearances
      return () => clearInterval(interval);
    }
  }, [inView]);

  return (
    <div ref={containerRef} className="space-y-3 font-mono-data text-xs text-on-surface-variant select-none py-1">
      {LOG_STEPS.slice(0, visibleCount).map((step, idx) => {
        const isExpanded = expandedIndex === idx;
        return (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col"
          >
            <div className="flex items-center justify-between py-1 group">
              <div className="flex items-center gap-3">
                {/* Glowing Checkmark */}
                <motion.div 
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 15 }}
                  className="flex items-center justify-center w-4 h-4 rounded-full bg-primary/10 border border-primary/20 shadow-inner"
                >
                  <Check className="w-2.5 h-2.5 text-primary stroke-[3.5]" />
                </motion.div>
                
                {/* Step Text */}
                <span className="text-on-surface font-light">{step.text}</span>
                
                {/* Interactive Badge */}
                {step.badge && (
                  <button 
                    onClick={() => {
                      if (step.files) {
                        setExpandedIndex(isExpanded ? null : idx);
                      }
                    }}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-sans tracking-wide transition-all shadow-sm ${
                      step.files 
                        ? 'bg-primary/5 hover:bg-primary/10 border-primary/20 hover:border-primary/40 text-primary cursor-pointer' 
                        : 'bg-surface-container border-outline-variant/30 text-on-surface-variant/70 cursor-default'
                    }`}
                  >
                    <span>{step.badge}</span>
                    {step.files && (isExpanded ? <ChevronUp className="w-2 h-2" /> : <ChevronDown className="w-2 h-2" />)}
                  </button>
                )}
              </div>
              
              {/* Duration */}
              <span className="text-on-surface-variant/40 text-[10px] tabular-nums font-light">{step.duration}</span>
            </div>
            
            {/* Expanded file list */}
            {step.files && isExpanded && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="pl-7 mt-2 border-l border-outline-variant/20 ml-2 space-y-2"
              >
                {step.files.map((file, fIdx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: fIdx * 0.08 }}
                    key={fIdx}
                    className="flex items-center gap-2 text-[11px] text-on-surface-variant/70 hover:text-primary transition-colors py-0.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-on-surface-variant/40" />
                    <span>{file}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
