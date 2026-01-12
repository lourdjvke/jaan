
import React from 'react';
import { Search, Settings2, Trophy, Droplets, Trash2, ShieldAlert, SlidersHorizontal, Globe } from 'lucide-react';

interface Props {
  onSelectAirtime: () => void;
  onSelectTV: () => void;
  onSelectService: (service: string) => void;
}

const Services: React.FC<Props> = ({ onSelectAirtime, onSelectTV, onSelectService }) => {
  const sections = [
    {
      title: "Top Services",
      items: [
        { name: 'BET 9JA', logo: 'media/betnaija.png' },
        { name: 'Intl Airtime', icon: <Globe size={24} className="text-orange-400" />, type: 'intl' },
        { name: 'MTN Data', logo: 'media/mtn.png', type: 'airtime' },
        { name: 'Netflix', logo: 'media/netflix.jpg' }
      ]
    },
    {
      title: "Airtime & Data",
      items: [
        { name: '9mobile', logo: 'media/9mobile.png', type: 'airtime' },
        { name: 'Airtel', logo: 'media/airtel.png', type: 'airtime' },
        { name: 'Glo', logo: 'media/glo.jpg', type: 'airtime' },
        { name: 'MTN', logo: 'media/mtn.png', type: 'airtime' }
      ]
    },
    {
      title: "Bills & Utilities",
      items: [
        { name: 'Electricity', icon: <SlidersHorizontal size={24} className="text-[#6338F9]" />, type: 'electricity' },
        { name: 'Water', icon: <Droplets size={24} className="text-blue-500" /> },
        { name: 'Waste', icon: <Trash2 size={24} className="text-gray-400" /> },
        { name: 'Security', icon: <ShieldAlert size={24} className="text-red-500" /> }
      ]
    },
    {
      title: "Betting",
      items: [
        { name: 'All Bettings', icon: <Trophy size={24} className="text-yellow-500" /> },
        { name: '1XBET', logo: 'media/1XBET.png' },
        { name: 'BET 9JA', logo: 'media/betnaija.png' },
        { name: 'BETKING', logo: 'media/betking.png' }
      ]
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FB] overflow-y-auto no-scrollbar pb-32">
      <div className="px-6 pt-6">
        <h2 className="text-[20px] font-black text-[#111] mb-6 text-center">Services</h2>
        <div className="bg-white rounded-[1.8rem] p-4 flex items-center gap-3 border border-gray-100 shadow-sm mb-8">
          <Search size={20} className="text-gray-300" />
          <input type="text" placeholder="search" className="flex-1 bg-transparent border-none outline-none text-[15px] font-bold text-[#111] placeholder:text-gray-300" />
          <Settings2 size={20} className="text-gray-300" />
        </div>
        {sections.map((section, idx) => (
          <section key={idx} className="mb-8">
            <h3 className="text-[14px] font-black text-[#111] mb-5">{section.title}</h3>
            <div className="grid grid-cols-4 gap-y-6">
              {section.items.map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={() => {
                  if (item.type === 'intl') onSelectService('Intl');
                  else if (item.type === 'airtime') onSelectAirtime();
                  else onSelectService(item.name);
                }}>
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-3 group-active:scale-95 transition-all overflow-hidden">
                    {item.logo ? <img src={item.logo} alt={item.name} className="w-full h-full object-contain" /> : item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">{item.name}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
        <section className="mb-8">
          <h3 className="text-[14px] font-black text-[#111] mb-5">Cable Tv</h3>
          <div className="grid grid-cols-4 gap-y-6">
            {[{ name: 'GOTv', logo: 'media/gotv.jpg' }, { name: 'DSTv', logo: 'media/dstv.png' }, { name: 'StarTimes', logo: 'media/startimes.png' }, { name: 'Showmax', logo: 'media/showmax.jpg' }].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 cursor-pointer group" onClick={onSelectTV}>
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center p-3 group-active:scale-95 transition-all overflow-hidden">
                  <img src={item.logo} alt={item.name} className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 text-center leading-tight">{item.name}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
