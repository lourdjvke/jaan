
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, UserSquare2, CheckCircle2, X, Delete, Loader2, Smartphone, AlertCircle, Clock } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { ref, onValue, update, push } from 'firebase/database';
import SplashScreen from './SplashScreen';

interface Props {
  onBack: () => void;
  showToast?: (msg: string) => void;
}

type AirtimeStep = 'form' | 'confirm' | 'pin' | 'processing' | 'result';
type TransactionStatus = 'success' | 'failed' | 'pending' | 'service-down';

interface DataPlan {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixedPrice?: string;
}

const WORKER_URL = "https://shy-shadow-e3f8.codalchemy.workers.dev/";

const Airtime: React.FC<Props> = ({ onBack, showToast }) => {
  const [step, setStep] = useState<AirtimeStep>('form');
  const [tab, setTab] = useState<'airtime' | 'data'>('airtime');
  const [showNetworkSelector, setShowNetworkSelector] = useState(false);
  const [showDataPlanSelector, setShowDataPlanSelector] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState({ id: 'mtn', name: 'MTN', logo: 'media/mtn.png' });
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDataPlan, setSelectedDataPlan] = useState<DataPlan | null>(null);
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);
  const [userBalance, setUserBalance] = useState<number>(0);
  const [jtokens, setJTokens] = useState<number>(0);
  const [dataPlans, setDataPlans] = useState<DataPlan[]>([]);
  const [fetchingPlans, setFetchingPlans] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>('success');
  const [errorMessage, setErrorMessage] = useState('');

  const networks = [
    { id: '9mobile', name: '9mobile', logo: 'media/9mobile.png' },
    { id: 'glo', name: 'GLO', logo: 'media/glo.jpg' },
    { id: 'mtn', name: 'MTN', logo: 'media/mtn.png' },
    { id: 'airtel', name: 'Airtel', logo: 'media/airtel.png' },
  ];

  useEffect(() => {
    if (!auth.currentUser) return;
    const userRef = ref(db, `users/${auth.currentUser.uid}`);
    return onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setUserBalance(data.balance || 0);
        setJTokens(data.jtokens || 0);
      }
    });
  }, []);

  useEffect(() => {
    if (tab === 'data' && selectedNetwork) {
      fetchPlans(selectedNetwork.id);
    }
  }, [selectedNetwork, tab]);

  const fetchPlans = async (networkId: string) => {
    setFetchingPlans(true);
    try {
      const serviceID = `${networkId}-data`;
      const response = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ route: "GET_VARIATIONS", payload: { serviceID } })
      });
      const data = await response.json();
      const variations = data.content?.varations || [];
      setDataPlans(variations);
    } catch (e) {
      console.error("Failed to fetch plans", e);
    } finally {
      setFetchingPlans(false);
    }
  };

  const handlePurchase = async () => {
    if (!auth.currentUser) return;
    
    const purchaseAmount = tab === 'airtime' ? parseFloat(amount) : parseFloat(selectedDataPlan?.variation_amount || '0');
    
    if (userBalance < purchaseAmount) {
      const historyRef = ref(db, `users/${auth.currentUser.uid}/transactions`);
      await push(historyRef, {
        type: tab,
        title: `Declined: ${selectedNetwork.name.toUpperCase()} ${tab.toUpperCase()}`,
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
      const savedPin = snapshot.val();
      if (pin !== savedPin) {
        setShake(true);
        setTimeout(() => { setShake(false); setPin(''); }, 500);
        return;
      }

      setStep('processing');
      const requestId = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 12) + Math.floor(1000 + Math.random() * 9000);
      const serviceID = tab === 'airtime' ? selectedNetwork.id : `${selectedNetwork.id}-data`;
      
      const payload = {
        route: "PAY_VAS",
        payload: {
          request_id: requestId,
          serviceID: serviceID,
          billersCode: phone,
          phone: phone,
          amount: purchaseAmount,
          variation_code: tab === 'data' ? selectedDataPlan?.variation_code : undefined
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
          const newBalance = userBalance - purchaseAmount;
          const updates: any = { balance: newBalance };
          
          // JToken Reward Logic: If purchase > 500, earn 2 JTokens
          let earnedJTokens = false;
          if (purchaseAmount > 500) {
            updates.jtokens = jtokens + 2;
            earnedJTokens = true;
          }

          await update(ref(db, `users/${auth.currentUser?.uid}`), updates);
          
          const historyRef = ref(db, `users/${auth.currentUser?.uid}/transactions`);
          await push(historyRef, {
            type: tab,
            title: `${selectedNetwork.name.toUpperCase()} ${tab.toUpperCase()}`,
            amount: -purchaseAmount,
            date: new Date().toISOString(),
            status: 'success',
            requestId: requestId
          });

          if (earnedJTokens) {
            await push(historyRef, {
              type: 'jtoken',
              title: '+2 JTokens Earned',
              amount: 2,
              date: new Date().toISOString(),
              status: 'success'
            });
          }

          setTransactionStatus('success');
        } else if (result.code === '099') {
          setTransactionStatus('pending');
          const historyRef = ref(db, `users/${auth.currentUser?.uid}/transactions`);
          await push(historyRef, {
            type: tab,
            title: `${selectedNetwork.name.toUpperCase()} ${tab.toUpperCase()}`,
            amount: -purchaseAmount,
            date: new Date().toISOString(),
            status: 'pending',
            requestId: requestId
          });
        } else {
          const historyRef = ref(db, `users/${auth.currentUser?.uid}/transactions`);
          await push(historyRef, {
            type: tab,
            title: `Failed: ${selectedNetwork.name.toUpperCase()} ${tab.toUpperCase()}`,
            amount: -purchaseAmount,
            date: new Date().toISOString(),
            status: 'failed',
            reason: result.response_description
          });

          if (result.response_description?.toLowerCase().includes('service') || result.response_description?.toLowerCase().includes('admin')) {
            setTransactionStatus('service-down');
          } else {
            setTransactionStatus('failed');
            setErrorMessage(result.response_description || 'Transaction failed.');
          }
        }
      } catch (err: any) {
        setTransactionStatus('service-down');
      } finally {
        setStep('result');
      }
    }, { onlyOnce: true });
  };

  const handleKeyInput = (val: string) => {
    if (pin.length < 4) setPin(prev => prev + val);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);
  };

  const canContinue = phone.length >= 10 && (tab === 'airtime' ? (parseFloat(amount) >= 100) : selectedDataPlan);

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
        <button onClick={() => { setTab('airtime'); setSelectedDataPlan(null); }} className={`flex-1 py-3 rounded-xl text-[13px] font-black transition-all duration-300 ${tab === 'airtime' ? 'bg-[#6338F9] text-white shadow-lg' : 'text-gray-400'}`}>Airtime</button>
        <button onClick={() => { setTab('data'); setAmount(''); }} className={`flex-1 py-3 rounded-xl text-[13px] font-black transition-all duration-300 ${tab === 'data' ? 'bg-[#6338F9] text-white shadow-lg' : 'text-gray-400'}`}>Data</button>
      </div>

      <button onClick={() => setShowNetworkSelector(true)} className="flex items-center gap-3 mb-8 bg-white border border-gray-100 p-2.5 pr-5 rounded-2xl active:scale-95 transition-all w-fit shadow-sm">
        <div className="w-7 h-7 rounded-lg overflow-hidden bg-white flex items-center justify-center border border-gray-50 p-1">
          <img src={selectedNetwork.logo} className="w-full h-full object-contain" alt="network" />
        </div>
        <span className="text-[13px] font-black text-[#111] uppercase tracking-tight">{selectedNetwork.name}</span>
        <ChevronDown size={14} className="text-gray-400 ml-1" />
      </button>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#111] tracking-tight ml-1 uppercase opacity-40">Phone Number</label>
          <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm focus-within:border-[#6338F9] transition-all">
            <input type="tel" placeholder="0801 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-bold text-[15px] text-[#111] placeholder:text-gray-200" />
            <button className="bg-[#F2F3F5] px-3 py-2 rounded-xl text-[#6338F9] flex items-center gap-1.5 active:scale-90 transition-all">
              <UserSquare2 size={16} /><span className="text-[10px] font-black">Contact</span>
            </button>
          </div>
        </div>

        {tab === 'airtime' ? (
          <div className="space-y-2">
            <div className="flex justify-between items-end mb-1 px-1">
              <label className="text-[11px] font-black text-[#111] tracking-tight uppercase opacity-40">Amount (In Airtime)</label>
              <span className="text-[9px] font-bold text-gray-400">Balance: {formatCurrency(userBalance)}</span>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center shadow-sm focus-within:border-[#6338F9] transition-all h-[58px]">
              <span className="text-[16px] font-black text-gray-400 mr-2">₦</span>
              <input type="number" placeholder="Min ₦100" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-black text-[16px] text-[#111]" />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
             <div className="flex justify-between items-end mb-1 px-1">
              <label className="text-[11px] font-black text-[#111] tracking-tight uppercase opacity-40">Data Plan</label>
              <span className="text-[9px] font-bold text-gray-400">Balance: {formatCurrency(userBalance)}</span>
            </div>
            <div onClick={() => setShowDataPlanSelector(true)} className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm cursor-pointer active:bg-gray-50 transition-all h-[58px]">
              <div className="flex flex-col">
                <span className={`text-[14px] font-bold ${selectedDataPlan ? 'text-[#111]' : 'text-gray-300'}`}>{selectedDataPlan ? `${selectedDataPlan.name}` : 'Select Data Plan'}</span>
                {selectedDataPlan && <span className="text-[9px] text-[#6338F9] font-black mt-0.5">COST: ₦{selectedDataPlan.variation_amount}</span>}
              </div>
              {fetchingPlans ? <Loader2 size={18} className="animate-spin text-[#6338F9]" /> : <ChevronDown size={20} className="text-gray-400" />}
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={() => canContinue && setStep('confirm')} 
        className={`w-full py-5 rounded-[2rem] font-black text-[16px] mt-12 transition-all shadow-xl active:scale-[0.98] ${canContinue ? 'bg-[#6338F9] text-white' : 'bg-[#EBE4FF] text-[#6338F9]/40 cursor-not-allowed'}`}
      >
        Continue
      </button>
    </div>
  );

  const renderResult = () => {
    let icon = <CheckCircle2 size={72} className="text-white relative z-10" />;
    let statusBg = 'bg-[#34C759]';
    let statusText = 'Success!';
    let desc = `Your ${selectedNetwork.name.toUpperCase()} ${tab} purchase was successful.`;

    if (transactionStatus === 'failed') {
      icon = <X size={72} className="text-white relative z-10" />;
      statusBg = 'bg-[#FF4B4B]';
      statusText = 'Transaction Failed';
      desc = errorMessage;
    } else if (transactionStatus === 'pending') {
      icon = <Clock size={72} className="text-white relative z-10" />;
      statusBg = 'bg-orange-400';
      statusText = 'Transaction Pending';
      desc = 'We are currently processing your request.';
    } else if (transactionStatus === 'service-down') {
      icon = <AlertCircle size={72} className="text-white relative z-10" />;
      statusBg = 'bg-gray-800';
      statusText = 'Service Down';
      desc = 'The provider service is currently unavailable. Please try again later.';
    }

    return (
      <div className={`absolute inset-0 z-[500] flex flex-col items-center justify-center text-center p-10 ${transactionStatus === 'success' ? 'bg-[#6338F9]' : 'bg-[#F8F9FB]'}`}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-40 h-40 ${statusBg} rounded-full flex items-center justify-center mb-10 shadow-2xl relative`}>
          <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-white rounded-full" />
          {icon}
        </motion.div>
        <h2 className={`text-[32px] font-black mb-4 ${transactionStatus === 'success' ? 'text-white' : 'text-[#111]'}`}>{statusText}</h2>
        <p className={`text-[15px] font-bold max-w-[280px] ${transactionStatus === 'success' ? 'text-white/70' : 'text-gray-400'}`}>{desc}</p>
        <button onClick={onBack} className={`absolute bottom-12 left-8 right-8 py-5 rounded-[2rem] font-black text-[15px] shadow-xl active:scale-95 transition-all ${transactionStatus === 'success' ? 'bg-white text-[#6338F9]' : 'bg-[#6338F9] text-white'}`}>Done</button>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden h-full">
      <AnimatePresence mode="wait">
        {step === 'form' && <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full">{renderForm()}</motion.div>}
        {step === 'confirm' && (
          <motion.div key="confirm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[250] flex flex-col justify-end" onClick={() => setStep('form')}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl space-y-8" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-2" />
              <h3 className="text-[18px] font-black text-[#111]">Confirm Transaction</h3>
              <div className="space-y-5">
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-400 uppercase">Amount</span><span className="text-[15px] font-black text-[#111]">₦{tab === 'airtime' ? amount : selectedDataPlan?.variation_amount}</span></div>
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-400 uppercase">Phone</span><span className="text-[15px] font-black text-[#111]">{phone}</span></div>
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-400 uppercase">Plan</span><span className="text-[15px] font-black text-[#111]">{tab === 'airtime' ? 'Airtime' : selectedDataPlan?.name}</span></div>
                <div className="flex justify-between items-center"><span className="text-[11px] font-bold text-gray-400 uppercase">Network</span><span className="text-[15px] font-black text-[#111]">{selectedNetwork.name}</span></div>
              </div>
              <button onClick={() => setStep('pin')} className="w-full bg-[#6338F9] text-white py-5 rounded-[2rem] font-black text-[16px] shadow-xl active:scale-95 transition-all">Continue</button>
            </motion.div>
          </motion.div>
        )}
        {step === 'pin' && (
          <motion.div key="pin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#F8F9FB] z-[300] flex flex-col pt-12">
            <div className="px-6 flex items-center justify-between mb-12">
              <button onClick={() => setStep('confirm')} className="p-2 -ml-2 rounded-full active:bg-gray-100"><ChevronLeft size={24} /></button>
              <h2 className="text-[16px] font-black">Security PIN</h2>
              <div className="w-10" />
            </div>
            <div className="px-8 mb-12">
              <h3 className="text-[22px] font-black mb-2">Transaction PIN</h3>
              <p className="text-[13px] font-bold text-gray-400">Authorize your payment</p>
            </div>
            <div className={`flex justify-center gap-5 mb-12 ${shake ? 'animate-bounce' : ''}`}>
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`w-4 h-4 rounded-full border-2 transition-all ${pin.length > i ? 'bg-[#6338F9] border-[#6338F9] scale-110' : 'bg-transparent border-gray-200'}`} />
              ))}
            </div>
            <div className="mt-auto bg-white p-8 grid grid-cols-3 gap-y-3 gap-x-6 rounded-t-[3rem] shadow-xl">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0].map((n, i) => (
                <button key={i} onClick={() => n !== '.' && handleKeyInput(n.toString())} className="h-14 flex items-center justify-center text-2xl font-black text-[#111] active:scale-90 transition-all">{n}</button>
              ))}
              <button onClick={() => setPin(prev => prev.slice(0, -1))} className="h-14 flex items-center justify-center text-[#111] active:scale-90 transition-all font-black text-xl"><Delete size={24} /></button>
            </div>
            <div className="bg-white pb-10 px-8">
              <button onClick={handlePurchase} disabled={pin.length !== 4} className={`w-full py-5 rounded-[2rem] font-black text-[15px] ${pin.length === 4 ? 'bg-[#6338F9] text-white shadow-xl' : 'bg-purple-100 text-white'}`}>Pay Now</button>
            </div>
          </motion.div>
        )}
        {step === 'processing' && <motion.div className="absolute inset-0 z-[400]"><SplashScreen /></motion.div>}
        {step === 'result' && renderResult()}
      </AnimatePresence>

      <AnimatePresence>
        {showNetworkSelector && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[500] flex flex-col justify-end" onClick={() => setShowNetworkSelector(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl space-y-2" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 bg-gray-100 rounded-full mx-auto mb-6" />
              <h3 className="text-[16px] font-black text-[#111] mb-6">Select Mobile Network</h3>
              {networks.map((net, i) => (
                <button key={i} onClick={() => { setSelectedNetwork(net); setShowNetworkSelector(false); }} className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border ${selectedNetwork.id === net.id ? 'bg-purple-50 border-purple-100' : 'bg-transparent border-transparent'}`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-1.5 bg-white"><img src={net.logo} className="w-full h-full object-contain" alt={net.name} /></div>
                    <span className={`text-[15px] font-black uppercase tracking-tight ${selectedNetwork.id === net.id ? 'text-[#6338F9]' : 'text-gray-600'}`}>{net.name}</span>
                  </div>
                  {selectedNetwork.id === net.id && <CheckCircle2 size={20} className="text-[#6338F9]" />}
                </button>
              ))}
            </motion.div>
          </motion.div>
        )}
        {showDataPlanSelector && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[500] flex flex-col justify-end" onClick={() => setShowDataPlanSelector(false)}>
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl flex flex-col h-[75vh]" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8 flex-shrink-0" />
              <h3 className="text-[18px] font-black text-[#111] mb-6">Choose a Data Bundle</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
                {dataPlans.length > 0 ? (
                  dataPlans.map((pkg, idx) => (
                    <button key={idx} onClick={() => { setSelectedDataPlan(pkg); setShowDataPlanSelector(false); }} className="w-full p-5 rounded-[1.8rem] text-left transition-all border border-transparent hover:bg-gray-50 bg-[#F8F9FB]">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-0.5"><span className="text-[14px] font-black text-[#111]">{pkg.name}</span></div>
                        <span className="text-[15px] font-black text-[#6338F9] tracking-tight">₦{pkg.variation_amount}</span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 opacity-40">
                    {fetchingPlans ? <Loader2 size={32} className="animate-spin text-[#6338F9]" /> : <p className="font-bold text-sm">No plans available.</p>}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Airtime;
