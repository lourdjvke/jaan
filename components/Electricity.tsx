
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, CheckCircle2, X, Delete, Loader2, Lightbulb, AlertCircle, Clock } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { ref, onValue, update, push } from 'firebase/database';
import SplashScreen from './SplashScreen';

interface Props {
  onBack: () => void;
  showToast?: (msg: string) => void;
}

type ElectricityStep = 'form' | 'confirm' | 'pin' | 'processing' | 'result';
type TransactionStatus = 'success' | 'failed' | 'pending' | 'service-down';

const WORKER_URL = "https://shy-shadow-e3f8.codalchemy.workers.dev/";

const DISCOS = [
  { id: 'abuja-electric', name: 'AEDC', fullName: 'Abuja Electricity Distribution Company', logo: 'media/aedc.png' },
  { id: 'benin-electric', name: 'BEDC', fullName: 'Benin Electricity Distribution Company', logo: 'media/bedc.jpg' },
  { id: 'enugu-electric', name: 'EEDC', fullName: 'Enugu Electricity Distribution Company', logo: 'media/eedc.jpg' },
  { id: 'eko-electric', name: 'EKEDC', fullName: 'Eko Electricity Distribution PLC Nigeria', logo: 'media/ekedc.png' },
  { id: 'ibadan-electric', name: 'IBEDC', fullName: 'Ibadan Electricity Distribution Company', logo: 'media/ibedc.png' },
  { id: 'ikeja-electric', name: 'IKEDC', fullName: 'Ikeja Electricity Distribution Company', logo: 'media/ikedc.png' },
  { id: 'jos-electric', name: 'JED Plc', fullName: 'Jos Electricity Distribution', logo: 'media/jedplc.jpg' },
  { id: 'kaduna-electric', name: 'Kaduna Electric', fullName: 'Kaduna Electricity Distribution Company', logo: 'media/kaduna_electric.jpg' },
  { id: 'kano-electric', name: 'KEDCO', fullName: 'Kano Electricity Distribution Company', logo: 'media/kedco.png' },
  { id: 'portharcourt-electric', name: 'PHED', fullName: 'Port Harcourt Electricity Distribution Company', logo: 'media/phed.png' },
  { id: 'yola-electric', name: 'YEDC', fullName: 'Yola Electricity Distribution Company', logo: 'media/yedc.jpg' },
];

