import React, { useState, useEffect } from 'react';
import { VisionBoardData } from '../types';

interface DreamTrackerWidgetProps {
    visionBoardData: VisionBoardData;
    autoPersonalEarnings: number;          // calcolati automaticamente dai contratti
    onUpdateEarnings: (network: number) => void;
}

const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const formatEur = (n: number) =>
    n.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

const getMotivationalMessage = (pct: number): { text: string; emoji: string; color: string } => {
    if (pct >= 100) return { text: 'SOGNO RAGGIUNTO! Prenditi quello che meriti!', emoji: '🎉', color: 'text-emerald-300' };
    if (pct >= 75) return { text: 'Quasi lì! Dai il massimo!', emoji: '🔥', color: 'text-orange-300' };
    if (pct >= 50) return { text: 'Oltre la metà strada! Il sogno si avvicina!', emoji: '✨', color: 'text-yellow-300' };
    if (pct >= 25) return { text: "Sei sulla strada giusta! Continua così!", emoji: '💪', color: 'text-blue-300' };
    return { text: 'Ogni grande viaggio inizia dal primo passo!', emoji: '🚀', color: 'text-violet-300' };
};

type EditField = 'personal' | 'network' | null;

const DreamTrackerWidget: React.FC<DreamTrackerWidgetProps> = ({
    visionBoardData,
    autoPersonalEarnings,
    onUpdateEarnings,
}) => {
    const currentMonth = getCurrentMonth();

    // Auto-reset se siamo in un nuovo mese
    const savedPersonal =
        visionBoardData.earningsMonth === currentMonth
            ? (visionBoardData.personalEarnings ?? 0)
            : 0;
    const savedNetwork =
        visionBoardData.earningsMonth === currentMonth
            ? (visionBoardData.networkEarnings ?? 0)
            : 0;

    const [editField, setEditField] = useState<EditField>(null);
    const [editValue, setEditValue] = useState('');

    const personal = autoPersonalEarnings; // automatico dai contratti
    const network = savedNetwork;
    const total = personal + network;
    const target = visionBoardData.targetAmount || 0;
    const progress = target > 0 ? Math.min(100, (total / target) * 100) : 0;
    const remaining = Math.max(0, target - total);
    const motivation = getMotivationalMessage(progress);

    const startEdit = (field: EditField) => {
        setEditField(field);
        setEditValue(''); // empty — user types the amount to ADD
    };

    const confirmEdit = () => {
        const val = parseFloat(editValue);
        if (isNaN(val) || val <= 0) { setEditField(null); return; }
        // SOMMA al totale rete esistente del mese
        onUpdateEarnings(network + val);
        setEditField(null);
    };

    const resetField = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateEarnings(0);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') confirmEdit();
        if (e.key === 'Escape') setEditField(null);
    };

    return (
        <div className="relative overflow-hidden rounded-3xl mb-6 shadow-2xl group border-2 border-white/10 dark:border-purple-900/40">
            {/* Background */}
            {visionBoardData.imageData ? (
                <>
                    <div
                        className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-110 transition-transform duration-700"
                        style={{ backgroundImage: `url(${visionBoardData.imageData})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
                </>
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-indigo-700 to-violet-900 group-hover:scale-105 transition-transform duration-700" />
            )}

            {/* Glow effect when close to target */}
            {progress >= 75 && (
                <div className="absolute inset-0 animate-pulse bg-emerald-400/10 pointer-events-none rounded-3xl" />
            )}

            <div className="relative p-6 text-white z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-purple-200 mb-1">
                            🌟 IL TUO SOGNO
                        </p>
                        <h3 className="text-xl font-black text-white drop-shadow-md leading-tight">
                            {visionBoardData.title || 'Il mio obiettivo'}
                        </h3>
                    </div>
                    {target > 0 && (
                        <div className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20 text-right">
                            <p className="text-[10px] font-bold text-purple-200 uppercase">Obiettivo</p>
                            <p className="text-lg font-black text-white">€{formatEur(target)}</p>
                        </div>
                    )}
                </div>

                {/* Earnings Cards */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                    {/* Personal Earnings — AUTOMATICO dai contratti */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">💰 Pers. (auto)</p>
                        <p className="text-2xl font-black text-white leading-none">€{formatEur(personal)}</p>
                        <p className="text-[10px] text-blue-200/60 mt-1">🤖 Dai tuoi contratti</p>
                    </div>

                    {/* Network Earnings — MANUALE */}
                    <div
                        onClick={() => editField !== 'network' && startEdit('network')}
                        className={`cursor-pointer bg-white/10 hover:bg-white/20 backdrop-blur-md border ${editField === 'network' ? 'border-emerald-400 ring-2 ring-emerald-400/50' : 'border-white/20 hover:border-white/40'} rounded-2xl p-4 transition-all duration-300 hover:scale-105 active:scale-95`}
                    >
                        {editField === 'network' ? (
                            <div onClick={e => e.stopPropagation()} className="flex flex-col gap-2">
                                <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest">🤝 Aggiungi guadagno rete</p>
                                <input
                                    type="number"
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onBlur={confirmEdit}
                                    autoFocus
                                    className="w-full bg-white/20 border border-white/40 rounded-xl px-3 py-1.5 text-sm font-black text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    placeholder="Es. 300"
                                />
                                <p className="text-[10px] text-emerald-200/70">Verrà aggiunto al tot. di €{formatEur(network)}</p>
                            </div>
                        ) : (
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-1">🤝 Rete</p>
                                    <p className="text-2xl font-black text-white leading-none">€{formatEur(network)}</p>
                                    <p className="text-[10px] text-white/50 mt-1">+ Tocca per aggiungere</p>
                                </div>
                                {network > 0 && (
                                    <button onClick={e => resetField(e)} className="text-white/30 hover:text-red-400 text-xs font-bold transition-colors p-1" title="Azzera">✕</button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Totale vs Obiettivo */}
                {target > 0 && (
                    <>
                        <div className="flex justify-between items-baseline mb-2">
                            <div>
                                <p className="text-[10px] text-white/60 font-medium">Totale questo mese</p>
                                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 drop-shadow-md">
                                    €{formatEur(total)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-white/90">{progress.toFixed(0)}%</p>
                                <p className="text-[11px] text-white/60">
                                    {progress >= 100 ? '🎉 Raggiunto!' : `Mancano €${formatEur(remaining)}`}
                                </p>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden border border-white/10 mb-4">
                            <div
                                className={`h-full rounded-full transition-all duration-1000 ease-out relative ${progress >= 100
                                    ? 'bg-gradient-to-r from-emerald-400 to-cyan-300 shadow-[0_0_20px_rgba(52,211,153,0.7)]'
                                    : progress >= 75
                                        ? 'bg-gradient-to-r from-orange-400 to-yellow-300 shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                                        : 'bg-gradient-to-r from-purple-400 to-pink-400 shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                                    }`}
                                style={{ width: `${Math.max(progress, 2)}%` }}
                            >
                                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/60 animate-pulse rounded-full" />
                            </div>
                        </div>
                    </>
                )}

                {/* Motivational Message */}
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/15">
                    <span className="text-lg">{motivation.emoji}</span>
                    <p className={`text-[12px] font-black ${motivation.color} leading-tight`}>
                        {motivation.text}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DreamTrackerWidget;
