
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { LevelData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface IncomePieChartProps {
  levelData: LevelData[];
  totalOneTimeBonus: number;
  totalRecurringYear1: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const formatCurrency = (value: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);

    return (
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-white/30 dark:border-gray-600">
        <p className="text-sm font-bold text-gray-800 dark:text-white">{data.name}</p>
        <p className="text-base font-semibold text-union-blue-600 dark:text-union-blue-400">
          {formatCurrency(data.value)}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {data.percent}% del totale anno 1
        </p>
      </div>
    );
  }
  return null;
};

const IncomePieChart: React.FC<IncomePieChartProps> = ({ levelData, totalOneTimeBonus, totalRecurringYear1 }) => {
  const { t } = useLanguage();
  // 1. Calcola Rendita Diretta (Livello 0) x 12 mesi
  const directLevel = levelData.find(l => l.level === 0);
  const directRecurringMonthly = directLevel ? directLevel.recurringYear1 : 0;
  const directAnnual = directRecurringMonthly * 12;

  // 2. Calcola Rendita da Rete (Totale - Livello 0) x 12 mesi
  const networkRecurringMonthly = totalRecurringYear1 - directRecurringMonthly;
  const networkAnnual = networkRecurringMonthly * 12;

  // 3. Bonus Una Tantum (è già un totale)
  const bonusTotal = totalOneTimeBonus;

  const data = [
    { name: t('chart.one_time'), value: bonusTotal, color: '#f59e0b' }, // Amber/Yellow
    { name: t('chart.direct_recurring_12m'), value: directAnnual, color: '#3b9eff' }, // Union Blue
    { name: t('chart.network_recurring_12m'), value: networkAnnual, color: '#f97316' }, // Union Orange
  ].filter(item => item.value > 0); // Hide zero values

  const totalValue = data.reduce((acc, item) => acc + item.value, 0);

  // Add percentage for tooltip
  const dataWithPercent = data.map(item => ({
    ...item,
    percent: totalValue > 0 ? ((item.value / totalValue) * 100).toFixed(1) : '0'
  }));

  if (totalValue === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-6 bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl border border-white/40 dark:border-gray-700/50 shadow-lg">
        <p>Inserisci i dati per vedere la composizione.</p>
      </div>
    )
  }

  return (
    <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 dark:border-gray-700/50 p-6 h-full flex flex-col">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center gap-2">
        <span className="text-xl">🍰</span> {t('chart.composition')}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">{t('chart.est_total_year_1')}</p>

      <div className="flex-grow min-h-[250px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataWithPercent}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} className="drop-shadow-md outline-none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry: any) => <span className="text-xs font-medium text-slate-600 dark:text-slate-300 ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Label */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center pointer-events-none">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">{t('chart.total_year_1')}</p>
          <p className="text-lg font-bold text-gray-800 dark:text-white">
            {new Intl.NumberFormat('it-IT', { notation: "compact", compactDisplay: "short", currency: 'EUR', style: 'currency' }).format(totalValue)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomePieChart;
