import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Lenis from 'lenis';
import {
  Sparkles,
  Cpu,
  ChevronDown,
  Menu,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Terminal,
  ArrowUp,
  Square,
  Bot,
  Zap,
  FileCode,
  Folder,
  Copy,
  RotateCcw,
  Code2,
  FileText,
  Layers,
  Clock,
  CornerDownLeft,
  X,
  StopCircle,
  Ban,
  Wand2,
  Compass,
  Activity,
  Flame,
} from 'lucide-react';

const MODELS = [
  {
    id: '1',
    name: 'Medium',
    tag: 'Groq',
    badge: 'Balanced',
    speed: '~180 tps',
    description: 'High throughput, balanced coding & rapid responsive iterations',
    color: 'text-cyanAccent',
    badgeColor: 'bg-cyanAccent/15 text-cyanAccent border-cyanAccent/30',
    selectedBg: 'bg-cyanAccent/10 border-cyanAccent/30 shadow-[0_0_15px_rgba(0,240,255,0.1)]',
    iconBg: 'bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/35',
    activeText: 'text-cyanAccent',
    icon: Bot,
  },
  {
    id: '2',
    name: 'Pro',
    tag: 'DeepSeek',
    badge: 'Reasoning',
    speed: '~45 tps',
    description: 'Deep multi-file planning, architecture & structural AST synthesis',
    color: 'text-purple-400',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    selectedBg: 'bg-purple-500/10 border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]',
    iconBg: 'bg-purple-500/20 text-purple-300 border border-purple-500/35',
    activeText: 'text-purple-400',
    icon: Cpu,
  },
  {
    id: '3',
    name: 'Fast',
    tag: 'Mistral',
    badge: 'Turbo',
    speed: '~120 tps',
    description: 'Instant inline updates, micro-fixes & fast styling tweaks',
    color: 'text-amber-400',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    selectedBg: 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_15px_rgba(251,191,36,0.1)]',
    iconBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/35',
    activeText: 'text-amber-400',
    icon: Zap,
  },
];

const QUICK_PROMPT_SUGGESTIONS = [
  {
    category: 'HERO UI',
    icon: Sparkles,
    label: 'Add Glassmorphic Hero Section',
    prompt: 'Create a stunning glassmorphic Hero section with vibrant cyan gradients and subtle floating cards.',
    accent: 'border-cyanAccent/30 text-cyanAccent bg-cyanAccent/10',
  },
  {
    category: 'THEME',
    icon: Zap,
    label: 'Add Dark Mode Toggle Switch',
    prompt: 'Implement a modern animated Dark Mode toggle switch with smooth spring transitions and localStorage persistence.',
    accent: 'border-amber-400/30 text-amber-400 bg-amber-400/10',
  },
  {
    category: 'LAYOUT',
    icon: Layers,
    label: 'Make Layout Responsive with Drawer',
    prompt: 'Refactor the navigation layout to support responsive viewports with a sleek sliding mobile drawer.',
    accent: 'border-sky-400/30 text-sky-400 bg-sky-400/10',
  },
  {
    category: 'SAAS COMPONENT',
    icon: FileCode,
    label: 'Add Interactive Pricing Table',
    prompt: 'Generate a modern SaaS pricing table component with monthly/annual billing switch and feature checkmarks.',
    accent: 'border-emerald-400/30 text-emerald-400 bg-emerald-400/10',
  },
];

