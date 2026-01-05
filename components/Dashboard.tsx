
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, Eye, EyeOff, 
  Smartphone, Lightbulb, GraduationCap, CreditCard, Gift, 
  Wifi, Trophy, Ticket, Globe, Tv as TvIcon, 
  Settings2, LayoutGrid, Clock, Ticket as CouponIcon, MoreHorizontal,
  Flame, LifeBuoy, Copy, Check, HelpCircle, X, Sliders
} from 'lucide-react';
import Services from './Services';
import Airtime from './Airtime';
import Electricity from './Electricity';
import TV from './TV';
import More from './More';
import Profile from './Profile';

interface Props {
  onLogout: () => void;
  onNavigateSupport?: () => void;
  onNavigateNotifications?: () => void;
  onNavigateNotifDetails?: (props: any) => void;
}

type DashboardView = 'home' | 'services' | 'airtime' | 'electricity' | 'tv' | 'more' | 'profile';

interface SearchItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  view: DashboardView;
  subType?: string; // e.g., 'data' vs 'airtime'
  isSupport?: boolean;
}

const Dashboard: React.FC<Props> = ({ onLogout, onNavigateSupport, onNavigateNotifications, onNavigateNotifDetails }) => {
  const [activeView, setActiveView] = useState<DashboardView>('home');
  const [previousView, setPreviousView] = useState<DashboardView>('home');
  const [showBalance, setShowBalance] = useState(true);
  const [showTopUp, setShowTopUp] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [topUpTab, setTopUpTab] = useState<'bank' | 'card' | 'coupon'>('bank');
  const [copied, setCopied] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(0);

  // Searchable screens and services
  const searchableItems: SearchItem[] = [
    { id: 'airtime', title: 'Buy Airtime', subtitle: 'Recharge your mobile line instantly', icon: <Smartphone size={18} />, view: 'airtime' },
    { id: 'data', title: 'Buy Data', subtitle: 'All in One data for heavy internet users', icon: <Wifi size={18} />, view: 'airtime', subType: 'data' },
    { id: 'electricity', title: 'Electricity', subtitle: 'Pay utility and electricity bills', icon: <Lightbulb size={18} />, view: 'electricity' },
    { id: 'tv', title: 'Cable TV', subtitle: 'DStv, GOtv, StarTimes & Showmax', icon: <TvIcon size={18} />, view: 'tv' },
    { id: 'profile', title: 'My Profile', subtitle: 'Manage your personal account details', icon: <LayoutGrid size={18} />, view: 'profile' },
    { id: 'support', title: 'Help & Support', subtitle: 'Contact us for assistance', icon: <HelpCircle size={18} />, view: 'home', isSupport: true },
    { id: 'betting', title: 'Betting', subtitle: 'Top up your betting wallets', icon: <Trophy size={18} />, view: 'services' },
    { id: 'giftcard', title: 'Gift Cards', subtitle: 'Buy and sell global gift cards', icon: <Gift size={18} />, view: 'services' },
    { id: 'esim', title: 'e-Sim Services', subtitle: 'Purchase and manage digital sims', icon: <CreditCard size={18} />, view: 'services' },
    { id: 'edu', title: 'Education', subtitle: 'Pay for WAEC, JAMB and more', icon: <GraduationCap size={18} />, view: 'services' },
  ];

  const filteredSearchItems = useMemo(() => {
    if (!searchQuery) return searchableItems;
    return searchableItems.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Auto-slide banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const quickServices = [
    { name: 'Airtime', icon: <Smartphone className="text-[#FFB400]" size={20} />, type: 'airtime' },
    { name: 'Electricity', icon: <Lightbulb className="text-red-400" size={20} />, type: 'electricity' },
    { name: 'Education', icon: <GraduationCap className="text-green-500" size={20} /> },
    { name: 'e-Sim', icon: <CreditCard className="text-red-400" size={20} /> },
    { name: 'Gift card', icon: <Gift className="text-orange-400" size={20} /> },
    { name: 'Internet', icon: <Wifi className="text-red-500" size={20} />, type: 'airtime' },
    { name: 'Betting', icon: <Trophy className="text-green-600" size={20} /> },
    { name: 'Tickets', icon: <Ticket className="text-red-400" size={20} /> },
    { name: 'Intl', icon: <Globe className="text-orange-300" size={20} /> },
    { name: 'TV', icon: <TvIcon className="text-green-400" size={20} />, type: 'tv' },
  ];

  const banners = [
    {
      title: "Double Your Data This Week!",
      subtitle: "Get 100% extra data on select bundles",
      bg: "bg-gradient-to-r from-[#FFB400] to-[#FFD000]",
      img: "https://firebasestorage.googleapis.com/v0/b/octen-29d12.appspot.com/o/presentations%2FmzUgYypZ0JXaU4ldbXQHVUwg5vj1%2FRRpof%2F1767526979937_pana.png?alt=media&token=19bf3736-f44f-4058-8691-b6b56cb8adf8",
      cta: "View Bundles"
    },
    {
      title: "Skip the Bill Stress!",
      subtitle: "Pay bills & win Netflix for a year",
      bg: "bg-gradient-to-r from-[#6338F9] to-[#8E6FFF]",
      img: "https://i.pravatar.cc/150?u=sedi",
      cta: "JAAN Now"
    }
  ];

  const oneTapServices = [
    { name: 'BEDC', logo: '/media/bedc.jpg' },
    { name: 'GOtv', logo: '/media/gotv.jpg' },
    { name: 'Netflix', logo: '/media/netflix.jpg' },
    { name: 'Sporty Bet', logo: '/media/sportybet.png' },
    { name: 'Spotify', logo: '/media/spotify.png' },
  ];

  const transactions = [
    { title: 'MTN Airtime Recharge', time: 'Today, 10:30 AM', amount: '-₦500', icon: <Smartphone size={16} className="text-[#6338F9]" />, color: 'text-red-500' },
    { title: 'JAAN Wallet Top Up', time: 'Yesterday, 2:00 PM', amount: '+₦1,500', icon: <img src="/media/flame.png" className="w-4 h-4" />, color: 'text-green-500' }
  ];

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('9962802191');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navigateToView = (view: DashboardView) => {
    setPreviousView(activeView);
    setActiveView(view);
    setIsSearchOpen(false);
  };

  const handleSearchSelect = (item: SearchItem) => {
    if (item.isSupport) {
      onNavigateSupport?.();
      setIsSearchOpen(false);
    } else {
      navigateToView(item.view);
    }
  };

  const isDetailView = activeView === 'airtime' || activeView === 'electricity' || activeView === 'tv' || activeView === 'profile';

  const renderHome = () => (
    <div className="flex-1 overflow-y-auto no-scrollbar pb-32 bg-[#F8F9FB]">
      {/* Enhanced Balance Card */}
      <div className="px-5 pt-4 mb-8">
        <div className="rounded-[2.5rem] overflow-hidden shadow-xl shadow-purple-100/40">
          <div className="bg-gradient-to-br from-[#8E6FFF] via-[#6338F9] to-[#5129D1] p-6 text-white relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 opacity-60">
                <span className="text-[10px] font-bold uppercase tracking-widest">Balance</span>
                <button onClick={() => setShowBalance(!showBalance)}>
                  {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowTopUp(true); }}
                className="bg-white px-5 py-2 rounded-xl text-[#6338F9] text-[11px] font-black flex items-center gap-1 active:scale-95 transition-all shadow-sm"
              >
                <span className="text-xs">+</span> Top Up
              </button>
            </div>
            
            <h2 className="text-[28px] font-black tracking-tight mb-4">
              {showBalance ? '₦16,500.00' : '₦ • • • • • •'}
            </h2>
            
            <div className="pt-4 border-t border-white/10">
              <p className="text-[8px] font-bold text-white/40 uppercase tracking-widest mb-1">Account Details: PAYSTACK- TITAN-</p>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-black tracking-widest">9962802191</span>
                <span className="text-[8px] font-black bg-white/10 px-2 py-0.5 rounded-md uppercase text-white/60">(JAAN /SEDI RAHEEM)</span>
              </div>
            </div>
          </div>
          <div className="bg-[#FFB400] px-6 py-3 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-[8px] text-[#111]/30 font-black uppercase tracking-widest">JTokens</p>
              <p className="text-[18px] font-black text-[#111] leading-tight">132</p>
            </div>
            <button className="bg-[#6338F9] text-white px-5 py-2.5 rounded-2xl font-black text-[10px] shadow-sm active:scale-95 transition-all">Convert</button>
          </div>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="px-6 mb-8">
        <h3 className="font-black text-[#111] text-[14px] mb-5">Quick Access</h3>
        <div className="grid grid-cols-5 gap-y-6">
          {quickServices.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2.5 cursor-pointer" onClick={() => {
              if (s.type === 'airtime') navigateToView('airtime');
              else if (s.type === 'electricity') navigateToView('electricity');
              else if (s.type === 'tv') navigateToView('tv');
              else navigateToView('services');
            }}>
              <div className="w-12 h-12 bg-white rounded-[1.2rem] shadow-sm flex items-center justify-center border border-gray-100/50 active:scale-90 transition-all">
                {s.icon}
              </div>
              <span className="text-[9px] font-bold text-gray-500">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Banner Slider */}
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
          <div className="flex justify-center gap-1.5 mt-4">
             {[0, 1, 2, 3, 4].map((dot) => (
               <div key={dot} className={`h-1.5 rounded-full transition-all duration-300 ${currentBanner === dot ? 'w-6 bg-[#FFB400]' : 'w-1.5 bg-gray-200'}`} />
             ))}
          </div>
        </div>
      </div>

      {/* One Tap Pay */}
      <div className="px-6 mb-8">
        <h3 className="font-black text-[#111] text-[14px] mb-5">One Tap Pay</h3>
        <div className="flex justify-between">
          {oneTapServices.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-14 h-14 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center p-2.5 active:scale-95 transition-all">
                <img src={s.logo} className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="text-[9px] font-bold text-gray-500">{s.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-6 pb-10">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-black text-[#111] text-[14px]">Recent Transactions</h3>
          <button className="text-[#6338F9] text-[11px] font-black">see all</button>
        </div>
        <div className="bg-white rounded-[2rem] p-5 space-y-6 shadow-sm border border-gray-100/50">
          {transactions.map((t, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F8F9FB] flex items-center justify-center">
                  {t.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-[#111]">{t.title}</span>
                  <span className="text-[10px] font-bold text-gray-300">{t.time}</span>
                </div>
              </div>
              <span className={`text-[12px] font-black ${t.color}`}>{t.amount}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB] relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Top Header */}
      {!isDetailView && activeView !== 'more' && (
        <div className="px-6 pt-12 pb-5 flex items-center justify-between bg-white border-b border-gray-0 sticky top-0 z-40">
          <div className="flex items-center gap-3" onClick={() => navigateToView('profile')}>
            <div className="w-10 h-10 rounded-full border-2 border-purple-50 p-0.5 overflow-hidden shadow-sm">
              <img src="https://i.pravatar.cc/150?u=sedi" alt="profile" className="w-full h-full object-cover" />
            </div>
            <span className="font-black text-[#111] text-[15px]">Hi, Sedi</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsSearchOpen(true)} className="p-2 text-gray-800 active:bg-gray-100 rounded-full transition-colors"><Search size={22} /></button>
            <button className="p-2 text-gray-800 active:bg-gray-100 rounded-full transition-colors"><HelpCircle size={22} /></button>
            <button onClick={() => onNavigateNotifications?.()} className="p-2 text-gray-800 active:bg-gray-100 rounded-full transition-colors relative">
              <Bell size={22} />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF4B4B] rounded-full border-2 border-white shadow-sm"></div>
            </button>
          </div>
        </div>
      )}

      {/* View Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {activeView === 'home' && renderHome()}
          {activeView === 'services' && (
            <Services 
              onSelectAirtime={() => navigateToView('airtime')} 
              onSelectTV={() => navigateToView('tv')}
              onSelectService={(s) => { if (s === 'Electricity') navigateToView('electricity'); }} 
            />
          )}
          {activeView === 'airtime' && <Airtime onBack={() => setActiveView(previousView)} />}
          {activeView === 'electricity' && <Electricity onBack={() => setActiveView(previousView)} onContinue={() => {}} />}
          {activeView === 'tv' && <TV onBack={() => setActiveView(previousView)} />}
          {activeView === 'more' && <More onLogout={onLogout} onViewProfile={() => navigateToView('profile')} onSupport={onNavigateSupport} />}
          {activeView === 'profile' && <Profile onBack={() => setActiveView(previousView)} />}
        </motion.div>
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm z-[200] flex flex-col p-4 pt-12"
          >
            <motion.div 
              initial={{ y: -50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -50, scale: 0.95 }}
              className="bg-white rounded-[2.5rem] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
            >
              {/* Search Bar inside Modal */}
              <div className="p-5 pb-2">
                <div className="bg-[#F8F9FB] rounded-[1.8rem] p-4 flex items-center gap-3 border border-gray-100 shadow-sm">
                  <Search size={20} className="text-gray-300" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search for services" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-[15px] font-bold text-[#111] placeholder:text-gray-300" 
                  />
                  <div className="flex items-center gap-2">
                    <button className="text-gray-300 hover:text-gray-500"><Sliders size={18} /></button>
                    <div className="w-px h-5 bg-gray-100 mx-1"></div>
                    <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-[#111] transition-colors"><X size={20} /></button>
                  </div>
                </div>
              </div>

              {/* Search Results */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-3 pt-0">
                <div className="space-y-1">
                  {filteredSearchItems.map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => handleSearchSelect(item)}
                      className="w-full flex items-center gap-4 p-4 rounded-3xl hover:bg-gray-50 active:bg-gray-100 transition-all text-left group"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-[#F8F9FB] flex items-center justify-center group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-100">
                        <div className="text-[#6338F9]">
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[14px] font-black text-[#111]">{item.title}</h4>
                        <p className="text-[11px] font-bold text-gray-400">{item.subtitle}</p>
                      </div>
                    </button>
                  ))}
                  {filteredSearchItems.length === 0 && (
                    <div className="py-10 text-center flex flex-col items-center">
                       <Search size={32} className="text-gray-200 mb-2" />
                       <p className="text-gray-400 font-bold text-[13px]">No services found matching "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <AnimatePresence>
        {!isDetailView && (
          <motion.div 
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            className="fixed bottom-0 left-0 right-0 h-24 bg-white border-t border-gray-100 flex items-center justify-around px-4 pb-4 z-[100]"
          >
             <NavItem label="Home" active={activeView === 'home'} onClick={() => setActiveView('home')}><LayoutGrid size={22} strokeWidth={2.5} /></NavItem>
             <NavItem label="Schedule"><Clock size={22} strokeWidth={2.5} /></NavItem>
             
             <div className="relative -top-8">
                <div className="w-18 h-18 bg-[#F8F9FB] rounded-full p-1 shadow-inner">
                   <div 
                    onClick={() => navigateToView('services')}
                    className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center active:scale-90 transition-all border-4 border-white ${activeView === 'services' ? 'bg-[#6338F9]' : 'bg-white'}`}
                   >
                      <img src="/media/flame.png" className={`w-8 h-8 object-contain ${activeView === 'services' ? '' : 'grayscale opacity-60'}`} />
                   </div>
                </div>
             </div>

             <NavItem label="Coupon"><CouponIcon size={22} strokeWidth={2.5} /></NavItem>
             <NavItem label="More" active={activeView === 'more'} onClick={() => navigateToView('more')}><MoreHorizontal size={22} strokeWidth={2.5} /></NavItem>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Up Bottom Sheet */}
      <AnimatePresence>
        {showTopUp && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md z-[150] flex flex-col justify-end"
            onClick={() => setShowTopUp(false)}
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bg-white rounded-t-[3rem] p-8 pb-12 shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-8"></div>
              <h3 className="font-black text-[#111] text-[20px] mb-8">Top Up Options</h3>
              <div className="bg-[#F2F3F5] p-1.5 rounded-[1.8rem] flex items-center mb-8">
                {(['bank', 'card', 'coupon'] as const).map((tab) => (
                  <button key={tab} onClick={() => setTopUpTab(tab)} className={`flex-1 py-3.5 rounded-[1.4rem] text-[12px] font-black transition-all ${topUpTab === tab ? 'bg-white shadow-sm text-[#111]' : 'text-gray-400'}`}>
                    {tab === 'bank' ? 'Transfer' : tab === 'card' ? 'Card' : 'Coupon'}
                  </button>
                ))}
              </div>
              <div className="pb-4">
                {topUpTab === 'bank' && (
                  <div className="flex flex-col items-center text-center">
                    <p className="text-[14px] font-bold text-gray-800 mb-8 px-4">Fund your wallet by transferring to the account below</p>
                    <div className="space-y-4 mb-10">
                      <h4 className="text-[20px] font-black text-[#111]">Abraham Adesanya</h4>
                      <h4 className="text-[20px] font-black text-[#111]">Premium Trust Bank</h4>
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-[24px] font-black text-[#111] tracking-widest">9962802191</span>
                        <button onClick={handleCopyAccount} className={`p-2 rounded-full ${copied ? 'bg-green-50' : ''}`}>
                          {copied ? <Check size={22} className="text-green-500" strokeWidth={3} /> : <Copy size={22} className="text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    <button className="w-full bg-[#6338F9] text-white py-5 rounded-[2rem] font-black text-[16px] shadow-xl active:scale-[0.98] transition-all">Money Sent</button>
                  </div>
                )}
                {topUpTab !== 'bank' && <p className="text-center py-10 font-bold text-gray-400">Option Coming Soon...</p>}
              </div>
            </motion.div>
          </motion.div>
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
