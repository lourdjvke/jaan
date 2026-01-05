
import React, { useState, useRef, useEffect } from 'react';
import { JaanLogo } from './Icons';
import { ChevronLeft, Info, Calendar, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 100 }, (_, i) => 2024 - i);

const calculateAge = (m: string, d: number, y: number) => {
  const birthDate = new Date(`${m} ${d}, ${y}`);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
};

const KYCForm: React.FC<Props> = ({ onNext, onBack }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [showDOB, setShowDOB] = useState(false);
  const [showGender, setShowGender] = useState(false);
  
  const [tempMonth, setTempMonth] = useState("September");
  const [tempDay, setTempDay] = useState(16);
  const [tempYear, setTempYear] = useState(2017);

  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    phone: '',
    dob: '',
    gender: ''
  });

  const isFormValid = formData.fullName && formData.phone && formData.dob && formData.gender;

  const handleGenderSelect = (gender: string) => {
    setFormData({ ...formData, gender });
    setShowGender(false);
  };

  const handleDOBConfirm = () => {
    setFormData({ ...formData, dob: `${tempMonth} ${tempDay}, ${tempYear}` });
    setShowDOB(false);
  };

  const currentAge = calculateAge(tempMonth, tempDay, tempYear);

  return (
    <div className="flex flex-col h-full bg-white pt-12 relative overflow-hidden">
      {/* Header with Step Indicator */}
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
          <button 
            onClick={() => setShowInfo(true)}
            className="p-1.5 bg-purple-50 text-[#6338F9] rounded-full active:bg-purple-100 transition-colors"
          >
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
              className="w-full bg-[#F8F9FB] border-2 border-transparent focus:border-[#6338F9] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-semibold text-[15px] text-[#111] placeholder:text-gray-400" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-800 tracking-tight">User Name</label>
            <input 
              type="text" 
              placeholder="This Can Be A Fun Nickname"
              value={formData.userName}
              onChange={e => setFormData({...formData, userName: e.target.value})}
              className="w-full bg-[#F8F9FB] border-2 border-transparent focus:border-[#6338F9] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-semibold text-[15px] text-[#111] placeholder:text-gray-400" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-800 tracking-tight">Phone Number*</label>
            <div className="flex gap-2">
              <div className="w-[80px] bg-[#F8F9FB] rounded-2xl flex items-center justify-center gap-1 font-bold text-sm border-2 border-transparent">
                 <img src="https://flagcdn.com/w20/ng.png" className="w-5 h-auto rounded-sm" />
                 <ChevronDown size={14} className="text-gray-400" />
              </div>
              <input 
                type="tel" 
                placeholder="+234 000 000 0000"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="flex-1 bg-[#F8F9FB] border-2 border-transparent focus:border-[#6338F9] focus:bg-white rounded-2xl px-5 py-4 outline-none transition-all font-semibold text-[15px] text-[#111] placeholder:text-gray-400" 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-800 tracking-tight">Date Of Birth*</label>
            <div className="relative" onClick={() => setShowDOB(true)}>
              <div className="w-full bg-[#F8F9FB] border-2 border-transparent rounded-2xl px-5 py-4 font-semibold text-[15px] text-[#111] pr-12 cursor-pointer h-[58px] flex items-center">
                {formData.dob || <span className="text-gray-400 font-medium">Select Date Of Birth</span>}
              </div>
              <Calendar size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-bold text-gray-800 tracking-tight">Gender*</label>
            <div className="relative" onClick={() => setShowGender(true)}>
              <div className="w-full bg-[#F8F9FB] border-2 border-transparent rounded-2xl px-5 py-4 font-semibold text-[15px] text-[#111] pr-12 cursor-pointer h-[58px] flex items-center">
                {formData.gender || <span className="text-gray-400 font-medium">Select Preferred Gender</span>}
              </div>
              <ChevronDown size={20} className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <button 
          onClick={onNext}
          disabled={!isFormValid}
          className={`w-full py-4 rounded-2xl font-bold shadow-xl transition-all text-sm mt-4 ${
            isFormValid 
              ? 'bg-[#6338F9] text-white shadow-purple-100 active:scale-95' 
              : 'bg-purple-100 text-white cursor-not-allowed shadow-none'
          }`}
        >
          Continue
        </button>
      </div>

      {/* DOB Picker Bottom Sheet */}
      <BottomPicker 
        show={showDOB} 
        onClose={() => setShowDOB(false)} 
        title={
          <div className="flex items-center justify-between w-full">
            <span className="text-[#111] font-extrabold text-[17px]">Select Your Date of Birth</span>
            <span className="text-[#6338F9] font-bold text-sm bg-purple-50 px-3 py-1 rounded-full">{currentAge} Years Old</span>
          </div>
        }
      >
        <div className="flex flex-col gap-8">
          <div className="flex justify-around h-48 overflow-hidden relative">
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-12 border-y-2 border-gray-50 pointer-events-none"></div>
            <ScrollPicker items={months} value={tempMonth} onSelect={setTempMonth} />
            <ScrollPicker items={days} value={tempDay} onSelect={setTempDay} />
            <ScrollPicker items={years} value={tempYear} onSelect={setTempYear} />
          </div>
          
          <button 
            onClick={handleDOBConfirm}
            className="w-full bg-[#6338F9] text-white py-4 rounded-2xl font-bold shadow-xl shadow-purple-100 active:scale-95 transition-all"
          >
            Set DOB
          </button>
        </div>
      </BottomPicker>

      {/* Gender Picker Bottom Sheet */}
      <BottomPicker 
        show={showGender} 
        onClose={() => setShowGender(false)} 
        title={<span className="text-[#111] font-extrabold text-[17px]">Select Preferred Gender</span>}
      >
        <div className="space-y-2">
           {[
             { id: 'Female', label: 'Female', icon: '♀️' },
             { id: 'Male', label: 'Male', icon: '♂️' },
             { id: 'Non-binary', label: 'Non-binary', icon: '⚧️' },
             { id: 'Prefer not to say', label: 'Prefer not to say', icon: '🔘' }
           ].map((g) => (
             <button 
               key={g.id}
               onClick={() => handleGenderSelect(g.id)}
               className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-colors text-left ${formData.gender === g.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
             >
               <span className="text-xl">{g.icon}</span>
               <span className="flex-1 font-bold text-gray-800">{g.label}</span>
               <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.gender === g.id ? 'border-[#6338F9]' : 'border-gray-200'}`}>
                 {formData.gender === g.id && <div className="w-2.5 h-2.5 rounded-full bg-[#6338F9]" />}
               </div>
             </button>
           ))}
        </div>
      </BottomPicker>

      {/* Info Tooltip */}
      <AnimatePresence>
        {showInfo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2rem] p-8 relative shadow-2xl max-w-sm text-center"
            >
              <button onClick={() => setShowInfo(false)} className="absolute top-6 right-6 p-1 text-gray-400">
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-[#6338F9]/10 text-[#6338F9] rounded-full flex items-center justify-center mx-auto mb-6">
                <Info size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-[#111] mb-4">Why KYC?</h3>
              <p className="text-[#777] text-sm font-medium leading-[1.6]">
                To ensure security and comply with regulations.
              </p>
              <button onClick={() => setShowInfo(false)} className="w-full bg-[#6338F9] text-white py-4 rounded-2xl font-bold mt-8 shadow-xl shadow-purple-100 active:scale-95 transition-all">
                Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BottomPicker: React.FC<{ show: boolean, onClose: () => void, title: React.ReactNode, children: React.ReactNode }> = ({ show, onClose, title, children }) => (
  <AnimatePresence>
    {show && (
      <>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-[110]"
        />
        <motion.div 
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-8 pb-12 z-[120] shadow-[0_-8px_24px_rgba(0,0,0,0.05)]"
        >
          <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-6"></div>
          <div className="mb-6">{title}</div>
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const ScrollPicker: React.FC<{ items: any[], value: any, onSelect: (val: any) => void }> = ({ items, value, onSelect }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const itemHeight = 44; // Approx height of items
    const index = Math.round(scrollTop / itemHeight);
    if (items[index] !== value) {
      onSelect(items[index]);
    }
  };

  useEffect(() => {
    const index = items.indexOf(value);
    if (containerRef.current && index !== -1) {
      containerRef.current.scrollTop = index * 44;
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto no-scrollbar snap-y snap-mandatory px-2"
    >
      <div className="h-[66px]" /> {/* Padding top for center alignment */}
      {items.map((item, i) => (
        <div 
          key={i} 
          onClick={() => {
            onSelect(item);
            if (containerRef.current) containerRef.current.scrollTop = i * 44;
          }}
          className={`h-11 flex items-center justify-center snap-center cursor-pointer transition-all duration-200 ${item === value ? 'text-[#111] font-black scale-110' : 'text-gray-300 font-bold scale-90'}`}
        >
          {item}
        </div>
      ))}
      <div className="h-[66px]" /> {/* Padding bottom for center alignment */}
    </div>
  );
};

export default KYCForm;
