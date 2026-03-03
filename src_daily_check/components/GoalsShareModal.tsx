import React, { useRef, useState } from 'react';
import { ActivityType, UserProfile, GoalPeriod } from '../types';
import { ACTIVITY_LABELS, ACTIVITY_COLORS, activityIcons } from '../constants';
import html2canvas from 'html2canvas';

interface GoalsShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    goals: GoalPeriod;
    period: 'daily' | 'weekly' | 'monthly';
    userProfile: UserProfile;
    customLabels?: Record<ActivityType, string>;
}

const GoalsShareModal: React.FC<GoalsShareModalProps> = ({ isOpen, onClose, goals, period, userProfile, customLabels }) => {
    const storyRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    // Get period string localized
    const periodLabel = period === 'daily' ? 'GIORNALIERI' : period === 'weekly' ? 'SETTIMANALI' : 'MENSILI';
    const dateStr = new Date().toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });

    const handleDownload = async () => {
        if (!storyRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await html2canvas(storyRef.current, {
                scale: 2, // High resolution
                useCORS: true,
                backgroundColor: null,
            });

            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = `daily-check-goals-${period}-${new Date().toISOString().split('T')[0]}.png`;
            link.click();
        } catch (error) {
            console.error("Error generating story:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <div className="bg-white dark:bg-black rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800" onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-black">
                    <h3 className="font-bold text-slate-700 dark:text-white">Anteprima Obiettivi</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Preview Area - Story Format */}
                <div ref={storyRef} className="relative bg-black w-full min-h-[650px] h-auto p-6 flex flex-col justify-between group cursor-default select-none">
                    {/* Dynamic Background - Emerald/Gold Theme for Goals */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-slate-900 to-black opacity-100"></div>
                    <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

                    {/* Checkered/Grid Pattern Overlay */}
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                    {/* Content */}
                    <div className="relative z-10 text-white h-full flex flex-col">
                        {/* Brand */}
                        <div className="flex items-center justify-between mb-6 opacity-90">
                            <div className="flex items-center gap-2 bg-white/10 p-1.5 pr-3 rounded-full backdrop-blur-md border border-white/10">
                                <div className="bg-gradient-to-br from-emerald-500 to-teal-400 p-1.5 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <span className="font-bold tracking-wide text-xs uppercase">Daily Check</span>
                            </div>
                            <span className="text-xs font-mono opacity-70 uppercase">{dateStr}</span>
                        </div>

                        {/* Headline */}
                        <div className="mb-6">
                            <h2 className="text-4xl font-black leading-none tracking-tighter drop-shadow-2xl mb-1">
                                MY <span className="text-emerald-400">GOALS</span>
                            </h2>
                            <p className="font-bold text-white/60 tracking-[0.2em] text-sm uppercase">{periodLabel}</p>
                            <div className="h-1 w-16 bg-emerald-500 rounded-full mt-3"></div>
                        </div>

                        {/* Goals List */}
                        <div className="space-y-3 mb-auto">
                            {Object.values(ActivityType).map((activity) => {
                                const target = goals?.[activity] || 0;
                                const label = customLabels?.[activity] || ACTIVITY_LABELS[activity];
                                const color = ACTIVITY_COLORS[activity];

                                if (target === 0) return null;

                                return (
                                    <div key={activity} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-white/10 text-white/90">
                                                {activityIcons[activity]}
                                            </div>
                                            <span className="font-bold text-sm text-white/80 uppercase tracking-wide">{label}</span>
                                        </div>
                                        <div className="text-2xl font-black text-emerald-300 drop-shadow-sm">
                                            {target}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {userProfile.targetQualification && (
                            <div className="mt-4 p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🏆</span>
                                    <span className="text-amber-200 text-xs font-bold uppercase tracking-widest">Next Level</span>
                                </div>
                                <span className="text-lg font-black text-amber-400 drop-shadow-sm uppercase">{userProfile.targetQualification}</span>
                            </div>
                        )}

                        {/* Footer / User */}
                        <div className="mt-8 text-center relative z-10">
                            <p className="text-[10px] font-bold text-emerald-400/80 uppercase tracking-[0.3em] mb-3">Target Locked By</p>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight drop-shadow-xl transform scale-105">
                                {(userProfile.firstName || userProfile.lastName) ? `${userProfile.firstName} ${userProfile.lastName}` : "Tuo Nome"}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50 dark:bg-black border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {isGenerating ? 'Generazione...' : 'Condividi Obiettivi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GoalsShareModal;
