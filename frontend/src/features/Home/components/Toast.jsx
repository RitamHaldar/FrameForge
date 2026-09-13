import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { removeToast } from '../slices/toastSlice';
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  X,
  Copy,
  Check,
  ExternalLink,
  Globe,
  Radio,
} from 'lucide-react';

const toastConfig = {
  success: {
    title: 'SUCCESS',
    icon: CheckCircle2,
    accentColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.15)]',
    cardBorder: 'border-emerald-500/20 hover:border-emerald-500/35',
    topBeam: 'via-emerald-400/80',
    barGradient: 'from-emerald-400 via-teal-300 to-cyanAccent',
    barGlow: 'shadow-[0_0_10px_rgba(52,211,153,0.6)]',
    pulseColor: 'bg-emerald-400',
    ambientGlow: 'rgba(52,211,153,0.12)',
  },
  error: {
    title: 'SYSTEM ERROR',
    icon: AlertTriangle,
    accentColor: 'text-rose-400',
    iconBg: 'bg-rose-500/10 border-rose-500/25 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.15)]',
    cardBorder: 'border-rose-500/20 hover:border-rose-500/35',
    topBeam: 'via-rose-400/80',
    barGradient: 'from-rose-500 via-red-400 to-amber-500',
    barGlow: 'shadow-[0_0_10px_rgba(244,63,94,0.6)]',
    pulseColor: 'bg-rose-400',
    ambientGlow: 'rgba(244,63,94,0.12)',
  },
  warning: {
    title: 'WARNING',
    icon: AlertCircle,
    accentColor: 'text-amber-400',
    iconBg: 'bg-amber-500/10 border-amber-500/25 text-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.15)]',
    cardBorder: 'border-amber-500/20 hover:border-amber-500/35',
    topBeam: 'via-amber-400/80',
    barGradient: 'from-amber-400 via-yellow-400 to-orange-400',
    barGlow: 'shadow-[0_0_10px_rgba(251,191,36,0.6)]',
    pulseColor: 'bg-amber-400',
    ambientGlow: 'rgba(251,191,36,0.12)',
  },
  info: {
    title: 'SYSTEM NOTICE',
    icon: Sparkles,
    accentColor: 'text-cyanAccent',
    iconBg: 'bg-cyanAccent/10 border-cyanAccent/25 text-cyanAccent shadow-[0_0_12px_rgba(0,240,255,0.15)]',
    cardBorder: 'border-cyanAccent/20 hover:border-cyanAccent/35',
    topBeam: 'via-cyanAccent/80',
    barGradient: 'from-cyanAccent via-sky-400 to-blue-500',
    barGlow: 'shadow-[0_0_10px_rgba(0,240,255,0.6)]',
    pulseColor: 'bg-cyanAccent',
    ambientGlow: 'rgba(0,240,255,0.12)',
  },
};

const toastMotionVariants = {
  initial: {
    opacity: 0,
    x: 46,
    scale: 0.94,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 440,
      damping: 32,
      mass: 0.7,
    },
  },
  exit: {
    opacity: 0,
    x: 64,
    scale: 0.92,
    transition: {
      duration: 0.2,
      ease: [0.32, 0, 0.67, 0],
    },
  },
};

