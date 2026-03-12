import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, AlertCircle, ChevronRight, Zap } from 'lucide-react';
import { RecoveryStats } from '../../hooks/useDailyStats';
import { CommercialMonthProgress } from '../utils/sessionUtils';
import { ACTIVITY_LABELS, ACTIVITY_COLORS } from '../constants';

interface GoalRecoveryWidgetProps {
    commercialMonth: CommercialMonthProgress | null;
    recoveryStats: RecoveryStats[];
    loading?: boolean;
    onActivateFocus?: (goal: string, target: number) => void;
}

const GoalRecoveryWidget: React.FC<GoalRecoveryWidgetProps> = ({ commercialMonth, recoveryStats, loading, onActivateFocus }) => {
    if (loading || !commercialMonth) return null;

    const behindStats = recoveryStats.filter(s => s.isBehind);
    const isOverallBehind = behindStats.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative"
        >
            {/* Background Accent */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 -mr-16 -mt-16 rounded-full ${isOverallBehind ? 'bg-orange-500' : 'bg-emerald-500'}`} />

            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Target className={isOverallBehind ? "text-orange-500" : "text-emerald-500"} size={24} />
                        Tabella di Marcia
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">
                        Mese commerciale: {commercialMonth.start.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} - {commercialMonth.end.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })}
                    </p>
                </div>
                <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isOverallBehind ? 'bg-orange-100 text-orange-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {isOverallBehind ? 'In Recupero' : 'In Corso'}
                    </span>
                </div>
            </div>

            {/* Time Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-xs font-bold text-slate-400 uppercase mb-2">
                    <span>Tempo Trascorso</span>
                    <span>{Math.round(commercialMonth.progressPercentage)}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${commercialMonth.progressPercentage}%` }}
                        className="h-full bg-slate-400 rounded-full"
                    />
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic">
                    Mancano {commercialMonth.daysRemaining} giorni alla chiusura
                </p>
            </div>

            {/* Recovery Metrics */}
            <div className="space-y-4">
                {recoveryStats.map((stat) => {
                    const progress = (stat.current / stat.target) * 100;
                    const linearProgress = (stat.linearTarget / stat.target) * 100;

                    return (
                        <div key={stat.metric} className="group">
                            <div className="flex justify-between items-end mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ACTIVITY_COLORS[stat.metric] }} />
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                                        {ACTIVITY_LABELS[stat.metric]}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-medium text-slate-400 line-through mr-2">
                                        Target: {stat.target}
                                    </span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">
                                        {stat.current}
                                    </span>
                                </div>
                            </div>

                            {/* Dual Progress Bar */}
                            <div className="h-3 w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg relative overflow-hidden">
                                {/* Linear Target (The Ghost Runner) */}
                                <motion.div
                                    initial={{ left: 0 }}
                                    animate={{ left: `${linearProgress}%` }}
                                    className="absolute top-0 bottom-0 w-0.5 bg-slate-300 dark:bg-slate-600 z-10"
                                />
                                
                                {/* Actual Progress */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, progress)}%` }}
                                    className="h-full rounded-lg transition-colors"
                                    style={{ backgroundColor: ACTIVITY_COLORS[stat.metric], opacity: stat.isBehind ? 0.6 : 1 }}
                                />
                            </div>

                            {/* Recovery Insight */}
                            {stat.isBehind && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-2 flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 p-2 rounded-xl"
                                >
                                    <Zap size={14} className="text-orange-500" />
                                    <span className="text-[11px] font-bold text-orange-700 dark:text-orange-400">
                                        Recupero: {stat.recoveryDaily.toFixed(1)} azioni / giorno
                                    </span>
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>

            {isOverallBehind && (
                <div 
                    onClick={() => {
                        if (onActivateFocus && behindStats.length > 0) {
                            const mainGap = behindStats[0]; // Focus on the first most behind activity
                            onActivateFocus(
                                `Recupero ${ACTIVITY_LABELS[mainGap.metric]}`, 
                                Math.ceil(mainGap.recoveryDaily)
                            );
                        }
                    }}
                    className="mt-8 p-4 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-transform"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-500 rounded-lg">
                            <TrendingUp size={20} className="text-white" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Modalità Consigliata</p>
                            <p className="text-sm font-black text-white dark:text-slate-900">ATTIVA FOCUS RECOVERY</p>
                        </div>
                    </div>
                    <ChevronRight className="text-slate-500 group-hover:translate-x-1 transition-transform" size={20} />
                </div>
            )}
        </motion.div>
    );
};

export default GoalRecoveryWidget;
