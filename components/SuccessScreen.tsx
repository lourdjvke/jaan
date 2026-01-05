
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

interface Props {
  onFinish: () => void;
}

const SuccessScreen: React.FC<Props> = ({ onFinish }) => {
  return (
    <div className="absolute inset-0 bg-[#6338F9] flex flex-col items-center justify-center text-center px-10">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 12, stiffness: 200 }}
        className="w-32 h-32 bg-[#34C759] rounded-full flex items-center justify-center mb-10 shadow-2xl relative"
      >
        <motion.div
           animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }}
           transition={{ duration: 2, repeat: Infinity }}
           className="absolute inset-0 bg-white rounded-full"
        />
        <CheckCircle2 size={64} className="text-white relative z-10" />
      </motion.div>

      <motion.h2 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-black text-white mb-4"
      >
        You're All Set!
      </motion.h2>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-white/80 text-[15px] font-medium leading-relaxed max-w-[280px]"
      >
        Your JAAN account has been created. You're now ready to enjoy seamless digital living
      </motion.p>

      <motion.button 
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        onClick={onFinish}
        className="absolute bottom-16 left-10 right-10 bg-white text-[#6338F9] py-4 rounded-2xl font-black shadow-xl active:scale-95 transition-all text-sm tracking-wide uppercase"
      >
        Explore JAAN
      </motion.button>
    </div>
  );
};

export default SuccessScreen;
