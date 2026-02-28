import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, ArrowRight, Zap, Users, Share2, TrendingUp, Building, Tv, Wallet, ShieldCheck, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { RevolutionNetworkAnimation } from './RevolutionNetworkAnimation';

interface UnionEcosystemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UnionEcosystemModal: React.FC<UnionEcosystemModalProps> = ({ isOpen, onClose }) => {
    const { language } = useLanguage();
    const [step, setStep] = useState(0);

    // Reset step when opening
    useEffect(() => {
        if (isOpen) setStep(0);
    }, [isOpen]);

    if (!isOpen) return null;

    const steps = [
        { id: 'welcome', title: language === 'it' ? 'Benvenuto' : 'Willkommen' },
        { id: 'tradition_vs_innovation', title: language === 'it' ? 'La Rivoluzione' : 'Die Revolution' },
        { id: 'cashback', title: language === 'it' ? 'Cashback' : 'Cashback' },
        { id: 'sharing', title: language === 'it' ? 'Sharing' : 'Sharing' },
        { id: 'total_vision', title: language === 'it' ? 'Ecosistema Union' : 'Union Ökosystem' },
        { id: 'summary_circle', title: language === 'it' ? 'Inizia Ora' : 'Starten' }
    ];

    const nextStep = () => { if (step < steps.length - 1) setStep(step + 1); };
    const prevStep = () => { if (step > 0) setStep(step - 1); };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-100/60 backdrop-blur-xl p-0 sm:p-6 overflow-hidden"
                >
                    {/* Background Ambient Orbs - Light and Soft */}
                    <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply opacity-60 animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] pointer-events-none mix-blend-multiply opacity-60 animate-pulse" />

                    {/* Close Button - iOS Style Light */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-[120] p-2.5 bg-white/50 hover:bg-white/80 backdrop-blur-md rounded-full text-gray-800 hover:text-black transition-all hover:scale-105 border border-white/40 shadow-lg shadow-black/5"
                    >
                        <X size={20} />
                    </button>

                    {/* Progress Indicators - iOS Page Control Style Light */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-2 z-[120] bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/40 shadow-sm">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`h-1.5 rounded-full transition-all duration-500 ease-out ${idx === step ? 'w-6 bg-gray-900 shadow-sm' : 'w-1.5 bg-gray-400/50'}`}
                            />
                        ))}
                    </div>

                    <motion.div
                        className="w-full h-full max-w-[1200px] mx-auto flex flex-col relative bg-white/80 backdrop-blur-lg border border-white/60 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.05)] overflow-hidden"
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    >
                        {/* Special case for Sharing Animation background */}
                        <AnimatePresence>
                            {step === 3 && (
                                <motion.div
                                    className="absolute inset-0 z-0 bg-transparent" // Transparent so we see the light modal blur behind
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50" />
                                    <RevolutionNetworkAnimation />
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 relative overflow-y-auto overflow-x-hidden flex flex-col items-center w-full scrollbar-none z-10 pointer-events-none">
                            <div className="w-full flex-grow flex flex-col justify-center py-4 pointer-events-auto">
                                <AnimatePresence mode="wait">
                                    {step === 0 && <Step0Welcome key="step0" language={language} onNext={nextStep} />}
                                    {step === 1 && <Step1TraditionVsInnovation key="step1" language={language} />}
                                    {step === 2 && <Step2Cashback key="step2" language={language} />}
                                    {step === 3 && <Step3Sharing key="step3" language={language} />}
                                    {step === 4 && <Step4TotalVision key="step4" language={language} onClose={onClose} />}
                                    {step === 5 && <Step5SummaryCircleFinal key="step5" language={language} onClose={onClose} />}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Navigation Controls - Light Theme */}
                        <div className="h-20 flex justify-between items-center px-6 w-full max-w-4xl mx-auto z-[110]">
                            <button
                                onClick={prevStep}
                                disabled={step === 0}
                                className={`flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors ${step === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                            >
                                <ChevronLeft size={24} />
                                <span className="text-sm uppercase tracking-wider font-bold">Back</span>
                            </button>

                            {step < steps.length - 1 && (
                                <button
                                    onClick={nextStep}
                                    className="group flex items-center gap-3 bg-gray-900 text-white px-8 py-3.5 rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95"
                                >
                                    <span className="uppercase tracking-wide text-sm">{language === 'it' ? 'Scopri' : 'Entdecken'}</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

// --- STEP COMPONENTS (REDESIGNED FOR LIGHT THEME) ---

const Step0Welcome = ({ language, onNext }: { language: 'it' | 'de', onNext: () => void }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center relative p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            <div className="text-center mb-10 relative z-20 max-w-2xl mx-auto">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 25, delay: 0.1 }}
                    className="mb-10 flex justify-center"
                >
                    <div className="relative w-32 h-32 md:w-44 md:h-44 bg-white rounded-[36px] flex items-center justify-center border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.08)] group">
                        <img src="/logo_new.png" alt="Logo" className="w-20 md:w-28 object-contain drop-shadow-sm group-hover:scale-110 transition-transform duration-700 ease-out" />
                        <div className="absolute inset-0 rounded-[36px] bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </motion.div>

                <motion.h1
                    className="text-5xl md:text-8xl font-black text-gray-900 mb-4 tracking-tighter"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, ease: "easeOut", duration: 0.8 }}
                >
                    {language === 'it' ? 'BENVENUTO' : 'WILLKOMMEN'}
                </motion.h1>
                <motion.h2
                    className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-8 tracking-tight"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    The Future of Energy
                </motion.h2>
                <motion.p
                    className="text-gray-500 text-lg md:text-xl leading-relaxed font-medium max-w-lg mx-auto"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    {language === 'it'
                        ? 'Scopri come trasformare le tue utenze da una spesa obbligatoria ad una fonte di guadagno.'
                        : 'Entdecken Sie, wie Sie Ihre Versorgungsleistungen von einer obligatorischen Ausgabe in eine Einnahmequelle verwandeln.'}
                </motion.p>
            </div>

            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, type: "spring", damping: 20 }}
            >
                <button
                    onClick={onNext}
                    className="group flex items-center gap-3 bg-gray-900 text-white pl-10 pr-8 py-5 rounded-full font-bold text-lg hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-400/20"
                >
                    <span>{language === 'it' ? 'Inizia il Viaggio' : 'Reise beginnen'}</span>
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </button>
            </motion.div>
        </motion.div>
    );

};

const Step1TraditionVsInnovation = ({ language }: { language: 'it' | 'de' }) => {
    // TILT LOGIC (Reused but simplified)
    const x1 = useMotionValue(0);
    const y1 = useMotionValue(0);
    const rotateX1 = useTransform(y1, [-100, 100], [5, -5]);
    const rotateY1 = useTransform(x1, [-100, 100], [-5, 5]);

    const x2 = useMotionValue(0);
    const y2 = useMotionValue(0);
    const rotateX2 = useTransform(y2, [-100, 100], [5, -5]);
    const rotateY2 = useTransform(x2, [-100, 100], [-5, 5]);

    function handleMouseMove1(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        x1.set(event.clientX - rect.left - rect.width / 2);
        y1.set(event.clientY - rect.top - rect.height / 2);
    }
    function handleMouseLeave1() { x1.set(0); y1.set(0); }
    function handleMouseMove2(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        x2.set(event.clientX - rect.left - rect.width / 2);
        y2.set(event.clientY - rect.top - rect.height / 2);
    }
    function handleMouseLeave2() { x2.set(0); y2.set(0); }

    return (
        <motion.div
            className="w-full h-full flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center p-4 relative perspective-1000"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -50 }}
        >
            {/* TRADITION CARD - LIGHT */}
            <motion.div
                className="flex-1 w-full max-w-sm relative group perspective-origin-center hover:z-10"
                style={{ rotateX: rotateX1, rotateY: rotateY1 }}
                onMouseMove={handleMouseMove1}
                onMouseLeave={handleMouseLeave1}
            >
                <div className="bg-white/60 backdrop-blur-xl p-6 md:p-8 rounded-[32px] w-full h-full min-h-[400px] flex flex-col relative overflow-hidden transition-all duration-500 hover:bg-white/80 border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:shadow-xl">
                    <div className="relative z-10 text-center mb-6">
                        <span className="px-3 py-1 rounded-full bg-gray-200/50 text-gray-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-3 block w-fit mx-auto">
                            OLD ECONOMY
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tight">Tradizionale</h2>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="flex items-start gap-4 p-3 rounded-2xl bg-gray-50/50 border border-gray-100 group-hover:bg-red-50/50 transition-colors">
                            <div className="p-2 bg-red-100 rounded-xl text-red-500"><Building size={18} /></div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Strutture Pesanti</p>
                                <p className="text-[11px] text-gray-400 leading-tight">Uffici costosi.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 p-3 rounded-2xl bg-gray-50/50 border border-gray-100 group-hover:bg-red-50/50 transition-colors">
                            <div className="p-2 bg-red-100 rounded-xl text-red-500"><Tv size={18} /></div>
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Marketing</p>
                                <p className="text-[11px] text-gray-400 leading-tight">Pubblicità inutile.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                        <p className="text-gray-400 font-mono text-[10px] tracking-widest uppercase mb-1">GUADAGNO</p>
                        <p className="text-red-400 font-black text-xl line-through opacity-60">ZERO</p>
                    </div>
                </div>
            </motion.div>

            {/* VS Badge */}
            <div className="relative z-20 flex items-center justify-center -my-4 md:-mx-6 md:my-0">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gray-900 text-white font-black flex items-center justify-center text-lg md:text-xl shadow-xl z-10 border-4 border-white">
                    VS
                </div>
            </div>

            {/* INNOVATION CARD - LIGHT */}
            <motion.div
                className="flex-1 w-full max-w-sm relative group perspective-origin-center hover:z-10"
                style={{ rotateX: rotateX2, rotateY: rotateY2 }}
                onMouseMove={handleMouseMove2}
                onMouseLeave={handleMouseLeave2}
            >
                <div className="bg-white/90 backdrop-blur-xl p-6 md:p-8 rounded-[32px] w-full h-full min-h-[400px] flex flex-col relative overflow-hidden transition-all duration-500 border border-white/60 shadow-[0_20px_50px_rgba(56,189,248,0.15)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-orange-50/50 opacity-50" />

                    <div className="relative z-10 text-center mb-6">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-bold tracking-[0.2em] text-[10px] uppercase mb-3 block w-fit mx-auto shadow-sm">
                            NEW ECONOMY
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">Union Energy</h2>
                    </div>

                    <div className="space-y-4 flex-1 relative z-10">
                        <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-4 p-3 rounded-2xl bg-blue-50 border border-blue-100 hover:shadow-md transition-all">
                            <div className="p-2 bg-blue-100 rounded-xl text-blue-500"><Users size={18} /></div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Power to People</p>
                                <p className="text-[11px] text-gray-500 leading-tight">Vantaggi per te.</p>
                            </div>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="flex items-start gap-4 p-3 rounded-2xl bg-orange-50 border border-orange-100 hover:shadow-md transition-all">
                            <div className="p-2 bg-orange-100 rounded-xl text-orange-500"><Share2 size={18} /></div>
                            <div>
                                <p className="font-bold text-gray-900 text-sm">Sharing Economy</p>
                                <p className="text-[11px] text-gray-500 leading-tight">Guadagna condividendo.</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 text-center relative z-10">
                        <p className="text-blue-500 font-bold text-[10px] tracking-widest uppercase mb-1">RISULTATO</p>
                        <div className="inline-block px-4 py-1 rounded-lg bg-green-100 border border-green-200">
                            <p className="text-green-600 font-black text-lg">BOLLETTA ZERO</p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Step2Cashback = ({ language }: { language: 'it' | 'de' }) => {
    const [price, setPrice] = useState(100);
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setPrice(prev => {
                    if (prev <= 70) {
                        clearInterval(interval);
                        setIsComplete(true);
                        return 70;
                    }
                    return prev - 1;
                });
            }, 25);
            return () => clearInterval(interval);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center relative p-4 max-w-lg mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="text-center mb-8 relative z-20">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-600 font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block w-fit mx-auto">
                    Money Back
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 tracking-tighter">
                    Cashback <span className="text-green-500">Immediato</span>
                </h2>
                <p className="text-gray-500 text-sm md:text-base font-medium tracking-wide">
                    Trasforma le bollette in <span className="text-gray-900 font-bold">valore reale.</span>
                </p>
            </div>

            <motion.div
                className="w-full bg-white/80 backdrop-blur-2xl p-6 md:p-8 rounded-[40px] border border-white/60 relative group shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
            >
                <div className="relative z-10 h-full flex flex-col items-center text-center">
                    <motion.div
                        className="w-24 h-24 rounded-3xl bg-green-50 flex items-center justify-center text-green-500 mb-6 border border-green-100 relative shadow-sm"
                        animate={isComplete ? { scale: [1, 1.05, 1], boxShadow: "0 10px 30px rgba(34,197,94,0.15)" } : {}}
                    >
                        <Wallet size={48} className={isComplete ? "text-green-600" : "text-green-400"} />
                        {isComplete && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full p-1.5 shadow-lg">
                                <CheckCircle2 size={16} />
                            </motion.div>
                        )}
                    </motion.div>

                    <div className="w-full relative">
                        <div className="bg-gray-50 p-6 rounded-3xl border border-gray-200 w-full relative overflow-hidden">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Bolletta</span>
                                <span className="text-sm text-red-400/80 font-mono font-bold line-through">€100</span>
                            </div>
                            <div className="flex justify-between items-end mb-5">
                                <span className="text-sm text-gray-800 font-bold mb-1">Costo Reale</span>
                                <motion.span key={price} className={`text-4xl font-black tracking-tighter ${isComplete ? 'text-green-600' : 'text-gray-900'}`}>
                                    €{price}
                                </motion.span>
                            </div>

                            <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: "30%" }}
                                    transition={{ delay: 0.8, duration: 1.2, ease: "circOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Step3Sharing = ({ language }: { language: 'it' | 'de' }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-between p-4 md:p-8 relative pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Top Technology Overlay */}
            <motion.div
                className="absolute top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <div className="bg-white/90 border border-blue-100 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-3 shadow-lg shadow-blue-500/10">
                    <div className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </div>
                    <span className="text-blue-600 font-bold text-[10px] uppercase tracking-[0.2em]">Network Live</span>
                </div>
            </motion.div>

            {/* Side Panels - Floating Glass Bubbles Light */}
            <div className="absolute inset-x-4 md:inset-x-10 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-10">
                <motion.div className="max-w-[300px] space-y-4 hidden lg:block" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                    <div className="bg-white/80 border border-white shadow-xl backdrop-blur-xl p-6 rounded-[32px]">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 mb-4"><Users size={24} /></div>
                        <h4 className="text-gray-900 font-black text-lg mb-2 uppercase tracking-wider">Community</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Ogni invito è un mattone per la tua crescita.</p>
                    </div>
                    <div className="bg-white/80 border border-white shadow-xl backdrop-blur-xl p-6 rounded-[32px]">
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 mb-4"><Zap size={24} /></div>
                        <h4 className="text-gray-900 font-black text-lg mb-2 uppercase tracking-wider">Efficienza</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Energia condivisa e ottimizzata per tutti.</p>
                    </div>
                </motion.div>

                <motion.div className="max-w-[300px] space-y-4 hidden lg:block text-right" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
                    <div className="bg-white/80 border border-white shadow-xl backdrop-blur-xl p-6 rounded-[32px] flex flex-col items-end">
                        <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-500 mb-4"><TrendingUp size={24} /></div>
                        <h4 className="text-gray-900 font-black text-lg mb-2 uppercase tracking-wider">Rendita</h4>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">Il sistema lavora per te generando valore.</p>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Content Area */}
            <motion.div
                className="absolute bottom-12 left-0 right-0 text-center pointer-events-auto z-20"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 tracking-tighter drop-shadow-sm">
                    Network <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500">Imperiale</span>
                </h2>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 shadow-sm border border-white/60">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">Condividi &amp; Azzera</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Step4TotalVision = ({ language, onClose }: { language: 'it' | 'de', onClose: () => void }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center relative p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="relative z-10 text-center mb-10 px-4">
                <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block w-fit mx-auto">
                    Total Vision
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 tracking-tighter">
                    ECOSISTEMA <span className="text-blue-600">UNION</span>
                </h2>
                <p className="text-sm md:text-lg text-gray-500 max-w-xl mx-auto font-medium">
                    L'unica piattaforma che trasforma le spese in <span className="text-gray-900 font-bold">libertà</span>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-5xl px-4 relative z-10">
                <FeatureCardLight icon={<Zap className="text-yellow-500" />} title="Luce & Gas" desc="Energia Green." color="bg-yellow-50" delay={0.2} />
                <FeatureCardLight icon={<Share2 className="text-blue-500" />} title="Sharing" desc="Condivisione reale." color="bg-blue-50" delay={0.4} isCenter />
                <FeatureCardLight icon={<TrendingUp className="text-green-500" />} title="Rendita" desc="Futuro sicuro." color="bg-green-50" delay={0.6} />
            </div>
        </motion.div>
    );
};

const FeatureCardLight = ({ icon, title, desc, delay, color, isCenter = false }: any) => (
    <motion.div
        className={`bg-white p-6 rounded-[24px] border border-gray-100 shadow-lg hover:shadow-xl transition-all flex flex-col items-center text-center ${isCenter ? 'md:scale-110 z-10 shadow-2xl' : ''}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay }}
    >
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>{icon}</div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-xs text-gray-500 font-medium">{desc}</p>
    </motion.div>
);

