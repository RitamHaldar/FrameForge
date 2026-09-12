import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { ArrowLeft, Sparkles, ShieldCheck, Server, Zap, Lock } from 'lucide-react';
import AuthBackground from '../components/AuthBackground';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function AuthPage() {
  const [activeForm, setActiveForm] = useState('login');
  const navigate = useNavigate();
  const ambientLightRef = useRef(null);

  // GPU-Accelerated Cursor Light
  useEffect(() => {
    const onMouseMove = (e) => {
      if (ambientLightRef.current) {
        ambientLightRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-obsidian text-textPrimary overflow-hidden selection:bg-cyanAccent/20 selection:text-white font-sans">
      
      {/* Three.js WebGL Constellation & Cryptographic Core Background */}
      <AuthBackground />

      {/* Ambient Cursor Light */}
      <div
        ref={ambientLightRef}
        className="fixed -top-[275px] -left-[275px] w-[550px] h-[550px] rounded-full pointer-events-none z-10 opacity-30 will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(0, 240, 255, 0.08) 0%, rgba(15, 23, 42, 0) 70%)',
          transform: 'translate3d(-999px, -999px, 0)'
        }}
      />

      {/* FIXED TOP HEADER: Extreme Top Left Brand & Extreme Top Right 'Back to Home' */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 sm:px-10 lg:px-14 py-5 pointer-events-none">
        
        {/* Extreme Top Left: Brand Mark */}
        <div 
          onClick={() => navigate('/')}
          className="flex items-center space-x-3 cursor-pointer group pointer-events-auto"
        >
          <div className="w-8 h-8 rounded bg-[#15181C] border border-white/15 flex items-center justify-center relative overflow-hidden transition-all duration-200 group-hover:border-cyanAccent/40 shadow-inner">
            <div className="w-4 h-4 border border-cyanAccent rotate-45 transition-transform duration-300 group-hover:rotate-90"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-cyanAccent/90 transition-colors">FrameForge</span>
            <span className="text-[9px] font-mono text-textMuted tracking-wider uppercase">Cloud Kernel v2.4</span>
          </div>
        </div>

        {/* Extreme Top Right: Back to Home Button */}
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] hover:border-cyanAccent/40 bg-[#0C0E12]/80 backdrop-blur-xl text-xs font-mono text-textSecondary hover:text-white transition-all cursor-pointer shadow-lg pointer-events-auto"
        >
          <ArrowLeft size={13} className="text-cyanAccent" />
          <span>Back to Home</span>
        </motion.button>

      </header>
      
      {/* MAIN TWO-COLUMN CONTAINER */}
      <div className="z-20 w-full min-h-screen flex flex-col lg:flex-row relative pt-20 lg:pt-0">
        
        {/* Left Side: Branding & Story (Desktop & Tablet) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-10 xl:px-16 py-16 text-white relative z-20 select-none">
          <div className="max-w-xl space-y-7">
            
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyanAccent/20 bg-cyanAccent/10 text-cyanAccent text-[11px] font-mono uppercase tracking-wider shadow-[0_0_12px_rgba(0,240,255,0.12)]">
              <Sparkles size={11} className="text-cyanAccent animate-pulse" />
              <span>Zero-Trust Developer Sandbox</span>
            </div>

            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.55 }}
              className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.12]"
            >
              Architect the next generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyanAccent/90 to-cyanAccent">cloud environments.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.55 }}
              className="text-sm text-textSecondary font-light leading-relaxed max-w-lg"
            >
              High-performance AI orchestration, isolated Kubernetes pod sandboxes, and low-latency execution engines engineered for modern software teams.
            </motion.p>

            {/* Feature Cards Matrix */}
            <motion.div 
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.55 }}
              className="grid grid-cols-3 gap-3 pt-2"
            >
              <div className="obsidian-card p-3.5 rounded-xl border border-white/[0.08] flex flex-col gap-1.5 backdrop-blur-md">
                <Server size={15} className="text-cyanAccent" />
                <span className="text-xs font-bold text-white">MicroVM Pods</span>
                <span className="text-[10px] text-textMuted leading-tight font-light">Sub-200ms container spins</span>
              </div>

              <div className="obsidian-card p-3.5 rounded-xl border border-white/[0.08] flex flex-col gap-1.5 backdrop-blur-md">
                <Zap size={15} className="text-emerald-400" />
                <span className="text-xs font-bold text-white">AST Streaming</span>
                <span className="text-[10px] text-textMuted leading-tight font-light">Zod-verified patches</span>
              </div>

              <div className="obsidian-card p-3.5 rounded-xl border border-white/[0.08] flex flex-col gap-1.5 backdrop-blur-md">
                <ShieldCheck size={15} className="text-purple-400" />
                <span className="text-xs font-bold text-white">TLS 1.3 / JWT</span>
                <span className="text-[10px] text-textMuted leading-tight font-light">HttpOnly session security</span>
              </div>
            </motion.div>

            {/* Telemetry Status Strip */}
            <div className="flex items-center justify-between text-xs font-mono text-textMuted border-t border-white/[0.06] pt-4 mt-2">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Cluster Gateway Online (us-east-prod-1)</span>
              </div>
              <span className="text-textMuted/70">SOC-2 Type II Certified</span>
            </div>

          </div>
        </div>

        {/* Right Side: Auth Card Modal */}
        <div className="flex-1 lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12 relative z-20">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-[420px] p-6 sm:p-8 rounded-3xl relative overflow-hidden backdrop-blur-2xl bg-[#0C0E12]/90 border border-white/[0.08] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)]"
          >
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyanAccent/[0.08] to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-cyanAccent/[0.04] to-transparent rounded-full blur-2xl pointer-events-none" />

            {/* Sliding Pill Tab Switcher */}
            <div className="relative flex p-1 rounded-xl bg-[#08090C] border border-white/[0.06] mb-6 select-none">
              <button
                type="button"
                onClick={() => setActiveForm('login')}
                className={`relative flex-1 py-1.5 text-xs font-medium text-center transition-colors cursor-pointer z-10 ${
                  activeForm === 'login' ? 'text-white' : 'text-textSecondary hover:text-white'
                }`}
              >
                {activeForm === 'login' && (
                  <motion.div
                    layoutId="activeAuthTabPill"
                    className="absolute inset-0 rounded-lg bg-[#15181E] border border-white/10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveForm('register')}
                className={`relative flex-1 py-1.5 text-xs font-medium text-center transition-colors cursor-pointer z-10 ${
                  activeForm === 'register' ? 'text-white' : 'text-textSecondary hover:text-white'
                }`}
              >
                {activeForm === 'register' && (
                  <motion.div
                    layoutId="activeAuthTabPill"
                    className="absolute inset-0 rounded-lg bg-[#15181E] border border-white/10 shadow-sm"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}
                <span className="relative z-10">Create Account</span>
              </button>
            </div>

            {/* Form Container with Fluid Cross-fade Transition */}
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {activeForm === 'login' ? (
                  <LoginForm key="login" onToggleForm={setActiveForm} />
                ) : (
                  <RegisterForm key="register" onToggleForm={setActiveForm} />
                )}
              </AnimatePresence>
            </div>

            {/* Security Guarantee Footer Badge */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-center gap-2 text-[10px] font-mono text-textMuted text-center">
              <Lock size={11} className="text-cyanAccent/70" />
              <span>256-bit AES End-to-End Encrypted</span>
            </div>

          </motion.div>
        </div>

      </div>

    </div>
  );
}
