import React, { useRef, useCallback, useState } from 'react';
import { CompensationPlanResult, ViewMode, PlanInput } from '../types';
import GrowthChart from './GrowthChart';
import BonusProgress from './BonusProgress';
import DreamVisualizer from './DreamVisualizer';
import FreedomCalculator from './FreedomCalculator';
import PensionCalculator from './PensionCalculator';
import AssetComparator from './AssetComparator';
import TimeMultiplier from './TimeMultiplier';
import InactionCost from './InactionCost';
import ZeroCostGoal from './ZeroCostGoal';
import GoldenNoCard from './GoldenNoCard';

import ScenarioComparator from './ScenarioComparator';
import QuickPitchMode from './QuickPitchMode';
import QuickNavigation from './QuickNavigation';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../contexts/LanguageContext';
import { FileDown, Edit3, X, Save, Loader2, Download, User } from 'lucide-react';
import { NetworkPDFTemplate } from './NetworkPDFTemplate';
import ProjectionModal from './ProjectionModal';
import LiveBattleMode from './LiveBattleMode';
import AICoach from './AICoach';
import SharyTrigger from './SharyTrigger';


interface ResultsDisplayProps {
  planResult: CompensationPlanResult;
  viewMode?: ViewMode;
  inputs: PlanInput;
  cashbackPeriod?: 'monthly' | 'annual';
  onInputChange?: (field: keyof PlanInput, value: number) => void;
  isFullScreen?: boolean; // NEW PROP
  onToggleFullScreen?: () => void; // NEW PROP
}

import { FileText, Heart, PenSquare, RotateCcw } from 'lucide-react';
import { CustomSlider } from './CustomSlider';

interface SummaryCardProps {
  title: string;
  value: string;
  suffix?: React.ReactNode;
  variant?: 'glass' | 'gradient-blue' | 'gradient-orange';
  icon?: React.ReactNode;
  showBadge?: boolean;
}