const ToastItem = ({ id, message, type = 'info', duration = 4500, url, title }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Drag to dismiss motion values
  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [0, 160], [1, 0.2]);

  const startTimeRef = useRef(0);
  const remainingTimeRef = useRef(duration);
  const timerRef = useRef(null);

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

  const handleCopyUrlOnly = (e) => {
    e.stopPropagation();
    if (url) {
      navigator.clipboard?.writeText(url);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleDragEnd = (_, info) => {
    // If swiped right with sufficient offset or velocity, dismiss
    if (info.offset.x > 70 || info.velocity.x > 350) {
      dispatch(removeToast(id));
    }
  };

  const config = toastConfig[type] || toastConfig.info;
  const IconComponent = config.icon;
  const displayTitle = title || config.title;

  return (
    <motion.div
      layout
      variants={toastMotionVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0.04, right: 0.75 }}
      onDragEnd={handleDragEnd}
      style={{
        x: dragX,
        opacity: dragOpacity,
        willChange: 'transform, opacity',
        transform: 'translateZ(0)',
      }}
      transition={{
        layout: { type: 'spring', stiffness: 460, damping: 34, mass: 0.8 },
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative w-[370px] max-w-[calc(100vw-28px)] overflow-hidden rounded-2xl border ${config.cardBorder} bg-[#0A0D12] shadow-[0_16px_40px_-8px_rgba(0,0,0,0.85),0_0_0_1px_rgba(255,255,255,0.06)] select-none pointer-events-auto cursor-grab active:cursor-grabbing transition-colors duration-200`}
    >
      {/* Ambient Accent Radial Glow */}
      <div
        className="absolute -top-16 -left-16 w-36 h-36 rounded-full pointer-events-none opacity-40 blur-2xl transition-opacity duration-300 group-hover:opacity-65"
        style={{ backgroundColor: config.ambientGlow }}
      />

      {/* Top Specular Hairline Shimmer */}
      <div
        className={`absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent ${config.topBeam} to-transparent z-10 pointer-events-none opacity-80`}
      />

      {/* Internal Content Container */}
      <div className="p-3.5 sm:p-4 flex flex-col gap-2 relative z-10">
        {/* Header Row: Status Icon, Category Title, Live Dot & Dismiss Button */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Pop-in Icon Badge */}
            <motion.div
              initial={{ scale: 0.4, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 520, damping: 22, delay: 0.05 }}
              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border ${config.iconBg}`}
            >
              <IconComponent className="w-3.5 h-3.5 stroke-[2.2]" />
            </motion.div>

            {/* Pulsing Live Beacon & Title */}
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${config.pulseColor}`}
                />
                <span
                  className={`relative inline-flex rounded-full h-1.5 w-1.5 ${config.pulseColor} shadow-[0_0_6px_currentColor]`}
                />
              </span>
              <span
                className={`font-mono text-[10px] font-bold tracking-wider uppercase truncate ${config.accentColor}`}
              >
                {displayTitle}
              </span>
            </div>
          </div>

          {/* Micro Dismiss Button */}
          <motion.button
            whileHover={{ scale: 1.15, rotate: 90 }}
            whileTap={{ scale: 0.88 }}
            transition={{ type: 'spring', stiffness: 500, damping: 24 }}
            onClick={(e) => {
              e.stopPropagation();
              dispatch(removeToast(id));
            }}
            className="w-6 h-6 flex items-center justify-center rounded-lg text-white/35 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer shrink-0"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Message Content */}
        <div className="pl-8.5 pr-1">
          <p className="text-[12.5px] font-normal text-white/90 leading-relaxed break-words font-sans selection:bg-cyanAccent/20 selection:text-white">
            {message}
          </p>

          {/* High-Precision Interactive Link Preview Capsule */}
          {url && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.08, duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="mt-2.5 p-2 rounded-xl bg-[#07090E] border border-cyanAccent/20 hover:border-cyanAccent/45 transition-all duration-200 flex items-center justify-between gap-2 group/link shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)]"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <div className="w-5 h-5 rounded-md bg-cyanAccent/10 border border-cyanAccent/25 flex items-center justify-center shrink-0">
                  <Globe className="w-3 h-3 text-cyanAccent drop-shadow-[0_0_6px_rgba(0,240,255,0.4)]" />
                </div>
                <span
                  className="font-mono text-[11px] text-cyanAccent/95 group-hover/link:text-white font-medium truncate tracking-tight select-all transition-colors"
                  title={url}
                >
                  {url}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* 1-Click Micro Copy Button */}
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={handleCopyUrlOnly}
                  className="h-6 px-1.5 rounded-md bg-white/[0.04] hover:bg-cyanAccent/15 border border-white/[0.06] hover:border-cyanAccent/30 text-white/50 hover:text-cyanAccent transition-all cursor-pointer flex items-center gap-1"
                  title={copiedUrl ? 'Copied link!' : 'Copy link'}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {copiedUrl ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, rotate: -20 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 20 }}
                        transition={{ type: 'spring', stiffness: 550, damping: 20 }}
                        className="flex items-center gap-1 text-emerald-400 font-mono text-[10px] font-semibold"
                      >
                        <Check className="w-3 h-3 text-emerald-400 drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]" />
                        <span>COPIED</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="copy"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 24 }}
                        className="flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span className="font-mono text-[10px] text-white/70">COPY</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* Direct Launch in New Tab */}
                <motion.a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-6 h-6 flex items-center justify-center rounded-md bg-white/[0.04] hover:bg-cyanAccent/15 border border-white/[0.06] hover:border-cyanAccent/30 text-white/50 hover:text-cyanAccent transition-all cursor-pointer"
                  title="Open in new browser tab"
                >
                  <ExternalLink className="w-3 h-3" />
                </motion.a>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 100% GPU-Composited Hardware Progress Bar (Zero CPU Overhead & Butter-Smooth) */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-white/[0.04] overflow-hidden">
        <div
          className={`h-full w-full bg-gradient-to-r ${config.barGradient} ${config.barGlow}`}
          style={{
            transformOrigin: '0% 50%',
            animation: `toastCountdown ${duration}ms linear forwards`,
            animationPlayState: isHovered ? 'paused' : 'running',
            willChange: 'transform',
          }}
        />
      </div>
    </motion.div>
  );
};

export default function Toast() {
  const messages = useSelector((state) => state.toast.messages);

  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col items-end pointer-events-none gap-2.5 max-w-[calc(100vw-32px)]">
      <AnimatePresence>
        {messages.map((toast) => (
          <ToastItem key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
