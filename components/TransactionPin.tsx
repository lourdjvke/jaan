
import React, { useState, useEffect } from 'react';
import { JaanLogo } from './Icons';
import { ChevronLeft, Eye, EyeOff, Delete } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  // Auto-progression logic
  useEffect(() => {
    if (pin.length === 4 && activeField === 'pin') {
      setTimeout(() => setActiveField('confirm'), 200);
    }
  }, [pin, activeField]);

  // Match logic - instinctively remove keyboard
  useEffect(() => {
    if (confirmPin.length === 4 && pin === confirmPin) {
      setActiveField(null);
    }
  }, [confirmPin, pin]);

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

  const renderPinDisplay = (value: string, show: boolean) => {
    const dots = Array(4).fill(0);
    return (
      <div className="flex gap-4 items-center h-14">
        {dots.map((_, i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
              value.length > i 
                ? 'bg-[#6338F9] border-[#6338F9] scale-110 shadow-[0_0_8px_rgba(99,56,249,0.3)]' 
                : 'bg-transparent border-gray-200'
            }`} 
          />
        ))}
        {show && value.length > 0 && (
          <span className="ml-2 font-black text-xl text-[#111] tracking-widest">{value}</span>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white pt-12 relative overflow-hidden" onClick={() => setActiveField(null)}>
      {/* Non-interactive hidden input to prevent native keyboard if focus somehow leaks */}
      <input type="text" inputMode="none" className="opacity-0 absolute -z-10 pointer-events-none" readOnly />

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

      <div className="flex-1 space-y-6 px-8 no-scrollbar overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-[#111]">Create Transaction PIN</h2>
          <p className="text-[#777] text-sm font-medium leading-relaxed">Set a PIN to authorize transactions on JAAN</p>
        </div>

        <div className="space-y-5 pt-4">
          {/* PIN Field */}
          <div 
            className="space-y-1.5 relative group cursor-pointer" 
            onClick={(e) => { e.stopPropagation(); setActiveField('pin'); }}
          >
            <label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Transaction PIN*</label>
            <div className={`w-full bg-[#F8F9FB] border-2 rounded-2xl px-5 py-4 transition-all duration-300 flex items-center justify-between min-h-[64px] ${activeField === 'pin' ? 'border-[#6338F9] bg-white shadow-lg ring-4 ring-purple-50' : 'border-transparent'}`}>
              <div className="flex-1">
                {renderPinDisplay(pin, showPin)}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowPin(!showPin); }}
                className="text-gray-400 p-2 active:bg-gray-100 rounded-full transition-colors"
              >
                {showPin ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm PIN Field */}
          <div 
            className="space-y-1.5 relative group cursor-pointer" 
            onClick={(e) => { e.stopPropagation(); setActiveField('confirm'); }}
          >
            <label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Confirm PIN*</label>
            <div className={`w-full bg-[#F8F9FB] border-2 rounded-2xl px-5 py-4 transition-all duration-300 flex items-center justify-between min-h-[64px] ${activeField === 'confirm' ? 'border-[#6338F9] bg-white shadow-lg ring-4 ring-purple-50' : 'border-transparent'}`}>
              <div className="flex-1">
                {renderPinDisplay(confirmPin, showConfirm)}
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowConfirm(!showConfirm); }}
                className="text-gray-400 p-2 active:bg-gray-100 rounded-full transition-colors"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPin.length > 0 && pin !== confirmPin && confirmPin.length === 4 && (
              <p className="text-red-500 text-[11px] font-bold mt-1">PINs do not match</p>
            )}
          </div>
        </div>

        <button 
          onClick={onNext}
          disabled={!isComplete}
          className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all duration-300 text-sm mt-8 ${
            isComplete 
              ? 'bg-[#6338F9] text-white shadow-purple-200 active:scale-95' 
              : 'bg-purple-100 text-white cursor-not-allowed shadow-none'
          }`}
        >
          Continue
        </button>
      </div>

      {/* Custom Numeric Keyboard */}
      <AnimatePresence>
        {activeField && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="bg-[#F8F9FB] p-6 pb-12 grid grid-cols-3 gap-y-3 gap-x-4 shadow-[0_-15px_40px_rgba(0,0,0,0.1)] rounded-t-[40px] absolute bottom-0 left-0 right-0 z-[60]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="col-span-3 flex justify-center mb-2">
              <div className="w-12 h-1 bg-gray-200 rounded-full" />
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((num) => (
              <button 
                key={num}
                onClick={() => handleKeyPress(num.toString())}
                className="h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-bold text-[#111] shadow-sm active:bg-gray-100 active:scale-90 active:shadow-inner transition-all duration-150"
              >
                {num}
              </button>
            ))}
            <button 
              onClick={handleDelete}
              className="h-16 bg-white rounded-2xl flex items-center justify-center text-[#111] shadow-sm active:bg-red-50 active:scale-90 active:shadow-inner transition-all duration-150"
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
