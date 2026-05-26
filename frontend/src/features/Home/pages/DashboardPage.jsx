import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import FilesPanel from '../components/FilesPanel';
import PreviewPanel from '../components/PreviewPanel';
import TerminalPanel from '../components/TerminalPanel';
import AIPanel from '../components/AIPanel';
import { useHome } from '../hooks/useHome';

export default function DashboardPage() {
  const homeState = useHome();
  const navigate = useNavigate();

  // Custom Pixel-based Width and Height States
  const [filesWidth, setFilesWidth] = useState(260);      // Files Panel width in px
  const [aiWidth, setAiWidth] = useState(350);            // AI Panel width in px
  const [terminalHeight, setTerminalHeight] = useState(240); // Terminal Panel height in px

  // Redirect to landing page if no sandbox session is active
  useEffect(() => {
    if (!homeState.sandboxId) {
      navigate('/');
    }
  }, [homeState.sandboxId, navigate]);

  // Drag Resizing Handler for Left (Files) Panel
  const handleFilesMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = filesWidth;

    const handleMouseMove = (moveEvent) => {
      // Impose boundaries: min 180px, max 400px
      const newWidth = Math.max(180, Math.min(400, startWidth + (moveEvent.clientX - startX)));
      setFilesWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Drag Resizing Handler for Right (AI) Panel
  const handleAiMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = aiWidth;

    const handleMouseMove = (moveEvent) => {
      // Impose boundaries: min 280px, max 500px
      const newWidth = Math.max(280, Math.min(500, startWidth - (moveEvent.clientX - startX)));
      setAiWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Drag Resizing Handler for Center-Bottom (Terminal) Panel
  const handleTerminalMouseDown = (e) => {
    e.preventDefault();
    const startY = e.clientY;
    const startHeight = terminalHeight;

    const handleMouseMove = (moveEvent) => {
      // Impose boundaries: min 140px, max 500px
      const newHeight = Math.max(140, Math.min(500, startHeight - (moveEvent.clientY - startY)));
      setTerminalHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030306] text-on-background flex flex-col font-sans select-none" id="dashboard-page">
      {/* Deep-Space Mesh Background Grid & Noise */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-35 bg-noise" />
      <div className="absolute inset-0 pointer-events-none z-0 opacity-30 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* Premium Dashboard Top Workspace Header */}
      <header className="w-full h-16 flex-shrink-0 bg-[#08080c]/85 border-b border-white/5 px-6 md:px-8 flex items-center justify-between z-30 select-none backdrop-blur-xl relative shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6366f1] to-[#4edea3] flex items-center justify-center border border-white/20 shadow-[0_0_15px_rgba(99,102,241,0.4)]">
            <span className="material-symbols-outlined text-white text-[15px] animate-[pulse_3s_infinite]" style={{ fontVariationSettings: "'FILL' 1" }}>diamond</span>
          </div>
          <span className="font-display font-black text-[13px] uppercase tracking-[0.2em] text-white">FrameForge</span>
          <span className="h-4 w-px bg-white/10 mx-2"></span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-code-md text-outline tracking-wider font-bold">V1.2 PRO</span>
        </div>

        {/* Center: Sandbox Pod Address Info */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer group">
          <span className="material-symbols-outlined text-primary text-[14px] group-hover:rotate-12 transition-transform">cloud_sync</span>
          <span className="text-[12px] font-code-md text-[#e4e1ee] font-semibold">workspace-pod-{homeState.sandboxId ? homeState.sandboxId.slice(0, 8) : 'allocating'}</span>
          <span className="material-symbols-outlined text-outline/40 text-[12px] group-hover:text-white transition-colors ml-1">edit</span>
        </div>

        {/* Right Status Beacon & Workspace Profiles */}
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.02] border border-white/5 font-code-md text-[11px]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3] shadow-[0_0_8px_#4edea3]"></span>
            </span>
            <span className="text-white/80 font-bold">API Active</span>
            <span className="text-outline/40 ml-1">12ms</span>
          </div>

          <button 
            onClick={() => {
              if (homeState.previewUrl) {
                navigator.clipboard.writeText(homeState.previewUrl);
                alert("Preview URL copied to clipboard!");
              }
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-primary-container/20 border border-white/5 hover:border-white/10 transition-all text-[11.5px] font-bold font-code-md text-[#c3c0ff] hover:text-white cursor-pointer active:scale-95 group shadow-sm"
          >
            <span className="material-symbols-outlined text-[13px] group-hover:rotate-12 transition-transform">share</span>
            Share
          </button>

          <span className="h-6 w-px bg-white/10"></span>

          {/* Styled Developer Badge */}
          <div className="relative cursor-pointer group select-none">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#ec4899] flex items-center justify-center font-bold text-white text-[12.5px] tracking-wider border border-white/20 shadow-md group-hover:scale-105 transition-transform">
              RH
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#4edea3] border-[2.5px] border-[#08080c] shadow-[0_0_5px_rgba(78,222,163,0.8)]" />
          </div>
        </div>
      </header>

      {/* Main Panels Layout Container */}
      <div className="flex-1 min-h-0 w-full relative overflow-hidden px-6 md:px-8 pt-4 pb-4 md:pt-5 md:pb-5 gap-4 z-10 flex items-stretch">
        {/* Harmonious Ambient Glow Nodes */}
        <div className="absolute w-[600px] h-[600px] rounded-full bg-primary-container/10 blur-[130px] pointer-events-none top-[-250px] left-[-150px] animate-ambient-glow" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-tertiary-container/5 blur-[130px] pointer-events-none bottom-[-300px] right-[10%] animate-ambient-glow" style={{ animationDelay: '-8s' }} />

        {/* Custom 3-Column Resizing Grid Layout */}
        
        {/* Left column: Files Explorer */}
        <motion.div 
          initial={{ opacity: 0, x: -25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: filesWidth }} 
          className="h-full flex-shrink-0 flex flex-col overflow-hidden"
        >
          <FilesPanel {...homeState} />
        </motion.div>

        {/* Resizer Divider: Files <=> Center */}
        <div 
          onMouseDown={handleFilesMouseDown}
          className="w-1.5 hover:w-2 bg-white/5 hover:bg-gradient-to-b hover:from-primary/30 hover:to-[#6366f1]/30 cursor-col-resize transition-all duration-300 flex items-center justify-center relative z-20 flex-shrink-0 rounded-xl my-2 hover:shadow-[0_0_12px_rgba(99,102,241,0.4)]"
          title="Drag to resize file explorer"
        >
          <div className="w-[2px] h-8 bg-white/20 rounded-full group-hover:bg-primary transition-colors"></div>
        </div>

        {/* Center column: Preview (top) + Resizer + Terminal (bottom) */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
          className="flex-1 min-w-0 h-full flex flex-col overflow-hidden gap-3"
        >
          {/* Top: Browser Preview Frame */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <PreviewPanel {...homeState} />
          </div>

          {/* Resizer Divider: Preview <=> Terminal */}
          <div 
            onMouseDown={handleTerminalMouseDown}
            className="h-1.5 hover:h-2 bg-white/5 hover:bg-gradient-to-r hover:from-primary/30 hover:to-[#6366f1]/30 cursor-row-resize transition-all duration-300 flex items-center justify-center relative z-20 flex-shrink-0 rounded-xl hover:shadow-[0_0_12px_rgba(99,102,241,0.4)]"
            title="Drag to resize terminal logs"
          >
            <div className="w-12 h-[2px] bg-white/20 rounded-full group-hover:bg-primary transition-colors"></div>
          </div>

          {/* Bottom: Terminal Log Frame */}
          <div 
            style={{ height: terminalHeight }} 
            className="flex-shrink-0 overflow-hidden"
          >
            <TerminalPanel {...homeState} />
          </div>
        </motion.div>

        {/* Resizer Divider: Center <=> AI */}
        <div 
          onMouseDown={handleAiMouseDown}
          className="w-1.5 hover:w-2 bg-white/5 hover:bg-gradient-to-b hover:from-primary/30 hover:to-[#6366f1]/30 cursor-col-resize transition-all duration-300 flex items-center justify-center relative z-20 flex-shrink-0 rounded-xl my-2 hover:shadow-[0_0_12px_rgba(99,102,241,0.4)]"
          title="Drag to resize AI chat"
        >
          <div className="w-[2px] h-8 bg-white/20 rounded-full group-hover:bg-primary transition-colors"></div>
        </div>

        {/* Right column: AI Companion */}
        <motion.div 
          initial={{ opacity: 0, x: 25 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
          style={{ width: aiWidth }} 
          className="h-full flex-shrink-0 flex flex-col overflow-hidden"
        >
          <AIPanel {...homeState} />
        </motion.div>
        
      </div>
    </div>
  );
}


