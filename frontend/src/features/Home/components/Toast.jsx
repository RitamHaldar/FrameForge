import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { removeToast } from '../slices/toastSlice';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  X,
  Copy,
  Check
} from 'lucide-react';

const toastConfig = {
  success: {
    title: 'SUCCESS',
    icon: CheckCircle2,
    accentColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15 border-emerald-500/35 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    cardBorder: 'border-emerald-500/30 hover:border-emerald-500/50',
    cardBg: 'bg-[#080d0a]/95',
    radialGlow: 'bg-emerald-500/15',
    topBeam: 'via-emerald-400/50',
    barGradient: 'from-emerald-400 via-teal-300 to-cyanAccent',
    barGlow: 'shadow-[0_0_8px_rgba(16,185,129,0.5)]'
  },
  error: {
    title: 'SYSTEM ALERT',
    icon: AlertTriangle,
    accentColor: 'text-rose-400',
    iconBg: 'bg-rose-500/15 border-rose-500/35 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.25)]',
    cardBorder: 'border-rose-500/35 hover:border-rose-500/55',
    cardBg: 'bg-[#0f090a]/95',
    radialGlow: 'bg-rose-500/15',
    topBeam: 'via-rose-500/50',
    barGradient: 'from-rose-500 via-red-400 to-amber-500',
    barGlow: 'shadow-[0_0_8px_rgba(244,63,94,0.5)]'
  },
  warning: {
    title: 'ATTENTION',
    icon: AlertCircle,
    accentColor: 'text-amber-400',
    iconBg: 'bg-amber-500/15 border-amber-500/35 text-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
    cardBorder: 'border-amber-500/30 hover:border-amber-500/50',
    cardBg: 'bg-[#0f0c08]/95',
    radialGlow: 'bg-amber-500/15',
    topBeam: 'via-amber-400/50',
    barGradient: 'from-amber-400 via-yellow-400 to-orange-400',
    barGlow: 'shadow-[0_0_8px_rgba(245,158,11,0.5)]'
  },
  info: {
    title: 'SYSTEM NOTICE',
    icon: Sparkles,
    accentColor: 'text-cyanAccent',
    iconBg: 'bg-cyanAccent/15 border-cyanAccent/35 text-cyanAccent shadow-[0_0_12px_rgba(0,240,255,0.25)]',
    cardBorder: 'border-cyanAccent/30 hover:border-cyanAccent/50',
    cardBg: 'bg-[#080a0f]/95',
    radialGlow: 'bg-cyanAccent/15',
    topBeam: 'via-cyanAccent/50',
    barGradient: 'from-cyanAccent via-blue-400 to-indigo-400',
    barGlow: 'shadow-[0_0_8px_rgba(0,240,255,0.5)]'
  }
};

const ToastItem = ({ id, message, type = 'info', duration = 4500 }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const startTimeRef = useRef(0);
  const remainingTimeRef = useRef(duration);
  const timerRef = useRef(null);

  // Auto-dismiss timer with pause-on-hover capability
  useEffect(() => {
    if (isHovered) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        remainingTimeRef.current = Math.max(1000, remainingTimeRef.current - elapsed);
      }
      return;
    }

    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      dispatch(removeToast(id));
    }, remainingTimeRef.current);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [id, isHovered, dispatch]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (message) {
      navigator.clipboard?.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const config = toastConfig[type] || toastConfig.info;
  const IconComponent = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9, filter: 'blur(6px)' }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: 50, scale: 0.88, filter: 'blur(6px)', transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 450, damping: 28 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-88 max-w-[92vw] overflow-hidden rounded-2xl border ${config.cardBorder} ${config.cardBg} backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] group select-none pointer-events-auto transition-all`}
    >
      {/* Top Ambient Neon Line */}
      <div className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent ${config.topBeam} to-transparent z-10 pointer-events-none`} />

      {/* Subtle Background Radial Aura */}
      <div className={`absolute -top-10 -right-10 w-28 h-28 ${config.radialGlow} rounded-full blur-2xl pointer-events-none opacity-80`} />

      {/* Card Body */}
      <div className="p-3.5 flex flex-col gap-2 relative z-10">
        {/* Header Strip: Type Badge + Live Indicator + Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 border ${config.iconBg}`}>
              <IconComponent className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className={`font-mono text-[9px] font-bold tracking-widest uppercase ${config.accentColor}`}>
              {config.title}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {/* 1-Click Copy Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleCopy}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              title={copied ? 'Copied to clipboard' : 'Copy message'}
            >
              {copied ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </motion.button>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => dispatch(removeToast(id))}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all cursor-pointer"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Message Content */}
        <div className="pl-7 pr-1">
          <p className="text-[12px] font-normal text-gray-200 leading-relaxed break-words font-sans selection:bg-cyanAccent/20 selection:text-white">
            {message}
          </p>
        </div>
      </div>

      {/* Micro-Timer Progress Bar (Pauses on Hover) */}
      <div className="absolute bottom-0 inset-x-0 h-[2.5px] bg-white/[0.05] overflow-hidden">
        <div
          style={{
            animation: `toastProgressKeyframe ${duration}ms linear forwards`,
            animationPlayState: isHovered ? 'paused' : 'running',
            transformOrigin: 'left'
          }}
          className={`h-full w-full bg-gradient-to-r ${config.barGradient} ${config.barGlow}`}
        />
      </div>

      {/* Inline Keyframes for 60/120fps Hardware-Accelerated Progress Animation */}
      <style>{`
        @keyframes toastProgressKeyframe {
          from { transform: scaleX(1); }
          to { transform: scaleX(0); }
        }
      `}</style>
    </motion.div>
  );
};

export default function Toast() {
  const messages = useSelector((state) => state.toast.messages);

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col items-end pointer-events-none gap-2.5">
      <AnimatePresence mode="popLayout">
        {messages.map((toast) => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
