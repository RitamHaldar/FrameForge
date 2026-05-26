import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { Sparkles } from 'lucide-react';

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
      <motion.div variants={itemVariants} className="bg-error/5 border border-error/30 rounded-lg p-3 flex flex-col gap-2 relative overflow-hidden shadow-[inset_0_0_20px_rgba(239,68,68,0.05)]">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-error">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span className="font-label-caps text-label-caps font-bold">{event.step}</span>
          </div>
          <span className="font-code-md text-[10px] text-error">Failed</span>
        </div>
      </motion.div>
    );
  }

  if (event.status === 'completed') {
    return (
      <motion.div variants={itemVariants} className="bg-surface-container-low border border-outline-variant/20 rounded-lg p-3 flex flex-col gap-2 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-tertiary text-[16px]">check_circle</span>
            <span className="font-label-caps text-label-caps text-on-surface">{event.step}</span>
          </div>
          <span className="font-code-md text-[10px] text-outline">{displayTime}s</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className="bg-primary/5 border border-primary/30 rounded-lg p-3 flex flex-col gap-3 relative overflow-hidden shadow-[inset_0_0_20px_rgba(79,70,229,0.05)]">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary">
          <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
          <span className="font-label-caps text-label-caps font-bold">{event.step}</span>
        </div>
        <span className="font-code-md text-[10px] text-primary">{displayTime}s</span>
      </div>
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
      className="w-full flex flex-col gap-3 h-full bg-surface/70 backdrop-blur-md border border-outline-variant/20 rounded-2xl overflow-hidden shadow-lg relative z-10"
    >
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-container to-transparent opacity-50"></div>
      <header className="px-5 py-4 border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low/50">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-white animate-pulse" />
          <h2 className="font-display-lg text-[14px] font-bold text-white tracking-wide">Forge Engine</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-surface-container-highest border border-outline-variant/30">
            {isGenerating ? (
              <>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                <span className="font-label-caps text-[10px] text-primary">GENERATING</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                <span className="font-label-caps text-[10px] text-tertiary">READY</span>
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
              <div className="bg-surface-variant text-on-surface p-3 rounded-lg rounded-tr-sm border border-outline-variant/20 shadow-sm">
                <p className="font-body-sm text-body-sm">{currentPrompt}</p>
              </div>
              <img 
                alt="User" 
                className="w-6 h-6 rounded-full" 
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
              key={aiEvents.length} 
              className="flex flex-col gap-3 w-full"
            >
              <motion.div variants={itemVariants} className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-[16px]">cycle</span>
                <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">Agent Plan Executing</span>
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
            <div className="text-center py-10 flex flex-col items-center justify-center gap-4 border border-dashed border-outline-variant/20 rounded-xl bg-surface-container-lowest/30 p-6">
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
        <form onSubmit={handleSend} className="relative flex items-center bg-surface-container-highest border border-outline-variant/20 rounded-xl p-1 shadow-inner focus-within:border-primary/50 transition-all duration-300">
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
            className="absolute right-2 p-1.5 rounded-lg text-outline hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:pointer-events-none"
            disabled={isGenerating || !inputValue.trim()}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>send</span>
          </button>
        </form>
      </div>
    </motion.section>
  );
}
