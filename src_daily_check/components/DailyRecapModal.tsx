import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Zap, TrendingUp, Award, Share2, Sparkles, X, ChevronRight } from 'lucide-react';
import { SessionStats } from '../utils/sessionUtils';
import PowerRing from './PowerRing';

interface DailyRecapModalProps {
    isOpen: boolean;
    onClose: () => void;
    stats: SessionStats;
    onFinalize: () => void;
}

const DailyRecapModal: React.FC<DailyRecapModalProps> = ({ isOpen, onClose, stats, onFinalize }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20"
                >
                    {/* Header - Glass Style */}
                    <div className="p-8 pb-4 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-500/10 to-transparent" />

                        <div className="h-20 w-20 rounded-3xl bg-blue-500/10 flex items-center justify-center mb-4 relative">
                            <Sparkles className="w-10 h-10 text-blue-500" />
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl"
                            />
                        </div>

                        <h2 className="text-3xl font-black text-slate-800 dark:text-white mb-1">Sessione Completa!</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Riepilogo giornaliero</p>
                    </div>

                    {/* Stats Content */}
                    <div className="p-8 pt-0 space-y-8 overflow-y-auto flex-1">

                        {/* Efficiency Score Ring */}
                        <div className="flex justify-center py-4">
                            <div className="relative h-48 w-48">
                                <PowerRing
                                    size={192}
                                    strokeWidth={16}
                                    progress={stats.efficiencyScore}
                                    color="#3b82f6"
                                    glowColor="rgba(59, 130, 246, 0.4)"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
                                    <span className="text-5xl font-black text-slate-800 dark:text-white">{stats.efficiencyScore}%</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Efficienza</span>
                                </div>
                            </div>
                        </div>

                        {/* Conversion Funnel */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                Tassi di Conversione
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-2xl font-black text-blue-500">{stats.conversionRates.contactToAppointment}%</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase leading-tight">Contatti ➔ Appuntamenti</div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-800">
                                    <div className="text-2xl font-black text-emerald-500">{stats.conversionRates.appointmentToContract}%</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase leading-tight">Appuntamenti ➔ Contratti</div>
                                </div>
                            </div>
                        </div>

                        {/* Pro Tip - Glass Box */}
                        <div className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-500/10 dark:to-indigo-500/10 p-6 rounded-[2rem] border border-blue-500/10 flex gap-4 items-start relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors" />
                            <div className="h-10 w-10 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center flex-shrink-0">
                                <Target className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-800 dark:text-white text-sm mb-1">Consiglio Pro</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                                    "{stats.proTip}"
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-8 pt-4 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-4 px-6 rounded-2xl font-bold text-slate-500 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 active:scale-95 transition-all"
                            >
                                Modifica Dati
                            </button>
                            <button
                                onClick={() => {
                                    onFinalize();
                                    onClose();
                                }}
                                className="flex-1 py-4 px-6 rounded-2xl font-black text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
                            >
                                Fine Sessione <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default DailyRecapModal;
