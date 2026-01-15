
import React, { useState } from 'react';
import { JaanLogo } from './Icons';
import { ChevronLeft, Mail, Loader2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

interface Props {
  onBack: () => void;
  showToast: (message: string) => void;
}

const ForgotPassword: React.FC<Props> = ({ onBack, showToast }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (e: any) {
      showToast(e.message);
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
          <JaanLogo className="w-5 h-5" />
          <span className="text-[#6338F9] font-black text-xl tracking-widest">JAAN</span>
        </div>
        <div className="w-6" />
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-[#111]">Reset Password</h2>
          <p className="text-[#777] text-sm font-medium">Enter your email to receive a password reset link.</p>
        </div>

        {sent ? (
          <div className="bg-green-50 border border-green-100 p-6 rounded-3xl text-center space-y-4">
            <Mail size={32} className="text-green-500 mx-auto" />
            <p className="text-sm font-bold text-green-700">Instructions sent! Please check your inbox.</p>
            <button onClick={onBack} className="text-[#6338F9] font-black text-sm">Back to Login</button>
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            <div className="space-y-1.5">
              <label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Email Address</label>
              <input 
                type="email" 
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F8F9FB] border-2 border-transparent focus:border-[#6338F9] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-semibold text-[15px] text-[#111] placeholder:text-gray-400" 
              />
            </div>

            <button 
              onClick={handleReset}
              disabled={loading || !email}
              className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 ${
                email ? 'bg-[#6338F9] text-white' : 'bg-purple-100 text-white'
              }`}
            >
              {loading && <Loader2 size={18} className="animate-spin" />}
              Send Reset Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
