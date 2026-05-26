import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

export default function PreviewPanel({ 
  activeTab, 
  setActiveTab, 
  editorContent, 
  updateEditorContent, 
  previewUrl, 
  selectedFile,
  viewport = 'desktop',
  setViewport,
  openFiles = [],
  selectFile
}) {
  const isPreview = activeTab === 'preview';
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="flex-1 bg-gradient-to-b from-[#0c0c14] to-[#08080c] h-full flex flex-col overflow-hidden relative border border-white/5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      {/* Premium Glassmorphic Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-[#12121a]/90 backdrop-blur-xl border-b border-white/5 relative z-20 select-none">
        
        {/* macOS Style Window Controls + Tab Selector */}
        <div className="flex items-center gap-6">
          {/* macOS window dots */}
          <div className="flex items-center gap-1.5 group">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"></span>
          </div>

          <div className="flex items-center gap-3">
            {/* Premium Sliding Segmented Control */}
            <div className="flex bg-[#161622] rounded-xl p-0.5 border border-white/5 relative shadow-inner">
              <div 
                className={`absolute inset-y-0.5 left-0.5 w-[92px] bg-gradient-to-r from-primary-container to-[#6366f1] rounded-[10px] shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${!isPreview ? 'translate-x-[92px]' : ''}`} 
              ></div>
              <button 
                className={`w-[92px] py-2 relative z-10 font-label-caps text-[10.5px] tracking-wider transition-all flex items-center justify-center gap-1.5 ${isPreview ? 'text-white font-bold drop-shadow-md' : 'text-outline hover:text-white'}`}
                onClick={() => setActiveTab('preview')}
              >
                <span className="material-symbols-outlined text-[14px]">visibility</span>
                Preview
              </button>
              <button 
                className={`w-[92px] py-2 relative z-10 font-label-caps text-[10.5px] tracking-wider transition-all flex items-center justify-center gap-1.5 ${!isPreview ? 'text-white font-bold drop-shadow-md' : 'text-outline hover:text-white'}`}
                onClick={() => setActiveTab('code')}
              >
                <span className="material-symbols-outlined text-[14px]">code</span>
                Code
              </button>
            </div>
          </div>
        </div>
        
        {/* Sleek Browser Mockup Address Bar & Viewport Toggles */}
        <div className="flex items-center gap-5 flex-1 justify-end">
          
          {/* Address Bar */}
          <div className="hidden md:flex items-center gap-2.5 bg-[#06060a] border border-white/5 hover:border-white/10 transition-colors rounded-xl px-4.5 py-2 font-code-md flex-1 max-w-sm shadow-inner group">
            <span className="material-symbols-outlined text-outline/50 group-hover:text-outline transition-colors text-[14px] flex-shrink-0 cursor-not-allowed">arrow_back</span>
            <span className="material-symbols-outlined text-outline/50 group-hover:text-outline transition-colors text-[14px] mr-1 flex-shrink-0 cursor-not-allowed">arrow_forward</span>
            <span className="material-symbols-outlined text-[#4edea3] text-[13px] shadow-[0_0_12px_rgba(78,222,163,0.4)] flex-shrink-0">lock</span>
            <span className="text-[11px] text-[#e4e1ee]/90 truncate select-all">{previewUrl || 'Waiting for sandbox container...'}</span>
            {previewUrl && (
              <span 
                onClick={handleRefresh}
                className="material-symbols-outlined text-outline hover:text-white transition-colors text-[14px] ml-auto cursor-pointer flex-shrink-0 hover:rotate-180 duration-300"
                title="Refresh URL"
              >
                autorenew
              </span>
            )}
          </div>

          {/* Premium Device Switcher */}
          {isPreview && (
            <div className="flex bg-[#161622] rounded-xl border border-white/5 overflow-hidden p-0.5 shadow-inner">
              <button 
                onClick={() => setViewport && setViewport('desktop')}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center justify-center ${viewport === 'desktop' ? 'bg-[#252538] text-[#c3c0ff] shadow-md shadow-black/30 border border-white/5' : 'text-outline hover:text-white hover:bg-white/[0.02]'}`}
                title="Desktop View"
              >
                <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
              </button>
              <button 
                onClick={() => setViewport && setViewport('mobile')}
                className={`px-3.5 py-2 rounded-lg transition-all flex items-center justify-center ${viewport === 'mobile' ? 'bg-[#252538] text-[#c3c0ff] shadow-md shadow-black/30 border border-white/5' : 'text-outline hover:text-white hover:bg-white/[0.02]'}`}
                title="Mobile View"
              >
                <span className="material-symbols-outlined text-[16px]">smartphone</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Workspace Frame Area */}
      <div className="flex-1 bg-[#050508] relative overflow-hidden flex items-center justify-center p-4">
        {isPreview ? (
          viewport === 'mobile' ? (
            /* Premium High-End Glassmorphic Smartphone Mockup Frame */
            <div className="relative w-[335px] h-[670px] bg-[#0c0c14] rounded-[48px] p-3 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.08)_inset,0_0_50px_rgba(99,102,241,0.15)] border border-white/10 flex flex-col overflow-hidden animate-[scale-up_0.3s_ease-out]">
              
              {/* Sleek Side Buttons Details */}
              <div className="absolute left-[-2px] top-32 w-[3px] h-10 bg-white/10 rounded-r-md border-r border-white/20"></div>
              <div className="absolute left-[-2px] top-46 w-[3px] h-14 bg-white/10 rounded-r-md border-r border-white/20"></div>
              <div className="absolute left-[-2px] top-64 w-[3px] h-14 bg-white/10 rounded-r-md border-r border-white/20"></div>
              <div className="absolute right-[-2px] top-40 w-[3px] h-18 bg-white/10 rounded-l-md border-l border-white/20"></div>

              {/* Dynamic Island / Notch */}
              <div className="absolute top-4.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-center border border-white/5 shadow-xl">
                <div className="w-2 h-2 rounded-full bg-[#1e3a8a] border border-[#3b82f6]/40 shadow-[0_0_6px_rgba(59,130,246,0.6)] mr-auto ml-2.5"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-800 border border-neutral-600/50 mr-4"></div>
              </div>

              {/* Home Pill Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/25 rounded-full z-40"></div>

              {/* Status Bar */}
              <div className="w-full h-9 px-6 pt-1 flex items-center justify-between text-[10px] font-semibold text-white select-none z-30 opacity-90">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[11px]">signal_cellular_alt</span>
                  <span className="material-symbols-outlined text-[11px]">wifi</span>
                  <span className="material-symbols-outlined text-[13px]">battery_full</span>
                </div>
              </div>

              {/* Reflective Glass Overlays */}
              <div className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-r from-transparent to-white/[0.015] transform skew-x-[-12deg] pointer-events-none z-30"></div>

              {/* Embedded Frame Screen */}
              <div className="flex-1 rounded-[36px] overflow-hidden bg-white relative border border-black/60 shadow-inner">
                {previewUrl ? (
                  <iframe key={refreshKey} src={previewUrl} className="w-full h-full border-none bg-white" title="Preview" sandbox="allow-same-origin allow-scripts allow-forms" />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full bg-[#0d0d12] text-outline p-6 text-center gap-4">
                    <span className="material-symbols-outlined animate-spin text-primary text-[32px]">sync</span>
                    <span className="text-[12px] font-medium tracking-wide text-white/70">Allocating sandboxed runtime...</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Desktop Mode Full Frame View */
            <div className="w-full h-full rounded-2xl border border-white/5 relative overflow-hidden bg-[#0d0d12] shadow-2xl flex flex-col ring-1 ring-white/[0.02]">
              {previewUrl ? (
                <iframe key={refreshKey} src={previewUrl} className="w-full h-full border-none bg-white" title="Preview" sandbox="allow-same-origin allow-scripts allow-forms" />
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-outline gap-4 bg-gradient-to-br from-[#0c0c14] to-[#050508] select-none">
                  <span className="material-symbols-outlined animate-[spin_2.5s_linear_infinite] text-primary text-[38px] drop-shadow-[0_0_12px_rgba(99,102,241,0.4)]">settings</span>
                  <span className="text-[13px] font-medium tracking-wide text-white/80">Spinning up container runtime...</span>
                </div>
              )}
            </div>
          )
        ) : (
          /* Premium Integrated Monaco Code Editor with Tab navigation and status bar */
          <div className="w-full h-full rounded-2xl border border-white/5 overflow-hidden shadow-2xl bg-[#0a0a0f]/60 backdrop-blur-md ring-1 ring-white/[0.03] flex flex-col">
            {/* Multi-file Tabs Bar */}
            {openFiles && openFiles.length > 0 ? (
              <div className="flex bg-[#0a0a0f] border-b border-white/5 overflow-x-auto select-none font-code-md h-9.5 items-center scrollbar-none flex-shrink-0">
                {openFiles.map((file, idx) => {
                  const isActive = selectedFile === file;
                  const baseName = file.split('/').pop();
                  return (
                    <div 
                      key={idx}
                      onClick={() => selectFile && selectFile(file)}
                      className={`flex items-center gap-2 px-4.5 h-full cursor-pointer border-r border-white/5 transition-all text-[11px] ${isActive ? 'bg-[#12121a] text-white border-t-2 border-primary font-semibold shadow-sm' : 'text-outline/80 hover:text-white hover:bg-white/[0.02]'}`}
                    >
                      <span className="material-symbols-outlined text-[13px] text-primary/70">description</span>
                      <span>{baseName}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex bg-[#0a0a0f] border-b border-white/5 select-none font-code-md h-9.5 items-center px-4 flex-shrink-0">
                <span className="text-[10px] text-outline/50 tracking-wider">No active files</span>
              </div>
            )}

            <div className="flex-1 min-h-0 relative">
              <Editor
                height="100%"
                defaultLanguage="javascript"
                language={selectedFile?.endsWith('.css') ? 'css' : selectedFile?.endsWith('.json') ? 'json' : selectedFile?.endsWith('.html') ? 'html' : 'javascript'}
                theme="vs-dark"
                value={editorContent}
                onChange={updateEditorContent}
                options={{ 
                  minimap: { enabled: false }, 
                  fontSize: 13,
                  fontFamily: '"JetBrains Mono", monospace',
                  padding: { top: 12, bottom: 12 },
                  lineNumbersMinChars: 3,
                  cursorBlinking: 'smooth',
                  cursorSmoothCaretAnimation: 'on',
                  smoothScrolling: true,
                  renderLineHighlight: 'all',
                  wordWrap: 'on',
                  scrollbar: {
                    verticalScrollbarSize: 8,
                    horizontalScrollbarSize: 8,
                  }
                }}
              />
            </div>

            {/* Monaco Editor Status Bar */}
            <div className="h-7 w-full bg-[#0a0a0f] border-t border-white/5 flex items-center justify-between px-4 text-[9.5px] font-code-md text-outline/60 select-none flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[12px] text-primary">terminal</span>
                <span className="truncate max-w-[240px]">{selectedFile || 'No active buffer'}</span>
              </div>
              <div className="flex items-center gap-3.5">
                <span>Ln 1, Col 1</span>
                <span>UTF-8</span>
                <span>Spaces: 2</span>
                <span className="text-[#4edea3] font-bold uppercase">{selectedFile?.split('.').pop() || 'JS'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


