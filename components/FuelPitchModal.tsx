
import React, { useState } from 'react';
import { X, Fuel, ArrowRight, TrendingDown, PiggyBank, Calendar, Info, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { CustomSlider } from './CustomSlider';
import { useModalDispatch } from '../contexts/ModalContext';

interface FuelPitchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const FuelPitchModal: React.FC<FuelPitchModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { openModal } = useModalDispatch();
    const [pricePerLiter, setPricePerLiter] = useState(1.80);
    const [tankCapacity, setTankCapacity] = useState(50);
    const [otherSpending, setOtherSpending] = useState(500); // Default 500€
    const [otherCashbackPercent, setOtherCashbackPercent] = useState(10); // Default 10%

    if (!isOpen) return null;

    // 1. Costo del Pieno Standard
    const costPerTankStandard = pricePerLiter * tankCapacity;

    // 2. Risparmio Diretto Carburante (1.88% fisso)
    const fuelCashbackRate = 1.88;
    const directFuelSavings = costPerTankStandard * (fuelCashbackRate / 100);

    // 3. Risparmio da Altre Spese (Cross-Subsidization)
    const otherSavings = otherSpending * (otherCashbackPercent / 100);

    // 4. Totale Risparmio Applicato al Pieno
    const totalSavings = directFuelSavings + otherSavings;

    // 5. Nuovo Costo del Pieno e Prezzo al Litro
    const costPerTankDiscounted = Math.max(0, costPerTankStandard - totalSavings); // Non può essere negativo
    const newPricePerLiter = costPerTankDiscounted / tankCapacity;
    const savingsPerLiter = pricePerLiter - newPricePerLiter;

    const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(val);

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-500">
            <div className="bg-[#0A0A0F]/80 w-full max-w-4xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden flex flex-col max-h-[92vh] backdrop-blur-2xl relative">

                {/* GLOW DECORATIONS */}
                <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-600/10 blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-emerald-600/10 blur-[100px] pointer-events-none"></div>

                {/* HEADER - iOS Premium Style */}
                <div className="p-8 flex justify-between items-center relative z-10 border-b border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-[1.25rem] flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                            <Fuel className="text-white w-8 h-8 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-white tracking-tight leading-none mb-1">FUEL SAVER</h2>
                            <div className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">{t('fuel_pitch.subtitle')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => openModal('FUEL_FOCUS')}
                            className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/10 shadow-xl active:scale-95 group backdrop-blur-xl"
                        >
                            <Zap size={15} className="text-yellow-400 group-hover:scale-110 transition-transform" />
                            {t('fuel_pitch.focus_mode_btn')}
                        </button>
                        <button onClick={onClose} className="p-3 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-full transition-all border border-white/5 hover:border-red-500/20">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* DISPLAY SECTION (iOS Widget Style) */}
                <div className="p-4 sm:p-8 sm:pb-12 relative">
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-12 items-center">
                        {/* OLD PRICE WIDGET */}
                        <div className="group relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-white/0 to-white/0 rounded-[1.5rem] sm:rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 p-3 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] flex flex-col items-center justify-center transition-all duration-500 opacity-40 hover:opacity-100">
                                <span className="text-white/30 text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1 sm:mb-3 whitespace-nowrap">{t('fuel_pitch.pump_price_label')}</span>
                                <div className="text-xl sm:text-4xl font-mono font-black text-white/50 line-through decoration-red-500/40 decoration-2 sm:decoration-4">
                                    {pricePerLiter.toFixed(2)} <span className="text-xs sm:text-2xl">€/L</span>
                                </div>
                            </div>
                        </div>

                        {/* NEW PRICE WIDGET - HIGHLIGHTED */}
                        <div className="group relative transform sm:scale-110">
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-[1.5rem] sm:rounded-[2.5rem] blur opacity-75 animate-pulse"></div>
                            <div className="relative bg-white/10 backdrop-blur-3xl border border-white/20 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] sm:shadow-[0_20px_40px_-10px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden">
                                <div className="absolute top-0 right-0 p-2 sm:p-4">
                                    <div className="bg-emerald-500/20 p-1 sm:p-2 rounded-full backdrop-blur-md border border-emerald-500/30">
                                        <TrendingDown size={14} className="text-emerald-400 sm:w-4 sm:h-4" />
                                    </div>
                                </div>
                                <span className="text-emerald-400 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] mb-1 sm:mb-4 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)] whitespace-nowrap">{t('fuel_pitch.sharing_price_label')}</span>
                                <div className="text-3xl sm:text-6xl font-mono font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                                    {newPricePerLiter.toFixed(2)} <span className="text-xl sm:text-3xl font-black text-emerald-400">€</span>
                                </div>
                            </div>
                        </div>

                        {/* DECORATIVE ARROW */}
                        <div className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 z-0 pointer-events-none">
                            <ArrowRight size={120} strokeWidth={8} />
                        </div>
                    </div>
                </div>

                {/* CONTROLS */}
                <div className="p-8 flex-grow overflow-y-auto space-y-8 relative z-10 glass-scroll">

                    {/* INPUTS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* PRICE INPUT BOX */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all group">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/20 rounded-xl border border-blue-500/30">
                                        <Fuel size={16} className="text-blue-400" />
                                    </div>
                                    <span className="text-white/60 text-xs font-black uppercase tracking-widest">{t('fuel_pitch.fuel_price_label')}</span>
                                </div>
                                <div className="text-2xl font-mono font-black text-white group-hover:text-blue-400 transition-colors">
                                    {pricePerLiter.toFixed(2)}<span className="text-sm ml-1 opacity-50">€/L</span>
                                </div>
                            </div>
                            <input
                                type="range"
                                min="1.40"
                                max="2.20"
                                step="0.01"
                                value={pricePerLiter}
                                onChange={(e) => setPricePerLiter(Number(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* TANK CAPACITY BOX */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] hover:bg-white/10 transition-all group">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30">
                                        <Zap size={16} className="text-emerald-400" />
                                    </div>
                                    <span className="text-white/60 text-xs font-black uppercase tracking-widest">{t('fuel_pitch.tank_capacity_label')}</span>
                                </div>
                                <div className="text-2xl font-mono font-black text-white group-hover:text-emerald-400 transition-colors">
                                    {tankCapacity}<span className="text-sm ml-1 opacity-50">{t('fuel_pitch.liters')}</span>
                                </div>
                            </div>
                            <input
                                type="range"
                                min="20"
                                max="80"
                                step="5"
                                value={tankCapacity}
                                onChange={(e) => setTankCapacity(Number(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                            />
                        </div>
                    </div>



                    {/* OTHER SPENDING SECTION - PREMIUM GLASS CARD */}
                    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-xl space-y-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>

                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-orange-500/20 rounded-2xl border border-orange-500/30">
                                <PiggyBank className="text-orange-400" size={24} />
                            </div>
                            <div>
                                <h4 className="text-white font-black text-lg uppercase tracking-tight">{t('fuel_pitch.other_spending_title')}</h4>
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Genera Crediti per l'auto</p>
                            </div>
                        </div>

                        <div className="space-y-10 mt-6">
                            {/* SPESA MENSILE */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">{t('fuel_pitch.monthly_spending_label')}</span>
                                    <span className="text-2xl font-mono font-black text-white">{formatCurrency(otherSpending)}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="2000"
                                    step="50"
                                    value={otherSpending}
                                    onChange={(e) => setOtherSpending(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-orange-500"
                                />
                            </div>

                            {/* CASHBACK % */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-white/50 text-[10px] font-black uppercase tracking-widest">{t('fuel_pitch.cashback_obtained_label')}</span>
                                    <span className="text-2xl font-mono font-black text-orange-400">{otherCashbackPercent}%</span>
                                </div>
                                <div className="space-y-1">
                                    <input
                                        type="range"
                                        min="0"
                                        max="30"
                                        step="1"
                                        value={otherCashbackPercent}
                                        onChange={(e) => setOtherCashbackPercent(Number(e.target.value))}
                                        className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                                    />
                                    <div className="flex justify-between px-1">
                                        {[0, 10, 20, 30].map(v => (
                                            <span key={v} className="text-[9px] font-black text-white/20 uppercase">{v}%</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CREDITO GENERATO DISPLAY */}
                        <div className="bg-orange-500/5 backdrop-blur-md border border-orange-500/20 p-6 rounded-3xl flex justify-between items-center group-hover:bg-orange-500/10 transition-all">
                            <span className="text-white/80 text-xs font-black uppercase tracking-widest">{t('fuel_pitch.generated_credit_label')}</span>
                            <div className="flex flex-col items-end">
                                <span className="text-3xl font-mono font-black text-orange-400 drop-shadow-[0_4px_12px_rgba(251,146,60,0.3)]">+ {formatCurrency(otherSavings)}</span>
                                <span className="text-[10px] font-black text-orange-400/50 uppercase tracking-widest mt-1">Credito Mensile</span>
                            </div>
                        </div>
                    </div>

                    {/* CALCULATION BREAKDOWN - GLASS INSET */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] space-y-4 group">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 animate-pulse">
                                <TrendingDown size={18} className="text-emerald-400" />
                            </div>
                            <h4 className="text-white font-black text-sm uppercase tracking-widest">{t('fuel_pitch.cost_reduction_title')}</h4>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm font-bold">
                                <span className="text-white/40 uppercase text-[10px] tracking-widest">{t('fuel_pitch.tank_cost_label')} ({tankCapacity}L)</span>
                                <span className="text-white font-mono">{formatCurrency(costPerTankStandard)}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                                <div className="bg-black/20 p-3 rounded-2xl border border-white/5 flex justify-between items-center">
                                    <span className="text-white/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><Fuel size={12} className="text-emerald-500" /> Carburante</span>
                                    <span className="text-emerald-400 font-mono font-black">-{formatCurrency(directFuelSavings)}</span>
                                </div>
                                <div className="bg-black/20 p-3 rounded-2xl border border-white/5 flex justify-between items-center">
                                    <span className="text-white/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-1"><PiggyBank size={12} className="text-orange-500" /> Crediti</span>
                                    <span className="text-orange-400 font-mono font-black">-{formatCurrency(otherSavings)}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-white font-black uppercase tracking-tighter text-lg">{t('fuel_pitch.new_tank_cost_label')}</span>
                                <span className="text-4xl font-mono font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">{formatCurrency(costPerTankDiscounted)}</span>
                            </div>

                            <div className="mt-4 bg-emerald-500/10 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/30 flex justify-between items-center group-hover:scale-[1.02] transition-transform">
                                <span className="text-emerald-400 font-black uppercase text-[10px] tracking-widest">{t('fuel_pitch.savings_per_liter_label')}</span>
                                <span className="text-white font-mono font-black text-xl">- {formatCurrency(savingsPerLiter)} <span className="text-xs opacity-50">/ Litro</span></span>
                            </div>
                        </div>
                    </div>

                    {/* SAVINGS SUMMARY CARDS */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] flex flex-col items-center text-center group hover:bg-white/10 transition-all">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                <PiggyBank className="text-emerald-400" size={24} />
                            </div>
                            <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{t('fuel_pitch.total_savings_label')}</span>
                            <span className="text-3xl font-black text-white">{formatCurrency(totalSavings)}</span>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-2xl border border-indigo-500/20 p-8 rounded-[2.5rem] flex flex-col items-center text-center group hover:from-indigo-500/20 hover:to-purple-500/20 transition-all relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-[60px] rounded-full -mr-16 -mt-16"></div>
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-4 relative z-10 transition-transform group-hover:scale-110">
                                <Calendar className="text-indigo-400" size={24} />
                            </div>
                            <span className="text-indigo-400/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">{t('fuel_pitch.value_12_months_label')}</span>
                            <span className="text-3xl font-black text-white relative z-10 font-mono tracking-tight">{formatCurrency(totalSavings * 12)}</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default FuelPitchModal;
