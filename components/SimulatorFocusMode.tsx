import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, Check, Sparkles, ArrowRight, Share2, Target, Zap, User, Users, TrendingUp, Info } from 'lucide-react';
import { toPng } from 'html-to-image';
import { LEVEL_COMMISSIONS, UNLOCK_CONDITIONS } from './light/constants';

interface SimulatorFocusModeProps {
    isOpen: boolean;
    onClose: () => void;
    t: (key: string) => string;
    language: string;
}

export const SimulatorFocusMode: React.FC<SimulatorFocusModeProps> = ({ isOpen, onClose, t, language }) => {
    const [step, setStep] = useState<number>(1);
    const [personalUnits, setPersonalUnits] = useState(5);
    const [duplicationFactor, setDuplicationFactor] = useState(3);
    const [utilityType] = useState<'DOMESTIC' | 'BUSINESS'>('DOMESTIC');
    const [monthRange] = useState('1');
    const reportRef = useRef<HTMLDivElement>(null);

    // Calculate dynamic network based on duplication
    const calculateNetwork = (factor: number) => {
        const network = [5]; // Level 0 default
        for (let i = 1; i < 6; i++) {
            network[i] = network[i - 1] * factor;
        }
        return network;
    };

    const networkSize = calculateNetwork(duplicationFactor);

    const calculateEarnings = () => {
        let total = 0;
        const commissions = LEVEL_COMMISSIONS.DOMESTIC.RECURRING; // Using monthly domestic for simplicity in Focus Mode

        networkSize.forEach((count, level) => {
            let isUnlocked = true;
            if (level === 1) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_1;
            else if (level === 2) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_2;
            else if (level === 3) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_3;
            else if (level === 4) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_4;
            else if (level === 5) isUnlocked = personalUnits >= UNLOCK_CONDITIONS.LEVEL_5;

            if (isUnlocked) {
                const effectiveCount = level === 0 ? count + personalUnits : count;
                total += effectiveCount * commissions[level];
            }
        });
        return total;
    };

    const totalEarnings = calculateEarnings();

    useEffect(() => {
        if (!isOpen) {
            setTimeout(() => {
                setStep(1);
                setPersonalUnits(5);
                setDuplicationFactor(3);
            }, 500);
        }
    }, [isOpen]);

    const handleShare = async () => {
        if (reportRef.current === null) return;
        try {
            const dataUrl = await toPng(reportRef.current, {
                cacheBust: true,
                backgroundColor: '#0f172a',
                style: { borderRadius: '24px', padding: '40px' }
            });
            const link = document.createElement('a');
            link.download = 'visionary-simulator-result.png';
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to share:', err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100001] bg-slate-950 text-white flex flex-col overflow-hidden font-sans">
            {/* AMBIENT BACKGROUND */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[70vw] h-[70vw] bg-union-green-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[60vw] h-[60vw] bg-purple-900/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            {/* HEADER */}
            <div className="relative z-50 flex items-center justify-between p-6">
                <button
                    onClick={step === 1 ? onClose : () => setStep(step - 1)}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md border border-white/10"
                >
                    {step === 1 ? <X size={24} /> : <ChevronLeft size={24} />}
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-[0.3em] text-union-green-400 uppercase">Visionary Mode</span>
                    <div className="flex gap-1 mt-1">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1 w-6 rounded-full transition-all ${step >= s ? 'bg-union-green-500' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>
                <div className="w-12" />
            </div>

            {/* CONTENT */}
            <div className="relative z-10 flex-1 flex flex-col items-center p-4 sm:p-6 w-full max-w-4xl mx-auto h-full overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">

                    {/* STEP 1: PERSONAL UNITS */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            className="w-full flex flex-col items-center space-y-8 sm:space-y-12 py-8"
                        >
                            <div className="space-y-3">
                                <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-none text-center">
                                    TUTTO PARTE <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-union-green-400 to-emerald-300">DA TE.</span>
                                </h2>
                                <p className="text-white/50 font-medium text-base sm:text-lg max-w-md mx-auto text-center">
                                    Quante utenze personali vuoi gestire per sbloccare i livelli della tua community?
                                </p>
                            </div>

                            <div className="relative flex items-center justify-center">
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                        boxShadow: [`0 0 20px rgba(34,197,94,${0.1 + personalUnits / 40})`, `0 0 60px rgba(34,197,94,${0.2 + personalUnits / 40})`, `0 0 20px rgba(34,197,94,${0.1 + personalUnits / 40})`]
                                    }}
                                    transition={{ repeat: Infinity, duration: 4 }}
                                    className="w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-white/5 border border-white/10 flex flex-col items-center justify-center backdrop-blur-2xl"
                                >
                                    <User size={32} className="text-union-green-400 mb-2 sm:hidden" />
                                    <User size={48} className="text-union-green-400 mb-2 hidden sm:block" />
                                    <span className="text-5xl sm:text-8xl font-black text-white">{personalUnits}</span>
                                    <span className="text-[10px] sm:text-xs font-bold text-white/30 uppercase tracking-[0.2em]">Utenze Personali</span>
                                </motion.div>
                            </div>

                            <div className="w-full max-w-sm mx-auto space-y-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="20"
                                    value={personalUnits}
                                    onChange={(e) => setPersonalUnits(parseInt(e.target.value))}
                                    className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-union-green-500"
                                />
                                <div className="flex justify-between items-center text-[10px] sm:text-xs font-black text-white/20 uppercase">
                                    <span>Focus</span>
                                    {personalUnits >= 10 ? (
                                        <span className="text-union-green-400 flex items-center gap-1 animate-pulse">
                                            <TrendingUp size={14} /> Massimo Sblocco!
                                        </span>
                                    ) : (
                                        <span>Livelli: {Math.floor(personalUnits / 2)} sbloccati</span>
                                    )}
                                    <span>Business</span>
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="group px-10 py-4 sm:px-12 sm:py-5 bg-white text-black rounded-full font-black text-lg sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] flex items-center gap-3"
                            >
                                PROCEDI <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: DUPLICATION */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="w-full flex flex-col items-center space-y-8 sm:space-y-12 py-8"
                        >
                            <div className="space-y-3">
                                <h2 className="text-3xl sm:text-6xl font-black tracking-tighter leading-none text-center">
                                    FORZA DELLA <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">DUPLICAZIONE.</span>
                                </h2>
                                <p className="text-white/50 font-medium text-base sm:text-lg max-w-md mx-auto text-center">
                                    Cosa succede se ogni tua utenza diretta porta altre persone nel sistema?
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 w-full max-w-2xl mx-auto">
                                {networkSize.map((count, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`p-3 sm:p-4 rounded-2xl border ${i === 0 ? 'bg-white/10 border-white/20' : 'bg-white/5 border-white/5'} flex flex-col items-center justify-center`}
                                    >
                                        <span className="text-[10px] font-bold text-white/30 uppercase mb-1 sm:mb-2">Lvl {i}</span>
                                        <span className="text-base sm:text-2xl font-black text-white">{count > 1000 ? (count / 1000).toFixed(1) + 'k' : count}</span>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-[2rem] sm:rounded-[3rem] space-y-6 sm:space-y-8 w-full max-w-md mx-auto">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs sm:text-sm font-black text-white/50 uppercase tracking-widest">Fattore X</span>
                                    <span className="text-3xl sm:text-5xl font-black text-purple-400">x{duplicationFactor}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="6"
                                    value={duplicationFactor}
                                    onChange={(e) => setDuplicationFactor(parseInt(e.target.value))}
                                    className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-purple-500"
                                />
                                <p className="text-[10px] sm:text-xs text-purple-400/60 font-medium italic text-center px-4">
                                    "Ognuno porta {duplicationFactor} persone. Questo è il segreto della crescita esponenziale."
                                </p>
                            </div>

                            <button
                                onClick={() => setStep(3)}
                                className="group px-10 py-4 sm:px-12 sm:py-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-black text-lg sm:text-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(124,58,237,0.3)] flex items-center gap-3 mx-auto"
                            >
                                SCOPRI IL POTENZIALE <Sparkles size={24} className="animate-pulse" />
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 3: REVEAL */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full flex flex-col items-center py-8"
                        >
                            <div ref={reportRef} className="w-full flex flex-col items-center p-4 sm:p-8 rounded-[2rem] sm:rounded-[3rem] relative overflow-hidden text-center">
                                <div className="absolute inset-0 bg-gradient-to-b from-union-green-500/10 to-transparent pointer-events-none" />

                                <h3 className="text-base sm:text-xl font-bold text-union-green-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-4">La Tua Rendita Stimata</h3>

                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    className="text-6xl sm:text-[140px] font-black leading-none tracking-tighter text-white drop-shadow-[0_0_40px_rgba(34,197,94,0.4)] mb-8"
                                >
                                    € {totalEarnings.toLocaleString('it-IT', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </motion.div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-xl">
                                    <div className="p-5 sm:p-6 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-xl">
                                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                            <Zap size={20} className="text-yellow-400" />
                                            <span className="text-[10px] sm:text-xs font-black text-white/50 uppercase">Effetto Road to Zero</span>
                                        </div>
                                        <p className="text-base sm:text-lg font-bold">
                                            {totalEarnings > 300 ? "Tutte le tue bollette sono ora GRATIS!" : "Hai abbattuto il 50% delle tue spese fisse!"}
                                        </p>
                                    </div>
                                    <div className="p-5 sm:p-6 bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl backdrop-blur-xl">
                                        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                            <Target size={20} className="text-union-green-400" />
                                            <span className="text-[10px] sm:text-xs font-black text-white/50 uppercase">Prossimo Step</span>
                                        </div>
                                        <p className="text-base sm:text-lg font-bold">Porta il fattore a x{duplicationFactor + 1} per raddoppiare.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-4 w-full max-w-md px-4">
                                <button
                                    onClick={handleShare}
                                    className="w-full sm:flex-1 px-8 py-4 sm:py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                                >
                                    <Share2 size={20} /> CONDIVIDI
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full sm:flex-1 px-8 py-4 sm:py-5 bg-union-green-500 hover:bg-union-green-600 text-white rounded-2xl font-black text-lg sm:text-xl shadow-lg shadow-union-green-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    FISSALO <Check size={24} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* HINT */}
            <div className="p-8 text-center">
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                    <Info size={12} /> Basato su commissioni ricorrenti mensili medie
                </p>
            </div>
        </div>
    );
};
