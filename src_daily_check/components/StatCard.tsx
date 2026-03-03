
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
    <div className="bg-white/5 dark:bg-white/5 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 shadow-2xl transition-all duration-500 flex flex-col items-center text-center group hover:translate-y-[-8px] hover:bg-white/10 dark:hover:bg-white/[0.08]">
      <div className={`mb-6 p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-xl group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500 ${colorClass}`}>
        {icon}
      </div>
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-3">{title}</h4>
      <p className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter bg-gradient-to-br from-white to-white/60 bg-clip-text">{value}</p>
      <div className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/5 uppercase tracking-widest">{description}</div>
    </div>
  );
};

export default StatCard;
