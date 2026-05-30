import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import AnimatedInput from './AnimatedInput';
import SocialLogin from './SocialLogin';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  exit: {
    opacity: 0,
    x: -50,
    transition: { duration: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function LoginForm({ onToggleForm }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login submitted');
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    // window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full flex flex-col gap-6"
    >
      <div className="text-center">
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-2">Welcome Back</motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400">Sign in to continue to FrameForge</motion.p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <motion.div variants={itemVariants}>
          <AnimatedInput icon={Mail} type="email" placeholder="Email Address" required />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <AnimatedInput icon={Lock} type="password" placeholder="Password" required />
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-end">
          <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Forgot password?</a>
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 mt-2 bg-white text-black font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <LogIn size={20} />
          <span>Sign In</span>
        </motion.button>
      </form>

      <motion.div variants={itemVariants} className="relative flex items-center py-2">
        <div className="flex-grow border-t border-[rgba(255,255,255,0.08)]"></div>
        <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-[rgba(255,255,255,0.08)]"></div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SocialLogin icon={() => <svg width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>} label="Continue with Google" onClick={handleGoogleLogin} />
      </motion.div>

      <motion.div variants={itemVariants} className="text-center mt-4 text-gray-400">
        Don't have an account?{' '}
        <button onClick={() => onToggleForm('register')} className="text-white hover:underline focus:outline-none cursor-pointer">Sign up</button>
      </motion.div>
    </motion.div>
  );
}
