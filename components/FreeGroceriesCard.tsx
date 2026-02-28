
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FreeGroceriesCardProps {
  monthlyCashback: number;
  foodSpending: number;
}

const FreeGroceriesCard: React.FC<FreeGroceriesCardProps> = ({ monthlyCashback, foodSpending }) => {
  const { t } = useLanguage();

  // Calculate annual cashback
  const annualCashback = monthlyCashback * 12;

  // Calculate months covered
  // Avoid division by zero
  const monthsCovered = foodSpending > 0 ? annualCashback / foodSpending : 0;
  
  // Cap visual at 12 months
  const progressPercent = Math.min(100, (monthsCovered / 12) * 100);

  const formatNumber = (num: number) => new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 }).format(num);

  return (
    <div className="bg-gradient-to-br from-rose-900 via-pink-900 to-slate-900 text-white rounded-3xl shadow-xl border border-rose-500/30 p-6 sm:p-8 overflow-hidden relative mt-4 group hover:border-rose-400 transition-all">
       
       {/* Background effects */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[-20%] left-[-10%] w-72 h-72 bg-rose-500/10 rounded-full blur-[80px]"></div>
           <div className="absolute bottom-[-20%] right-[-10%] w-80 h-80 bg-fuchsia-500/10 rounded-full blur-[80px]"></div>
           {/* Floating Cart Icon */}
           <div className="absolute top-10 right-10 text-8xl opacity-5 transform -rotate-12">🛒</div>
       </div>

       <div className="relative z-10 grid grid-cols-1 gap-4 items-center">
          
          {/* Left Side: Text */}
          <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/50 text-rose-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <span>🛒</span> {t('groceries.tag')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white tracking-tight">
                {t('groceries.title')}
              </h2>
              <p className="text-rose-100 mb-6 leading-relaxed text-sm sm:text-base">
                  {t('groceries.desc')}
              </p>
              
              {foodSpending <= 0 ? (
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 text-sm text-rose-200 flex items-center gap-3">
                      <span className="text-xl">⚠️</span>
                      <p>{t('groceries.no_food_budget')}</p>
                  </div>
              ) : (
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex justify-between items-center">
                      <div>
                          <p className="text-xs text-rose-200 uppercase font-bold">{t('groceries.subtitle')}</p>
                          <p className="text-2xl font-bold text-white mt-1">{formatNumber(monthsCovered)} <span className="text-sm font-normal opacity-80">mesi</span></p>
                      </div>
                      <div className="text-right">
                          <p className="text-xs text-rose-200 uppercase font-bold">{t('groceries.yearly')}</p>
                          <p className="text-xl font-bold text-rose-300 mt-1">€{annualCashback.toLocaleString('it-IT')}</p>
                      </div>
                  </div>
              )}
          </div>

          {/* Right Side: Visual */}
          <div className="flex flex-col items-center justify-center min-h-[100px]">
              {foodSpending > 0 ? (
                  <div className="relative w-full">
                      <div className="flex justify-between items-end mb-2">
                          <span className="text-sm font-bold text-rose-300">{t('groceries.result_pre')}</span>
                          <span className="text-3xl font-extrabold text-white">{formatNumber(monthsCovered)}</span>
                      </div>
                      
                      {/* Progress Bar Background */}
                      <div className="h-8 bg-slate-800 rounded-full overflow-hidden border border-slate-600 relative shadow-inner">
                          {/* Grid lines for months */}
                          <div className="absolute inset-0 flex justify-between px-2 z-20 opacity-20">
                              {[...Array(11)].map((_, i) => <div key={i} className="w-px h-full bg-white"></div>)}
                          </div>
                          
                          {/* Fill */}
                          <div 
                            className="h-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 relative z-10 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(244,63,94,0.6)]"
                            style={{ width: `${progressPercent}%` }}
                          >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                      </div>
                      
                      <p className="text-center mt-3 text-rose-200 text-sm font-medium uppercase tracking-wide">
                          {t('groceries.result_post')}
                      </p>
                  </div>
              ) : (
                  <div className="opacity-50 grayscale flex flex-col items-center justify-center p-4 border-2 border-dashed border-white/10 rounded-xl w-full">
                      <div className="text-4xl mb-2 text-center">🛒</div>
                      <p className="text-center text-sm text-rose-200/70">Imposta il budget "Alimenti" per vedere il calcolo</p>
                  </div>
              )}
          </div>
       </div>
    </div>
  );
};

export default FreeGroceriesCard;
