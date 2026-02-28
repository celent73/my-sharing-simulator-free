import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Check, Sparkles, ArrowRight, Share2, Fuel, TrendingDown, Hand } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useLanguage } from '../contexts/LanguageContext';

interface FuelFocusModeProps {
    isOpen: boolean;
    onClose: () => void;
}

export const FuelFocusMode: React.FC<FuelFocusModeProps> = ({ isOpen, onClose }) => {
    const { t, language } = useLanguage();
    const [step, setStep] = useState<'price' | 'spending' | 'reveal'>('price');
    const [pumpPrice, setPumpPrice] = useState<string>('1.80');
    const [monthlySpending, setMonthlySpending] = useState<string>('500');
    const [cashbackPercent, setCashbackPercent] = useState<number>(10);
    const reportRef = useRef<HTMLDivElement>(null);

    // Swipe Logic State
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [showTutorial, setShowTutorial] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep('price');
                setTouchStart(null);
                setTouchEnd(null);
            }, 500);
        } else {
            const hasSeenTutorial = localStorage.getItem('hasSeenFuelFocusSwipeTutorial');
            if (!hasSeenTutorial) {
                setShowTutorial(true);
                setTimeout(() => {
                    setShowTutorial(false);
                    localStorage.setItem('hasSeenFuelFocusSwipeTutorial', 'true');
                }, 4000);
            }
        }
    }, [isOpen]);

    // Touch Event Handlers for Swipe
    const minSwipeDistance = 50;
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };
    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };
    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isRightSwipe = distance < -minSwipeDistance;
        if (isRightSwipe) onClose();
    };

    const handleBack = () => {
        if (step === 'spending') setStep('price');
        else if (step === 'reveal') setStep('spending');
    };

    const handleShare = async () => {
        if (reportRef.current === null) return;
        try {
            const dataUrl = await toPng(reportRef.current, {
                cacheBust: true,
                backgroundColor: '#0f172a',
                style: { borderRadius: '24px', padding: '40px' }
            });
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'fuel-saver-result.png', { type: 'image/png' });
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: t('fuel_focus.tutorial_title'),
                    text: t('fuel_focus.tutorial_desc'),
                });
            } else {
                const link = document.createElement('a');
                link.download = 'fuel-saver-result.png';
                link.href = dataUrl;
                link.click();
            }
        } catch (err) {
            console.error('Failed to share:', err);
        }
    };

    if (!isOpen) return null;

    // Calculation Logic
    const pPrice = parseFloat(pumpPrice) || 0;
    const mSpending = parseFloat(monthlySpending) || 0;
    const fuelCashbackRate = 1.88;
    const tankSize = 50;
    const costPerTankStandard = pPrice * tankSize;
    const directFuelSavings = costPerTankStandard * (fuelCashbackRate / 100);
    const otherSavings = mSpending * (cashbackPercent / 100);
    const totalSavings = directFuelSavings + otherSavings;
    const costPerTankDiscounted = Math.max(0, costPerTankStandard - totalSavings);
    const newPricePerLiter = costPerTankDiscounted / tankSize;

    return (
        <div
            className="fixed inset-0 z-[100001] bg-black text-white flex flex-col overflow-hidden font-sans"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] bg-red-900/20 rounded-full blur-[120px] animate-[pulse_8s_infinite]" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-emerald-900/20 rounded-full blur-[100px] animate-[pulse_10s_infinite_reverse]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            {/* TUTORIAL OVERLAY */}
            <AnimatePresence>
                {showTutorial && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100002] pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
                    >
                        <div className="flex flex-col items-center">
                            <motion.div animate={{ x: [0, 100, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
                                <Hand size={64} className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.8)] rotate-90" />
                            </motion.div>
                            <p className="mt-4 text-white font-bold text-lg bg-black/50 px-4 py-2 rounded-full">
                                {t('fuel_focus.swipe_close')}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HEADER */}
            <div className="relative z-50 flex items-center justify-between p-6">
                <button
                    onClick={step === 'price' ? onClose : handleBack}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
                >
                    {step === 'price' ? <X size={24} /> : <ChevronLeft size={24} />}
                </button>
                <div className="text-sm font-bold tracking-[0.2em] text-white/50 uppercase">
                    Fuel Focus
                </div>
                <div className="w-12" />
            </div>

            {/* CONTENT AREA */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 sm:p-12 w-full max-w-7xl mx-auto h-full overflow-hidden">
                <AnimatePresence mode="wait">

                    {/* STEP 1: PUMP PRICE */}
                    {step === 'price' && (
                        <motion.div
                            key="step-price"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            className="w-full max-w-xl flex flex-col items-center"
                        >
                            <div className="w-20 h-20 bg-red-600/20 rounded-3xl flex items-center justify-center mb-8 border border-red-500/30">
                                <Fuel size={40} className="text-red-500" />
                            </div>
                            <h2 className="text-3xl sm:text-5xl font-black mb-12 text-center text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 uppercase tracking-tight">
                                {t('fuel_focus.step_price')}
                            </h2>
                            <div className="relative w-full group">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-4xl font-black text-white/20 uppercase">€</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={pumpPrice}
                                    onChange={(e) => setPumpPrice(e.target.value)}
                                    placeholder="1.80"
                                    className="w-full bg-white/5 border-2 border-white/10 rounded-[2.5rem] py-10 text-center text-6xl font-black text-white outline-none focus:border-red-500 focus:bg-white/10 transition-all shadow-2xl"
                                    autoFocus
                                />
                            </div>
                            <button
                                onClick={() => setStep('spending')}
                                className="mt-12 w-full max-w-xs py-6 bg-white text-black rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3"
                            >
                                {t('common.next')} <ArrowRight size={24} />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: SMART SHOPPING */}
                    {step === 'spending' && (
                        <motion.div
                            key="step-spending"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50, filter: "blur(10px)" }}
                            className="w-full max-w-xl flex flex-col items-center"
                        >
                            <h2 className="text-3xl sm:text-5xl font-black mb-12 text-center text-transparent bg-clip-text bg-gradient-to-br from-white to-white/60 uppercase tracking-tight">
                                {t('fuel_focus.step_shopping')}
                            </h2>

                            <div className="w-full space-y-8">
                                <div className="space-y-4">
                                    <label className="text-sm font-bold text-white/40 uppercase tracking-widest ml-4">
                                        {t('fuel_focus.input_spending')}
                                    </label>
                                    <div className="relative group">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-white/20">€</span>
                                        <input
                                            type="number"
                                            value={monthlySpending}
                                            onChange={(e) => setMonthlySpending(e.target.value)}
                                            className="w-full bg-white/5 border-2 border-white/10 rounded-3xl py-6 text-center text-4xl font-black text-white outline-none focus:border-emerald-500 focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <label className="flex justify-between items-end text-sm font-bold text-white/40 uppercase tracking-widest px-4">
                                        <span>{t('fuel_focus.expected_cashback')}</span>
                                        <span className="text-4xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">{cashbackPercent}%</span>
                                    </label>

                                    <div className="flex items-center gap-4 px-2">
                                        <button
                                            onClick={() => setCashbackPercent(prev => Math.max(0, prev - 0.5))}
                                            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all text-2xl font-bold"
                                        >
                                            -
                                        </button>

                                        <div className="flex-1 relative py-4">
                                            <input
                                                type="range"
                                                min="0"
                                                max="30"
                                                step="0.5"
                                                value={cashbackPercent}
                                                onChange={(e) => setCashbackPercent(parseFloat(e.target.value))}
                                                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                                            />
                                            <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-white/20 uppercase">
                                                <span>0%</span>
                                                <span>15%</span>
                                                <span>30%</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setCashbackPercent(prev => Math.min(30, prev + 0.5))}
                                            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all text-2xl font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 backdrop-blur-md">
                                    <span className="text-[10px] font-black text-white/30 uppercase block mb-1">{t('fuel_focus.monthly_saving')}</span>
                                    <span className="text-xl sm:text-2xl font-bold text-white">€ {totalSavings.toFixed(2)}</span>
                                </div>
                                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 p-4 rounded-3xl border border-emerald-500/20 backdrop-blur-md">
                                    <span className="text-[10px] font-black text-emerald-300/50 uppercase block mb-1">{t('fuel_focus.annual_saving')}</span>
                                    <span className="text-xl sm:text-2xl font-bold text-emerald-400">€ {(totalSavings * 12).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep('reveal')}
                                className="mt-8 w-full max-w-xs py-6 bg-emerald-500 text-white rounded-2xl font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_-10px_rgba(16,185,129,0.4)] flex items-center justify-center gap-3"
                            >
                                {t('fuel_focus.reveal_btn')} <Sparkles size={24} />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: REVEAL */}
                    {step === 'reveal' && (
                        <motion.div
                            key="step-reveal"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="flex flex-col items-center justify-center text-center relative w-full h-full"
                        >
                            <div ref={reportRef} className="flex flex-col items-center justify-center p-8 rounded-[3rem] relative">
                                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                    <div className="absolute w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[100px]" />
                                    <div className="absolute w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] animate-pulse" />
                                </div>

                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    className="mb-8 p-6 bg-white/5 border border-white/10 rounded-[2rem] backdrop-blur-xl relative z-10"
                                >
                                    <span className="text-white/40 text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{t('fuel_focus.pump_price_label')}</span>
                                    <span className="text-4xl font-mono text-red-500/50 line-through">€ {pPrice.toFixed(2)}</span>
                                </motion.div>

                                <div className="relative z-10 py-12">
                                    <motion.div
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ type: "spring", damping: 12 }}
                                        className="flex flex-col items-center"
                                    >
                                        <div className="text-[15vw] sm:text-[140px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 via-white to-emerald-600 drop-shadow-[0_0_60px_rgba(16,185,129,0.4)]">
                                            € {newPricePerLiter.toFixed(2)}
                                        </div>
                                        <span className="mt-4 px-6 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                            <TrendingDown size={16} /> {t('fuel_focus.sharing_price_label')}
                                        </span>
                                    </motion.div>

                                    <motion.div
                                        className="absolute -top-12 -right-8 text-emerald-400"
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                    >
                                        <Sparkles size={40} />
                                    </motion.div>
                                </div>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="mt-12 text-center"
                                >
                                    <p className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider drop-shadow-lg">
                                        Con il tuo gestore è possibile?
                                    </p>
                                </motion.div>
                            </div>

                            {/* ACTIONS */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="mt-12 flex gap-4 w-full max-w-md px-6"
                            >
                                <button
                                    onClick={handleShare}
                                    className="p-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-3xl text-white transition-all"
                                >
                                    <Share2 size={24} />
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-6 bg-white text-black rounded-3xl font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-[0_20px_40px_rgba(255,255,255,0.2)] uppercase"
                                >
                                    {t('common.done')}
                                </button>
                            </motion.div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>
        </div>
    );
};
