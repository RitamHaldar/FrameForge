import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function AnimatedInput({ icon: Icon, type = 'text', label, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="relative flex flex-col gap-1.5 w-full group">
      {label && (
        <span className="text-[11px] font-mono text-textSecondary uppercase tracking-wider pl-0.5">
          {label}
        </span>
      )}

      <div
        className={`relative flex items-center w-full rounded-xl transition-all duration-200 overflow-hidden bg-[#090B0E] border ${
          isFocused 
            ? 'border-cyanAccent/50 ring-1 ring-cyanAccent/25 shadow-[0_0_20px_rgba(0,240,255,0.1)]' 
            : 'border-white/[0.08] hover:border-white/[0.16]'
        }`}
      >
        {/* Animated focus underline beam */}
        <motion.div 
          className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyanAccent to-transparent w-full origin-left pointer-events-none"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: isFocused ? 1 : 0, opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
        
        {/* Icon Container */}
        <div className={`pl-3.5 pr-2.5 transition-colors duration-200 py-3 ${
          isFocused ? 'text-cyanAccent' : 'text-textMuted group-hover:text-textSecondary'
        }`}>
          <Icon size={16} strokeWidth={1.8} />
        </div>
        
        {/* Text Input */}
        <input
          type={currentType}
          className="flex-1 bg-transparent py-2.5 pr-3 text-white placeholder:text-textMuted/60 outline-none w-full text-xs sm:text-sm font-sans font-medium selection:bg-cyanAccent/20"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {/* Password toggle visibility button */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pr-3.5 pl-2 text-textMuted hover:text-white transition-colors outline-none cursor-pointer"
            tabIndex={-1}
            title={showPassword ? "Hide password" : "Show password"}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={showPassword ? 'show' : 'hide'}
                initial={{ opacity: 0, scale: 0.7, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.7, rotate: 30 }}
                transition={{ duration: 0.18 }}
              >
                {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
              </motion.div>
            </AnimatePresence>
          </button>
        )}
      </div>
    </div>
  );
}
