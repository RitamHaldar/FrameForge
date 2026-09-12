import { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useHome } from '../Hooks/useHome';
import { useSelector } from 'react-redux';
import { useAuth } from '../../Auth/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import Lenis from 'lenis';
import {
  Plus,
  Folder,
  Terminal,
  ArrowRight,
  Loader2,
  Clock,
  Sparkles,
  LogOut,
  Code2,
  Search,
  X,
  Copy,
  Check,
  Zap,
  Server,
  Layers,
  Cpu,
  Shield,
  Activity,
  ExternalLink,
  ChevronRight,
  Filter,
  LayoutGrid,
  Laptop
} from 'lucide-react';
import Toast from '../components/Toast';
import CyberGridBackground from '../components/CyberGridBackground';

const STARTER_TEMPLATES = [
  {
    id: 'react-vite',
    name: 'React 19 + Vite 6',
    desc: 'High-speed modern React with Vite HMR, Lucide icons, and Tailwind CSS.',
    badge: 'Recommended',
    tag: 'Frontend',
    icon: Zap,
    defaultName: 'nexus-ui-app'
  },
  {
    id: 'fullstack-node',
    name: 'Full-Stack Node Sandbox',
    desc: 'Express API microservice runtime with background workers and JSON store.',
    badge: 'Full Stack',
    tag: 'API',
    icon: Server,
    defaultName: 'cloud-agent-api'
  },
  {
    id: 'ui-lab',
    name: 'WebGL & Shader Lab',
    desc: 'Three.js & Canvas experimental workspace for high-fidelity animations.',
    badge: 'Creative',
    tag: 'WebGL',
    icon: Layers,
    defaultName: 'shader-prototype'
  }
];

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
    day: 'numeric',
    year: 'numeric'
  });
}

