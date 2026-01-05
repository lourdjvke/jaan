
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Share2, Download, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { JaanLogo } from './Icons';

interface Props {
  type: 'referral' | 'receipt';
  title: string;
  amount: string;
  transactionDetails: Record<string, string>;
  onBack: () => void;
}

const NotificationDetails: React.FC<Props> = ({ type, title, amount, transactionDetails, onBack }) => {
  return (
    <div className="flex flex-col h-full bg-[#F8F9FB] relative overflow-hidden font-['Plus_Jakarta_Sans']">
      {/* Header */}
      <div className="pt-12 pb-5 px-6 flex items-center justify-between sticky top-0 z-50 bg-transparent">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-gray-100 transition-colors">
          <ChevronLeft size={24} className="text-[#111]" />
        </button>
        <h2 className="text-[15px] font-black text-[#111]">
          {type === 'referral' ? 'Notification Details' : 'Transaction Receipt'}
        </h2>
        {type === 'receipt' ? (
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
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] p-8 text-center shadow-sm mb-6 border border-gray-100/30"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <JaanLogo className="w-4 h-4" color="#FFA500" />
            <span className="text-[#6338F9] font-black text-sm tracking-widest">JAAN</span>
          </div>

          <p className="text-[13px] font-bold text-gray-400 mb-2 leading-tight">{title}</p>
          <h1 className="text-3xl font-black text-[#111] mb-2">{amount}</h1>
          <div className="flex items-center justify-center gap-1.5">
             <span className="text-[#34C759] font-black text-sm">Successful</span>
             <CheckCircle2 size={16} className="text-[#34C759]" />
          </div>
        </motion.div>

        {/* Transaction Details Table */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/30 mb-6"
        >
          <h3 className="font-black text-[#111] text-[15px] mb-6">Transaction Details</h3>
          <div className="space-y-6">
            {Object.entries(transactionDetails).map(([key, value]) => (
              <div key={key} className="flex justify-between items-start gap-4">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{key}</span>
                <div className="flex items-center gap-1.5 text-right">
                  <span className="text-[12px] font-black text-[#111]">{value}</span>
                  {key === 'Transaction ID' && <Copy size={12} className="text-gray-300" />}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Box */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100/30 mb-6 flex flex-col items-center gap-3"
        >
           <p className="text-[10px] font-bold text-gray-400">Share your Referral Code with more friends to earn more Bonus</p>
           <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-6 py-4 w-full justify-between">
              <span className="text-[15px] font-black text-[#111] tracking-widest">JAANREF123</span>
              <Copy size={20} className="text-[#6338F9]" />
           </div>
        </motion.div>

        {/* Download/Share Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
           <button className="bg-white rounded-2xl py-4 flex items-center justify-center gap-2 font-black text-sm text-[#111] shadow-sm border border-gray-100 active:bg-gray-50 transition-colors">
              <Download size={18} /> Download
           </button>
           <button className="bg-white rounded-2xl py-4 flex items-center justify-center gap-2 font-black text-sm text-[#111] shadow-sm border border-gray-100 active:bg-gray-50 transition-colors">
              <Share2 size={18} /> Share
           </button>
        </motion.div>

        {/* Done Button */}
        <motion.button 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={onBack}
          className="w-full bg-[#6338F9] text-white py-5 rounded-[2rem] font-black text-[15px] shadow-xl shadow-purple-200 active:scale-[0.98] transition-all"
        >
          Done
        </motion.button>
      </div>
    </div>
  );
};

export default NotificationDetails;
