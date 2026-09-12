import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  ChevronRight,
  FilePlus,
  FolderPlus,
  Trash2,
  RotateCw,
  Search,
  X,
  Sparkles,
  FolderOpen,
  ChevronsDownUp,
  AlertTriangle,
  CornerDownLeft
} from 'lucide-react';
import { FileIcon, FolderLogo } from './Logos';

// Build recursive tree structure from list of file paths
const buildTree = (paths) => {
  const root = {};
  paths.forEach((path) => {
    const isExplicitDir = path.endsWith('/') || path.endsWith('\\');
    const cleanPath = isExplicitDir ? path.slice(0, -1) : path;
    const parts = cleanPath.split(/[/\\]/);
    let current = root;
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;

      const isDir = i < parts.length - 1 || (i === parts.length - 1 && isExplicitDir);

      if (!current[part]) {
        current[part] = {
          name: part,
          isDir: isDir,
          fullPath: parts.slice(0, i + 1).join('/'),
          children: {}
        };
      } else if (isDir) {
        current[part].isDir = true;
      }
      current = current[part].children;
    }
  });
  return root;
};

// Sort directories first, then alphabetical
const sortNodes = (entries) => {
  return [...entries].sort((a, b) => {
    const nodeA = a[1];
    const nodeB = b[1];
    if (nodeA.isDir && !nodeB.isDir) return -1;
    if (!nodeA.isDir && nodeB.isDir) return 1;
    return nodeA.name.localeCompare(nodeB.name, undefined, { sensitivity: 'base', numeric: true });
  });
};

// Search Query Highlight Component
const HighlightedText = ({ text, query }) => {
  if (!query || !query.trim()) {
    return <span className="truncate">{text}</span>;
  }
  const q = query.trim().toLowerCase();
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(q);

  if (index === -1) {
    return <span className="truncate">{text}</span>;
  }

  const before = text.slice(0, index);
  const match = text.slice(index, index + query.trim().length);
  const after = text.slice(index + query.trim().length);

  return (
    <span className="truncate">
      {before}
      <span className="text-cyanAccent font-bold bg-cyanAccent/20 px-0.5 py-0.2 rounded shadow-[0_0_8px_rgba(0,240,255,0.3)]">
        {match}
      </span>
      {after}
    </span>
  );
};

