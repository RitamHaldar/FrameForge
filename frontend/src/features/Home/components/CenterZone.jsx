import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../slices/toastSlice';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import Editor from '@monaco-editor/react';
import { registerCompletion } from 'monacopilot';
import {
  FileCode2,
  FileJson,
  FileImage,
  FileText,
  File,
  FolderOpen,
  Maximize2,
  Minimize2,
  RefreshCw,
  Lock,
  Save,
  Terminal as TerminalIcon,
  Sparkles,
  Share2,
  Check,
  Globe,
  Code2,
  Trash2,
  X,
  ChevronDown,
  ExternalLink,
  Copy,
} from 'lucide-react';

const VerticalResizeHandle = () => (
  <PanelResizeHandle className="h-2.5 group flex items-center justify-center cursor-row-resize outline-none z-20 select-none my-0.5">
    <div className="w-16 group-hover:w-24 h-1 rounded-full bg-white/10 group-hover:bg-cyanAccent group-active:bg-cyanAccent transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 group-hover:shadow-[0_0_12px_rgba(0,240,255,0.7)]">
      <div className="w-1.5 h-0.5 rounded-full bg-black/50"></div>
      <div className="w-1.5 h-0.5 rounded-full bg-black/50"></div>
    </div>
  </PanelResizeHandle>
);

const getFileIcon = (filename) => {
  if (!filename) return <File className="w-3.5 h-3.5 text-textMuted" />;
  const name = filename.toLowerCase();
  if (name.endsWith('.jsx') || name.endsWith('.js') || name.endsWith('.ts') || name.endsWith('.tsx')) {
    return <FileCode2 className="w-3.5 h-3.5 text-cyanAccent" />;
  }
  if (name.endsWith('.json')) {
    return <FileJson className="w-3.5 h-3.5 text-emerald-400" />;
  }
  if (name.endsWith('.css')) {
    return <FileCode2 className="w-3.5 h-3.5 text-sky-400" />;
  }
  if (name.endsWith('.html')) {
    return <FileCode2 className="w-3.5 h-3.5 text-rose-400" />;
  }
  if (name.match(/\.(png|jpe?g|svg|gif|webp)$/)) {
    return <FileImage className="w-3.5 h-3.5 text-amber-400" />;
  }
  if (name.endsWith('.md') || name.endsWith('.txt')) {
    return <FileText className="w-3.5 h-3.5 text-textSecondary" />;
  }
  return <File className="w-3.5 h-3.5 text-textMuted" />;
};

