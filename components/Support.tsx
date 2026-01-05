
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Search, ChevronDown, Mail, Instagram, MessageCircle, Users, Star, AlertCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const Support: React.FC<Props> = ({ onBack }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    { id: 0, q: "How do I fund my wallet?", a: "You can fund your wallet via bank transfer or by using a debit card within the app. Navigate to the top-up button on your dashboard." },
    { id: 1, q: "How do I reset my password?", a: "On the login screen, tap 'Forgot Password?' and enter your email or phone number. We'll send you instructions to reset your password." },
    { id: 2, q: "How to purchase data", a: "Select the 'Internet' icon on the dashboard, pick your provider and bundle, and pay with your JAAN wallet balance." },
    { id: 3, q: "What are the accepted payment methods?", a: "We accept JAAN wallet balance, direct bank transfers, and standard debit/credit cards." },
    { id: 4, q: "Data plan comparisons", a: "You can view and compare data plans by selecting your provider in the Internet section. We offer various bundles for all networks." },
  ];

  const filteredFaqs = useMemo(() => {
    if (!searchQuery) return faqs;
    const query = searchQuery.toLowerCase();
    return faqs.filter(f => 
      f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col h-full bg-[#F8F9FB] relative overflow-hidden font-['Plus_Jakarta_Sans']">
      <div className="bg-[#6338F9] pt-12 pb-8 px-6 rounded-b-[2.5rem] shadow-xl shadow-purple-100">
        <div className="flex items-center justify-between text-white mb-6">
          <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-white/10 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-black">Support</h2>
          <div className="w-10" />
        </div>

        <div className="flex items-center gap-4 text-white mb-6">
          <div className="w-12 h-12 rounded-full border-2 border-white/20 p-0.5 overflow-hidden">
            <img src="https://i.pravatar.cc/150?u=sedi" className="w-full h-full rounded-full object-cover" />
          </div>
          <div>
            <h3 className="font-black text-base">Hello, Sedi</h3>
            <p className="text-[11px] font-bold text-white/60">Need help? We're here to assist you.</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl flex items-center gap-3 px-4 py-3 shadow-lg shadow-black/5">
          <Search size={18} className="text-gray-300" />
          <input 
            type="text" 
            placeholder="Search for help" 
            className="flex-1 bg-transparent outline-none font-bold text-[13px] text-[#111] placeholder:text-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-[#111] text-[15px]">FAQs</h3>
          <button className="text-[11px] font-black text-[#6338F9]">see all</button>
        </div>

        <div className="space-y-3 mb-8">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100/50 shadow-sm">
                <button 
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left active:bg-gray-50 transition-colors"
                >
                  <span className={`text-[12px] font-black tracking-tight ${activeFaq === faq.id ? 'text-[#6338F9]' : 'text-[#111]'}`}>
                    {faq.q}
                  </span>
                  <ChevronDown 
                    size={16} 
                    className={`text-gray-400 transition-transform duration-300 ${activeFaq === faq.id ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {activeFaq === faq.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-[11px] font-medium text-gray-500 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-10 opacity-40 text-center">
              <AlertCircle size={32} className="text-gray-400 mb-2" />
              <p className="text-[12px] font-bold text-gray-500">No FAQs match your search</p>
            </div>
          )}
        </div>

        <h3 className="font-black text-[#111] text-[15px] mb-4">Contact JAAN</h3>
        <div className="grid grid-cols-3 gap-3 mb-8">
          <ContactButton icon={<MessageCircle size={20} className="text-[#34C759]" />} label="Whatsapp Us" />
          <ContactButton icon={<Mail size={20} className="text-[#FF4B4B]" />} label="Send Us A Mail" />
          <ContactButton icon={<Instagram size={20} className="text-[#C13584]" />} label="Instagram DM" />
        </div>

        <div className="grid grid-cols-2 gap-3 pb-4">
           <button className="flex items-center justify-center gap-2 bg-[#D1FFD7] px-4 py-4 rounded-2xl text-[#111] font-black text-[12px] shadow-sm active:scale-[0.98] transition-all">
              <Users size={18} strokeWidth={2.5} /> Join Our Community
           </button>
           <button className="flex items-center justify-center gap-2 bg-white px-4 py-4 rounded-2xl text-[#111] font-black text-[12px] shadow-sm border border-gray-100 active:scale-[0.98] transition-all">
              <Star size={18} className="text-yellow-400 fill-yellow-400" /> Rate App
           </button>
        </div>
      </div>
    </div>
  );
};

const ContactButton = ({ icon, label }: any) => (
  <button className="bg-white p-3.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 shadow-sm border border-gray-100 active:scale-95 transition-all">
    {icon}
    <span className="text-[9px] font-black text-gray-400 text-center leading-tight">{label}</span>
  </button>
);

export default Support;
