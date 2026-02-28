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

const SmartGauge = ({ percentage, value, label, icon: Icon, colorTheme }: any) => {
    const radius = 58;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const themes: any = {
        blue: { stroke: "stroke-blue-500", text: "text-blue-600", bg: "stroke-gray-100" },
        purple: { stroke: "stroke-indigo-500", text: "text-indigo-600", bg: "stroke-gray-100" },
        emerald: { stroke: "stroke-emerald-500", text: "text-emerald-600", bg: "stroke-gray-100" },
    };
    const t = themes[colorTheme] || themes.blue;

    return (
        <div className="flex flex-col items-center relative group">
            <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r={radius} fill="none" strokeWidth="10" className={t.bg} />
                    <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className={`${t.stroke} transition-all duration-1000 ease-out`}
                        style={{ strokeDasharray: circumference, strokeDashoffset: isNaN(strokeDashoffset) ? circumference : strokeDashoffset }}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-bold ${t.text} tracking-tighter leading-none`}>
                        {value}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-gray-100 z-10">
                <Icon size={14} className={t.text} />
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">{label}</span>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, subtext, icon: Icon, colorClass, special = false }: any) => (
    <div className={`relative overflow-hidden group transition-all duration-300 rounded-3xl p-5 border ${special ? 'bg-amber-50 border-amber-200 shadow-sm' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-md'}`}>
        <div className={`absolute top-4 right-4 p-2 opacity-10 group-hover:opacity-20 transition-all duration-300 ${colorClass}`}>
            <Icon size={32} />
        </div>
        <p className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${special ? 'text-amber-600' : 'text-gray-400'}`}>{label}</p>
        <p className={`text-2xl font-bold ${special ? 'text-amber-700' : 'text-gray-900'} tracking-tight`}>{value}</p>
        <p className="text-[11px] text-gray-500 mt-1 font-medium">{subtext}</p>
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

            let totalPeopleNeeded = Math.ceil(desiredIncome / REVENUE_PER_CONTRACT_Y1);
            if (totalPeopleNeeded < 1 && desiredIncome > 0) totalPeopleNeeded = 1;

            let estimatedMonths = 0;
            if (desiredIncome > 0) {
                let lower = { income: 0, basic: 0, pro: 0 };
                let upper = TARGET_POINTS[0];

                for (let i = 0; i < TARGET_POINTS.length; i++) {
                    if (desiredIncome <= TARGET_POINTS[i].income) {
                        upper = TARGET_POINTS[i];
                        if (i > 0) lower = TARGET_POINTS[i - 1];
                        break;
                    }
                    if (i === TARGET_POINTS.length - 1) {
                        lower = TARGET_POINTS[i - 1];
                        upper = TARGET_POINTS[i];
                    }
                }

                const range = (upper.income - lower.income) || 1;
                const percent = (desiredIncome - lower.income) / range;

                const valLower = workMode === 'basic' ? lower.basic : lower.pro;
                const valUpper = workMode === 'basic' ? upper.basic : upper.pro;

                if (desiredIncome > TARGET_POINTS[TARGET_POINTS.length - 1].income) {
                    const last = TARGET_POINTS[TARGET_POINTS.length - 1];
                    const prev = TARGET_POINTS[TARGET_POINTS.length - 2];
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

            let bonus = 0;
            if (totalContracts >= 5000) bonus = 3000;
            else if (totalContracts >= 1500) bonus = 1000;
            else if (totalContracts >= 600) bonus = 300;

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
    const timePercentage = Math.min((results.time / 60) * 100, 100) || 5;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/^0+/, '');
        setInputValue(val);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#F2F2F7] w-full max-w-2xl relative rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-10 sm:zoom-in-95 duration-400 flex flex-col max-h-[95vh] overflow-hidden">

                {/* iOS Style Handle for Mobile */}
                <div className="sm:hidden flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-gray-300" />
                </div>

                <div className="px-6 py-4 flex justify-between items-center border-b border-gray-200 bg-white/80 backdrop-blur-md">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                            {txt.title}
                        </h2>
                        <p className="text-gray-500 text-[11px] font-semibold uppercase tracking-wider">{txt.subtitle}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-100 text-gray-500 rounded-full hover:bg-gray-200 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar flex-1">

                    {/* iOS Segmented Control Style Selector */}
                    <div className="flex flex-col items-center gap-3">
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{txt.modeLabel}</span>
                        <div className="flex p-1 bg-gray-200/50 rounded-xl w-full max-w-sm">
                            <button
                                onClick={() => setWorkMode('basic')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${workMode === 'basic' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Briefcase size={14} />
                                {txt.modeBasic}
                            </button>
                            <button
                                onClick={() => setWorkMode('pro')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${workMode === 'pro' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                            >
                                <Star size={14} />
                                {txt.modePro}
                            </button>
                        </div>
                    </div>

                    <div className="text-center py-4">
                        <label className="text-blue-600 font-bold text-[11px] uppercase tracking-widest mb-2 block">
                            {txt.inputLabel}
                        </label>
                        <div className="relative inline-flex items-center justify-center gap-2">
                            <input
                                type="number"
                                value={inputValue}
                                onChange={handleInputChange}
                                min={0}
                                className="bg-transparent text-gray-900 font-bold text-6xl text-center focus:outline-none placeholder-gray-300 max-w-[280px]"
                                placeholder="0"
                            />
                            <span className="text-gray-400 text-4xl font-medium">€</span>

                            {inputValue !== "0" && inputValue !== "" && (
                                <button
                                    onClick={() => setInputValue("0")}
                                    className="absolute -right-12 p-2 text-gray-300 hover:text-gray-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 py-4">
                        <SmartGauge percentage={animating ? 0 : contractsPercentage} value={results.contracts} label={txt.peopleLabel} icon={FileText} colorTheme="emerald" />
                        <SmartGauge percentage={animating ? 0 : timePercentage} value={results.time} label={txt.timeLabel} icon={Clock} colorTheme="purple" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard label={txt.rankLabel} value={results.structure} subtext={txt.rankSub} icon={Zap} colorClass="text-amber-500" special={true} />
                        <StatCard label={txt.projY2Label} value={formatCurrency(results.projY2)} subtext={txt.projY2Sub} icon={TrendingUp} colorClass="text-emerald-500" />
                        <StatCard label={txt.projY3Label} value={formatCurrency(results.projY3)} subtext={txt.projY3Sub} icon={Activity} colorClass="text-indigo-500" />
                    </div>

                    <p className="text-gray-400 text-[10px] text-center italic">{txt.disclaimer}</p>
                </div>

                <div className="p-6 bg-white border-t border-gray-200">
                    <button onClick={onClose} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-200">
                        {txt.backBtn}
                    </button>
                    <div className="h-4 sm:hidden" /> {/* Extra spacing for mobile home indicator */}
                </div>
            </div>
        </div>
    );
};

export default TargetCalculatorModal;