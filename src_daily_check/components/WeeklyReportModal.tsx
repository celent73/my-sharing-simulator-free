import React, { useMemo } from 'react';
import { ActivityLog, ActivityType, Goals, HabitStack, UserProfile } from '../types';
import { calculateDailyScore, getScoreLabel } from '../utils/coachScoreUtils';
import { Trophy, TrendingUp, Calendar, CheckCircle2, XCircle } from 'lucide-react';

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
    let bestDay = { date: '', score: -1 };
    const dailyScores: { date: string, score: number }[] = [];

    last7Days.forEach(dateStr => {
      const log = logsMap.get(dateStr);
      const score = calculateDailyScore(log, goals, habitStacks, dateStr);
      dailyScores.push({ date: dateStr, score });
      totalScore += score;
      daysAnalyzed++;
      if (score > bestDay.score) {
        bestDay = { date: dateStr, score };
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

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-white/5">
                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-3">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">COERENZA</p>
                    <p className="text-xl font-black text-slate-800 dark:text-white">{reportData.consistencyDays}/7 <span className="text-xs text-slate-400">giorni</span></p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-3xl border border-slate-100 dark:border-white/5">
                    <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 mb-3">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">MIGLIOR GIORNO</p>
                    <p className="text-xl font-black text-slate-800 dark:text-white">{reportData.bestDay.score} <span className="text-xs text-slate-400">score</span></p>
                </div>
            </div>

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
