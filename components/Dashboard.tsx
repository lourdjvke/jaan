
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Bell, Eye, EyeOff, 
  Smartphone, Lightbulb, GraduationCap, CreditCard, Gift, 
  Wifi, Trophy, Ticket, Globe, Tv, 
  Settings2, ChevronRight, LayoutGrid, Clock, Ticket as Coupon, MoreHorizontal,
  CheckCircle2, Flame, LifeBuoy, AlertCircle
} from 'lucide-react';
import { JaanLogo } from './Icons';

interface Props {
  onLogout: () => void;
  onNavigateSupport?: () => void;
  onNavigateNotifications?: () => void;
  onNavigateNotifDetails?: (props: any) => void;
}

const Dashboard: React.FC<Props> = ({ onLogout, onNavigateSupport, onNavigateNotifications, onNavigateNotifDetails }) => {
  const [showBalance, setShowBalance] = useState(true);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  const services = [
    { name: 'Airtime', icon: <Smartphone className="text-orange-400" size={24} strokeWidth={1.5} />, desc: 'Top up your mobile credit instantly' },
    { name: 'Electricity', icon: <Lightbulb className="text-red-400" size={24} strokeWidth={1.5} />, desc: 'Pay for AEDC, EKEDC, BEDC, and more' },
    { name: 'Education', icon: <GraduationCap className="text-green-500" size={24} strokeWidth={1.5} />, desc: 'JAMB, WAEC, and School fees' },
    { name: 'e-Sim', icon: <CreditCard className="text-red-400" size={24} strokeWidth={1.5} />, desc: 'Digital SIM activation' },
    { name: 'Gift card', icon: <Gift className="text-orange-400" size={24} strokeWidth={1.5} />, desc: 'Buy global brand gift cards' },
    { name: 'Internet', icon: <Wifi className="text-red-500" size={24} strokeWidth={1.5} />, desc: 'Data bundles for all networks' },
    { name: 'Betting', icon: <Trophy className="text-green-600" size={24} strokeWidth={1.5} />, desc: 'Fund your betting wallets' },
    { name: 'Tickets', icon: <Ticket className="text-red-400" size={24} strokeWidth={1.5} />, desc: 'Event and travel ticket booking' },
    { name: 'Intl', icon: <Globe className="text-orange-300" size={24} strokeWidth={1.5} />, desc: 'International airtime & data' },
    { name: 'TV', icon: <Tv className="text-green-400" size={24} strokeWidth={1.5} />, desc: 'GOTV, DSTV, Startimes subscriptions' },
  ];

  const oneTapPay = [
    { name: 'BEDC', icon: 'https://bedcpower.com/wp-content/uploads/2021/05/cropped-bedc-logo-1.png' },
    { name: 'GOTv', icon: 'https://logos-world.net/wp-content/uploads/2020/09/GoTV-Logo.png' },
    { name: 'Netflix', icon: 'https://cdn-icons-png.flaticon.com/512/5977/5977590.png' },
    { name: 'Sporty Bet', icon: 'https://seeklogo.com/images/S/sportybet-logo-F11B7C37A3-seeklogo.com.png' },
    { name: 'Spotify', icon: 'https://cdn-icons-png.flaticon.com/512/174/174872.png' },
  ];

  const transactions = [
    { title: 'MTN Airtime Recharge', time: 'Today, 10:30 AM', amount: '-₦500', isDebit: true, icon: <Smartphone size={18} className="text-[#6338F9]" /> },
    { title: 'JAAN Wallet Top Up', time: 'Yesterday, 2:00 PM', amount: '+₦1,500', isDebit: false, icon: <JaanLogo className="w-5 h-5" color="#6338F9" /> },
  ];

  const filteredServices = useMemo(() => {
    if (!searchQuery) return services;
    return services.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleNotifClick = (type: 'referral' | 'receipt') => {
    setShowNotifications(false);
    if (type === 'referral') {
      onNavigateNotifDetails?.({
        type: 'referral',
        title: 'Referral bonus for AISHA BELLO WILLIAMS',
        amount: '5 JTokens',
        transactionDetails: {
          'Transaction Type': 'Referral Bonus',
          'Sender Details': 'JAAN Rewards',
          'Remark': 'JN/RWD/SEDI RAHEEM/TK/001234',
          'Credited To': 'JAAN Wallet',
          'Transaction ID': '202512098745621097',
          'Transaction Date': 'Feb 8th, 2025 19:44:34PM'
        }
      });
    } else {
      onNavigateNotifDetails?.({
        type: 'receipt',
        title: 'MTN 125GB MiFi Bundle',
        amount: '₦ 20,000',
        transactionDetails: {
          'Transaction Type': 'Internet Purchase',
          'Beneficiary': '09066414474/email@gmail.com',
          'Amount': '₦ 20,000',
          'Transaction Status': 'Success',
          'Transaction ID': '202512098745621097',
          'Transaction Date': 'Feb 8th, 2025 19:44:34PM'
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB] relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Search Overlay */}
      <AnimatePresence>
        {searchActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md z-[100] flex flex-col pt-12 px-6"
            onClick={() => setSearchActive(false)}
          >
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-[2.5rem] shadow-2xl p-4 flex flex-col max-h-[85%]"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 bg-gray-100/50 rounded-2xl px-4 py-4 mb-4 border border-gray-100">
                <Search size={20} className="text-gray-400" />
                <input 
                  autoFocus
                  type="text" 
                  placeholder="Search for services" 
                  className="bg-transparent flex-1 outline-none text-[#111] font-bold placeholder:text-gray-300"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
                <Settings2 size={18} className="text-gray-300" />
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 py-2">
                 {filteredServices.length > 0 ? (
                   filteredServices.map((service, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer active:bg-gray-50 p-2 rounded-xl transition-colors">
                       <div className="w-11 h-11 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100">
                          {React.cloneElement(service.icon as React.ReactElement, { size: 20 })}
                       </div>
                       <div className="flex-1">
                          <h4 className="font-bold text-[#111] text-[14px]">{service.name}</h4>
                          <p className="text-[10px] text-gray-400 font-medium">{service.desc}</p>
                       </div>
                    </div>
                   ))
                 ) : (
                   <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                      <AlertCircle size={48} strokeWidth={1.5} className="mb-4 text-gray-400" />
                      <p className="font-bold text-gray-500">No services found for "{searchQuery}"</p>
                   </div>
                 )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notifications Overlay */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm z-[90] pt-24 px-6 flex flex-col"
            onClick={() => setShowNotifications(false)}
          >
            <motion.div 
              initial={{ y: -10, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              className="bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[70%]"
              onClick={e => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                <h3 className="font-black text-[#111] text-lg">Notifications</h3>
                <button className="text-[12px] font-bold text-[#34C759] flex items-center gap-1">
                  <CheckCircle2 size={14} /> Mark all as read
                </button>
              </div>
              <div className="bg-gray-50 px-6 py-2 text-[11px] font-black text-gray-400 uppercase tracking-widest">Today</div>
              <div className="flex-1 overflow-y-auto no-scrollbar">
                <NotificationItem 
                  title="Special Offer!" 
                  desc="Get 350% bonus on your MTN Airtime today Recharge from N1- N99 on JAAN" 
                  time="2h ago"
                  icon={<Smartphone className="text-orange-400" size={18} />}
                  onClick={() => setShowOfferModal(true)}
                />
                <NotificationItem 
                  title="Electricity Bill Reminder" 
                  desc="Electricity bill due soon! Pay by 24/02/2025 to avoid disconnection." 
                  time="5h ago"
                  urgent
                  icon={<Lightbulb className="text-green-500" size={18} />}
                  onClick={() => handleNotifClick('receipt')}
                />
                <NotificationItem 
                  title="Referral Bonus" 
                  desc="You earned a referral bonus! 5 JTokens added to your wallet." 
                  time="7h ago"
                  icon={<Flame className="text-orange-400" size={18} />}
                  onClick={() => handleNotifClick('referral')}
                />
              </div>
              <button 
                onClick={() => {
                  setShowNotifications(false);
                  onNavigateNotifications?.();
                }}
                className="w-full py-5 text-center font-black text-[#6338F9] text-[13px] border-t border-gray-50 active:bg-gray-50"
              >
                View all notifications
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offer Modal */}
      <AnimatePresence>
        {showOfferModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-md z-[110] flex items-center justify-center p-8"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm relative text-center"
            >
              <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-yellow-200">
                <img src="https://logos-world.net/wp-content/uploads/2020/11/MTN-Logo.png" className="w-16 h-auto" />
              </div>
              <h3 className="font-black text-[#111] text-lg mb-2">Limited time Offer</h3>
              <div className="text-[28px] font-black text-[#111] mb-2 tracking-widest">01 : 13 : 45 : 27</div>
              <p className="text-[12px] font-bold text-gray-400 mb-8">350% MTN Airtime Bonus!</p>
              
              <div className="flex flex-col gap-3">
                <button className="w-full bg-[#6338F9] text-white py-4 rounded-2xl font-black text-sm shadow-xl shadow-purple-200 active:scale-95 transition-all">
                  Buy Now
                </button>
                <button onClick={() => setShowOfferModal(false)} className="w-full py-3 text-red-500 font-black text-sm active:opacity-60 transition-opacity">
                  No Thanks
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="px-6 pt-12 pb-4 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-100/50">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full border-2 border-purple-50 p-0.5 shadow-sm overflow-hidden">
             <img src="https://i.pravatar.cc/150?u=sedi" alt="profile" className="w-full h-full object-cover" />
          </div>
          <span className="font-extrabold text-[#111] text-[15px] tracking-tight">Hi, Sedi</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setSearchActive(true)} className="p-2.5 text-gray-700 active:bg-gray-100 rounded-full transition-colors"><Search size={22} strokeWidth={2} /></button>
          <button onClick={onNavigateSupport} className="p-2.5 text-gray-700 active:bg-gray-100 rounded-full transition-colors"><LifeBuoy size={22} strokeWidth={2} /></button>
          <button onClick={() => setShowNotifications(true)} className="p-2.5 text-gray-700 active:bg-gray-100 rounded-full transition-colors relative">
             <Bell size={22} strokeWidth={2} />
             <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#FF4B4B] rounded-full border-2 border-white shadow-sm"></div>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
        {/* Main Integrated Card - Ultra tight spacing */}
        <div className="px-6 pt-4 mb-5">
          <div className="rounded-[36px] overflow-hidden shadow-2xl shadow-purple-200/50">
            {/* Top Section: Balance - Reduced Padding */}
            <div className="bg-gradient-to-br from-[#734BFF] to-[#6338F9] p-4 text-white relative">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-white/50 tracking-wide uppercase">Balance</span>
                  <button onClick={() => setShowBalance(!showBalance)} className="text-white/30 hover:text-white transition-colors">
                    {showBalance ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
                <button className="bg-white px-2.5 py-1 rounded-xl text-[#6338F9] text-[8px] font-black flex items-center gap-1 shadow-md active:scale-95 transition-all">
                  <span className="text-xs font-bold">+</span> Top Up
                </button>
              </div>

              <h2 className="text-[26px] font-black tracking-tight mb-2 leading-none">
                {showBalance ? '₦16,500.00' : '₦ • • • • • •'}
              </h2>

              <div className="pt-2 border-t border-white/5">
                <p className="text-[7px] font-bold text-white/20 uppercase tracking-[0.1em] mb-0.5">Account Details: PAYSTACK- TITAN-</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-black tracking-[0.1em] leading-none opacity-90">9962802191</span>
                  <span className="text-[7px] font-black bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-tighter text-white/50">(JAAN /SEDI RAHEEM)</span>
                </div>
              </div>
            </div>

            {/* Bottom Section: JTokens - Tightened */}
            <div className="bg-[#FFB400] px-5 py-2 flex items-center justify-between">
              <div className="space-y-0">
                <p className="text-[8px] text-[#111]/25 font-black uppercase tracking-widest leading-none mb-0.5">JTokens</p>
                <p className="text-[17px] font-black text-[#111] leading-none">132</p>
              </div>
              <button className="bg-[#6338F9] text-white px-5 py-2 rounded-xl font-black text-[10px] shadow-sm active:scale-95 transition-all">
                Convert
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="px-6 mb-10">
           <h3 className="font-black text-[#111] text-[15px] mb-5 tracking-tight">Quick Access</h3>
           <div className="grid grid-cols-5 gap-y-7">
              {services.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer">
                   <div className="w-[48px] h-[48px] bg-white rounded-2xl shadow-sm flex items-center justify-center group-active:scale-90 transition-all border border-gray-100/50">
                      {s.icon}
                   </div>
                   <span className="text-[10px] font-bold text-[#777] tracking-tight">{s.name}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Promo Banners */}
        <div className="px-6 mb-10 overflow-x-auto no-scrollbar flex gap-4 snap-x snap-mandatory">
           <div className="min-w-[320px] bg-[#FFD700] rounded-[30px] p-5 flex items-center gap-4 relative overflow-hidden shadow-sm snap-center">
              <div className="flex-1 space-y-2 relative z-10">
                 <h4 className="font-black text-[#111] text-[15px] leading-snug">Double Your Data This Week!</h4>
                 <p className="text-[10px] font-bold text-[#111]/60 leading-tight">Get 100% extra data on select bundles</p>
                 <div className="flex gap-1.5 my-1">
                    <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                    <div className="w-4 h-4 rounded-full bg-green-400"></div>
                    <div className="w-4 h-4 rounded-full bg-red-400"></div>
                 </div>
                 <button className="bg-[#6338F9] text-white text-[10px] font-black px-4 py-2 rounded-xl mt-1 active:scale-95 transition-all">View Bundles</button>
              </div>
              <div className="w-20 h-24 relative z-10">
                <img src="https://i.pravatar.cc/150?u=promo" className="w-full h-full object-cover rounded-[16px]" />
              </div>
              <div className="absolute top-0 right-0 w-40 h-full bg-[#FFB700] skew-x-[-15deg] translate-x-16"></div>
           </div>
        </div>

        {/* One Tap Pay */}
        <div className="px-6 mb-10">
           <h3 className="font-black text-[#111] text-[15px] mb-6 tracking-tight">One Tap Pay</h3>
           <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {oneTapPay.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2.5 group cursor-pointer">
                   <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center p-3 border border-gray-100/50 group-active:scale-90 transition-all">
                      <img src={item.icon} alt={item.name} className="w-full h-full object-contain" />
                   </div>
                   <span className="text-[9px] font-bold text-[#777] tracking-tight">{item.name}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Recent Transactions */}
        <div className="px-6 mb-12">
           <div className="flex items-center justify-between mb-5">
              <h3 className="font-black text-[#111] text-[15px] tracking-tight">Recent Transactions</h3>
              <button className="text-[11px] font-black text-[#6338F9] tracking-tight">see all</button>
           </div>
           <div className="bg-white rounded-[28px] p-5 shadow-sm space-y-5 border border-gray-100/30">
              {transactions.map((t, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer" onClick={() => handleNotifClick('receipt')}>
                   <div className="w-11 h-11 bg-gray-50/80 rounded-xl flex items-center justify-center group-active:scale-95 transition-transform">
                      {t.icon}
                   </div>
                   <div className="flex-1">
                      <h4 className="font-extrabold text-[#111] text-[13px] leading-none mb-1">{t.title}</h4>
                      <p className="text-[10px] text-gray-400 font-bold">{t.time}</p>
                   </div>
                   <span className={`font-black text-[13px] ${t.isDebit ? 'text-[#FF4B4B]' : 'text-[#34C759]'}`}>
                     {t.amount}
                   </span>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Persistent Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-white/95 backdrop-blur-xl border-t border-gray-100/50 flex items-center justify-around px-4 pb-4 z-50">
         <NavItem label="Home" active><LayoutGrid size={22} strokeWidth={2.5} /></NavItem>
         <NavItem label="Schedule"><Clock size={22} strokeWidth={2.5} /></NavItem>
         
         {/* Center FAB */}
         <div className="relative -top-7">
            <div className="w-16 h-16 bg-[#F8F9FB] rounded-full flex items-center justify-center p-1 shadow-inner">
               <div className="w-full h-full bg-white rounded-full shadow-xl shadow-purple-200/50 flex items-center justify-center active:scale-90 transition-transform cursor-pointer border border-gray-100">
                  <JaanLogo className="w-8 h-8" color="#FFA500" />
               </div>
            </div>
         </div>

         <NavItem label="Coupon"><Coupon size={22} strokeWidth={2.5} /></NavItem>
         <NavItem label="More" onClick={onNavigateSupport}><MoreHorizontal size={22} strokeWidth={2.5} /></NavItem>
      </div>
    </div>
  );
};

const NotificationItem = ({ icon, title, desc, time, urgent, onClick }: any) => (
  <div 
    onClick={onClick}
    className={`px-6 py-4 flex gap-4 transition-colors active:bg-gray-50 ${urgent ? 'bg-[#34C759]/5' : ''} cursor-pointer`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${urgent ? 'bg-white border border-[#34C759]/20' : 'bg-white border border-gray-100'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <h4 className="font-black text-[#111] text-[13px]">{title}</h4>
        <span className="text-[10px] text-gray-400 font-bold">{time}</span>
      </div>
      <p className="text-[11px] text-gray-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </div>
);

const NavItem: React.FC<{ children: React.ReactNode, label: string, active?: boolean, onClick?: () => void }> = ({ children, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${active ? 'text-[#6338F9] translate-y-[-2px]' : 'text-gray-300'}`}>
    {children}
    <span className="text-[10px] font-black tracking-tighter uppercase">{label}</span>
  </button>
);

export default Dashboard;
