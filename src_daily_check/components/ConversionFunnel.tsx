import React from 'react';
import { ActivityType } from '../types';
import { motion } from 'framer-motion';

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
    delay: number
}> = ({ label, value, prevValue, color, width, bottomWidth, delay }) => {
    const rate = prevValue && prevValue > 0 ? ((value / prevValue) * 100).toFixed(1) : null;

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.8 }}
            className="relative flex flex-col items-center mb-1 group"
        >
            {/* Step Label & Value */}
            <div className="flex justify-between w-full max-w-[400px] px-4 mb-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</span>
                <span className="text-sm font-black text-slate-800 dark:text-white">{value}</span>
            </div>

            {/* Funnel Segment SVG */}
            <div className="relative w-full flex justify-center h-20">
                <svg width="400" height="80" viewBox="0 0 400 80" preserveAspectRatio="none" className="drop-shadow-lg overflow-visible">
                    <defs>
                        <linearGradient id={`grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
                            <stop offset="100%" stopColor={color} stopOpacity="0.7" />
                        </linearGradient>
                    </defs>
                    <motion.path
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: delay + 0.2, duration: 1 }}
                        d={`M ${200 - width / 2} 0 L ${200 + width / 2} 0 L ${200 + bottomWidth / 2} 80 L ${200 - bottomWidth / 2} 80 Z`}
                        fill={`url(#grad-${color})`}
                        stroke="white"
                        strokeWidth="1"
                        strokeOpacity="0.1"
                    />
                </svg>

                {/* Conversion Rate Badge */}
                {rate !== null && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: delay + 0.5 }}
                        className="absolute top-1/2 left-[calc(50%+100px)] -translate-y-1/2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-3 py-1.5 rounded-2xl shadow-xl z-20"
                    >
                        <div className="flex flex-col items-center">
                            <span className="text-[9px] font-black text-slate-400 uppercase leading-none mb-0.5">Conv.</span>
                            <span className="text-xs font-black text-blue-500 leading-none">{rate}%</span>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Micro-glow effect */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity bg-gradient-to-b from-transparent via-white to-transparent`}></div>
        </motion.div>
    );
};

const ConversionFunnel: React.FC<ConversionFunnelProps> = ({ data, customLabels }) => {
    const steps = [
        { type: ActivityType.CONTACTS, color: '#3b82f6', width: 340, bottom: 280, label: customLabels?.CONTACTS || 'Contatti' },
        { type: ActivityType.VIDEOS_SENT, color: '#8b5cf6', width: 280, bottom: 220, label: customLabels?.VIDEOS_SENT || 'Video Inviati' },
        { type: ActivityType.APPOINTMENTS, color: '#10b981', width: 220, bottom: 160, label: customLabels?.APPOINTMENTS || 'Appuntamenti' },
        { type: ActivityType.NEW_CONTRACTS, color: '#f97316', width: 160, bottom: 100, label: customLabels?.NEW_CONTRACTS || 'Contratti' },
    ];

    const values = steps.map(s => data[s.type] || 0);

    return (
        <div className="w-full flex flex-col items-center py-8">
            <div className="w-full max-w-[500px] flex flex-col items-stretch">
                {steps.map((step, i) => (
                    <FunnelStep
                        key={step.type}
                        label={step.label}
                        value={values[i]}
                        prevValue={i > 0 ? values[i - 1] : undefined}
                        color={step.color}
                        width={step.width}
                        bottomWidth={step.bottom}
                        delay={i * 0.2}
                    />
                ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-2">
                <div className="h-1.5 w-24 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-700 to-transparent rounded-full"></div>
                <p className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Visual Pipeline</p>
            </div>
        </div>
    );
};

export default ConversionFunnel;
