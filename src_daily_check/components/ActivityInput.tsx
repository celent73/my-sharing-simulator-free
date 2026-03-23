import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../contexts/AuthContext';
import { ActivityType, VisionBoardData, NextAppointment, ActivityLog, ContractType, Lead, ViewMode, Goals } from '../types';
import { ACTIVITY_LABELS, ACTIVITY_COLORS, activityIcons } from '../constants';
import { format } from 'date-fns';
import { formatItalianDate, getCommercialMonthString, getDaysUntilCommercialMonthEnd, getCommercialMonthProgress, getTodayDateString } from '../utils/dateUtils';
import LeadCaptureModal from './LeadCaptureModal';
import AppointmentsOverviewModal from './AppointmentsOverviewModal';
import HistoryListModal from './HistoryListModal';
import LeadsOverviewModal from './LeadsOverviewModal';
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
    ListChecks,
    Users,
    Target
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
    onOpenSettings?: (tab: 'profile' | 'goals' | 'labels' | 'notifications' | 'stacking') => void;
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
    viewMode: ViewMode;
    setViewMode: (mode: ViewMode) => void;
    goals: Goals;
    activeTab?: 'inserimento' | 'risultati';
    onOpenClients?: () => void;
    habitStacks?: import('../types').HabitStack[];
    enableHabitStacking?: boolean;
}

