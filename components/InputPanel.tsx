import React, { useState } from 'react';
import { PlanInput, ViewMode, CompensationPlanResult } from '../types';
import {
  ShoppingBag,
  Briefcase,
  User,
  Users,
  FileText,
  PenSquare,
  Heart,
  Clock,
  RotateCcw,
  RotateCw,
  RefreshCcw,
  ChevronRight,
  Minus,
  Plus,
  X,
  Trash2,
  Home,
  Zap,
  Building2,
  Info,
  Network,
  Calculator,
  Sun,
  Target
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SharyTrigger from './SharyTrigger';
import { useDailyStats } from '../hooks/useDailyStats';
import { motion, AnimatePresence } from 'framer-motion';

// Importazione del visualizzatore
// FIX: Removing extra imports done manually in previous step if they exist or ensuring clean block
import { NetworkVisualizerModal } from './NetworkVisualizerModal';
import { AnalisiUtenzeModal } from './AnalisiUtenzeModal';
import { CashbackDetailedModal } from './CashbackDetailedModal';
import { UnionParkModal } from './UnionParkModal';
import { CashbackCategory } from '../types';

interface InputPanelProps {
  inputs: PlanInput;
  viewMode: ViewMode;
  onInputChange: (field: keyof PlanInput, value: number | boolean) => void;
  onReset: () => void;
  onResetPersonalClients: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  cashbackPeriod: 'monthly' | 'annual';
  setCashbackPeriod: React.Dispatch<React.SetStateAction<'monthly' | 'annual'>>;
  planResult: CompensationPlanResult;
  onOpenCashbackDetailed: () => void;
}

const uiTexts = {
  it: {
    savings: "Tu Risparmi",
    cashbackTitle: "Guadagno dal Cashback",
    monthlyReturn: "Tuo Ritorno Mensile",
    monthlySpend: "Spesa Mensile (€)",
    cashbackPercent: "Percentuale Cashback (%)",
    confirm: "Conferma",
    yourWork: "Il Tuo Lavoro",
    personalTitle: "Clienti, Utenze e Union Park",
    estimatedBonus: "Bonus Stimato",
    clientMode: "Modalità Cliente",
    clientModeDesc: "I guadagni diretti e le rendite sono al 50% rispetto alla modalità Family Utility.",
    myUnits: "Le Mie Utenze",
    private: "Privati",
    business: "Aziende",
    myUnitsGreen: "Mie Utenze Green",
    myUnitsLight: "Mie Utenze Light",
    baseRent: "Rendita Base",
    clientGreen: "Clienti Privati Green",
    clientLight: "Clienti Privati Light",
    busGreen: "Business Green",
    busLight: "Business Light",
    depthLabel: "Livelli in profondità",
    contractsLabel: "Contratti per ogni Utente",
    months: "Mesi",
    viewStructure: "Visualizza Struttura",
    exclusive: "Esclusiva",
    networkConfiguration: "Configurazione Rete",
    configureWork: "Configura il tuo lavoro",
    direct: "diretto",
    // NUOVE TRADUZIONI AGGIUNTE
    paramsTitle: "Parametri",
    paramsSubtitle: "Sviluppo Rete",
    optimizedFor: "Ottimizzato per tablet e PC/MAC",
    advancedCalculator: "Calcolatore Avanzato",
    configure: "Configura",
    parkToken: "Gettone",
    panelsLabel: "Pannelli",
    extraMonth: "Extra/Mese",
    extraYear: "Extra/Anno",
    perMonth: "€/mese",
    annualReturn: "Tuo Ritorno Annuale"
  },
  de: {
    savings: "Du sparst",
    cashbackTitle: "Cashback-Verdienst",
    monthlyReturn: "Deine monatliche Rückvergütung",
    monthlySpend: "Monatliche Ausgaben (€)",
    cashbackPercent: "Cashback-Prozentsatz (%)",
    confirm: "Bestätigen",
    yourWork: "Deine Arbeit",
    personalTitle: "Kunden, Utilities und Park",
    estimatedBonus: "Geschätzter Bonus",
    clientMode: "Kundenmodus",
    clientModeDesc: "Direkte Einnahmen und Renten werden gemäß dem Union-Vergütungsplan berechnet.",
    myUnits: "Meine Utilities",
    private: "Privat",
    business: "Geschäftlich",
    myUnitsGreen: "Meine Green Utilities",
    myUnitsLight: "Meine Light Utilities",
    baseRent: "Basisrente",
    clientGreen: "Private Kunden Green",
    clientLight: "Private Kunden Light",
    busGreen: "Business Green",
    busLight: "Business Light",
    depthLabel: "Tiefenebenen",
    contractsLabel: "Verträge pro Benutzer",
    months: "Monate",
    viewStructure: "Struktur anzeigen",
    exclusive: "Exklusiv",
    networkConfiguration: "Netzwerkkonfiguration",
    configureWork: "Konfiguriere deine Arbeit",
    direct: "direkt",
    // NUOVE TRADUZIONI AGGIUNTE
    paramsTitle: "Netzwerk",
    paramsSubtitle: "Parameter",
    optimizedFor: "Optimiert für Tablet und PC/MAC",
    advancedCalculator: "Erweiterter Rechner",
    configure: "Konfigurieren",
    parkToken: "Bonus",
    panelsLabel: "Paneele",
    extraMonth: "Extra/Monat",
    extraYear: "Extra/Jahr",
    perMonth: "€/Monat",
    annualReturn: "Deine jährliche Rückvergütung"
  },
  en: {
    savings: "You Save",
    cashbackTitle: "Cashback Earnings",
    monthlyReturn: "Your Monthly Return",
    monthlySpend: "Monthly Spending (€)",
    cashbackPercent: "Cashback Percentage (%)",
    confirm: "Confirm",
    yourWork: "Your Work",
    personalTitle: "Clients, Utilities and Union Park",
    estimatedBonus: "Estimated Bonus",
    clientMode: "Client Mode",
    clientModeDesc: "Direct earnings and annuities are 50% compared to Sharing Partner (FU) mode.",
    myUnits: "My Utilities",
    private: "Private",
    business: "Business",
    myUnitsGreen: "My Green Utilities",
    myUnitsLight: "My Light Utilities",
    baseRent: "Base Annuity",
    clientGreen: "Private Clients Green",
    clientLight: "Private Clients Light",
    busGreen: "Business Green",
    busLight: "Business Light",
    depthLabel: "Depth Levels",
    contractsLabel: "Contracts per User",
    months: "Months",
    viewStructure: "View Structure",
    exclusive: "Exclusive",
    networkConfiguration: "Network Configuration",
    configureWork: "Configure your work",
    direct: "direct",
    paramsTitle: "Network",
    paramsSubtitle: "Parameters",
    optimizedFor: "Optimized for tablet and PC/MAC",
    advancedCalculator: "Advanced Calculator",
    configure: "Configure",
    parkToken: "Token",
    panelsLabel: "Panels",
    extraMonth: "Extra/Month",
    extraYear: "Extra/Year",
    perMonth: "€/month",
    annualReturn: "Your Annual Return"
  }
};

import { CustomSlider } from './CustomSlider';

// ... MODALI ...
const CashbackModal = ({ isOpen, onClose, inputs, onInputChange, onReset, txt, period, setPeriod, t, OpenDetailed }: any) => {
  if (!isOpen) return null;
  const monthlySaving = (inputs.cashbackSpending * inputs.cashbackPercentage) / 100;
  const saving = period === 'annual' ? monthlySaving * 12 : monthlySaving;
  const returnLabel = period === 'annual' ? txt.annualReturn : txt.monthlyReturn;
  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/90 dark:bg-black/80 backdrop-blur-2xl rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden relative animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 max-h-[90vh] flex flex-col border-t sm:border border-white/80 dark:border-white/5">

        {/* HEADER MODALE PREMIUM */}
        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-purple-500/20 ring-4 ring-white dark:ring-white/10">
              <ShoppingBag size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{txt.cashbackTitle}</h3>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <p className="text-xs font-black text-purple-600/70 dark:text-purple-400 uppercase tracking-widest">{txt.savings}</p>
                </div>

                {/* TOGGLE MESE/ANNO PREMIUM */}
                {setPeriod && t && (
                  <div
                    onClick={(e) => { e.stopPropagation(); setPeriod(period === 'monthly' ? 'annual' : 'monthly'); }}
                    className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5 cursor-pointer border border-slate-200/50 dark:border-white/5"
                  >
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md transition-all ${period === 'monthly' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}>{t('input.month').toUpperCase()}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md transition-all ${period === 'annual' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}>{t('input.year').toUpperCase()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onReset} className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl border border-red-100/50 dark:border-red-900/50 hover:bg-red-500 hover:text-white transition-all active:scale-95" title="Azzera"><RotateCcw size={22} /></button>
            <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl border border-slate-200/50 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"><X size={22} strokeWidth={3} /></button>
          </div>
        </div>

        {/* DISPLAY GUADAGNI PREMIUM */}
        <div className="px-8 mb-8 shrink-0">
          <div className="relative p-10 rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-2xl shadow-purple-500/30 overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass-pass.png')] opacity-10"></div>
            <div className="absolute -right-8 -top-8 text-white opacity-5 rotate-12 group-hover:scale-125 transition-transform duration-1000">
              <ShoppingBag size={200} strokeWidth={1} />
            </div>

            <div className="relative z-10 text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-purple-100/60 mb-2">{txt.savings}</p>
              <div className="text-7xl font-black mb-1 tracking-tighter scale-110">€{saving.toFixed(2)}</div>
              <p className="text-[13px] font-bold text-white/80 uppercase tracking-widest">{returnLabel}</p>
            </div>
          </div>
        </div>

        {/* SLIDERS E AZIONI */}
        <div className="px-8 pb-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-6 pt-2">
            <div className="bg-white/50 dark:bg-white/5 border-2 border-white dark:border-white/10 rounded-[2.5rem] p-2 shadow-xl shadow-purple-100/30 dark:shadow-none">
              <CustomSlider label={txt.monthlySpend} value={inputs.cashbackSpending} onChange={(v: number) => onInputChange('cashbackSpending', v)} min={0} max={50000} step={50} colorBase="purple" icon={ShoppingBag} />
            </div>
            <div className="bg-white/50 dark:bg-white/5 border-2 border-white dark:border-white/10 rounded-[2.5rem] p-2 shadow-xl shadow-purple-100/30 dark:shadow-none">
              <CustomSlider label={txt.cashbackPercent} value={inputs.cashbackPercentage} onChange={(v: number) => onInputChange('cashbackPercentage', v)} min={0} max={20} step={0.5} colorBase="purple" icon={PenSquare} />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => OpenDetailed()}
                className="flex-1 py-5 bg-purple-100 text-purple-700 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-purple-200 transition-all border border-purple-200 active:scale-95"
              >
                {txt.advancedCalculator}
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-95"
              >
                {txt.confirm}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonalClientsModal = ({ isOpen, onClose, inputs, onInputChange, onReset, viewMode, txt, setUnionParkOpen }: any) => {
  if (!isOpen) return null;
  const [activeTab, setActiveTab] = useState<'my' | 'private' | 'business'>('my');
  const isClientMode = viewMode === 'client';
  const multiplier = 1;
  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white/90 dark:bg-black/80 backdrop-blur-2xl rounded-t-[3rem] sm:rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden relative animate-in slide-in-from-bottom sm:zoom-in-95 duration-500 max-h-[95vh] flex flex-col border-t sm:border border-white/80 dark:border-white/5">

        {/* HEADER MODALE PREMIUM */}
        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-emerald-500/20 ring-4 ring-white dark:ring-white/10">
              <Briefcase size={32} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{txt.personalTitle}</h3>
              <div className="mt-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <p className="text-xs font-black text-emerald-600/70 dark:text-emerald-400 uppercase tracking-widest">{txt.yourWork}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={onReset} className="w-12 h-12 flex items-center justify-center bg-red-50 dark:bg-red-900/20 text-red-500 rounded-2xl border border-red-100/50 dark:border-red-900/50 hover:bg-red-500 hover:text-white transition-all active:scale-95" title="Svuota"><Trash2 size={22} /></button>
            <button onClick={onClose} className="w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 rounded-2xl border border-slate-200/50 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white transition-all active:scale-95"><X size={22} strokeWidth={3} /></button>
          </div>
        </div>

        {isClientMode && (
          <div className="mx-8 mb-6 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-4">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600 shadow-sm"><Info size={20} strokeWidth={3} /></div>
            <p className="text-[13px] text-blue-700 font-bold leading-tight"><strong>{txt.clientMode}:</strong> {txt.clientModeDesc}</p>
          </div>
        )}

        {/* TAB SYSTEM PREMIUM */}
        <div className="px-8 mb-8 shrink-0">
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[1.5rem] border border-slate-200/50 dark:border-white/5 shadow-inner-white dark:shadow-none">
            {['my', 'private', 'business'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-500 ${activeTab === tab
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-md ring-1 ring-slate-200/50 dark:ring-white/10'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
              >
                {tab === 'my' ? txt.myUnits : tab === 'private' ? txt.private : txt.business}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENUTO SCROLLABILE */}
        <div className="px-8 pb-8 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            {activeTab === 'my' && (
              <div className="space-y-6">
                <div className="bg-white/50 dark:bg-white/5 border-2 border-white dark:border-white/10 rounded-[2.5rem] p-2 shadow-xl shadow-orange-100/30 dark:shadow-none">
                  <CustomSlider label={`${txt.myUnitsGreen} (+${50 * multiplier}€)`} value={inputs.myPersonalUnitsGreen} onChange={(v: number) => onInputChange('myPersonalUnitsGreen', v)} min={0} max={100} colorBase="orange" icon={Home} suffix="" />
                  <div className="px-4 pb-4">
                    <div className="bg-orange-600/10 dark:bg-orange-500/20 border border-orange-100 dark:border-orange-500/30 rounded-xl py-2 text-center">
                      <p className="text-[11px] text-orange-600 dark:text-orange-400 font-black uppercase tracking-widest">{txt.baseRent}: {(1.00 * multiplier).toFixed(2)}{txt.perMonth}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 border-2 border-white rounded-[2.5rem] p-2 shadow-xl shadow-yellow-100/30">
                  <CustomSlider label={`${txt.myUnitsLight} (+${25 * multiplier}€)`} value={inputs.myPersonalUnitsLight} onChange={(v: number) => onInputChange('myPersonalUnitsLight', v)} min={0} max={100} colorBase="yellow" icon={Zap} suffix="" />
                  <div className="px-4 pb-4">
                    <div className="bg-yellow-600/10 border border-yellow-100 rounded-xl py-2 text-center">
                      <p className="text-[11px] text-yellow-600 font-black uppercase tracking-widest">{txt.baseRent}: {(0.50 * multiplier).toFixed(2)}{txt.perMonth}</p>
                    </div>
                  </div>
                </div>

                {/* Union Park PREMIUM CARD */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group/park">
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass-pass.png')] opacity-10"></div>
                  <div className="absolute -right-8 -top-8 text-white opacity-5 rotate-12 group-hover/park:scale-125 transition-transform duration-1000">
                    <Sun size={180} strokeWidth={1} />
                  </div>

                  <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center text-white shadow-lg border border-white/30">
                        <Sun size={32} strokeWidth={2.5} className="animate-spin-slow" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white leading-none tracking-tighter">Union Park</h4>
                        <p className="text-[11px] font-black text-emerald-100/60 uppercase mt-1 tracking-widest">{txt.parkToken}: +€50 / {txt.panelsLabel.slice(0, -1).toUpperCase()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                      <div className="flex flex-col">
                        <p className="text-4xl font-black text-white leading-none tracking-tighter">{inputs.unionParkPanels || 0}</p>
                        <p className="text-[10px] font-black text-emerald-100/80 uppercase tracking-widest mt-1">{txt.panelsLabel}</p>
                      </div>
                      <button
                        onClick={() => setUnionParkOpen(true)}
                        className="bg-white text-emerald-700 px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-xl active:scale-95"
                      >
                        {txt.configure.toUpperCase()}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'private' && (
              <div className="space-y-4">
                <CustomSlider label={txt.clientGreen} value={inputs.personalClientsGreen} onChange={(v: number) => onInputChange('personalClientsGreen', v)} min={0} max={1000} colorBase="green" icon={User} />
                <CustomSlider label={txt.clientLight} value={inputs.personalClientsLight} onChange={(v: number) => onInputChange('personalClientsLight', v)} min={0} max={1000} colorBase="blue" icon={User} />
              </div>
            )}
            {activeTab === 'business' && (
              <div className="space-y-4">
                <CustomSlider label={txt.busGreen} value={inputs.personalClientsBusinessGreen} onChange={(v: number) => onInputChange('personalClientsBusinessGreen', v)} min={0} max={1000} colorBase="purple" icon={Building2} />
                <CustomSlider label={txt.busLight} value={inputs.personalClientsBusinessLight} onChange={(v: number) => onInputChange('personalClientsBusinessLight', v)} min={0} max={1000} colorBase="cyan" icon={Building2} />
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM ACTION */}
        <div className="p-8 pt-0 mt-auto shrink-0">
          <button
            onClick={onClose}
            className="w-full py-6 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-[1.5rem] font-black text-xl uppercase tracking-tighter hover:bg-black dark:hover:bg-slate-100 transition-all shadow-2xl active:scale-95"
          >
            {txt.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- INPUT PANEL PRINCIPALE ---
const InputPanel: React.FC<InputPanelProps> = ({
  inputs,
  viewMode,
  onInputChange,
  onReset,
  onResetPersonalClients,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  cashbackPeriod,
  setCashbackPeriod,
  planResult,
  onOpenCashbackDetailed // NEW PROP DESTRUCTURED
}) => {
  const { t, language } = useLanguage();
  const [modalOpen, setModalOpen] = useState<'none' | 'cashback' | 'cashback-detailed' | 'personal' | 'visualizer' | 'analisi' | 'unionpark'>('none');
  const lang = (language === 'it' || language === 'de') ? language : 'en';
  const txt = uiTexts[lang];

  // --- REAL DATA BRIDGE LOGIC ---
  const { stats, loading: statsLoading } = useDailyStats();
  const [useRealData, setUseRealData] = useState(false);
  const [plannedMonthlyActivity, setPlannedMonthlyActivity] = useState(20);
  const [bridgePeriod, setBridgePeriod] = useState<'30days' | 'commercial'>('30days');

  // Selezione delle statistiche in base al periodo scelto
  const activeStats = bridgePeriod === 'commercial' && stats.commercialMonthStats 
    ? stats.commercialMonthStats 
    : stats;

  const handleApplyNow = () => {
    if (activeStats.contactToContractRate > 0) {
      const units = Math.round(plannedMonthlyActivity * activeStats.contactToContractRate);
      onInputChange('myPersonalUnitsGreen', units);
      onInputChange('myPersonalUnitsLight', 0);
    }
    if (activeStats.newFamilyUtilityTotal > 0) {
      onInputChange('directRecruits', Math.round(activeStats.newFamilyUtilityTotal));
    }
    // Mostra un feedback visivo se necessario o semplicemente una notifica
  };

  // Sincronizzazione automatica se il ponte è attivo
  React.useEffect(() => {
    // Il ponte funziona solo se siamo in modalità Family Utility
    if (useRealData && viewMode === 'family') {
      // 1. Sincronizzazione Utenze Personali
      if (activeStats.contactToContractRate > 0) {
        const totalUnitsThreshold = Math.round(plannedMonthlyActivity * activeStats.contactToContractRate);
        onInputChange('myPersonalUnitsGreen', totalUnitsThreshold);
        onInputChange('myPersonalUnitsLight', 0);
      }

      // 2. Sincronizzazione Reclutamento (Secondo Ponte)
      if (activeStats.newFamilyUtilityTotal > 0) {
        onInputChange('directRecruits', Math.round(activeStats.newFamilyUtilityTotal));
      }
    }
  }, [useRealData, viewMode, plannedMonthlyActivity, activeStats.contactToContractRate, activeStats.newFamilyUtilityTotal]);

  // Reset ponte se cambiamo modalità (opzionale, ma consigliato per chiarezza)
  React.useEffect(() => {
    if (viewMode !== 'family' && useRealData) {
      setUseRealData(false);
    }
  }, [viewMode]);

  return (
    <>
      <style>{`
          .pallina-status {
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
          }
          .pallina-status.active-pro {
            background-color: #FF5E00 !important;
            box-shadow: 0 0 15px #FF5E00, 0 0 30px #FF8C00 !important;
            border: 2px solid #fff !important;
          }
          .pallina-status::after {
            content: "Rendi Family Utility";
            position: absolute;
            bottom: 140%;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: #fff;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
            z-index: 9999;
          }
          .pallina-status:hover::after,
          .pallina-status:active::after {
            opacity: 1;
          }
          @keyframes pulse-bonus {
            0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 94, 0, 0.4); }
            70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(255, 94, 0, 0); }
            100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 94, 0, 0); }
          }
          .animate-pulse-bonus {
            animation: pulse-bonus 2s infinite;
          }
        `}</style>

      <div className="flex flex-col gap-5 h-full lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
        {/* PULSANTE WOW - DESIGN STRUTTURA */}
        {viewMode !== 'client' && (
          <button
            onClick={() => setModalOpen('visualizer')}
            className="w-full py-6 md:py-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-2xl relative overflow-hidden group transition-all hover:scale-[1.01] active:scale-95 border border-white/10"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/glass-pass.png')] opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-blue-500/30 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

            <div className="relative z-10 flex items-center px-8">
              <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-xl border border-white/20 flex items-center justify-center text-cyan-400 shadow-lg group-hover:rotate-6 transition-transform shrink-0">
                <Network size={32} strokeWidth={2.5} />
              </div>

              <div className="flex-grow text-center -mt-2">
                <p className="text-[11px] font-black text-cyan-400 uppercase tracking-[0.2em] mb-0.5">{txt.exclusive}</p>
                <p className="text-2xl font-black text-white leading-none tracking-tighter">{txt.viewStructure}</p>
              </div>

              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 group-hover:bg-cyan-500 group-hover:text-white transition-all shrink-0">
                <ChevronRight size={20} strokeWidth={3} />
              </div>
            </div>
          </button>
        )}

        {/* PONTE DATI REALI - RIMOSSO DA QUI PER INTEGRAZIONE DISCRETA */}

        {/* CONTENITORE PRINCIPALE INPUT */}
        <div className="bg-white/70 dark:bg-black/30 backdrop-blur-3xl rounded-[3rem] shadow-2xl border border-white/80 dark:border-white/10 flex-grow flex flex-col p-4 sm:p-8 overflow-hidden relative z-10 transition-colors duration-300">

          {/* BLOCCO HEADER & PONTE (FISSO IN ALTO) */}
          <div className="shrink-0 mb-6 lg:mb-8">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4 lg:gap-5">
                <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-union-blue-500 to-union-blue-700 text-white rounded-2xl lg:rounded-3xl flex items-center justify-center shadow-xl shadow-union-blue-500/30 ring-4 ring-white">
                  <Heart size={28} className="lg:w-8 lg:h-8" fill="currentColor" strokeWidth={0} />
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter transition-colors">
                    {txt.paramsTitle}<br />
                    <span className="text-union-blue-600 dark:text-union-blue-400 font-extrabold text-xs lg:text-base tracking-tight opacity-90">{txt.paramsSubtitle}</span>
                  </h2>

                  {/* FAMILY PRO BADGE */}
                  {viewMode !== 'client' && (
                    (inputs.directRecruits >= 3 && inputs.contractsPerUser >= 1 && inputs.indirectRecruits >= 3) ||
                    ((inputs.personalClientsGreen + inputs.personalClientsLight + inputs.personalClientsBusinessGreen + inputs.personalClientsBusinessLight + inputs.myPersonalUnitsGreen + inputs.myPersonalUnitsLight) + (inputs.directRecruits * inputs.contractsPerUser)) >= 10
                  ) && (
                      <div className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-purple-900 to-indigo-900 px-3 py-1.5 rounded-full border border-purple-500/30 shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                        <Heart size={10} className="text-white fill-white" />
                        <span className="text-[10px] font-black text-purple-100 uppercase tracking-widest leading-none">FAMILY PRO</span>
                      </div>
                    )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <button
                  onClick={onReset}
                  className="w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center bg-[#FF3B30] text-white rounded-xl lg:rounded-2xl shadow-lg shadow-red-500/20 hover:scale-110 active:scale-95 transition-all"
                  title="Reset"
                >
                  <RotateCcw size={20} className="lg:w-6 lg:h-6" strokeWidth={3} />
                </button>

                {/* MINI TOGGLE PONTE DATI REALI */}
                {viewMode === 'family' && (
                  <button
                    onClick={() => setUseRealData(!useRealData)}
                    className={`flex items-center gap-2 lg:gap-3 p-1 pl-2.5 pr-1 lg:pl-4 lg:pr-2 lg:py-2 rounded-full border transition-all ${useRealData ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400'}`}
                  >
                    <Zap size={12} className={`lg:w-4 lg:h-4 ${useRealData ? 'animate-pulse' : ''}`} />
                    <span className="text-[9px] lg:text-[11px] font-black uppercase tracking-tighter mr-0.5 lg:mr-1">Ponte Dati Reali</span>
                    <div className={`w-7 h-3.5 lg:w-9 lg:h-4.5 rounded-full p-0.5 transition-all ${useRealData ? 'bg-white/30' : 'bg-slate-300 dark:bg-white/20'}`}>
                      <div className={`w-2.5 h-2.5 lg:w-3.5 lg:h-3.5 rounded-full bg-white shadow-sm transition-transform ${useRealData ? 'translate-x-3.5 lg:translate-x-4.5' : 'translate-x-0'}`} />
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* ESPANSIONE PONTE DATI REALI (DENTRO LO SHRINK-0) */}
            <AnimatePresence>
              {useRealData && viewMode === 'family' && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="relative z-20 overflow-hidden bg-blue-600/5 dark:bg-blue-500/10 rounded-[1.5rem] border border-blue-500/10 p-4 space-y-5"
                >
                  {/* SEZIONE VENDITA PERSONALE */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Zap size={14} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Periodo Rif:</span>
                      </div>
                      <div className="flex bg-blue-100 dark:bg-blue-900/40 rounded-lg p-0.5 border border-blue-200/50">
                        <button 
                          onClick={() => setBridgePeriod('30days')}
                          className={`text-[9px] font-black px-2 py-0.5 rounded-md transition-all ${bridgePeriod === '30days' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600/60'}`}
                        >
                          30 GG
                        </button>
                        <button 
                          onClick={() => setBridgePeriod('commercial')}
                          className={`text-[9px] font-black px-2 py-0.5 rounded-md transition-all ${bridgePeriod === 'commercial' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-600/60'}`}
                        >
                          MESE
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Target size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Efficienza Vendita:</span>
                      </div>
                      <span className="text-sm font-black text-blue-600">{(activeStats.contactToContractRate * 100).toFixed(1)}%</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-400 px-1">
                        <span className="uppercase tracking-tighter">CONTATTI / MESE</span>
                        <span className="text-blue-600 text-sm font-black">{plannedMonthlyActivity}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="200"
                        step="5"
                        value={plannedMonthlyActivity}
                        onChange={(e) => setPlannedMonthlyActivity(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </div>

                  {/* SEZIONE SVILUPPO RETE (SECONDO PONTE) */}
                  <div className="pt-3 border-t border-blue-500/10 space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <div className="flex items-center gap-2 text-purple-600">
                        <Users size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Bravura Reclutamento:</span>
                      </div>
                      <span className="text-sm font-black text-purple-600">
                        {activeStats.appointmentsTotal > 0 ? ((activeStats.newFamilyUtilityTotal / activeStats.appointmentsTotal) * 100).toFixed(1) : '0.0'}%
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-black text-slate-400 px-1">
                        <span className="uppercase tracking-tighter">TARGET RECLUTAMENTO / MESE</span>
                        <span className="text-purple-600 text-sm font-black">{inputs.directRecruits} Partner (FU)</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        step="1"
                        value={inputs.directRecruits}
                        onChange={(e) => onInputChange('directRecruits', parseInt(e.target.value))}
                        className="w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                      />
                    </div>
                  </div>

                  <div className="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-blue-500/10 text-center space-y-3">
                    <p className="text-[10px] lg:text-[11px] font-medium text-slate-500 dark:text-slate-400 leading-tight">
                      Con questo ritmo produrrai <span className="text-blue-600 dark:text-blue-400 font-black text-sm">{Math.round(plannedMonthlyActivity * activeStats.contactToContractRate)}</span> utenze e recluterai <span className="text-purple-600 dark:text-purple-400 font-black text-sm">{Math.round(activeStats.newFamilyUtilityTotal)}</span> partner (FU) ogni mese.
                    </p>
                    
                    <button 
                      onClick={handleApplyNow}
                      className="w-full py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCcw size={12} />
                      Applica Snapshot Ora
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-grow overflow-y-auto pr-3 custom-scrollbar min-h-0 space-y-4">




            {/* BUTTON ANALISI UTENZE (SOLO CLIENT MODE) */}
            {viewMode === 'client' && (
              <button onClick={() => setModalOpen('analisi')} className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white shadow-xl shadow-indigo-500/30 border border-white/20 hover:scale-[1.02] active:scale-95 transition-all group shrink-0 relative overflow-hidden mb-2">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex items-center gap-5 relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                    <Calculator size={26} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-0.5">{t('analysis_btn.premium')}</p>
                    <p className="text-xl font-black text-white leading-tight drop-shadow-sm">{t('analysis_btn.title')}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-bold text-white/90 bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">{t('analysis_btn.subtitle')}</span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-indigo-600 transition-colors shadow-lg relative z-10">
                  <ChevronRight size={20} strokeWidth={3} />
                </div>
              </button>
            )}

            {/* CARD AZIONI (CASHBACK & CLIENTI) */}
            <div className="grid grid-cols-1 gap-4 shrink-0">
              {/* BUTTON CASHBACK */}
              <button
                onClick={() => setModalOpen('cashback')}
                className="w-full flex items-center justify-between p-6 rounded-[2.5rem] bg-gradient-to-br from-purple-50/50 via-white to-purple-50/30 dark:from-indigo-900/40 dark:via-slate-800/60 dark:to-purple-900/40 border-2 border-white dark:border-white/10 shadow-xl hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 hover:-translate-y-1 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-purple-500 to-purple-700 text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ring-4 ring-white">
                    <ShoppingBag size={30} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="text-[11px] font-black uppercase tracking-[0.15em] text-purple-600/60 transition-colors dark:text-purple-400/60">{txt.savings}</p>

                      {/* TOGGLE MESE/ANNO PREMIUM */}
                      <div
                        onClick={(e) => { e.stopPropagation(); setCashbackPeriod(prev => prev === 'monthly' ? 'annual' : 'monthly'); }}
                        className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5 cursor-pointer border border-slate-200/50 dark:border-white/5"
                      >
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md transition-all ${cashbackPeriod === 'monthly' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}>{t('input.month').toUpperCase()}</span>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md transition-all ${cashbackPeriod === 'annual' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-500 dark:text-slate-400'}`}>{t('input.year').toUpperCase()}</span>
                      </div>
                    </div>

                    <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter transition-colors">{txt.cashbackTitle}</p>

                    <div className="mt-2 inline-flex items-center gap-2 bg-purple-600/10 dark:bg-purple-500/20 border border-purple-200/50 dark:border-purple-500/30 px-3 py-1 rounded-xl">
                      <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></span>
                      <p className="text-[13px] font-black text-purple-700 dark:text-purple-300">
                        +€{(((inputs.cashbackSpending * inputs.cashbackPercentage) / 100) * (cashbackPeriod === 'annual' ? 12 : 1)).toFixed(2)}
                        <span className="opacity-60 font-bold ml-1">{cashbackPeriod === 'annual' ? txt.extraYear : txt.extraMonth}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-300 dark:text-slate-500 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm border border-slate-100 dark:border-white/5 shrink-0">
                  <ChevronRight size={20} strokeWidth={3} />
                </div>
              </button>

              {/* BUTTON CLIENTI */}
              <button
                onClick={() => setModalOpen('personal')}
                className="w-full flex items-center justify-between p-6 rounded-[2.5rem] bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/30 dark:from-slate-900/40 dark:via-slate-800/60 dark:to-slate-900/40 border-2 border-white dark:border-white/10 shadow-xl hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30 hover:-translate-y-1 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center gap-6 relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-lg shadow-emerald-500/30 group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500 ring-4 ring-white dark:ring-white/10">
                    <Briefcase size={30} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-black uppercase tracking-[0.15em] text-emerald-600/60 transition-colors dark:text-emerald-400/60 mb-1">{txt.yourWork}</p>
                    <p className="text-2xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter transition-colors">{txt.personalTitle}</p>

                    <div className="mt-2 inline-flex items-center gap-2 bg-emerald-600/10 dark:bg-emerald-500/20 border border-emerald-200/50 dark:border-emerald-500/30 px-3 py-1 rounded-xl">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <p className="text-[13px] font-black text-emerald-700 dark:text-emerald-300">
                        {txt.configureWork} <span className="opacity-60 font-bold ml-1">{txt.direct}</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-300 dark:text-slate-500 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm border border-slate-100 dark:border-white/5 shrink-0">
                  <ChevronRight size={20} strokeWidth={3} />
                </div>
              </button>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent my-6 w-full mx-auto shrink-0"></div>

            {/* SLIDERS NETWORK PREMIUM */}
            <div className="space-y-4 pb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-[12px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] pl-2 transition-colors">{txt.networkConfiguration}</h3>
                <SharyTrigger
                  message="Qui definisci la tua struttura. Seleziona quanti collaboratori diretti porti, quanti ne porteranno loro (Indiretti) e fino a che livello di profondità vuoi calcolare. Ricorda: più è profonda la rete, più guadagni dalle royalty!"
                  messageDe="Hier definierst du deine Struktur. Wähle aus, wie viele direkte Mitarbeiter du mitbringst, wie viele sie mitbringen (indirekt) und bis zu welcher Tiefe du berechnen möchtest. Denke daran: Je tiefer das Netzwerk, desto mehr verdienst du an Lizenzgebühren!"
                  messageEn="Here you define your structure. Select how many direct collaborators you bring, how many they will bring (Indirect) and up to which depth level you want to calculate. Remember: the deeper the network, the more you earn from royalties!"
                  highlightId="slider_direct"
                />
              </div>

              <div className="relative group/slider">
                <CustomSlider label={t('input.direct_recruits')} value={inputs.directRecruits} onChange={(v: number) => onInputChange('directRecruits', v)} min={0} max={20} icon={User} colorBase="orange" id="slider_direct" />

                {inputs.directRecruits >= 3 && inputs.contractsPerUser >= 1 && inputs.indirectRecruits >= 3 && (
                  <button
                    onClick={() => onInputChange('bonus3x3Active', !inputs.bonus3x3Active)}
                    className={`absolute -top-3 right-4 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-tighter transition-all z-20 shadow-xl border-2 ${inputs.bonus3x3Active
                      ? 'bg-orange-600 text-white border-white scale-110'
                      : 'bg-white text-orange-600 border-orange-100 animate-pulse-bonus'
                      }`}
                  >
                    {inputs.bonus3x3Active ? '✅ 3x3 Attivo' : '🔥 In 60 Giorni?'}
                  </button>
                )}
              </div>
              <CustomSlider label={txt.contractsLabel} value={inputs.contractsPerUser} onChange={(v: number) => onInputChange('contractsPerUser', v)} min={0} max={2} icon={FileText} colorBase="cyan" id="slider_contracts" />
              <CustomSlider label={t('input.indirect_recruits')} value={inputs.indirectRecruits} onChange={(v: number) => onInputChange('indirectRecruits', v)} min={0} max={10} icon={PenSquare} colorBase="blue" id="slider_indirect" />
              <CustomSlider label={txt.depthLabel} value={inputs.networkDepth} onChange={(v: number) => onInputChange('networkDepth', v)} min={1} max={5} icon={Heart} colorBase="green" id="slider_depth" />

              {/* BOX TEMPO INTEGRATED */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 transition-colors">
                <div className="bg-gradient-to-br from-red-50/50 to-white/5 dark:from-slate-800/40 dark:to-slate-900/40 rounded-[2.5rem] p-2 border-2 border-white dark:border-white/10 shadow-xl relative overflow-hidden group hover:shadow-red-200/50 dark:hover:shadow-red-900/30 transition-all duration-500">
                  <div className="absolute -right-8 -top-8 text-red-500/05 opacity-[0.03] group-hover:rotate-45 group-hover:scale-125 transition-all duration-1000">
                    <Clock size={180} strokeWidth={1} />
                  </div>
                  <CustomSlider
                    label={t('input.time')}
                    value={inputs.realizationTimeMonths}
                    onChange={(v: number) => onInputChange('realizationTimeMonths', v)}
                    min={1}
                    max={120}
                    suffix={` ${txt.months}`}
                    icon={Clock}
                    colorBase="red"
                    showButtons={true}
                    id="slider_time"
                  />
                  <div className="absolute top-4 right-6">
                    <SharyTrigger
                      message="Il fattore tempo è cruciale. Sposta questo cursore per vedere come cresce la tua rendita nel corso dei mesi. Solitamente una rete solida si costruisce in 12-24 mesi."
                      messageDe="Der Zeitfaktor ist entscheidend. Verschiebe diesen Schieberegler, um zu sehen, wie dein Einkommen im Laufe der Monate wächst. Ein solides Netzwerk wird normalerweise in 12-24 Monaten aufgebaut."
                      messageEn="The time factor is crucial. Move this slider to see how your income grows over the months. Usually a solid network is built in 12-24 months."
                      highlightId="slider_time"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS RENDER */}
      <CashbackModal
        isOpen={modalOpen === 'cashback'}
        onClose={() => setModalOpen('none')}
        inputs={inputs}
        onInputChange={onInputChange}
        onReset={() => {
          onInputChange('cashbackSpending', 0);
          onInputChange('cashbackPercentage', 0);
        }}
        txt={txt}
        period={cashbackPeriod}
        setPeriod={setCashbackPeriod}
        t={t}
        OpenDetailed={onOpenCashbackDetailed}
      />

      <PersonalClientsModal
        isOpen={modalOpen === 'personal'}
        onClose={() => setModalOpen('none')}
        inputs={inputs}
        onInputChange={onInputChange}
        onReset={onResetPersonalClients}
        viewMode={viewMode}
        txt={txt}
        setUnionParkOpen={(v: boolean) => setModalOpen(v ? 'unionpark' : 'none')}
      />

      <UnionParkModal
        isOpen={modalOpen === 'unionpark'}
        onClose={() => setModalOpen('none')}
        initialPanels={inputs.unionParkPanels}
        initialPun={inputs.unionParkPun}
        initialDuration={inputs.unionParkDuration}
        onConfirm={(panels, pun, duration) => {
          onInputChange('unionParkPanels', panels);
          onInputChange('unionParkPun', pun);
          onInputChange('unionParkDuration', duration);
          setModalOpen('none');
        }}
      />

      {/* MODAL VISUALIZER */}
      <NetworkVisualizerModal
        isOpen={modalOpen === 'visualizer'}
        onClose={() => setModalOpen('none')}
        inputs={inputs}
        onInputChange={onInputChange}
        onReset={onReset}
      />

      {/* ANALISI UTENZE MODAL */}
      <AnalisiUtenzeModal
        isOpen={modalOpen === 'analisi'}
        onClose={() => setModalOpen('none')}
        inputs={inputs}
        period={cashbackPeriod}
        onInputChange={onInputChange}
        planResult={planResult}
      />
    </>
  );
};

export default InputPanel;