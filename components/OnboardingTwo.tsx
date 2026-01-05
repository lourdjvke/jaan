
import React from 'react';
import { JaanLogo, PhoneFrame, WaveBackground } from './Icons';

interface Props {
  onGetStarted: () => void;
  onSkip: () => void;
}

const OnboardingTwo: React.FC<Props> = ({ onGetStarted, onSkip }) => {
  return (
    <div className="absolute inset-0 bg-white flex flex-col animate-in fade-in slide-in-from-right duration-500">
      <div className="pt-10 pb-4 flex flex-col items-center z-30">
        <div className="flex items-center gap-1.5">
          <JaanLogo className="w-5 h-5" color="#FFA500" />
          <span className="text-[#6338F9] font-black text-xl tracking-widest">JAAN</span>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <WaveBackground />
        
        <div className="relative z-10 w-full px-6 flex justify-center items-center">
          <PhoneFrame>
            <div className="p-4 bg-gray-50 h-full flex flex-col">
              <div className="flex justify-between items-center mb-6 pt-2">
                <div className="w-8 h-8 rounded-full bg-purple-100"></div>
                <div className="w-4 h-4 rounded-full bg-gray-200"></div>
              </div>
              <div className="mb-6">
                <p className="text-[10px] text-gray-400 font-bold uppercase">Main Balance</p>
                <h4 className="text-xl font-extrabold text-gray-900">$3,400.00</h4>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-100"></div>
                  </div>
                ))}
              </div>
              <div className="mt-auto bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-2">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-blue-50"></div>
                   <div className="flex-1 space-y-1">
                     <div className="h-2 w-2/3 bg-gray-100 rounded"></div>
                     <div className="h-1.5 w-1/3 bg-gray-50 rounded"></div>
                   </div>
                </div>
              </div>
            </div>
          </PhoneFrame>
          
          {/* Floating People/Logos */}
          <div className="absolute inset-0 pointer-events-none">
             <div className="absolute top-[10%] left-12 w-14 h-14 bg-white rounded-full p-1.5 shadow-2xl animate-pulse">
                <img src="https://i.pravatar.cc/150?u=1" className="w-full h-full rounded-full object-cover" alt="avatar" />
             </div>
             <div className="absolute top-[25%] right-6 w-16 h-16 bg-white rounded-full p-1.5 shadow-2xl">
                <img src="https://i.pravatar.cc/150?u=2" className="w-full h-full rounded-full object-cover" alt="avatar" />
             </div>
             <div className="absolute bottom-[20%] left-6 w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
             </div>
             <div className="absolute bottom-[15%] right-8 w-14 h-14 bg-black rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="text-white font-black text-[8px] tracking-tighter scale-150">NETFLIX</div>
             </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-8 pb-12 pt-6 rounded-t-[40px] -mt-10 relative z-30">
        <div className="flex gap-1.5 mb-6 justify-start">
            <div className="w-2.5 h-1.5 bg-gray-100 rounded-full"></div>
            <div className="w-8 h-1.5 bg-[#6338F9] rounded-full"></div>
        </div>
        
        <h2 className="text-[26px] font-extrabold text-[#111] leading-tight mb-2">Pay Bills Securely</h2>
        <p className="text-[#777] text-[15px] font-medium leading-[1.6]">
          Effortlessly pay your bills with secure and reliable transactions, say goodbye to long queues
        </p>

        <div className="flex items-center justify-between mt-12">
          <button 
            onClick={onSkip}
            className="text-[#6338F9] font-bold text-sm tracking-wide px-2 py-1"
          >
            skip
          </button>
          <button 
            onClick={onGetStarted}
            className="bg-[#6338F9] text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-purple-200 active:scale-95 transition-all text-sm"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTwo;
