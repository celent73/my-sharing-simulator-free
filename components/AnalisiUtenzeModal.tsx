import React, { useState, useRef } from 'react';
import { X, Calculator, Wallet, ArrowRight, Settings, ChevronDown, ChevronUp, Plus, Minus, Edit2, RotateCcw, Download, Camera, Loader2, RefreshCcw, Zap } from 'lucide-react';
import { PlanInput, CompensationPlanResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { analyzeBillImage, ExtractedBillData } from '../utils/aiService';
import AIScannerModal from './AIScannerModal';
import SharyTrigger from './SharyTrigger';
import { AnalisiUtenzeFocusMode } from './AnalisiUtenzeFocusMode';

interface AnalisiUtenzeModalProps {
    isOpen: boolean;
    onClose: () => void;
    inputs: PlanInput;
    period: 'monthly' | 'annual';
    onInputChange: (field: keyof PlanInput, value: number) => void;
    planResult: CompensationPlanResult;
}

export const AnalisiUtenzeModal: React.FC<AnalisiUtenzeModalProps> = ({ isOpen, onClose, inputs, period, onInputChange, planResult }) => {
    const { language } = useLanguage();
    const modalRef = useRef<HTMLDivElement>(null);
    // const [isExporting, setIsExporting] = useState(false); // REMOVED


    // --- TRADUZIONI ---
    const texts = {
        it: {
            premiumAnalysis: "Analisi Premium",
            title: "Analisi Utenze",
            subtitle: "Scopri quanto puoi risparmiare realmente.",
            reset: "Azzera tutto",
            electricity: "Energia Elettrica",
            enterData: "Inserisci i dati della tua bolletta",
            priceKw: "Spread luce (margine azienda)",
            pun: "PUN (Prezzo Unico Naz.)",
            monthlyConsumption: "Consumo Mensile",
            fixedCosts: "Spese Fisse / Oneri (Mensile)",
            totalElectricity: "Totale Luce",
            annual: "Annuo",
            monthly: "Mensile",
            gas: "Gas Metano",
            priceSmc: "Spread Gas (margine azienda)",
            psv: "PSV (Punto Scambio Virtuale)",
            totalGas: "Totale Gas",
            summary: "Riepilogo",
            total: "Totale",
            totalBillsCost: "Costo totale bollette (Energia + Fissi)",
            yourCashback: "Il tuo Cashback",
            edit: "Modifica",
            cashbackSettings: "Impostazioni Cashback",
            spending: "Spesa Mensile (€)",
            newTotal: "Nuovo Totale",
            daPagare: "DA PAGARE",
            profitto: "PROFITTO!",
            disclaimer: "* I valori sono stime basate sui dati inseriti. Il calcolo include solo la quota energia e cashback indicativo.",
            understood: "Ho capito!",
            downloadPdf: "Scarica PDF",
            includeSpread: "Includi Spread",
            spreadImpact: "Valore Spread",
            compareTitle: "Confronta con altro fornitore",
            otherSupplier: "Altro Fornitore",
            unionPower: "Union Energia",
            versus: "VS",
            otherSpreadLuce: "Spread Luce Altro (€/kW)",
            otherSpreadGas: "Spread Gas Altro (€/Smc)",
            otherFixedLuce: "Costi Fissi Luce Altro (€)",
            otherFixedGas: "Costi Fissi Gas Altro (€)",
            otherSupplierName: "Nome Fornitore",
            activateComparison: "CONFRONTA CON ALTRO",
            deactivateComparison: "TORNA ALLA BOLLETTA",
            savingVersus: "Risparmio reale vs Altro",
            modeConfronto: "MODALITÀ CONFRONTO",
            savingWithOther: "Risparmio con {name}",
            extraSavingUnion: "Risparmio EXTRA con Union",
            lowerPrice: "Prezzo più basso",
            payingLessWithOther: "Stai pagando meno rispetto a Union",
            includeEarnings: "Includi Guadagni Rete",
            addEarnings: "AGGIUNGI BONUS E RENDITE",
            earningsImpact: "Valore Guadagni"
        },
        de: {
            premiumAnalysis: "Premium Analyse",
            title: "Versorgungsanalyse",
            subtitle: "Entdecke, wie viel du wirklich sparen kannst.",
            reset: "Alles zurücksetzen",
            electricity: "Strom",
            enterData: "Gib deine Rechnungsdaten ein",
            priceKw: "Marge Strom",
            pun: "PUN",
            monthlyConsumption: "Monatlicher Verbrauch",
            fixedCosts: "Fixkosten / Gebühren (Monatlich)",
            totalElectricity: "Gesamt Strom",
            annual: "Jährlich",
            monthly: "Monatlich",
            gas: "Erdgas",
            priceSmc: "Marge Gas",
            psv: "PSV",
            totalGas: "Gesamt Gas",
            summary: "Zusammenfassung",
            total: "Gesamt",
            totalBillsCost: "Gesamtkosten Rechnungen (Energie + Fix)",
            yourCashback: "Dein Cashback",
            edit: "Bearbeiten",
            cashbackSettings: "Cashback-Einstellungen",
            spending: "Monatliche Ausgaben (€)",
            newTotal: "Neue Gesamtsumme",
            daPagare: "ZU ZAHLEN",
            profitto: "GEWINN!",
            disclaimer: "* Die Werte sind Schätzungen basierend auf den eingegebenen Daten. Die Berechnung umfasst nur den Energieanteil und das indikative Cashback.",
            understood: "Verstanden!",
            downloadPdf: "PDF herunterladen",
            includeSpread: "Marge einbeziehen",
            spreadImpact: "Margenwert",
            compareTitle: "Mit anderem Anbieter vergleichen",
            otherSupplier: "Anderer Anbieter",
            unionPower: "Union Energia",
            versus: "VS",
            otherSpreadLuce: "Spread Strom Anderer (€/kW)",
            otherSpreadGas: "Spread Gas Anderer (€/Smc)",
            otherFixedLuce: "Fixkosten Strom Anderer (€)",
            otherFixedGas: "Fixkosten Gas Anderer (€)",
            otherSupplierName: "Anbieter Name",
            activateComparison: "VERGLEICH MIT ANDEREN",
            deactivateComparison: "ZURÜCK ZUR RECHNUNG",
            savingVersus: "Echte Ersparnis vs Andere",
            modeConfronto: "VERGLEICHSMODUS",
            savingWithOther: "Ersparnis mit {name}",
            extraSavingUnion: "EXTRA Ersparnis mit Union",
            lowerPrice: "Niedrigerer Preis",
            payingLessWithOther: "Du zahlst weniger im Vergleich zu Union",
            includeEarnings: "Netzwerkeinkommen einbeziehen",
            addEarnings: "BONUS UND RENTEN HINZUFÜGEN",
            earningsImpact: "Einkommenswert"
        },
        en: {
            premiumAnalysis: "Premium Analysis",
            title: "Utility Analysis",
            subtitle: "Discover how much you can really save.",
            reset: "Reset All",
            electricity: "Electricity",
            enterData: "Enter your bill data",
            priceKw: "Light Spread (company margin)",
            pun: "PUN (National Single Price)",
            monthlyConsumption: "Monthly Consumption",
            fixedCosts: "Fixed Costs / Charges (Monthly)",
            totalElectricity: "Total Electricity",
            annual: "Annual",
            monthly: "Monthly",
            gas: "Natural Gas",
            priceSmc: "Gas Spread (company margin)",
            psv: "PSV (Virtual Trading Point)",
            totalGas: "Total Gas",
            summary: "Summary",
            total: "Total",
            totalBillsCost: "Total Bill Cost (Energy + Fixed)",
            yourCashback: "Your Cashback",
            edit: "Edit",
            cashbackSettings: "Cashback Settings",
            spending: "Monthly Spending (€)",
            newTotal: "New Total",
            daPagare: "TO PAY",
            profitto: "PROFIT!",
            disclaimer: "* Values are estimates based on entered data. Calculation includes only energy portion and indicative cashback.",
            understood: "Understood!",
            downloadPdf: "Download PDF",
            includeSpread: "Include Spread",
            spreadImpact: "Spread Value",
            compareTitle: "Compare with other provider",
            otherSupplier: "Other Provider",
            unionPower: "Union Energia",
            versus: "VS",
            otherSpreadLuce: "Other Light Spread (€/kW)",
            otherSpreadGas: "Other Gas Spread (€/Smc)",
            otherFixedLuce: "Other Fixed Light Costs (€)",
            otherFixedGas: "Other Fixed Gas Costs (€)",
            otherSupplierName: "Provider Name",
            activateComparison: "COMPARE WITH OTHER",
            deactivateComparison: "BACK TO BILL",
            savingVersus: "Real savings vs Other",
            modeConfronto: "COMPARISON MODE",
            savingWithOther: "Savings with {name}",
            extraSavingUnion: "EXTRA Savings with Union",
            lowerPrice: "Lower Price",
            payingLessWithOther: "You are paying less compared to Union",
            includeEarnings: "Include Network Earnings",
            addEarnings: "ADD BONUS AND ANNUITIES",
            earningsImpact: "Earnings Value"
        }
    };

    const txt = texts[language as keyof typeof texts] || texts.en;

    // Use a helper to safely get values from inputs prop (which might be undefined initially)
    const getVal = (v: any) => (v !== undefined && v !== 0 && v !== '0') ? v.toString().replace('.', ',') : '';

    const [electricityPrice, setElectricityPrice] = useState<string>(getVal(inputs.electricityPrice));
    const [punValue, setPunValue] = useState<string>(getVal(inputs.punValue));
    const [electricityConsumption, setElectricityConsumption] = useState<string>(getVal(inputs.electricityConsumption));
    const [electricityFixed, setElectricityFixed] = useState<string>(getVal(inputs.electricityFixed));
    const [gasPrice, setGasPrice] = useState<string>(getVal(inputs.gasPrice));
    const [psvValue, setPsvValue] = useState<string>(getVal(inputs.psvValue));
    const [gasConsumption, setGasConsumption] = useState<string>(getVal(inputs.gasConsumption));
    const [gasFixed, setGasFixed] = useState<string>(getVal(inputs.gasFixed));
    const [isEditingCashback, setIsEditingCashback] = useState(false);
    const [includeSpread, setIncludeSpread] = useState(inputs.includeSpread ?? true);
    const [isComparisonMode, setIsComparisonMode] = useState(inputs.isComparisonMode ?? false);
    const [otherElecSpread, setOtherElecSpread] = useState<string>(getVal(inputs.otherElecSpread) || '0,01');
    const [otherGasSpread, setOtherGasSpread] = useState<string>(getVal(inputs.otherGasSpread) || '0,01');
    const [otherElecFixed, setOtherElecFixed] = useState<string>(getVal(inputs.otherElecFixed) || '12,00');
    const [otherGasFixed, setOtherGasFixed] = useState<string>(getVal(inputs.otherGasFixed) || '10,00');
    const [otherSupplierName, setOtherSupplierName] = useState<string>(inputs.otherSupplierName || '');
    const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
    const [scanType, setScanType] = useState<'electricity' | 'gas' | 'any'>('any');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
    const [currentPeriod, setCurrentPeriod] = useState<'monthly' | 'annual'>(period);

    // Sync helper
    const syncInput = (field: keyof PlanInput, strVal: string) => {
        const numVal = parseFloat(strVal.replace(',', '.')) || 0;
        onInputChange(field, numVal);
    };

    const openScanner = (type: 'electricity' | 'gas' | 'any' = 'any') => {
        setScanType(type);
        setIsScannerModalOpen(true);
    };

    const applyExtractedData = (data: ExtractedBillData) => {
        console.log("Applying data:", data);
        let foundAny = false;
        let updatedFields: string[] = [];

        // Helper to update only if value is valid
        const updateIfValid = (value: number | undefined | null, setter: (v: string) => void, fieldName: string) => {
            if (value !== undefined && value !== null && value > 0) {
                setter(value.toString());
                return true;
            }
            return false;
        };

        if (data.electricity && (scanType === 'electricity' || scanType === 'any')) {
            let hasElec = false;
            if (data.electricity.consumption) { setElectricityConsumption(data.electricity.consumption.toString()); syncInput('electricityConsumption', data.electricity.consumption.toString()); hasElec = true; }
            if (data.electricity.fixedCosts) { setElectricityFixed(data.electricity.fixedCosts.toString()); syncInput('electricityFixed', data.electricity.fixedCosts.toString()); hasElec = true; }
            if (data.electricity.pun) { setPunValue(data.electricity.pun.toString()); syncInput('punValue', data.electricity.pun.toString()); hasElec = true; }
            if (data.electricity.spread) { setElectricityPrice(data.electricity.spread.toString()); syncInput('electricityPrice', data.electricity.spread.toString()); hasElec = true; }

            if (hasElec) {
                foundAny = true;
                updatedFields.push("Energia Elettrica");
            }
        }

        if (data.gas && (scanType === 'gas' || scanType === 'any')) {
            let hasGas = false;
            if (data.gas.consumption) { setGasConsumption(data.gas.consumption.toString()); syncInput('gasConsumption', data.gas.consumption.toString()); hasGas = true; }
            if (data.gas.fixedCosts) { setGasFixed(data.gas.fixedCosts.toString()); syncInput('gasFixed', data.gas.fixedCosts.toString()); hasGas = true; }
            if (data.gas.psv) { setPsvValue(data.gas.psv.toString()); syncInput('psvValue', data.gas.psv.toString()); hasGas = true; }
            if (data.gas.spread) { setGasPrice(data.gas.spread.toString()); syncInput('gasPrice', data.gas.spread.toString()); hasGas = true; }

            if (hasGas) {
                foundAny = true;
                updatedFields.push("Gas");
            }
        }

        if (!foundAny) {
            alert("L'AI ha analizzato il documento ma non ha trovato dati tecnici validi (> 0). Prova con una pagina più chiara.");
        } else {
            // Show a simple success feedback
            // Optional: You could improve this UI later
            console.log(`Updated sections: ${updatedFields.join(", ")}`);
        }
    };

    const handleReset = () => {
        setElectricityPrice(''); syncInput('electricityPrice', '');
        setPunValue(''); syncInput('punValue', '');
        setElectricityConsumption(''); syncInput('electricityConsumption', '');
        setElectricityFixed(''); syncInput('electricityFixed', '');
        setGasPrice(''); syncInput('gasPrice', '');
        setPsvValue(''); syncInput('psvValue', '');
        setGasConsumption(''); syncInput('gasConsumption', '');
        setGasFixed(''); syncInput('gasFixed', '');
        onInputChange('cashbackSpending', 0);
        onInputChange('cashbackPercentage', 0);
        setIncludeSpread(true); onInputChange('includeSpread' as any, 1);
        setIsComparisonMode(false); onInputChange('isComparisonMode' as any, 0);
        setOtherElecSpread('0,01'); syncInput('otherElecSpread', '0,01');
        setOtherGasSpread('0,01'); syncInput('otherGasSpread', '0,01');
        setOtherElecFixed('12,00'); syncInput('otherElecFixed', '12,00');
        setOtherGasFixed('10,00'); syncInput('otherGasFixed', '10,00');
        setOtherSupplierName(''); (onInputChange as any)('otherSupplierName', '');
    };

    /* REMOVED EXPORT PDF LOGIC */


    // Calculate annuals
    const elecSpread = parseFloat(electricityPrice.replace(',', '.')) || 0;
    const pun = parseFloat(punValue.replace(',', '.')) || 0;
    const elecCons = parseFloat(electricityConsumption.replace(',', '.')) || 0;
    const elecFix = parseFloat(electricityFixed.replace(',', '.')) || 0;

    const gasSpread = parseFloat(gasPrice.replace(',', '.')) || 0;
    const psv = parseFloat(psvValue.replace(',', '.')) || 0;
    const gasCons = parseFloat(gasConsumption.replace(',', '.')) || 0;
    const gasFix = parseFloat(gasFixed.replace(',', '.')) || 0;

    // Effective Spread based on Checkbox
    const activeElecSpread = includeSpread ? elecSpread : 0;
    const activeGasSpread = includeSpread ? gasSpread : 0;

    // --- COMPARISON LOGIC ---
    const otherElecSpreadVal = parseFloat(otherElecSpread.replace(',', '.')) || 0;
    const otherGasSpreadVal = parseFloat(otherGasSpread.replace(',', '.')) || 0;
    const otherElecFixVal = parseFloat(otherElecFixed.replace(',', '.')) || 0;
    const otherGasFixVal = parseFloat(otherGasFixed.replace(',', '.')) || 0;

    const monthlyOtherElecCost = ((otherElecSpreadVal + pun) * elecCons) + otherElecFixVal;
    const monthlyOtherGasCost = ((otherGasSpreadVal + psv) * gasCons) + otherGasFixVal;
    const totalMonthlyOtherCost = monthlyOtherElecCost + monthlyOtherGasCost;

    // --- UNION LOGIC ---
    const monthlyElectricityCost = ((activeElecSpread + pun) * elecCons) + elecFix;
    const annualElectricityCost = monthlyElectricityCost * 12;

    const monthlyGasCost = ((activeGasSpread + psv) * gasCons) + gasFix;
    const annualGasCost = monthlyGasCost * 12;

    const totalAnnualCost = annualElectricityCost + annualGasCost;
    const totalMonthlyCost = monthlyElectricityCost + monthlyGasCost;

    const monthlyCashback = (inputs.cashbackSpending * inputs.cashbackPercentage) / 100;
    const annualCashback = monthlyCashback * 12;

    // --- EARNINGS LOGIC (BONUS & RECURRING) ---
    const isEarningsActive = !!inputs.includeEarningsInAnalysis;
    const monthlyRecurringEarning = planResult.totalRecurringYear1; // This is monthly
    const oneTimeBonus = planResult.totalOneTimeBonus - planResult.monthlyCashback; // One-time part only

    const earningsMonthly = isEarningsActive ? (monthlyRecurringEarning + oneTimeBonus) : 0;
    const earningsAnnual = isEarningsActive ? ((monthlyRecurringEarning * 12) + oneTimeBonus) : 0;
    const currentEarnings = currentPeriod === 'annual' ? earningsAnnual : earningsMonthly;

    const rawNetMonthly = totalMonthlyCost - monthlyCashback - earningsMonthly;
    const rawNetAnnual = totalAnnualCost - annualCashback - earningsAnnual;

    // Comparison Final Values
    const finalUnionMonthly = rawNetMonthly;
    const finalOtherMonthly = totalMonthlyOtherCost;

    const versusSaving = finalOtherMonthly - finalUnionMonthly;

    // Spread Impact Calculation (Difference)
    const monthlySpreadImpact = (elecSpread * elecCons) + (gasSpread * gasCons);
    const annualSpreadImpact = monthlySpreadImpact * 12;
    const currentSpreadImpact = currentPeriod === 'annual' ? annualSpreadImpact : monthlySpreadImpact;


    // Determine Status
    // > 0 means Cost is higher than Cashback (Debt)
    // <= 0 means Cashback covers Cost (Surplus or Break-even)
    const isDebt = (currentPeriod === 'annual' ? rawNetAnnual : rawNetMonthly) > 0.01; // small epsilon
    const isSurplus = (currentPeriod === 'annual' ? rawNetAnnual : rawNetMonthly) < -0.01;

    // Dynamic Gradient - FORCED GREEN as requested
    let gradientClass = "from-emerald-400 via-green-400 to-teal-400";

    const savingsPercentage = totalMonthlyCost > 0 ? (monthlyCashback / totalMonthlyCost) * 100 : 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div ref={modalRef} className="bg-white/90 backdrop-blur-2xl rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl w-full md:max-w-3xl max-w-2xl overflow-hidden relative animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 border-t sm:border border-white/80 flex flex-col max-h-[95vh]">

                {/* Header WOW PREMIUM */}
                <div className="relative overflow-hidden p-8 pb-4 shrink-0">
                    <div className="relative z-10 flex justify-between items-start">
                        <div className="flex items-center gap-3 sm:gap-5">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-500/20 ring-4 ring-white">
                                <Calculator size={32} strokeWidth={2.5} />
                            </div>
                            <div>
                                <h2 className="text-xl sm:text-3xl font-black text-slate-900 leading-none tracking-tighter">{txt.title}</h2>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                    <p className="text-xs font-black text-indigo-600/70 uppercase tracking-widest">{txt.premiumAnalysis}</p>
                                    <SharyTrigger
                                        message="Ciao! Qui puoi analizzare il risparmio. Immetti 0.02 come lo spread di Union (se non ricordi, usa quello). Poi il PUN di mercato a circa 0.11 e le spese fisse Union a 11.50. Per il gas: Spread Union 0.12, PSV circa 0.33, Spese fisse 11.50. Ora se vuoi fare un confronto con un altro gestore clicca su confronta con altro e immetti i dati dell'altro gestore, in basso troverai il resoconto!"
                                        messageDe="Hallo! Hier kannst du die Ersparnis analysieren. Gib 0,02 als Union-Spread ein (wenn du dich nicht erinnerst, nimm diesen). Dann den Markt-PUN mit ca. 0,11 und die Union-Fixkosten mit 11,50. Für Gas: Union-Spread 0,12, PSV ca. 0,33, Fixkosten 11,50. Wenn du einen Vergleich mit einem anderen Anbieter machen möchtest, klicke auf 'Mit anderem vergleichen' und gib die Daten des anderen Anbieters ein. Unten findest du die Zusammenfassung!"
                                        messageEn="Hello! Here you can analyze the savings. Enter 0.02 as the Union spread (if you don't remember, use that). Then the market PUN at about 0.11 and Union fixed costs at 11.50. For gas: Union Spread 0.12, PSV about 0.33, Fixed costs 11.50. Now if you want to make a comparison with another provider click on compare with other and enter the data of the other provider, at the bottom you will find the report!"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <button
                                onClick={handleReset}
                                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-2xl border border-red-100/50 hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-sm"
                                title={txt.reset}
                            >
                                <RotateCcw size={22} strokeWidth={2.5} />
                            </button>
                            <button
                                onClick={() => setIsFocusModeOpen(true)}
                                className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-indigo-50 text-indigo-500 rounded-2xl border border-indigo-100/50 hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-sm"
                                title="Focus Mode"
                            >
                                <Zap size={22} fill="currentColor" strokeWidth={0} />
                            </button>
                            <button
                                onClick={() => {
                                    const newVal = !isComparisonMode;
                                    setIsComparisonMode(newVal);
                                    onInputChange('isComparisonMode' as any, newVal ? 1 : 0);
                                }}
                                className={`h-10 sm:h-12 px-3 sm:px-6 rounded-2xl transition-all border font-black text-[10px] sm:text-xs tracking-widest uppercase flex items-center gap-3 shadow-md active:scale-95 ${isComparisonMode ? 'bg-orange-600 text-white border-orange-500' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
                            >
                                <RefreshCcw size={18} className={`${isComparisonMode ? 'animate-spin-slow' : ''}`} />
                                <span className="hidden sm:inline">{isComparisonMode ? (txt as any).modeConfronto : (txt as any).activateComparison}</span>
                            </button>
                            <button onClick={onClose} className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-slate-100 text-slate-400 rounded-2xl border border-slate-200/50 hover:bg-slate-200 hover:text-slate-900 transition-all active:scale-95"><X size={20} className="sm:w-6 sm:h-6" strokeWidth={3} /></button>
                        </div>
                    </div>
                </div>

                {/* Comparison Header Inputs if active */}
                {isComparisonMode && (
                    <div className="bg-orange-50 dark:bg-orange-950/30 p-4 border-b border-orange-200 dark:border-orange-900/50 animate-in slide-in-from-top duration-300">
                        <div className="space-y-4 max-w-2xl mx-auto">
                            <div className="space-y-1">
                                <label className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-tighter truncate block">{(txt as any).otherSupplierName}</label>
                                <input
                                    type="text"
                                    value={otherSupplierName}
                                    onChange={(e) => {
                                        setOtherSupplierName(e.target.value);
                                        (onInputChange as any)('otherSupplierName', e.target.value);
                                    }}
                                    className="w-full bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-900 rounded-lg px-3 py-2 text-sm font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-500 shadow-sm"
                                    placeholder="Es. Enel, Edison, Sorgenia..."
                                />
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-tighter truncate block">{(txt as any).otherSpreadLuce}</label>
                                    <input
                                        type="text"
                                        value={otherElecSpread}
                                        onChange={(e) => { setOtherElecSpread(e.target.value); syncInput('otherElecSpread', e.target.value); }}
                                        className="w-full bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-900 rounded-lg px-2 py-1.5 text-sm font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-500"
                                        placeholder="0,01"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-tighter truncate block">{(txt as any).otherFixedLuce}</label>
                                    <input
                                        type="text"
                                        value={otherElecFixed}
                                        onChange={(e) => { setOtherElecFixed(e.target.value); syncInput('otherElecFixed', e.target.value); }}
                                        className="w-full bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-900 rounded-lg px-2 py-1.5 text-sm font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-500"
                                        placeholder="12,00"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-tighter truncate block">{(txt as any).otherSpreadGas}</label>
                                    <input
                                        type="text"
                                        value={otherGasSpread}
                                        onChange={(e) => { setOtherGasSpread(e.target.value); syncInput('otherGasSpread', e.target.value); }}
                                        className="w-full bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-900 rounded-lg px-2 py-1.5 text-sm font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-500"
                                        placeholder="0,01"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-tighter truncate block">{(txt as any).otherFixedGas}</label>
                                    <input
                                        type="text"
                                        value={otherGasFixed}
                                        onChange={(e) => { setOtherGasFixed(e.target.value); syncInput('otherGasFixed', e.target.value); }}
                                        className="w-full bg-white dark:bg-gray-800 border-2 border-orange-200 dark:border-orange-900 rounded-lg px-2 py-1.5 text-sm font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-500"
                                        placeholder="10,00"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}


                {/* Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pt-4 pb-4 md:p-5 space-y-4 md:space-y-5 bg-gray-50/50 dark:bg-gray-900/50">

                    {/* Electricity Section */}
                    <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-bl-full transition-all group-hover:scale-110"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shadow-sm">
                                    <Calculator size={22} fill="currentColor" />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{txt.electricity}</h3>
                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">{txt.enterData}</p>
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.priceKw}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={electricityPrice}
                                        onChange={(e) => { setElectricityPrice(e.target.value); syncInput('electricityPrice', e.target.value); }}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all text-lg"
                                        placeholder="0,05"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€/kW</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.pun}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={punValue}
                                        onChange={(e) => { setPunValue(e.target.value); syncInput('punValue', e.target.value); }}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all text-lg"
                                        placeholder="0,10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€/kW</span>
                                </div>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.monthlyConsumption}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={electricityConsumption}
                                        onChange={(e) => { setElectricityConsumption(e.target.value); syncInput('electricityConsumption', e.target.value); }}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all text-lg"
                                        placeholder="250"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">kWh</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.fixedCosts}</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={electricityFixed}
                                    onChange={(e) => { setElectricityFixed(e.target.value); syncInput('electricityFixed', e.target.value); }}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all text-lg"
                                    placeholder="10,00"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                            </div>
                        </div>

                        {/* Result Mini-Card */}
                        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/20 flex justify-between items-center">
                            <span className="text-sm font-bold text-yellow-700 dark:text-yellow-500 uppercase">{txt.totalElectricity} {currentPeriod === 'annual' ? txt.annual : txt.monthly}</span>
                            <span className="text-xl font-black text-yellow-600 dark:text-yellow-400">€{(currentPeriod === 'annual' ? annualElectricityCost : monthlyElectricityCost).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    {/* Gas Section */}
                    <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-orange-400/10 rounded-bl-full transition-all group-hover:scale-110"></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-sm">
                                    <Calculator size={22} fill="currentColor" />
                                </div>
                                <div>
                                    <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">{txt.gas}</h3>
                                    <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium">{txt.enterData}</p>
                                </div>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.priceSmc}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={gasPrice}
                                        onChange={(e) => { setGasPrice(e.target.value); syncInput('gasPrice', e.target.value); }}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all text-lg"
                                        placeholder="0,10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€/Smc</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.psv}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={psvValue}
                                        onChange={(e) => { setPsvValue(e.target.value); syncInput('psvValue', e.target.value); }}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all text-lg"
                                        placeholder="0,40"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€/Smc</span>
                                </div>
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.monthlyConsumption}</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={gasConsumption}
                                        onChange={(e) => { setGasConsumption(e.target.value); syncInput('gasConsumption', e.target.value); }}
                                        className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all text-lg"
                                        placeholder="100"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">Smc</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">{txt.fixedCosts}</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={gasFixed}
                                    onChange={(e) => { setGasFixed(e.target.value); syncInput('gasFixed', e.target.value); }}
                                    className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-bold text-gray-700 dark:text-white focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-400/20 transition-all text-lg"
                                    placeholder="5,00"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">€</span>
                            </div>
                        </div>

                        {/* Result Mini-Card */}
                        <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/20 flex justify-between items-center">
                            <span className="text-sm font-bold text-orange-700 dark:text-orange-500 uppercase">{txt.totalGas} {currentPeriod === 'annual' ? txt.annual : txt.monthly}</span>
                            <span className="text-xl font-black text-orange-600 dark:text-orange-400">€{(currentPeriod === 'annual' ? annualGasCost : monthlyGasCost).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    {/* TOTALS and CASHBACK COMPARISON */}
                    <div className={`p-1 rounded-[2.5rem] bg-gradient-to-br ${gradientClass} shadow-2xl relative overflow-hidden transition-all duration-500`}>
                        <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm"></div>
                        {/* Remove sparkle animation for simplicity, matches the clean green look */}

                        <div className="bg-white/95 dark:bg-gray-900/95 rounded-[2.3rem] p-6 relative z-10">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{txt.summary} {currentPeriod === 'annual' ? txt.annual : txt.monthly} {txt.total}</h3>
                                {isComparisonMode ? (
                                    <div className="flex flex-col items-center gap-4 py-2">
                                        <div className="flex items-center justify-center gap-4 w-full px-2">
                                            {/* Other Supplier Card */}
                                            <div className="flex-1 bg-gray-100 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-200 dark:border-gray-700">
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-1 truncate">
                                                    {otherSupplierName || (txt as any).otherSupplier}
                                                </p>
                                                <p className="text-xl md:text-2xl font-black text-gray-600 dark:text-gray-400">
                                                    €{finalOtherMonthly.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-400/70">{(txt as any).daPagare}</p>
                                            </div>

                                            <div className="flex flex-col items-center justify-center">
                                                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-900 border-2 border-orange-500 flex items-center justify-center text-orange-500 font-black text-xs shadow-lg z-10">
                                                    {(txt as any).versus}
                                                </div>
                                                <div className="w-0.5 h-12 bg-gradient-to-b from-transparent via-orange-500/20 to-transparent -mt-6"></div>
                                            </div>

                                            {/* Union Power Card */}
                                            <div className="flex-1 bg-emerald-100/50 dark:bg-emerald-900/30 p-4 rounded-3xl border-2 border-emerald-400/50 shadow-inner">
                                                <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">{(txt as any).unionPower}</p>
                                                <p className="text-xl md:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                    €{finalUnionMonthly.toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                                </p>
                                                <p className="text-[10px] font-bold text-emerald-500/70">{finalUnionMonthly < 0 ? (txt as any).profitto : (txt as any).daPagare}</p>
                                            </div>
                                        </div>

                                        {/* Real Saving Highlight */}
                                        <div className={`inline-flex flex-col items-center px-6 py-3 rounded-2xl bg-gradient-to-r text-white shadow-xl animate-bounce-slow ${versusSaving > 0 ? 'from-orange-500 to-amber-500' : 'from-gray-600 to-gray-700'}`}>
                                            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                                {versusSaving > 0
                                                    ? (txt as any).extraSavingUnion
                                                    : (otherSupplierName || (txt as any).otherSupplier)}
                                            </span>
                                            <span className="text-2xl font-black">€{Math.abs(versusSaving).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                            {versusSaving <= 0 && (
                                                <span className="text-[9px] font-bold opacity-90">{(txt as any).payingLessWithOther}</span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="flex flex-col items-center">
                                                {/* CHANGED TO RED */}
                                                <span className="text-5xl font-black text-red-600 dark:text-red-400">
                                                    €{(currentPeriod === 'annual' ? totalAnnualCost : totalMonthlyCost).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                                </span>
                                                <span className="text-sm font-bold text-gray-400 mt-1">
                                                    (€{(currentPeriod === 'annual' ? totalMonthlyCost : totalAnnualCost).toLocaleString('it-IT', { minimumFractionDigits: 2 })} / {currentPeriod === 'annual' ? 'mese' : 'anno'})
                                                </span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-400 font-medium mt-3">{txt.totalBillsCost}</p>
                                    </>
                                )}

                                {/* Checkbox for Spread Inclusion - NEW */}
                                <div className="mt-4 flex items-center justify-center gap-3">
                                    <label className="flex items-center cursor-pointer gap-2 select-none group">
                                        <input
                                            type="checkbox"
                                            checked={includeSpread}
                                            onChange={(e) => {
                                                const newVal = e.target.checked;
                                                setIncludeSpread(newVal);
                                                onInputChange('includeSpread' as any, newVal ? 1 : 0);
                                            }}
                                            className="w-5 h-5 rounded-md border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                            {txt.includeSpread}
                                        </span>
                                    </label>
                                    <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            {txt.spreadImpact}: {includeSpread ? '' : 'Escluso'} <span className="font-bold text-indigo-600 dark:text-indigo-400">€{currentSpreadImpact.toLocaleString('it-IT', { minimumFractionDigits: 2 })}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>


                            <div className="space-y-4">
                                {/* Comparison Row */}
                                <div className="flex flex-col sm:flex-row gap-4 items-center">

                                    {/* Cashback Card */}
                                    <div className="flex-1 w-full bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 p-4 rounded-2xl border border-purple-100 dark:border-purple-800 flex items-center gap-3">
                                        <div className="p-3 bg-white dark:bg-purple-800 rounded-xl shadow-sm text-purple-600">
                                            <Wallet size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-purple-400 uppercase tracking-wider">{txt.yourCashback} {currentPeriod === 'annual' ? txt.annual : txt.monthly}</p>
                                            <div className="flex items-center gap-2">
                                                <p className="text-xl font-black text-purple-600 dark:text-purple-300">-€{(currentPeriod === 'annual' ? annualCashback : monthlyCashback).toLocaleString('it-IT', { minimumFractionDigits: 2 })}</p>
                                                {!isEditingCashback && (
                                                    <button
                                                        onClick={() => setIsEditingCashback(true)}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-all text-xs font-bold shadow-sm"
                                                    >
                                                        <Edit2 size={12} />
                                                        {txt.edit}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Cashback Edit Section */}
                                {isEditingCashback && (
                                    <div className="mt-4 mb-4 bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-100 dark:border-purple-800 animate-in slide-in-from-top-2">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="text-purple-800 dark:text-purple-300 font-bold text-xs uppercase tracking-wide">{txt.cashbackSettings}</h4>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        onInputChange('cashbackSpending', 0);
                                                        onInputChange('cashbackPercentage', 0);
                                                    }}
                                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white dark:bg-purple-800 text-purple-600 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-700 transition-all text-[10px] font-black shadow-sm border border-purple-100 dark:border-purple-700"
                                                    title="Azzera tutto il cashback"
                                                >
                                                    <RotateCcw size={12} />
                                                    AZZERA
                                                </button>
                                                <button onClick={() => setIsEditingCashback(false)} className="text-purple-400 hover:text-purple-600 transition-colors">
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Period Toggle */}
                                        <div className="flex p-1 bg-white dark:bg-gray-800 rounded-xl border border-purple-100 dark:border-purple-800 mb-4 h-10">
                                            <button
                                                onClick={() => setCurrentPeriod('monthly')}
                                                className={`flex-1 flex items-center justify-center rounded-lg text-xs font-black transition-all ${currentPeriod === 'monthly' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'}`}
                                            >
                                                {txt.monthly.toUpperCase()}
                                            </button>
                                            <button
                                                onClick={() => setCurrentPeriod('annual')}
                                                className={`flex-1 flex items-center justify-center rounded-lg text-xs font-black transition-all ${currentPeriod === 'annual' ? 'bg-purple-600 text-white shadow-md' : 'text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30'}`}
                                            >
                                                {txt.annual.toUpperCase()}
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-purple-400 mb-1 block">{txt.spending}</label>
                                                <input
                                                    type="number"
                                                    value={inputs.cashbackSpending === 0 ? '' : inputs.cashbackSpending}
                                                    onChange={(e) => onInputChange('cashbackSpending', parseFloat(e.target.value) || 0)}
                                                    className="w-full bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-purple-800 rounded-xl px-3 py-2 text-sm font-bold text-gray-700 dark:text-white focus:outline-none focus:border-purple-400 transition-colors"
                                                    placeholder="0"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] uppercase font-bold text-purple-400 mb-1 block">Cashback (%)</label>
                                                <div className="flex items-center justify-between bg-white dark:bg-gray-800 border-2 border-purple-100 dark:border-purple-800 rounded-xl p-1">
                                                    <button
                                                        onClick={() => onInputChange('cashbackPercentage', Math.max(0, inputs.cashbackPercentage - 0.5))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                                                    >
                                                        <Minus size={14} strokeWidth={3} />
                                                    </button>

                                                    <span className="text-lg font-black text-purple-600 dark:text-purple-300 w-16 text-center">
                                                        {inputs.cashbackPercentage}%
                                                    </span>

                                                    <button
                                                        onClick={() => onInputChange('cashbackPercentage', Math.min(100, inputs.cashbackPercentage + 0.5))}
                                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-800 transition-colors"
                                                    >
                                                        <Plus size={14} strokeWidth={3} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="hidden sm:block text-gray-300 dark:text-gray-600">
                                    <ArrowRight size={24} strokeWidth={3} />
                                </div>

                                {/* Net Result Card - FORCED GREEN */}
                                <div className="flex-1 flex flex-col gap-4">
                                    <div className={`w-full bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border-emerald-100 dark:border-emerald-800 p-4 rounded-2xl flex items-center justify-between shadow-lg transform scale-105 border-2 relative overflow-hidden`}>
                                        <div className="relative z-10">
                                            <p className={`text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider`}>{txt.newTotal} {currentPeriod === 'annual' ? txt.annual : txt.monthly}</p>

                                            {/* Main Value */}
                                            <p className={`text-3xl font-black text-emerald-600 dark:text-emerald-400`}>
                                                {isSurplus ? '+' : ''}€{Math.abs(currentPeriod === 'annual' ? rawNetAnnual : rawNetMonthly).toLocaleString('it-IT', { minimumFractionDigits: 2 })}
                                            </p>

                                            {/* Secondary Value / Label */}
                                            <p className={`text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70`}>
                                                {isSurplus ? txt.profitto : txt.daPagare}
                                            </p>
                                        </div>
                                        <div className="text-right relative z-10">
                                            <div className={`inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-xl shadow-sm`}>
                                                <span className="text-sm font-black">
                                                    {isSurplus ? `+${Math.min(100, savingsPercentage).toFixed(0)}%` : `-${Math.min(100, savingsPercentage).toFixed(0)}%`}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Added Decorative Background Icon */}
                                        <Calculator className="absolute -right-4 -bottom-4 text-emerald-500/10 rotate-12" size={100} />
                                    </div>

                                    {/* EARNINGS TOGGLE BUTTON */}
                                    <div className="mt-2">
                                        <button
                                            onClick={() => {
                                                const newVal = !isEarningsActive;
                                                onInputChange('includeEarningsInAnalysis' as any, newVal ? 1 : 0);
                                            }}
                                            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all duration-300 transform active:scale-95 border-2 shadow-xl ${isEarningsActive
                                                ? 'bg-emerald-600 border-emerald-500 text-white hover:bg-emerald-700'
                                                : 'bg-gradient-to-r from-orange-400 to-amber-500 border-orange-300 text-white hover:scale-[1.02] hover:shadow-orange-500/30'
                                                }`}
                                        >
                                            <div className={`p-1.5 rounded-lg ${isEarningsActive ? 'bg-white/20' : 'bg-white/30'} backdrop-blur-sm`}>
                                                <Settings size={20} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm font-black uppercase tracking-wider">
                                                {isEarningsActive ? 'GUADAGNI INCLUSI ✨' : (txt as any).addEarnings}
                                            </span>
                                            {!isEarningsActive && <Plus size={18} strokeWidth={3} />}
                                        </button>
                                        {isEarningsActive && (
                                            <div className="mt-2 p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 animate-in fade-in slide-in-from-top-1">
                                                <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-tight text-center">
                                                    Sottratti: €{currentEarnings.toLocaleString('it-IT', { minimumFractionDigits: 2 })} di Bonus e Rendite
                                                </p>
                                            </div>
                                        )}
                                        {!isEarningsActive && (
                                            <p className="text-[10px] text-center text-gray-400 mt-2 font-bold uppercase tracking-widest animate-pulse">
                                                Clicca per annullare il costo delle bollette!
                                            </p>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center p-4">
                    <p className="text-sm text-gray-400 italic">
                        {txt.disclaimer}
                    </p>
                </div>

                {/* Footer Actions */}
                <div className="p-2 md:p-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
                    <button onClick={onClose} className="w-full py-2 md:py-4 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg md:text-xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
                        {txt.understood}
                    </button>
                </div>
            </div>

            {isScannerModalOpen && (
                <AIScannerModal
                    isOpen={isScannerModalOpen}
                    onClose={() => setIsScannerModalOpen(false)}
                    onConfirm={applyExtractedData}
                    scanType={scanType}
                />
            )}

            <AnalisiUtenzeFocusMode
                isOpen={isFocusModeOpen}
                onClose={() => setIsFocusModeOpen(false)}
            />
        </div>
    );
};
