import React, { useState } from 'react';
import { ActivityType, VisionBoardData, NextAppointment, ActivityLog, ContractType } from '../types';
import { ACTIVITY_LABELS, ACTIVITY_COLORS, activityIcons } from '../constants';
import { formatItalianDate, getCommercialMonthString, getDaysUntilCommercialMonthEnd, getCommercialMonthProgress } from '../utils/dateUtils';
import HistoryListModal from './HistoryListModal';
import {
    Plus,
    Minus,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Zap,
    Mic,
    ShieldCheck,
    Star,
    Calculator
} from 'lucide-react';

import { CareerStatusInfo } from '../utils/careerUtils';

interface ActivityInputProps {
    todayCounts?: { [key in ActivityType]?: number };
    currentLog?: ActivityLog;
    monthTotals?: { [key in ActivityType]?: number };
    onUpdateActivity: (activity: ActivityType, change: number, dateStr: string, contractType?: ContractType) => void;
    onOpenPowerMode: () => void;
    onOpenObjectionHandler: () => void;
    onOpenSocialShare: () => void;
    selectedDate: Date;
    onDateChange: (date: Date) => void;
    commercialMonthStartDay: number;
    customLabels?: Record<ActivityType, string>;
    dailyEarnings?: number;
    monthlyEarnings?: number;
    onOpenContractModal?: () => void;
    onOpenAppointmentModal?: (step?: 'choice' | 'schedule') => void;
    visionBoardData?: VisionBoardData;
    nextAppointment?: NextAppointment;
    onOpenSettings?: (tab: 'profile' | 'goals' | 'labels') => void;
    onOpenVisionBoardSettings?: () => void;
    onOpenLeadCapture?: (type: ActivityType) => void;
    onOpenCalendar?: () => void;
    onOpenVoiceMode?: () => void;
    onOpenTargetCalculator?: () => void;
    onUpdateTarget?: (newAmount: number) => void;
    onOpenTeamChallenge?: () => void;
    isHubMode?: boolean;
    careerStatus?: CareerStatusInfo;
}

const CARD_STYLES: Record<ActivityType, { gradient: string, shadow: string, iconBg: string, border: string }> = {
    [ActivityType.CONTACTS]: {
        gradient: 'from-blue-500 to-blue-600',
        shadow: 'shadow-blue-200 dark:shadow-blue-900/30 hover:shadow-blue-300 dark:hover:shadow-blue-900/50',
        iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
        border: 'border-blue-200 dark:border-blue-800'
    },
    [ActivityType.VIDEOS_SENT]: {
        gradient: 'from-violet-500 to-purple-600',
        shadow: 'shadow-violet-200 dark:shadow-violet-900/30 hover:shadow-violet-300 dark:hover:shadow-violet-900/50',
        iconBg: 'bg-gradient-to-br from-violet-400 to-purple-600',
        border: 'border-violet-200 dark:border-violet-800'
    },
    [ActivityType.APPOINTMENTS]: {
        gradient: 'from-emerald-400 to-teal-500',
        shadow: 'shadow-emerald-200 dark:shadow-emerald-900/30 hover:shadow-emerald-300 dark:hover:shadow-emerald-900/50',
        iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
        border: 'border-emerald-200 dark:border-emerald-800'
    },
    [ActivityType.NEW_CONTRACTS]: {
        gradient: 'from-orange-400 to-red-500',
        shadow: 'shadow-orange-200 dark:shadow-orange-900/30 hover:shadow-orange-300 dark:hover:shadow-orange-900/50',
        iconBg: 'bg-gradient-to-br from-orange-400 to-red-500',
        border: 'border-orange-200 dark:border-orange-800'
    },
    [ActivityType.NEW_FAMILY_UTILITY]: {
        gradient: 'from-cyan-400 to-blue-500',
        shadow: 'shadow-cyan-200 dark:shadow-cyan-900/30 hover:shadow-cyan-300 dark:hover:shadow-cyan-900/50',
        iconBg: 'bg-gradient-to-br from-cyan-400 to-blue-500',
        border: 'border-cyan-200 dark:border-cyan-800'
    },
};

