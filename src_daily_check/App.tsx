import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ActivityLog, ActivityType, AppSettings, Notification, NotificationVariant, UnlockedAchievements, Achievement, Theme, CommissionStatus, ContractType, VisionBoardData, NextAppointment, Qualification } from './types';
import { loadLogs, saveLogs, saveLogForDate, loadSettings, saveSettings, loadUnlockedAchievements, saveUnlockedAchievements, clearLogs, syncLocalDataToCloud, loadUserProfile } from './services/storageService';
import { getTodayDateString, calculateProgressForActivity, getCommercialMonthRange } from './utils/dateUtils';
import Header from './components/Header';
import ActivityInput from './components/ActivityInput';
import Dashboard from './components/Dashboard';
import SettingsModal from './components/SettingsModal';
import DeleteDataModal from './components/ConfirmationModal';
import CareerStatus from './components/CareerStatus';
import { ACTIVITY_LABELS } from './constants';
import { calculateCareerStatus } from './utils/careerUtils';
import { calculateCurrentStreak } from './utils/gamificationUtils';
import { checkAndUnlockAchievements } from './utils/achievements';
import ResetGoalsModal from './components/ResetGoalsModal';
import PaywallModal from './components/PaywallModal';
import AchievementsModal from './components/AchievementsModal';
import PowerMode from './components/PowerMode';
import ObjectionHandler from './components/ObjectionHandler';
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

import VoiceSpeedMode from './components/VoiceSpeedMode';
import TeamLeaderboardModal from './components/TeamLeaderboardModal';
import CareerPathModal from './components/CareerPathModal';
import { FocusNavigation, ActiveView } from './components/FocusNavigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  UserCircle as UserCircleIcon,
  Target as TargetIcon,
  Tag as TagIcon,
  Eye as EyeIcon
} from 'lucide-react';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthModal from './components/AuthModal';
import { supabase } from './supabaseClient';
import { useTheme } from '../contexts/ThemeContext';

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
  enableCustomLabels: true
};

