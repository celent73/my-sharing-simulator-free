
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AssetComparatorProps {
    recurringIncome: number;
}

const AssetComparator: React.FC<AssetComparatorProps> = ({ recurringIncome }) => {
    const { t } = useLanguage();
    // Calcolo annualizzato
    const annualIncome = recurringIncome * 12;

    // Rendimenti medi stimati netti
    const YIELD_REAL_ESTATE = 0.04; // 4% netto affitto
    const YIELD_BONDS = 0.03;       // 3% BTP/Obbligazioni
    const YIELD_BANK = 0.015;       // 1.5% Conto Deposito

    const capitalRealEstate = annualIncome / YIELD_REAL_ESTATE;
    const capitalBonds = annualIncome / YIELD_BONDS;
    const capitalBank = annualIncome / YIELD_BANK;

    const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    const scrollToParams = () => {
        const element = document.getElementById('input-panel');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    if (recurringIncome <= 0) return null;

    return (
        <div className="bg-black/40 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/10 p-8 sm:p-10 overflow-hidden relative mt-8 transition-transform hover:scale-[1.01] duration-500 group">

            {/* Ambient Light */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

            <div className="relative z-10 mb-10 text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/90 text-xs font-bold uppercase tracking-widest mb-4 shadow-lg backdrop-blur-md">
                    <span>🏦</span> {t('assets.tag')}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 tracking-tight drop-shadow-lg">{t('assets.title')}</h2>
                <p className="text-slate-400 max-w-2xl text-lg font-medium leading-relaxed">
                    {t('assets.desc')} <span className="text-white font-bold decoration-amber-500/50 underline underline-offset-4 decoration-2">{formatCurrency(recurringIncome)}/ {t('common.month')?.toLowerCase() || 'mese'}</span>
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Real Estate Card */}
                <div className="bg-black/20 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 hover:bg-white/5 transition-all duration-300 group/card relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-12 h-12 flex items-center justify-center bg-emerald-500/10 rounded-2xl text-2xl group-hover/card:scale-110 transition-transform duration-300 ring-1 ring-emerald-500/20 shadow-lg shadow-emerald-500/5">🏢</div>
                        <div>
                            <h4 className="font-black text-emerald-400 text-xs uppercase tracking-widest mb-1">{t('assets.real_estate')}</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('assets.re_desc')}</p>
                        </div>
                    </div>
                    <p className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 relative z-10">{formatCurrency(capitalRealEstate)}</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed relative z-10">
                        {t('assets.re_equiv').replace('appartamenti', `${Math.max(1, Math.round(capitalRealEstate / 200000))} appartamenti`)}
                    </p>
                </div>

                {/* Bonds Card */}
                <div className="bg-black/20 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 hover:bg-white/5 transition-all duration-300 group/card relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-12 h-12 flex items-center justify-center bg-blue-500/10 rounded-2xl text-2xl group-hover/card:scale-110 transition-transform duration-300 ring-1 ring-blue-500/20 shadow-lg shadow-blue-500/5">📈</div>
                        <div>
                            <h4 className="font-black text-blue-400 text-xs uppercase tracking-widest mb-1">{t('assets.bonds')}</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('assets.bonds_desc')}</p>
                        </div>
                    </div>
                    <p className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 relative z-10">{formatCurrency(capitalBonds)}</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed relative z-10">
                        {t('assets.bonds_note')}
                    </p>
                </div>

                {/* Bank Card */}
                <div className="bg-black/20 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 hover:bg-white/5 transition-all duration-300 group/card relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-center gap-4 mb-6 relative z-10">
                        <div className="w-12 h-12 flex items-center justify-center bg-purple-500/10 rounded-2xl text-2xl group-hover/card:scale-110 transition-transform duration-300 ring-1 ring-purple-500/20 shadow-lg shadow-purple-500/5">🏛️</div>
                        <div>
                            <h4 className="font-black text-purple-400 text-xs uppercase tracking-widest mb-1">{t('assets.bank')}</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t('assets.bank_desc')}</p>
                        </div>
                    </div>
                    <p className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3 relative z-10">{formatCurrency(capitalBank)}</p>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed relative z-10">
                        {t('assets.bank_note')}
                    </p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
                <p className="text-xs font-medium text-slate-500 italic">
                    {t('assets.footer')}
                </p>
            </div>
        </div>
    );
};


export default AssetComparator;
