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
  Ban
} from 'lucide-react';

const MODELS = [
  {
    id: '1',
    name: 'Medium',
    tag: 'Groq',
    badge: 'Balanced',
    description: 'High throughput, balanced coding & rapid responsive iterations',
    color: 'text-cyanAccent',
    badgeColor: 'bg-cyanAccent/15 text-cyanAccent border-cyanAccent/30',
    selectedBg: 'bg-cyanAccent/15 border-cyanAccent/30',
    iconBg: 'bg-cyanAccent text-black',
    activeText: 'text-cyanAccent',
    icon: Bot
  },
  {
    id: '2',
    name: 'Pro',
    tag: 'DeepSeek',
    badge: 'Reasoning',
    description: 'Deep multi-file planning, architecture & structural AST synthesis',
    color: 'text-purple-400',
    badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    selectedBg: 'bg-purple-500/15 border-purple-500/30',
    iconBg: 'bg-purple-400 text-black',
    activeText: 'text-purple-400',
    icon: Cpu
  },
  {
    id: '3',
    name: 'Fast',
    tag: 'Mistral',
    badge: 'Turbo',
    description: 'Instant inline updates, micro-fixes & fast styling tweaks',
    color: 'text-amber-400',
    badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    selectedBg: 'bg-amber-500/15 border-amber-500/30',
    iconBg: 'bg-amber-400 text-black',
    activeText: 'text-amber-400',
    icon: Zap
  }
];