const NotificationItem: React.FC<{ notification: Notification; onClose: () => void }> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const typeStyles = {
    success: { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-100', icon: <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" /></svg> },
    info: { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-100', icon: <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" /></svg> }
  };
  const styles = typeStyles[notification.type];
  return (
    <div className={`w-full max-w-xs p-3 mb-2 rounded-2xl shadow-xl animate-scale-up backdrop-blur-md border ${styles.bg} ${styles.text}`} role="alert">
      <div className="flex items-center gap-3">
        <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-xl bg-white/20`}>{styles.icon}</div>
        <div className="text-sm font-bold">{notification.message}</div>
        <button type="button" onClick={onClose} className="ms-auto -mx-1 -my-1 text-current opacity-70 hover:opacity-100 rounded-lg p-1.5 inline-flex items-center justify-center h-6 w-6" aria-label="Close"><svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" /></svg></button>
      </div>
    </div>
  );
};

interface AppContentProps {
  onClose?: () => void;
}

const AppContent: React.FC<AppContentProps> = ({ onClose }) => {
  const { user, signOut, loading: authLoading, isPasswordRecovery, setIsPasswordRecovery } = useAuth();
  const { theme: globalTheme, toggleTheme: globalToggleTheme } = useTheme();

  const userId = user?.id || null;

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isInitializing, setIsInitializing] = useState(true);
  const [unlockedAchievements, setUnlockedAchievements] = useState<UnlockedAchievements>({});
  const [activeView, setActiveView] = useState<ActiveView>('today');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedInputDate, setSelectedInputDate] = useState<Date>(new Date());

  const addNotification = useCallback((message: string, type: NotificationVariant) => {
    setNotifications(prev => [...prev, { id: Date.now(), message, type }]);
  }, []);

  const CAREER_STAGES = useMemo(() => [
    { name: "Family pro", color: "#d21183" },
    { name: "Family pro 3x3", color: "#815545" },
    { name: "Family 3s", color: "#8000ff" },
    { name: "Family 5s", color: "#1147e6" },
    { name: "Top family", color: "#00c3eb" },
    { name: "Pro manager", color: "#54cdb4" },
    { name: "Regional manager", color: "#00b21a" },
    { name: "National manager", color: "#8fff33" },
    { name: "Director", color: "#e6e600" },
    { name: "Director pro", color: "#c88536" },
    { name: "Ambassador", color: "#b3b3b3" },
    { name: "President", color: "#c8b335" }
  ], []);

  useEffect(() => {
    if (!authLoading && !isInitializing) {
      const saved = localStorage.getItem('dailyCheck_careerPathDates');
      if (saved) {
        try {
          const dates = JSON.parse(saved);
          let currentLevelIndex = -1;
          for (let i = CAREER_STAGES.length - 1; i >= 0; i--) {
            if (dates[CAREER_STAGES[i].name]) {
              currentLevelIndex = i;
              break;
            }
          }
          const nextLevelIndex = currentLevelIndex + 1;
          if (nextLevelIndex < CAREER_STAGES.length) {
            const nextLevelName = CAREER_STAGES[nextLevelIndex].name;
            const nextLevelDateStr = dates[nextLevelName];
            if (nextLevelDateStr) {
              const deadline = new Date(nextLevelDateStr);
              deadline.setHours(23, 59, 59, 999);
              const now = new Date();
              const diffTime = deadline.getTime() - now.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays > 0 && diffDays <= 7) {
                setTimeout(() => addNotification(`Mancano solo ${diffDays} giorni al tuo obiettivo: ${nextLevelName}! 🔥`, 'info'), 2000);
              } else if (diffDays === 0) {
                setTimeout(() => addNotification(`Oggi è il giorno! Obiettivo ${nextLevelName} in scadenza! 🚀`, 'info'), 2000);
              } else if (diffDays < 0) {
                setTimeout(() => addNotification(`La data per ${nextLevelName} è passata. Aggiorna il tuo percorso carriera! 📅`, 'info'), 2000);
              }
            }
          }
        } catch (e) { console.error(e); }
      }
    }
  }, [authLoading, isInitializing, CAREER_STAGES, addNotification]);

  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'profile' | 'goals' | 'labels' | 'notifications'>('profile');
  const [isDeleteDataModalOpen, setDeleteDataModalOpen] = useState(false);
  const [isPaywallModalOpen, setIsPaywallModalOpen] = useState(false);
  const [isAchievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const [isMonthlyReportModalOpen, setIsMonthlyReportModalOpen] = useState(false);
  const [isVisionBoardModalOpen, setIsVisionBoardModalOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [isTargetCalculatorModalOpen, setIsTargetCalculatorModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCareerPathModalOpen, setIsCareerPathModalOpen] = useState(false);
  const [isPowerModeOpen, setIsPowerModeOpen] = useState(false);
  const [isObjectionHandlerOpen, setIsObjectionHandlerOpen] = useState(false);
  const [isSocialShareModalOpen, setIsSocialShareModalOpen] = useState(false);
  const [isContractSelectorModalOpen, setIsContractSelectorModalOpen] = useState(false);
  const [isLeadCaptureModalOpen, setIsLeadCaptureModalOpen] = useState(false);
  const [leadCaptureType, setLeadCaptureType] = useState<ActivityType>(ActivityType.CONTACTS);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [isResetGoalsModalOpen, setResetGoalsModalOpen] = useState(false);
  const [remainingTrialDays] = useState<number | null>(null);

  const effectiveCustomLabels = (settings.enableCustomLabels ?? true) ? (settings.customLabels || ACTIVITY_LABELS) : ACTIVITY_LABELS;
  const effectiveGoals = (settings.enableGoals ?? true) ? settings.goals : { daily: {}, weekly: {}, monthly: {} };

  const removeNotification = useCallback((id: number) => setNotifications(prev => prev.filter(n => n.id !== id)), []);

  const handleOpenSettings = (tab: 'profile' | 'goals' | 'labels' | 'notifications' = 'profile') => {
    setSettingsInitialTab(tab);
    setSettingsModalOpen(true);
  };

  const handleOpenLeadCapture = (type: ActivityType) => {
    setLeadCaptureType(type);
    setIsLeadCaptureModalOpen(true);
  };

  const handleSaveLead = (leadData: { name: string; phone: string; note: string }) => {
    const dateStr = selectedInputDate.toISOString().split('T')[0];
    let updatedLog: ActivityLog | null = null;
    let updatedAllLogs: ActivityLog[] | null = null;

    setActivityLogs(prevLogs => {
      const newLogs = [...prevLogs];
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

      dateLog.leads!.push({
        id: Date.now().toString(),
        type: leadCaptureType,
        date: new Date().toISOString(),
        status: 'pending' as const,
        ...leadData
      });

      const currentCount = dateLog.counts[leadCaptureType] || 0;
      dateLog.counts[leadCaptureType] = currentCount + 1;

      const sortedLogs = newLogs.sort((a, b) => b.date.localeCompare(a.date));
      updatedLog = dateLog;
      updatedAllLogs = sortedLogs;
      return sortedLogs;
    });

    if (updatedLog) {
      saveLogForDate(userId, updatedLog, updatedAllLogs || undefined);
    }
    setIsLeadCaptureModalOpen(false);
    addNotification(`${leadCaptureType === ActivityType.APPOINTMENTS ? 'Appuntamento' : 'Contatto'} salvato!`, 'success');
  };

  const handleSaveSettings = (newSettings: AppSettings) => setSettings(newSettings);
  const handleSaveVisionBoard = (visionData: VisionBoardData) => setSettings((prev: AppSettings) => ({ ...prev, visionBoard: visionData }));
  const handleAppointmentSchedule = (appointment: NextAppointment) => {
    setSettings((prev: AppSettings) => ({ ...prev, nextAppointment: appointment }));
    addNotification("Appuntamento salvato!", "success");
  };

  const handleClearAllData = async () => {
    await clearLogs(userId);
    setActivityLogs([]);
    setDeleteDataModalOpen(false);
    addNotification('Storico cancellato.', 'success');
  };

  const handleDeleteCurrentMonth = () => {
    const { start, end } = getCommercialMonthRange(new Date(), settings.commercialMonthStartDay);
    setActivityLogs(prevLogs => {
      const newLogs = prevLogs.filter(log => {
        const logTime = new Date(log.date).getTime();
        return logTime < start.getTime() || logTime > end.getTime();
      });
      // Corrected: call save outside later if needed, but here we just clear cloud for that user or update
      // Actually,saveLogs is fine here as we are replacing the WHOLE set
      saveLogs(userId, newLogs);
      return newLogs;
    });
    setDeleteDataModalOpen(false);
    addNotification('Dati mese eliminati.', 'success');
  };

  const handleResetGoals = () => {
    setSettings((prev: AppSettings) => ({ ...prev, goals: { daily: {}, weekly: {}, monthly: {} } }));
    setResetGoalsModalOpen(false);
    addNotification('Obiettivi azzerati.', 'success');
  };

  const handleLoginSuccess = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await syncLocalDataToCloud(session.user.id);
      loadLocalData();
    }
  };

  const loadLocalData = useCallback(async () => {
    const [loadedLogs, loadedSettings, loadedAchievements, loadedProfile] = await Promise.all([
      loadLogs(userId),
      loadSettings(userId),
      loadUnlockedAchievements(userId),
      loadUserProfile(userId)
    ]);
    setActivityLogs(loadedLogs);
    let mergedSettings = { ...DEFAULT_SETTINGS, ...(loadedSettings || {}) };
    if (loadedProfile) mergedSettings.userProfile = { ...mergedSettings.userProfile, ...loadedProfile };
    setSettings(mergedSettings);
    setUnlockedAchievements(loadedAchievements);
    setIsInitializing(false);
  }, [userId]);

  useEffect(() => { if (!authLoading) loadLocalData(); }, [loadLocalData, authLoading]);

  useEffect(() => {
    if (!isInitializing && !authLoading) saveSettings(userId, settings);
  }, [settings, isInitializing, authLoading, userId]);

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

  const updateActivityLog = useCallback(async (updates: { activity: ActivityType, change: number, contractType?: ContractType }[], dateStr: string) => {
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
        dateLog.counts[u.activity] = Math.max(0, (dateLog.counts[u.activity] || 0) + u.change);

        if (u.contractType) {
          if (!dateLog.contractDetails) dateLog.contractDetails = {};
          dateLog.contractDetails[u.contractType] = Math.max(0, (dateLog.contractDetails[u.contractType] || 0) + u.change);
        } else if (u.activity === ActivityType.NEW_CONTRACTS && u.change < 0) {
          if (dateLog.contractDetails) {
            if ((dateLog.contractDetails[ContractType.LIGHT] || 0) > 0) {
              dateLog.contractDetails[ContractType.LIGHT] = Math.max(0, dateLog.contractDetails[ContractType.LIGHT]! - 1);
            } else if ((dateLog.contractDetails[ContractType.GREEN] || 0) > 0) {
              dateLog.contractDetails[ContractType.GREEN] = Math.max(0, dateLog.contractDetails[ContractType.GREEN]! - 1);
            }
          }
        }
      });

      const sortedLogs = newLogs.sort((a, b) => b.date.localeCompare(a.date));
      updatedLog = dateLog;
      updatedAllLogs = sortedLogs;
      return sortedLogs;
    });

    // Execute side effect OUTSIDE state updater
    // Use a small delay or trust synchronously captured values (React's updater runs synchronously here)
    if (updatedLog) {
      saveLogForDate(userId, updatedLog, updatedAllLogs || undefined);
    }
  }, [userId]);

  const handleUpdateActivity = (activity: ActivityType, change: number, dateStr: string = getTodayDateString(), contractType?: ContractType) => {
    updateActivityLog([{ activity, change, contractType }], dateStr);
  };

  const handleContractSelection = (type: ContractType) => {
    updateActivityLog([{ activity: ActivityType.NEW_CONTRACTS, change: 1, contractType: type }], getTodayDateString());
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

  const COMMISSION_RATES = useMemo(() => ({
    [CommissionStatus.PRIVILEGIATO]: { [ContractType.GREEN]: 25, [ContractType.LIGHT]: 12.5 },
    [CommissionStatus.FAMILY_UTILITY]: { [ContractType.GREEN]: 50, [ContractType.LIGHT]: 25 }
  }), []);

  const { dailyEarnings, monthlyEarnings } = useMemo(() => {
    const selectedDateStr = selectedInputDate.toISOString().split('T')[0];
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

  const selectedDateLog = activityLogs.find(log => log.date === selectedInputDate.toISOString().split('T')[0]);
  const careerStatus = useMemo(() => calculateCareerStatus(activityLogs, settings.userProfile.currentQualification), [activityLogs, settings.userProfile.currentQualification]);
  const streak = useMemo(() => calculateCurrentStreak(activityLogs), [activityLogs]);

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

  if (!user) return <LoginScreen onLoginSuccess={handleLoginSuccess} onClose={onClose} />;

  if (isPasswordRecovery) return (
    <ResetPasswordScreen onSuccess={() => { setIsPasswordRecovery(false); }} onClose={onClose} />
  );

  return (
    <>
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 items-end pointer-events-none">
        {notifications.map(n => <NotificationItem key={n.id} notification={n} onClose={() => removeNotification(n.id)} />)}
      </div>

      <div className="flex h-screen bg-slate-950 overflow-hidden text-slate-100">
        <FocusNavigation activeView={activeView} onViewChange={setActiveView} />

        <div className="flex-1 flex flex-col min-w-0 transition-all duration-500 lg:pl-20">
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
            onOpenMonthlyReport={() => setIsMonthlyReportModalOpen(true)}
            onOpenGuide={() => setIsGuideModalOpen(true)}
            streak={streak}
            onOpenTeamChallenge={() => setIsTeamModalOpen(true)}
            onOpenCareerPath={() => setActiveView('career')}
            isLoggedIn={!!user}
            onLogout={signOut}
            onCloseApp={activeView === 'settings' ? () => setActiveView('today') : onClose}
          />

          <main id="main-scroll-container" className="flex-1 relative overflow-y-auto overflow-x-hidden scroll-smooth">
            {/* Animated Background Mesh */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow"></div>
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse-slow animation-delay-2000"></div>
            </div>

            <div className="relative z-10 w-full min-h-full">
              <AnimatePresence mode="wait">
                {activeView === 'today' && (
                  <motion.div key="today" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
                    className="flex flex-col gap-12 max-w-screen-2xl mx-auto py-12 lg:py-20 px-4 sm:px-8 lg:px-12"
                  >
                    <Dashboard activityLogs={activityLogs} goals={settings.goals} userProfile={settings.userProfile}
                      onOpenAchievements={() => setAchievementsModalOpen(true)} commercialMonthStartDay={settings.commercialMonthStartDay}
                      customLabels={effectiveCustomLabels} onUpdateQualification={handleUpdateQualification}
                      compactView={true} initialTab="overview"
                    />
                    {settings.visionBoard?.enabled && settings.visionBoard?.targetAmount > 0 && (
                      <DreamTrackerWidget
                        visionBoardData={settings.visionBoard}
                        autoPersonalEarnings={monthlyEarnings}
                        onUpdateEarnings={handleUpdateDreamEarnings}
                        onOpenVisionBoard={() => setIsVisionBoardModalOpen(true)}
                      />
                    )}
                    <ActivityInput
                      activityLogs={activityLogs}
                      todayCounts={selectedDateLog?.counts} currentLog={selectedDateLog} monthTotals={commercialMonthTotals}
                      onUpdateActivity={handleUpdateActivity} onOpenPowerMode={() => setIsPowerModeOpen(true)}
                      onOpenObjectionHandler={() => setIsObjectionHandlerOpen(true)} onOpenSocialShare={() => setIsSocialShareModalOpen(true)}
                      selectedDate={selectedInputDate} onDateChange={setSelectedInputDate} commercialMonthStartDay={settings.commercialMonthStartDay}
                      customLabels={effectiveCustomLabels} dailyEarnings={dailyEarnings} monthlyEarnings={monthlyEarnings}
                      onOpenContractModal={() => setIsContractSelectorModalOpen(true)} onOpenAppointmentModal={() => handleOpenLeadCapture(ActivityType.APPOINTMENTS)}
                      onOpenSettings={handleOpenSettings} onUpdateTarget={handleUpdateTarget} onOpenVisionBoardSettings={() => setIsVisionBoardModalOpen(true)}
                      onOpenLeadCapture={handleOpenLeadCapture} onOpenCalendar={() => setIsCalendarModalOpen(true)}
                      onOpenVoiceMode={() => setIsVoiceModeOpen(true)} onOpenTargetCalculator={() => setIsTargetCalculatorModalOpen(true)}
                      onOpenTeamChallenge={() => setIsTeamModalOpen(true)} isHubMode={true}
                      careerStatus={careerStatus}
                    />
                  </motion.div>
                )}

                {activeView === 'stats' && (
                  <motion.div key="stats" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}
                    className="max-w-7xl mx-auto py-12 px-4 lg:px-8"
                  >
                    <div className="bg-white/5 backdrop-blur-2xl rounded-[3rem] p-8 lg:p-16 border border-white/10 shadow-3xl">
                      <Dashboard activityLogs={activityLogs} goals={settings.goals} userProfile={settings.userProfile}
                        onOpenAchievements={() => setAchievementsModalOpen(true)} commercialMonthStartDay={settings.commercialMonthStartDay}
                        customLabels={effectiveCustomLabels} onUpdateQualification={handleUpdateQualification}
                        initialTab="stats"
                      />
                    </div>
                  </motion.div>
                )}

                {activeView === 'career' && (
                  <motion.div key="career" initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -100 }}
                    className="h-full flex flex-col items-center justify-center p-4 lg:p-12"
                  >
                    <div className="w-full max-w-4xl h-[85vh]">
                      <CareerPathModal isOpen={true} onClose={() => setActiveView('today')} isEmbedded={true} />
                    </div>
                  </motion.div>
                )}

                {activeView === 'settings' && (
                  <motion.div key="settings" initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
                    className="max-w-4xl mx-auto py-12 px-6 lg:px-12"
                  >
                    <div className="bg-white/5 backdrop-blur-3xl rounded-[3.5rem] p-10 lg:p-20 border border-white/10 shadow-3xl">
                      <h2 className="text-5xl font-black text-white mb-12 tracking-tight">Impostazioni</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button onClick={() => handleOpenSettings('profile')} className="group p-8 bg-white/5 hover:bg-white/10 rounded-[2.5rem] border border-white/5 transition-all flex flex-col gap-4 text-left">
                          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><UserCircleIcon className="w-10 h-10" /></div>
                          <div><h3 className="text-2xl font-bold text-white">Profilo</h3><p className="text-slate-400">Personalizza il tuo nome e ruolo.</p></div>
                        </button>
                        <button onClick={() => handleOpenSettings('goals')} className="group p-8 bg-white/5 hover:bg-white/10 rounded-[2.5rem] border border-white/5 transition-all flex flex-col gap-4 text-left">
                          <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><TargetIcon className="w-10 h-10" /></div>
                          <div><h3 className="text-2xl font-bold text-white">Obiettivi</h3><p className="text-slate-400">Imposta i tuoi target giornalieri.</p></div>
                        </button>
                        <button onClick={() => handleOpenSettings('labels')} className="group p-8 bg-white/5 hover:bg-white/10 rounded-[2.5rem] border border-white/5 transition-all flex flex-col gap-4 text-left">
                          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><TagIcon className="w-10 h-10" /></div>
                          <div><h3 className="text-2xl font-bold text-white">Etichette</h3><p className="text-slate-400">Personalizza i nomi delle attività.</p></div>
                        </button>
                        <button onClick={() => setIsVisionBoardModalOpen(true)} className="group p-8 bg-white/5 hover:bg-white/10 rounded-[2.5rem] border border-white/5 transition-all flex flex-col gap-4 text-left">
                          <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><EyeIcon className="w-10 h-10" /></div>
                          <div><h3 className="text-2xl font-bold text-white">Vision Board</h3><p className="text-slate-400">I tuoi sogni e premi personali.</p></div>
                        </button>
                      </div>
                      <div className="mt-16 pt-12 border-t border-white/5 flex justify-between items-center text-slate-500 font-bold">
                        <p>My Sharing Simulator v2.1.0</p>
                        <button onClick={signOut} className="px-8 py-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all">Sconnetti</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
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
      <AchievementsModal isOpen={isAchievementsModalOpen} onClose={() => setAchievementsModalOpen(false)} unlockedAchievements={unlockedAchievements} />
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
      <DetailedGuideModal isOpen={isGuideModalOpen} onClose={() => setIsGuideModalOpen(false)} />
      <TeamLeaderboardModal isOpen={isTeamModalOpen} onClose={() => setIsTeamModalOpen(false)} activityLogs={activityLogs} userName={`${settings.userProfile.firstName} ${settings.userProfile.lastName}`} commercialStartDay={settings.commercialMonthStartDay} />
      <PowerMode isOpen={isPowerModeOpen} onClose={() => setIsPowerModeOpen(false)} onLogContact={() => handleUpdateActivity(ActivityType.CONTACTS, 1)} />
      <ObjectionHandler isOpen={isObjectionHandlerOpen} onClose={() => setIsObjectionHandlerOpen(false)} />
      <VoiceSpeedMode isOpen={isVoiceModeOpen} onClose={() => setIsVoiceModeOpen(false)} onUpdateActivity={(activity, count) => handleUpdateActivity(activity, count)} />
      <SocialShareModal isOpen={isSocialShareModalOpen} onClose={() => setIsSocialShareModalOpen(false)} todayCounts={selectedDateLog?.counts || {}} userProfile={settings.userProfile} customLabels={effectiveCustomLabels} />
      <LeadCaptureModal isOpen={isLeadCaptureModalOpen} onClose={() => setIsLeadCaptureModalOpen(false)} activityType={leadCaptureType} onSave={handleSaveLead} />
      <CalendarModal isOpen={isCalendarModalOpen} onClose={() => setIsCalendarModalOpen(false)} selectedDate={selectedInputDate} onSelectDate={setSelectedInputDate} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onLoginSuccess={handleLoginSuccess} />
    </>
  );
};

const App: React.FC<{ onClose?: () => void }> = ({ onClose }) => (
  <AuthProvider><AppContent onClose={onClose} /></AuthProvider>
);

export default App;