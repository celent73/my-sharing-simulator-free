import React, { useState, useEffect, useRef } from 'react';
import { ActivityType, TeamMemberStats, ActivityLog, OnlineTeamMember, TeamNotification, Team } from '../types';
import { calculateMonthlyStats } from '../utils/teamUtils';
import { ACTIVITY_LABELS } from '../constants';
import { getWeekIdentifier, getCommercialMonthRange, getPreviousWeekIdentifier, getTodayDateString } from '../utils/dateUtils';
import { supabase } from '../supabaseClient';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import { startOfWeek, endOfWeek, differenceInDays, format, isAfter, subHours } from 'date-fns';
import { it } from 'date-fns/locale';

// Simple UUID generator
const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

interface TeamLeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    activityLogs: ActivityLog[];
    userName: string;
    commercialStartDay: number;
}

// --- CONSTANTS ---
const ARENA_EMOJIS = ['👤', '🦁', '🦅', '🐺', '🦈', '🔥', '⚔️', '🏆', '🎯', '👑', '⚡', '🚀'];
const ARENA_COLORS = ['#6366f1', '#ef4444', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

// --- SUB-COMPONENTS ---

const getBattleTitle = (member: OnlineTeamMember, rank: number, allMembers: OnlineTeamMember[]): string => {
    const { CONTACTS = 0, NEW_CONTRACTS = 0, APPOINTMENTS = 0 } = member.stats;
    if (rank === 0 && allMembers.length > 1) {
        if (member.total_score > allMembers[1].total_score * 1.2) return "L'Intoccabile 👑";
    }
    if (CONTACTS > 0 && (NEW_CONTRACTS / CONTACTS) > 0.10 && NEW_CONTRACTS >= 2) return "Il Cecchino 🎯";
    if (CONTACTS > 50) return "Il Martello 🔨";
    if (APPOINTMENTS > 10) return "Agenda d'Oro 📅";
    if (NEW_CONTRACTS > 5) return "Il Closer 🦈";
    if (member.total_score < 10) return "La Recluta 🐣";
    return "Lo Sfidante ⚔️";
};

const LiveTicker = ({ notifications }: { notifications: TeamNotification[] }) => {
    const activityNotifs = notifications.filter(n => n.type === 'activity' || n.type === 'poke').slice(0, 5);
    if (activityNotifs.length === 0) return null;

    return (
        <div className="bg-black/40 backdrop-blur-sm py-2 overflow-hidden border-y border-white/5 relative h-10 shrink-0">
            <div className="flex animate-marquee whitespace-nowrap items-center hover:pause">
                {activityNotifs.map(n => (
                    <div key={n.id} className="inline-flex items-center gap-2 mx-8 text-[11px] font-black uppercase tracking-widest text-indigo-300">
                        <span className="text-white bg-indigo-600 px-2 py-0.5 rounded text-[10px]">{n.from_player_name}</span>
                        <span>{n.message}</span>
                        {n.type === 'poke' && <span className="text-lg animate-bounce-short">{n.metadata?.emoji}</span>}
                    </div>
                ))}
                {/* Duplicate for seamless loop */}
                {activityNotifs.map(n => (
                    <div key={n.id + '_dup'} className="inline-flex items-center gap-2 mx-8 text-[11px] font-black uppercase tracking-widest text-indigo-300">
                        <span className="text-white bg-indigo-600 px-2 py-0.5 rounded text-[10px]">{n.from_player_name}</span>
                        <span>{n.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TeamGoalProgress = ({ members, teamGoal, mode }: { members: OnlineTeamMember[], teamGoal: number, mode: 'weekly' | 'monthly' | 'daily' }) => {
    const totalTeamScore = members.reduce((sum, m) => sum + m.total_score, 0);
    const progress = Math.min((totalTeamScore / teamGoal) * 100, 100);

    const modeLabels = {
        daily: 'Giornaliera',
        weekly: 'Settimanale',
        monthly: 'Mensile'
    };

    return (
        <div className="px-6 py-4 bg-white/5 border-b border-white/5">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h4 className="text-[10px] font-black uppercase text-indigo-400 tracking-tighter">Sfida Collettiva ({modeLabels[mode]})</h4>
                    <p className="text-xs font-bold text-white">Obiettivo Team</p>
                </div>
                <div className="text-right">
                    <span className="text-lg font-black text-indigo-400">{totalTeamScore}</span>
                    <span className="text-xs font-bold text-indigo-400/50"> / {teamGoal} PT</span>
                </div>
            </div>
            <div className="h-3 bg-black/40 rounded-full overflow-hidden border border-white/5 shadow-inner p-0.5">
                <div
                    className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                    style={{ width: `${progress}%` }}
                />
            </div>
            {progress >= 100 && <p className="text-[10px] text-emerald-400 font-bold mt-1 text-center animate-pulse">OBIETTIVO RAGGIUNTO! 🎉 BRAVI TUTTI!</p>}
        </div>
    );
};

const VictoryOverlay = ({ winnerName, score, onClose }: { winnerName: string, score: number, onClose: () => void }) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const handleShare = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!overlayRef.current) return;

        try {
            const canvas = await html2canvas(overlayRef.current, {
                useCORS: true,
                backgroundColor: '#000000', // Solid Black as requested
                scale: 2,
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById('victory-overlay-container');
                    if (el) {
                        el.style.background = '#000000'; // Force solid black
                        el.style.backdropFilter = 'none';
                        el.style.opacity = '1';
                    }

                    const title = clonedDoc.getElementById('victory-title');
                    if (title) {
                        title.style.color = '#ffffff';
                        title.style.opacity = '1';
                        title.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';
                    }
                }
            });
            const link = document.createElement('a');
            link.download = `Arena_Winner_${winnerName}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } catch (err) {
            console.error("Screenshot failed", err);
            alert("Impossibile salvare l'immagine 😔");
        }
    };

    return (
        <div id="victory-overlay-container" ref={overlayRef} className="absolute inset-0 z-[80] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-scale-up text-center overflow-hidden" onClick={onClose}>
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none"></div>

            {/* Content to Capture */}
            <div className="relative z-10 flex flex-col items-center">
                <div className="animate-bounce">
                    <div className="text-8xl mb-4 drop-shadow-[0_0_50px_rgba(251,191,36,0.6)]">🏆</div>
                </div>
                <h2 id="victory-title" className="text-3xl md:text-4xl font-black text-white uppercase mb-4 tracking-tighter drop-shadow-lg">Campione della Settimana</h2>

                {/* Fixed Text Style for Export Compatibility */}
                <h1 className="text-5xl md:text-7xl font-black uppercase mb-6 tracking-tight text-yellow-400 drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)] border-yellow-500">
                    {winnerName}
                </h1>

                <div className="bg-white/10 backdrop-blur-md px-8 py-3 rounded-full border border-white/20 mb-8 shadow-xl">
                    <p className="text-xl font-bold text-white">Guest Star con <span className="text-yellow-400 text-2xl drop-shadow-md">{score}</span> Punti</p>
                </div>
            </div>

            {/* Controls (Excluded from Screenshot) */}
            <button
                data-html2canvas-ignore="true"
                onClick={handleShare}
                className="relative z-50 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-wider shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:scale-105 transition-transform flex items-center gap-3 border border-indigo-400/30"
            >
                <span className="text-2xl">📸</span> <span>Salva Ricordo</span>
            </button>

            <p data-html2canvas-ignore="true" className="mt-8 text-slate-500 text-xs animate-pulse">Tocca altrove per chiudere</p>
        </div>
    );
};

const DuelOverlay = ({ me, opponent, onClose }: { me: OnlineTeamMember, opponent: OnlineTeamMember, onClose: () => void }) => {
    const statsToCompare = [ActivityType.CONTACTS, ActivityType.APPOINTMENTS, ActivityType.NEW_CONTRACTS];
    const isWin = me.total_score > opponent.total_score;
    const isDraw = me.total_score === opponent.total_score;
    const [sending, setSending] = useState(false);

    const sendChallenge = async () => {
        setSending(true);
        const diff = me.total_score - opponent.total_score;
        let msg = '';
        if (isWin) msg = `${me.name} ti ha appena superato! ${me.total_score} vs ${opponent.total_score} (+${diff}). Recupera!`;
        else if (isDraw) msg = `${me.name} ti ha raggiunto! Siete pari a ${me.total_score} punti.`;
        else msg = `${me.name} sta provando a raggiungerti... ma è ancora indietro (-${opponent.total_score - me.total_score}).`;

        await supabase.from('notifications').insert({
            team_id: me.team_id,
            from_player_id: me.player_id,
            from_player_name: me.name,
            to_player_id: opponent.player_id,
            message: msg,
            type: 'duel'
        });
        alert("Sfida inviata! 🔔");
        setSending(false);
    };

    return (
        <div className="absolute inset-0 z-[70] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-scale-up overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-white p-2">✕</button>
            <div className="w-full max-w-lg">
                <div className="flex justify-between items-center mb-8 relative">
                    <div className="text-center w-1/3">
                        <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] border-2 border-blue-400">👤</div>
                        <p className="font-bold text-blue-400 truncate">{me.name}</p>
                        <p className="text-2xl font-black text-white">{me.total_score}</p>
                    </div>
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                        <span className="text-5xl font-black italic text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.8)] transform -skew-x-12 block">VS</span>
                    </div>
                    <div className="text-center w-1/3">
                        <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(220,38,38,0.5)] border-2 border-red-500">👿</div>
                        <p className="font-bold text-red-500 truncate">{opponent.name}</p>
                        <p className="text-2xl font-black text-white">{opponent.total_score}</p>
                    </div>
                </div>

                <div className="space-y-6 bg-white/5 p-6 rounded-3xl border border-white/10">
                    {statsToCompare.map(stat => {
                        const myVal = me.stats[stat] || 0;
                        const oppVal = opponent.stats[stat] || 0;
                        const max = Math.max(myVal, oppVal, 1);
                        return (
                            <div key={stat} className="relative">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                    <span>{ACTIVITY_LABELS[stat]}</span>
                                </div>
                                <div className="flex items-center gap-4 h-4">
                                    <div className="flex-1 flex justify-end relative h-full bg-slate-800/50 rounded-l-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${(myVal / max) * 100}%` }} />
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">{myVal}</span>
                                    </div>
                                    <div className="w-0.5 h-6 bg-white/20"></div>
                                    <div className="flex-1 relative h-full bg-slate-800/50 rounded-r-full overflow-hidden">
                                        <div className="h-full bg-red-600" style={{ width: `${(oppVal / max) * 100}%` }} />
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white drop-shadow-md">{oppVal}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center mt-8">
                    {isDraw ? <h2 className="text-3xl font-black text-slate-300 uppercase">Pareggio! 🤝</h2> :
                        isWin ? <h2 className="text-3xl font-black text-emerald-400 uppercase animate-bounce">Stai Vincendo! 🎉</h2> :
                            <h2 className="text-3xl font-black text-red-400 uppercase">Ti sta stracciando! 😱</h2>}
                </div>

                <div className="flex gap-2 mt-6">
                    <button
                        onClick={sendChallenge}
                        disabled={sending}
                        className="w-full py-4 bg-yellow-400 text-yellow-900 font-black rounded-xl shadow-lg hover:bg-yellow-300 flex items-center justify-center gap-2 disabled:opacity-50 transition-transform hover:scale-[1.02] active:scale-95 text-lg"
                    >
                        {sending ? 'Invio Sfida...' : 'INVIA NOTIFICA DI SFIDA 🔔'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const Podium = ({ winners, onClick }: { winners: OnlineTeamMember[], onClick: (m: OnlineTeamMember) => void }) => {
    if (winners.length === 0) return null;
    const first = winners[0];
    const second = winners[1];
    const third = winners[2];

    return (
        <div className="flex justify-center items-end gap-2 md:gap-4 mb-8 mt-16 px-4 h-48 md:h-56 relative">
            {second && (
                <div onClick={() => onClick(second)} className="flex flex-col items-center w-1/3 cursor-pointer group hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-slate-300 border-4 border-slate-400 shadow-lg flex items-center justify-center text-2xl mb-2 relative z-10 overflow-hidden" style={{ backgroundColor: second.avatar_color }}>
                        {second.avatar_emoji || '👤'}
                        <div className="absolute -bottom-2 bg-slate-600 text-[10px] text-white px-2 rounded-full font-bold">2°</div>
                    </div>
                    <div className="w-full bg-slate-300/20 rounded-t-lg h-24 md:h-28 flex flex-col justify-end p-2 text-center border-t border-l border-r border-slate-400/30 relative overflow-hidden">
                        <p className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 truncate w-full">{second.name}</p>
                        <p className="text-xs font-mono opacity-70">{second.total_score}</p>
                    </div>
                </div>
            )}
            {first && (
                <div onClick={() => onClick(first)} className="flex flex-col items-center w-1/3 -mt-10 z-20 cursor-pointer group hover:-translate-y-2 transition-transform">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.5)] flex items-center justify-center text-4xl mb-2 relative animate-pulse-slow overflow-hidden" style={{ backgroundColor: first.avatar_color || '#fbbf24' }}>
                        {first.avatar_emoji || '👑'}
                        <div className="absolute -bottom-2 bg-amber-600 text-[10px] text-white px-3 rounded-full font-bold">1°</div>
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/40 to-transparent pointer-events-none" />
                    </div>
                    <div className="w-full bg-gradient-to-b from-amber-200/30 to-amber-500/10 rounded-t-lg h-32 md:h-40 flex flex-col justify-end p-2 text-center border-t border-l border-r border-amber-400/30 relative overflow-hidden">
                        <p className="text-sm md:text-base font-black text-amber-600 dark:text-amber-400 truncate w-full">{first.name}</p>
                        <p className="text-sm font-black text-amber-600 dark:text-amber-400">{first.total_score}</p>
                    </div>
                </div>
            )}
            {third && (
                <div onClick={() => onClick(third)} className="flex flex-col items-center w-1/3 cursor-pointer group hover:-translate-y-1 transition-transform">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-300 border-4 border-orange-400 shadow-lg flex items-center justify-center text-2xl mb-2 relative z-10 overflow-hidden" style={{ backgroundColor: third.avatar_color }}>
                        {third.avatar_emoji || '👤'}
                        <div className="absolute -bottom-2 bg-orange-600 text-[10px] text-white px-2 rounded-full font-bold">3°</div>
                    </div>
                    <div className="w-full bg-orange-300/20 rounded-t-lg h-20 md:h-24 flex flex-col justify-end p-2 text-center border-t border-l border-r border-orange-400/30 relative overflow-hidden">
                        <p className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-200 truncate w-full">{third.name}</p>
                        <p className="text-xs font-mono opacity-70">{third.total_score}</p>
                    </div>
                </div>
            )}
        </div>
    );
};


const TutorialOverlay = ({ onClose }: { onClose: () => void }) => (
    <div className="absolute inset-0 z-[100] bg-white dark:bg-slate-950 p-4 md:p-8 flex flex-col animate-fade-in overflow-y-auto">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div>
                <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Arena Online</h2>
                <p className="text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase tracking-widest mt-2">Guida alla gloria ⚔️</p>
            </div>
            <button onClick={onClose} className="p-4 bg-slate-100 dark:bg-white/10 rounded-2xl text-slate-800 dark:text-white transition-all hover:bg-slate-200 dark:hover:bg-white/20 hover:scale-110 active:scale-90 border border-slate-200 dark:border-white/10">✕</button>
        </div>

        <div className="space-y-8 pb-24 max-w-2xl mx-auto w-full">

            {/* 1. Sessione LIVE */}
            <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2rem] border-2 border-slate-100 dark:border-white/10 shadow-xl group hover:border-blue-500/50 transition-all">
                <div className="flex items-center gap-5 mb-5">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg animate-pulse">📡</div>
                    <div>
                        <h3 className="font-black text-slate-900 dark:text-white text-2xl uppercase tracking-tight">Sessione Live</h3>
                        <p className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-wider">Aggiornamenti istantanei</p>
                    </div>
                </div>
                <p className="text-base md:text-lg text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                    L'Arena non dorme mai! Ogni volta che aggiungi un <span className="text-blue-700 dark:text-blue-400 font-black">contatto</span> o chiudi un <span className="text-emerald-700 dark:text-emerald-400 font-black">contratto</span> nell'app principale, la classifica si aggiorna <span className="underline decoration-blue-500/30">istantaneamente</span> per tutti i membri del team.
                </p>
            </div>

            {/* 2. Unisciti & Crea */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 dark:bg-white/5 p-6 rounded-[2rem] border-2 border-indigo-100 dark:border-white/10">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg">🤝</div>
                    <h4 className="font-black text-slate-900 dark:text-white mb-2 uppercase text-base">Unisciti al Team</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed font-semibold">
                        Inserisci il <span className="text-indigo-700 dark:text-indigo-400 font-black italic">Codice Univoco</span> fornito dal tuo team leader per entrare subito nella battaglia.
                    </p>
                </div>
                <div className="bg-purple-50 dark:bg-white/5 p-6 rounded-[2rem] border-2 border-purple-100 dark:border-white/10">
                    <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-lg">🎨</div>
                    <h4 className="font-black text-slate-900 dark:text-white mb-2 uppercase text-base">Crea Nuovo Team</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-400 leading-relaxed font-semibold">
                        Scegli un nome unico e crea la tua stanza privata. Condividi il nome con i colleghi per iniziare la sfida!
                    </p>
                </div>
            </div>

            {/* 3. Punteggi */}
            <div className="bg-slate-50 dark:bg-white/5 p-8 rounded-[2rem] border-2 border-slate-100 dark:border-white/10 shadow-lg">
                <div className="flex items-center gap-5 mb-6">
                    <div className="w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-3xl shadow-lg">⭐</div>
                    <h3 className="font-black text-slate-900 dark:text-white text-2xl uppercase tracking-tight">Sistema Points</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                    {[
                        { label: 'Contatto', pts: '2', sub: 'Prima interazione', color: 'text-slate-800 dark:text-slate-300' },
                        { label: 'Video Inviato', pts: '5', sub: 'Follow-up digitale', color: 'text-slate-800 dark:text-slate-300' },
                        { label: 'Appuntamento', pts: '20', sub: 'Incontro fissato', color: 'text-blue-700 dark:text-blue-400' },
                        { label: 'Union Light', pts: '30', sub: 'Chiusura Light', color: 'text-indigo-700 dark:text-indigo-400' },
                        { label: 'Family Utility', pts: '50', sub: 'Chiusura Green', color: 'text-orange-600 dark:text-orange-400' },
                    ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white dark:bg-black/20 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                            <div>
                                <span className={`font-black text-lg block ${item.color}`}>{item.label}</span>
                                <span className="text-[10px] uppercase font-bold text-slate-400">{item.sub}</span>
                            </div>
                            <span className="bg-slate-900 dark:bg-white/10 px-5 py-2 rounded-xl text-white font-black text-base shadow-md">{item.pts} PT</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Duelli & Titoli */}
            <div className="bg-red-50 dark:bg-red-950/20 p-8 rounded-[2rem] border-2 border-red-100 dark:border-red-900/30">
                <div className="flex items-center gap-5 mb-5">
                    <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg">⚔️</div>
                    <h3 className="font-black text-red-900 dark:text-red-400 text-2xl uppercase tracking-tight">Duelli & Titoli</h3>
                </div>
                <p className="text-base text-red-800 dark:text-red-200 mb-6 leading-relaxed font-semibold">
                    Analizza le statistiche dei colleghi. Se sei in svantaggio, clicca il tasto <span className="bg-red-600 px-3 py-1 rounded-lg text-white font-black">VS</span> per lanciare una sfida e scuotere la classifica!
                </p>
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    {['👑 L\'Intoccabile', '🎯 Il Cecchino', '🔨 Il Martello', '🦈 Il Closer'].map((t, i) => (
                        <span key={i} className="whitespace-nowrap bg-white dark:bg-black/30 border border-red-200 dark:border-red-900/50 px-5 py-3 rounded-2xl text-sm font-black text-red-700 dark:text-red-400 shadow-md">
                            {t}
                        </span>
                    ))}
                </div>
            </div>

            <button
                onClick={onClose}
                className="w-full py-6 bg-slate-900 dark:bg-gradient-to-r dark:from-blue-600 dark:to-indigo-600 text-white font-black uppercase tracking-widest rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all duration-300 text-xl border-t border-white/20"
            >
                Entra nell'Arena 🚀
            </button>
        </div>
    </div>
);

const TeamLeaderboardModal: React.FC<TeamLeaderboardModalProps> = ({
    isOpen,
    onClose,
    activityLogs,
    userName,
    commercialStartDay
}) => {
    // --- STATE ---
    const [teamCode, setTeamCode] = useState<string | null>(null);
    const [teamData, setTeamData] = useState<Team | null>(null);
    const [teamMembers, setTeamMembers] = useState<OnlineTeamMember[]>([]);
    const [playerId, setPlayerId] = useState<string>('');
    const [joinInput, setJoinInput] = useState('');
    const [createInput, setCreateInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [duelOpponent, setDuelOpponent] = useState<OnlineTeamMember | null>(null);
    const [challengeMode, setChallengeMode] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
    const [notifications, setNotifications] = useState<TeamNotification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const [weeklyWinner, setWeeklyWinner] = useState<{ name: string, score: number } | null>(null);
    const [userAvatar, setUserAvatar] = useState({ emoji: '👤', color: '#6366f1' });
    const [floatingEmoji, setFloatingEmoji] = useState<{ emoji: string, id: number } | null>(null);
    const [tempGoals, setTempGoals] = useState({ daily: 100, weekly: 500, monthly: 3000 });

    // Initialize Player ID & Local Avatar
    useEffect(() => {
        let stored = localStorage.getItem('arena_player_id');
        if (!stored) {
            stored = generateUUID();
            localStorage.setItem('arena_player_id', stored);
        }
        setPlayerId(stored);

        const savedAvatar = localStorage.getItem('arena_user_avatar');
        if (savedAvatar) setUserAvatar(JSON.parse(savedAvatar));

        const savedTeam = localStorage.getItem('arena_team_code');
        if (savedTeam) setTeamCode(savedTeam);
    }, []);

    // FETCH TEAM & NOTIFICATIONS & CALCULATE HISTORY
    useEffect(() => {
        if (!isOpen || !teamCode) return;

        let teamChannel: any;
        let notifChannel: any;

        const fetchTeamData = async () => {
            setLoading(true);
            const { data: teams, error } = await supabase.from('teams').select('*').eq('join_code', teamCode).single();

            if (error || !teams) {
                setLoading(false);
                return;
            }

            setTeamData(teams);
            setTempGoals({
                daily: teams.daily_goal || 100,
                weekly: teams.weekly_goal || 500,
                monthly: teams.monthly_goal || 3000
            });
            const teamId = teams.id;
            localStorage.setItem('arena_team_id', teamId);

            const now = new Date();
            // 1. Refresh My Status (Current & Previous Week)
            let relevantLogs: ActivityLog[] = [];

            // --- Current Stats Calculation ---
            if (challengeMode === 'daily') {
                const today = getTodayDateString();
                relevantLogs = activityLogs.filter(log => log.date === today);
            } else if (challengeMode === 'weekly') {
                const currentWeekId = getWeekIdentifier(now);
                relevantLogs = activityLogs.filter(log => getWeekIdentifier(new Date(log.date)) === currentWeekId);
            } else {
                const { start, end } = getCommercialMonthRange(now, commercialStartDay);
                relevantLogs = activityLogs.filter(log => {
                    const d = new Date(log.date);
                    d.setHours(0, 0, 0, 0);
                    return d.getTime() >= start.getTime() && d.getTime() <= end.getTime();
                });
            }
            const myCalc = calculateMonthlyStats(relevantLogs, "ONLINE", userName, commercialStartDay);

            // --- Previous Week Calculation (For History) ---
            const prevWeekId = getPreviousWeekIdentifier(now);
            const prevLogs = activityLogs.filter(log => getWeekIdentifier(new Date(log.date)) === prevWeekId);
            const prevCalc = calculateMonthlyStats(prevLogs, "ONLINE", userName, commercialStartDay);

            await supabase.from('team_members').upsert({
                team_id: teamId,
                player_id: playerId,
                name: userName || "",
                stats: { ...myCalc.stats, prev_week_score: prevCalc.totalScore, prev_week_id: prevWeekId },
                total_score: myCalc.totalScore,
                last_updated: new Date().toISOString(),
                avatar_emoji: userAvatar.emoji,
                avatar_color: userAvatar.color
            }, { onConflict: 'team_id, player_id' });

            // 2. Fetch Members & Check Winner
            const fetchMembers = async () => {
                const { data: members } = await supabase.from('team_members')
                    .select('*')
                    .eq('team_id', teamId)
                    .order('total_score', { ascending: false });

                if (members) {
                    setTeamMembers(members as OnlineTeamMember[]);

                    // --- VICTORY CHECK LOGIC ---
                    // Find member with highest prev_week_score for the correct prevWeekId
                    let bestPrevScore = -1;
                    let winner = null;
                    members.forEach((m: any) => {
                        const pScore = m.stats?.prev_week_score || 0;
                        const pId = m.stats?.prev_week_id;
                        if (pId === prevWeekId && pScore > bestPrevScore) {
                            bestPrevScore = pScore;
                            winner = m;
                        }
                    });

                    if (winner && bestPrevScore > 0) {
                        const seenKey = `arena_victory_seen_${teamCode}_${prevWeekId}`;
                        const alreadySeen = localStorage.getItem(seenKey);

                        if (!alreadySeen) {
                            setWeeklyWinner({ name: (winner as any).name, score: bestPrevScore });
                            localStorage.setItem(seenKey, 'true');
                        }
                    }
                }
            };

            // 3. Fetch Notifications (Recent 10)
            const fetchNotifications = async () => {
                const { data: notifs } = await supabase.from('notifications')
                    .select('*')
                    .eq('team_id', teamId)
                    .order('created_at', { ascending: false })
                    .limit(10);

                if (notifs) {
                    // Filter for me or broadcast
                    const relevant = notifs.filter((n: TeamNotification) => !n.to_player_id || n.to_player_id === playerId);
                    setNotifications(relevant as TeamNotification[]);
                }
            };

            await fetchMembers();
            await fetchNotifications();

            // 4. Subscriptions
            teamChannel = supabase.channel(`team-${teamId}`)
                .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members', filter: `team_id=eq.${teamId}` }, fetchMembers)
                .subscribe();

            notifChannel = supabase.channel(`notifs-${teamId}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `team_id=eq.${teamId}` },
                    (payload) => {
                        const newNotif = payload.new as TeamNotification;
                        if (!newNotif.to_player_id || newNotif.to_player_id === playerId) {
                            setNotifications(prev => [newNotif, ...prev]);
                            setHasUnread(true);
                            if (newNotif.type === 'poke' && newNotif.to_player_id === playerId) {
                                setFloatingEmoji({ emoji: newNotif.metadata?.emoji || '🙌', id: Date.now() });
                                setTimeout(() => setFloatingEmoji(null), 3000);
                            }
                        }
                    })
                .subscribe();

            setLoading(false);
        };

        fetchTeamData();
        return () => {
            if (teamChannel) supabase.removeChannel(teamChannel);
            if (notifChannel) supabase.removeChannel(notifChannel);
        };
    }, [isOpen, teamCode, challengeMode, activityLogs, userName, commercialStartDay, playerId]);

    const handleJoin = async () => {
        if (!joinInput) return;
        setLoading(true);
        const { data, error } = await supabase.from('teams').select('id').eq('join_code', joinInput).single();
        if (data) {
            setTeamCode(joinInput);
            localStorage.setItem('arena_team_code', joinInput);
        } else alert("Squadra non trovata!");
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!createInput) return;
        setLoading(true);
        const { data: existing } = await supabase.from('teams').select('id').eq('join_code', createInput).single();
        if (existing) { alert("Nome già in uso!"); setLoading(false); return; }

        const { error } = await supabase.from('teams').insert({ join_code: createInput });
        if (!error) {
            setTeamCode(createInput);
            localStorage.setItem('arena_team_code', createInput);
        }
        setLoading(false);
    };

    const handlePoke = async (member: OnlineTeamMember, emoji: string) => {
        await supabase.from('notifications').insert({
            team_id: member.team_id,
            from_player_id: playerId,
            from_player_name: userName,
            to_player_id: member.player_id,
            message: `ti ha inviato un ${emoji}!`,
            type: 'poke',
            metadata: { emoji }
        });
    };

    const updateAvatar = async (emoji: string, color: string) => {
        const newAvatar = { emoji, color };
        setUserAvatar(newAvatar);
        localStorage.setItem('arena_user_avatar', JSON.stringify(newAvatar));
        if (teamCode) {
            const { data: teams } = await supabase.from('teams').select('id').eq('join_code', teamCode).single();
            if (teams) {
                await supabase.from('team_members').update({
                    avatar_emoji: emoji,
                    avatar_color: color
                }).match({ team_id: teams.id, player_id: playerId });
            }
        }
    };

    const handleUpdateGoals = async (daily: number, weekly: number, monthly: number) => {
        if (!teamData) return;
        const { error } = await supabase.from('teams').update({
            daily_goal: daily,
            weekly_goal: weekly,
            monthly_goal: monthly
        }).eq('id', teamData.id);

        if (!error) {
            setTeamData({ ...teamData, daily_goal: daily, weekly_goal: weekly, monthly_goal: monthly });
        }
    };

    if (!isOpen) return null;

    // Calculate Range & Countdown
    const now = new Date();
    let rangeStart: Date, rangeEnd: Date;

    if (challengeMode === 'weekly') {
        rangeStart = startOfWeek(now, { weekStartsOn: 1 });
        rangeEnd = endOfWeek(now, { weekStartsOn: 1 });
    } else {
        const range = getCommercialMonthRange(now, commercialStartDay);
        rangeStart = range.start;
        rangeEnd = range.end;
    }

    const daysRemaining = differenceInDays(rangeEnd, now);
    const rangeString = `${format(rangeStart, 'd MMM', { locale: it })} - ${format(rangeEnd, 'd MMM', { locale: it })}`;
    const isRushMode = isAfter(now, subHours(rangeEnd, 24));

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in text-slate-800 dark:text-slate-100 font-sans">
            {/* Victory Overlay always on top */}
            {weeklyWinner && <VictoryOverlay winnerName={weeklyWinner.name} score={weeklyWinner.score} onClose={() => setWeeklyWinner(null)} />}

            {/* Floating Reaction Emoji */}
            {floatingEmoji && (
                <div className="fixed inset-0 pointer-events-none z-[1000] flex items-center justify-center">
                    <div className="text-9xl animate-reaction-float opacity-0">{floatingEmoji.emoji}</div>
                </div>
            )}

            {duelOpponent && teamMembers.find(m => m.player_id === playerId) && (
                <DuelOverlay me={teamMembers.find(m => m.player_id === playerId)!} opponent={duelOpponent} onClose={() => setDuelOpponent(null)} />
            )}

            <div className={`bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] border-2 relative transition-colors duration-1000 ${isRushMode ? 'border-red-500 shadow-red-500/20' : 'border-slate-200 dark:border-slate-800'}`}>
                {/* TUTORIAL OVERLAY */}
                {showTutorial && <TutorialOverlay onClose={() => setShowTutorial(false)} />}

                {/* PROFILE SIDEBAR/OVERLAY */}
                {showProfile && (
                    <div className="absolute inset-0 z-[90] bg-white dark:bg-slate-900 p-8 animate-fade-in overflow-y-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black uppercase tracking-tight">Profilo Arena</h3>
                            <button onClick={() => setShowProfile(false)} className="p-2 bg-slate-100 dark:bg-white/10 rounded-full">✕</button>
                        </div>
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-32 h-32 rounded-full flex items-center justify-center text-7xl shadow-2xl border-4 border-white/20" style={{ backgroundColor: userAvatar.color }}>
                                {userAvatar.emoji}
                            </div>
                            <div className="w-full space-y-4">
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-500 mb-2 block">Scegli Emoji</label>
                                    <div className="grid grid-cols-6 gap-2">
                                        {ARENA_EMOJIS.map(e => (
                                            <button key={e} onClick={() => updateAvatar(e, userAvatar.color)} className={`p-2 text-2xl rounded-xl border-2 transition-all ${userAvatar.emoji === e ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30' : 'border-transparent hover:bg-slate-100 dark:hover:bg-white/5'}`}>{e}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-500 mb-2 block">Scegli Colore</label>
                                    <div className="flex flex-wrap gap-2">
                                        {ARENA_COLORS.map(c => (
                                            <button key={c} onClick={() => updateAvatar(userAvatar.emoji, c)} className={`w-10 h-10 rounded-full border-4 transition-all ${userAvatar.color === c ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'}`} style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                </div>

                                {/* Goals removed from here */}
                            </div>
                            <button onClick={() => setShowProfile(false)} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-500 transition-colors uppercase mt-4">Salva e Torna</button>
                        </div>
                    </div>
                )}

                {/* TEAM SETTINGS OVERLAY */}
                {showSettings && (
                    <div className="absolute inset-0 z-[95] bg-white dark:bg-slate-900 p-8 animate-fade-in overflow-y-auto">
                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100 dark:border-white/5">
                            <h3 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
                                <span className="text-3xl">⚙️</span> Impostazioni Team
                            </h3>
                            <button onClick={() => setShowSettings(false)} className="p-2 bg-slate-100 dark:bg-white/10 rounded-full">✕</button>
                        </div>

                        <div className="space-y-8 max-w-md mx-auto">
                            <div className="bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-3xl border border-indigo-100 dark:border-indigo-900/40">
                                <h4 className="text-sm font-black uppercase text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                                    <span className="text-xl">🎯</span> Obiettivi Collettivi
                                </h4>
                                <div className="space-y-6">
                                    {/* GOAL GIORNO */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black uppercase text-slate-500">Goal Giorno</label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setTempGoals(prev => ({ ...prev, daily: Math.max(0, prev.daily - 10) }))}
                                                className="w-12 h-12 rounded-xl bg-white dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-black text-indigo-600 hover:bg-slate-50 transition-colors"
                                            >
                                                -
                                            </button>
                                            <div className="flex-1 flex items-center bg-white dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/10 px-4 h-12 shadow-inner">
                                                <input
                                                    type="number"
                                                    value={tempGoals.daily}
                                                    onChange={(e) => setTempGoals(prev => ({ ...prev, daily: parseInt(e.target.value) || 0 }))}
                                                    className="w-full bg-transparent font-black text-center outline-none text-indigo-600 dark:text-indigo-400 text-lg"
                                                />
                                                <span className="text-[10px] font-black ml-2 text-slate-400">PT</span>
                                            </div>
                                            <button
                                                onClick={() => setTempGoals(prev => ({ ...prev, daily: prev.daily + 10 }))}
                                                className="w-12 h-12 rounded-xl bg-white dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-black text-indigo-600 hover:bg-slate-50 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* GOAL SETTIMANA */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black uppercase text-slate-500">Goal Settimana</label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setTempGoals(prev => ({ ...prev, weekly: Math.max(0, prev.weekly - 50) }))}
                                                className="w-12 h-12 rounded-xl bg-white dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-black text-indigo-600 hover:bg-slate-50 transition-colors"
                                            >
                                                -
                                            </button>
                                            <div className="flex-1 flex items-center bg-white dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/10 px-4 h-12 shadow-inner">
                                                <input
                                                    type="number"
                                                    value={tempGoals.weekly}
                                                    onChange={(e) => setTempGoals(prev => ({ ...prev, weekly: parseInt(e.target.value) || 0 }))}
                                                    className="w-full bg-transparent font-black text-center outline-none text-indigo-600 dark:text-indigo-400 text-lg"
                                                />
                                                <span className="text-[10px] font-black ml-2 text-slate-400">PT</span>
                                            </div>
                                            <button
                                                onClick={() => setTempGoals(prev => ({ ...prev, weekly: prev.weekly + 50 }))}
                                                className="w-12 h-12 rounded-xl bg-white dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-black text-indigo-600 hover:bg-slate-50 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>

                                    {/* GOAL MESE */}
                                    <div className="flex flex-col gap-2">
                                        <label className="text-xs font-black uppercase text-slate-500">Goal Mese</label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setTempGoals(prev => ({ ...prev, monthly: Math.max(0, prev.monthly - 100) }))}
                                                className="w-12 h-12 rounded-xl bg-white dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-black text-indigo-600 hover:bg-slate-50 transition-colors"
                                            >
                                                -
                                            </button>
                                            <div className="flex-1 flex items-center bg-white dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/10 px-4 h-12 shadow-inner">
                                                <input
                                                    type="number"
                                                    value={tempGoals.monthly}
                                                    onChange={(e) => setTempGoals(prev => ({ ...prev, monthly: parseInt(e.target.value) || 0 }))}
                                                    className="w-full bg-transparent font-black text-center outline-none text-indigo-600 dark:text-indigo-400 text-lg"
                                                />
                                                <span className="text-[10px] font-black ml-2 text-slate-400">PT</span>
                                            </div>
                                            <button
                                                onClick={() => setTempGoals(prev => ({ ...prev, monthly: prev.monthly + 100 }))}
                                                className="w-12 h-12 rounded-xl bg-white dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 flex items-center justify-center text-xl font-black text-indigo-600 hover:bg-slate-50 transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold mt-4 italic text-center leading-tight">
                                    Modificando questi valori cambierai la sfida per TUTTO il team.
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10">
                                <h4 className="text-sm font-black uppercase text-slate-600 dark:text-slate-400 mb-2">Info Team</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-500 uppercase">Codice Univoco</span>
                                    <span className="font-mono font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800">{teamCode}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    handleUpdateGoals(tempGoals.daily, tempGoals.weekly, tempGoals.monthly);
                                    setShowSettings(false);
                                    alert("Obiettivi sincronizzati con il team! 🚀");
                                }}
                                className="w-full py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all uppercase text-lg border-t border-white/20"
                            >
                                Conferma e Chiudi
                            </button>
                        </div>
                    </div>
                )}

                {/* HEADER */}
                <div className={`relative p-6 transition-all duration-1000 ${isRushMode ? 'bg-gradient-to-tr from-red-950 via-red-900 to-black' : 'bg-gradient-to-tr from-indigo-900 via-indigo-800 to-purple-900'} text-white overflow-hidden shrink-0`}>
                    <div className="absolute top-0 right-0 -mr-4 -mt-4 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-30" />
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-30" />
                    {isRushMode && <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none" />}

                    <div className="relative z-10 flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                            <span className={`text-4xl transition-transform ${isRushMode ? 'scale-125 animate-bounce' : ''}`}>
                                {isRushMode ? '⏰' : '🏆'}
                            </span>
                            <div>
                                <h2 className="text-2xl font-black uppercase tracking-tight text-white drop-shadow-sm">
                                    {isRushMode ? 'RUSH FINALE' : 'Arena Online'}
                                </h2>
                                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
                                    {isRushMode ? 'ULTIME 24 ORE! 🔥' : (teamCode ? `Team: ${teamCode}` : 'Unisciti alla sfida')}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {/* Settings Button */}
                            {teamCode && (
                                <button
                                    onClick={() => setShowSettings(true)}
                                    className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors relative group"
                                    title="Impostazioni Team"
                                >
                                    <span className="text-xl">⚙️</span>
                                </button>
                            )}

                            {/* Profile Button */}
                            {teamCode && (
                                <button
                                    onClick={() => setShowProfile(true)}
                                    className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors relative group"
                                    title="Il Tuo Profilo"
                                >
                                    <span className="text-xl">👤</span>
                                </button>
                            )}

                            {/* Tutorial Button */}
                            <button
                                onClick={() => setShowTutorial(true)}
                                className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
                            >
                                <span className="text-xl">❔</span>
                            </button>

                            {/* Bell Icon */}
                            {teamCode && (
                                <button
                                    onClick={() => { setShowNotifications(!showNotifications); setHasUnread(false); }}
                                    className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors relative"
                                >
                                    <span className="text-xl">🔔</span>
                                    {hasUnread && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-indigo-900"></span>}
                                </button>
                            )}
                            <button onClick={onClose} className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors relative z-50">✕</button>
                        </div>
                    </div>
                    {teamCode && (
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-black/20 p-1 rounded-xl flex gap-1 backdrop-blur-sm border border-white/10">
                                <button onClick={() => setChallengeMode('daily')} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${challengeMode === 'daily' ? 'bg-white text-indigo-900' : 'text-indigo-200 hover:bg-white/5'}`}>Giorno</button>
                                <button onClick={() => setChallengeMode('weekly')} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${challengeMode === 'weekly' ? 'bg-white text-indigo-900' : 'text-indigo-200 hover:bg-white/5'}`}>Settimana</button>
                                <button onClick={() => setChallengeMode('monthly')} className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${challengeMode === 'monthly' ? 'bg-white text-indigo-900' : 'text-indigo-200 hover:bg-white/5'}`}>Mese</button>
                            </div>
                            <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full border ${isRushMode ? 'bg-red-600/40 border-red-400 text-white animate-pulse' : 'bg-indigo-900/40 border-indigo-500/30 text-indigo-200'}`}>
                                <span>📅 {rangeString}</span>
                                <span className="opacity-20">|</span>
                                <span>⌛ {daysRemaining === 0 ? 'ULTIMO GIORNO!' : `-${daysRemaining}gg`}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* LIVE TICKER */}
                {teamCode && <LiveTicker notifications={notifications} />}

                {/* TEAM GOAL PROGRESS */}
                {teamCode && teamData && (
                    <TeamGoalProgress
                        members={teamMembers}
                        teamGoal={
                            challengeMode === 'daily' ? (teamData.daily_goal || 100) :
                                challengeMode === 'weekly' ? (teamData.weekly_goal || 500) :
                                    (teamData.monthly_goal || 3000)
                        }
                        mode={challengeMode}
                    />
                )}

                {/* NOTIFICATIONS PANEL */}
                {showNotifications && (
                    <div className="absolute top-24 right-4 z-[60] w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden max-h-96 overflow-y-auto animate-fade-in-down">
                        <div className="p-3 bg-slate-100 dark:bg-slate-900 flex justify-between items-center sticky top-0 z-10">
                            <span className="font-bold text-xs uppercase text-slate-500">Notifiche</span>
                            <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-red-500 p-1 bg-slate-200 dark:bg-slate-800 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        {notifications.length === 0 ? (
                            <div className="p-6 text-center text-slate-400 text-sm">Nessuna notifica</div>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className="p-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{n.from_player_name}</span>
                                        <span className="text-[10px] text-slate-400">{new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-xs text-slate-700 dark:text-slate-300">{n.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* BODY */}
                <div className="p-0 overflow-y-auto flex-1 bg-slate-50 dark:bg-slate-950/50 relative">
                    {loading && <div className="absolute inset-0 z-50 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>}

                    {!teamCode ? (
                        <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-center space-y-8">
                            <div className="max-w-xs w-full">
                                <h3 className="text-lg font-black uppercase text-indigo-600 dark:text-indigo-400 mb-2">Unisciti a un Team</h3>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Codice Squadra (es. LEONI)" className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold uppercase text-center" value={joinInput} onChange={e => setJoinInput(e.target.value)} />
                                    <button onClick={handleJoin} className="bg-indigo-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-indigo-500/30">GO</button>
                                </div>
                            </div>
                            <div className="w-full border-t border-slate-200 dark:border-slate-800 relative"><span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 dark:bg-slate-900 px-2 text-xs font-bold text-slate-400">OPPURE</span></div>
                            <div className="max-w-xs w-full">
                                <h3 className="text-lg font-black uppercase text-purple-600 dark:text-purple-400 mb-2">Crea Nuovo Team</h3>
                                <div className="flex gap-2">
                                    <input type="text" placeholder="Nome Squadra" className="flex-1 p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-bold uppercase text-center" value={createInput} onChange={e => setCreateInput(e.target.value)} />
                                    <button onClick={handleCreate} className="bg-purple-600 text-white p-3 rounded-xl font-bold shadow-lg shadow-purple-500/30">Crea</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="pb-20">
                            {teamMembers.length >= 2 && <Podium winners={teamMembers.slice(0, 3)} onClick={(m) => { if (m.player_id !== playerId) setDuelOpponent(m); }} />}
                            <div className="p-4 space-y-3">
                                {teamMembers.map((member, index) => {
                                    if (teamMembers.length >= 2 && index < 3) return null;
                                    const rank = index + 1;
                                    const title = getBattleTitle(member, index, teamMembers);
                                    const isMVP = index === 0;

                                    return (
                                        <div key={member.id} className={`group relative p-4 rounded-2xl flex items-center justify-between transition-all duration-500 cursor-pointer overflow-hidden ${isMVP ? 'bg-gradient-to-r from-amber-50 to-white dark:from-amber-950/20 dark:to-slate-800 border-2 border-amber-400/50 shadow-xl shadow-amber-500/10' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-500/50'}`}>
                                            {isMVP && <div className="absolute inset-0 bg-gradient-to-r from-amber-400/5 to-transparent animate-pulse pointer-events-none" />}

                                            <div className="flex items-center gap-4 relative z-10" onClick={() => { if (member.player_id !== playerId) setDuelOpponent(member); }}>
                                                <div className="relative">
                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner border border-white/20 overflow-hidden" style={{ backgroundColor: member.avatar_color || '#6366f1' }}>
                                                        {member.avatar_emoji || (isMVP ? '👑' : '👤')}
                                                    </div>
                                                    <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border-2 ${isMVP ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-lg' : 'bg-slate-200 dark:bg-slate-700 border-slate-300 dark:border-slate-600'}`}>
                                                        {rank}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className={`font-black tracking-tight ${isMVP ? 'text-amber-700 dark:text-amber-400 italic' : ''}`}>{member.name}</p>
                                                        {member.player_id === playerId && <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-widest">TU</span>}
                                                    </div>
                                                    <span className={`text-[10px] uppercase font-black tracking-widest ${isMVP ? 'text-amber-600' : 'text-indigo-400'}`}>{title}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 relative z-10">
                                                {member.player_id !== playerId && (
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        {['⚡', '🙌', '🔥'].map(emoji => (
                                                            <button
                                                                key={emoji}
                                                                onClick={(e) => { e.stopPropagation(); handlePoke(member, emoji); }}
                                                                className="w-8 h-8 flex items-center justify-center bg-white dark:bg-slate-700 rounded-lg shadow-md border border-slate-200 dark:border-slate-600 hover:scale-110 active:scale-95 transition-transform"
                                                            >
                                                                {emoji}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="text-right">
                                                    <span className={`text-2xl font-black ${isMVP ? 'text-amber-600 dark:text-amber-400' : 'text-slate-900 dark:text-white'}`}>{member.total_score}</span>
                                                    <p className="text-[8px] font-black uppercase text-slate-400 leading-none">Punti</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                {teamMembers.length === 0 && <div className="text-center p-8 text-slate-400">Nessun membro...</div>}
                            </div>
                            <div className="text-center p-4 mt-4"><button onClick={() => { localStorage.removeItem('arena_team_code'); setTeamCode(null); }} className="text-xs text-red-500 font-bold uppercase hover:underline">Esci dal Team</button></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamLeaderboardModal;
