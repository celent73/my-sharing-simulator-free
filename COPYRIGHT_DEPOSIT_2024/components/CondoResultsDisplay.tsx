
import React from 'react';
import { CondoSimulationResult } from '../types';
import AssetEquivalentCard from './AssetEquivalentCard';
import { useLanguage } from '../contexts/LanguageContext';
import { Users, TrendingUp, Wallet, ShieldCheck, Info, Gem } from 'lucide-react';

interface CondoResultsDisplayProps {
    results: CondoSimulationResult;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

const RecruiterCard = ({ fullResults }: { fullResults: CondoSimulationResult }) => {
    const earnings = fullResults.familyUtilityEarnings!;

    // Estimate breakdown (simplified for UI)
    const networkTotal = (fullResults.networkStats?.totalAnnualYear1! || 0) +
        (fullResults.networkStats?.totalAnnualYear2! || 0) +
        (fullResults.networkStats?.totalAnnualYear3! || 0);
    const condoMetersTotal = earnings.total3Years - networkTotal;

    return (
        <div className="bg-gradient-to-br from-union-blue-600 via-union-blue-700 to-indigo-800 text-white rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden border border-white/20 mb-8 animate-in zoom-in duration-500">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Users size={120} />
            </div>
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                        <Wallet size={24} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black uppercase tracking-wider">Tuo Guadagno Potenziale</h3>
                        <p className="text-xs text-blue-100 font-medium opacity-80">Come Recruiter dell'Amministratore</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/10 backdrop-blur-sm p-5 rounded-3xl border border-white/10 flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest mb-1">Guadagno Totale (3 Anni)</p>
                            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-100 drop-shadow-sm">
                                {formatCurrency(earnings.total3Years)}
                            </p>
                        </div>
                        {fullResults.networkStats && fullResults.networkStats.usersCount > 0 && (
                            <div className="mt-3 pt-2 border-t border-white/10 text-[10px] opacity-60 flex flex-col gap-1.5">
                                <div className="flex justify-between">
                                    <span>Contatori Condo:</span>
                                    <span className="font-bold">{formatCurrency(condoMetersTotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rete Famiglie:</span>
                                    <span className="font-bold">{formatCurrency(networkTotal)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* YEAR 1 CARD RECRUITER */}
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Guadagno 1° Anno</p>
                        <p className="text-2xl font-black mb-2">{formatCurrency(earnings.year1.total)}</p>
                        <div className="mt-2 pt-2 border-t border-white/10 text-xs font-bold flex flex-col gap-2">
                            <div className="flex flex-col">
                                <span className="text-blue-200 uppercase text-[9px] font-black tracking-wider">Una Tantum (30€/Condo)</span>
                                <span className="text-white text-sm">{formatCurrency(earnings.year1.oneTime - (earnings.year1.networkPart?.oneTime || 0))}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-blue-200 uppercase text-[9px] font-black tracking-wider">Rendite (3€/Mese)</span>
                                <span className="text-white text-sm">{formatCurrency(earnings.year1.recurring - (earnings.year1.networkPart?.recurring || 0))}</span>
                            </div>
                            {(earnings.year1.networkPart?.oneTime! > 0 || earnings.year1.networkPart?.recurring! > 0) && (
                                <div className="mt-1 pt-1 border-t border-white/5 flex flex-col gap-1 text-purple-200">
                                    <span className="text-[8px] font-black uppercase tracking-widest">Guadagni Network</span>
                                    <div className="flex justify-between text-[10px]">
                                        <span>Rilasci/Extra:</span>
                                        <span className="font-black">{formatCurrency(earnings.year1.networkPart.oneTime + earnings.year1.networkPart.recurring)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* YEAR 2 CARD RECRUITER */}
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Guadagno 2° Anno</p>
                        <p className="text-2xl font-black mb-2">{formatCurrency(earnings.year2.total)}</p>
                        <div className="mt-2 pt-2 border-t border-white/10 text-xs font-bold flex flex-col gap-2">
                            {(earnings.year2.oneTime - (earnings.year2.networkPart?.oneTime || 0)) > 0 && (
                                <div className="flex flex-col">
                                    <span className="text-blue-200 uppercase text-[9px] font-black tracking-wider">Una Tantum (Nuovi)</span>
                                    <span className="text-white text-sm">{formatCurrency(earnings.year2.oneTime - (earnings.year2.networkPart?.oneTime || 0))}</span>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-blue-200 uppercase text-[9px] font-black tracking-wider">Rendite (Fino a 4€/M)</span>
                                <span className="text-white text-sm">{formatCurrency(earnings.year2.recurring - (earnings.year2.networkPart?.recurring || 0))}</span>
                            </div>
                            {earnings.year2.networkPart?.recurring! > 0 && (
                                <div className="mt-1 pt-1 border-t border-white/5 flex flex-col gap-1 text-purple-200">
                                    <span className="text-[8px] font-black uppercase tracking-widest">Guadagni Network</span>
                                    <div className="flex justify-between text-[10px]">
                                        <span>Rilasci/Extra:</span>
                                        <span className="font-black">{formatCurrency(earnings.year2.networkPart.oneTime + earnings.year2.networkPart.recurring)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* YEAR 3 CARD RECRUITER */}
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">Guadagno 3° Anno</p>
                        <p className="text-2xl font-black mb-2">{formatCurrency(earnings.year3.total)}</p>
                        <div className="mt-2 pt-2 border-t border-white/10 text-xs font-bold flex flex-col gap-2">
                            {(earnings.year3.oneTime - (earnings.year3.networkPart?.oneTime || 0)) > 0 && (
                                <div className="flex flex-col">
                                    <span className="text-blue-200 uppercase text-[9px] font-black tracking-wider">Una Tantum (Nuovi)</span>
                                    <span className="text-white text-sm">{formatCurrency(earnings.year3.oneTime - (earnings.year3.networkPart?.oneTime || 0))}</span>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-blue-200 uppercase text-[9px] font-black tracking-wider">Rendite (Fino a 6€/M)</span>
                                <span className="text-white text-sm">{formatCurrency(earnings.year3.recurring - (earnings.year3.networkPart?.recurring || 0))}</span>
                            </div>
                            {earnings.year3.networkPart?.recurring! > 0 && (
                                <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1 bg-black/20 p-2 rounded-xl">
                                    <span className="text-[8px] font-black uppercase tracking-widest text-yellow-300">Guadagni Network</span>
                                    <div className="flex justify-between text-[10px] text-yellow-100">
                                        <span>Rilasci/Extra:</span>
                                        <span className="font-black text-white">{formatCurrency(earnings.year3.networkPart.oneTime + earnings.year3.networkPart.recurring)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold bg-black/20 px-3 py-1.5 rounded-full text-blue-100 border border-white/10">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        Override Diretto (30€ OT / 3-4-6€ Rendita)
                    </div>
                    {fullResults.networkStats && fullResults.networkStats.usersCount > 0 && (
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold bg-black/20 px-3 py-1.5 rounded-full text-blue-100 border border-white/10">
                            <TrendingUp size={14} className="text-purple-400" />
                            Network Livello 1 (Rete Famiglie)
                        </div>
                    )}
                    {fullResults.familyUtilityEarnings?.total3Years !== undefined && fullResults.familyUtilityEarnings.total3Years > (fullResults.networkStats?.totalAnnualYear1 || 0) + (fullResults.networkStats?.totalAnnualYear2 || 0) + (fullResults.networkStats?.totalAnnualYear3 || 0) + (earnings.year1.oneTime - (fullResults.networkStats?.oneTimeBonus || 0)) && (
                        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold bg-purple-500/30 px-3 py-1.5 rounded-full text-purple-100 border border-purple-400/30 animate-pulse">
                            <Gem size={14} className="text-purple-300" />
                            + Rete Family Utility Inclusa
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, value, subValue, colorClass }: any) => (
    <div className={`p-5 rounded-[2rem] border backdrop-blur-md shadow-lg transition-all duration-300 hover:-translate-y-1 ${colorClass}`}>
        <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl sm:text-4xl font-black mb-1 text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-gray-300 drop-shadow-sm">{value}</p>
        {subValue && <div className="text-xs opacity-80 font-medium mt-2">{subValue}</div>}
    </div>
);

const CondoResultsDisplay: React.FC<CondoResultsDisplayProps> = ({ results }) => {
    const { t } = useLanguage();
    const isRecruiterView = !!results.familyUtilityEarnings;

    const displayTotal = isRecruiterView ? results.familyUtilityEarnings!.total3Years : results.total3Years;
    const displayY1 = isRecruiterView ? results.familyUtilityEarnings!.year1.total : results.year1.totalAnnual;
    const displayY2 = isRecruiterView ? results.familyUtilityEarnings!.year2.total : results.year2.totalAnnual;
    const displayY3 = isRecruiterView ? results.familyUtilityEarnings!.year3.total : results.year3.totalAnnual;

    return (
        <div className="space-y-8">

            {/* MAIN HEADER */}
            <div className={`rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden border transition-colors duration-500 ${isRecruiterView
                ? 'bg-gradient-to-br from-union-blue-600 via-union-blue-700 to-indigo-800 border-white/20 text-white'
                : 'bg-gradient-to-r from-slate-800 to-slate-900 text-white border-slate-600 dark:border-white/10'}`}>

                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                <div className="relative z-10 text-center">
                    <p className="font-bold text-xs uppercase tracking-[0.2em] mb-3 opacity-70">
                        {isRecruiterView ? "Tuo Guadagno Potenziale (Recruiter)" : t('condo_results.total_business_plan')}
                    </p>
                    <h2 className={`text-5xl sm:text-7xl font-black mb-6 drop-shadow-sm text-transparent bg-clip-text bg-gradient-to-r ${isRecruiterView
                        ? 'from-white via-blue-100 to-white'
                        : 'from-union-orange-400 via-yellow-200 to-union-orange-400'}`}>
                        {formatCurrency(displayTotal)}
                    </h2>
                    {isRecruiterView && results.familyUtilityEarnings?.total3Years !== undefined && results.familyUtilityEarnings.total3Years > 0 && (
                        <div className="flex justify-center mb-4">
                            <span className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-[10px] uppercase font-black border border-white/20 tracking-tighter">
                                Incluse provvigioni Sviluppo Rete principale
                            </span>
                        </div>
                    )}
                    <p className="text-sm font-medium leading-relaxed opacity-60 max-w-xl mx-auto">
                        {isRecruiterView
                            ? "I calcoli includono l'override diretto sui condomini (30€ OT + 3-4-6€ Rendita) e le commissioni di rete."
                            : t('condo_results.total_desc')}
                    </p>
                </div>
            </div>

            {/* YEARLY BREAKDOWN CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card
                    title={t('condo_results.y1_total')}
                    value={formatCurrency(displayY1)}
                    subValue={!isRecruiterView ? (
                        <div className="flex flex-col gap-1.5 mt-2 pt-2 border-t border-slate-400/20 dark:border-white/10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-70">{t('condo_results.ot_breakdown')}:</span>
                                <span className="font-bold">{formatCurrency(results.year1.oneTimeBonus)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-70">{t('condo_results.rec_annual_breakdown')}:</span>
                                <span className="font-bold">{formatCurrency(results.year1.recurringMonthly * 12)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-2 pt-2 border-t border-blue-400/20 text-xs font-bold flex flex-col gap-2">
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-blue-400 dark:text-blue-300 uppercase text-[10px] font-black tracking-wider">Una Tantum (30€/Condo)</span>
                                    <span className="text-slate-900 dark:text-white text-lg">{formatCurrency(results.familyUtilityEarnings!.year1.oneTime - (results.familyUtilityEarnings!.year1.networkPart?.oneTime || 0))}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-blue-400 dark:text-blue-300 uppercase text-[10px] font-black tracking-wider">Rendite (3€/Mese)</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-slate-900 dark:text-white text-lg">{formatCurrency((results.familyUtilityEarnings!.year1.recurring - (results.familyUtilityEarnings!.year1.networkPart?.recurring || 0)))}</span>
                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-bold opacity-80">({formatCurrency((results.familyUtilityEarnings!.year1.recurring - (results.familyUtilityEarnings!.year1.networkPart?.recurring || 0)) / 12)}/mese)</span>
                                    </div>
                                </div>
                            </div>
                            {((results.familyUtilityEarnings!.year1.networkPart?.oneTime || 0) + (results.familyUtilityEarnings!.year1.networkPart?.recurring || 0)) > 0 && (
                                <div className="mt-1 pt-1 border-t border-purple-100 dark:border-purple-500/30 flex flex-col gap-1 text-purple-600 dark:text-purple-400">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Guadagni Network</span>
                                    <div className="flex justify-between text-base">
                                        <span>Totale extra:</span>
                                        <span className="font-black">{formatCurrency((results.familyUtilityEarnings!.year1.networkPart?.oneTime || 0) + (results.familyUtilityEarnings!.year1.networkPart?.recurring || 0))}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    colorClass={isRecruiterView ? 'bg-white dark:bg-white/5 border-blue-100 dark:border-blue-900/40 shadow-blue-500/10' : 'bg-white dark:bg-black/40 border-gray-100 dark:border-white/10'}
                />
                <Card
                    title={t('condo_results.y2_total')}
                    value={formatCurrency(displayY2)}
                    subValue={!isRecruiterView ? (
                        `${t('condo_results.rec_end_year')}: ${formatCurrency(results.year2.recurringMonthly)}`
                    ) : (
                        <div className="mt-2 pt-2 border-t border-blue-400/20 text-xs font-bold flex flex-col gap-2">
                            {(results.familyUtilityEarnings!.year2.oneTime - (results.familyUtilityEarnings!.year2.networkPart?.oneTime || 0)) > 0 && (
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-blue-400 dark:text-blue-300 uppercase text-[10px] font-black tracking-wider">Una Tantum (Nuovi)</span>
                                        <span className="text-slate-900 dark:text-white text-lg">{formatCurrency(results.familyUtilityEarnings!.year2.oneTime - (results.familyUtilityEarnings!.year2.networkPart?.oneTime || 0))}</span>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-blue-400 dark:text-blue-300 uppercase text-[10px] font-black tracking-wider">Rendite (Fino a 4€/M)</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-slate-900 dark:text-white text-lg">{formatCurrency((results.familyUtilityEarnings!.year2.recurring - (results.familyUtilityEarnings!.year2.networkPart?.recurring || 0)))}</span>
                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-bold opacity-80">({formatCurrency((results.familyUtilityEarnings!.year2.recurring - (results.familyUtilityEarnings!.year2.networkPart?.recurring || 0)) / 12)}/mese)</span>
                                    </div>
                                </div>
                            </div>
                            {(results.familyUtilityEarnings!.year2.networkPart?.recurring || 0) > 0 && (
                                <div className="mt-1 pt-1 border-t border-purple-100 dark:border-purple-500/30 flex flex-col gap-1 text-purple-600 dark:text-purple-400">
                                    <span className="text-[10px] font-black uppercase tracking-widest">Guadagni Network</span>
                                    <div className="flex justify-between text-base">
                                        <span>Totale extra:</span>
                                        <span className="font-black">{formatCurrency((results.familyUtilityEarnings!.year2.networkPart?.oneTime || 0) + (results.familyUtilityEarnings!.year2.networkPart?.recurring || 0))}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    colorClass={isRecruiterView ? 'bg-white dark:bg-white/5 border-blue-100 dark:border-blue-900/40 shadow-blue-500/10' : 'bg-white dark:bg-black/40 border-gray-100 dark:border-white/10'}
                />
                <div className={`p-5 rounded-[2rem] border backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1 ${isRecruiterView
                    ? 'bg-gradient-to-br from-union-blue-600 to-union-blue-800 border-white/20 text-white'
                    : 'bg-gradient-to-br from-union-blue-600 to-union-blue-800 border-white/20 text-white shadow-union-blue-500/30'}`}>
                    <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest mb-1">{t('condo_results.y3_total')}</p>
                    <p className="text-3xl sm:text-5xl font-black mb-1">{formatCurrency(displayY3)}</p>
                    {isRecruiterView ? (
                        <div className="mt-2 pt-2 border-t border-white/20 text-xs font-bold flex flex-col gap-2">
                            {(results.familyUtilityEarnings!.year3.oneTime - (results.familyUtilityEarnings!.year3.networkPart?.oneTime || 0)) > 0 && (
                                <div className="flex justify-between items-end">
                                    <div className="flex flex-col">
                                        <span className="text-blue-100 uppercase text-[10px] font-black tracking-wider font-outline-sm">Una Tantum (Nuovi)</span>
                                        <span className="text-xl">{formatCurrency(results.familyUtilityEarnings!.year3.oneTime - (results.familyUtilityEarnings!.year3.networkPart?.oneTime || 0))}</span>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-blue-100 uppercase text-[10px] font-black tracking-wider">Rendite (Fino a 6€/M)</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-xl">{formatCurrency((results.familyUtilityEarnings!.year3.recurring - (results.familyUtilityEarnings!.year3.networkPart?.recurring || 0)))}</span>
                                        <span className="text-xs text-blue-100 font-bold opacity-80">({formatCurrency((results.familyUtilityEarnings!.year3.recurring - (results.familyUtilityEarnings!.year3.networkPart?.recurring || 0)) / 12)}/mese)</span>
                                    </div>
                                </div>
                            </div>
                            {(results.familyUtilityEarnings!.year3.networkPart?.recurring || 0) > 0 && (
                                <div className="mt-2 pt-2 border-t border-white/10 flex flex-col gap-1 bg-black/20 p-3 rounded-xl shadow-inner-sm">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-300">Guadagni Network</span>
                                    <div className="flex justify-between text-lg text-yellow-100">
                                        <span>Totale extra:</span>
                                        <span className="font-black text-white">{formatCurrency((results.familyUtilityEarnings!.year3.networkPart?.oneTime || 0) + (results.familyUtilityEarnings!.year3.networkPart?.recurring || 0))}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs opacity-80 font-medium mt-2">
                            {`${t('condo_results.rec_end_year')}: ${formatCurrency(results.year3.recurringMonthly)}`}
                        </p>
                    )}
                </div>
            </div>

            {/* DETAILED TABLE (ONLY FOR ADMIN VIEW) */}
            {!isRecruiterView && (
                <div className="bg-white dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/10 overflow-hidden p-1">
                    <div className="p-6 border-b border-gray-100 dark:border-white/5">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                            <span className="p-2 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/10 dark:to-white/5 text-gray-600 dark:text-gray-300 shadow-sm">📊</span>
                            {t('condo_results.detail_title')}
                        </h3>
                    </div>
                    <div className="overflow-x-auto bg-gray-50/50 dark:bg-black/20 rounded-3xl m-2 border border-gray-200 dark:border-white/5">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-white/5 text-[10px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold backdrop-blur-sm">
                                    <th className="p-4 border-b border-gray-200 dark:border-white/10">{t('condo_results.col_period')}</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/10">{t('condo_results.col_active_units')}</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">Guadagno Una Tantum</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right">{t('condo_results.rec_end_year')}</th>
                                    <th className="p-4 border-b border-gray-200 dark:border-white/10 text-right bg-gray-50/80 dark:bg-white/5">{t('condo_results.col_annual_total')}</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium text-gray-700 dark:text-gray-200 divide-y divide-gray-200 dark:divide-white/5">
                                <tr className="hover:bg-white dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-union-blue-600 dark:text-union-blue-400">{t('condo_results.row_y1')}</td>
                                    <td className="p-4">{results.year1.activeUnits}</td>
                                    <td className="p-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(results.year1.oneTimeBonus)}</td>
                                    <td className="p-4 text-right text-union-orange-500 dark:text-union-orange-400 font-bold">{formatCurrency(results.year1.recurringMonthly)}</td>
                                    <td className="p-4 text-right font-black text-gray-900 dark:text-white bg-gray-50/50 dark:bg-white/5">{formatCurrency(results.year1.totalAnnual)}</td>
                                </tr>
                                <tr className="hover:bg-white dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-union-blue-600 dark:text-union-blue-400">{t('condo_results.row_y2')}</td>
                                    <td className="p-4">{results.year2.activeUnits} <span className="text-xs text-green-500 ml-1 font-bold">(+{results.year2.activeUnits - results.year1.activeUnits})</span></td>
                                    <td className="p-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(results.year2.oneTimeBonus)}</td>
                                    <td className="p-4 text-right text-union-orange-500 dark:text-union-orange-400 font-bold">{formatCurrency(results.year2.recurringMonthly)}</td>
                                    <td className="p-4 text-right font-black text-gray-900 dark:text-white bg-gray-50/50 dark:bg-white/5">{formatCurrency(results.year2.totalAnnual)}</td>
                                </tr>
                                <tr className="hover:bg-white dark:hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-bold text-union-blue-600 dark:text-union-blue-400">{t('condo_results.row_y3')}</td>
                                    <td className="p-4">{results.year3.activeUnits} <span className="text-xs text-green-500 ml-1 font-bold">(+{results.year3.activeUnits - results.year2.activeUnits})</span></td>
                                    <td className="p-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">{formatCurrency(results.year3.oneTimeBonus)}</td>
                                    <td className="p-4 text-right text-union-orange-500 dark:text-union-orange-400 font-bold">{formatCurrency(results.year3.recurringMonthly)}</td>
                                    <td className="p-4 text-right font-black text-gray-900 dark:text-white bg-gray-50/50 dark:bg-white/5">{formatCurrency(results.year3.totalAnnual)}</td>
                                </tr>
                                {/* NETWORK ROW (Simplified) */}
                                {results.networkStats && results.networkStats.usersCount > 0 && (
                                    <tr className="bg-purple-50/50 dark:bg-purple-900/10 border-t-2 border-purple-100 dark:border-purple-500/30">
                                        <td className="p-4 font-bold text-purple-700 dark:text-purple-300 flex items-center gap-2">
                                            <span className="text-lg">🟣</span> Network (Lv. 0)
                                        </td>
                                        <td className="p-4 text-purple-600 dark:text-purple-300 font-bold">
                                            {results.networkStats.usersCount} Utenti
                                        </td>
                                        <td className="p-4 text-right text-purple-600 dark:text-purple-300 font-bold">
                                            +{formatCurrency(results.networkStats.oneTimeBonus)}
                                        </td>
                                        <td className="p-4 text-right text-purple-600 dark:text-purple-300 font-bold">
                                            +{formatCurrency(results.networkStats.recurringYear3)}
                                        </td>
                                        <td className="p-4 text-right font-black text-purple-900 dark:text-purple-100 bg-purple-100/50 dark:bg-purple-900/30">
                                            +{formatCurrency(results.networkStats.totalAnnualYear1 + results.networkStats.totalAnnualYear2 + results.networkStats.totalAnnualYear3)} <span className="text-[10px] font-normal opacity-70 block sm:inline">(3 Anni)</span>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {!isRecruiterView && <AssetEquivalentCard recurringAnnual={results.year3.recurringMonthly * 12} />}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 text-sm text-blue-800 dark:text-blue-200 flex gap-3">
                <Info size={18} className="text-blue-600 dark:text-blue-400 shrink-0" />
                <p>
                    <strong>{t('condo_results.calc_note')}:</strong> {t('condo_results.calc_note_text')}
                </p>
            </div>

        </div >
    );
};

export default CondoResultsDisplay;