const ActivityInput: React.FC<ActivityInputProps> = ({
    todayCounts = {},
    currentLog,
    onUpdateActivity,
    onOpenPowerMode,
    onOpenObjectionHandler,
    selectedDate,
    onDateChange,
    commercialMonthStartDay,
    customLabels,
    dailyEarnings = 0,
    onOpenContractModal,
    onOpenAppointmentModal,
    onOpenCalendar,
    onOpenVoiceMode,
    onOpenTargetCalculator,
    onOpenLeadCapture,
    isHubMode = false,
    careerStatus
}) => {
    const [selectedActivityForDetails, setSelectedActivityForDetails] = useState<ActivityType | null>(null);
    const [targetDates, setTargetDates] = useState<Record<string, string>>({});

    React.useEffect(() => {
        if (!isHubMode) return;

        const loadDates = () => {
            const saved = localStorage.getItem('dailyCheck_careerPathDates');
            if (saved) {
                try {
                    setTargetDates(JSON.parse(saved));
                } catch (e) { }
            }
        };

        loadDates();
        window.addEventListener('careerDatesUpdated', loadDates);
        return () => window.removeEventListener('careerDatesUpdated', loadDates);
    }, [isHubMode]);

    const upcomingDeadlineMessage = React.useMemo(() => {
        if (!careerStatus || !isHubMode) return null;

        const qualificationsOrder = [
            'Family pro', 'Family pro 3x3', 'Family 3s', 'Family 5s', 'Top family',
            'Pro manager', 'Regional manager', 'National manager', 'Director',
            'Director pro', 'Ambassador', 'President'
        ].map(s => s.toLowerCase());

        const currentLvlName = careerStatus.currentLevel.qualificationValue
            ? careerStatus.currentLevel.qualificationValue.toLowerCase()
            : careerStatus.currentLevel.name.toLowerCase();

        let currentIndex = qualificationsOrder.indexOf(currentLvlName);
        if (['family utility', 'consulente junior', 'consulente senior', 'team leader', 'manager', 'top manager'].includes(currentLvlName)) {
            currentIndex = -1;
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        let foundMessage = null;
        let minDiff = Infinity;

        for (const [stageName, dateStr] of Object.entries(targetDates)) {
            const stageIndex = qualificationsOrder.indexOf(stageName.toLowerCase());

            // Only warn about future unreached targets, or correctly recognize missed targets
            if (stageIndex > currentIndex || currentIndex === -1) {
                const targetDate = new Date(dateStr);
                const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 3600 * 24));

                // Show warning if <= 30 days away, or up to 7 days overdue
                if (diffDays <= 30 && diffDays >= -7 && diffDays < minDiff) {
                    minDiff = diffDays;
                    if (diffDays > 0) {
                        foundMessage = `⚠️ Scadenza "${stageName}" tra ${diffDays} gg (${targetDate.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })})`;
                    } else if (diffDays === 0) {
                        foundMessage = `🚨 Oggi scade il traguardo "${stageName}"! Dai il massimo!`;
                    } else {
                        foundMessage = `⚠️ Obiettivo "${stageName}" (scaduto il ${targetDate.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })}) non ancora raggiunto!`;
                    }
                }
            }
        }
        return foundMessage;
    }, [careerStatus, targetDates, isHubMode]);

    const selectedDateFormatted = formatItalianDate(selectedDate);
    const commercialMonthStr = getCommercialMonthString(selectedDate, commercialMonthStartDay);
    const daysRemaining = getDaysUntilCommercialMonthEnd(selectedDate, commercialMonthStartDay);
    const selectedDateStr = selectedDate.toISOString().split('T')[0];

    const changeDate = (days: number) => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + days);
        onDateChange(newDate);
    }

    const handlePlusClick = (e: React.MouseEvent, activity: ActivityType) => {
        e.stopPropagation();
        if (activity === ActivityType.NEW_CONTRACTS && onOpenContractModal) {
            onOpenContractModal();
        } else if (activity === ActivityType.APPOINTMENTS && onOpenAppointmentModal) {
            onOpenAppointmentModal('choice');
        } else if (activity === ActivityType.CONTACTS && onOpenLeadCapture) {
            onOpenLeadCapture(ActivityType.CONTACTS);
        } else {
            onUpdateActivity(activity, 1, selectedDateStr);
        }
    };

    const isToday = new Date().toDateString() === selectedDate.toDateString();

    return (
        <div className={`transition-all duration-500 ${isHubMode ? 'scale-100' : ''}`}>
            {/* Header section - Hidden in Hub Mode */}
            {!isHubMode && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{selectedDateFormatted}</h2>
                            {isToday && <div className="bg-blue-500/10 text-blue-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20 uppercase">Oggi</div>}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-medium">
                            <span className="text-sm px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">{commercialMonthStr}</span>
                            <span className="text-sm font-bold text-orange-400">{daysRemaining} gg alla fine</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={() => changeDate(-1)} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-sm active:scale-95">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={onOpenCalendar} className="px-6 py-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2 font-bold text-slate-600 dark:text-slate-200 active:scale-95">
                            <Calendar className="w-5 h-5 text-blue-500" />
                            <span>Calendario</span>
                        </button>
                        <button onClick={() => changeDate(1)} className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-sm active:scale-95">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {/* MAIN HUB STAGE */}
            <div className={`relative ${isHubMode ? 'flex flex-col items-center justify-center' : ''}`}>

                {/* POWER RING (Central Indicator) - Only in Hub Mode */}
                {isHubMode && (
                    <div className="mb-16 relative group">
                        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700"></div>
                        <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full border-[1.2rem] border-slate-200/20 dark:border-slate-800/50 flex items-center justify-center shadow-[inset_0_0_50px_rgba(0,0,0,0.1)]">
                            <div className="text-center">
                                <p className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Guadagno Oggi</p>
                                <p className="text-4xl lg:text-6xl font-black text-slate-800 dark:text-white drop-shadow-sm">€{Math.round(dailyEarnings)}</p>
                                <button
                                    onClick={onOpenTargetCalculator}
                                    className="mt-4 p-3 bg-white/5 dark:bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all active:scale-95 mx-auto"
                                >
                                    <Calculator className="w-5 h-5 text-blue-500" />
                                </button>
                                <div className="mt-3 flex flex-col items-center gap-2">
                                    <svg className="absolute inset-[-1.2rem] w-[calc(100%+2.4rem)] h-[calc(100%+2.4rem)] -rotate-90">
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="48%"
                                            fill="transparent"
                                            stroke="url(#hubGradient)"
                                            strokeWidth="1.2rem"
                                            strokeDasharray={`${Math.min(dailyEarnings / 10, 100) * 3} 1000`}
                                            strokeLinecap="round"
                                            className="drop-shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all duration-1000"
                                        />
                                        <defs>
                                            <linearGradient id="hubGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#a3e635" />
                                                <stop offset="100%" stopColor="#10b981" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                {/* WARNING MESSAGE PLACED OUTSIDE THE CIRCLE */}
                                {upcomingDeadlineMessage && (
                                    <div className="absolute top-[105%] left-1/2 -translate-x-1/2 w-max max-w-[90vw] z-10 hidden sm:block">
                                        <span className="text-[11px] sm:text-xs font-black text-red-500 bg-red-500/10 py-2 px-5 rounded-full border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-pulse inline-flex items-center gap-2 backdrop-blur-md">
                                            {upcomingDeadlineMessage}
                                        </span>
                                    </div>
                                )}
                                {/* Mobile centered warning, adjusting absolute position logic */}
                                {upcomingDeadlineMessage && (
                                    <div className="mt-8 flex justify-center w-full sm:hidden relative z-10 text-center px-4">
                                        <span className="text-[11px] font-black text-red-500 bg-red-500/10 py-2 px-5 rounded-full border border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-pulse inline-flex items-center gap-2 backdrop-blur-md">
                                            {upcomingDeadlineMessage}
                                        </span>
                                    </div>
                                )}
                            </div>
                )}

                            {/* ACTIVITY GRID */}
                            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${isHubMode ? 'lg:grid-cols-5 max-w-7xl' : 'lg:grid-cols-2'} gap-4 lg:gap-6 w-full`}>
                                {(Object.values(ActivityType) as ActivityType[]).map((activity) => {
                                    const count = todayCounts[activity] || 0;
                                    const label = customLabels?.[activity] || ACTIVITY_LABELS[activity];
                                    const styles = CARD_STYLES[activity];

                                    return (
                                        <div key={activity} className={`group relative bg-white dark:bg-slate-900 border-2 ${styles.border} ${isHubMode ? 'rounded-[2.5rem] p-6 lg:p-10' : 'rounded-[2rem] p-5 lg:p-8'} shadow-xl ${styles.shadow} transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl`}>
                                            <div className="flex flex-col h-full justify-between gap-6">
                                                <div className="flex justify-between items-start">
                                                    <div className={`h-12 w-12 ${isHubMode ? 'lg:h-16 lg:w-16' : 'lg:h-14 lg:w-14'} rounded-2xl ${styles.iconBg} flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12`}>
                                                        <div className={isHubMode ? "scale-110 lg:scale-125" : "scale-100 lg:scale-110"}>
                                                            {activityIcons[activity]}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => handlePlusClick(e, activity)}
                                                        className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-white bg-gradient-to-br ${styles.gradient} shadow-lg hover:shadow-xl transition-all active:scale-95 group-hover:scale-110`}
                                                    >
                                                        <Plus className="w-6 h-6 lg:w-8 lg:h-8 drop-shadow-md" strokeWidth={3} />
                                                    </button>
                                                </div>

                                                <div>
                                                    <h3 className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</h3>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className={`font-black bg-gradient-to-br ${styles.gradient} text-transparent bg-clip-text ${isHubMode ? 'text-5xl lg:text-6xl' : 'text-4xl lg:text-5xl'}`}>
                                                            {count}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <button
                                                        onClick={() => onUpdateActivity(activity, -1, selectedDateStr)}
                                                        className="p-2 sm:p-2.5 rounded-xl text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-600/30 transition-all disabled:opacity-40 disabled:bg-red-600 disabled:text-white disabled:shadow-none active:scale-95"
                                                        disabled={count === 0}
                                                    >
                                                        <Minus className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-sm" strokeWidth={3} />
                                                    </button>
                                                    <div className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full bg-gradient-to-r ${styles.gradient} transition-all duration-700`}
                                                            style={{ width: `${Math.min((count / 10) * 100, 100)}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions Footer - Removed */}
                        <div className={`mt-12 flex flex-wrap items-center justify-center gap-4 ${isHubMode ? 'opacity-80' : ''}`}>
                            {/* Buttons removed as requested */}
                        </div>

                        <HistoryListModal
                            isOpen={!!selectedActivityForDetails}
                            onClose={() => setSelectedActivityForDetails(null)}
                            activityType={selectedActivityForDetails}
                            activityLog={currentLog}
                            customLabel={selectedActivityForDetails ? (customLabels?.[selectedActivityForDetails] || ACTIVITY_LABELS[selectedActivityForDetails]) : ''}
                        />
                    </div>
                );
};

                export default ActivityInput;
