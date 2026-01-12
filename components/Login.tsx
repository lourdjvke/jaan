
import React, { useState } from 'react';
import { JaanLogo } from './Icons';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { sendNotification } from '../services/EmailService';
import { EmailTemplates } from '../services/EmailTemplates';

interface Props {
  onBack: () => void;
  onSignUp: () => void;
  onForgot: () => void;
  onSocialClick?: () => void;
}

const Login: React.FC<Props> = ({ onBack, onSignUp, onForgot, onSocialClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        setError('Please verify your email address before logging in.');
        return;
      }

      // Successful login notification with dynamic data
      const now = new Date().toLocaleString();
      const device = navigator.userAgent.split(')')[0].split('(')[1] || 'Web Browser';
      await sendNotification(
        email, 
        "Security Alert: New Login Detected", 
        EmailTemplates.loginSuccess(now, "Detected via Web", device, "Remote Login")
      );
      
    } catch (e: any) {
      if (e.code === 'auth/invalid-credential' || e.code === 'auth/user-not-found' || e.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white px-8 pt-12 pb-10">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-1.5 mb-8">
          <JaanLogo className="w-5 h-5" color="#FFA500" />
          <span className="text-[#6338F9] font-black text-xl tracking-widest">JAAN</span>
        </div>
        <h2 className="text-2xl font-extrabold text-[#111]">Welcome Back!</h2>
        <p className="text-[#777] text-[13px] font-medium mt-1">Log in to access your JAAN account</p>
      </div>

      <div className="flex-1 space-y-5">
        <div className="space-y-1.5">
          <label className="text-[12px] font-bold text-gray-800 tracking-tight">Email*</label>
          <input 
            type="email" 
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#F8F9FB] border-2 border-transparent focus:border-[#6338F9] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-semibold text-[15px] text-[#111] placeholder:text-gray-400" 
          />
        </div>

        <div className="space-y-1.5 relative">
          <label className="text-[12px] font-bold text-gray-800 tracking-tight">Password*</label>
          <div className="relative">
            <input 
              type={showPass ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#F8F9FB] border-2 border-transparent focus:border-[#6338F9] focus:bg-white rounded-2xl px-5 py-4 outline-none pr-12 text-[#111] placeholder:text-gray-400" 
            />
            <button 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-[11px] font-bold">{error}</p>}

        <div className="text-left">
           <button onClick={onForgot} className="text-red-500 text-[12px] font-bold">Forgot password?</button>
        </div>

        <button 
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 ${
            email && password && !loading ? 'bg-[#6338F9] text-white' : 'bg-purple-100 text-white'
          }`}
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          Log in
        </button>

        <div className="pt-6 flex flex-col items-center gap-6">
           <div className="flex items-center gap-4 w-full">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-gray-100"></div>
           </div>

           <div className="flex justify-center gap-6">
              {[
                { icon: 'https://cdn-icons-png.flaticon.com/512/0/747.png', name: 'Apple' },
                { icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', name: 'Google' },
                { icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png', name: 'Facebook' }
              ].map((social, i) => (
                <button key={i} onClick={onSocialClick} className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center p-3 bg-white">
                   <img src={social.icon} alt={social.name} className="w-full h-full object-contain" />
                </button>
              ))}
           </div>
        </div>

        <div className="text-center pt-8">
           <p className="text-[12px] font-bold text-gray-400">
             Don't have an account? <button onClick={onSignUp} className="text-[#6338F9]">Sign up for free</button>
           </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
