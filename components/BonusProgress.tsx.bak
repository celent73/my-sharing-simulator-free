import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import SharyTrigger from './SharyTrigger';

interface BonusProgressProps {
  totalContracts: number;
  onBonusChange?: (bonusAmount: number) => void;
}

const MedalIcon = () => (
  <span className="text-2xl mr-2 drop-shadow-sm">🥇</span>
);

const TrophyIcon = () => (
  <span className="text-2xl mr-2 drop-shadow-sm">🏆</span>
);

const CrownIcon = () => (
  <span className="text-2xl mr-2 drop-shadow-sm">👑</span>
);

const ChartIcon = () => (
  <div className="p-2 bg-white/80 rounded-lg shadow-sm">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
    </svg>
  </div>

);

const ProgressBar = ({ current, target, isCompleted }: { current: number; target: number; isCompleted: boolean }) => {
  const percentage = Math.min(100, Math.max(0, (current / target) * 100));

  return (
    <div className="w-full h-3 bg-blue-200/50 rounded-full mt-2 overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-1000 ease-out ${isCompleted ? 'bg-green-500' : 'bg-union-blue-500'}`}
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
  managerTitle?: string;
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
  managerTitle,
  monthlyBonus,
  isActive,
  onToggle
}) => {
  const remaining = target - current;
  const isCompleted = remaining <= 0;

  return (
    <div className={`
        relative p-4 rounded-2xl border transition-all duration-500
        ${isCompleted
        ? 'bg-yellow-50/90 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)] scale-[1.02]'
        : 'bg-union-blue-50/60 border-blue-100 shadow-sm'}
        backdrop-blur-sm
    `}>
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center flex-1">
          {icon}
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold text-union-blue-900 dark:text-union-blue-300 text-sm sm:text-base">{level} {levelNum}</h4>
              {isCompleted && managerTitle && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-white shadow-lg animate-pulse border-2 border-white/50">
                  ✨ {managerTitle}
                </span>
              )}
              {isCompleted && (
                <div className="flex items-center gap-2 ml-auto">

                  <span className="text-xs text-slate-600 font-medium ml-2">Attiva Bonus</span>
                  <button
                    onClick={onToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${isActive ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-300'
                      }`}
                    role="switch"
                    aria-checked={isActive}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                  </button>
                </div>
              )}
            </div>
            {isCompleted && <span className="text-xs text-green-600 font-bold animate-pulse">{t('bonus.card_completed')}</span>}
            {isCompleted && isActive && (
              <p className="text-xs text-emerald-600 font-bold mt-1">
                💰 +€{monthlyBonus.toLocaleString('it-IT')}/mese (Per sempre)
              </p>
            )}
          </div>
        </div>
        <span className="font-bold text-union-blue-600 dark:text-union-blue-400 text-sm sm:text-lg ml-2">{bonusAmount}</span>
      </div>

      <ProgressBar current={current} target={target} isCompleted={isCompleted} />

      <p className="text-xs text-slate-500 mt-2 font-medium flex justify-between">
        <span>Fatti: <span className="font-bold text-slate-700">{current.toLocaleString('it-IT')}</span></span>
        {!isCompleted && (
          <span>Mancano: <span className="font-bold text-red-500">{remaining.toLocaleString('it-IT')}</span></span>
        )}
        {isCompleted && <span className="text-green-600 font-bold">{t('bonus.card_completed')}</span>}
      </p>
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
    { target: 600, amount: "+300€/mese", icon: <MedalIcon />, levelNum: 600, managerTitle: "Pro Manager", monthlyBonus: 300 },
    { target: 1500, amount: "+1000€/mese", icon: <TrophyIcon />, levelNum: 1500, managerTitle: "Regional Manager", monthlyBonus: 1000 },
    { target: 5000, amount: "+3000€/mese", icon: <CrownIcon />, levelNum: 5000, managerTitle: "National Manager", monthlyBonus: 3000 },
  ];

  // Effect to recalculate bonus when totalContracts changes (e.g. on Reset)
  React.useEffect(() => {
    let highestBonus = 0;
    milestones.forEach(milestone => {
      if (activeBonuses[milestone.levelNum] && totalContracts >= milestone.target) {
        if (milestone.monthlyBonus > highestBonus) {
          highestBonus = milestone.monthlyBonus;
        }
      }
    });

    if (onBonusChange) {
      onBonusChange(highestBonus);
    }
  }, [totalContracts, activeBonuses, onBonusChange]);

  const handleToggle = (levelNum: number) => {
    setActiveBonuses(prev => {
      const newState = { ...prev, [levelNum]: !prev[levelNum] };

      // Calculate highest active bonus
      let highestBonus = 0;
      milestones.forEach(milestone => {
        if (newState[milestone.levelNum] && totalContracts >= milestone.target) {
          if (milestone.monthlyBonus > highestBonus) {
            highestBonus = milestone.monthlyBonus;
          }
        }
      });

      // Notify parent component
      if (onBonusChange) {
        onBonusChange(highestBonus);
      }

      return newState;
    });
  };

  const nextMilestone = milestones.find(m => m.target > totalContracts);
  const remainingToNext = nextMilestone ? nextMilestone.target - totalContracts : 0;
  const isAllCompleted = !nextMilestone;

  const scrollToParams = () => {
    const element = document.getElementById('input-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-4">



      {/* Container for Goals */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/40 dark:border-gray-700/50 relative">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-2xl text-red-500">🎯</span>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('bonus.title')}</h2>
          <SharyTrigger
            message="ENTRA NELLA SECONDA FASE DI CARRIERA! Con 600 utenze di rete (rispettando il 60% della gamba più forte) ottieni i bonus extra che si aggiungono ai guadagni di rete"
            messageDe="ERÖFFNE DIE ZWEITE KARRIEREPHASE! Mit 600 Netzwerk-Usern (unter Einhaltung der 60%-Regel des stärksten Beins) erhältst du Extra-Boni, die zu deinen Netzwerkgewinnen hinzugefügt werden!"
            messageEn="ENTER THE SECOND PHASE OF CAREER! With 600 network utilities (respecting 60% of the strongest leg) you get extra bonuses that are added to network earnings"
          />
        </div>

        <div className="space-y-4">
          {milestones.map((milestone) => (
            <BonusCard
              key={milestone.target}
              current={totalContracts}
              target={milestone.target}
              icon={milestone.icon}
              level={t('bonus.level')}
              levelNum={milestone.levelNum}
              bonusAmount={milestone.amount}
              managerTitle={milestone.managerTitle}
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