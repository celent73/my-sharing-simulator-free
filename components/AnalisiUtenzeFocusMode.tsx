import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Zap, Flame, ArrowRight, Sparkles, TrendingDown, Share2, Wallet } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AnalisiUtenzeFocusModeProps {
    isOpen: boolean;
    onClose: () => void;
}

type Step = 'utility' | 'electricity' | 'gas' | 'spending' | 'reveal';
type UtilityType = 'electricity' | 'gas' | 'both';

export const AnalisiUtenzeFocusMode: React.FC<AnalisiUtenzeFocusModeProps> = ({ isOpen, onClose }) => {
    const { language } = useLanguage();
    const [step, setStep] = useState<Step>('utility');
    const [utilityType, setUtilityType] = useState<UtilityType>('both');

    // Electricity data
    const [elecSpread, setElecSpread] = useState('0.02');
    const [pun, setPun] = useState('0.11');
    const [elecConsumption, setElecConsumption] = useState('250');
    const [elecFixed, setElecFixed] = useState('11.50');

    // Gas data
    const [gasSpread, setGasSpread] = useState('0.12');
    const [psv, setPsv] = useState('0.33');
    const [gasConsumption, setGasConsumption] = useState('100');
    const [gasFixed, setGasFixed] = useState('11.50');

    // Monthly spending
    const [monthlySpending, setMonthlySpending] = useState('800');

    // Cashback
    const [cashbackPercent, setCashbackPercent] = useState(10);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBack = () => {
        if (step === 'reveal') {
            setStep('spending');
        } else if (step === 'spending') {
            if (utilityType === 'both') setStep('gas');
            else if (utilityType === 'gas') setStep('gas');
            else setStep('electricity');
        } else if (step === 'gas') {
            if (utilityType === 'both') setStep('electricity');
            else setStep('utility');
        } else if (step === 'electricity') {
            setStep('utility');
        }
    };

    const handleUtilitySelect = (type: UtilityType) => {
        setUtilityType(type);
        if (type === 'electricity') {
            setStep('electricity');
        } else if (type === 'gas') {
            setStep('gas');
        } else {
            setStep('electricity');
        }
    };

    const handleElectricityNext = () => {
        if (utilityType === 'both') {
            setStep('gas');
        } else {
            setStep('spending');
        }
    };

    const handleGasNext = () => {
        setStep('spending');
    };

    const handleSpendingNext = () => {
        setStep('reveal');
    };

    // Calculations
    const elecSpreadNum = parseFloat(elecSpread.replace(',', '.')) || 0;
    const punNum = parseFloat(pun.replace(',', '.')) || 0;
    const elecConsNum = parseFloat(elecConsumption.replace(',', '.')) || 0;
    const elecFixNum = parseFloat(elecFixed.replace(',', '.')) || 0;

    const gasSpreadNum = parseFloat(gasSpread.replace(',', '.')) || 0;
    const psvNum = parseFloat(psv.replace(',', '.')) || 0;
    const gasConsNum = parseFloat(gasConsumption.replace(',', '.')) || 0;
    const gasFixNum = parseFloat(gasFixed.replace(',', '.')) || 0;

    const monthlyElecCost = ((elecSpreadNum + punNum) * elecConsNum) + elecFixNum;
    const monthlyGasCost = ((gasSpreadNum + psvNum) * gasConsNum) + gasFixNum;
    const totalUtilityCost = (utilityType === 'electricity' ? monthlyElecCost :
        utilityType === 'gas' ? monthlyGasCost :
            monthlyElecCost + monthlyGasCost);

    const monthlySpendingNum = parseFloat(monthlySpending.replace(',', '.')) || 0;
    const monthlyCashback = (monthlySpendingNum * cashbackPercent) / 100;
    const finalCost = totalUtilityCost - monthlyCashback;
    const annualSaving = monthlyCashback * 12;

    const texts = {
        it: {
            title: 'Analisi Utenze Focus',
            selectUtility: 'Seleziona Utenza',
            electricity: 'Energia Elettrica',
            gas: 'Gas Metano',
            both: 'Entrambe',
            elecStep: 'Dati Energia Elettrica',
            gasStep: 'Dati Gas Metano',
            spendingStep: 'Spesa Mensile',
            spendingDesc: 'Inserisci la tua spesa mensile totale (supermercato, benzina, shopping, ecc.)',
            totalSpending: 'Spesa Totale Mensile',
            spread: 'Spread',
            consumption: 'Consumo Mensile',
            fixed: 'Spese Fisse',
            cashback: 'Cashback Atteso',
            result: 'Il Tuo Risparmio',
            utilityCost: 'Costo Utenze',
            withCashback: 'Costo Finale',
            monthlySaving: 'Risparmio Mensile',
            annualSaving: 'Risparmio Annuale',
            done: 'Fatto',
            next: 'Avanti'
        },
        de: {
            title: 'Versorgungsanalyse Focus',
            selectUtility: 'Versorgung Wählen',
            electricity: 'Strom',
            gas: 'Erdgas',
            both: 'Beide',
            elecStep: 'Stromdaten',
            gasStep: 'Gasdaten',
            spendingStep: 'Monatliche Ausgaben',
            spendingDesc: 'Geben Sie Ihre gesamten monatlichen Ausgaben ein (Supermarkt, Benzin, Einkaufen usw.)',
            totalSpending: 'Gesamtausgaben Monatlich',
            spread: 'Marge',
            consumption: 'Monatlicher Verbrauch',
            fixed: 'Fixkosten',
            cashback: 'Erwartetes Cashback',
            result: 'Ihre Ersparnis',
            utilityCost: 'Versorgungskosten',
            withCashback: 'Endkosten',
            monthlySaving: 'Monatliche Ersparnis',
            annualSaving: 'Jährliche Ersparnis',
            done: 'Fertig',
            next: 'Weiter'
        },
        en: {
            title: 'Utility Analysis Focus',
            selectUtility: 'Select Utility',
            electricity: 'Electricity',
            gas: 'Natural Gas',
            both: 'Both',
            elecStep: 'Electricity Data',
            gasStep: 'Gas Data',
            spendingStep: 'Monthly Spending',
            spendingDesc: 'Enter your total monthly spending (groceries, fuel, shopping, etc.)',
            totalSpending: 'Total Monthly Spending',
            spread: 'Spread',
            consumption: 'Monthly Consumption',
            fixed: 'Fixed Costs',
            cashback: 'Expected Cashback',
            result: 'Your Savings',
            utilityCost: 'Utility Cost',
            withCashback: 'Final Cost',
            monthlySaving: 'Monthly Saving',
            annualSaving: 'Annual Saving',
            done: 'Done',
            next: 'Next'
        }
    };

    const txt = texts[language as keyof typeof texts] || texts.en;

    return (
        <div className="fixed inset-0 z-[200000] bg-black text-white flex flex-col overflow-hidden font-sans text-center">
            {/* Ambient Background */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]" />
            </div>

            {/* Header */}
            <div className="relative z-50 flex items-center justify-between p-6 pt-14 sm:pt-6">
                <button
                    onClick={step === 'utility' ? onClose : handleBack}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                >
                    {step === 'utility' ? <X size={24} /> : <ChevronLeft size={24} />}
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-1 font-bold">
                        {txt.title}
                    </span>
                    <div className="flex gap-1.5">
                        {['utility', 'electricity', 'gas', 'spending', 'reveal'].map((s, i) => (
                            <div
                                key={s}
                                className={`h-1 rounded-full transition-all duration-500 ${step === s ? 'w-8 bg-indigo-500' :
                                    (i < ['utility', 'electricity', 'gas', 'spending', 'reveal'].indexOf(step) ? 'w-4 bg-white/40' : 'w-2 bg-white/10')
                                    }`}
                            />
                        ))}
                    </div>
                </div>
                <div className="w-12 h-12" /> {/* Spacer */}
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-start md:justify-center p-6 sm:p-12 pb-40 w-full max-w-7xl mx-auto h-full overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                    {/* STEP 1: SELECT UTILITY */}
                    {step === 'utility' && (
                        <motion.div
                            key="utility"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.1, y: -20 }}
                            className="w-full flex flex-col items-center"
                        >
                            <h2 className="text-4xl sm:text-6xl font-black mb-4 text-center bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent uppercase tracking-tight">
                                {txt.selectUtility}
                            </h2>
                            <p className="text-white/60 text-lg mb-12 text-center max-w-md">
                                Scegli quale utenza vuoi analizzare
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
                                <button
                                    onClick={() => handleUtilitySelect('electricity')}
                                    className="relative group p-8 rounded-[2rem] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden bg-white/5 hover:bg-white/10 hover:scale-105"
                                >
                                    <Zap size={48} className="mb-4 text-yellow-400 transition-transform duration-500 group-hover:scale-110" />
                                    <span className="font-bold tracking-wide text-white/80 group-hover:text-white">
                                        {txt.electricity}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleUtilitySelect('gas')}
                                    className="relative group p-8 rounded-[2rem] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden bg-white/5 hover:bg-white/10 hover:scale-105"
                                >
                                    <Flame size={48} className="mb-4 text-orange-400 transition-transform duration-500 group-hover:scale-110" />
                                    <span className="font-bold tracking-wide text-white/80 group-hover:text-white">
                                        {txt.gas}
                                    </span>
                                </button>

                                <button
                                    onClick={() => handleUtilitySelect('both')}
                                    className="relative group p-8 rounded-[2rem] flex flex-col items-center justify-center transition-all duration-500 overflow-hidden bg-indigo-600 shadow-[0_0_50px_rgba(79,70,229,0.4)] hover:scale-105"
                                >
                                    <div className="flex gap-2 mb-4">
                                        <Zap size={32} className="text-yellow-300" />
                                        <Flame size={32} className="text-orange-300" />
                                    </div>
                                    <span className="font-bold tracking-wide text-white">
                                        {txt.both}
                                    </span>
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent"
                                    />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: ELECTRICITY DATA */}
                    {step === 'electricity' && (
                        <motion.div
                            key="electricity"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full flex flex-col items-center max-w-2xl"
                        >
                            <div className="w-16 h-16 bg-yellow-500/20 rounded-3xl flex items-center justify-center mb-6 border border-yellow-500/30">
                                <Zap size={32} className="text-yellow-400" />
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black mb-8 text-center bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent uppercase tracking-tight">
                                {txt.elecStep}
                            </h2>

                            <div className="w-full space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                                            {txt.spread} (€/kW)
                                        </label>
                                        <input
                                            type="text"
                                            value={elecSpread}
                                            onChange={(e) => setElecSpread(e.target.value)}
                                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-4 text-2xl font-bold text-white outline-none focus:border-yellow-400 focus:bg-white/10 transition-all text-center"
                                            placeholder="0.02"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                                            PUN (€/kW)
                                        </label>
                                        <input
                                            type="text"
                                            value={pun}
                                            onChange={(e) => setPun(e.target.value)}
                                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-4 text-2xl font-bold text-white outline-none focus:border-yellow-400 focus:bg-white/10 transition-all text-center"
                                            placeholder="0.11"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                                        {txt.consumption} (kWh)
                                    </label>
                                    <input
                                        type="text"
                                        value={elecConsumption}
                                        onChange={(e) => setElecConsumption(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-4 text-2xl font-bold text-white outline-none focus:border-yellow-400 focus:bg-white/10 transition-all text-center"
                                        placeholder="250"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                                        {txt.fixed} (€)
                                    </label>
                                    <input
                                        type="text"
                                        value={elecFixed}
                                        onChange={(e) => setElecFixed(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-4 text-2xl font-bold text-white outline-none focus:border-yellow-400 focus:bg-white/10 transition-all text-center"
                                        placeholder="11.50"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleElectricityNext}
                                className="mt-12 group flex items-center gap-4 bg-white text-black px-12 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
                            >
                                {txt.next} <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: GAS DATA */}
                    {step === 'gas' && (
                        <motion.div
                            key="gas"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full flex flex-col items-center max-w-2xl"
                        >
                            <div className="w-16 h-16 bg-orange-500/20 rounded-3xl flex items-center justify-center mb-6 border border-orange-500/30">
                                <Flame size={32} className="text-orange-400" />
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black mb-8 text-center bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent uppercase tracking-tight">
                                {txt.gasStep}
                            </h2>

                            <div className="w-full space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                                            {txt.spread} (€/Smc)
                                        </label>
                                        <input
                                            type="text"
                                            value={gasSpread}
                                            onChange={(e) => setGasSpread(e.target.value)}
                                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-4 text-2xl font-bold text-white outline-none focus:border-orange-400 focus:bg-white/10 transition-all text-center"
                                            placeholder="0.12"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                                            PSV (€/Smc)
                                        </label>
                                        <input
                                            type="text"
                                            value={psv}
                                            onChange={(e) => setPsv(e.target.value)}
                                            className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-4 text-2xl font-bold text-white outline-none focus:border-orange-400 focus:bg-white/10 transition-all text-center"
                                            placeholder="0.33"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                                        {txt.consumption} (Smc)
                                    </label>
                                    <input
                                        type="text"
                                        value={gasConsumption}
                                        onChange={(e) => setGasConsumption(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-4 text-2xl font-bold text-white outline-none focus:border-orange-400 focus:bg-white/10 transition-all text-center"
                                        placeholder="100"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                                        {txt.fixed} (€)
                                    </label>
                                    <input
                                        type="text"
                                        value={gasFixed}
                                        onChange={(e) => setGasFixed(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-4 text-2xl font-bold text-white outline-none focus:border-orange-400 focus:bg-white/10 transition-all text-center"
                                        placeholder="11.50"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleGasNext}
                                className="mt-12 group flex items-center gap-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)]"
                            >
                                {txt.next} <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 4: MONTHLY SPENDING */}
                    {step === 'spending' && (
                        <motion.div
                            key="spending"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            className="w-full flex flex-col items-center max-w-2xl"
                        >
                            <div className="w-16 h-16 bg-green-500/20 rounded-3xl flex items-center justify-center mb-6 border border-green-500/30">
                                <Wallet size={32} className="text-green-400" />
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black mb-4 text-center bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent uppercase tracking-tight">
                                {txt.spendingStep}
                            </h2>
                            <p className="text-white/60 text-base mb-12 text-center max-w-lg">
                                {txt.spendingDesc}
                            </p>

                            <div className="w-full space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-white/40 uppercase tracking-wide">
                                        {txt.totalSpending} (€)
                                    </label>
                                    <input
                                        type="text"
                                        value={monthlySpending}
                                        onChange={(e) => setMonthlySpending(e.target.value)}
                                        className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-4 py-6 text-4xl font-bold text-white outline-none focus:border-green-400 focus:bg-white/10 transition-all text-center"
                                        placeholder="800"
                                    />
                                </div>

                                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                    <p className="text-white/60 text-sm text-center">
                                        💡 Include supermercato, benzina, shopping, ristoranti, ecc.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleSpendingNext}
                                className="mt-12 group flex items-center gap-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-12 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)]"
                            >
                                {txt.next} <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 5: REVEAL */}
                    {step === 'reveal' && (
                        <motion.div
                            key="reveal"
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="w-full flex flex-col items-center"
                        >
                            <div className="w-full max-w-2xl bg-gradient-to-b from-white/10 to-white/5 p-8 sm:p-12 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden mb-12">
                                <div className="absolute top-0 right-0 p-8 opacity-10">
                                    <Sparkles size={120} />
                                </div>

                                <div className="relative z-10 flex flex-col items-center">
                                    <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(79,70,229,0.5)]">
                                        <TrendingDown size={40} className="text-white" />
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl font-black mb-2 text-center">{txt.result}</h2>
                                    <p className="text-white/40 font-bold mb-12 uppercase tracking-[0.2em] text-sm text-center">
                                        Analisi Completa
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-8">
                                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col items-center">
                                            <span className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-bold">{txt.utilityCost}</span>
                                            <span className="text-4xl font-black text-red-400">€{totalUtilityCost.toFixed(2)}</span>
                                        </div>
                                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col items-center">
                                            <span className="text-[10px] uppercase tracking-widest text-white/40 mb-3 font-bold">{txt.cashback} ({cashbackPercent}%)</span>
                                            <span className="text-4xl font-black text-purple-400">-€{monthlyCashback.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="w-full bg-gradient-to-r from-emerald-600 to-green-600 p-8 rounded-3xl flex flex-col items-center justify-center shadow-lg mb-8">
                                        <span className="text-[10px] uppercase tracking-widest text-white/60 mb-2 font-bold">{txt.withCashback}</span>
                                        <span className="text-5xl font-black text-white">€{finalCost.toFixed(2)}</span>
                                        <span className="text-sm text-white/80 mt-2">al mese</span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                                        <div className="bg-white/5 rounded-2xl p-4 border border-white/5 flex flex-col items-center">
                                            <span className="text-[9px] uppercase tracking-widest text-emerald-400/60 mb-1 font-bold">{txt.monthlySaving}</span>
                                            <span className="text-2xl font-black text-emerald-400">€{monthlyCashback.toFixed(2)}</span>
                                        </div>
                                        <div className="bg-emerald-500/10 rounded-2xl p-4 border border-emerald-500/20 flex flex-col items-center">
                                            <span className="text-[9px] uppercase tracking-widest text-emerald-300/60 mb-1 font-bold">{txt.annualSaving}</span>
                                            <span className="text-2xl font-black text-emerald-300">€{annualSaving.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Cashback Slider */}
                                    <div className="mt-8 w-full space-y-4">
                                        <label className="flex justify-between items-center text-xs font-bold text-white/40 uppercase tracking-wide">
                                            <span>{txt.cashback}</span>
                                            <span className="text-2xl font-black text-indigo-400">{cashbackPercent}%</span>
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => setCashbackPercent(Math.max(0, cashbackPercent - 0.5))}
                                                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white font-black text-2xl transition-all active:scale-95"
                                            >
                                                -
                                            </button>
                                            <input
                                                type="range"
                                                min="0"
                                                max="30"
                                                step="0.5"
                                                value={cashbackPercent}
                                                onChange={(e) => setCashbackPercent(parseFloat(e.target.value))}
                                                className="flex-1 h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                                            />
                                            <button
                                                onClick={() => setCashbackPercent(Math.min(30, cashbackPercent + 0.5))}
                                                className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white font-black text-2xl transition-all active:scale-95"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase">
                                            <span>0%</span>
                                            <span>15%</span>
                                            <span>30%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl px-4">
                                <button
                                    onClick={onClose}
                                    className="flex-1 flex items-center justify-center bg-white text-black px-8 py-5 rounded-[2rem] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-[0_15px_30px_rgba(255,255,255,0.2)]"
                                >
                                    {txt.done}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
