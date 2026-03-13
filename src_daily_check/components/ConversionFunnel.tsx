import React, { useMemo } from 'react';
import { ActivityType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, TrendingUp, Target } from 'lucide-react';

interface ConversionFunnelProps {
    data: {
        [key in ActivityType]?: number;
    };
    customLabels?: Record<ActivityType, string>;
}

const FunnelStep: React.FC<{
    label: string,
    value: number,
    prevValue?: number,
    color: string,
    width: number,
    bottomWidth: number,
    delay: number,
    isBottleneck?: boolean
}> = ({ label, value, prevValue, color, width, bottomWidth, delay, isBottleneck }) => {
    const rate = prevValue && prevValue > 0 ? (value / prevValue) * 100 : null;
    const formattedRate = rate?.toFixed(1);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration: 0.8 }}
            className="relative flex flex-col items-center group cursor-pointer w-full"
        >
            <div className="relative w-full flex justify-center h-48 sm:h-56">
                {/* Step Label & Value - Absolute inside the segment area */}
                <div className="absolute top-4 left-0 right-0 z-30 px-6 flex justify-between w-full max-w-[1000px] pointer-events-none">
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-400/80 dark:text-slate-500/80 drop-shadow-sm">{label}</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white drop-shadow-md">{value}</span>
                </div>

                <svg width="100%" height="100%" viewBox="0 0 1000 220" preserveAspectRatio="none" className="max-w-[1000px] overflow-visible">
                    <defs>
                        <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={color} stopOpacity="0.85" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
                        </linearGradient>
                        <filter id={`glow-${color.replace('#', '')}`} x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="6" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    
                    {/* Background Segment (Glass) */}
                    <path
                        d={`M ${500 - width / 2} 0 L ${500 + width / 2} 0 L ${500 + bottomWidth / 2} 220 L ${500 - bottomWidth / 2} 220 Z`}
                        fill="currentColor"
                        className="text-slate-200/20 dark:text-slate-700/20 backdrop-blur-xl"
                    />

                    {/* Animated Fill Segment */}
                    <motion.path
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ delay: delay + 0.3, duration: 1.5, ease: "easeInOut" }}
                        d={`M ${500 - width / 2} 0 L ${500 + width / 2} 0 L ${500 + bottomWidth / 2} 220 L ${500 - bottomWidth / 2} 220 Z`}
                        fill={`url(#grad-${color})`}
                        stroke={color}
                        strokeWidth="1.5"
                        filter={`url(#glow-${color.replace('#', '')})`}
                        className={isBottleneck ? "animate-pulse" : ""}
                    />
                </svg>

                {/* Conversion Rate Badge */}
                {rate !== null && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0, x: 30 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        transition={{ delay: delay + 0.8, type: "spring", stiffness: 150 }}
                        className={`absolute bottom-6 right-2 sm:right-6 rounded-2xl p-[1.5px] shadow-2xl z-40 overflow-hidden
                            ${isBottleneck 
                                ? 'bg-gradient-to-tr from-red-500 to-orange-400' 
                                : 'bg-gradient-to-tr from-slate-200 to-white dark:from-slate-700 dark:to-slate-600'}`}
                    >
                        <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-[14px] flex flex-col items-center">
                            <span className={`text-[9px] font-black uppercase leading-none mb-0.5 ${isBottleneck ? 'text-red-500' : 'text-slate-400'}`}>
                                {isBottleneck ? 'Strozzatura' : 'Conv.'}
                            </span>
                            <span className={`text-base font-black leading-none ${isBottleneck ? 'text-red-600' : 'text-blue-500'}`}>
                                {formattedRate}%
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ data, customLabels }) => {
    const steps = useMemo(() => [
        { type: ActivityType.CONTACTS, color: '#3b82f6', width: 1000, bottom: 850, label: customLabels?.CONTACTS || 'Contatti' },
        { type: ActivityType.VIDEOS_SENT, color: '#8b5cf6', width: 850, bottom: 700, label: customLabels?.VIDEOS_SENT || 'Video Inviati' },
        { type: ActivityType.APPOINTMENTS, color: '#10b981', width: 700, bottom: 550, label: customLabels?.APPOINTMENTS || 'Appuntamenti' },
        { type: ActivityType.NEW_CONTRACTS, color: '#f97316', width: 550, bottom: 400, label: customLabels?.NEW_CONTRACTS || 'Contratti' },
    ], [customLabels]);

    const values = useMemo(() => steps.map(s => data[s.type] || 0), [steps, data]);

    const rates = useMemo(() => {
        return values.map((val, i) => {
            if (i === 0) return null;
            const prev = values[i - 1];
            return prev > 0 ? (val / prev) * 100 : 0;
        });
    }, [values]);

    const bottleneckIndex = useMemo(() => {
        let minRate = 101;
        let index = -1;
        rates.forEach((rate, i) => {
            if (rate !== null && rate < minRate) {
                minRate = rate;
                index = i;
            }
        });
        return index;
    }, [rates]);

    const insight = useMemo(() => {
        if (bottleneckIndex === -1 || !steps || !steps[bottleneckIndex] || !rates) return null;
        const bottleneckStep = steps[bottleneckIndex];
        const rate = rates[bottleneckIndex];

        if (rate === null || rate === undefined) return null;

        if (rate < 30) {
            return {
                icon: <AlertCircle size={18} className="text-red-500" />,
                title: "Criticità rilevata",
                text: `Stai perdendo molti contatti nella fase "${bottleneckStep.label}". Dovresti rivedere lo script o la tecnica in questo punto.`,
                color: "border-red-500 bg-red-50 dark:bg-red-900/10"
            };
        } else if (rate < 60) {
            return {
                icon: <Target size={18} className="text-orange-500" />,
                title: "Margine di miglioramento",
                text: `Il passaggio a "${bottleneckStep.label}" è il tuo punto debole attuale. Con un piccolo sforzo qui, i tuoi risultati finali esploderanno.`,
                color: "border-orange-500 bg-orange-50 dark:bg-orange-900/10"
            };
        } else {
            return {
                icon: <TrendingUp size={18} className="text-emerald-500" />,
                title: "Flusso equilibrato",
                text: "Il tuo imbuto è sano! Continua così e punta ad aumentare il volume dei contatti per scalare la produzione.",
                color: "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10"
            };
        }
    }, [bottleneckIndex, rates, steps]);

    return (
        <div className="w-full flex flex-col items-center py-4">
            <div className="w-full flex flex-col items-stretch space-y-2">
                {steps.map((step, i) => (
                    <FunnelStep
                        key={step.type}
                        label={step.label}
                        value={values[i]}
                        prevValue={i > 0 ? values[i - 1] : undefined}
                        color={step.color}
                        width={step.width}
                        bottomWidth={step.bottom}
                        delay={i * 0.1}
                        isBottleneck={i === bottleneckIndex && rates[i]! < 60}
                    />
                ))}
            </div>

            {/* Strategic Insights Section */}
            <AnimatePresence>
                {insight && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mt-10 w-full max-w-[800px] p-8 rounded-[3rem] border ${insight.color} shadow-2xl transition-all`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">{insight.icon}</div>
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white mb-1">
                                    {insight.title}
                                </h4>
                                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {insight.text}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mt-8 flex flex-col items-center gap-2">
                <div className="h-1.5 w-24 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent rounded-full"></div>
                <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Visual Pipeline AI powered</p>
            </div>
        </div>
    );
};

export default ConversionFunnel;