// Inline File/Folder Creation Input
const InlineCreateInput = ({
  type,
  paddingLeft,
  value,
  onChange,
  onSubmit,
  onCancel,
  hasError
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        onCancel();
      }
    };

    const handleWindowBlur = () => {
      onCancel();
    };

    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('blur', handleWindowBlur);
    }, 50);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [onCancel]);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: -6, height: 0 }}
      animate={{ opacity: 1, y: 0, height: 'auto' }}
      exit={{ opacity: 0, y: -6, height: 0 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="py-1 pr-2 flex flex-col gap-1 overflow-hidden"
      style={{ paddingLeft }}
    >
      <motion.div
        animate={hasError ? { x: [-4, 4, -3, 3, 0] } : {}}
        transition={{ duration: 0.3 }}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0e1118] border ${
          hasError
            ? 'border-rose-500/70 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
            : 'border-cyanAccent/50 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
        } backdrop-blur-xl transition-all`}
      >
        <div className="shrink-0 flex items-center justify-center">
          {type === 'file' ? (
            <FileIcon name={value.trim() || 'file.jsx'} className="w-3.5 h-3.5" />
          ) : (
            <FolderPlus className="w-3.5 h-3.5 text-cyanAccent animate-pulse" />
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onSubmit}
          placeholder={type === 'file' ? 'filename.jsx' : 'folder-name'}
          autoFocus
          className="w-full bg-transparent text-[11px] font-mono text-white placeholder-gray-500 focus:outline-none"
        />
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-rose-400 p-0.5 rounded cursor-pointer"
            title="Cancel"
          >
            <X size={11} />
          </button>
          <div className="flex items-center gap-1 text-[8px] font-mono text-cyanAccent/70 pl-0.5 border-l border-white/[0.08]">
            <CornerDownLeft size={9} />
          </div>
        </div>
      </motion.div>
      <div className="flex items-center justify-between px-1 text-[8px] font-mono text-gray-500">
        <span>↵ Enter to save • Esc to cancel</span>
        {type === 'file' && value && (
          <span className="text-cyanAccent/70 truncate max-w-[80px]">
            {value.includes('.') ? value.split('.').pop() : 'raw'}
          </span>
        )}
      </div>
    </motion.div>
  );
};

// File & Folder Node Component with Micro-Interactions
const FileNode = ({
  name,
  node,
  depth = 0,
  selectedFile,
  onSelectFile,
  selectedFolder,
  onSelectFolder,
  isCreating,
  creationType,
  creationTarget,
  newFileName,
  setNewFileName,
  handleCreate,
  onCancelCreate,
  onStartDelete,
  onStartInlineCreate,
  searchQuery,
  expandedFolders,
  toggleFolder,
  createError
}) => {
  const paddingLeft = depth * 14 + 10;
  // Automatically expand all folders during active search or if in expandedFolders Set
  const isExpanded = Boolean(searchQuery.trim()) || expandedFolders.has(node.fullPath);

  if (node.isDir) {
    const isFolderSelected = selectedFolder === node.fullPath;

    return (
      <div className="flex flex-col">
        {/* Folder Row */}
        <motion.div
          onClick={() => {
            toggleFolder(node.fullPath);
            if (onSelectFolder) {
              onSelectFolder(isFolderSelected ? null : node.fullPath);
            }
          }}
          whileHover={{ x: 2, backgroundColor: 'rgba(255,255,255,0.035)' }}
          whileTap={{ scale: 0.99 }}
          className={`group flex items-center gap-1.5 py-1 px-2 cursor-pointer transition-all rounded-xl select-none text-left relative ${
            isFolderSelected
              ? 'bg-cyanAccent/[0.08] text-cyanAccent font-semibold border-l-2 border-cyanAccent shadow-[0_0_12px_rgba(0,240,255,0.12)]'
              : 'text-gray-300 hover:text-white'
          }`}
          style={{ paddingLeft: isFolderSelected ? paddingLeft - 2 : paddingLeft }}
        >
          {/* Animated Chevron indicator */}
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ type: 'spring', stiffness: 450, damping: 28 }}
            className="w-3.5 h-3.5 flex items-center justify-center shrink-0 text-gray-500 group-hover:text-cyanAccent transition-colors"
          >
            <ChevronRight className="w-3 h-3 stroke-[2.5]" />
          </motion.div>

          {/* Folder Icon with dynamic open/closed state */}
          <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
            {isExpanded ? (
              <FolderOpen className="w-3.5 h-3.5 text-cyanAccent drop-shadow-[0_0_6px_rgba(0,240,255,0.4)]" />
            ) : (
              <FolderLogo className="w-3.5 h-3.5 opacity-85 group-hover:opacity-100" />
            )}
          </div>

          {/* Folder Name with search highlight */}
          <span className="font-mono text-[11px] truncate flex-1 tracking-tight group-hover:text-white transition-colors">
            <HighlightedText text={name} query={searchQuery} />
          </span>

          {/* Hover Quick Action Buttons */}
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity duration-150 shrink-0">
            {/* Quick add file in folder */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                if (onStartInlineCreate) onStartInlineCreate('file', node.fullPath);
              }}
              className="p-1 rounded-md text-gray-400 hover:text-cyanAccent hover:bg-cyanAccent/10 transition-colors cursor-pointer"
              title={`New file in ${name}`}
            >
              <FilePlus className="w-3 h-3" />
            </motion.button>

            {/* Quick add folder in folder */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                if (onStartInlineCreate) onStartInlineCreate('folder', node.fullPath);
              }}
              className="p-1 rounded-md text-gray-400 hover:text-cyanAccent hover:bg-cyanAccent/10 transition-colors cursor-pointer"
              title={`New folder in ${name}`}
            >
              <FolderPlus className="w-3 h-3" />
            </motion.button>

            {/* Quick delete folder */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                if (onStartDelete) onStartDelete(node.fullPath, 'folder', name);
              }}
              className="p-1 rounded-md text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              title={`Delete ${name}`}
            >
              <Trash2 className="w-3 h-3" />
            </motion.button>
          </div>
        </motion.div>

        {/* Folder Children / Subtree */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col relative overflow-hidden"
            >
              {/* Tree Indentation Guide Line */}
              <div
                className="absolute top-0 bottom-0 w-px bg-white/[0.06] hover:bg-cyanAccent/30 transition-colors"
                style={{ left: paddingLeft + 6 }}
              />

              {/* Inline Input inside folder */}
              <AnimatePresence>
                {isCreating && creationTarget === node.fullPath && (
                  <InlineCreateInput
                    type={creationType}
                    paddingLeft={paddingLeft + 18}
                    value={newFileName}
                    onChange={setNewFileName}
                    onSubmit={handleCreate}
                    onCancel={onCancelCreate}
                    hasError={createError}
                  />
                )}
              </AnimatePresence>

              {/* Child Nodes */}
              {sortNodes(Object.entries(node.children)).map(([childName, childNode]) => (
                <FileNode
                  key={childNode.fullPath}
                  name={childName}
                  node={childNode}
                  depth={depth + 1}
                  selectedFile={selectedFile}
                  onSelectFile={onSelectFile}
                  selectedFolder={selectedFolder}
                  onSelectFolder={onSelectFolder}
                  isCreating={isCreating}
                  creationType={creationType}
                  creationTarget={creationTarget}
                  newFileName={newFileName}
                  setNewFileName={setNewFileName}
                  handleCreate={handleCreate}
                  onCancelCreate={onCancelCreate}
                  onStartDelete={onStartDelete}
                  onStartInlineCreate={onStartInlineCreate}
                  searchQuery={searchQuery}
                  expandedFolders={expandedFolders}
                  toggleFolder={toggleFolder}
                  createError={createError}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // File Row Rendering
  const isSelected = selectedFile === node.fullPath;

  return (
    <motion.div
      onClick={() => onSelectFile && onSelectFile(node.fullPath)}
      whileHover={{ x: 2, backgroundColor: 'rgba(255,255,255,0.035)' }}
      whileTap={{ scale: 0.99 }}
      className={`group flex items-center gap-2 py-1 px-2 cursor-pointer transition-all rounded-xl select-none text-left relative overflow-hidden ${
        isSelected
          ? 'bg-cyanAccent/[0.09] text-white font-medium border border-cyanAccent/25 shadow-[0_0_15px_rgba(0,240,255,0.12)]'
          : 'text-gray-400 hover:text-gray-200'
      }`}
      style={{ paddingLeft: isSelected ? paddingLeft + 12 : paddingLeft + 14 }}
    >
      {/* Fluid Active File Left Accent Glow (Shared layout indicator) */}
      {isSelected && (
        <motion.div
          layoutId="activeFileIndicator"
          className="absolute left-0 inset-y-1 w-1 rounded-r-full bg-cyanAccent shadow-[0_0_10px_rgba(0,240,255,0.8)]"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}

      {/* File Icon */}
      <div className="shrink-0 transition-transform duration-200 group-hover:scale-110">
        <FileIcon name={name} className="w-3.5 h-3.5" />
      </div>

      {/* File Name with search highlight */}
      <span
        className={`font-mono text-[11px] truncate flex-1 tracking-tight transition-colors ${
          isSelected ? 'text-cyanAccent font-semibold' : 'text-gray-300 group-hover:text-white'
        }`}
      >
        <HighlightedText text={name} query={searchQuery} />
      </span>

      {/* Action button on Hover (Delete File) */}
      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          if (onStartDelete) onStartDelete(node.fullPath, 'file', name);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-150 cursor-pointer shrink-0"
        title={`Delete ${name}`}
      >
        <Trash2 className="w-3 h-3" />
      </motion.button>
    </motion.div>
  );
};

export default function Sidebar({
  files = [],
  selectedFile,
  onSelectFile,
  onCreateFile,
  onDeleteFileOrFolder,
  onRefresh
}) {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [creationType, setCreationType] = useState('file');
  const [newFileName, setNewFileName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [createError, setCreateError] = useState(false);

  const searchInputRef = useRef(null);

  // Filter out internal Docker artifacts and apply search query
  const filteredFiles = useMemo(() => {
    return files.filter((path) => {
      const filename = path.split(/[/\\]/).pop().toLowerCase();
      const isInternal = filename === 'dockerfile' || filename === '.dockerignore';
      if (isInternal) return false;
      if (!searchQuery.trim()) return true;
      return path.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [files, searchQuery]);

  const tree = useMemo(() => buildTree(filteredFiles), [filteredFiles]);

  // Set of expanded folder paths
  const [expandedFolders, setExpandedFolders] = useState(() => {
    const initial = new Set();
    files.forEach((path) => {
      const parts = path.split(/[/\\]/);
      if (parts.length > 1) {
        initial.add(parts[0]);
        if (parts.length > 2) {
          initial.add(`${parts[0]}/${parts[1]}`);
        }
      }
    });
    return initial;
  });

  // Auto-focus search input when opened
  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    }
  }, [showSearch]);

  const toggleSearch = () => {
    setShowSearch((prev) => {
      if (prev) {
        setSearchQuery('');
      }
      return !prev;
    });
  };

  const toggleFolder = useCallback((folderPath) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  }, []);

  // Collapse / Expand All toggle
  const allDirs = useMemo(() => {
    const dirs = new Set();
    const collectDirs = (obj) => {
      Object.values(obj).forEach((node) => {
        if (node.isDir) {
          dirs.add(node.fullPath);
          collectDirs(node.children);
        }
      });
    };
    collectDirs(tree);
    return dirs;
  }, [tree]);

  const isAllCollapsed = expandedFolders.size === 0;

  const handleToggleCollapseAll = () => {
    if (isAllCollapsed) {
      setExpandedFolders(new Set(allDirs));
    } else {
      setExpandedFolders(new Set());
    }
  };

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setIsRefreshing(false), 550);
      }
    }
  };

  const handleStartCreation = (type) => {
    if (isCreating && creationType === type && !selectedFolder) {
      setIsCreating(false);
      setNewFileName('');
      setCreateError(false);
    } else {
      setIsCreating(true);
      setCreationType(type);
      setNewFileName('');
      setCreateError(false);
    }
  };

  const handleStartInlineCreate = (type, folderPath) => {
    setSelectedFolder(folderPath);
    setExpandedFolders((prev) => new Set([...prev, folderPath]));
    setIsCreating(true);
    setCreationType(type);
    setNewFileName('');
    setCreateError(false);
  };

  const handleCancelCreate = useCallback(() => {
    setIsCreating(false);
    setNewFileName('');
    setCreateError(false);
  }, []);

  const handleCreate = async (e) => {
    if (e.key === 'Enter') {
      const trimmed = newFileName.trim();
      if (!trimmed) {
        setCreateError(true);
        setTimeout(() => setCreateError(false), 500);
        return;
      }

      if (onCreateFile) {
        const fullPath = selectedFolder ? `${selectedFolder}/${trimmed}` : trimmed;
        const res = await onCreateFile(fullPath, creationType);
        if (res && res.success) {
          setIsCreating(false);
          setNewFileName('');
          setCreateError(false);
        } else {
          setCreateError(true);
          setTimeout(() => setCreateError(false), 500);
        }
      }
    } else if (e.key === 'Escape') {
      handleCancelCreate();
    }
  };

  const handleStartDelete = (path, type, name) => {
    setDeleteConfirm({ path, type, name });
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirm && onDeleteFileOrFolder) {
      const res = await onDeleteFileOrFolder(deleteConfirm.path, deleteConfirm.type);
      if (res && res.success) {
        setDeleteConfirm(null);
        if (selectedFolder === deleteConfirm.path) {
          setSelectedFolder(null);
        }
      }
    }
  };

  const creationTarget = selectedFolder;

  return (
    <motion.section
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex flex-col h-full bg-[#08090d]/95 backdrop-blur-2xl border border-white/[0.08] rounded-2xl z-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden relative font-sans select-none"
    >
      {/* Top Ambient Cyan Accent Glow Strip */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyanAccent/50 to-transparent z-20 pointer-events-none" />

      {/* Subtle Ambient Radial Lighting */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyanAccent/[0.06] rounded-full blur-[70px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/[0.05] rounded-full blur-[70px] pointer-events-none" />

      {/* 1. Explorer Brand & Toolbar Header */}
      <header className="px-3.5 py-3 border-b border-white/[0.06] bg-[#0c0e14]/90 backdrop-blur-xl flex items-center justify-between relative z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: 12, scale: 1.05 }}
            className="w-7 h-7 rounded-xl bg-cyanAccent/10 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent shadow-[0_0_12px_rgba(0,240,255,0.25)] shrink-0 cursor-default"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </motion.div>
          <div className="flex flex-col min-w-0">
            <span className="font-mono text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-1.5">
              Explorer
              <span className="text-[8px] px-1.5 py-0.2 rounded-md bg-cyanAccent/15 text-cyanAccent font-bold border border-cyanAccent/30">
                Vite
              </span>
            </span>
            <span className="text-[8px] text-gray-500 font-mono tracking-tight flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              {filteredFiles.length} {filteredFiles.length === 1 ? 'file' : 'files'}
            </span>
          </div>
        </div>

        {/* Explorer Action Tools */}
        <div className="flex items-center gap-1">
          {/* Toggle Search Filter */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleSearch}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              showSearch
                ? 'bg-cyanAccent/20 border-cyanAccent/50 text-cyanAccent shadow-[0_0_10px_rgba(0,240,255,0.25)]'
                : 'border-white/[0.06] hover:border-white/[0.15] bg-white/[0.02] text-gray-400 hover:text-white'
            }`}
            title="Search / Filter (Ctrl+F)"
          >
            <Search className="w-3.5 h-3.5" />
          </motion.button>

          {/* Collapse / Expand All Folders */}
          {allDirs.size > 0 && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleToggleCollapseAll}
              className="p-1.5 rounded-lg border border-white/[0.06] hover:border-white/[0.15] bg-white/[0.02] text-gray-400 hover:text-white transition-all cursor-pointer"
              title={isAllCollapsed ? 'Expand All Folders' : 'Collapse All Folders'}
            >
              <ChevronsDownUp className={`w-3.5 h-3.5 transition-transform ${isAllCollapsed ? 'rotate-180' : ''}`} />
            </motion.button>
          )}

          {/* Refresh File Tree */}
          {onRefresh && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.92 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg border border-white/[0.06] hover:border-white/[0.15] bg-white/[0.02] text-gray-400 hover:text-white transition-all cursor-pointer disabled:opacity-40"
              title="Refresh Workspace Files"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyanAccent' : ''}`} />
            </motion.button>
          )}

          {/* Create File Button (Root) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleStartCreation('file')}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isCreating && creationType === 'file' && !selectedFolder
                ? 'bg-cyanAccent/20 border-cyanAccent/50 text-cyanAccent shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'border-white/[0.06] hover:border-white/[0.15] bg-white/[0.02] text-gray-400 hover:text-white'
            }`}
            title="New File (Root)"
          >
            <FilePlus className="w-3.5 h-3.5" />
          </motion.button>

          {/* Create Folder Button (Root) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => handleStartCreation('folder')}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              isCreating && creationType === 'folder' && !selectedFolder
                ? 'bg-cyanAccent/20 border-cyanAccent/50 text-cyanAccent shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                : 'border-white/[0.06] hover:border-white/[0.15] bg-white/[0.02] text-gray-400 hover:text-white'
            }`}
            title="New Folder (Root)"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </header>

      {/* 2. Interactive Search Filter Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="px-3 py-2 border-b border-white/[0.06] bg-[#0c0f16] overflow-hidden shrink-0"
          >
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    if (searchQuery) setSearchQuery('');
                    else setShowSearch(false);
                  }
                }}
                placeholder="Filter files by name (e.g. App.jsx)..."
                className="w-full bg-[#121622] border border-white/[0.08] focus:border-cyanAccent/50 rounded-xl pl-8 pr-8 py-1.5 text-[11px] font-mono text-white placeholder-gray-500 focus:outline-none focus:shadow-[0_0_15px_rgba(0,240,255,0.12)] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-gray-500 hover:text-white p-0.5 rounded transition-colors cursor-pointer"
                  title="Clear search"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            {searchQuery && (
              <div className="flex items-center justify-between mt-1 px-1 text-[9px] font-mono text-gray-500">
                <span>{filteredFiles.length} match{filteredFiles.length === 1 ? '' : 'es'}</span>
                <span>Press ESC to clear</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main File Tree Scroll Container */}
      <div className="flex-1 overflow-y-auto flex flex-col py-2 px-1 scrollbar-thin relative z-10 custom-scrollbar">
        {/* Root Level Creation Input */}
        <AnimatePresence>
          {isCreating && !creationTarget && (
            <InlineCreateInput
              type={creationType}
              paddingLeft={12}
              value={newFileName}
              onChange={setNewFileName}
              onSubmit={handleCreate}
              onCancel={handleCancelCreate}
              hasError={createError}
            />
          )}
        </AnimatePresence>

        {/* Tree Content / Empty States */}
        {filteredFiles.length === 0 ? (
          <div className="px-4 py-16 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-500 shadow-sm">
              <FolderOpen size={18} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold text-gray-300">
                {searchQuery ? 'No matching files found' : 'Workspace Empty'}
              </p>
              <p className="text-[10px] text-gray-500 max-w-[190px] leading-relaxed font-mono">
                {searchQuery ? `No files match query "${searchQuery}"` : 'Create files above or sync from sandbox'}
              </p>
            </div>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery('')}
                className="px-3 py-1 rounded-lg text-[10px] font-mono font-semibold text-cyanAccent bg-cyanAccent/10 border border-cyanAccent/25 hover:bg-cyanAccent/20 transition-all cursor-pointer"
              >
                Clear Filter
              </button>
            ) : (
              <button
                onClick={() => handleStartCreation('file')}
                className="px-3 py-1 rounded-lg text-[10px] font-mono font-semibold text-cyanAccent bg-cyanAccent/10 border border-cyanAccent/25 hover:bg-cyanAccent/20 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <FilePlus size={11} />
                <span>Create New File</span>
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-0.5">
            {sortNodes(Object.entries(tree)).map(([name, node]) => (
              <FileNode
                key={node.fullPath}
                name={name}
                node={node}
                depth={0}
                selectedFile={selectedFile}
                onSelectFile={onSelectFile}
                selectedFolder={selectedFolder}
                onSelectFolder={setSelectedFolder}
                isCreating={isCreating}
                creationType={creationType}
                creationTarget={creationTarget}
                newFileName={newFileName}
                setNewFileName={setNewFileName}
                handleCreate={handleCreate}
                onCancelCreate={handleCancelCreate}
                onStartDelete={handleStartDelete}
                onStartInlineCreate={handleStartInlineCreate}
                searchQuery={searchQuery}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                createError={createError}
              />
            ))}
          </div>
        )}
      </div>

      {/* 4. Footer Status Bar with Active File Snippet & Sync Indicator */}
      <footer className="px-3 py-2 border-t border-white/[0.06] bg-[#0c0e14]/85 backdrop-blur-xl flex items-center justify-between text-[9px] font-mono shrink-0 relative z-10">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative flex items-center justify-center shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
          </div>
          {selectedFile ? (
            <div className="flex items-center gap-1.5 truncate text-gray-400">
              <FileIcon name={selectedFile} className="w-3 h-3 shrink-0" />
              <span className="truncate text-gray-300 font-semibold">{selectedFile}</span>
            </div>
          ) : (
            <span className="text-gray-400">Workspace Synced</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-gray-500 font-mono">React 19</span>
        </div>
      </footer>

      {/* 5. Custom Cyberpunk Glassmorphic Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 28 }}
              className="w-full max-w-sm overflow-hidden rounded-2xl border border-rose-500/30 bg-[#0e1118]/95 p-5 shadow-[0_25px_65px_rgba(244,63,94,0.25)] backdrop-blur-2xl relative"
            >
              {/* Subtle crimson aura */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)] shrink-0">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Delete {deleteConfirm.type === 'file' ? 'File' : 'Folder'}?
                  </h3>
                  <span className="text-[10px] text-rose-400/90 font-mono font-medium flex items-center gap-1">
                    <AlertTriangle size={10} />
                    Permanent & Irreversible
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-300 leading-relaxed mb-5 relative z-10">
                Are you sure you want to permanently delete{' '}
                <span className="font-mono font-bold text-rose-300 break-all px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/25">
                  {deleteConfirm.name}
                </span>
                ? This will remove it from the sandbox filesystem.
              </p>

              <div className="flex items-center justify-end gap-2.5 relative z-10">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setDeleteConfirm(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium text-gray-400 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] transition-all cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 rounded-xl text-xs font-mono font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.35)] transition-all cursor-pointer"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
