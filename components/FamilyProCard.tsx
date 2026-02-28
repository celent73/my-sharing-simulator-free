import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { PlanInput } from '../types';

interface FamilyProCardProps {
  inputs: PlanInput;
}

const FamilyProCard: React.FC<FamilyProCardProps> = ({ inputs }) => {
  const [mode, setMode] = useState<'builder' | 'sprinter'>('sprinter');
  const { t } = useLanguage();

  // CALCOLI DATI REALI
  
  // 1. Totale Contratti Personali (Builder Mode)
  // Somma di tutte le utenze personali (Green, Light, Business, Mie Utenze)
  const totalPersonalContracts = 
    (inputs.personalClientsGreen || 0) +
    (inputs.personalClientsLight || 0) +
    (inputs.personalClientsBusinessGreen || 0) +
    (inputs.personalClientsBusinessLight || 0) +
    (inputs.myPersonalUnitsGreen || 0) +
    (inputs.myPersonalUnitsLight || 0);

  const builderProgress = Math.min(100, (totalPersonalContracts / 10) * 100);
  const isBuilderQualified = totalPersonalContracts >= 10;

  // 2. Struttura 3x3 (Sprinter Mode)
  // Richiede almeno 3 diretti e almeno 3 indiretti (duplicazione)
  const directCount = inputs.directRecruits || 0;
  const indirectFactor = inputs.indirectRecruits || 0;
  
  const has3Directs = directCount >= 3;
  const has3Indirects = indirectFactor >= 3;
  const isSprinterQualified = has3Directs && has3Indirects;

  // Stato finale
  const isQualified = mode === 'builder' ? isBuilderQualified : isSprinterQualified;

  const scrollToParams = () => {
    const element = document.getElementById('input-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden mt-8 shadow-2xl border-2 border-yellow-600/50 group transition-all hover:scale-[1.01]">
      
      {/* BACKGROUND LUXURY */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-0"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-500/10 via-transparent to-transparent opacity-50 z-0"></div>
      
      <div className="relative z-10 p-6 sm:p-8 text-white pb-16"> {/* Increased bottom padding for button space */}
        
        {/* HEADER */}
        <div className="text-center mb-8">
            <div className="inline-block mb-2">
                <span className="text-4xl animate-bounce inline-block">👑</span>
            </div>
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 uppercase tracking-widest drop-shadow-sm">
                {t('family_pro.title')}
            </h2>
            <p className="text-yellow-100/70 text-sm font-medium mt-1">
                {t('family_pro.subtitle')}
            </p>
        </div>

        {/* SWITCHER */}
        <div className="flex justify-center mb-8">
            <div className="bg-gray-800/80 p-1 rounded-xl flex border border-yellow-500/30 backdrop-blur-md">
                <button
                    onClick={() => setMode('builder')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'builder' ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'text-gray-400 hover:text-white'}`}
                >
                    🧱 {t('family_pro.mode_builder')}
                </button>
                <button
                    onClick={() => setMode('sprinter')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${mode === 'sprinter' ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'text-gray-400 hover:text-white'}`}
                >
                    ⚡ {t('family_pro.mode_sprinter')}
                </button>
            </div>
        </div>

        {/* CONTENT AREA */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm min-h-[250px] flex flex-col justify-center items-center relative overflow-hidden">
            
            {/* BUILDER VISUAL */}
            {mode === 'builder' && (
                <div className="w-full max-w-md text-center animate-in fade-in zoom-in duration-500">
                    <p className="text-gray-300 mb-6 text-sm">{t('family_pro.builder_desc')}</p>
                    
                    <div className="relative pt-4 pb-8">
                        <div className="flex justify-between text-xs font-bold uppercase text-yellow-500/80 mb-2">
                            <span>0</span>
                            <span>{t('family_pro.personal_contracts')}</span>
                            <span>10</span>
                        </div>
                        <div className="h-6 bg-gray-700 rounded-full overflow-hidden shadow-inner border border-gray-600">
                            <div 
                                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-1000 ease-out relative"
                                style={{ width: `${builderProgress}%` }}
                            >
                                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                            </div>
                        </div>
                        <div className="mt-4 text-5xl font-black text-white tracking-tighter">
                            {totalPersonalContracts}<span className="text-2xl text-gray-500">/10</span>
                        </div>
                    </div>
                </div>
            )}

            {/* SPRINTER VISUAL */}
            {mode === 'sprinter' && (
                <div className="w-full text-center animate-in fade-in zoom-in duration-500 relative">
                     <p className="text-gray-300 mb-6 text-sm max-w-xs mx-auto">{t('family_pro.sprinter_desc')}</p>
                     
                     {/* 3x3 Matrix Visual */}
                     <div className="flex flex-col items-center gap-4 mb-4">
                        {/* YOU */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-b from-yellow-300 to-yellow-600 border-2 border-white shadow-[0_0_20px_rgba(234,179,8,0.6)] flex items-center justify-center text-xl z-10">
                            👑
                        </div>
                        
                        {/* CONNECTIONS */}
                        <div className="w-32 h-8 border-t-2 border-r-2 border-l-2 border-gray-600 rounded-t-xl -mt-4"></div>
                        
                        {/* DIRECTS (Row 2) */}
                        <div className="flex gap-8 -mt-4">
                             {[1, 2, 3].map((i) => (
                                 <div key={i} className="flex flex-col items-center">
                                     <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm transition-all duration-500 ${i <= directCount ? 'bg-blue-500 border-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.5)] text-white' : 'bg-gray-800 border-gray-600 text-gray-600'}`}>
                                         👤
                                     </div>
                                     {/* Small lines to indirects */}
                                     <div className={`h-4 w-0.5 ${i <= directCount && has3Indirects ? 'bg-green-500' : 'bg-gray-700'} mt-1`}></div>
                                     {/* INDIRECTS (Row 3 - Abstracted as dots) */}
                                     <div className="flex gap-1 mt-1">
                                         {[1, 2, 3].map(j => (
                                             <div key={j} className={`w-2 h-2 rounded-full ${i <= directCount && j <= indirectFactor ? 'bg-green-400 shadow-[0_0_5px_rgba(74,222,128,0.8)]' : 'bg-gray-700'}`}></div>
                                         ))}
                                     </div>
                                 </div>
                             ))}
                        </div>
                     </div>

                     {/* BONUS BADGE */}
                     {isSprinterQualified && (
                         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white font-black text-xl px-6 py-3 rounded-xl border-4 border-white shadow-[0_0_50px_rgba(220,38,38,0.8)] rotate-[-10deg] animate-bounce z-20 whitespace-nowrap">
                             💰 +150€ {t('family_pro.bonus_fast_start')}
                         </div>
                     )}
                </div>
            )}

            {/* FOOTER STATUS */}
            <div className="absolute bottom-0 left-0 w-full p-3 bg-black/40 border-t border-white/10 text-center backdrop-blur-md">
                <p className={`text-sm font-bold uppercase tracking-[0.2em] ${isQualified ? 'text-green-400 animate-pulse' : 'text-gray-500'}`}>
                    {isQualified ? t('family_pro.status_unlocked') : t('family_pro.status_locked')}
                </p>
            </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={scrollToParams}
          className="absolute bottom-4 right-4 z-20 p-2.5 bg-union-orange-500 text-white rounded-full shadow-lg hover:bg-union-orange-600 transition-transform hover:scale-110 focus:outline-none border-2 border-white/20"
          title="Modifica Parametri"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
        </button>

      </div>
    </div>
  );
};

export default FamilyProCard;