const CARD_STYLES: Record<ActivityType, { gradient: string, shadow: string, iconBg: string, border: string, glow: string }> = {
    [ActivityType.CONTACTS]: {
        gradient: 'from-[#007AFF] to-[#00C6FF]',
        shadow: 'shadow-[0_8px_30px_rgba(0,122,255,0.15)]',
        iconBg: 'bg-gradient-to-br from-[#007AFF] to-[#00C6FF]',
        border: 'border-[#007AFF]/20',
        glow: 'rgba(0, 122, 255, 0.4)'
    },
    [ActivityType.VIDEOS_SENT]: {
        gradient: 'from-[#AF52DE] to-[#FF2D55]',
        shadow: 'shadow-[0_8px_30px_rgba(175,82,222,0.15)]',
        iconBg: 'bg-gradient-to-br from-[#AF52DE] to-[#FF2D55]',
        border: 'border-[#AF52DE]/20',
        glow: 'rgba(175, 82, 222, 0.4)'
    },
    [ActivityType.APPOINTMENTS]: {
        gradient: 'from-[#34C759] to-[#30B0C7]',
        shadow: 'shadow-[0_8px_30px_rgba(52,199,89,0.15)]',
        iconBg: 'bg-gradient-to-br from-[#34C759] to-[#30B0C7]',
        border: 'border-[#34C759]/20',
        glow: 'rgba(52, 199, 89, 0.4)'
    },
    [ActivityType.NEW_CONTRACTS]: {
        gradient: 'from-[#FF9500] to-[#FF3B30]',
        shadow: 'shadow-[0_8px_30px_rgba(255,149,0,0.15)]',
        iconBg: 'bg-gradient-to-br from-[#FF9500] to-[#FF3B30]',
        border: 'border-[#FF9500]/20',
        glow: 'rgba(255, 149, 0, 0.4)'
    },
    [ActivityType.NEW_FAMILY_UTILITY]: {
        gradient: 'from-[#5856D6] to-[#007AFF]',
        shadow: 'shadow-[0_8px_30px_rgba(88,86,214,0.15)]',
        iconBg: 'bg-gradient-to-br from-[#5856D6] to-[#007AFF]',
        border: 'border-[#5856D6]/20',
        glow: 'rgba(88, 86, 214, 0.4)'
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
    careerStatus,
    viewMode,
    setViewMode,
    goals,
    activeTab = 'inserimento',
    onOpenClients,
    habitStacks = [],
    enableHabitStacking = false,
    onOpenSettings
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

    const selectedDateFormatted = formatItalianDate(selectedDate);
    const commercialMonthStr = getCommercialMonthString(selectedDate, commercialMonthStartDay);
    const daysRemaining = getDaysUntilCommercialMonthEnd(selectedDate, commercialMonthStartDay);
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

    // Utility per i calcoli dei progressi
    const getPeriodTotals = useMemo(() => {
        const totals: Record<ActivityType, number> = {
            [ActivityType.CONTACTS]: 0,
            [ActivityType.VIDEOS_SENT]: 0,
            [ActivityType.APPOINTMENTS]: 0,
            [ActivityType.NEW_CONTRACTS]: 0,
            [ActivityType.NEW_FAMILY_UTILITY]: 0,
        };

        if (viewMode === 'daily') {
            const todayLog = activityLogs.find(l => l.date === selectedDateStr);
            if (todayLog) {
                Object.values(ActivityType).forEach(type => {
                    totals[type as ActivityType] = todayLog.counts[type as ActivityType] || 0;
                });
            }
        } else if (viewMode === 'weekly') {
            const { startOfWeek, endOfWeek } = (() => {
                const now = new Date(selectedDate);
                const day = now.getDay();
                const diff = now.getDate() - day + (day === 0 ? -6 : 1); // lunedì
                const start = new Date(now.setDate(diff));
                start.setHours(0, 0, 0, 0);
                const end = new Date(start);
                end.setDate(end.getDate() + 6);
                end.setHours(23, 59, 59, 999);
                return { startOfWeek: start, endOfWeek: end };
            })();

            activityLogs.forEach(log => {
                const logDate = new Date(log.date);
                if (logDate >= startOfWeek && logDate <= endOfWeek) {
                    Object.values(ActivityType).forEach(type => {
                        totals[type as ActivityType] += log.counts[type as ActivityType] || 0;
                    });
                }
            });
        } else if (viewMode === 'monthly' || viewMode === 'commercial_monthly') {
            const { start, end } = (() => {
                const now = new Date(selectedDate);
                const month = now.getMonth();
                const year = now.getFullYear();
                
                // Mese commerciale
                let start = new Date(year, month, commercialMonthStartDay);
                if (now.getDate() < commercialMonthStartDay) {
                    start = new Date(year, month - 1, commercialMonthStartDay);
                }
                const end = new Date(start);
                end.setMonth(end.getMonth() + 1);
                end.setDate(end.getDate() - 1);
                end.setHours(23, 59, 59, 999);
                return { start, end };
            })();

            activityLogs.forEach(log => {
                const logDate = new Date(log.date);
                if (logDate >= start && logDate <= end) {
                    Object.values(ActivityType).forEach(type => {
                        totals[type as ActivityType] += log.counts[type as ActivityType] || 0;
                    });
                }
            });
        }

        return totals;
    }, [activityLogs, viewMode, selectedDate, selectedDateStr, commercialMonthStartDay]);

    const [selectedActivityForDetails, setSelectedActivityForDetails] = useState<ActivityType | null>(null);
    const [targetDates, setTargetDates] = useState<Record<string, string>>({});
    const [isAppointmentsOverviewOpen, setIsAppointmentsOverviewOpen] = useState(false);
    const [isContactsOverviewOpen, setIsContactsOverviewOpen] = useState(false);
    const [appointmentsFilterDate, setAppointmentsFilterDate] = useState<Date | null>(null);
    const [contactsFilterDate, setContactsFilterDate] = useState<Date | null>(null);

    const [pulsingActivity, setPulsingActivity] = useState<ActivityType | null>(null);
    const prevTotalsRef = useRef(getPeriodTotals);

    useEffect(() => {
        Object.keys(getPeriodTotals).forEach((key) => {
            const activity = key as ActivityType;
            const current = getPeriodTotals[activity];
            const previous = prevTotalsRef.current[activity] || 0;

            if (current > previous) {
                setPulsingActivity(activity);
                setTimeout(() => setPulsingActivity(null), 1000);

                // Goal Completion Confetti Logic
                const goalValue = viewMode === 'daily' ? goals.daily[activity] : 
                                 viewMode === 'weekly' ? goals.weekly[activity] : 
                                 goals.monthly[activity];
                
                if (goalValue && goalValue > 0 && current >= goalValue && previous < goalValue) {
                    // Trigger confetti!
                    const scalar = 2;
                    const shapes = [confetti.shapeFromText({ text: '🏆', scalar }), confetti.shapeFromText({ text: '✨', scalar })];
                    
                    confetti({
                        particleCount: 100,
                        spread: 70,
                        origin: { y: 0.6 },
                        shapes: shapes,
                        colors: [CARD_STYLES[activity].glow || '#3b82f6', '#ffffff']
                    });
                }
            }
        });
        prevTotalsRef.current = getPeriodTotals;
    }, [getPeriodTotals, goals, viewMode]);

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
                <div className="w-full max-w-7xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] shadow-2xl shadow-black/[0.03] border-2 border-black/10 dark:border-white/20 px-6 py-5">
                    {/* Row: < Date OGGI > */}
                    <div className="flex items-center justify-between gap-4">
                        <button
                            onClick={() => changeDate(-1)}
                            className="w-11 h-11 flex items-center justify-center rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all active:scale-90"
                        >
                            <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                        </button>

                        <div className="flex flex-col items-center gap-1 flex-1">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl font-black text-[#1c1c1e] dark:text-white tracking-tight">
                                    {selectedDateFormatted}
                                </span>
                                {isToday && (
                                    <span className="text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white px-2.5 py-1 rounded-lg shadow-lg shadow-blue-500/20">
                                        OGGI
                                    </span>
                                )}
                            </div>
                            {!isToday && (
                                <button
                                    onClick={() => onDateChange(new Date())}
                                    className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:opacity-70 transition-all"
                                >
                                    TORNA AD OGGI
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => changeDate(1)}
                            className="w-11 h-11 flex items-center justify-center rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05] transition-all active:scale-90"
                        >
                            <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
                        </button>
                    </div>

                    {/* Row: CAMBIA DATA */}
                    <div className="mt-4 pt-4 border-t border-black/[0.03] dark:border-white/[0.03] flex justify-center">
                        <button
                            onClick={onOpenCalendar}
                            className="flex items-center gap-2 group"
                        >
                            <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all">
                                <Calendar className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-500 transition-colors">CAMBIA DATA</span>
                        </button>
                    </div>
                </div>

                {/* Commercial month info below pill */}
                <div className="flex items-center gap-3 mt-2 text-xs font-medium">
                    <span className="px-2 py-0.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300">{commercialMonthStr}</span>
                    <span className="font-bold text-orange-500 dark:text-orange-400">{daysRemaining} gg alla fine mese</span>
                    
                    {onOpenClients && (
                        <button
                            onClick={onOpenClients}
                            className="ml-auto flex items-center gap-1.5 px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg shadow-sm transition-all active:scale-95 font-bold text-[10px] uppercase tracking-wider"
                        >
                            <Users size={12} strokeWidth={3} />
                            Rubrica Clienti
                        </button>
                    )}
                </div>
            </div>

            {/* MAIN HUB STAGE */}
            <div className={`relative ${isHubMode ? 'flex flex-col items-center justify-center' : ''}`}>



                {/* POWER RING (Central Indicator) - Moved to Results Tab */}
                {isHubMode && activeTab === 'risultati' && (
                    <div className="mb-16 relative group animate-in fade-in zoom-in duration-500">
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
                        <div className="mt-8 relative z-20 flex justify-center">
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

                {/* ACTIVITY GRID - Visible in Inserimento Tab */}
                {activeTab === 'inserimento' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                        <div className="w-full mb-6 text-center space-y-6">
                            <div>
                                <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mb-4">
                                    inserisci le tue azioni quotidiane
                                </h2>
                                
                                {/* Period Selector Pill */}
                                <div className="flex justify-center">
                                    <div className="relative inline-flex p-1 bg-black/[0.03] dark:bg-white/[0.05] rounded-2xl border-2 border-black/10 dark:border-white/20">
                                        {(['daily', 'weekly', 'monthly'] as ViewMode[]).map((mode) => (
                                            <button
                                                key={mode}
                                                onClick={() => setViewMode(mode)}
                                                className={`relative px-8 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all duration-300 z-10 ${viewMode === mode ? 'text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'}`}
                                            >
                                                {mode === 'daily' ? 'Giorno' : mode === 'weekly' ? 'Settimana' : 'Mese'}
                                                {viewMode === mode && (
                                                    <motion.div
                                                        layoutId="activePeriod"
                                                        className="absolute inset-0 bg-blue-500 rounded-xl -z-10 shadow-lg shadow-blue-500/30"
                                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                                    />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* HABIT STACKING SUGGESTIONS */}
                        {(() => {
                            if (!enableHabitStacking || !habitStacks || habitStacks.length === 0) return null;
                            const todayStr = getTodayDateString();
                            const incompleteStacks = habitStacks.filter(s => s.lastCompletedDate !== todayStr);
                            
                            if (incompleteStacks.length === 0) return null;

                            return (
                                <div className="w-full max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-top-2 duration-700">
                                    <div 
                                        className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20 border-2 border-orange-500/20 rounded-[2rem] p-4 flex flex-col items-center gap-3 relative overflow-hidden group cursor-pointer hover:from-orange-500/20 hover:to-amber-500/20 transition-all shadow-sm hover:shadow-orange-500/10"
                                        onClick={() => onOpenSettings?.('stacking')}
                                        title="Modifica le tue abitudini"
                                    >
                                        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                                            <Sparkles className="w-8 h-8 text-orange-500 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div className="flex items-center gap-2 relative z-10">
                                            <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400">Suggerimento Habit Stacking</span>
                                        </div>
                                        <div className="flex flex-wrap justify-center gap-4 relative z-10">
                                            {incompleteStacks.slice(0, 2).map((stack, idx) => (
                                                <div key={stack.id} className="text-center">
                                                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                                        Dopo <span className="text-orange-600 dark:text-orange-400">"{stack.trigger}"</span> → 
                                                        <span className="ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/40 dark:bg-white/10 border border-orange-500/10 text-xs uppercase font-black tracking-tight" style={{ color: stack.action === 'CUSTOM' ? '#8b5cf6' : ACTIVITY_COLORS[stack.action as ActivityType] }}>
                                                            {stack.targetCount > 0 ? `${stack.targetCount} ` : ''}
                                                            {stack.action === 'CUSTOM' ? (stack.customActionName || 'Azione') : (customLabels?.[stack.action as ActivityType] || ACTIVITY_LABELS[stack.action as ActivityType])}
                                                        </span>
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 group-hover:text-orange-500 uppercase tracking-widest italic mt-1 transition-colors relative z-10">
                                            {incompleteStacks.length > 2 ? `e altri ${incompleteStacks.length - 2} stack da fare... Clicca per gestire` : 'Clicca per gestire i tuoi stack'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })()}

                        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 ${isHubMode ? 'xl:grid-cols-3' : ''} gap-4 lg:gap-6 w-full max-w-7xl mx-auto`}>
                            {(Object.values(ActivityType) as ActivityType[]).map((activity) => {
                                const count = todayCounts[activity] || 0;
                                let label = customLabels?.[activity] || ACTIVITY_LABELS[activity];
                                if (activity === ActivityType.APPOINTMENTS) {
                                    label = 'appuntamenti fissati';
                                }
                                const styles = CARD_STYLES[activity];

                                return (
                                    <motion.div 
                                        key={activity} 
                                        whileHover={{ y: -5 }}
                                        className={`group relative bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl border-2 border-black/10 dark:border-white/20 ${isHubMode ? 'rounded-[2.5rem] p-6 lg:p-10' : 'rounded-[2.5rem] p-6 lg:p-8'} shadow-2xl shadow-black/[0.03] transition-all duration-500 overflow-hidden`}
                                    >
                                        {/* Background Glow */}
                                        <div className={`absolute -top-24 -right-24 w-60 h-60 blur-[100px] opacity-20 group-hover:opacity-30 transition-opacity bg-gradient-to-br ${styles.gradient}`} />
                                        <div className={`absolute -bottom-24 -left-24 w-40 h-40 blur-[80px] opacity-10 group-hover:opacity-15 transition-opacity bg-gradient-to-br ${styles.gradient}`} />
                                        
                                        <AnimatePresence>
                                            {pulsingActivity === activity && (
                                                <motion.div
                                                    initial={{ opacity: 1, scale: 1 }}
                                                    animate={{ opacity: 0, scale: 1.2 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 1, ease: "circOut" }}
                                                    className="absolute inset-0 z-0 bg-white/40 dark:bg-white/10 pointer-events-none rounded-[inherit]"
                                                />
                                            )}
                                        </AnimatePresence>

                                        <div className="flex flex-col h-full justify-between gap-8 relative z-10">
                                            <div className="flex justify-between items-start">
                                                <div className={`h-14 w-14 rounded-[1.25rem] ${styles.iconBg} flex items-center justify-center text-white shadow-xl shadow-current/20 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                                    <div className="scale-110">
                                                        {activityIcons[activity]}
                                                    </div>
                                                </div>
                                                <div className="flex gap-3">
                                                    {(activity === ActivityType.APPOINTMENTS || activity === ActivityType.CONTACTS) && (
                                                        <button
                                                            onClick={(e) => { 
                                                                e.stopPropagation(); 
                                                                if (activity === ActivityType.APPOINTMENTS) setIsAppointmentsOverviewOpen(true);
                                                                else setIsContactsOverviewOpen(true);
                                                            }}
                                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#8e8e93] bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.01] dark:border-white/[0.01] shadow-lg hover:bg-blue-500 hover:text-white transition-all active:scale-90"
                                                            title="Vedi lista"
                                                        >
                                                            <ListChecks className="w-6 h-6" strokeWidth={3} />
                                                        </button>
                                                    )}
                                                    {activity === ActivityType.APPOINTMENTS && onOpenClients && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onOpenClients(); }}
                                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-[#8e8e93] bg-black/[0.03] dark:bg-white/[0.05] border border-black/[0.01] dark:border-white/[0.01] shadow-lg hover:bg-emerald-500 hover:text-white transition-all active:scale-90"
                                                            title="Rubrica Clienti"
                                                        >
                                                            <Users className="w-6 h-6" strokeWidth={3} />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => handlePlusClick(e, activity)}
                                                        className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white bg-gradient-to-br ${styles.gradient} shadow-xl shadow-current/20 transition-all active:scale-90 group-hover:scale-110`}
                                                    >
                                                        <Plus className="w-7 h-7" strokeWidth={4} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Quick Note Placeholder - New feature */}
                                            <div className="absolute top-20 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // In a real implementation, this would open a mini-inline-input
                                                        // or trigger the lead capture modal for that day.
                                                        if (activity === ActivityType.CONTACTS || activity === ActivityType.APPOINTMENTS) {
                                                            onOpenLeadCapture?.(activity);
                                                        }
                                                    }}
                                                    className="p-2 bg-white/20 dark:bg-white/10 rounded-xl hover:bg-white/30 text-white/70 hover:text-white transition-all"
                                                    title="Aggiungi nota rapida"
                                                >
                                                    <Sparkles size={16} />
                                                </button>
                                            </div>

                                            <div>
                                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{label}</h3>
                                                <div className="flex items-baseline gap-2">
                                                    <motion.span 
                                                        key={`${activity}-${getPeriodTotals[activity]}`}
                                                        className={`font-black bg-gradient-to-br ${styles.gradient} text-transparent bg-clip-text ${isHubMode ? 'text-6xl' : 'text-5xl'}`}
                                                    >
                                                        {getPeriodTotals[activity]}
                                                    </motion.span>
                                                </div>
                                                
                                                {/* Goal Progress Text */}
                                                {(() => {
                                                    const goalValue = viewMode === 'daily' ? goals.daily[activity] : 
                                                                    viewMode === 'weekly' ? goals.weekly[activity] : 
                                                                    goals.monthly[activity];
                                                    
                                                    if (!goalValue || goalValue === 0) return null;
                                                    
                                                    const current = getPeriodTotals[activity];
                                                    const remaining = Math.max(0, goalValue - current);
                                                    
                                                    return (
                                                        <div className="mt-3 flex items-center gap-1.5">
                                                            <Target className={`w-3.5 h-3.5 ${remaining === 0 ? 'text-emerald-500' : 'text-slate-400'}`} />
                                                            <span className={`text-[10px] font-black uppercase tracking-wider ${remaining === 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                                                {remaining === 0 ? 'Target Raggiunto!' : `Mancano ${remaining}`}
                                                            </span>
                                                        </div>
                                                    );
                                                })()}
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => onUpdateActivity(activity, -1, selectedDateStr)}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active:scale-95 disabled:opacity-30 disabled:grayscale"
                                                    disabled={(todayCounts[activity] || 0) === 0}
                                                >
                                                    <Minus className="w-5 h-5" strokeWidth={3} />
                                                </button>
                                                <div className="flex-1 h-1.5 bg-black/[0.03] dark:bg-white/[0.05] rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ 
                                                            width: (() => {
                                                                const goalValue = viewMode === 'daily' ? goals.daily[activity] : 
                                                                                viewMode === 'weekly' ? goals.weekly[activity] : 
                                                                                goals.monthly[activity];
                                                                const current = getPeriodTotals[activity];
                                                                if (!goalValue || goalValue === 0) return `${Math.min((current / 10) * 100, 100)}%`;
                                                                return `${Math.min((current / goalValue) * 100, 100)}%`;
                                                            })()
                                                        }}
                                                        transition={{ duration: 1, ease: "easeOut" }}
                                                        className={`h-full bg-gradient-to-r ${styles.gradient} rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)]`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                               )}
            </div>

            <HistoryListModal
                isOpen={!!selectedActivityForDetails}
                onClose={() => setSelectedActivityForDetails(null)}
                activityType={selectedActivityForDetails}
                activityLog={currentLog}
                customLabel={selectedActivityForDetails ? (customLabels?.[selectedActivityForDetails] || ACTIVITY_LABELS[selectedActivityForDetails]) : ''}
            />

            <LeadsOverviewModal
                isOpen={isContactsOverviewOpen}
                onClose={() => {
                    setIsContactsOverviewOpen(false);
                    setContactsFilterDate(null);
                }}
                onEdit={(lead) => {
                    setIsContactsOverviewOpen(false);
                    setContactsFilterDate(null);
                    if (onEditLead) onEditLead(lead);
                }}
                activityLogs={activityLogs}
                activityType={ActivityType.CONTACTS}
                filterDate={contactsFilterDate}
                customLabel={customLabels?.[ActivityType.CONTACTS] || ACTIVITY_LABELS[ActivityType.CONTACTS]}
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
