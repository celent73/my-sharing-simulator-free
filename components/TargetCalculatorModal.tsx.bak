import React, { useState, useEffect } from 'react';
import { X, Target, Users, Clock, TrendingUp, Zap, FileText, Activity, Briefcase, Star } from 'lucide-react';
import { PlanInput } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface TargetCalculatorModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentInputs: PlanInput;
    onApply: (updates: Partial<PlanInput>) => void;
}

// --- TRADUZIONI ---
const texts = {
    it: {
        title: "Target Simulator",
        subtitle: "Pianifica il tuo successo",
        inputLabel: "INSERISCI LA RENDITA MENSILE CHE DESIDERI",
        peopleLabel: "Contratti di Rete",
        timeLabel: "Mesi Stimati",
        rankLabel: "Qualifica Raggiunta",
        rankSub: "Livello raggiunto",
        projY2Label: "Proiezione 2° Anno",
        projY2Sub: "Crescita stimata 1.5x",
        projY3Label: "Proiezione 3° Anno",
        projY3Sub: "Crescita stimata 2.0x",
        backBtn: "Torna al Simulatore",
        disclaimer: "*Calcolo basato su media provvigionale stimata per contratto (0,75€ Y1 / 1,125€ Y2 / 1,50€ Y3).",
        modeLabel: "Impegno Previsto",
        modeBasic: "Basic / Part Time",
        modePro: "Pro / Full Time",
        resetBtn: "Azzera"
    },
    de: {
        title: "Ziel-Simulator",
        subtitle: "Planen Sie Ihren Erfolg",
        inputLabel: "GEWÜNSCHTES MONATLICHES EINKOMMEN EINGEBEN",
        peopleLabel: "Netzwerkverträge",
        timeLabel: "Geschätzte Monate",
        rankLabel: "Erreichte Qualifikation",
        rankSub: "Erreichtes Level",
        projY2Label: "Prognose 2. Jahr",
        projY2Sub: "Geschätztes Wachstum 1.5x",
        projY3Label: "Prognose 3. Jahr",
        projY3Sub: "Geschätztes Wachstum 2.0x",
        backBtn: "Zurück zum Simulator",
        disclaimer: "*Berechnung basierend auf: geschätzter durchschnittlicher Provision von 35,00€ pro Benutzer.",
        modeLabel: "Geplanter Einsatz",
        modeBasic: "Basis / Teilzeit",
        modePro: "Pro / Vollzeit",
        resetBtn: "Zurücksetzen"
    }
};