export default function CenterZone({
  sandbox,
  socketRef,
  terminalVersion,
  reconnectTerminal,
  fetchFiles,
  selectedFile,
  selectedFileContent,
  isLoadingFile,
  saveFile,
  maximizedPanel,
  setMaximizedPanel,
  files = [],
  onSelectFile,
  optimizeCode,
  isOptimizing,
}) {
  const dispatch = useDispatch();
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);
  const previewTerminalRef = useRef(null);
  const previewXtermRef = useRef(null);
  const [viewMode] = useState('pc');
  const [activeTab, setActiveTab] = useState('preview');
  const [isReloading, setIsReloading] = useState(false);
  const [isTerminalReloading, setIsTerminalReloading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showPreviewTerminal, setShowPreviewTerminal] = useState(false);
  const [mobileWidth, setMobileWidth] = useState(380);
  const dropdownRef = useRef(null);

  // Preview Terminal in Enlarged Mode
  useEffect(() => {
    if (!showPreviewTerminal || !sandbox || !socketRef || !socketRef.current || !previewTerminalRef.current) return;

    let term;
    let resizeObserver;
    let handleOutput;
    let fitAddon;
    let isDisposed = false;

    try {
      term = new Terminal({
        theme: {
          background: 'transparent',
          foreground: '#F5F5F5',
          cursor: '#00F0FF',
          cursorBlink: '#00F0FF',
          selectionBackground: 'rgba(0, 240, 255, 0.25)',
          black: '#08090A',
          red: '#f43f5e',
          green: '#34d399',
          yellow: '#fbbf24',
          blue: '#38bdf8',
          magenta: '#c084fc',
          cyan: '#00F0FF',
          white: '#F5F5F5',
        },
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 12,
        cursorBlink: true,
        lineHeight: 1.5,
      });

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(previewTerminalRef.current);

      term.write(`root@sandbox-pod-${sandbox.sandboxId}:/workspace# `);

      const handleFit = () => {
        if (isDisposed || !term || !previewTerminalRef.current) return;
        if (previewTerminalRef.current.clientWidth > 0 && previewTerminalRef.current.clientHeight > 0) {
          try {
            fitAddon.fit();
          } catch (e) {
            // Ignore transient measurement errors
          }
        }
      };

      setTimeout(handleFit, 150);

      resizeObserver = new ResizeObserver(handleFit);
      resizeObserver.observe(previewTerminalRef.current);

      const socket = socketRef.current;

      handleOutput = (data) => {
        if (!isDisposed && term) {
          term.write(data);
        }
      };

      socket.on('terminal-output', handleOutput);

      term.onData((data) => {
        if (!isDisposed) {
          socket.emit('terminal-input', data);
        }
      });

      previewXtermRef.current = term;
    } catch (err) {
      console.error("Failed to initialize preview terminal:", err);
    }

    return () => {
      isDisposed = true;
      try {
        if (resizeObserver) resizeObserver.disconnect();
        if (fitAddon) {
          fitAddon.dispose();
        }
        if (term) {
          if (term._core?._viewport?._innerRefresh) {
            term._core._viewport._innerRefresh = () => {};
          }
          term.dispose();
        }
        if (socketRef.current && handleOutput) {
          socketRef.current.off('terminal-output', handleOutput);
        }
      } catch (err) {
        console.error("Cleanup error in preview terminal:", err);
      }
    };
  }, [showPreviewTerminal, sandbox, socketRef, terminalVersion]);

  // Click outside listener for dropdown
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

  const saveRef = useRef(null);
  saveRef.current = { selectedFile, editorValue, isDirty, isSaving, saveFile };

  useEffect(() => {
    setEditorValue(selectedFileContent || '');
  }, [selectedFileContent]);

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
        dispatch(
          addToast({
            type: 'success',
            title: 'FILE SAVED',
            message: `Successfully saved ${fresh.selectedFile.split(/[/\\]/).pop()}`,
            duration: 3000,
          })
        );
      } else {
        dispatch(
          addToast({
            type: 'error',
            title: 'SAVE FAILED',
            message: `Failed to save file: ${res.error || 'Unknown error'}`,
            duration: 4500,
          })
        );
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

  // Main Terminal in Bottom Panel
  useEffect(() => {
    if (!sandbox || !socketRef || !socketRef.current || !terminalRef.current) return;

    let term;
    let resizeObserver;
    let handleOutput;
    let fitAddon;
    let isDisposed = false;

    try {
      term = new Terminal({
        theme: {
          background: 'transparent',
          foreground: '#F5F5F5',
          cursor: '#00F0FF',
          cursorBlink: '#00F0FF',
          selectionBackground: 'rgba(0, 240, 255, 0.25)',
          black: '#08090A',
          red: '#f43f5e',
          green: '#34d399',
          yellow: '#fbbf24',
          blue: '#38bdf8',
          magenta: '#c084fc',
          cyan: '#00F0FF',
          white: '#F5F5F5',
        },
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 13,
        cursorBlink: true,
        lineHeight: 1.5,
      });

      fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);

      term.write(`root@sandbox-pod-${sandbox.sandboxId}:/workspace# `);

      const handleFit = () => {
        if (isDisposed || !term || !terminalRef.current) return;
        if (terminalRef.current.clientWidth > 0 && terminalRef.current.clientHeight > 0) {
          try {
            fitAddon.fit();
          } catch (e) {
            // Ignore transient measurement errors
          }
        }
      };

      setTimeout(handleFit, 50);

      resizeObserver = new ResizeObserver(handleFit);
      resizeObserver.observe(terminalRef.current);

      const socket = socketRef.current;

      handleOutput = (data) => {
        if (!isDisposed && term) {
          term.write(data);
        }
      };

      socket.on('terminal-output', handleOutput);

      term.onData((data) => {
        if (!isDisposed) {
          socket.emit('terminal-input', data);
        }
      });

      xtermRef.current = term;
    } catch (err) {
      console.error("Failed to initialize main terminal:", err);
    }

    return () => {
      isDisposed = true;
      try {
        if (resizeObserver) resizeObserver.disconnect();
        if (fitAddon) {
          fitAddon.dispose();
        }
        if (term) {
          if (term._core?._viewport?._innerRefresh) {
            term._core._viewport._innerRefresh = () => {};
          }
          term.dispose();
        }
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
    setIframeKey(prev => prev + 1);
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

  const handleClearTerminal = () => {
    if (xtermRef.current) {
      xtermRef.current.clear();
      xtermRef.current.write('\r\x1b[32m[Console cleared by user]\x1b[0m\r\n');
      if (sandbox?.sandboxId) {
        xtermRef.current.write(`root@sandbox-pod-${sandbox.sandboxId}:/workspace# `);
      } else {
        xtermRef.current.write(`root@sandbox-pod-sandbox:/workspace# `);
      }
    }
  };

  const handleCopyUrl = () => {
    if (sandbox?.previewUrl) {
      navigator.clipboard.writeText(sandbox.previewUrl);
      dispatch(
        addToast({
          type: 'success',
          title: 'LINK COPIED',
          message: 'Preview URL copied to clipboard',
          url: sandbox.previewUrl,
          duration: 4500,
        })
      );
    } else {
      dispatch(
        addToast({
          type: 'warning',
          title: 'SANDBOX PENDING',
          message: 'Sandbox preview URL is still initializing. Please wait a moment.',
          duration: 3500,
        })
      );
    }
  };

  return (
    <motion.main
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      style={{ transform: maximizedPanel ? 'none' : undefined }}
      className="flex-1 h-full overflow-hidden z-10 relative font-sans text-textPrimary"
    >
      <PanelGroup orientation="vertical">
        {/* TOP PANEL: PREVIEW & CODE ZONE */}
        <Panel defaultSize={60} minSize={30}>
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className={`w-full h-full bg-[#0A0C0E]/90 backdrop-blur-xl border border-white/[0.08] rounded-xl flex flex-col overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.6)] ${
              maximizedPanel === 'preview'
                ? 'fixed inset-0 w-screen h-screen z-50 shadow-2xl border-none bg-[#0A0C0E] rounded-none'
                : 'relative'
            }`}
          >
            {/* Header: Unified Ultra-Sleek Glass Chrome Toolbar */}
            <header className="relative flex items-center justify-between px-3.5 py-1.5 bg-gradient-to-r from-[#0C0E12] via-[#090B0E] to-[#0C0E12] border-b border-white/[0.08] backdrop-blur-xl z-20 select-none h-12">
              {/* Ambient top highlight hairline */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyanAccent/25 to-transparent pointer-events-none" />

              {/* Left Section: macOS Traffic Lights & Window Control Chip */}
              <div className="flex items-center gap-2.5 z-20 shrink-0">
                {/* Window Traffic Lights */}
                <div className="flex items-center gap-1.5 pr-1">
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMaximizedPanel(null)}
                    className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/80 shadow-[0_0_6px_rgba(255,95,86,0.35)] cursor-pointer focus:outline-none transition-transform"
                    title="Close"
                  />
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/80 shadow-[0_0_6px_rgba(255,189,46,0.35)] cursor-pointer focus:outline-none transition-transform"
                    title="Minimize"
                  />
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMaximizedPanel(maximizedPanel === 'preview' ? null : 'preview')}
                    className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/80 shadow-[0_0_6px_rgba(39,201,63,0.35)] cursor-pointer focus:outline-none transition-transform"
                    title={maximizedPanel === 'preview' ? "Restore Window" : "Full Screen"}
                  />
                </div>

                <div className="h-4 w-px bg-white/10 hidden sm:block" />

                {/* Maximize / Close Editor Button */}
                <AnimatePresence mode="wait">
                  {maximizedPanel !== 'preview' ? (
                    <motion.button
                      key="btn-enlarge"
                      initial={{ opacity: 0, x: -6, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -6, scale: 0.96 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 420, damping: 26 }}
                      onClick={() => setMaximizedPanel('preview')}
                      className="group relative flex items-center gap-1.5 px-3 py-1 bg-white/[0.04] hover:bg-cyanAccent/[0.08] border border-white/[0.08] hover:border-cyanAccent/40 text-textSecondary hover:text-cyanAccent shadow-sm hover:shadow-[0_0_12px_rgba(0,240,255,0.15)] transition-all duration-200 select-none cursor-pointer font-mono font-medium text-[11px] tracking-tight h-8 rounded-lg"
                      title="Expand into full dual preview & code editor mode"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-cyanAccent/70 group-hover:text-cyanAccent group-hover:scale-110 transition-all duration-200" />
                      <span className="font-semibold tracking-wide">Open in Editor</span>
                    </motion.button>
                  ) : (
                    <motion.button
                      key="btn-minimize"
                      initial={{ opacity: 0, x: -6, scale: 0.96 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -6, scale: 0.96 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 420, damping: 26 }}
                      onClick={() => setMaximizedPanel(null)}
                      className="group relative flex items-center gap-1.5 px-3 py-1 bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-white/30 text-white shadow-sm transition-all duration-200 select-none cursor-pointer font-mono font-medium text-[11px] tracking-tight h-8 rounded-lg"
                      title="Exit editor fullscreen"
                    >
                      <Minimize2 className="w-3.5 h-3.5 text-white/70 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
                      <span className="font-semibold tracking-wide">Close Editor</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Center: Luxury Browser Address Bar & Actions */}
              <div className="flex-1 max-w-[460px] min-w-[180px] mx-2 sm:mx-4 relative z-20 flex items-center justify-center gap-2">
                {!(activeTab === 'code' && maximizedPanel !== 'preview') ? (
                  <div className="w-full max-w-[380px] sm:max-w-[420px]">
                    <div className="flex items-center justify-between bg-[#080A0D]/90 hover:bg-[#0D1015] border border-white/[0.08] hover:border-white/[0.16] focus-within:border-cyanAccent/40 transition-all duration-200 rounded-xl px-2.5 h-8 text-center group shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] backdrop-blur-md">
                      {/* Left: SSL Badge + Status Beacon */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono">
                          <Lock className="w-2.5 h-2.5 text-emerald-400 drop-shadow-[0_0_4px_rgba(52,211,153,0.5)]" />
                          <span className="text-[9px] font-bold tracking-wider text-emerald-400/90 hidden sm:inline">SSL</span>
                        </div>
                        {sandbox?.previewUrl && (
                          <span className="relative flex h-1.5 w-1.5" title="Sandbox Active">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500 shadow-[0_0_6px_#10b981]"></span>
                          </span>
                        )}
                      </div>

                      {/* Center: Interactive URL Host */}
                      <div
                        onClick={handleCopyUrl}
                        className="flex-1 px-2 flex items-center justify-center text-center truncate cursor-pointer group/host"
                        title={sandbox?.previewUrl ? `${sandbox.previewUrl} (Click to copy)` : 'Connecting sandbox...'}
                      >
                        <span className="font-mono text-[11px] text-white/80 group-hover/host:text-cyanAccent tracking-tight truncate transition-colors">
                          {sandbox?.previewUrl ? (
                            <>
                              <span className="text-white/30 text-[10px] mr-1 hidden md:inline">https://</span>
                              <span className="font-medium">{new URL(sandbox.previewUrl).host}</span>
                            </>
                          ) : (
                            <span className="text-textMuted italic text-[10.5px]">Starting sandbox environment...</span>
                          )}
                        </span>
                      </div>

                      {/* Right: Quick reload inside address bar */}
                      <div className="flex items-center gap-1 shrink-0">
                        <motion.button
                          onClick={handleReload}
                          whileHover={{ scale: 1.15, rotate: 60 }}
                          whileTap={{ scale: 0.88 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="w-5 h-5 rounded-md flex items-center justify-center text-textMuted hover:text-cyanAccent hover:bg-white/[0.08] transition-colors cursor-pointer"
                          title="Reload Preview"
                        >
                          <RefreshCw className={`w-3 h-3 ${isReloading ? 'animate-spin text-cyanAccent' : ''}`} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  selectedFile && (
                    <div className="flex items-center gap-2 bg-[#080A0D]/90 border border-white/[0.08] rounded-xl px-2.5 py-1 h-8 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] backdrop-blur-md">
                      <div className="flex items-center bg-white/[0.05] px-2 py-0.5 rounded-lg border border-white/10 text-[10.5px] font-mono text-white gap-1.5 h-6">
                        {getFileIcon(selectedFile)}
                        <span className="truncate max-w-[140px] font-medium lowercase tracking-tight">{selectedFile.split(/[/\\]/).pop()}</span>
                        {isDirty && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#fbbf24]" title="Unsaved changes" />
                        )}
                      </div>
                      <motion.button
                        onClick={handleSave}
                        disabled={!isDirty || isSaving}
                        whileHover={isDirty && !isSaving ? { scale: 1.04 } : {}}
                        whileTap={isDirty && !isSaving ? { scale: 0.94 } : {}}
                        className={`flex items-center gap-1.5 px-3 py-0.5 rounded-lg transition-all font-semibold font-mono text-[10px] h-6 border select-none ${
                          isDirty
                            ? 'bg-gradient-to-r from-cyanAccent to-[#00D0FF] text-black border-cyanAccent shadow-[0_0_12px_rgba(0,240,255,0.35)] cursor-pointer'
                            : 'bg-white/[0.04] text-textMuted border-white/10 cursor-not-allowed'
                        }`}
                        title="Save File (Ctrl+S)"
                      >
                        {isSaving ? (
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        ) : (
                          <Save className="w-2.5 h-2.5" />
                        )}
                        <span>{isSaving ? 'Saving...' : 'Save'}</span>
                      </motion.button>
                    </div>
                  )
                )}

                {/* Enlarged Mode: Terminal Toggle Button */}
                {maximizedPanel === 'preview' && (
                  <motion.button
                    onClick={() => setShowPreviewTerminal(!showPreviewTerminal)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className={`flex items-center gap-1.5 px-3 h-8 rounded-lg border font-mono text-[10px] font-semibold cursor-pointer transition-all select-none whitespace-nowrap shadow-sm ${
                      showPreviewTerminal
                        ? 'bg-cyanAccent text-black border-cyanAccent shadow-[0_0_14px_rgba(0,240,255,0.35)]'
                        : 'bg-white/[0.04] hover:bg-cyanAccent/10 border-white/10 hover:border-cyanAccent/30 text-cyanAccent'
                    }`}
                  >
                    <TerminalIcon className="w-3 h-3" />
                    <span>{showPreviewTerminal ? 'Hide Terminal' : 'Show Terminal'}</span>
                  </motion.button>
                )}

                {/* Enlarged Mode: Optimize Code Button */}
                {maximizedPanel === 'preview' && selectedFile && (
                  <motion.button
                    onClick={handleOptimizeCode}
                    disabled={isOptimizing}
                    whileHover={!isOptimizing ? { scale: 1.02 } : {}}
                    whileTap={!isOptimizing ? { scale: 0.96 } : {}}
                    className={`flex items-center gap-1.5 px-3 h-8 rounded-lg border font-mono text-[10px] font-semibold cursor-pointer transition-all select-none whitespace-nowrap shadow-sm ${
                      isOptimizing
                        ? 'bg-amber-400/20 text-amber-300 border-amber-400/30 cursor-not-allowed'
                        : 'bg-amber-400/10 hover:bg-amber-400/20 border-amber-400/30 hover:border-amber-400/50 text-amber-300 shadow-[0_0_10px_rgba(251,191,36,0.15)]'
                    }`}
                  >
                    <Sparkles className={`w-3 h-3 ${isOptimizing ? 'animate-spin' : ''}`} />
                    <span>{isOptimizing ? 'Optimizing...' : 'Optimize Code'}</span>
                  </motion.button>
                )}

                {/* Enlarged Mode: Inline Suggestions Toggle */}
                {maximizedPanel === 'preview' && selectedFile && (
                  <motion.button
                    onClick={() => {
                      const newValue = !showSuggestions;
                      setShowSuggestions(newValue);
                      showSuggestionsRef.current = newValue;
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-1.5 px-2.5 h-8 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/20 text-textSecondary hover:text-white text-[10px] font-mono font-medium cursor-pointer transition-all select-none whitespace-nowrap shadow-sm"
                    title={showSuggestions ? "Disable inline AI suggestions" : "Enable inline AI suggestions"}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      showSuggestions 
                        ? 'bg-cyanAccent shadow-[0_0_8px_#00f0ff] animate-pulse' 
                        : 'bg-white/20'
                    }`} />
                    <span>{showSuggestions ? 'AI Suggestions ON' : 'AI Suggestions OFF'}</span>
                  </motion.button>
                )}
              </div>

              {/* Right: Tab Mode, View Controls & Actions */}
              <div className="flex items-center gap-2 z-20 shrink-0">
                {/* Mobile Preview Width Slider */}
                <AnimatePresence>
                  {maximizedPanel === 'preview' && viewMode === 'mobile' && (
                    <motion.div
                      initial={{ opacity: 0, width: 0, scale: 0.95 }}
                      animate={{ opacity: 1, width: 'auto', scale: 1 }}
                      exit={{ opacity: 0, width: 0, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                      className="flex items-center gap-2 bg-[#080A0D]/90 px-2.5 rounded-xl border border-white/10 h-8 overflow-hidden shadow-inner"
                    >
                      <span className="font-mono text-[9px] text-textMuted whitespace-nowrap">Width:</span>
                      <input
                        type="range"
                        min="320"
                        max="768"
                        value={mobileWidth}
                        onChange={(e) => setMobileWidth(Number(e.target.value))}
                        className="w-16 sm:w-24 accent-cyanAccent h-1 rounded bg-white/20 cursor-pointer focus:outline-none"
                      />
                      <span className="font-mono text-[9.5px] text-cyanAccent font-bold min-w-[34px] text-right">{mobileWidth}px</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tab Switchers (Preview / Code) with High-Precision Sliding Pill */}
                {maximizedPanel === 'preview' ? (
                  selectedFile && (
                    <div className="flex items-center gap-1.5 bg-[#080A0D]/90 px-2 py-0.5 rounded-xl border border-white/10 h-8 shadow-inner">
                      <div className="flex items-center bg-white/[0.05] px-2 py-0.5 rounded-lg border border-white/10 font-mono text-[9.5px] text-white gap-1.5 h-6">
                        {getFileIcon(selectedFile)}
                        <span className="truncate max-w-[80px] font-medium lowercase">{selectedFile.split(/[/\\]/).pop()}</span>
                      </div>
                      <motion.button
                        onClick={handleSave}
                        disabled={!isDirty || isSaving}
                        whileHover={isDirty && !isSaving ? { scale: 1.04 } : {}}
                        whileTap={isDirty && !isSaving ? { scale: 0.94 } : {}}
                        className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg transition-all font-semibold font-mono text-[9px] h-6 border ${
                          isDirty
                            ? 'bg-cyanAccent text-black border-cyanAccent hover:bg-cyanAccent/90 cursor-pointer shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                            : 'bg-white/5 text-textMuted border-white/10 cursor-not-allowed'
                        }`}
                        title="Save File (Ctrl+S)"
                      >
                        {isSaving ? (
                          <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                        ) : (
                          <Save className="w-2.5 h-2.5" />
                        )}
                        <span>{isSaving ? 'Saving' : 'Save'}</span>
                      </motion.button>
                    </div>
                  )
                ) : (
                  <div className="flex items-center p-1 bg-[#080A0D]/90 border border-white/[0.08] rounded-xl h-8 relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.7)] backdrop-blur-md">
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`relative px-3 py-1 rounded-lg font-mono text-[11px] font-medium tracking-tight transition-all duration-200 flex items-center gap-1.5 h-full z-10 cursor-pointer select-none ${
                        activeTab === 'preview'
                          ? 'text-white font-semibold'
                          : 'text-textMuted hover:text-white/80'
                      }`}
                    >
                      {activeTab === 'preview' && (
                        <motion.div
                          layoutId="centerZoneTabPill"
                          className="absolute inset-0 bg-gradient-to-b from-[#212732] to-[#14181F] rounded-lg border border-white/[0.16] shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] -z-10"
                          transition={{ type: "spring", stiffness: 480, damping: 34 }}
                        />
                      )}
                      <Globe className={`w-3.5 h-3.5 transition-colors ${activeTab === 'preview' ? 'text-cyanAccent drop-shadow-[0_0_6px_rgba(0,240,255,0.5)]' : 'text-textMuted'}`} />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`relative px-3 py-1 rounded-lg font-mono text-[11px] font-medium tracking-tight transition-all duration-200 flex items-center gap-1.5 h-full z-10 cursor-pointer select-none ${
                        activeTab === 'code'
                          ? 'text-white font-semibold'
                          : 'text-textMuted hover:text-white/80'
                      }`}
                    >
                      {activeTab === 'code' && (
                        <motion.div
                          layoutId="centerZoneTabPill"
                          className="absolute inset-0 bg-gradient-to-b from-[#212732] to-[#14181F] rounded-lg border border-white/[0.16] shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] -z-10"
                          transition={{ type: "spring", stiffness: 480, damping: 34 }}
                        />
                      )}
                      <Code2 className={`w-3.5 h-3.5 transition-colors ${activeTab === 'code' ? 'text-cyanAccent drop-shadow-[0_0_6px_rgba(0,240,255,0.5)]' : 'text-textMuted'}`} />
                      <span>Code</span>
                    </button>
                  </div>
                )}

                {/* External Open in New Tab Button */}
                {sandbox?.previewUrl && (
                  <motion.a
                    href={sandbox.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    className="w-8 h-8 flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] rounded-lg text-textSecondary hover:text-cyanAccent transition-all border border-white/[0.08] hover:border-cyanAccent/30 shadow-sm cursor-pointer"
                    title="Open Preview in New Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </motion.a>
                )}

                {/* Share / Copy URL Button */}
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleCopyUrl}
                  className="w-8 h-8 flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] rounded-lg text-textSecondary hover:text-cyanAccent transition-all cursor-pointer border border-white/[0.08] hover:border-cyanAccent/30 shadow-sm"
                  title="Copy Preview URL"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </motion.button>

                {/* Close Button when maximized */}
                {maximizedPanel === 'preview' && (
                  <motion.button
                    onClick={() => setMaximizedPanel(null)}
                    whileHover={{ scale: 1.08, rotate: 90 }}
                    whileTap={{ scale: 0.92 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/[0.04] hover:bg-rose-500/20 hover:text-rose-400 hover:border-rose-500/30 border border-white/10 transition-colors text-textSecondary cursor-pointer ml-1"
                    title="Exit Fullscreen"
                  >
                    <X className="w-3.5 h-3.5" />
                  </motion.button>
                )}
              </div>
            </header>

            {/* Main Stage Content */}
            <div className="flex-1 bg-[#07080A] relative overflow-hidden flex items-center justify-center p-3">
              {maximizedPanel === 'preview' ? (
                <div className="flex flex-col md:flex-row w-full h-full gap-3">
                  {/* Left Column: Live Preview Frame */}
                  <div className="flex-1 h-full flex items-center justify-center relative bg-black rounded-lg overflow-hidden min-w-0 border border-white/[0.07]">
                    <motion.div
                      animate={{
                        width: viewMode === 'mobile' ? mobileWidth : '100%',
                        height: '100%',
                        maxHeight: viewMode === 'mobile' ? 850 : '100%',
                        borderRadius: viewMode === 'mobile' ? 36 : 4
                      }}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
                      className="relative overflow-hidden bg-[#0A0C0E] flex flex-col shadow-2xl max-h-full max-w-full w-full h-full"
                    >
                      {/* Reload Overlay */}
                      <motion.div
                        initial={false}
                        animate={{ opacity: isReloading ? 1 : 0 }}
                        transition={{ duration: 0.15 }}
                        className="absolute inset-0 bg-[#08090A] z-30 pointer-events-none"
                      />

                      {sandbox?.previewUrl ? (
                        <iframe
                          key={iframeKey}
                          src={sandbox.previewUrl}
                          className="absolute inset-0 w-full h-full border-none z-10 bg-white"
                          title="Preview"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#0A0C0E]">
                          <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 rounded-full border-2 border-cyanAccent/20 border-t-cyanAccent animate-spin"></div>
                            <span className="font-mono text-xs text-textMuted">Starting Sandbox Environment...</span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </div>

                  {/* Right Column: Code Editor */}
                  <div className="flex-1 h-full flex flex-col border border-white/[0.08] rounded-lg overflow-hidden bg-[#0A0C0E] min-w-0">
                    {/* Monaco Editor Header / Toolbar */}
                    <div className="flex items-center justify-between px-3 h-8 bg-[#0D0F12] border-b border-white/[0.07] select-none">
                      <div className="flex items-center gap-2">
                        {/* Custom Dropdown for File Picker */}
                        <div className="relative" ref={dropdownRef}>
                          <motion.button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            whileTap={{ scale: 0.96 }}
                            className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#15181C] hover:bg-[#1A1F26] border border-white/10 hover:border-cyanAccent/30 transition-all text-white text-[11px] font-mono cursor-pointer select-none shadow-sm"
                          >
                            <span className="flex items-center gap-1.5 font-medium lowercase">
                              {getFileIcon(selectedFile)}
                              <span className="truncate max-w-[150px] font-medium">{selectedFile ? selectedFile.split(/[/\\]/).pop() : 'select file'}</span>
                            </span>
                            <ChevronDown className="w-3 h-3 text-textMuted" />
                          </motion.button>

                          {/* Dropdown Menu Overlay */}
                          <AnimatePresence>
                            {isDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -4, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -4, scale: 0.96 }}
                                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                                className="absolute left-0 mt-1.5 w-64 max-h-72 overflow-y-auto bg-[#0D0F12]/95 border border-white/15 rounded-lg shadow-2xl z-40 py-1 backdrop-blur-xl select-none"
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
                                        <div className="px-3 py-1 text-[8.5px] font-bold font-mono text-textMuted uppercase tracking-widest bg-white/[0.02] flex items-center gap-1.5 select-none border-y border-white/[0.04] first:border-t-0">
                                          <FolderOpen className="w-2.5 h-2.5 text-cyanAccent/70 shrink-0" />
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
                                                className={`flex items-center gap-2 px-3.5 py-1.5 text-[11px] font-mono cursor-pointer transition-colors lowercase select-none ${
                                                  isSelected
                                                    ? 'bg-cyanAccent/10 text-cyanAccent font-medium border-l-2 border-cyanAccent pl-3'
                                                    : 'text-textSecondary hover:text-white hover:bg-white/[0.04]'
                                                }`}
                                              >
                                                <div className="flex-shrink-0 flex items-center justify-center">
                                                  {getFileIcon(file.name)}
                                                </div>
                                                <span className="truncate flex-1 text-left">{file.name}</span>
                                                {isSelected && (
                                                  <Check className="w-3 h-3 text-cyanAccent" />
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
                          <span className="font-mono text-[9px] text-textMuted uppercase tracking-widest">
                            {selectedFile.split('.').pop() || 'text'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Monaco Editor Content */}
                    <div className="flex-1 min-h-0 relative bg-[#0A0C0E]">
                      {isLoadingFile ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0C0E] gap-3 text-textMuted h-full">
                          <div className="w-7 h-7 rounded-full border-2 border-cyanAccent/20 border-t-cyanAccent animate-spin"></div>
                          <span className="font-mono text-[11px]">Loading file content...</span>
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
                                enabled: false,
                              },
                              wordWrap: "on",
                              automaticLayout: true,
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0C0E] gap-3 text-textMuted/60 h-full">
                          <FileText className="w-8 h-8 stroke-1 text-textMuted" />
                          <span className="font-mono text-[11px]">Select a file from the explorer to view code</span>
                        </div>
                      )}
                    </div>

                    {/* Preview Terminal Drawer */}
                    <AnimatePresence>
                      {showPreviewTerminal && (
                        <motion.div
                          key="preview-terminal-panel"
                          initial={{ height: 0 }}
                          animate={{ height: '32%' }}
                          exit={{ height: 0 }}
                          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                          className="border-t border-white/[0.08] bg-[#08090A] flex flex-col overflow-hidden relative"
                        >
                          <div className="flex items-center justify-between px-3 h-7 bg-[#0B0D10] border-b border-white/[0.06] select-none">
                            <span className="font-mono text-[10px] text-textMuted font-medium uppercase tracking-widest flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyanAccent animate-pulse"></span>
                              Terminal
                            </span>
                            <button
                              onClick={() => setShowPreviewTerminal(false)}
                              className="text-textMuted hover:text-white transition-colors cursor-pointer flex items-center"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="flex-1 min-h-0 relative bg-transparent p-2">
                            <div ref={previewTerminalRef} className="absolute inset-2 overflow-hidden" />
                            {!sandbox && (
                              <div className="absolute inset-0 flex items-center justify-center text-textMuted font-mono text-xs bg-black/60 backdrop-blur-sm z-30">
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
                    height: '100%',
                    maxHeight: viewMode === 'mobile' ? 850 : '100%',
                    aspectRatio: viewMode === 'mobile' ? '696/850' : 'auto',
                    borderRadius: viewMode === 'mobile' ? 36 : 6
                  }}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.55 }}
                  className="border border-white/[0.08] relative overflow-hidden bg-[#0A0C0E] flex flex-col shadow-2xl max-h-full max-w-full"
                >
                  {/* Reload Overlay */}
                  <motion.div
                    initial={false}
                    animate={{ opacity: isReloading ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                    className="absolute inset-0 bg-[#08090A] z-30 pointer-events-none"
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
                      <div className="absolute inset-0 flex items-center justify-center z-10 bg-[#0A0C0E]">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 rounded-full border-2 border-cyanAccent/20 border-t-cyanAccent animate-spin"></div>
                          <span className="font-mono text-xs text-textMuted">Starting Sandbox Environment...</span>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="absolute inset-0 w-full h-full z-10 bg-[#0A0C0E] flex flex-col">
                      {isLoadingFile ? (
                        <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0C0E] gap-3 text-textMuted">
                          <div className="w-7 h-7 rounded-full border-2 border-cyanAccent/20 border-t-cyanAccent animate-spin"></div>
                          <span className="font-mono text-xs">Loading file content...</span>
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
                        <div className="flex-1 flex flex-col items-center justify-center bg-[#0A0C0E] gap-3 text-textMuted/60">
                          <FileText className="w-8 h-8 stroke-1 text-textMuted" />
                          <span className="font-mono text-xs">Select a file from the explorer to view code</span>
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

        {/* BOTTOM PANEL: LUXURY PRODUCTION TERMINAL */}
        <Panel defaultSize={40} minSize={20}>
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className={`w-full h-full bg-[#07090E] border border-white/[0.08] rounded-xl flex flex-col overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.7)] ${
              maximizedPanel === 'terminal'
                ? 'fixed inset-0 w-screen h-screen z-50 shadow-2xl border-none bg-[#07090E] rounded-none'
                : 'relative'
            }`}
          >
            {/* Terminal Window Header */}
            <header className="relative flex items-center px-3.5 py-1.5 bg-gradient-to-r from-[#0C0F17]/95 via-[#080B11]/95 to-[#0C0F17]/95 border-b border-white/[0.08] backdrop-blur-xl z-20 justify-between select-none h-11">
              {/* Ambient top specular hairline */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyanAccent/30 to-transparent pointer-events-none" />

              {/* Left: Authentic macOS Window Traffic Lights */}
              <div className="flex items-center gap-2.5 z-20 shrink-0">
                <div className="flex items-center gap-1.5 pr-1">
                  <motion.button
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-2.5 h-2.5 rounded-full bg-[#FF5F56] border border-[#E0443E]/80 shadow-[0_0_8px_rgba(255,95,86,0.4)] cursor-pointer focus:outline-none transition-transform"
                    title="Clear console"
                    onClick={handleClearTerminal}
                  />
                  <motion.button
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E] border border-[#DEA123]/80 shadow-[0_0_8px_rgba(255,189,46,0.4)] cursor-pointer focus:outline-none transition-transform"
                    title="Minimize"
                  />
                  <motion.button
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setMaximizedPanel(maximizedPanel === 'terminal' ? null : 'terminal')}
                    className="w-2.5 h-2.5 rounded-full bg-[#27C93F] border border-[#1AAB29]/80 shadow-[0_0_8px_rgba(39,201,63,0.4)] cursor-pointer focus:outline-none transition-transform"
                    title={maximizedPanel === 'terminal' ? "Restore Window" : "Full Screen Terminal"}
                  />
                </div>

                <div className="h-4 w-px bg-white/10 hidden sm:block" />
              </div>

              {/* Center: High-Precision Interactive Terminal Session Capsule */}
              <div className="flex-1 max-w-[460px] min-w-[180px] mx-2 flex items-center justify-center pointer-events-auto z-20">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    if (sandbox?.sandboxId) {
                      navigator.clipboard?.writeText(`root@sandbox-pod-${sandbox.sandboxId}:/workspace`);
                      dispatch(
                        addToast({
                          type: 'info',
                          title: 'SESSION PATH COPIED',
                          message: `root@sandbox-pod-${sandbox.sandboxId}:/workspace`,
                          duration: 2500,
                        })
                      );
                    }
                  }}
                  className="flex items-center gap-2 px-3 py-1 rounded-xl bg-[#080A0F]/90 hover:bg-[#0D1016] border border-white/[0.08] hover:border-cyanAccent/40 transition-all duration-200 shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] cursor-pointer group/pod"
                  title="Click to copy pod workspace path"
                >
                  {/* Terminal Glyph */}
                  <div className="w-4 h-4 rounded-md bg-cyanAccent/10 border border-cyanAccent/25 flex items-center justify-center text-cyanAccent shrink-0">
                    <TerminalIcon className="w-2.5 h-2.5 stroke-[2.5]" />
                  </div>

                  {/* Shell Badge */}
                  <span className="font-mono text-[10.5px] font-bold text-white tracking-wide">bash</span>
                  <span className="text-white/20 text-xs">·</span>

                  {/* Pod Path Host */}
                  <span className="font-mono text-[10.5px] text-gray-400 group-hover/pod:text-cyanAccent transition-colors truncate max-w-[180px] sm:max-w-[280px]">
                    root@sandbox-pod-{sandbox?.sandboxId ? sandbox.sandboxId.slice(0, 8) : 'pod'}:/workspace
                  </span>

                  {/* Live Status Beacon */}
                  <div className="relative flex items-center justify-center shrink-0 ml-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyanAccent absolute animate-ping opacity-75"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyanAccent shadow-[0_0_8px_#00f0ff]"></span>
                  </div>
                </motion.div>
              </div>

              {/* Right Utilities */}
              <div className="flex items-center gap-1.5 z-20 shrink-0">
                {/* Clear Terminal Display */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleClearTerminal}
                  className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/35 transition-all text-gray-400 hover:text-rose-400 text-[10.5px] font-medium font-mono cursor-pointer shadow-sm select-none"
                  title="Clear Console Output"
                >
                  <Trash2 className="w-3 h-3 text-gray-500 group-hover:text-rose-400 transition-colors" />
                  <span>Clear</span>
                </motion.button>

                {/* Terminal Reconnect Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleReconnectTerminal}
                  disabled={isTerminalReloading}
                  className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-cyanAccent/10 border border-white/[0.08] hover:border-cyanAccent/35 transition-all text-gray-400 hover:text-cyanAccent text-[10.5px] font-medium font-mono cursor-pointer shadow-sm select-none disabled:opacity-40"
                  title="Reconnect Terminal WebSocket"
                >
                  <RefreshCw className={`w-3 h-3 ${isTerminalReloading ? 'animate-spin text-cyanAccent' : 'text-gray-500 group-hover:text-cyanAccent transition-colors'}`} />
                  <span>Reconnect</span>
                </motion.button>

                {/* Fullscreen / Maximize Terminal Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setMaximizedPanel(maximizedPanel === 'terminal' ? null : 'terminal')}
                  className={`p-1.5 rounded-lg border text-[10px] font-mono cursor-pointer transition-all select-none shadow-sm ${
                    maximizedPanel === 'terminal'
                      ? 'bg-cyanAccent/15 border-cyanAccent/40 text-cyanAccent'
                      : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-gray-400 hover:text-white'
                  }`}
                  title={maximizedPanel === 'terminal' ? "Restore Window" : "Maximize Terminal"}
                >
                  {maximizedPanel === 'terminal' ? (
                    <Minimize2 className="w-3 h-3" />
                  ) : (
                    <Maximize2 className="w-3 h-3" />
                  )}
                </motion.button>
              </div>
            </header>

            {/* The xterm container with sleek technical dark styling */}
            <div className="flex-1 min-h-0 relative z-10 bg-[#05070B] shadow-[inset_0_2px_14px_rgba(0,0,0,0.85)]">
              <div ref={terminalRef} className="absolute inset-3 overflow-hidden font-mono" />
              {!sandbox && (
                <div className="absolute inset-0 flex items-center justify-center text-textMuted font-mono text-xs bg-black/60 backdrop-blur-sm z-30">
                  Connecting to terminal...
                </div>
              )}
            </div>

            {/* Terminal Micro Footer Telemetry */}
            <div className="px-3.5 py-1 bg-[#040609] border-t border-white/[0.05] flex items-center justify-between text-[9px] font-mono text-gray-500 select-none">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
                  ONLINE
                </span>
                <span className="text-white/10">|</span>
                <span className="text-gray-400">TTY 1</span>
                <span className="text-white/10">|</span>
                <span>UTF-8</span>
              </div>
              <div className="flex items-center gap-2">
                <span>SANDBOX POD</span>
                <span className="text-white/10">|</span>
                <span className="text-cyanAccent/90 font-medium">WS LIVE</span>
              </div>
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
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setMaximizedPanel(null)}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md cursor-pointer"
          />
        )}
      </AnimatePresence>
    </motion.main>
  );
}