const UsersIcon = ({ className = "w-6 h-6" }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" /><path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" /></svg>);
const WalletIcon = ({ className = "w-6 h-6" }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" /><path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-6.375 5.25a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25Z" clipRule="evenodd" /></svg>);
const FireIcon = ({ className = "w-6 h-6" }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.177 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" /></svg>);
const BoltIcon = ({ className = "w-6 h-6" }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" /></svg>);
const StarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006Z" clipRule="evenodd" /></svg>);

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, suffix, variant = 'glass', icon, showBadge }) => {
  let styles = {
    container: '',
    title: '',
    value: '',
    iconBg: '',
    iconColor: ''
  };

  switch (variant) {
    case 'gradient-blue':
      styles = {
        container: 'bg-gradient-to-br from-union-blue-600/90 to-union-blue-500/90 border border-blue-400/50 shadow-lg shadow-union-blue-500/20 hover:shadow-[0_0_25px_rgba(59,158,255,0.6)]',
        title: 'text-blue-100',
        value: 'text-white drop-shadow-sm',
        iconBg: 'bg-white/20',
        iconColor: 'text-white'
      };
      break;
    case 'gradient-orange':
      styles = {
        container: 'bg-gradient-to-br from-union-orange-600/90 to-union-orange-500/90 border border-yellow-400/50 shadow-lg shadow-union-orange-500/20 hover:shadow-[0_0_25px_rgba(250,204,21,0.6)]',
        title: 'text-orange-100',
        value: 'text-white drop-shadow-sm',
        iconBg: 'bg-white/20',
        iconColor: 'text-white'
      };
      break;
    case 'glass':
    default:
      styles = {
        container: 'bg-white dark:bg-black/40 backdrop-blur-md border border-gray-100 dark:border-white/10 shadow-lg dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)] hover:border-gray-200 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-black/50',
        title: 'text-gray-500 dark:text-gray-400 uppercase tracking-wider text-[10px] font-bold',
        value: 'text-gray-900 dark:text-white',
        iconBg: 'bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5',
        iconColor: 'text-gray-600 dark:text-gray-200'
      };
      break;
  }

  return (
    <div className={`p-5 rounded-3xl transition-all duration-300 ease-in-out flex flex-col items-start justify-between h-full hover:-translate-y-1 relative overflow-hidden ${styles.container}`}>
      {showBadge && (
        <div className="absolute -top-1 -right-1 z-20">
          <div className="bg-yellow-400 text-white p-2 rounded-bl-2xl shadow-lg border-b-2 border-l-2 border-white animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
              <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006Z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="absolute top-2 right-10 whitespace-nowrap bg-white text-yellow-600 text-[8px] font-black px-2 py-0.5 rounded-full shadow-sm border border-yellow-100 uppercase tracking-tighter animate-bounce">
            Bonus 3x3!
          </div>
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        {icon && (
          <div className={`p-2 rounded-xl backdrop-blur-sm ${styles.iconBg} ${styles.iconColor}`}>
            {icon}
          </div>
        )}
        <h4 className={`${styles.title} text-xs font-bold`}>{title}</h4>
      </div>
      <div className="flex items-baseline gap-1 mt-auto">
        <span className={`text-2xl lg:text-3xl font-black tracking-tight ${styles.value}`}>{value}</span>
        {suffix && <span className={`text-[10px] font-bold opacity-70 mb-1 ${styles.title}`}>{suffix}</span>}
      </div>
    </div>
  );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ planResult, viewMode = 'family', inputs, cashbackPeriod = 'monthly', onInputChange, isFullScreen = false, onToggleFullScreen }) => {
  const exportRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showWowFeatures, setShowWowFeatures] = useState(false);
  const [managerBonus, setManagerBonus] = useState(0);
  const [projectionYears, setProjectionYears] = useState(1);
  const [isProjectionModalOpen, setIsProjectionModalOpen] = useState(false);

  // Consultant Details State
  const [consultantName, setConsultantName] = useState('');
  const [consultantSurname, setConsultantSurname] = useState('');
  const [consultantPhone, setConsultantPhone] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);




  const handleReset = () => {
    if (onInputChange) {
      onInputChange('directRecruits', 0);
      onInputChange('contractsPerUser', 0);
      onInputChange('indirectRecruits', 0);
      onInputChange('networkDepth', 1);
    }
  };
  const { t, language } = useLanguage();

  const monthlyCashback = planResult.monthlyCashback;
  const monthlyData = planResult.monthlyData;
  const isClientMode = viewMode === 'client';
  const hasCashback = monthlyCashback > 0;
  const isAnnual = cashbackPeriod === 'annual';

  const rawOneTimeBonus = planResult.totalOneTimeBonus;
  const oneTimeBonusWithoutCashback = rawOneTimeBonus - monthlyCashback;

  // Se è annuale, il cashback NON appare nell'una tantum (va INTEGRATO nelle ricorrenze)
  const totalOneTimeBonus = oneTimeBonusWithoutCashback + (isAnnual ? 0 : monthlyCashback);

  const totalUsers = planResult.totalUsers;
  const totalContracts = planResult.totalContracts;

  // I valori del piano sono già mensili
  const totalRecurringYear1 = planResult.totalRecurringYear1 + managerBonus;
  const totalRecurringYear2 = planResult.totalRecurringYear2 + managerBonus;
  const totalRecurringYear3 = planResult.totalRecurringYear3 + managerBonus;

  // Calcoli per la visualizzazione delle card: SEMPRE MENSILE COME GRANDE
  const displayMonthlyRec1 = totalRecurringYear1 + (isAnnual ? monthlyCashback : 0);
  const displayMonthlyRec2 = totalRecurringYear2 + (isAnnual ? monthlyCashback : 0);
  const displayMonthlyRec3 = totalRecurringYear3 + (isAnnual ? monthlyCashback : 0);

  const recTitleSuffix = (isAnnual && hasCashback) ? " (+Cashback)" : "";

  const avgEarningsPerUser = totalUsers > 0 ? totalRecurringYear1 / totalUsers : 0;
  const totalEarningsYear1 = totalOneTimeBonus + (totalRecurringYear1 * 12);
  const directRecruits = planResult.levelData.find(l => l.level === 0)?.users || 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
  };

  const getLevelLabel = (level: number) => {
    if (level === 0) return "0 (Tu)";
    if (level === 1) return "1 (Diretto)";
    return level;
  }

  const formatValueWithSuffix = (value: number) => {
    const formatted = new Intl.NumberFormat('it-IT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    return {
      value: `${formatted} €`,
    };
  };

  const handleExportImage = useCallback(() => {
    if (exportRef.current === null) return;
    setIsExporting(true);
    toPng(exportRef.current, {
      cacheBust: true, pixelRatio: 2, width: 600, height: 900, style: { transform: 'none' }
    }).then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `proiezione-union-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = dataUrl;
      link.click();
      setIsExporting(false);
    }).catch(() => { setIsExporting(false); });
  }, [exportRef]);

  const handleExportPDF = useCallback(async () => {
    if (exportRef.current === null) return;
    setIsExporting(true);

    try {
      // 1. Generate Image from the Template (Wait for render)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Scale up for better quality
      const dataUrl = await toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 });

      // 2. Create PDF
      // A4 Size: 210mm x 297mm
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(dataUrl);

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`proiezione-guadagni-${new Date().toISOString().slice(0, 10)}.pdf`);

    } catch (err) {
      console.error("PDF Export failed", err);
    } finally {
      setIsExporting(false);
    }
  }, [exportRef]);

  const hasPark = (inputs.unionParkPanels || 0) > 0;
  const parkSuffix = hasPark ? " (+ Park)" : "";

  return (
    <div className="space-y-8 relative">
      <ProjectionModal
        isOpen={isProjectionModalOpen}
        onClose={() => setIsProjectionModalOpen(false)}
        years={projectionYears}
        onYearChange={setProjectionYears}
        monthlyRecurring={totalRecurringYear3 + (isAnnual ? monthlyCashback : 0)}


        totalOneTime={oneTimeBonusWithoutCashback + (isAnnual ? 0 : monthlyCashback)}
      />

      {isFullScreen && (
        <div className="fixed inset-0 z-[9998] bg-gray-100/90 dark:bg-slate-900/95 backdrop-blur-sm animate-in fade-in duration-300" />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        <SummaryCard
          title={cashbackPeriod === 'annual' ? "Bonus Una Tantum" : t('results.one_time')}
          value={formatValueWithSuffix(totalOneTimeBonus).value}
          variant="gradient-blue"
          icon={<WalletIcon />}
          showBadge={inputs.bonus3x3Active}
        />
        <SummaryCard
          title={t('results.rec_y1') + recTitleSuffix}
          value={formatValueWithSuffix(displayMonthlyRec1).value}
          suffix={<div className="flex flex-col -mb-1"><span className="text-[10px]">/ mese</span><span className="text-[8px] opacity-60 font-bold">anno: {formatCurrency(displayMonthlyRec1 * 12)}{parkSuffix}</span></div>}
          variant="glass"
          icon={<FireIcon className="text-union-orange-500" />}
        />
        <SummaryCard
          title={t('results.rec_y2') + recTitleSuffix}
          value={formatValueWithSuffix(displayMonthlyRec2).value}
          suffix={<div className="flex flex-col -mb-1"><span className="text-[10px]">/ mese</span><span className="text-[8px] opacity-60 font-bold">anno: {formatCurrency(displayMonthlyRec2 * 12)}{parkSuffix}</span></div>}
          variant="glass"
          icon={<BoltIcon className="text-union-orange-500" />}
        />
        <SummaryCard
          title={t('results.rec_y3') + recTitleSuffix}
          value={formatValueWithSuffix(displayMonthlyRec3).value}
          suffix={<div className="flex flex-col -mb-1"><span className="text-[10px]">/ mese</span><span className="text-[8px] opacity-60 font-bold">anno: {formatCurrency(displayMonthlyRec3 * 12)}{parkSuffix}</span></div>}
          variant="gradient-orange"
          icon={<StarIcon />}
        />
        <SummaryCard
          title={t('results.total_users')}
          value={totalUsers.toLocaleString('it-IT')}
          suffix={
            <div className="flex flex-col mt-1">
              <span className="text-[10px] opacity-70 font-normal">
                / {totalContracts.toLocaleString('it-IT')} Contratti
              </span>
              {(() => {
                const milestones = [600, 1500, 5000];
                const nextMilestone = milestones.find(m => m > totalContracts);
                const remainingToNext = nextMilestone ? nextMilestone - totalContracts : 0;
                if (remainingToNext <= 0) return null;
                return (
                  <span className="text-[8px] text-red-500 font-bold mt-1 block uppercase tracking-tight">
                    {remainingToNext} {t('bonus.next_goal')}
                  </span>
                );
              })()}
            </div>
          }
          variant="glass"
          icon={<UsersIcon />}
        />
      </div>

      <div className={`
        ${isFullScreen
          ? 'fixed inset-0 z-[10000] p-2 sm:p-4 flex flex-col gap-2 overflow-hidden bg-white/20 dark:bg-transparent'
          : 'relative transition-all duration-500 ease-in-out'
        }
      `}>
        <div className={`
          bg-white dark:bg-black/40 backdrop-blur-xl border border-gray-100 dark:border-white/10
          ${isFullScreen
            ? 'flex-1 rounded-[1.5rem] shadow-xl overflow-hidden flex flex-col p-4'
            : 'p-4 sm:p-8 rounded-[2.5rem] shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
          }
        `}>
          <div className="flex justify-between items-center mb-2 shrink-0">
            <h2 className={`font-black text-gray-900 dark:text-white flex items-center gap-3 ${isFullScreen ? 'text-3xl' : 'text-xl'}`}>
              <span className="p-2 rounded-xl bg-gradient-to-br from-union-blue-600 to-union-blue-800 text-white shadow-lg">📊</span>
              {t('results.table_title')}
              <SharyTrigger
                message="Sei pronto a far ESPLODERE il tuo Network? scegli quanti diretti vuoi ad esempio 3, scegli quanti contratti si faranno per ogni utente e scegli quanti indiretti faranno la stessa cosa. Dopodichè seleziona i livelli di profondità e SBAMM, osserva il POTENZIALE DEL TUO BUSINESS!!"
                messageDe="Bist du bereit, dein Netzwerk EXPLODIEREN zu lassen? Wähle, wie viele direkte Partner du möchtest, z.B. 3, wähle, wie viele Verträge jeder Benutzer abschließt, und wähle, wie viele indirekte Partner dasselbe tun. Dann wähle die Tiefenebenen und BÄÄM, sieh dir das POTENZIAL DEINES BUSINESS an!!"
                messageEn="Are you ready to make your Network EXPLODE? Choose how many direct recruits you want, e.g. 3, choose how many contracts each user will make and choose how many indirect recruits will do the same. Then select the depth levels and BOOM, watch the POTENTIAL OF YOUR BUSINESS!!"
              />
              {isFullScreen && (
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-union-orange-500 text-sm bg-union-orange-50 px-3 py-1 rounded-full uppercase tracking-wider border border-union-orange-200">Network Focus</span>
                  {isClientMode ? (
                    <span className="text-emerald-600 text-sm bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Cliente
                    </span>
                  ) : (
                    <span className="text-union-blue-600 text-sm bg-union-blue-50 px-3 py-1 rounded-full uppercase tracking-wider border border-union-blue-200 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-union-blue-500"></span>
                      Partner Sharing
                    </span>
                  )}
                </div>
              )}
            </h2>
            <div className="flex items-center gap-2">

              <button
                onClick={onToggleFullScreen}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 ${isFullScreen ? 'bg-union-blue-50 text-union-blue-600' : 'bg-union-blue-50 text-union-blue-600'} hover:bg-union-blue-100 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 border border-transparent hover:border-union-blue-200`}
                title={isFullScreen ? "Esci da Network Focus" : "Attiva Network Focus"}
              >
                {isFullScreen ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" /></svg>
                    {t('results.exit_fullscreen')}
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>
                    {t('results.enter_fullscreen')}
                  </>
                )}
              </button>

              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20 text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileDown size={16} />
                {isExporting ? '...' : 'PDF'}
              </button>
            </div>
          </div>

          <div className={`mt-4 rounded-3xl border border-gray-200 dark:border-white/10 shadow-inner bg-gray-50/50 dark:bg-black/20 p-2 max-w-full ${isFullScreen ? 'flex-1 min-h-0 overflow-auto' : 'overflow-x-auto'}`}>
            <table ref={tableRef} className="min-w-full divide-y divide-gray-200 dark:divide-white/5 bg-white dark:bg-black/20 rounded-2xl">
              <thead className="bg-gray-50 dark:bg-white/5 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('results.col_level')}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('results.col_users')}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('results.col_token')}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('results.col_rec_1')}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('results.col_rec_2')}</th>
                  <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('results.col_rec_3')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-white/5">
                {planResult.levelData.map((row) => (
                  <tr key={row.level} className="hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{getLevelLabel(row.level)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 font-mono">{row.users.toLocaleString('it-IT')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(row.oneTimeBonus)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(row.recurringYear1)}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{t('results.annual_suffix')} {formatCurrency(row.recurringYear1 * 12)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(row.recurringYear2)}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{t('results.annual_suffix')} {formatCurrency(row.recurringYear2 * 12)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(row.recurringYear3)}</div>
                      <div className="text-[10px] text-gray-400 font-medium">{t('results.annual_suffix')} {formatCurrency(row.recurringYear3 * 12)}</div>
                    </td>
                  </tr>
                ))}

                {/* RIGA DEDICATA AL PARK / BENEFICI PERSONALI */}
                {(planResult.monthlyPanelYield > 0 || (isAnnual && hasCashback)) && (
                  <tr className="bg-amber-50/50 dark:bg-amber-900/10 hover:bg-amber-100/60 dark:hover:bg-amber-900/20 transition-colors italic">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-amber-600 dark:text-amber-400">{t('results.cashback_park')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">-</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-amber-600 dark:text-amber-400">{formatCurrency(planResult.monthlyPanelYield + (isAnnual ? monthlyCashback : 0))}</div>
                      <div className="text-[10px] text-gray-400">{t('results.annual_suffix')} {formatCurrency((planResult.monthlyPanelYield + (isAnnual ? monthlyCashback : 0)) * 12)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-amber-600 dark:text-amber-400">{formatCurrency(planResult.monthlyPanelYield + (isAnnual ? monthlyCashback : 0))}</div>
                      <div className="text-[10px] text-gray-400">{t('results.annual_suffix')} {formatCurrency((planResult.monthlyPanelYield + (isAnnual ? monthlyCashback : 0)) * 12)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-amber-600 dark:text-amber-400">{formatCurrency(planResult.monthlyPanelYield + (isAnnual ? monthlyCashback : 0))}</div>
                      <div className="text-[10px] text-gray-400">{t('results.annual_suffix')} {formatCurrency((planResult.monthlyPanelYield + (isAnnual ? monthlyCashback : 0)) * 12)}</div>
                    </td>
                  </tr>
                )}

                {/* RIGA BONUS 3x3 */}
                {inputs.bonus3x3Active && (
                  <tr className="bg-yellow-50/50 dark:bg-yellow-900/10 hover:bg-yellow-100/60 dark:hover:bg-yellow-900/20 transition-colors animate-pulse">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-yellow-600 dark:text-yellow-400 flex items-center gap-2">
                      <StarIcon className="w-4 h-4" /> {t('results.bonus_3x3')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">-</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-yellow-600 dark:text-yellow-400">
                      {formatCurrency(150)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">-</td>
                    <td className="px-6 py-4 text-xs text-gray-400">-</td>
                    <td className="px-6 py-4 text-xs text-gray-400">-</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-gray-50 dark:bg-white/5 backdrop-blur-sm border-t border-gray-200 dark:border-white/10">
                <tr>
                  <td className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                    <div className="flex flex-col gap-2">
                      <span>{t('results.total')}</span>

                      <div className="flex gap-2 mt-2">
                        {/* PERSONALIZZA BUTTON */}
                        <button
                          onClick={() => setIsEditModalOpen(true)}
                          className="bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 dark:text-slate-300 p-2 rounded-xl transition-colors flex items-center gap-2"
                          title="Personalizza PDF"
                        >
                          <Edit3 size={16} />
                          <span className="text-xs font-bold uppercase hidden md:inline">{t('results.customize_btn')}</span>
                        </button>

                        {/* DOWNLOAD BUTTON */}
                        <button
                          onClick={handleExportPDF}
                          disabled={isExporting}
                          className="bg-union-blue-600 hover:bg-union-blue-700 text-white p-2 rounded-xl transition-colors flex items-center gap-2"
                          title="Scarica PDF"
                        >
                          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                          <span className="text-xs font-bold uppercase hidden md:inline">PDF</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <label className="text-[10px] uppercase font-bold text-gray-400">{t('projection.label')}</label>

                        {/* WOW PROJECTION TRIGGER */}
                        <button
                          onClick={() => setIsProjectionModalOpen(true)}
                          className="p-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md hover:scale-110 transition-transform"
                          title="Visualizza Proiezione Dettagliata"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                          </svg>
                        </button>

                        <select
                          value={projectionYears}
                          onChange={(e) => setProjectionYears(Number(e.target.value))}
                          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold rounded-lg px-2 py-1 focus:ring-2 focus:ring-union-blue-500 outline-none cursor-pointer"
                        >
                          <option value={1}>1 {t('projection.year_1')}</option>
                          <option value={2}>2 {t('projection.years')}</option>
                          <option value={3}>3 {t('projection.years')}</option>
                          <option value={5}>5 {t('projection.years')}</option>
                          <option value={10}>10 {t('projection.years')}</option>
                        </select>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-white font-mono">{totalUsers.toLocaleString('it-IT')}</td>
                  <td className="px-6 py-4 text-left text-lg font-black text-emerald-600 dark:text-emerald-400">{formatCurrency(totalOneTimeBonus)}</td>
                  <td className="px-6 py-4 text-left">
                    <div className="text-xl font-black text-union-orange-500 dark:text-union-orange-400">{formatCurrency(displayMonthlyRec1)}</div>
                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                      {projectionYears} {projectionYears > 1 ? 'anni' : 'anno'}: <span className="text-gray-900 dark:text-gray-100">{formatCurrency(displayMonthlyRec1 * 12 * projectionYears)}</span>
                    </div>

                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="text-xl font-black text-union-orange-500 dark:text-union-orange-400">{formatCurrency(displayMonthlyRec2)}</div>
                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                      {projectionYears} {projectionYears > 1 ? 'anni' : 'anno'}: <span className="text-gray-900 dark:text-gray-100">{formatCurrency(displayMonthlyRec2 * 12 * projectionYears)}</span>
                    </div>

                  </td>
                  <td className="px-6 py-4 text-left">
                    <div className="text-xl font-black text-union-orange-500 dark:text-union-orange-400">{formatCurrency(displayMonthlyRec3)}</div>
                    <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">
                      {projectionYears} {projectionYears > 1 ? 'anni' : 'anno'}: <span className="text-gray-900 dark:text-gray-100">{formatCurrency(displayMonthlyRec3 * 12 * projectionYears)}</span>
                    </div>

                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

        </div>

        {/* CONTROLS SECTION - REDESIGNED */}
        {/* CONTROLS CARD (Fullscreen Only) */}
        {isFullScreen && onInputChange && (
          <div className="bg-white dark:bg-white/5 rounded-[2rem] shadow-xl border border-gray-100 dark:border-white/10 p-5 shrink-0">
            <div className="flex gap-4 items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
                <div className="transform origin-center"><CustomSlider label={t('input.direct_recruits')} value={inputs.directRecruits} onChange={(v: number) => onInputChange('directRecruits', v)} min={0} max={20} icon={User} colorBase="orange" showButtons={true} /></div>
                <div className="transform origin-center"><CustomSlider label={t('input.contracts_per_user') || "Contratti/Utente"} value={inputs.contractsPerUser} onChange={(v: number) => onInputChange('contractsPerUser', v)} min={0} max={2} icon={FileText} colorBase="cyan" showButtons={true} /></div>
                <div className="transform origin-center"><CustomSlider label={t('input.indirect_recruits')} value={inputs.indirectRecruits} onChange={(v: number) => onInputChange('indirectRecruits', v)} min={0} max={10} icon={PenSquare} colorBase="blue" showButtons={true} /></div>
                <div className="transform origin-center"><CustomSlider label={t('input.depth') || "Livelli Profondità"} value={inputs.networkDepth} onChange={(v: number) => onInputChange('networkDepth', v)} min={1} max={5} icon={Heart} colorBase="green" showButtons={true} /></div>
              </div>

              {/* Bonus 3x3 Toggle - VISIBILE SOLO SE 3x3 È SODDISFATTO */}
              {inputs.directRecruits >= 3 && inputs.contractsPerUser >= 1 && inputs.indirectRecruits >= 3 && (
                <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/30 shrink-0 animate-in zoom-in duration-300">
                  <span className="text-[8px] font-black text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-2 whitespace-nowrap">In 60 giorni</span>
                  <button
                    onClick={() => onInputChange('bonus3x3Active', inputs.bonus3x3Active ? 0 : 1)}
                    className={`w-12 h-6 rounded-full transition-all relative ${inputs.bonus3x3Active ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${inputs.bonus3x3Active ? 'left-7 shadow-lg' : 'left-1'}`} />
                  </button>
                </div>
              )}

              <button
                onClick={handleReset}
                className="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 hover:scale-105 transition-all shadow-sm border border-red-100 shrink-0"
                title="Azzera tutto"
              >
                <RotateCcw className="w-6 h-6 mb-1" />
                <span className="text-[9px] font-bold uppercase tracking-wider">Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>



      {
        !isClientMode && (
          <BonusProgress
            totalContracts={totalContracts}
            onBonusChange={setManagerBonus}
          />
        )
      }

      <div className="bg-white dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] shadow-lg border border-gray-100 dark:border-white/10 overflow-hidden mt-8 p-1">
        <GrowthChart data={monthlyData} />
      </div>

      {
        !showWowFeatures ? (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-500">
            <div className="w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/20 to-transparent mb-8"></div>
            <button onClick={() => setShowWowFeatures(true)} className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full text-lg font-bold shadow-[0_0_30px_rgba(0,119,200,0.15)] dark:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-xl hover:scale-105 transition-all duration-300 animate-bounce cursor-pointer border border-gray-100">
              <span>✨</span> {t('results.wow_reveal')}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:translate-y-1 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
            </button>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide">{t('results.wow_subtitle')}</p>
          </div>
        ) : (
          <div className="animate-in slide-in-from-bottom-10 duration-700 fade-in fill-mode-forwards">
            <div className="relative py-8">
              <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-gray-200 dark:border-white/10"></div></div>
              <div className="relative flex justify-center"><span className="px-4 bg-transparent text-sm text-gray-500 font-bold uppercase tracking-[0.2em]">{t('results.vision_title')}</span></div>
            </div>

            <div className="space-y-8 p-6 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
              <div id="live-battle">
                <LiveBattleMode planResult={planResult} />
              </div>

              <div id="quick-pitch">
                <QuickPitchMode planResult={planResult} realizationMonths={inputs.realizationTimeMonths} />
              </div>

              <div id="scenario-comparator">
                <ScenarioComparator baseInputs={inputs} />
              </div>

              <div id="zero-cost">
                <ZeroCostGoal recurringIncome={totalRecurringYear1} averageEarningsPerUser={avgEarningsPerUser} monthlyCashback={monthlyCashback} />
              </div>

              <div id="dream-visualizer">
                <DreamVisualizer monthlyData={monthlyData} />
              </div>

              <div id="freedom-calculator">
                <FreedomCalculator monthlyData={monthlyData} />
              </div>

              <div id="pension-calculator">
                <PensionCalculator recurringIncome={totalRecurringYear3} />
              </div>

              <div id="asset-comparator">
                <AssetComparator recurringIncome={totalRecurringYear3} />
              </div>

              <div id="golden-no">
                <GoldenNoCard totalEarningsYear1={totalEarningsYear1} directRecruits={directRecruits} />
              </div>

              <div id="time-multiplier">
                <TimeMultiplier totalUsers={totalUsers} />
              </div>

              <div id="inaction-cost">
                <InactionCost monthlyData={monthlyData} />
              </div>
            </div>

            <AICoach planResult={planResult} inputs={inputs} />

            <QuickNavigation sections={[
              { id: 'live-battle', name: 'Battle Mode', icon: '⚔️' },
              { id: 'quick-pitch', name: 'Pitch Veloce', icon: '⚡' },
              { id: 'scenario-comparator', name: 'Confronto Scenari', icon: '🎯' },
              { id: 'dream-visualizer', name: 'Visualizzatore Sogni', icon: '💭' },
              { id: 'freedom-calculator', name: 'Calcolatore Libertà', icon: '🗽' },
              { id: 'pension-calculator', name: 'Calcolatore Pensione', icon: '👴' },
            ]} />

            <div className="text-center mt-12 mb-8 flex justify-center">
              <button onClick={() => setShowWowFeatures(false)} className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full text-lg font-bold shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
                {t('results.wow_hide')}
              </button>
            </div>
          </div>
        )
      }

      <div style={{ position: 'fixed', top: 0, left: 0, width: '1200px', height: 'auto', zIndex: -100, opacity: 0.01, pointerEvents: 'none' }}>
        <div ref={exportRef}>
          <NetworkPDFTemplate
            planResult={planResult}
            inputs={inputs}
            totalUsers={totalUsers}
            totalOneTimeBonus={totalOneTimeBonus}
            totalRecurringYear3={totalRecurringYear3}
            consultantName={consultantName}
            consultantSurname={consultantSurname}
            consultantPhone={consultantPhone}
            language={language}
          />
        </div>
      </div>

      {/* EDIT DETAILS MODAL */}
      {
        isEditModalOpen && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-white/10 animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Personalizza PDF</h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-500 dark:text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 ml-1">Nome</label>
                  <input
                    type="text"
                    value={consultantName}
                    autoFocus
                    onChange={(e) => setConsultantName(e.target.value)}
                    placeholder="Es. Mario"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 ml-1">Cognome</label>
                  <input
                    type="text"
                    value={consultantSurname}
                    onChange={(e) => setConsultantSurname(e.target.value)}
                    placeholder="Es. Rossi"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 ml-1">Telefono</label>
                  <input
                    type="tel"
                    value={consultantPhone}
                    onChange={(e) => setConsultantPhone(e.target.value)}
                    placeholder="Es. 333 1234567"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Salva e Chiudi
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default ResultsDisplay;