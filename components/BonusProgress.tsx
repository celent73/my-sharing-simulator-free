import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SharyTrigger from './SharyTrigger';

interface BonusProgressProps {
  totalContracts: number;
  onBonusChange?: (bonusAmount: number) => void;
}

const MedalIcon = () => (
  <span className="text-2xl mr-2">🥇</span>
);

const TrophyIcon = () => (
  <span className="text-2xl mr-2">🏆</span>
);

const CrownIcon = () => (
  <span className="text-2xl mr-2">👑</span>
);

const ProgressBar = ({ current, target, isCompleted }: { current: number; target: number; isCompleted: boolean }) => {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));

  return (
    <div className="w-full h-3 bg-slate-200/50 dark:bg-slate-800/50 rounded-full mt-3 overflow-hidden shadow-inner border border-slate-300/30 dark:border-white/5">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${isCompleted ? 'bg-emerald-500 dark:bg-emerald-600' : 'bg-blue-600 dark:bg-blue-500'}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

interface BonusCardProps {
  icon: React.ReactNode;
  level: string;
  levelNum: number;
  bonusAmount: string;
  target: number;
  current: number;
  t: any;
  managerTitleKey?: string;
  monthlyBonus: number;
  isActive: boolean;
  onToggle: () => void;
}

const BonusCard: React.FC<BonusCardProps> = ({
  icon,
  level,
  levelNum,
  bonusAmount,
  target,
  current,
  t,
  managerTitleKey,
  monthlyBonus,
  isActive,
  onToggle
}) => {
  const { language } = useLanguage();
  const remaining = target - current;
  const isCompleted = remaining <= 0;
  const locale = language === 'it' ? 'it-IT' : (language === 'de' ? 'de-DE' : 'en-US');

  return (
    <div className={`
        relative p-4 sm:p-6 rounded-[2rem] border-2 transition-all duration-300 backdrop-blur-xl
        ${isCompleted
        ? 'bg-amber-50/60 dark:bg-amber-900/30 border-amber-200/80 dark:border-amber-500/30 shadow-md scale-[1.01]'
        : 'bg-white/70 dark:bg-slate-900/60 border-slate-200/60 dark:border-white/10 shadow-sm hover:shadow-md hover:border-slate-300/80 dark:hover:border-white/20'}
    `}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center flex-1">
          <div className="p-2 bg-white/50 rounded-xl shadow-sm mr-2">{icon}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-black text-gray-900 dark:text-white text-sm tracking-tight">{level} {levelNum}</h4>
              {isCompleted && managerTitleKey && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 border-2 border-amber-200 dark:border-amber-500/30 uppercase tracking-tighter shadow-sm">
                  {t(managerTitleKey)}
                </span>
              )}
              {isCompleted && (
                <div className="flex flex-col items-center gap-1 ml-auto bg-white/40 dark:bg-black/20 p-2 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner">
                  <span className="text-[9px] text-gray-500 dark:text-slate-400 font-black uppercase tracking-widest">{t('bonus.bonus_active')}</span>
                  <button
                    onClick={onToggle}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 shadow-md ${isActive ? 'bg-blue-600 ring-2 ring-blue-500/20' : 'bg-slate-300 dark:bg-slate-700'}`}
                    role="switch"
                  >
                    <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <span className={`font-black text-base ${isCompleted ? 'text-amber-600' : 'text-blue-700'} drop-shadow-sm`}>{bonusAmount}</span>
      </div>

      <ProgressBar current={current} target={target} isCompleted={isCompleted} />

      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-3 font-black uppercase tracking-widest flex justify-between items-center">
        <span>{t('bonus.card_done')}: <span className="text-gray-900 dark:text-white">{current.toLocaleString(locale)}</span></span>
        {!isCompleted && <span>{t('bonus.card_remaining_prefix')}: <span className="text-red-500 dark:text-red-400 animate-pulse">{remaining.toLocaleString(locale)}</span></span>}
        {isCompleted && isActive && (
          <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-500/30">
            +€{monthlyBonus.toLocaleString(locale)}{t('results.per_month')}
          </span>
        )}
      </div>
    </div>
  );
};

const BonusProgress: React.FC<BonusProgressProps> = ({ totalContracts, onBonusChange }) => {
  const { t } = useLanguage();

  const [activeBonuses, setActiveBonuses] = useState<{ [key: number]: boolean }>({
    600: false,
    1500: false,
    5000: false
  });

  const milestones = [
    { target: 600, amount: `+300€${t('results.per_month')}`, icon: <MedalIcon />, levelNum: 600, managerTitleKey: "bonus.role_pro", monthlyBonus: 300 },
    { target: 1500, amount: `+1000€${t('results.per_month')}`, icon: <TrophyIcon />, levelNum: 1500, managerTitleKey: "bonus.role_reg", monthlyBonus: 1000 },
    { target: 5000, amount: `+3000€${t('results.per_month')}`, icon: <CrownIcon />, levelNum: 5000, managerTitleKey: "bonus.role_nat", monthlyBonus: 3000 },
  ];

  React.useEffect(() => {
    let highestBonus = 0;
    milestones.forEach(milestone => {
      if (activeBonuses[milestone.levelNum] && totalContracts >= milestone.target) {
        if (milestone.monthlyBonus > highestBonus) {
          highestBonus = milestone.monthlyBonus;
        }
      }
    });
    if (onBonusChange) onBonusChange(highestBonus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalContracts, activeBonuses, onBonusChange]);

  const handleToggle = (levelNum: number) => {
    setActiveBonuses(prev => {
      const newState = { ...prev, [levelNum]: !prev[levelNum] };
      return newState;
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl px-3 py-8 sm:p-8 rounded-[3rem] shadow-xl border-2 border-slate-100 dark:border-white/10 relative">
        <div className="flex items-center gap-3 mb-8 px-2 sm:px-0">
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-2xl shadow-sm">🎯</div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{t('bonus.title')}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">2° fase di carriera</p>
          </div>
          <SharyTrigger message="..." />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {milestones.map((milestone) => (
            <BonusCard
              key={milestone.target}
              current={totalContracts}
              target={milestone.target}
              icon={milestone.icon}
              level={t('bonus.level')}
              levelNum={milestone.levelNum}
              bonusAmount={milestone.amount}
              managerTitleKey={milestone.managerTitleKey}
              t={t}
              monthlyBonus={milestone.monthlyBonus}
              isActive={activeBonuses[milestone.levelNum]}
              onToggle={() => handleToggle(milestone.levelNum)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BonusProgress;