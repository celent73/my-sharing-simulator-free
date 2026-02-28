import React, { useRef, useCallback, useState } from 'react';
import { CompensationPlanResult, ViewMode, PlanInput } from '../types';
import GrowthChart from './GrowthChart';
import BonusProgress from './BonusProgress';
import DreamVisualizer from './DreamVisualizer';
import FreedomCalculator from './FreedomCalculator';

import AssetComparator from './AssetComparator';
import TimeMultiplier from './TimeMultiplier';
import { motion, AnimatePresence } from 'framer-motion';

import GoldenNoCard from './GoldenNoCard';

import ScenarioComparator from './ScenarioComparator';
import QuickPitchMode from './QuickPitchMode';
import QuickNavigation from './QuickNavigation';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../contexts/LanguageContext';
import { FileDown, Edit3, X, Save, Loader2, Download, User, FileText, Heart, PenSquare, RotateCcw, ArrowRight } from 'lucide-react';
import { NetworkPDFTemplate } from './NetworkPDFTemplate';
import ProjectionModal from './ProjectionModal';
import AICoach from './AICoach';
import SharyTrigger from './SharyTrigger';
import { CustomSlider } from './CustomSlider';

interface ResultsDisplayProps {
  planResult: CompensationPlanResult;
  viewMode?: ViewMode;
  inputs: PlanInput;
  cashbackPeriod?: 'monthly' | 'annual';
  onInputChange?: (field: keyof PlanInput, value: number) => void;
  isFullScreen?: boolean;
  onToggleFullScreen?: () => void;
}

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
    container: 'bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border-2 border-slate-200/50 dark:border-white/10 shadow-sm hover:shadow-md hover:border-slate-300/80 dark:hover:border-white/20',
    title: 'text-gray-500 dark:text-slate-500 uppercase tracking-widest text-[10px] font-extrabold',
    value: 'text-gray-900 dark:text-white',
    iconBg: 'bg-slate-100 dark:bg-slate-800',
    iconColor: 'text-gray-600 dark:text-slate-400'
  };

  switch (variant) {
    case 'gradient-blue':
      styles = {
        ...styles,
        container: 'bg-blue-50/80 dark:bg-blue-900/40 backdrop-blur-2xl border-2 border-blue-300/60 dark:border-blue-500/30 shadow-md hover:shadow-lg hover:border-blue-400/80 dark:hover:border-blue-400/50',
        title: 'text-blue-700/80 dark:text-blue-300/80',
        value: 'text-blue-800 dark:text-blue-100',
        iconBg: 'bg-blue-100 dark:bg-blue-900/60',
        iconColor: 'text-blue-700 dark:text-blue-300'
      };
      break;
    case 'gradient-orange':
      styles = {
        ...styles,
        container: 'bg-orange-50/80 dark:bg-orange-900/40 backdrop-blur-2xl border-2 border-orange-300/60 dark:border-orange-500/30 shadow-md hover:shadow-lg hover:border-orange-400/80 dark:hover:border-orange-400/50',
        title: 'text-orange-700/80 dark:text-orange-300/80',
        value: 'text-orange-800 dark:text-orange-100',
        iconBg: 'bg-orange-100 dark:bg-orange-900/60',
        iconColor: 'text-orange-700 dark:text-orange-300'
      };
      break;
    case 'glass':
    default:
      break;
  }

  return (
    <div className={`p-4 sm:p-6 rounded-[2.5rem] transition-all duration-300 ease-in-out flex flex-col items-start justify-between h-full hover:-translate-y-1 relative overflow-hidden ${styles.container}`}>
      {showBadge && (
        <div className="absolute top-4 right-4 z-20">
          <div className="bg-amber-400 text-white p-2 rounded-full shadow-lg animate-pulse">
            <StarIcon className="w-4 h-4" />
          </div>
        </div>
      )}
      <div className="flex items-center gap-3 mb-2 sm:mb-4">
        {icon && (
          <div className={`p-2 rounded-2xl ${styles.iconBg} ${styles.iconColor} shadow-sm`}>
            {icon}
          </div>
        )}
        <h4 className={`${styles.title} text-[12px] md:text-[10px]`}>{title}</h4>
      </div>
      <div className="mt-auto w-full">
        <div className="flex flex-col gap-2">
          {/* Row 1: Value + Suffix inline */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <div className={`text-3xl sm:text-3xl lg:text-4xl font-black tracking-tighter ${styles.value} leading-none transition-all relative inline-block min-w-[120px]`}>
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={value}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="inline-block"
                >
                  {value}
                </motion.div>
              </AnimatePresence>
            </div>
            {suffix && <div className="transition-all">{suffix}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ planResult, viewMode = 'family', inputs, cashbackPeriod = 'monthly', onInputChange, isFullScreen = false, onToggleFullScreen }) => {
  const exportRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showWowFeatures, setShowWowFeatures] = useState(false);
  const [wowMode, setWowMode] = useState<'list' | 'menu' | 'single'>('list');
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [managerBonus, setManagerBonus] = useState(0);
  const [projectionYears, setProjectionYears] = useState(1);
  const [isProjectionModalOpen, setIsProjectionModalOpen] = useState(false);

  const [consultantName, setConsultantName] = useState('');
  const [consultantSurname, setConsultantSurname] = useState('');
  const [consultantPhone, setConsultantPhone] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showWowMenu, setShowWowMenu] = useState(false);

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
  const totalOneTimeBonus = oneTimeBonusWithoutCashback + (isAnnual ? 0 : monthlyCashback);

  const totalUsers = planResult.totalUsers;
  const totalContracts = planResult.totalContracts;

  const totalRecurringYear1 = planResult.totalRecurringYear1 + managerBonus;
  const totalRecurringYear2 = planResult.totalRecurringYear2 + managerBonus;
  const totalRecurringYear3 = planResult.totalRecurringYear3 + managerBonus;

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

  // LOGICA FAMILY PRO
  const personalDirectContractsCount = (inputs.personalClientsGreen || 0) +
    (inputs.personalClientsLight || 0) +
    (inputs.personalClientsBusinessGreen || 0) +
    (inputs.personalClientsBusinessLight || 0) +
    (inputs.myPersonalUnitsGreen || 0) +
    (inputs.myPersonalUnitsLight || 0);

  const networkDirectContractsCount = (inputs.directRecruits || 0) * (inputs.contractsPerUser || 0);
  const totalFamilyProContracts = personalDirectContractsCount + networkDirectContractsCount;

  const isSprinter = inputs.directRecruits >= 3 && inputs.indirectRecruits >= 3;
  const isBuilder = totalFamilyProContracts >= 10;
  const isFamilyPro = isSprinter || isBuilder;

  const handleExportPDF = useCallback(async () => {
    if (exportRef.current === null) return;
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const dataUrl = await toPng(exportRef.current, { cacheBust: true, pixelRatio: 2 });
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

  const formatValueWithSuffix = (value: number) => {
    const formatted = new Intl.NumberFormat('it-IT', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
    return {
      value: `${formatted} €`,
    };
  };

  return (
    <div id="results-summary" className="space-y-10 relative">
      {!isFullScreen && (
        <>
          <ProjectionModal
            isOpen={isProjectionModalOpen}
            onClose={() => setIsProjectionModalOpen(false)}
            years={projectionYears}
            onYearChange={setProjectionYears}
            monthlyRecurring={totalRecurringYear3 + (isAnnual ? monthlyCashback : 0)}
            totalOneTime={oneTimeBonusWithoutCashback + (isAnnual ? 0 : monthlyCashback)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            <SummaryCard
              title={cashbackPeriod === 'annual' ? "Bonus Una Tantum" : t('results.one_time')}
              value={formatValueWithSuffix(totalOneTimeBonus).value}
              variant="gradient-blue"
              icon={<WalletIcon className="w-6 h-6" />}
              showBadge={inputs.bonus3x3Active}
            />
            <SummaryCard
              title={t('results.rec_y1') + recTitleSuffix}
              value={formatValueWithSuffix(displayMonthlyRec1).value}
              suffix={
                <>
                  <span className="text-[12px] sm:text-[11px] font-black text-slate-400 tracking-tighter uppercase whitespace-nowrap">/ {t('common.month') || 'Mese'}</span>
                  <div className="w-full mt-2">
                    <div className="inline-block text-[13px] sm:text-[12px] font-black bg-white/60 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-white/10 text-slate-900 dark:text-white whitespace-nowrap shadow-sm">
                      {t('common.year')?.toUpperCase() || 'ANNO'}: {formatCurrency(displayMonthlyRec1 * 12).replace(",00", "")}{parkSuffix}
                    </div>
                  </div>
                </>
              }
              variant="glass"
              icon={<FireIcon className="text-orange-500 w-6 h-6" />}
            />
            <SummaryCard
              title={t('results.rec_y2') + recTitleSuffix}
              value={formatValueWithSuffix(displayMonthlyRec2).value}
              suffix={
                <>
                  <span className="text-[12px] sm:text-[11px] font-black text-slate-400 tracking-tighter uppercase whitespace-nowrap">/ {t('common.month') || 'Mese'}</span>
                  <div className="w-full mt-2">
                    <div className="inline-block text-[13px] sm:text-[12px] font-black bg-white/60 dark:bg-black/20 px-3 py-1.5 rounded-lg border border-slate-200/50 dark:border-white/10 text-slate-900 dark:text-white whitespace-nowrap shadow-sm">
                      {t('common.year')?.toUpperCase() || 'ANNO'}: {formatCurrency(displayMonthlyRec2 * 12).replace(",00", "")}{parkSuffix}
                    </div>
                  </div>
                </>
              }
              variant="glass"
              icon={<BoltIcon className="text-orange-500 w-6 h-6" />}
            />
            <SummaryCard
              title={t('results.rec_y3') + recTitleSuffix}
              value={formatValueWithSuffix(displayMonthlyRec3).value}
              suffix={
                <>
                  <span className="text-[12px] sm:text-[11px] font-black text-orange-950/60 tracking-tighter uppercase whitespace-nowrap">/ {t('common.month') || 'Mese'}</span>
                  <div className="w-full mt-2">
                    <div className="inline-block text-[13px] sm:text-[12px] font-black bg-white/80 dark:bg-orange-900/20 px-3 py-1.5 rounded-lg border border-white/50 dark:border-orange-500/20 text-slate-900 dark:text-orange-200 whitespace-nowrap shadow-sm backdrop-blur-sm">
                      {t('common.year')?.toUpperCase() || 'ANNO'}: {formatCurrency(displayMonthlyRec3 * 12).replace(",00", "")}{parkSuffix}
                    </div>
                  </div>
                </>
              }
              variant="gradient-orange"
              icon={<StarIcon className="text-orange-600 dark:text-orange-400 w-6 h-6" />}
            />
            <SummaryCard
              title={t('results.total_users')}
              value={totalUsers.toLocaleString('it-IT')}
              suffix={
                <div className="flex flex-col items-start gap-1">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                    / {totalContracts.toLocaleString('it-IT')} {t('common.contracts') || 'Contratti'}
                  </span>
                  {(() => {
                    const milestones = [600, 1500, 5000];
                    const nextMilestone = milestones.find(m => m > totalContracts);
                    const remainingToNext = nextMilestone ? nextMilestone - totalContracts : 0;
                    if (remainingToNext <= 0) return null;
                    return (
                      <div className="text-[10px] font-black bg-red-50 dark:bg-red-900/20 px-2.5 py-1 rounded-lg border border-red-100 dark:border-red-800 text-red-500 whitespace-nowrap shadow-sm uppercase tracking-tighter">
                        -{remainingToNext} {t('common.to_goal') || 'AL GOAL'}
                      </div>
                    );
                  })()}
                </div>
              }
              variant="glass"
              icon={<UsersIcon className="text-slate-500 w-6 h-6" />}
            />
          </div>
        </>
      )}

      <div className={`
        ${isFullScreen
          ? 'fixed inset-0 z-[10000] p-0 flex flex-col overflow-hidden bg-[#F2F2F7] dark:bg-black'
          : 'relative transition-all duration-500 ease-in-out'
        }
      `}>
        <div className={`
          bg-white dark:bg-slate-900 shadow-xl border-x-0 border-t-0 border-b-2 border-slate-100 dark:border-white/10
          ${isFullScreen
            ? 'flex-1 rounded-none overflow-hidden flex flex-col p-6 sm:p-8'
            : 'p-8 rounded-[3rem] border-2 border-slate-100 dark:border-white/10'
          }
        `}>
          <div className="flex justify-between items-center mb-8 shrink-0">
            <h2 className={`font-black text-gray-900 dark:text-white flex items-center gap-4 ${isFullScreen ? 'text-4xl' : 'text-2xl'} tracking-tight`}>
              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-sm">📊</div>
              {t('results.table_title')}
              {isFullScreen && (
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-orange-600 dark:text-orange-400 text-[10px] bg-orange-50 dark:bg-orange-900/30 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-orange-200 dark:border-orange-500/30">Network Focus</span>
                  {isClientMode ? (
                    <span className="text-emerald-600 dark:text-emerald-400 text-[10px] bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      Cliente
                    </span>
                  ) : (
                    <span className="text-blue-600 dark:text-blue-400 text-[10px] bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-blue-200 dark:border-blue-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      Family Utility
                    </span>
                  )}
                </div>
              )}
            </h2>
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleFullScreen}
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                {isFullScreen ? t('results.exit_fullscreen') : t('results.enter_fullscreen')}
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl shadow-lg shadow-red-200 text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <FileDown size={18} />
                PDF
              </button>
            </div>
          </div>

          <div className={`rounded-[2.5rem] border-2 border-slate-100 dark:border-white/5 bg-[#F2F2F7] dark:bg-slate-950 p-2 ${isFullScreen ? 'flex-1 overflow-auto' : 'overflow-x-auto'}`}>
            <table ref={tableRef} className="min-w-full divide-y divide-slate-100 dark:divide-white/5 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl rounded-[2rem] overflow-hidden">
              <thead>
                <tr className="bg-white/40 dark:bg-slate-800/40">
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5">{t('results.col_level')}</th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5">{t('results.col_users')}</th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5 text-center">{t('results.col_token')}</th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5">{t('results.col_rec_1')}</th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5">{t('results.col_rec_2')}</th>
                  <th className="px-6 py-5 text-left text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5">{t('results.col_rec_3')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                {planResult.levelData.map((row) => (
                  <tr key={row.level} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        {getLevelLabel(row.level)}
                        {row.level === 0 && isFamilyPro && !isClientMode && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-black bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 uppercase tracking-tighter border border-amber-300 shadow-sm">
                            FAMILY PRO 👑
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300 font-mono font-bold">{row.users.toLocaleString('it-IT')}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-slate-900 dark:text-white text-center">{formatCurrency(row.oneTimeBonus)}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(row.recurringYear1)}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">{t('common.year') || 'Anno'}: {formatCurrency(row.recurringYear1 * 12).replace(",00", "")}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(row.recurringYear2)}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">{t('common.year') || 'Anno'}: {formatCurrency(row.recurringYear2 * 12).replace(",00", "")}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-black text-slate-900 dark:text-white">{formatCurrency(row.recurringYear3)}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-tighter">{t('common.year') || 'Anno'}: {formatCurrency(row.recurringYear3 * 12).replace(",00", "")}</div>
                    </td>
                  </tr>
                ))}

                {/* RIGA DEDICATA AL PARK / BENEFICI PERSONALI */}
                {(planResult.monthlyPanelYield > 0 || (isAnnual && hasCashback)) && (
                  <tr className="bg-amber-50/30 hover:bg-amber-50/50 transition-colors italic">
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-amber-600">{t('results.cashback_park')}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-xs text-slate-400 font-mono">-</td>
                    <td className="px-6 py-5 whitespace-nowrap text-xs text-slate-400 text-center">-</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-black text-amber-600">{formatCurrency(planResult.monthlyPanelYield + (isAnnual ? monthlyCashback : 0))}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{t('common.year') || 'Anno'}: {formatCurrency((planResult.monthlyPanelYield + (isAnnual ? monthlyCashback : 0)) * 12).replace(",00", "")}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-black text-amber-600">{formatCurrency(planResult.monthlyPanelYield + (isAnnual ? monthlyCashback : 0))}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{t('common.year') || 'Anno'}: {formatCurrency((planResult.monthlyPanelYield + (isAnnual ? monthlyCashback : 0)) * 12).replace(",00", "")}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-black text-amber-600">{formatCurrency(planResult.monthlyPanelYield + (isAnnual ? monthlyCashback : 0))}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{t('common.year') || 'Anno'}: {formatCurrency((planResult.monthlyPanelYield + (isAnnual ? monthlyCashback : 0)) * 12).replace(",00", "")}</div>
                    </td>
                  </tr>
                )}

                {/* BONUS 3x3 ROW */}
                {inputs.bonus3x3Active && (
                  <tr className="bg-yellow-50/30 hover:bg-yellow-50/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap text-xs font-black text-orange-600 flex items-center gap-2 uppercase tracking-tighter italic">
                      <div className="bg-orange-100 p-1 rounded-lg"><StarIcon className="w-3 h-3" /></div>
                      Bonus 3x3 (In 60gg)
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-xs text-slate-400 font-mono">-</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-black text-orange-600 text-center">{formatCurrency(150)}</td>
                    <td className="px-6 py-5 text-xs text-slate-300">-</td>
                    <td className="px-6 py-5 text-xs text-slate-300">-</td>
                    <td className="px-6 py-5 text-xs text-slate-300">-</td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-white dark:bg-slate-900 border-t-2 border-slate-100 dark:border-white/10">
                <tr className="font-black">
                  <td className="px-6 py-8 text-sm uppercase tracking-widest text-slate-900 dark:text-white">
                    <div className="flex flex-col gap-4">
                      <span>{t('results.total')}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditModalOpen(true)}
                          className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-2 rounded-xl transition-all flex items-center gap-2"
                        >
                          <Edit3 size={14} />
                          <span className="text-[9px] font-black uppercase tracking-tighter">{t('common.personalize') || 'Personalizza'}</span>
                        </button>
                        <button
                          onClick={handleExportPDF}
                          disabled={isExporting}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-200 dark:shadow-blue-900/40"
                        >
                          <Download size={14} />
                          <span className="text-[9px] font-black uppercase tracking-tighter">PDF</span>
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-tighter">{t('common.projection') || 'Proiezione'}:</label>
                        <select
                          value={projectionYears}
                          onChange={(e) => setProjectionYears(Number(e.target.value))}
                          className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-[10px] font-black rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer text-slate-900 dark:text-white"
                        >
                          <option value={1}>1 {t('common.year') || 'Anno'}</option>
                          <option value={2}>2 Anni</option>
                          <option value={3}>3 Anni</option>
                          <option value={5}>5 Anni</option>
                        </select>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-sm text-slate-900 dark:text-white font-mono align-top">{totalUsers.toLocaleString('it-IT')}</td>
                  <td className="px-6 py-8 text-2xl text-emerald-600 dark:text-emerald-400 font-black text-center align-top">{formatCurrency(totalOneTimeBonus)}</td>
                  <td className="px-6 py-8 align-top">
                    <div className="text-2xl text-orange-600 dark:text-orange-400 drop-shadow-sm">{formatCurrency(displayMonthlyRec1)}</div>
                    <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-tighter">
                      {projectionYears} {projectionYears > 1 ? (t('common.years') || 'Anni') : (t('common.year') || 'Anno')}: <span className="text-slate-900 dark:text-white">{formatCurrency(displayMonthlyRec1 * 12 * projectionYears)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8 align-top">
                    <div className="text-2xl text-orange-600 dark:text-orange-400 drop-shadow-sm">{formatCurrency(displayMonthlyRec2)}</div>
                    <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-tighter">
                      {projectionYears} {projectionYears > 1 ? (t('common.years') || 'Anni') : (t('common.year') || 'Anno')}: <span className="text-slate-900 dark:text-white">{formatCurrency(displayMonthlyRec2 * 12 * projectionYears)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-8 align-top">
                    <div className="text-2xl text-orange-600 dark:text-orange-400 drop-shadow-sm">{formatCurrency(displayMonthlyRec3)}</div>
                    <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 mt-2 uppercase tracking-tighter">
                      {projectionYears} {projectionYears > 1 ? (t('common.years') || 'Anni') : (t('common.year') || 'Anno')}: <span className="text-slate-900 dark:text-white">{formatCurrency(displayMonthlyRec3 * 12 * projectionYears)}</span>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* CONTROLS SECTION - REDESIGNED for Focus Mode */}
        {isFullScreen && onInputChange && (
          <div className="bg-white dark:bg-slate-900 shadow-xl border-t-2 border-slate-100 dark:border-white/10 p-4 sm:p-5 shrink-0">
            <div className="flex gap-4 items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                <div className="transform origin-center"><CustomSlider label={t('input.direct_recruits')} value={inputs.directRecruits} onChange={(v: number) => onInputChange('directRecruits', v)} min={0} max={20} icon={User} colorBase="orange" showButtons={true} /></div>
                <div className="transform origin-center"><CustomSlider label={t('input.contracts_per_user') || "Contratti/Utente"} value={inputs.contractsPerUser} onChange={(v: number) => onInputChange('contractsPerUser', v)} min={0} max={2} icon={FileText} colorBase="cyan" showButtons={true} /></div>
                <div className="transform origin-center"><CustomSlider label={t('input.indirect_recruits')} value={inputs.indirectRecruits} onChange={(v: number) => onInputChange('indirectRecruits', v)} min={0} max={10} icon={PenSquare} colorBase="blue" showButtons={true} /></div>
                <div className="transform origin-center"><CustomSlider label={t('input.depth') || "Livelli Profondità"} value={inputs.networkDepth} onChange={(v: number) => onInputChange('networkDepth', v)} min={1} max={5} icon={Heart} colorBase="green" showButtons={true} /></div>
              </div>

              {/* Bonus 3x3 Toggle */}
              {inputs.directRecruits >= 3 && inputs.contractsPerUser >= 1 && inputs.indirectRecruits >= 3 && (
                <div className="flex flex-col items-center justify-center p-4 rounded-3xl bg-orange-50 dark:bg-orange-900/30 border-2 border-orange-100 dark:border-orange-500/30 shrink-0 animate-in zoom-in duration-300">
                  <span className="text-[9px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-2 whitespace-nowrap italic">In 60 giorni</span>
                  <button
                    onClick={() => onInputChange('bonus3x3Active', inputs.bonus3x3Active ? 0 : 1)}
                    className={`w-14 h-7 rounded-full transition-all relative ${inputs.bonus3x3Active ? 'bg-orange-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                  >
                    <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${inputs.bonus3x3Active ? 'left-8 shadow-md' : 'left-1'}`} />
                  </button>
                </div>
              )}

              <button
                onClick={handleReset}
                className="flex flex-col items-center justify-center w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-all border-2 border-red-50 dark:border-red-500/30 shrink-0 shadow-sm"
                title="Azzera tutto"
              >
                <RotateCcw className="w-7 h-7 mb-1" />
                <span className="text-[10px] font-black uppercase tracking-widest">Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {!isClientMode && (
        <BonusProgress
          totalContracts={totalContracts}
          onBonusChange={setManagerBonus}
        />
      )}

      <div className="bg-white dark:bg-slate-900 shadow-xl border-2 border-slate-100 dark:border-white/10 overflow-hidden mt-8 p-8 rounded-[3rem]">
        <GrowthChart data={monthlyData} />
      </div>

      {!showWowFeatures ? (
        <div className="py-16 flex flex-col items-center justify-center text-center space-y-8">
          {/* Dual Trigger - iOS Style */}
          <div className="p-2 bg-black/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">

            {/* Option 1: Reveal All */}
            <button
              onClick={() => setShowWowFeatures(true)}
              className="group relative px-8 py-5 rounded-[2rem] bg-white text-black overflow-hidden transition-all hover:scale-[1.02] active:scale-95 flex-1 flex items-center justify-center gap-3 shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/5 to-transparent translate-x-[-100%] group-hover:animate-shine" />
              <span className="text-2xl animate-pulse">✨</span>
              <div className="text-left">
                <span className="block text-xs font-black uppercase tracking-widest opacity-60">Esperienza Completa</span>
                <span className="block text-lg font-black tracking-tight">Sblocca Tutto</span>
              </div>
            </button>

            {/* Option 2: Choose Card */}
            <button
              onClick={() => setShowWowMenu(!showWowMenu)}
              className="group px-8 py-5 rounded-[2rem] bg-white/10 text-white hover:bg-white/20 backdrop-blur-md border border-white/5 transition-all hover:scale-[1.02] active:scale-95 flex-1 flex items-center justify-center gap-3"
            >
              <span className="text-2xl">📱</span>
              <div className="text-left">
                <span className="block text-xs font-black uppercase tracking-widest opacity-60">Navigazione Rapida</span>
                <span className="block text-lg font-black tracking-tight">{showWowMenu ? 'Chiudi Menù' : 'Scegli Card'}</span>
              </div>
            </button>
          </div>

          {/* Quick Menu Grid */}
          {showWowMenu && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto animate-in slide-in-from-top-4 fade-in duration-300">
              {[
                { id: 'quick-pitch', icon: '⚡', label: 'Pitch Veloce', color: 'bg-blue-500' },
                { id: 'scenario-comparator', icon: '🎯', label: 'Scenari', color: 'bg-purple-500' },
                { id: 'dream-visualizer', icon: '💭', label: 'Sogni', color: 'bg-pink-500' },
                { id: 'freedom-calculator', icon: '🗽', label: 'Libertà', color: 'bg-orange-500' },
                { id: 'asset-comparator', icon: '🏦', label: 'Asset', color: 'bg-emerald-500' },
                { id: 'time-multiplier', icon: '⏳', label: 'Tempo', color: 'bg-indigo-500' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setShowWowFeatures(true);
                    setShowWowMenu(false);
                    // Allow time for render
                    setTimeout(() => {
                      const el = document.getElementById(item.id);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                  }}
                  className="p-4 rounded-3xl bg-black/20 backdrop-blur-xl border border-white/10 hover:bg-white/10 transition-all flex flex-col items-center gap-2 group"
                >
                  <div className={`w-10 h-10 rounded-full ${item.color}/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-white uppercase tracking-wide">{item.label}</span>
                </button>
              ))}
            </div>
          )}

        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-10 duration-700 space-y-12 p-8 rounded-[3rem] bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Ambient Background for Wow Section */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />

          {/* Wrapper for cards with close button */}
          {(() => {
            const WowCardWrapper = ({ children, id }: { children: React.ReactNode, id: string }) => (
              <div id={id} className="relative z-10 group/card">
                <button
                  onClick={() => {
                    setShowWowFeatures(false);
                    setShowWowMenu(false);
                    window.scrollTo({ top: document.getElementById('results-summary')?.offsetTop || 0, behavior: 'smooth' });
                  }}
                  className="absolute -top-4 -right-4 z-50 p-3 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-xl transition-all hover:scale-110 active:scale-95 md:opacity-0 md:group-hover/card:opacity-100"
                  title="Chiudi e torna al menù"
                >
                  <X size={20} />
                </button>
                {children}
              </div>
            );

            return (
              <>
                <WowCardWrapper id="quick-pitch"><QuickPitchMode planResult={planResult} realizationMonths={inputs.realizationTimeMonths} /></WowCardWrapper>
                <WowCardWrapper id="scenario-comparator"><ScenarioComparator baseInputs={inputs} /></WowCardWrapper>
                <WowCardWrapper id="dream-visualizer"><DreamVisualizer monthlyData={monthlyData} /></WowCardWrapper>
                <WowCardWrapper id="freedom-calculator"><FreedomCalculator monthlyData={monthlyData} /></WowCardWrapper>
                <WowCardWrapper id="asset-comparator"><AssetComparator recurringIncome={totalRecurringYear3} /></WowCardWrapper>
                <WowCardWrapper id="golden-no"><GoldenNoCard totalEarningsYear1={totalEarningsYear1} directRecruits={directRecruits} /></WowCardWrapper>
                <WowCardWrapper id="time-multiplier"><TimeMultiplier totalUsers={totalUsers} /></WowCardWrapper>
                <div className="relative z-10"><AICoach planResult={planResult} inputs={inputs} /></div>

              </>
            );
          })()}

          <button
            onClick={() => setShowWowFeatures(false)}
            className="mx-auto block px-10 py-4 bg-white/5 hover:bg-white/10 text-white rounded-full font-bold uppercase tracking-widest backdrop-blur-md border border-white/10 transition-all hover:scale-105 active:scale-95 shadow-lg relative z-10"
          >
            {t('results.wow_hide')}
          </button>
        </div>
      )}

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
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/40 dark:bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border-2 border-slate-50 dark:border-white/10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{t('common.personalize') || 'Personalizza'} PDF</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">Nome</label>
                <input
                  type="text"
                  value={consultantName}
                  onChange={(e) => setConsultantName(e.target.value)}
                  placeholder="Es. Mario"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-white/5 focus:outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">Cognome</label>
                <input
                  type="text"
                  value={consultantSurname}
                  onChange={(e) => setConsultantSurname(e.target.value)}
                  placeholder="Es. Rossi"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-white/5 focus:outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2 ml-1">Telefono</label>
                <input
                  type="tel"
                  value={consultantPhone}
                  onChange={(e) => setConsultantPhone(e.target.value)}
                  placeholder="Es. 333 1234567"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-white/5 focus:outline-none focus:border-blue-500 transition-colors text-slate-900 dark:text-white font-bold"
                />
              </div>
            </div>

            <div className="mt-10">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-200 dark:shadow-blue-900/40"
              >
                <Save size={20} />
                SALVA E CHIUDI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDisplay;