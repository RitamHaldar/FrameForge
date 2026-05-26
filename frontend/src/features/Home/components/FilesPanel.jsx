import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FileTreeNode = ({ node, selectFile, toggleFolder, selectedFile, depth = 0 }) => {
  const isFolder = node.type === 'folder';
  const isSelected = selectedFile === node.path || selectedFile === node.name;

  // Custom Icon Determinator based on Extension & Type
  const getIcon = () => {
    if (isFolder) {
      return (
        <span className={`material-symbols-outlined text-[17px] transition-transform select-none ${node.expanded ? 'text-amber-400 font-bold scale-105 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]' : 'text-amber-500/80 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]'}`}>
          {node.expanded ? 'folder_open' : 'folder'}
        </span>
      );
    }

    const ext = node.ext || node.name.split('.').pop().toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return <span className="material-symbols-outlined text-yellow-400 text-[17px] select-none font-bold drop-shadow-[0_0_4px_rgba(250,204,21,0.4)]">javascript</span>;
      case 'css':
        return <span className="material-symbols-outlined text-cyan-400 text-[17px] select-none font-bold drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]">palette</span>;
      case 'json':
        return <span className="material-symbols-outlined text-emerald-400 text-[17px] select-none drop-shadow-[0_0_4px_rgba(52,211,153,0.4)]">settings_ethernet</span>;
      case 'html':
        return <span className="material-symbols-outlined text-orange-400 text-[17px] select-none font-bold drop-shadow-[0_0_4px_rgba(251,146,60,0.4)]">html</span>;
      case 'md':
        return <span className="material-symbols-outlined text-purple-400 text-[17px] select-none drop-shadow-[0_0_4px_rgba(192,132,252,0.4)]">article</span>;
      default:
        return <span className="material-symbols-outlined text-slate-400 text-[17px] select-none group-hover:text-slate-300">description</span>;
    }
  };

  return (
    <div className="flex flex-col">
      <div 
        className={`group flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-all duration-200 rounded-lg mx-2 my-0.5 select-none ${
          isSelected 
            ? 'bg-gradient-to-r from-primary-container/20 to-transparent text-primary border-l-2 border-primary shadow-[0_0_12px_rgba(99,102,241,0.1)]' 
            : 'text-[#918fa1] hover:text-white hover:bg-white/[0.03]'
        }`}
        onClick={() => isFolder ? toggleFolder(node.path || node.name) : selectFile(node.path || node.name)}
      >
        {/* Toggle Folder Collapse Icon */}
        {isFolder ? (
          <span className={`material-symbols-outlined text-[15px] group-hover:text-white transition-transform duration-300 ${node.expanded ? 'rotate-90 text-[#c3c0ff]' : 'text-[#918fa1]/60'}`}>
            chevron_right
          </span>
        ) : (
          <span className="w-[15px]"></span>
        )}

        {/* File Type Icon */}
        <div className="flex items-center justify-center w-4 h-4 transition-transform duration-300 group-hover:scale-105">
          {getIcon()}
        </div>

        {/* Node Name */}
        <span className={`text-[12px] font-medium tracking-wide truncate ${isSelected ? 'font-semibold text-white' : 'text-outline/90 group-hover:text-[#e4e1ee]'}`}>
          {node.name}
        </span>

        {/* Micro Glow dot on selected */}
        {isSelected && (
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(195,192,255,1)] ml-auto animate-pulse" />
        )}
      </div>
      
      <AnimatePresence>
        {isFolder && node.expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="flex flex-col ml-4.5 mt-0.5 mb-0.5 border-l border-white/[0.06] hover:border-primary/20 transition-colors pl-3 overflow-hidden"
          >
            {node.children && node.children.map((child, idx) => (
              <FileTreeNode 
                key={idx} 
                node={child} 
                selectFile={selectFile} 
                toggleFolder={toggleFolder} 
                selectedFile={selectedFile} 
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function FilesPanel({ fileTree, selectFile, toggleFolder, selectedFile }) {
  const [filterQuery, setFilterQuery] = useState('');

  const filterTree = (nodes, query) => {
    if (!query) return nodes;
    return nodes
      .map(node => {
        if (node.name.toLowerCase().includes(query.toLowerCase())) {
          return node;
        }
        if (node.children) {
          const filteredChildren = filterTree(node.children, query);
          if (filteredChildren.length > 0) {
            return { ...node, children: filteredChildren, expanded: true };
          }
        }
        return null;
      })
      .filter(Boolean);
  };

  const displayedTree = filterTree(fileTree || [], filterQuery);

  return (
    <section className="w-full flex flex-col h-full bg-[#08080c]/90 backdrop-blur-2xl z-20 shrink-0 border border-white/5 rounded-2xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary-container/10 to-transparent pointer-events-none"></div>


      {/* Explorer Search & Action Bar */}
      <div className="pl-6 pr-5 py-4 border-b border-white/5 bg-[#0a0a0f]/40 flex flex-col gap-2.5 relative z-10 select-none">
        {/* Actions Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 ml-1">
            <span className="material-symbols-outlined text-[15px] text-primary/80 animate-[pulse_3s_infinite]" style={{ fontVariationSettings: "'FILL' 1" }}>folder_open</span>
            <span className="text-[#e4e1ee]/90 font-label-caps text-[9px] uppercase tracking-[0.2em] font-extrabold">Files Explorer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="w-6 h-6 rounded bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-outline hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-90" title="New File">
              <span className="material-symbols-outlined text-[13px]">note_add</span>
            </button>
            <button className="w-6 h-6 rounded bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-outline hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-90" title="New Folder">
              <span className="material-symbols-outlined text-[13px]">create_new_folder</span>
            </button>
            <button className="w-6 h-6 rounded bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 text-outline hover:text-white transition-all cursor-pointer flex items-center justify-center active:scale-90" title="Refresh list">
              <span className="material-symbols-outlined text-[13px]">refresh</span>
            </button>
          </div>
        </div>

        {/* Dynamic Visual Search Filter */}
        <div className="relative flex items-center bg-[#13131c]/60 rounded-xl border border-white/5 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all px-3.5 py-2 shadow-inner">
          <span className="material-symbols-outlined text-outline/40 text-[13px] mr-1.5">search</span>
          <input 
            type="text" 
            placeholder="Filter files..." 
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full bg-transparent border-none text-[12px] text-white focus:outline-none placeholder:text-outline/35 font-code-md select-text"
          />
          {filterQuery && (
            <span 
              onClick={() => setFilterQuery('')}
              className="material-symbols-outlined text-outline/40 hover:text-white text-[12px] ml-1.5 cursor-pointer"
            >
              close
            </span>
          )}
        </div>
      </div>

      {/* Explorer Tree */}
      <div className="flex-1 overflow-y-auto flex flex-col py-3 font-code-md relative z-10">
        <div className="flex flex-col pb-4">
          {displayedTree && displayedTree.length > 0 ? (
            displayedTree.map((node, idx) => (
              <FileTreeNode 
                key={idx} 
                node={node} 
                selectFile={selectFile} 
                toggleFolder={toggleFolder} 
                selectedFile={selectedFile} 
                depth={0}
              />
            ))
          ) : (
            <div className="px-6 py-12 flex flex-col items-center justify-center text-center gap-3 opacity-60">
              <span className="material-symbols-outlined text-[28px] text-outline/30 animate-pulse">folder_open</span>
              <span className="text-outline/50 text-[11px] font-medium tracking-wide">
                {filterQuery ? 'No matching files' : 'Workspace is empty'}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

