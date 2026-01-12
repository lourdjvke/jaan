
import React, { useState } from 'react';
import { JaanLogo } from './Icons';
import { auth } from '../lib/firebase';
import { Mail, CheckCircle2, RotateCw } from 'lucide-react';

interface Props {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

const VerificationSent: React.FC<Props> = ({ email, onVerified, onBack }) => {
  const [checking, setChecking] = useState(false);

  const checkStatus = async () => {
    setChecking(true);
    try {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        onVerified();
      } else {
        alert("Email not yet verified. Please check your inbox or spam folder.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white px-8 pt-12 pb-10">
      <div className="flex items-center justify-center mb-12">
        <div className="flex items-center gap-1.5">
          <JaanLogo className="w-5 h-5" color="#FFA500" />
          <span className="text-[#6338F9] font-black text-xl tracking-widest">JAAN</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center text-center space-y-6">
        <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-4">
          <Mail size={40} className="text-[#6338F9]" />
        </div>
        
        <h2 className="text-2xl font-extrabold text-[#111]">Verify Your Email</h2>
        <p className="text-[#777] text-sm font-medium leading-relaxed px-4">
          We've sent a verification link to <span className="text-black font-bold">{email}</span>. 
          Please click the link in the email to activate your account.
        </p>

        <div className="flex-1" />

        <button 
          onClick={checkStatus}
          disabled={checking}
          className="w-full py-4 bg-[#6338F9] text-white rounded-2xl font-bold shadow-xl shadow-purple-100 flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          {checking ? <RotateCw size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
          {checking ? 'Checking Status...' : 'I have verified my email'}
        </button>

        <button 
          onClick={onBack}
          className="text-gray-400 font-bold text-sm"
        >
          Use a different email address
        </button>
      </div>
    </div>
  );
};

export default VerificationSent;
