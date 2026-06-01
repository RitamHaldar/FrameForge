import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import Editor from '@monaco-editor/react';
import { registerCompletion } from 'monacopilot';
import { FileCode2, FileJson, FileImage, FileText, File, FolderOpen } from 'lucide-react';

const VerticalResizeHandle = () => (
  <PanelResizeHandle className="h-3 group flex items-center justify-center cursor-row-resize outline-none z-20">
    <div className="w-12 h-0.5 rounded-full bg-outline-variant/30 group-hover:bg-primary group-active:bg-primary transition-colors shadow-sm"></div>
  </PanelResizeHandle>
);

const getFileIcon = (filename) => {
  if (!filename) return <File className="w-3.5 h-3.5 text-outline/50" />;
  const name = filename.toLowerCase();
  if (name.endsWith('.jsx') || name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.tsx')) {
    return <FileCode2 className="w-3.5 h-3.5 text-[#ffbd2e]" />; // warm gold for JS/TS
  }
  if (name.endsWith('.json')) {
    return <FileJson className="w-3.5 h-3.5 text-[#27c93f]" />; // bright green for JSON
  }
  if (name.endsWith('.css')) {
    return <FileCode2 className="w-3.5 h-3.5 text-[#2d9cdb]" />; // blue for CSS
  }
  if (name.endsWith('.html')) {
    return <FileCode2 className="w-3.5 h-3.5 text-[#ff5f56]" />; // red-orange for HTML
  }
  if (name.match(/\.(png|jpe?g|svg|gif|webp)$/)) {
    return <FileImage className="w-3.5 h-3.5 text-[#a1a1aa]" />; // silver for images
  }
  if (name.endsWith('.md') || name.endsWith('.txt')) {
    return <FileText className="w-3.5 h-3.5 text-[#bbbbbb]" />;
  }
  return <File className="w-3.5 h-3.5 text-outline/40" />;
};

