
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronDown, CheckCircle2, X, Delete, Loader2, Search, Smartphone } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { ref, onValue, update, push } from 'firebase/database';
import SplashScreen from './SplashScreen';

interface Props {
  onBack: () => void;
  showToast?: (msg: string) => void;
}

type IntlStep = 'form' | 'confirm' | 'pin' | 'processing' | 'result';
const WORKER_URL = "https://shy-shadow-e3f8.codalchemy.workers.dev/";

const IntlAirtime: React.FC<Props> = ({ onBack, showToast }) => {
  const [step, setStep] = useState<IntlStep>('form');
  const [countries, setCountries] = useState<any[]>([]);
  const [operators, setOperators] = useState<any[]>([]);
  const [variations, setVariations] = useState<any[]>([]);
  
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedProductType, setSelectedProductType] = useState<any>(null);
  const [selectedOperator, setSelectedOperator] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [userBalance, setUserBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [fetchingOps, setFetchingOps] = useState(false);
  const [fetchingVars, setFetchingVars] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'success' | 'failed'>('success');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [showCountrySheet, setShowCountrySheet] = useState(false);
  const [showOperatorSheet, setShowOperatorSheet] = useState(false);
  const [showProductSheet, setShowProductSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!auth.currentUser) return;
    const balanceRef = ref(db, `users/${auth.currentUser.uid}/balance`);
    return onValue(balanceRef, (snapshot) => setUserBalance(snapshot.val() || 0));
  }, []);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route: "GET_INTERNATIONAL_COUNTRIES" })
      });
      const data = await res.json();
      setCountries(data.content?.countries || []);
    } catch (e) {
      console.error(e);
      setCountries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCountrySelect = async (country: any) => {
    setSelectedCountry(country);
    setShowCountrySheet(false);
    setPhone('');
    setSelectedOperator(null);
    setSelectedProduct(null);
    setOperators([]);
    setVariations([]);
    
    setFetchingOps(true);
    try {
      // Step 1: Fetch Product Types (Usually airtime is the standard)
      const pRes = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route: "GET_INTERNATIONAL_PRODUCT_TYPES", payload: { code: country.code } })
      });
      const pData = await pRes.json();
      const pTypes = pData.content || [];
      const pt = pTypes[0]; // Default to first available type (Airtime)
      setSelectedProductType(pt);

      // Step 2: Fetch Operators
      const oRes = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ route: "GET_INTERNATIONAL_OPERATORS", payload: { code: country.code, product_type_id: pt.product_type_id } })
      });
      const oData = await oRes.json();
      const ops = oData.content || [];
      setOperators(ops);
      
      if (ops.length === 1) {
        setSelectedOperator(ops[0]);
        await fetchVariations(ops[0], pt);
      }
    } catch (e) {
      showToast?.("Failed to load country details.");
    } finally {
      setFetchingOps(false);
    }
  };

  const fetchVariations = async (op: any, pt: any) => {
    setFetchingVars(true);
    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          route: "GET_VARIATIONS", 
          payload: { serviceID: "foreign-airtime", operator_id: op.operator_id, product_type_id: pt.product_type_id } 
        })
      });
      const data = await res.json();
      const vars = data.content?.variations || data.content?.varations || [];
      setVariations(vars);
    } catch (e) {
      showToast?.("Failed to fetch products.");
    } finally {
      setFetchingVars(false);
    }
  };

  const handleProductSelect = (v: any) => {
    setSelectedProduct(v);
    if (v.name.toLowerCase().includes("flexible")) {
      setAmount('');
    } else {
      setAmount(v.variation_amount);
    }
    setShowProductSheet(false);
  };

  const handlePurchase = async () => {
    if (!auth.currentUser) return;
    const purchaseAmount = parseFloat(amount);

    if (purchaseAmount < 2000) {
      showToast?.("Minimum top-up amount is ₦2,000");
      return;
    }

    if (userBalance < purchaseAmount) {
      showToast?.("Insufficient funds.");
      return;
    }

    const userRef = ref(db, `users/${auth.currentUser.uid}/transactionPin`);
    onValue(userRef, async (snapshot) => {
      if (pin !== snapshot.val()) { setPin(''); return; }
      setStep('processing');
      try {
        const fullPhone = `${selectedCountry.prefix}${phone}`;
        const res = await fetch(WORKER_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            route: "PAY_VAS",
            payload: {
              request_id: "INTL" + Date.now(),
              serviceID: "foreign-airtime",
              billersCode: fullPhone,
              variation_code: selectedProduct?.variation_code,
              amount: amount,
              phone: fullPhone,
              operator_id: selectedOperator?.operator_id,
              country_code: selectedCountry?.code,
              product_type_id: selectedProductType?.product_type_id
            }
          })
        });
        const result = await res.json();
        if (result.code === '000') {
          await update(ref(db, `users/${auth.currentUser.uid}`), { balance: userBalance - purchaseAmount });
          await push(ref(db, `users/${auth.currentUser.uid}/transactions`), {
            type: 'intl', title: `${selectedCountry?.name} Airtime`, amount: -purchaseAmount, date: new Date().toISOString(), status: 'success'
          });
          setTransactionStatus('success');
        } else {
          setTransactionStatus('failed');
          setErrorMessage(result.response_description || "Failed");
        }
      } catch {
        setTransactionStatus('failed');
      } finally {
        setStep('result');
      }
    }, { onlyOnce: true });
  };

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);
  const filteredCountries = useMemo(() => Array.isArray(countries) ? countries.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())) : [], [countries, searchQuery]);

  const renderForm = () => (
    <div className="px-6 pt-6 flex flex-col h-full bg-white font-['Plus_Jakarta_Sans']">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-[#111]" />
        </button>
        <h2 className="text-[16px] font-black text-[#111]">International Airtime</h2>
        <div className="w-10" />
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto no-scrollbar pb-20">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#111] uppercase opacity-60 ml-1">Select Country</label>
          <div onClick={() => setShowCountrySheet(true)} className="bg-[#F8F9FB] rounded-2xl p-4 flex items-center justify-between border-2 border-transparent transition-all h-[58px] cursor-pointer">
            {selectedCountry ? (
               <div className="flex items-center gap-3">
                 <img src={selectedCountry.flag} className="w-6 h-4 object-cover rounded-sm shadow-sm" alt="flag" />
                 <span className="text-[14px] font-bold text-[#111]">{selectedCountry.name}</span>
               </div>
            ) : <span className="text-[14px] font-bold text-gray-300">Select Country</span>}
            <ChevronDown size={20} className="text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#111] uppercase opacity-60 ml-1">Enter Phone Number</label>
          <div className="bg-[#F8F9FB] rounded-2xl p-4 border-2 border-transparent focus-within:border-[#6338F9] focus-within:bg-white transition-all h-[58px] flex items-center shadow-sm">
            {selectedCountry && <span className="text-[14px] font-black text-[#111] mr-1.5">+{selectedCountry.prefix}</span>}
            <input 
                type="tel" 
                placeholder="000 0000 000" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))} 
                className="flex-1 bg-transparent border-none outline-none font-bold text-[14px] text-[#111] placeholder:text-gray-300" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#111] uppercase opacity-60 ml-1">Select Operator</label>
          <div onClick={() => operators.length > 0 && setShowOperatorSheet(true)} className={`bg-[#F8F9FB] rounded-2xl p-4 flex items-center justify-between transition-all h-[58px] ${operators.length === 0 ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer shadow-sm'}`}>
            <span className={`text-[14px] font-bold ${selectedOperator ? 'text-[#111]' : 'text-gray-300'}`}>
                {fetchingOps ? 'Loading operators...' : selectedOperator ? selectedOperator.name : 'Select Operator'}
            </span>
            <ChevronDown size={20} className="text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-black text-[#111] uppercase opacity-60 ml-1">Select Product / Plan</label>
          <div onClick={() => variations.length > 0 && setShowProductSheet(true)} className={`bg-[#F8F9FB] rounded-2xl p-4 flex items-center justify-between transition-all h-[58px] ${variations.length === 0 ? 'opacity-50 grayscale cursor-not-allowed' : 'cursor-pointer shadow-sm'}`}>
            <span className={`text-[14px] font-bold ${selectedProduct ? 'text-[#111]' : 'text-gray-300'}`}>
                {fetchingVars ? 'Loading products...' : selectedProduct ? selectedProduct.name : 'Select Product'}
            </span>
            <ChevronDown size={20} className="text-gray-400" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-end mb-1 px-1">
            <label className="text-[11px] font-black text-[#111] uppercase opacity-60">Amount</label>
            <span className="text-[9px] font-bold text-gray-500">Min ₦2,000 | Balance: {formatCurrency(userBalance)}</span>
          </div>
          <div className="bg-[#F8F9FB] border-2 border-transparent focus-within:border-[#6338F9] focus-within:bg-white rounded-2xl p-4 flex items-center shadow-sm transition-all h-[58px]">
            <span className="text-[16px] font-black text-[#111] mr-2">₦</span>
            <input 
                type="number" 
                placeholder="0.00" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                className="flex-1 bg-transparent border-none outline-none font-black text-[16px] text-[#111]" 
            />
          </div>
        </div>
      </div>

      <button 
        onClick={() => selectedProduct && parseFloat(amount) >= 2000 && phone.length > 5 && setStep('confirm')} 
        className={`w-full py-5 rounded-[2rem] font-black text-[16px] mb-8 transition-all shadow-xl active:scale-[0.98] ${selectedProduct && parseFloat(amount) >= 2000 && phone.length > 5 ? 'bg-[#6338F9] text-white shadow-purple-100' : 'bg-[#EBE4FF] text-[#6338F9]/40 cursor-not-allowed'}`}
      >
        Continue
      </button>

      <AnimatePresence>
        {showCountrySheet && (
          <div className="absolute inset-0 z-[100] flex flex-col justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCountrySheet(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl flex flex-col h-[75vh]">
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8 flex-shrink-0" />
              <h3 className="text-[18px] font-black text-[#111] mb-6">Select Country</h3>
              <div className="bg-[#F2F3F5] rounded-2xl p-4 flex items-center gap-3 mb-6">
                <Search size={18} className="text-gray-400" />
                <input type="text" placeholder="Search country" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-[#111]" />
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                {filteredCountries.map((c, i) => (
                  <button key={i} onClick={() => handleCountrySelect(c)} className={`w-full p-5 rounded-2xl flex items-center gap-4 transition-all ${selectedCountry?.code === c.code ? 'bg-purple-50 text-[#6338F9]' : 'active:bg-gray-50 text-[#111]'}`}>
                    <img src={c.flag} className="w-8 h-5 object-cover rounded-sm" alt={c.name} />
                    <span className="text-[14px] font-black">{c.name}</span>
                    {selectedCountry?.code === c.code && <CheckCircle2 size={18} className="ml-auto" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOperatorSheet && (
          <div className="absolute inset-0 z-[100] flex flex-col justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowOperatorSheet(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl flex flex-col h-[50vh]">
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8 flex-shrink-0" />
              <h3 className="text-[18px] font-black text-[#111] mb-6">Select Operator</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-2">
                {operators.map((o, i) => (
                  <button key={i} onClick={() => { setSelectedOperator(o); setShowOperatorSheet(false); fetchVariations(o, selectedProductType); }} className={`w-full p-5 rounded-2xl flex items-center gap-4 transition-all ${selectedOperator?.operator_id === o.operator_id ? 'bg-purple-50 text-[#6338F9]' : 'active:bg-gray-50 text-[#111]'}`}>
                    <span className="text-[14px] font-black text-left uppercase tracking-tight">{o.name}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showProductSheet && (
          <div className="absolute inset-0 z-[100] flex flex-col justify-end">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProductSheet(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl flex flex-col h-[60vh]">
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-8 flex-shrink-0" />
              <h3 className="text-[18px] font-black text-[#111] mb-6 px-2">Select Plan</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 px-1">
                {variations.map((v, i) => (
                  <button key={i} onClick={() => handleProductSelect(v)} className={`w-full p-5 rounded-2xl flex flex-col transition-all border border-transparent ${selectedProduct?.variation_code === v.variation_code ? 'bg-purple-50' : 'bg-[#F8F9FB] active:bg-gray-100'}`}>
                    <span className={`text-[14px] font-black text-left ${selectedProduct?.variation_code === v.variation_code ? 'text-[#6338F9]' : 'text-[#111]'}`}>{v.name}</span>
                    {v.variation_amount !== "0" && <span className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-tighter">Cost: ₦{v.variation_amount}</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );

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
                <div className="flex justify-between items-center"><span className="text-gray-400 font-bold text-[12px] uppercase">Country</span><span className="font-black text-[#111]">{selectedCountry.name}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400 font-bold text-[12px] uppercase">Phone</span><span className="font-black text-[#111]">+{selectedCountry.prefix}{phone}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-400 font-bold text-[12px] uppercase">Amount</span><span className="font-black text-[#111]">₦{amount}</span></div>
              </div>
              <button onClick={() => setStep('pin')} className="w-full bg-[#6338F9] text-white py-5 rounded-[2.5rem] font-black text-[16px] shadow-xl shadow-purple-100">Confirm & Pay</button>
            </motion.div>
          </motion.div>
        )}
        {step === 'pin' && (
          <motion.div key="pin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[#F8F9FB] z-[300] flex flex-col pt-12">
            <div className="px-6 flex items-center justify-between mb-12">
              <button onClick={() => setStep('confirm')} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors"><ChevronLeft size={24} className="text-[#111]" /></button>
              <h2 className="text-[16px] font-black text-[#111]">Authorize Transaction</h2>
              <div className="w-10" />
            </div>
            <div className="px-8 mb-12"><h3 className="text-[22px] font-black text-[#111] mb-2">Transaction PIN</h3><p className="text-[13px] font-bold text-gray-400">Securely authorize your top-up</p></div>
            <div className="flex justify-center gap-5 mb-12 mt-4">{[0, 1, 2, 3].map(i => (<div key={i} className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${pin.length > i ? 'bg-[#6338F9] border-[#6338F9] scale-110' : 'bg-transparent border-gray-200'}`} />))}</div>
            <div className="mt-auto bg-white p-8 grid grid-cols-3 gap-y-3 gap-x-6 rounded-t-[3rem] shadow-xl">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0].map((n, i) => (
                <button key={i} onClick={() => n !== '' && pin.length < 4 && setPin(prev => prev + n)} className="h-14 text-2xl font-black text-[#111] active:scale-90 transition-all">{n}</button>
              ))}
              <button onClick={() => setPin(prev => prev.slice(0, -1))} className="h-14 font-black text-[#111] active:scale-90 transition-all flex items-center justify-center"><Delete size={24} /></button>
            </div>
            <div className="bg-white pb-10 px-8"><button onClick={handlePurchase} disabled={pin.length !== 4} className={`w-full py-5 rounded-[2rem] font-black text-[15px] ${pin.length === 4 ? 'bg-[#6338F9] text-white shadow-xl shadow-purple-100' : 'bg-purple-100 text-white'}`}>Pay Now</button></div>
          </motion.div>
        )}
        {step === 'processing' && <motion.div className="absolute inset-0 z-[400]"><SplashScreen /></motion.div>}
        {step === 'result' && (
           <div className={`absolute inset-0 z-[500] flex flex-col items-center justify-center text-center p-10 ${transactionStatus === 'success' ? 'bg-[#6338F9]' : 'bg-[#F8F9FB]'}`}>
            <div className={`w-40 h-40 ${transactionStatus === 'success' ? 'bg-[#34C759]' : 'bg-[#FF4B4B]'} rounded-full flex items-center justify-center mb-10 shadow-2xl relative`}>
              <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="absolute inset-0 bg-white rounded-full" />
              {transactionStatus === 'success' ? <CheckCircle2 size={72} className="text-white z-10" /> : <X size={72} className="text-white z-10" />}
            </div>
            <h2 className={`text-[32px] font-black mb-4 ${transactionStatus === 'success' ? 'text-white' : 'text-[#111]'}`}>{transactionStatus === 'success' ? 'Success!' : 'Transaction Failed'}</h2>
            <p className={`text-[15px] font-bold max-w-[280px] ${transactionStatus === 'success' ? 'text-white/70' : 'text-gray-400'}`}>{transactionStatus === 'success' ? `International top-up for +${selectedCountry.prefix}${phone} was successful.` : errorMessage || "Something went wrong."}</p>
            <button onClick={onBack} className={`absolute bottom-12 left-8 right-8 py-5 rounded-[2rem] font-black text-[15px] shadow-xl ${transactionStatus === 'success' ? 'bg-white text-[#6338F9]' : 'bg-[#6338F9] text-white'}`}>Done</button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntlAirtime;
