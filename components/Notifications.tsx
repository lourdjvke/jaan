
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Smartphone, Lightbulb, Tv, Flame, Settings, ChevronRight } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSelectNotif?: (props: any) => void;
}

const Notifications: React.FC<Props> = ({ onBack, onSelectNotif }) => {
  const notifications = [
    { 
      type: 'receipt',
      title: "MTN 125GB MiFi Bundle", 
      desc: "Get 350% bonus on your MTN Airtime today Recharge from N1- N99 on JAAN! Enjoy more airtime for your calls, data, and SMS.", 
      time: "10:15 AM, February 5, 2025", 
      icon: <Smartphone className="text-orange-400" size={18} />,
      isOffer: true
    },
    { 
      type: 'referral',
      title: "Referral bonus for AISHA BELLO WILLIAMS", 
      desc: "Congratulations! You've earned 5 JTokens for referring a friend to JAAN. The bonus has been added to your JAAN wallet.", 
      time: "12:30 PM, January 10, 2025", 
      icon: <Flame className="text-orange-400" size={18} /> 
    },
    { 
      type: 'receipt',
      title: "Payment Successful!", 
      desc: "Your payment of N5,000 to Benin Electricity Distribution Company for your electricity bill has been successfully processed.", 
      time: "07:50 AM, January 9, 2025", 
      icon: <Lightbulb className="text-orange-400" size={18} /> 
    }
  ];

  const handleSelect = (n: any) => {
    if (onSelectNotif) {
      if (n.type === 'referral') {
        onSelectNotif({
          type: 'referral',
          title: n.title,
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
        onSelectNotif({
          type: 'receipt',
          title: n.title,
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
    }
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
        {notifications.map((n, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => handleSelect(n)}
            className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100/30 flex flex-col gap-3 cursor-pointer active:bg-gray-50 transition-colors"
          >
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100">
                {n.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-[#111] text-sm tracking-tight">{n.title}</h4>
                  {n.isOffer && <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>}
                </div>
                <p className="text-[12px] text-gray-500 font-medium leading-relaxed mb-3 line-clamp-2">
                  {n.desc}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{n.time}</span>
                  <button className="text-[11px] font-black text-[#6338F9] flex items-center gap-0.5">
                    View <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
