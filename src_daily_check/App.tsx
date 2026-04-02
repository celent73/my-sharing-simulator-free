import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ActivityLog, ActivityType, AppSettings, Notification, NotificationVariant, UnlockedAchievements, Achievement, Theme, CommissionStatus, ContractType, VisionBoardData, NextAppointment, Qualification, Lead, ViewMode } from './types';
import { loadLogs, saveLogs, saveLogForDate, loadSettings, saveSettings, loadUnlockedAchievements, saveUnlockedAchievements, clearLogs, syncLocalDataToCloud, loadUserProfile, loadCareerDates, saveCareerDates, deleteLogsInRange, createClientFromLead } from './services/storageService';
import { getTodayDateString, calculateProgressForActivity, getCommercialMonthRange, getMonthIdentifier, getWeekIdentifier } from './utils/dateUtils';
import { format } from 'date-fns';
import Header from './components/Header';
import ActivityInput from './components/ActivityInput';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';
import DeleteDataModal from './components/ConfirmationModal';
import CareerStatus from './components/CareerStatus';
import { ACTIVITY_LABELS, activityIcons } from './constants';
import { calculateCareerStatus } from './utils/careerUtils';
import { calculateCurrentStreak } from './utils/gamificationUtils';
import { checkAndUnlockAchievements } from './utils/achievements';
import ResetGoalsModal from './components/ResetGoalsModal';
import PaywallModal from './components/PaywallModal';
import AchievementsModal from './components/AchievementsModal';
import { ScriptLibrary } from './components/ScriptLibrary';
import SocialShareModal from './components/SocialShareModal';
import MonthlyReportModal from './components/MonthlyReportModal';
import ContractSelectorModal from './components/ContractSelectorModal';
import VisionBoardModal from './components/VisionBoardModal';
import DreamTrackerWidget from './components/DreamTrackerWidget';
import LoginScreen from './components/LoginScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import AddAppointmentModal from './components/AddAppointmentModal';
import TargetCalculatorModal from './components/TargetCalculatorModal';
import DetailedGuideModal from './components/DetailedGuideModal';
import LeadCaptureModal from './components/LeadCaptureModal';
import CalendarModal from './components/CalendarModal';
import ClientsModal from './components/ClientsModal';

import VoiceSpeedMode from './components/VoiceSpeedMode';
import TeamLeaderboardModal from './components/TeamLeaderboardModal';
import CareerPathModal from './components/CareerPathModal';
import FollowUpBanner from './components/FollowUpBanner';
import AppointmentsOverviewModal from './components/AppointmentsOverviewModal';
import CareerDeadlineAlertModal from './components/CareerDeadlineAlertModal';
import { FocusNavigation, ActiveView } from './components/FocusNavigation';
import { AnimatePresence, motion } from 'framer-motion';
import GoalReminderModal, { ReminderType } from './components/GoalReminderModal';
import HabitReminderModal from './components/HabitReminderModal';
import { ChevronRight, Calendar, User, ArrowUp, Mail, ArrowRight, X, Phone, UserPlus, FileText, CheckCircle2, AlertCircle, Info, Activity, Clock, Users, Building2, Building, BadgePercent, LayoutDashboard, BrainCog, Presentation, Sparkles, LogOut, ArrowLeft, MoreVertical, Search, Shield, Globe, Award, HelpCircle, FileCheck, Moon, Settings2, Trash2, UserCircle as UserCircleIcon, Target as TargetIcon, Tag as TagIcon, Eye as EyeIcon
} from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';
import { supabase } from './supabaseClient';
import { useTheme } from '../contexts/ThemeContext';
import BackgroundMesh from '../components/BackgroundMesh';
import { FocusModeModal } from '../components/FocusModeModal';
import { useDailyStats } from '../hooks/useDailyStats';
import GoalRecoveryWidget from './components/GoalRecoveryWidget';
import ConversionFunnel from './components/ConversionFunnel';
import StatCard from './components/StatCard';
import { requestNotificationPermission, sendLocalNotification } from './utils/notificationSystem';
import { calculateDailyScore, calculateCoachStreak } from './utils/coachScoreUtils';
import WeeklyReportModal from './components/WeeklyReportModal';
import FollowUpRankingWidget from './components/FollowUpRankingWidget';
import ResultsDashboard from './components/ResultsDashboard';
const APP_VERSION = "v1.4";

// Helper per normalizzazione dati (Deduplicazione robusta)
const normalizeName = (name: string) => name.trim().toLowerCase().replace(/\s+/g, ' ');
const normalizePhone = (phone: string) => (phone || '').replace(/\D/g, '').replace(/^39/, '');

const DEFAULT_SETTINGS: AppSettings = {
  userProfile: {
    firstName: '',
    lastName: '',
    commissionStatus: CommissionStatus.PRIVILEGIATO
  },
  goals: {
    daily: {},
    weekly: {},
    monthly: {},
  },
  notificationSettings: {
    goalReached: true,
    milestones: true,
  },
  theme: 'light',
  commercialMonthStartDay: 16,
  customLabels: ACTIVITY_LABELS,
  visionBoard: {
    enabled: true,
    title: '',
    targetAmount: 1000,
    imageData: null
  },
  enableGoals: true,
  enableCustomLabels: true,
  enableHabitStacking: false,
  habitStacks: []
};

