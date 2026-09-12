import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import AnimatedInput from './AnimatedInput';
import SocialLogin from './SocialLogin';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.35, 
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: 'spring', stiffness: 380, damping: 26 } 
  }
};

export default function LoginForm({ onToggleForm }) {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const { isLoading, err } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await loginUser({ email: formValues.email, password: formValues.password });
    if (success) {
      navigate('/');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost/api/auth/google';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full flex flex-col gap-5"
    >
      <div className="space-y-1">
        <motion.div variants={itemVariants} className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
          <span className="w-1.5 h-1.5 rounded-full bg-cyanAccent shadow-[0_0_8px_#00F0FF]" />
        </motion.div>
        <motion.p variants={itemVariants} className="text-xs text-textSecondary font-light">
          Authenticate to access your cloud sandboxes and projects.
        </motion.p>
      </div>

      {/* Error Alert Box */}
      <AnimatePresence mode="wait">
        {err && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-mono"
          >
            <AlertCircle size={14} className="shrink-0 text-rose-400" />
            <span>{err}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <motion.div variants={itemVariants}>
          <AnimatedInput 
            icon={Mail} 
            label="Email Address"
            name="email" 
            type="email" 
            placeholder="developer@frameforge.cloud" 
            required 
            value={formValues.email} 
            onChange={handleChange} 
          />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <AnimatedInput 
            icon={Lock} 
            label="Password"
            name="password" 
            type="password" 
            placeholder="••••••••••••" 
            required 
            value={formValues.password} 
            onChange={handleChange} 
          />
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-end pt-0.5">
          <a href="#" className="text-xs text-textMuted hover:text-cyanAccent transition-colors font-mono">
            Forgot password?
          </a>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={!isLoading ? { scale: 1.01 } : {}}
          whileTap={!isLoading ? { scale: 0.98 } : {}}
          type="submit"
          disabled={isLoading}
          className={`w-full py-2.5 mt-1 bg-cyanAccent text-[#08090A] font-semibold text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:bg-cyanAccent/90 ${
            isLoading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Authenticating Session...</span>
            </>
          ) : (
            <>
              <LogIn size={16} />
              <span>Sign In</span>
            </>
          )}
        </motion.button>
      </form>

      <motion.div variants={itemVariants} className="relative flex items-center py-1">
        <div className="flex-grow border-t border-white/[0.06]"></div>
        <span className="flex-shrink-0 mx-3 text-textMuted text-[10px] font-mono uppercase tracking-widest">
          or continue with
        </span>
        <div className="flex-grow border-t border-white/[0.06]"></div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SocialLogin 
          icon={() => (
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          )} 
          label="Google Workspace" 
          onClick={handleGoogleLogin} 
        />
      </motion.div>

      <motion.div variants={itemVariants} className="text-center text-xs text-textSecondary font-light">
        Don&apos;t have an account?{' '}
        <button 
          onClick={() => onToggleForm('register')} 
          className="text-cyanAccent hover:underline focus:outline-none cursor-pointer font-medium"
        >
          Create account
        </button>
      </motion.div>
    </motion.div>
  );
}