const parseFiles = (stepText) => {
  let files = [];
  let title = stepText;

  const cleanStep = stepText.trim();

  if (cleanStep.includes('Listing files...')) {
    title = 'Listing files';
  } else if (cleanStep.includes('Files listed...')) {
    title = 'Listing files';
    const filesPart = cleanStep.substring(cleanStep.indexOf('Files listed...') + 'Files listed...'.length);
    files = filesPart.split(',').map((f) => f.trim()).filter(Boolean);
  } else if (cleanStep.includes('Reading files...')) {
    title = 'Reading files';
  } else if (cleanStep.includes('Files read.')) {
    title = 'Reading files';
    const filesPart = cleanStep.substring(cleanStep.indexOf('Files read.') + 'Files read.'.length);
    files = filesPart.split(',').map((f) => f.trim()).filter(Boolean);
  } else if (cleanStep.startsWith('Updating files...')) {
    title = 'Updating files';
    const filesPart = cleanStep.substring('Updating files...'.length);
    files = filesPart.split(',').map((f) => f.trim()).filter(Boolean);
  } else if (cleanStep.startsWith('Updating files') && cleanStep.includes('...')) {
    title = 'Updating files';
    const filesPart = cleanStep.substring(cleanStep.indexOf('...') + 3);
    files = filesPart.split(',').map((f) => f.trim()).filter(Boolean);
  } else if (cleanStep.includes('Files updated.')) {
    title = 'Updating files';
  }

  return { title, files };
};

