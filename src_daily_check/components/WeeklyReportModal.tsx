import React, { useMemo } from 'react';
import { ActivityLog, ActivityType, Goals, HabitStack, UserProfile } from '../types';
import { calculateDailyScore, getScoreLabel } from '../utils/coachScoreUtils';
import { Trophy, TrendingUp, Calendar, CheckCircle2, XCircle, Star } from 'lucide-react';
import { ACTIVITY_LABELS } from '../constants';

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  activityLogs: ActivityLog[];
  goals: Goals;
  habitStacks: HabitStack[];
  userProfile: UserProfile;
}

const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({
  isOpen, onClose, activityLogs, goals, habitStacks, userProfile
}) => {
  const reportData = useMemo(() => {
    const now = new Date();
    const last7Days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      last7Days.push(d.toISOString().split('T')[0]);
    }

    const logsMap = new Map(activityLogs.map(l => [l.date, l]));
    
    let totalScore = 0;
    let daysAnalyzed = 0;
    let bestDay: { date: string, score: number, log?: ActivityLog } = { date: '', score: -1 };
    const dailyScores: { date: string, score: number }[] = [];

    last7Days.forEach(dateStr => {
      const log = logsMap.get(dateStr);
      const score = calculateDailyScore(log, goals, habitStacks, dateStr);
      dailyScores.push({ date: dateStr, score });
      totalScore += score;
      daysAnalyzed++;
      if (score > bestDay.score) {
        bestDay = { date: dateStr, score, log };
      }
    });

    const avgScore = Math.round(totalScore / daysAnalyzed);
    const consistencyDays = dailyScores.filter(d => d.score >= 50).length;

    return { avgScore, bestDay, dailyScores, consistencyDays };
  }, [activityLogs, goals, habitStacks]);

  if (!isOpen) return null;

  const avgLabel = getScoreLabel(reportData.avgScore);

  return (
    <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 flex flex-col max-h-[90vh]">
        
        {/* Header - Image or Gradient */}
        <div className="h-32 bg-gradient-to-br from-blue-600 to-indigo-700 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
                <Trophy className="w-12 h-12 text-white/90 mx-auto mb-2 drop-shadow-lg" />
                <h2 className="text-xl font-black text-white uppercase tracking-widest">WEEKLY REPORT</h2>
                <p className="text-xs font-bold text-white/60 uppercase tracking-widest">Gli ultimi 7 giorni</p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
            
            {/* Average Score */}
            <div className="text-center space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">SCORE MEDIO SETTIMANALE</p>
                <div className="flex items-center justify-center gap-4">
                    <span className="text-6xl font-black text-slate-800 dark:text-white leading-none">{reportData.avgScore}</span>
                    <div className="text-left">
                        <div className="flex items-center gap-1">
                            <span className="text-2xl">{avgLabel.emoji}</span>
                            <span className="text-lg font-black" style={{ color: avgLabel.color }}>{avgLabel.label}</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">punteggio / 100</p>
                    </div>
                </div>
            </div>

            {/* Coerenza Settimanale */}
            <div className="grid grid-cols-1 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">COERENZA SETTIMANALE</p>
                        <p className="text-2xl font-black text-slate-800 dark:text-white">{reportData.consistencyDays}/7 <span className="text-sm text-slate-400 font-bold">giorni</span></p>
                    </div>
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                        <Calendar className="w-6 h-6" />
                    </div>
                </div>
            </div>

            {/* Best Day Highlight (Apple Style) */}
            {reportData.bestDay.score >= 0 && (
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 p-6 rounded-[2rem] border border-slate-700/50 shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-5">
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 fill-orange-400" /> IL TUO MIGLIOR GIORNO
                            </p>
                            <h3 className="text-xl font-black text-white capitalize leading-tight">
                                {reportData.bestDay.date ? new Date(reportData.bestDay.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' }) : 'N/A'}
                            </h3>
                        </div>
                        <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-black text-2xl px-4 py-2 rounded-2xl shadow-xl shadow-orange-500/30 ring-1 ring-white/20">
                            {reportData.bestDay.score}
                        </div>
                    </div>

                    {reportData.bestDay.log && Object.entries(reportData.bestDay.log.counts).some(([_, count]) => count > 0) ? (
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-3">Cosa hai realizzato:</p>
                             <div className="flex flex-col gap-2.5">
                                {Object.entries(reportData.bestDay.log.counts)
                                    .filter(([_, count]) => count > 0)
                                    .map(([key, count]) => (
                                        <div key={key} className="flex justify-between items-center group">
                                            <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                                                {ACTIVITY_LABELS[key as ActivityType] || key}
                                            </span>
                                            <span className="text-sm font-black text-white bg-white/10 px-3 py-1.5 rounded-xl border border-white/5">
                                                {count}
                                            </span>
                                        </div>
                                    ))}
                             </div>
                        </div>
                    ) : (
                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5">
                            <p className="text-xs font-bold text-slate-400 text-center">In questa giornata hai generato punteggio primariamente tramite mantenimento o routine di base.</p>
                        </div>
                    )}
                </div>
            </div>
            )}

            {/* Coach Insights */}
            <div className="bg-blue-50 dark:bg-blue-500/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-500/20">
                <h4 className="text-xs font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    💡 INSIGHT DEL COACH
                </h4>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                    {reportData.avgScore >= 75 ? 
                        `Fase formidabile, ${userProfile.firstName}. Hai mantenuto una costanza che pochissimi hanno. La prossima settimana punta a superare il tuo record di ${reportData.bestDay.score}!` :
                     reportData.avgScore >= 40 ?
                        `Buona settimana, ${userProfile.firstName}. Hai avuto momenti di picco ma anche qualche calo. Per scalare la tua carriera, prova a rendere ogni giorno solido come il tuo migliore.` :
                        `Questa settimana è stata sottotono, ${userProfile.firstName}. Non lasciarti scoraggiare: il coach è qui per questo. Riparti domani mattina con il primo habit stack e riprendi il ritmo.`
                    }
                </p>
            </div>

            {/* Daily Mini Graph */}
            <div className="space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">ANDAMENTO GIORNALIERO</p>
                <div className="flex items-end justify-between h-20 px-2">
                    {reportData.dailyScores.map((d, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 group relative">
                            <div className="absolute -top-6 bg-slate-800 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {d.score}
                            </div>
                            <div 
                                className={`w-8 rounded-t-lg transition-all duration-500 ${d.score >= 50 ? 'bg-blue-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                                style={{ height: `${Math.max(d.score, 5)}%` }}
                            ></div>
                            <span className="text-[9px] font-black text-slate-400 uppercase">
                                {new Date(d.date).toLocaleDateString('it-IT', { weekday: 'narrow' })}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-8 pt-0">
            <button 
                onClick={onClose}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-[13px] uppercase tracking-[0.2em] shadow-xl shadow-blue-500/30 transition-all active:scale-95"
            >
                Ricevuto, Capitano! 🫡
            </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyReportModal;
