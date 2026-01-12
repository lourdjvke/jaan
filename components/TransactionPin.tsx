
import React, { useState, useEffect } from 'react';
import { JaanLogo } from './Icons';
import { ChevronLeft, Eye, EyeOff, Delete } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../lib/firebase';
import { ref, update } from 'firebase/database';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const TransactionPin: React.FC<Props> = ({ onNext, onBack }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [activeField, setActiveField] = useState<'pin' | 'confirm' | null>('pin');
  const [showPin, setShowPin] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Side effect: Automatically move to 'confirm' and hide keyboard on match
  useEffect(() => {
    if (pin.length === 4 && activeField === 'pin') {
      setTimeout(() => setActiveField('confirm'), 200);
    }
    
    // Auto-dismiss keyboard when confirm matches pin
    if (pin.length === 4 && confirmPin.length === 4 && pin === confirmPin) {
      setActiveField(null);
    }
  }, [pin, confirmPin, activeField]);

  const handleNext = async () => {
    if (auth.currentUser) {
      await update(ref(db, `users/${auth.currentUser.uid}`), {
        transactionPin: pin,
        'onboarding/lastStep': 10 // SUCCESS screen
      });
    }
    onNext();
  };

  const handleKeyPress = (val: string) => {
    if (!activeField) return;
    if (activeField === 'pin') {
      if (pin.length < 4) setPin(prev => prev + val);
    } else {
      if (confirmPin.length < 4) setConfirmPin(prev => prev + val);
    }
  };

  const handleDelete = () => {
    if (!activeField) return;
    if (activeField === 'pin') {
      setPin(prev => prev.slice(0, -1));
    } else {
      setConfirmPin(prev => prev.slice(0, -1));
    }
  };

  const isComplete = pin.length === 4 && confirmPin.length === 4 && pin === confirmPin;

  const renderPinDisplay = (value: string, show: boolean) => (
    <div className="flex gap-4 items-center h-14">
      {Array(4).fill(0).map((_, i) => (
        <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${value.length > i ? 'bg-[#6338F9] border-[#6338F9] scale-110' : 'bg-transparent border-gray-200'}`} />
      ))}
      {show && value.length > 0 && <span className="ml-2 font-black text-xl text-[#111] tracking-widest">{value}</span>}
    </div>
  );

  return (
    <div 
      className="flex flex-col h-full bg-white pt-12 relative overflow-hidden"
      onClick={() => setActiveField(null)} // Dismiss keyboard when clicking the background
    >
      <div className="flex items-center justify-between mb-8 px-8" onClick={(e) => e.stopPropagation()}>
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <div className="flex items-center gap-1.5 pr-8">
          <JaanLogo className="w-5 h-5" color="#FFA500" />
          <span className="text-[#6338F9] font-black text-xl tracking-widest">JAAN</span>
        </div>
        <div className="w-6" />
      </div>

      <div className="flex-1 space-y-6 px-8" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-[#111]">Create Transaction PIN</h2>
          <p className="text-[#777] text-xs font-medium">This PIN will be required for all your payments</p>
        </div>

        <div className="space-y-5 pt-4">
          <div className="space-y-1.5" onClick={(e) => { e.stopPropagation(); setActiveField('pin'); }}>
            <label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Transaction PIN*</label>
            <div className={`w-full bg-[#F8F9FB] border-2 rounded-2xl px-5 py-4 flex items-center justify-between transition-all ${activeField === 'pin' ? 'border-[#6338F9] bg-white ring-4 ring-purple-50' : 'border-transparent'}`}>
              {renderPinDisplay(pin, showPin)}
              <button onClick={(e) => { e.stopPropagation(); setShowPin(!showPin); }}>{showPin ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}</button>
            </div>
          </div>

          <div className="space-y-1.5" onClick={(e) => { e.stopPropagation(); setActiveField('confirm'); }}>
            <label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Confirm PIN*</label>
            <div className={`w-full bg-[#F8F9FB] border-2 rounded-2xl px-5 py-4 flex items-center justify-between transition-all ${activeField === 'confirm' ? 'border-[#6338F9] bg-white ring-4 ring-purple-50' : 'border-transparent'}`}>
              {renderPinDisplay(confirmPin, showConfirm)}
              <button onClick={(e) => { e.stopPropagation(); setShowConfirm(!showConfirm); }}>{showConfirm ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}</button>
            </div>
          </div>
          
          {confirmPin.length === 4 && pin !== confirmPin && (
            <p className="text-red-500 text-[10px] font-bold text-center">PINs do not match. Please try again.</p>
          )}
        </div>

        <button 
          onClick={handleNext}
          disabled={!isComplete}
          className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all mt-8 ${isComplete ? 'bg-[#6338F9] text-white' : 'bg-purple-100 text-white cursor-not-allowed'}`}
        >
          Continue
        </button>
      </div>

      <AnimatePresence>
        {activeField && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} // Prevent background click from dismissing when clicking keys
            className="bg-[#F8F9FB] p-6 pb-12 grid grid-cols-3 gap-y-3 gap-x-4 shadow-[0_-15px_40px_rgba(0,0,0,0.1)] rounded-t-[40px] absolute bottom-0 left-0 right-0 z-[60]"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
              <button 
                key={num} 
                onClick={() => handleKeyPress(num.toString())} 
                className="h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-black text-[#111] shadow-sm active:scale-90 active:bg-gray-100 transition-all"
              >
                {num}
              </button>
            ))}
            <button 
              onClick={handleDelete} 
              className="h-16 bg-white rounded-2xl flex items-center justify-center text-[#111] shadow-sm active:scale-90 active:bg-red-50 transition-all"
            >
              <Delete size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionPin;