const Electricity: React.FC<Props> = ({ onBack, showToast }) => {
  const [step, setStep] = useState<ElectricityStep>('form');
  const [tab, setTab] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [showProviderSelector, setShowProviderSelector] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(DISCOS[1]); // Default BEDC
  const [meterNumber, setMeterNumber] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [pin, setPin] = useState('');
  const [userBalance, setUserBalance] = useState<number>(0);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('success');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;
    const balanceRef = ref(db, `users/${auth.currentUser.uid}/balance`);
    return onValue(balanceRef, (snapshot) => setUserBalance(snapshot.val() || 0));
  }, []);

  useEffect(() => {
    if (meterNumber.length >= 10) {
      const timer = setTimeout(() => verifyMeter(), 500);
      return () => clearTimeout(timer);
    } else {
      setCustomerName('');
      setCustomerAddress('');
    }
  }, [meterNumber, selectedProvider, tab]);

  const verifyMeter = async () => {
    setVerifying(true);
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          route: "VERIFY_MERCHANT", 
          payload: { serviceID: selectedProvider.id, billersCode: meterNumber, type: tab } 
        })
      });
      const data = await res.json();
      if (data.content?.Customer_Name) {
        setCustomerName(data.content.Customer_Name);
        setCustomerAddress(data.content.Address || '');
      } else {
        setCustomerName('');
        setCustomerAddress('');
      }
    } catch (e) {
      console.error("Verification error", e);
    } finally {
      setVerifying(false);
    }
  };

  const handlePurchase = async () => {
    if (!auth.currentUser) return;
    const purchaseAmount = parseFloat(amount);

    if (userBalance < purchaseAmount) {
      const historyRef = ref(db, `users/${auth.currentUser.uid}/transactions`);
      await push(historyRef, {
        type: 'electricity',
        title: `Declined: ${selectedProvider.name} ${tab.toUpperCase()}`,
        amount: -purchaseAmount,
        date: new Date().toISOString(),
        status: 'failed',
        reason: 'Insufficient funds'
      });
      showToast?.("Insufficient fund. Please top up your wallet.");
      return;
    }

    const userRef = ref(db, `users/${auth.currentUser.uid}/transactionPin`);
    onValue(userRef, async (snapshot) => {
      if (pin !== snapshot.val()) {
        setPin('');
        return;
      }
      setStep('processing');
      const requestId = Date.now().toString();
      const payload = {
        route: "PAY_VAS",
        payload: {
          request_id: requestId,
          serviceID: selectedProvider.id,
          billersCode: meterNumber,
          variation_code: tab,
          amount: purchaseAmount,
          phone: customerPhone || meterNumber
        }
      };

      try {
        const response = await fetch(WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (result.code === '000') {
          await update(ref(db, `users/${auth.currentUser.uid}`), { balance: userBalance - purchaseAmount });
          const historyRef = ref(db, `users/${auth.currentUser.uid}/transactions`);
          await push(historyRef, {
            type: 'electricity',
            title: `${selectedProvider.name} ${tab.toUpperCase()}`,
            amount: -purchaseAmount,
            date: new Date().toISOString(),
            status: 'success'
          });
          setTransactionStatus('success');
        } else if (result.code === '099') {
          setTransactionStatus('pending');
          const historyRef = ref(db, `users/${auth.currentUser.uid}/transactions`);
          await push(historyRef, {
            type: 'electricity',
            title: `${selectedProvider.name} ${tab.toUpperCase()}`,
            amount: -purchaseAmount,
            date: new Date().toISOString(),
            status: 'pending'
          });
        } else {
          const historyRef = ref(db, `users/${auth.currentUser.uid}/transactions`);
          await push(historyRef, {
            type: 'electricity',
            title: `Failed: ${selectedProvider.name} ${tab.toUpperCase()}`,
            amount: -purchaseAmount,
            date: new Date().toISOString(),
            status: 'failed',
            reason: result.response_description
          });
          setTransactionStatus(result.response_description?.toLowerCase().includes('service') ? 'service-down' : 'failed');
          setErrorMessage(result.response_description || 'Transaction failed.');
        }
      } catch {
        setTransactionStatus('service-down');
      } finally {
        setStep('result');
      }
    }, { onlyOnce: true });
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);

  const canContinue = meterNumber.length >= 10 && amount && customerName && customerPhone.length >= 10;

  const renderForm = () => (
    <div className="px-6 pt-6 flex flex-col h-full bg-white">
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

      <button onClick={() => setShowProviderSelector(true)} className="flex items-center gap-3 mb-8 bg-white border border-gray-100 p-2.5 pr-5 rounded-2xl active:scale-95 transition-all w-fit shadow-sm">
        <div className="w-7 h-7 rounded-lg overflow-hidden border border-gray-50 p-1 flex items-center justify-center bg-white shadow-sm">
          <img src={selectedProvider.logo} className="w-full h-full object-contain" alt="provider" />
        </div>
        <span className="text-[13px] font-black text-[#111] uppercase tracking-tight">{selectedProvider.name}</span>
        <ChevronDown size={14} className="text-gray-900" />
      </button>

      <div className="space-y-6 overflow-y-auto no-scrollbar pb-10">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#111] uppercase opacity-60 ml-1">Meter Number</label>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 shadow-sm focus-within:border-[#6338F9] transition-all min-h-[58px]">
            <div className="flex items-center justify-between">
               <input 
                type="tel" 
                placeholder="0000 000 0000" 
                value={meterNumber} 
                onChange={(e) => setMeterNumber(e.target.value)} 
                className="flex-1 bg-transparent border-none outline-none font-bold text-[15px] text-[#111] placeholder:text-gray-300" 
              />
              {verifying && <Loader2 size={16} className="animate-spin text-[#6338F9]" />}
            </div>
            {customerName && (
              <div className="pt-2 border-t border-gray-50">
                <div className="bg-green-50 px-3 py-2 rounded-xl flex items-center gap-2 border border-green-100">
                  <CheckCircle2 size={14} className="text-green-500" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-green-700 uppercase">{customerName}</span>
                    {customerAddress && <span className="text-[8px] font-bold text-green-600/70 uppercase line-clamp-1">{customerAddress}</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#111] uppercase opacity-60 ml-1">Customer Phone Number</label>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center shadow-sm focus-within:border-[#6338F9] transition-all min-h-[58px]">
            <input type="tel" placeholder="0812 345 6789" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-bold text-[15px] text-[#111]" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end mb-1 px-1">
            <label className="text-[11px] font-black text-[#111] uppercase opacity-60">Amount</label>
            <span className="text-[9px] font-bold text-gray-500">Balance: {formatCurrency(userBalance)}</span>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center shadow-sm focus-within:border-[#6338F9] transition-all h-[58px]">
            <span className="text-[16px] font-black text-gray-400 mr-2">₦</span>
            <input type="number" placeholder="Min ₦100" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-black text-[16px] text-[#111]" />
          </div>
        </div>
      </div>

      <button 
        onClick={() => canContinue && setStep('confirm')} 
        className={`w-full py-5 rounded-[2rem] font-black text-[16px] mt-auto mb-8 transition-all shadow-xl active:scale-[0.98] ${canContinue ? 'bg-[#6338F9] text-white' : 'bg-[#EBE4FF] text-[#6338F9]/40 cursor-not-allowed'}`}
      >
        Continue
      </button>
    </div>
  );

  const renderResult = () => {
    let icon = <CheckCircle2 size={72} className="text-white z-10" />;
    let statusBg = 'bg-[#34C759]';
    let statusText = 'Success!';
    let desc = `Your ${selectedProvider.name} ${tab} payment was successful.`;
    let containerBg = 'bg-[#6338F9]';
    let textColor = 'text-white';
    let subTextColor = 'text-white/70';

    if (transactionStatus === 'failed') {
      icon = <X size={72} className="text-white z-10" />;
      statusBg = 'bg-[#FF4B4B]';
      statusText = 'Transaction Failed';
      desc = errorMessage;
      containerBg = 'bg-[#F8F9FB]';
      textColor = 'text-[#111]';
      subTextColor = 'text-gray-500';
    } else if (transactionStatus === 'pending') {
      icon = <Clock size={72} className="text-white z-10" />;
      statusBg = 'bg-orange-400';
      statusText = 'Processing...';
      desc = 'Your transaction is being processed by the DisCo.';
      containerBg = 'bg-[#F8F9FB]';
      textColor = 'text-[#111]';
      subTextColor = 'text-gray-500';
    } else if (transactionStatus === 'service-down') {
      icon = <AlertCircle size={72} className="text-white z-10" />;
      statusBg = 'bg-gray-800';
      statusText = 'Service Down';
      desc = 'The provider service is currently unavailable. Try again later.';
      containerBg = 'bg-[#F8F9FB]';
      textColor = 'text-[#111]';
      subTextColor = 'text-gray-500';
    }

    return (
      <div className={`absolute inset-0 z-[500] flex flex-col items-center justify-center text-center p-10 ${containerBg}`}>
        <div className={`w-40 h-40 ${statusBg} rounded-full flex items-center justify-center mb-10 shadow-2xl relative`}>
          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-white rounded-full" />
          {icon}
        </div>
        <h2 className={`text-[32px] font-black mb-4 ${textColor}`}>{statusText}</h2>
        <p className={`text-[15px] font-bold max-w-[280px] ${subTextColor}`}>{desc}</p>
        <button 
          onClick={onBack} 
          className={`absolute bottom-12 left-8 right-8 py-5 rounded-[2rem] font-black text-[15px] shadow-xl active:scale-95 transition-all ${transactionStatus === 'success' ? 'bg-white text-[#6338F9]' : 'bg-[#6338F9] text-white'}`}
        >
          Done
        </button>
      </div>
    );
  };

  return (
    <div className="h-full bg-white relative overflow-hidden">
      <AnimatePresence mode="wait">
        {step === 'form' && <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">{renderForm()}</motion.div>}
        {step === 'confirm' && (
          <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[250] flex flex-col justify-end" onClick={() => setStep('form')}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl space-y-8" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-2" />
              <h3 className="text-[18px] font-black text-[#111]">Confirm Payment</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center"><span className="text-gray-400 font-bold text-[12px] uppercase">DisCo</span><span className="font-black text-[#111]">{selectedProvider.name}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400 font-bold text-[12px] uppercase">Meter Number</span><span className="font-black text-[#111]">{meterNumber}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400 font-bold text-[12px] uppercase">Amount</span><span className="font-black text-[#111]">₦{amount}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400 font-bold text-[12px] uppercase">Type</span><span className="font-black text-[#111] capitalize">{tab}</span></div>
              </div>
              <button onClick={() => setStep('pin')} className="w-full bg-[#6338F9] text-white py-5 rounded-[2.5rem] font-black text-[16px] shadow-xl active:scale-95 transition-all">Confirm & Pay</button>
            </motion.div>
          </motion.div>
        )}
        {step === 'pin' && (
          <motion.div key="pin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[#F8F9FB] z-[300] flex flex-col pt-12">
            <div className="px-6 flex items-center justify-between mb-12">
              <button onClick={() => setStep('confirm')} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
                <ChevronLeft size={24} className="text-[#111]" />
              </button>
              <h2 className="text-[16px] font-black text-[#111]">Authorize PIN</h2>
              <div className="w-10" />
            </div>
            <div className="flex justify-center gap-5 mb-12 mt-12">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-[#6338F9] border-[#6338F9] scale-110' : 'bg-transparent border-gray-200'}`} />
              ))}
            </div>
            <div className="mt-auto bg-white p-8 grid grid-cols-3 gap-y-3 gap-x-6 rounded-t-[3rem] shadow-xl">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0].map((n, i) => (
                <button key={i} onClick={() => n !== '' && pin.length < 4 && setPin(prev => prev + n)} className="h-14 text-2xl font-black text-[#111] active:scale-90 transition-all">{n}</button>
              ))}
              <button onClick={() => setPin(prev => prev.slice(0, -1))} className="h-14 font-black text-[#111] active:scale-90 transition-all">
                <Delete size={24} className="mx-auto" />
              </button>
            </div>
            <div className="bg-white pb-10 px-8">
              <button 
                onClick={handlePurchase} 
                disabled={pin.length !== 4} 
                className={`w-full py-5 rounded-[2rem] font-black text-[15px] transition-all ${pin.length === 4 ? 'bg-[#6338F9] text-white shadow-xl' : 'bg-purple-100 text-white'}`}
              >
                Pay Now
              </button>
            </div>
          </motion.div>
        )}
        {step === 'processing' && <motion.div className="absolute inset-0 z-[400]"><SplashScreen /></motion.div>}
        {step === 'result' && renderResult()}
      </AnimatePresence>

      <AnimatePresence>
        {showProviderSelector && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[500] flex flex-col justify-end" onClick={() => setShowProviderSelector(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl flex flex-col h-[75vh]" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-6 flex-shrink-0" />
              <h3 className="text-[16px] font-black text-[#111] mb-6 px-2">Select DisCo</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                {DISCOS.map((p, i) => (
                  <button key={i} onClick={() => { setSelectedProvider(p); setShowProviderSelector(false); }} className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedProvider.id === p.id ? 'bg-purple-50 border-purple-100' : 'bg-transparent border-transparent active:bg-gray-50'}`}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 p-1 bg-white flex items-center justify-center shadow-sm">
                        <img src={p.logo} className="w-full h-full object-contain" alt={p.name} />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className={`text-[14px] font-black uppercase ${selectedProvider.id === p.id ? 'text-[#6338F9]' : 'text-[#111]'}`}>
                          {p.name}
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter line-clamp-1">{p.fullName}</span>
                      </div>
                    </div>
                    {selectedProvider.id === p.id && <CheckCircle2 size={20} className="text-[#6338F9]" />}
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
