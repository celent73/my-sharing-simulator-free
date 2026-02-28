
import React from 'react';
import { CondoSimulationResult } from '../types';
import { TrendingUp, Users, Wallet, CheckCircle2, Building2 } from 'lucide-react';

interface CondoPDFTemplateProps {
    results: CondoSimulationResult;
    consultantName?: string;
    consultantSurname?: string;
    consultantPhone?: string;
    spreadLuce?: string;
    spreadGas?: string;
    marketingFees?: string;
}

const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

export const CondoPDFTemplate: React.FC<CondoPDFTemplateProps> = (props) => {
    const { results, consultantName, consultantSurname, consultantPhone } = props;
    const isRecruiterView = !!results.familyUtilityEarnings;
    const displayTotal = isRecruiterView ? results.familyUtilityEarnings!.total3Years : results.total3Years;

    // A4 Size in PX (96 DPI) approx 794x1123
    // We'll use a larger fixed width for better quality downscaling, e.g., 1200px width.
    // The styled wrapper will ensure it looks right.

    return (
        <div
            id="condo-pdf-template"
            style={{
                width: '1200px',
                minHeight: '1697px', // Ratio for A4
                background: '#ffffff',
                color: '#0f172a', // Slate 900
                fontFamily: 'Inter, sans-serif',
                position: 'relative',
                overflow: 'hidden'
            }}
            className="flex flex-col"
        >
            {/* Background Decor - lighter and subtle on white */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[120px] pointer-events-none" />

            {/* HEADER */}
            <div className="p-16 flex justify-between items-start border-b border-gray-200 bg-white">
                <div className="flex flex-col gap-6">
                    {/* CONSULTANT DETAILS (TOP LEFT) */}
                    {(consultantName || consultantSurname || consultantPhone) && (
                        <div className="mb-2">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Prospetto preparato da</p>
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                                {consultantName} {consultantSurname}
                            </h3>
                            {consultantPhone && (
                                <p className="text-sm font-medium text-slate-500 mt-0.5">{consultantPhone}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <h1 className="text-5xl font-black tracking-tight text-slate-900 mb-2">BUSINESS PLAN</h1>
                        <p className="text-xl text-blue-600 font-medium tracking-widest uppercase">Efficienza Energetica Condominiale</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-bold opacity-60 text-slate-500">GENERATO IL</p>
                        <p className="text-lg font-bold text-slate-900">{new Date().toLocaleDateString('it-IT')}</p>
                    </div>
                    {/* Simple Logo Placeholder if image fails */}
                    <div className="w-20 h-20 bg-gradient-to-br from-union-blue-600 to-union-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
                        <Building2 size={40} className="text-white" />
                    </div>
                </div>
            </div>

            {/* OFFER PARAMETERS SECTION (New) */}
            {(props.spreadLuce || props.spreadGas || props.marketingFees) && (
                <div className="px-16 py-6 bg-slate-50 border-b border-gray-200 flex gap-12">
                    {props.spreadLuce && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Spread Luce</p>
                            <p className="text-lg font-black text-slate-800">{props.spreadLuce}</p>
                        </div>
                    )}
                    {props.spreadGas && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Spread Gas</p>
                            <p className="text-lg font-black text-slate-800">{props.spreadGas}</p>
                        </div>
                    )}
                    {props.marketingFees && (
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-1">Oneri Comm.</p>
                            <p className="text-lg font-black text-slate-800">{props.marketingFees}</p>
                        </div>
                    )}
                </div>
            )}

            {/* BODY */}
            <div className="p-16 flex flex-col gap-12 relative z-10 w-full">

                {/* HERO SECTION */}
                <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-200 shadow-lg text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold uppercase tracking-[0.3em] text-blue-700 mb-4">Valore Totale Business Plan (3 Anni)</h2>
                        <div className="text-[7rem] leading-none font-black text-slate-900 mb-6 antialiased">
                            {formatCurrency(displayTotal)}
                        </div>
                        <p className="text-2xl text-slate-600 max-w-4xl mx-auto opacity-90 leading-relaxed font-medium">
                            Il piano include i guadagni derivanti dalla gestione delle utenze condominiali, le installazioni di efficientamento e le rendite ricorrenti.
                        </p>
                    </div>
                </div>

                {/* YEARLY CARDS */}
                <div className="grid grid-cols-3 gap-8">
                    {[1, 2, 3].map((year) => {
                        const yKey = `year${year}` as keyof typeof results;
                        const yearData = results[yKey] as any; // Type assertion for simplicity here
                        const recruiterYearData = isRecruiterView ? results.familyUtilityEarnings![yKey] : null;

                        const total = isRecruiterView ? recruiterYearData!.total : yearData.totalAnnual;
                        const recurring = isRecruiterView
                            ? (recruiterYearData!.recurring - (recruiterYearData!.networkPart?.recurring || 0))
                            : yearData.recurringMonthly;
                        const oneTime = isRecruiterView
                            ? (recruiterYearData!.oneTime - (recruiterYearData!.networkPart?.oneTime || 0))
                            : yearData.oneTimeBonus;

                        return (
                            <div key={year} className="bg-white border border-gray-200 rounded-[2rem] p-8 flex flex-col shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center font-black text-xl border border-blue-100 text-blue-600">
                                        {year}°
                                    </div>
                                    <span className="text-lg font-bold text-gray-400 uppercase tracking-wider">ANNO</span>
                                </div>

                                <div className="mb-8">
                                    <p className="text-5xl font-black text-slate-900 mb-2">{formatCurrency(total)}</p>
                                    <p className="text-sm font-medium text-blue-600 uppercase tracking-widest">Totale Annuo</p>
                                </div>

                                <div className="mt-auto space-y-4 pt-6 border-t border-gray-100">
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-gray-500 font-medium">Una Tantum</span>
                                        <span className="font-bold text-emerald-600">{formatCurrency(oneTime)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-gray-500 font-medium">Rendita Finale</span>
                                        <span className="font-bold text-orange-500">{formatCurrency(recurring)}/m</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* DETAILED TABLE */}
                {!isRecruiterView && (
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-200 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <TrendingUp className="text-blue-600" size={32} />
                            <h3 className="text-3xl font-bold text-slate-900">Dettaglio Annuale</h3>
                        </div>

                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-slate-500 border-b border-gray-200 text-lg uppercase tracking-wider">
                                    <th className="py-4 font-bold">Periodo</th>
                                    <th className="py-4 font-bold">Utenze Attive</th>
                                    <th className="py-4 font-bold text-right">Una Tantum</th>
                                    <th className="py-4 font-bold text-right">Rendita Mensile</th>
                                    <th className="py-4 font-bold text-right">Totale</th>
                                </tr>
                            </thead>
                            <tbody className="text-xl font-medium divide-y divide-gray-100 text-slate-600">
                                <tr>
                                    <td className="py-6 font-bold text-slate-900">Primo Anno</td>
                                    <td className="py-6">{results.year1.activeUnits}</td>
                                    <td className="py-6 text-right text-emerald-600">{formatCurrency(results.year1.oneTimeBonus)}</td>
                                    <td className="py-6 text-right text-orange-500">{formatCurrency(results.year1.recurringMonthly)}</td>
                                    <td className="py-6 text-right font-black text-slate-900">{formatCurrency(results.year1.totalAnnual)}</td>
                                </tr>
                                <tr>
                                    <td className="py-6 font-bold text-slate-900">Secondo Anno</td>
                                    <td className="py-6">{results.year2.activeUnits}</td>
                                    <td className="py-6 text-right text-emerald-600">{formatCurrency(results.year2.oneTimeBonus)}</td>
                                    <td className="py-6 text-right text-orange-500">{formatCurrency(results.year2.recurringMonthly)}</td>
                                    <td className="py-6 text-right font-black text-slate-900">{formatCurrency(results.year2.totalAnnual)}</td>
                                </tr>
                                <tr>
                                    <td className="py-6 font-bold text-slate-900">Terzo Anno</td>
                                    <td className="py-6">{results.year3.activeUnits}</td>
                                    <td className="py-6 text-right text-emerald-600">{formatCurrency(results.year3.oneTimeBonus)}</td>
                                    <td className="py-6 text-right text-orange-500">{formatCurrency(results.year3.recurringMonthly)}</td>
                                    <td className="py-6 text-right font-black text-slate-900">{formatCurrency(results.year3.totalAnnual)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {isRecruiterView && (
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-200 flex items-center justify-between shadow-sm">
                        <div>
                            <h3 className="text-2xl font-bold mb-2 text-slate-900">Nota per il Recruiter</h3>
                            <p className="text-lg text-slate-500 max-w-2xl">
                                Questo prospetto include i guadagni derivanti dall'attività diretta di segnalazione condomini e dalle commissioni di rete maturate sulla struttura gestita dall'Amministratore.
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-blue-50 px-6 py-3 rounded-xl border border-blue-100 flex items-center gap-3">
                                <CheckCircle2 className="text-blue-600" />
                                <span className="font-bold text-blue-900">Override Inclusa</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* FOOTER */}
            <div className="p-12 text-center border-t border-gray-200 bg-gray-50">
                <p className="text-gray-500 text-lg">Simulazione generata con Shary Simulator - Documento ad uso interno</p>
                <p className="text-gray-400 text-sm mt-2">I valori sono stime basate sui dati inseriti e potrebbero variare.</p>
            </div>
        </div>
    );
};
