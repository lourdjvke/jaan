
import React from 'react';
import { JaanLogo, PhoneFrame, WaveBackground } from './Icons';

interface Props {
  onNext: () => void;
  onSkip: () => void;
}

const OnboardingOne: React.FC<Props> = ({ onNext, onSkip }) => {
  return (
    <div className="absolute inset-0 bg-white flex flex-col animate-in fade-in slide-in-from-right duration-500">
      {/* Header */}
      <div className="pt-10 pb-4 flex flex-col items-center z-30">
        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Welcome to</span>
        <div className="flex items-center gap-1.5">
          <JaanLogo className="w-5 h-5" color="#FFA500" />
          <span className="text-[#6338F9] font-black text-xl tracking-widest">JAAN</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center">
        <WaveBackground />
        
        <div className="relative z-10 w-full px-6 flex justify-center items-center">
          <div className="w-56 h-[400px] relative">
            <img 
              src="https://firebasestorage.googleapis.com/v0/b/octen-29d12.appspot.com/o/presentations%2FmzUgYypZ0JXaU4ldbXQHVUwg5vj1%2FRRpof%2F1767526979937_pana.png?alt=media&token=19bf3736-f44f-4058-8691-b6b56cb8adf8" 
              alt="Welcome VR Illustration" 
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </div>

          {/* Floating Elements based on image */}
          <div className="absolute inset-0 pointer-events-none scale-90">
             <div className="absolute top-1/4 left-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg animate-bounce duration-[2000ms]">
                <span className="text-xl">🎁</span>
             </div>
             <div className="absolute top-1/2 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 shadow-lg">
                <span className="text-xl">🌐</span>
             </div>
             <div className="absolute bottom-1/4 left-10 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 shadow-lg rotate-12">
                <span className="text-2xl">💻</span>
             </div>
             <div className="absolute top-1/3 left-1/4 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shadow-lg -rotate-12">
                <span className="text-xs">📞</span>
             </div>
             <div className="absolute top-1/4 right-1/4 w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shadow-lg rotate-45">
                <span className="text-xs">📡</span>
             </div>
          </div>
        </div>
      </div>

      {/* Text & Controls */}
      <div className="bg-white px-8 pb-12 pt-6 rounded-t-[40px] -mt-10 relative z-30">
        <div className="flex gap-1.5 mb-6 justify-start">
            <div className="w-8 h-1.5 bg-[#6338F9] rounded-full"></div>
            <div className="w-2.5 h-1.5 bg-gray-100 rounded-full"></div>
        </div>
        
        <h2 className="text-[26px] font-extrabold text-[#111] leading-tight mb-2">Welcome To JAAN</h2>
        <p className="text-[#777] text-[15px] font-medium leading-[1.6]">
          JAAN is your all-in-one digital hub for seamless payments and connections
        </p>

        <div className="flex items-center justify-between mt-12">
          <button 
            onClick={onSkip}
            className="text-[#6338F9] font-bold text-sm tracking-wide px-2 py-1"
          >
            skip
          </button>
          <button 
            onClick={onNext}
            className="bg-[#6338F9] text-white px-10 py-3.5 rounded-2xl font-bold shadow-xl shadow-purple-200 active:scale-95 transition-all text-sm"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOne;
