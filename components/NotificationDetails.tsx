
import React from 'react';
import { motion } from 'framer-motion';
// Fixed: Added missing Flame icon import
import { ChevronLeft, Share2, Download, Copy, CheckCircle2, AlertCircle, XCircle, Clock, Flame } from 'lucide-react';
import { JaanLogo } from './Icons';

interface Props {
  type: 'referral' | 'receipt';
  title: string;
  amount: string;
  status?: 'success' | 'failed' | 'pending';
  transactionDetails: Record<string, string>;
  onBack: () => void;
}

const NotificationDetails: React.FC<Props> = ({ type, title, amount, status = 'success', transactionDetails, onBack }) => {
  const isReward = type === 'referral';

  const getStatusIcon = () => {
    switch (status) {
      case 'failed': return <XCircle size={16} className="text-[#FF4B4B]" />;
      case 'pending': return <Clock size={16} className="text-orange-400" />;
      default: return <CheckCircle2 size={16} className="text-[#34C759]" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'failed': return <span className="text-[#FF4B4B] font-black text-sm">Failed</span>;
      case 'pending': return <span className="text-orange-400 font-black text-sm">Pending</span>;
      default: return <span className="text-[#34C759] font-black text-sm">Successful</span>;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB] relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="pt-12 pb-5 px-6 flex items-center justify-between sticky top-0 z-50 bg-[#F8F9FB]">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-[#111]" />
        </button>
        <h2 className="text-[15px] font-black text-[#111]">
          {isReward ? 'Reward Notification' : 'Transaction Receipt'}
        </h2>
        {!isReward && status === 'failed' ? (
          <button className="p-2 text-red-500 active:bg-red-50 rounded-full">
            <AlertCircle size={22} />
          </button>
        ) : (
          <div className="w-10" />
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-10">
        {/* Main Status Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2.5rem] p-8 text-center shadow-xl shadow-gray-100 border border-gray-100/30 mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-6 opacity-30">
            <JaanLogo className="w-4 h-4" color="#FFA500" />
            <span className="text-[#6338F9] font-black text-xs tracking-widest">JAAN</span>
          </div>

          <p className="text-[12px] font-black text-gray-400 mb-2 leading-tight uppercase tracking-wider">{title}</p>
          <h1 className="text-3xl font-black text-[#111] mb-2">{amount}</h1>
          <div className="flex items-center justify-center gap-1.5 bg-gray-50 w-fit mx-auto px-4 py-1.5 rounded-full">
             {getStatusIcon()}
             {getStatusText()}
          </div>
        </motion.div>

        {/* Transaction Details Table */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/30 mb-6"
        >
          <h3 className="font-black text-[#111] text-[15px] mb-6">Details</h3>
          <div className="space-y-6">
            {Object.entries(transactionDetails).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start gap-4">
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{key}</span>
                <div className="flex items-center gap-1.5 text-right flex-1 justify-end">
                  <span className="text-[12px] font-black text-[#111] break-all">{value}</span>
                  {(key.includes('ID') || key.includes('Reference')) && <Copy size={12} className="text-purple-300 flex-shrink-0" />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Contextual Box */}
        {isReward ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#6338F9] to-[#8E6FFF] rounded-[2rem] p-6 shadow-xl shadow-purple-100 mb-6 flex flex-col items-center gap-4 text-white"
          >
             <Flame size={32} className="text-orange-300 fill-orange-300" />
             <p className="text-[11px] font-bold text-center opacity-80">Keep using JAAN to earn more JTokens. Invite friends to multiply your rewards!</p>
             <div className="flex items-center gap-3 bg-white/10 rounded-2xl px-6 py-4 w-full justify-between backdrop-blur-md">
                <span className="text-[14px] font-black tracking-widest">INVITE FRIENDS</span>
                <Copy size={20} className="text-white" />
             </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/30 mb-6 flex flex-col items-center gap-4"
          >
             <div className="w-full flex items-center justify-between">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Need help with this txn?</p>
                <button className="text-[#6338F9] text-[11px] font-black">Support</button>
             </div>
             <div className="h-px bg-gray-50 w-full" />
             <div className="grid grid-cols-2 gap-4 w-full">
               <button className="bg-[#F8F9FB] rounded-2xl py-4 flex items-center justify-center gap-2 font-black text-xs text-[#111] active:bg-gray-100 transition-colors">
                  <Download size={16} /> Receipt
               </button>
               <button className="bg-[#F8F9FB] rounded-2xl py-4 flex items-center justify-center gap-2 font-black text-xs text-[#111] active:bg-gray-100 transition-colors">
                  <Share2 size={16} /> Share
               </button>
             </div>
          </motion.div>
        )}

        {/* Done Button */}
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onBack}
          className="w-full bg-[#6338F9] text-white py-5 rounded-[2rem] font-black text-[15px] shadow-xl shadow-purple-200 active:scale-[0.98] transition-all"
        >
          Dismiss
        </motion.button>
      </div>
    </div>
  );
};

export default NotificationDetails;
