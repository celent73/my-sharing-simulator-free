import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Building2, TrendingUp, Info } from 'lucide-react';

interface AssetEquivalentCardProps {
    recurringAnnual: number;
}

const AssetEquivalentCard: React.FC<AssetEquivalentCardProps> = ({ recurringAnnual }) => {
    const { t } = useLanguage();
    const [yieldRate, setYieldRate] = useState<number>(5.0); // Default 5%

    // Calculate Asset Value: Annual Income / (Yield / 100)
    const assetValue = yieldRate > 0 ? recurringAnnual / (yieldRate / 100) : 0;

    const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-amber-500/30 shadow-2xl mt-8 mb-8 group">

            {/* Background Luxury Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-amber-500/10 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-50%] right-[-20%] w-[80%] h-[80%] bg-yellow-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }}></div>
                {/* Gold particles/sparkles overlay could go here */}
            </div>

            <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">

                {/* LEFT: The Big Number (The Asset) */}
                <div className="flex-1 text-center md:text-left space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                        <Building2 size={14} />
                        {t('asset_card.tag') || "Patrimonio Immobiliare"}
                    </div>

                    <h3 className="text-xl text-amber-100/80 font-medium">
                        {t('asset_card.subtitle') || "Valore immobile equivalente"}
                    </h3>

                    <div className="relative inline-block">
                        <span className="text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-yellow-400 to-amber-600 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                            {formatCurrency(assetValue)}
                        </span>
                    </div>

                    <p className="text-sm text-slate-400 max-w-md leading-relaxed mx-auto md:mx-0">
                        {t('asset_card.explainer') || "Per generare la tua rendita annuale ricorrente con un immobile tradizionale, dovresti possedere un asset di questo valore."}
                    </p>
                </div>

                {/* RIGHT: Controls & Context */}
                <div className="flex-1 w-full md:max-w-md bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 shadow-inner">

                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-xs text-amber-200/70 font-bold uppercase tracking-wider flex items-center gap-2">
                                <TrendingUp size={14} />
                                {t('asset_card.yield_label') || "Rendimento Annuo Atteso"}
                            </label>
                            <span className="text-xl font-bold text-amber-400 bg-amber-900/40 px-3 py-1 rounded-lg border border-amber-500/20">
                                {yieldRate.toFixed(1)}%
                            </span>
                        </div>
                        <input
                            type="range"
                            min="2.0"
                            max="8.0"
                            step="0.1"
                            value={yieldRate}
                            onChange={(e) => setYieldRate(parseFloat(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500 hover:accent-amber-400 transition-all"
                        />
                        <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
                            <span>2.0% (Conservativo)</span>
                            <span>8.0% (Ottimistico)</span>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-xl p-4 border border-white/5 flex gap-3 items-start">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 shrink-0">
                            <Info size={18} />
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-white">
                                {t('asset_card.insight_title') || "Il potere della rendita senza asset"}
                            </p>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                {t('asset_card.insight_text') || "Stai creando un valore patrimoniale di un quarto di milione di euro, senza dover acquistare muri, fare mutui o gestire inquilini."}
                            </p>
                        </div>
                    </div>

                </div>
            </div>

            {/* Glossy overlay */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>

        </div>
    );
};

export default AssetEquivalentCard;
