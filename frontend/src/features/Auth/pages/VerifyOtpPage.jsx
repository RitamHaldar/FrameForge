import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthBackground from '../components/AuthBackground';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.3 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
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
    // Only allow numbers
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Take the last digit if user pastes or typed multiple digits
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace key handling
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0 && inputRefs.current[index - 1]) {
        // Focus previous input and clear it
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
    
    // Paste key handling (for simple clipboard copy)
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      // Allowed in paste handler
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return; // numbers only

    const pastedDigits = pastedData.split('').slice(0, 6);
    const newOtp = [...otp];
    
    pastedDigits.forEach((digit, i) => {
      newOtp[i] = digit;
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = digit;
      }
    });

    setOtp(newOtp);
    // Focus last or next empty input
    const nextFocusIndex = Math.min(pastedDigits.length, 5);
    if (inputRefs.current[nextFocusIndex]) {
      inputRefs.current[nextFocusIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length < 6) return;
    await verifyOtpUser({ otp: otpCode });
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden selection:bg-white/20">
      <AuthBackground />

      <div className="z-10 w-full h-screen flex items-center justify-center p-6 relative">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-full max-w-md p-10 glass-panel rounded-3xl shadow-2xl relative overflow-hidden backdrop-blur-2xl bg-black/40 border border-white/10"
        >
          {/* Ambient glow inside the card */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Shield Logo Header */}
            <motion.div 
              variants={itemVariants}
              className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-inner"
            >
              <ShieldCheck className="w-8 h-8 text-white animate-pulse" strokeWidth={1.5} />
            </motion.div>

            <div className="text-center mb-8">
              <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-2">Verify Identity</motion.h2>
              <motion.p variants={itemVariants} className="text-gray-400 text-sm max-w-xs mx-auto">
                We've sent a 6-digit verification code to your email. Enter it below to unlock your workspace.
              </motion.p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
              
              {/* Digit Inputs Row */}
              <motion.div 
                variants={itemVariants}
                className="flex justify-between gap-2.5 w-full py-2"
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
                    className="w-12 h-14 bg-white/5 hover:bg-white/10 focus:bg-white/10 text-white font-mono text-2xl font-bold text-center rounded-xl border border-white/10 focus:border-white outline-none transition-all duration-200"
                    animate={{
                      scale: digit ? 1.05 : 1,
                      boxShadow: digit ? '0 0 15px rgba(255, 255, 255, 0.15)' : 'none'
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  />
                ))}
              </motion.div>

              {/* Error messages */}
              <AnimatePresence mode="wait">
                {err && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-red-400 text-sm text-center font-medium mt-1"
                  >
                    {err}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Verify Button */}
              <motion.button
                variants={itemVariants}
                whileHover={isOtpComplete && !isLoading ? { scale: 1.02 } : {}}
                whileTap={isOtpComplete && !isLoading ? { scale: 0.98 } : {}}
                type="submit"
                disabled={!isOtpComplete || isLoading}
                className={`w-full py-3.5 mt-2 bg-white text-black font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-250 select-none shadow-lg ${
                  !isOtpComplete || isLoading 
                    ? 'opacity-40 cursor-not-allowed shadow-none' 
                    : 'hover:bg-white/95 hover:shadow-white/10 shadow-md'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Verifying Code...</span>
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
              className="flex items-center gap-2 mt-8 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-250" />
              <span>Back to sign in</span>
            </motion.button>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
