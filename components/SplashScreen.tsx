
import React from 'react';
import { JaanLogo } from './Icons';

const SplashScreen: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-[#6338F9] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <JaanLogo className="w-24 h-24 mb-2" />
        <h1 className="text-white text-3xl font-extrabold tracking-[0.2em] ml-2">JAAN</h1>
      </div>
    </div>
  );
};

export default SplashScreen;
