
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, CheckCircle2, X, Check } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type TVStep = 'form' | 'confirm' | 'pin' | 'success';

interface TVPackage {
  id: string;
  name: string;
  channels: string;
  hdChannels: string;
  price: string;
}

const TV: React.FC<Props> = ({ onBack }) => {
  const [step, setStep] = useState<TVStep>('form');
  const [showProviderSelector, setShowProviderSelector] = useState(false);
  const [showPackageSelector, setShowPackageSelector] = useState(false);
  
  const [selectedProvider, setSelectedProvider] = useState({ 
    name: 'DStv', 
    logo: '/media/dstv.png' 
  });
  
  const [smartCardNumber, setSmartCardNumber] = useState('');
  const [selectedPackage, setSelectedPackage] = useState<TVPackage | null>(null);
  const [customerName, setCustomerName] = useState('');
  
  const providers = [
    { name: 'GOtv', logo: '/media/gotv.jpg' },
    { name: 'Showmax', logo: '/media/showmax.jpg' },
    { name: 'StarTimes', logo: '/media/startimes.png' },
    { name: 'DStv', logo: '/media/dstv.png' }
  ];

  const packages: TVPackage[] = [
    { id: '1', name: 'Premium', channels: '160+ Channels', hdChannels: '38 HD Channels', price: '29,500.00' },
    { id: '2', name: 'Compact Plus', channels: '145+ Channels', hdChannels: '30 HD Channels', price: '19,800.00' },
    { id: '3', name: 'Compact', channels: '130+ Channels', hdChannels: '20 HD Channels', price: '12,500.00' },
  ];

  const handleCardNumberChange = (val: string) => {
    setSmartCardNumber(val);
    if (val.length >= 10) {
      setCustomerName('SEDI RAHEEM');
    } else {
      setCustomerName('');
    }
  };

  const canContinue = smartCardNumber.length >= 10 && selectedPackage;

  const renderForm = () => (
    <div className="px-6 pt-6 relative h-full flex flex-col bg-white">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-[#111]" />
        </button>
        <h2 className="text-[16px] font-black text-[#111]">TV</h2>
        <div className="w-10" />
      </div>

      <div className="relative z-[100] mb-8">
        <button onClick={() => setShowProviderSelector(!showProviderSelector)} className="flex items-center gap-2 bg-transparent border border-gray-100 p-2 pr-3 rounded-2xl active:scale-95 transition-all w-fit">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex items-center justify-center border border-gray-50 p-1">
            <img src={selectedProvider.logo} className="w-full h-full object-contain" alt="provider" />
          </div>
          <span className="text-[12px] font-black text-[#111]">Change Service Provider</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        <AnimatePresence>
          {showProviderSelector && (
            <motion.div 
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-full left-0 mt-2 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 w-56 z-[110]"
            >
              {providers.map((p, i) => (
                <button 
                  key={i} 
                  onClick={() => { setSelectedProvider(p); setShowProviderSelector(false); }}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white border border-gray-100 p-1 flex items-center justify-center">
                    <img src={p.logo} className="w-full h-full object-contain" alt={p.name} />
                  </div>
                  <span className="text-[13px] font-black text-[#111]">{p.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-500 tracking-tight ml-1">Smart Card Number</label>
          <div className="bg-[#F8F9FB] rounded-2xl p-4 flex items-center justify-between border-2 border-transparent focus-within:border-[#6338F9] focus-within:bg-white transition-all h-[58px]">
            <input type="tel" placeholder="0000000000" value={smartCardNumber} onChange={(e) => handleCardNumberChange(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-bold text-[15px] text-[#111] placeholder:text-gray-200" />
            {customerName && (
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-gray-100">
                <span className="text-[10px] font-black text-[#111] uppercase whitespace-nowrap">{customerName}</span>
                <CheckCircle2 size={14} className="text-[#34C759]" />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-500 tracking-tight ml-1">Select Service Package</label>
          <div 
            onClick={() => setShowPackageSelector(true)}
            className="bg-[#F8F9FB] rounded-2xl p-4 flex items-center justify-between cursor-pointer h-[58px]"
          >
            <span className={`text-[15px] font-bold ${selectedPackage ? 'text-[#111]' : 'text-gray-300'}`}>
              {selectedPackage ? selectedPackage.name : 'Select Service Package'}
            </span>
            <ChevronDown size={20} className="text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-500 tracking-tight ml-1">Amount</label>
          <div className="bg-[#F8F9FB] rounded-2xl p-4 flex items-center h-[58px]">
            <span className="text-[15px] font-black text-gray-400 mr-2">₦</span>
            <input type="text" readOnly value={selectedPackage ? selectedPackage.price : '0.00'} className="flex-1 bg-transparent border-none outline-none font-black text-[15px] text-[#111]" />
          </div>
        </div>
      </div>

      <div className="pb-10">
        <button 
          onClick={() => canContinue && setStep('confirm')} 
          className={`w-full py-5 rounded-[2rem] font-black text-[16px] transition-all shadow-xl active:scale-[0.98] ${canContinue ? 'bg-[#6338F9] text-white shadow-purple-200' : 'bg-[#EBE4FF] text-[#6338F9]/40 cursor-not-allowed shadow-none'}`}
        >
          Continue
        </button>
      </div>

      {/* Package Selector Bottom Sheet */}
      <AnimatePresence>
        {showPackageSelector && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[200] flex flex-col justify-end" onClick={() => setShowPackageSelector(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[3.5rem] p-8 pb-12 shadow-2xl flex flex-col h-[70vh]" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-10 flex-shrink-0" />
              <h3 className="text-[18px] font-black text-[#111] mb-8">Service Packages</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
                {packages.map((pkg) => (
                  <button 
                    key={pkg.id}
                    onClick={() => { setSelectedPackage(pkg); setShowPackageSelector(false); }}
                    className={`w-full p-6 rounded-[2rem] text-left transition-all ${selectedPackage?.id === pkg.id ? 'bg-[#F2F3F5] border-2 border-transparent' : 'bg-transparent border-2 border-transparent hover:bg-gray-50'}`}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[15px] font-black text-[#111] mb-1">{pkg.name}</span>
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-bold text-gray-400">{pkg.channels}</p>
                        <p className="text-[12px] font-bold text-gray-400">{pkg.hdChannels}</p>
                      </div>
                      <span className="text-[15px] font-black text-[#111] mt-3 tracking-tight">₦{pkg.price}pm</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const renderConfirm = () => (
    <div className="px-6 pt-6 relative h-full flex flex-col bg-white">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setStep('form')} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-[#111]" />
        </button>
        <h2 className="text-[16px] font-black text-[#111]">TV</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 space-y-8">
        <div className="bg-[#F8F9FB] rounded-[2.5rem] p-8 shadow-sm space-y-7 border border-gray-100/50">
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">Service Provider</span>
            <div className="flex items-center gap-1.5">
              <img src={selectedProvider.logo} className="w-4 h-4 object-contain" alt="provider" />
              <span className="text-[14px] font-black text-[#111]">{selectedProvider.name}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">Service Package</span>
            <span className="text-[14px] font-black text-[#111]">{selectedPackage?.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">Amount</span>
            <span className="text-[14px] font-black text-[#111]">₦{selectedPackage?.price}</span>
          </div>
        </div>

        <div className="px-2 space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Debit Account</label>
          <p className="text-[15px] font-black text-[#111]">{customerName} - 9962802191</p>
        </div>

        <div className="px-2 space-y-2">
          <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Narration</label>
          <p className="text-[15px] font-black text-[#111]">DSTV Premium Subscription</p>
        </div>
      </div>

      <div className="pb-10">
        <button 
          onClick={() => setStep('pin')}
          className="w-full py-5 rounded-[2.5rem] bg-[#6338F9] text-white font-black text-[16px] shadow-xl shadow-purple-200 active:scale-[0.98] transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="absolute inset-0 bg-[#6338F9] z-[200] flex flex-col items-center justify-center text-center p-10">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-40 h-40 bg-[#34C759] rounded-full flex items-center justify-center mb-10 shadow-2xl relative">
        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-white rounded-full" />
        <CheckCircle2 size={72} className="text-white relative z-10" />
      </motion.div>
      <h2 className="text-[32px] font-black text-white mb-4">Successful!</h2>
      <p className="text-white/80 text-[16px] font-bold leading-relaxed max-w-[280px]">Your {selectedProvider.name} subscription was successful!</p>
      <button onClick={onBack} className="w-full bg-white text-[#6338F9] py-5 rounded-[2rem] font-black text-[15px] shadow-xl active:scale-95 transition-all mt-12 uppercase tracking-wide">Done</button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden h-full">
      <AnimatePresence mode="wait">
        {step === 'form' && <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">{renderForm()}</motion.div>}
        {step === 'confirm' && <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full">{renderConfirm()}</motion.div>}
        {step === 'pin' && <TransactionPinOverlay onComplete={() => setStep('success')} onBack={() => setStep('confirm')} />}
        {step === 'success' && <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full">{renderSuccess()}</motion.div>}
      </AnimatePresence>
    </div>
  );
};

// Simplified local PIN component matching TransactionPin.tsx style
const TransactionPinOverlay: React.FC<{ onComplete: () => void, onBack: () => void }> = ({ onComplete, onBack }) => {
  const [pin, setPin] = useState('');
  const handleKey = (val: string) => {
    if (pin.length < 4) {
      const nextPin = pin + val;
      setPin(nextPin);
      if (nextPin.length === 4) {
        setTimeout(onComplete, 300);
      }
    }
  };
  return (
    <div className="absolute inset-0 bg-[#F8F9FB] z-[300] flex flex-col pt-12">
      <div className="px-6 flex items-center justify-between mb-12">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100"><ChevronLeft size={24} className="text-[#111]" /></button>
        <h2 className="text-[16px] font-black text-[#111]">Enter PIN</h2>
        <div className="w-10" />
      </div>
      <div className="px-8 mb-12">
        <h3 className="text-[22px] font-black text-[#111] mb-2">Transaction PIN</h3>
        <p className="text-[13px] font-bold text-gray-400">Enter your 4 digit pin to confirm payment</p>
      </div>
      <div className="flex justify-center gap-5 mb-12">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-[#6338F9] border-[#6338F9] scale-110' : 'bg-transparent border-gray-200'}`} />
        ))}
      </div>
      <div className="mt-auto bg-white p-8 grid grid-cols-3 gap-6 rounded-t-[3rem] shadow-xl">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0].map((n, i) => (
          <button key={i} onClick={() => n !== '' && handleKey(n.toString())} className="h-12 flex items-center justify-center text-2xl font-black text-[#111] active:scale-90 transition-all">{n}</button>
        ))}
        <button onClick={() => setPin(pin.slice(0, -1))} className="h-12 flex items-center justify-center text-[#111] active:scale-90 transition-all font-black text-xl">DEL</button>
      </div>
    </div>
  );
};

export default TV;
