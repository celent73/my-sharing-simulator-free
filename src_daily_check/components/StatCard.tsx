
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description, colorClass }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_15px_45px_0_rgba(0,0,0,0.06)] border border-transparent transition-all hover:scale-[1.02] flex flex-col items-center text-center group">
      <div className={`mb-8 p-5 rounded-[1.75rem] shadow-lg group-hover:scale-110 transition-transform duration-500 ${colorClass.includes('text') ? colorClass.replace('text', 'bg') : colorClass} !text-white`}>
        {icon}
      </div>
      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8e8e93] mb-4">{title}</h4>
      <p className="text-6xl font-black text-[#1c1c1e] mb-5 tracking-tighter">{value}</p>
      <div className="text-xs font-bold text-[#8e8e93] bg-[#f2f2f7] px-4 py-2 rounded-full border border-transparent uppercase tracking-widest">{description}</div>
    </div>
  );
};

export default StatCard;
