
import React, { useState } from 'react';
import { JaanLogo } from './Icons';
import { ChevronLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { updatePassword } from 'firebase/auth';
import { ref, update } from 'firebase/database';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const CreatePassword: React.FC<Props> = ({ onNext, onBack }) => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const criteria = [
    { label: 'at least 8 characters', met: password.length >= 8 },
    { label: 'at least 1 number', met: /\d/.test(password) },
    { label: 'at least 1 uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'at least 1 lowercase letter', met: /[a-z]/.test(password) },
  ];

  const allMet = criteria.every(c => c.met);
  const isMatch = password === confirm && password !== '';

  const handleCreatePassword = async () => {
    if (!allMet || !isMatch || !auth.currentUser) return;
    setLoading(true);
    try {
      // Set the password "quite literally" in Firebase Auth
      await updatePassword(auth.currentUser, password);
      
      // Persist progress to RTDB
      await update(ref(db, `users/${auth.currentUser.uid}`), {
        'onboarding/lastStep': 8 // KYC_FORM step
      });
      
      onNext();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

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

      <div className="flex-1 space-y-6 no-scrollbar overflow-y-auto">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-[#111]">Create Password</h2>
          <p className="text-[#777] text-sm font-medium leading-relaxed">Create a strong password to secure your account</p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="space-y-1.5 relative">
            <label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Password*</label>
            <div className="relative">
              <input 
                type={showPass ? 'text' : 'password'}
                placeholder="Enter Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#F8F9FB] border-2 border-transparent focus:border-[#6338F9] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-semibold text-[15px] pr-12 text-[#111] placeholder:text-gray-400" 
              />
              <button 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {criteria.map((c, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full ${c.met ? 'bg-[#34C759]' : 'bg-gray-200'}`} />
                <span className={`text-[13px] font-semibold transition-colors ${c.met ? 'text-[#34C759]' : 'text-gray-400'}`}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5 relative pt-4">
            <label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Confirm Password*</label>
            <div className="relative">
              <input 
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-Enter Password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="w-full bg-[#F8F9FB] border-2 border-transparent focus:border-[#6338F9] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-semibold text-[15px] pr-12 text-[#111] placeholder:text-gray-400" 
              />
              <button 
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <button 
          onClick={handleCreatePassword}
          disabled={!allMet || !isMatch || loading}
          className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all text-sm mt-8 flex items-center justify-center gap-2 ${
            allMet && isMatch && !loading
              ? 'bg-[#6338F9] text-white shadow-purple-100 active:scale-95' 
              : 'bg-purple-100 text-white cursor-not-allowed shadow-none'
          }`}
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          Create Password
        </button>
      </div>
    </div>
  );
};

export default CreatePassword;