const NotificationItem: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const typeStyles = {
    success: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-100', icon: <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" /></svg> },
    info: { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-800 dark:text-indigo-100', icon: <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" /></svg> }
  };
  const styles = typeStyles[notification.type];
  return (
    <div className={`w-full max-w-xs p-3 mb-2 rounded-2xl shadow-xl animate-scale-up backdrop-blur-md border pointer-events-auto ${styles.bg} ${styles.text}`} role="alert">
      <div className="flex items-center gap-3">
        <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-xl bg-white/20`}>{styles.icon}</div>
        <div className="text-sm font-bold">{notification.message}</div>
        <button type="button" onClick={onClose} className="ms-auto -mx-2 -my-2 text-current opacity-70 hover:opacity-100 rounded-lg p-3 inline-flex items-center justify-center h-10 w-10 active:scale-90 transition-all cursor-pointer" aria-label="Close"><svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" /></svg></button>
      </div>
    </div>
  );
};

interface AppContentProps {
  onClose?: () => void;
  initialView?: string;
}

const AppContent: React.FC<AppContentProps> = ({ onClose, initialView }) => {
  const { user, signOut, loading: authLoading, isPasswordRecovery, setIsPasswordRecovery } = useAuth();
  const { theme: globalTheme, toggleTheme: globalToggleTheme } = useTheme();

  const userId = user?.id || null;

  const { commercialMonth, recoveryStats, loading: statsLoading } = useDailyStats();

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievements>({});
  const [activeView, setActiveView] = useState<ActiveView>('today');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedInputDate, setSelectedInputDate] = useState<Date>(new Date());
  const [isClientsModalOpen, setIsClientsModalOpen] = useState(false);

  useEffect(() => {
    if (initialView === 'clients') {
      setIsClientsModalOpen(true);
    }
  }, [initialView]);
  
  // States for Focus Recovery Mode
  const [recoveryFocusGoal, setRecoveryFocusGoal] = useState<string | undefined>(undefined);
  const [recoveryFocusTarget, setRecoveryFocusTarget] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<'inserimento' | 'risultati'>('inserimento');
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [deadlineAlert, setDeadlineAlert] = useState<{ stageName: string; date: string } | null>(null);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderType, setReminderType] = useState<ReminderType>('DAILY_MISSING');
  const [lastReminderShownDate, setLastReminderShownDate] = useState<string | null>(null);
  const [lastWeeklyReminderShownWeek, setLastWeeklyReminderShownWeek] = useState<string | null>(null);
  const [lastMorningReminderShownDate, setLastMorningReminderShownDate] = useState<string | null>(null);
  const notifiedTasksRef = useRef<Set<string>>(new Set());

  const addNotification = useCallback((message: string, type: NotificationVariant) => {
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
  }, []);

  const CAREER_STAGES = useMemo(() => [
    { name: "Family Pro", color: "#ec4899" }, // Vibrant Pink (from-pink-500)
    { name: "Family pro 3x3", color: "#815545" },
    { name: "Family 3S", color: "#8000ff" },
    { name: "Family 5S", color: "#1147e6" },
    { name: "Top family", color: "#00c3eb" },
    { name: "Pro Manager", color: "#54cdb4" },
    { name: "Regional Manager", color: "#00b21a" },
    { name: "National Manager", color: "#8fff33" },
    { name: "Director", color: "#e6e600" },
    { name: "Director Pro", color: "#c88536" },
    { name: "Ambassador", color: "#b3b3b3" },
    { name: "President", color: "#c8b335" }
  ], []);

  useEffect(() => {
    const handleScroll = (e: any) => {
      const target = e.target === document ? window : e.target;
      const currentScrollY = target.scrollY !== undefined ? target.scrollY : target.scrollTop;
      if (currentScrollY !== undefined) {
        setShowBackToTop(currentScrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    return () => window.removeEventListener('scroll', handleScroll, { capture: true } as any);
  }, []);

  // --- HABIT STACKING NOTIFICATIONS & EVENTS ---
  useEffect(() => {
    if (settings.enableHabitStacking) {
      requestNotificationPermission();
    }
  }, [settings.enableHabitStacking]);

  useEffect(() => {
    if (!isInitializing) {
      window.dispatchEvent(new CustomEvent('habit-stacks-updated'));
    }
  }, [settings.habitStacks, settings.enableHabitStacking, isInitializing]);

  const handleScrollToTop = () => {
    const anchor = document.getElementById('top-anchor');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const scrollContainer = document.getElementById('main-scroll-container');
    if (scrollContainer) {
      try {
        scrollContainer.scroll({ top: 0, left: 0, behavior: 'smooth' });
      } catch (e) {
        scrollContainer.scrollTop = 0;
      }
      setTimeout(() => {
        if (scrollContainer) scrollContainer.scrollTop = 0;
      }, 100);
      setTimeout(() => {
        if (scrollContainer) scrollContainer.scrollTop = 0;
      }, 300);
    }
    try {
      window.scroll({ top: 0, left: 0, behavior: 'smooth' });
    } catch (e) {
      window.scrollTo(0, 0);
    }
    document.documentElement.scrollTop = 0;
  };

  // Effetto deadline spostato più in basso per dipendenze (careerStatus)
  

  const handleDeadlineAchieved = () => {
    if (!deadlineAlert) return;
    
    // Segna come riconosciuto per questa data specifica
    const newAck = { ...settings.acknowledgedDeadlines, [deadlineAlert.stageName]: deadlineAlert.date };
    const newSettings = { ...settings, acknowledgedDeadlines: newAck };
    setSettings(newSettings);
    saveSettings(userId, newSettings);
    
    // Notifica di successo
    addNotification(`FANTASTICO! Hai raggiunto il traguardo ${deadlineAlert.stageName}! 🏆✨`, 'success');
    setDeadlineAlert(null);
  };

  const handleDeadlinePostpone = () => {
    if (!deadlineAlert) return;
    
    // Chiude popup e apre Piano Carriera per cambiare data
    setDeadlineAlert(null);
    setActiveView('today'); // Assicuriamoci di essere in vista oggi
    setIsCalendarModalOpen(false); // Chiude altri modal eventuali
    // Qui in realtà dovremmo forzare l'apertura del percorso carriera
    setActiveView('career');
  };

  // Rimossa duplicazione: Career dates gestite tramite settings
  // useEffect(() => { ... }) 
  

  const [isGlobalAppointmentsOpen, setIsGlobalAppointmentsOpen] = useState(false);
  const [globalAppointmentsFilterDate, setGlobalAppointmentsFilterDate] = useState<Date | null>(null);

  useEffect(() => {
    const handleOpenAppointments = (e: Event) => {
      const customEvent = e as CustomEvent;
      console.log('[App.tsx] listener open-appointments-overview received', customEvent.detail);
      if (customEvent.detail?.date) {
        setGlobalAppointmentsFilterDate(new Date(customEvent.detail.date));
      } else {
        setGlobalAppointmentsFilterDate(null);
      }
      setIsGlobalAppointmentsOpen(true);
    };
    window.addEventListener('open-appointments-overview', handleOpenAppointments);
    
    const handleTestReminder = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.type) {
        setReminderType(customEvent.detail.type);
        setIsReminderModalOpen(true);
      }
    };
    window.addEventListener('test-reminder', handleTestReminder);

    return () => {
      window.removeEventListener('open-appointments-overview', handleOpenAppointments);
      window.removeEventListener('test-reminder', handleTestReminder);
    };
  }, []);

  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'profile' | 'goals' | 'labels' | 'notifications' | 'stacking'>('profile');
  const [isDeleteDataModalOpen, setDeleteDataModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [isAchievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [isMonthlyReportModalOpen, setIsMonthlyReportModalOpen] = useState(false);
  const [isVisionBoardModalOpen, setIsVisionBoardModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isTargetCalculatorModalOpen, setIsTargetCalculatorModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCareerPathModalOpen, setIsCareerPathModalOpen] = useState(false);
  const [isScriptLibraryOpen, setIsScriptLibraryOpen] = useState(false);
  const [isSocialShareModalOpen, setIsSocialShareModalOpen] = useState(false);
  const [isContractSelectorModalOpen, setIsContractSelectorModalOpen] = useState(false);
  const [isLeadCaptureModalOpen, setIsLeadCaptureModalOpen] = useState(false);
  const [leadCaptureType, setLeadCaptureType] = useState<ActivityType>(ActivityType.CONTACTS);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [captureForceStatus, setCaptureForceStatus] = useState<'pending' | 'won' | 'lost' | undefined>(undefined);
  const [captureForceWonType, setCaptureForceForceWonType] = useState<'partner' | 'cliente' | undefined>(undefined);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [isResetGoalsModalOpen, setResetGoalsModalOpen] = useState(false);
  const [remainingTrialDays] = useState<number | null>(null);
  const [activeReminderStack, setActiveReminderStack] = useState<import('./types').HabitStack | null>(null);
  const [isWeeklyReportOpen, setIsWeeklyReportOpen] = useState(false);

  const effectiveCustomLabels = (settings.enableCustomLabels ?? true) ? (settings.customLabels || ACTIVITY_LABELS) : ACTIVITY_LABELS;
  const effectiveGoals = useMemo(() => {
    const goals = (settings.enableGoals ?? true) ? settings.goals : { daily: {}, weekly: {}, monthly: {} };
    return {
      ...goals,
      daily: {
        ...goals.daily,
        [ActivityType.NEW_CONTRACTS]: 0,
        [ActivityType.NEW_FAMILY_UTILITY]: 0
      }
    };
  }, [settings.enableGoals, settings.goals]);

  const dailyScore = useMemo(() => {
    const dateStr = format(selectedInputDate, 'yyyy-MM-dd');
    const dateLog = activityLogs.find(l => l.date === dateStr);
    return calculateDailyScore(dateLog, settings.goals, settings.habitStacks || [], dateStr);
  }, [activityLogs, settings.goals, settings.habitStacks, selectedInputDate]);

  const yesterdayScore = useMemo(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const yesterdayLog = activityLogs.find(l => l.date === yesterdayStr);
    return calculateDailyScore(yesterdayLog, settings.goals, settings.habitStacks || [], yesterdayStr);
  }, [activityLogs, settings.goals, settings.habitStacks]);

  const coachStreak = useMemo(() => {
    return calculateCoachStreak(activityLogs, settings.goals, settings.habitStacks || []);
  }, [activityLogs, settings.goals, settings.habitStacks]);

  useEffect(() => {
    if (!isInitializing && activityLogs.length > 0) {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday
      
      if (dayOfWeek === 0 || dayOfWeek === 1) {
        // Get ISO Week (simple version)
        const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
        const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
        const weekId = `${d.getUTCFullYear()}-W${weekNo}`;

        if (settings.lastWeeklyReportShown !== weekId) {
          setIsWeeklyReportOpen(true);
          setSettings(prev => ({ ...prev, lastWeeklyReportShown: weekId }));
        }
      }
    }
  }, [isInitializing, activityLogs, settings.lastWeeklyReportShown]);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const todayStr = getTodayDateString();
      const currentHour = now.getHours();
      const currentDay = now.getDay(); // 0 is Sunday, 1 is Monday...

      // MORNING MOTIVATION LOGIC
      // Se tra le 7:00 e le 12:00 e non l'abbiamo già mostrato oggi
      if (currentHour >= 7 && currentHour < 12 && lastMorningReminderShownDate !== todayStr) {
        setReminderType('MORNING_MOTIVATION');
        setIsReminderModalOpen(true);
        setLastMorningReminderShownDate(todayStr);
        return;
      }

      // DAILY REMINDER LOGIC
      // Se dopo le 19:00 e non abbiamo inserito nulla oggi e non l'abbiamo già mostrato oggi
      if (currentHour >= 19 && lastReminderShownDate !== todayStr) {
        const todayLog = activityLogs.find(l => l.date === todayStr);
        const hasTodayActivity = todayLog && Object.values(todayLog.counts).some(v => (v || 0) > 0);
        
        if (!hasTodayActivity) {
          setReminderType('DAILY_MISSING');
          setIsReminderModalOpen(true);
          setLastReminderShownDate(todayStr);
          return; // Show one at a time
        }
      }

      // WEEKLY REMINDER LOGIC
      // Se è Domenica dopo le 18:00 o Lunedì mattina (prima delle 12:00)
      const currentWeekId = getWeekIdentifier(now);
      const isTimeForWeeklyCheck = (currentDay === 0 && currentHour >= 18) || (currentDay === 1 && currentHour < 12);
      
      if (isTimeForWeeklyCheck && lastWeeklyReminderShownWeek !== currentWeekId) {
        // Verifica se gli obiettivi settimanali sono stati raggiunti
        if (settings.goals.weekly && Object.keys(settings.goals.weekly).length > 0) {
          let allGoalsMet = true;
          
          Object.entries(settings.goals.weekly).forEach(([activity, target]) => {
            if ((target || 0) > 0) {
              const weeklySum = activityLogs
                .filter(l => getWeekIdentifier(new Date(l.date)) === currentWeekId)
                .reduce((sum, l) => sum + (l.counts[activity as ActivityType] || 0), 0);
              
              if (weeklySum < (target as number)) {
                allGoalsMet = false;
              }
            }
          });

          if (!allGoalsMet) {
            setReminderType('WEEKLY_GOAL_NOT_REACHED');
            setIsReminderModalOpen(true);
            setLastWeeklyReminderShownWeek(currentWeekId);
          }
        }
      }
    };

    // Check periodically or on dependency change
    const interval = setInterval(checkReminders, 1000 * 60 * 30); // Every 30 mins
    checkReminders(); // Initial check

    return () => clearInterval(interval);
  }, [activityLogs, settings.goals.weekly, lastReminderShownDate, lastWeeklyReminderShownWeek, lastMorningReminderShownDate]);


  // Habit Stacking Reminders
  useEffect(() => {
    if (!settings.enableHabitStacking || !settings.habitStacks?.length) return;

    const checkHabitReminders = () => {
      if (activeReminderStack) return;

      const now = new Date();
      const todayStr = getTodayDateString();

      const stackToRemind = settings.habitStacks!.find(stack => {
        if (!stack.time) return false;
        
        if (stack.lastCompletedDate === todayStr) return false;

        if (stack.snoozedUntil && stack.snoozedUntil > now.getTime()) {
           return false;
        }

        const [hours, minutes] = stack.time.split(':').map(Number);
        const stackTime = new Date();
        stackTime.setHours(hours, minutes, 0, 0);

        if (now.getTime() >= stackTime.getTime()) {
           return true; 
        }
        return false;
      });

      if (stackToRemind && !activeReminderStack) {
          setActiveReminderStack(stackToRemind);
          
          // v1.3.28 Fix: Resolving actual action label instead of technically internal ID
          const actionLabel = stackToRemind.action === 'CUSTOM' 
            ? (stackToRemind.customActionName || 'Azione personalizzata') 
            : (effectiveCustomLabels[stackToRemind.action as ActivityType] || stackToRemind.action);

          sendLocalNotification(
            `Habit Stacking: ${stackToRemind.trigger}`,
            `È il momento di: ${actionLabel}. Sii focalizzato! 🎯`
          );
      }
    };

    const interval = setInterval(checkHabitReminders, 60 * 1000);
    checkHabitReminders();

    return () => clearInterval(interval);
  }, [settings.enableHabitStacking, settings.habitStacks, activeReminderStack, effectiveCustomLabels]);

  // Follow-up & Appointment Notifications
  useEffect(() => {
    if (isInitializing) return;

    const checkTasksAndNotify = () => {
      const todayStr = getTodayDateString();
      const now = new Date();
      
      // Load/Initialize notified IDs for today from localStorage to persist across refreshes
      const storageKey = `notified-tasks-${todayStr}`;
      const savedNotified = localStorage.getItem(storageKey);
      if (savedNotified && notifiedTasksRef.current.size === 0) {
        const ids = JSON.parse(savedNotified);
        ids.forEach((id: string) => notifiedTasksRef.current.add(id));
      }

      const newNotifiedIds: string[] = [];

      // 1. Check Leads for Follow-ups and Appointments
      activityLogs.forEach(log => {
        if (!log.leads) return;
        
        log.leads.forEach(lead => {
          if (lead.status === 'won' || lead.status === 'lost') return;

          // Check Follow-up
          if (lead.followUpDate === todayStr && !notifiedTasksRef.current.has(`${lead.id}-followup`)) {
            sendLocalNotification(
              `Follow-up: ${lead.name}`,
              `Hai un follow-up programmato per oggi con ${lead.name}. Non fartelo scappare! 📞`
            );
            notifiedTasksRef.current.add(`${lead.id}-followup`);
            newNotifiedIds.push(`${lead.id}-followup`);
          }

          // Check Appointment
          if (lead.appointmentDate) {
             const appDate = lead.appointmentDate.split('T')[0];
             if (appDate === todayStr && !notifiedTasksRef.current.has(`${lead.id}-appointment`)) {
                sendLocalNotification(
                  `Appuntamento: ${lead.name}`,
                  `Oggi hai un appuntamento con ${lead.name}. Preparati al meglio! 🤝`
                );
                notifiedTasksRef.current.add(`${lead.id}-appointment`);
                newNotifiedIds.push(`${lead.id}-appointment`);
             }
          }
        });
      });

      // 2. Check "Next Appointment" in Settings (Global Smart Planning)
      if (settings.nextAppointment) {
        const nextAppDate = settings.nextAppointment.date.split('T')[0];
        const nextAppId = `next-app-${settings.nextAppointment.title}-${nextAppDate}`;
        if (nextAppDate === todayStr && !notifiedTasksRef.current.has(nextAppId)) {
          sendLocalNotification(
            `Promemoria Appuntamento`,
            `Oggi: ${settings.nextAppointment.title}. Sii puntuale e focalizzato! 🎯`
          );
          notifiedTasksRef.current.add(nextAppId);
          newNotifiedIds.push(nextAppId);
        }
      }

      if (newNotifiedIds.length > 0) {
        localStorage.setItem(storageKey, JSON.stringify(Array.from(notifiedTasksRef.current)));
      }
    };

    const intervalTask = setInterval(checkTasksAndNotify, 1000 * 60 * 15); // Check every 15 mins
    checkTasksAndNotify(); // Initial check

    return () => clearInterval(intervalTask);
  }, [activityLogs, settings.nextAppointment, isInitializing]);

  const handleHabitComplete = (stackId: string, count: number) => {
    const stack = settings.habitStacks?.find(s => s.id === stackId);
    if (!stack) return;

    const todayStr = getTodayDateString();
    
    // 1. Record the activity
    // For CUSTOM actions, we use the stackId as the activity key in the log
    const activityKey = stack.action === 'CUSTOM' ? stack.id : stack.action;
    
    // v1.3.15: Decouple habit completion from activity logging for lead-based actions
    // to prevent double-counting when the user manually logs the actual leads/appointments.
    const isLeadBasedAction = stack.action === ActivityType.CONTACTS || stack.action === ActivityType.APPOINTMENTS;
    
    if (!isLeadBasedAction) {
      handleUpdateActivity(activityKey, count, todayStr);
    } else {
      // v1.3.15: Instead of blind-incrementing, open the data entry modal
      // This fulfills "non deve aumentare il numero progressivo... oppure... aprire le finestre"
      handleOpenLeadCapture(stack.action as ActivityType);
    }

    // 2. Check if total reached target to mark as fully completed for today
    // We must find the log for today specifically
    const todayLog = activityLogs.find(log => log.date === todayStr);
    const existingCount = todayLog?.counts[activityKey] || 0;
    const currentTotal = existingCount + count;
    
    const isFullyComplete = stack.targetCount > 0 && currentTotal >= stack.targetCount;

    setSettings(prev => ({
      ...prev,
      habitStacks: prev.habitStacks?.map(s => 
        s.id === stackId 
          ? { 
              ...s, 
              lastCompletedDate: isFullyComplete ? todayStr : s.lastCompletedDate, 
              snoozedUntil: isFullyComplete ? undefined : Date.now() + 30 * 60 * 1000 
            } 
          : s
      )
    }));
    setActiveReminderStack(null);
    
    if (isFullyComplete) {
      addNotification(`CAPOLAVORO! Abitudine "${stack.trigger}" completata per oggi! 🌟`, 'success');
    } else {
      addNotification(`BRAVO! Ma non basta: registrate ${count} azioni. Sii più focalizzato, ci rivediamo tra 30 minuti! 🎯`, 'info');
    }
  };

  const handleHabitSnooze = (stackId: string) => {
    const stack = settings.habitStacks?.find(s => s.id === stackId);
    setSettings(prev => ({
      ...prev,
      habitStacks: prev.habitStacks?.map(s => s.id === stackId ? { ...s, snoozedUntil: Date.now() + 30 * 60 * 1000 } : s)
    }));
    if (stack) {
      addNotification(`Sii più focalizzato! Riproviamo per "${stack.trigger}" tra 30 minuti. ⏱️`, 'info');
    }
    setActiveReminderStack(null);
  };

  const removeNotification = useCallback((id: number) => setNotifications(prev => prev.filter(n => n.id !== id)), []);

  const handleOpenSettings = (tab: 'profile' | 'goals' | 'labels' | 'notifications' | 'stacking' = 'profile') => {
    setSettingsInitialTab(tab);
    setSettingsModalOpen(true);
  };

  const handleOpenLeadCapture = (type: ActivityType, lead?: Lead, forceStatus?: 'pending' | 'won' | 'lost', forceWonType?: 'partner' | 'cliente') => {
    setLeadCaptureType(type);
    setEditingLead(lead || null);
    setCaptureForceStatus(forceStatus);
    setCaptureForceForceWonType(forceWonType);
    setIsLeadCaptureModalOpen(true);
  };

  const handleSaveLead = (leadData: { 
    id?: string; 
    name: string; 
    phone: string; 
    note: string; 
    status?: 'pending' | 'won' | 'lost'; 
    type?: ActivityType; 
    appointmentDate?: string; 
    locationType?: 'physical' | 'online'; 
    address?: string; 
    platform?: string; 
    temperature?: 'freddo' | 'tiepido' | 'caldo';
    contractType?: ContractType;
    linkedAppointment?: boolean;
    followUpDate?: string;
    videoSent?: boolean;
    videoType?: string;
  }) => {
    let updatedLog: ActivityLog | null = null;
    let updatedAllLogs: ActivityLog[] | null = null;

    setActivityLogs(prevLogs => {
      const newLogs = [...prevLogs];
      const dateStr = format(selectedInputDate, 'yyyy-MM-dd');

      // --- GLOBAL DEDUPLICATION LOGIC (Hyper-Robust) ---
      let effectiveId = leadData.id;
      
      console.log("[handleSaveLead] START - leadData:", JSON.parse(JSON.stringify(leadData)));
      console.log("[handleSaveLead] initial effectiveId:", effectiveId);


      // -------------------------------------------------

      if (effectiveId) {
        // EDIT MODE
        let found = false;
        for (let i = 0; i < newLogs.length; i++) {
          const log = newLogs[i];
          if (log.leads) {
            const leadIndex = log.leads.findIndex(l => l.id === effectiveId);
            if (leadIndex !== -1) {
              const oldLead = log.leads[leadIndex];
              const updatedLeads = [...log.leads];
              
              const dataToSave = { ...leadData };
              if (!dataToSave.id) delete dataToSave.id;

              const oldType = oldLead.type || ActivityType.CONTACTS;
              const newType = (leadData.status !== 'lost') ? (leadData.type || oldType) : oldType;
              
              console.log(`[handleSaveLead] EDIT MODE: Updating lead ${effectiveId} in log ${log.date}. oldType=${oldType}, newType=${newType}`);

              // --- GESTIONE TRASFORMAZIONE TIPO (v1.2.99 - Sales Funnel Logic) ---
              // MODIFICA CRUCIAL: Ogni trasformazione/chiusura deve contare nel cruscotto di OGGI, non nel giorno passato.
              let todayLogIndex = newLogs.findIndex(l => l.date === dateStr);
              let todayLog = todayLogIndex >= 0 ? { ...newLogs[todayLogIndex] } : { date: dateStr, counts: {}, leads: [] };
              let todayLogModified = false;

              // Se sta diventando 'won' proprio ora, non incrementare qui, verrà gestito dal blocco 'won' successivo
              const isNewlyWon = leadData.status === 'won' && oldLead.status !== 'won';
              if (newType !== oldType && leadData.status !== 'lost' && !isNewlyWon) {
                console.log(`[handleSaveLead] TYPE TRANSFORMATION DETECTED: ${oldType} -> ${newType} for date: ${dateStr}`);
                
                // Safety copy for mutation-free update
                const currentCounts = { ...(todayLog.counts || {}) };
                const newVal = (currentCounts[newType as ActivityType] || 0) + 1;
                
                todayLog.counts = {
                  ...currentCounts,
                  [newType]: newVal
                };
                
                console.log(`[handleSaveLead] Funnel Progression: ${newType} incremented to ${newVal}. Previous ${oldType} count preserved.`);
                todayLogModified = true;
                addNotification(`Contatto trasformato in ${newType === ActivityType.APPOINTMENTS ? 'Appuntamento' : 'Contatto'}!`, 'info');
              }
              
              // --- GESTIONE VIDEO INVIATO (v1.3.28) ---
              const isNewlyVideoSent = leadData.videoSent && !oldLead.videoSent;
              if (isNewlyVideoSent) {
                console.log(`[handleSaveLead] VIDEO SENT DETECTED. Incrementing for ${dateStr}`);
                todayLog.counts = {
                  ...todayLog.counts,
                  [ActivityType.VIDEOS_SENT]: (todayLog.counts[ActivityType.VIDEOS_SENT] || 0) + 1
                };
                todayLogModified = true;
                addNotification(`Video inviato registrato! 🎥`, 'success');
              }
              // -----------------------------------------------------

              // Prepariamo l'oggetto aggiornato
              // KEEP THE ORIGINAL DATE AND ID!
              const updatedLead = { 
                ...oldLead, 
                ...dataToSave as any,
                date: oldLead.date, // force retain original creation date
                id: effectiveId,
                type: newType,
                updatedAt: new Date().toISOString()
              };

              // Update original log leads array
              log.leads[leadIndex] = updatedLead;
              newLogs[i] = { ...log, leads: [...log.leads] };

              // --- won logic moved slightly down to ensure it uses updatedLead ---
              if (isNewlyWon) {
                console.log(`[handleSaveLead] STATUS CHANGED TO WON. Converting lead ${effectiveId} to client/partner.`);
                todayLogModified = true; // Win counts toward TODAY
                const isFamilyUtility = newType === ActivityType.NEW_FAMILY_UTILITY;
                
                // Increment specific counts for today
                todayLog.counts = {
                  ...todayLog.counts,
                  [newType]: (todayLog.counts[newType] || 0) + 1
                };
                
                const cType = leadData.contractType || (isFamilyUtility ? ContractType.GREEN : ContractType.LIGHT);
                if (!todayLog.contractDetails) todayLog.contractDetails = {};
                todayLog.contractDetails[cType] = (todayLog.contractDetails[cType] || 0) + 1;

                // Extra logic for Green/Family Utility sync
                if (cType === ContractType.GREEN && !isFamilyUtility) {
                   todayLog.counts[ActivityType.NEW_FAMILY_UTILITY] = (todayLog.counts[ActivityType.NEW_FAMILY_UTILITY] || 0) + 1;
                }
                if (isFamilyUtility) {
                   todayLog.counts[ActivityType.NEW_CONTRACTS] = (todayLog.counts[ActivityType.NEW_CONTRACTS] || 0) + 1;
                }

                createClientFromLead(userId, updatedLead, isFamilyUtility ? 'partner' : 'cliente')
                  .catch(e => console.error("Error creating persistent client:", e));
                
                addNotification(`Grande! ${leadData.name} è ora un ${isFamilyUtility ? 'Family Utility' : 'Cliente Privilegiato'}! 🚀`, 'success');
              }

              // Salva i contatori aggiornati nel log di oggi
              if (todayLogModified) {
                if (todayLogIndex >= 0) {
                  // PREVENT OVERWRITE: todayLog was cloned BEFORE we updated the leads array.
                  // We must ensure todayLog preserves the newly updated leads array.
                  todayLog.leads = newLogs[todayLogIndex].leads;
                  newLogs[todayLogIndex] = todayLog;
                } else {
                  newLogs.push(todayLog);
                }
              }

              // Il file aggiornato che vogliamo mandare su Supabase potrebbe essere sia quello di ieri che quello di oggi.
              // `saveLogForDate` normalmente accetta un solo log, ma aggiornerà tutto il file su Supabase se necessario.
              // Impostiamo `updatedLog` per forzare il sync. Meglio passare `todayLog` se è stato modificato (per mostrare i punti oggi).
              updatedLog = todayLogModified ? todayLog : newLogs[i];
              found = true;
              
              // Non facciamo break se vogliamo aggiornare possibili duplicati ID in log diversi, 
              // ma tipicamente un ID è unico per data. Se però è una modifica globale, proseguiamo.
            }
          }
        }
        if (!found) return prevLogs;
      } else {
        // CREATE MODE
        const existingLogIndex = newLogs.findIndex(log => log.date === dateStr);
        let dateLog: ActivityLog;

        if (existingLogIndex >= 0) {
          dateLog = {
            ...newLogs[existingLogIndex],
            counts: { ...newLogs[existingLogIndex].counts },
            leads: [...(newLogs[existingLogIndex].leads || [])]
          };
          newLogs[existingLogIndex] = dateLog;
        } else {
          dateLog = { date: dateStr, counts: {}, leads: [] };
          newLogs.push(dateLog);
        }

        const newLeadType = leadData.type || leadCaptureType;
        
        // Remove undefined id from leadData so it doesn't overwrite our generated ID
        const dataToCreate = { ...leadData as any };
        if (dataToCreate.id === undefined) delete dataToCreate.id;

        const newLead = {
          id: crypto.randomUUID(), // Ensure guaranteed UUID
          type: newLeadType,
          date: new Date().toISOString(),
          status: leadData.status || 'pending',
          ...dataToCreate
        };

        if (!newLead.id) {
            newLead.id = crypto.randomUUID(); // Extra safety net
        }

        dateLog.leads!.push(newLead);
        console.log("[handleSaveLead] CREATE MODE: Appending new lead ->", newLead);

        // Se creato direttamente come 'won'
        if (newLead.status === 'won') {
          const targetActivity = leadData.type || ActivityType.NEW_CONTRACTS;
          dateLog.counts[targetActivity] = (dateLog.counts[targetActivity] || 0) + 1;
          
          if (!dateLog.contractDetails) dateLog.contractDetails = {};
          const cType = leadData.contractType || (targetActivity === ActivityType.NEW_FAMILY_UTILITY ? ContractType.GREEN : ContractType.LIGHT);
          dateLog.contractDetails[cType] = (dateLog.contractDetails[cType] || 0) + 1;
          
          if (cType === ContractType.GREEN && targetActivity !== ActivityType.NEW_FAMILY_UTILITY) {
            dateLog.counts[ActivityType.NEW_FAMILY_UTILITY] = (dateLog.counts[ActivityType.NEW_FAMILY_UTILITY] || 0) + 1;
          }
          if (targetActivity === ActivityType.NEW_FAMILY_UTILITY) {
            dateLog.counts[ActivityType.NEW_CONTRACTS] = (dateLog.counts[ActivityType.NEW_CONTRACTS] || 0) + 1;
          }

          // AUTO-CREATE CLIENT (NEW persistency)
          createClientFromLead(userId, newLead as Lead, targetActivity === ActivityType.NEW_FAMILY_UTILITY ? 'partner' : 'cliente')
            .catch(e => console.error("Error creating persistent client:", e));
        } else {
          dateLog.counts[newLeadType] = (dateLog.counts[newLeadType] || 0) + 1;

          if (newLeadType === ActivityType.CONTACTS && (leadData as any).linkedAppointment) {
            dateLog.counts[ActivityType.APPOINTMENTS] = (dateLog.counts[ActivityType.APPOINTMENTS] || 0) + 1;
          }

          // Solo se non abbiamo già incrementato VIDEOS_SENT (perché era il tipo principale del lead)
          if (leadData.videoSent && newLeadType !== ActivityType.VIDEOS_SENT) {
            dateLog.counts[ActivityType.VIDEOS_SENT] = (dateLog.counts[ActivityType.VIDEOS_SENT] || 0) + 1;
          }
        }

        updatedLog = dateLog;
      }

      const sortedLogs = newLogs.sort((a, b) => b.date.localeCompare(a.date));
      updatedAllLogs = sortedLogs;

      if (updatedLog) {
        saveLogForDate(userId, updatedLog, sortedLogs)
          .catch(err => {
            console.error("Cloud save error:", err);
            const msg = err?.message || err?.details || "Errore sconosciuto";
            addNotification(`Sincronizzazione Fallita: ${msg} 🛡️`, "info");
          });
        window.dispatchEvent(new CustomEvent('daily-check-updated'));
      }

      return sortedLogs;
    });

    setIsLeadCaptureModalOpen(false);
    setEditingLead(null);

    // AUTOMAZIONE: Aggiornamento automatico del "Prossimo Appuntamento" nelle impostazioni
    // Se è un appuntamento futuro e NON è stato ancora vinto/perso, impostalo come prossimo
    if ((leadData.type === ActivityType.APPOINTMENTS || (leadData as any).linkedAppointment) && leadData.appointmentDate && leadData.status === 'pending') {
      const appDate = new Date(leadData.appointmentDate);
      if (appDate > new Date()) {
        setSettings(prev => ({
          ...prev,
          nextAppointment: {
            title: leadData.name,
            date: leadData.appointmentDate!
          }
        }));
      }
    } 
    
    // PULIZIA: Se il lead salvato (vinto o perso) corrisponde al "Prossimo Appuntamento", rimuovilo
    const currentNextApp = settings.nextAppointment;
    if (currentNextApp && (leadData.status === 'won' || leadData.status === 'lost')) {
        const normSavedName = normalizeName(leadData.name);
        const normNextAppName = normalizeName(currentNextApp.title);
        
        if (normSavedName === normNextAppName) {
            console.log(`[handleSaveLead] Clearing Next Appointment for ${leadData.name} (Status: ${leadData.status})`);
            setSettings(prev => {
                const { nextAppointment, ...rest } = prev;
                return rest as any;
            });
        }
    }

    if (!leadData.status || leadData.status !== 'won') {
      addNotification(`${leadCaptureType === ActivityType.APPOINTMENTS ? 'Appuntamento' : 'Contatto'} salvato! `, 'info');
    }
  };

  const handleSaveSettings = (newSettings: AppSettings) => setSettings(newSettings);
  const handleSaveVisionBoard = (visionData: VisionBoardData) => setSettings((prev: AppSettings) => ({ ...prev, visionBoard: visionData }));
  const handleAppointmentSchedule = (appointment: NextAppointment) => {
    setSettings((prev: AppSettings) => ({ ...prev, nextAppointment: appointment }));
    addNotification("Appuntamento salvato!", "success");
  };

  const handleUpdateTargetQualification = (qualification: string | null) => {
    setSettings((prev: AppSettings) => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        targetQualification: qualification as Qualification
      }
    }));
    addNotification(`Obiettivo aggiornato: ${qualification}`, "success");
  };

  const handleUpdateCareerDates = (dates: Record<string, string>) => {
    setSettings(prev => ({ ...prev, careerPathDates: dates }));
  };

  const handleClearAllData = async () => {
    try {
      // 1. Clear database logs and local storage logs
      await clearLogs(userId);
      setActivityLogs([]);
      
      // 2. Prepare reset settings
      const resetSettings = { 
        ...settings, 
        goals: { daily: {}, weekly: {}, monthly: {} },
        nextAppointment: undefined,
        visionBoard: DEFAULT_SETTINGS.visionBoard,
        habitStacks: [],
        careerPathDates: {},
        acknowledgedDeadlines: {}
      };
      
      // 3. Clear cloud settings and local storage settings ATOMICALLY
      setSettings(resetSettings);
      await saveSettings(userId, resetSettings);

      // 4. Clear achievements
      setUnlockedAchievements({});
      await saveUnlockedAchievements(userId, {});
      
      setDeleteDataModalOpen(false);
      addNotification('Tutto lo storico e gli obiettivi sono stati cancellati.', 'success');
      
      // Notify hooks to refresh
      window.dispatchEvent(new CustomEvent('daily-check-updated'));
    } catch (err) {
      console.error("Error clearing all data:", err);
      addNotification("Errore durante la cancellazione totale.", "info");
    }
  };

  const handleDeleteCurrentMonth = async () => {
    const { start, end } = getCommercialMonthRange(new Date(), settings.commercialMonthStartDay);
    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];

    try {
      // 1. Clear database and local storage via unified service
      await deleteLogsInRange(userId, startDateStr, endDateStr);

      // 2. Update local state
      const newLogs = activityLogs.filter(log => log.date < startDateStr || log.date > endDateStr);
      setActivityLogs(newLogs);

      // 3. Handle persistent appointment reminder
      if (settings.nextAppointment) {
          const apptDate = new Date(settings.nextAppointment.date).toISOString().split('T')[0];
          if (apptDate >= startDateStr && apptDate <= endDateStr) {
              const updatedSettings = { ...settings, nextAppointment: undefined };
              setSettings(updatedSettings);
              // Atomic sync to cloud
              await saveSettings(userId, updatedSettings);
          }
      }

      setDeleteDataModalOpen(false);
      addNotification('Dati mese eliminati.', 'success');
      
      // Notify hooks to refresh
      window.dispatchEvent(new CustomEvent('daily-check-updated'));
    } catch (err) {
      console.error("Error deleting month data:", err);
      addNotification("Errore durante la cancellazione dei dati.", "info");
    }
  };

  const handleResetGoals = () => {
    setSettings((prev: AppSettings) => ({ ...prev, goals: { daily: {}, weekly: {}, monthly: {} } }));
    setResetGoalsModalOpen(false);
    addNotification('Obiettivi azzerati.', 'success');
    
    // Notify hooks to refresh
    window.dispatchEvent(new CustomEvent('daily-check-updated'));
  };

  const handleLoginSuccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setIsSyncing(true);
      try {
        // PULL & MERGE FIRST
        await loadLocalData();
        // THEN PUSH THE RESULT
        const result = await syncLocalDataToCloud(session.user.id);
        if (!result.success) {
          addNotification(`Sync Login: ${result.message}`, "info");
        }
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleManualSync = async () => {
    if (!userId) return;
    setIsSyncing(true);
    try {
      // PULL & MERGE FIRST
      await loadLocalData();
      // THEN PUSH THE RESULT
      const result = await syncLocalDataToCloud(userId);
      if (result.success) {
        addNotification("Sincronizzazione completata! ✅", "success");
      } else {
        addNotification(`Errore Sync: ${result.message} ⚠️`, "info");
      }
    } catch (e) {
      console.error("Manual sync error:", e);
      addNotification("Sincronizzazione fallita (errore irreversibile).", "info");
    } finally {
      setIsSyncing(false);
    }
  };

  const loadLocalData = useCallback(async () => {
    const [loadedLogs, loadedSettings, loadedAchievements, loadedProfile, loadedCareerDates] = await Promise.all([
      loadLogs(userId),
      loadSettings(userId),
      loadUnlockedAchievements(userId),
      loadUserProfile(userId),
      loadCareerDates(userId)
    ]);

    // DATA MIGRATION v1.2.94: Recalibrate counters based on leads (removes "ghost" counts)
    const migratedLogs = loadedLogs.map(log => {
        const newLog = { ...log, counts: { ...log.counts } };
        if (newLog.date && newLog.date.includes('T')) newLog.date = newLog.date.split('T')[0];
        
        if (newLog.leads) {
          const originalLeads = [...newLog.leads];
          newLog.leads = originalLeads.map(lead => {
              const cleanLead = { ...lead };
              if (cleanLead.date && cleanLead.date.includes('T')) cleanLead.date = cleanLead.date.split('T')[0];
              if (cleanLead.followUpDate && cleanLead.followUpDate.includes('T')) cleanLead.followUpDate = cleanLead.followUpDate.split('T')[0];
              // Abbiamo rimosso lo split su appointmentDate per preservare l'orario (T20:30)
              return cleanLead;
          });

          // We NO LONGER forcefully recalibrate counts downwards. 
          // The counts stored in the database are the source of truth for daily activity.
          // This allows "manual taps" and "cross-day funnel progression" to be preserved in the counts.
        }
        return newLog;
    });

          // RE-CALIBRATE COUNTERS (Source of Truth: Registered Leads)
          const calibratedLogs = migratedLogs.map(log => {
            const counts: { [key in ActivityType]?: number } = { ...log.counts };
            
            // Per questi tipi, usiamo SOLO i lead registrati come conteggio ufficiale
            // (a meno che non ci siano stati "tap" manuali, ma i lead sono più affidabili qui)
            let actualContactCount = 0;
            let actualAppointmentCount = 0;

            if (log.leads) {
              log.leads.forEach(lead => {
                const type = lead.type || ActivityType.CONTACTS;
                if (lead.status !== 'lost') {
                   if (type === ActivityType.CONTACTS) actualContactCount++;
                   if (type === ActivityType.APPOINTMENTS) actualAppointmentCount++;
                }
              });
            }

            // Usiamo i lead come *minimo garantito* per i contatori,
            // ma non scaliamo se il contatore è già superiore (indica lead trasformati in altro tipo)
            counts[ActivityType.CONTACTS] = Math.max(counts[ActivityType.CONTACTS] || 0, actualContactCount);
            counts[ActivityType.APPOINTMENTS] = Math.max(counts[ActivityType.APPOINTMENTS] || 0, actualAppointmentCount);

            return { ...log, counts };
          });

          setActivityLogs(calibratedLogs);
    let mergedSettings = { ...DEFAULT_SETTINGS, ...(loadedSettings || {}) };
    if (loadedProfile) mergedSettings.userProfile = { ...mergedSettings.userProfile, ...loadedProfile };
    if (loadedCareerDates && Object.keys(loadedCareerDates).length > 0) {
      mergedSettings.careerPathDates = { ...mergedSettings.careerPathDates, ...loadedCareerDates };
    }

    // AUTO-CLEAR Next Appointment se la data è passata rispetto a oggi
    if (mergedSettings.nextAppointment) {
      const todayStr = getTodayDateString();
      const apptDateStr = mergedSettings.nextAppointment.date.split('T')[0];
      if (apptDateStr < todayStr) {
        console.log(`[loadLocalData] Pulizia automatica Prossimo Appuntamento scaduto: ${mergedSettings.nextAppointment.title}`);
        delete mergedSettings.nextAppointment;
      }
    }

    setSettings(mergedSettings);
    setUnlockedAchievements(loadedAchievements);
    setIsInitializing(false);

    // Initial sync to cloud if logged in (safety net for migration)
    if (userId) {
      syncLocalDataToCloud(userId).catch(err => {
        console.error("Initial auto-sync failed:", err);
      });
    }
  }, [userId]);

  useEffect(() => { if (!authLoading) loadLocalData(); }, [loadLocalData, authLoading]);

  // --- AUTO-SYNC POLLING (v1.4) ---
  useEffect(() => {
    if (!userId || authLoading || isInitializing) return;

    const autoSyncInterval = setInterval(() => {
      // Sync only if window is focused and no active sync is running
      if (document.visibilityState === 'visible' && !isSyncing) {
        console.log("[AutoSync] Background poll starting...");
        loadLocalData().catch(err => console.error("[AutoSync] Error during background sync:", err));
      }
    }, 1000 * 60 * 3); // Every 3 minutes

    return () => clearInterval(autoSyncInterval);
  }, [userId, authLoading, isInitializing, isSyncing, loadLocalData]);

  useEffect(() => {
    if (!isInitializing && !authLoading) {
      saveSettings(userId, settings).catch(err => {
          console.error("[SettingsSync] Failed:", err);
          if (err.message?.includes('column "habit_stacks" does not exist')) {
              addNotification("Sync Fallito: Esegui la migrazione SQL per gli Habit Stack 🔔", "info");
          }
      });
    }
  }, [settings, isInitializing, authLoading, userId, addNotification]);

  useEffect(() => {
    if (!isInitializing && !authLoading) {
      saveLogs(userId, activityLogs).catch(err => console.error(err));
      // Removed redundant event dispatch to prevent potential re-render loops with parent
    }
  }, [activityLogs, isInitializing, authLoading, userId]);

  useEffect(() => {
    if (!isInitializing && !authLoading) {
      saveUnlockedAchievements(userId, unlockedAchievements).catch(err => console.error(err));
    }
  }, [unlockedAchievements, isInitializing, authLoading, userId]);

  // Consolidato in saveSettings - rimosso useEffect superfluo
  

  const checkAndNotify = useCallback((oldP: any, newP: any, goals: any, activity: any) => {
    if (settings.enableGoals === false) return;
    const activityLabel = effectiveCustomLabels[activity];
    (['daily', 'weekly', 'monthly'] as const).forEach(period => {
      const goal = goals[period]?.[activity];
      if (goal > 0 && newP[period] >= goal && oldP[period] < goal) {
        addNotification(`Obiettivo ${period} raggiunto per "${activityLabel}"!`, 'success');
      }
    });
  }, [addNotification, effectiveCustomLabels, settings.enableGoals]);

  const updateActivityLog = useCallback(async (updates: { activity: string, change: number, contractType?: ContractType }[], dateStr: string) => {
    let updatedLog: ActivityLog | null = null;
    let updatedAllLogs: ActivityLog[] | null = null;

    setActivityLogs(prevLogs => {
      const newLogs = [...prevLogs];
      const existingLogIndex = newLogs.findIndex(log => log.date === dateStr);

      let dateLog: ActivityLog;
      if (existingLogIndex >= 0) {
        // Create a deep copy of the log to avoid mutation
        dateLog = {
          ...newLogs[existingLogIndex],
          counts: { ...newLogs[existingLogIndex].counts },
          contractDetails: newLogs[existingLogIndex].contractDetails ? { ...newLogs[existingLogIndex].contractDetails } : undefined
        };
        newLogs[existingLogIndex] = dateLog;
      } else {
        dateLog = { date: dateStr, counts: {}, leads: [] };
        newLogs.push(dateLog);
      }

      updates.forEach(u => {
        // Regola Speciale: Se Azzeriamola Green -> Aggiunge anche un Family Utility
        if (u.activity === ActivityType.NEW_CONTRACTS && u.contractType === ContractType.GREEN) {
          const currentFU = dateLog.counts[ActivityType.NEW_FAMILY_UTILITY] || 0;
          dateLog.counts[ActivityType.NEW_FAMILY_UTILITY] = Math.max(0, currentFU + u.change);
        }

        // Aggiornamento principale
        const currentVal = dateLog.counts[u.activity] || 0;
        dateLog.counts[u.activity] = Math.max(0, currentVal + u.change);

        if (u.contractType) {
          if (!dateLog.contractDetails) dateLog.contractDetails = {};
          const currentDetail = dateLog.contractDetails[u.contractType] || 0;
          dateLog.contractDetails[u.contractType] = Math.max(0, currentDetail + u.change);
        }
      });

      const sortedLogs = newLogs.sort((a, b) => b.date.localeCompare(a.date));
      updatedLog = dateLog;
      updatedAllLogs = sortedLogs;

      // SALVATAGGIO IMMEDIATO
      if (updatedLog) {
        saveLogForDate(userId, updatedLog, sortedLogs)
          .catch(err => {
            console.error("Cloud save error:", err);
            const msg = err?.message || err?.details || "Errore sconosciuto";
            addNotification(`Sincronizzazione Fallita: ${msg} 🛡️`, "info");
          });
        window.dispatchEvent(new CustomEvent('daily-check-updated'));
      }

      return sortedLogs;
    });
  }, [userId]);

  const handleUpdateActivity = (activity: string, change: number, dateStr: string = getTodayDateString(), contractType?: ContractType) => {
    updateActivityLog([{ activity, change, contractType }], dateStr);
  };

  const handleContractSelection = (type: ContractType) => {
    const dateStr = format(selectedInputDate, 'yyyy-MM-dd');
    updateActivityLog([{ activity: ActivityType.NEW_CONTRACTS, change: 1, contractType: type }], dateStr);
    setIsContractSelectorModalOpen(false);
  };

  const handleUpdateTarget = (newAmount: number) => {
    setSettings(prev => ({ ...prev, visionBoard: { ...prev.visionBoard, targetAmount: newAmount, enabled: true } }));
    addNotification("Obiettivo aggiornato!", "success");
  };

  const handleUpdateDreamEarnings = (network: number) => {
    const currentMonth = (() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    })();
    setSettings(prev => ({
      ...prev,
      visionBoard: {
        ...prev.visionBoard,
        networkEarnings: network,
        earningsMonth: currentMonth,
        enabled: prev.visionBoard?.enabled ?? true,
        title: prev.visionBoard?.title ?? '',
        targetAmount: prev.visionBoard?.targetAmount ?? 0,
        imageData: prev.visionBoard?.imageData ?? null,
      }
    }));
  };

  const handleUpdateQualification = (newQualification: Qualification) => {
    setSettings(prev => ({ ...prev, userProfile: { ...prev.userProfile, currentQualification: newQualification } }));
    addNotification(`Qualifica aggiornata!`, 'success');
  };

  const handleResetCareerPath = async () => {
    console.log('[App] handleResetCareerPath triggered');
    
    try {
      // 1. Reset Milestone Dates (in Settings)
      setSettings(prev => ({ ...prev, careerPathDates: {} }));
      
      // 2. Reset Activity Logs (Critical for full career reset)
      setActivityLogs([]);
      await clearLogs(userId);
      
      // 3. Reset Manual Qualification and Smart Planning summary
      setSettings(prev => ({
        ...prev,
        userProfile: {
          ...prev.userProfile,
          currentQualification: null
        },
        careerPathDates: {}, // Re-ensure it's clear
        nextAppointment: undefined,
        acknowledgedDeadlines: {}
      }));
      
      addNotification("Tutti i traguardi e la cronologia attività sono stati azzerati! 🔄", "success");
      
      // Forza il refresh
      window.dispatchEvent(new CustomEvent('daily-check-updated'));
    } catch (err) {
      console.error("Errore durante l'azzeramento:", err);
      addNotification("Si è verificato un errore durante l'azzeramento dei dati.", "info");
    }
  };

  const handleResetManualQualification = () => {
    setSettings(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        currentQualification: null
      }
    }));
    addNotification("Qualifica manuale rimossa. Il sistema ora calcola la tua posizione dai dati reali. 📈", "success");
  };

  const COMMISSION_RATES = useMemo(() => ({
    [CommissionStatus.PRIVILEGIATO]: { [ContractType.GREEN]: 25, [ContractType.LIGHT]: 12.5 },
    [CommissionStatus.FAMILY_UTILITY]: { [ContractType.GREEN]: 50, [ContractType.LIGHT]: 25 }
  }), []);

  const { dailyEarnings, monthlyEarnings } = useMemo(() => {
    const selectedDateStr = format(selectedInputDate, 'yyyy-MM-dd');
    const { start, end } = getCommercialMonthRange(selectedInputDate, settings.commercialMonthStartDay);
    const userStatus = settings.userProfile.commissionStatus || CommissionStatus.PRIVILEGIATO;
    const rates = COMMISSION_RATES[userStatus];
    let dailyTotal = 0; let monthlyTotal = 0;
    activityLogs.forEach(log => {
      const logDate = new Date(log.date);
      const breakdown = log.contractDetails || {};
      const logEarnings = ((breakdown[ContractType.GREEN] || 0) * rates[ContractType.GREEN]) + ((breakdown[ContractType.LIGHT] || 0) * rates[ContractType.LIGHT]);
      if (log.date === selectedDateStr) dailyTotal += logEarnings;
      if (logDate >= start && logDate <= end) monthlyTotal += logEarnings;
    });
    return { dailyEarnings: dailyTotal, monthlyEarnings: monthlyTotal };
  }, [activityLogs, selectedInputDate, settings.commercialMonthStartDay, settings.userProfile.commissionStatus, COMMISSION_RATES]);

  const commercialMonthTotals = useMemo(() => {
    const range = getCommercialMonthRange(selectedInputDate, settings.commercialMonthStartDay);
    const totals: any = {};
    activityLogs.forEach(log => {
      const d = new Date(log.date);
      if (d >= range.start && d <= range.end) {
        Object.keys(log.counts).forEach(k => totals[k] = (totals[k] || 0) + log.counts[k as ActivityType]);
      }
    });
    return totals;
  }, [activityLogs, selectedInputDate, settings.commercialMonthStartDay]);

  const selectedDateLog = activityLogs.find(log => log.date === format(selectedInputDate, 'yyyy-MM-dd'));
  const careerStatus = useMemo(() => calculateCareerStatus(activityLogs, settings.userProfile.currentQualification, settings.careerPathDates || {}), [activityLogs, settings.userProfile.currentQualification, settings.careerPathDates]);
  
  // Re-inserito qui dopo che careerStatus è definito
  useEffect(() => {
    if (!authLoading && !isInitializing) {
      const careerDates = settings.careerPathDates || {};
      if (Object.keys(careerDates).length > 0) {
        try {
          const now = new Date();
          const todayStr = format(now, 'yyyy-MM-dd');
          
          for (const [stageName, dateStr] of Object.entries(careerDates)) {
            if (!dateStr) continue;
            
            const deadline = new Date(dateStr);
            const deadlineStr = format(deadline, 'yyyy-MM-dd');
            
            if (deadlineStr <= todayStr) {
               const stageIndex = CAREER_STAGES.findIndex(s => s.name === stageName);
               const currentQualIndex = CAREER_STAGES.findIndex(s => 
                 s.name.toLowerCase() === careerStatus.currentLevel.name.toLowerCase() ||
                 (careerStatus.currentLevel.qualificationValue && s.name.toLowerCase() === careerStatus.currentLevel.qualificationValue.toLowerCase())
               );

               if (stageIndex > currentQualIndex) {
                 const alreadyAck = settings.acknowledgedDeadlines?.[stageName] === dateStr;
                 if (!alreadyAck) {
                   setDeadlineAlert({ stageName, date: dateStr });
                   break;
                 }
               }
            }
          }
        } catch (e) { console.error(e); }
      }
    }
  }, [authLoading, isInitializing, settings.careerPathDates, settings.acknowledgedDeadlines, careerStatus.currentLevel.name, careerStatus.currentLevel.qualificationValue, CAREER_STAGES]);

  const streak = useMemo(() => calculateCurrentStreak(activityLogs), [activityLogs]);

  const nextFollowUp = useMemo(() => {
    const allLeads: Lead[] = [];
    activityLogs.forEach(log => {
      if (log.leads) allLeads.push(...log.leads);
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return allLeads
      .filter(l => l.status === 'pending' && l.followUpDate)
      .sort((a, b) => new Date(a.followUpDate!).getTime() - new Date(b.followUpDate!).getTime())[0] || null;
  }, [activityLogs]);


  // Swipe Handling Refs
  const touchStartXDaily = useRef<number | null>(null);
  const touchStartYDaily = useRef<number | null>(null);
  const touchStartTimeDaily = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (activeView !== 'today') return;
    const touch = e.touches[0];
    touchStartXDaily.current = touch.clientX;
    touchStartYDaily.current = touch.clientY;
    touchStartTimeDaily.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (activeView !== 'today' || touchStartXDaily.current === null || touchStartYDaily.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchStartXDaily.current - touchEndX;
    const diffY = touchStartYDaily.current - touchEndY;
    const duration = Date.now() - touchStartTimeDaily.current;

    if (Math.abs(diffX) > Math.abs(diffY) && duration < 350) {
      if (diffX > 75 && activeTab === 'inserimento') {
        setActiveTab('risultati');
      } else if (diffX < -75 && activeTab === 'risultati') {
        setActiveTab('inserimento');
      }
    }
    
    touchStartXDaily.current = null;
    touchStartYDaily.current = null;
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.4)] animate-pulse">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
        </div>
        <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">Caricamento...</p>
      </div>
    </div>
  );

  if (isPasswordRecovery) return (
    <ResetPasswordScreen onSuccess={() => { setIsPasswordRecovery(false); }} onClose={onClose} />
  );

  if (!user) return <LoginScreen onLoginSuccess={handleLoginSuccess} onClose={onClose} />;

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        {notifications.map(n => <NotificationItem key={n.id} notification={n} onClose={() => removeNotification(n.id)} />)}
      </div>

      <AppointmentsOverviewModal
        isOpen={isGlobalAppointmentsOpen}
        onClose={() => { setIsGlobalAppointmentsOpen(false); setGlobalAppointmentsFilterDate(null); }}
        onEdit={(lead) => handleOpenLeadCapture(lead.type || ActivityType.APPOINTMENTS, lead)}
        activityLogs={activityLogs}
        filterDate={globalAppointmentsFilterDate}
      />

      <div className="relative w-full h-full flex bg-slate-50 dark:bg-black overflow-hidden text-slate-900 dark:text-slate-100 transition-colors duration-500">
        <BackgroundMesh />
        {activeView !== 'focus' && (
          <FocusNavigation activeView={activeView} onViewChange={setActiveView} />
        )}

        <div className={`flex-1 flex flex-col h-full min-w-0 transition-all duration-500 relative ${activeView !== 'focus' ? 'lg:pl-20' : ''}`}>
          <main 
            id="main-scroll-container" 
            className="flex-1 relative overflow-y-auto overflow-x-hidden scroll-smooth no-scrollbar"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div id="top-anchor" className="absolute top-0 left-0 w-full h-[1px] pointer-events-none" />
            
            {activeView !== 'focus' && (
              <Header
                userProfile={settings.userProfile}
                onOpenSettings={() => handleOpenSettings()}
                onOpenDeleteDataModal={() => setDeleteDataModalOpen(true)}
                careerStatus={careerStatus}
                isPremium={true}
                remainingTrialDays={remainingTrialDays}
                onOpenPaywall={() => setIsPaywallModalOpen(true)}
                toggleTheme={globalToggleTheme}
                currentTheme={globalTheme as any}
                onOpenCareerPath={() => setActiveView('career')}
                isLoggedIn={!!user}
                onLogout={signOut}
                onCloseApp={onClose}
                onOpenMonthlyReport={() => setIsMonthlyReportModalOpen(true)}
                onOpenGuide={() => setIsGuideModalOpen(true)}
                streak={streak}
                onOpenTeamChallenge={() => setIsTeamModalOpen(true)}
                isSyncing={isSyncing}
                onSync={handleManualSync}
              />
            )}
            {(activeView === 'today' || activeView === 'stats') && (
              <div className="flex flex-col gap-4 max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 pt-6">
                {activeView === 'today' && !isFollowUpModalOpen && !isMonthlyReportModalOpen && !isGuideModalOpen && !isTeamModalOpen && !isTargetCalculatorModalOpen && !isVisionBoardModalOpen && !isCareerPathModalOpen && !isScriptLibraryOpen && !isSocialShareModalOpen && !isContractSelectorModalOpen && !isLeadCaptureModalOpen && !isCalendarModalOpen && !isVoiceModeOpen && !isResetGoalsModalOpen && (
                  <div className="flex justify-center mb-2 p-1.5 rounded-2xl mx-auto w-full max-w-md border-2 border-slate-200 dark:border-white/10 shadow-2xl relative z-30 bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl">
                    <button
                      onClick={() => setActiveTab('inserimento')}
                      className={`flex-1 py-4 text-base sm:text-lg font-black rounded-xl transition-all duration-300 ${activeTab === 'inserimento' ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      Inserimento
                    </button>
                    <button
                      onClick={() => setActiveTab('risultati')}
                      className={`flex-1 py-4 text-base sm:text-lg font-black rounded-xl transition-all duration-300 ${activeTab === 'risultati' ? 'bg-gradient-to-r from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/20' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                      Risultati
                    </button>
                  </div>
                )}
                <div className="relative z-10 flex flex-col items-start mb-2">
                  <h2 className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tighter mb-1">
                    {activeView === 'today' ? 'DASHBOARD' : 'STATISTICHE'}
                  </h2>
                  <p className="text-lg sm:text-xl font-medium text-slate-500 dark:text-slate-400">
                    Analisi per{' '}
                    {(settings.userProfile.firstName || settings.userProfile.lastName) && (
                      <span className="font-black text-slate-900 dark:text-white">
                        {[settings.userProfile.firstName, settings.userProfile.lastName].filter(Boolean).join(' ')}
                      </span>
                    )}
                  </p>
                  <div 
                    className="text-[13px] font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2 opacity-90 transition-colors duration-500"
                    style={{ color: careerStatus.currentLevel.color || 'var(--accent-main)' }}
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full animate-pulse shadow-lg" 
                      style={{ 
                        backgroundColor: careerStatus.currentLevel.color || 'var(--accent-main)',
                        boxShadow: `0 0 8px ${careerStatus.currentLevel.color || 'var(--accent-main)'}80` 
                      }} 
                    />
                    {careerStatus.currentLevel.name}
                  </div>
                </div>
              </div>
            )}

            <div className="relative z-10 w-full min-h-full">
              <AnimatePresence mode="wait">
                {activeView === 'today' && (
                  <motion.div key="today" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
                    className="flex flex-col gap-6 max-w-screen-2xl mx-auto py-6 lg:py-12 px-4 sm:px-8 lg:px-12 pb-32 md:pb-12"
                  >
                    <AnimatePresence mode="wait">
                        {activeTab === 'inserimento' ? (
                          <motion.div
                            key="inserimento"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="w-full"
                          >
                            <ActivityInput
                              activeTab="inserimento"
                              activityLogs={activityLogs}
                              todayCounts={selectedDateLog?.counts} currentLog={selectedDateLog} monthTotals={commercialMonthTotals}
                              onUpdateActivity={handleUpdateActivity}
                              onOpenObjectionHandler={() => setIsScriptLibraryOpen(true)} onOpenSocialShare={() => setIsSocialShareModalOpen(true)}
                              selectedDate={selectedInputDate} onDateChange={setSelectedInputDate} commercialMonthStartDay={settings.commercialMonthStartDay}
                              customLabels={effectiveCustomLabels} dailyEarnings={dailyEarnings} monthlyEarnings={monthlyEarnings}
                              onOpenContractModal={() => handleOpenLeadCapture(ActivityType.NEW_CONTRACTS, undefined, 'won', 'cliente')} onOpenAppointmentModal={() => handleOpenLeadCapture(ActivityType.APPOINTMENTS)}
                              onOpenSettings={handleOpenSettings} onUpdateTarget={handleUpdateTarget} onOpenVisionBoardSettings={() => setIsVisionBoardModalOpen(true)}
                              onOpenLeadCapture={handleOpenLeadCapture} onOpenCalendar={() => setIsCalendarModalOpen(true)}
                              onEditLead={(lead) => handleOpenLeadCapture(lead.type || ActivityType.CONTACTS, lead)}
                              onOpenVoiceMode={() => setIsVoiceModeOpen(true)} onOpenTargetCalculator={() => setIsTargetCalculatorModalOpen(true)}
                              onOpenTeamChallenge={() => setIsTeamModalOpen(true)} isHubMode={true}
                              careerStatus={careerStatus}
                              viewMode={viewMode} setViewMode={setViewMode}
                              goals={effectiveGoals}
                              onOpenClients={() => setIsClientsModalOpen(true)}
                              habitStacks={settings.habitStacks}
                              enableHabitStacking={settings.enableHabitStacking}
                              yesterdayScore={yesterdayScore}
                              dailyScore={dailyScore}
                              coachStreak={coachStreak}
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="risultati"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col gap-6 w-full"
                          >
                            <ResultsDashboard 
                              activityLogs={activityLogs}
                              goals={effectiveGoals}
                              userProfile={settings.userProfile}
                              careerStatus={careerStatus}
                              commercialMonthStartDay={settings.commercialMonthStartDay || 16}
                              customLabels={effectiveCustomLabels}
                              dailyEarnings={dailyEarnings}
                              dailyScore={dailyScore}
                              coachStreak={coachStreak}
                              yesterdayScore={yesterdayScore}
                              nextAppointment={settings.nextAppointment}
                              onClearNextAppointment={() => setSettings((prev: any) => ({ ...prev, nextAppointment: undefined }))}
                              nextFollowUp={nextFollowUp}
                              habitStacks={settings.habitStacks}
                              enableHabitStacking={settings.enableHabitStacking}
                              visionBoardData={settings.visionBoard}
                              commercialMonth={commercialMonth}
                              recoveryStats={recoveryStats}
                              statsLoading={statsLoading}
                              selectedDate={selectedInputDate}
                              viewMode={viewMode}
                              onDateChange={setSelectedInputDate}
                              setViewMode={setViewMode}
                              onOpenVisionBoardSettings={() => setIsVisionBoardModalOpen(true)}
                              onUpdateVisionBoardEarnings={(amount) => {
                                setSettings(prev => ({
                                  ...prev,
                                  visionBoard: {
                                    ...prev.visionBoard,
                                    networkEarnings: amount,
                                    earningsMonth: getMonthIdentifier(new Date())
                                  }
                                }));
                              }}
                              onOpenObjectionHandler={() => setIsScriptLibraryOpen(true)}
                              onOpenCalendar={() => setIsCalendarModalOpen(true)}
                              onOpenTargetCalculator={() => setIsTargetCalculatorModalOpen(true)}
                              onUpdateActivity={handleUpdateActivity}
                              onOpenLeadCapture={handleOpenLeadCapture}
                              onEditLead={(type, lead) => handleOpenLeadCapture(type, lead)}
                              onOpenAppointmentModal={(type) => handleOpenLeadCapture(ActivityType.APPOINTMENTS)}
                              onActivateFocus={(goal, target) => {
                                setRecoveryFocusGoal(goal);
                                setRecoveryFocusTarget(target);
                                setActiveView('focus');
                              }}
                              onOpenContractModal={() => setIsContractSelectorModalOpen(true)}
                              onOpenAchievements={() => setAchievementsModalOpen(true)}
                              onUpdateQualification={handleUpdateQualification}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                {activeView === 'stats' && (() => {
                  const now = new Date();
                  const identifier = getMonthIdentifier(now);
                  const logsToSum = activityLogs.filter(log => getMonthIdentifier(new Date(log.date)) === identifier);
                  
                  const totals = Object.values(ActivityType).reduce((acc, activity: ActivityType) => {
                    acc[activity] = logsToSum.reduce((sum, log) => sum + (log.counts[activity] || 0), 0);
                    return acc;
                  }, {} as Record<ActivityType, number>);

                  const { CONTACTS = 0, APPOINTMENTS = 0, NEW_CONTRACTS = 0 } = totals;
                  const conversionRates = {
                    contactToAppointmentRate: CONTACTS > 0 ? (APPOINTMENTS / CONTACTS) * 100 : 0,
                    appointmentToContractRate: APPOINTMENTS > 0 ? (NEW_CONTRACTS / APPOINTMENTS) * 100 : 0,
                    overallConversionRate: CONTACTS > 0 ? (NEW_CONTRACTS / CONTACTS) * 100 : 0,
                    totalContacts: CONTACTS,
                    totalAppointments: APPOINTMENTS,
                    totalContracts: NEW_CONTRACTS,
                  };

                  return (
                    <motion.div key="stats" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
                      className="max-w-7xl mx-auto py-12 px-4 lg:px-8 pb-32"
                    >
                      <div className="flex flex-col gap-12">
                        {/* Imbuto di Conversione */}
                        <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-8 lg:p-12 border border-white/10 shadow-3xl">
                          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-blue-500 rounded-full"></span>
                            IMBUTO DI CONVERSIONE (QUESTO MESE)
                          </h3>
                          <div className="overflow-hidden mb-12">
                            <ConversionFunnel data={totals} customLabels={effectiveCustomLabels} />
                          </div>

                          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-100 mb-8 flex items-center gap-2">
                            <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                            Analisi Dettagliata
                          </h3>
                          {conversionRates.totalContacts > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              <StatCard icon={<Activity className="w-8 h-8" />} title="Contatto → Appuntamento" value={`${conversionRates.contactToAppointmentRate.toFixed(1)}%`} description={`${conversionRates.totalAppointments} appuntamenti su ${conversionRates.totalContacts}`} colorClass="text-blue-500" />
                              <StatCard icon={<Users className="w-8 h-8" />} title="Appuntamento → Contratto" value={`${conversionRates.appointmentToContractRate.toFixed(1)}%`} description={`${conversionRates.totalContracts} su ${conversionRates.totalAppointments}`} colorClass="text-emerald-500" />
                              <StatCard icon={<TargetIcon className="w-8 h-8" />} title="Chiusura Globale" value={`${conversionRates.overallConversionRate.toFixed(1)}%`} description="Totale contratti su contatti" colorClass="text-violet-500" />
                            </div>
                          ) : (
                            <div className="p-10 text-center text-slate-400 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">Nessun dato sufficiente per le statistiche.</div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })()}

                {activeView === 'focus' && (
                  <motion.div key="focus" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1">
                    <FocusModeModal 
                      isOpen={true} 
                      onClose={() => setActiveView('today')}
                      initialGoalText={recoveryFocusGoal}
                      initialTargetContacts={recoveryFocusTarget}
                    />
                  </motion.div>
                )}

                {activeView === 'career' && (
                  <motion.div key="career" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="w-full h-full min-h-[80vh] pb-32"
                  >
                    <div className="h-full">
                      <CareerPathModal 
                        isOpen={true} 
                        isEmbedded={true} 
                        onClose={() => setActiveView('today')} 
                        userId={userId}
                        careerDates={settings.careerPathDates || {}}
                        onUpdateDates={handleUpdateCareerDates}
                        onResetAll={handleResetCareerPath}
                        manualQualification={settings.userProfile.currentQualification}
                        onResetQualification={handleResetManualQualification}
                        targetQualification={settings.userProfile.targetQualification}
                        onUpdateTarget={handleUpdateTargetQualification}
                        currentLevelName={careerStatus.currentLevel.name}
                      />
                      
                      {/* Footer aggiuntivo per coerenza con le richieste precedenti */}
                      <div className="mt-8 flex flex-col items-center gap-6 py-12 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl">
                        <img 
                          src="/union_logo_footer.jpg" 
                          alt="Union Energia" 
                          className="h-8 w-auto opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" 
                        />
                        <p className="text-slate-500 text-sm font-medium">My Sharing Simulator v1.4</p>
                        <button onClick={signOut} className="px-10 py-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl font-black uppercase tracking-widest transition-all">Sconnetti</button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeView === 'settings' && (
                  <motion.div key="settings" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
                    className="max-w-4xl mx-auto py-12 px-4 lg:px-8 pb-32"
                  >
                    <div className="bg-white dark:bg-slate-900/40 backdrop-blur-3xl border border-slate-200 dark:border-white/10 shadow-3xl rounded-[3rem] p-8 lg:p-12">
                      <div className="flex justify-between items-center mb-10">
                        <div>
                          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Profilo e Impostazioni</h2>
                          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">Gestisci i tuoi obiettivi e il tuo profilo</p>
                        </div>
                        <button onClick={() => setActiveView('today')} className="p-3 bg-slate-100 dark:bg-white/10 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                      
                      <div className="space-y-6">
                        <button onClick={() => handleOpenSettings('profile')} className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-slate-200/50 dark:border-white/5 group">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                              <UserCircleIcon size={28} />
                            </div>
                            <div className="text-left">
                              <p className="font-black text-slate-900 dark:text-white text-xl">Dati Personali</p>
                              <p className="text-sm font-medium text-slate-500">Nome e Qualifica attuale</p>
                            </div>
                          </div>
                          <ChevronRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button onClick={() => handleOpenSettings('goals')} className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-slate-200/50 dark:border-white/5 group">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform">
                              <TargetIcon size={28} />
                            </div>
                            <div className="text-left">
                              <p className="font-black text-slate-900 dark:text-white text-xl">Obiettivi Mensili</p>
                              <p className="text-sm font-medium text-slate-500">Imposta i tuoi target di produzione</p>
                            </div>
                          </div>
                          <ChevronRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button onClick={() => handleOpenSettings('labels')} className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-slate-200/50 dark:border-white/5 group">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                              <TagIcon size={28} />
                            </div>
                            <div className="text-left">
                              <p className="font-black text-slate-900 dark:text-white text-xl">Etichette Attività</p>
                              <p className="text-sm font-medium text-slate-500">Personalizza i nomi delle attività</p>
                            </div>
                          </div>
                          <ChevronRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button onClick={() => handleOpenSettings('stacking')} className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all border border-slate-200/50 dark:border-white/5 group">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
                              <Sparkles size={28} />
                            </div>
                            <div className="text-left">
                              <p className="font-black text-slate-900 dark:text-white text-xl">Habit Stacking</p>
                              <p className="text-sm font-medium text-slate-500">Collega abitudini ad azioni di vendita</p>
                            </div>
                          </div>
                          <ChevronRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button onClick={() => setDeleteDataModalOpen(true)} className="w-full flex items-center justify-between p-6 bg-red-500/5 dark:bg-red-500/5 rounded-3xl hover:bg-red-500/10 transition-all border border-red-500/10 group">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
                              <Trash2 size={28} />
                            </div>
                            <div className="text-left">
                              <p className="font-black text-red-600 dark:text-red-400 text-xl">Gestione Dati</p>
                              <p className="text-sm font-medium text-red-500/70">Cancella o resetta lo storico</p>
                            </div>
                          </div>
                          <ChevronRight className="text-red-400 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>

                      <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-col items-center gap-6">
                        <img 
                          src="/union_logo_footer.jpg" 
                          alt="Union Energia" 
                          className="h-10 w-auto opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all" 
                        />
                        <div className="text-center">
                          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">My Sharing Simulator</p>
                          <p className="text-slate-500 text-xs mt-1">Versione 1.4 • Protetto da crittografia SSL</p>
                        </div>
                        <button onClick={signOut} className="w-full max-w-xs py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-slate-900">Sconnetti</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          <button
            onClick={handleScrollToTop}
            className={`fixed bottom-24 right-6 sm:bottom-8 sm:right-8 z-[99999] flex items-center justify-center p-4 bg-[#1c1c1e] hover:bg-slate-800 text-white rounded-full shadow-2xl border-2 border-white/20 transition-all duration-300 ${showBackToTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
            style={{ position: 'fixed', right: '1.5rem', bottom: '6rem' }}
            aria-label="Salita Veloce"
          >
            <ArrowUp className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        currentSettings={settings}
        onSaveSettings={handleSaveSettings}
        initialTab={settingsInitialTab}
        addNotification={addNotification}
        onLogout={signOut}
      />
      <WeeklyReportModal isOpen={isWeeklyReportOpen} onClose={() => setIsWeeklyReportOpen(false)} activityLogs={activityLogs} goals={settings.goals} habitStacks={settings.habitStacks || []} userProfile={settings.userProfile} />
      <DeleteDataModal
        isOpen={isDeleteDataModalOpen}
        onClose={() => setDeleteDataModalOpen(false)}
        onConfirmDeleteMonth={handleDeleteCurrentMonth}
        onConfirmDeleteAll={handleClearAllData}
      />
      <ResetGoalsModal
        isOpen={isResetGoalsModalOpen}
        onClose={() => setResetGoalsModalOpen(false)}
        onConfirm={handleResetGoals}
      />
      <AchievementsModal isOpen={isAchievementsModalOpen} onClose={() => setAchievementsModalOpen(false)} unlockedAchievements={unlockedAchievements} careerDates={settings.careerPathDates} />
      <MonthlyReportModal isOpen={isMonthlyReportModalOpen} onClose={() => setIsMonthlyReportModalOpen(false)} activityLogs={activityLogs} commercialMonthStartDay={settings.commercialMonthStartDay} userProfile={settings.userProfile} customLabels={effectiveCustomLabels} />
      <ContractSelectorModal isOpen={isContractSelectorModalOpen} onClose={() => setIsContractSelectorModalOpen(false)} onSelectContract={handleContractSelection} userStatus={settings.userProfile.commissionStatus} />
      <VisionBoardModal
        isOpen={isVisionBoardModalOpen}
        onClose={() => setIsVisionBoardModalOpen(false)}
        onSave={handleSaveVisionBoard}
        currentData={settings.visionBoard}
        addNotification={addNotification}
      />
      <TargetCalculatorModal isOpen={isTargetCalculatorModalOpen} onClose={() => setIsTargetCalculatorModalOpen(false)} currentEarnings={monthlyEarnings} commercialMonthStartDay={settings.commercialMonthStartDay} userStatus={settings.userProfile.commissionStatus} />
      
      <CareerDeadlineAlertModal 
        isOpen={!!deadlineAlert}
        stageName={deadlineAlert?.stageName || ''}
        onAchieved={handleDeadlineAchieved}
        onPostpone={handleDeadlinePostpone}
        onClose={() => setDeadlineAlert(null)}
      />
      <DetailedGuideModal isOpen={isGuideModalOpen} onClose={() => setIsGuideModalOpen(false)} />
      <TeamLeaderboardModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} activityLogs={activityLogs} userName={`${settings.userProfile.firstName} ${settings.userProfile.lastName}`} commercialStartDay={settings.commercialMonthStartDay} />
      <ScriptLibrary isOpen={isScriptLibraryOpen} onClose={() => setIsScriptLibraryOpen(false)} />
      <VoiceSpeedMode isOpen={isVoiceModeOpen} onClose={() => setIsVoiceModeOpen(false)} onUpdateActivity={(activity, count) => handleUpdateActivity(activity, count)} />
      <SocialShareModal isOpen={isSocialShareModalOpen} onClose={() => setIsSocialShareModalOpen(false)} todayCounts={selectedDateLog?.counts || {}} userProfile={settings.userProfile} customLabels={effectiveCustomLabels} />
      <LeadCaptureModal 
        isOpen={isLeadCaptureModalOpen} 
        onClose={() => { 
          setIsLeadCaptureModalOpen(false); 
          setEditingLead(null); 
          setCaptureForceStatus(undefined);
          setCaptureForceForceWonType(undefined);
        }} 
        activityType={leadCaptureType} 
        onSave={handleSaveLead} 
        initialData={editingLead} 
        forceStatus={captureForceStatus}
        forceWonType={captureForceWonType}
      />
      <CalendarModal isOpen={isCalendarModalOpen} onClose={() => setIsCalendarModalOpen(false)} selectedDate={selectedInputDate} onSelectDate={setSelectedInputDate} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
      <GoalReminderModal
        isOpen={isReminderModalOpen}
        type={reminderType}
        onClose={() => setIsReminderModalOpen(false)}
        onGoToInput={() => {
          setIsReminderModalOpen(false);
          setActiveTab('inserimento');
        }}
        dailyTarget={settings.goals.daily[ActivityType.CONTACTS] || 0}
        weeklyTarget={settings.goals.weekly[ActivityType.CONTACTS] || 0}
        isSaturday={new Date().getDay() === 6}
      />
      <ClientsModal 
        isOpen={isClientsModalOpen} 
        onClose={() => setIsClientsModalOpen(false)} 
      />
      
      <HabitReminderModal
        isOpen={!!activeReminderStack}
        stack={activeReminderStack}
        customLabels={effectiveCustomLabels}
        currentCount={activeReminderStack ? (
          activityLogs.find(l => l.date === getTodayDateString())?.counts[
            activeReminderStack.action === 'CUSTOM' ? activeReminderStack.id : activeReminderStack.action
          ] || 0
        ) : 0}
        onComplete={handleHabitComplete}
        onSnooze={handleHabitSnooze}
        onClose={() => setActiveReminderStack(null)}
      />
    </>
  );
};

const App: React.FC<{ onClose?: () => void; initialView?: string }> = ({ onClose, initialView }) => (
  <AuthProvider><AppContent onClose={onClose} initialView={initialView} /></AuthProvider>
);

export default App;
