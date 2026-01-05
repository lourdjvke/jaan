
import React from 'react';

export const JaanLogo: React.FC<{ className?: string, color?: string }> = ({ className = "w-24 h-24", color = "#FFA500" }) => (
  <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path 
      d="M50 120C77.6142 120 100 97.6142 100 70C100 52.8224 91.3541 37.666 78.125 28.75C78.125 45 68.75 56.25 56.25 56.25C65.625 43.75 62.5 18.75 43.75 0C43.75 25 21.875 31.25 18.75 56.25C15.625 81.25 43.75 87.5 37.5 106.25C50 100 62.5 106.25 50 120Z" 
      fill={color}
    />
  </svg>
);

export const WaveBackground: React.FC = () => (
  <svg viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute inset-0 w-full h-full object-cover">
    <path 
      d="M0 400C120 450 240 450 360 400C480 350 600 350 720 400C840 450 960 450 1080 400C1200 350 1320 350 1440 400V600H0V400Z" 
      fill="#6338F9" 
    />
    <path 
      d="M0 350C120 400 240 400 360 350C480 300 600 300 720 350C840 400 960 400 1080 350C1200 300 1320 300 1440 350V400H0V350Z" 
      fill="#6338F9" 
      fillOpacity="0.5"
    />
  </svg>
);

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative w-56 h-[440px] bg-black rounded-[3.5rem] border-[8px] border-[#151515] shadow-2xl overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-b-2xl z-20"></div>
    <div className="w-full h-full bg-white relative">
      {children}
    </div>
  </div>
);
