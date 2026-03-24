import React, { useMemo } from 'react';
import { ActivityLog, Goals, HabitStack, CareerStatusInfo } from '../types';
import { calculateDailyScore } from '../utils/coachScoreUtils';
import { Target, TrendingUp, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface CareerProjectorProps {
  logs: ActivityLog[];
  goals: Goals;
  habitStacks: HabitStack[];
  careerStatus: CareerStatusInfo;
}

const CareerProjector: React.FC<CareerProjectorProps> = ({ logs, goals, habitStacks, careerStatus }) => {
  const projection = useMemo(() => {
    if (!logs || logs.length === 0 || careerStatus.isMaxLevel || !careerStatus.nextLevel) return null;

    // 1. Calculate average score for last 7 days
    const last7Days = logs.slice(0, 7);
    const scores = last7Days.map(log => 
      calculateDailyScore(log, goals, habitStacks, format(new Date(log.date), 'yyyy-MM-dd'))
    );
    
    const avgScore = scores.reduce((a, b) => a + b, 0) / (scores.length || 1);
    
    // 2. Estimate days based on Contract acquisition rate
    const totalNewIn7Days = last7Days.reduce((sum, log) => 
      sum + (log.counts['NEW_CONTRACTS'] || 0) + (log.counts['NEW_FAMILY_UTILITY'] || 0), 0
    );
    const dailyRate = totalNewIn7Days / (last7Days.length || 1);
    
    const missing = careerStatus.clientsForNextLevel - careerStatus.totalClients;
    const estDays = dailyRate > 0 ? Math.ceil(missing / dailyRate) : Infinity;

    return {
      avgScore: Math.round(avgScore),
      estDays: estDays === Infinity ? null : estDays,
      rate: dailyRate.toFixed(1)
    };
  }, [logs, goals, habitStacks, careerStatus]);

  if (!projection) return null;

  return (
    <div className="w-full bg-gradient-to-br from-indigo-500/10 to-blue-500/10 dark:from-indigo-500/20 dark:to-blue-500/20 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-indigo-500/20 shadow-xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <TrendingUp className="w-12 h-12 text-indigo-500" />
      </div>
      
      <div className="flex flex-col gap-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Target className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-400">Proiezione Carriera</p>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h4 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">
              {projection.estDays ? (
                <>Tra <span className="text-indigo-500">{projection.estDays}</span> giorni</>
              ) : (
                <span className="text-slate-400 italic text-lg font-bold">Inizia a produrre per vedere la stima</span>
              )}
            </h4>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
              Obiettivo: {careerStatus.nextLevel?.name}
            </p>
          </div>

          <div className="text-right">
            <div className="inline-flex items-center gap-1.5 bg-white/40 dark:bg-white/5 px-3 py-1.5 rounded-2xl border border-indigo-500/10">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Indice Coerenza:</span>
              <span className="text-sm font-black text-indigo-500 leading-none">{projection.avgScore}%</span>
            </div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1.5">Rate: {projection.rate} contratti/gg</p>
          </div>
        </div>

        {/* Progress bar subtle */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700/50 rounded-full overflow-hidden mt-2">
          <div 
            className="h-full bg-indigo-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
            style={{ width: `${careerStatus.progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CareerProjector;
