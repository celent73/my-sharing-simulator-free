import React, { useState } from 'react';
import { Lightbulb, ShoppingBag, Users, CheckCircle2, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { LEVEL_COMMISSIONS, UNLOCK_CONDITIONS } from './constants';
import { useLanguage } from '../../contexts/LanguageContext';

interface RoadToZeroProps {
    networkSize: number[];
    utilityType: 'DOMESTIC' | 'BUSINESS';
    monthRange: string;
    personalUnits: number;
}

const RoadToZero: React.FC<RoadToZeroProps> = ({ networkSize, utilityType, monthRange, personalUnits }) => {
    const { t } = useLanguage();
    const [billAmount, setBillAmount] = useState(80);
    const [monthlySpending, setMonthlySpending] = useState(400);

    const cashback = monthlySpending * 0.03; // 3% average cashback

    // Calculate actual earnings from network
    const commissions = utilityType === 'DOMESTIC' ? (
        monthRange === '1' ? LEVEL_COMMISSIONS.DOMESTIC.RECURRING :
            monthRange === '13' ? LEVEL_COMMISSIONS.DOMESTIC.RECURRING_13_24 :
                LEVEL_COMMISSIONS.DOMESTIC.RECURRING_25_PLUS
    ) : (
        monthRange === '1' ? LEVEL_COMMISSIONS.BUSINESS.RECURRING :
            monthRange === '13' ? LEVEL_COMMISSIONS.BUSINESS.RECURRING_13_24 :
                LEVEL_COMMISSIONS.BUSINESS.RECURRING_25_PLUS
    );

    let networkEarnings = 0;
    networkSize.forEach((count, i) => {
        let isUnlocked = true;
        if (i === 1) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_1;
        else if (i === 2) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_2;
        else if (i === 3) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_3;
        else if (i === 4) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_4;
        else if (i === 5) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_5;

        if (isUnlocked) {
            networkEarnings += count * commissions[i];
        }
    });

    // Also add personal units earnings
    networkEarnings += personalUnits * commissions[0];

    const totalDiscount = cashback + networkEarnings;
    const isZeroed = totalDiscount >= billAmount;
    const progress = Math.min(100, (totalDiscount / billAmount) * 100);

    return (
        <div className="space-y-8 pb-24 sm:pb-0 text-slate-800 dark:text-white">
            {/* Header RTZ Premium */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 sm:p-8 rounded-[3rem] border border-white/60 dark:border-white/10 shadow-xl relative overflow-hidden"
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                        <Lightbulb size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tighter">{t('light_simulator.rtz_title')}</h2>
                        <p className="text-xs font-bold text-slate-500 dark:text-gray-400 mt-1 uppercase tracking-widest opacity-70">Obiettivo Bolletta Zero</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black text-slate-400 dark:text-gray-500 tracking-widest block ml-2">{t('light_simulator.rtz_bill')}</label>
                        <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-union-green-600 dark:text-union-green-400 font-black text-lg">€</span>
                            <input
                                type="number"
                                value={billAmount || ''}
                                onChange={(e) => setBillAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                                onFocus={(e) => e.target.select()}
                                className="w-full bg-gray-100 dark:bg-white/5 p-5 pl-10 rounded-2xl font-black text-xl outline-none border-2 border-transparent focus:border-union-green-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white shadow-inner"
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase font-black text-slate-400 dark:text-gray-500 tracking-widest block ml-2">{t('light_simulator.rtz_spend')}</label>
                        <div className="relative group">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-cyan-600 dark:text-cyan-400 font-black text-lg">€</span>
                            <input
                                type="number"
                                value={monthlySpending || ''}
                                onChange={(e) => setMonthlySpending(e.target.value === '' ? 0 : Number(e.target.value))}
                                onFocus={(e) => e.target.select()}
                                className="w-full bg-gray-100 dark:bg-white/5 p-5 pl-10 rounded-2xl font-black text-xl outline-none border-2 border-transparent focus:border-cyan-500 focus:bg-white dark:focus:bg-slate-800 transition-all text-slate-800 dark:text-white shadow-inner"
                                placeholder="0"
                            />
                        </div>
                    </div>
                </div>

                {/* Progress Visualizer Premium */}
                <div className="mb-10 p-8 bg-gray-200/30 dark:bg-black/20 rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-inner relative overflow-hidden group">
                    <div className="flex justify-between items-end mb-6 relative z-10">
                        <div>
                            <p className="text-[10px] font-black uppercase text-slate-400 dark:text-gray-500 tracking-widest mb-1">{t('light_simulator.rtz_coverage')}</p>
                            <h3 className="text-3xl sm:text-4xl font-black tabular-nums">
                                <span className="text-union-green-600 dark:text-union-green-400">€{totalDiscount.toFixed(2)}</span>
                                <span className="text-sm font-bold text-slate-400 dark:text-gray-500 ml-2">/ €{billAmount}</span>
                            </h3>
                        </div>
                        <div className={`px-5 py-2 rounded-2xl text-xs font-black shadow-lg transition-all duration-500 ${isZeroed ? 'bg-gradient-to-r from-union-green-600 to-cyan-600 text-white scale-110' : 'bg-white dark:bg-slate-800 text-union-green-600 dark:text-union-green-400'}`}>
                            {isZeroed ? t('light_simulator.rtz_zeroed') : `${Math.round(progress)}%`}
                        </div>
                    </div>

                    <div className="h-6 bg-white dark:bg-slate-800 rounded-full overflow-hidden p-1.5 shadow-inner border border-gray-100 dark:border-white/5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                            className={`h-full rounded-full transition-all duration-700 relative ${isZeroed ? 'bg-gradient-to-r from-union-green-500 to-cyan-500 shadow-[0_0_20px_rgba(34,197,94,0.4)]' : 'bg-gradient-to-r from-union-green-500/60 to-union-green-500'}`}
                        >
                            {!isZeroed && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
                        </motion.div>
                    </div>
                </div>

                {/* Results Section Breakdown Premium */}
                <motion.div
                    layout
                    className="relative p-8 bg-slate-900 dark:bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-union-green-500/10 blur-[100px] -mr-32 -mt-32 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-[100px] -ml-32 -mb-32 pointer-events-none"></div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">{t('light_simulator.rtz_detail')}</p>
                            {isZeroed ? (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 bg-union-green-500/20 px-3 py-1 rounded-full border border-union-green-500/30">
                                    <CheckCircle2 className="text-union-green-500 w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase text-union-green-500">Completato</span>
                                </motion.div>
                            ) : (
                                <div className="flex items-center gap-2 opacity-40">
                                    <TrendingUp className="text-white w-4 h-4" />
                                    <span className="text-[9px] font-black uppercase text-white">In corso</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all">
                                <div className="w-10 h-10 rounded-2xl bg-union-green-500/20 flex items-center justify-center mb-4 text-union-green-500 group-hover:scale-110 transition-transform">
                                    <ShoppingBag size={20} />
                                </div>
                                <p className="text-2xl font-black text-white mb-1">€{cashback.toFixed(2)}</p>
                                <p className="text-[10px] opacity-40 uppercase font-black tracking-widest">{t('light_simulator.rtz_from_spend')}</p>
                            </div>
                            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all">
                                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 flex items-center justify-center mb-4 text-cyan-500 group-hover:scale-110 transition-transform">
                                    <Users size={20} />
                                </div>
                                <p className="text-2xl font-black text-white mb-1">€{networkEarnings.toFixed(2)}</p>
                                <p className="text-[10px] opacity-40 uppercase font-black tracking-widest">{t('light_simulator.rtz_from_comm')}</p>
                            </div>
                        </div>

                        {!isZeroed && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-4 text-center border-t border-white/5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">
                                    {t('light_simulator.rtz_missing').split('€')[0]}
                                    <span className="text-amber-500 text-xs font-black mx-1">€{(billAmount - totalDiscount).toFixed(2)}</span>
                                    {t('light_simulator.rtz_missing').split('€')[1] || ''}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </motion.div>

            {/* Note RTZ Premium */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-4 p-6 bg-union-green-500/5 dark:bg-union-green-500/10 rounded-[2.5rem] border border-union-green-500/20 shadow-lg"
            >
                <div className="w-12 h-12 rounded-2xl bg-union-green-500/20 text-union-green-600 dark:text-union-green-400 flex items-center justify-center shrink-0 shadow-inner">
                    <CheckCircle2 size={24} />
                </div>
                <p className="text-xs opacity-70 leading-relaxed italic text-slate-600 dark:text-gray-400 font-bold">
                    {t('light_simulator.rtz_note')}
                </p>
            </motion.div>
        </div>
    );
};

export default RoadToZero;
