import React, { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default function TerminalPanel({ terminalRef, handleTerminalInput, reconnectTerminal }) {
  const terminalContainer = useRef(null);

  useEffect(() => {
    if (!terminalContainer.current) return;

    const term = new Terminal({
      theme: {
        background: 'transparent',
        foreground: '#e4e1ee',
        cursor: '#4edea3',
        cursorBlink: '#4edea3',
        selectionBackground: 'rgba(99, 102, 241, 0.4)',
        black: '#000000',
        red: '#ff5f56',
        green: '#27c93f',
        yellow: '#ffbd2e',
        blue: '#6366f1',
        magenta: '#ff79c6',
        cyan: '#8be9fd',
        white: '#ffffff',
      },
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 13,
      cursorBlink: true,
      lineHeight: 1.5,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    
    term.open(terminalContainer.current);
    fitAddon.fit();

    terminalRef.current = term;

    term.onData(data => {
      handleTerminalInput(data);
    });

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalContainer.current);

    return () => {
      resizeObserver.disconnect();
      term.dispose();
    };
  }, [terminalRef, handleTerminalInput]);

  return (
    <div className="flex-1 bg-gradient-to-b from-[#0b0b12] to-[#040407] h-full flex flex-col overflow-hidden relative border border-white/5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-[-50px] left-[20%] w-64 h-64 bg-tertiary-container/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Premium Terminal Header */}
      <header className="flex items-center px-6 py-4 bg-[#101018]/95 backdrop-blur-md border-b border-white/5 select-none relative z-10 shadow-sm justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Status Beacon */}
            <div className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] absolute animate-ping opacity-75"></span>
              <span className="w-2 h-2 rounded-full bg-[#4edea3] shadow-[0_0_8px_rgba(78,222,163,0.9)]"></span>
            </div>
            <span className="material-symbols-outlined text-outline/60 text-[15px]">terminal</span>
            <span className="font-label-caps text-[9px] text-[#e4e1ee] tracking-[0.2em] font-bold">TERMINAL</span>
          </div>

          {/* Premium Multiple Shell Tabs visual mockup */}
          <div className="hidden sm:flex items-center gap-1.5 p-0.5 rounded-xl bg-black/40 border border-white/5">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#161622] border border-white/5 text-[11px] font-code-md text-white font-bold cursor-pointer">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
              <span>sh (main)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 text-[11px] font-code-md text-outline hover:text-white cursor-pointer hover:bg-white/[0.02] rounded-lg transition-all">
              <span className="w-1.5 h-1.5 rounded-full bg-outline/40" />
              <span>npm run dev</span>
            </div>
            <div className="p-1 text-outline hover:text-white cursor-pointer transition-colors flex items-center justify-center" title="Split pane">
              <span className="material-symbols-outlined text-[13px]">add</span>
            </div>
          </div>
        </div>
        
        {/* Actions & Controls */}
        <div className="flex items-center gap-3">
          
          {/* Quick shell control tags */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                if (terminalRef.current) {
                  terminalRef.current.clear();
                  terminalRef.current.write('\r\x1b[32m[Console cleared by user]\x1b[0m\r\n');
                  const currentSandboxId = localStorage.getItem('ff_sandbox_id') || '';
                  terminalRef.current.write(`root@sandbox-pod-${currentSandboxId.slice(0, 8)}:/workspace# `);
                }
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-outline hover:text-white text-[10px] font-bold font-code-md cursor-pointer active:scale-95"
              title="Clear Terminal Display"
            >
              <span className="material-symbols-outlined text-[12px]">mop</span>
              Clear
            </button>

            <button 
              onClick={reconnectTerminal}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-primary-container/20 border border-white/5 transition-all text-outline hover:text-white text-[10px] font-bold font-code-md cursor-pointer active:scale-95 group"
              title="Reset Shell Session"
            >
              <span className="material-symbols-outlined text-[12px] group-hover:text-primary group-hover:rotate-180 transition-all duration-500">autorenew</span>
              Reset
            </button>
          </div>

          <span className="h-4 w-px bg-white/10"></span>

          {/* Standard window dots (pure decorative visual premium) */}
          <div className="flex gap-1.5 items-center group">
            <span className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-[#ff5f56] transition-colors duration-300"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-[#ffbd2e] transition-colors duration-300"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-white/10 group-hover:bg-[#27c93f] transition-colors duration-300"></span>
          </div>
        </div>
      </header>
      
      {/* Terminal Viewport */}
      <div className="flex-1 relative z-10 p-4.5 bg-transparent scanlines">
        <div ref={terminalContainer} className="w-full h-full overflow-hidden" />
      </div>
    </div>
  );
}
