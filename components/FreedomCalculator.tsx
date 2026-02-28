import React, { useState, useMemo } from 'react';
import { MonthlyGrowthData } from '../types';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceDot } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface FreedomCalculatorProps {
    monthlyData: MonthlyGrowthData[];
}

const FreedomCalculator: React.FC<FreedomCalculatorProps> = ({ monthlyData }) => {
    const [currentSalary, setCurrentSalary] = useState<string>('1500');
    const { t } = useLanguage();

    const salaryValue = parseFloat(currentSalary) || 0;

    // Calculate Logic
    const freedomPoint = useMemo(() => {
        if (!monthlyData || monthlyData.length === 0 || salaryValue <= 0) return null;

        // We compare Salary vs Recurring Income (Recurring is safe for quitting job)
        const match = monthlyData.find(m => m.monthlyRecurring >= salaryValue);

        if (match) {
            const today = new Date();
            const targetDate = new Date(today.getFullYear(), today.getMonth() + match.month, 1);
            const dateString = targetDate.toLocaleString('it-IT', { month: 'long', year: 'numeric' });
            return {
                month: match.month,
                dateString: dateString.charAt(0).toUpperCase() + dateString.slice(1),
                reached: true,
                value: match.monthlyRecurring
            };
        }
        return { reached: false };
    }, [monthlyData, salaryValue]);

    // Prepare Chart Data
    const chartData = useMemo(() => {
        if (!monthlyData) return [];
        return monthlyData.map(m => ({
            month: m.month,
            recurring: m.monthlyRecurring,
            salary: salaryValue,
            crossover: m.monthlyRecurring >= salaryValue // Mark the crossover point
        }));
    }, [monthlyData, salaryValue]);

    const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);



    return (
        <div className="bg-white/70 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white/40 p-8 sm:p-10 overflow-hidden relative mt-8 transition-transform hover:scale-[1.01] duration-500 group">

            {/* Ambient Light for Light Mode */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-200/40 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-200/40 rounded-full blur-[80px] pointer-events-none translate-y-1/3 -translate-x-1/3" />

            {/* Header */}
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl shadow-lg shadow-orange-200 text-4xl text-white">
                        🔓
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Libertà Finanziaria</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">Quando potrai dire "Addio Capo"?</p>
                    </div>
                </div>

                {freedomPoint?.reached && (
                    <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-100/50 text-emerald-700 rounded-full border border-emerald-200/50 text-xs font-black uppercase tracking-widest animate-pulse">
                        <span>Obiettivo Raggiungibile!</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">

                {/* Left Column: Input Panel */}
                <div className="lg:col-span-4 flex flex-col gap-6">

                    {/* Input Box */}
                    <div className="bg-white/60 p-6 rounded-[2rem] border border-slate-200 shadow-sm backdrop-blur-md">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                            IL TUO STIPENDIO ATTUALE
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                                <span className="text-slate-400 font-bold text-2xl">€</span>
                            </div>
                            <input
                                type="number"
                                value={currentSalary}
                                onChange={(e) => setCurrentSalary(e.target.value)}
                                className="w-full pl-12 pr-4 py-5 text-3xl font-black text-slate-800 bg-white border-2 border-slate-100 rounded-2xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all shadow-inner group-hover:border-slate-300 placeholder:text-slate-300"
                                placeholder="0"
                            />
                        </div>
                        <p className="text-xs text-slate-400 mt-3 font-medium leading-relaxed">
                            Inserisci quanto guadagni oggi col tuo lavoro "tradizionale".
                        </p>
                    </div>

                    {/* Status Message Area */}
                    <div className={`
                    flex-1 rounded-[2.5rem] p-8 flex flex-col justify-center items-center text-center transition-all duration-500 relative overflow-hidden group/card
                    ${freedomPoint?.reached
                            ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-200 text-white border-none'
                            : 'bg-slate-50/50 border-2 border-dashed border-slate-200'}
                `}>

                        {freedomPoint?.reached ? (
                            <>
                                {/* Decorative Background Elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full blur-xl pointer-events-none translate-y-1/3 -translate-x-1/3" />

                                <div className="relative z-10">
                                    <div className="text-5xl mb-4 animate-bounce">🎉</div>
                                    <h3 className="text-3xl font-black mb-2 tracking-tight drop-shadow-md">
                                        SEI LIBERO!
                                    </h3>
                                    <div className="inline-block bg-white/20 backdrop-blur-md rounded-xl px-4 py-2 mb-4 border border-white/20">
                                        <span className="text-sm font-bold uppercase tracking-widest text-emerald-100">Obiettivo:</span>
                                        <span className="block text-xl font-black text-white">{freedomPoint.dateString}</span>
                                    </div>
                                    <p className="text-emerald-100/90 text-sm font-medium max-w-[200px] mx-auto leading-relaxed">
                                        La tua rendita supererà il tuo stipendio.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-slate-400 font-bold text-sm uppercase tracking-wide">
                                    Continua a costruire la tua rete<br />per superare questo importo!
                                </p>
                            </>
                        )}
                    </div>

                </div>

                {/* Right Column: Chart & Visuals */}
                <div className="lg:col-span-8 bg-white rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />

                    <div className="h-[350px] w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                <defs>
                                    <linearGradient id="freedomGradientLight" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#f97316" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                                    tickLine={false}
                                    axisLine={{ stroke: '#cbd5e1' }}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    hide={false}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                                    tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`}
                                    domain={[0, (dataMax: number) => Math.max(dataMax, salaryValue * 1.25)]}
                                    width={30}
                                />
                                <Tooltip
                                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                                    contentStyle={{
                                        backgroundColor: '#ffffff',
                                        borderRadius: '16px',
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.1)'
                                    }}
                                    itemStyle={{ fontWeight: 700, fontSize: '12px' }}
                                    formatter={(value: number, name: string) => [
                                        formatCurrency(value),
                                        name === 'salary' ? 'Stipendio Fisso' : 'Rendita Union'
                                    ]}
                                    labelFormatter={(label) => `Mese ${label}`}
                                />

                                {/* Salary Line (The Ceiling) */}
                                <ReferenceDot
                                    x={chartData[0]?.month}
                                    y={salaryValue}
                                    r={0}
                                    label={{
                                        value: 'STIPENDIO ATTUALE',
                                        position: 'insideTopLeft',
                                        fill: '#94a3b8',
                                        fontSize: 10,
                                        fontWeight: 900
                                    }}
                                />

                                <Line
                                    type="stepAfter"
                                    dataKey="salary"
                                    stroke="#94a3b8"
                                    strokeWidth={2}
                                    strokeDasharray="6 6"
                                    dot={false}
                                    activeDot={false}
                                    animationDuration={1000}
                                />

                                {/* Income Area (The Growth) */}
                                <Area
                                    type="monotone"
                                    dataKey="recurring"
                                    stroke="#f97316"
                                    strokeWidth={4}
                                    fill="url(#freedomGradientLight)"
                                    animationDuration={1500}
                                />

                                {/* Crossover Dot */}
                                {freedomPoint?.reached && (
                                    <ReferenceDot
                                        x={freedomPoint.month}
                                        y={freedomPoint.value}
                                        r={8}
                                        fill="#fff"
                                        stroke="#f97316"
                                        strokeWidth={4}
                                    >
                                    </ReferenceDot>
                                )}
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center gap-8 text-xs font-bold text-slate-500 uppercase tracking-wide mt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                            <span>Stipendio Fisso</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500 shadow-md shadow-orange-200"></div>
                            <span className="text-orange-600">Rendita Union</span>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default FreedomCalculator;