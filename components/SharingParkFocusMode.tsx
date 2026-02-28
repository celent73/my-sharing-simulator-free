import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Wallet, Sun, Zap, Calendar, TrendingUp, ArrowRight, Sparkles, DollarSign } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SharingParkFocusModeProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'investment' | 'panels' | 'pun' | 'duration' | 'results';

export const SharingParkFocusMode: React.FC<SharingParkFocusModeProps> = ({ isOpen, onClose }) => {
    const { language } = useLanguage();
    const [step, setStep] = useState<Step>('investment');

    // Data
    const [budget, setBudget] = useState('7800');
    const [panels, setPanels] = useState(10);
    const [pun, setPun] = useState(0.20);
    const [years, setYears] = useState(26);

    // Constants
    const PANEL_COST = 780;
    const ANNUAL_YIELD_MULTIPLIER = 33.4 * 12; // kWh/anno per pannello

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // Update panels when budget changes
    useEffect(() => {
        const budgetNum = parseFloat(budget.replace(',', '.')) || 0;
        const calculatedPanels = Math.floor(budgetNum / PANEL_COST);
        if (calculatedPanels > 0 && calculatedPanels !== panels) {
            setPanels(calculatedPanels);
        }
    }, [budget]);

    if (!isOpen) return null;

    const handleBack = () => {
        if (step === 'results') setStep('duration');
        else if (step === 'duration') setStep('pun');
        else if (step === 'pun') setStep('panels');
        else if (step === 'panels') setStep('investment');
    };

    // Calculations
    const investmentCost = panels * PANEL_COST;
    const annualYield = pun * ANNUAL_YIELD_MULTIPLIER * panels;
    const monthlyYield = annualYield / 12;
    const totalYield = annualYield * years;
    const paybackMonths = investmentCost / (monthlyYield || 1);
    const paybackYears = Math.floor(paybackMonths / 12);
    const paybackRemainingMonths = Math.round(paybackMonths % 12);
    const netProfit = totalYield - investmentCost;
    const roiPercent = (netProfit / investmentCost) * 100;

    const texts = {
        it: {
            title: 'Sharing Park Focus',
            investment: 'Il Tuo Investimento',
            investmentDesc: 'Quanto vuoi investire nei pannelli fotovoltaici?',
            budget: 'Budget Disponibile',
            canBuy: 'Puoi acquistare',
            panels: 'pannelli',
            panelsStep: 'Numero Pannelli',
            panelsDesc: 'Quanti pannelli vuoi acquistare?',
            totalCost: 'Costo Totale',
            energyProduced: 'Energia Prodotta',
            punStep: 'Prezzo Energia',
            punDesc: 'Seleziona il prezzo zonale dell\'energia (PUN)',
            durationStep: 'Durata Investimento',
            durationDesc: 'Per quanti anni vuoi investire?',
            paybackEstimate: 'Payback Stimato',
            resultsStep: 'Il Tuo Ritorno',
            investmentSection: 'Investimento',
            initialInvestment: 'Investimento Iniziale',
            panelCost: 'Costo per Pannello',
            numPanels: 'Numero Pannelli',
            roiSection: 'ROI & Payback',
            paybackTime: 'Payback Time',
            totalROI: 'ROI Totale',
            netProfit: 'Profitto Netto',
            earningsSection: 'Guadagni Passivi',
            monthlyEarnings: 'Compensi Mensili',
            annualEarnings: 'Compensi Annuali',
            totalEarnings: 'Guadagno Totale',
            savingsSection: 'Risparmio Bolletta',
            monthlySavings: 'Risparmio Mensile',
            annualSavings: 'Risparmio Annuale',
            totalSavings: 'Risparmio Totale',
            totalBenefits: 'Totale Benefici',
            earningsPlusSavings: 'Guadagni + Risparmi',
            years: 'anni',
            months: 'mesi',
            done: 'Fatto',
            next: 'Avanti'
        },
        de: {
            title: 'Sharing Park Focus',
            investment: 'Ihre Investition',
            investmentDesc: 'Wie viel möchten Sie in Solarpaneele investieren?',
            budget: 'Verfügbares Budget',
            canBuy: 'Sie können kaufen',
            panels: 'Paneele',
            panelsStep: 'Anzahl Paneele',
            panelsDesc: 'Wie viele Paneele möchten Sie kaufen?',
            totalCost: 'Gesamtkosten',
            energyProduced: 'Produzierte Energie',
            punStep: 'Energiepreis',
            punDesc: 'Wählen Sie den zonalen Energiepreis (PUN)',
            durationStep: 'Investitionsdauer',
            durationDesc: 'Für wie viele Jahre möchten Sie investieren?',
            paybackEstimate: 'Geschätzte Amortisation',
            resultsStep: 'Ihre Rendite',
            investmentSection: 'Investition',
            initialInvestment: 'Anfangsinvestition',
            panelCost: 'Kosten pro Paneel',
            numPanels: 'Anzahl Paneele',
            roiSection: 'ROI & Amortisation',
            paybackTime: 'Amortisationszeit',
            totalROI: 'Gesamt-ROI',
            netProfit: 'Nettogewinn',
            earningsSection: 'Passive Einnahmen',
            monthlyEarnings: 'Monatliche Vergütung',
            annualEarnings: 'Jährliche Vergütung',
            totalEarnings: 'Gesamtgewinn',
            savingsSection: 'Rechnungseinsparung',
            monthlySavings: 'Monatliche Einsparung',
            annualSavings: 'Jährliche Einsparung',
            totalSavings: 'Gesamteinsparung',
            totalBenefits: 'Gesamtvorteile',
            earningsPlusSavings: 'Einnahmen + Einsparungen',
            years: 'Jahre',
            months: 'Monate',
            done: 'Fertig',
            next: 'Weiter'
        },
        en: {
            title: 'Sharing Park Focus',
            investment: 'Your Investment',
            investmentDesc: 'How much do you want to invest in solar panels?',
            budget: 'Available Budget',
            canBuy: 'You can buy',
            panels: 'panels',
            panelsStep: 'Number of Panels',
            panelsDesc: 'How many panels do you want to buy?',
            totalCost: 'Total Cost',
            energyProduced: 'Energy Produced',
            punStep: 'Energy Price',
            punDesc: 'Select the zonal energy price (PUN)',
            durationStep: 'Investment Duration',
            durationDesc: 'For how many years do you want to invest?',
            paybackEstimate: 'Estimated Payback',
            resultsStep: 'Your Return',
            investmentSection: 'Investment',
            initialInvestment: 'Initial Investment',
            panelCost: 'Cost per Panel',
            numPanels: 'Number of Panels',
            roiSection: 'ROI & Payback',
            paybackTime: 'Payback Time',
            totalROI: 'Total ROI',
            netProfit: 'Net Profit',
            earningsSection: 'Passive Earnings',
            monthlyEarnings: 'Monthly Compensation',
            annualEarnings: 'Annual Compensation',
            totalEarnings: 'Total Earnings',
            savingsSection: 'Bill Savings',
            monthlySavings: 'Monthly Savings',
            annualSavings: 'Annual Savings',
            totalSavings: 'Total Savings',
            totalBenefits: 'Total Benefits',
            earningsPlusSavings: 'Earnings + Savings',
            years: 'years',
            months: 'months',
            done: 'Done',
            next: 'Next'
        }
    };

    const txt = texts[language as keyof typeof texts] || texts.en;

    return (
        <div className="fixed inset-0 z-[200000] bg-black text-white flex flex-col overflow-hidden font-sans text-center">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]" />
            </div>

            {/* Header */}
            <div className="relative z-50 flex items-center justify-between p-6">
                <button
                    onClick={step === 'investment' ? onClose : handleBack}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                >
                    {step === 'investment' ? <X size={24} /> : <ChevronLeft size={24} />}
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1 font-bold">
                        {txt.title}
                    </span>
                    <div className="flex gap-1.5">
                        {['investment', 'panels', 'pun', 'duration', 'results'].map((s, i) => (
                            <div
                                key={s}
                                className={`h-1 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-emerald-500' :
                                    (i < ['investment', 'panels', 'pun', 'duration', 'results'].indexOf(step) ? 'w-4 bg-white/40' : 'w-2 bg-white/10')
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-12 h-12" /> {/* Spacer */}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-12 w-full max-w-7xl mx-auto h-full overflow-hidden">
                <AnimatePresence mode="wait">
                    {/* STEP 1: INVESTMENT */}
                    {step === 'investment' && (
                        <motion.div
                            key="investment"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.1, y: -20 }}
                            className="w-full flex flex-col items-center max-w-2xl"
                        >
                            <div className="w-16 h-16 bg-emerald-500/20 rounded-3xl flex items-center justify-center mb-6 border border-emerald-500/30">
                                <Wallet size={32} className="text-emerald-400" />
                            </div>
                            <h2 className="text-4xl sm:text-6xl font-black mb-4 text-center bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent uppercase tracking-tight">
                                {txt.investment}
                            </h2>
                            <p className="text-white/60 text-lg mb-12 text-center max-w-md">
                                {txt.investmentDesc}
                            </p>

                            <div className="w-full space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                                        {txt.budget} (€)
                                    </label>
                                    <input
                                        type="text"
                                        value={budget}
                                        onChange={(e) => setBudget(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-6 text-4xl font-bold text-white outline-none focus:border-emerald-400 focus:bg-white/10 transition-all text-center"
                                        placeholder="7800"
                                    />
                                </div>

                                <div className="bg-emerald-600 rounded-3xl p-8 text-center">
                                    <p className="text-emerald-100 text-sm mb-2">{txt.canBuy}</p>
                                    <p className="text-6xl font-black text-white mb-1">{Math.floor(parseFloat(budget.replace(',', '.')) / PANEL_COST)}</p>
                                    <p className="text-emerald-200 text-lg font-bold">{txt.panels}</p>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('panels')}
                                className="mt-12 group flex items-center gap-4 bg-white text-black px-12 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
                            >
                                {txt.next} <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: PANELS */}
                    {step === 'panels' && (
                        <motion.div
                            key="panels"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full flex flex-col items-center max-w-2xl"
                        >
                            <div className="w-16 h-16 bg-yellow-500/20 rounded-3xl flex items-center justify-center mb-6 border border-yellow-500/30">
                                <Sun size={32} className="text-yellow-400" />
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black mb-8 text-center bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent uppercase tracking-tight">
                                {txt.panelsStep}
                            </h2>
                            <p className="text-white/60 text-base mb-12 text-center max-w-lg">
                                {txt.panelsDesc}
                            </p>

                            <div className="w-full space-y-8">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setPanels(Math.max(1, panels - 1))}
                                        className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white font-black text-2xl transition-all active:scale-95"
                                    >
                                        -
                                    </button>
                                    <div className="flex-1 text-center">
                                        <p className="text-7xl font-black text-emerald-400">{panels}</p>
                                        <p className="text-white/60 text-sm mt-2">{txt.panels}</p>
                                    </div>
                                    <button
                                        onClick={() => setPanels(Math.min(100, panels + 1))}
                                        className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white font-black text-2xl transition-all active:scale-95"
                                    >
                                        +
                                    </button>
                                </div>

                                <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={panels}
                                    onChange={(e) => setPanels(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">{txt.totalCost}</p>
                                        <p className="text-3xl font-black text-white">€{investmentCost.toLocaleString()}</p>
                                    </div>
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                        <p className="text-[10px] uppercase tracking-widest text-white/40 mb-2 font-bold">{txt.energyProduced}</p>
                                        <p className="text-3xl font-black text-emerald-400">{(ANNUAL_YIELD_MULTIPLIER * panels).toFixed(0)} kWh</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('pun')}
                                className="mt-12 group flex items-center gap-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-12 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)]"
                            >
                                {txt.next} <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: PUN */}
                    {step === 'pun' && (
                        <motion.div
                            key="pun"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full flex flex-col items-center max-w-2xl"
                        >
                            <div className="w-16 h-16 bg-blue-500/20 rounded-3xl flex items-center justify-center mb-6 border border-blue-500/30">
                                <Zap size={32} className="text-blue-400" />
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black mb-4 text-center bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent uppercase tracking-tight">
                                {txt.punStep}
                            </h2>
                            <p className="text-white/60 text-base mb-12 text-center max-w-lg">
                                {txt.punDesc}
                            </p>

                            <div className="w-full space-y-8">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {[0.15, 0.20, 0.25, 0.30].map(price => (
                                        <button
                                            key={price}
                                            onClick={() => setPun(price)}
                                            className={`p-6 rounded-2xl font-black text-2xl transition-all ${pun === price
                                                ? 'bg-emerald-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-105'
                                                : 'bg-white/5 text-white/60 hover:bg-white/10'
                                                }`}
                                        >
                                            €{price.toFixed(2)}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                                        Personalizza (€/kWh)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={pun}
                                        onChange={(e) => setPun(parseFloat(e.target.value) || 0)}
                                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-4 text-2xl font-bold text-white outline-none focus:border-blue-400 focus:bg-white/10 transition-all text-center"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('duration')}
                                className="mt-12 group flex items-center gap-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(59,130,246,0.3)]"
                            >
                                {txt.next} <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 4: DURATION */}
                    {step === 'duration' && (
                        <motion.div
                            key="duration"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full flex flex-col items-center max-w-2xl"
                        >
                            <div className="w-16 h-16 bg-purple-500/20 rounded-3xl flex items-center justify-center mb-6 border border-purple-500/30">
                                <Calendar size={32} className="text-purple-400" />
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black mb-4 text-center bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent uppercase tracking-tight">
                                {txt.durationStep}
                            </h2>
                            <p className="text-white/60 text-base mb-12 text-center max-w-lg">
                                {txt.durationDesc}
                            </p>

                            <div className="w-full space-y-8">
                                <div className="text-center">
                                    <p className="text-8xl font-black text-purple-400 mb-2">{years}</p>
                                    <p className="text-white/60 text-xl font-bold">{txt.years}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setYears(Math.max(1, years - 1))}
                                        className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white font-black text-2xl transition-all active:scale-95"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="range"
                                        min="1"
                                        max="30"
                                        value={years}
                                        onChange={(e) => setYears(parseInt(e.target.value))}
                                        className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                                    />
                                    <button
                                        onClick={() => setYears(Math.min(30, years + 1))}
                                        className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white font-black text-2xl transition-all active:scale-95"
                                    >
                                        +
                                    </button>
                                </div>

                                <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase">
                                    <span>1 anno</span>
                                    <span>15 anni</span>
                                    <span>30 anni</span>
                                </div>

                                <div className="bg-purple-600/20 rounded-2xl p-6 border border-purple-500/30">
                                    <p className="text-[10px] uppercase tracking-widest text-purple-300 mb-2 font-bold">{txt.paybackEstimate}</p>
                                    <p className="text-3xl font-black text-white">
                                        {paybackYears} {txt.years} {paybackRemainingMonths > 0 && `${paybackRemainingMonths} ${txt.months}`}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('results')}
                                className="mt-12 group flex items-center gap-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-12 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(168,85,247,0.3)]"
                            >
                                {txt.next} <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 5: RESULTS */}
                    {step === 'results' && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="w-full flex flex-col items-center overflow-y-auto max-h-full pb-8"
                        >
                            <div className="w-full max-w-4xl space-y-6">
                                <div className="text-center mb-8">
                                    <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                                        <TrendingUp size={40} className="text-white" />
                                    </div>
                                    <h2 className="text-4xl sm:text-5xl font-black mb-2">{txt.resultsStep}</h2>
                                    <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-sm">
                                        Analisi Completa
                                    </p>
                                </div>

                                {/* Investment Section */}
                                <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                                    <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <Wallet size={16} /> {txt.investmentSection}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1 font-bold">{txt.initialInvestment}</p>
                                            <p className="text-2xl font-black text-white">€{investmentCost.toLocaleString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1 font-bold">{txt.panelCost}</p>
                                            <p className="text-2xl font-black text-white">€{PANEL_COST}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1 font-bold">{txt.numPanels}</p>
                                            <p className="text-2xl font-black text-emerald-400">{panels}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ROI Section */}
                                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-6 shadow-lg">
                                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <TrendingUp size={16} /> {txt.roiSection}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-emerald-100/60 mb-1 font-bold">{txt.paybackTime}</p>
                                            <p className="text-xl font-black text-white">{paybackYears}a {paybackRemainingMonths}m</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-emerald-100/60 mb-1 font-bold">{txt.totalROI} (26a)</p>
                                            <p className="text-xl font-black text-white">+{roiPercent.toFixed(0)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-emerald-100/60 mb-1 font-bold">{txt.netProfit}</p>
                                            <p className="text-xl font-black text-white">€{netProfit.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Earnings Section */}
                                <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                                    <h3 className="text-sm font-black text-yellow-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <DollarSign size={16} /> {txt.earningsSection}
                                    </h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1 font-bold">{txt.monthlyEarnings}</p>
                                            <p className="text-2xl font-black text-yellow-400">€{monthlyYield.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1 font-bold">{txt.annualEarnings}</p>
                                            <p className="text-2xl font-black text-yellow-400">€{annualYield.toFixed(2)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[9px] uppercase tracking-widest text-white/40 mb-1 font-bold">{txt.totalEarnings} ({years}a)</p>
                                            <p className="text-2xl font-black text-yellow-400">€{totalYield.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Benefits */}
                                <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-center shadow-2xl">
                                    <p className="text-[10px] uppercase tracking-widest text-white/60 mb-2 font-bold">{txt.netProfit} ({years} {txt.years})</p>
                                    <p className="text-6xl font-black text-white mb-2">€{netProfit.toLocaleString()}</p>
                                    <p className="text-2xl font-black text-white/80">ROI: +{roiPercent.toFixed(0)}%</p>
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="mt-8 flex items-center justify-center bg-white text-black px-12 py-5 rounded-[2rem] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_rgba(255,255,255,0.2)]"
                            >
                                {txt.done}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
