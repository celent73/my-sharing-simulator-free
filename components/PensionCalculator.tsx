
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface PensionCalculatorProps {
  recurringIncome: number;
}

const PensionCalculator: React.FC<PensionCalculatorProps> = ({ recurringIncome }) => {
  const [currentSalary, setCurrentSalary] = useState<number>(1500);
  const { t } = useLanguage();

  // Costanti Italia (Stima semplificata)
  const REPLACEMENT_RATE = 0.70; // L'INPS copre circa il 70%
  
  // Calcoli Mensili
  const estimatedPension = currentSalary * REPLACEMENT_RATE; // Quello che darà l'INPS
  const monthlyGap = currentSalary - estimatedPension; // Quello che manca (Il buco)
  
  // Scenario Union
  const unionTotal = estimatedPension + recurringIncome; // Pensione + Rendita
  const surplus = unionTotal - currentSalary; // Extra rispetto allo stipendio attuale
  const isCovered = unionTotal >= currentSalary;

  const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white rounded-3xl shadow-xl border border-slate-700 p-6 sm:p-8 overflow-hidden relative mt-8">
       
       {/* Background decorative elements */}
       <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none"></div>

       <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
                    <span>🛡️</span> {t('pension.tag')}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">
                    {t('pension.title')}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                    {t('pension.desc')}
                </p>
              </div>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 space-y-4 shadow-inner">
                  <div>
                      <div className="flex justify-between mb-2 items-end">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">{t('pension.current_salary')}</label>
                        <span className="text-lg font-bold text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{formatCurrency(currentSalary)}</span>
                      </div>
                      <input 
                            type="range" 
                            min="1000" 
                            max="5000" 
                            step="50"
                            value={currentSalary}
                            onChange={(e) => setCurrentSalary(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400 transition-all"
                        />
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                      <span className="text-xs text-slate-400">{t('pension.union_rent')}:</span>
                      <span className="text-lg font-bold text-emerald-400">{formatCurrency(recurringIncome)}/mese</span>
                  </div>
              </div>
          </div>

          {/* Right Column: Visual Comparison */}
          <div className="lg:col-span-7 flex justify-center items-end h-[300px] gap-8 sm:gap-16 pb-4">
              
              {/* BARRA 1: SOLO INPS */}
              <div className="w-24 sm:w-32 h-full flex flex-col justify-end relative group">
                  {/* Label GAP */}
                  <div className="absolute top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-full text-center w-full mb-2">
                      <span className="text-red-500 font-bold text-lg block leading-none">-{formatCurrency(monthlyGap)}</span>
                      <span className="text-[10px] text-red-400/70 uppercase font-bold">{t('pension.loss_label')}</span>
                  </div>

                  {/* Salary Reference Line (Dashed) */}
                  <div className="absolute top-[30%] w-[240%] left-[-20%] border-t-2 border-dashed border-white/10 pointer-events-none flex items-center justify-end">
                       <span className="text-[10px] text-slate-500 bg-slate-900 px-1 -mt-5 mr-2">{t('pension.salary_label')} {formatCurrency(currentSalary)}</span>
                  </div>

                  {/* Gap Block */}
                  <div className="w-full h-[30%] bg-red-500/10 border border-red-500/30 rounded-t-md flex items-center justify-center relative">
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xs font-bold text-red-500 tracking-widest rotate-90 sm:rotate-0">{t('pension.gap_label')}</span>
                      </div>
                  </div>
                  {/* Pension Block */}
                  <div className="w-full h-[70%] bg-slate-700 rounded-b-md flex items-end justify-center pb-2 border border-slate-600">
                      <span className="text-xs font-bold text-slate-400">INPS</span>
                  </div>
                  
                  <p className="text-center mt-3 text-sm font-bold text-slate-500">{t('pension.only_inps')}</p>
              </div>

              {/* Arrow */}
              <div className="mb-12 text-slate-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </div>

              {/* BARRA 2: CON UNION */}
              <div className="w-24 sm:w-32 h-full flex flex-col justify-end relative">
                   {/* Label SURPLUS/COVERAGE */}
                   <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-center w-40 mb-1 z-20">
                      <span className={`font-bold text-lg block leading-none px-2 py-1 rounded-lg backdrop-blur-md border ${isCovered ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'bg-orange-500/20 text-orange-400 border-orange-500/50'}`}>
                          {isCovered ? `+${formatCurrency(surplus)} ${t('pension.extra')}` : `${t('pension.recover')} ${formatCurrency(recurringIncome)}`}
                      </span>
                  </div>

                  {/* Calculation for Union Height Visual */}
                  {(() => {
                      const unionVisualHeight = (recurringIncome / monthlyGap) * 30; 
                      const clampedHeight = Math.min(unionVisualHeight, 80); 

                      return (
                        <>
                            <div 
                                className={`w-full rounded-t-md flex items-center justify-center relative transition-all duration-1000 border-t border-l border-r border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] z-10 ${isCovered ? 'bg-gradient-to-b from-emerald-400 to-teal-600' : 'bg-gradient-to-b from-orange-400 to-orange-600'}`}
                                style={{ height: `${clampedHeight}%`, minHeight: '10%' }}
                            >
                                <span className="text-xs font-bold text-white drop-shadow-md rotate-90 sm:rotate-0">UNION</span>
                            </div>
                        </>
                      );
                  })()}

                  {/* Pension Block */}
                  <div className="w-full h-[70%] bg-slate-700 rounded-b-md flex items-end justify-center pb-2 border border-slate-600 opacity-80">
                      <span className="text-xs font-bold text-slate-400">INPS</span>
                  </div>

                  <p className="text-center mt-3 text-sm font-bold text-white">{t('pension.with_union')}</p>
              </div>

          </div>

       </div>
       
       {/* Bottom Message */}
       <div className="mt-6 pt-4 border-t border-white/5 text-center">
            {isCovered ? (
                 <p className="text-emerald-400 text-sm flex items-center justify-center gap-2">
                    <span className="bg-emerald-400 text-slate-900 rounded-full w-5 h-5 flex items-center justify-center font-bold text-xs">✓</span>
                    {t('pension.msg_covered')}
                 </p>
            ) : (
                <p className="text-orange-400 text-sm">
                   {t('pension.msg_partial')}
                </p>
            )}
       </div>

    </div>
  );
};

export default PensionCalculator;