const Step5SummaryCircleFinal = ({ language, onClose }: { language: 'it' | 'de', onClose: () => void }) => {
    return (
        <motion.div
            className="w-full h-full flex flex-col items-center justify-center relative p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            <div className="relative w-[320px] h-[320px] md:w-[500px] md:h-[500px] flex items-center justify-center my-4 md:my-8 scale-90 md:scale-100">
                {/* Clean Rings */}
                <div className="absolute inset-0 border border-dashed border-gray-200 rounded-full animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-20 border border-dotted border-gray-300 rounded-full animate-[spin_40s_linear_infinite_reverse]" />

                {/* Central Core */}
                <motion.div
                    className="absolute z-20 w-32 h-32 md:w-44 md:h-44 bg-white rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(0,194,255,0.2)] border-4 border-white relative overflow-hidden"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                >
                    <img src="/logo_new.png" alt="Union" className="w-24 md:w-32 object-contain relative z-10" />
                </motion.div>

                {/* Satellite Nodes */}
                <SatelliteNodeFixedLight angle={-90} label="Luce & Gas" icon={<Zap className="w-5 h-5 text-yellow-500" />} bg="bg-yellow-50" />
                <SatelliteNodeFixedLight angle={0} label="Sharing" icon={<Share2 className="w-5 h-5 text-blue-500" />} bg="bg-blue-50" />
                <SatelliteNodeFixedLight angle={90} label="Rendita" icon={<TrendingUp className="w-5 h-5 text-green-500" />} bg="bg-green-50" />
                <SatelliteNodeFixedLight angle={180} label="Community" icon={<Users className="w-5 h-5 text-purple-500" />} bg="bg-purple-50" />
            </div>

            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 z-30">
                <button
                    onClick={onClose}
                    className="bg-gray-900 text-white px-12 py-4 rounded-full font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                    {language === 'it' ? 'INIZIA ORA' : 'STARTEN'} <ArrowRight size={20} />
                </button>
            </motion.div>
        </motion.div>
    );
};

const SatelliteNodeFixedLight = ({ angle, label, icon, bg }: any) => {
    const radius = 180; // Approximate radius in px
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return (
        <motion.div
            className={`absolute w-16 h-16 rounded-2xl ${bg} flex flex-col items-center justify-center shadow-md border border-white z-10`}
            style={{ x, y }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
        >
            {icon}
            <span className="text-[8px] font-bold text-gray-700 mt-1 uppercase tracking-wide">{label}</span>
        </motion.div>
    );
};
