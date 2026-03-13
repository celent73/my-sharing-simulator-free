import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ActivityType, VisionBoardData, NextAppointment, ActivityLog, ContractType, Lead } from '../types';
import { ACTIVITY_LABELS, ACTIVITY_COLORS, activityIcons } from '../constants';
import { format } from 'date-fns';
import { formatItalianDate, getCommercialMonthString, getDaysUntilCommercialMonthEnd, getCommercialMonthProgress } from '../utils/dateUtils';
import LeadCaptureModal from './LeadCaptureModal';
import AppointmentsOverviewModal from './AppointmentsOverviewModal';
import HistoryListModal from './HistoryListModal';
import {
    Plus,
    Minus,
    ChevronLeft,
    ChevronRight,
    Calendar,
    Sparkles,
    Mic,
    ShieldCheck,
    Star,
    Calculator,
    ListChecks
} from 'lucide-react';

import { CareerStatusInfo } from '../utils/careerUtils';

interface ActivityInputProps {
    activityLogs: ActivityLog[];
    todayCounts?: { [key in ActivityType]?: number };
    currentLog?: ActivityLog;
    monthTotals?: { [key in ActivityType]?: number };
    onUpdateActivity: (activity: ActivityType, change: number, dateStr: string, contractType?: ContractType) => void;
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
    onEditLead?: (lead: Lead) => void;
    isHubMode?: boolean;
    careerStatus?: CareerStatusInfo;
}

const CARD_STYLES: Record<ActivityType, { gradient: string, shadow: string, iconBg: string, border: string }> = {
    [ActivityType.CONTACTS]: {
        gradient: 'from-blue-500 to-blue-600',
        shadow: 'shadow-blue-100 dark:shadow-blue-900/10 hover:shadow-blue-200 dark:hover:shadow-blue-900/20',
        iconBg: 'bg-gradient-to-br from-blue-400 to-blue-600',
        border: 'border-blue-100 dark:border-blue-900'
    },
    [ActivityType.VIDEOS_SENT]: {
        gradient: 'from-violet-500 to-purple-600',
        shadow: 'shadow-violet-100 dark:shadow-violet-900/10 hover:shadow-violet-200 dark:hover:shadow-violet-900/20',
        iconBg: 'bg-gradient-to-br from-violet-400 to-purple-600',
        border: 'border-violet-100 dark:border-violet-900'
    },
    [ActivityType.APPOINTMENTS]: {
        gradient: 'from-emerald-400 to-teal-500',
        shadow: 'shadow-emerald-100 dark:shadow-emerald-900/10 hover:shadow-emerald-200 dark:hover:shadow-emerald-900/20',
        iconBg: 'bg-gradient-to-br from-emerald-400 to-teal-500',
        border: 'border-emerald-100 dark:border-emerald-900'
    },
    [ActivityType.NEW_CONTRACTS]: {
        gradient: 'from-orange-400 to-red-500',
        shadow: 'shadow-orange-100 dark:shadow-orange-900/10 hover:shadow-orange-200 dark:hover:shadow-orange-900/20',
        iconBg: 'bg-gradient-to-br from-orange-400 to-red-500',
        border: 'border-orange-100 dark:border-orange-900'
    },
    [ActivityType.NEW_FAMILY_UTILITY]: {
        gradient: 'from-cyan-400 to-blue-500',
        shadow: 'shadow-cyan-100 dark:shadow-cyan-900/10 hover:shadow-cyan-200 dark:hover:shadow-cyan-900/20',
        iconBg: 'bg-gradient-to-br from-cyan-400 to-blue-500',
        border: 'border-cyan-100 dark:border-cyan-900'
    },
};

