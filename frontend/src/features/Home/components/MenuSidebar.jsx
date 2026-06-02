import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, Home, Folder, ArrowLeft, Loader2, Sparkles, ChevronRight, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function MenuSidebar({
  isOpen,
  onClose,
  user,
  avatar,
  projects,
  isLoadingProjects,
  fetchProjects,
  currentProjectId,
  onSelectProject,
  onLogout
}) {
  const navigate = useNavigate();
  const [loadingProjectId, setLoadingProjectId] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [avatar]);

  useEffect(() => {
    if (isOpen) {
      fetchProjects();
    }
  }, [isOpen]);

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
      console.error(err);
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
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Glassmorphic Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Sidebar Drawer container */}
          <motion.div
            initial={{ x: '100%', opacity: 0.9 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.9 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed right-0 top-0 h-screen w-85 bg-[#09090b]/85 border-l border-white/10 backdrop-blur-2xl z-50 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col select-none"
          >
            {/* Ambient inner card glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-tertiary-container/5 rounded-full blur-[80px] pointer-events-none" />

            {/* Header section */}
            <header className="flex justify-between items-center px-6 py-5 border-b border-white/5 relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                <span className="font-display-lg text-[13px] font-bold text-white tracking-widest uppercase">Forge Workspace</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-white/10 hover:border-white/30 text-gray-400 hover:text-white transition-all cursor-pointer active:scale-95 flex items-center justify-center"
              >
                <X size={15} />
              </button>
            </header>

            {/* Profile Card Section */}
            <div className="px-6 py-6 border-b border-white/5 relative z-10 bg-white/2">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-primary/30 shadow-[0_0_12px_rgba(170,59,255,0.25)] bg-[#121214] flex items-center justify-center">
                    {avatar && !imageError ? (
                      <img 
                        src={avatar} 
                        alt={user} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <span className="text-white text-base font-bold uppercase">
                        {user ? user.substring(0, 2) : 'U'}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#09090b] animate-pulse" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-white truncate">{user || 'Developer'}</p>
                  <p className="text-[10px] text-gray-400 font-mono-data tracking-tight">Session Active</p>
                </div>

                <button
                  onClick={handleLogoutClick}
                  className="p-2 rounded-lg border border-white/5 hover:border-red-500/20 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            </div>

            {/* Sidebar Navigation Options */}
            <div className="px-4 py-4 flex flex-col gap-1 border-b border-white/5 relative z-10">
              <button
                onClick={() => {
                  onClose();
                  navigate('/');
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <Home size={15} className="text-gray-400 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-semibold">Landing Page</span>
                </div>
                <ChevronRight size={12} className="text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>

              <button
                onClick={() => {
                  onClose();
                  navigate('/projects');
                }}
                className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white transition-all text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <ArrowLeft size={15} className="text-gray-400 group-hover:text-primary transition-colors" />
                  <span className="text-xs font-semibold">Back to Projects</span>
                </div>
                <ChevronRight size={12} className="text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

            {/* Projects Switcher Section */}
            <div className="flex-1 flex flex-col min-h-0 relative z-10">
              <div className="px-6 pt-5 pb-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Switch Workspace</span>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-6 flex flex-col gap-2 scrollbar-thin">
                {isLoadingProjects && projects.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center gap-2">
                    <Loader2 size={20} className="text-primary animate-spin" />
                    <span className="text-[10px] text-gray-500 font-mono-data">Syncing projects...</span>
                  </div>
                ) : projects.length === 0 ? (
                  <div className="py-12 text-center flex flex-col items-center gap-3">
                    <Folder size={24} className="text-gray-600" />
                    <p className="text-xs text-gray-500 max-w-[200px] font-light">No other workspaces found.</p>
                  </div>
                ) : (
                  projects.map((project) => {
                    const isActive = project._id === currentProjectId;
                    const isCurrentLoading = loadingProjectId === project._id;

                    return (
                      <button
                        key={project._id}
                        disabled={loadingProjectId !== null}
                        onClick={() => handleProjectClick(project._id)}
                        className={`group relative p-3 rounded-xl border transition-all text-left cursor-pointer overflow-hidden flex flex-col justify-between h-[90px] ${
                          isActive
                            ? 'bg-primary/10 border-primary/45 shadow-[0_0_15px_rgba(170,59,255,0.08)]'
                            : 'bg-white/2 border-white/5 hover:border-white/15 hover:bg-white/5'
                        }`}
                      >
                        {/* Interactive glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                        <div className="flex justify-between items-start w-full relative z-10">
                          <div className="flex items-center gap-2 min-w-0">
                            <Code2 size={13} className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary transition-colors'} />
                            <span className="text-xs font-bold text-white truncate max-w-[150px]">{project.title}</span>
                          </div>
                          {isActive && (
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[8px] font-bold border border-green-500/20">
                              Active
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center w-full mt-auto relative z-10">
                          <span className="text-[9px] font-mono-data text-gray-500">ID: {project._id.substring(0, 8)}</span>
                          <span className="text-[9px] font-mono-data text-primary opacity-0 group-hover:opacity-100 transition-all flex items-center gap-0.5">
                            {isCurrentLoading ? (
                              <Loader2 size={9} className="animate-spin" />
                            ) : (
                              <>
                                <span>{isActive ? 'Current' : 'Open'}</span>
                                <ChevronRight size={9} />
                              </>
                            )}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
