import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';

// Importazioni base
import { ActivityLog, ActivityType, Goals, GoalPeriod, UserProfile, Qualification, Lead, ViewMode, VisionBoardData, NextAppointment, HabitStack } from '../types';
import {
  getWeekIdentifier,
  getMonthIdentifier,
  getWeekProgress,
  getMonthProgress,
  getCommercialMonthRange,
  getCommercialMonthProgress,
  getYearProgress,
  getDaysUntilCommercialMonthEnd
} from '../utils/dateUtils';

// Importazione Grafici e Componenti
import ActivityBarChart from './charts/ActivityBarChart';
import { ACTIVITY_LABELS, activityIcons } from '../constants';
import StatCard from './StatCard';
import CareerDeadlineBanner from './CareerDeadlineBanner';
import ConversionFunnel from './ConversionFunnel';
import GoalCalendar from './GoalCalendar';
import DreamTrackerWidget from './DreamTrackerWidget';
import { calculateCareerStatus } from '../utils/careerUtils';
import HabitStackWidget from './HabitStackWidget';
import CoachScoreWidget from './CoachScoreWidget';
import CoachGreeting from './CoachGreeting';
import { Calculator, Sparkles, ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

interface DashboardProps {
  activityLogs: ActivityLog[] | undefined;
  goals: Goals;
  userProfile: UserProfile;
  onOpenAchievements: () => void;
  onEditLead: (type: ActivityType, lead: Lead) => void;
  commercialMonthStartDay: number;
  customLabels?: Record<ActivityType, string>;
  onUpdateQualification: (q: Qualification) => void;
  compactView?: boolean;
  initialTab?: 'overview' | 'stats';
  onOpenContractModal?: () => void;
  onUpdateActivity: (activity: ActivityType, change: number) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  careerDates?: Record<string, string>;
  visionBoardData: VisionBoardData;
  dailyEarnings: number;
  onOpenVisionBoardSettings: () => void;
  onUpdateVisionBoardEarnings: (amount: number) => void;
  onOpenObjectionHandler: () => void;
  onOpenCalendar: () => void;
  onOpenTargetCalculator: () => void;
  nextAppointment?: NextAppointment;
  nextFollowUp?: Lead | null;
  habitStacks?: HabitStack[];
  enableHabitStacking?: boolean;
  dailyScore?: number;
  coachStreak?: number;
  yesterdayScore?: number;
}

type DashboardTab = 'overview' | 'stats';

// --- ICONE ---
const FunnelIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>);
const HandshakeIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20l4-4-4-4M7 4l-4 4 4 4M10 20h4M10 4h4M7 12h10" /></svg>);
const TargetIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>);
const InfoIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300 drop-shadow-md" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>);
const ChartBarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>);
const ChartPieIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>);
const TrophyIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1.586l-1.293-1.293a1 1 0 00-1.414 1.414L7.586 6H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2h-1.586l1.293-1.293a1 1 0 00-1.414-1.414L11 4.586V3zM4 10a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" /></svg>);

