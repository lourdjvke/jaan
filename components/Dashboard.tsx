
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, Eye, EyeOff, 
  Smartphone, Lightbulb, GraduationCap, CreditCard, Gift, 
  Wifi, Trophy, Ticket, Globe, Tv as TvIcon, 
  Settings2, LayoutGrid, Clock, Ticket as CouponIcon, MoreHorizontal,
  Flame, LifeBuoy, Copy, Check, HelpCircle, X, Sliders, AlertCircle, Inbox,
  ArrowRight, CreditCard as CardIcon, Banknote, Loader2, ChevronRight
} from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { ref, onValue, set, update, push } from 'firebase/database';
import Services from './Services';
import Airtime from './Airtime';
import Electricity from './Electricity';
import TV from './TV';
import More from './More';
import Profile from './Profile';

declare global {
  interface Window {
    MonnifySDK: any;
  }
}

interface Props {
  onLogout: () => void;
  onNavigateSupport?: () => void;
  onNavigateNotifications?: () => void;
  onNavigateNotifDetails?: (props: any) => void;
  onNavigateIntl?: () => void;
  showToast?: (msg: string) => void;
}

type DashboardView = 'home' | 'services' | 'airtime' | 'electricity' | 'tv' | 'more' | 'profile';

// MONNIFY CREDENTIALS
const MONNIFY_API_KEY = "MK_TEST_P0JF0FVHHE";
const MONNIFY_CONTRACT_CODE = "1317837916";

