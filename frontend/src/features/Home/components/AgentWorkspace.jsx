import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { Sparkles, Cpu, ChevronDown, Menu } from 'lucide-react';

const models = [
  { id: '1', name: 'Pro', description: 'Deep & Exhaustive Reasoning' },
  { id: '2', name: 'Fast', description: 'Rapid & Efficient Completions' }
];

const parseFiles = (stepText) => {
  let files = [];
  let title = stepText;

  // Normalize string by trimming newlines/spaces
  const cleanStep = stepText.trim();

  if (cleanStep.includes('Listing files...')) {
    title = 'Listing files';
  } else if (cleanStep.includes('Files listed...')) {
    title = 'Listing files';
    const filesPart = cleanStep.substring(cleanStep.indexOf('Files listed...') + 'Files listed...'.length);
    files = filesPart.split(',').map(f => f.trim()).filter(Boolean);
  } else if (cleanStep.includes('Reading files...')) {
    title = 'Reading files';
  } else if (cleanStep.includes('Files read.')) {
    title = 'Reading files';
    const filesPart = cleanStep.substring(cleanStep.indexOf('Files read.') + 'Files read.'.length);
    files = filesPart.split(',').map(f => f.trim()).filter(Boolean);
  } else if (cleanStep.startsWith('Updating files...')) {
    title = 'Updating files';
    const filesPart = cleanStep.substring('Updating files...'.length);
    files = filesPart.split(',').map(f => f.trim()).filter(Boolean);
  } else if (cleanStep.startsWith('Updating files') && cleanStep.includes('...')) {
    title = 'Updating files';
    const filesPart = cleanStep.substring(cleanStep.indexOf('...') + 3);
    files = filesPart.split(',').map(f => f.trim()).filter(Boolean);
  } else if (cleanStep.includes('Files updated.')) {
    title = 'Updating files';
  }

  return { title, files };
};

