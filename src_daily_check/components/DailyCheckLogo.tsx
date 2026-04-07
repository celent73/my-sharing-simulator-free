import React from 'react';

export const DailyCheckLogo: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={`relative flex items-center justify-center bg-green-500 rounded-xl overflow-hidden shadow-lg border border-white/20 ${className || 'w-11 h-11'}`}>
      {/* Calendar Grid Background */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 p-1 gap-0.5">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="bg-white rounded-[1px]" />
        ))}
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center leading-none">
        <span className="text-[6px] font-black tracking-tighter text-white/80 uppercase">Daily</span>
        <span className="text-[10px] font-black text-white uppercase -mt-0.5">CHECK</span>
        <div className="mt-0.5 bg-white rounded-full p-0.5">
          <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
      </div>
      
      {/* Glossy Overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/20 pointer-events-none" />
    </div>
  );
};
