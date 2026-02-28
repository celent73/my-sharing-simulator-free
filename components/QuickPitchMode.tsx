import React, { useState } from 'react';
import { CompensationPlanResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { CreditCard, TrendingUp, Copy, Check, Briefcase, Wallet, Clock, ArrowRight } from 'lucide-react';

interface QuickPitchModeProps {
  planResult: CompensationPlanResult;
  realizationMonths: number;
}

const QuickPitchMode: React.FC<QuickPitchModeProps> = ({ planResult, realizationMonths }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // --- CALCOLI ASSET ---
  // Ipotesi: Quanto capitale serve per generare questa rendita al 5% annuo netto?
  // Formula: (RenditaMensile * 12) / 0.05 = RenditaMensile * 240
  const monthlyRecurring = planResult.totalRecurringYear3;
  const assetValue = monthlyRecurring * 240;

  // Ipotesi Valore Orario:
  // Lavoro tradizionale: 40h/sett * 4 sett = 160h/mese
  // Network (a regime): ipotizziamo 10h/sett per mantenere = 40h/mese
  // Valore orario business = Rendita / 40
  const hourlyValue = monthlyRecurring > 0 ? monthlyRecurring / 40 : 0;

  const oneTimeBonus = planResult.totalOneTimeBonus;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleCopyPitch = () => {
    const textToCopy = `${t('quick_pitch.pitch_text_1')} ${realizationMonths} ${t('quick_pitch.pitch_text_2')} ${formatCurrency(assetValue)}\n${t('quick_pitch.pitch_text_3')} ${formatCurrency(monthlyRecurring)}/mese\n${t('quick_pitch.pitch_text_4')} ${formatCurrency(oneTimeBonus)}\n\n${t('quick_pitch.pitch_text_5')} ${Math.max(1, Math.floor(assetValue / 150000))} ${t('quick_pitch.pitch_text_6')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[95%] 2xl:max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">

      {/* HEADER SECTION */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-white/50 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
          {t('quick_pitch.title')}
        </h2>
        <p className="text-xl text-slate-300 font-medium max-w-3xl mx-auto leading-relaxed">
          {t('quick_pitch.subtitle')} <span className="text-union-orange-400 font-bold drop-shadow-[0_0_10px_rgba(251,146,60,0.5)]">{t('quick_pitch.subtitle_highlight')}</span> {t('quick_pitch.subtitle_end')}
        </p>
      </div>

      {/* THE ASSET CARD */}
      <div className="relative group perspective-1000">
        <div className="absolute inset-0 bg-gradient-to-r from-union-orange-500/30 to-purple-600/30 rounded-[3rem] blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>

        <div className="relative bg-black/40 backdrop-blur-2xl text-white p-4 md:p-14 rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-union-orange-500/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

          {/* Card Content Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-16 xl:gap-24 items-center relative z-10">

            {/* LEFT: The Big Value */}
            <div className="space-y-8">
              <div className="flex w-full justify-center items-center gap-2 px-3 py-4 rounded-2xl bg-white/5 border border-white/10 text-union-orange-400 text-xs sm:text-sm font-black uppercase tracking-widest shadow-lg backdrop-blur-md">
                <TrendingUp size={16} />
                {t('quick_pitch.card_tag')}
              </div>

              <div>
                <h3 className="text-7xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                  {formatCurrency(assetValue)}
                </h3>
                <p className="text-slate-300 mt-4 font-medium text-xl leading-relaxed max-w-lg">
                  {t('quick_pitch.card_desc')}
                </p>
              </div>

              <div className="flex flex-col w-full gap-6 mt-8">
                <div className="w-full bg-black/40 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-lg group-hover:bg-white/5 transition-colors">
                  <p className="text-slate-400 text-xs font-black uppercase mb-3 tracking-widest">{t('quick_pitch.monthly_rent')}</p>
                  <p className="text-4xl md:text-5xl font-black text-white tracking-tight">{formatCurrency(monthlyRecurring)}</p>
                </div>
                <div className="w-full bg-black/40 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 shadow-lg group-hover:bg-white/5 transition-colors">
                  <p className="text-slate-400 text-xs font-black uppercase mb-3 tracking-widest">{t('quick_pitch.bonus_cash')}</p>
                  <p className="text-4xl md:text-5xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)] tracking-tight">+{formatCurrency(oneTimeBonus)}</p>
                </div>
              </div>
            </div>

            {/* RIGHT: The Visual "Pass" */}
            <div className="relative">
              <div className="aspect-[1.586/1] w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden group-hover:rotate-1 transition-transform duration-700">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-200%] group-hover:animate-shine"></div>

                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-black text-white/50 tracking-[0.2em] uppercase">Business Passport</p>
                    <p className="text-2xl font-black text-white tracking-tight">{t('quick_pitch.card_member')}</p>
                  </div>
                  <Wallet className="text-white/80" size={40} />
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-16 rounded-lg bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-lg border border-yellow-200/20">
                      <div className="w-10 h-8 border-2 border-yellow-800/20 rounded-md"></div>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Weekly Income</div>
                      <div className="font-mono text-white/90 tracking-widest text-lg font-bold shadow-black drop-shadow-md">
                        •••• •••• {monthlyRecurring.toFixed(0)} EUR
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-black tracking-widest mb-1">Valid Thru</p>
                    <p className="font-mono text-lg text-white font-bold">LIFETIME</p>
                  </div>
                  <CreditCard className="text-white/20" size={64} />
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-10 flex justify-center md:justify-end">
                <button
                  onClick={handleCopyPitch}
                  className={`group flex items-center gap-4 px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-xl ${copied
                    ? 'bg-emerald-500 text-white scale-105 shadow-emerald-500/30'
                    : 'bg-white text-slate-900 hover:bg-union-orange-400 hover:text-white hover:scale-105 hover:shadow-orange-500/30'
                    }`}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? t('quick_pitch.copied') : t('quick_pitch.copy_btn')}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* COMPARISON METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-black/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-lg flex flex-col gap-6 hover:bg-white/5 transition-colors group">
          <div className="flex items-center justify-between">
            <div className="p-4 bg-blue-500/20 text-blue-400 rounded-2xl border border-blue-500/30 group-hover:scale-110 transition-transform">
              <Clock size={28} />
            </div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Tempo</span>
          </div>
          <div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wide mb-1 opacity-70">{t('quick_pitch.metrics.hourly_val')}</p>
            <p className="text-4xl font-black text-white">
              {formatCurrency(hourlyValue)}<span className="text-lg font-bold text-slate-500">/h</span>
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">{t('quick_pitch.metrics.vs_job')}</p>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-lg flex flex-col gap-6 hover:bg-white/5 transition-colors group">
          <div className="flex items-center justify-between">
            <div className="p-4 bg-purple-500/20 text-purple-400 rounded-2xl border border-purple-500/30 group-hover:scale-110 transition-transform">
              <Briefcase size={28} />
            </div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Asset</span>
          </div>
          <div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wide mb-1 opacity-70">{t('quick_pitch.metrics.equiv')}</p>
            <p className="text-4xl font-black text-white">
              {Math.max(1, Math.floor(assetValue / 150000))} <span className="text-lg font-bold text-slate-500">{t('quick_pitch.metrics.apartments')}</span>
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">{t('quick_pitch.metrics.rent_desc')}</p>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white/10 shadow-lg flex flex-col gap-6 hover:bg-white/5 transition-colors group">
          <div className="flex items-center justify-between">
            <div className="p-4 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <ArrowRight size={28} />
            </div>
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Velocità</span>
          </div>
          <div>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-wide mb-1 opacity-70">{t('quick_pitch.metrics.time')}</p>
            <p className="text-4xl font-black text-white">
              {realizationMonths} <span className="text-lg font-bold text-slate-500">{t('inaction.months_unit')}</span>
            </p>
            <p className="text-xs text-slate-500 mt-2 font-medium">{t('quick_pitch.metrics.part_time')}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default QuickPitchMode;