function EventItem({ event, itemVariants, isLatest }) {
  const [elapsed, setElapsed] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(isLatest);

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

  const displayTime = event.status === 'completed' ? event.timeTaken : elapsed;
  const isError = event.step.toLowerCase().includes('error');

  if (isError) {
    return (
      <motion.div 
        variants={itemVariants} 
        className="bg-error-container/5 border border-error-container/20 rounded px-2.5 py-1 flex items-center justify-between shadow-sm relative overflow-hidden"
      >
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-error"></div>
        <div className="flex items-center gap-2 text-error">
          <span className="material-symbols-outlined text-[12px] font-medium">error</span>
          <span className="font-mono-data text-[11px] font-medium tracking-tight truncate max-w-[200px]" title={event.step}>{event.step}</span>
        </div>
        <span className="font-mono-data text-[9px] text-error bg-error/10 px-1 py-0.5 rounded leading-none">Failed</span>
      </motion.div>
    );
  }

  if (event.status === 'completed') {
    return (
      <motion.div variants={itemVariants} className="flex flex-col select-none">
        <div 
          className="flex items-center justify-between py-1 px-2.5 hover:bg-surface-container-low/50 rounded transition-all duration-300 cursor-pointer"
          onClick={() => {
            if (files.length > 0) setDropdownOpen(!dropdownOpen);
          }}
        >
          <div className="flex items-center gap-2 text-on-surface-variant/80">
            <span className="material-symbols-outlined text-primary/70 text-[12px] font-bold">check</span>
            <span className="font-mono-data text-[11px] text-on-surface-variant truncate max-w-[180px]" title={displayTitle}>{displayTitle}</span>
            {files.length > 0 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                }}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/25 hover:border-primary/45 transition-all text-[9px] font-bold cursor-pointer"
              >
                <span>{files.length} {files.length === 1 ? 'file' : 'files'}</span>
                <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
          <span className="font-mono-data text-[10px] text-on-surface-variant/40">{displayTime}s</span>
        </div>

        {/* Dropdown list of files */}
        {files.length > 0 && dropdownOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-6 pr-3 pb-2 pt-1.5 flex flex-col gap-1.5 border-l border-outline-variant/35 ml-4.5 mt-0.5 font-mono-data text-[10px] text-on-surface-variant/75 bg-surface-container-low/10 rounded-md"
          >
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 hover:text-white transition-colors duration-150 py-0.5">
                <span className="material-symbols-outlined text-outline" style={{ fontSize: '9px' }}>description</span>
                <span className="truncate">{file}</span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className="flex flex-col">
      <div 
        className="bg-surface-container-low border border-outline-variant/30 rounded px-2.5 py-1 flex items-center justify-between shadow-sm relative overflow-hidden cursor-pointer"
        onClick={() => {
          if (files.length > 0) setDropdownOpen(!dropdownOpen);
        }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined animate-spin text-[12px]">progress_activity</span>
          <span className="font-mono-data text-[11px] font-medium tracking-tight truncate max-w-[180px]" title={displayTitle}>{displayTitle}</span>
          {files.length > 0 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/25 hover:border-primary/45 transition-all text-[9px] font-bold cursor-pointer"
            >
              <span>{files.length} {files.length === 1 ? 'file' : 'files'}</span>
              <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
        <span className="font-mono-data text-[10px] text-primary/80 animate-pulse">{displayTime}s</span>
      </div>

      {/* Dropdown list of files */}
      {files.length > 0 && dropdownOpen && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="pl-6 pr-3 pb-2 pt-1.5 flex flex-col gap-1.5 border-l border-outline-variant/35 ml-4.5 mt-1 font-mono-data text-[10px] text-on-surface-variant/75 bg-surface-container-low/10 rounded-md"
        >
          {files.map((file, idx) => (
            <div key={idx} className="flex items-center gap-2 hover:text-white transition-colors duration-150 py-0.5">
              <span className="material-symbols-outlined text-outline" style={{ fontSize: '9px' }}>description</span>
              <div className="w-1.5 h-1.5 rounded-full border border-primary/20 border-t-primary animate-spin flex-shrink-0" style={{ animationDuration: '0.8s' }}></div>
              <span className="truncate">{file}</span>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default function AgentWorkspace({ aiEvents = [], isGenerating = false, sendAiMessage, stopAiResponse, onMenuClick }) {
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const lenisRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [selectedModel, setSelectedModel] = useState('1');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      wrapper: scrollRef.current,
      content: contentRef.current,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('bottom', { immediate: false });
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [aiEvents, isGenerating]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isGenerating) return;
    const msg = inputValue.trim();
    setCurrentPrompt(msg);
    sendAiMessage(msg, selectedModel);
    setInputValue('');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <motion.section 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex flex-col gap-3 h-full bg-surface-container/70 backdrop-blur-md border border-outline-variant/35 rounded-xl overflow-hidden shadow-lg relative z-10"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-50"></div>
      <header className="px-5 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-lowest">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <h2 className="font-display-lg text-[14px] font-bold text-white tracking-wide">Forge Engine</h2>
        </div>
        <div className="flex items-center gap-2">
          {isGenerating ? (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-container-high border border-outline-variant/40 mr-1 select-none">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
              <span className="font-label-caps text-[10px] text-primary">GENERATING</span>
            </div>
          ) : null}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex items-center justify-center p-1.5 rounded-lg bg-surface-container-high border border-outline-variant/40 hover:border-primary/50 text-on-surface-variant hover:text-white transition-all duration-250 cursor-pointer active:scale-95 shadow-sm hover:shadow-[0_0_12px_rgba(170,59,255,0.15)]"
            title="Open Menu"
          >
            <Menu className="w-4.5 h-4.5" />
          </button>
        </div>
      </header>
      
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-5 relative">
        <div ref={contentRef} className="flex flex-col gap-6">
          
          {/* User Prompt Bubble */}
          {currentPrompt && (
            <div className="flex gap-3 items-start self-end max-w-[90%]">
              <div className="bg-surface-container-high text-on-surface p-3 rounded-md rounded-tr-sm border border-outline-variant/20 shadow-sm">
                <p className="font-body-sm text-body-sm">{currentPrompt}</p>
              </div>
              <img 
                alt="User" 
                className="w-6 h-6 rounded-full border border-outline-variant/45 shadow-sm" 
                data-alt="Small circular user avatar placeholder." 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCpIhIn2PcWxPLZx-NrMtMnoV7hYWIt9Ru1GZ0hBB5BuKkKPMRvJweKino3x4kNxfrM5zzWa4yKzJC6S3BO6ayNaYP5FQFm9aqd0GjoDePzF9XCzpfO4UYJQkwOkSVoc3dIH3QXMwG2KrvO46QyjOJl7MnU7mCdqBiOS1wzBN-Q9j8D42tuzy1DNZkx6P3Ra87VMuDdpy5KFAb0mrL2Wo5G3ASnJkxK3BtARV5vtGQTnfHvMpc4wupS4kOmE4Dg2YYBCB8CLRepSe-p"
              />
            </div>
          )}
 
          {/* AI Event List */}
          {aiEvents.length > 0 ? (
            <motion.div 
              variants={containerVariants} 
              initial="hidden" 
              animate="show" 
              key="ai-event-list" 
              className="flex flex-col gap-2.5 w-full"
            >
              <motion.div variants={itemVariants} className="flex items-center gap-1.5 mb-1.5 select-none">
                <Cpu className="w-3.5 h-3.5 text-primary/80 animate-pulse" />
                <span className="font-label-caps text-[9px] text-primary uppercase tracking-widest font-semibold opacity-90">Agent Plan Executing</span>
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
          ) : (
            <div className="text-center py-10 flex flex-col items-center justify-center gap-4 border border-dashed border-outline-variant/45 rounded-md bg-surface-container-lowest/30 p-6">
              <span className="material-symbols-outlined text-[48px] text-outline opacity-40 animate-pulse">rocket_launch</span>
              <div className="flex flex-col gap-1">
                <p className="font-body-md text-on-surface/80 font-medium">Ready to start designing</p>
                <p className="font-body-sm text-[12px] text-outline max-w-[240px]">Type your design request below to initiate the generative building workspace.</p>
              </div>
            </div>
          )}

          {/* Scroll Target to auto scroll the display to the current message */}
          <div ref={messagesEndRef} />

        </div>
      </div>

      {/* Input Form at the bottom */}
      <div className="px-5 pb-6 pt-2 mt-auto relative">
        {/* Transparent Click-out overlay */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
        )}
        
        <form 
          onSubmit={handleSend} 
          className="relative flex items-center bg-surface-container-low border border-outline-variant/30 rounded-xl p-2 shadow-2xl focus-within:border-primary/50 focus-within:shadow-[0_0_20px_rgba(170,59,255,0.15)] transition-all duration-300 gap-2"
        >
          {/* Custom Dropdown Container */}
          <div className="relative z-50 flex items-center">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high border border-outline-variant/25 hover:border-outline-variant/50 text-on-surface hover:text-white transition-all duration-250 cursor-pointer disabled:opacity-50 select-none active:scale-95 shadow-sm"
            >
              <span className="text-[11px] font-bold tracking-tight uppercase">{models.find(m => m.id === selectedModel)?.name}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-outline transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu floating upwards - OPAQUE Background */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-full left-0 mb-2 w-60 bg-surface-container-high border border-outline-variant/50 rounded-xl p-1.5 shadow-[0_12px_48px_rgba(0,0,0,0.6)] flex flex-col gap-1 z-50"
                >
                  <div className="px-2.5 py-1.5 text-[8.5px] font-black text-primary uppercase tracking-widest select-none opacity-80">
                    Select AI Engine
                  </div>
                  {models.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        setSelectedModel(model.id);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all duration-200 hover:bg-primary/10 group ${
                        selectedModel === model.id ? 'bg-primary/15 border border-primary/25' : 'border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className={`text-[11px] font-bold tracking-tight group-hover:text-primary transition-colors ${selectedModel === model.id ? 'text-primary' : 'text-on-surface'}`}>
                            {model.name}
                          </span>
                          <span className="text-[9px] text-outline leading-tight mt-0.5">{model.description}</span>
                        </div>
                      </div>
                      {selectedModel === model.id && (
                        <span className="material-symbols-outlined text-[14px] text-primary font-bold">check</span>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <input 
            className="w-full bg-transparent py-2 pl-2 pr-12 font-mono-data text-[12px] text-white placeholder:text-outline/50 focus:outline-none disabled:opacity-40" 
            placeholder={isGenerating ? "AI is generating code..." : "Ask Forge Engine to design..."}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isGenerating}
          />
          {isGenerating ? (
            <button 
              type="button"
              onClick={stopAiResponse}
              className="absolute right-2 p-2 rounded-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/25 text-red-500 hover:shadow-[0_0_12px_rgba(239,68,68,0.4)] active:scale-90 hover:scale-105 transition-all duration-200 cursor-pointer flex items-center justify-center w-8 h-8 z-20"
              title="Stop AI Generation"
            >
              <div className="w-2.5 h-2.5 bg-red-500 rounded-[2px]" />
            </button>
          ) : (
            <button 
              type="submit"
              className="absolute right-2 p-2 rounded-lg bg-primary hover:bg-primary/95 text-on-primary hover:shadow-[0_0_12px_rgba(170,59,255,0.5)] active:scale-95 hover:scale-105 transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center justify-center"
              disabled={!inputValue.trim()}
            >
              <span className="material-symbols-outlined font-black text-on-primary" style={{ fontSize: '15px' }}>arrow_upward</span>
            </button>
          )}
        </form>
      </div>
    </motion.section>
  );
}
