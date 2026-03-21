
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
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 shadow-2xl shadow-black/[0.03] border-2 border-black/10 dark:border-white/20 transition-all flex flex-col items-center text-center group relative overflow-hidden h-full"
    >
      {/* Background Glow */}
      <div className={`absolute -top-24 -right-24 w-48 h-48 blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity ${colorClass.includes('text') ? colorClass.replace('text', 'bg') : colorClass}`} />
      
      <div className={`mb-8 p-5 rounded-[1.75rem] shadow-xl shadow-current/10 group-hover:scale-110 transition-transform duration-500 ${colorClass.includes('text') ? colorClass.replace('text', 'bg') : colorClass} !text-white relative z-10`}>
        {icon}
        {isPulsing && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 rounded-[1.75rem] bg-white"
          />
        )}
      </div>

      <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#8e8e93] dark:text-slate-400 mb-4 h-4 flex items-center justify-center relative z-10">
        {title}
      </h4>
      
      <motion.p 
        key={value}
        className="text-6xl font-black text-[#1c1c1e] dark:text-white mb-5 tracking-tighter relative z-10"
      >
        {value}
      </motion.p>
      
      <div className="text-[10px] items-center justify-center font-black text-[#8e8e93] dark:text-slate-400 bg-black/[0.03] dark:bg-white/[0.05] px-5 py-2.5 rounded-2xl border border-black/[0.01] dark:border-white/[0.01] uppercase tracking-[0.15em] relative z-10">
        {description}
      </div>
    </motion.div>
  );
};

export default StatCard;