const CARD_STYLES: Record<ActivityType, { gradient: string, shadow: string, iconBg: string, border: string }> = {
  [ActivityType.CONTACTS]: {
    gradient: 'from-[#007AFF] to-[#00C6FF]',
    shadow: 'shadow-[0_20px_40px_rgba(0,122,255,0.12)]',
    iconBg: 'bg-gradient-to-br from-[#007AFF] to-[#00C6FF]',
    border: 'border-[#007AFF]/20'
  },
  [ActivityType.VIDEOS_SENT]: {
    gradient: 'from-[#AF52DE] to-[#FF2D55]',
    shadow: 'shadow-[0_20px_40px_rgba(175,82,222,0.12)]',
    iconBg: 'bg-gradient-to-br from-[#AF52DE] to-[#FF2D55]',
    border: 'border-[#AF52DE]/20'
  },
  [ActivityType.APPOINTMENTS]: {
    gradient: 'from-[#34C759] to-[#30B0C7]',
    shadow: 'shadow-[0_20px_40px_rgba(52,199,89,0.12)]',
    iconBg: 'bg-gradient-to-br from-[#34C759] to-[#30B0C7]',
    border: 'border-[#34C759]/20'
  },
  [ActivityType.NEW_CONTRACTS]: {
    gradient: 'from-[#FF9500] to-[#FF3B30]',
    shadow: 'shadow-[0_20px_40px_rgba(255,149,0,0.12)]',
    iconBg: 'bg-gradient-to-br from-[#FF9500] to-[#FF3B30]',
    border: 'border-[#FF9500]/20'
  },
  [ActivityType.NEW_FAMILY_UTILITY]: {
    gradient: 'from-[#5856D6] to-[#007AFF]',
    shadow: 'shadow-[0_20px_40px_rgba(88,86,214,0.12)]',
    iconBg: 'bg-gradient-to-br from-[#5856D6] to-[#007AFF]',
    border: 'border-[#5856D6]/20'
  },
};

