import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function AnimatedInput({ icon: Icon, type = 'text', ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <motion.div
      className="relative flex items-center w-full transition-colors overflow-hidden group"
      animate={{ 
        backgroundColor: isFocused ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
      }}
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="absolute bottom-0 left-0 h-[1px] bg-white w-full origin-left"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isFocused ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "circOut" }}
      />
      
      <div className="pl-4 pr-3 text-white/40 group-hover:text-white/70 transition-colors py-3">
        <Icon size={22} strokeWidth={1.5} />
      </div>
      
      <input
        type={currentType}
        className="flex-1 bg-transparent py-3 pr-4 text-white placeholder-white/30 outline-none w-full text-base font-medium"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 text-white/40 hover:text-white transition-colors outline-none cursor-pointer"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={showPassword ? 'show' : 'hide'}
              initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
            </motion.div>
          </AnimatePresence>
        </button>
      )}
    </motion.div>
  );
}