const Dashboard: React.FC<Props> = ({ onLogout, onNavigateSupport, onNavigateNotifications, onNavigateNotifDetails, onNavigateIntl, showToast }) => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [previousView, setPreviousView] = useState<DashboardView>('home');
  const [showBalance, setShowBalance] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState<any>(null);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [isTopUpLoading, setIsTopUpLoading] = useState(false);

  const isDetailView = useMemo(() => ['airtime', 'electricity', 'tv', 'profile'].includes(activeView), [activeView]);

  useEffect(() => {
    if (!auth.currentUser) return;
    const userRef = ref(db, `users/${auth.currentUser.uid}`);
    return onValue(userRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setUserData(data);
    });
  }, []);

  const navigateToView = (view: DashboardView) => {
    setPreviousView(activeView);
    setActiveView(view);
  };

  // CORE LOGIC EXTRACTED FROM WORKING DEMO
  const handleMonnifyPayment = () => {
    const amountVal = topUpAmount;
    const amountNum = parseFloat(amountVal);
    
    // Validation: Exactly as requested (Min 1,000)
    if (!amountVal || amountNum < 1000) {
      showToast?.("Minimum top up is ₦1,000");
      return;
    }

    // Check if SDK is loaded
    if (!window.MonnifySDK) {
      showToast?.("Payment system not ready. Please refresh.");
      return;
    }

    setIsTopUpLoading(true);
    const refStr = 'WAL_' + Date.now();

    // STRICT SDK INITIALIZATION
    window.MonnifySDK.initialize({
      amount: amountNum,
      currency: "NGN",
      reference: refStr,
      customerName: userData?.kyc?.fullName || "JAAN User",
      customerEmail: auth.currentUser?.email || "tester@wallet.com",
      apiKey: MONNIFY_API_KEY,
      contractCode: MONNIFY_CONTRACT_CODE,
      paymentDescription: "JAAN Wallet Funding",
      isTestMode: true,
      onComplete: function(response: any) {
        setIsTopUpLoading(false);
        if (response.status === 'SUCCESS') {
          // Success Path: Real-time update to RTDB
          const currentBalance = userData?.balance || 0;
          const newBalance = currentBalance + amountNum;
          
          update(ref(db, `users/${auth.currentUser?.uid}`), { balance: newBalance })
            .then(() => {
              push(ref(db, `users/${auth.currentUser?.uid}/transactions`), {
                type: 'deposit',
                title: 'Wallet Top Up',
                amount: amountNum,
                date: new Date().toISOString(),
                status: 'success'
              });
              setShowTopUp(false);
              setTopUpAmount('');
              showToast?.(`Wallet funded with ₦${amountNum.toLocaleString()}!`);
            })
            .catch((err) => {
              console.error("DB Update Error", err);
              showToast?.("Failed to update balance.");
            });
        } else {
          // Failure Path
          showToast?.("Txn Failed");
        }
      },
      onClose: function(data: any) {
        setIsTopUpLoading(false);
      }
    });
  };

  const quickServices = [
    { name: 'Airtime', icon: <Smartphone className="text-[#FFB400]" size={20} />, type: 'airtime' },
    { name: 'Electricity', icon: <Lightbulb className="text-red-400" size={20} />, type: 'electricity' },
    { name: 'Education', icon: <GraduationCap className="text-green-500" size={20} /> },
    { name: 'e-Sim', icon: <CreditCard className="text-red-400" size={20} /> },
    { name: 'Gift card', icon: <Gift className="text-orange-400" size={20} /> },
    { name: 'Internet', icon: <Wifi className="text-red-500" size={20} />, type: 'airtime' },
    { name: 'Betting', icon: <Trophy className="text-green-600" size={20} /> },
    { name: 'Tickets', icon: <Ticket className="text-red-400" size={20} /> },
    { name: 'Intl', icon: <Globe className="text-orange-300" size={20} />, action: onNavigateIntl },
    { name: 'TV', icon: <TvIcon className="text-green-400" size={20} />, type: 'tv' },
  ];

  const banners = [
    { title: "Double Your Data This Week!", subtitle: "Get 100% extra data on select bundles", bg: "bg-gradient-to-r from-[#FFB400] to-[#FFD000]", img: "media/flame.png", cta: "View Bundles" },
    { title: "Skip the Bill Stress!", subtitle: "Pay bills & win Netflix for a year", bg: "bg-gradient-to-r from-[#6338F9] to-[#8E6FFF]", img: "https://i.pravatar.cc/150?u=sedi", cta: "JAAN Now" }
  ];

  const transactions = useMemo(() => {
    if (!userData?.transactions) return [];
    return Object.values(userData.transactions).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [userData]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(val);
  const displayName = userData?.kyc?.userName || userData?.kyc?.fullName?.split(' ')[0] || 'User';

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-32 bg-[#F8F9FB]">
      <div className="px-5 pt-4 mb-8">
        <div className="rounded-[2.5rem] overflow-hidden shadow-xl shadow-purple-100/40">
          <div className="bg-gradient-to-br from-[#8E6FFF] via-[#6338F9] to-[#5129D1] p-6 text-white relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 opacity-60">
                <span className="text-[10px] font-bold uppercase tracking-widest">Balance</span>
                <button onClick={() => setShowBalance(!showBalance)}>{showBalance ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              </div>
              <button onClick={(e) => { e.stopPropagation(); setShowTopUp(true); }} className="bg-white px-5 py-2 rounded-xl text-[#6338F9] text-[11px] font-black shadow-sm">+ Top Up</button>
            </div>
            <h2 className="text-[28px] font-black tracking-tight mb-4">{showBalance ? formatCurrency(userData?.balance || 0) : '₦ • • • • • •'}</h2>
            <div className="pt-4 border-t border-white/10">
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Account Details: PAYSTACK- TITAN-</p>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-black tracking-widest">9962802191</span>
                <span className="text-[8px] font-black bg-white/10 px-2 py-0.5 rounded-md uppercase text-white/60">({displayName.toUpperCase()})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mb-8">
        <h3 className="font-black text-[#111] text-[14px] mb-5">Quick Access</h3>
        <div className="grid grid-cols-5 gap-y-6">
          {quickServices.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2.5 cursor-pointer" onClick={() => {
              if (s.action) s.action();
              else if (s.type === 'airtime') navigateToView('airtime');
              else if (s.type === 'electricity') navigateToView('electricity');
              else if (s.type === 'tv') navigateToView('tv');
              else navigateToView('services');
            }}>
              <div className="w-12 h-12 bg-white rounded-[1.2rem] shadow-sm flex items-center justify-center border border-gray-100/50 active:scale-90 transition-all">{s.icon}</div>
              <span className="text-[9px] font-bold text-gray-500">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 mb-8">
        <div className="overflow-hidden rounded-[2rem]">
          <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
            {banners.map((b, i) => (
              <div key={i} className={`min-w-[85%] snap-center rounded-[2rem] p-5 h-32 flex justify-between items-center relative overflow-hidden ${b.bg}`}>
                <div className="relative z-10 space-y-1">
                  <h4 className="text-[14px] font-black text-[#111] leading-tight">{b.title}</h4>
                  <p className="text-[10px] font-bold text-[#111]/60 leading-tight mb-2">{b.subtitle}</p>
                  <button className="bg-[#6338F9] text-white px-4 py-1.5 rounded-lg font-black text-[9px]">{b.cta}</button>
                </div>
                <div className="w-20 h-20 relative z-0">
                  <img src={b.img} className="w-full h-full object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pb-10">
        <h3 className="font-black text-[#111] text-[14px] mb-5">Recent Transactions</h3>
        {transactions.length > 0 ? (
          <div className="bg-white rounded-[2rem] p-5 space-y-6 shadow-sm border border-gray-100/50">
            {transactions.map((t: any, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F8F9FB] flex items-center justify-center text-[#6338F9]">
                    {t.type === 'deposit' ? <Banknote size={16} /> : t.type === 'intl' ? <Globe size={16} /> : <Smartphone size={16} />}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5"><span className="text-[12px] font-black text-[#111]">{t.title}</span>{t.status === 'failed' && <span className="text-[7px] font-black uppercase px-1.5 py-0.5 bg-red-50 text-red-500 rounded-md">Declined</span>}</div>
                    <span className="text-[10px] font-bold text-gray-300">{new Date(t.date).toLocaleString()}</span>
                  </div>
                </div>
                <span className={`text-[12px] font-black ${t.status === 'failed' ? 'text-gray-300 line-through' : t.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>{t.amount < 0 ? '-' : '+'}{formatCurrency(Math.abs(t.amount))}</span>
              </div>
            ))}
          </div>
        ) : <div className="bg-white rounded-[2rem] p-10 flex flex-col items-center justify-center text-center opacity-40"><Inbox size={32} /><p className="text-[12px] font-bold mt-2">No transactions yet</p></div>}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB] relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {!isDetailView && (
        <div className="px-6 pt-12 pb-5 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm sticky top-0 z-40">
          <div className="flex items-center gap-3" onClick={() => navigateToView('profile')}>
            <div className="w-10 h-10 rounded-full border-2 border-purple-50 p-0.5 overflow-hidden shadow-sm bg-gray-100">
              <img src="https://i.pravatar.cc/150?u=sedi" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-[#111] text-[15px]">Hi, {displayName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-800"><Search size={22} /></button>
            <button onClick={() => onNavigateNotifications?.()} className="p-2 text-gray-800 relative"><Bell size={22} /><div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF4B4B] rounded-full border-2 border-white shadow-sm"></div></button>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div key={activeView} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="flex-1 flex flex-col overflow-hidden">
          {activeView === 'home' && renderHome()}
          {activeView === 'services' && <Services onSelectAirtime={() => navigateToView('airtime')} onSelectTV={() => navigateToView('tv')} onSelectService={(s) => { if (s === 'Electricity') navigateToView('electricity'); if(s==='Intl') onNavigateIntl?.(); }} />}
          {activeView === 'airtime' && <Airtime onBack={() => setActiveView(previousView)} showToast={showToast} />}
          {activeView === 'electricity' && <Electricity onBack={() => setActiveView(previousView)} showToast={showToast} />}
          {activeView === 'tv' && <TV onBack={() => setActiveView(previousView)} showToast={showToast} />}
          {activeView === 'more' && <More onLogout={onLogout} onViewProfile={() => navigateToView('profile')} onSupport={onNavigateSupport} />}
          {activeView === 'profile' && <Profile onBack={() => setActiveView(previousView)} />}
        </motion.div>
      </AnimatePresence>

      {!isDetailView && (
        <div className="fixed bottom-0 left-0 right-0 h-24 bg-white border-t border-gray-100 flex items-center justify-around px-4 pb-4 z-[100]">
            <NavItem label="Home" active={activeView === 'home'} onClick={() => setActiveView('home')}><LayoutGrid size={22} strokeWidth={2.5} /></NavItem>
            <NavItem label="Schedule"><Clock size={22} strokeWidth={2.5} /></NavItem>
            <div className="relative -top-8">
              <div className="w-18 h-18 bg-[#F8F9FB] rounded-full p-1 shadow-inner">
                <div onClick={() => navigateToView('services')} className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-all border-4 border-white ${activeView === 'services' ? 'bg-[#6338F9]' : 'bg-white'}`}>
                  <img src="media/flame.png" className={`w-8 h-8 object-contain ${activeView === 'services' ? '' : 'grayscale opacity-60'}`} />
                </div>
              </div>
            </div>
            <NavItem label="Coupon"><CouponIcon size={22} strokeWidth={2.5} /></NavItem>
            <NavItem label="More" active={activeView === 'more'} onClick={() => navigateToView('more')}><MoreHorizontal size={22} strokeWidth={2.5} /></NavItem>
        </div>
      )}

      {/* Top Up Bottom Sheet - High Fidelity Reconstruction */}
      <AnimatePresence>
        {showTopUp && (
          <div className="absolute inset-0 z-[200] flex flex-col justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowTopUp(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl relative z-10 space-y-8"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-100 rounded-full mx-auto" />
              
              <div>
                <h3 className="text-[20px] font-black text-[#111]">Top Up Wallet</h3>
                <p className="text-[13px] font-bold text-gray-400">Secure funding via Monnify</p>
              </div>

              <div className="space-y-6">
                {/* Option 1: Direct Pay */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[#6338F9] mb-1">
                    <CardIcon size={16} strokeWidth={2.5} />
                    <span className="text-[11px] font-black uppercase tracking-wider">Direct Pay</span>
                  </div>
                  <div className="bg-[#F8F9FB] rounded-2xl p-4 flex items-center border-2 border-transparent focus-within:border-[#6338F9] focus-within:bg-white transition-all shadow-sm">
                    <span className="text-[16px] font-black text-[#111] mr-1.5">₦</span>
                    <input 
                      type="number" 
                      placeholder="Enter Amount (Min ₦1,000)" 
                      value={topUpAmount}
                      onChange={e => setTopUpAmount(e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none font-black text-[16px] text-[#111] placeholder:text-gray-300 placeholder:font-bold" 
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleMonnifyPayment}
                    disabled={isTopUpLoading}
                    className="w-full bg-[#6338F9] text-white py-5 rounded-[2rem] font-black text-[15px] shadow-xl shadow-purple-200 flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isTopUpLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight size={20} strokeWidth={2.5} />
                      </>
                    )}
                  </button>

                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-black text-gray-300"><span className="bg-white px-4 tracking-widest">or</span></div>
                  </div>

                  {/* Option 2: Bank Transfer (Preserved Feature) */}
                  <div className="bg-gray-50 rounded-[2rem] p-5 flex items-center justify-between border border-gray-100 active:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-[#6338F9]">
                         <Banknote size={22} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-[#111]">Bank Transfer</span>
                        <span className="text-[10px] font-bold text-gray-400 tracking-tight">Fund via your dedicated virtual account</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-300" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavItem: React.FC<{ children: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ children, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-[#6338F9]' : 'text-gray-300'}`}>
    {children}
    <span className="text-[10px] font-black uppercase tracking-tighter">{label}</span>
  </button>
);

export default Dashboard;