// --- GAUGE PULITO ---
const SmartGauge = ({ percentage, value, label, icon: Icon, colorTheme }: any) => {
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const themes: any = {
        blue: { stroke: "stroke-cyan-400", text: "text-cyan-400", glow: "drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" },
        purple: { stroke: "stroke-fuchsia-500", text: "text-fuchsia-400", glow: "drop-shadow-[0_0_15px_rgba(217,70,239,0.8)]" },
        emerald: { stroke: "stroke-emerald-400", text: "text-emerald-400", glow: "drop-shadow-[0_0_15px_rgba(52,211,153,0.8)]" },
    };
    const t = themes[colorTheme] || themes.blue;

    return (
        <div className="flex flex-col items-center relative group">
            <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r={radius} fill="none" strokeWidth="8" className="stroke-white/5" />
                    <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className={`${t.stroke} transition-all duration-1000 ease-out ${t.glow}`}
                        style={{ strokeDasharray: circumference, strokeDashoffset: isNaN(strokeDashoffset) ? circumference : strokeDashoffset }}
                    />
                </svg>
                {/* NUMERO PULITO AL CENTRO */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-black ${t.text} tracking-tighter leading-none font-mono drop-shadow-md`}>
                        {value}
                    </span>
                </div>
            </div>

            {/* ETICHETTA ESTERNA (SOTTO) */}
            <div className="flex items-center gap-2 mt-[-10px] bg-gray-900/90 px-4 py-1.5 rounded-full border border-gray-700 backdrop-blur-md z-10 shadow-lg">
                <Icon size={14} className={t.stroke.replace('stroke-', 'text-')} />
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">{label}</span>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, subtext, icon: Icon, colorClass, special = false }: any) => (
    <div className={`relative overflow-hidden group transition-all duration-500 rounded-2xl p-4 border border-white/10 ${special ? 'bg-gradient-to-br from-yellow-900/20 to-black shadow-[0_0_30px_rgba(234,179,8,0.2)] border-yellow-500/30' : 'bg-white/5 backdrop-blur-md hover:bg-white/10'}`}>
        <div className={`absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-all duration-500 ${colorClass} group-hover:scale-110`}>
            <Icon size={40} />
        </div>
        <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${special ? 'text-yellow-500' : 'text-gray-400'}`}>{label}</p>
        <p className={`text-2xl font-black ${colorClass} tracking-tight drop-shadow-lg ${special ? 'animate-pulse' : ''}`}>{value}</p>
        <p className="text-[10px] text-gray-400/80 mt-1 font-medium">{subtext}</p>

        {special && (
            <div className="absolute inset-0 bg-yellow-400/10 blur-xl -z-10 animate-pulse" />
        )}
    </div>
);

// Data Points for Interpolation
const TARGET_POINTS = [
    { income: 500, basic: 12, pro: 6 },
    { income: 1000, basic: 24, pro: 12 },
    { income: 2500, basic: 36, pro: 18 },
    { income: 5000, basic: 48, pro: 30 },
    { income: 10000, basic: 60, pro: 42 },
    { income: 50000, basic: 78, pro: 60 },
];

const TargetCalculatorModal: React.FC<TargetCalculatorModalProps> = ({ isOpen, onClose, onApply }) => {
    const { language } = useLanguage();
    const txt = language === 'it' ? texts.it : texts.de;

    const [inputValue, setInputValue] = useState<string>("1500");
    const [workMode, setWorkMode] = useState<'basic' | 'pro'>('basic');
    const [results, setResults] = useState({ people: 0, time: 0, structure: 'N/A', contracts: 0, projY2: 0, projY3: 0 });
    const [animating, setAnimating] = useState(false);

    useEffect(() => {
        setAnimating(true);
        const desiredIncome = Number(inputValue) || 0;

        const calculate = () => {
            const REVENUE_PER_CONTRACT_Y1 = 0.75;
            const REVENUE_PER_CONTRACT_Y2 = 1.125;
            const REVENUE_PER_CONTRACT_Y3 = 1.50;

            // 1. Calculate People Needed
            let totalPeopleNeeded = Math.ceil(desiredIncome / REVENUE_PER_CONTRACT_Y1);
            if (totalPeopleNeeded < 1 && desiredIncome > 0) totalPeopleNeeded = 1;

            // 2. Calculate Months via Interpolation
            let estimatedMonths = 0;
            if (desiredIncome > 0) {
                // Find lower and upper bounds
                let lower = { income: 0, basic: 0, pro: 0 };
                let upper = TARGET_POINTS[0];

                for (let i = 0; i < TARGET_POINTS.length; i++) {
                    if (desiredIncome <= TARGET_POINTS[i].income) {
                        upper = TARGET_POINTS[i];
                        if (i > 0) lower = TARGET_POINTS[i - 1];
                        break;
                    }
                    if (i === TARGET_POINTS.length - 1) {
                        // Beyond max, use the last two points to extrapolate or just clamp? 
                        // For simplicity, let's just linearly extrapolate from the last interval
                        lower = TARGET_POINTS[i - 1];
                        upper = TARGET_POINTS[i];
                    }
                }

                // Linear Interpolation
                // y = y1 + (x - x1) * (y2 - y1) / (x2 - x1)
                const range = (upper.income - lower.income) || 1; // avoid div by 0
                const percent = (desiredIncome - lower.income) / range;

                const valLower = workMode === 'basic' ? lower.basic : lower.pro;
                const valUpper = workMode === 'basic' ? upper.basic : upper.pro;

                // If calculating for income > max defined, we might need special handling, but the loop above assigns upper as the last point, 
                // effectively capping logic unless we want proper extrapolation. 
                // Given the loop logic above: if desired > max, lower=50000, upper=50000. Wait, loop needs fix for >50000.
                // Correction for > 50000:
                if (desiredIncome > TARGET_POINTS[TARGET_POINTS.length - 1].income) {
                    const last = TARGET_POINTS[TARGET_POINTS.length - 1];
                    const prev = TARGET_POINTS[TARGET_POINTS.length - 2];

                    // Slope
                    const slope = (workMode === 'basic' ? (last.basic - prev.basic) : (last.pro - prev.pro)) / (last.income - prev.income);
                    const initial = workMode === 'basic' ? last.basic : last.pro;
                    estimatedMonths = initial + (desiredIncome - last.income) * slope;

                } else {
                    estimatedMonths = valLower + (percent * (valUpper - valLower));
                }
            }

            estimatedMonths = Math.ceil(estimatedMonths);

            const totalContracts = totalPeopleNeeded;

            let structureSuggestion = "Starter";
            if (totalContracts >= 5000) structureSuggestion = "NATIONAL MANAGER";
            else if (totalContracts >= 1500) structureSuggestion = "REGIONAL MANAGER";
            else if (totalContracts >= 600) structureSuggestion = "PRO MANAGER";

            // Calcolo Bonus Qualifica
            let bonus = 0;
            if (totalContracts >= 5000) {
                bonus = 3000;
            } else if (totalContracts >= 1500) {
                bonus = 1000;
            } else if (totalContracts >= 600) {
                bonus = 300;
            }

            const projY2 = (totalContracts * REVENUE_PER_CONTRACT_Y2) + bonus;
            const projY3 = (totalContracts * REVENUE_PER_CONTRACT_Y3) + bonus;

            setResults({
                people: totalPeopleNeeded,
                time: estimatedMonths,
                structure: structureSuggestion,
                contracts: totalContracts,
                projY2,
                projY3
            });
            setTimeout(() => setAnimating(false), 600);
        };

        if (isOpen) calculate();
    }, [inputValue, isOpen, workMode]);

    if (!isOpen) return null;

    const contractsPercentage = Math.min((results.contracts / 5000) * 100, 100) || 5;
    const timePercentage = Math.min((results.time / 60) * 100, 100) || 5; // Adjusted scale for months

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/^0+/, '');
        setInputValue(val);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_70%)]"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre-v2.png')] opacity-20 mix-blend-overlay"></div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 border border-white/10 rounded-[2.5rem] shadow-[0_0_60px_rgba(79,70,229,0.3)] w-full max-w-3xl relative overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh] overflow-y-auto custom-scrollbar backdrop-blur-2xl">

                <div className="p-6 pb-4 relative z-10 flex justify-between items-center border-b border-white/10 bg-white/5 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gray-900 rounded-xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                            <Target size={24} className="text-amber-500 animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">
                                Target <span className="text-amber-500">Simulator</span>
                            </h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{txt.subtitle}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-900 text-gray-400 rounded-full hover:bg-gray-800 hover:text-white transition-all border border-gray-800">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8 relative z-10">

                    {/* SPEED SELECTOR */}
                    <div className="flex flex-col items-center justify-center gap-3 mb-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{txt.modeLabel}</span>
                        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900/50 rounded-2xl border border-gray-700 w-full max-w-md">
                            <button
                                onClick={() => setWorkMode('basic')}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all ${workMode === 'basic' ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/50 scale-[1.02]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                            >
                                <Briefcase size={16} />
                                {txt.modeBasic}
                            </button>
                            <button
                                onClick={() => setWorkMode('pro')}
                                className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold uppercase transition-all ${workMode === 'pro' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50 scale-[1.02]' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                            >
                                <Star size={16} />
                                {txt.modePro}
                            </button>
                        </div>
                    </div>

                    <div className="relative group text-center">
                        <label className="text-emerald-500 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
                            {txt.inputLabel}
                        </label>
                        <div className="relative inline-block w-full max-w-xs">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={handleInputChange}
                                min={0}
                                className="w-full bg-transparent text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 font-mono text-7xl font-black text-center py-4 focus:outline-none border-b-2 border-white/10 focus:border-amber-500 transition-all placeholder-white/10 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                placeholder="0"
                            />
                            <span className="absolute top-1/2 -translate-y-1/2 -right-6 text-gray-500 text-4xl font-thin opacity-50">€</span>

                            {/* RESET BUTTON */}
                            {inputValue !== "0" && inputValue !== "" && (
                                <button
                                    onClick={() => setInputValue("0")}
                                    className="mt-4 mx-auto block md:absolute md:mt-0 md:left-auto md:translate-x-0 md:top-1/2 md:-translate-y-1/2 md:-right-16 md:bottom-auto p-2 text-white/50 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                                    title={txt.resetBtn}
                                >
                                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 md:bg-transparent md:border-0 md:p-0">
                                        <X size={16} />
                                        <span className="md:hidden text-xs font-bold uppercase tracking-wider">{txt.resetBtn}</span>
                                    </div>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* DASHBOARD GAUGES MIGLIORATE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 justify-center items-center px-4">
                        <SmartGauge percentage={animating ? 0 : contractsPercentage} value={results.contracts} label={txt.peopleLabel} icon={FileText} colorTheme="emerald" />
                        <SmartGauge percentage={animating ? 0 : timePercentage} value={results.time} label={txt.timeLabel} icon={Clock} colorTheme="purple" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard label={txt.rankLabel} value={results.structure} subtext={txt.rankSub} icon={Zap} colorClass="text-yellow-400" special={true} />
                        <StatCard label={txt.projY2Label} value={formatCurrency(results.projY2)} subtext={txt.projY2Sub} icon={TrendingUp} colorClass="text-emerald-400" />
                        <StatCard label={txt.projY3Label} value={formatCurrency(results.projY3)} subtext={txt.projY3Sub} icon={Activity} colorClass="text-purple-400" />
                    </div>

                    <div className="text-center">
                        <p className="text-gray-600 text-[10px] italic">{txt.disclaimer}</p>
                    </div>
                </div>

                <div className="p-6 bg-white/5 backdrop-blur-md border-t border-white/10">
                    <button onClick={onClose} className="w-full py-5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white rounded-2xl font-black text-xl uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:-translate-y-1 active:translate-y-0 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-white/20 skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                        {txt.backBtn}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TargetCalculatorModal;