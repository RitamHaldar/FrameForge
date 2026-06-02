import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Terminal, Shield, Cpu, RefreshCw, Layers } from 'lucide-react';

const BOOT_LOGS = [
  { text: "INITIALIZING FRAMEFORGE CORE ENGINE...", icon: <Cpu className="w-3.5 h-3.5 text-primary" /> },
  { text: "ESTABLISHING SECURE API TUNNEL...", icon: <Shield className="w-3.5 h-3.5 text-primary" /> },
  { text: "MOUNTING TELEMETRY SYSTEMS...", icon: <RefreshCw className="w-3.5 h-3.5 text-primary animate-spin" style={{ animationDuration: '4s' }} /> },
  { text: "RESOLVING USER CONTEXT & SESSION...", icon: <Layers className="w-3.5 h-3.5 text-primary" /> },
  { text: "SYSTEM STATUS: SECURE", icon: <Terminal className="w-3.5 h-3.5 text-green-500" /> }
];

export default function LoadingPage() {
  const [visibleLogs, setVisibleLogs] = useState([]);
  const containerRef = useRef(null);
  const ringRef = useRef(null);

  // GSAP: Rotate the ring slowly
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(ringRef.current, {
        rotate: 360,
        duration: 10,
        repeat: -1,
        ease: 'none'
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // Cycle boot logs
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < BOOT_LOGS.length) {
        setVisibleLogs(prev => [...prev, BOOT_LOGS[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 450); // display a new log line every 450ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[999] bg-black text-on-background flex flex-col items-center justify-center font-body-md overflow-hidden"
    >
      {/* Ambient glowing background circles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.03, 0.06, 0.03]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px]"
        />
        <div className="absolute top-[10%] left-[20%] w-[300px] h-[300px] bg-tertiary-container/3 rounded-full blur-[100px]" />
      </div>

      {/* Futuristic central core loader */}
      <div className="relative flex flex-col items-center justify-center z-10 mb-12">
        <div className="relative w-36 h-36 flex items-center justify-center">
          
          {/* Outer animated rotating HUD ring */}
          <div
            ref={ringRef}
            className="absolute inset-0 border border-dashed border-primary/20 rounded-full"
          />

          {/* Secondary counter-rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="absolute w-28 h-28 border border-dotted border-white/10 rounded-full"
          />

          {/* Glowing central core */}
          <motion.div
            animate={{
              scale: [0.95, 1.05, 0.95],
              boxShadow: [
                '0 0 20px rgba(255, 255, 255, 0.05)',
                '0 0 40px rgba(255, 255, 255, 0.15)',
                '0 0 20px rgba(255, 255, 255, 0.05)'
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="w-20 h-20 rounded-2xl bg-white/5 border border-white/15 flex items-center justify-center backdrop-blur-xl shadow-inner relative"
          >
            {/* Spinning inline loader */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
              className="absolute w-14 h-14 border-t border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full"
            />
            
            <img src="/logo/logo.png" className="w-10 h-10 object-contain" alt="Core" />
          </motion.div>
        </div>
      </div>

      {/* Terminal log panel */}
      <div className="w-[90%] max-w-lg p-6 rounded-2xl border border-white/5 bg-[#090909]/60 backdrop-blur-xl glass-panel relative z-10">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
          <div className="flex items-center gap-2 font-mono-data text-[10px] text-on-surface-variant/40">
            <Terminal size={12} className="text-primary/70 animate-pulse" />
            <span>NEXUS_OS // BOOT_LOADER</span>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
          </div>
        </div>

        {/* Timeline body */}
        <div className="space-y-2.5 font-mono-data text-xs min-h-[120px] select-none">
          <AnimatePresence>
            {visibleLogs.map((log, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="flex items-center gap-3 text-on-surface-variant/80"
              >
                <div className="flex-shrink-0 w-5 h-5 rounded bg-white/5 border border-white/5 flex items-center justify-center">
                  {log.icon}
                </div>
                <span className="font-light tracking-wide">{log.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Status indicator bar */}
        <div className="mt-6 flex items-center justify-between text-[9px] font-mono-data text-on-surface-variant/40 pt-3 border-t border-white/5">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
            </span>
            <span>SECURE VERIFICATION BRIDGE ACTIVE</span>
          </div>
          <div>
            144Hz CLOCK SYNC
          </div>
        </div>
      </div>
    </div>
  );
}
