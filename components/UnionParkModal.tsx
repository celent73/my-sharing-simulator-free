import React, { useState, useEffect } from 'react';
import { X, Sun, Info, TrendingUp, Wallet, Check, RotateCcw, Minus, Plus, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SharyTrigger from './SharyTrigger';
import { SharingParkFocusMode } from './SharingParkFocusMode';

interface UnionParkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (panels: number, pun: number, duration: number) => void;
    initialPanels?: number;
    initialPun?: number;
    initialDuration?: number;
}

export const UnionParkModal: React.FC<UnionParkModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    initialPanels = 0,
    initialPun = 0.20,
    initialDuration = 26
}) => {
    const { language } = useLanguage();
    const [panels, setPanels] = useState(initialPanels ?? 1);
    const [pun, setPun] = useState(initialPun || 0.20);
    const [simulationYears, setSimulationYears] = useState(initialDuration || 26);
    const [monthlyBill, setMonthlyBill] = useState(0);
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);

    const handleReset = () => {
        setPanels(0);
        setPun(0.20);
        setSimulationYears(26);
        setMonthlyBill(0);
    };

    // Suggest standard PUN values
    const PUN_OPTIONS = [0.15, 0.20, 0.25, 0.30];

    useEffect(() => {
        if (isOpen) {
            setPanels(initialPanels ?? 1);
        }
    }, [isOpen, initialPanels]);

    if (!isOpen) return null;

    // --- CALCULATIONS ---
    const purchaseCostValue = panels * 780;

    // As per user feedback, the yield is annual. 
    // From screenshot: 10 panels @ 0.20 PUN = 66.80€/month. So for annual we multiply by 12.
    // Result: 66.80 * 12 / 10 / 0.20 = 400.8 multiplier total, or just * 12 on the previous monthly-based multiplier.
    const annualYield = pun * 33.4 * panels * 12;
    const totalYieldLongTerm = annualYield * simulationYears;
    const roiTotal = (totalYieldLongTerm / purchaseCostValue) * 100;
    // Payback calculation based on annual yield
    const paybackMonths = purchaseCostValue / (annualYield / 12 || 1);
    const paybackYears = Math.floor(paybackMonths / 12);
    const remainingMonths = Math.round(paybackMonths % 12);

    // Panels needed to zero the bill
    // monthlyYieldPerPanel = pun * 33.4
    const monthlyYieldPerPanel = pun * 33.4;

    const panelsNeeded = monthlyBill > 0 ? Math.ceil(monthlyBill / (monthlyYieldPerPanel || 1)) : 0;

    const { t } = useLanguage();

    return (
        <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300 overflow-y-auto">
            <div className="bg-white/90 backdrop-blur-2xl w-full h-auto sm:w-[95vw] lg:w-[92vw] xl:max-w-[1600px] sm:rounded-[3rem] shadow-2xl overflow-hidden relative animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 border-t sm:border border-white/80 flex flex-col max-h-[95vh]">

                {/* HEADER MODALE PREMIUM */}
                <div className="p-8 pb-4 flex justify-between items-start shrink-0">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-emerald-500/20 ring-4 ring-white">
                            <Sun size={32} strokeWidth={2.5} className="animate-spin-slow" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-none tracking-tighter">Sharing Park</h2>
                                <SharyTrigger
                                    message="Benvenuto nello Sharing Park! Seleziona quanti pannelli vuoi (da 1 a 20). Ogni pannello ti garantisce un rendimento mensile passivo basato sul PUN. Usa il bottone 'Obiettivo Azzera Bolletta' per calcolare quanti te ne servono per coprire le tue spese!"
                                    messageDe="Willkommen im Sharing Park! Wähle, wie viele Paneele du möchtest (von 1 bis 20). Jedes Paneel garantiert dir ein passives monatliches Einkommen basierend auf dem PUN. Nutze den Button 'Ziel: Rechnung Null', um zu berechnen, wie viele du brauchst, um deine Ausgaben zu decken!"
                                    messageEn="Welcome to Sharing Park! Select how many panels you want (from 1 to 20). Each panel guarantees you a passive monthly income based on the PUN. Use the 'Zero Bill Goal' button to calculate how many you need to cover your expenses!"
                                />
                            </div>
                            <div className="mt-1 flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    <p className="text-xs font-black text-emerald-600/70 uppercase tracking-widest">{t('union_park.subtitle')}</p>
                                </div>
                                <button
                                    onClick={() => setIsFocusModeOpen(true)}
                                    className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                                >
                                    Focus Mode
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleReset} className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl border border-red-100/50 hover:bg-red-500 hover:text-white transition-all active:scale-95" title="Reset"><RotateCcw size={22} /></button>
                        <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-400 rounded-2xl border border-slate-200/50 hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95"><X size={24} strokeWidth={3} /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 sm:space-y-10">

                    {/* OBIETTIVO AZZERA BOLLETTA PREMIUM */}
                    <div className="bg-white/50 border-2 border-white rounded-[2.5rem] p-8 shadow-xl shadow-emerald-100/30">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                                <Wallet size={24} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-xl md:text-2xl font-black text-slate-900 leading-none tracking-tighter">{t('union_park.zero_bill_title')}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                            <div className="space-y-2">
                                <label className="text-xs md:text-base font-black text-slate-400 uppercase tracking-widest block ml-1">{t('union_park.bill_label')}</label>
                                <div className="relative group">
                                    <input
                                        type="number"
                                        value={monthlyBill || ''}
                                        onChange={(e) => setMonthlyBill(parseFloat(e.target.value) || 0)}
                                        placeholder="0"
                                        className="w-full px-6 py-6 md:py-8 rounded-2xl bg-white border border-slate-200 text-3xl md:text-5xl font-black text-emerald-600 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none shadow-sm"
                                    />
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl md:text-2xl">€</span>
                                </div>
                            </div>
                            {monthlyBill > 0 && (
                                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 p-8 rounded-[2rem] text-white text-center shadow-2xl shadow-emerald-500/30 animate-in zoom-in-95 duration-500 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass-pass.png')] opacity-10"></div>
                                    <div className="relative z-10">
                                        <p className="text-xs md:text-base font-black uppercase tracking-[0.2em] opacity-60 mb-1">{t('union_park.panels_needed_label')}</p>
                                        <p className="text-6xl md:text-8xl font-black tracking-tighter">{panelsNeeded}</p>
                                        <button
                                            onClick={() => setPanels(panelsNeeded)}
                                            className="mt-3 px-6 py-2 bg-white/20 hover:bg-white text-emerald-700 rounded-full text-xs font-black uppercase tracking-widest transition-all"
                                        >
                                            {t('union_park.apply_simulation')}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Settings Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Input Controls */}
                        <div className="space-y-4">
                            {/* Panels Selector */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-base md:text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('union_park.panels_label')}</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={panels}
                                            onChange={(e) => setPanels(Math.max(1, parseInt(e.target.value) || 0))}
                                            className="w-16 sm:w-32 bg-transparent text-right text-2xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setPanels(prev => Math.max(1, prev - 1))}
                                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-500/20 transition-all active:scale-95"
                                    >
                                        <Minus size={16} className="sm:w-5 sm:h-5" strokeWidth={3} />
                                    </button>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={panels}
                                        onChange={(e) => setPanels(parseInt(e.target.value))}
                                        className="flex-1 h-1.5 sm:h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full appearance-none cursor-pointer accent-emerald-600"
                                    />
                                    <button
                                        onClick={() => setPanels(prev => Math.min(100, prev + 1))}
                                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-500/20 transition-all active:scale-95"
                                    >
                                        <Plus size={16} className="sm:w-5 sm:h-5" strokeWidth={3} />
                                    </button>
                                </div>
                                <div className="flex justify-between text-[10px] sm:text-xs font-bold text-gray-400">
                                    <span>1</span>
                                    <span>50</span>
                                    <span>100</span>
                                </div>
                            </div>

                            {/* PUN Selector */}
                            <div className="space-y-4">
                                <label className="text-base md:text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">{t('union_park.pun_label')}</label>

                                <div className="relative group">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={pun}
                                        onChange={(e) => setPun(parseFloat(e.target.value) || 0)}
                                        className="w-full px-6 py-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-2xl sm:text-5xl font-black text-emerald-600 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs sm:text-lg">€/kWh</div>
                                </div>

                                <div className="flex gap-2">
                                    {PUN_OPTIONS.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setPun(opt)}
                                            className={`flex-1 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all border ${pun === opt ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-300'}`}
                                        >
                                            {opt.toFixed(2)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Additional Stats & Duration */}
                        <div className="space-y-4">
                            {/* Duration Selector */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm md:text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('union_park.years_label')}</label>
                                    <span className="text-4xl sm:text-7xl font-black text-emerald-600 dark:text-emerald-400">{simulationYears}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    value={simulationYears}
                                    onChange={(e) => setSimulationYears(parseInt(e.target.value))}
                                    className="w-full h-1.5 sm:h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full appearance-none cursor-pointer accent-emerald-600"
                                />
                                <div className="flex justify-between text-[10px] sm:text-[10px] font-bold text-gray-400">
                                    <span>1 anno</span>
                                    <span>15</span>
                                    <span>30 anni</span>
                                </div>
                            </div>

                            {/* Summary Mini Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                    <p className="text-sm sm:text-base font-bold text-gray-400 uppercase tracking-widest leading-tight mb-2">{t('union_park.purchase_cost')}</p>
                                    <p className="text-3xl sm:text-5xl font-black text-gray-900 dark:text-white">€ {purchaseCostValue.toLocaleString('it-IT', { maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                                    <p className="text-sm sm:text-base font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest leading-tight mb-2">{t('union_park.monthly_yield')}</p>
                                    <p className="text-3xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400">€ {(annualYield / 12).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                                    <p className="text-sm sm:text-base font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest leading-tight mb-2">{t('union_park.annual_yield')}</p>
                                    <p className="text-3xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400">€ {annualYield.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Projections Box */}
                    <div className="bg-gradient-to-br from-gray-900 to-emerald-900 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Sun size={80} className="sm:w-32 sm:h-32" /></div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-emerald-400 text-xs md:text-sm font-bold uppercase tracking-widest mb-0.5">{t('union_park.monthly_yield')}</p>
                                        <p className="text-2xl sm:text-3xl font-black text-white">€ {(annualYield / 12).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div>
                                        <p className="text-emerald-400 text-xs md:text-lg font-bold uppercase tracking-widest mb-0.5">{t('union_park.annual_yield')}</p>
                                        <p className="text-2xl sm:text-5xl font-black text-white">€ {annualYield.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-emerald-400/70 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-0.5">{t('union_park.total_yield', { years: simulationYears })}</p>
                                        <p className="text-2xl sm:text-4xl font-black text-white">€ {totalYieldLongTerm.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="h-px bg-white/10 w-full"></div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-emerald-400/70 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">{t('union_park.roi')}</p>
                                        <p className="text-3xl sm:text-5xl font-black text-emerald-400">{roiTotal.toFixed(0)}%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-center md:items-end text-center md:text-right">
                                <div className="p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                                    <p className="text-emerald-200 text-xs md:text-xl font-bold uppercase tracking-widest mb-1">{t('union_park.payback')}</p>
                                    <p className="text-3xl sm:text-7xl font-black text-white leading-none">
                                        {paybackYears} <span className="text-xs sm:text-2xl font-medium opacity-70">anni</span>
                                        {remainingMonths > 0 && <><br /><span className="text-lg sm:text-4xl">{remainingMonths}</span> <span className="text-xs sm:text-2xl font-medium opacity-70">mesi</span></>}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-start gap-2 max-w-[200px] sm:max-w-xs">
                                    <Info size={14} className="text-emerald-400 shrink-0 mt-0.5 sm:w-4 sm:h-4" />
                                    <p className="text-[8px] sm:text-[10px] text-emerald-100/60 leading-relaxed">{t('union_park.note')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer PREMIUM */}
                <div className="p-8 bg-slate-50/80 backdrop-blur-md border-t border-slate-200 shrink-0 flex items-center gap-4">
                    <button
                        onClick={handleReset}
                        className="w-16 h-16 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl border border-red-100 active:scale-95 transition-all shadow-sm hover:bg-red-500 hover:text-white"
                        title={t('union_park.reset')}
                    >
                        <RotateCcw size={24} strokeWidth={3} />
                    </button>

                    <button
                        onClick={() => onConfirm(panels, pun, simulationYears)}
                        className="flex-1 py-6 bg-slate-900 text-white rounded-[1.5rem] font-black text-xl uppercase tracking-tighter hover:bg-black transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
                    >
                        {t('union_park.confirm')}
                    </button>
                </div>

            </div >

            {/* Focus Mode */}
            < SharingParkFocusMode
                isOpen={isFocusModeOpen}
                onClose={() => setIsFocusModeOpen(false)}
            />
        </div >
    );
};
