
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, UserSquare2, CheckCircle2, X, Delete } from 'lucide-react';

interface Props {
  onBack: () => void;
}

type AirtimeStep = 'form' | 'confirm' | 'pin' | 'success';

interface DataPlan {
  id: string;
  name: string;
  duration: string;
  price: string;
}

const Airtime: React.FC<Props> = ({ onBack }) => {
  const [step, setStep] = useState<AirtimeStep>('form');
  const [tab, setTab] = useState<'airtime' | 'data'>('airtime');
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [showDataPlanSelector, setShowDataPlanSelector] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState({ name: 'MTN', logo: '/media/mtn.png' });
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDataPlan, setSelectedDataPlan] = useState<DataPlan | null>(null);
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);

  const DEMO_PIN = '9885';

  const networks = [
    { name: '9mobile', logo: '/media/9mobile.png' },
    { name: 'GLO', logo: '/media/glo.jpg' },
    { name: 'MTN', logo: '/media/mtn.png' },
    { name: 'Airtel', logo: '/media/airtel.png' },
  ];

  const dataPlans: DataPlan[] = [
    { id: '1', name: '100MB', duration: '1 Day', price: '100.00' },
    { id: '2', name: '200MB', duration: '2 Days', price: '200.00' },
    { id: '3', name: '300MB', duration: '2 Days', price: '300.00' },
    { id: '4', name: '300MB', duration: '7 Days', price: '300.00' },
    { id: '5', name: '500MB', duration: '7 Days', price: '500.00' },
    { id: '6', name: '1GB', duration: '30 Days', price: '1,000.00' },
  ];

  const presets = ['₦500.00', '₦1,000.00', '₦2,000.00', '₦3,000.00', '₦5,000.00', '₦10k'];

  const handleAmountClick = (val: string) => {
    const num = val.replace('₦', '').replace(',', '').replace('.00', '').replace('k', '000');
    setAmount(num);
  };

  const handlePinInput = (val: string) => {
    if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);
      if (newPin.length === 4) {
        if (newPin === DEMO_PIN) {
          setTimeout(() => setStep('success'), 300);
        } else {
          setShake(true);
          setTimeout(() => {
            setShake(false);
            setPin('');
          }, 500);
        }
      }
    }
  };

  const handleDeletePin = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const canContinue = phone && (tab === 'airtime' ? amount : selectedDataPlan);

  const renderForm = () => (
    <div className="px-6 pt-6 relative h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-[#111]" />
        </button>
        <h2 className="text-[16px] font-black text-[#111]">Airtime & Data</h2>
        <div className="w-10" />
      </div>

      <div className="bg-[#F2F3F5] p-1.5 rounded-2xl flex items-center mb-8 border border-gray-100/50">
        <button 
          onClick={() => { setTab('airtime'); setSelectedDataPlan(null); }} 
          className={`flex-1 py-3 rounded-xl text-[13px] font-black transition-all duration-300 ${tab === 'airtime' ? 'bg-[#6338F9] text-white shadow-lg' : 'text-gray-400'}`}
        >
          Airtime
        </button>
        <button 
          onClick={() => { setTab('data'); setAmount(''); }} 
          className={`flex-1 py-3 rounded-xl text-[13px] font-black transition-all duration-300 ${tab === 'data' ? 'bg-[#6338F9] text-white shadow-lg' : 'text-gray-400'}`}
        >
          Data
        </button>
      </div>

      <button onClick={() => setShowNetworkSelector(true)} className="flex items-center gap-2 mb-8 bg-transparent border border-gray-100/30 p-2 pr-3 rounded-2xl active:scale-95 transition-all w-fit">
        <div className="w-6 h-6 rounded-md overflow-hidden bg-white flex items-center justify-center border border-gray-50">
          <img src={selectedNetwork.logo} className="w-full h-full object-contain" alt="network" />
        </div>
        <span className="text-[12px] font-black text-[#111]">Change Network</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#111] tracking-tight ml-1">Phone Number</label>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm focus-within:border-[#6338F9] transition-all">
            <input type="tel" placeholder="0801 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-bold text-[15px] text-[#111] placeholder:text-gray-200" />
            <button className="bg-[#F2F3F5] px-3 py-2 rounded-xl text-[#6338F9] flex items-center gap-1.5 active:scale-90 transition-all">
              <UserSquare2 size={16} />
              <span className="text-[10px] font-black">Contact</span>
            </button>
          </div>
        </div>

        {tab === 'airtime' ? (
          <div className="space-y-2">
            <label className="text-[11px] font-black text-[#111] tracking-tight ml-1">Amount</label>
            <div className="bg-transparent border-b-2 border-gray-200 p-1 flex items-center gap-2 mb-4">
              <span className="text-[18px] font-black text-gray-900 leading-none">₦</span>
              <input type="text" placeholder="100.00-500,000.00" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-black text-[18px] text-[#111] placeholder:text-gray-200" />
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
              {presets.map((amt, i) => (
                <button key={i} onClick={() => handleAmountClick(amt)} className="whitespace-nowrap px-4 py-2 rounded-full bg-white border border-gray-100 text-[11px] font-black text-gray-400 active:bg-[#6338F9] active:text-white transition-all shadow-sm">{amt}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-[11px] font-black text-[#111] tracking-tight ml-1">Data Plan</label>
            <div 
              onClick={() => setShowDataPlanSelector(true)}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer active:bg-gray-50 transition-all"
            >
              <div className="flex flex-col">
                <span className={`text-[15px] font-bold ${selectedDataPlan ? 'text-[#111]' : 'text-gray-300'}`}>
                  {selectedDataPlan ? `${selectedDataPlan.name} (${selectedDataPlan.duration})` : 'Select Data Plan'}
                </span>
                {selectedDataPlan && (
                  <span className="text-[10px] text-gray-400 font-bold uppercase">Data Amount: ₦{selectedDataPlan.price}</span>
                )}
              </div>
              <ChevronDown size={20} className="text-gray-400" />
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={() => canContinue && setStep('confirm')} 
        className={`w-full py-5 rounded-[2.5rem] font-black text-[16px] mt-12 transition-all shadow-xl active:scale-[0.98] ${canContinue ? 'bg-[#6338F9] text-white shadow-purple-200' : 'bg-purple-100 text-white cursor-not-allowed shadow-none opacity-50'}`}
      >
        Continue
      </button>
    </div>
  );

  const renderPin = () => (
    <div className="absolute inset-0 bg-[#F8F9FB] z-[120] flex flex-col pt-12">
      <div className="px-6 flex items-center justify-between mb-12">
        <button onClick={() => setStep('form')} className="p-2 -ml-2 rounded-full active:bg-gray-100"><ChevronLeft size={24} className="text-[#111]" /></button>
        <h2 className="text-[16px] font-black text-[#111]">Airtime & Data</h2>
        <div className="w-10" />
      </div>
      
      <div className="px-8 space-y-2 mb-12">
        <h3 className="text-[22px] font-black text-[#111]">Enter 4 Digit Pin</h3>
        <p className="text-[13px] font-bold text-gray-400">Enter your four digit pin to confirm purchase</p>
      </div>

      <motion.div 
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        className="flex justify-center gap-5 mb-8"
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-[#6338F9] border-[#6338F9] scale-110 shadow-lg' : 'bg-white border-gray-200'}`} />
        ))}
      </motion.div>

      <div className="text-center">
        <button className="text-[14px] font-black text-[#FF4B4B] active:opacity-60 transition-opacity">Forgot Pin?</button>
      </div>

      <div className="mt-auto bg-white p-4 grid grid-cols-3 gap-3 rounded-t-[3rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} onClick={() => handlePinInput(n.toString())} className="h-16 rounded-2xl flex items-center justify-center text-[22px] font-black text-[#111] active:bg-gray-100 transition-colors">{n}</button>
        ))}
        <button className="h-16 flex items-center justify-center text-gray-400"></button>
        <button onClick={() => handlePinInput('0')} className="h-16 rounded-2xl flex items-center justify-center text-[22px] font-black text-[#111] active:bg-gray-100 transition-colors">0</button>
        <div className="grid grid-cols-2 h-16 rounded-2xl overflow-hidden shadow-sm border border-gray-50">
           <button onClick={handleDeletePin} className="h-full bg-gray-50 flex items-center justify-center text-gray-400 active:bg-gray-100"><Delete size={20} /></button>
           <button onClick={() => pin.length === 4 && handlePinInput('')} className="h-full bg-[#6338F9] flex items-center justify-center text-white active:bg-purple-700 transition-colors">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L10.59 5.41L16.17 11H4V13H16.17L10.59 18.59L12 20L20 12L12 4Z" fill="currentColor"/></svg>
           </button>
        </div>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="absolute inset-0 bg-[#6338F9] z-[130] flex flex-col items-center justify-center text-center p-10">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-40 h-40 bg-[#34C759] rounded-full flex items-center justify-center mb-10 shadow-2xl relative">
        <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-white rounded-full" />
        <CheckCircle2 size={72} className="text-white relative z-10" />
      </motion.div>
      <h2 className="text-[32px] font-black text-white mb-4">Success!</h2>
      <p className="text-white/80 text-[16px] font-bold leading-relaxed max-w-[250px]">
        {tab === 'airtime' ? 'Airtime' : 'Data'} top-up complete! Enjoy your {tab === 'airtime' ? `₦${amount} airtime` : `${selectedDataPlan?.name} data`}.
      </p>
      <button onClick={onBack} className="absolute bottom-12 left-8 right-8 bg-white text-[#6338F9] py-5 rounded-[2rem] font-black text-[15px] shadow-xl active:scale-95 transition-all">Done</button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FB] overflow-hidden">
      {renderForm()}

      {/* Confirmation Bottom Sheet */}
      <AnimatePresence>
        {step === 'confirm' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[250] flex flex-col justify-end" onClick={() => setStep('form')}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl space-y-8" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-2" />
              <h3 className="text-[18px] font-black text-[#111]">Confirm Transaction</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-gray-400 uppercase tracking-tighter">Amount</span>
                  <span className="text-[15px] font-black text-[#111]">₦{tab === 'airtime' ? amount : selectedDataPlan?.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-gray-400 uppercase tracking-tighter">Phone Number</span>
                  <span className="text-[15px] font-black text-[#111]">{phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold text-gray-400 uppercase tracking-tighter">Mobile Network</span>
                  <span className="text-[15px] font-black text-[#111]">{selectedNetwork.name}</span>
                </div>
                {tab === 'data' && (
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-bold text-gray-400 uppercase tracking-tighter">Plan</span>
                    <span className="text-[15px] font-black text-[#111]">{selectedDataPlan?.name} ({selectedDataPlan?.duration})</span>
                  </div>
                )}
              </div>
              <button onClick={() => setStep('pin')} className="w-full bg-[#6338F9] text-white py-5 rounded-[2.5rem] font-black text-[16px] shadow-xl active:scale-95 transition-all">Continue</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{step === 'pin' && renderPin()}</AnimatePresence>
      <AnimatePresence>{step === 'success' && renderSuccess()}</AnimatePresence>

      {/* Network Selector Overlay */}
      <AnimatePresence>
        {showNetworkSelector && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-8" onClick={() => setShowNetworkSelector(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white rounded-[2.5rem] p-4 w-64 shadow-2xl space-y-2" onClick={e => e.stopPropagation()}>
              <div className="px-4 py-2 border-b border-gray-50 mb-2"><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Select Network</span></div>
              {networks.map((net, i) => (
                <button key={i} onClick={() => { setSelectedNetwork(net); setShowNetworkSelector(false); }} className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all ${selectedNetwork.name === net.name ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                  <div className="w-9 h-9 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-1.5 bg-white"><img src={net.logo} className="w-full h-full object-contain" alt={net.name} /></div>
                  <span className={`text-[14px] font-black uppercase tracking-tight ${selectedNetwork.name === net.name ? 'text-[#6338F9]' : 'text-gray-600'}`}>{net.name}</span>
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Data Plan Selector Overlay */}
      <AnimatePresence>
        {showDataPlanSelector && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[200] flex flex-col justify-end" 
            onClick={() => setShowDataPlanSelector(false)}
          >
            <motion.div 
              initial={{ y: '100%' }} 
              animate={{ y: 0 }} 
              exit={{ y: '100%' }} 
              className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl flex flex-col h-[60vh]" 
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-6 flex-shrink-0" />
              <h3 className="text-[18px] font-black text-[#111] mb-6">Select Data Plan</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                {dataPlans.map((plan) => (
                  <button 
                    key={plan.id}
                    onClick={() => { setSelectedDataPlan(plan); setShowDataPlanSelector(false); }}
                    className={`w-full p-6 rounded-3xl text-left transition-all border ${selectedDataPlan?.id === plan.id ? 'bg-gray-100 border-[#6338F9]' : 'bg-transparent border-transparent hover:bg-gray-50'}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-[15px] font-black text-[#111]">{plan.name} ({plan.duration})</span>
                      <span className="text-[13px] font-bold text-gray-400">₦{plan.price}</span>
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
};

export default Airtime;