function ProjectCard({ project, onSelect, isBooting, anyBooting }) {
  const [copied, setCopied] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCopyId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(project._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shortId = project._id ? project._id.slice(0, 8) : 'unknown';
  const formattedDate = formatRelativeTime(project.createdAt);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="project-card-item group relative rounded-2xl border border-white/10 bg-[#0d1017]/85 backdrop-blur-xl hover:border-cyanAccent/40 hover:shadow-[0_0_35px_rgba(0,240,255,0.12)] transition-colors duration-300 flex flex-col justify-between p-6 overflow-hidden min-h-[220px]"
    >
      {/* Radial flashlight spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 240, 255, 0.08), transparent 80%)`
        }}
      />

      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-cyanAccent/50 transition-all duration-500" />

      {/* Card Header */}
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyanAccent/10 border border-cyanAccent/20 flex items-center justify-center text-cyanAccent shadow-[0_0_15px_rgba(0,240,255,0.15)] group-hover:scale-105 group-hover:border-cyanAccent/50 transition-all">
              <Code2 size={20} />
            </div>
            <div>
              <span className="flex items-center gap-1.5 text-[11px] font-mono text-cyanAccent/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE POD
              </span>
              <div className="flex items-center gap-1 text-[11px] text-gray-400 font-mono mt-0.5">
                <Clock size={11} />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Copyable short ID badge */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCopyId}
            title="Copy Workspace ID"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-cyanAccent/40 hover:bg-cyanAccent/10 text-gray-400 hover:text-cyanAccent text-[11px] font-mono transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={11} className="text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={11} />
                <span>#{shortId}</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Project Title */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyanAccent transition-colors line-clamp-1 mb-1 tracking-tight">
          {project.title || 'Untitled Workspace'}
        </h3>
        <p className="text-xs text-gray-400 font-light line-clamp-2 leading-relaxed">
          Isolated Kubernetes sandbox container with instant Vite HMR and terminal shell access.
        </p>
      </div>

      {/* Card Body Specs / Tags */}
      <div className="relative z-10 my-4 flex flex-wrap gap-2">
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300">
          Vite 6
        </span>
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300">
          React 19
        </span>
        <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-gray-300">
          Port 5173
        </span>
      </div>

      {/* Card Footer / Launch Action */}
      <div className="relative z-10 flex items-center justify-between pt-3 border-t border-white/5">
        <span className="text-[11px] text-gray-500 font-mono">
          Pod: <span className="text-gray-300">k8s-agent</span>
        </span>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onSelect(project._id)}
          disabled={anyBooting}
          className={`px-4 py-2 rounded-xl text-xs font-semibold font-mono flex items-center gap-2 transition-all duration-300 cursor-pointer ${
            isBooting
              ? 'bg-cyanAccent/20 text-cyanAccent border border-cyanAccent/40 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
              : 'bg-white/10 hover:bg-cyanAccent text-white hover:text-black border border-white/15 hover:border-transparent hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] group-hover:border-cyanAccent/30'
          }`}
        >
          {isBooting ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              <span>Booting...</span>
            </>
          ) : (
            <>
              <span>Launch IDE</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </motion.button>
      </div>

      {/* Bottom glowing strip when booting */}
      {isBooting && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyanAccent to-transparent animate-pulse" />
      )}
    </motion.div>
  );
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const avatar = useSelector((state) => state.auth.avatar);
  const { projects, isLoadingProjects, fetchProjects, createNewProject, initWorkspace } = useHome();
  const { logoutUser } = useAuth();

  const [newTitle, setNewTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('react-vite');
  const [isCreatingLocal, setIsCreatingLocal] = useState(false);
  const [loadingProjectId, setLoadingProjectId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [bootStep, setBootStep] = useState(0);
  const [hoveredNav, setHoveredNav] = useState(null);
  const [avatarImgFailed, setAvatarImgFailed] = useState(false);

  // Reset avatar failure state when avatar URL updates
  useEffect(() => {
    setAvatarImgFailed(false);
  }, [avatar]);

  const containerRef = useRef(null);
  const headerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let animationFrameId;
    function raf(time) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }
    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  // Auth verification
  useEffect(() => {
    if (!user) {
      navigate('/auth');
    } else {
      fetchProjects();
    }
  }, [user]);

  // Global Keyboard Shortcuts (Ctrl+K for search, ESC to close modal, N for new project)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (showCreateModal) {
          setShowCreateModal(false);
        } else if (searchQuery) {
          setSearchQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCreateModal, searchQuery]);

  // GSAP Entrance
  useEffect(() => {
    if (projects.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          headerRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        );
        gsap.fromTo(
          '.project-card-item',
          { opacity: 0, y: 25, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power3.out',
            delay: 0.05
          }
        );
      }, containerRef);
      return () => ctx.revert();
    }
  }, [projects]);

  // Booting steps simulator
  useEffect(() => {
    let interval;
    if (loadingProjectId) {
      setBootStep(0);
      interval = setInterval(() => {
        setBootStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 700);
    } else {
      setBootStep(0);
    }
    return () => clearInterval(interval);
  }, [loadingProjectId]);

  const handleCreateProjectSubmit = async (e) => {
    e.preventDefault();
    const finalTitle = newTitle.trim() || 'My Workspace';

    setIsCreatingLocal(true);
    const result = await createNewProject(finalTitle);
    setIsCreatingLocal(false);
    if (result && result.success) {
      setNewTitle('');
      setShowCreateModal(false);
    }
  };

  const handleSelectProject = async (projectId) => {
    setLoadingProjectId(projectId);
    try {
      await initWorkspace(projectId, true);
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to initialize workspace:', err);
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

  // Filtered and searched projects
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p._id?.toLowerCase().includes(q)
      );
    }

    if (filterType === 'recent') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (filterType === 'oldest') {
      list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return list;
  }, [projects, searchQuery, filterType]);

  const bootStages = [
    { label: 'Connecting to Kubernetes Cluster Gateway', code: 'K8S_AUTH_OK' },
    { label: 'Provisioning Isolated Micro-Pod Sandbox', code: 'POD_SPAWN' },
    { label: 'Mounting File System & Virtual Volumes', code: 'FS_BIND_READY' },
    { label: 'Initializing WebSocket Bridge & Vite HMR Tunnel', code: 'STREAM_ONLINE' },
    { label: 'Sandbox Healthy. Routing to FrameForge Cloud IDE...', code: 'HANDSHAKE_200' }
  ];

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-[#08090b] text-[#f5f5f5] relative overflow-hidden font-sans selection:bg-cyanAccent selection:text-black"
    >
      <Toast />

      {/* Dynamic 3D WebGL Particle Background */}
      <CyberGridBackground />

      {/* Atmospheric Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[55vw] h-[55vw] bg-cyanAccent/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[60vw] h-[60vw] bg-indigo-500/5 rounded-full blur-[160px]" />
        <div className="absolute top-[40%] right-[10%] w-[35vw] h-[35vw] bg-emerald-500/3 rounded-full blur-[120px]" />
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col min-h-screen">

        {/* Top Navigation Bar */}
        <header
          ref={headerRef}
          className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 py-3.5 px-6 mb-10 rounded-2xl border border-white/10 bg-[#0d1017]/75 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.4)]"
        >
          {/* Brand & System Status */}
          <div className="flex items-center gap-6">
            <div
              onClick={() => navigate('/')}
              className="flex items-center gap-3 cursor-pointer group focus:outline-none"
            >
              <div className="w-8 h-8 rounded-xl bg-[#15181C] border border-white/15 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:border-cyanAccent/60 group-hover:shadow-[0_0_20px_rgba(0,240,255,0.25)] group-hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-cyanAccent/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <svg
                  className="w-4 h-4 text-cyanAccent relative z-10 transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16.5 9.4 7.55 4.24a1.8 1.8 0 0 0-2.55 1.56v12.4a1.8 1.8 0 0 0 2.55 1.56L16.5 14.6a1.8 1.8 0 0 0 0-3.2Z" />
                  <path d="M19 8v8" />
                </svg>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-white group-hover:text-cyanAccent transition-colors">
                    FrameForge
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyanAccent/10 border border-cyanAccent/30 text-cyanAccent font-semibold">
                    v3.0
                  </span>
                </div>
                <span className="text-[10px] font-mono text-gray-400 hidden sm:block">
                  Cloud Development Environment
                </span>
              </div>
            </div>

            {/* Quick Links with Sliding Pill Indicator */}
            <div
              className="hidden md:flex items-center relative pl-4 border-l border-white/10"
              onMouseLeave={() => setHoveredNav(null)}
            >
              {[
                { label: 'Home', path: '/' },
                { label: 'Docs', path: '/docs' },
                { label: 'Architecture', path: '/solutions' }
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  onMouseEnter={() => setHoveredNav(item.label)}
                  className="relative px-3.5 py-1.5 text-xs font-medium text-gray-400 hover:text-white transition-colors cursor-pointer z-10"
                >
                  {hoveredNav === item.label && (
                    <motion.div
                      layoutId="headerNavPill"
                      className="absolute inset-0 rounded-lg bg-white/10 border border-white/10 -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile & Cluster Status */}
          <div className="flex items-center gap-4">
            {/* Cluster status indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-gray-300 shadow-sm hover:border-emerald-500/30 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span>CLUSTER: US-EAST-1</span>
            </div>

            {/* User Capsule with Verified Safe Avatar Loading */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-cyanAccent/40 transition-colors shadow-sm"
            >
              <div className="relative w-6 h-6 rounded-full p-[1.5px] bg-gradient-to-tr from-cyanAccent via-sky-400 to-indigo-500 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                <div className="w-full h-full rounded-full bg-[#0d1017] flex items-center justify-center overflow-hidden">
                  {avatar && !avatarImgFailed ? (
                    <img
                      src={avatar}
                      alt={user || 'User'}
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarImgFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-cyanAccent/20 to-indigo-500/30 flex items-center justify-center text-cyanAccent font-bold text-[10px]">
                      {user ? user.slice(0, 2).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-[#0d1017]" />
              </div>
              <span className="text-xs font-semibold text-white tracking-wide">
                {user || 'Developer'}
              </span>
            </motion.div>

            {/* Logout button */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleLogout}
              title="Sign Out"
              className="group flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 text-xs text-gray-400 font-mono transition-all cursor-pointer"
            >
              <LogOut size={13} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Sign Out</span>
            </motion.button>
          </div>
        </header>

        {/* Hero Section */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyanAccent/10 border border-cyanAccent/30 text-cyanAccent text-xs font-mono mb-3">
              <Sparkles size={12} />
              <span>ORCHESTRATED WORKSPACES</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
              Your Cloud Sandboxes
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl font-light leading-relaxed">
              Launch, organize, and develop in ephemeral Kubernetes container sandboxes with hot module reload, AI code orchestration, and dedicated terminals.
            </p>
          </div>

          {/* Action Button: Forge Workspace */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto group relative px-6 py-3.5 rounded-xl bg-cyanAccent text-black font-bold text-sm shadow-[0_0_25px_rgba(0,240,255,0.25)] hover:shadow-[0_0_35px_rgba(0,240,255,0.45)] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2.5 overflow-hidden font-mono"
            >
              <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300 stroke-[2.5]" />
              <span>Forge Workspace</span>
              <span className="hidden sm:inline-block ml-1 px-1.5 py-0.5 rounded bg-black/20 text-[10px] text-black/80 font-mono">
                +
              </span>
            </motion.button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-8 p-3 rounded-2xl border border-white/10 bg-[#0d1017]/70 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search sandboxes by name or ID... (⌘K)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 bg-white/5 hover:bg-white/10 focus:bg-black/50 text-sm text-white placeholder-gray-500 rounded-xl border border-white/10 focus:border-cyanAccent/60 focus:outline-none transition-all font-mono"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Pills with Sliding Animated Pill Indicator & Counter */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-2">
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs font-mono relative">
              {[
                { id: 'all', label: 'All' },
                { id: 'recent', label: 'Recent' },
                { id: 'oldest', label: 'Oldest' }
              ].map((tab) => {
                const isActive = filterType === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id)}
                    className={`relative px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer z-10 ${
                      isActive ? 'text-black font-bold' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="projectFilterPill"
                        className="absolute inset-0 rounded-lg bg-cyanAccent shadow-[0_0_15px_rgba(0,240,255,0.3)] -z-10"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="text-xs font-mono text-gray-400 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 hidden md:block">
              <span className="text-cyanAccent font-bold">{filteredProjects.length}</span> of {projects.length} Pods
            </div>
          </div>
        </div>

        {/* Workspaces Grid Section */}
        {isLoadingProjects && projects.length === 0 ? (
          /* Loading Skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl border border-white/5 bg-[#0d1017]/40 animate-pulse flex flex-col justify-between h-[220px]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-white/10" />
                    <div className="w-20 h-4 rounded bg-white/10" />
                  </div>
                  <div className="w-3/4 h-5 rounded bg-white/10" />
                  <div className="w-full h-3 rounded bg-white/5" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="w-24 h-4 rounded bg-white/10" />
                  <div className="w-20 h-8 rounded-lg bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          /* Zero Workspaces Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full py-20 px-8 text-center rounded-3xl border border-white/10 bg-[#0d1017]/80 backdrop-blur-xl flex flex-col items-center justify-center gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
          >
            <div className="w-20 h-20 rounded-3xl bg-cyanAccent/10 border border-cyanAccent/30 flex items-center justify-center text-cyanAccent shadow-[0_0_30px_rgba(0,240,255,0.2)]">
              <Folder className="w-10 h-10" />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                No Cloud Workspaces Yet
              </h3>
              <p className="text-gray-400 text-sm font-light leading-relaxed">
                You haven't provisioned any sandbox pods yet. Forge your first container to begin designing, coding, and live-previewing React components.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-xl bg-cyanAccent text-black font-bold text-sm hover:bg-cyanAccent/90 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer flex items-center gap-2 font-mono"
            >
              <Plus size={16} />
              <span>Forge Your First Sandbox</span>
            </motion.button>
          </motion.div>
        ) : filteredProjects.length === 0 ? (
          /* Search Result Empty State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full py-16 text-center rounded-2xl border border-white/10 bg-[#0d1017]/60 backdrop-blur-md flex flex-col items-center justify-center gap-4"
          >
            <Search className="w-10 h-10 text-gray-500 mb-1" />
            <h3 className="text-lg font-bold text-white">No matching workspaces</h3>
            <p className="text-sm text-gray-400 max-w-sm">
              We couldn't find any workspace matching "{searchQuery}". Try searching with a different name or ID.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono transition-all cursor-pointer"
            >
              Clear Search Query
            </button>
          </motion.div>
        ) : (
          /* Project Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onSelect={handleSelectProject}
                isBooting={loadingProjectId === project._id}
                anyBooting={loadingProjectId !== null}
              />
            ))}
          </div>
        )}

        {/* Global Footer info bar */}
        <footer className="mt-auto pt-16 pb-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Kubernetes Ingress & WebSocket Broker: Active</span>
          </div>
          <div className="flex items-center gap-4">
            <span>RAM Allocation: 4GB / Container</span>
            <span>•</span>
            <span>Vite HMR: Tuned</span>
          </div>
        </footer>
      </div>

      {/* Interactive Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCreatingLocal && setShowCreateModal(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Dialog Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ type: 'spring', stiffness: 350, damping: 26 }}
              className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-[#0e1118] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-10 flex flex-col gap-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowCreateModal(false)}
                disabled={isCreatingLocal}
                className="absolute top-6 right-6 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              {/* Modal Header */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyanAccent/10 border border-cyanAccent/30 text-cyanAccent text-[11px] font-mono mb-2">
                  <Sparkles size={11} />
                  <span>NEW CONTAINER PROVISION</span>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Forge a New Workspace
                </h2>
                <p className="text-xs sm:text-sm text-gray-400 font-light mt-1">
                  Choose a starter blueprint and title your workspace. A dedicated container will be allocated automatically.
                </p>
              </div>

              {/* Starter Template Selection */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-300">
                  Select Environment Blueprint
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {STARTER_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplate === tmpl.id;
                    const IconComp = tmpl.icon;
                    return (
                      <motion.div
                        whileHover={{ y: -2, scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        key={tmpl.id}
                        onClick={() => {
                          setSelectedTemplate(tmpl.id);
                          if (!newTitle) setNewTitle(tmpl.defaultName);
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-cyanAccent bg-cyanAccent/10 shadow-[0_0_15px_rgba(0,240,255,0.15)]'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <IconComp
                            size={16}
                            className={isSelected ? 'text-cyanAccent' : 'text-gray-400'}
                          />
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                              isSelected
                                ? 'bg-cyanAccent text-black font-bold'
                                : 'bg-white/10 text-gray-400'
                            }`}
                          >
                            {tmpl.tag}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{tmpl.name}</h4>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleCreateProjectSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-gray-300 flex items-center justify-between">
                    <span>Workspace Name</span>
                    <span className="text-gray-500 text-[10px]">Letters, numbers, hyphens</span>
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. quantum-dashboard, portfolio-2026"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    disabled={isCreatingLocal}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 focus:bg-black/60 text-white placeholder-gray-500 rounded-xl border border-white/15 focus:border-cyanAccent focus:ring-1 focus:ring-cyanAccent/50 focus:outline-none transition-all font-mono text-sm"
                  />
                </div>

                {/* Quick suggestions chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-500 font-mono">Suggestions:</span>
                  {['fintech-dashboard', 'portfolio-v2', 'ai-chat-interface', 'saas-landing'].map(
                    (sugg) => (
                      <button
                        type="button"
                        key={sugg}
                        onClick={() => setNewTitle(sugg)}
                        className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-[10px] font-mono text-gray-400 hover:text-cyanAccent transition-colors cursor-pointer"
                      >
                        +{sugg}
                      </button>
                    )
                  )}
                </div>

                {/* Modal Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={isCreatingLocal}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-mono text-gray-400 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isCreatingLocal}
                    className="px-6 py-2.5 rounded-xl bg-cyanAccent text-black font-bold text-xs font-mono flex items-center justify-center gap-2 hover:bg-cyanAccent/90 shadow-[0_0_20px_rgba(0,240,255,0.25)] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isCreatingLocal ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        <span>Allocating Pod...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} />
                        <span>Provision Container</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Sandbox Booting Overlay HUD */}
      <AnimatePresence>
        {loadingProjectId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#08090b]/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
          >
            {/* Multi-layered Cybernetic Gyro Radar */}
            <div className="relative flex items-center justify-center w-32 h-32 mb-8">
              {/* Ring 1 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                className="absolute inset-0 rounded-full border-2 border-t-cyanAccent border-r-transparent border-b-cyanAccent/20 border-l-transparent shadow-[0_0_25px_rgba(0,240,255,0.3)]"
              />
              {/* Ring 2 */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
                className="absolute inset-2 rounded-full border border-b-emerald-400 border-t-transparent border-r-transparent border-l-emerald-400/30"
              />
              {/* Ring 3 */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                className="absolute inset-6 rounded-full bg-cyanAccent/10 border border-cyanAccent/40"
              />
              <Terminal className="w-10 h-10 text-cyanAccent relative z-10 animate-pulse" />
            </div>

            {/* Orchestration Stage Status */}
            <div className="max-w-md w-full space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Orchestrating Sandbox
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                Allocating dedicated Kubernetes container pod and binding high-speed WebSocket bridge...
              </p>

              {/* Progress Steps Feed */}
              <div className="mt-6 p-4 rounded-2xl border border-white/10 bg-black/60 font-mono text-left text-xs space-y-2">
                {bootStages.map((stage, idx) => {
                  const isDone = bootStep > idx;
                  const isCurrent = bootStep === idx;
                  return (
                    <div
                      key={stage.code}
                      className={`flex items-center justify-between gap-3 transition-opacity duration-300 ${
                        isDone
                          ? 'text-emerald-400 opacity-100'
                          : isCurrent
                          ? 'text-cyanAccent opacity-100 font-semibold'
                          : 'text-gray-600 opacity-40'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isDone ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : isCurrent ? (
                          <Loader2 size={12} className="animate-spin text-cyanAccent" />
                        ) : (
                          <span className="w-3 h-3 flex items-center justify-center text-[10px] text-gray-600">•</span>
                        )}
                        <span>{stage.label}</span>
                      </div>
                      <span className="text-[10px] opacity-70">[{stage.code}]</span>
                    </div>
                  );
                })}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mt-4">
                <motion.div
                  initial={{ width: '10%' }}
                  animate={{ width: `${Math.min(100, (bootStep + 1) * 25)}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-gradient-to-r from-cyanAccent to-emerald-400 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.6)]"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
