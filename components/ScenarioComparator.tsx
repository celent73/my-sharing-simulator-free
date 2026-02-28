import React, { useState } from 'react';
import { PlanInput } from '../types';
import { useCompensationPlan } from '../hooks/useSimulation';
import { useLanguage } from '../contexts/LanguageContext';

interface ScenarioComparatorProps {
  baseInputs: PlanInput;
}

const ScenarioComparator: React.FC<ScenarioComparatorProps> = ({ baseInputs }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  // Scenario Pessimista: -30% contratti per utente, -20% reclutamenti
  const pessimisticInputs: PlanInput = {
    ...baseInputs,
    contractsPerUser: Math.max(1, Math.floor(baseInputs.contractsPerUser * 0.7)),
    directRecruits: Math.max(1, Math.floor(baseInputs.directRecruits * 0.8)),
    indirectRecruits: Math.max(1, Math.floor(baseInputs.indirectRecruits * 0.8)),
  };

  // Scenario Realistico: valori base
  const realisticInputs = baseInputs;

  // Scenario Ottimista: +30% contratti per utente, +20% reclutamenti
  const optimisticInputs: PlanInput = {
    ...baseInputs,
    contractsPerUser: Math.ceil(baseInputs.contractsPerUser * 1.3),
    directRecruits: Math.ceil(baseInputs.directRecruits * 1.2),
    indirectRecruits: Math.ceil(baseInputs.indirectRecruits * 1.2),
  };

  const pessimisticResult = useCompensationPlan(pessimisticInputs);
  const realisticResult = useCompensationPlan(realisticInputs);
  const optimisticResult = useCompensationPlan(optimisticInputs);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const scenarios = [
    {
      title: t('scenarios.pessimistic.title'),
      subtitle: t('scenarios.pessimistic.subtitle'),
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-black/20',
      borderColor: 'border-red-500/30',
      textColor: 'text-slate-200',
      result: pessimisticResult,
      icon: '📉'
    },
    {
      title: t('scenarios.realistic.title'),
      subtitle: t('scenarios.realistic.subtitle'),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-black/20',
      borderColor: 'border-blue-500/30',
      textColor: 'text-white',
      result: realisticResult,
      icon: '📊',
      highlight: true
    },
    {
      title: t('scenarios.optimistic.title'),
      subtitle: t('scenarios.optimistic.subtitle'),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-black/20',
      borderColor: 'border-green-500/30',
      textColor: 'text-emerald-100',
      result: optimisticResult,
      icon: '📈'
    }
  ];

  return (
    <div className="bg-black/40 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/10 relative overflow-hidden transition-transform hover:scale-[1.01] duration-500">
      {/* Decorative Ambient Light */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-900/10 rounded-full blur-[100px] pointer-events-none translate-y-1/3 -translate-x-1/3"></div>

      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
            <span className="text-3xl">🎯</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {t('scenarios.title')}
            </h2>
            <p className="text-sm font-medium text-slate-400">
              {t('scenarios.subtitle')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          {isExpanded ? t('scenarios.btn_hide') : t('scenarios.btn_show')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            className={`${scenario.bgColor} ${scenario.borderColor} border-2 rounded-[2rem] p-6 transition-all duration-300 ${scenario.highlight ? 'shadow-[0_0_30px_rgba(59,130,246,0.15)] ring-1 ring-white/10 scale-[1.02]' : 'hover:bg-white/5'
              }`}
          >
            <div className="text-center mb-6">
              <div className="text-4xl mb-3 drop-shadow-md transform transition-transform hover:scale-110 duration-300 inline-block">{scenario.icon}</div>
              <h3 className={`text-lg font-black ${scenario.textColor} mb-1 tracking-tight`}>
                {scenario.title}
              </h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                {scenario.subtitle}
              </p>
            </div>

            <div className="space-y-3">
              <div className={`bg-black/20 p-4 rounded-2xl border border-white/5`}>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('scenarios.metrics.immediate')}</p>
                <p className={`text-2xl font-black bg-gradient-to-r ${scenario.color} bg-clip-text text-transparent`}>
                  {formatCurrency(scenario.result.totalOneTimeBonus)}
                </p>
              </div>

              <div className={`bg-black/20 p-4 rounded-2xl border border-white/5`}>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('scenarios.metrics.recurring')}</p>
                <p className={`text-2xl font-black bg-gradient-to-r ${scenario.color} bg-clip-text text-transparent`}>
                  {formatCurrency(scenario.result.totalRecurringYear3)}
                  <span className="text-xs text-slate-500 ml-1 font-bold">/m</span>
                </p>
              </div>

              {isExpanded && (
                <div className="animate-in slide-in-from-top-2 fade-in duration-300 space-y-3">
                  <div className={`bg-black/20 p-4 rounded-2xl border border-white/5`}>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('scenarios.metrics.users')}</p>
                    <p className={`text-xl font-black text-white`}>
                      {scenario.result.totalUsers.toLocaleString('it-IT')}
                    </p>
                  </div>

                  <div className={`bg-black/20 p-4 rounded-2xl border border-white/5`}>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t('scenarios.metrics.contracts')}</p>
                    <p className={`text-xl font-black text-white`}>
                      {scenario.result.totalContracts.toLocaleString('it-IT')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isExpanded && (
        <div className="mt-8 text-center">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse opacity-70">
            {t('scenarios.metrics.click_hint')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScenarioComparator;
