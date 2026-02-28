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
import CustomerBenefitCard from './CustomerBenefitCard';
import GoldenNoCard from './GoldenNoCard';

import ScenarioComparator from './ScenarioComparator';
import QuickPitchMode from './QuickPitchMode';
import QuickNavigation from './QuickNavigation';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { useLanguage } from '../contexts/LanguageContext';
import { FileDown } from 'lucide-react';
import ProjectionModal from './ProjectionModal';

interface ResultsDisplayProps {
  planResult: CompensationPlanResult;
  viewMode?: ViewMode;
  inputs: PlanInput;
  cashbackPeriod?: 'monthly' | 'annual';
}

interface SummaryCardProps {
  title: string;
  value: string;
  suffix?: React.ReactNode;
  variant?: 'glass' | 'gradient-blue' | 'gradient-orange';
  icon?: React.ReactNode;
}

const UsersIcon = ({ className = "w-6 h-6" }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" /><path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" /></svg>);
const WalletIcon = ({ className = "w-6 h-6" }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path d="M4.5 3.75a3 3 0 0 0-3 3v.75h21v-.75a3 3 0 0 0-3-3h-15Z" /><path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-7.5Zm-6.375 5.25a1.125 1.125 0 1 1 0-2.25 1.125 1.125 0 0 1 0 2.25Z" clipRule="evenodd" /></svg>);
const FireIcon = ({ className = "w-6 h-6" }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.177 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" /></svg>);
const BoltIcon = ({ className = "w-6 h-6" }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" /></svg>);
const StarIcon = ({ className = "w-6 h-6" }: { className?: string }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}><path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006Z" clipRule="evenodd" /></svg>);

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, suffix, variant = 'glass', icon }) => {
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
    <div className={`p-5 rounded-3xl transition-all duration-300 ease-in-out flex flex-col items-start justify-between h-full hover:-translate-y-1 ${styles.container}`}>
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

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ planResult, viewMode = 'family', inputs, cashbackPeriod = 'monthly' }) => {
  const exportRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showWowFeatures, setShowWowFeatures] = useState(false);
  const [managerBonus, setManagerBonus] = useState(0);
  const [projectionYears, setProjectionYears] = useState(1);
  const [isProjectionModalOpen, setIsProjectionModalOpen] = useState(false);
  const { t } = useLanguage();

  const isClientMode = viewMode === 'client';
  const multiplier = 1.0; // Rimosso il dimezzamento per la modalità cliente

  const monthlyCashback = planResult.monthlyCashback;
  const rawOneTimeBonus = planResult.totalOneTimeBonus;

  const oneTimeBonusWithoutCashback = rawOneTimeBonus - monthlyCashback;
  const isAnnual = cashbackPeriod === 'annual';

  // Se è annuale, il cashback NON appare nell'una tantum (va tutto nelle card anni 1/2/3)
  // Se è mensile, appare SOLO nell'una tantum e non nelle ricorrenze
  const totalOneTimeBonus = (oneTimeBonusWithoutCashback * multiplier) + (isAnnual ? 0 : monthlyCashback);

  const totalUsers = planResult.totalUsers;
  const totalContracts = planResult.totalContracts;

  const totalRecurringYear1 = (planResult.totalRecurringYear1 * multiplier) + managerBonus;
  const totalRecurringYear2 = (planResult.totalRecurringYear2 * multiplier) + managerBonus;
  const totalRecurringYear3 = (planResult.totalRecurringYear3 * multiplier) + managerBonus;

  const monthlyData = planResult.monthlyData.map(d => {
    const ratioCashback = rawOneTimeBonus > 0 ? monthlyCashback / rawOneTimeBonus : 0;
    const cashbackPartInCumulative = d.cumulativeOneTimeBonus * ratioCashback;
    const lostCashback = cashbackPartInCumulative * (1 - multiplier);

    return {
      ...d,
      cumulativeEarnings: (d.cumulativeEarnings * multiplier) + lostCashback,
      monthlyRecurring: (d.monthlyRecurring * multiplier) + managerBonus,
      monthlyOneTimeBonus: (d.monthlyOneTimeBonus * multiplier) + (d.monthlyOneTimeBonus * ratioCashback * (1 - multiplier)),
      monthlyTotalEarnings: ((d.monthlyOneTimeBonus + d.monthlyRecurring) * multiplier) + (d.monthlyOneTimeBonus * ratioCashback * (1 - multiplier)) + managerBonus,
      cumulativeOneTimeBonus: (d.cumulativeOneTimeBonus * multiplier) + lostCashback,
      cumulativeRecurring: (d.cumulativeRecurring * multiplier) + (managerBonus * 12),
    };
  });

  // Calcoli per la visualizzazione delle card (Sempre annuali per Anno 1, 2, 3)
  const showYearlyRec1 = (totalRecurringYear1 * 12) + (isAnnual ? monthlyCashback * 12 : 0);
  const showYearlyRec2 = (totalRecurringYear2 * 12) + (isAnnual ? monthlyCashback * 12 : 0);
  const showYearlyRec3 = (totalRecurringYear3 * 12) + (isAnnual ? monthlyCashback * 12 : 0);
  const recSuffix = "/anno";
  const recTitleSuffix = isAnnual ? " (+Cashback)" : "";

  const avgEarningsPerUser = totalUsers > 0 ? totalRecurringYear1 / totalUsers : 0;
  const totalEarningsYear1 = totalOneTimeBonus + (totalRecurringYear1 * 12);
  const directRecruits = planResult.levelData.find(l => l.level === 0)?.users || 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
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

  const handleExportPDF = useCallback(() => {
    if (tableRef.current === null) return;
    setIsExporting(true);
    toPng(tableRef.current, { cacheBust: true, backgroundColor: '#ffffff' })
      .then((dataUrl) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(dataUrl);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`proiezione-guadagni-${new Date().toISOString().slice(0, 10)}.pdf`);
        setIsExporting(false);
      })
      .catch((err) => {
        console.error('PDF Export failed', err);
        setIsExporting(false);
      });
  }, [tableRef]);

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
        totalOneTime={oneTimeBonusWithoutCashback * multiplier + (isAnnual ? 0 : monthlyCashback)}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        <SummaryCard
          title={t('results.total_users')}
          value={`${totalUsers.toLocaleString('it-IT')}`}
          suffix={<span className="text-xs opacity-70 font-normal block mt-1">/ {totalContracts.toLocaleString('it-IT')} Contratti</span>}
          variant="glass"
          icon={<UsersIcon />}
        />
        <SummaryCard title={cashbackPeriod === 'annual' ? "Bonus Una Tantum" : t('results.one_time')} value={formatValueWithSuffix(totalOneTimeBonus).value} variant="gradient-blue" icon={<WalletIcon />} />
        <SummaryCard
          title={t('results.rec_y1') + recTitleSuffix}
          value={formatValueWithSuffix(showYearlyRec1 / 12).value}
          suffix={<div className="flex flex-col -mb-1"><span className="text-[10px]">/mese</span><span className="text-[8px] opacity-60">anno: {formatCurrency(showYearlyRec1)}{parkSuffix}</span></div>}
          variant="glass"
          icon={<FireIcon className="text-union-orange-500" />}
        />
        <SummaryCard
          title={t('results.rec_y2') + recTitleSuffix}
          value={formatValueWithSuffix(showYearlyRec2 / 12).value}
          suffix={<div className="flex flex-col -mb-1"><span className="text-[10px]">/mese</span><span className="text-[8px] opacity-60">anno: {formatCurrency(showYearlyRec2)}{parkSuffix}</span></div>}
          variant="glass"
          icon={<BoltIcon className="text-union-orange-500" />}
        />
        <SummaryCard
          title={t('results.rec_y3') + recTitleSuffix}
          value={formatValueWithSuffix(showYearlyRec3 / 12).value}
          suffix={<div className="flex flex-col -mb-1"><span className="text-[10px]">/mese</span><span className="text-[8px] opacity-60">anno: {formatCurrency(showYearlyRec3)}{parkSuffix}</span></div>}
          variant="gradient-orange"
          icon={<StarIcon />}
        />
      </div>

      <div className="bg-white dark:bg-black/40 backdrop-blur-xl p-4 sm:p-8 rounded-[2.5rem] shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <span className="p-2 rounded-xl bg-gradient-to-br from-union-blue-600 to-union-blue-800 text-white shadow-lg">📊</span>
            {t('results.table_title')}
          </h2>
          <button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-500/20 text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileDown size={16} />
            {isExporting ? '...' : 'PDF'}
          </button>
        </div>

        <div className="mt-4 overflow-x-auto rounded-3xl border border-gray-200 dark:border-white/10 shadow-inner bg-gray-50/50 dark:bg-black/20 p-2 max-w-full">
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(row.oneTimeBonus * multiplier)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{formatCurrency(row.recurringYear1 * multiplier * 12)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{formatCurrency(row.recurringYear2 * multiplier * 12)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-medium">{formatCurrency(row.recurringYear3 * multiplier * 12)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 dark:bg-white/5 backdrop-blur-sm border-t border-gray-200 dark:border-white/10">
              <tr>
                <td className="px-6 py-4 text-left text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  <div className="flex flex-col gap-2">
                    <span>{t('results.total')}</span>
                    <div className="flex items-center gap-2">
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
                  <div className="text-xl font-black text-union-orange-500 dark:text-union-orange-400">{formatCurrency(showYearlyRec1 / 12 * projectionYears)}</div>
                  <div className="text-[10px] font-bold text-gray-400 mt-1">
                    {projectionYears} {projectionYears > 1 ? 'anni' : 'anno'}: <span className="text-gray-500 dark:text-gray-400">{formatCurrency(showYearlyRec1 * projectionYears)}{parkSuffix}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-left">
                  <div className="text-xl font-black text-union-orange-500 dark:text-union-orange-400">{formatCurrency(showYearlyRec2 / 12 * projectionYears)}</div>
                  <div className="text-[10px] font-bold text-gray-400 mt-1">
                    {projectionYears} {projectionYears > 1 ? 'anni' : 'anno'}: <span className="text-gray-500 dark:text-gray-400">{formatCurrency(showYearlyRec2 * projectionYears)}{parkSuffix}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-left">
                  <div className="text-xl font-black text-union-orange-500 dark:text-union-orange-400">{formatCurrency(showYearlyRec3 / 12 * projectionYears)}</div>
                  <div className="text-[10px] font-bold text-gray-400 mt-1">
                    {projectionYears} {projectionYears > 1 ? 'anni' : 'anno'}: <span className="text-gray-500 dark:text-gray-400">{formatCurrency(showYearlyRec3 * projectionYears)}{parkSuffix}</span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {!isClientMode && (
        <BonusProgress
          totalContracts={totalContracts}
          onBonusChange={setManagerBonus}
        />
      )}

      <div className="bg-white dark:bg-black/40 backdrop-blur-xl rounded-[2.5rem] shadow-lg border border-gray-100 dark:border-white/10 overflow-hidden mt-8 p-1">
        <GrowthChart data={monthlyData} />
      </div>

      {!showWowFeatures ? (
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
            <div id="quick-pitch">
              <QuickPitchMode planResult={planResult} realizationMonths={inputs.realizationTimeMonths} />
            </div>

            <div id="scenario-comparator">
              <ScenarioComparator baseInputs={inputs} />
            </div>

            <div id="zero-cost">
              <ZeroCostGoal recurringIncome={totalRecurringYear1} averageEarningsPerUser={avgEarningsPerUser} monthlyCashback={monthlyCashback} />
            </div>

            <div id="customer-benefit">
              <CustomerBenefitCard totalRecurringYear1={totalRecurringYear1 / multiplier} monthlyCashback={monthlyCashback} />
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

          <QuickNavigation sections={[
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
      )}

      <div style={{ position: 'absolute', top: 0, left: '-9999px' }}>
        <div ref={exportRef} className="w-[600px] h-[900px] bg-slate-900 text-white p-10 flex flex-col justify-between font-sans overflow-hidden relative" style={{ backgroundColor: '#0f172a' }}>
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white">Union <span className="text-union-orange-500">Energia</span></h1>
                <p className="text-lg opacity-70 font-medium mt-1">Proiezione Guadagni {isClientMode ? '(Cliente)' : ''}</p>
              </div>
            </div>
            <div className="space-y-6 flex-grow">
              <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-xl">
                <p className="text-6xl font-bold text-white">{totalUsers.toLocaleString('it-IT')}</p>
                <p className="text-sm opacity-60 mt-2 font-medium">Utenti collaboratori attivi</p>
              </div>
              <div className="bg-gradient-to-br from-union-blue-600/90 to-union-blue-500/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
                <p className="text-5xl font-bold text-white">{formatValueWithSuffix(totalOneTimeBonus).value}</p>
                <p className="text-sm text-white/70 mt-2 font-medium">Guadagno immediato stimato</p>
              </div>
              <div className="bg-gradient-to-br from-union-orange-600/90 to-union-orange-500/80 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl relative overflow-hidden">
                <p className="text-5xl font-bold text-white">{formatValueWithSuffix(totalRecurringYear3).value}</p>
                <p className="text-sm text-white/70 mt-2 font-medium">Guadagno ricorrente mensile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;