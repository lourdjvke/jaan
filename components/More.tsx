
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, BarChart2, Shield, Moon, Bell, Landmark, 
  LifeBuoy, Scale, MessageSquare, Star, LogOut, 
  ChevronRight, X, Sparkles, AlertCircle
} from 'lucide-react';

interface Props {
  onLogout: () => void;
  onViewProfile: () => void;
  onSupport?: () => void;
}

const More: React.FC<Props> = ({ onLogout, onViewProfile, onSupport }) => {
  const [showSpin, setShowSpin] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const menuItems = [
    { icon: <Users size={18} className="text-green-500" />, label: 'Referrals' },
    { icon: <BarChart2 size={18} className="text-yellow-500" />, label: 'Analytics' },
    { icon: <Shield size={18} className="text-red-400" />, label: 'Security' },
    { icon: <Moon size={18} className="text-gray-400" />, label: 'Theme', hasSub: true },
    { icon: <Bell size={18} className="text-orange-300" />, label: 'Notifications', hasToggle: true },
    { icon: <Landmark size={18} className="text-green-600" />, label: 'Generate Bank Account' },
    { icon: <LifeBuoy size={18} className="text-red-500" />, label: 'Support', onClick: onSupport },
    { icon: <Scale size={18} className="text-orange-400" />, label: 'Legal' },
  ];

  const wheelSegments = [
    { label: "Almost There!", color: "#8E6FFF" },
    { label: "3 JTokens", color: "#A994FF" },
    { label: "₦ 1000 Coupon", color: "#C4B9FF" },
    { label: "1 Token", color: "#A182FF" },
    { label: "2 JTokens", color: "#B8A2FF" },
    { label: "Try Again?", color: "#734BFF" },
  ];

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    // At least 5 full spins + random offset
    const extraRot = 1800 + Math.random() * 360; 
    setRotation(prev => prev + extraRot);
    setTimeout(() => setIsSpinning(false), 4000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FB] overflow-y-auto no-scrollbar pb-32">
      {/* Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-center bg-white border-b border-gray-100">
        <h2 className="text-[17px] font-black text-[#111]">More</h2>
      </div>

      <div className="p-6 space-y-8">
        {/* Spin & Win CTA */}
        <div className="flex justify-center">
          <button 
            onClick={() => setShowSpin(true)}
            className="bg-gradient-to-b from-[#FFB400] to-[#FF8A00] px-10 py-3 rounded-2xl text-white font-black text-sm shadow-lg shadow-orange-100 active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles size={16} /> Spin & Win
          </button>
        </div>

        {/* User Card */}
        <div className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100/50 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-50">
            <img src="https://i.pravatar.cc/150?u=sedi" className="w-full h-full object-cover" alt="profile" />
          </div>
          <div className="flex-1">
            <h3 className="font-black text-[#111] text-[15px] uppercase tracking-tight">SEDI RAHEEM</h3>
            <p className="text-[11px] font-bold text-gray-400">Account Number: 9962802191</p>
            <p className="text-[11px] font-bold text-gray-400">Wallet Balance: <span className="text-[#111] font-black">₦16,500.00</span></p>
          </div>
          <button 
            onClick={onViewProfile}
            className="bg-purple-50 text-[#6338F9] px-3.5 py-2 rounded-xl font-black text-[10px] active:scale-95 transition-all"
          >
            View Profile
          </button>
        </div>

        {/* Menu Grid */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100/50">
          <div className="space-y-1">
            {menuItems.map((item, i) => (
              <div 
                key={i} 
                onClick={() => item.onClick?.()}
                className="flex items-center justify-between py-4 border-b border-gray-50 last:border-none cursor-pointer group active:opacity-60 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                    {item.icon}
                  </div>
                  <span className="text-[13px] font-bold text-gray-800">{item.label}</span>
                </div>
                <div className="flex items-center">
                  {item.hasToggle ? (
                    <div className="w-10 h-5 bg-gray-100 rounded-full relative">
                      <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                    </div>
                  ) : (
                    <ChevronRight size={18} className="text-gray-300" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social & Rate */}
        <div className="space-y-3">
          <button className="w-full bg-white px-6 py-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-3 active:scale-[0.98] transition-all">
            <MessageSquare size={20} className="text-[#34C759]" />
            <span className="text-[13px] font-black text-[#111]">Join Our Community</span>
          </button>
          <button className="w-full bg-white px-6 py-5 rounded-[2rem] shadow-sm border border-gray-100 flex items-center gap-3 active:scale-[0.98] transition-all">
            <Star size={20} className="text-yellow-400 fill-yellow-400" />
            <span className="text-[13px] font-black text-[#111]">Rate App</span>
          </button>
        </div>

        {/* Logout */}
        <div className="text-center pt-4">
          <button 
            onClick={onLogout}
            className="text-red-500 font-black text-[14px] active:opacity-60 transition-opacity"
          >
            Log Out
          </button>
          <p className="text-[10px] font-bold text-gray-300 mt-2 uppercase tracking-widest">V2.2025.1</p>
        </div>
      </div>

      {/* Spin & Win Modal */}
      <AnimatePresence>
        {showSpin && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md z-[200] flex flex-col items-center justify-center p-6"
          >
            <button 
              onClick={() => setShowSpin(false)}
              className="absolute top-12 right-6 p-2 text-white/50 hover:text-white"
            >
              <X size={28} />
            </button>

            {/* The Wheel */}
            <div className="relative mb-12">
               <motion.div 
                animate={{ rotate: rotation }}
                transition={{ duration: 4, ease: "easeOut" }}
                className="w-80 h-80 rounded-full border-8 border-white/20 relative overflow-hidden shadow-2xl"
               >
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                    {wheelSegments.map((seg, i) => {
                      const angle = 360 / wheelSegments.length;
                      const startAngle = i * angle;
                      const endAngle = (i + 1) * angle;
                      const x1 = 50 + 50 * Math.cos((startAngle * Math.PI) / 180);
                      const y1 = 50 + 50 * Math.sin((startAngle * Math.PI) / 180);
                      const x2 = 50 + 50 * Math.cos((endAngle * Math.PI) / 180);
                      const y2 = 50 + 50 * Math.sin((endAngle * Math.PI) / 180);
                      
                      return (
                        <g key={i}>
                          <path 
                            d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`} 
                            fill={seg.color}
                          />
                        </g>
                      );
                    })}
                  </svg>
                  
                  {/* Wheel Labels - Placed on top of segments */}
                  <div className="absolute inset-0 pointer-events-none">
                    {wheelSegments.map((seg, i) => {
                      const angle = 360 / wheelSegments.length;
                      const midAngle = i * angle + angle / 2;
                      return (
                        <div 
                          key={i}
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ transform: `rotate(${midAngle}deg)` }}
                        >
                          <span 
                            className="absolute text-[8px] font-black text-white text-center leading-tight whitespace-nowrap"
                            style={{ transform: 'translateX(80px) rotate(90deg)', width: '60px' }}
                          >
                            {seg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
               </motion.div>
               
               {/* Center Play Button */}
               <button 
                onClick={handleSpin}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#FFB400] rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white font-black text-xs active:scale-90 transition-all z-20"
               >
                 Play
               </button>
               
               {/* Pointer */}
               <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-6 z-30">
                  <div className="w-full h-full bg-white shadow-lg rotate-45 transform origin-center"></div>
               </div>
            </div>

            {/* Rules Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/95 backdrop-blur-lg rounded-[2.5rem] p-8 w-full shadow-2xl"
            >
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="text-gray-900" size={20} />
                <h4 className="text-[17px] font-black text-[#111]">Spin & Win Rules</h4>
              </div>
              <ul className="space-y-3 text-[13px] font-bold text-gray-500">
                <li className="flex gap-2.5">
                  <span className="text-[#6338F9]">1.</span> 
                  <span>Earn JTokens and Data by spinning</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#6338F9]">2.</span> 
                  <span>You get 1 free spin daily</span>
                </li>
                <li className="flex gap-2.5">
                  <span className="text-[#6338F9]">3.</span> 
                  <span>You can earn more spins by making purchases</span>
                </li>
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default More;
