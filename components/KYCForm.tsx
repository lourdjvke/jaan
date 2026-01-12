
import React, { useState, useRef, useEffect } from 'react';
import { JaanLogo } from './Icons';
import { ChevronLeft, Info, Calendar, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../lib/firebase';
import { ref, update, onValue } from 'firebase/database';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 100 }, (_, i) => 2025 - i);

const KYCForm: React.FC<Props> = ({ onNext, onBack }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showDOB, setShowDOB] = useState(false);
  const [showGender, setShowGender] = useState(false);
  
  const [tempMonth, setTempMonth] = useState("September");
  const [tempDay, setTempDay] = useState(16);
  const [tempYear, setTempYear] = useState(2000);

  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    phone: '',
    dob: '',
    gender: ''
  });

  useEffect(() => {
    if (auth.currentUser) {
      const kycRef = ref(db, `users/${auth.currentUser.uid}/kyc`);
      onValue(kycRef, (snapshot) => {
        const data = snapshot.val();
        if (data) setFormData(prev => ({ ...prev, ...data }));
      }, { onlyOnce: true });
    }
  }, []);

  const handleNext = async () => {
    if (auth.currentUser) {
      await update(ref(db, `users/${auth.currentUser.uid}`), {
        kyc: formData,
        'onboarding/lastStep': 9 // TRANSACTION_PIN
      });
    }
    onNext();
  };

  const isFormValid = formData.fullName && formData.phone && formData.dob && formData.gender;

  const handleGenderSelect = (gender: string) => {
    setFormData({ ...formData, gender });
    setTimeout(() => setShowGender(false), 200);
  };

  const handleDOBConfirm = () => {
    setFormData({ ...formData, dob: `${tempMonth} ${tempDay}, ${tempYear}` });
    setShowDOB(false);
  };

  return (
    <div className="flex flex-col h-full bg-white pt-12 relative overflow-hidden">
      <div className="px-8 mb-6">
        <div className="flex gap-2 mb-8">
          <div className="flex-1 h-1 bg-[#6338F9] rounded-full"></div>
          <div className="flex-1 h-1 bg-[#6338F9] rounded-full"></div>
          <div className="flex-1 h-1 bg-[#6338F9] rounded-full"></div>
          <div className="flex-1 h-1 bg-gray-100 rounded-full"></div>
        </div>
        <div className="flex items-center justify-between">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
            <ChevronLeft size={24} className="text-gray-900" />
          </button>
          <div className="flex items-center gap-1.5 pr-8">
            <JaanLogo className="w-5 h-5" color="#FFA500" />
            <span className="text-[#6338F9] font-black text-xl tracking-widest">JAAN</span>
          </div>
          <div className="w-6" />
        </div>
      </div>

      <div className="flex-1 space-y-6 px-8 no-scrollbar overflow-y-auto pb-10">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-extrabold text-[#111]">Tell Us More About You</h2>
          <button onClick={() => setShowInfo(true)} className="p-1.5 bg-purple-50 text-[#6338F9] rounded-full">
            <Info size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-800 tracking-tight">Full Name*</label>
            <input 
              type="text" 
              placeholder="As It Appears On Your ID"
              value={formData.fullName}
              onChange={e => setFormData({...formData, fullName: e.target.value})}
              className="w-full bg-[#F8F9FB] border-2 border-transparent focus:border-[#6338F9] focus:bg-white rounded-2xl px-5 py-4 outline-none font-semibold text-[15px] text-[#111] placeholder:text-gray-400" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-800 tracking-tight">User Name</label>
            <input 
              type="text" 
              placeholder="Fun Nickname"
              value={formData.userName}
              onChange={e => setFormData({...formData, userName: e.target.value})}
              className="w-full bg-[#F8F9FB] border-2 border-transparent focus:border-[#6338F9] focus:bg-white rounded-2xl px-5 py-4 outline-none font-semibold text-[15px] text-[#111] placeholder:text-gray-400" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-800 tracking-tight">Phone Number*</label>
            <div className="flex gap-2">
              <input 
                type="tel" 
                placeholder="+234 000 000 0000"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="flex-1 bg-[#F8F9FB] border-2 border-transparent focus:border-[#6338F9] focus:bg-white rounded-2xl px-5 py-4 outline-none font-semibold text-[15px] text-[#111] placeholder:text-gray-400" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-800 tracking-tight">Date Of Birth*</label>
            <div className="relative" onClick={() => setShowDOB(true)}>
              <div className="w-full bg-[#F8F9FB] border-2 border-transparent rounded-2xl px-5 py-4 font-semibold text-[15px] cursor-pointer h-[58px] flex items-center">
                {formData.dob ? <span className="text-[#111]">{formData.dob}</span> : <span className="text-gray-400">Select Date Of Birth</span>}
              </div>
              <Calendar size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-800 tracking-tight">Gender*</label>
            <div className="relative" onClick={() => setShowGender(true)}>
              <div className="w-full bg-[#F8F9FB] border-2 border-transparent rounded-2xl px-5 py-4 font-semibold text-[15px] cursor-pointer h-[58px] flex items-center">
                {formData.gender ? <span className="text-[#111]">{formData.gender}</span> : <span className="text-gray-400">Select Preferred Gender</span>}
              </div>
              <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <button 
          onClick={handleNext}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all ${
            isFormValid ? 'bg-[#6338F9] text-white' : 'bg-purple-100 text-white'
          }`}
        >
          Continue
        </button>
      </div>

      {/* Date Of Birth Picker */}
      <BottomPicker show={showDOB} onClose={() => setShowDOB(false)} title="Select Your Date of Birth">
        <div className="flex flex-col">
          <div className="flex justify-around h-[220px] relative mb-10 overflow-hidden">
             {/* Selection window borders */}
            <div className="absolute top-1/2 left-0 right-0 h-[44px] -translate-y-1/2 border-y border-gray-100 pointer-events-none z-10"></div>
            
            <ScrollPicker items={months} value={tempMonth} onSelect={setTempMonth} />
            <ScrollPicker items={days} value={tempDay} onSelect={setTempDay} />
            <ScrollPicker items={years} value={tempYear} onSelect={setTempYear} />
          </div>
          <button 
            onClick={handleDOBConfirm}
            className="w-full py-5 rounded-[2rem] bg-[#6338F9] text-white font-black text-[16px] shadow-xl shadow-purple-100 active:scale-[0.98] transition-all"
          >
            Confirm Date
          </button>
        </div>
      </BottomPicker>

      {/* Gender Picker */}
      <BottomPicker show={showGender} onClose={() => setShowGender(false)} title="Select Preferred Gender">
        <div className="space-y-1">
          {[
            { id: 'Female', label: 'Female', icon: '♀️' },
            { id: 'Male', label: 'Male', icon: '♂️' },
            { id: 'Non-binary', label: 'Non-binary', icon: '⚧️' },
            { id: 'Prefer not to say', label: 'Prefer not to say', icon: '🔘' }
          ].map((g) => (
            <button 
              key={g.id}
              onClick={() => handleGenderSelect(g.id)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[1.5rem] transition-all text-left ${formData.gender === g.id ? 'bg-[#F2F3F5]' : 'bg-transparent active:bg-gray-50'}`}
            >
              <span className="text-xl opacity-80">{g.icon}</span>
              <span className={`flex-1 font-bold text-[15px] ${formData.gender === g.id ? 'text-[#111]' : 'text-gray-400'}`}>{g.label}</span>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${formData.gender === g.id ? 'border-[#6338F9]' : 'border-gray-200'}`}>
                {formData.gender === g.id && <div className="w-3 h-3 rounded-full bg-[#6338F9]" />}
              </div>
            </button>
          ))}
        </div>
      </BottomPicker>

      {/* Info Modal */}
      <AnimatePresence>
        {showInfo && (
          <div className="absolute inset-0 z-[200] flex items-center justify-center p-8">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowInfo(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-2xl relative z-10 w-full"
            >
              <h4 className="text-[17px] font-black text-[#111] mb-4 flex items-center gap-2">
                <Info size={20} className="text-[#6338F9]" /> Why we need this?
              </h4>
              <p className="text-[13px] font-bold text-gray-500 leading-relaxed mb-6">
                Your legal information helps us verify your identity and secure your account according to financial regulations. We keep your data safe and encrypted.
              </p>
              <button onClick={() => setShowInfo(false)} className="w-full py-4 bg-[#6338F9] text-white rounded-2xl font-black text-sm">Got it!</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BottomPicker: React.FC<{ show: boolean, onClose: () => void, title: string, children: React.ReactNode }> = ({ show, onClose, title, children }) => (
  <AnimatePresence>
    {show && (
      <div className="absolute inset-0 z-[100] flex flex-col justify-end">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        />
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: "spring", damping: 30, stiffness: 350, mass: 0.8 }}
          className="relative bg-white rounded-t-[3.5rem] p-8 pb-12 shadow-2xl overflow-hidden"
        >
          <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-10"></div>
          <h3 className="text-[17px] font-black text-[#111] mb-8">{title}</h3>
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

const ScrollPicker: React.FC<{ items: any[], value: any, onSelect: (val: any) => void }> = ({ items, value, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemHeight = 44;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    if (items[index] !== undefined && items[index] !== value) {
      onSelect(items[index]);
    }
  };

  useEffect(() => {
    const index = items.indexOf(value);
    if (containerRef.current && index !== -1) {
      containerRef.current.scrollTop = index * itemHeight;
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto no-scrollbar snap-y snap-mandatory px-2"
    >
      <div className="h-[88px]" /> 
      {items.map((item, i) => (
        <div 
          key={i} 
          onClick={() => {
            onSelect(item);
            if (containerRef.current) containerRef.current.scrollTo({ top: i * itemHeight, behavior: 'smooth' });
          }}
          className={`h-[44px] flex items-center justify-center snap-center cursor-pointer transition-all duration-300 ${item === value ? 'text-[#111] font-black scale-110' : 'text-gray-300 font-bold scale-95'}`}
        >
          {item}
        </div>
      ))}
      <div className="h-[88px]" /> 
    </div>
  );
};

export default KYCForm;