function getFileBadge(filename) {
  if (filename.endsWith('.jsx') || filename.endsWith('.tsx')) {
    return { label: 'React', color: 'text-cyanAccent bg-cyanAccent/10 border-cyanAccent/30' };
  }
  if (filename.endsWith('.css') || filename.endsWith('.scss')) {
    return { label: 'CSS', color: 'text-sky-400 bg-sky-400/10 border-sky-400/30' };
  }
  if (filename.endsWith('.json')) {
    return { label: 'JSON', color: 'text-amber-400 bg-amber-400/10 border-amber-400/30' };
  }
  if (filename.endsWith('.js') || filename.endsWith('.ts')) {
    return { label: 'JS', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' };
  }
  return { label: 'Doc', color: 'text-gray-400 bg-white/5 border-white/10' };
}

function EventItem({ event, itemVariants, isLatest }) {
  const [elapsed, setElapsed] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(isLatest);
  const [copiedFile, setCopiedFile] = useState(null);

  const { title, files } = parseFiles(event.step);
  const displayTitle = files.length > 0 ? title : event.step;

  useEffect(() => {
    if (event.status !== 'running') return;

    const interval = setInterval(() => {
      const seconds = ((Date.now() - event.startTime) / 1000).toFixed(1);
      setElapsed(seconds);
    }, 100);

    return () => clearInterval(interval);
  }, [event.status, event.startTime]);

  useEffect(() => {
    setDropdownOpen(isLatest);
  }, [isLatest]);

  const handleCopyPath = (e, file) => {
    e.stopPropagation();
    navigator.clipboard.writeText(file);
    setCopiedFile(file);
    setTimeout(() => setCopiedFile(null), 1500);
  };

  const displayTime = event.status === 'completed' ? event.timeTaken : elapsed;
  const isError = event.step.toLowerCase().includes('error');
  const isStopped =
    event.step.toLowerCase().includes('stopped') ||
    event.step.toLowerCase().includes('aborted') ||
    event.step.toLowerCase().includes('cancelled');

  // Error State
  if (isError) {
    return (
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 shadow-[0_4px_16px_rgba(244,63,94,0.15)] relative overflow-hidden flex items-start justify-between gap-3 text-rose-400 backdrop-blur-md"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="w-5 h-5 rounded-lg bg-rose-500/20 border border-rose-500/35 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
            <AlertCircle className="w-3 h-3" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[11px] font-bold tracking-wide uppercase">Execution Error</span>
            <span className="font-mono text-[10px] text-rose-300/85 leading-relaxed truncate" title={event.step}>
              {event.step}
            </span>
          </div>
        </div>
        <span className="font-mono text-[9px] text-rose-400 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-md leading-none shrink-0 uppercase tracking-wider font-semibold">
          Failed
        </span>
      </motion.div>
    );
  }

  // Stopped / Cancelled State
  if (isStopped) {
    return (
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-amber-500/25 bg-amber-500/[0.05] p-3 shadow-[0_4px_16px_rgba(251,191,36,0.1)] relative overflow-hidden flex items-center justify-between gap-3 text-gray-300 backdrop-blur-md"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-5 h-5 rounded-lg bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <Square className="w-2.5 h-2.5 fill-amber-400/80" />
          </div>
          <span className="font-mono text-[11px] text-gray-300 truncate" title={displayTitle}>
            {displayTitle}
          </span>
        </div>
        <span className="font-mono text-[9px] text-amber-400/90 bg-amber-400/15 border border-amber-400/25 px-2 py-0.5 rounded-md leading-none shrink-0 uppercase font-semibold">
          Stopped
        </span>
      </motion.div>
    );
  }

  // Completed State
  if (event.status === 'completed') {
    return (
      <motion.div variants={itemVariants} className="flex flex-col select-none group/item">
        <div
          className="flex items-center justify-between py-2 px-3 rounded-xl border border-white/[0.06] bg-[#0A0D13]/80 hover:bg-white/[0.04] hover:border-white/12 transition-all duration-200 cursor-pointer shadow-sm"
          onClick={() => {
            if (files.length > 0) setDropdownOpen(!dropdownOpen);
          }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-5 h-5 rounded-lg bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_10px_rgba(52,211,153,0.2)]">
              <Check className="w-3 h-3 stroke-[2.5]" />
            </div>
            <span className="font-mono text-[11px] text-gray-300 group-hover/item:text-white transition-colors truncate font-medium" title={displayTitle}>
              {displayTitle}
            </span>

            {files.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/30 hover:bg-cyanAccent/20 transition-all text-[9.5px] font-mono font-semibold cursor-pointer shrink-0"
              >
                <span>{files.length} {files.length === 1 ? 'file' : 'files'}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-gray-500 font-mono text-[10px] shrink-0 pl-2">
            <Clock size={11} className="text-gray-500" />
            <span className="text-gray-400">{displayTime}s</span>
          </div>
        </div>

        {/* Dropdown list of modified files */}
        <AnimatePresence>
          {files.length > 0 && dropdownOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden pl-6 pr-2 pb-1.5 pt-1.5 flex flex-col gap-1.5 border-l border-white/10 ml-5 mt-1 font-mono text-[10px] text-gray-300"
            >
              {files.map((file, idx) => {
                const badge = getFileBadge(file);
                const isCopied = copiedFile === file;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[#080B10] hover:bg-white/[0.05] border border-white/[0.06] hover:border-cyanAccent/25 transition-all group/file shadow-inner"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-[8.5px] font-mono px-1.5 py-0.2 rounded border font-semibold ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="truncate text-gray-300 group-hover/file:text-white" title={file}>
                        {file}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleCopyPath(e, file)}
                      title="Copy file path"
                      className="p-1 rounded-md text-gray-500 hover:text-cyanAccent hover:bg-cyanAccent/10 opacity-0 group-hover/file:opacity-100 transition-all cursor-pointer shrink-0"
                    >
                      {isCopied ? (
                        <Check size={11} className="text-emerald-400" />
                      ) : (
                        <Copy size={11} />
                      )}
                    </button>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Running State
  return (
    <motion.div variants={itemVariants} className="flex flex-col">
      <div
        className="rounded-xl border border-cyanAccent/40 bg-[#0B0F17]/95 p-3 flex items-center justify-between shadow-[0_0_20px_rgba(0,240,255,0.12)] relative overflow-hidden cursor-pointer"
        onClick={() => {
          if (files.length > 0) setDropdownOpen(!dropdownOpen);
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyanAccent shadow-[0_0_12px_rgba(0,240,255,0.8)] animate-pulse" />
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-5 h-5 rounded-lg bg-cyanAccent/15 border border-cyanAccent/35 flex items-center justify-center text-cyanAccent shrink-0">
            <Loader2 className="w-3 h-3 animate-spin stroke-[2.5]" />
          </div>
          <span className="font-mono text-[11px] font-bold text-cyanAccent tracking-tight truncate" title={displayTitle}>
            {displayTitle}
          </span>

          {files.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyanAccent/15 text-cyanAccent border border-cyanAccent/35 hover:bg-cyanAccent/25 transition-all text-[9.5px] font-mono font-semibold cursor-pointer shrink-0"
            >
              <span>{files.length} {files.length === 1 ? 'file' : 'files'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>

        <span className="font-mono text-[10px] text-cyanAccent font-bold animate-pulse shrink-0 pl-2">
          {displayTime}s
        </span>
      </div>

      {/* Running files dropdown */}
      <AnimatePresence>
        {files.length > 0 && dropdownOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden pl-6 pr-2 pb-1.5 pt-1.5 flex flex-col gap-1.5 border-l border-cyanAccent/35 ml-5 mt-1 font-mono text-[10px] text-gray-300"
          >
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 py-1.5 px-2.5 rounded-lg bg-cyanAccent/10 border border-cyanAccent/20"
              >
                <FileCode size={12} className="text-cyanAccent shrink-0" />
                <span className="truncate text-gray-200">{file}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-cyanAccent animate-ping ml-auto shrink-0" />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AgentWorkspace({
  aiEvents = [],
  isGenerating = false,
  sendAiMessage,
  stopAiResponse,
  onMenuClick,
}) {
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const lenisRef = useRef(null);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const user = useSelector((state) => state.auth.user);
  const avatar = useSelector((state) => state.auth.avatar);

  const [inputValue, setInputValue] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('1');
  const [isOpen, setIsOpen] = useState(false);
  const [avatarImgFailed, setAvatarImgFailed] = useState(false);

  // Smooth Lenis momentum scrolling
  useEffect(() => {
    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: contentRef.current,
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  // Auto-scroll when new AI events or prompts stream in
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('bottom', { immediate: false });
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [aiEvents, isGenerating, currentPrompt]);

  // Reset avatar failed state on avatar update
  useEffect(() => {
    setAvatarImgFailed(false);
  }, [avatar]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    const msg = inputValue.trim();
    setCurrentPrompt(msg);
    sendAiMessage(msg, selectedModel);
    setInputValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSelectSuggestion = (suggestionPrompt) => {
    if (isGenerating) return;
    setInputValue(suggestionPrompt);
    textareaRef.current?.focus();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 26 } },
  };

  const activeModelObj = useMemo(
    () => MODELS.find((m) => m.id === selectedModel) || MODELS[0],
    [selectedModel]
  );

  return (
    <motion.section
      initial={{ x: 24, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex flex-col h-full bg-[#080A0F] border border-white/[0.08] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] relative z-10 font-sans"
    >
      {/* Top Ambient Specular Neon Hairline */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyanAccent/50 to-transparent z-30" />

      {/* Luxury Obsidian Chrome Header */}
      <header className="px-4 py-2.5 border-b border-white/[0.07] flex items-center justify-between bg-[#0B0D13]/95 backdrop-blur-xl shrink-0 relative z-20">
        <div className="flex items-center gap-2.5">
          {/* Holographic Glowing AI Engine Core Icon */}
          <div className="relative group/badge flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-cyanAccent/25 blur-md opacity-70 group-hover/badge:opacity-100 transition-opacity" />
            <div className="relative w-7 h-7 rounded-xl bg-gradient-to-br from-cyanAccent/20 via-[#0C121F] to-[#080B12] border border-cyanAccent/40 flex items-center justify-center text-cyanAccent shadow-[0_0_12px_rgba(0,240,255,0.25)]">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-white font-mono tracking-wide">Forge AI Engine</h2>
              <span className="text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-cyanAccent/15 border border-cyanAccent/30 text-cyanAccent font-bold tracking-tight">
                v3.2 PRO
              </span>
            </div>
            <p className="text-[9px] font-mono text-gray-400">Autonomous Code Synthesizer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {isGenerating ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyanAccent/10 border border-cyanAccent/30 select-none shadow-[0_0_14px_rgba(0,240,255,0.2)]">
              {/* Animated Neural Audio/Wave Equalizer */}
              <div className="flex items-center gap-0.5 h-2.5">
                <span className="w-0.5 h-full bg-cyanAccent rounded-full animate-[neuralWave_0.8s_ease-in-out_infinite]" />
                <span className="w-0.5 h-full bg-cyanAccent rounded-full animate-[neuralWave_0.8s_ease-in-out_0.2s_infinite]" />
                <span className="w-0.5 h-full bg-cyanAccent rounded-full animate-[neuralWave_0.8s_ease-in-out_0.4s_infinite]" />
              </div>
              <span className="font-mono text-[9px] text-cyanAccent font-bold tracking-wider uppercase">
                SYNTHESIZING
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] select-none text-gray-400 font-mono text-[9px] shadow-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              </span>
              <span className="font-medium text-gray-300">STANDBY</span>
            </div>
          )}

          {/* Action Menu Trigger Button */}
          {onMenuClick && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={onMenuClick}
              className="p-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-cyanAccent/40 hover:bg-cyanAccent/10 text-gray-400 hover:text-white transition-all cursor-pointer shadow-sm"
              title="Open Navigation Menu"
            >
              <Menu className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>
      </header>

      {/* Main Conversation & Execution Stream */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-4 relative">
        <div ref={contentRef} className="flex flex-col gap-4">
          {/* User Prompt Bubble with Unified Clean Alignment */}
          {currentPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="flex flex-col items-end gap-1.5 w-full"
            >
              <div className="flex items-center gap-1.5 pr-1">
                <span className="text-[10px] font-mono text-gray-400 font-medium">{user || 'Developer'}</span>
                <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded border font-semibold ${activeModelObj.badgeColor}`}>
                  {activeModelObj.name}
                </span>
                <div className="w-5 h-5 rounded-full ring-1 ring-cyanAccent/30 overflow-hidden bg-[#15181f] flex items-center justify-center shrink-0">
                  {avatar && !avatarImgFailed ? (
                    <img
                      src={avatar}
                      alt={user || 'User'}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-[9px] font-bold text-cyanAccent">
                      {user ? user.charAt(0).toUpperCase() : 'U'}
                    </span>
                  )}
                </div>
              </div>

              <div className="bg-[#0E121B] text-gray-100 px-3.5 py-2.5 rounded-2xl rounded-tr-sm border border-white/[0.09] shadow-[0_8px_24px_rgba(0,0,0,0.5)] max-w-[95%] relative overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyanAccent/40 to-transparent pointer-events-none" />
                <p className="text-xs text-gray-200 font-sans leading-relaxed whitespace-pre-wrap break-words selection:bg-cyanAccent/20 selection:text-white">
                  {currentPrompt}
                </p>
              </div>
            </motion.div>
          )}

          {/* AI Execution Pipeline Feed */}
          {aiEvents.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              key="ai-event-list"
              className="flex flex-col gap-2.5 w-full mt-1"
            >
              <motion.div variants={itemVariants} className="flex items-center justify-between px-1 mb-0.5 select-none">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyanAccent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyanAccent shadow-[0_0_8px_#00F0FF]" />
                  </span>
                  <span className="font-mono text-[10px] text-gray-300 tracking-wider uppercase font-bold">
                    Orchestration Pipeline
                  </span>
                </div>
                <span className="font-mono text-[9px] text-gray-400 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.08]">
                  {aiEvents.length} {aiEvents.length === 1 ? 'task' : 'tasks'}
                </span>
              </motion.div>

              {aiEvents.map((event, index) => (
                <EventItem
                  key={`${event.step}-${index}`}
                  event={event}
                  itemVariants={itemVariants}
                  isLatest={index === aiEvents.length - 1}
                />
              ))}
            </motion.div>
          ) : !currentPrompt ? (
            /* Futuristic Holographic Empty State & Starter Directives */
            <div className="py-6 px-1 flex flex-col items-center justify-center text-center gap-5">
              {/* Central Holographic AI Core / Reactor */}
              <div className="relative flex items-center justify-center w-24 h-24">
                {/* Ambient breathing color glow aura */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyanAccent/20 via-indigo-500/15 to-transparent blur-2xl pointer-events-none" />

                {/* Outer Dashed Orbital Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-dashed border-cyanAccent/30"
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyanAccent shadow-[0_0_8px_#00F0FF]" />
                </motion.div>

                {/* Inner Counter-Rotating Ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 14, ease: 'linear' }}
                  className="absolute inset-3 rounded-full border border-indigo-400/25"
                >
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_6px_#818cf8]" />
                </motion.div>

                {/* Floating Central Core */}
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#121929] to-[#0A0D15] border border-cyanAccent/45 flex items-center justify-center text-cyanAccent shadow-[0_0_24px_rgba(0,240,255,0.25),inset_0_1px_0_rgba(255,255,255,0.15)] relative overflow-hidden"
                >
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                  <Bot className="w-6 h-6 drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
                </motion.div>
              </div>

              {/* Title & Narrative */}
              <div className="max-w-xs space-y-1.5">
                <h3 className="text-sm font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-400 font-mono">
                  Autonomous Architect Ready
                </h3>
                <p className="text-[11.5px] text-gray-400 font-light leading-relaxed">
                  Type your prompt below to instruct Forge Engine to build, inspect, or refactor React components in real time.
                </p>
              </div>

              {/* Quick Starter Directives */}
              <div className="w-full flex flex-col gap-2 pt-1">
                <div className="flex items-center justify-between px-1 text-[9.5px] font-mono text-gray-500 uppercase tracking-widest w-full">
                  <div className="flex items-center gap-1.5">
                    <Sparkles size={11} className="text-cyanAccent" />
                    <span className="text-gray-400 font-semibold">Starter Directives</span>
                  </div>
                  <span className="text-[8.5px] text-gray-500">1-click insert</span>
                </div>

                <div className="grid grid-cols-1 gap-2 text-left">
                  {QUICK_PROMPT_SUGGESTIONS.map((item, idx) => {
                    const IconComp = item.icon;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={{ x: 2, scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        onClick={() => handleSelectSuggestion(item.prompt)}
                        className="group relative p-2.5 rounded-xl border border-white/[0.07] bg-gradient-to-b from-[#0F131C]/60 to-[#0A0D14]/60 hover:from-[#131A28]/80 hover:to-[#0C1018]/80 hover:border-cyanAccent/40 transition-all duration-200 cursor-pointer flex items-center justify-between gap-2.5 select-none shadow-[0_2px_8px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_20px_rgba(0,240,255,0.08)]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={`text-[8.5px] font-mono px-1.5 py-0.5 rounded border uppercase font-bold tracking-wider shrink-0 ${item.accent}`}>
                            {item.category}
                          </span>
                          <span className="text-[11px] font-mono text-gray-300 group-hover:text-white font-medium truncate transition-colors">
                            {item.label}
                          </span>
                        </div>

                        <div className="px-1.5 py-0.5 rounded bg-white/[0.04] group-hover:bg-cyanAccent/20 text-gray-500 group-hover:text-cyanAccent border border-white/[0.06] group-hover:border-cyanAccent/30 text-[9.5px] font-mono font-bold transition-all shrink-0 flex items-center gap-0.5">
                          <span>↵</span>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}

          {/* Bottom scroll target */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Studio Cockpit Input Console */}
      <div className="p-3 bg-[#0A0C11] border-t border-white/[0.07] shrink-0 relative z-30">
        {/* Backdrop dismiss for Model Dropdown */}
        {isOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
        )}

        <form
          onSubmit={handleSend}
          className="rounded-2xl border border-white/[0.08] bg-[#0E1118] p-3 shadow-2xl focus-within:border-cyanAccent/45 focus-within:shadow-[0_0_25px_-2px_rgba(0,240,255,0.2)] transition-all duration-300 flex flex-col gap-2 relative overflow-visible"
        >
          {/* Row 1: Textarea Prompt Input */}
          <textarea
            ref={textareaRef}
            rows={2}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            placeholder={isGenerating ? 'Synthesizing code in workspace...' : 'Describe what to build or change...'}
            className="w-full bg-transparent resize-none font-sans text-xs text-white placeholder-gray-500 focus:outline-none disabled:opacity-40 leading-relaxed min-h-[44px] max-h-36 selection:bg-cyanAccent/20 selection:text-white"
          />

          {/* Row 2: Bottom Toolbar with Model Switcher on Left & Action Trigger on Right */}
          <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] relative z-50">
            {/* Custom Model Selector Chip */}
            <div className="relative">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyanAccent/35 text-gray-300 hover:text-white transition-all text-[10px] font-mono cursor-pointer disabled:opacity-50 select-none shadow-sm"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModelObj.id}
                    initial={{ opacity: 0, y: -2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 2 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="flex items-center gap-1.5"
                  >
                    <activeModelObj.icon size={12} className={activeModelObj.color} />
                    <span className="font-bold text-white tracking-tight">{activeModelObj.name}</span>
                    <span className={`text-[8.5px] px-1.5 py-0.2 rounded border font-semibold ${activeModelObj.badgeColor}`}>
                      {activeModelObj.tag}
                    </span>
                  </motion.div>
                </AnimatePresence>
                <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ml-0.5 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Floating Model Popover Menu */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-full left-0 mb-2.5 w-76 rounded-2xl border border-white/[0.12] bg-[#0C0F16]/98 p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.06)] flex flex-col gap-1 z-50 backdrop-blur-2xl"
                  >
                    <div className="flex items-center justify-between px-2.5 py-1 text-[9px] font-mono font-bold text-cyanAccent uppercase tracking-widest border-b border-white/[0.06] mb-0.5">
                      <span>Select Inference Engine</span>
                      <span className="text-[8px] text-gray-500 lowercase">active: {activeModelObj.name}</span>
                    </div>

                    {MODELS.map((model) => {
                      const isSelected = selectedModel === model.id;
                      const IconComp = model.icon;

                      return (
                        <motion.button
                          key={model.id}
                          type="button"
                          whileHover={{ x: 2, scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedModel(model.id);
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-start justify-between p-2.5 rounded-xl text-left transition-all cursor-pointer group ${
                            isSelected
                              ? model.selectedBg
                              : 'hover:bg-white/[0.05] border border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 transition-colors ${isSelected ? model.iconBg : 'bg-white/10 text-gray-400 group-hover:text-white'}`}>
                              <IconComp size={13} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-mono font-bold transition-colors ${isSelected ? model.activeText : 'text-white group-hover:text-cyanAccent'}`}>
                                  {model.name}
                                </span>
                                <span className={`text-[8.5px] font-mono px-1.5 py-0.2 rounded border font-semibold ${model.badgeColor}`}>
                                  {model.tag}
                                </span>
                                <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-white/[0.06] text-gray-400">
                                  {model.speed}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-light mt-0.5 leading-snug">
                                {model.description}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <Check size={14} className={`${model.color} shrink-0 mt-1`} />
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons: Stop or Send */}
            <div className="flex items-center gap-1.5">
              {isGenerating ? (
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  onClick={stopAiResponse}
                  title="Stop AI Generation"
                  className="flex items-center gap-1.5 px-3 py-1 rounded-xl border border-rose-500/40 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 font-mono text-[10px] font-bold shadow-[0_0_12px_rgba(244,63,94,0.3)] transition-all cursor-pointer"
                >
                  <Square size={10} className="fill-rose-400" />
                  <span>STOP</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  type="submit"
                  disabled={!inputValue.trim()}
                  title="Send Directive (Enter)"
                  className="w-7.5 h-7.5 rounded-xl bg-cyanAccent hover:bg-cyan-300 text-black flex items-center justify-center shadow-[0_0_16px_rgba(0,240,255,0.4)] transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer shrink-0"
                >
                  <ArrowUp size={14} className="stroke-[2.5]" />
                </motion.button>
              )}
            </div>
          </div>
        </form>

        {/* Micro Keyboard Hint */}
        <div className="flex items-center justify-between px-1 pt-1.5 text-[9px] font-mono text-gray-500 select-none">
          <span>Press ↵ to execute</span>
          <span>Shift + ↵ for newline</span>
        </div>
      </div>
    </motion.section>
  );
}