const QUICK_PROMPT_SUGGESTIONS = [
  { label: 'Add Glassmorphic Hero Section', prompt: 'Create a stunning glassmorphic Hero section with vibrant cyan gradients and subtle floating cards.' },
  { label: 'Add Dark Mode Toggle Switch', prompt: 'Implement a modern animated Dark Mode toggle switch with smooth spring transitions and localStorage persistence.' },
  { label: 'Make Layout Responsive with Drawer', prompt: 'Refactor the navigation layout to support responsive viewports with a sleek sliding mobile drawer.' },
  { label: 'Add Interactive Pricing Table', prompt: 'Generate a modern SaaS pricing table component with monthly/annual billing switch and feature checkmarks.' }
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
        className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 shadow-sm relative overflow-hidden flex items-start justify-between gap-2.5 text-red-400 backdrop-blur-md"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        <div className="flex items-start gap-2 min-w-0">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[11px] font-bold tracking-tight">Execution Error</span>
            <span className="font-mono text-[10px] text-red-300/80 leading-relaxed truncate" title={event.step}>
              {event.step}
            </span>
          </div>
        </div>
        <span className="font-mono text-[9px] text-red-400 bg-red-500/20 border border-red-500/30 px-1.5 py-0.5 rounded leading-none shrink-0 uppercase tracking-wider font-semibold">
          Failed
        </span>
      </motion.div>
    );
  }

  // Stopped / Cancelled State (NOT a green checkmark)
  if (isStopped) {
    return (
      <motion.div
        variants={itemVariants}
        className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-2.5 shadow-sm relative overflow-hidden flex items-center justify-between gap-2.5 text-gray-300 backdrop-blur-md"
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-400/80" />
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-4 h-4 rounded-md bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400 shrink-0">
            <Square className="w-2.5 h-2.5 fill-amber-400/80" />
          </div>
          <span className="font-mono text-[11px] text-gray-300 truncate" title={displayTitle}>
            {displayTitle}
          </span>
        </div>
        <span className="font-mono text-[9px] text-amber-400/80 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded leading-none shrink-0 uppercase font-semibold">
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
          className="flex items-center justify-between py-2 px-2.5 rounded-xl border border-white/[0.05] bg-[#0e1118]/60 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200 cursor-pointer"
          onClick={() => {
            if (files.length > 0) setDropdownOpen(!dropdownOpen);
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-4 h-4 rounded-md bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.15)]">
              <Check className="w-2.5 h-2.5 stroke-[2.5]" />
            </div>
            <span className="font-mono text-[11px] text-gray-300 group-hover/item:text-white transition-colors truncate" title={displayTitle}>
              {displayTitle}
            </span>

            {files.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/30 hover:bg-cyanAccent/20 transition-all text-[9px] font-mono font-semibold cursor-pointer shrink-0"
              >
                <span>{files.length} {files.length === 1 ? 'file' : 'files'}</span>
                <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 text-gray-500 font-mono text-[10px] shrink-0 pl-2">
            <Clock size={10} className="text-gray-600" />
            <span>{displayTime}s</span>
          </div>
        </div>

        {/* Dropdown list of modified files */}
        <AnimatePresence>
          {files.length > 0 && dropdownOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden pl-6 pr-2 pb-1.5 pt-1 flex flex-col gap-1 border-l border-white/10 ml-4.5 mt-1 font-mono text-[10px] text-gray-300"
            >
              {files.map((file, idx) => {
                const badge = getFileBadge(file);
                const isCopied = copiedFile === file;

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all group/file"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`text-[8px] font-mono px-1 py-0.2 rounded border ${badge.color}`}>
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
                      className="p-1 rounded text-gray-500 hover:text-cyanAccent hover:bg-cyanAccent/10 opacity-0 group-hover/file:opacity-100 transition-all cursor-pointer shrink-0"
                    >
                      {isCopied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
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
        className="rounded-xl border border-cyanAccent/30 bg-[#0d1017]/90 p-2.5 flex items-center justify-between shadow-[0_0_15px_rgba(0,240,255,0.08)] relative overflow-hidden cursor-pointer"
        onClick={() => {
          if (files.length > 0) setDropdownOpen(!dropdownOpen);
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyanAccent shadow-[0_0_8px_rgba(0,240,255,0.6)] animate-pulse" />
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-4 h-4 rounded-md bg-cyanAccent/10 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent shrink-0">
            <Loader2 className="w-2.5 h-2.5 animate-spin stroke-[2.5]" />
          </div>
          <span className="font-mono text-[11px] font-semibold text-cyanAccent tracking-tight truncate" title={displayTitle}>
            {displayTitle}
          </span>

          {files.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyanAccent/10 text-cyanAccent border border-cyanAccent/30 hover:bg-cyanAccent/20 transition-all text-[9px] font-mono font-semibold cursor-pointer shrink-0"
            >
              <span>{files.length} {files.length === 1 ? 'file' : 'files'}</span>
              <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
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
            transition={{ duration: 0.2 }}
            className="overflow-hidden pl-6 pr-2 pb-1.5 pt-1 flex flex-col gap-1 border-l border-cyanAccent/30 ml-4.5 mt-1 font-mono text-[10px] text-gray-300"
          >
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 py-1 px-2 rounded-lg bg-cyanAccent/5 border border-cyanAccent/15"
              >
                <FileCode size={11} className="text-cyanAccent shrink-0" />
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
  onMenuClick
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

  // Smooth Lenis integration
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
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 350, damping: 25 } }
  };

  const activeModelObj = useMemo(
    () => MODELS.find((m) => m.id === selectedModel) || MODELS[0],
    [selectedModel]
  );

  return (
    <motion.section
      initial={{ x: 30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex flex-col h-full bg-[#090b10] border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl relative z-10 font-sans"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyanAccent/40 to-transparent" />

      {/* Header Deck */}
      <header className="px-3.5 py-2.5 border-b border-white/[0.07] flex items-center justify-between bg-[#0b0d13]/90 backdrop-blur-xl shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-cyanAccent/10 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent shadow-[0_0_10px_rgba(0,240,255,0.15)]">
            <Sparkles className="w-3 h-3 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-white font-mono tracking-wide">Forge AI Engine</h2>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-cyanAccent/10 border border-cyanAccent/25 text-cyanAccent font-semibold">
                v3.0
              </span>
            </div>
            <p className="text-[9px] font-mono text-gray-400">Autonomous Code Synthesizer</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Badge */}
          {isGenerating ? (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyanAccent/10 border border-cyanAccent/30 select-none shadow-[0_0_8px_rgba(0,240,255,0.15)]">
              <div className="w-1.5 h-1.5 rounded-full bg-cyanAccent animate-ping" />
              <span className="font-mono text-[9px] text-cyanAccent font-bold tracking-wider uppercase">
                ACTIVE
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] select-none text-gray-400 font-mono text-[9px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>STANDBY</span>
            </div>
          )}

          {/* Menu Button */}
          {onMenuClick && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={onMenuClick}
              className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-cyanAccent/40 hover:bg-cyanAccent/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </div>
      </header>

      {/* Main Conversation & Execution Stream */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-3.5 relative">
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

              <div className="bg-[#12151e] text-gray-100 px-3.5 py-2.5 rounded-2xl rounded-tr-md border border-white/[0.09] shadow-[0_4px_16px_rgba(0,0,0,0.4)] max-w-[95%]">
                <p className="text-xs text-gray-200 font-sans leading-relaxed whitespace-pre-wrap break-words">
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
              className="flex flex-col gap-2 w-full mt-1"
            >
              <motion.div variants={itemVariants} className="flex items-center justify-between px-1 mb-0.5 select-none">
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyanAccent opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyanAccent" />
                  </span>
                  <span className="font-mono text-[10px] text-gray-400 tracking-wider uppercase font-semibold">
                    Orchestration Pipeline
                  </span>
                </div>
                <span className="font-mono text-[9px] text-gray-500 px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]">
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
            /* Futuristic Empty State & Prompt Suggestions */
            <div className="py-8 px-2 flex flex-col items-center justify-center text-center gap-5">
              {/* Central Glowing Cyber Orb */}
              <div className="relative flex items-center justify-center w-16 h-16">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border border-t-cyanAccent border-r-transparent border-b-cyanAccent/20 border-l-transparent shadow-[0_0_20px_rgba(0,240,255,0.15)]"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border border-b-indigo-400 border-t-transparent border-r-transparent border-l-indigo-400/20"
                />
                <div className="w-10 h-10 rounded-xl bg-cyanAccent/10 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                  <Bot className="w-5 h-5" />
                </div>
              </div>

              <div className="max-w-xs space-y-1">
                <h3 className="text-xs font-bold text-white font-mono tracking-tight">
                  Autonomous Architect Ready
                </h3>
                <p className="text-[11px] text-gray-400 font-light leading-relaxed">
                  Type your prompt below to instruct Forge Engine to build, inspect, or refactor React components in real time.
                </p>
              </div>

              {/* Quick Suggestion Chips */}
              <div className="w-full flex flex-col gap-1.5 pt-1">
                <div className="flex items-center gap-1 text-[9px] font-mono text-gray-500 px-1 uppercase tracking-wider">
                  <Sparkles size={10} className="text-cyanAccent" />
                  <span>Starter Directives</span>
                </div>
                <div className="grid grid-cols-1 gap-1.5 text-left">
                  {QUICK_PROMPT_SUGGESTIONS.map((item, idx) => (
                    <motion.button
                      whileHover={{ x: 2, scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      key={idx}
                      type="button"
                      onClick={() => handleSelectSuggestion(item.prompt)}
                      className="p-2 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-cyanAccent/10 hover:border-cyanAccent/30 transition-all text-[11px] font-mono text-gray-300 hover:text-white flex items-center justify-between group cursor-pointer"
                    >
                      <span className="truncate pr-2">{item.label}</span>
                      <CornerDownLeft size={11} className="text-gray-600 group-hover:text-cyanAccent shrink-0 transition-colors" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {/* Bottom scroll target */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom Input Console - Clean Two-Row Layout without Collisions */}
      <div className="p-3 bg-[#0a0c12] border-t border-white/[0.07] shrink-0 relative">
        {/* Backdrop dismiss for Model Dropdown */}
        {isOpen && (
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
        )}

        <form
          onSubmit={handleSend}
          className="rounded-2xl border border-white/[0.08] bg-[#10131b] p-2.5 shadow-xl focus-within:border-cyanAccent/40 focus-within:shadow-[0_0_20px_rgba(0,240,255,0.12)] transition-all flex flex-col gap-2 relative"
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
            className="w-full bg-transparent resize-none font-sans text-xs text-white placeholder-gray-500 focus:outline-none disabled:opacity-40 leading-relaxed min-h-[42px] max-h-32"
          />

          {/* Row 2: Bottom Toolbar with Model Chip on Left & Action on Right */}
          <div className="flex items-center justify-between pt-1 border-t border-white/[0.05] relative z-50">
            {/* Custom Model Selector Chip */}
            <div className="relative">
              <button
                type="button"
                disabled={isGenerating}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyanAccent/30 text-gray-300 hover:text-white transition-all text-[10px] font-mono cursor-pointer disabled:opacity-50 select-none shadow-sm"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModelObj.id}
                    initial={{ opacity: 0, y: -3 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 3 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="flex items-center gap-1.5"
                  >
                    <activeModelObj.icon size={11} className={activeModelObj.color} />
                    <span className="font-bold text-white">{activeModelObj.name}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded border font-semibold ${activeModelObj.badgeColor}`}>
                      {activeModelObj.tag}
                    </span>
                  </motion.div>
                </AnimatePresence>
                <ChevronDown className={`w-2.5 h-2.5 text-gray-400 transition-transform duration-200 ml-0.5 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Popup Menu */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute bottom-full left-0 mb-2 w-72 rounded-2xl border border-white/15 bg-[#0e1118]/95 p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-1 z-50 backdrop-blur-2xl"
                  >
                    <div className="flex items-center justify-between px-2.5 py-1 text-[9px] font-mono font-bold text-cyanAccent uppercase tracking-widest border-b border-white/[0.06] mb-0.5">
                      <span>Select Engine</span>
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
                          className={`w-full flex items-start justify-between p-2 rounded-xl text-left transition-all cursor-pointer group ${
                            isSelected
                              ? model.selectedBg
                              : 'hover:bg-white/[0.05] border border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 transition-colors ${isSelected ? model.iconBg : 'bg-white/10 text-gray-400 group-hover:text-white'}`}>
                              <IconComp size={12} />
                            </div>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-xs font-mono font-bold transition-colors ${isSelected ? model.activeText : 'text-white group-hover:text-cyanAccent'}`}>
                                  {model.name}
                                </span>
                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${model.badgeColor}`}>
                                  {model.tag}
                                </span>
                                <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-white/[0.06] text-gray-400">
                                  {model.badge}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-400 font-light mt-0.5 leading-snug">
                                {model.description}
                              </span>
                            </div>
                          </div>
                          {isSelected && (
                            <Check size={13} className={`${model.color} shrink-0 mt-1`} />
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
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={stopAiResponse}
                  title="Stop AI Generation"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border border-red-500/40 bg-red-500/15 hover:bg-red-500/25 text-red-400 font-mono text-[10px] font-bold shadow-[0_0_10px_rgba(239,68,68,0.25)] transition-all cursor-pointer"
                >
                  <Square size={10} className="fill-red-400" />
                  <span>Stop</span>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!inputValue.trim()}
                  title="Send Prompt (Enter)"
                  className="w-7 h-7 rounded-xl bg-cyanAccent hover:bg-cyanAccent/90 text-black flex items-center justify-center shadow-[0_0_12px_rgba(0,240,255,0.3)] transition-all disabled:opacity-20 disabled:pointer-events-none cursor-pointer shrink-0"
                >
                  <ArrowUp size={13} className="stroke-[2.5]" />
                </motion.button>
              )}
            </div>
          </div>
        </form>
      </div>
    </motion.section>
  );
}
