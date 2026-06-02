import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, UserPlus } from 'lucide-react';
import AnimatedInput from './AnimatedInput';
import SocialLogin from './SocialLogin';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function RegisterForm({ onToggleForm }) {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({ username: '', email: '', password: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await registerUser({ username: formValues.username, email: formValues.email, password: formValues.password });
    if (success) {
      navigate('/verify-otp');
    }
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
    window.location.href = 'http://localhost/api/auth/google';
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
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-2">Create Account</motion.h2>
        <motion.p variants={itemVariants} className="text-gray-400">Join FrameForge today</motion.p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <motion.div variants={itemVariants}>
          <AnimatedInput icon={User} name="username" type="text" placeholder="Username" required value={formValues.username} onChange={handleChange} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <AnimatedInput icon={Mail} name="email" type="email" placeholder="Email Address" required value={formValues.email} onChange={handleChange} />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <AnimatedInput icon={Lock} name="password" type="password" placeholder="Password" required value={formValues.password} onChange={handleChange} />
        </motion.div>

        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-3 mt-4 bg-white text-black font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <UserPlus size={20} />
          <span>Sign Up</span>
        </motion.button>
      </form>

      <motion.div variants={itemVariants} className="relative flex items-center py-2">
        <div className="flex-grow border-t border-[rgba(255,255,255,0.08)]"></div>
        <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">or</span>
        <div className="flex-grow border-t border-[rgba(255,255,255,0.08)]"></div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SocialLogin icon={() => <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>} label="Sign up with Google" onClick={handleGoogleLogin} />
      </motion.div>

      <motion.div variants={itemVariants} className="text-center mt-4 text-gray-400">
        Already have an account?{' '}
        <button onClick={() => onToggleForm('login')} className="text-white hover:underline focus:outline-none cursor-pointer">Sign in</button>
      </motion.div>
    </motion.div>
  );
}
