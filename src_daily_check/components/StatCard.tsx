
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  description: string;
  colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, description, colorClass }) => {
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    setIsPulsing(true);
    const timer = setTimeout(() => setIsPulsing(false), 1000);
    return () => clearTimeout(timer);
  }, [value]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_15px_45px_0_rgba(0,0,0,0.06)] border border-transparent transition-all hover:scale-[1.02] flex flex-col items-center text-center group relative overflow-hidden"
    >
      <div className={`mb-8 p-5 rounded-[1.75rem] shadow-lg group-hover:scale-110 transition-transform duration-500 ${colorClass.includes('text') ? colorClass.replace('text', 'bg') : colorClass} !text-white relative`}>
        {icon}
        {isPulsing && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 rounded-[1.75rem] bg-current"
          />
        )}
      </div>
      <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#8e8e93] mb-4">{title}</h4>
      
      <motion.p 
        key={value}
        initial={{ scale: 0.9 }}
        animate={{ scale: isPulsing ? [1, 1.1, 1] : 1 }}
        className="text-6xl font-black text-[#1c1c1e] dark:text-white mb-5 tracking-tighter"
      >
        {value}
      </motion.p>
      
      <div className="text-xs font-bold text-[#8e8e93] bg-[#f2f2f7] dark:bg-slate-800 px-4 py-2 rounded-full border border-transparent uppercase tracking-widest">{description}</div>
    </motion.div>
  );
};

export default StatCard;
