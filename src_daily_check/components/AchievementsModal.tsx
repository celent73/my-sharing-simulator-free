import React, { useState, useEffect } from 'react';
import { CAREER_STAGES } from '../constants';
import { formatItalianDate } from '../utils/dateUtils';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  careerDates?: Record<string, string>;
  unlockedAchievements?: any;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, careerDates = {} }) => {


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 sm:p-6" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            <span role="img" aria-label="trophy" className="text-2xl">🏆</span>
            Traguardi Carriera
          </h2>
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 transition-all border border-red-100 dark:border-red-500/20 shadow-sm"
            aria-label="Chiudi"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CAREER_STAGES.map((stage) => {
              const unlockedDate = careerDates[stage.name];
              const parsedDate = unlockedDate ? new Date(unlockedDate) : null;
              const hasDate = !!parsedDate;
              // Normalizziamo le date per confrontare solo i giorni
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const targetDate = parsedDate ? new Date(parsedDate) : null;
              if (targetDate) targetDate.setHours(0, 0, 0, 0);
              
              const isUnlocked = targetDate ? targetDate <= today : false;
              const isTarget = targetDate ? targetDate > today : false;

              return (
                <div
                  key={stage.name}
                  className={`p-5 rounded-xl border flex items-center gap-5 transition-all duration-300 ${hasDate
                    ? 'bg-white shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                    }`}
                  style={hasDate ? { borderColor: `${stage.color}60` } : {}}
                >
                  <div
                    className={`flex-shrink-0 h-16 w-16 p-3 rounded-full flex items-center justify-center transition-colors duration-300`}
                    style={{
                      backgroundColor: hasDate ? `${stage.color}20` : '#e2e8f0',
                      color: hasDate ? stage.color : '#94a3b8'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-full w-full" viewBox="0 0 24 24" fill="currentColor">
                      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <h3
                      className={`font-bold text-lg transition-colors duration-300`}
                      style={{ color: hasDate ? stage.color : '#475569' }}
                    >
                      {stage.name}
                    </h3>
                    <p className={`text-sm transition-colors duration-300 text-slate-500 font-medium`}>
                      {isUnlocked ? 'Qualifica raggiunta' : isTarget ? 'Obiettivo pianificato' : 'Da raggiungere'}
                    </p>
                    {isUnlocked && (
                      <p className="text-xs text-slate-500 mt-1">
                        Sbloccato il: {formatItalianDate(parsedDate!)}
                      </p>
                    )}
                    {isTarget && (
                      <div className="mt-1">
                        <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-1 rounded-md border border-amber-500/20">
                          Previsto per: {formatItalianDate(parsedDate!)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;