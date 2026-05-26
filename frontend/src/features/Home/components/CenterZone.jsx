import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import Editor from '@monaco-editor/react';

const VerticalResizeHandle = () => (
  <PanelResizeHandle className="h-3 group flex items-center justify-center cursor-row-resize outline-none z-20">
    <div className="w-12 h-0.5 rounded-full bg-outline-variant/30 group-hover:bg-primary group-active:bg-primary transition-colors shadow-sm"></div>
  </PanelResizeHandle>
);

export default function CenterZone({ sandbox, socketRef, terminalVersion, reconnectTerminal, fetchFiles, selectedFile, selectedFileContent, isLoadingFile, saveFile }) {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const [viewMode, setViewMode] = useState('pc');
  const [activeTab, setActiveTab] = useState('preview');
  const [isReloading, setIsReloading] = useState(false);
  const [isTerminalReloading, setIsTerminalReloading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // States for active file code editing
  const [editorValue, setEditorValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const isDirty = editorValue !== (selectedFileContent || '');

  // Keep a fresh reference to bypass stale closure inside third-party editor callbacks
  const saveRef = useRef(null);
  saveRef.current = { selectedFile, editorValue, isDirty, isSaving, saveFile };

  // Synchronize editor content when selected file content changes
  useEffect(() => {
    setEditorValue(selectedFileContent || '');
  }, [selectedFileContent]);

  // Auto-switch to Code tab when a file is selected
  useEffect(() => {
    if (selectedFile) {
      setActiveTab('code');
    }
  }, [selectedFile]);

  const handleEditorChange = (value) => {
    setEditorValue(value || '');
  };

  const handleSave = async () => {
    const fresh = saveRef.current;
    if (!fresh.selectedFile || !fresh.isDirty || fresh.isSaving) return;
    setIsSaving(true);
    if (fresh.saveFile) {
      const res = await fresh.saveFile(fresh.selectedFile, fresh.editorValue);
      if (res.success) {
        console.log('File saved successfully');
      } else {
        alert(`Failed to save file: ${res.error}`);
      }
    }
    setIsSaving(false);
  };

  const handleEditorDidMount = (editor, monaco) => {
    // Add command Cmd/Ctrl + S to trigger handleSave using the fresh ref state
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });
  };

  useEffect(() => {
    if (!sandbox || !socketRef || !socketRef.current || !terminalRef.current) return;

    // Initialize xterm with transparent background, JetBrains Mono, white cursor, and 1.5 line height
    const term = new Terminal({
      theme: {
        background: 'transparent',
        foreground: '#ffffff',
        cursor: '#ffffff',
        cursorBlink: '#ffffff',
        selectionBackground: 'rgba(255, 255, 255, 0.15)',
        black: '#000000',
        red: '#ff5f56',
        green: '#a1a1aa',
        yellow: '#ffbd2e',
        blue: '#e4e4e7',
        magenta: '#ffffff',
        cyan: '#ffffff',
        white: '#ffffff',
      },
      fontFamily: '"JetBrains Mono", monospace',
      fontSize: 13,
      cursorBlink: true,
      lineHeight: 1.5,
    });
    
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    
    // Output initial bash prompt matching the sandbox ID
    term.write(`root@sandbox-pod-${sandbox.sandboxId}:/workspace# `);
    
    const handleFit = () => {
      if (terminalRef.current && terminalRef.current.clientWidth > 0 && terminalRef.current.clientHeight > 0) {
        try {
          fitAddon.fit();
        } catch (e) {
          // Ignore transient measurement errors
        }
      }
    };

    // Slight delay to ensure DOM is ready for measuring
    setTimeout(handleFit, 50);
    
    const resizeObserver = new ResizeObserver(handleFit);
    resizeObserver.observe(terminalRef.current);

    const socket = socketRef.current;
    
    socket.on('terminal-output', (data) => {
      term.write(data);
    });

    term.onData((data) => {
      socket.emit('terminal-input', data);
    });
    
    xtermRef.current = term;

    return () => {
      resizeObserver.disconnect();
      term.dispose();
      socket.off('terminal-output');
    };
  }, [sandbox, socketRef, terminalVersion]);

  const handleReload = () => {
    if (isReloading) return;
    setIsReloading(true);
    // Change the key to force iframe remount/reload
    setIframeKey(prev => prev + 1);
    // Fetch dynamic files from listFiles API
    if (sandbox?.sandboxId && fetchFiles) {
      fetchFiles(sandbox.sandboxId);
    }
    setTimeout(() => {
      setIsReloading(false);
    }, 800);
  };

  const handleReconnectTerminal = async () => {
    if (isTerminalReloading) return;
    setIsTerminalReloading(true);
    if (reconnectTerminal) {
      await reconnectTerminal();
    }
    setTimeout(() => {
      setIsTerminalReloading(false);
    }, 800);
  };

  return (
    <motion.main
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 h-full overflow-hidden z-10 relative"
    >
      <PanelGroup orientation="vertical">
        <Panel defaultSize={60} minSize={30}>
          <div className="w-full h-full bg-surface/70 backdrop-blur-md border border-outline-variant/20 rounded-2xl flex flex-col overflow-hidden shadow-lg relative">
             <header className="flex items-center justify-between px-4 py-2.5 bg-[#0d0d11] border-b border-white/5 z-20 select-none">
              {/* Left: macOS Window Traffic Lights & Navigation Controls */}
              <div className="flex items-center gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-90 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-90 shadow-sm" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f] opacity-90 shadow-sm" />
                </div>
                
                {/* Safari style Back/Forward arrows */}
                <div className="hidden sm:flex items-center gap-1 text-outline/40">
                  <span className="material-symbols-outlined text-[18px] cursor-not-allowed">chevron_left</span>
                  <span className="material-symbols-outlined text-[18px] cursor-not-allowed">chevron_right</span>
                </div>
              </div>

              {/* Center: Safari Unified Smart Address Bar */}
              <div className="flex-1 max-w-[400px] min-w-[120px] mx-4 relative">
                <div className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/5 focus-within:border-white/15 transition-all rounded-lg px-3 py-1 text-center group">
                  <div className="flex items-center gap-1.5 text-outline/65 text-center mx-auto truncate max-w-full">
                    <span className="material-symbols-outlined text-[13px] text-[#a1a1aa]">lock</span>
                    <span className="font-body-sm text-[11px] text-[#e4e4e7] tracking-wide truncate" title={sandbox?.previewUrl || 'Waiting...'}>
                      {sandbox?.previewUrl ? new URL(sandbox.previewUrl).host : 'Loading sandbox...'}
                    </span>
                  </div>
                  <button 
                    onClick={handleReload} 
                    className="flex items-center text-outline/60 hover:text-white transition-colors cursor-pointer"
                    title="Reload Page"
                  >
                    <span className={`material-symbols-outlined text-[14px] ${isReloading ? 'animate-spin' : ''}`}>refresh</span>
                  </button>
                </div>
              </div>

              {/* Right: Tab Mode, View Controls & active file tag */}
              <div className="flex items-center gap-3">
                {/* PC/Mobile switchers */}
                <div className="flex bg-white/5 rounded-lg border border-white/5 overflow-hidden p-0.5">
                  <button 
                    onClick={() => setViewMode('pc')} 
                    className={`px-2 py-1 rounded-md transition-all flex items-center ${viewMode === 'pc' ? 'bg-white/10 text-white shadow-sm' : 'text-outline/60 hover:text-white'}`}
                    title="Desktop View"
                  >
                    <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
                  </button>
                  <button 
                    onClick={() => setViewMode('mobile')} 
                    className={`px-2 py-1 rounded-md transition-all flex items-center ${viewMode === 'mobile' ? 'bg-white/10 text-white shadow-sm' : 'text-outline/60 hover:text-white'}`}
                    title="Mobile View"
                  >
                    <span className="material-symbols-outlined text-[14px]">smartphone</span>
                  </button>
                </div>

                {/* Tab Switchers (Preview / Code) */}
                <div className="flex bg-white/5 rounded-lg p-0.5 border border-white/5">
                  <button 
                    onClick={() => setActiveTab('preview')}
                    className={`px-3 py-1 rounded-md font-label-caps text-[11px] tracking-wider transition-all flex items-center gap-1.5 ${activeTab === 'preview' ? 'bg-white text-black font-bold shadow-md' : 'text-outline/70 hover:text-white'}`}
                  >
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                    Preview
                  </button>
                  <button 
                    onClick={() => setActiveTab('code')}
                    className={`px-3 py-1 rounded-md font-label-caps text-[11px] tracking-wider transition-all flex items-center gap-1.5 ${activeTab === 'code' ? 'bg-white text-black font-bold shadow-md' : 'text-outline/70 hover:text-white'}`}
                  >
                    <span className="material-symbols-outlined text-[14px]">code</span>
                    Code
                  </button>
                </div>

                {/* File context & save button if code tab is open */}
                {selectedFile && activeTab === 'code' && (
                  <div className="flex items-center gap-1.5 ml-1.5">
                    <div className="flex items-center bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 font-label-caps text-[10px] text-[#e4e4e7] gap-1.5">
                      <span className="material-symbols-outlined text-outline text-[13px]">javascript</span>
                      <span className="truncate max-w-[80px]">{selectedFile.split('/').pop()}</span>
                    </div>
                    <button
                      onClick={handleSave}
                      disabled={!isDirty || isSaving}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-bold font-code-md text-[10px] active:scale-95 ${
                        isDirty
                          ? 'bg-white text-black hover:bg-white/95 cursor-pointer shadow-md'
                          : 'bg-white/5 text-[#a1a1aa]/40 cursor-not-allowed border border-white/5 shadow-none'
                      }`}
                      title="Save File (Ctrl+S)"
                    >
                      <span className={`material-symbols-outlined text-[13px] ${isSaving ? 'animate-spin' : ''}`}>{isSaving ? 'progress_activity' : 'save'}</span>
                      {isSaving ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
            </header>
            <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center p-4">
              <motion.div 
                animate={{ 
                  width: viewMode === 'mobile' ? 'auto' : '100%', 
                  height: viewMode === 'mobile' ? '100%' : '100%',
                  maxHeight: viewMode === 'mobile' ? 850 : '100%',
                  aspectRatio: viewMode === 'mobile' ? '696/850' : 'auto',
                  borderRadius: viewMode === 'mobile' ? 40 : 8
                }}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                className="border border-outline-variant/20 relative overflow-hidden bg-surface-dim flex flex-col shadow-2xl group max-h-full max-w-full"
              >
                {/* Simulated Reload Overlay */}
                <motion.div 
                  initial={false}
                  animate={{ opacity: isReloading ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute inset-0 bg-black z-30 pointer-events-none"
                />

                {activeTab === 'preview' ? (
                  sandbox?.previewUrl ? (
                    <iframe 
                      key={iframeKey}
                      src={sandbox.previewUrl} 
                      className="absolute inset-0 w-full h-full border-none z-10 bg-white" 
                      title="Preview"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center z-10 bg-surface-dim">
                      <div className="flex flex-col items-center gap-4">
                        <span className="material-symbols-outlined animate-spin text-[40px] text-primary">progress_activity</span>
                        <span className="font-label-caps text-outline">Starting Sandbox Environment...</span>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="absolute inset-0 w-full h-full z-10 bg-[#1e1e1e] flex flex-col">
                    {isLoadingFile ? (
                      <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1e1e] gap-3 text-outline">
                        <span className="material-symbols-outlined animate-spin text-3xl text-primary">progress_activity</span>
                        <span className="font-label-caps text-[12px]">Loading file content...</span>
                      </div>
                    ) : selectedFile ? (
                      <div className="flex-1 w-full h-full relative overflow-hidden">
                        <Editor
                          height="100%"
                          theme="vs-dark"
                          language={
                            selectedFile.endsWith('.json') ? 'json' :
                            selectedFile.endsWith('.css') ? 'css' :
                            selectedFile.endsWith('.html') ? 'html' :
                            'javascript'
                          }
                          value={editorValue}
                          onChange={handleEditorChange}
                          onMount={handleEditorDidMount}
                          options={{
                            readOnly: false,
                            minimap: { enabled: true },
                            fontSize: 13,
                            fontFamily: '"JetBrains Mono", monospace',
                            scrollbar: {
                              vertical: 'hidden',
                              horizontal: 'hidden',
                              verticalScrollbarSize: 0,
                              horizontalScrollbarSize: 0,
                              handleMouseWheel: true
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center bg-[#1e1e1e] gap-3 text-outline/50">
                        <span className="material-symbols-outlined text-[40px]">description</span>
                        <span className="font-label-caps text-[12px]">Select a file from the explorer to view code</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </Panel>

        <VerticalResizeHandle />

        <Panel defaultSize={40} minSize={20}>
          <div className="w-full h-full bg-gradient-to-b from-[#0b0b12] to-[#040407] border border-white/5 rounded-2xl flex flex-col overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative">
            <header className="flex items-center px-4 py-3 bg-[#101018]/95 backdrop-blur-md border-b border-white/5 z-10 justify-between select-none shadow-sm">
              <div className="flex items-center gap-2">
                {/* Status Beacon */}
                <div className="relative flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white absolute animate-ping opacity-75"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]"></span>
                </div>
                <span className="material-symbols-outlined text-outline/80 text-[15px]">terminal</span>
                <span className="font-label-caps text-[9px] text-[#e4e1ee] tracking-[0.2em] font-bold">TERMINAL</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Clear Terminal Display */}
                <button 
                  onClick={() => {
                    if (xtermRef.current) {
                      xtermRef.current.clear();
                      xtermRef.current.write('\r\x1b[32m[Console cleared by user]\x1b[0m\r\n');
                      xtermRef.current.write(`root@sandbox-pod-${sandbox?.sandboxId || 'sandbox'}:/workspace# `);
                    }
                  }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all text-outline hover:text-white text-[10px] font-bold font-code-md cursor-pointer active:scale-95"
                  title="Clear Terminal Display"
                >
                  <span className="material-symbols-outlined text-[12px]">mop</span>
                  Clear
                </button>

                {/* Terminal Reconnect Button */}
                <button 
                  onClick={handleReconnectTerminal} 
                  disabled={isTerminalReloading}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-primary-container/20 border border-white/5 transition-all text-outline hover:text-white text-[10px] font-bold font-code-md cursor-pointer active:scale-95 group disabled:opacity-50"
                  title="Reconnect Terminal Socket"
                >
                  <span className={`material-symbols-outlined text-[12px] group-hover:text-primary group-hover:rotate-180 transition-all duration-500 ${isTerminalReloading ? 'animate-spin' : ''}`}>autorenew</span>
                  Reconnect
                </button>
              </div>
            </header>
            
            {/* The xterm container with original scanlines CRT styling */}
            <div className="flex-1 min-h-0 relative z-10 bg-transparent scanlines">
              <div ref={terminalRef} className="absolute inset-3 overflow-hidden" />
              {!sandbox && (
                <div className="absolute inset-0 flex items-center justify-center text-outline font-code-sm bg-black/60 backdrop-blur-sm z-30">
                  Connecting to terminal...
                </div>
              )}
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </motion.main>
  );
}
