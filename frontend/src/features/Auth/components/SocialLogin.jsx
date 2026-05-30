import { motion } from 'framer-motion';

export default function SocialLogin({ icon: Icon, label, onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center justify-center w-full gap-3 py-3 px-4 border border-[rgba(255,255,255,0.08)] rounded-lg bg-[rgba(255,255,255,0.03)] text-white font-medium transition-colors cursor-pointer"
    >
      <Icon size={20} />
      <span>{label}</span>
    </motion.button>
  );
}
