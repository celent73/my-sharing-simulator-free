import React, { useEffect, useState } from 'react';
import { X, TrendingUp, Wallet, Coins } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    years: number;
    onYearChange: (year: number) => void;
    monthlyRecurring: number;
    totalOneTime: number;
}

const ProjectionModal: React.FC<ProjectionModalProps> = ({
    isOpen,
    onClose,
    years,
    onYearChange,
    monthlyRecurring,
    totalOneTime
}) => {
    const { t } = useLanguage();
    const [showContent, setShowContent] = useState(false);
    const [count, setCount] = useState(0);

    // Calculate totals
    const totalRecurringProjection = monthlyRecurring * 12 * years;
    const grandTotal = totalOneTime + totalRecurringProjection;

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setShowContent(true), 100);

            // Animate numbers
            let start = 0;
            const duration = 2000;
            const stepTime = 20;
            const steps = duration / stepTime;
            const increment = grandTotal / steps;

            const timer = setInterval(() => {
                start += increment;
                if (start >= grandTotal) {
                    setCount(grandTotal);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, stepTime);

            return () => clearInterval(timer);
        } else {
            setShowContent(false);
            setCount(0);
        }
    }, [isOpen, grandTotal]);

    if (!isOpen) return null;

    const MoneyStack = ({ amount }: { amount: number }) => {
        // Determine number of stacks based on amount (e.g., 1 stack per 10k)
        const stacks = Math.min(10, Math.max(1, Math.floor(amount / 10000)));

        return (
            <div className="flex gap-1 justify-center flex-wrap max-w-xs mx-auto mt-4">
                {Array.from({ length: stacks }).map((_, i) => (
                    <div key={i} className="text-4xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>
                        💸
                    </div>
                ))}
            </div>
        );
    };

    const GoldCoins = ({ amount }: { amount: number }) => {
        // Determine number of coin piles
        const piles = Math.min(8, Math.max(1, Math.floor(amount / 5000)));
        return (
            <div className="flex gap-2 justify-center flex-wrap mt-2 mx-auto">
                {Array.from({ length: piles }).map((_, i) => (
                    <div key={i} className="text-2xl animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}>
                        💰
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Scroll Container */}
            <div className="absolute inset-0 overflow-y-auto overflow-x-hidden custom-scrollbar">
                <div className="min-h-full flex items-center justify-center p-4 pb-24 md:pb-4">

                    {/* Modal Content */}
                    {/* Modal Card */}
                    <div className={`
        relative w-full max-w-4xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 
        rounded-[2rem] md:rounded-[3rem] border-0 shadow-2xl 
        transform transition-all duration-500 flex flex-col h-auto
        ${showContent ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10'}
      `}>

                        {/* Background Effects */}
                        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 rounded-full blur-[100px] animate-pulse"></div>
                            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
                        </div>



                        {/* Content Wrapper */}
                        <div className="relative z-10">

                            {/* Visual Close Icon Top Right (Extra safety) */}
                            <button
                                onClick={onClose}
                                className="md:hidden fixed top-4 right-4 z-[100] p-3 rounded-full bg-slate-900/50 backdrop-blur-md border border-white/10 text-white"
                            >
                                <X size={24} />
                            </button>

                            {/* Header */}
                            <div className="relative p-6 md:p-8 text-center">
                                <button
                                    onClick={onClose}
                                    className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>

                                <div className="inline-block p-3 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg mb-4 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                                    <TrendingUp className="text-white w-8 h-8" />
                                </div>

                                <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 mb-2">
                                    {t('projection.modal_title')}
                                </h2>
                                <p className="text-slate-400 font-medium text-lg mb-6">
                                    {t('projection.projection_at')}
                                </p>

                                <div className="flex justify-center flex-wrap gap-3">
                                    {[1, 2, 3, 5, 10].map((y) => (
                                        <button
                                            key={y}
                                            onClick={() => onYearChange(y)}
                                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 ${years === y
                                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black scale-110 shadow-[0_0_20px_rgba(251,191,36,0.5)] border-transparent'
                                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/30'
                                                }`}
                                        >
                                            {y} {y === 1 ? t('projection.year_1') : t('projection.years')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="relative p-6 md:p-12 space-y-8 md:space-y-12">

                                {/* Main Total */}
                                <div className="text-center space-y-4">
                                    <div className="inline-block relative">
                                        <span className="text-7xl md:text-8xl font-black text-white tracking-tighter drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                                            {count.toLocaleString('it-IT', { maximumFractionDigits: 0 })}€
                                        </span>
                                        <div className="absolute -top-6 -right-12 text-4xl animate-bounce">🚀</div>
                                    </div>
                                    <p className="text-xl text-green-400 font-bold uppercase tracking-widest">{t('projection.total_accumulated')}</p>
                                </div>

                                {/* Visual Representation */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                    {/* Recurring Wealth */}
                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 hover:border-green-500/30 transition-all hover:bg-white/10 group">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 rounded-xl bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
                                                <Coins size={32} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-slate-400 font-bold text-sm uppercase">{t('projection.recurring_monthly_sub')}</h3>
                                                <p className="text-2xl font-bold text-white">{monthlyRecurring.toLocaleString('it-IT')}€ <span className="text-sm opacity-50">{t('projection.per_month')}</span></p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4">
                                            <p className="text-sm text-slate-400 text-center mb-2">
                                                {years === 1 ? t('projection.in_1_year') : t('projection.in_y_years').replace('{{years}}', years.toString())}
                                            </p>
                                            <p className="text-3xl font-black text-green-400 text-center">
                                                {(monthlyRecurring * 12 * years).toLocaleString('it-IT')}€
                                            </p>
                                            <MoneyStack amount={monthlyRecurring * 12 * years} />
                                        </div>
                                    </div>

                                    {/* Immediate Wealth */}
                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 hover:border-amber-500/30 transition-all hover:bg-white/10 group">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 group-hover:scale-110 transition-transform">
                                                <Wallet size={32} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-slate-400 font-bold text-sm uppercase">{t('projection.one_time_immediate')}</h3>
                                                <p className="text-2xl font-bold text-white">{totalOneTime.toLocaleString('it-IT')}€</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 pt-4">
                                            <p className="text-sm text-slate-400 text-center mb-2">{t('projection.initial_value')}</p>
                                            <p className="text-3xl font-black text-amber-400 text-center">
                                                {totalOneTime.toLocaleString('it-IT')}€
                                            </p>
                                            <GoldCoins amount={totalOneTime} />
                                        </div>
                                    </div>

                                </div>

                                <div className="text-center space-y-6">
                                    <p className="text-slate-500 italic">
                                        {t('projection.quote')}
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile Floating Close Button (Floating Pill) */}
            <div className="md:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] w-auto">
                <button
                    onClick={onClose}
                    className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full font-bold text-lg shadow-[0_10px_30px_rgba(220,38,38,0.6)] border border-white/20 active:scale-95 animate-pulse flex items-center gap-2"
                >
                    <X size={20} />
                    <span>{t('guide_modal.close').replace(' Guida', '')}</span>
                </button>
            </div>

        </div>
    );
};

export default ProjectionModal;
