
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, visible, onClose }) => {
  React.useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: '-50%' }}
          animate={{ y: 0, opacity: 1, x: '-50%' }}
          exit={{ y: 100, opacity: 0, x: '-50%' }}
          className="toast-alert"
        >
          <p className="text-sm font-extrabold text-[#111] text-center">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
