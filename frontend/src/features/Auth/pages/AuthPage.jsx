import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AuthBackground from '../components/AuthBackground';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function AuthPage() {
  const [activeForm, setActiveForm] = useState('login');

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden selection:bg-white/20">
      <AuthBackground />
      
      <div className="z-10 w-full h-screen flex">
        {/* Left Side: Branding & Story (Hidden on mobile) */}
        <div className="hidden lg:flex flex-1 flex-col justify-between p-12 text-white relative">
          <div className="relative z-20">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl font-bold tracking-tight"
            >
              FrameForge
            </motion.h1>
          </div>
          
          <div className="relative z-20 max-w-lg">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl font-extrabold leading-tight mb-6"
            >
              Forge your frames into masterpieces.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-lg text-gray-400"
            >
              Join the community of creators building the next generation of visual experiences.
            </motion.p>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md p-10 glass-panel rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-2xl bg-black/40 border border-white/10"
          >
            {/* Ambient glow inside the card */}
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {activeForm === 'login' ? (
                  <LoginForm key="login" onToggleForm={setActiveForm} />
                ) : (
                  <RegisterForm key="register" onToggleForm={setActiveForm} />
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
