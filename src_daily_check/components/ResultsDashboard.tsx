import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Calendar as CalendarIcon, 
  Trophy, 
  TrendingUp, 
  Clock, 
  Calculator, 
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { ActivityType, Lead, ActivityLog, Goals, UserProfile, VisionBoardData, NextAppointment, HabitStack, ViewMode } from '../types';
import FollowUpRankingWidget from './FollowUpRankingWidget';
import GoalRecoveryWidget from './GoalRecoveryWidget';
import Dashboard from './Dashboard';
import CoachGreeting from './CoachGreeting';
import CoachStrategyWidget from './CoachStrategyWidget';
import CoachScoreWidget from './CoachScoreWidget';
import DreamTrackerWidget from './DreamTrackerWidget';
import HabitStackWidget from './HabitStackWidget';
import GoalCalendar from './GoalCalendar';

interface ResultsDashboardProps {
  activityLogs: ActivityLog[];
  goals: Goals;
  userProfile: UserProfile;
  careerStatus: any;
  commercialMonthStartDay: number;
  customLabels?: Record<ActivityType, string>;
  dailyEarnings: number;
  dailyScore: number;
  coachStreak: number;
  yesterdayScore: number;
  nextAppointment?: NextAppointment;
  onClearNextAppointment?: () => void;
  nextFollowUp?: Lead | null;
  habitStacks?: HabitStack[];
  enableHabitStacking?: boolean;
  visionBoardData: VisionBoardData;
  commercialMonth: any;
  recoveryStats: any[];
  statsLoading: boolean;
  selectedDate: Date;
  viewMode: ViewMode;
  onDateChange: (date: Date) => void;
  setViewMode: (mode: ViewMode) => void;
  onOpenVisionBoardSettings: () => void;
  onUpdateVisionBoardEarnings: (amount: number) => void;
  onOpenObjectionHandler: () => void;
  onOpenCalendar: () => void;
  onOpenTargetCalculator: () => void;
  onUpdateActivity: (activity: any, change: number) => void;
  onOpenLeadCapture: (type: ActivityType, lead?: Lead, forceStatus?: any, forceWonType?: any) => void;
  onEditLead: (type: ActivityType, lead: Lead) => void;
  onOpenAppointmentModal: (type: 'choice' | 'manual') => void;
  onActivateFocus: (goal: string, target: number) => void;
  onOpenContractModal: () => void;
  onOpenAchievements: () => void;
  onUpdateQualification: (q: any) => void;
}

type ResultsSubTab = 'performance' | 'agenda' | 'growth';

