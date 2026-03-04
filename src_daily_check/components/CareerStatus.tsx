
import React from 'react';
import { ActivityLog, UserProfile, Qualification } from '../types';
import { calculateCareerStatus } from '../utils/careerUtils';

interface CareerStatusProps {
  activityLogs: ActivityLog[];
  userProfile?: UserProfile;
}

const GiftIcon = () => (
  <span className="text-2xl mr-3">🎁</span>
);

const CareerStatus: React.FC<CareerStatusProps> = ({ activityLogs, userProfile }) => {
  // Use the manual qualification if set, otherwise calculate automatically
  const status = calculateCareerStatus(activityLogs, userProfile?.currentQualification);

  const progressBarClass = status.specialStatus === 'family_pro'
    ? 'bg-gradient-to-r from-pink-500 to-rose-600'
    : 'bg-gradient-to-r from-amber-400 to-amber-600';

  return (
    <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
      <div className="flex items-center mb-10">
        <GiftIcon />
        <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Status Carriera</h2>
      </div>

      <div className="space-y-8">
        <div>
          <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Livello Attuale</p>
          <p className={`text-6xl font-black bg-gradient-to-r ${status.specialStatus === 'family_pro'
            ? 'from-pink-500 to-rose-600'
            : 'from-blue-500 to-cyan-500'
            } text-transparent bg-clip-text tracking-tighter`}>
            {status.currentLevel.name}
          </p>

          {/* Specific requirement for Family Utility -> Pro */}
          {status.totalContracts < 10 && (status.currentLevel.name === 'Family Utility' || status.currentLevel.name === 'Consulente Junior') && (
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-2">
              Mancano {10 - status.totalContracts} contratti per Family Pro
            </p>
          )}
        </div>

        <div className="pt-6 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex justify-between items-end mb-4">
            <span className="text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">
              Progresso al prossimo livello
            </span>
            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
              {status.totalClients} / {status.clientsForNextLevel > 0 && status.clientsForNextLevel < 9000 ? status.clientsForNextLevel : 11} acquisizioni
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden border border-slate-200/20 shadow-inner">
            <div
              className={`${progressBarClass} h-full rounded-full transition-all duration-1000 shadow-lg`}
              style={{ width: `${status.progressPercentage}%` }}
            ></div>
          </div>

          <p className="text-right text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mt-3">
            {(() => {
              let nextName = "Family Pro";
              if (status.currentLevel.name === 'Family Pro') nextName = 'Family 3S';
              else if (status.currentLevel.name === 'Family 3S') nextName = 'Family 5S';
              // ... add more if needed, but the user said "fermati al family pro scrivendo il prossimo step family 3 s e basta"
              return `Prossimo livello: ${nextName}`;
            })()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareerStatus;
