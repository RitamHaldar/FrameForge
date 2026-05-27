import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { Sparkles, Cpu } from 'lucide-react';

function EventItem({ event, itemVariants }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (event.status !== 'running') return;
    
    const interval = setInterval(() => {
      const seconds = ((Date.now() - event.startTime) / 1000).toFixed(1);
      setElapsed(seconds);
    }, 100);

    return () => clearInterval(interval);
  }, [event.status, event.startTime]);

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
      <motion.div 
        variants={itemVariants} 
        className="flex items-center justify-between py-1 px-2.5 hover:bg-surface-container-low/50 rounded transition-all duration-300 select-none"
      >
        <div className="flex items-center gap-2 text-on-surface-variant/80">
          <span className="material-symbols-outlined text-primary/70 text-[12px] font-bold">check</span>
          <span className="font-mono-data text-[11px] text-on-surface-variant truncate max-w-[200px]" title={event.step}>{event.step}</span>
        </div>
        <span className="font-mono-data text-[10px] text-on-surface-variant/40">{displayTime}s</span>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={itemVariants} 
      className="bg-surface-container-low border border-outline-variant/30 rounded px-2.5 py-1 flex items-center justify-between shadow-sm relative overflow-hidden"
    >
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary"></div>
      <div className="flex items-center gap-2 text-primary">
        <span className="material-symbols-outlined animate-spin text-[12px]">progress_activity</span>
        <span className="font-mono-data text-[11px] font-medium tracking-tight truncate max-w-[200px]" title={event.step}>{event.step}</span>
      </div>
      <span className="font-mono-data text-[10px] text-primary/80 animate-pulse">{displayTime}s</span>
    </motion.div>
  );
}

export default function AgentWorkspace({ aiEvents = [], isGenerating = false, sendAiMessage }) {
  const scrollRef = useRef(null);
  const contentRef = useRef(null);
  const lenisRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [inputValue, setInputValue] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState('');

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
    sendAiMessage(msg);
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
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-container-high border border-outline-variant/40">
            {isGenerating ? (
              <>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                <span className="font-label-caps text-[10px] text-primary">GENERATING</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                <span className="font-label-caps text-[10px] text-on-surface-variant">READY</span>
              </>
            )}
          </div>
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
      <div className="px-4 pb-5 pt-2 mt-auto">
        <form onSubmit={handleSend} className="relative flex items-center bg-surface-container-low border border-outline-variant/35 rounded-md p-1 shadow-inner focus-within:border-outline/50 transition-all duration-300">
          <input 
            className="w-full bg-transparent py-2 pl-3 pr-10 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none disabled:opacity-50" 
            placeholder={isGenerating ? "AI is generating code..." : "Interrupt or refine..."}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isGenerating}
          />
          <button 
            type="submit"
            className="absolute right-2 p-1.5 rounded-md text-outline hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
            disabled={isGenerating || !inputValue.trim()}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
          </button>
        </form>
      </div>
    </motion.section>
  );
}
