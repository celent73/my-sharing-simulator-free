import { LEVEL_COMMISSIONS, UNLOCK_CONDITIONS } from './constants';
import { Calculator, Info, RotateCcw, Plus, Minus, Layers, Zap, User, Lock, CheckCircle2, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useShary } from '../../contexts/SharyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useDailyStats } from '../../hooks/useDailyStats';

interface EarningsSimulatorProps {
    networkSize: number[];
    onLevelChange: (index: number, value: number) => void;
    personalUnits: number;
    setPersonalUnits: (value: number) => void;
    expansionMode: 'manual' | 'auto';
    setExpansionMode: (mode: 'manual' | 'auto') => void;
    duplicationFactor: number;
    onFactorChange: (factor: number) => void;
    monthRange: string;
    setMonthRange: (range: string) => void;
    utilityType: 'DOMESTIC' | 'BUSINESS';
    setUtilityType: (type: 'DOMESTIC' | 'BUSINESS') => void;
    onReset: () => void;
}

const EarningsSimulator: React.FC<EarningsSimulatorProps> = ({
    networkSize,
    onLevelChange,
    personalUnits,
    setPersonalUnits,
    expansionMode,
    setExpansionMode,
    duplicationFactor,
    onFactorChange,
    monthRange,
    setMonthRange,
    utilityType,
    setUtilityType,
    onReset
}) => {
    const { t } = useLanguage();
    const { isActive: isSharyActive } = useShary();
    const [isSharyTipOpen, setIsSharyTipOpen] = useState(false);

    // --- REAL DATA BRIDGE LOGIC ---
    const { stats, loading: statsLoading } = useDailyStats();
    const [useRealData, setUseRealData] = useState(false);
    const [monthlyPlannedContacts, setMonthlyPlannedContacts] = useState(20);

    // Quando attiviamo i dati reali, aggiorniamo le utenze personali basandoci sulla bravura reale
    useEffect(() => {
        if (useRealData && stats.contactToContractRate > 0) {
            const calculatedUnits = Math.round(monthlyPlannedContacts * stats.contactToContractRate);
            setPersonalUnits(calculatedUnits);
        }
    }, [useRealData, monthlyPlannedContacts, stats.contactToContractRate]);

    const calculateEarnings = () => {
        let total = 0;
        const commissions = utilityType === 'DOMESTIC' ? (
            monthRange === '1' ?
                LEVEL_COMMISSIONS.DOMESTIC.RECURRING :
                monthRange === '13' ?
                    LEVEL_COMMISSIONS.DOMESTIC.RECURRING_13_24 :
                    LEVEL_COMMISSIONS.DOMESTIC.RECURRING_25_PLUS
        ) : (
            monthRange === '1' ?
                LEVEL_COMMISSIONS.BUSINESS.RECURRING :
                monthRange === '13' ?
                    LEVEL_COMMISSIONS.BUSINESS.RECURRING_13_24 :
                    LEVEL_COMMISSIONS.BUSINESS.RECURRING_25_PLUS
        );

        const level0Count = networkSize[0] || 0;
        const totalUtenzeLivello0 = level0Count + personalUnits;

        networkSize.forEach((count, level) => {
            let isUnlocked = true;
            if (level === 1) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_1;
            else if (level === 2) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_2;
            else if (level === 3) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_3;
            else if (level === 4) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_4;
            else if (level === 5) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_5;

            if (isUnlocked && commissions[level]) {
                const effectiveCount = level === 0 ? totalUtenzeLivello0 : count;
                total += effectiveCount * commissions[level];
            }
        });
        return total.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 pb-24 sm:pb-0 relative">
            {/* Left Column - Controls (Sticky on Desktop) - Widened */}
            <div className="lg:w-[520px] xl:w-[560px] shrink-0 space-y-6">
                <div className="lg:sticky lg:top-6 space-y-6">
                    {/* Header Compact */}
                    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/60 dark:border-white/10 shadow-lg relative overflow-hidden">
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <h2 className="text-3xl font-black flex items-center gap-3 text-slate-800 dark:text-white tracking-tighter">
                                <div className="w-10 h-10 rounded-xl bg-union-green-500 text-white flex items-center justify-center shadow-lg shadow-union-green-500/30">
                                    <Calculator size={20} />
                                </div>
                                {t('light_simulator.earn_title')}
                            </h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={onReset}
                                    className="p-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
                                >
                                    <RotateCcw size={16} />
                                </button>
                                {isSharyActive && (
                                    <button
                                        onClick={() => setIsSharyTipOpen(true)}
                                        className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 transition-all border border-cyan-500/20"
                                    >
                                        <span className="text-lg">🤖</span>
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-400 leading-relaxed">
                            {t('light_simulator.earn_desc')}
                        </p>
                    </div>

                    {/* Real Data Bridge Toggle */}
                    <div className="p-6 bg-gradient-to-br from-blue-50/50 to-white/50 dark:from-blue-500/5 dark:to-slate-900/50 rounded-[2rem] border-2 border-white dark:border-white/10 shadow-sm relative overflow-hidden group">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${useRealData ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 dark:bg-white/5 text-gray-400'}`}>
                                    <Zap size={20} className={useRealData ? 'animate-pulse' : ''} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight">Ponte Dati Reali</h4>
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-gray-400 opacity-60">Usa conversioni del Daily Chek</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setUseRealData(!useRealData)}
                                className={`w-14 h-8 rounded-full p-1 transition-all duration-300 ${useRealData ? 'bg-blue-500 shadow-inner' : 'bg-gray-200 dark:bg-white/10'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${useRealData ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>

                        <AnimatePresence>
                            {useRealData && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    className="pt-4 border-t border-blue-500/10 space-y-4"
                                >
                                    <div className="flex justify-between items-center bg-blue-500/5 dark:bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">
                                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase">La tua bravura reale:</span>
                                        <span className="text-sm font-black text-blue-600 dark:text-blue-300">
                                            {(stats.contactToContractRate * 100).toFixed(1)}% <span className="opacity-50 text-[8px]">Closing</span>
                                        </span>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black text-slate-500 dark:text-gray-400 uppercase tracking-widest">Contatti Pianificati/Mese</span>
                                            <span className="text-lg font-black text-blue-600">{monthlyPlannedContacts}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="200"
                                            step="5"
                                            value={monthlyPlannedContacts}
                                            onChange={(e) => setMonthlyPlannedContacts(parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>

                                    <div className="bg-union-green-500/10 p-3 rounded-xl border border-union-green-500/20 text-center">
                                        <p className="text-[10px] font-bold text-union-green-600 dark:text-union-green-400">
                                            Con {monthlyPlannedContacts} contatti produrrai circa <span className="text-sm font-black">{Math.round(monthlyPlannedContacts * stats.contactToContractRate)}</span> utenze personali.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Personal Units Slider */}
                    <div className="p-6 bg-gradient-to-br from-union-green-50/50 to-white/50 dark:from-union-green-500/5 dark:to-slate-900/50 rounded-[2rem] border-2 border-white dark:border-white/10 shadow-inner relative overflow-hidden group">
                        <div className="flex justify-between items-center mb-4 relative z-10">
                            <div>
                                <h4 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">{t('light_simulator.personal_units')}</h4>
                            </div>
                            <div className="bg-white dark:bg-slate-950 px-4 py-2 rounded-xl shadow-sm border border-union-green-500/20 text-center">
                                <span className="text-3xl font-black text-union-green-600 dark:text-union-green-400 leading-none">{personalUnits}</span>
                            </div>
                        </div>

                        <div className="relative pt-2">
                            <input
                                type="range"
                                min="0"
                                max="20"
                                value={personalUnits}
                                onChange={(e) => setPersonalUnits(parseInt(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-union-green-500 ring-2 ring-union-green-500/5"
                            />
                            <div className="flex justify-between mt-2 px-1">
                                <button onClick={() => setPersonalUnits(Math.max(0, personalUnits - 1))} className="text-gray-400 hover:text-union-green-500"><Minus size={14} /></button>
                                <button onClick={() => setPersonalUnits(Math.min(20, personalUnits + 1))} className="text-gray-400 hover:text-union-green-500"><Plus size={14} /></button>
                            </div>
                        </div>
                    </div>

                    {/* Controls Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {/* Mode Toggle */}
                        <div className="grid grid-cols-2 bg-gray-200/50 dark:bg-black/30 p-1 rounded-2xl gap-1 shadow-inner border border-white/10">
                            {['auto', 'manual'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setExpansionMode(mode as 'auto' | 'manual')}
                                    className={`relative z-10 py-4 text-sm font-black uppercase tracking-wider rounded-xl transition-all ${expansionMode === mode ? 'text-union-green-600 dark:text-union-green-400 bg-white dark:bg-slate-800 shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}
                                >
                                    {mode === 'auto' ? t('light_simulator.system_auto') : t('light_simulator.system_manual')}
                                </button>
                            ))}
                        </div>

                        {/* Duplication Factor (Auto only) */}
                        <AnimatePresence>
                            {expansionMode === 'auto' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-2xl border border-blue-500/20"
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs uppercase font-black text-blue-600 dark:text-blue-400 tracking-widest">{t('light_simulator.dupl_factor')}</span>
                                        <span className="text-xl font-black text-blue-600">x{duplicationFactor}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => onFactorChange(Math.max(1, duplicationFactor - 1))}
                                            className="text-blue-500 hover:text-blue-600 transition-colors p-1"
                                        >
                                            <Minus size={16} />
                                        </button>
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={duplicationFactor}
                                            onChange={(e) => onFactorChange(parseInt(e.target.value))}
                                            className="flex-1 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                                        />
                                        <button
                                            onClick={() => onFactorChange(Math.min(10, duplicationFactor + 1))}
                                            className="text-blue-500 hover:text-blue-600 transition-colors p-1"
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Utility Type */}
                        <div className="grid grid-cols-2 bg-gray-200/50 dark:bg-black/30 p-1 rounded-2xl gap-1 shadow-inner border border-white/10">
                            {['DOMESTIC', 'BUSINESS'].map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setUtilityType(type as 'DOMESTIC' | 'BUSINESS')}
                                    className={`relative z-10 py-4 text-sm font-black uppercase tracking-wider rounded-xl transition-all ${utilityType === type ? 'text-union-green-600 dark:text-union-green-400 bg-white dark:bg-slate-800 shadow-sm' : 'text-gray-400 hover:text-gray-500'}`}
                                >
                                    {type === 'DOMESTIC' ? t('light_simulator.domestic') : t('light_simulator.business')}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column - Results (Scrollable) */}
            <div className="flex-1 space-y-6">

                {/* Big Result Card - Compact Version */}
                <div className="relative py-6 bg-gradient-to-br from-union-green-600 to-cyan-600 rounded-[2rem] shadow-xl shadow-union-green-500/20 overflow-hidden text-center group">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
                    <div className="relative z-10 flex items-center justify-center gap-4">
                        <p className="text-[10px] uppercase font-black text-white/60 tracking-[0.3em]">{t('light_simulator.monthly_est')}</p>
                        <h3 className="text-4xl sm:text-5xl font-black text-white drop-shadow-md tracking-tighter tabular-nums">
                            {calculateEarnings()}
                        </h3>
                    </div>
                </div>

                {/* Month Range Pills */}
                <div className="grid grid-cols-3 bg-gray-200/50 dark:bg-black/30 p-1 rounded-2xl gap-1 shadow-inner border border-white/10">
                    {['1', '13', '25'].map((m) => {
                        const label = m === '1' ? t('light_simulator.months_1_12') : m === '13' ? t('light_simulator.months_13_14') : t('light_simulator.months_25_plus');
                        const isActive = monthRange === m;
                        return (
                            <button
                                key={m}
                                onClick={() => setMonthRange(m)}
                                className={`relative z-10 py-2.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all ${isActive ? 'text-union-green-600 dark:text-union-green-400 bg-white dark:bg-slate-800 shadow-md' : 'text-gray-400 hover:text-gray-500 dark:hover:text-gray-300'}`}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>

                {/* Levels List */}
                <div className="space-y-4">
                    {networkSize.map((count, i) => {
                        const isUnlocked = i === 0 || (
                            i === 1 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_1 :
                                i === 2 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_2 :
                                    i === 3 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_3 :
                                        i === 4 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_4 :
                                            i === 5 ? personalUnits >= UNLOCK_CONDITIONS.LEVEL_5 : true
                        );

                        return (
                            <motion.div
                                key={i}
                                layout
                                className={`p-5 rounded-[2rem] transition-all duration-500 border relative overflow-hidden ${isUnlocked
                                    ? 'bg-white dark:bg-slate-900/60 border-union-green-500/20 shadow-lg shadow-union-green-500/5'
                                    : 'bg-gray-50/30 dark:bg-slate-950/30 border-gray-100 dark:border-white/5 opacity-60'
                                    }`}
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all ${isUnlocked ? 'bg-union-green-500 text-white shadow-md' : 'bg-gray-200 dark:bg-white/5 text-gray-400'}`}>
                                            {isUnlocked ? <CheckCircle2 size={28} /> : <Lock size={22} />}
                                        </div>
                                        <div>
                                            <span className={`text-lg font-black uppercase tracking-tight block ${isUnlocked ? 'text-slate-800 dark:text-white' : 'text-gray-400'}`}>
                                                {t('light_simulator.level')} <span className={isUnlocked ? 'text-union-green-600' : ''}>{i}</span>
                                            </span>
                                            {!isUnlocked && (
                                                <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest block">
                                                    {t('comm_sync.needs_units', { n: i === 1 ? UNLOCK_CONDITIONS.LEVEL_1 : i === 2 ? UNLOCK_CONDITIONS.LEVEL_2 : i === 3 ? UNLOCK_CONDITIONS.LEVEL_3 : i === 4 ? UNLOCK_CONDITIONS.LEVEL_4 : UNLOCK_CONDITIONS.LEVEL_5 })}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {(expansionMode === 'manual' || i === 0) && (
                                            <button
                                                onClick={() => onLevelChange(i, Math.max(0, count - 1))}
                                                disabled={!isUnlocked}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200"
                                            >
                                                <Minus size={16} />
                                            </button>
                                        )}
                                        <span className={`text-3xl font-black tabular-nums ${isUnlocked ? 'text-slate-800 dark:text-white' : 'text-gray-300'}`}>
                                            {count}
                                        </span>
                                        {(expansionMode === 'manual' || i === 0) && (
                                            <button
                                                onClick={() => onLevelChange(i, count + 1)}
                                                disabled={!isUnlocked}
                                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-gray-200"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Premium Info Card */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-6 rounded-[2rem] border border-amber-200/50 dark:border-amber-500/10 shadow-sm relative overflow-hidden">
                    <div className="flex gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                            <Info size={18} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-amber-800 dark:text-amber-400 uppercase tracking-widest mb-1">{t('light_simulator.did_you_know')}</p>
                            <p className="text-[10px] text-amber-700 dark:text-amber-500/80 leading-relaxed font-bold opacity-80">
                                {t('light_simulator.did_you_know_text')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EarningsSimulator;
