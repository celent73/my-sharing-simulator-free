import React, { useState, useMemo } from 'react';

// Importazioni base
import { ActivityLog, ActivityType, Goals, GoalPeriod, UserProfile, Qualification, Lead } from '../types';
import {
  getWeekIdentifier,
  getMonthIdentifier,
  getWeekProgress,
  getMonthProgress,
  getCommercialMonthRange,
  getCommercialMonthProgress,
  getYearProgress
} from '../utils/dateUtils';

// Importazione Grafici e Componenti
import ActivityBarChart from './charts/ActivityBarChart';
import { ACTIVITY_LABELS, activityIcons } from '../constants';
import ActivityFocus from './ActivityFocus';
import StatCard from './StatCard';
import DateNavigator from './DateNavigator';
import ConversionFunnel from './ConversionFunnel';
import GoalCalendar from './GoalCalendar';
import { calculateCareerStatus } from '../utils/careerUtils';

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
}

type ViewMode = 'daily' | 'weekly' | 'monthly' | 'commercial_monthly' | 'yearly' | 'custom';
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

const GoalStatusReminder: React.FC<{
  current: number,
  goal: number,
  timeProgress: number,
  periodLabel: string
}> = ({ current, goal, timeProgress, periodLabel }) => {
  if (!goal || goal <= 0) return null;

  const goalProgress = (current / goal) * 100;

  if (goalProgress >= 100) {
    return (
      <div className="flex items-center bg-emerald-100/50 dark:bg-emerald-900/30 border-2 border-emerald-100 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-medium px-4 py-3 rounded-xl mb-4" role="alert">
        <InfoIcon />
        <p>Congratulazioni! Obiettivo raggiunto.</p>
      </div>
    );
  }
  return null;
};

const CARD_STYLES: Record<ActivityType, { gradient: string, shadow: string, iconBg: string, border: string }> = {
  [ActivityType.CONTACTS]: {
    gradient: 'from-blue-500 to-blue-600',
    shadow: 'shadow-[0_8px_30px_rgb(59,130,246,0.12)]',
    iconBg: 'bg-blue-500',
    border: 'border-transparent'
  },
  [ActivityType.VIDEOS_SENT]: {
    gradient: 'from-violet-500 to-purple-600',
    shadow: 'shadow-[0_8px_30px_rgb(139,92,246,0.12)]',
    iconBg: 'bg-[#a855f7]',
    border: 'border-transparent'
  },
  [ActivityType.APPOINTMENTS]: {
    gradient: 'from-emerald-400 to-teal-500',
    shadow: 'shadow-[0_8px_30px_rgb(16,185,129,0.12)]',
    iconBg: 'bg-[#10b981]',
    border: 'border-transparent'
  },
  [ActivityType.NEW_CONTRACTS]: {
    gradient: 'from-orange-400 to-red-500',
    shadow: 'shadow-[0_8px_30px_rgb(249,115,22,0.12)]',
    iconBg: 'bg-[#f59e0b]',
    border: 'border-transparent'
  },
  [ActivityType.NEW_FAMILY_UTILITY]: {
    gradient: 'from-cyan-400 to-blue-500',
    shadow: 'shadow-[0_8px_30px_rgb(6,182,212,0.12)]',
    iconBg: 'bg-[#0ea5e9]',
    border: 'border-transparent'
  },
};