const Dashboard: React.FC<DashboardProps> = ({
  activityLogs = [],
  goals,
  userProfile,
  onOpenAchievements,
  onEditLead,
  commercialMonthStartDay,
  customLabels,
  onUpdateQualification,
  compactView = false,
  initialTab = 'overview',
  onOpenContractModal,
  onUpdateActivity,
  viewMode,
  setViewMode,
  selectedDate: propSelectedDate,
  onDateChange: propOnDateChange,
  careerDates,
  visionBoardData,
  dailyEarnings,
  onOpenVisionBoardSettings,
  onUpdateVisionBoardEarnings,
  onOpenObjectionHandler,
  onOpenCalendar,
  onOpenTargetCalculator,
  nextAppointment,
  nextFollowUp,
  habitStacks = [],
  enableHabitStacking = false,
  dailyScore = 0,
  coachStreak = 0,
  yesterdayScore = 0
}) => {
  if (!activityLogs || !Array.isArray(activityLogs)) {
    return <div className="p-6">Caricamento dati...</div>;
  }

  const [currentTab, setCurrentTab] = useState<DashboardTab>(initialTab);

  // STATO PER LA DATA SELEZIONATA (usata dal DateNavigator) - Fallback se non passata come prop
  const [internalSelectedDate, setInternalSelectedDate] = useState(new Date());
  
  const selectedDate = propSelectedDate || internalSelectedDate;
  const setSelectedDate = propOnDateChange || setInternalSelectedDate;

  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomDateRange(prev => ({ ...prev, [name]: value }));
  };

  const careerStatus = useMemo(() => 
    calculateCareerStatus(activityLogs, userProfile.currentQualification, careerDates),
    [activityLogs, userProfile.currentQualification, careerDates]
  );

  const processedData = useMemo(() => {
    if (activityLogs.length === 0) return [];

    const aggregate = (identifierFn: (date: Date) => string, logsToProcess: ActivityLog[]) => {
      const groupedData: { [key: string]: any } = {};
      logsToProcess.forEach(log => {
        const identifier = identifierFn(new Date(log.date));
        if (!groupedData[identifier]) {
          groupedData[identifier] = { name: identifier };
          Object.values(ActivityType).forEach((act: ActivityType) => groupedData[identifier][act] = 0);
        }
        Object.values(ActivityType).forEach((act: ActivityType) => {
          groupedData[identifier][act] += log.counts[act] || 0;
        });
      });
      return Object.values(groupedData).sort((a, b) => a.name.localeCompare(b.name));
    };

    switch (viewMode) {
      case 'daily':
        // Quando sei in daily, mostriamo solo i dati della data selezionata o della settimana intorno
        // Per il grafico, mostriamo comunque gli ultimi 7 giorni per contesto
        return activityLogs
          .slice(0, 7)
          .map(log => ({
            name: new Date(log.date).toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric' }),
            ...log.counts
          }))
          .reverse();
      case 'weekly':
        return aggregate(getWeekIdentifier, activityLogs).slice(-12).map(d => {
          // Identifier is "yyyy-MM-dd-yyyy-MM-dd"
          const parts = d.name.split('-');
          if (parts.length >= 6) {
            // Suggest "dd/MM - dd/MM"
            return { ...d, name: `${parts[2]}/${parts[1]} - ${parts[5]}/${parts[4]}` };
          }
          return { ...d, name: d.name };
        });
      case 'monthly': {
        const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
        return aggregate(getMonthIdentifier, activityLogs).slice(-12).map(d => {
          const parts = d.name.split('-'); // "yyyy-MM"
          if (parts.length >= 2) {
            const monthNum = parseInt(parts[1]);
            return { ...d, name: `${monthNames[monthNum - 1]} ${parts[0].slice(2)}` };
          }
          return { ...d, name: d.name };
        });
      }
      case 'commercial_monthly': {
        const range = getCommercialMonthRange(new Date(), commercialMonthStartDay);
        const filteredLogs = activityLogs
          .filter(log => {
            const logDate = new Date(log.date);
            return logDate.getTime() >= range.start.getTime() && logDate.getTime() <= range.end.getTime();
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return filteredLogs.map(log => ({
          name: new Date(log.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
          ...log.counts
        }));
      }
      case 'yearly': {
        const currentYear = new Date().getFullYear();
        const yearlyLogs = activityLogs.filter(log => new Date(log.date).getFullYear() === currentYear);
        const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
        return aggregate(getMonthIdentifier, yearlyLogs).map(d => {
          const [year, monthNum] = d.name.split('-M');
          return { ...d, name: `${monthNames[parseInt(monthNum) - 1]} '${year.slice(2)}` };
        });
      }
      case 'custom': {
        if (!customDateRange.start || !customDateRange.end) return [];
        const startDate = new Date(customDateRange.start);
        const endDate = new Date(customDateRange.end);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        const filteredLogs = activityLogs
          .filter(log => {
            const logDate = new Date(log.date);
            return logDate.getTime() >= startDate.getTime() && logDate.getTime() <= endDate.getTime();
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return filteredLogs.map(log => ({
          name: new Date(log.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short' }),
          ...log.counts
        }));
      }
      default:
        return [];
    }
  }, [activityLogs, viewMode, customDateRange, commercialMonthStartDay, selectedDate]);

  const { totals, periodLabel, timeProgress, relevantGoals } = useMemo(() => {
    const now = new Date();

    let logsToSum: ActivityLog[];
    let periodLabelText: string;
    let timeProgressValue: number;
    let relevantGoalsForPeriod: GoalPeriod;

    if (viewMode === 'daily') {
      // MODIFICATO: In modalità Daily, usa la selectedDate dal DateNavigator con formattazione sicura
      const selectedStr = format(selectedDate, 'yyyy-MM-dd');
      logsToSum = activityLogs.filter(log => log.date === selectedStr);

      const isToday = selectedDate.toDateString() === now.toDateString();
      periodLabelText = isToday ? 'Oggi' : selectedDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' });
      timeProgressValue = (now.getHours() / 24) * 100;
      relevantGoalsForPeriod = goals.daily;
    } else if (viewMode === 'weekly') {
      const identifier = getWeekIdentifier(now);
      logsToSum = activityLogs.filter(log => getWeekIdentifier(new Date(log.date)) === identifier);
      periodLabelText = 'Questa Settimana';
      timeProgressValue = getWeekProgress(now);
      relevantGoalsForPeriod = goals.weekly;
    } else if (viewMode === 'commercial_monthly') {
      const range = getCommercialMonthRange(now, commercialMonthStartDay);
      logsToSum = activityLogs.filter(log => {
        const logDate = new Date(log.date);
        return logDate.getTime() >= range.start.getTime() && logDate.getTime() <= range.end.getTime();
      });
      periodLabelText = 'Mese Comm. Corrente';
      timeProgressValue = getCommercialMonthProgress(now, commercialMonthStartDay);
      relevantGoalsForPeriod = goals.monthly;
    } else if (viewMode === 'yearly') {
      const currentYear = now.getFullYear();
      logsToSum = activityLogs.filter(log => new Date(log.date).getFullYear() === currentYear);
      periodLabelText = 'Quest\'Anno';
      timeProgressValue = getYearProgress(now);
      relevantGoalsForPeriod = {};
    } else if (viewMode === 'custom') {
      // ... Logica Custom ...
      if (!customDateRange.start || !customDateRange.end) {
        logsToSum = [];
      } else {
        const startDate = new Date(customDateRange.start);
        const endDate = new Date(customDateRange.end);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        logsToSum = activityLogs.filter(log => {
          const logDate = new Date(log.date);
          return logDate.getTime() >= startDate.getTime() && logDate.getTime() <= endDate.getTime();
        });
      }
      periodLabelText = 'Periodo Personalizzato';
      timeProgressValue = 100;
      relevantGoalsForPeriod = {};
    } else { // monthly
      const identifier = getMonthIdentifier(now);
      logsToSum = activityLogs.filter(log => getMonthIdentifier(new Date(log.date)) === identifier);
      periodLabelText = 'Questo Mese';
      timeProgressValue = getMonthProgress(now);
      relevantGoalsForPeriod = goals.monthly;
    }

    const calculatedTotals = Object.values(ActivityType).reduce((acc, activity: ActivityType) => {
      acc[activity] = logsToSum.reduce((sum, log) => sum + (log.counts[activity] || 0), 0);
      return acc;
    }, {} as Record<ActivityType, number>);

    return {
      totals: calculatedTotals,
      periodLabel: periodLabelText,
      timeProgress: timeProgressValue,
      relevantGoals: relevantGoalsForPeriod
    };
  }, [activityLogs, viewMode, goals, customDateRange, commercialMonthStartDay, selectedDate]); // Aggiunto selectedDate alle dipendenze

  const totalGoal = useMemo(() => {
    if (!relevantGoals) return 0;
    return (Object.values(relevantGoals) as Array<number | undefined>).reduce((sum, goal) => sum + (goal || 0), 0);
  }, [relevantGoals]);

  const totalCurrent = useMemo(() => {
    return (Object.values(totals) as number[]).reduce((sum, current) => sum + current, 0);
  }, [totals]);

  const conversionRates = useMemo(() => {
    const { CONTACTS = 0, APPOINTMENTS = 0, NEW_CONTRACTS = 0 } = totals;
    return {
      contactToAppointmentRate: CONTACTS > 0 ? (APPOINTMENTS / CONTACTS) * 100 : 0,
      appointmentToContractRate: APPOINTMENTS > 0 ? (NEW_CONTRACTS / APPOINTMENTS) * 100 : 0,
      overallConversionRate: CONTACTS > 0 ? (NEW_CONTRACTS / CONTACTS) * 100 : 0,
      totalContacts: CONTACTS,
      totalAppointments: APPOINTMENTS,
      totalContracts: NEW_CONTRACTS,
    };
  }, [totals]);

  // UI Components
  interface ViewButtonProps { mode: ViewMode; children: React.ReactNode; }
  const ViewButton = ({ mode, children }: ViewButtonProps) => {
    const isActive = viewMode === mode;
    return (
      <button onClick={() => setViewMode(mode)} className={`relative px-4 py-2 text-sm font-bold rounded-xl transition-all duration-300 z-10 ${isActive ? 'text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'}`}>
        {isActive && <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl -z-10"></div>}
        {children}
      </button>
    );
  };

  interface TabButtonProps { tab: DashboardTab; children: React.ReactNode; icon: React.ReactNode; }
  const TabButton = ({ tab, children, icon }: TabButtonProps) => (
    <button onClick={() => setCurrentTab(tab)} className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-5 py-3 text-[13px] sm:text-[15px] font-extrabold rounded-2xl transition-all duration-300 ${currentTab === tab ? 'bg-white text-[#007aff] shadow-md shadow-black/5' : 'text-[#8e8e93] hover:text-[#1c1c1e]'}`}>
      {icon}<span className="truncate">{children}</span>
    </button>
  );

  return (
    <div className={`bg-transparent ${compactView ? 'p-2 sm:p-4' : 'p-3 sm:pb-2 sm:pt-10 sm:px-0'} relative overflow-hidden font-sans`}>
      {/* Calcolo status carriera per l'header */}
      <div className="hidden sm:flex fixed top-10 right-10 z-[100] items-center gap-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-2xl p-2.5 pl-5 rounded-[1.5rem] border border-white/40 dark:border-white/10 shadow-2xl shadow-black/[0.03]">
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">LIVELLO</span>
          <span
            className="text-xs font-black uppercase tracking-tight"
            style={{ color: careerStatus.currentLevel.color || 'inherit' }}
          >
            {careerStatus.currentLevel.name}
          </span>
        </div>
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-xl"
          style={{
            backgroundColor: careerStatus.currentLevel.color || '#3b82f6',
            boxShadow: `0 8px 16px ${careerStatus.currentLevel.color || '#3b82f6'}30`
          }}
        >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
      </div>

      {/* Header e Selezione Vista - RIMOSSO SELETTORE QUALIFICA RIDONDANTE */}
      {currentTab !== 'stats' && (
        <div className="relative z-10 flex flex-col items-start mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-6">
            {/* View Mode Selector removed from here, now in ActivityInput */}
          </div>
        </div>
      )}
      {/* --- BANNER SCADENZA CARRIERA --- */}
      {!compactView && (
        <CareerDeadlineBanner
          careerStatus={careerStatus}
          targetDates={careerDates || {}}
        />
      )}



      {/* Tab Riepilogo */}
      {currentTab === 'overview' && (
        <div className="animate-fade-in relative z-10 w-full space-y-6">
          {/* COACH GREETING & SCORE */}
          <div className="space-y-4">
            <CoachGreeting 
                firstName={userProfile.firstName} 
                yesterdayScore={yesterdayScore} 
                streak={coachStreak} 
            />
            <CoachScoreWidget
              score={dailyScore}
              streak={coachStreak}
              firstName={userProfile.firstName}
            />
          </div>

          {/* Productivity Calendar */}
          <GoalCalendar
            activityLogs={activityLogs}
            goals={goals}
            onSelectDate={(date) => {
              // RIPRISTINO: cambia la vista al click
              setSelectedDate(date);
              setViewMode('daily');

              const year = date.getFullYear();
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const day = String(date.getDate()).padStart(2, '0');
              const localDateStr = `${year}-${month}-${day}`;

              // Stessa logica esatta di GoalCalendar per l'icona 📅:
              const hasScheduled = activityLogs?.some(log =>
                log.leads?.some(lead => 
                  lead.appointmentDate?.startsWith(localDateStr) || 
                  lead.followUpDate?.startsWith(localDateStr)
                )
              );
              const hasApptEntry = activityLogs?.some(log =>
                log.date === localDateStr && log.leads?.some(lead => lead.type === ActivityType.APPOINTMENTS)
              );

              console.log('[Calendar Click]', localDateStr, 'hasScheduled:', hasScheduled, 'hasApptEntry:', hasApptEntry);

              if (hasScheduled || hasApptEntry) {
                console.log('[Calendar] DISPATCHING open-appointments-overview for', localDateStr);
                window.dispatchEvent(new CustomEvent('open-appointments-overview', { detail: { date: localDateStr } }));
              }
            }}
          />

          {!compactView && (
            <div className="flex flex-col items-center w-full mx-auto mt-8 space-y-8">
              {/* PROSSIMO APPUNTAMENTO */}
              {nextAppointment && (
                <div className="w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] p-6 shadow-2xl shadow-black/[0.03] border border-white/40 dark:border-white/10 flex items-center justify-between group overflow-hidden relative transition-all hover:scale-[1.01]">
                   <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group-hover:rotate-6 transition-transform">
                      <Calendar className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em] mb-1">PROSSIMO APPUNTAMENTO</p>
                      <h4 className="text-xl font-black text-[#1c1c1e] dark:text-white mb-0.5">{nextAppointment.title}</h4>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                        {new Date(nextAppointment.date).toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end relative z-10">
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                      {(() => {
                        const diff = new Date(nextAppointment.date).getTime() - new Date().getTime();
                        const hours = Math.floor(diff / (1000 * 60 * 60));
                        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                        if (diff < 0) return 'Scaduto';
                        if (hours > 24) return `Tra ${Math.floor(hours/24)}gg`;
                        if (hours > 0) return `Tra ${hours}h`;
                        return `${mins}m`;
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* VISION BOARD */}
              <div className="w-full">
                <DreamTrackerWidget 
                  visionBoardData={visionBoardData}
                  autoPersonalEarnings={dailyEarnings}
                  onUpdateEarnings={onUpdateVisionBoardEarnings}
                  onOpenVisionBoard={onOpenVisionBoardSettings}
                />
              </div>

              {/* HABIT STACKING WIDGET */}
              {enableHabitStacking && habitStacks.length > 0 && (
                <div className="w-full">
                  <HabitStackWidget 
                    stacks={habitStacks} 
                    customLabels={customLabels} 
                    currentCounts={totals}
                  />
                </div>
              )}

              {/* PROSSIMO FOLLOW-UP ALERT */}
              {nextFollowUp && (
                <div className="w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] p-6 shadow-2xl shadow-black/[0.03] border-2 border-black/10 dark:border-white/20 flex items-center justify-between group overflow-hidden relative transition-all hover:scale-[1.01]">
                  <div className="flex items-center gap-5 relative z-10">
                    <div className={`w-14 h-14 ${new Date(nextFollowUp.followUpDate!).getTime() < new Date().setHours(23,59,59,999) ? 'bg-gradient-to-br from-orange-400 to-red-500' : 'bg-gradient-to-br from-blue-400 to-indigo-500'} rounded-2xl flex items-center justify-center text-white shadow-xl transition-transform group-hover:rotate-6`}>
                      <Clock className="w-7 h-7" />
                    </div>
                    <div>
                      <p className={`text-[10px] font-black ${new Date(nextFollowUp.followUpDate!).getTime() < new Date().setHours(23,59,59,999) ? 'text-orange-500' : 'text-blue-500'} uppercase tracking-[0.25em] mb-1`}>
                        {new Date(nextFollowUp.followUpDate!).getTime() < new Date().setHours(0,0,0,0) ? 'FOLLOW-UP SCADUTO' : 'PROSSIMO FOLLOW-UP'}
                      </p>
                      <h4 className="text-xl font-black text-[#1c1c1e] dark:text-white mb-0.5">{nextFollowUp.name}</h4>
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                        Entro il {new Date(nextFollowUp.followUpDate!).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onEditLead(nextFollowUp.type || ActivityType.CONTACTS, nextFollowUp)}
                    className="bg-black/[0.03] dark:bg-white/[0.05] text-slate-400 dark:text-slate-500 w-12 h-12 rounded-2xl flex items-center justify-center border border-black/[0.01] dark:border-white/[0.01] transition-all active:scale-90 hover:text-blue-500 hover:bg-blue-50"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}

              {/* POWER RING (Guadagno Oggi) */}
              <div className="relative group flex flex-col items-center py-12">
                <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent blur-sm"></div>
                <div className="absolute inset-0 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none group-hover:bg-blue-500/10 transition-all duration-1000"></div>
                
                <div className="relative w-72 h-72 lg:w-80 lg:h-80 rounded-full border-[1.5rem] border-white/40 dark:border-white/5 flex items-center justify-center shadow-[0_0_50px_rgba(0,0,0,0.05)] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  <div className="text-center relative z-10">
                    <p className="text-[10px] lg:text-xs font-black text-[#8e8e93] dark:text-slate-500 uppercase tracking-[0.25em] mb-2">GUADAGNO OGGI</p>
                    <p className="text-5xl lg:text-6xl font-black text-[#1c1c1e] dark:text-white tracking-tighter">€{Math.round(dailyEarnings)}</p>
                    
                    {/* Proiezione Mese */}
                    <div className="mt-2 flex flex-col items-center">
                      <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">PROIEZIONE MESE</p>
                      <p className="text-lg font-black text-slate-700 dark:text-slate-300">
                        €{Math.round(dailyEarnings * getDaysUntilCommercialMonthEnd(new Date(), commercialMonthStartDay))}
                      </p>
                    </div>

                    <button
                      onClick={onOpenTargetCalculator}
                      className="mt-6 p-3.5 bg-black/[0.03] dark:bg-white/10 hover:bg-blue-500 hover:text-white rounded-2xl transition-all active:scale-95 mx-auto border border-white/20 shadow-lg shadow-black/5"
                    >
                      <Calculator className="w-6 h-6" />
                    </button>
                    <div className="mt-3 flex flex-col items-center gap-2">
                      <svg className="absolute inset-[-1.5rem] w-[calc(100%+3rem)] h-[calc(100%+3rem)] -rotate-90">
                        <circle
                          cx="50%"
                          cy="50%"
                          r="48%"
                          fill="transparent"
                          stroke="url(#hubGradientDashboard)"
                          strokeWidth="1.5rem"
                          strokeDasharray={`${Math.min(dailyEarnings / 10, 100) * 3} 1000`}
                          strokeLinecap="round"
                          className="drop-shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="hubGradientDashboard" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#a3e635" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* SCRIPT LIBRARY BUTTON */}
                <div className="mt-14 relative z-20">
                  <button
                    onClick={onOpenObjectionHandler}
                    className="flex items-center gap-4 px-10 py-5 bg-blue-500 hover:bg-blue-600 text-white rounded-[2rem] shadow-2xl shadow-blue-500/20 transition-all active:scale-95 group border border-white/20"
                  >
                    <Sparkles size={24} className="group-hover:animate-pulse" />
                    <span className="font-black text-[11px] uppercase tracking-[0.25em]">Script Library</span>
                  </button>
                </div>
              </div>

              <div className="h-10" />
            </div>
          )}
        </div>
      )}

      {/* Tab Statistiche */}
      {currentTab === 'stats' && (
        <div className="animate-fade-in relative z-10 w-full px-6 sm:px-12 lg:px-16 flex flex-col items-center">
          <div className="w-full">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3 px-6">
              <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
              IMBUTO DI CONVERSIONE
            </h3>

            <div className="mb-10 overflow-hidden">
              <ConversionFunnel data={totals} customLabels={customLabels} />
            </div>

            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-100 mb-6 flex items-center gap-2">
              <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
              Analisi Dettagliata ({periodLabel})
            </h3>
            {conversionRates.totalContacts > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<FunnelIcon />} title="Contatto → Appuntamento" value={`${conversionRates.contactToAppointmentRate.toFixed(1)}%`} description={`${conversionRates.totalAppointments} appuntamenti su ${conversionRates.totalContacts}`} colorClass="text-blue-500" />
                <StatCard icon={<HandshakeIcon />} title="Appuntamento → Contratto" value={`${conversionRates.appointmentToContractRate.toFixed(1)}%`} description={`${conversionRates.totalContracts} su ${conversionRates.totalAppointments}`} colorClass="text-emerald-500" />
                <StatCard icon={<TargetIcon />} title="Chiusura Globale" value={`${conversionRates.overallConversionRate.toFixed(1)}%`} description="Totale contratti su contatti" colorClass="text-violet-500" />
              </div>
            ) : (
              <div className="p-10 text-center text-slate-500 bg-[#e5e5ea] dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-[#e5e5ea] dark:border-slate-700">Nessun dato sufficiente per le statistiche.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;