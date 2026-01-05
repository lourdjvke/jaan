
import React, { useState, useRef, useEffect } from 'react';
import { JaanLogo } from './Icons';
import { ChevronLeft } from 'lucide-react';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const Verification: React.FC<Props> = ({ onNext, onBack }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const isComplete = otp.every(v => v !== '');

  return (
    <div className="flex flex-col h-full bg-white px-8 pt-12 pb-10">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-gray-900" />
        </button>
        <div className="flex items-center gap-1.5 pr-8">
          <JaanLogo className="w-5 h-5" color="#FFA500" />
          <span className="text-[#6338F9] font-black text-xl tracking-widest">JAAN</span>
        </div>
        <div className="w-6" />
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-[#111]">Enter Verification Code</h2>
          <p className="text-[#777] text-sm font-medium leading-relaxed">
            Enter the verification code sent to your email address <span className="text-black font-bold">Sedlabdulraheem@gmail.com</span>
          </p>
        </div>

        <div className="flex justify-between gap-2.5 pt-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              // Fixed: Modified callback ref to be a block statement to ensure it returns void, avoiding TS error
              ref={el => { if (el) inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              value={digit}
              onChange={e => handleChange(e, i)}
              onKeyDown={e => handleKeyDown(e, i)}
              className="w-full aspect-[4/5] bg-[#F8F9FB] rounded-xl text-center text-2xl font-extrabold border-2 border-transparent focus:border-[#6338F9] focus:bg-white outline-none transition-all text-[#111] placeholder:text-gray-400"
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs font-bold pt-2">
          <p className="text-gray-400">Didn't get the code? <button className="text-[#6338F9]">Resend it</button></p>
          <span className="text-[#6338F9]">0s</span>
        </div>

        <div className="flex-1" />

        <button 
          onClick={onNext}
          disabled={!isComplete}
          className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all text-sm mb-4 ${
            isComplete 
              ? 'bg-[#6338F9] text-white shadow-purple-100 active:scale-95' 
              : 'bg-purple-100 text-white cursor-not-allowed shadow-none'
          }`}
        >
          Verify
        </button>
      </div>
    </div>
  );
};

export default Verification;
