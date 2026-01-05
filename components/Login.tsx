
import React, { useState } from 'react';
import { JaanLogo } from './Icons';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

interface Props {
  onNext: () => void;
  onBack: () => void;
  onSignUp: () => void;
}

const Login: React.FC<Props> = ({ onNext, onBack, onSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (email === 'jvkechris@gmail.com' && password === 'Dorado12345') {
       setLoading(true);
       setTimeout(() => {
          onNext();
       }, 2000);
    } else {
       setError('Invalid credentials. Please try again.');
    }
  };

  const isFormFilled = email.length > 0 && password.length > 0;

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center">
         <Loader2 className="w-12 h-12 text-[#6338F9] animate-spin mb-4" />
         <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">Securing Connection...</p>
      </div>
    );
  }

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
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            className={`w-full bg-[#F8F9FB] border-2 rounded-2xl px-5 py-4 outline-none transition-all font-semibold text-[15px] text-[#111] placeholder:text-gray-400 ${error ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-[#6338F9] focus:bg-white'}`} 
          />
        </div>

        <div className="space-y-1.5 relative">
          <label className="text-[12px] font-bold text-gray-800 tracking-tight">Password*</label>
          <div className="relative">
            <input 
              type={showPass ? 'text' : 'password'}
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className={`w-full bg-[#F8F9FB] border-2 rounded-2xl px-5 py-4 outline-none transition-all font-semibold text-[15px] text-[#111] placeholder:text-gray-400 pr-12 ${error ? 'border-red-500 bg-red-50' : 'border-transparent focus:border-[#6338F9] focus:bg-white'}`} 
            />
            <button 
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 p-1"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-[11px] font-bold mt-1 px-1">{error}</p>
        )}

        <div className="text-left">
           <button className="text-red-500 text-[12px] font-bold active:opacity-60 transition-opacity">Forgot password?</button>
        </div>

        <button 
          onClick={handleLogin}
          disabled={!isFormFilled}
          className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all text-sm mt-4 ${
            isFormFilled 
              ? 'bg-[#6338F9] text-white shadow-purple-200 active:scale-95' 
              : 'bg-purple-100 text-white cursor-not-allowed shadow-none'
          }`}
        >
          Log in
        </button>

        <div className="pt-6 flex flex-col items-center gap-6">
           <div className="flex items-center gap-4 w-full">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-gray-100"></div>
           </div>

           <p className="text-[10px] text-gray-400 font-bold uppercase">sign in with</p>
           
           <div className="flex justify-center gap-6">
              {[
                { icon: 'https://cdn-icons-png.flaticon.com/512/0/747.png', name: 'Apple' },
                { icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', name: 'Google' },
                { icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png', name: 'Facebook' }
              ].map((social, i) => (
                <button key={i} className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center p-3 active:bg-gray-50 transition-colors shadow-sm bg-white">
                   <img src={social.icon} alt={social.name} className={`w-full h-full object-contain ${social.name === 'Apple' ? 'opacity-80' : ''}`} />
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
