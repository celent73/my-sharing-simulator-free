import React from 'react';
import { VisionBoardData } from '../types';

interface PersonalSalesWidgetProps {
    dailyEarnings: number;
    monthlyEarnings: number;
    visionBoardData?: VisionBoardData;
    onOpenSettings?: () => void;
    onUpdateTarget?: (newAmount: number) => void;
}

const PersonalSalesWidget: React.FC<PersonalSalesWidgetProps> = ({
    dailyEarnings,
    monthlyEarnings,
    visionBoardData,
    onOpenSettings,
    onUpdateTarget
}) => {
    // Determine progress if vision board is active
    const target = visionBoardData?.enabled ? visionBoardData.targetAmount : 0;
    const progress = target > 0 ? Math.min(100, (monthlyEarnings / target) * 100) : 0;
    const remaining = Math.max(0, target - monthlyEarnings);

    const [isEditing, setIsEditing] = React.useState(false);
    const [editValue, setEditValue] = React.useState(target.toString());

    // Update edit value when target changes (e.g. from props)
    React.useEffect(() => {
        setEditValue(target.toString());
    }, [target]);

    const handleSave = () => {
        const newTarget = parseFloat(editValue);
        if (!isNaN(newTarget) && newTarget >= 0) {
            if (onUpdateTarget) {
                onUpdateTarget(newTarget);
            } else if (onOpenSettings) {
                // Fallback if no direct updater
                onOpenSettings();
            }
        }
        setIsEditing(false);
    };

    // Keep enter key support
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') setIsEditing(false);
    };

    return (
        <div className="relative overflow-hidden rounded-3xl mb-6 shadow-xl group border-2 border-white/20 dark:border-slate-700">
            {/* Background Image / Gradient - ALWAYS DEFAULT */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 group-hover:scale-110 transition-transform duration-700" />

            {/* Decorative Overlay */}
            <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] group-hover:backdrop-blur-none transition-all duration-500"></div>

            <div className="relative p-6 text-white z-10">
                {/* Header Row */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-200 mb-1">
                            GUADAGNI DA VENDITE PERSONALI
                        </h3>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 shadow-md">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-blue-200 uppercase">Oggi</span>
                            <span className="text-lg font-black tracking-tight leading-none text-emerald-300">
                                +€{dailyEarnings.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Earnings & Progress */}
                <div className="flex items-end justify-between mt-2">
                    <div>
                        <p className="text-[10px] text-blue-100 font-medium mb-0.5">Totale Mese</p>
                        <div className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-100 drop-shadow-md">
                            €{monthlyEarnings.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                    </div>

                    {/* Progress Stats */}
                    {target > 0 && (
                        <div className="text-right">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-white/80">
                                    {progress.toFixed(0)}%
                                </span>
                                <span className="text-[10px] text-blue-200">
                                    Mancano €{remaining.toLocaleString('it-IT', { minimumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Bar Line */}
                {target > 0 && (
                    <div className="w-full bg-black/30 h-2 rounded-full mt-5 overflow-hidden border border-white/10">
                        <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-[0_0_10px_rgba(52,211,153,0.5)] transition-all duration-1000 ease-out relative"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 animate-pulse"></div>
                        </div>
                    </div>
                )}

                {/* Edit Target Button / Display */}
                <div className="mt-4 flex justify-end">
                    {isEditing ? (
                        <div className="flex items-center gap-2 bg-white/20 p-2 rounded-xl backdrop-blur-sm animate-scale-up">
                            <span className="text-[10px] font-bold text-white uppercase mr-1">Obiettivo:</span>
                            <input
                                type="number"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-24 bg-white/20 border border-white/50 rounded-lg px-2 py-1 text-sm font-bold text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white"
                                autoFocus
                            />
                            <button onClick={handleSave} className="bg-white text-blue-600 hover:bg-blue-50 px-3 py-1 rounded-lg font-bold text-xs uppercase shadow-sm transition-transform active:scale-95">OK</button>
                        </div>
                    ) : (
                        <div
                            onClick={() => setIsEditing(true)}
                            className="group/target cursor-pointer relative overflow-hidden bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/50 backdrop-blur-md rounded-xl px-4 py-2 transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-3"
                        >
                            <div className="bg-white/20 p-1.5 rounded-lg group-hover/target:rotate-12 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="text-[10px] font-bold text-blue-200 uppercase tracking-widest leading-none mb-0.5">Obiettivo</span>
                                <span className="text-lg font-black text-white tracking-tight leading-none group-hover/target:text-emerald-300 transition-colors">
                                    {target > 0 ? `€${target.toLocaleString('it-IT')}` : "IMPOSTA"}
                                </span>
                            </div>
                            {target === 0 && <span className="animate-pulse text-lg">👈</span>}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default PersonalSalesWidget;