const Dashboard: React.FC<DashboardProps> = ({
  activityLogs,
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
  onUpdateActivity
}) => {
  if (!activityLogs || !Array.isArray(activityLogs)) {
    return <div className="p-6">Caricamento dati...</div>;
  }

  const [viewMode, setViewMode] = useState<ViewMode>(compactView ? 'daily' : 'commercial_monthly');
  const [currentTab, setCurrentTab] = useState<DashboardTab>(initialTab);

  // STATO PER LA DATA SELEZIONATA (usata dal DateNavigator)
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [customDateRange, setCustomDateRange] = useState<{ start: string; end: string }>({
    start: new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomDateRange(prev => ({ ...prev, [name]: value }));
  };

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
        return aggregate(getWeekIdentifier, activityLogs).slice(-12).map(d => ({ ...d, name: d.name.replace('-W', ' W') }));
      case 'monthly': {
        const monthNames = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
        return aggregate(getMonthIdentifier, activityLogs).slice(-12).map(d => {
          const [year, monthNum] = d.name.split('-M');
          return { ...d, name: `${monthNames[parseInt(monthNum) - 1]} ${year.slice(2)}` };
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
      // MODIFICATO: In modalità Daily, usa la selectedDate dal DateNavigator
      const selectedStr = selectedDate.toISOString().split('T')[0];
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
    <div className={`bg-[#f2f2f7] dark:bg-slate-900/40 ${compactView ? '' : 'min-h-screen'} ${compactView ? 'p-2 sm:p-4' : 'p-3 sm:p-10'} rounded-[2rem] sm:rounded-[3.5rem] relative overflow-hidden font-sans`}>
      {/* Calcolo status carriera per l'header */}
      {(() => {
        const careerStatus = calculateCareerStatus(activityLogs, userProfile.currentQualification);
        return (
          <div className="hidden sm:flex fixed top-10 right-10 z-[100] items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-2 pl-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">LIVELLO</span>
              <span className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-tight">{careerStatus.currentLevel.name}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-sm">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        );
      })()}

      {/* Header e Selezione Vista - HIDDEN IN STATS MODE */}
      {currentTab !== 'stats' && (
        <div className="relative z-10 flex flex-col items-start mb-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-6">
            <div className="flex items-center gap-3 bg-white dark:bg-slate-800/50 p-3 px-5 rounded-2xl shadow-sm border border-slate-300 dark:border-slate-700">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">QUALIFICA:</span>
              <select
                className="bg-transparent text-sm font-bold text-slate-900 dark:text-white outline-none cursor-pointer"
                value={userProfile.currentQualification || ''}
                onChange={(e) => onUpdateQualification(e.target.value as Qualification)}
              >
                <option value="" disabled>Seleziona...</option>
                {Object.values(Qualification).map(q => (
                  <option key={q} value={q}>{q}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#e5e5ea] dark:bg-slate-800/80 rounded-[1.25rem] border border-transparent shadow-inner min-w-[300px]">
              <button onClick={() => setViewMode('daily')} className={`flex-1 py-3 text-sm font-extrabold rounded-2xl transition-all duration-300 ${viewMode === 'daily' ? 'bg-[#007aff] text-white shadow-md' : 'text-[#8e8e93] hover:text-[#1c1c1e]'}`}>Giorno</button>
              <button onClick={() => setViewMode('weekly')} className={`flex-1 py-3 text-sm font-extrabold rounded-2xl transition-all duration-300 ${viewMode === 'weekly' ? 'bg-[#007aff] text-white shadow-md' : 'text-[#8e8e93] hover:text-[#1c1c1e]'}`}>Settimana</button>
              <button onClick={() => setViewMode('monthly')} className={`flex-1 py-3 text-sm font-extrabold rounded-2xl transition-all duration-300 ${viewMode === 'monthly' ? 'bg-[#007aff] text-white shadow-md' : 'text-[#8e8e93] hover:text-[#1c1c1e]'}`}>Mese</button>
            </div>
          </div>
        </div>
      )}
      {/* --- QUI ABBIAMO INSERITO IL DATE NAVIGATOR --- */}
      {/* Appare SOLO se la modalità è 'daily' e NON siamo in compactView */}
      {viewMode === 'daily' && !compactView && (
        <DateNavigator
          currentDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      )}



      {/* Tab Riepilogo */}
      {currentTab === 'overview' && (
        <div className="animate-fade-in relative z-10 w-full px-4">
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
              const hasScheduled = activityLogs.some(log =>
                log.leads?.some(lead => lead.appointmentDate?.startsWith(localDateStr))
              );
              const hasApptEntry = activityLogs.some(log =>
                log.date === localDateStr && log.leads?.some(lead => lead.type === ActivityType.APPOINTMENTS)
              );

              console.log('[Calendar Click]', localDateStr, 'hasScheduled:', hasScheduled, 'hasApptEntry:', hasApptEntry);

              if (hasScheduled || hasApptEntry) {
                console.log('[Calendar] DISPATCHING open-appointments-overview for', localDateStr);
                window.dispatchEvent(new CustomEvent('open-appointments-overview', { detail: { date: localDateStr } }));
              }
            }}
          />

          {!compactView && <GoalStatusReminder current={totalCurrent} goal={totalGoal} timeProgress={timeProgress} periodLabel={viewMode} />}




          {!compactView && (
            <>
              <ActivityFocus totals={totals} goals={relevantGoals} timeProgress={timeProgress} viewMode={viewMode} customLabels={customLabels} />
              <div className="h-80 mt-10 bg-white/50 dark:bg-slate-900 p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800">
                <ActivityBarChart data={processedData} customLabels={customLabels} />
              </div>
            </>
          )}
        </div>
      )}

      {/* Tab Statistiche */}
      {currentTab === 'stats' && (
        <div className="animate-fade-in relative z-10 w-full px-4 flex flex-col items-center">
          <div className="w-full max-w-5xl">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-6 flex items-center gap-3">
              <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
              IMBUTO DI CONVERSIONE
            </h3>

            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 lg:p-10 shadow-xl mb-10 overflow-hidden">
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