
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TimeMultiplierProps {
  totalUsers: number;
}

const TimeMultiplier: React.FC<TimeMultiplierProps> = ({ totalUsers }) => {
  const [userHours, setUserHours] = useState<number>(2);
  const { t } = useLanguage();

  // Assumiamo prudentemente che ogni collaboratore dedichi 30 minuti (0.5h) di media
  // Alcuni faranno 0, altri 4h, ma su grandi numeri la media si stabilizza
  const AVG_PARTNER_HOURS = 0.5;

  const networkHours = totalUsers * AVG_PARTNER_HOURS;
  const totalProductiveHours = userHours + networkHours;

  // Giornata lavorativa standard di 8 ore
  const standardWorkDay = 8;

  // Quante "giornate lavorative standard" sono compresse in 1 giorno di calendario
  const equivalentWorkDays = totalProductiveHours / standardWorkDay;

  const formatNumber = (num: number) => new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 }).format(num);

  const scrollToParams = () => {
    const element = document.getElementById('input-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (totalUsers <= 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white rounded-[3rem] shadow-2xl border border-indigo-500/20 p-8 sm:p-10 overflow-hidden relative mt-8 transition-transform hover:scale-[1.01] duration-500 group">
      {/* Background cosmic effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px]"></div>

        {/* Stars */}
        <div className="absolute top-[15%] right-[20%] w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
        <div className="absolute top-[45%] left-[10%] w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[30%] right-[40%] w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

        {/* Left Side: Concept & Input */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6 shadow-lg backdrop-blur-md">
            <span>⏳</span> {t('time.tag')}
          </div>
          <h2 className="text-3xl sm:text-4xl font-black mb-4 text-white tracking-tight drop-shadow-lg">
            {t('time.title')}
          </h2>
          <p className="text-indigo-200/80 mb-8 leading-relaxed text-lg font-medium">
            {t('time.desc')}
          </p>

          <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 inline-block shadow-2xl">
            <label className="block text-[10px] text-indigo-300 uppercase font-black mb-3 tracking-widest">{t('time.input_label')}</label>
            <div className="flex items-center gap-4 bg-black/30 rounded-2xl p-2 border border-white/5">
              <button
                onClick={() => setUserHours(Math.max(0.5, userHours - 0.5))}
                className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-2xl font-bold transition-all active:scale-95 text-white/70 hover:text-white"
              >
                -
              </button>
              <span className="text-4xl font-black w-24 text-center font-mono tracking-tighter text-white">{userHours}h</span>
              <button
                onClick={() => setUserHours(Math.min(24, userHours + 0.5))}
                className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-2xl font-bold transition-all active:scale-95 text-white/70 hover:text-white"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Result Card */}
        <div className="bg-black/20 backdrop-blur-2xl rounded-[2.5rem] p-8 sm:p-10 border border-indigo-400/20 shadow-2xl relative overflow-hidden group hover:border-indigo-400/30 transition-all">
          <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50"></div>

          <div className="flex justify-between items-end mb-6">
            <span className="text-xs text-indigo-300/80 font-bold uppercase tracking-widest">{t('time.productive_hours')}</span>
            <div className="text-right">
              <span className="text-6xl sm:text-7xl font-black text-white drop-shadow-[0_0_25px_rgba(168,85,247,0.4)] leading-none tracking-tighter">
                {formatNumber(totalProductiveHours)}
              </span>
              <span className="text-2xl text-indigo-400/80 font-bold ml-1">h</span>
            </div>
          </div>

          {/* Visual Comparison Bars */}
          <div className="space-y-6 my-8">
            {/* Standard Job */}
            <div>
              <div className="flex justify-between text-[10px] text-indigo-300/60 font-bold uppercase tracking-wider mb-2">
                <span>{t('time.job_label')}</span>
                <span>8 h</span>
              </div>
              <div className="w-full bg-slate-800/50 h-3 rounded-full overflow-hidden border border-white/5">
                <div className="h-full bg-slate-600 w-[5%] min-w-[8px] rounded-full"></div>
              </div>
            </div>

            {/* Your Business */}
            <div>
              <div className="flex justify-between text-xs text-white font-bold mb-2">
                <span className="flex items-center gap-2">🚀 {t('time.business_label')} <span className="font-medium text-indigo-300/60 text-[10px] uppercase tracking-wide">(Tu + {totalUsers} partner)</span></span>
                <span className="text-indigo-300">{formatNumber(totalProductiveHours)} h</span>
              </div>
              <div className="w-full bg-slate-800/50 h-4 rounded-full overflow-hidden shadow-inner border border-white/5">
                <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 w-full animate-pulse shadow-[0_0_15px_rgba(192,132,252,0.5)]"></div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-xl sm:text-2xl font-medium text-white/90 leading-tight">
              {t('time.result_prefix')}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 font-black text-3xl sm:text-4xl tracking-tight block mt-2 mb-1">
                {formatNumber(equivalentWorkDays)} {t('time.result_days')}
              </span>
              <span className="text-base text-indigo-300/70 font-normal">{t('time.result_suffix')}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeMultiplier;
