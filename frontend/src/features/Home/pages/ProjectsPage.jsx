import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useHome } from '../Hooks/useHome';
import { useSelector } from 'react-redux';
import { useAuth } from '../../Auth/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { Plus, Folder, Terminal, ArrowRight, Loader2, Clock, Sparkles, LogOut, Code2 } from 'lucide-react';
import Toast from '../components/Toast';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const { projects, isLoadingProjects, fetchProjects, createNewProject, initWorkspace } = useHome();
  const { logoutUser } = useAuth();

  const [newTitle, setNewTitle] = useState('');
  const [isCreatingLocal, setIsCreatingLocal] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState(null); // track which project is spinning up
  const [showCreateForm, setShowCreateForm] = useState(false);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  // If user is not authenticated, navigate to auth
  useEffect(() => {
    console.log(user)
    if (!user) {
      navigate('/auth');
    } else {
      fetchProjects();
    }
  }, [user]);

  // GSAP mounting animations
  useEffect(() => {
    if (projects.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
        gsap.fromTo(
          '.project-card',
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: 'back.out(1.2)',
            delay: 0.1,
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [projects]);

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsCreatingLocal(true);
    const result = await createNewProject(newTitle.trim());
    setIsCreatingLocal(false);
    if (result && result.success) {
      setNewTitle('');
      setShowCreateForm(false);
    }
  };

  const handleSelectProject = async (projectId) => {
    setLoadingProjectId(projectId);
    try {
      // Connects to sandbox pod and fetches files
      await initWorkspace(projectId, true);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjectId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-background text-on-background relative overflow-hidden font-body-md py-12 px-6 md:px-12 selection:bg-primary-container selection:text-on-primary-container"
    >
      <Toast />

      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-tertiary-container/3 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Header Section */}
        <header
          ref={headerRef}
          className="flex justify-between items-center mb-16 pb-6 border-b border-outline-variant/10"
        >
          <div className="flex items-center gap-3">
            <img src="/logo/logo.png" className="h-10 w-auto object-contain" alt="FrameForge" />
            <span className="text-sm font-mono-data text-on-surface-variant/40 px-2 py-0.5 border border-outline-variant/20 rounded-md">
              v3.0.0
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-on-surface-variant font-label-caps">
              Welcome, <span className="text-primary font-bold">{user}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-outline-variant/20 hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 text-sm text-on-surface-variant font-label-caps transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Log out</span>
            </button>
          </div>
        </header>

        {/* Hero title */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
              Your Workspaces
            </h1>
            <p className="text-on-surface-variant/70 text-base max-w-xl font-light">
              Select an existing sandbox workspace or forge a new container to build interactive applications.
            </p>
          </div>

          <button
            onClick={() => setShowCreateForm(prev => !prev)}
            className="group px-5 py-2.5 rounded-xl bg-primary text-background font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            <span>Create Project</span>
          </button>
        </div>

        {/* Create Project Modal/Card Overlay */}
        <AnimatePresence>
          {showCreateForm && (
            <motion.div
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="overflow-hidden mb-10"
            >
              <form
                onSubmit={handleCreateProjectSubmit}
                className="w-full max-w-xl p-8 glass-panel rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col gap-5"
              >
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">New Workspace Details</h3>
                  <p className="text-xs text-on-surface-variant/60 font-light">
                    Provide a name for your workspace. We'll set up a sandbox container immediately.
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Nexus Dashboard, Portfolio template..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    disabled={isCreatingLocal}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white placeholder-gray-500 rounded-xl border border-white/10 focus:border-white focus:outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isCreatingLocal}
                    className="px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-white/95 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingLocal ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Forge Container</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loader for first load */}
        {isLoadingProjects && projects.length === 0 ? (
          <div className="w-full py-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-on-surface-variant/60 font-mono-data text-xs">Loading projects database...</p>
          </div>
        ) : projects.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full p-16 text-center glass-panel rounded-3xl border border-white/10 bg-black/20 backdrop-blur-md flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <Folder className="w-8 h-8 text-on-surface-variant/50" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
              <p className="text-on-surface-variant/60 max-w-sm mx-auto text-sm font-light">
                You haven't forged any sandbox containers yet. Click the "Create Project" button to bootstrap your first one.
              </p>
            </div>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-white/95 transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </motion.div>
        ) : (
          /* Projects Grid */
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => {
              const isCurrentLoading = loadingProjectId === project._id;

              return (
                <motion.div
                  key={project._id}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="project-card group relative p-6 glass-panel rounded-2xl border border-white/5 bg-black/40 hover:bg-white/5 hover:border-white/20 transition-all duration-300 flex flex-col justify-between h-[180px] overflow-hidden"
                >
                  {/* Subtle inner card glow on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                        <Code2 size={20} />
                      </div>
                      <span className="flex items-center gap-1.5 text-xs text-on-surface-variant/40 font-mono-data font-light">
                        <Clock size={12} />
                        {new Date(project.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors line-clamp-1 mb-2">
                      {project.title}
                    </h3>
                  </div>

                  {/* Card Bottom / Action */}
                  <div className="relative z-10 flex justify-between items-center border-t border-white/5 pt-4">
                    <span className="text-xs text-on-surface-variant/50 font-mono-data">
                      ID: {project._id.substring(0, 8)}...
                    </span>

                    <button
                      onClick={() => handleSelectProject(project._id)}
                      disabled={loadingProjectId !== null}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold font-label-caps transition-all cursor-pointer flex items-center gap-1.5 ${isCurrentLoading
                          ? 'bg-primary/20 text-primary border border-primary/20'
                          : 'bg-white/5 hover:bg-primary hover:text-background border border-white/10 group-hover:border-primary/0'
                        }`}
                    >
                      {isCurrentLoading ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>Booting...</span>
                        </>
                      ) : (
                        <>
                          <span>Open IDE</span>
                          <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Glowing line overlay when booting */}
                  {isCurrentLoading && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-transparent to-primary animate-pulse" />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Global Loader Overlay when spinning up the pod */}
      <AnimatePresence>
        {loadingProjectId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-6"
          >
            <div className="relative flex items-center justify-center w-24 h-24">
              {/* Spinning outer rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="absolute w-20 h-20 border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                className="absolute w-16 h-16 border border-b-primary border-t-transparent border-r-transparent border-l-transparent rounded-full opacity-50"
              />
              <Terminal className="w-8 h-8 text-primary animate-pulse" />
            </div>

            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">Orchestrating Workspace Sandbox</h2>
              <p className="text-sm text-on-surface-variant/70 font-light max-w-sm mx-auto">
                Provisioning a new Kubernetes pod container and establishing secure tunnel bridge. This may take up to 30 seconds.
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 px-3 py-1 bg-white/5 border border-white/10 rounded-full font-mono-data text-[10px] text-on-surface-variant/60">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
              STATUS: POD_CREATING
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
