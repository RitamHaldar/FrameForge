import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthBackground from '../components/AuthBackground';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -16,
    transition: { duration: 0.25 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 380, damping: 26 } }
};

export default function VerifyOtpPage() {
  const { verifyOtpUser } = useAuth();
  const navigate = useNavigate();
  const { isLoading, err } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return;

    const pastedDigits = pastedData.split('').slice(0, 6);
    const newOtp = [...otp];
    
    pastedDigits.forEach((digit, i) => {
      newOtp[i] = digit;
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = digit;
      }
    });

    setOtp(newOtp);
    const nextFocusIndex = Math.min(pastedDigits.length, 5);
    if (inputRefs.current[nextFocusIndex]) {
      inputRefs.current[nextFocusIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) return;
    const email = sessionStorage.getItem("register_email") || "";
    const success = await verifyOtpUser({ email, otp: otpCode });
    if (success) {
      navigate('/');
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-obsidian text-textPrimary overflow-hidden selection:bg-cyanAccent/20 selection:text-white font-sans">
      <AuthBackground />

      <div className="z-20 w-full min-h-screen flex items-center justify-center p-4 sm:p-6 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-md p-6 sm:p-8 rounded-3xl relative overflow-hidden backdrop-blur-2xl bg-[#0C0E12]/90 border border-white/[0.08] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.04)]"
        >
          {/* Ambient Corner Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyanAccent/[0.08] to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-tr from-cyanAccent/[0.04] to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Shield Logo Header */}
            <motion.div 
              variants={itemVariants}
              className="w-14 h-14 rounded-2xl bg-[#15181E] border border-cyanAccent/30 flex items-center justify-center mb-5 shadow-[0_0_16px_rgba(0,240,255,0.15)]"
            >
              <ShieldCheck className="w-7 h-7 text-cyanAccent" strokeWidth={1.8} />
            </motion.div>

            <div className="text-center mb-7 space-y-1">
              <motion.h2 variants={itemVariants} className="text-2xl font-bold text-white tracking-tight">
                Verify Identity
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xs text-textSecondary max-w-xs mx-auto font-light leading-relaxed">
                Enter the 6-digit security token dispatched to your email address to activate your cloud workspace.
              </motion.p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
              
              {/* Digit Inputs Row */}
              <motion.div 
                variants={itemVariants}
                className="flex justify-between gap-2 w-full py-1"
                onPaste={handlePaste}
              >
                {otp.map((digit, idx) => (
                  <motion.input
                    key={idx}
                    type="text"
                    pattern="\d*"
                    maxLength="1"
                    value={digit}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 bg-[#090A0D] text-white font-mono text-xl font-bold text-center rounded-xl border outline-none transition-all duration-200 ${
                      digit 
                        ? 'border-cyanAccent/60 text-cyanAccent shadow-[0_0_12px_rgba(0,240,255,0.2)]' 
                        : 'border-white/[0.08] hover:border-white/20 focus:border-cyanAccent/50 focus:ring-1 focus:ring-cyanAccent/25'
                    }`}
                    animate={{
                      scale: digit ? 1.05 : 1,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  />
                ))}
              </motion.div>

              {/* Error messages */}
              <AnimatePresence mode="wait">
                {err && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400 text-xs font-mono text-center justify-center"
                  >
                    <AlertCircle size={13} className="shrink-0 text-rose-400" />
                    <span>{err}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Verify Button */}
              <motion.button
                variants={itemVariants}
                whileHover={isOtpComplete && !isLoading ? { scale: 1.01 } : {}}
                whileTap={isOtpComplete && !isLoading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={!isOtpComplete || isLoading}
                className={`w-full py-2.5 mt-1 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 select-none ${
                  !isOtpComplete || isLoading 
                    ? 'bg-white/5 border border-white/10 text-textMuted cursor-not-allowed shadow-none' 
                    : 'bg-cyanAccent text-[#08090A] hover:bg-cyanAccent/90 shadow-[0_0_20px_rgba(0,240,255,0.25)]'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Authenticating Token...</span>
                  </>
                ) : (
                  <span>Verify Account</span>
                )}
              </motion.button>

            </form>

            {/* Back to Auth link */}
            <motion.button
              variants={itemVariants}
              onClick={() => navigate('/auth')}
              className="flex items-center gap-1.5 mt-6 text-xs text-textMuted hover:text-cyanAccent transition-colors cursor-pointer group font-mono"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform duration-200" />
              <span>Back to sign in</span>
            </motion.button>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
