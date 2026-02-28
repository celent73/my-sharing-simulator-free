import React, { useState, useEffect, useRef } from 'react';
import { X, Phone, PhoneMissed, Play, Pause, Zap, LogOut, RotateCcw, CheckCircle2, Target, BarChart3, Clock, Trophy, Sparkles, Rocket, ChevronRight, Minimize2, Settings2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FocusModeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SessionState = 'config' | 'active' | 'paused' | 'finished';
type FocusMode = 'instant' | 'pro';

const PRESET_DURATIONS = [15, 30, 45, 60, 90];

// Preset obiettivi comuni
const GOAL_PRESETS = [
    { id: 'contracts', icon: '📋', label: 'Chiudere 3 contratti' },
    { id: 'revenue', icon: '💰', label: '€5000 questo mese' },
    { id: 'leads', icon: '🎯', label: '10 nuovi lead' }
];

export const FocusModeModal: React.FC<FocusModeModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();

    const CHECKLIST_ITEMS = [
        { id: 'silence', label: t('focus_mode.check_silence'), emoji: '🔕' },
        { id: 'water', label: t('focus_mode.check_water'), emoji: '💧' },
        { id: 'focus', label: t('focus_mode.check_focus'), emoji: '🧘' }
    ];
    const [sessionState, setSessionState] = useState<SessionState>('config');
    const [mode, setMode] = useState<FocusMode>('pro'); // Default to PRO (consigliato)
    const [duration, setDuration] = useState(45); // Minutes
    const [timeLeft, setTimeLeft] = useState(45 * 60); // Seconds
    const [initialDuration, setInitialDuration] = useState(45 * 60); // To track total time for stats

    const [contactsOk, setContactsOk] = useState(0);
    const [attempts, setAttempts] = useState(0);

    // New Enhancement States
    const [goalText, setGoalText] = useState('');
    const [targetContacts, setTargetContacts] = useState(5); // Default target
    const [checklist, setChecklist] = useState<Record<string, boolean>>({});

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setSessionState('config');
            setMode('instant'); // Default to Instant
            setDuration(45);
            setContactsOk(0);
            setAttempts(0);
            setGoalText('');
            setTargetContacts(5);
            setChecklist({});
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
    }, [isOpen]);

    // Timer logic
    useEffect(() => {
        if (sessionState === 'active' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setSessionState('finished');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [sessionState, timeLeft, mode]);

    const handleStartSession = () => {
        const seconds = duration * 60;
        setTimeLeft(seconds);
        setInitialDuration(seconds);
        setSessionState('active');
    };

    const togglePause = () => {
        setSessionState((prev) => (prev === 'active' ? 'paused' : 'active'));
    };

    const handleStopSession = () => {
        if (mode === 'pro') {
            setSessionState('finished');
        } else {
            handleReset();
        }
    };

    const handleReset = () => {
        setSessionState('config');
        setContactsOk(0);
        setAttempts(0);
        setChecklist({});
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const toggleCheckitem = (id: string) => {
        setChecklist(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const allChecked = mode === 'instant' || CHECKLIST_ITEMS.every(item => checklist[item.id]);
    const progressPercentage = Math.min(100, Math.round((contactsOk / (targetContacts || 1)) * 100));

    // Stats Calculation
    const timeSpentSeconds = initialDuration - timeLeft;
    const timeSpentMinutes = Math.max(1, Math.round(timeSpentSeconds / 60));
    const contactsPerHour = timeSpentMinutes > 0 ? Math.round((contactsOk / timeSpentMinutes) * 60) : 0;
    const isGoalReached = contactsOk >= targetContacts;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[10000] bg-black text-white flex flex-col items-center justify-center animate-in fade-in duration-500 font-sans">

            {/* AMBIENT BACKGROUND - Deep iOS Glass Style */}
            <div className="absolute inset-0 bg-[#000000]">
                {/* Subtle colorful orbs for that premium deep feel */}
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[150px] pointer-events-none opacity-60" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none opacity-60" />
                <div className="absolute top-[40%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[800px] h-[800px] bg-cyan-900/10 rounded-full blur-[180px] pointer-events-none" />

                {/* Noise texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
            </div>

            {/* HEADER */}
            <div className="absolute top-0 left-0 right-0 p-6 sm:p-8 flex justify-between items-center z-50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg">
                        <Zap className="fill-yellow-400 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]" size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">Productivity</div>
                        <div className="text-xl font-bold tracking-tight text-white drop-shadow-md">Focus Mode</div>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="group flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 rounded-full backdrop-blur-md border border-white/5 transition-all active:scale-95"
                >
                    <span className="text-[11px] font-bold uppercase tracking-widest text-white/70 group-hover:text-white transition-colors">{t('focus_mode.exit')}</span>
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <X size={14} className="text-white" />
                    </div>
                </button>
            </div>

            {/* MAIN CONTENT CONTAINER */}
            <div className="relative z-40 w-full max-w-lg px-6 flex flex-col items-center h-full max-h-screen pt-24 pb-8 overflow-y-auto no-scrollbar">

                {sessionState === 'config' && (
                    <div className="w-full flex-1 flex flex-col gap-6 animate-in slide-in-from-bottom-8 fade-in duration-700">

                        <div className="text-center mb-2">
                            <h2 className="text-3xl font-bold tracking-tight text-white mb-2">{t('focus_mode.config_title')}</h2>
                            <p className="text-white/40 text-sm font-medium">Personalizza la tua sessione di lavoro profondo.</p>
                        </div>

                        {/* MODE SELECTOR CARDS */}
                        <div className="grid grid-cols-2 gap-3 w-full">
                            <button
                                onClick={() => setMode('instant')}
                                className={`relative overflow-hidden p-4 rounded-3xl border transition-all duration-300 group text-left h-32 flex flex-col justify-between ${mode === 'instant'
                                        ? 'bg-white text-black border-white shadow-[0_0_40px_rgba(255,255,255,0.15)] ring-2 ring-white/50'
                                        : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:border-white/10'
                                    }`}
                            >
                                <div className="absolute top-0 right-0 p-3 opacity-20">
                                    <Zap size={60} className={mode === 'instant' ? 'fill-black' : 'fill-white'} />
                                </div>
                                <div className={`p-2 rounded-xl w-fit ${mode === 'instant' ? 'bg-black/10' : 'bg-white/10'}`}>
                                    <Zap size={18} className={mode === 'instant' ? 'fill-black' : 'fill-white'} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-0.5">Veloce</div>
                                    <div className="text-lg font-bold leading-none">{t('focus_mode.mode_instant')}</div>
                                </div>
                            </button>

                            <button
                                onClick={() => setMode('pro')}
                                className={`relative overflow-hidden p-4 rounded-3xl border transition-all duration-300 group text-left h-32 flex flex-col justify-between ${mode === 'pro'
                                        ? 'bg-[#15151A] text-white border-yellow-500/50 ring-2 ring-yellow-500/30'
                                        : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:border-white/10'
                                    }`}
                            >
                                {mode === 'pro' && (
                                    <div className="absolute top-0 right-0 hidden sm:block">
                                        <div className="bg-yellow-500 text-black text-[9px] font-black px-3 py-1 rounded-bl-xl uppercase tracking-wider">Premium</div>
                                    </div>
                                )}
                                <div className="absolute top-0 right-0 p-3 opacity-10">
                                    <Trophy size={60} />
                                </div>
                                <div className={`p-2 rounded-xl w-fit ${mode === 'pro' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-white/10'}`}>
                                    <Trophy size={18} className={mode === 'pro' ? 'fill-yellow-500' : ''} />
                                </div>
                                <div>
                                    <div className="text-xs font-bold uppercase tracking-wider opacity-60 mb-0.5">Completo</div>
                                    <div className="text-lg font-bold leading-none">{t('focus_mode.mode_pro')}</div>
                                </div>
                            </button>
                        </div>

                        {/* PRO MODE CONFIGURATION */}
                        {mode === 'pro' && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">

                                {/* GOAL SECTION */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">{t('focus_mode.goal_label')}</label>
                                        <Settings2 size={14} className="text-white/20" />
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                                            <Target className="text-blue-400 shrink-0" size={20} />
                                            <input
                                                type="text"
                                                placeholder={t('focus_mode.goal_placeholder')}
                                                value={goalText}
                                                onChange={(e) => setGoalText(e.target.value)}
                                                className="w-full bg-transparent border-none text-white placeholder-white/20 focus:outline-none focus:ring-0 text-base font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Quick Presets */}
                                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                        {GOAL_PRESETS.map(preset => (
                                            <button
                                                key={preset.id}
                                                onClick={() => setGoalText(preset.label)}
                                                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold border transition-all ${goalText === preset.label
                                                        ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                                                        : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {preset.icon} {preset.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* SLIDER SECTION */}
                                <div className="bg-white/5 backdrop-blur-md rounded-3xl p-5 border border-white/5 space-y-4">
                                    <div className="flex justify-between items-end">
                                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">{t('focus_mode.target_label')}</label>
                                        <div className="text-3xl font-black text-white tabular-nums leading-none tracking-tight">
                                            {targetContacts} <span className="text-sm font-medium text-white/30 tracking-normal">contatti</span>
                                        </div>
                                    </div>

                                    <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 rounded-full"
                                            style={{ width: `${(targetContacts / 20) * 100}%` }}
                                        />
                                        <input
                                            type="range"
                                            min="1"
                                            max="20"
                                            value={targetContacts}
                                            onChange={(e) => setTargetContacts(Number(e.target.value))}
                                            className="absolute inset-0 w-full opacity-0 cursor-pointer"
                                        />
                                    </div>

                                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-white/30">
                                        <span>Facile</span>
                                        <span className={targetContacts >= 8 && targetContacts <= 12 ? 'text-cyan-400' : ''}>Ottimale</span>
                                        <span>Ambizioso</span>
                                    </div>
                                </div>

                                {/* CHECKLIST */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest pl-1">{t('focus_mode.checklist_title')}</label>
                                    <div className="grid gap-2">
                                        {CHECKLIST_ITEMS.map(item => (
                                            <button
                                                key={item.id}
                                                onClick={() => toggleCheckitem(item.id)}
                                                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all text-left ${checklist[item.id]
                                                        ? 'bg-green-500/10 border-green-500/20'
                                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${checklist[item.id] ? 'bg-green-500 border-green-500' : 'border-white/20'
                                                    }`}>
                                                    {checklist[item.id] && <CheckCircle2 size={12} className="text-black" strokeWidth={4} />}
                                                </div>
                                                <span className={`text-sm font-medium ${checklist[item.id] ? 'text-green-400' : 'text-white/60'}`}>{item.label}</span>
                                                <span className="ml-auto text-lg opacity-80">{item.emoji}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* DURATION SELECTOR */}
                        <div className="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/5 flex flex-col items-center gap-4">
                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">{t('focus_mode.duration_label')}</label>

                            <div className="flex items-center justify-center gap-8 w-full">
                                <button
                                    onClick={() => setDuration(prev => Math.max(5, prev - 5))}
                                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 hover:border-white/30 transition-all text-white/50 hover:text-white text-2xl"
                                >-</button>

                                <div className="text-center">
                                    <div className="text-6xl font-black text-white tracking-tighter tabular-nums drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                                        {duration}
                                    </div>
                                    <div className="text-xs font-bold text-white/40 uppercase tracking-[0.3em] mt-1">{t('focus_mode.minutes')}</div>
                                </div>

                                <button
                                    onClick={() => setDuration(prev => Math.min(180, prev + 5))}
                                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center border border-white/10 hover:border-white/30 transition-all text-white/50 hover:text-white text-2xl"
                                >+</button>
                            </div>

                            <div className="flex gap-2 justify-center w-full overflow-x-auto no-scrollbar pt-2">
                                {PRESET_DURATIONS.map(p => (
                                    <button
                                        key={p}
                                        onClick={() => setDuration(p)}
                                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${duration === p
                                                ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]'
                                                : 'bg-transparent text-white/30 border-white/10 hover:border-white/30 hover:text-white'
                                            }`}
                                    >
                                        {p}m
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* START BUTTON */}
                        <div className="pt-2">
                            <button
                                onClick={handleStartSession}
                                disabled={!allChecked}
                                className={`group relative w-full py-5 rounded-2xl font-black text-lg uppercase tracking-widest transition-all duration-300 overflow-hidden ${allChecked
                                        ? 'text-black shadow-[0_0_50px_rgba(34,197,94,0.4)] hover:shadow-[0_0_70px_rgba(34,197,94,0.6)] hover:scale-[1.02]'
                                        : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                                    }`}
                            >
                                {allChecked ? (
                                    <>
                                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500" />
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <span className="relative z-10 flex items-center justify-center gap-3">
                                            <Rocket size={20} className="animate-bounce" />
                                            {t('focus_mode.start_btn')}
                                        </span>
                                    </>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Settings2 size={16} /> Completare Setup
                                    </span>
                                )}
                            </button>
                        </div>

                    </div>
                )}

                {(sessionState === 'active' || sessionState === 'paused') && (
                    <div className="w-full flex-1 flex flex-col items-center justify-between animate-in zoom-in-95 duration-700">

                        {/* ACTIVE HEADER INFO */}
                        <div className="w-full text-center space-y-2">
                            {mode === 'pro' && (
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                                    <Target size={12} className="text-cyan-400" />
                                    <span className="text-xs font-bold text-white/90">{goalText || t('focus_mode.generic')}</span>
                                </div>
                            )}
                            <div className="h-4"></div>
                        </div>

                        {/* LARGE TIMER */}
                        <div className="relative group cursor-pointer" onClick={togglePause}>
                            {/* Glowing Ring Background */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border-[1px] ${sessionState === 'paused' ? 'border-yellow-500/30' : 'border-cyan-500/20'
                                } transition-colors duration-500`} />
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-[1px] border-white/5`} />

                            {/* The Time */}
                            <div className={`text-[7rem] sm:text-[8rem] font-thin tracking-tighter tabular-nums leading-none transition-all duration-300 ${sessionState === 'paused'
                                    ? 'text-yellow-400 opacity-60 blur-[2px]'
                                    : 'text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.4)]'
                                }`}>
                                {formatTime(timeLeft)}
                            </div>

                            {/* Pause Overlay Icon */}
                            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${sessionState === 'paused' ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                                }`}>
                                <div className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                                    <Pause className="fill-black text-black ml-1" size={32} />
                                </div>
                            </div>
                        </div>

                        <div className="text-center -mt-6">
                            <div className={`text-sm font-bold tracking-[0.5em] uppercase ${sessionState === 'paused' ? 'text-yellow-400 animate-pulse' : 'text-cyan-400'
                                }`}>
                                {sessionState === 'paused' ? t('focus_mode.paused') : 'Focus Active'}
                            </div>
                        </div>

                        {/* STATS GRID */}
                        <div className="w-full grid grid-cols-2 gap-4 mt-8">
                            {/* CONTACTS OK */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-50" />
                                <div className="text-5xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">{contactsOk}</div>
                                <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{t('focus_mode.contacts_ok')}</div>
                                <button
                                    onClick={() => setContactsOk(p => p + 1)}
                                    className="absolute inset-0 z-10 bg-cyan-500/0 hover:bg-cyan-500/5 transition-colors"
                                />
                            </div>

                            {/* ATTEMPTS */}
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden group">
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-400 to-pink-500 opacity-50" />
                                <div className="text-5xl font-bold text-white/50 mb-2 group-hover:scale-110 transition-transform duration-300">{attempts}</div>
                                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{t('focus_mode.attempts')}</div>
                                <button
                                    onClick={() => setAttempts(p => p + 1)}
                                    className="absolute inset-0 z-10 bg-purple-500/0 hover:bg-purple-500/5 transition-colors"
                                />
                            </div>
                        </div>

                        {/* CONTROLS */}
                        <div className="flex gap-4 w-full mt-4">
                            <button
                                onClick={() => setAttempts(prev => prev + 1)}
                                className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95"
                            >
                                <PhoneMissed size={20} className="text-white/40" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{t('focus_mode.not_answered')}</span>
                            </button>

                            <button
                                onClick={() => setContactsOk(prev => prev + 1)}
                                className="flex-1 py-4 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 hover:from-cyan-500/30 hover:to-blue-600/30 border border-cyan-500/30 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
                            >
                                <Phone size={20} className="text-cyan-400 fill-cyan-400" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">{t('focus_mode.answered')}</span>
                            </button>
                        </div>

                        <button
                            onClick={handleStopSession}
                            className="text-xs font-bold text-red-500/60 uppercase tracking-widest hover:text-red-400 mt-6 mb-2 flex items-center gap-2"
                        >
                            <RotateCcw size={12} /> {t('focus_mode.stop_btn')}
                        </button>
                    </div>
                )}

                {sessionState === 'finished' && (
                    <div className="w-full flex-1 flex flex-col items-center justify-center animate-in zoom-in-95 fade-in duration-700 space-y-8">

                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400 to-orange-500 blur-[80px] opacity-40 rounded-full" />
                            {isGoalReached
                                ? <Trophy size={100} className="text-yellow-400 relative z-10 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)] animate-bounce" />
                                : <Sparkles size={100} className="text-cyan-400 relative z-10 drop-shadow-[0_0_30px_rgba(6,182,212,0.5)]" />
                            }
                        </div>

                        <div className="text-center space-y-2">
                            <div className="text-xs font-bold text-white/50 uppercase tracking-[0.3em]">Sessione Terminata</div>
                            <h2 className="text-4xl font-black text-white">{isGoalReached ? 'Obiettivo Raggiunto!' : 'Sessione Completata'}</h2>
                            <p className="text-white/60 max-w-xs mx-auto text-sm leading-relaxed">
                                {isGoalReached ? t('focus_mode.goal_reached_msg') : t('focus_mode.goal_missed_msg')}
                            </p>
                        </div>

                        {/* RECAP CARD */}
                        <div className="w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 space-y-6">
                            <div className="flex justify-between items-center text-sm font-medium border-b border-white/10 pb-4">
                                <span className="text-white/40">Durata Totale</span>
                                <span className="text-white font-bold">{timeSpentMinutes} min</span>
                            </div>

                            <div className="grid grid-cols-2 gap-8 text-center px-4">
                                <div>
                                    <div className="text-4xl font-black text-white mb-1">{contactsOk}</div>
                                    <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{t('focus_mode.contacts_ok')}</div>
                                </div>
                                <div className="relative">
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-10 bg-white/10" />
                                    <div className="text-4xl font-black text-purple-400 mb-1">{contactsPerHour}</div>
                                    <div className="text-[9px] font-bold text-white/30 uppercase tracking-widest">/ Ora</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full space-y-3">
                            <button
                                onClick={handleReset}
                                className="w-full py-4 bg-white text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                            >
                                {t('focus_mode.new_session')}
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 text-white/40 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
                            >
                                Torna alla Dashboard
                            </button>
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};
