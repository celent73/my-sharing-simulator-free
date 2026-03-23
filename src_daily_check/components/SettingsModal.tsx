import React, { useState, useEffect, useRef } from 'react';
import { AppSettings, ActivityType, NotificationVariant, CommissionStatus, Goals, Qualification } from '../types';
import { ACTIVITY_LABELS, SETTINGS_ACTIVITY_LABELS, ACTIVITY_COLORS, activityIcons } from '../constants';
import { getBackupData, restoreBackupData } from '../services/storageService';
import GoalsShareModal from './GoalsShareModal';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaveSettings: (settings: AppSettings) => void;
    currentSettings: AppSettings;
    addNotification: (message: string, type: NotificationVariant) => void;
    onDataRestore?: () => void;
    initialTab?: 'profile' | 'goals' | 'labels' | 'notifications' | 'stacking';
    onLogout?: () => void;
}

type GoalView = 'daily' | 'weekly' | 'monthly';
type TabView = 'profile' | 'goals' | 'labels' | 'notifications' | 'stacking';

// --- Icons ---
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);
const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a6 6 0 00-6 6v3.586l-1.707 1.707A1 1 0 003 15v4a1 1 0 001 1h12a1 1 0 001-1v-4a1 1 0 00-.293-.707L16 11.586V8a6 6 0 00-6-6zM5 15h10v3H5v-3z" />
    </svg>
);
const TagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);
const CashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
);
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);
const MinusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);
const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
);
const CloudIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
        <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
    </svg>
);

