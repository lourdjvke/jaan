
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, CheckCircle2, Copy, Check, X, Delete } from 'lucide-react';

interface Props {
  onBack: () => void;
  onContinue: (details: any) => void;
}

type ElectricityStep = 'form' | 'confirm' | 'pin' | 'success';

const Electricity: React.FC<Props> = ({ onBack, onContinue }) => {
  const [step, setStep] = useState<ElectricityStep>('form');
  const [tab, setTab] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [showProviderSelector, setShowProviderSelector] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState({ 
    name: 'BEDC', 
    fullName: 'Benin Electricity Distribution Company', 
    logo: '/media/bedc.jpg' 
  });
  
  const [meterNumber, setMeterNumber] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);

  const DEMO_PIN = '9885';

  const providers = [
    { name: 'AEDC', fullName: 'Abuja Electricity Distribution Company', logo: '/media/aedc.png' },
    { name: 'BEDC', fullName: 'Benin Electricity Distribution Company', logo: '/media/bedc.jpg' },
    { name: 'EEDC', fullName: 'Enugu Electricity Distribution Company', logo: '/media/eedc.jpg' },
    { name: 'EKEDC', fullName: 'Eko Electricity Distribution PLC Nigeria', logo: '/media/ekedc.png' },
    { name: 'IBEDC', fullName: 'Ibadan Electricity Distribution Company', logo: '/media/ibedc.png' },
    { name: 'IKEDC', fullName: 'Ikeja Electricity Distribution Company', logo: '/media/ikedc.png' },
    { name: 'JED Plc', fullName: 'Jos Electricity Distribution', logo: '/media/jedplc.jpg' },
    { name: 'Kaduna Electric', fullName: 'Kaduna Electricity Distribution Company', logo: '/media/kaduna_electric.jpg' },
    { name: 'KEDCO', fullName: 'Kano Electricity Distribution Company', logo: '/media/kedco.png' },
    { name: 'PHED', fullName: 'Port Harcourt Electricity Distribution Company', logo: '/media/phed.png' },
    { name: 'YEDC', fullName: 'Yola Electricity Distribution Company', logo: '/media/yedc.jpg' },
  ];

  const presets = ['₦500.00', '₦1,000.00', '₦2,000.00', '₦3,000.00', '₦5,000.00', '₦10k'];

  const handleMeterNumberChange = (val: string) => {
    setMeterNumber(val);
    if (val.length === 11) {
      setIsVerifying(true);
      setTimeout(() => {
        setCustomerName('SEDI RAHEEM');
        setIsVerifying(false);
      }, 1000);
    } else {
      setCustomerName('');
    }
  };

  const handleAmountClick = (val: string) => {
    const num = val.replace('₦', '').replace(',', '').replace('.00', '').replace('k', '000');
    setAmount(num);
  };

  const handlePinInput = (val: string) => {
    if (pin.length < 4) {
      const newPin = pin + val;
      setPin(newPin);
    }
  };

  const handleContinueToSuccess = () => {
    if (pin === DEMO_PIN) {
      setStep('success');
    } else {
      setShake(true);
      setTimeout(() => {
        setShake(false);
        setPin('');
      }, 500);
    }
  };

  const handleDeletePin = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const canContinueForm = meterNumber.length >= 10 && customerPhone.length >= 10 && amount && customerName;

  const renderForm = () => (
    <div className="px-6 pt-6 relative h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-[#111]" />
        </button>
        <h2 className="text-[16px] font-black text-[#111]">Electricity</h2>
        <div className="w-10" />
      </div>

      <div className="bg-[#F2F3F5] p-1.5 rounded-2xl flex items-center mb-8 border border-gray-100/50">
        <button onClick={() => setTab('prepaid')} className={`flex-1 py-3 rounded-xl text-[13px] font-black transition-all duration-300 ${tab === 'prepaid' ? 'bg-[#6338F9] text-white shadow-lg' : 'text-gray-400'}`}>Prepaid</button>
        <button onClick={() => setTab('postpaid')} className={`flex-1 py-3 rounded-xl text-[13px] font-black transition-all duration-300 ${tab === 'postpaid' ? 'bg-[#6338F9] text-white shadow-lg' : 'text-gray-400'}`}>Postpaid</button>
      </div>

      <button onClick={() => setShowProviderSelector(true)} className="flex items-center gap-2 mb-8 bg-transparent border border-gray-100/30 p-2 pr-3 rounded-2xl active:scale-95 transition-all w-fit">
        <div className="w-8 h-8 rounded-lg overflow-hidden bg-white flex items-center justify-center border border-gray-50 p-1">
          <img src={selectedProvider.logo} className="w-full h-full object-contain" alt="provider" />
        </div>
        <span className="text-[12px] font-black text-[#111]">Change Service Provider</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-10">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#111] tracking-tight ml-1">Meter Number</label>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm focus-within:border-[#6338F9] transition-all min-h-[58px]">
            <input type="tel" placeholder="0000000000" value={meterNumber} onChange={(e) => handleMeterNumberChange(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-bold text-[15px] text-[#111] placeholder:text-gray-200" />
            {customerName && (
              <div className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                <span className="text-[10px] font-black text-[#111] uppercase whitespace-nowrap">{customerName}</span>
                <CheckCircle2 size={12} className="text-[#34C759]" />
              </div>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#111] tracking-tight ml-1">Customer Phone Number</label>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center shadow-sm focus-within:border-[#6338F9] transition-all">
            <input type="tel" placeholder="08123456789" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-bold text-[15px] text-[#111] placeholder:text-gray-200" />
          </div>
        </div>
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
      </div>
      <button onClick={() => canContinueForm && setStep('confirm')} className={`w-full py-5 rounded-[2.5rem] font-black text-[16px] mb-8 transition-all shadow-xl active:scale-[0.98] ${canContinueForm ? 'bg-[#6338F9] text-white shadow-purple-200' : 'bg-purple-100 text-white cursor-not-allowed shadow-none opacity-50'}`}>Continue</button>
    </div>
  );

  const renderConfirm = () => (
    <div className="px-6 pt-6 relative h-full flex flex-col bg-[#F8F9FB]">
      <div className="flex items-center justify-between mb-8">
        <button onClick={() => setStep('form')} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-[#111]" />
        </button>
        <h2 className="text-[16px] font-black text-[#111]">Electricity</h2>
        <div className="w-10" />
      </div>

      <div className="flex-1 space-y-8">
        <div className="bg-white rounded-[2rem] p-8 shadow-sm space-y-6">
          <div className="flex justify-between items-center"><span className="text-[12px] font-bold text-gray-400">Service Provider</span><span className="text-[14px] font-black text-[#111]">{selectedProvider.name}</span></div>
          <div className="flex justify-between items-center"><span className="text-[12px] font-bold text-gray-400">Meter Number</span><span className="text-[14px] font-black text-[#111]">{meterNumber}</span></div>
          <div className="flex justify-between items-center"><span className="text-[12px] font-bold text-gray-400">Amount</span><span className="text-[14px] font-black text-[#111]">₦{amount}</span></div>
        </div>

        <div className="space-y-1">
          <label className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">Debit Account</label>
          <p className="text-[15px] font-black text-[#111]">{customerName} - 9962802191</p>
        </div>

        <div className="space-y-1">
          <label className="text-[12px] font-bold text-gray-400 uppercase tracking-tight">Narration</label>
          <div className="flex items-center gap-1.5 font-black text-[#111] text-[15px]">
            Electricity ⚡ {tab === 'prepaid' ? 'Prepaid' : 'Postpaid'}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center py-10">
          <button 
            onClick={() => setStep('pin')}
            className="w-20 h-20 bg-[#6338F9] rounded-full flex items-center justify-center text-white shadow-2xl shadow-purple-300 active:scale-90 transition-all mb-4"
          >
            <Check size={40} strokeWidth={3} />
          </button>
          <span className="text-[#6338F9] font-black text-[13px]">Tap to Confirm</span>
        </div>
      </div>
    </div>
  );

  const renderPin = () => (
    <div className="absolute inset-0 bg-[#F8F9FB] z-[150] flex flex-col pt-12">
      <div className="px-6 flex items-center justify-between mb-12">
        <button onClick={() => setStep('confirm')} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-[#111]" />
        </button>
        <h2 className="text-[16px] font-black text-[#111]">Electricity</h2>
        <div className="w-10" />
      </div>
      
      <div className="px-8 space-y-2 mb-12">
        <h3 className="text-[22px] font-black text-[#111]">Enter 4 Digit Pin</h3>
        <p className="text-[13px] font-bold text-gray-400">Enter your four digit pin or use biometrics to confirm purchase</p>
      </div>

      <motion.div 
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        className="flex justify-center gap-5 mb-12"
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-[#6338F9] border-[#6338F9] scale-110' : 'bg-transparent border-gray-200'}`} />
        ))}
      </motion.div>

      <div className="mt-auto bg-transparent p-8 grid grid-cols-3 gap-y-8 gap-x-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} onClick={() => handlePinInput(n.toString())} className="h-16 flex items-center justify-center text-[28px] font-black text-[#6338F9] active:scale-90 transition-all">{n}</button>
        ))}
        <button onClick={handleDeletePin} className="h-16 flex items-center justify-center text-red-500 active:scale-90 transition-all"><X size={32} /></button>
        <button onClick={() => handlePinInput('0')} className="h-16 flex items-center justify-center text-[28px] font-black text-[#6338F9] active:scale-90 transition-all">0</button>
        <button onClick={handleContinueToSuccess} className="h-16 flex items-center justify-center text-[#6338F9] active:scale-90 transition-all">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 4C9.38281 4 4 9.38281 4 16C4 22.6172 9.38281 28 16 28C22.6172 28 28 22.6172 28 16C28 9.38281 22.6172 4 16 4ZM16 6C21.5352 6 26 10.4648 26 16C26 21.5352 21.5352 26 16 26C10.4648 26 6 21.5352 6 16C6 10.4648 10.4648 6 16 6ZM14.2812 11.2812L13.2188 12.3438L16.875 16L13.2188 19.6562L14.2812 20.7188L18.4688 16.5312C18.7578 16.2422 18.7578 15.7578 18.4688 15.4688L14.2812 11.2812Z" fill="currentColor"/></svg>
        </button>
      </div>

      <div className="text-center pb-8">
        <button className="text-[14px] font-black text-[#FF4B4B] active:opacity-60 transition-opacity">Forgot Pin?</button>
      </div>

      <div className="px-8 pb-10">
        <button 
          onClick={handleContinueToSuccess}
          className={`w-full py-5 rounded-[2rem] font-black text-[15px] transition-all ${pin.length === 4 ? 'bg-[#6338F9] text-white shadow-xl' : 'bg-purple-100 text-white cursor-not-allowed'}`}
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
      <h2 className="text-[32px] font-black text-white mb-4">Success!</h2>
      <p className="text-white/80 text-[16px] font-bold leading-relaxed max-w-[280px]">Your Utility Bill of ₦{amount} was successful!</p>
      
      {tab === 'prepaid' && (
        <div className="mt-8 mb-12 w-full">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between">
            <div className="text-left">
              <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">Token Number</p>
              <p className="text-[14px] font-black text-white tracking-widest">9833-2213-6788-3245-9901</p>
            </div>
            <button className="p-2 text-white/50 hover:text-white transition-colors">
              <Copy size={20} />
            </button>
          </div>
        </div>
      )}

      <button onClick={onBack} className="w-full bg-white text-[#6338F9] py-5 rounded-[2rem] font-black text-[15px] shadow-xl active:scale-95 transition-all mt-8">Done</button>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FB] overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'form' && <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col">{renderForm()}</motion.div>}
        {step === 'confirm' && <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="h-full flex flex-col">{renderConfirm()}</motion.div>}
        {step === 'pin' && <motion.div key="pin" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="h-full flex flex-col">{renderPin()}</motion.div>}
        {step === 'success' && <motion.div key="success" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="h-full flex flex-col">{renderSuccess()}</motion.div>}
      </AnimatePresence>

      <AnimatePresence>
        {showProviderSelector && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[300] flex flex-col justify-end" onClick={() => setShowProviderSelector(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[3rem] p-6 pb-12 shadow-2xl flex flex-col h-[75vh]" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-6 flex-shrink-0" />
              <h3 className="text-[18px] font-black text-[#111] mb-6 px-2">Select Service Provider</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 px-2">
                {providers.map((prov, i) => (
                  <button key={i} onClick={() => { setSelectedProvider(prov); setShowProviderSelector(false); }} className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${selectedProvider.name === prov.name ? 'bg-purple-50 border-purple-100' : 'bg-transparent border-transparent hover:bg-gray-50'}`}>
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-1.5 bg-white"><img src={prov.logo} className="w-full h-full object-contain" alt={prov.name} /></div>
                    <div className="flex flex-col text-left"><span className={`text-[14px] font-black uppercase tracking-tight ${selectedProvider.name === prov.name ? 'text-[#6338F9]' : 'text-gray-800'}`}>{prov.name}</span><span className="text-[10px] font-bold text-gray-400 line-clamp-1">{prov.fullName}</span></div>
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

export default Electricity;
