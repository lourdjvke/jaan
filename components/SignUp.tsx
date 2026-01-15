
import React, { useState } from 'react';
import { JaanLogo } from './Icons';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { sendNotification } from '../services/EmailService';
import { EmailTemplates } from '../services/EmailTemplates';

interface Props {
  onNext: (email: string) => void;
  onBack: () => void;
  onLogin: () => void;
  onSocialClick?: () => void;
  showToast: (message: string) => void;
}

const SignUp: React.FC<Props> = ({ onNext, onBack, onLogin, onSocialClick, showToast }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !agreed) return;
    setLoading(true);
    try {
      // Use a robust default password for the initial creation before the "Create Password" step
      const userCredential = await createUserWithEmailAndPassword(auth, email, "JaanTemporary123!");
      await sendEmailVerification(userCredential.user);
      
      // Initialize DB entry
      await set(ref(db, `users/${userCredential.user.uid}`), {
        email: email,
        createdAt: new Date().toISOString(),
        onboarding: { lastStep: 6 } // VERIFICATION_SENT step
      });

      // Send Welcome Email
      await sendNotification(email, "Welcome to JAAN!", EmailTemplates.welcome(email.split('@')[0]));

      onNext(email);
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
          <JaanLogo className="w-5 h-5" color="#FFA500" />
          <span className="text-[#6338F9] font-black text-xl tracking-widest">JAAN</span>
        </div>
        <div className="w-6" />
      </div>

      <div className="flex-1 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-[#111]">Unlock Seamless Digital Living</h2>
          <p className="text-[#777] text-sm font-medium">Join JAAN in just a few simple steps</p>
        </div>

        <div className="space-y-4 pt-4">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">Email Address*</label>
            <input 
              type="email" 
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F8F9FB] border-2 border-transparent focus:border-[#6338F9] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-semibold text-[15px] text-[#111] placeholder:text-gray-400" 
            />
          </div>

          <div className="flex items-start gap-3 py-2">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 accent-[#6338F9]" 
            />
            <span className="text-xs text-gray-400 leading-relaxed font-medium">
              By tapping continue, you agree to our <span className="text-[#6338F9] font-bold">privacy policy</span> and <span className="text-[#6338F9] font-bold">terms & condition</span>
            </span>
          </div>
        </div>

        <button 
          onClick={handleSignUp}
          disabled={!email || !agreed || loading}
          className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-2 ${
            email && agreed && !loading ? 'bg-[#6338F9] text-white' : 'bg-purple-100 text-white'
          }`}
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          Continue
        </button>

        <div className="text-center pt-2">
           <p className="text-xs font-bold text-gray-400">Already have an account? <button onClick={onLogin} className="text-[#6338F9]">Log in</button></p>
        </div>

        <div className="pt-8 flex flex-col items-center gap-6">
           <div className="flex items-center gap-4 w-full">
              <div className="flex-1 h-px bg-gray-100"></div>
              <span className="text-[10px] text-gray-300 font-black uppercase tracking-widest">Or login with</span>
              <div className="flex-1 h-px bg-gray-100"></div>
           </div>
           
           <div className="flex justify-center gap-6">
              {[
                { icon: 'https://cdn-icons-png.flaticon.com/512/0/747.png', name: 'Apple' },
                { icon: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png', name: 'Google' },
                { icon: 'https://cdn-icons-png.flaticon.com/512/124/124010.png', name: 'Facebook' }
              ].map((social, i) => (
                <button key={i} onClick={onSocialClick} className="w-14 h-14 rounded-full border border-gray-100 flex items-center justify-center p-3.5 active:bg-gray-50 transition-colors shadow-sm bg-white">
                   <img src={social.icon} alt={social.name} className="w-full h-full object-contain" />
                </button>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
