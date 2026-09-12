import { motion } from 'framer-motion';

export default function SocialLogin({ icon: Icon, label, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-center w-full gap-3 py-2.5 px-4 border border-white/[0.08] hover:border-white/20 rounded-xl bg-[#090A0D] text-textPrimary text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer shadow-sm group"
    >
      <div className="transition-transform duration-200 group-hover:scale-110">
        <Icon size={18} />
      </div>
      <span className="text-textSecondary group-hover:text-white transition-colors">{label}</span>
    </motion.button>
  );
}
