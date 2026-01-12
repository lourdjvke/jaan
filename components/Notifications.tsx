
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Smartphone, Lightbulb, Tv, Flame, Settings, ChevronRight, Banknote, Globe, Inbox, Zap, CreditCard } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { ref, onValue } from 'firebase/database';

interface Props {
  onBack: () => void;
  onSelectNotif?: (props: any) => void;
}

const Notifications: React.FC<Props> = ({ onBack, onSelectNotif }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;
    const transRef = ref(db, `users/${auth.currentUser.uid}/transactions`);
    
    return onValue(transRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Convert object to array and sort by date descending
        const list = Object.entries(data).map(([id, val]: [string, any]) => ({
          id,
          ...val
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTransactions(list);
      } else {
        setTransactions([]);
      }
      setLoading(false);
    });
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <Banknote className="text-emerald-500" size={18} />;
      case 'airtime':
      case 'data': return <Smartphone className="text-blue-500" size={18} />;
      case 'electricity': return <Zap className="text-orange-400" size={18} />;
      case 'tv': return <Tv className="text-purple-500" size={18} />;
      case 'jtoken': return <Flame className="text-orange-500" size={18} />;
      case 'intl': return <Globe className="text-indigo-500" size={18} />;
      default: return <CreditCard className="text-gray-400" size={18} />;
    }
  };

  const handleSelect = (t: any) => {
    if (!onSelectNotif) return;

    const isReward = t.type === 'jtoken';
    const isCredit = t.amount > 0 || t.type === 'deposit' || t.type === 'jtoken';
    
    const details: Record<string, string> = {
      'Transaction Type': t.type.toUpperCase(),
      'Status': (t.status || 'Success').toUpperCase(),
      'Date': new Date(t.date).toLocaleString(),
      'Transaction ID': t.id.slice(-12).toUpperCase(),
    };

    if (t.requestId) details['Request ID'] = t.requestId;
    if (t.reason) details['Error Info'] = t.reason;

    onSelectNotif({
      type: isReward ? 'referral' : 'receipt',
      title: t.title,
      amount: t.type === 'jtoken' ? `+${t.amount} JTokens` : (t.amount < 0 ? '-' : '+') + new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Math.abs(t.amount)),
      status: t.status || 'success',
      transactionDetails: details
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB] relative overflow-hidden font-['Plus_Jakarta_Sans']">
      <div className="bg-white pt-12 pb-5 px-6 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-[#111]" />
        </button>
        <h2 className="text-lg font-black text-[#111]">Notifications</h2>
        <button className="p-2 rounded-full active:bg-gray-100 transition-colors">
          <Settings size={22} className="text-[#111]" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 opacity-40">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Flame size={32} />
            </motion.div>
            <p className="text-[12px] font-bold mt-4">Syncing your activity...</p>
          </div>
        ) : transactions.length > 0 ? (
          transactions.map((t, i) => (
            <motion.div 
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => handleSelect(t)}
              className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100/50 flex flex-col gap-3 cursor-pointer active:bg-gray-50 transition-all active:scale-[0.98]"
            >
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-inner">
                  {getIcon(t.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-black text-[#111] text-sm tracking-tight">{t.title}</h4>
                    {t.status === 'failed' && (
                      <span className="text-[8px] font-black bg-red-50 text-red-500 px-2 py-0.5 rounded-md uppercase">Failed</span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400 font-bold leading-relaxed mb-3 line-clamp-1">
                    {t.type === 'jtoken' ? `You earned ${t.amount} JTokens reward.` : `A transaction of ${new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Math.abs(t.amount))} was processed.`}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                    <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">{new Date(t.date).toLocaleDateString()} • {new Date(t.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <button className="text-[10px] font-black text-[#6338F9] flex items-center gap-0.5">
                      View Details <ChevronRight size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 opacity-30 text-center">
            <Inbox size={48} />
            <h3 className="text-lg font-black mt-4">No Notifications</h3>
            <p className="text-sm font-bold">Your transaction alerts will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
