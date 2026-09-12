import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  LogOut,
  Home,
  Folder,
  ArrowLeft,
  Loader2,
  Sparkles,
  ChevronRight,
  Code2,
  Search,
  Copy,
  Check,
  Plus,
  Clock,
  Zap,
  Layers
} from 'lucide-react';
import { useNavigate } from 'react-router';

function formatRelativeTime(dateString) {
  if (!dateString) return 'Recent';
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}

export default function MenuSidebar({
  isOpen,
  onClose,
  user,
  avatar,
  projects = [],
  isLoadingProjects = false,
  fetchProjects,
  currentProjectId,
  onSelectProject,
  onLogout
}) {
  const navigate = useNavigate();
  const [loadingProjectId, setLoadingProjectId] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    setImageError(false);
  }, [avatar]);

  useEffect(() => {
    if (isOpen && typeof fetchProjects === 'function') {
      fetchProjects();
    }
  }, [isOpen]);

  const handleCopyId = (e, id) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleProjectClick = async (projectId) => {
    if (projectId === currentProjectId) {
      onClose();
      return;
    }
    setLoadingProjectId(projectId);
    try {
      await onSelectProject(projectId);
      onClose();
    } catch (err) {
      console.error('Failed to switch workspace:', err);
    } finally {
      setLoadingProjectId(null);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await onLogout();
      onClose();
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Filter projects by search query
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return projects;
    const query = searchQuery.toLowerCase();
    return projects.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(query)) ||
        (p._id && p._id.toLowerCase().includes(query))
    );
  }, [projects, searchQuery]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Glassmorphic Backdrop overlay with smooth fade */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Sidebar Drawer container */}
          <motion.aside
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-screen w-92 max-w-[92vw] bg-[#090b10]/95 border-l border-white/[0.08] backdrop-blur-2xl z-50 shadow-[-20px_0_70px_rgba(0,0,0,0.85)] flex flex-col select-none overflow-hidden font-sans"
          >
            {/* Top Cyan Accent Line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyanAccent/50 to-transparent z-20 pointer-events-none" />

            {/* Ambient Background Aura Glows */}
            <div className="absolute -top-16 -right-16 w-52 h-52 bg-cyanAccent/10 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-purple-600/10 rounded-full blur-[90px] pointer-events-none" />

            {/* 1. Header Deck */}
            <header className="flex justify-between items-center px-5 py-4 border-b border-white/[0.06] bg-[#0c0e14]/80 backdrop-blur-xl relative z-10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-cyanAccent/10 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-[11px] font-bold text-white tracking-widest uppercase flex items-center gap-1.5">
                    FrameForge
                    <span className="text-[8px] px-1.5 py-0.2 rounded bg-cyanAccent/15 text-cyanAccent font-semibold border border-cyanAccent/30">
                      HUB
                    </span>
                  </span>
                  <span className="text-[9px] text-gray-400 font-mono">Workspace Controls</span>
                </div>
              </div>

              <motion.button
                whileHover={{ rotate: 90, scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-7 h-7 rounded-xl border border-white/[0.08] hover:border-cyanAccent/40 bg-white/[0.03] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-sm"
                title="Close drawer"
              >
                <X size={14} />
              </motion.button>
            </header>

            {/* 2. User Profile Session Card */}
            <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.015] relative z-10 shrink-0">
              <div className="flex items-center gap-3">
                {/* Avatar with cyan neon aura */}
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-xl overflow-hidden border border-cyanAccent/40 shadow-[0_0_15px_rgba(0,240,255,0.2)] bg-[#10131c] flex items-center justify-center">
                    {avatar && !imageError ? (
                      <img
                        src={avatar}
                        alt={user || 'User'}
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-cyanAccent font-mono text-xs font-bold uppercase">
                        {user ? user.substring(0, 2) : 'DV'}
                      </span>
                    )}
                  </div>
                  {/* Live session pulsing green orb */}
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-[#090b10]" />
                  </span>
                </div>

                {/* User metadata */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate tracking-tight">
                    {user || 'Developer'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <p className="text-[10px] text-gray-400 font-mono tracking-tight">
                      Session Active
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleLogoutClick}
                  className="p-2 rounded-xl border border-white/[0.06] hover:border-red-500/40 bg-white/[0.02] hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer shadow-sm"
                  title="Sign out of workspace"
                >
                  <LogOut size={13} />
                </motion.button>
              </div>
            </div>

            {/* 3. Fast Nav Shortcuts */}
            <div className="px-4 py-3 flex flex-col gap-1 border-b border-white/[0.06] relative z-10 shrink-0">
              <motion.button
                whileHover={{ x: 3, scale: 1.005 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  navigate('/');
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] text-gray-300 hover:text-white transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/[0.04] group-hover:bg-cyanAccent/15 group-hover:text-cyanAccent flex items-center justify-center text-gray-400 transition-all">
                    <Home size={13} />
                  </div>
                  <span className="text-xs font-semibold">Landing Page</span>
                </div>
                <ChevronRight
                  size={13}
                  className="text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all group-hover:text-cyanAccent"
                />
              </motion.button>

              <motion.button
                whileHover={{ x: 3, scale: 1.005 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onClose();
                  navigate('/projects');
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] text-gray-300 hover:text-white transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-white/[0.04] group-hover:bg-cyanAccent/15 group-hover:text-cyanAccent flex items-center justify-center text-gray-400 transition-all">
                    <Layers size={13} />
                  </div>
                  <span className="text-xs font-semibold">Projects Dashboard</span>
                </div>
                <ChevronRight
                  size={13}
                  className="text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all group-hover:text-cyanAccent"
                />
              </motion.button>
            </div>

            {/* 4. Workspaces Switcher Section */}
            <div className="flex-1 flex flex-col min-h-0 relative z-10">
              {/* Title & Quick Filter Input */}
              <div className="px-4 pt-3.5 pb-2.5 flex flex-col gap-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <Zap size={11} className="text-cyanAccent" />
                    <span className="text-[10px] font-mono font-bold text-cyanAccent uppercase tracking-widest">
                      Switch Workspace
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-gray-400">
                    {filteredProjects.length} found
                  </span>
                </div>

                {/* Instant Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search workspaces..."
                    className="w-full bg-[#10131c] border border-white/[0.08] focus:border-cyanAccent/40 rounded-xl pl-8 pr-7 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:shadow-[0_0_15px_rgba(0,240,255,0.12)] transition-all font-sans"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                    >
                      <X size={11} />
                    </button>
                  )}
                </div>
              </div>

              {/* Workspaces Scroll Area */}
              <div className="flex-1 overflow-y-auto px-4 pb-3 flex flex-col gap-2 scrollbar-thin">
                {isLoadingProjects && projects.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center gap-3">
                    <Loader2 size={22} className="text-cyanAccent animate-spin" />
                    <span className="text-[11px] text-gray-400 font-mono">
                      Syncing cloud workspaces...
                    </span>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="py-14 text-center flex flex-col items-center gap-2.5 px-4">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-gray-500">
                      <Folder size={18} />
                    </div>
                    <p className="text-xs font-semibold text-gray-300">No workspaces match</p>
                    <p className="text-[11px] text-gray-500 max-w-[200px] leading-relaxed">
                      {searchQuery
                        ? `No projects matching "${searchQuery}"`
                        : 'Create a new project to start synthesizing.'}
                    </p>
                  </div>
                ) : (
                  filteredProjects.map((project) => {
                    const isActive = project._id === currentProjectId;
                    const isCurrentLoading = loadingProjectId === project._id;
                    const isCopied = copiedId === project._id;

                    return (
                      <motion.div
                        key={project._id}
                        whileHover={{ x: 2, scale: 1.008 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleProjectClick(project._id)}
                        className={`group relative p-3 rounded-2xl border transition-all text-left cursor-pointer overflow-hidden flex flex-col justify-between min-h-[82px] shadow-sm ${
                          isActive
                            ? 'bg-cyanAccent/[0.08] border-cyanAccent/40 shadow-[0_0_20px_rgba(0,240,255,0.12)]'
                            : 'bg-[#10131c]/70 hover:bg-[#131620] border-white/[0.06] hover:border-white/[0.15]'
                        }`}
                      >
                        {/* Interactive Gradient Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-cyanAccent/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        {/* Top Line: Code icon + Title + Active Pill */}
                        <div className="flex justify-between items-start w-full relative z-10 gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                isActive
                                  ? 'bg-cyanAccent text-black shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                                  : 'bg-white/[0.05] text-gray-400 group-hover:text-cyanAccent'
                              }`}
                            >
                              <Code2 size={12} />
                            </div>
                            <span
                              className={`text-xs font-bold truncate transition-colors ${
                                isActive
                                  ? 'text-cyanAccent'
                                  : 'text-white group-hover:text-cyanAccent'
                              }`}
                            >
                              {project.title || 'Untitled Workspace'}
                            </span>
                          </div>

                          {isActive && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyanAccent/15 text-cyanAccent text-[8px] font-mono font-bold border border-cyanAccent/30 shrink-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyanAccent animate-pulse" />
                              ACTIVE
                            </span>
                          )}
                        </div>

                        {/* Bottom Meta Line: ID with Copy Button + Relative Time + Switch Indicator */}
                        <div className="flex justify-between items-center w-full mt-3 pt-2 border-t border-white/[0.04] relative z-10">
                          {/* Project ID copy button */}
                          <button
                            type="button"
                            onClick={(e) => handleCopyId(e, project._id)}
                            className="flex items-center gap-1 text-[9px] font-mono text-gray-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy project ID"
                          >
                            <span>ID: {project._id.substring(0, 8)}</span>
                            {isCopied ? (
                              <Check size={10} className="text-emerald-400" />
                            ) : (
                              <Copy size={10} className="text-gray-500 group-hover:text-gray-300" />
                            )}
                          </button>

                          {/* Relative Time / Switch state */}
                          <div className="flex items-center gap-2">
                            {project.createdAt && (
                              <div className="flex items-center gap-1 text-[9px] font-mono text-gray-500">
                                <Clock size={9} />
                                <span>{formatRelativeTime(project.createdAt)}</span>
                              </div>
                            )}

                            <span className="text-[9px] font-mono font-bold transition-all flex items-center gap-0.5">
                              {isCurrentLoading ? (
                                <Loader2 size={10} className="text-cyanAccent animate-spin" />
                              ) : (
                                <span
                                  className={`${
                                    isActive
                                      ? 'text-cyanAccent'
                                      : 'text-gray-400 group-hover:text-cyanAccent'
                                  } flex items-center gap-0.5`}
                                >
                                  {isActive ? 'Current' : 'Launch'}
                                  <ChevronRight size={10} />
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>

              {/* 5. Footer: Create Workspace Shortcut */}
              <div className="p-3 border-t border-white/[0.06] bg-[#0c0e14]/90 backdrop-blur-xl shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    navigate('/projects');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyanAccent hover:bg-cyanAccent/90 text-black font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] cursor-pointer"
                >
                  <Plus size={14} className="stroke-[2.5]" />
                  <span>New Workspace</span>
                </motion.button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