const ActivityInput: React.FC<ActivityInputProps> = ({
    activityLogs,
    todayCounts = {},
    currentLog,
    onUpdateActivity,
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
    onEditLead,
    isHubMode = false,
    careerStatus
}) => {
    const { user } = useAuth();
    const [isFooterVisible, setIsFooterVisible] = React.useState(true);

    const handleScrollToTop = () => {
        const scrollContainer = document.getElementById('main-scroll-container');
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Fallback for older browsers
        setTimeout(() => {
            if (scrollContainer && scrollContainer.scrollTop > 0) {
                scrollContainer.scrollTop = 0;
            }
        }, 300);
    };

    React.useEffect(() => {
        const scrollContainer = document.getElementById('main-scroll-container');
        if (!scrollContainer) return;

        let lastScrollY = scrollContainer.scrollTop;
        const handleScroll = () => {
            const currentScrollY = scrollContainer.scrollTop;
            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsFooterVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsFooterVisible(false);
            }
            lastScrollY = currentScrollY;
        };
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, []);

    const [selectedActivityForDetails, setSelectedActivityForDetails] = useState<ActivityType | null>(null);
    const [targetDates, setTargetDates] = useState<Record<string, string>>({});
    const [isAppointmentsOverviewOpen, setIsAppointmentsOverviewOpen] = useState(false);
    const [appointmentsFilterDate, setAppointmentsFilterDate] = useState<Date | null>(null);

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

    const selectedDateFormatted = formatItalianDate(selectedDate);
    const commercialMonthStr = getCommercialMonthString(selectedDate, commercialMonthStartDay);
    const daysRemaining = getDaysUntilCommercialMonthEnd(selectedDate, commercialMonthStartDay);
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

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
        } else if (activity === ActivityType.NEW_FAMILY_UTILITY) {
            onUpdateActivity(activity, 1, selectedDateStr);
        } else {
            onUpdateActivity(activity, 1, selectedDateStr);
        }
    };

    const isToday = new Date().toDateString() === selectedDate.toDateString();

    return (
        <div className={`transition-all duration-500 ${isHubMode ? 'scale-100' : ''}`}>
            
            {/* Date Navigator Pill — always visible */}
            <div className="mb-8 flex flex-col items-center">
                <div className="w-full max-w-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-200 dark:border-slate-700 px-4 py-4">
                    {/* Row: < Date OGGI > */}
                    <div className="flex items-center justify-between gap-2">
                        <button
                            onClick={() => changeDate(-1)}
                            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
                        >
                            <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
                        </button>

                        <div className="flex items-center gap-2 flex-1 justify-center">
                            <span className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                                {selectedDateFormatted}
                            </span>
                            {isToday ? (
                                <span className="text-[10px] font-black uppercase tracking-widest bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full">
                                    OGGI
                                </span>
                            ) : (
                                <button
                                    onClick={() => onDateChange(new Date())}
                                    className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600 px-2.5 py-1 rounded-full transition-all"
                                >
                                    OGGI
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => changeDate(1)}
                            className="w-9 h-9 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all active:scale-90"
                        >
                            <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Row: CAMBIA DATA */}
                    <div className="mt-3 flex justify-center">
                        <button
                            onClick={onOpenCalendar}
                            className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-500 transition-colors"
                        >
                            <Calendar className="w-3.5 h-3.5" />
                            CAMBIA DATA
                        </button>
                    </div>
                </div>

                {/* Commercial month info below pill */}
                <div className="flex items-center gap-3 mt-2 text-xs font-medium">
                    <span className="px-2 py-0.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">{commercialMonthStr}</span>
                    <span className="font-bold text-orange-500 dark:text-orange-400">{daysRemaining} gg alla fine mese</span>
                </div>
            </div>

            {/* MAIN HUB STAGE */}
            <div className={`relative ${isHubMode ? 'flex flex-col items-center justify-center' : ''}`}>



                {/* POWER RING (Central Indicator) - Only in Hub Mode */}
                {isHubMode && (
                    <div className="mb-16 relative group">
                        <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/20 transition-all duration-700 pointer-events-none"></div>
                        <div className="relative w-64 h-64 lg:w-80 lg:h-80 rounded-full border-[1.5rem] border-slate-300/30 dark:border-slate-700/60 flex items-center justify-center shadow-[inset_0_0_60px_rgba(0,0,0,0.15)]">
                            <div className="text-center">
                                <p className="text-[10px] lg:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Guadagno Oggi</p>
                                <p className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white drop-shadow-sm">€{Math.round(dailyEarnings)}</p>
                                <button
                                    onClick={onOpenTargetCalculator}
                                    className="mt-4 p-3 bg-white/5 dark:bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all active:scale-95 mx-auto"
                                >
                                    <Calculator className="w-5 h-5 text-blue-500" />
                                </button>
                                <div className="mt-3 flex flex-col items-center gap-2">
                                    <svg className="absolute inset-[-1.5rem] w-[calc(100%+3rem)] h-[calc(100%+3rem)] -rotate-90">
                                        <circle
                                            cx="50%"
                                            cy="50%"
                                            r="48%"
                                            fill="transparent"
                                            stroke="url(#hubGradient)"
                                            strokeWidth="1.5rem"
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
                            </div>
                        </div>

                        {/* SCRIPT LIBRARY BUTTON UNDER THE RING */}
                        <div className="mt-8 relative z-20">
                            <button
                                onClick={onOpenObjectionHandler}
                                className="flex items-center gap-3 px-10 py-4 bg-[#007aff] hover:bg-[#0063cc] text-white rounded-3xl shadow-xl shadow-blue-500/30 transition-all active:scale-95 group border border-blue-400/30"
                            >
                                <Sparkles size={22} className="text-white group-hover:animate-pulse" />
                                <span className="font-black text-sm uppercase tracking-[0.2em]">Script Library</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* ACTIVITY GRID */}
                <div className="w-full mb-6">
                    <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] mb-2">
                        inserisci le tue azioni quotidiane
                    </h2>
                </div>
                <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${isHubMode ? 'lg:grid-cols-5 max-w-7xl' : 'lg:grid-cols-2'} gap-4 lg:gap-6 w-full`}>
                    {(Object.values(ActivityType) as ActivityType[]).map((activity) => {
                        const count = todayCounts[activity] || 0;
                        let label = customLabels?.[activity] || ACTIVITY_LABELS[activity];
                        if (activity === ActivityType.APPOINTMENTS) {
                            label = 'appuntamenti fissati';
                        }
                        const styles = CARD_STYLES[activity];

                        return (
                            <div key={activity} className={`group relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-slate-700 ${isHubMode ? 'rounded-[2.5rem] p-6 lg:p-10' : 'rounded-[2rem] p-5 lg:p-8'} shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-none transition-all duration-500 hover:scale-[1.05] hover:shadow-[0_30px_60px_rgba(0,0,0,0.1)]`}>
                                <div className="flex flex-col h-full justify-between gap-6">
                                    <div className="flex justify-between items-start">
                                        <div className={`h-10 w-10 ${isHubMode ? 'lg:h-12 lg:w-12' : 'lg:h-12 lg:w-12'} rounded-xl ${styles.iconBg} flex items-center justify-center text-white shadow-lg transition-transform group-hover:rotate-12`}>
                                            <div className={isHubMode ? "scale-90 lg:scale-100" : "scale-90 lg:scale-95"}>
                                                {activityIcons[activity]}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {activity === ActivityType.APPOINTMENTS && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setIsAppointmentsOverviewOpen(true); }}
                                                    className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-slate-500 hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 shadow-md hover:shadow-lg transition-all active:scale-90`}
                                                    title="Vedi appuntamenti"
                                                >
                                                    <ListChecks className="w-6 h-6 lg:w-8 lg:h-8" strokeWidth={2.5} />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => handlePlusClick(e, activity)}
                                                className={`w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-white bg-gradient-to-br ${styles.gradient} shadow-xl hover:shadow-2xl transition-all active:scale-90 animate-pulse-slow ring-4 ring-white/30 group-hover:scale-110`}
                                            >
                                                <Plus className="w-7 h-7 lg:w-10 lg:h-10 drop-shadow-md" strokeWidth={4} />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-[10px] lg:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">{label}</h3>
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

                {/* Voice Mode and Bottom Actions removed as requested */}
            </div>


            <HistoryListModal
                isOpen={!!selectedActivityForDetails}
                onClose={() => setSelectedActivityForDetails(null)}
                activityType={selectedActivityForDetails}
                activityLog={currentLog}
                customLabel={selectedActivityForDetails ? (customLabels?.[selectedActivityForDetails] || ACTIVITY_LABELS[selectedActivityForDetails]) : ''}
            />

            <AppointmentsOverviewModal
                isOpen={isAppointmentsOverviewOpen}
                onClose={() => {
                    setIsAppointmentsOverviewOpen(false);
                    setAppointmentsFilterDate(null);
                }}
                onEdit={(lead) => {
                    setIsAppointmentsOverviewOpen(false);
                    setAppointmentsFilterDate(null);
                    if (onEditLead) onEditLead(lead);
                }}
                activityLogs={activityLogs}
                filterDate={appointmentsFilterDate}
            />
        </div>
    );
};

export default ActivityInput;
