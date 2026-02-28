
import React, { useRef, useState } from 'react';
import { CondoSimulationResult } from '../types';
import AssetEquivalentCard from './AssetEquivalentCard';
import { useLanguage } from '../contexts/LanguageContext';
import { Users, TrendingUp, Wallet, ShieldCheck, Info, Gem, Download, Loader2, Edit3, X, Save } from 'lucide-react';
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { CondoPDFTemplate } from './CondoPDFTemplate';

interface CondoResultsDisplayProps {
    results: CondoSimulationResult;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

const RecruiterCard = ({ fullResults }: { fullResults: CondoSimulationResult }) => {
    const { t } = useLanguage();
    const earnings = fullResults.familyUtilityEarnings!;

    // Estimate breakdown (simplified for UI)
    const networkTotal = (fullResults.networkStats?.totalAnnualYear1! || 0) +
        (fullResults.networkStats?.totalAnnualYear2! || 0) +
        (fullResults.networkStats?.totalAnnualYear3! || 0);
    const condoMetersTotal = earnings.total3Years - networkTotal;

    return (
        <div className="bg-gradient-to-br from-union-blue-600 via-union-blue-700 to-indigo-900 text-white rounded-[2.5rem] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.3)] relative overflow-hidden border border-white/20 mb-8 animate-in zoom-in duration-500 group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none scale-150 rotate-12">
                <Users size={120} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />

            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-xl">
                        <Wallet size={28} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">Tuo Guadagno Potenziale</h3>
                        <p className="text-xs text-blue-200/80 font-bold uppercase tracking-widest mt-1">Recruiter Amministratore</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/10 backdrop-blur-[40px] p-6 rounded-3xl border border-white/20 flex flex-col justify-between shadow-2xl transform transition-transform hover:scale-[1.02]">
                        <div>
                            <p className="text-[10px] font-black text-blue-200 uppercase tracking-[0.2em] mb-2 opacity-70">Guadagno Totale (3 Anni)</p>
                            <p className="text-4xl font-black text-white drop-shadow-2xl tracking-tighter">
                                {formatCurrency(earnings.total3Years)}
                            </p>
                        </div>
                        {fullResults.networkStats && fullResults.networkStats.usersCount > 0 && (
                            <div className="mt-4 pt-4 border-t border-white/10 text-[10px] opacity-60 flex flex-col gap-2 font-bold uppercase tracking-wider">
                                <div className="flex justify-between">
                                    <span>Contatori Condo:</span>
                                    <span className="text-white">{formatCurrency(condoMetersTotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Rete Famiglie:</span>
                                    <span className="text-white">{formatCurrency(networkTotal)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* YEAR 1 */}
                    <div className="bg-black/20 backdrop-blur-md p-5 rounded-3xl border border-white/10 hover:border-white/20 transition-all">
                        <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2 opacity-60">1° {t('common.year') || 'Anno'}</p>
                        <p className="text-3xl font-black mb-4 tracking-tighter">{formatCurrency(earnings.year1.total)}</p>
                        <div className="space-y-3">
                            <div className="flex flex-col bg-white/5 p-2 rounded-xl border border-white/5">
                                <span className="text-blue-300 uppercase text-[9px] font-black tracking-widest opacity-60">Una Tantum</span>
                                <span className="text-white text-base font-black">{formatCurrency(earnings.year1.oneTime - (earnings.year1.networkPart?.oneTime || 0))}</span>
                            </div>
                            <div className="flex flex-col bg-white/5 p-2 rounded-xl border border-white/5">
                                <span className="text-blue-300 uppercase text-[9px] font-black tracking-widest opacity-60">Rendite</span>
                                <span className="text-white text-base font-black">{formatCurrency(earnings.year1.recurring - (earnings.year1.networkPart?.recurring || 0))}</span>
                            </div>
                        </div>
                    </div>

                    {/* YEAR 2 */}
                    <div className="bg-black/20 backdrop-blur-md p-5 rounded-3xl border border-white/10 hover:border-white/20 transition-all">
                        <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2 opacity-60">2° {t('common.year') || 'Anno'}</p>
                        <p className="text-3xl font-black mb-4 tracking-tighter">{formatCurrency(earnings.year2.total)}</p>
                        <div className="space-y-3">
                            <div className="flex flex-col bg-white/5 p-2 rounded-xl border border-white/5">
                                <span className="text-blue-300 uppercase text-[9px] font-black tracking-widest opacity-60">Rendite</span>
                                <span className="text-white text-base font-black">{formatCurrency(earnings.year2.recurring - (earnings.year2.networkPart?.recurring || 0))}</span>
                            </div>
                            {(earnings.year2.oneTime - (earnings.year2.networkPart?.oneTime || 0)) > 0 && (
                                <div className="flex flex-col bg-white/5 p-2 rounded-xl border border-white/5">
                                    <span className="text-blue-300 uppercase text-[9px] font-black tracking-widest opacity-60">Nuovi</span>
                                    <span className="text-white text-base font-black">{formatCurrency(earnings.year2.oneTime - (earnings.year2.networkPart?.oneTime || 0))}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* YEAR 3 */}
                    <div className="bg-white/5 backdrop-blur-md p-5 rounded-3xl border border-white/10 hover:border-white/20 transition-all ring-2 ring-yellow-400/20">
                        <p className="text-[10px] font-black text-yellow-400 uppercase tracking-widest mb-2">3° {t('common.year') || 'Anno'} MAX</p>
                        <p className="text-3xl font-black mb-4 tracking-tighter text-yellow-300 drop-shadow-md">{formatCurrency(earnings.year3.total)}</p>
                        <div className="space-y-3">
                            <div className="flex flex-col bg-yellow-400/10 p-2 rounded-xl border border-yellow-400/20">
                                <span className="text-yellow-400 uppercase text-[9px] font-black tracking-widest">Rendite</span>
                                <span className="text-white text-base font-black">{formatCurrency(earnings.year3.recurring - (earnings.year3.networkPart?.recurring || 0))}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-[10px] font-black bg-black/40 px-4 py-2 rounded-full text-blue-100 border border-white/10 shadow-lg">
                        <ShieldCheck size={14} className="text-emerald-400" />
                        OVERRIDE DIRETTO ATTIVO
                    </div>
                    {fullResults.networkStats && fullResults.networkStats.usersCount > 0 && (
                        <div className="flex items-center gap-2 text-[10px] font-black bg-purple-600/30 px-4 py-2 rounded-full text-purple-100 border border-purple-400/30 shadow-lg animate-pulse">
                            <TrendingUp size={14} className="text-purple-300" />
                            NETWORK LIVELLO 1 INCLUSO
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface CardProps {
    title: string;
    value: string;
    subValue: React.ReactNode;
    variant?: 'glass' | 'gradient-blue' | 'gradient-orange';
    colorClass?: string;
}

const Card: React.FC<CardProps> = ({ title, value, subValue, variant = 'glass', colorClass }: CardProps) => {
    let styles = {
        container: 'bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-2 border-slate-200/50 dark:border-white/10 shadow-sm hover:shadow-md hover:border-slate-300/80 dark:hover:border-white/20',
        title: 'text-gray-500 dark:text-slate-500 opacity-60',
        value: 'text-gray-900 dark:text-white',
        border: 'border-slate-200 dark:border-white/10'
    };

    switch (variant) {
        case 'gradient-blue':
            styles = {
                container: 'bg-blue-50/80 dark:bg-blue-900/40 backdrop-blur-2xl border-2 border-blue-300/60 dark:border-blue-500/30 shadow-md hover:shadow-lg hover:border-blue-400/80 dark:hover:border-blue-400/50',
                title: 'text-blue-700/80 dark:text-blue-300/80',
                value: 'text-blue-800 dark:text-blue-100',
                border: 'border-blue-200/60 dark:border-blue-500/30'
            };
            break;
        case 'gradient-orange':
            styles = {
                container: 'bg-orange-50/80 dark:bg-orange-900/40 backdrop-blur-2xl border-2 border-orange-300/60 dark:border-orange-500/30 shadow-md hover:shadow-lg hover:border-orange-400/80 dark:hover:border-orange-400/50',
                title: 'text-orange-700/80 dark:text-orange-300/80',
                value: 'text-orange-800 dark:text-orange-100',
                border: 'border-orange-200/60 dark:border-orange-500/30'
            };
            break;
        case 'glass':
        default:
            break;
    }

    return (
        <div className={`p-6 rounded-[2.5rem] transition-all duration-300 ease-in-out flex flex-col items-start justify-between h-full hover:-translate-y-1 relative overflow-hidden ${styles.container} ${colorClass || ''}`}>
            <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${styles.title}`}>{title}</p>
            <p className={`text-4xl sm:text-5xl font-black mb-2 tracking-tighter leading-none ${styles.value}`}>{value}</p>
            {subValue && <div className="text-xs font-bold mt-4 w-full">{subValue}</div>}
        </div>
    );
};

const CondoResultsDisplay: React.FC<CondoResultsDisplayProps> = ({ results }) => {
    const { t } = useLanguage();
    const isRecruiterView = !!results.familyUtilityEarnings;

    const displayTotal = isRecruiterView ? results.familyUtilityEarnings!.total3Years : results.total3Years;
    const displayY1 = isRecruiterView ? results.familyUtilityEarnings!.year1.total : results.year1.totalAnnual;
    const displayY2 = isRecruiterView ? results.familyUtilityEarnings!.year2.total : results.year2.totalAnnual;
    const displayY3 = isRecruiterView ? results.familyUtilityEarnings!.year3.total : results.year3.totalAnnual;

    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
    const pdfTemplateRef = useRef<HTMLDivElement>(null);

    // Consultant Details State
    const [consultantName, setConsultantName] = useState('');
    const [consultantSurname, setConsultantSurname] = useState('');
    const [consultantPhone, setConsultantPhone] = useState('');
    // New Fields for PDF
    const [spreadLuce, setSpreadLuce] = useState('');
    const [spreadGas, setSpreadGas] = useState('');
    const [marketingFees, setMarketingFees] = useState('');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleExportPDF = async () => {
        if (!pdfTemplateRef.current) return;
        setIsGeneratingPdf(true);
        try {
            // Wait for render (increased for reliability)
            await new Promise(resolve => setTimeout(resolve, 500));

            const dataUrl = await toPng(pdfTemplateRef.current, {
                quality: 1.0,
                pixelRatio: 2, // High resolution
            });

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const imgProps = pdf.getImageProperties(dataUrl);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Business_Plan_Condominio_${new Date().toISOString().slice(0, 10)}.pdf`);
        } catch (err) {
            console.error('PDF Export failed:', err);
            alert('Errore durante la generazione del PDF. Riprova.');
        } finally {
            setIsGeneratingPdf(false);
        }
    };

    return (
        <div className="space-y-8 relative">
            {/* HIDDEN TEMPLATE FOR PDF GENERATION */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '1200px', height: 'auto', zIndex: -100, opacity: 0.01, pointerEvents: 'none' }}>
                <div ref={pdfTemplateRef}>
                    <CondoPDFTemplate
                        results={results}
                        consultantName={consultantName}
                        consultantSurname={consultantSurname}
                        consultantPhone={consultantPhone}
                        spreadLuce={spreadLuce}
                        spreadGas={spreadGas}
                        marketingFees={marketingFees}
                    />
                </div>
            </div>

            {/* MAIN HEADER */}
            <div className={`rounded-[3rem] p-10 shadow-[0_45px_100px_rgba(0,0,0,0.5)] relative overflow-hidden border transition-all duration-700 ${isRecruiterView
                ? 'bg-gradient-to-br from-union-blue-600 via-union-blue-800 to-indigo-950 border-white/20 text-white'
                : 'bg-black/85 backdrop-blur-[50px] text-white border-white/10'}`}>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.05),transparent)] pointer-events-none" />
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-union-blue-500/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none"></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
                        <div className="flex-1 text-left">
                            <span className="inline-block px-4 py-1 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] mb-4 text-slate-300">
                                {isRecruiterView ? "Executive Summary" : "Condo Business Plan"}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsEditModalOpen(true)}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 text-slate-300"
                            >
                                <Edit3 size={16} />
                                {t('common.personalize') || 'Personalizza'}
                            </button>
                            <button
                                onClick={handleExportPDF}
                                disabled={isGeneratingPdf}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-white/90 shadow-xl shadow-white/5 text-[11px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                            >
                                {isGeneratingPdf ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                                {isGeneratingPdf ? 'Esportazione...' : 'Crea Report PDF'}
                            </button>
                        </div>
                    </div>

                    <div className="text-center group cursor-default">
                        <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40 mb-2 group-hover:tracking-[0.5em] transition-all duration-500 text-slate-400">
                            {isRecruiterView ? "Guadagno Totale Stimato" : t('condo_results.total_business_plan')}
                        </p>
                        <h2 className={`text-7xl sm:text-9xl font-black mb-8 tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${isRecruiterView
                            ? 'text-white'
                            : 'text-transparent bg-clip-text bg-gradient-to-br from-yellow-200 via-amber-300 to-orange-400'}`}>
                            {formatCurrency(displayTotal)}
                        </h2>
                        {isRecruiterView && (
                            <div className="flex justify-center flex-wrap gap-2 mb-8">
                                <span className="bg-emerald-500/20 text-emerald-400 backdrop-blur-md px-5 py-1.5 rounded-full text-[10px] uppercase font-black border border-emerald-500/30 tracking-wider">
                                    Include Sviluppo Rete
                                </span>
                                <span className="bg-union-blue-500/20 text-blue-200 backdrop-blur-md px-5 py-1.5 rounded-full text-[10px] uppercase font-black border border-union-blue-500/30 tracking-wider">
                                    Proiezione 36 Mesi
                                </span>
                            </div>
                        )}
                        <p className="text-base font-bold leading-relaxed opacity-50 max-w-2xl mx-auto uppercase tracking-wide text-slate-400">
                            {isRecruiterView
                                ? "Include override diretto amministratori e rendite ricorrenti del network partner."
                                : t('condo_results.total_desc')}
                        </p>
                    </div>
                </div>
            </div>

            {/* YEARLY BREAKDOWN CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card
                    title={t('condo_results.y1_total')}
                    value={formatCurrency(displayY1)}
                    subValue={!isRecruiterView ? (
                        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-200/50 dark:border-white/10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-50 uppercase tracking-widest text-[10px] font-black">{t('condo_results.ot_breakdown')}</span>
                                <span className="font-black text-slate-900 dark:text-white">{formatCurrency(results.year1.oneTimeBonus)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-50 uppercase tracking-widest text-[10px] font-black">{t('condo_results.rec_annual_breakdown')}</span>
                                <span className="font-black text-slate-900 dark:text-white">{formatCurrency(results.year1.recurringMonthly * 12)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-50 uppercase tracking-widest text-[10px] font-black">Rendita Finale Mensile:</span>
                                <span className="font-black text-slate-900 dark:text-white">{formatCurrency(results.year1.recurringMonthly)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 pt-4 border-t border-blue-500/20 text-xs font-bold flex flex-col gap-3">
                            <div className="flex flex-col">
                                <span className="text-blue-500 dark:text-blue-300 uppercase text-[9px] font-black tracking-[0.2em] mb-1 opacity-60">Una Tantum (30€/C)</span>
                                <span className="text-slate-900 dark:text-white text-xl font-black">{formatCurrency(results.familyUtilityEarnings!.year1.oneTime - (results.familyUtilityEarnings!.year1.networkPart?.oneTime || 0))}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-blue-500 dark:text-blue-300 uppercase text-[9px] font-black tracking-[0.2em] mb-1 opacity-60">Rendite (3€/M)</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-slate-900 dark:text-white text-xl font-black">{formatCurrency((results.familyUtilityEarnings!.year1.recurring - (results.familyUtilityEarnings!.year1.networkPart?.recurring || 0)))}</span>
                                    <span className="text-[10px] text-blue-500 dark:text-blue-400 font-bold opacity-60">({formatCurrency((results.familyUtilityEarnings!.year1.recurring - (results.familyUtilityEarnings!.year1.networkPart?.recurring || 0)) / 12)}/mo)</span>
                                </div>
                            </div>
                            {((results.familyUtilityEarnings!.year1.networkPart?.oneTime || 0) + (results.familyUtilityEarnings!.year1.networkPart?.recurring || 0)) > 0 && (
                                <div className="mt-2 pt-3 border-t border-purple-500/20 flex flex-col gap-2 bg-purple-500/5 p-3 rounded-2xl">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-500">Network Level 1</span>
                                    <div className="flex justify-between text-[10px] text-slate-600 dark:text-purple-200">
                                        <span>Totale {t('common.year') || 'Anno'} 1:</span>
                                        <span className="font-black">{formatCurrency((results.familyUtilityEarnings!.year1.networkPart?.oneTime || 0) + (results.familyUtilityEarnings!.year1.networkPart?.recurring || 0))}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    colorClass="bg-white/80 dark:bg-white/5 border-2 border-slate-200/60 dark:border-white/10 shadow-lg hover:shadow-xl"
                />

                <Card
                    title={t('condo_results.y2_total')}
                    value={formatCurrency(displayY2)}
                    subValue={!isRecruiterView ? (
                        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-200/50 dark:border-white/10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-50 uppercase tracking-widest text-[10px] font-black">Rendita Annuale:</span>
                                <span className="font-black text-slate-900 dark:text-white">{formatCurrency(results.year2.recurringMonthly * 12)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-50 uppercase tracking-widest text-[10px] font-black">Rendita Finale Mensile:</span>
                                <span className="font-black text-slate-900 dark:text-white">{formatCurrency(results.year2.recurringMonthly)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 pt-4 border-t border-blue-500/20 text-xs font-bold flex flex-col gap-3">
                            {(results.familyUtilityEarnings!.year2.oneTime - (results.familyUtilityEarnings!.year2.networkPart?.oneTime || 0)) > 0 && (
                                <div className="flex flex-col">
                                    <span className="text-blue-500 dark:text-blue-300 uppercase text-[9px] font-black tracking-[0.2em] mb-1 opacity-60">Una Tantum (Nuovi)</span>
                                    <span className="text-slate-900 dark:text-white text-xl font-black">{formatCurrency(results.familyUtilityEarnings!.year2.oneTime - (results.familyUtilityEarnings!.year2.networkPart?.oneTime || 0))}</span>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-blue-500 dark:text-blue-300 uppercase text-[9px] font-black tracking-[0.2em] mb-1 opacity-60">Rendite (Fino a 4€/M)</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-slate-900 dark:text-white text-xl font-black">{formatCurrency((results.familyUtilityEarnings!.year2.recurring - (results.familyUtilityEarnings!.year2.networkPart?.recurring || 0)))}</span>
                                    <span className="text-[10px] text-blue-500 dark:text-blue-400 font-bold opacity-60">({formatCurrency((results.familyUtilityEarnings!.year2.recurring - (results.familyUtilityEarnings!.year2.networkPart?.recurring || 0)) / 12)}/mo)</span>
                                </div>
                            </div>
                            {((results.familyUtilityEarnings!.year2.networkPart?.oneTime || 0) + (results.familyUtilityEarnings!.year2.networkPart?.recurring || 0)) > 0 && (
                                <div className="mt-2 pt-3 border-t border-purple-500/20 flex flex-col gap-2 bg-purple-500/5 p-3 rounded-2xl">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-500">Network Level 1</span>
                                    <div className="flex justify-between text-[10px] text-slate-600 dark:text-purple-200">
                                        <span>Totale {t('common.year') || 'Anno'} 2:</span>
                                        <span className="font-black">{formatCurrency((results.familyUtilityEarnings!.year2.networkPart?.oneTime || 0) + (results.familyUtilityEarnings!.year2.networkPart?.recurring || 0))}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    colorClass="bg-white/80 dark:bg-white/5 border-2 border-slate-200/60 dark:border-white/10 shadow-lg hover:shadow-xl"
                />

                <Card
                    title={t('condo_results.y3_total')}
                    value={formatCurrency(displayY3)}
                    subValue={!isRecruiterView ? (
                        <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-blue-200/40">
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-60 uppercase tracking-widest text-[10px] font-black text-blue-800 dark:text-blue-200">Rendita Annuale:</span>
                                <span className="font-black text-blue-900 dark:text-blue-100">{formatCurrency(results.year3.recurringMonthly * 12)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="opacity-60 uppercase tracking-widest text-[10px] font-black text-blue-800 dark:text-blue-200">Rendita Finale Mensile:</span>
                                <span className="font-black text-blue-900 dark:text-blue-100">{formatCurrency(results.year3.recurringMonthly)}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 pt-4 border-t border-blue-400/20 text-xs font-bold flex flex-col gap-3">
                            {(results.familyUtilityEarnings!.year3.oneTime - (results.familyUtilityEarnings!.year3.networkPart?.oneTime || 0)) > 0 && (
                                <div className="flex flex-col">
                                    <span className="text-blue-700 dark:text-blue-300 uppercase text-[9px] font-black tracking-[0.2em] mb-1 opacity-60">Una Tantum (Nuovi)</span>
                                    <span className="text-blue-900 dark:text-white text-xl font-black">{formatCurrency(results.familyUtilityEarnings!.year3.oneTime - (results.familyUtilityEarnings!.year3.networkPart?.oneTime || 0))}</span>
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="text-blue-700 dark:text-blue-300 uppercase text-[9px] font-black tracking-[0.2em] mb-1 opacity-60">Rendite (Fino a 6€/M)</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-blue-900 dark:text-white text-xl font-black">{formatCurrency((results.familyUtilityEarnings!.year3.recurring - (results.familyUtilityEarnings!.year3.networkPart?.recurring || 0)))}</span>
                                    <span className="text-[10px] text-blue-600 dark:text-blue-300 font-bold opacity-60">({formatCurrency((results.familyUtilityEarnings!.year3.recurring - (results.familyUtilityEarnings!.year3.networkPart?.recurring || 0)) / 12)}/mo)</span>
                                </div>
                            </div>
                            {((results.familyUtilityEarnings!.year3.networkPart?.oneTime || 0) + (results.familyUtilityEarnings!.year3.networkPart?.recurring || 0)) > 0 && (
                                <div className="mt-2 pt-3 border-t border-white/10 flex flex-col gap-2 bg-slate-900/50 p-3 rounded-2xl">
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-300">Network Level 1</span>
                                    <div className="flex justify-between text-[10px] text-purple-100/70">
                                        <span>Totale {t('common.year') || 'Anno'} 3:</span>
                                        <span className="font-black text-white">{formatCurrency((results.familyUtilityEarnings!.year3.networkPart?.oneTime || 0) + (results.familyUtilityEarnings!.year3.networkPart?.recurring || 0))}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    variant="gradient-blue"
                />
            </div>

            {/* DETAILED TABLE */}
            {!isRecruiterView && (
                <div className="bg-white/40 dark:bg-black/40 backdrop-blur-[40px] rounded-[3rem] shadow-[0_32px_80px_rgba(0,0,0,0.1)] border border-white/40 dark:border-white/10 overflow-hidden p-2">
                    <div className="p-8 border-b border-white/20">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-4 tracking-tighter">
                            <div className="p-3 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-2xl shadow-xl">
                                <TrendingUp size={24} />
                            </div>
                            Proiezioni Dettagliate
                        </h3>
                    </div>
                    <div className="overflow-x-auto bg-white/20 dark:bg-black/20 rounded-[2.5rem] m-4 border border-white/20 shadow-inner">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-400 border-b border-white/10">
                                    <th className="p-6">Periodo</th>
                                    <th className="p-6">Unità Attive</th>
                                    <th className="p-6 text-right">Una Tantum</th>
                                    <th className="p-6 text-right">Rendita Finale</th>
                                    <th className="p-6 text-right bg-white/5 font-black text-slate-900 dark:text-white">Totale Annuo</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-bold text-slate-700 dark:text-gray-200 divide-y divide-white/5">
                                <tr className="hover:bg-white/30 dark:hover:bg-white/5 transition-all">
                                    <td className="p-6 text-union-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">{t('condo_results.row_y1')}</td>
                                    <td className="p-6">{results.year1.activeUnits}</td>
                                    <td className="p-6 text-right text-emerald-600 dark:text-emerald-400 font-black">{formatCurrency(results.year1.oneTimeBonus)}</td>
                                    <td className="p-6 text-right text-union-blue-600 dark:text-blue-400 font-black">{formatCurrency(results.year1.recurringMonthly)}/mo</td>
                                    <td className="p-6 text-right font-black text-slate-900 dark:text-white bg-white/5 text-lg">{formatCurrency(results.year1.totalAnnual)}</td>
                                </tr>
                                <tr className="hover:bg-white/30 dark:hover:bg-white/5 transition-all">
                                    <td className="p-6 text-union-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">{t('condo_results.row_y2')}</td>
                                    <td className="p-6 font-black">{results.year2.activeUnits} <span className="text-[10px] text-green-500 ml-1">(+{results.year2.activeUnits - results.year1.activeUnits})</span></td>
                                    <td className="p-6 text-right text-emerald-600 dark:text-emerald-400 font-black">{formatCurrency(results.year2.oneTimeBonus)}</td>
                                    <td className="p-6 text-right text-union-blue-600 dark:text-blue-400 font-black">{formatCurrency(results.year2.recurringMonthly)}/mo</td>
                                    <td className="p-6 text-right font-black text-slate-900 dark:text-white bg-white/5 text-lg">{formatCurrency(results.year2.totalAnnual)}</td>
                                </tr>
                                <tr className="hover:bg-white/30 dark:hover:bg-white/5 transition-all">
                                    <td className="p-6 text-union-blue-600 dark:text-blue-400 font-black uppercase tracking-widest">{t('condo_results.row_y3')}</td>
                                    <td className="p-6 font-black">{results.year3.activeUnits} <span className="text-[10px] text-green-500 ml-1">(+{results.year3.activeUnits - results.year2.activeUnits})</span></td>
                                    <td className="p-6 text-right text-emerald-600 dark:text-emerald-400 font-black">{formatCurrency(results.year3.oneTimeBonus)}</td>
                                    <td className="p-6 text-right text-union-blue-600 dark:text-blue-400 font-black">{formatCurrency(results.year3.recurringMonthly)}/mo</td>
                                    <td className="p-6 text-right font-black text-slate-900 dark:text-white bg-white/5 text-lg">{formatCurrency(results.year3.totalAnnual)}</td>
                                </tr>
                                {results.networkStats && results.networkStats.usersCount > 0 && (
                                    <tr className="bg-purple-600/10 dark:bg-purple-900/20 border-t-2 border-purple-500/20">
                                        <td className="p-6 font-black text-purple-600 dark:text-purple-300 flex items-center gap-3">
                                            <Users size={18} /> NETWORK (FU)
                                        </td>
                                        <td className="p-6 text-purple-600 dark:text-purple-300 font-black">
                                            {results.networkStats.usersCount} Famiglie
                                        </td>
                                        <td className="p-6 text-right text-purple-600 dark:text-purple-300 font-black">
                                            +{formatCurrency(results.networkStats.oneTimeBonus)}
                                        </td>
                                        <td className="p-6 text-right text-purple-600 dark:text-purple-300 font-black">
                                            +{formatCurrency(results.networkStats.recurringYear3)}/mo
                                        </td>
                                        <td className="p-6 text-right font-black text-purple-900 dark:text-purple-100 bg-purple-600/10 text-xl">
                                            +{formatCurrency(results.networkStats.totalAnnualYear1 + results.networkStats.totalAnnualYear2 + results.networkStats.totalAnnualYear3)}
                                            <span className="text-[9px] font-black uppercase tracking-widest opacity-60 block">Totale 3 {t('common.years') || 'Anni'}</span>
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

            {/* EDIT DETAILS MODAL */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white/90 dark:bg-slate-900/90 w-full max-w-md rounded-[3rem] p-8 shadow-[0_45px_100px_rgba(0,0,0,0.5)] border border-white/40 dark:border-white/10 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-union-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{t('common.personalize') || 'Personalizza'} Report</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Dati per esportazione PDF</p>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="p-3 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-2xl text-slate-500 dark:text-gray-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-5 relative z-10">
                            {[
                                { label: 'Nome', value: consultantName, setter: setConsultantName, placeholder: 'Es. Mario', type: 'text' },
                                { label: 'Cognome', value: consultantSurname, setter: setConsultantSurname, placeholder: 'Es. Rossi', type: 'text' },
                                { label: 'Telefono', value: consultantPhone, setter: setConsultantPhone, placeholder: 'Es. 333 1234567', type: 'tel' },
                                { label: 'Spread Luce', value: spreadLuce, setter: setSpreadLuce, placeholder: 'Es. 0.02 €/kWh', type: 'text' },
                                { label: 'Spread Gas', value: spreadGas, setter: setSpreadGas, placeholder: 'Es. 0.10 €/Smc', type: 'text' },
                                { label: 'Oneri Comm.', value: marketingFees, setter: setMarketingFees, placeholder: 'Es. 120€/anno', type: 'text' }
                            ].map((field) => (
                                <div key={field.label}>
                                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-gray-500 mb-2 ml-1">{field.label}</label>
                                    <input
                                        type={field.type}
                                        value={field.value}
                                        onChange={(e) => field.setter(e.target.value)}
                                        placeholder={field.placeholder}
                                        className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-black/40 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-union-blue-500/50 text-slate-900 dark:text-white font-bold transition-all placeholder:opacity-30"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex gap-4 relative z-10">
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3"
                            >
                                <Save size={18} />
                                Salva Configurazione
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
};

export default CondoResultsDisplay;