export default function CenterZone({ sandbox, socketRef, terminalVersion, reconnectTerminal, fetchFiles, selectedFile, selectedFileContent, isLoadingFile, saveFile, maximizedPanel, setMaximizedPanel, files = [], onSelectFile, optimizeCode, isOptimizing }) {
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const previewTerminalRef = useRef(null);
  const previewXtermRef = useRef(null);
  const [viewMode, setViewMode] = useState('pc');
  const [activeTab, setActiveTab] = useState('preview');
  const [isReloading, setIsReloading] = useState(false);
  const [isTerminalReloading, setIsTerminalReloading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPreviewTerminal, setShowPreviewTerminal] = useState(false);
  const [mobileWidth, setMobileWidth] = useState(380);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!showPreviewTerminal || !sandbox || !socketRef || !socketRef.current || !previewTerminalRef.current) return;

    let term;
    let resizeObserver;
    let handleOutput;

    try {
      // Initialize xterm with transparent background, JetBrains Mono, white cursor, and 1.5 line height
      term = new Terminal({
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
        fontSize: 12,
        cursorBlink: true,
        lineHeight: 1.5,
      });

      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(previewTerminalRef.current);

      // Output initial bash prompt matching the sandbox ID
      term.write(`root@sandbox-pod-${sandbox.sandboxId}:/workspace# `);

      const handleFit = () => {
        if (previewTerminalRef.current && previewTerminalRef.current.clientWidth > 0 && previewTerminalRef.current.clientHeight > 0) {
          try {
            fitAddon.fit();
          } catch (e) {
            // Ignore transient measurement errors
          }
        }
      };

      setTimeout(handleFit, 150); // wait for spring layout animation to settle

      resizeObserver = new ResizeObserver(handleFit);
      resizeObserver.observe(previewTerminalRef.current);

      const socket = socketRef.current;

      handleOutput = (data) => {
        term.write(data);
      };

      socket.on('terminal-output', handleOutput);

      term.onData((data) => {
        socket.emit('terminal-input', data);
      });

      previewXtermRef.current = term;
    } catch (err) {
      console.error("Failed to initialize preview terminal:", err);
    }

    return () => {
      try {
        if (resizeObserver) resizeObserver.disconnect();
        if (term) term.dispose();
        if (socketRef.current && handleOutput) {
          socketRef.current.off('terminal-output', handleOutput);
        }
      } catch (err) {
        console.error("Cleanup error in preview terminal:", err);
      }
    };
  }, [showPreviewTerminal, sandbox, socketRef, terminalVersion]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [editorValue, setEditorValue] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const showSuggestionsRef = useRef(false);

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

  const editorRef = useRef(null);
  const monacoRef = useRef(null);

  const handleOptimizeCode = async () => {
    if (!selectedFile || isOptimizing) return;
    try {
      const file = selectedFile;
      const language = file.endsWith('.json') ? 'json' :
                       file.endsWith('.css') ? 'css' :
                       file.endsWith('.html') ? 'html' :
                       'javascript';
      const cleanFilename = file.split(/[/\\]/).pop() || 'index.js';

      if (optimizeCode) {
        const res = await optimizeCode(editorValue, language, cleanFilename);
        if (res && res.success && res.optimizedCode) {
          setEditorValue(res.optimizedCode);
        }
      }
    } catch (err) {
      console.error('Failed to optimize code in editor:', err);
    }
  };

  const completionRegistrationRef = useRef(null);
  const lastRequestTimeRef = useRef(0);

  const registerCopilot = (editor, monaco, file) => {
    if (completionRegistrationRef.current) {
      try {
        completionRegistrationRef.current.deregister();
      } catch (err) {
        console.error('Error deregistering previous completion:', err);
      }
      completionRegistrationRef.current = null;
    }

    if (!editor || !monaco || !file) return;

    const filename = file.split(/[/\\]/).pop() || 'index.js';
    const language = file.endsWith('.json') ? 'json' :
                     file.endsWith('.css') ? 'css' :
                     file.endsWith('.html') ? 'html' :
                     'javascript';

    try {
      completionRegistrationRef.current = registerCompletion(monaco, editor, {
        language,
        filename,
        endpoint: window.location.origin + '/api/ai/code-completion',
        trigger: 'onIdle',
        triggerIf: () => {
          if (!showSuggestionsRef.current) return false;
          const now = Date.now();
          return now - lastRequestTimeRef.current >= 8000;
        },
        onCompletionRequested: () => {
          lastRequestTimeRef.current = Date.now();
        }
      });
    } catch (err) {
      console.error('Failed to register monacopilot inline completion:', err);
    }
  };

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleSave();
    });
    registerCopilot(editor, monaco, selectedFile);
  };

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      registerCopilot(editorRef.current, monacoRef.current, selectedFile);
    }
    return () => {
      if (completionRegistrationRef.current) {
        try {
          completionRegistrationRef.current.deregister();
        } catch (err) {
          console.error('Error during cleanup deregistration:', err);
        }
        completionRegistrationRef.current = null;
      }
    };
  }, [selectedFile]);

  useEffect(() => {
    if (!sandbox || !socketRef || !socketRef.current || !terminalRef.current) return;

    let term;
    let resizeObserver;
    let handleOutput;

    try {
      // Initialize xterm with transparent background, JetBrains Mono, white cursor, and 1.5 line height
      term = new Terminal({
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

      resizeObserver = new ResizeObserver(handleFit);
      resizeObserver.observe(terminalRef.current);

      const socket = socketRef.current;

      handleOutput = (data) => {
        term.write(data);
      };

      socket.on('terminal-output', handleOutput);

      term.onData((data) => {
        socket.emit('terminal-input', data);
      });

      xtermRef.current = term;
    } catch (err) {
      console.error("Failed to initialize main terminal:", err);
    }

    return () => {
      try {
        if (resizeObserver) resizeObserver.disconnect();
        if (term) term.dispose();
        if (socketRef.current && handleOutput) {
          socketRef.current.off('terminal-output', handleOutput);
        }
      } catch (err) {
        console.error("Cleanup error in main terminal:", err);
      }
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
      style={{ transform: maximizedPanel ? 'none' : undefined }}
      className="flex-1 h-full overflow-hidden z-10 relative"
    >
      <PanelGroup orientation="vertical">
        <Panel defaultSize={60} minSize={30}>
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className={`w-full h-full bg-surface-container/70 backdrop-blur-md border border-outline-variant/35 rounded-xl flex flex-col overflow-hidden shadow-lg ${maximizedPanel === 'preview'
              ? 'fixed inset-0 w-screen h-screen z-50 shadow-2xl border-none bg-surface-container rounded-none'
              : 'relative'
              }`}
          >
            <header className="flex items-center justify-between px-4 py-1.5 bg-surface-container-lowest border-b border-outline-variant/25 z-20 select-none h-11">
              {/* Left: Open in Editor / Close Editor Toggle Button */}
              <div className="flex items-center gap-3 z-20">
                <AnimatePresence mode="wait">
                  {maximizedPanel !== 'preview' ? (
                    <motion.button
                      key="btn-enlarge"
                      initial={{ opacity: 0, x: -12, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -12, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => setMaximizedPanel('preview')}
                      className="flex items-center gap-2 px-3 py-1 bg-primary/10 hover:bg-primary/20 border border-primary/20 hover:border-primary/45 text-primary hover:shadow-[0_0_15px_rgba(170,59,255,0.2)] transition-all duration-300 select-none active:scale-95 cursor-pointer font-bold font-mono-data text-[10px] tracking-wide h-7.5 rounded-lg shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" x2="14" y1="3" y2="10" /><line x1="3" x2="10" y1="21" y2="14" /></svg>
                      <span>Open in Editor</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      key="btn-minimize"
                      initial={{ opacity: 0, x: -12, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -12, scale: 0.95 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() => setMaximizedPanel(null)}
                      className="flex items-center gap-2 px-3 py-1 bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/35 text-on-surface hover:text-white transition-all duration-300 select-none active:scale-95 cursor-pointer font-bold font-mono-data text-[10px] tracking-wide h-7.5 rounded-lg shadow-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" /><line x1="14" x2="21" y1="10" y2="3" /><line x1="10" x2="3" y1="14" y2="21" /></svg>
                      <span>Close Editor</span>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Safari style Back/Forward arrows */}
                <div className="hidden sm:flex items-center gap-0.5 text-on-surface-variant/40">
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container-low hover:text-on-surface transition-all cursor-not-allowed">
                    <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                  </button>
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-surface-container-low hover:text-on-surface transition-all cursor-not-allowed">
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  </button>
                </div>
              </div>

              {/* Center: Safari Unified Smart Address Bar & Preview Terminal Toggle */}
              <div className="flex-1 max-w-[420px] min-w-[180px] mx-4 relative z-20 flex items-center justify-center gap-3">
                {!(activeTab === 'code' && maximizedPanel !== 'preview') ? (
                  <div className="flex-1 max-w-[220px]">
                    <div className="flex items-center justify-between bg-surface-container/70 hover:bg-surface-container border border-outline-variant/20 focus-within:border-outline/40 transition-all rounded-md px-3 h-7 text-center group">
                      <div className="flex items-center gap-1.5 text-on-surface-variant/80 text-center mx-auto truncate max-w-full">
                        <span className="material-symbols-outlined text-[11px]">lock</span>
                        <span className="font-mono-data text-[11px] text-on-surface tracking-wide truncate" title={sandbox?.previewUrl || 'Waiting...'}>
                          {sandbox?.previewUrl ? new URL(sandbox.previewUrl).host : 'Loading sandbox...'}
                        </span>
                      </div>
                      <button
                        onClick={handleReload}
                        className="flex items-center text-on-surface-variant/60 hover:text-primary transition-colors cursor-pointer"
                        title="Reload Page"
                      >
                        <span className={`material-symbols-outlined text-[12px] ${isReloading ? 'animate-spin' : ''}`}>refresh</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  selectedFile && (
                    <div className="flex items-center gap-2 bg-surface-container/40 border border-outline-variant/15 rounded-lg px-3 py-1 h-8 shadow-sm">
                      <div className="flex items-center bg-surface-container-lowest/80 px-2.5 py-0.5 rounded border border-outline-variant/20 font-label-caps text-[9px] text-on-surface gap-1.5 h-6">
                        <span className="material-symbols-outlined text-outline text-[11.5px]">javascript</span>
                        <span className="truncate max-w-[140px] font-semibold tracking-wide lowercase">{selectedFile.split(/[/\\]/).pop()}</span>
                      </div>
                      <button
                        onClick={handleSave}
                        disabled={!isDirty || isSaving}
                        className={`flex items-center gap-1.5 px-3 py-0.5 rounded transition-all font-bold font-mono-data text-[9.5px] h-6 active:scale-95 border ${isDirty
                          ? 'bg-primary text-on-primary border-primary hover:opacity-90 cursor-pointer shadow-md'
                          : 'bg-surface-container-lowest/50 text-on-surface-variant/35 border-outline-variant/15 cursor-not-allowed shadow-none'
                          }`}
                        title="Save File (Ctrl+S)"
                      >
                        <span className={`material-symbols-outlined text-[11px] ${isSaving ? 'animate-spin' : ''}`}>{isSaving ? 'progress_activity' : 'save'}</span>
                        {isSaving ? 'Saving' : 'Save'}
                      </button>
                    </div>
                  )
                )}

                {maximizedPanel === 'preview' && (
                  <button
                    onClick={() => setShowPreviewTerminal(!showPreviewTerminal)}
                    className={`flex items-center gap-1.5 px-3 h-7 rounded border font-label-caps text-[9px] font-bold cursor-pointer transition-all duration-300 select-none active:scale-95 whitespace-nowrap ${showPreviewTerminal
                      ? 'bg-primary text-on-primary border-primary hover:opacity-90 shadow-md'
                      : 'bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/40 text-primary'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">terminal</span>
                    <span>{showPreviewTerminal ? 'Hide Terminal' : 'Show Terminal'}</span>
                  </button>
                )}

                {maximizedPanel === 'preview' && selectedFile && (
                  <button
                    onClick={handleOptimizeCode}
                    disabled={isOptimizing}
                    className={`flex items-center gap-1.5 px-3 h-7 rounded border font-label-caps text-[9px] font-bold cursor-pointer transition-all duration-300 select-none active:scale-95 whitespace-nowrap ${isOptimizing
                      ? 'bg-primary/20 text-primary border-primary/20 cursor-not-allowed shadow-none'
                      : 'bg-primary/10 hover:bg-primary/20 border-primary/20 hover:border-primary/40 text-primary'
                      }`}
                  >
                    <span className={`material-symbols-outlined text-[12px] ${isOptimizing ? 'animate-spin' : ''}`}>
                      {isOptimizing ? 'progress_activity' : 'bolt'}
                    </span>
                    <span>{isOptimizing ? 'Optimizing...' : 'Optimize Code'}</span>
                  </button>
                )}

                {selectedFile && (
                  <button
                    onClick={() => {
                      const newValue = !showSuggestions;
                      setShowSuggestions(newValue);
                      showSuggestionsRef.current = newValue;
                    }}
                    className="flex items-center gap-1.5 px-2.5 h-7 rounded border border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-[9px] font-bold font-label-caps cursor-pointer active:scale-95 transition-all select-none whitespace-nowrap shadow-sm"
                    title={showSuggestions ? "Hide inline AI suggestions" : "Show inline AI suggestions"}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      showSuggestions 
                        ? 'bg-primary shadow-[0_0_6px_rgba(170,59,255,0.8)] animate-pulse' 
                        : 'bg-outline-variant/50'
                    }`} />
                    <span>{showSuggestions ? 'Show Suggestions' : 'Hide Suggestions'}</span>
                  </button>
                )}
              </div>

              {/* Right: Tab Mode, View Controls & active file tag */}
              <div className="flex items-center gap-2 z-20">


                {/* Mobile Preview Width Slider */}
                <AnimatePresence>
                  {maximizedPanel === 'preview' && viewMode === 'mobile' && (
                    <motion.div
                      initial={{ opacity: 0, width: 0, scale: 0.95 }}
                      animate={{ opacity: 1, width: 'auto', scale: 1 }}
                      exit={{ opacity: 0, width: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      className="flex items-center gap-2 bg-surface-container px-2.5 rounded-md border border-outline-variant/20 h-7 overflow-hidden shadow-sm"
                    >
                      <span className="font-mono-data text-[9px] text-outline/80 whitespace-nowrap">Width:</span>
                      <input
                        type="range"
                        min="320"
                        max="768"
                        value={mobileWidth}
                        onChange={(e) => setMobileWidth(Number(e.target.value))}
                        className="w-16 sm:w-24 accent-primary h-1 rounded bg-outline-variant/30 cursor-pointer focus:outline-none"
                      />
                      <span className="font-mono-data text-[9.5px] text-primary font-bold min-w-[34px] text-right">{mobileWidth}px</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tab Switchers (Preview / Code) or Save Option in enlarged modal */}
                {maximizedPanel === 'preview' ? (
                  selectedFile && (
                    <div className="flex items-center gap-1.5 bg-surface-container px-2 py-0.5 rounded-md border border-outline-variant/20 h-7">
                      <div className="flex items-center bg-surface-container-lowest px-2 py-0.5 rounded border border-outline-variant/25 font-label-caps text-[9px] text-on-surface gap-1.5 h-5.5">
                        <span className="material-symbols-outlined text-outline text-[11px]">javascript</span>
                        <span className="truncate max-w-[80px] font-semibold lowercase">{selectedFile.split(/[/\\]/).pop()}</span>
                      </div>
                      <button
                        onClick={handleSave}
                        disabled={!isDirty || isSaving}
                        className={`flex items-center gap-1 px-2.5 py-0.5 rounded transition-all font-bold font-mono-data text-[9px] h-5.5 active:scale-95 border ${isDirty
                          ? 'bg-primary text-on-primary border-primary hover:opacity-90 cursor-pointer shadow-md'
                          : 'bg-surface-container-lowest text-on-surface-variant/30 border-outline-variant/20 cursor-not-allowed shadow-none'
                          }`}
                        title="Save File (Ctrl+S)"
                      >
                        <span className={`material-symbols-outlined text-[11px] ${isSaving ? 'animate-spin' : ''}`}>{isSaving ? 'progress_activity' : 'save'}</span>
                        {isSaving ? 'Saving' : 'Save'}
                      </button>
                    </div>
                  )
                ) : (
                  <div className="flex bg-surface-container rounded-md p-0.5 border border-outline-variant/20 h-7">
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-2.5 rounded font-label-caps text-[10px] tracking-wider transition-all flex items-center gap-1.5 h-full ${activeTab === 'preview' ? 'bg-surface-container-high text-primary font-bold shadow-md border border-outline-variant/25' : 'text-on-surface-variant/75 hover:text-primary'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-95"><rect width="20" height="20" x="2" y="2" rx="2" /><path d="M2 10h20" /><circle cx="6" cy="6" r="0.75" /></svg>
                      Preview
                    </button>
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`px-2.5 rounded font-label-caps text-[10px] tracking-wider transition-all flex items-center gap-1.5 h-full ${activeTab === 'code' ? 'bg-surface-container-high text-primary font-bold shadow-md border border-outline-variant/25' : 'text-on-surface-variant/75 hover:text-primary'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-95"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
                      Code
                    </button>
                  </div>
                )}

                {/* Apple Share Button (Visual Premium detail) */}
                <div
                  className="w-7 h-7 flex items-center justify-center hover:bg-surface-container rounded-md text-on-surface-variant hover:text-primary transition-all cursor-pointer border border-transparent hover:border-outline-variant/20"
                  title="Share Preview URL"
                  onClick={() => {
                    if (sandbox?.previewUrl) {
                      navigator.clipboard.writeText(sandbox.previewUrl);
                      alert('Copied sandbox preview URL to clipboard!');
                    }
                  }}
                >
                  <span className="material-symbols-outlined text-[14px]">ios_share</span>
                </div>



                {/* Apple Revert Maximize button */}
                {maximizedPanel === 'preview' && (
                  <button
                    onClick={() => setMaximizedPanel(null)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 transition-all text-on-surface hover:text-primary active:scale-90 cursor-pointer shadow-sm ml-1"
                    title="Exit Fullscreen"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                )}
              </div>
            </header>
            <div className="flex-1 bg-black relative overflow-hidden flex items-center justify-center p-4">
              {maximizedPanel === 'preview' ? (
                <div className="flex flex-col md:flex-row w-full h-full gap-4">
                  {/* Left Column: Live Preview Frame */}
                  <div className="flex-1 h-full flex items-center justify-center relative bg-black min-w-0">
                    <motion.div
                      animate={{
                        width: viewMode === 'mobile' ? mobileWidth : '100%',
                        height: viewMode === 'mobile' ? '100%' : '100%',
                        maxHeight: viewMode === 'mobile' ? 850 : '100%',
                        borderRadius: viewMode === 'mobile' ? 40 : 8
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      className="border border-outline-variant/20 relative overflow-hidden bg-surface-dim flex flex-col shadow-2xl group max-h-full max-w-full w-full h-full"
                    >
                      {/* Simulated Reload Overlay */}
                      <motion.div
                        initial={false}
                        animate={{ opacity: isReloading ? 1 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 bg-black z-30 pointer-events-none"
                      />

                      {sandbox?.previewUrl ? (
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
                      )}
                    </motion.div>
                  </div>

                  {/* Right Column: Code Editor */}
                  <div className="flex-1 h-full flex flex-col border border-outline-variant/20 rounded-lg overflow-hidden bg-[#1e1e1e] min-w-0">
                    {/* Monaco Editor Header / Toolbar */}
                    <div className="flex items-center justify-between px-3 h-9 bg-[#181818] border-b border-outline-variant/20 select-none">
                      <div className="flex items-center gap-2">
                        {/* Custom Dropdown for File Picker */}
                        <div className="relative" ref={dropdownRef}>
                          <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#202020] hover:bg-[#282828] border border-outline-variant/20 transition-all text-on-surface text-[11px] font-mono-data cursor-pointer select-none active:scale-95 shadow-sm"
                          >
                            <span className="flex items-center gap-2 font-medium lowercase">
                              {getFileIcon(selectedFile)}
                              <span className="truncate max-w-[150px] font-semibold">{selectedFile ? selectedFile.split(/[/\\]/).pop() : 'select file'}</span>
                            </span>
                            <span className="material-symbols-outlined text-[13px] text-outline">unfold_more</span>
                          </button>

                          {/* Dropdown Menu Overlay */}
                          <AnimatePresence>
                            {isDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.95 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                                className="absolute left-0 mt-1.5 w-64 max-h-72 overflow-y-auto bg-[#181818]/95 border border-outline-variant/35 rounded-md shadow-2xl z-40 py-1 backdrop-blur-lg scrollbar-thin select-none"
                              >
                                {(() => {
                                  const groups = {};
                                  files
                                    .filter(path => {
                                      const filename = path.split(/[/\\]/).pop().toLowerCase();
                                      return filename !== 'dockerfile' && filename !== '.dockerignore';
                                    })
                                    .forEach(path => {
                                      const normalizedPath = path.replace(/\\/g, '/');
                                      const parts = normalizedPath.split('/');
                                      const fileName = parts.pop();
                                      const folderName = parts.join('/') || 'root';
                                      if (!groups[folderName]) {
                                        groups[folderName] = [];
                                      }
                                      groups[folderName].push({ fullPath: path, name: fileName });
                                    });

                                  const sortedFolders = Object.keys(groups).sort((a, b) => {
                                    if (a === 'root') return -1;
                                    if (b === 'root') return 1;
                                    return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
                                  });

                                  return sortedFolders.map(folderName => {
                                    const folderFiles = groups[folderName].sort((a, b) => 
                                      a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true })
                                    );

                                    return (
                                      <div key={folderName} className="flex flex-col">
                                        <div className="px-3 py-1 text-[8.5px] font-bold font-mono text-outline/40 uppercase tracking-widest bg-surface-container-high/15 flex items-center gap-1.5 select-none border-y border-outline-variant/10 first:border-t-0">
                                          <FolderOpen className="w-2.5 h-2.5 text-primary/75 shrink-0" />
                                          <span>{folderName === 'root' ? 'root' : folderName}</span>
                                        </div>
                                        <div className="flex flex-col">
                                          {folderFiles.map(file => {
                                            const isSelected = selectedFile === file.fullPath;
                                            return (
                                              <div
                                                key={file.fullPath}
                                                onClick={() => {
                                                  if (onSelectFile) onSelectFile(file.fullPath);
                                                  setIsDropdownOpen(false);
                                                }}
                                                className={`flex items-center gap-2 px-4 py-1.5 text-[11px] font-mono-data cursor-pointer transition-all lowercase select-none ${isSelected
                                                  ? 'bg-primary/10 text-primary font-semibold border-l-2 border-primary pl-3.5'
                                                  : 'text-on-surface-variant hover:text-on-surface hover:bg-[#252525]'
                                                  }`}
                                              >
                                                <div className="flex-shrink-0 flex items-center justify-center">
                                                  {getFileIcon(file.name)}
                                                </div>
                                                <span className="truncate flex-1 text-left">{file.name}</span>
                                                {isSelected && (
                                                  <span className="material-symbols-outlined text-[12px] text-primary">check</span>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    );
                                  });
                                })()}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {selectedFile && (
                          <span className="font-mono-data text-[9px] text-outline/50 uppercase tracking-widest">
                            {selectedFile.split('.').pop() || 'text'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Monaco Editor Content */}
                    <div className="flex-1 min-h-0 relative bg-[#1e1e1e]">
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
                              fontSize: 14,
                              fontFamily: '"JetBrains Mono", monospace',
                              scrollbar: {
                                vertical: 'hidden',
                                horizontal: 'hidden',
                                verticalScrollbarSize: 0,
                                horizontalScrollbarSize: 0,
                                handleMouseWheel: true
                              },
                              quickSuggestions: true,
                              minimap: {
                                enabled: false,
                              },
                              wordWrap: "on",
                              automaticLayout: true,
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

                    {/* Preview Terminal (Below code showing area in 30% height) */}
                    <AnimatePresence>
                      {showPreviewTerminal && (
                        <motion.div
                          key="preview-terminal-panel"
                          initial={{ height: 0 }}
                          animate={{ height: '30%' }}
                          exit={{ height: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                          className="border-t border-outline-variant/20 bg-[#141414] flex flex-col overflow-hidden relative"
                        >
                          <div className="flex items-center justify-between px-3 h-8 bg-[#181818] border-b border-[#252525] select-none">
                            <span className="font-mono-data text-[10px] text-outline/80 font-bold uppercase tracking-widest flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                              Terminal
                            </span>
                            <button
                              onClick={() => setShowPreviewTerminal(false)}
                              className="text-on-surface-variant/60 hover:text-primary transition-colors cursor-pointer flex items-center"
                            >
                              <span className="material-symbols-outlined text-[13px]">close</span>
                            </button>
                          </div>
                          <div className="flex-1 min-h-0 relative bg-transparent p-2">
                            <div ref={previewTerminalRef} className="absolute inset-2 overflow-hidden" />
                            {!sandbox && (
                              <div className="absolute inset-0 flex items-center justify-center text-outline font-code-sm bg-black/60 backdrop-blur-sm z-30">
                                Connecting to terminal...
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
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
                              fontSize: 13,
                              fontFamily: '"JetBrains Mono", monospace',
                              scrollbar: {
                                vertical: 'hidden',
                                horizontal: 'hidden',
                                verticalScrollbarSize: 0,
                                horizontalScrollbarSize: 0,
                                handleMouseWheel: true
                              },
                              quickSuggestions: true,
                              minimap: {
                                enabled: true,
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
              )}
            </div>
          </motion.div>
        </Panel>

        <VerticalResizeHandle />

        <Panel defaultSize={40} minSize={20}>
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            className={`w-full h-full bg-surface-container-lowest border border-outline-variant/35 rounded-xl flex flex-col overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.6)] ${maximizedPanel === 'terminal'
              ? 'fixed inset-0 w-screen h-screen z-50 shadow-2xl border-none bg-surface-container-lowest rounded-none'
              : 'relative'
              }`}
          >
            <header className="flex items-center px-4 py-2 bg-surface-container-lowest border-b border-outline-variant/35 z-10 justify-between select-none relative h-10">
              {/* Left: macOS Window traffic light controls */}
              <div className="flex items-center gap-1.5 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-sm" title="Close" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] opacity-80 hover:opacity-100 transition-opacity cursor-pointer shadow-sm" title="Minimize" />
                <div
                  className="w-2.5 h-2.5 rounded-full bg-[#27c93f] opacity-85 shadow-sm"
                />
              </div>

              {/* Center: Centered Session name (bash terminal style) */}
              <div className="absolute inset-x-0 flex items-center justify-center pointer-events-none">
                <div className="flex items-center gap-2 text-on-surface-variant/75 text-[11px] font-mono-data tracking-wide select-none">
                  <span>bash</span>
                  <span className="opacity-45">—</span>
                  <span className="text-on-surface/80">root@sandbox-pod-{sandbox?.sandboxId ? sandbox.sandboxId.slice(0, 8) : 'pod'}:/workspace</span>
                  {/* Status Beacon */}
                  <div className="relative flex items-center justify-center ml-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary absolute animate-ping opacity-75"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                  </div>
                </div>
              </div>

              {/* Right: macOS Utilities (Clear & Reconnect) */}
              <div className="flex items-center gap-1.5 z-20">
                {/* Clear Terminal Display */}
                <button
                  onClick={() => {
                    if (xtermRef.current) {
                      xtermRef.current.clear();
                      xtermRef.current.write('\r\x1b[32m[Console cleared by user]\x1b[0m\r\n');
                      if (sandbox) {
                        xtermRef.current.write(`root@sandbox-pod-${sandbox.sandboxId}:/workspace# `);
                      } else {
                        xtermRef.current.write(`root@sandbox-pod-sandbox:/workspace# `);
                      }
                    }
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 transition-all text-on-surface-variant hover:text-primary text-[10px] font-semibold font-label-caps cursor-pointer active:scale-95 shadow-sm"
                  title="Clear Terminal Display"
                >
                  <span className="material-symbols-outlined text-[12px]">delete_sweep</span>
                  <span>Clear</span>
                </button>

                {/* Terminal Reconnect Button */}
                <button
                  onClick={handleReconnectTerminal}
                  disabled={isTerminalReloading}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 transition-all text-on-surface-variant hover:text-primary text-[10px] font-semibold font-label-caps cursor-pointer active:scale-95 shadow-sm disabled:opacity-40"
                  title="Reconnect Terminal Socket"
                >
                  <span className={`material-symbols-outlined text-[12px] ${isTerminalReloading ? 'animate-spin' : 'hover:rotate-180 transition-all duration-300'}`}>autorenew</span>
                  <span>Reconnect</span>
                </button>

                {/* Close Button when maximized */}
                {maximizedPanel === 'terminal' && (
                  <button
                    onClick={() => setMaximizedPanel(null)}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-high border border-outline-variant/30 transition-all text-on-surface hover:text-primary active:scale-90 cursor-pointer shadow-sm ml-1"
                    title="Exit Fullscreen"
                  >
                    <span className="material-symbols-outlined text-[15px]">close</span>
                  </button>
                )}
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
          </motion.div>
        </Panel>
      </PanelGroup>

      {/* Global blurred glass background behind maximized overlays */}
      <AnimatePresence>
        {maximizedPanel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setMaximizedPanel(null)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md cursor-pointer"
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
}
