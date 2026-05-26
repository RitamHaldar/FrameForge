import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIPanel({ messages, isGenerating, agentSteps, sendMessage }) {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, agentSteps, isGenerating]);

  const handleSend = (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (trimmed) {
      sendMessage(trimmed);
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  // Helper parser for markdown code blocks inside message content
  const parseMessageContent = (content) => {
    if (!content) return null;
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : 'code';
        const code = match ? match[2] : part.slice(3, -3);
        
        return (
          <div key={index} className="my-3.5 rounded-xl border border-white/5 bg-[#0a0a0f] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(0,0,0,0.4)] font-code-md">
            <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5 select-none">
              <span className="text-[10px] text-[#c3c0ff] uppercase tracking-wider font-bold">{language || 'code'}</span>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(code);
                  alert('Code copied to clipboard!');
                }}
                className="flex items-center gap-1 text-[10px] text-[#918fa1] hover:text-white cursor-pointer active:scale-95 transition-all hover:shadow-sm"
              >
                <span className="material-symbols-outlined text-[13px]">content_copy</span>
                Copy
              </button>
            </div>
            <pre className="p-4 overflow-x-auto text-[11px] text-[#e4e1ee] leading-relaxed select-text font-code scrollbar-thin">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return <span key={index} className="whitespace-pre-line select-text leading-relaxed font-body">{part}</span>;
    });
  };

  // Quick suggestions list
  const suggestions = [
    { label: 'Build a modern calculator app', prompt: 'build a beautiful modern responsive calculator app with micro-interactions.' },
    { label: 'Create glassmorphic card component', prompt: 'create a high-end glassmorphic showcase card component with CSS ambient glow borders.' },
    { label: 'Implement sleek dark mode switch', prompt: 'implement a premium dark-light mode transition switch with gorgeous icon animations.' }
  ];
  return (
    <section className="w-full flex flex-col h-full bg-[#08080c]/90 backdrop-blur-2xl z-20 shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/5 rounded-2xl overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-[-100px] right-[-100px] w-64 h-64 bg-primary-container/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* AI Assistant Header matching top files panel style */}
      <div className="pl-6 pr-5 py-4 border-b border-white/5 bg-[#0a0a0f]/40 flex items-center gap-2 select-none relative z-10 shadow-sm">
        <span className="material-symbols-outlined text-[15px] text-primary/80 animate-[pulse_3s_infinite]" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
        <span className="text-[#e4e1ee]/90 font-label-caps text-[9px] uppercase tracking-[0.2em] font-extrabold">AI Assistant</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.8)] ml-auto"></span>
        <span className="text-[9px] font-code-md text-outline/50 uppercase tracking-widest">Gemini 1.5 Pro</span>
      </div>

      {/* Chat Messages and Live Steps viewport */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 flex flex-col gap-5.5 relative z-10 scroll-smooth">
        {messages && messages.length > 0 ? (
          messages.map((msg, idx) => (
            msg.role === 'user' ? (
              /* Premium User Message Block (Right Aligned with initials) */
              <div key={idx} className="flex gap-3 items-start self-end max-w-[85%] animate-[slide-in-right_0.35s_cubic-bezier(0.16,1,0.3,1)]">
                <div className="bg-[#161624]/90 text-[#e4e1ee] px-5 py-3.5 rounded-[20px] rounded-tr-xs border border-white/[0.06] shadow-[0_5px_15px_rgba(0,0,0,0.4)]">
                  <p className="font-body text-[12.5px] leading-relaxed select-text">{msg.content}</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#8b5cf6] to-[#ec4899] border border-white/10 flex items-center justify-center text-white text-[11px] font-bold shadow-md shrink-0 select-none">
                  RH
                </div>
              </div>
            ) : (
              /* Premium Assistant Card Block (Left Aligned with models) */
              <div key={idx} className="flex gap-3.5 items-start self-start max-w-[90%] animate-[slide-in-left_0.35s_cubic-bezier(0.16,1,0.3,1)]">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6366f1] to-[#4edea3] flex items-center justify-center shrink-0 shadow-md border border-white/20 text-white select-none">
                  <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>precision_manufacturing</span>
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 pl-1 select-none">
                    <span className="text-[10px] font-bold text-white tracking-wider uppercase">FrameForge AI</span>
                    <span className="w-1 h-1 rounded-full bg-white/15" />
                    <span className="text-[9px] font-code-md text-outline/50 uppercase tracking-widest">Gemini 1.5 Pro</span>
                  </div>
                  <div className="bg-[#0e0e15]/95 text-[#e4e1ee] px-6 py-5 rounded-[22px] rounded-tl-xs border border-white/5 shadow-xl relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#6366f1] via-[#4edea3] to-transparent"></div>
                    <div className="font-body text-[12.5px] leading-relaxed select-text relative z-10 flex flex-col">
                      {parseMessageContent(msg.content)}
                    </div>
                  </div>
                </div>
              </div>
            )
          ))
        ) : (
          /* Empty Chat Welcome State with Quick Suggestions */
          <div className="flex-1 flex flex-col justify-center py-6 gap-6 my-auto select-none">
            <div className="flex flex-col items-center text-center gap-4 opacity-95">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse"></div>
                <span className="material-symbols-outlined text-[52px] text-primary relative z-10 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]">stream</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[13.5px] font-black text-white uppercase tracking-[0.15em]">Ready to Forge</span>
                <p className="text-[11.5px] text-outline/70 max-w-[240px] leading-relaxed mx-auto">Describe your vision, and the AI agent will engineer it live inside the sandbox.</p>
              </div>
            </div>

            {/* Quick suggestions items */}
            <div className="flex flex-col gap-2.5 mt-2 px-1">
              <span className="text-[8.5px] font-code-md text-outline-variant uppercase tracking-[0.25em] font-bold mb-1 pl-1">Suggested Prompts</span>
              {suggestions.map((s, idx) => (
                <div 
                  key={idx}
                  onClick={() => handleSend(s.prompt)}
                  className="flex items-center gap-3 px-4.5 py-3 rounded-xl bg-white/[0.01] border border-white/5 hover:border-primary-container/30 hover:bg-gradient-to-r hover:from-white/[0.03] hover:to-transparent transition-all duration-300 cursor-pointer group active:scale-[0.98] shadow-sm"
                >
                  <span className="material-symbols-outlined text-[14px] text-primary/60 group-hover:text-primary group-hover:rotate-12 transition-transform">bolt</span>
                  <span className="text-[11px] text-[#e4e1ee]/90 group-hover:text-white font-medium truncate">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Persistent Holographic Timeline logs (Always ticked finished once response arrives!) */}
        <AnimatePresence>
          {(isGenerating || (messages && messages.some(m => m.role === 'agent'))) && (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="flex flex-col w-full relative mt-4 bg-[#0a0a0f]/90 border border-white/5 rounded-2xl p-6 shadow-[0_20px_45px_rgba(0,0,0,0.6)] select-none overflow-hidden animate-[fade-in_0.3s_ease-out]"
            >
              {/* Vertical timeline line centered with bullet badges */}
              <div className="absolute left-[35px] top-[52px] bottom-8 w-px bg-white/[0.04]" />
              
              {/* Monospace header tracker bar */}
              <div className="flex items-center gap-2 mb-6 select-none relative z-10">
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined text-white text-[15px] animate-[spin_4s_linear_infinite]">sync</span>
                    <span className="font-code-md text-[10px] text-white tracking-[0.2em] font-bold">AGENT PLAN EXECUTING</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[#10b981] text-[15px]">check_circle</span>
                    <span className="font-code-md text-[10px] text-[#10b981] tracking-[0.2em] font-bold">AGENT PLAN COMPLETED</span>
                  </>
                )}
              </div>
              
              {(isGenerating 
                ? agentSteps 
                : agentSteps.map(step => ({ ...step, status: 'completed', time: step.time || '1.2s' }))
              ).map((step, idx) => {
                const getSubSteps = (stepId) => {
                  switch (stepId) {
                    case 1:
                      return [
                      { text: 'Analyzing user request...', active: true },
                      { text: 'Extracting workspace configuration...', active: false }
                      ];
                    case 2:
                      return [
                      { text: 'Mapping components layout model...', active: true },
                      { text: 'Optimizing theme parameters...', active: false }
                      ];
                    case 3:
                      return [
                      { text: 'Writing Dashboard.jsx...', active: true },
                      { text: 'Generating Chart modules...', active: false }
                      ];
                    case 4:
                      return [
                      { text: 'Validating build compiler outputs...', active: true },
                      { text: 'Checking syntax exceptions...', active: false }
                      ];
                    default:
                      return [];
                  }
                };

                return (
                  <div key={idx} className={`flex gap-4 ${idx !== agentSteps.length - 1 ? 'mb-5' : ''} relative z-10 items-start`}>
                    
                    {/* Circle Bullet Badge */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 select-none
                      ${step.status === 'completed' ? 'border border-[#10b981] bg-[#10b981]/15 text-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.2)]' :
                        step.status === 'active' ? 'border border-[#818cf8] bg-[#818cf8]/10 text-primary shadow-[0_0_12px_rgba(99,102,241,0.3)] relative animate-[pulse_2.5s_infinite]' :
                        'border border-white/10 bg-white/[0.02] text-white/20'}`}>
                      
                      {step.status === 'completed' && <span className="material-symbols-outlined text-[#10b981] text-[12px] font-bold">check</span>}
                      {step.status === 'active' && <span className="w-2.5 h-2.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>}
                      {step.status === 'pending' && <span className="material-symbols-outlined text-[11px] opacity-15">shield</span>}
                    </div>
                    
                    {/* Circle Label Content */}
                    {step.status === 'active' ? (
                      /* Active step progress card */
                      <div className="flex-1 flex flex-col gap-2 w-full bg-[#11111a]/80 border border-white/[0.08] rounded-xl p-3.5 shadow-[inset_0_0_15px_rgba(0,0,0,0.4)]">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-code-md text-white font-extrabold tracking-wide">
                            {step.label}
                          </span>
                          <span className="text-[10px] font-code-md text-outline/40">
                            Running...
                          </span>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-2 pl-0.5 font-code-md text-[11px]">
                          {getSubSteps(step.id).map((sub, sidx) => (
                            <div key={sidx} className={`flex items-center gap-2 ${sub.active ? 'text-white' : 'text-[#918fa1]/40'}`}>
                              <span className={`w-1 h-1 rounded-full ${sub.active ? 'bg-primary' : 'bg-outline/20'}`} />
                              <span>{sub.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Completed or Pending timeline items */
                      <div className="flex-1 flex items-center justify-between pt-0.5">
                        <span className={`text-[12px] font-code-md ${step.status === 'completed' ? 'text-white/95 font-semibold' : 'text-[#918fa1]/30 font-medium'}`}>
                          {step.label}
                        </span>
                        {step.status === 'completed' && step.time && (
                          <span className="text-[10px] font-code-md text-outline/40 select-none">
                            {step.time}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Insanely Premium Input Console Panel */}
      <div className="p-4 md:p-5 bg-gradient-to-t from-[#030306] to-[#08080c]/95 border-t border-white/5 relative z-20 select-none">
        
        {/* Double-border Neon Glowing container */}
        <div className="p-[1px] bg-gradient-to-r from-white/10 via-white/5 to-white/10 focus-within:from-[#6366f1] focus-within:via-[#a855f7] focus-within:to-[#4edea3] rounded-[18px] transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(0,0,0,0.4)] focus-within:shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden group">
          
          {/* Subtle Ambient Light Focal Points inside the card */}
          <div className="absolute top-[-30px] left-[-30px] w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none group-focus-within:bg-[#6366f1]/15 group-focus-within:scale-125 transition-all duration-500" />
          <div className="absolute bottom-[-30px] right-[-30px] w-24 h-24 bg-tertiary/10 rounded-full blur-2xl pointer-events-none group-focus-within:bg-[#4edea3]/15 group-focus-within:scale-125 transition-all duration-500" />

          {/* Actual Console Inner Container */}
          <div className="flex flex-col bg-[#08080d]/95 rounded-[17px] p-4.5 gap-4 relative z-10">
            
            {/* Input Text Field */}
            <textarea 
              rows="3"
              className="w-full bg-transparent pl-3.5 pr-3.5 text-[13px] font-body text-white placeholder:text-[#918fa1]/45 focus:outline-none select-text resize-none leading-relaxed scrollbar-none font-medium" 
              placeholder="Ask FrameForge to build, edit, or refactor anything..." 
              value={input}
              disabled={isGenerating}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            {/* Bottom Action bar containing tools & send button */}
            <div className="flex items-center justify-between border-t border-white/[0.04] pt-3 select-none">
              <div className="flex flex-wrap items-center gap-2">
                {/* Model Selector Pill */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12121b]/80 border border-white/5 hover:border-white/10 hover:bg-[#161622] transition-colors cursor-pointer text-outline hover:text-white shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] shadow-[0_0_8px_#4edea3]"></span>
                  <span className="text-[10px] font-code-md tracking-wider font-semibold text-white/95">Gemini 1.5 Pro</span>
                  <span className="material-symbols-outlined text-[12px] ml-0.5">keyboard_arrow_down</span>
                </div>
                
                {/* Mock Search Pill (Perplexity-style premium tool pill) */}
                <div className="hidden xs:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#12121b]/80 border border-white/5 hover:border-primary/20 hover:bg-[#161622] transition-all cursor-pointer text-outline hover:text-white group/pill shadow-sm">
                  <span className="material-symbols-outlined text-[13px] text-primary/65 group-hover/pill:text-primary group-hover/pill:rotate-12 transition-transform">language</span>
                  <span className="text-[10px] font-code-md tracking-wider font-semibold">Deep Search</span>
                </div>

                <span className="h-4 w-px bg-white/10 mx-1"></span>

                {/* Tool Actions */}
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-xl bg-white/[0.01] hover:bg-white/5 border border-transparent hover:border-white/5 text-outline/50 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95" title="Attach design asset (Ctrl+U)">
                    <span className="material-symbols-outlined text-[15.5px]">attach_file</span>
                  </button>
                  <button className="p-2 rounded-xl bg-white/[0.01] hover:bg-white/5 border border-transparent hover:border-white/5 text-outline/50 hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-95" title="Voice dictation">
                    <span className="material-symbols-outlined text-[15.5px]">mic</span>
                  </button>
                </div>
              </div>

              {/* Circular Glowing Send Button */}
              <button 
                disabled={!input.trim() || isGenerating}
                onClick={() => handleSend()}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-primary to-[#6366f1] hover:from-[#7c3aed] hover:to-[#4f46e5] text-white disabled:opacity-15 disabled:hover:scale-100 disabled:hover:shadow-none hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all cursor-pointer flex items-center justify-center active:scale-95 hover:scale-105 group border border-white/15 shadow-md flex-shrink-0"
                title="Send instructions"
              >
                <span className="material-symbols-outlined text-[16px] group-hover:-translate-y-0.5 transition-transform font-extrabold text-white">arrow_upward</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
