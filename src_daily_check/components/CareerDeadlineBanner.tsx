import React from 'react';
import { CareerStatusInfo } from '../utils/careerUtils';

interface CareerDeadlineBannerProps {
    careerStatus: CareerStatusInfo | null;
    targetDates: Record<string, string>;
    onOpenCareerPath?: () => void;
}

const CareerDeadlineBanner: React.FC<CareerDeadlineBannerProps> = ({ careerStatus, targetDates, onOpenCareerPath }) => {
    const deadline = React.useMemo(() => {
        const entries = Object.entries(targetDates).filter(([, d]) => !!d);
        if (entries.length === 0) return null;

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Ordina per data crescente e trova la prima data futura o più vicina
        const sorted = entries
            .map(([name, dateStr]) => {
                const date = new Date(dateStr);
                const diff = Math.ceil((date.getTime() - now.getTime()) / 86400000);
                return { name, date, diff };
            })
            .filter(i => !isNaN(i.date.getTime()))
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        if (sorted.length === 0) return null;

        // Prendi la prima data futura; se tutte passate, prendi l'ultima
        const chosen = sorted.find(i => i.diff >= 0) ?? sorted[sorted.length - 1];

        let message: string;
        if (chosen.diff > 0) {
            message = `Obiettivo "${chosen.name}" tra ${chosen.diff} giorni (${chosen.date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })})`;
        } else if (chosen.diff === 0) {
            message = `Oggi scade il traguardo "${chosen.name}"! Dai il massimo! 🔥`;
        } else {
            message = `Traguardo "${chosen.name}" scaduto il ${chosen.date.toLocaleDateString('it-IT', { day: '2-digit', month: 'short' })} — Non mollare!`;
        }

        return { message, daysLeft: chosen.diff };
    }, [targetDates]);

    if (!deadline) return null;

    const { message, daysLeft } = deadline;

    const colors = daysLeft > 15
        ? {
            glow: 'from-emerald-500 to-teal-400',
            bg: 'bg-gradient-to-r from-emerald-950/80 to-slate-900/80',
            border: 'border-emerald-500/40',
            dot: 'bg-emerald-400',
            label: 'text-emerald-400',
            dotGlow: 'shadow-[0_0_12px_#34d399]',
        }
        : daysLeft > 5
        ? {
            glow: 'from-amber-500 to-yellow-400',
            bg: 'bg-gradient-to-r from-yellow-950/80 to-slate-900/80',
            border: 'border-amber-500/40',
            dot: 'bg-amber-400',
            label: 'text-amber-400',
            dotGlow: 'shadow-[0_0_12px_#fbbf24]',
        }
        : {
            glow: 'from-red-600 to-orange-500',
            bg: 'bg-gradient-to-r from-red-950/80 to-slate-900/80',
            border: 'border-red-500/40',
            dot: 'bg-red-400',
            label: 'text-red-400',
            dotGlow: 'shadow-[0_0_12px_#f87171]',
        };

    return (
        <div className="w-full py-2 z-40 relative">
            <div className={`relative w-full max-w-5xl mx-auto`}>
                {/* Glow bordo */}
                <div className={`absolute -inset-[1.5px] rounded-2xl bg-gradient-to-r ${colors.glow} opacity-60 blur-[5px] pointer-events-none`} />
                
                <div
                    onClick={onOpenCareerPath}
                    className={`relative flex items-center gap-4 sm:gap-6 ${colors.bg} backdrop-blur-2xl border ${colors.border} rounded-2xl p-4 sm:p-6 md:p-8 w-full ${onOpenCareerPath ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
                >
                    {/* Dot animato - Smaller on small screens */}
                    <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center bg-white/5`}>
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${colors.dot} ${colors.dotGlow} animate-pulse`} />
                    </div>
                    
                    {/* Testo */}
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2 sm:mb-1 gap-1">
                            <p className={`text-[11px] sm:text-[14px] font-black ${colors.label} uppercase tracking-[0.2em] leading-none`}>
                                🏆 SCADENZA CARRIERA
                            </p>
                            {careerStatus && (
                                <p className="text-[10px] sm:text-[11px] font-bold text-white/50 uppercase flex items-center gap-1.5">
                                    <span className="opacity-50 tracking-tighter">Ottenuti:</span>
                                    <span className="text-white">{careerStatus.totalClients} / {careerStatus.clientsForNextLevel > 0 && careerStatus.clientsForNextLevel < 9000 ? careerStatus.clientsForNextLevel : 11}</span>
                                </p>
                            )}
                        </div>
                        <p className="text-[13px] sm:text-base md:text-lg font-bold text-white leading-snug">
                            {message}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CareerDeadlineBanner;
