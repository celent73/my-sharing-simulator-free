
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MonthlyGrowthData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface GrowthChartProps {
    data: MonthlyGrowthData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    const { t } = useLanguage();
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const formatCurrency = (value: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

        return (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/30 dark:border-gray-600">
                <p className="label font-bold text-gray-800 dark:text-white mb-2">{`${t('chart.month')} ${label}`}</p>
                <div className="space-y-1">
                    <p className="text-xs font-medium text-union-blue-500 uppercase tracking-wide">{t('chart.one_time')}</p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(data.monthlyOneTimeBonus)}</p>

                    <p className="text-xs font-medium text-union-orange-500 uppercase tracking-wide mt-2">{t('chart.recurring')}</p>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formatCurrency(data.monthlyRecurring)}</p>

                    <div className="h-px bg-gray-200 dark:bg-gray-600 my-2"></div>

                    <p className="text-sm font-bold text-gray-900 dark:text-white flex justify-between">
                        <span>{t('chart.total')}:</span>
                        <span>{formatCurrency(data.monthlyTotalEarnings)}</span>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
                        {t('chart.cumulative')}: {formatCurrency(data.cumulativeEarnings)}
                    </p>
                </div>
            </div>
        );
    }

    return null;
};

const GrowthChart: React.FC<GrowthChartProps> = ({ data }) => {
    const { t } = useLanguage();
    const [viewType, setViewType] = React.useState<'monthly' | 'cumulative'>('monthly');

    if (!data || data.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <p>Imposta i parametri per visualizzare il grafico di crescita.</p>
            </div>
        )
    }

    const isMonthly = viewType === 'monthly';
    const dataKeyOneTime = isMonthly ? 'monthlyOneTimeBonus' : 'cumulativeOneTimeBonus';
    const dataKeyRecurring = isMonthly ? 'monthlyRecurring' : 'cumulativeRecurring';

    return (
        <div className="p-4 sm:p-6 relative">
            <style>{`
                .recharts-cartesian-axis-line {
                    stroke: #000000 !important;
                    stroke-width: 2px !important;
                }
                .dark .recharts-cartesian-axis-line {
                    stroke: #ffffff !important;
                }
            `}</style>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 ml-2 flex items-center gap-2">
                    <span className="text-xl">📈</span> {t('chart.evolution')}
                </h3>

                <div className="bg-gray-100 dark:bg-gray-700/50 p-1 rounded-xl flex text-xs font-bold">
                    <button
                        onClick={() => setViewType('monthly')}
                        className={`px-4 py-2 rounded-lg transition-all ${viewType === 'monthly' ? 'bg-white dark:bg-gray-600 shadow text-union-blue-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                    >
                        Mensile (Cash Flow)
                    </button>
                    <button
                        onClick={() => setViewType('cumulative')}
                        className={`px-4 py-2 rounded-lg transition-all ${viewType === 'cumulative' ? 'bg-white dark:bg-gray-600 shadow text-union-blue-600 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
                    >
                        Cumulativo (Patrimonio)
                    </button>
                </div>
            </div>

            <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorUnaTantum" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b9eff" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#3b9eff" stopOpacity={0.05} />
                            </linearGradient>
                            <linearGradient id="colorRicorrente" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#fb923c" stopOpacity={0.05} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} className="stroke-gray-500 dark:stroke-gray-400" />
                        <XAxis
                            dataKey="month"
                            axisLine={true}
                            tickLine={false}
                            tick={{ fill: 'currentColor', fontSize: 12 }}
                            className="text-gray-500 dark:text-gray-400"
                            dy={10}
                        />
                        <YAxis
                            axisLine={true}
                            tickLine={false}
                            tickFormatter={(value) => `€${new Intl.NumberFormat('it-IT', { notation: "compact" }).format(value)}`}
                            tick={{ fill: 'currentColor', fontSize: 12 }}
                            className="text-gray-500 dark:text-gray-400"
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(100,100,100,0.2)', strokeWidth: 2 }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                        <Area
                            type="monotone"
                            dataKey={dataKeyOneTime}
                            name={isMonthly ? t('chart.one_time') : t('chart.total_one_time')}
                            stackId="1"
                            stroke="#3b9eff"
                            strokeWidth={3}
                            fill="url(#colorUnaTantum)"
                            animationDuration={1500}
                        />
                        <Area
                            type="monotone"
                            dataKey={dataKeyRecurring}
                            name={isMonthly ? t('chart.recurring') : t('chart.total_recurring')}
                            stackId="1"
                            stroke="#fb923c"
                            strokeWidth={3}
                            fill="url(#colorRicorrente)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default GrowthChart;
