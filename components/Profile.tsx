
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Calendar, ChevronDown, Smartphone, Mail, User, MapPin } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const years = Array.from({ length: 100 }, (_, i) => 2024 - i);

const Profile: React.FC<Props> = ({ onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showDOB, setShowDOB] = useState(false);
  const [showGender, setShowGender] = useState(false);

  const [formData, setFormData] = useState({
    userName: 'Sedi',
    fullName: 'Sedi Raheem',
    email: 'sediraheem@gmail.com',
    phone: '801 234 5678',
    dob: '01/01/2000',
    address: 'House 2 Musa Aminu street, Surulere, Lagos',
    gender: 'Male'
  });

  // Picker States (Internal to the sheet)
  const [tempMonth, setTempMonth] = useState("September");
  const [tempDay, setTempDay] = useState(16);
  const [tempYear, setTempYear] = useState(2017);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleGenderSelect = (gender: string) => {
    setFormData({ ...formData, gender });
    setTimeout(() => setShowGender(false), 200);
  };

  const handleDOBConfirm = () => {
    const mIndex = months.indexOf(tempMonth) + 1;
    const formattedDate = `${tempDay.toString().padStart(2, '0')}/${mIndex.toString().padStart(2, '0')}/${tempYear}`;
    setFormData({ ...formData, dob: formattedDate });
    setShowDOB(false);
  };

  const renderField = (label: string, value: string, icon: React.ReactNode) => (
    <div className="flex items-center gap-5">
      <div className="w-10 h-10 bg-[#F8F9FB] rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 space-y-0.5">
        <p className="text-[11px] font-bold text-gray-400">{label}</p>
        <p className="text-[14px] font-black text-[#111] leading-tight">{value}</p>
      </div>
    </div>
  );

  const renderInput = (label: string, field: keyof typeof formData, placeholder: string, type: string = 'text', readOnly: boolean = false, onClick?: () => void, suffix?: React.ReactNode) => (
    <div className="space-y-1.5" onClick={onClick}>
      <label className="text-[12px] font-bold text-gray-900 tracking-tight ml-1">{label}</label>
      <div className={`relative flex items-center w-full bg-[#F8F9FB] rounded-2xl px-5 py-4 border-2 border-transparent transition-all h-[58px] ${readOnly ? 'cursor-pointer' : ''}`}>
        {field === 'phone' && (
          <div className="flex items-center gap-1.5 mr-3 pr-3 border-r border-gray-100">
            <img src="https://flagcdn.com/w20/ng.png" className="w-5 h-auto rounded-sm" />
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        )}
        <input 
          type={type} 
          placeholder={placeholder}
          value={formData[field]}
          readOnly={readOnly}
          onChange={e => setFormData({...formData, [field]: e.target.value})}
          className={`flex-1 bg-transparent border-none outline-none font-bold text-[14px] text-[#111] placeholder:text-gray-300 ${readOnly ? 'cursor-pointer' : ''}`} 
        />
        {suffix}
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
      {/* Header */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-white z-[60]">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-[#111]" />
        </button>
        <h2 className="text-[16px] font-black text-[#111]">Profile</h2>
        {isEditing ? (
          <button onClick={handleSave} className="text-[#6338F9] font-black text-[15px]">Save</button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-[#6338F9] font-black text-[15px]">Edit</button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Profile Photo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden p-0.5 bg-white shadow-xl mb-4 relative">
             <div className="absolute inset-0 rounded-full border-[12px] border-[#F8F9FB]"></div>
            <img src="https://i.pravatar.cc/150?u=sedi" className="w-full h-full rounded-full object-cover relative z-10" alt="profile" />
          </div>
          <button className="text-[#6338F9] font-black text-[14px] active:opacity-60 transition-opacity">Change Image</button>
        </div>

        <div className="px-8 space-y-6">
          {!isEditing ? (
            <div className="space-y-8">
              {renderField('User Name', formData.userName, <Smartphone size={18} className="text-[#6338F9]" />)}
              {renderField('Full Name', formData.fullName, <Smartphone size={18} className="text-[#6338F9]" />)}
              {renderField('Email Address', formData.email, <Mail size={18} className="text-[#6338F9]" />)}
              {renderField('Phone Number', `+234 ${formData.phone}`, <Smartphone size={18} className="text-[#6338F9]" />)}
              {renderField('Date Of Birth', formData.dob, <Calendar size={18} className="text-[#6338F9]" />)}
              {renderField('Residential Address', formData.address, <MapPin size={18} className="text-[#6338F9]" />)}
              {renderField('Gender', formData.gender, <User size={18} className="text-[#6338F9]" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {renderInput('User Name', 'userName', 'Enter Username')}
              {renderInput('Full Name', 'fullName', 'Enter Full Name')}
              {renderInput('Email Address', 'email', 'Enter Email', 'email')}
              {renderInput('Phone Number', 'phone', '801 234 5678', 'tel')}
              {renderInput('Date Of Birth*', 'dob', 'Select DOB', 'text', true, () => setShowDOB(true), <Calendar size={20} className="text-gray-400" />)}
              {renderInput('Residential Address', 'address', 'Enter Address')}
              {renderInput('Gender*', 'gender', 'Select Gender', 'text', true, () => setShowGender(true), <ChevronDown size={20} className="text-gray-400" />)}
            </div>
          )}
        </div>
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

export default Profile;