const ResultsDashboard: React.FC<ResultsDashboardProps> = (props) => {
  const [activeSubTab, setActiveSubTab] = useState<ResultsSubTab>('performance');
  
  const selectedDateStr = format(props.selectedDate, 'yyyy-MM-dd');
  const currentCounts = props.activityLogs.find(l => l.date === selectedDateStr)?.counts || {};

  const tabs = [
    { id: 'performance', label: 'Performance', icon: Rocket, color: 'text-indigo-500' },
    { id: 'agenda', label: 'Agenda', icon: CalendarIcon, color: 'text-purple-500' },
    { id: 'growth', label: 'Obiettivi', icon: Trophy, color: 'text-emerald-500' },
  ];

  const renderPerformance = () => (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Top Row: Greeting and Score */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <CoachGreeting 
            firstName={props.userProfile.firstName} 
            yesterdayScore={props.yesterdayScore} 
            streak={props.coachStreak} 
          />
          <CoachStrategyWidget
            score={props.dailyScore}
            streak={props.coachStreak}
            firstName={props.userProfile.firstName}
            counts={currentCounts}
            goals={props.goals}
          />
          <CoachScoreWidget
            score={props.dailyScore}
            streak={props.coachStreak}
            firstName={props.userProfile.firstName}
            counts={currentCounts}
            goals={props.goals}
          />
        </div>
        
        {/* Power Ring / Earnings Card */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/40 dark:border-white/10 shadow-2xl flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-2">GUADAGNO OGGI</p>
          <p className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter">€{Math.round(props.dailyEarnings)}</p>
          
          <div className="mt-6 flex gap-4">
            <button
              onClick={props.onOpenTargetCalculator}
              className="p-4 bg-slate-100 dark:bg-white/10 hover:bg-indigo-500 hover:text-white rounded-2xl transition-all shadow-lg border border-white/20"
            >
              <Calculator size={24} />
            </button>
            <button
              onClick={props.onOpenObjectionHandler}
              className="flex items-center gap-3 px-6 py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/20 transition-all border border-white/20"
            >
              <Sparkles size={20} />
              <span className="font-black text-[10px] uppercase tracking-widest">Script Lib</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );

  const renderAgenda = () => (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <FollowUpRankingWidget 
                activityLogs={props.activityLogs} 
                onEditLead={props.onOpenLeadCapture} 
            />
        </div>
        
        <div className="flex flex-col gap-6">
            {/* Next Appointment Card */}
            {props.nextAppointment ? (
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-indigo-500/20 border border-white/20 relative group">
                    <button 
                        onClick={() => props.onClearNextAppointment && props.onClearNextAppointment()}
                        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all shadow-sm"
                        title="Rimuovi questo appuntamento"
                    >
                        <X size={16} strokeWidth={3} />
                    </button>
                    <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-4">PROSSIMO APPUNTAMENTO</p>
                    <h4 className="text-2xl font-black mb-1 leading-tight pr-8">{props.nextAppointment.title}</h4>
                    <p className="text-sm font-bold text-indigo-200 uppercase mb-6 opacity-80">
                        {new Date(props.nextAppointment.date).toLocaleDateString('it-IT', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <div className="w-full h-px bg-white/10 mb-6" />
                    <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all">
                        Mostra Dettagli
                    </button>
                </div>
            ) : (
                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-white/40 dark:border-white/10 flex flex-col items-center justify-center text-center opacity-70">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-4">
                        <Clock size={32} className="text-slate-400" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Nessun Appuntamento</p>
                </div>
            )}

            {/* Next Follow Up Ring / Card */}
            {props.nextFollowUp && (
                <div 
                    onClick={() => props.onEditLead(props.nextFollowUp!.type || ActivityType.CONTACTS, props.nextFollowUp!)}
                    className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-[2.5rem] p-7 border border-white/40 dark:border-white/10 shadow-xl cursor-pointer hover:scale-[1.02] transition-all group flex items-center justify-between"
                >
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">PROSSIMO FOLLOW-UP</p>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white mb-0.5">{props.nextFollowUp.name}</h4>
                        <p className="text-[11px] font-bold text-slate-400 uppercase">Oggi entro le 20:00</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all">
                        <ChevronRight size={20} />
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Calendar Section */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/40 dark:border-white/10 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
            <div>
                <h4 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.25em] flex items-center gap-2">
                    <CalendarIcon size={18} className="text-purple-500" />
                    Calendario Produttività
                </h4>
                <p className="text-xs text-slate-400 mt-1 font-medium italic">Clicca su una data per vedere la cronologia</p>
            </div>
            <button onClick={props.onOpenCalendar} className="px-6 py-3 bg-slate-100 dark:bg-white/10 hover:bg-white hover:shadow-lg dark:hover:bg-white/20 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <CalendarIcon size={16} />
                Gestisci Date
            </button>
        </div>
        <GoalCalendar
            activityLogs={props.activityLogs}
            goals={props.goals}
            onSelectDate={props.onDateChange}
        />
      </div>
    </div>
  );

  const renderGrowth = () => (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recovery Widget (Tabella di Marcia) */}
        <div className="lg:col-span-3">
            <GoalRecoveryWidget 
                commercialMonth={props.commercialMonth}
                recoveryStats={props.recoveryStats}
                loading={props.statsLoading}
                onActivateFocus={props.onActivateFocus}
            />
        </div>

        {/* Vision Board Widget */}
        <div className="lg:col-span-2">
            <DreamTrackerWidget 
                visionBoardData={props.visionBoardData}
                autoPersonalEarnings={props.dailyEarnings}
                onUpdateEarnings={props.onUpdateVisionBoardEarnings}
                onOpenVisionBoard={props.onOpenVisionBoardSettings}
            />
        </div>
      </div>

      {/* Habit Stacking */}
      {props.enableHabitStacking && props.habitStacks && props.habitStacks.length > 0 && (
        <div className="w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/20 dark:border-white/5">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-500" />
                Abitudini Vincenti
            </h4>
            <HabitStackWidget 
                stacks={props.habitStacks} 
                customLabels={props.customLabels} 
                currentCounts={currentCounts}
                onOpenLeadCapture={props.onOpenLeadCapture}
                onOpenAppointmentModal={props.onOpenAppointmentModal}
            />
        </div>
      )}

      {/* Career Card */}
      <div className="w-full bg-slate-900 dark:bg-white rounded-[2.5rem] p-10 flex flex-col sm:flex-row items-center justify-between gap-8 border border-white/10 shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="flex items-center gap-6 relative z-10">
          <div 
            className="w-20 h-20 rounded-[2rem] flex items-center justify-center text-white shadow-2xl"
            style={{ backgroundColor: props.careerStatus.currentLevel.color || '#3b82f6' }}
          >
            <Trophy size={40} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.25em] mb-1">LIVELLO ATTUALE</p>
            <h4 className="text-3xl font-black text-white dark:text-slate-900 mb-1">{props.careerStatus.currentLevel.name}</h4>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Attivo in questo mese commerciale</p>
            </div>
          </div>
        </div>
        <button 
            onClick={props.onOpenAchievements}
            className="relative z-10 px-8 py-4 bg-white/10 dark:bg-slate-100 hover:bg-white/20 dark:hover:bg-slate-200 rounded-2xl text-[11px] font-black text-white dark:text-slate-900 uppercase tracking-[0.2em] transition-all active:scale-95 border border-white/10 dark:border-slate-200 shadow-xl"
        >
          Visualizza Traguardi
        </button>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Sub-navigation Tabs */}
      <div className="flex justify-center p-1.5 rounded-3xl mx-auto w-full max-w-lg border-2 border-slate-200 dark:border-white/10 shadow-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl sticky top-4 z-40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as ResultsSubTab)}
              className={`flex-1 group py-3 px-2 flex flex-col items-center justify-center gap-1.5 rounded-2xl transition-all duration-300 ${
                isActive 
                ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-[1.02]' 
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={18} className={`${isActive ? tab.color : 'text-slate-400 group-hover:scale-110 transition-transform'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
           key={activeSubTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.3 }}
           className="w-full"
        >
          {activeSubTab === 'performance' && renderPerformance()}
          {activeSubTab === 'agenda' && renderAgenda()}
          {activeSubTab === 'growth' && renderGrowth()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ResultsDashboard;
