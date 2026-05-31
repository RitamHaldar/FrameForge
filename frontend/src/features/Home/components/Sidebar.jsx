import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, FilePlus, FolderPlus, Trash2, RotateCw } from 'lucide-react';
import { FileIcon, FolderLogo } from './Logos';

const buildTree = (paths) => {
  const root = {};
  paths.forEach(path => {
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

const sortNodes = (entries) => {
  return [...entries].sort((a, b) => {
    const nodeA = a[1];
    const nodeB = b[1];
    if (nodeA.isDir && !nodeB.isDir) return -1;
    if (!nodeA.isDir && nodeB.isDir) return 1;
    return nodeA.name.localeCompare(nodeB.name, undefined, { sensitivity: 'base', numeric: true });
  });
};

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
  onStartDelete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const paddingLeft = depth * 12 + 12;

  // Auto-expand folder when it becomes the target of creation
  useEffect(() => {
    if (creationTarget === node.fullPath && isCreating) {
      setIsOpen(true);
    }
  }, [creationTarget, isCreating, node.fullPath]);

  if (node.isDir) {
    const isFolderSelected = selectedFolder === node.fullPath;
    return (
      <div className="flex flex-col">
        <motion.div
          onClick={() => {
            setIsOpen(!isOpen);
            if (onSelectFolder) {
              onSelectFolder(isFolderSelected ? null : node.fullPath);
            }
          }}
          whileHover={{ x: 4, backgroundColor: '#1b1b1b' }}
          className={`flex items-center gap-1.5 py-1 cursor-pointer transition-all rounded-md group ${isFolderSelected
              ? 'text-primary font-semibold bg-surface-container-high border-l-2 border-primary pl-2 shadow-sm'
              : 'text-on-surface hover:text-on-surface'
            }`}
          style={{ paddingLeft: isFolderSelected ? paddingLeft - 2 : paddingLeft }}
        >
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-outline" /> : <ChevronRight className="w-3.5 h-3.5 text-outline" />}
          <FolderLogo className="w-4 h-4" />
          <span className="font-body-sm text-[13px] select-none flex-1">{name}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onStartDelete) onStartDelete(node.fullPath, 'folder', name);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 mr-1 rounded text-outline hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer shrink-0"
            title="Delete Folder..."
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </motion.div>
        
        {isOpen && (
          <div className="flex flex-col">
            {/* Inline Input immediately under parent folder */}
            {isCreating && creationTarget === node.fullPath && (
              <div 
                className="py-1 flex items-center gap-2"
                style={{ paddingLeft: paddingLeft + 16 }}
              >
                <input
                  type="text"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={handleCreate}
                  placeholder={creationType === 'file' ? "New file name..." : "New folder name..."}
                  autoFocus
                  className="w-full px-2 py-0.5 text-xs bg-surface-container border border-outline-variant/30 rounded focus:outline-none focus:border-primary text-on-surface"
                />
              </div>
            )}
            
            {sortNodes(Object.entries(node.children)).map(([childName, childNode]) => (
              <FileNode
                key={childName}
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
                onStartDelete={onStartDelete}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  const isSelected = selectedFile === node.fullPath;

  return (
    <motion.div
      onClick={() => onSelectFile && onSelectFile(node.fullPath)}
      whileHover={{ x: 4, backgroundColor: '#1f1f1f' }}
      className={`flex items-center gap-2 py-1.5 cursor-pointer transition-all rounded-md group ${isSelected ? 'text-primary font-semibold bg-surface-container-high border-l-2 border-primary pl-2 shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
      style={{ paddingLeft: isSelected ? paddingLeft + 14 : paddingLeft + 16 }}
    >
      <FileIcon name={name} className="w-4 h-4" />
      <span className="font-body-sm text-[13px] select-none flex-1">{name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (onStartDelete) onStartDelete(node.fullPath, 'file', name);
        }}
        className="opacity-0 group-hover:opacity-100 p-1 mr-1 rounded text-outline hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 cursor-pointer shrink-0"
        title="Delete File..."
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
};

export default function Sidebar({ files = [], selectedFile, onSelectFile, onCreateFile, onDeleteFileOrFolder, onRefresh }) {
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [creationType, setCreationType] = useState('file');
  const [newFileName, setNewFileName] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // State for showing custom delete confirmation dialog
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { path, type, name } or null

  const handleRefresh = async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setIsRefreshing(false), 600);
      }
    }
  };

  const filteredFiles = files.filter(path => {
    const filename = path.split(/[/\\]/).pop().toLowerCase();
    return filename !== 'dockerfile' && filename !== '.dockerignore';
  });
  const tree = buildTree(filteredFiles);

  const handleStartCreation = (type) => {
    if (isCreating && creationType === type) {
      setIsCreating(false);
      setNewFileName('');
    } else {
      setIsCreating(true);
      setCreationType(type);
      setNewFileName('');
    }
  };

  const handleCreate = async (e) => {
    if (e.key === 'Enter' && newFileName.trim()) {
      if (onCreateFile) {
        const inputName = newFileName.trim();
        const fullPath = selectedFolder 
          ? `${selectedFolder}/${inputName}` 
          : inputName;

        const res = await onCreateFile(fullPath, creationType);
        if (res && res.success) {
          setIsCreating(false);
          setNewFileName('');
        }
      }
    } else if (e.key === 'Escape') {
      setIsCreating(false);
      setNewFileName('');
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
        // Clear active folder selection if it was the deleted folder
        if (selectedFolder === deleteConfirm.path) {
          setSelectedFolder(null);
        }
      }
    }
  };

  const creationTarget = selectedFolder;

  return (
    <motion.section
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="w-full flex flex-col h-full bg-surface-container-lowest/90 backdrop-blur-md border border-outline-variant/35 rounded-xl z-10 shadow-lg overflow-hidden relative"
    >
      <div className="flex items-center gap-2.5 border-b border-outline-variant/20">
        <img
          src="/logo/logo.png"
          alt="FrameForge Logo"
          style={{ height: '77px' }}
          className="w-auto object-contain"
          draggable={false}
        />
      </div>
      <div className="flex-1 overflow-y-auto flex flex-col py-2 custom-scrollbar">
        <div className="px-3 py-1 text-outline font-label-caps text-[10px] uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Explorer</span>
          <div className="flex items-center gap-1.5">
            {onRefresh && (
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1 rounded text-outline hover:text-on-surface hover:bg-surface-variant/50 transition-colors cursor-pointer disabled:opacity-50"
                title="Refresh Explorer..."
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button 
              onClick={() => handleStartCreation('file')}
              className={`p-1 rounded text-outline hover:text-on-surface hover:bg-surface-variant/50 transition-colors cursor-pointer ${isCreating && creationType === 'file' ? 'text-primary bg-primary/10' : ''}`}
              title="New File..."
            >
              <FilePlus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => handleStartCreation('folder')}
              className={`p-1 rounded text-outline hover:text-on-surface hover:bg-surface-variant/50 transition-colors cursor-pointer ${isCreating && creationType === 'folder' ? 'text-primary bg-primary/10' : ''}`}
              title="New Folder..."
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {isCreating && !creationTarget && (
          <div className="px-3 mb-2">
            <input
              type="text"
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              onKeyDown={handleCreate}
              placeholder={creationType === 'file' ? "New file name..." : "New folder name..."}
              autoFocus
              className="w-full px-2 py-1 text-xs bg-surface-container border border-outline-variant/30 rounded focus:outline-none focus:border-primary text-on-surface"
            />
            <div className="text-[9px] text-outline mt-1 px-1">Press Enter to create, Esc to cancel</div>
          </div>
        )}

        {filteredFiles.length === 0 ? (
          <div className="px-4 py-8 text-center text-outline/50 flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[32px]">folder_open</span>
            <span className="font-body-sm text-[12px]">Files will appear here</span>
          </div>
        ) : (
          <div className="flex flex-col">
            {sortNodes(Object.entries(tree)).map(([name, node]) => (
              <FileNode
                key={name}
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
                onStartDelete={handleStartDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Custom Animated Delete Popup Overlay */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="w-full max-w-sm overflow-hidden rounded-xl border border-rose-500/20 bg-surface shadow-[0_24px_48px_rgba(0,0,0,0.5)] p-5"
            >
              <h3 className="text-base font-bold text-on-surface mb-2 flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-rose-500 shrink-0" />
                Delete {deleteConfirm.type === 'file' ? 'File' : 'Folder'}
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-5">
                Are you sure you want to delete <span className="font-semibold text-rose-400 break-all">{deleteConfirm.name}</span>? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-on-surface/85 hover:text-on-surface hover:bg-surface-variant transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-950/20 active:scale-95 transition-all cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
