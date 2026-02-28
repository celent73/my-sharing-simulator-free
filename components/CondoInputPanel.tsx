
import React from 'react';
import { CondoInput, CondoSimulationResult } from '../types';
import InputGroup from './InputGroup';
import { useLanguage } from '../contexts/LanguageContext';
import { Users, Info, TrendingUp, Calculator, PiggyBank, CalendarRange } from 'lucide-react';
import SharyTrigger from './SharyTrigger';

interface CondoInputPanelProps {
    inputs: CondoInput;
    onInputChange: (field: keyof CondoInput, value: number) => void;
    onReset: () => void;
    results?: CondoSimulationResult;
}

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
    </svg>
);

const CondoInputPanel: React.FC<CondoInputPanelProps> = ({ inputs, onInputChange, onReset, results }) => {
    const { t } = useLanguage();

    const effectiveCondos = (inputs.greenUnits || 0) + (inputs.lightUnits || 0);

    // Helper for formatting
    const fmt = (n: number) => n.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });

    const netEarnings = results?.familyUtilityEarnings?.year1?.networkPart;
    // Calculate Monthly Recurring (Year 1 Recurring / 12)
    const monthlyRecurring = netEarnings ? (netEarnings.recurring / 12) : 0;
    // Calculate 3-Year Total (Year 1 Recurring * 3, since it's flat)
    const threeYearRecurring = netEarnings ? (netEarnings.recurring * 3) : 0;
    const totalEarnings = netEarnings ? (netEarnings.oneTime + threeYearRecurring) : 0;


    return (
        <div className="bg-slate-50/50 dark:bg-black/40 backdrop-blur-[40px] p-6 rounded-[2.5rem] shadow-[0_32px_80px_0_rgba(0,0,0,0.1)] dark:shadow-[0_45px_100px_0_rgba(0,0,0,0.8)] border border-white/40 dark:border-white/10 h-full transition-all duration-300 relative overflow-hidden flex flex-col">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/5 pointer-events-none dark:hidden" />

            {/* HEADER */}
            <div className="relative z-10 flex items-center justify-between mb-8 pb-2 shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-union-blue-500 to-union-blue-700 text-white rounded-2xl shadow-xl shadow-union-blue-500/20">
                        <BuildingIcon />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter">
                            {t('input.admin_params').split(' ').map((word: string, i: number) => (
                                <React.Fragment key={i}>{word}{i === 0 ? <br /> : ' '}</React.Fragment>
                            ))}
                        </h2>
                        <div className="mt-1">
                            <SharyTrigger
                                message="Osserviamo l'opportunità per gli amministratori, inannzi tutto seleziona il numero di contratti per condomini e osserva immediatamente quanto guadagnerai di Una Tantum e di RICORRENZE MENSILI per i prossimi 3 anni!! E se qualche condomino volesse diventare un utente? Seleziona la media di Famiglie per Condominio e la percentuali di chi passera le utente. Vedrai il totale dei guadagni sommarsi a quelli già calcolati"
                                messageDe="Schauen wir uns die Möglichkeiten für Verwalter an. Wähle zuerst die Anzahl der Verträge pro Wohnanlage und sieh sofort, wie viel Einmalzahlung und MONATLICHE RÜCKVERGÜTUNGEN du in den nächsten 3 Jahren verdienst!! Und wenn ein Bewohner Nutzer werden möchte? Wähle den Durchschnitt der Familien pro Wohnanlage und den Prozentsatz derer, die wechseln. Du wirst sehen, wie sich die Gesamteinnahmen zu den bereits berechneten addieren."
                                messageEn="Let's observe the opportunity for administrators, first of all select the number of contracts per condominium and observe immediately how much One-off and MONTHLY RECURRING you will earn for the next 3 years!! And if some condominium member wanted to become a user? Select the average of Families per Condominium and the percentage of those who will switch utilities. You will see the total earnings add up to those already calculated"
                                highlightId="condo_green_units"
                            />
                        </div>
                    </div>
                </div>
                <button
                    onClick={onReset}
                    className="p-3 bg-[#FF3B30] text-white rounded-xl shadow-lg shadow-red-500/20 hover:bg-[#D72C21] hover:scale-105 active:scale-90 transition-all border border-red-400/20"
                    title="Reset"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0 8.25 8.25 0 0 0 0-11.667l-3.182-3.182m0 0-3.182 3.183m3.182-3.182-4.992 4.992" />
                    </svg>
                </button>
            </div>

            <div className="relative z-10 flex-1 flex flex-col overflow-hidden">
                {/* RECRUITER TOGGLES */}
                <div className="mb-6 space-y-3 shrink-0">
                    {/* Main Recruiter Toggle */}
                    <button
                        onClick={() => onInputChange('showFamilyUtilityView' as any, !inputs.showFamilyUtilityView ? 1 : 0)}
                        className={`w-full p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between group relative overflow-hidden ${inputs.showFamilyUtilityView
                            ? 'bg-union-blue-600 border-union-blue-500 text-white shadow-xl shadow-union-blue-500/30 active:scale-[0.98]'
                            : 'bg-white/50 dark:bg-white/5 border-white dark:border-white/10 text-slate-600 dark:text-gray-400 hover:border-union-blue-300 dark:hover:border-union-blue-500/30 active:scale-[0.98]'
                            }`}
                    >
                        <div className="flex items-center gap-4 text-left relative z-10">
                            <div className={`p-3 rounded-2xl transition-all duration-500 ${inputs.showFamilyUtilityView ? 'bg-white/20 rotate-6 scale-110 shadow-inner' : 'bg-slate-100 dark:bg-white/10'}`}>
                                <Users size={24} className={inputs.showFamilyUtilityView ? 'text-white' : 'text-slate-400 dark:text-gray-400'} />
                            </div>
                            <div>
                                <div className="text-base font-black leading-[1.1] tracking-tight">{t('admin_mode.partner_view_label')}</div>
                                <div className={`text-[11px] opacity-70 font-bold uppercase tracking-wide mt-0.5 ${inputs.showFamilyUtilityView ? 'text-blue-50' : ''}`}>
                                    {inputs.showFamilyUtilityView ? t('admin_mode.partner_view_desc_on') : t('admin_mode.partner_view_desc_off')}
                                </div>
                            </div>
                        </div>
                        <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 flex items-center relative z-10 ${inputs.showFamilyUtilityView ? 'bg-white' : 'bg-slate-200 dark:bg-white/20'}`}>
                            <div className={`w-5 h-5 rounded-full shadow-lg transition-transform duration-300 ${inputs.showFamilyUtilityView ? 'translate-x-5 bg-union-blue-600' : 'translate-x-0 bg-slate-400 dark:bg-slate-500'}`} />
                        </div>
                    </button>

                    {/* includeMainNetworkEarnings Toggle */}
                    {inputs.showFamilyUtilityView && (
                        <button
                            onClick={() => onInputChange('includeMainNetworkEarnings' as any, !inputs.includeMainNetworkEarnings ? 1 : 0)}
                            className={`w-full p-5 rounded-[2rem] border-2 transition-all flex items-center justify-between group relative overflow-hidden animate-in slide-in-from-top-4 duration-500 ${inputs.includeMainNetworkEarnings
                                ? 'bg-purple-600 border-purple-500 text-white shadow-xl shadow-purple-500/30 active:scale-[0.98]'
                                : 'bg-white/50 dark:bg-white/5 border-white dark:border-white/10 text-slate-600 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-500/30 active:scale-[0.98]'
                                }`}
                        >
                            <div className="flex items-center gap-4 text-left relative z-10">
                                <div className={`p-3 rounded-2xl transition-all duration-500 ${inputs.includeMainNetworkEarnings ? 'bg-white/20 -rotate-6 scale-110 shadow-inner' : 'bg-slate-100 dark:bg-white/10'}`}>
                                    <TrendingUp size={24} className={inputs.includeMainNetworkEarnings ? 'text-white' : 'text-slate-400 dark:text-gray-400'} />
                                </div>
                                <div>
                                    <div className="text-base font-black leading-[1.1] tracking-tight">{t('input.include_main_net')}</div>
                                    <div className={`text-[11px] opacity-70 font-bold uppercase tracking-wide mt-0.5 ${inputs.includeMainNetworkEarnings ? 'text-purple-50' : ''}`}>
                                        {t('input.include_main_net_desc')}
                                    </div>
                                </div>
                            </div>
                            <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 flex items-center relative z-10 ${inputs.includeMainNetworkEarnings ? 'bg-white' : 'bg-slate-200 dark:bg-white/20'}`}>
                                <div className={`w-5 h-5 rounded-full shadow-lg transition-transform duration-300 ${inputs.includeMainNetworkEarnings ? 'translate-x-5 bg-purple-600' : 'translate-x-0 bg-slate-400 dark:bg-slate-500'}`} />
                            </div>
                        </button>
                    )}
                </div>

                <div className="space-y-6 overflow-y-auto custom-scrollbar pr-1 flex-1" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                    {/* GREEN SECTION */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white dark:border-white/10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                            <span className="text-4xl">🌿</span>
                        </div>
                        <h3 className="text-green-700 dark:text-green-400 font-black text-xs mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                            {t('input.green_section')}
                        </h3>
                        <div className="space-y-6">
                            <InputGroup
                                label={t('input.green_units_init')}
                                value={inputs.greenUnits}
                                onChange={(val) => onInputChange('greenUnits', val)}
                                max={10000}
                                step={10}
                                id="condo_green_units"
                            />
                            <InputGroup
                                label={t('input.green_units_new')}
                                value={inputs.yearlyNewUnitsGreen}
                                onChange={(val) => onInputChange('yearlyNewUnitsGreen', val)}
                                max={500}
                                step={5}
                            />
                        </div>
                    </div>

                    {/* LIGHT SECTION */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white dark:border-white/10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                            <span className="text-4xl">💡</span>
                        </div>
                        <h3 className="text-union-blue-600 dark:text-blue-400 font-black text-xs mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                            {t('input.light_section')}
                        </h3>
                        <div className="space-y-6">
                            <InputGroup
                                label={t('input.light_units_init')}
                                value={inputs.lightUnits}
                                onChange={(val) => onInputChange('lightUnits', val)}
                                max={10000}
                                step={10}
                                id="condo_light_units"
                            />
                            <InputGroup
                                label={t('input.light_units_new')}
                                value={inputs.yearlyNewUnitsLight}
                                onChange={(val) => onInputChange('yearlyNewUnitsLight', val)}
                                max={500}
                                step={5}
                            />
                        </div>
                    </div>

                    {/* NETWORK SECTION (Calculated) */}
                    <div className="bg-white/60 dark:bg-white/5 backdrop-blur-md p-6 rounded-[2.5rem] border border-white dark:border-white/10 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-10 transition-opacity">
                            <Users size={48} />
                        </div>
                        <h3 className="text-purple-700 dark:text-purple-400 font-black text-xs mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
                            {t('input.families_per_condo') || "Potenziale Networking Famiglie"}
                        </h3>

                        <div className="space-y-8">
                            <InputGroup
                                label={t('input.families_per_condo') || "Famiglie per Condominio (Media)"}
                                value={inputs.familiesPerCondo ?? 0}
                                onChange={(val) => onInputChange('familiesPerCondo', val)}
                                max={100}
                                step={5}
                                id="condo_families"
                            />

                            {/* MATH FEEDBACK 1 - CARD WOW */}
                            <div className="bg-slate-900/5 dark:bg-black/40 p-5 rounded-[2rem] border border-white dark:border-white/5 shadow-inner">
                                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest mb-3 text-center">
                                    {t('input.network_potential_families')}
                                </div>
                                <div className="font-mono text-slate-900 dark:text-gray-100 flex items-center justify-center gap-3">
                                    <span className="text-xl font-black">
                                        {effectiveCondos}
                                    </span>
                                    <span className="text-slate-300 dark:text-slate-700 text-lg">×</span>
                                    <span className="text-xl font-black">
                                        {inputs.familiesPerCondo || 0}
                                    </span>
                                    <span className="text-slate-300 dark:text-slate-700 text-lg">=</span>
                                    <div className="bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5">
                                        <strong className="text-3xl text-union-blue-600 dark:text-blue-400 font-black tracking-tighter">
                                            {effectiveCondos * (inputs.familiesPerCondo || 0)}
                                        </strong>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-black text-slate-900 dark:text-gray-300 uppercase tracking-tight">
                                        {t('input.network_conversion') || "% Adesione Network"}
                                    </label>
                                    <div className="text-2xl font-black text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/50 px-4 py-1 rounded-2xl border border-purple-100 dark:border-purple-500/20 shadow-sm">
                                        {inputs.networkConversionRate || 0}%
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => onInputChange('networkConversionRate', Math.max(0, (inputs.networkConversionRate || 0) - 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm active:scale-90 transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                                        </svg>
                                    </button>
                                    <div className="flex-1 px-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="1"
                                            value={inputs.networkConversionRate || 0}
                                            onChange={(e) => onInputChange('networkConversionRate', parseInt(e.target.value))}
                                            className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-purple-600"
                                        />
                                    </div>
                                    <button
                                        onClick={() => onInputChange('networkConversionRate', Math.min(100, (inputs.networkConversionRate || 0) + 1))}
                                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 shadow-sm active:scale-90 transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </button>
                                </div>

                                {/* MATH FEEDBACK 2 - CARD WOW (UPDATED with FINANCIALS) */}
                                <div className="mt-8 bg-gradient-to-br from-purple-600 via-indigo-600 to-union-blue-700 p-6 rounded-[2.5rem] shadow-2xl text-white transform transition-all hover:scale-[1.01] relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12 group-hover:rotate-45 transition-transform">
                                        <TrendingUp size={100} />
                                    </div>

                                    <div className="relative z-10">
                                        <div className="text-[10px] text-purple-100 uppercase tracking-[0.2em] font-black mb-1 opacity-70">
                                            {t('input.network_est_result')}
                                        </div>
                                        <div className="flex items-baseline gap-2 mb-6">
                                            <span className="text-4xl font-black text-white drop-shadow-lg">
                                                {Math.floor(((effectiveCondos) * (inputs.familiesPerCondo || 0)) * ((inputs.networkConversionRate || 0) / 100))}
                                            </span>
                                            <span className="text-xl font-bold text-white/80">
                                                {t('input.network_new_clients')}
                                            </span>
                                        </div>

                                        {inputs.showFamilyUtilityView && netEarnings && (
                                            <div className="space-y-3 border-t border-white/20 pt-5 mt-2 bg-black/10 -mx-6 px-6 pb-2">
                                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-80">
                                                    <span className="flex items-center gap-1.5"><PiggyBank size={14} /> {t('condo.one_time')}</span>
                                                    <span className="font-mono text-xs">{fmt(netEarnings.oneTime)}</span>
                                                </div>

                                                <div className="flex justify-between items-center py-2 bg-white/10 rounded-2xl px-4 border border-white/10">
                                                    <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5"><Calculator size={16} /> {t('condo.monthly_recurring')}</span>
                                                    <span className="text-xl font-black text-yellow-300 drop-shadow-md">{fmt(monthlyRecurring)}/mo</span>
                                                </div>

                                                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                                                    <span className="uppercase text-[11px] font-black tracking-[0.1em] text-white/90">{t('condo.total_est_3y')}</span>
                                                    <span className="text-3xl font-black text-white drop-shadow-2xl">{fmt(totalEarnings)}</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-4 text-[10px] text-white/50 font-black uppercase tracking-[0.15em] bg-black/20 inline-block px-3 py-1.5 rounded-full border border-white/5">
                                            {(effectiveCondos) * (inputs.familiesPerCondo || 0)} Fam. × {inputs.networkConversionRate || 0}% Adesione
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded-lg text-xs text-yellow-700 dark:text-yellow-400 flex gap-2 items-start leading-snug">
                        <span className="text-lg">⚠️</span>
                        <span>{t('input.network_assumption_note') || "Nota: Il calcolo considera l'attivazione di 2 contratti per cliente (1 Green + 1 Light)."}</span>
                    </div>

                    <div className="mt-6 text-xs text-slate-500 dark:text-gray-400 px-2 leading-relaxed shrink-0">
                        <p>{t('input.condo_note')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CondoInputPanel;