const ToggleSwitch: React.FC<{
    label: string;
    description?: string;
    enabled: boolean;
    onChange: (enabled: boolean) => void;
}> = ({ label, description, enabled, onChange }) => (
    <div className="flex items-center justify-between group p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
        <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{label}</h4>
            {description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
        <button
            type="button"
            className={`${enabled ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-600'
                } relative inline-flex items-center h-6 rounded-full w-11 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            role="switch"
            aria-checked={enabled}
            onClick={() => onChange(!enabled)}
        >
            <span
                className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 shadow-sm`}
            />
        </button>
    </div>
);

const DEFAULT_GOALS_STRUCTURE: Goals = {
    daily: {},
    weekly: {},
    monthly: {}
};

const SettingsModal: React.FC<SettingsModalProps> = ({
    isOpen, onClose, onSaveSettings, currentSettings, addNotification, onDataRestore, initialTab, onLogout
}) => {
    const [settings, setSettings] = useState<AppSettings>(currentSettings);
    const [activeGoalTab, setActiveGoalTab] = useState<GoalView>('monthly');
    const [activeMainTab, setActiveMainTab] = useState<TabView>('profile');
    const [isGoalsShareModalOpen, setIsGoalsShareModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setSettings(prev => ({
            ...prev,
            ...currentSettings,
            goals: { ...DEFAULT_GOALS_STRUCTURE, ...(currentSettings.goals || {}) },
            customLabels: { ...ACTIVITY_LABELS, ...(currentSettings.customLabels || {}) }
        }));
    }, [currentSettings, isOpen]);

    useEffect(() => {
        if (isOpen && initialTab) {
            setActiveMainTab(initialTab);
        }
    }, [isOpen, initialTab]);

    if (!isOpen) return null;

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, userProfile: { ...prev.userProfile, [name]: value } }));
    };

    const handleStatusChange = (status: CommissionStatus) => {
        setSettings(prev => ({ ...prev, userProfile: { ...prev.userProfile, commissionStatus: status } }));
    };

    const handleNotificationChange = (key: 'goalReached' | 'milestones', value: boolean) => {
        setSettings(prev => ({ ...prev, notificationSettings: { ...prev.notificationSettings, [key]: value } }));
    };

    const handleTargetQualificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSettings(prev => ({ ...prev, userProfile: { ...prev.userProfile, targetQualification: e.target.value as Qualification } }));
    };

    const handleStartDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 1;
        if (val < 1) val = 1;
        if (val > 28) val = 28;
        setSettings(prev => ({ ...prev, commercialMonthStartDay: val }));
    };

    const handleLabelChange = (activity: ActivityType, newValue: string) => {
        setSettings(prev => ({
            ...prev,
            customLabels: { ...prev.customLabels, [activity]: newValue }
        }));
    };

    const handleEnableGoalsChange = (enabled: boolean) => setSettings(prev => ({ ...prev, enableGoals: enabled }));
    const handleEnableLabelsChange = (enabled: boolean) => setSettings(prev => ({ ...prev, enableCustomLabels: enabled }));
    const handleEnableHabitStackingChange = (enabled: boolean) => setSettings(prev => ({ ...prev, enableHabitStacking: enabled }));

    const handleGoalChange = (period: GoalView, activity: ActivityType, value: string) => {
        const numValue = parseInt(value, 10);
        const cleanValue = isNaN(numValue) || numValue < 0 ? 0 : numValue;

        setSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev));
            if (!newSettings.goals) newSettings.goals = DEFAULT_GOALS_STRUCTURE;
            if (!newSettings.goals[period]) newSettings.goals[period] = {};
            newSettings.goals[period][activity] = cleanValue;

            if (period === 'daily') {
                if (activity === ActivityType.CONTACTS || activity === ActivityType.VIDEOS_SENT || activity === ActivityType.APPOINTMENTS) {
                    const calculatedWeekly = cleanValue * 6;
                    if (!newSettings.goals.weekly) newSettings.goals.weekly = {};
                    newSettings.goals.weekly[activity] = calculatedWeekly;
                }
            }
            const weeklyVal = newSettings.goals.weekly?.[activity] || 0;
            const calculatedMonthly = Math.round(weeklyVal * 4.5);
            if (!newSettings.goals.monthly) newSettings.goals.monthly = {};
            newSettings.goals.monthly[activity] = calculatedMonthly;

            return newSettings;
        });
    };

    const handleGoalButtonClick = (period: GoalView, activity: ActivityType, change: number) => {
        const currentValue = settings.goals?.[period]?.[activity] || 0;
        const newValue = Math.max(0, currentValue + change);
        handleGoalChange(period, activity, newValue.toString());
    };

    const handleAddStack = () => {
        const newStack = { id: crypto.randomUUID(), trigger: '', action: ActivityType.CONTACTS, targetCount: 5 };
        setSettings(prev => ({ ...prev, habitStacks: [...(prev.habitStacks || []), newStack] }));
    };

    const handleUpdateStack = (id: string, updates: Partial<any>) => {
        setSettings(prev => ({ ...prev, habitStacks: (prev.habitStacks || []).map(s => s.id === id ? { ...s, ...updates } : s) }));
    };

    const handleRemoveStack = (id: string) => {
        setSettings(prev => ({ ...prev, habitStacks: (prev.habitStacks || []).filter(s => s.id !== id) }));
    };

    const handleSave = () => {
        onSaveSettings(settings);
        onClose();
        addNotification('Impostazioni salvate!', 'success');
    };

    const handleDownloadBackup = () => {
        const data = getBackupData(null);
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `daily-check-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        addNotification('Backup scaricato!', 'success');
    };

    const handleRestoreClick = () => fileInputRef.current?.click();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                restoreBackupData(null, data);
                addNotification('Dati ripristinati!', 'success');
                if (onDataRestore) onDataRestore();
                onClose();
            } catch (error) {
                addNotification('Errore ripristino.', 'info');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col border border-white/20 dark:border-slate-700 overflow-hidden" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Impostazioni</h2>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <CloseIcon />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-100 dark:border-slate-700 shrink-0 overflow-x-auto">
                    <button onClick={() => setActiveMainTab('profile')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeMainTab === 'profile' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>Profilo</button>
                    <button onClick={() => setActiveMainTab('goals')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeMainTab === 'goals' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>Obiettivi</button>
                    <button onClick={() => setActiveMainTab('stacking')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeMainTab === 'stacking' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>Habit Stacking</button>
                    <button onClick={() => setActiveMainTab('labels')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeMainTab === 'labels' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>Etichette</button>
                    <button onClick={() => setActiveMainTab('notifications')} className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeMainTab === 'notifications' ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400'}`}>Notifiche</button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-800/50">
                    {/* PROFILE */}
                    {activeMainTab === 'profile' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-600 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><span className="text-blue-500"><UserIcon /></span> Anagrafica</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Nome</label>
                                        <input type="text" name="firstName" className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-transparent dark:text-white" value={settings.userProfile.firstName} onChange={handleProfileChange} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase">Cognome</label>
                                        <input type="text" name="lastName" className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-transparent dark:text-white" value={settings.userProfile.lastName} onChange={handleProfileChange} />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Qualifica Attuale</label>
                                    <select name="currentQualification" className="w-full mt-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-transparent dark:text-white" value={settings.userProfile.currentQualification || ''} onChange={handleProfileChange}>
                                        <option value="">Automatica</option>
                                        {Object.values(Qualification).map(q => <option key={q} value={q}>{q}</option>)}
                                    </select>
                                </div>
                                <div className="mt-4 flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Giorno Inizio Mese Comm.</span>
                                    <input type="number" value={settings.commercialMonthStartDay || 16} onChange={handleStartDayChange} className="w-16 h-10 text-center font-bold border rounded-lg bg-white dark:bg-slate-700 dark:text-white" />
                                </div>
                            </div>
                            <div className="bg-white dark:bg-slate-700/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-600 shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><span className="text-emerald-500"><CashIcon /></span> Status Provvigionale</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => handleStatusChange(CommissionStatus.PRIVILEGIATO)} className={`p-3 rounded-xl border-2 text-left ${settings.userProfile.commissionStatus === CommissionStatus.PRIVILEGIATO ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-transparent bg-slate-100 dark:bg-slate-800'}`}>
                                        <div className="font-bold text-slate-800 dark:text-white text-xs">Cliente Privilegiato</div>
                                    </button>
                                    <button onClick={() => handleStatusChange(CommissionStatus.FAMILY_UTILITY)} className={`p-3 rounded-xl border-2 text-left ${settings.userProfile.commissionStatus === CommissionStatus.FAMILY_UTILITY ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-transparent bg-slate-100 dark:bg-slate-800'}`}>
                                        <div className="font-bold text-slate-800 dark:text-white text-xs">Family Utility</div>
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-3 mt-6">
                                <button onClick={handleDownloadBackup} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"><DownloadIcon /> Backup</button>
                                <button onClick={handleRestoreClick} className="flex-1 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center justify-center gap-2"><CloudIcon /> Ripristina</button>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
                            </div>
                            {onLogout && (
                                <button onClick={() => { onLogout(); onClose(); }} className="w-full py-3 mt-4 bg-red-50 text-red-600 border border-red-100 font-bold rounded-xl text-xs flex items-center justify-center gap-2"><LogoutIcon /> Logout</button>
                            )}
                        </div>
                    )}

                    {/* GOALS */}
                    {activeMainTab === 'goals' && (
                        <div className="space-y-6">
                            <ToggleSwitch label="Abilita Obiettivi" enabled={settings.enableGoals ?? true} onChange={handleEnableGoalsChange} />
                            <div className={!(settings.enableGoals ?? true) ? 'opacity-50 pointer-events-none' : ''}>
                                <div className="bg-white dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600 mb-6 font-bold text-sm">
                                    <label className="text-xs text-slate-400 block mb-2">TARGET QUALIFICA</label>
                                    <select className="w-full bg-slate-50 dark:bg-slate-800 border p-2 rounded-lg dark:text-white" value={settings.userProfile.targetQualification || ''} onChange={handleTargetQualificationChange}>
                                        <option value="">Seleziona...</option>
                                        {Object.values(Qualification).map(q => <option key={q} value={q}>{q}</option>)}
                                    </select>
                                </div>
                                <div className="flex justify-center bg-white dark:bg-slate-700/50 p-1 rounded-xl shadow-sm mb-4">
                                    {['daily', 'weekly', 'monthly'].map(view => (
                                        <button key={view} onClick={() => setActiveGoalTab(view as GoalView)} className={`px-4 py-2 rounded-lg text-xs font-bold ${activeGoalTab === view ? 'bg-blue-600 text-white' : 'text-slate-500'}`}>
                                            {view.toUpperCase()}
                                        </button>
                                    ))}
                                </div>
                                <div className="space-y-3">
                                    {Object.values(ActivityType).filter(a => activeGoalTab === 'daily' ? (a !== ActivityType.NEW_CONTRACTS && a !== ActivityType.NEW_FAMILY_UTILITY) : true).map(a => (
                                        <div key={a} className="bg-white dark:bg-slate-700/50 p-3 rounded-xl border flex justify-between items-center">
                                            <span className="font-bold text-sm dark:text-white text-slate-700">{SETTINGS_ACTIVITY_LABELS[a]}</span>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => handleGoalButtonClick(activeGoalTab, a, -1)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shadow-sm">－</button>
                                                <span className="w-12 text-center font-bold dark:text-white">{settings.goals?.[activeGoalTab]?.[a] || 0}</span>
                                                <button onClick={() => handleGoalButtonClick(activeGoalTab, a, 1)} className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-sm">＋</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* HABIT STACKING */}
                    {activeMainTab === 'stacking' && (
                        <div className="space-y-6">
                            <ToggleSwitch label="Abilita Habit Stacking" description="Collega abitudini a vendite" enabled={settings.enableHabitStacking ?? false} onChange={handleEnableHabitStackingChange} />
                            <div className={`space-y-6 ${!(settings.enableHabitStacking ?? false) ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                                <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-6 rounded-3xl text-white shadow-lg">
                                    <h3 className="text-xl font-black mb-1">🚀 Habit Stacking</h3>
                                    <p className="text-xs opacity-90">"Dopo [Abitudine], farò [Azione]"</p>
                                </div>
                                {(settings.habitStacks || []).map(stack => (
                                    <div key={stack.id} className="bg-white dark:bg-slate-700/50 p-4 rounded-2xl border shadow-sm relative">
                                        <button onClick={() => handleRemoveStack(stack.id)} className="absolute top-3 right-3 text-slate-300 hover:text-red-500">×</button>
                                        <div className="space-y-3">
                                            <input type="text" placeholder="Dopo..." className="w-full bg-slate-50 dark:bg-slate-800 p-2 rounded-lg font-bold border" value={stack.trigger} onChange={e => handleUpdateStack(stack.id, { trigger: e.target.value })} />
                                            <div className="flex gap-2">
                                                <div className="flex-grow flex flex-col sm:flex-row gap-2">
                                                    <select className="flex-grow bg-slate-50 dark:bg-slate-800 p-2 rounded-lg font-bold border" value={stack.action} onChange={e => handleUpdateStack(stack.id, { action: e.target.value as ActivityType | 'CUSTOM' })}>
                                                        {Object.values(ActivityType).map(t => <option key={t} value={t}>{ACTIVITY_LABELS[t]}</option>)}
                                                        <option value="CUSTOM">Testo Libero</option>
                                                    </select>
                                                    {stack.action === 'CUSTOM' && (
                                                        <input 
                                                            type="text" 
                                                            placeholder="es: Leggere" 
                                                            className="flex-grow bg-slate-50 dark:bg-slate-800 p-2 rounded-lg font-bold border" 
                                                            value={stack.customActionName || ''} 
                                                            onChange={e => handleUpdateStack(stack.id, { customActionName: e.target.value })} 
                                                        />
                                                    )}
                                                </div>
                                                <input 
                                                    type="number" 
                                                    min="1"
                                                    className="w-20 bg-slate-50 dark:bg-slate-800 p-2 rounded-lg font-bold border text-center" 
                                                    value={stack.targetCount === 0 ? '' : stack.targetCount} 
                                                    onChange={e => handleUpdateStack(stack.id, { targetCount: e.target.value === '' ? 0 : Math.abs(parseInt(e.target.value)) || 0 })} 
                                                    placeholder="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={handleAddStack} className="w-full py-4 border-2 border-dashed rounded-2xl text-slate-400 font-bold hover:text-orange-500 hover:border-orange-500">＋ Nuovo Stack</button>
                            </div>
                        </div>
                    )}

                    {/* LABELS */}
                    {activeMainTab === 'labels' && (
                        <div className="space-y-6">
                            <ToggleSwitch label="Etichette Personalizzate" enabled={settings.enableCustomLabels ?? true} onChange={handleEnableLabelsChange} />
                            <div className={!(settings.enableCustomLabels ?? true) ? 'opacity-50 pointer-events-none' : 'space-y-3'}>
                                {Object.values(ActivityType).map(a => (
                                    <div key={a} className="bg-white dark:bg-slate-700/50 p-4 rounded-xl border flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: ACTIVITY_COLORS[a] }}>{activityIcons[a]}</div>
                                        <input type="text" className="flex-grow font-bold border-b bg-transparent dark:text-white" value={settings.customLabels?.[a] || ACTIVITY_LABELS[a]} onChange={e => handleLabelChange(a, e.target.value)} disabled={a === ActivityType.NEW_CONTRACTS} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* NOTIFICATIONS */}
                    {activeMainTab === 'notifications' && (
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-slate-700/50 p-5 rounded-2xl border shadow-sm">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Notifiche</h3>
                                <ToggleSwitch label="Raggiungimento Obiettivo" enabled={settings.notificationSettings.goalReached} onChange={v => handleNotificationChange('goalReached', v)} />
                                <ToggleSwitch label="Milestones" enabled={settings.notificationSettings.milestones} onChange={v => handleNotificationChange('milestones', v)} />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 border-t flex justify-end gap-3 shrink-0">
                    <button onClick={onClose} className="px-6 py-2 font-bold text-slate-500">Annulla</button>
                    <button onClick={handleSave} className="px-8 py-2 font-bold text-white bg-blue-600 rounded-xl shadow-lg">Salva</button>
                </div>
            </div>

            <GoalsShareModal
                isOpen={isGoalsShareModalOpen}
                onClose={() => setIsGoalsShareModalOpen(false)}
                goals={settings.goals?.[activeGoalTab] || {}}
                period={activeGoalTab}
                userProfile={settings.userProfile}
                customLabels={settings.customLabels}
            />
        </div>
    );
};

export default SettingsModal;
