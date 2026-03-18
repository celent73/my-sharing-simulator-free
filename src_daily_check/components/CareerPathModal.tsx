import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RotateCcw } from 'lucide-react';

interface CareerPathModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEmbedded?: boolean;
    userId?: string | null;
    careerDates?: Record<string, string>;
    onUpdateDates?: (dates: Record<string, string>) => void;
    onResetAll?: () => void;
    manualQualification?: string | null;
    onResetQualification?: () => void;
    currentLevelName?: string;
}

import { saveCareerDates } from '../services/storageService';

const CAREER_STAGES = [
    { name: "Family Pro", color: "#ec4899" }, // Vibrant Pink
    { name: "Family pro 3x3", color: "#815545" }, // Brown
    { name: "Family 3S", color: "#8000ff" }, // Purple
    { name: "Family 5S", color: "#1147e6" }, // Blue
    { name: "Top family", color: "#00c3eb" }, // Light Blue
    { name: "Pro Manager", color: "#54cdb4" }, // Teal
    { name: "Regional Manager", color: "#00b21a" }, // Green
    { name: "National Manager", color: "#8fff33" }, // Light Green
    { name: "Director", color: "#e6e600" }, // Yellow
    { name: "Director Pro", color: "#c88536" }, // Orange/Brown
    { name: "Ambassador", color: "#b3b3b3" }, // Light Gray
    { name: "President", color: "#c8b335" }  // Gold
];

const CareerPathModal: React.FC<CareerPathModalProps> = ({
    isOpen,
    onClose,
    isEmbedded = false,
    userId,
    careerDates,
    onUpdateDates,
    onResetAll,
    manualQualification,
    onResetQualification,
    currentLevelName
}) => {
    const [dates, setDates] = useState<Record<string, string>>(careerDates || {});
    const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);

    useEffect(() => {
        if (careerDates) {
            setDates(careerDates);
        }
    }, [careerDates]);

    const handleDateChange = (stageName: string, newDate: string) => {
        const updated = { ...dates };
        if (newDate) {
            updated[stageName] = newDate;
        } else {
            delete updated[stageName];
        }
        setDates(updated);
        saveCareerDates(userId || null, updated);
        if (onUpdateDates) onUpdateDates(updated);
        window.dispatchEvent(new Event('careerDatesUpdated'));
    };

    const handleResetIndividual = (stageName: string) => {
        // Reset the date if it exists
        if (dates[stageName]) {
            handleDateChange(stageName, "");
        }
        
        // Reset the manual qualification if it matches
        if (manualQualification && manualQualification.toLowerCase() === stageName.toLowerCase()) {
            if (onResetQualification) onResetQualification();
        }
    };

    const handleResetAll = async () => {
        if (confirm("Sei sicuro di voler azzerare tutti i traguardi raggiunti?")) {
            // Aggiorna immediatamente lo stato locale per reattività istantanea
            setDates({});
            
            if (onResetAll) {
                await onResetAll();
            } else {
                await saveCareerDates(userId || null, {});
                if (onUpdateDates) onUpdateDates({});
                window.dispatchEvent(new Event('careerDatesUpdated'));
            }
        }
    };

    if (!isOpen && !isEmbedded) return null;

    const selectedStage = selectedStageIndex !== null ? CAREER_STAGES[selectedStageIndex] : null;

    const content = (
        <div className={`relative w-full ${isEmbedded ? 'h-full' : 'h-full sm:h-[90vh] sm:max-w-2xl'} flex flex-col bg-slate-900 ${!isEmbedded ? 'sm:rounded-[2.5rem]' : 'rounded-3xl'} shadow-2xl overflow-hidden border-0 sm:border border-white/10`}>

            {/* Ambient Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-pulse-slow pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50 animate-pulse-slow animation-delay-2000 pointer-events-none"></div>

            {/* Header */}
            <div className="relative z-20 flex items-center justify-between p-6 bg-white/5 border-b border-white/10 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-sm">
                        Piano <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-none">Carriera</span>
                    </h2>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleResetAll}
                        className="flex items-center gap-2 py-2 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all border border-red-500/20 text-sm font-bold uppercase tracking-wider"
                    >
                        <RotateCcw className="h-4 w-4" />
                        Azzera Tutto
                    </button>
                    <button
                        onClick={onClose}
                        className="p-3 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-all border border-transparent hover:border-white/20 shadow-sm"
                        aria-label="Chiudi"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Game Path Content */}
            <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide py-16 px-4 md:px-8">
                <div className="flex flex-col items-center max-w-sm mx-auto pb-32">
                    {CAREER_STAGES.map((stage, index) => {
                        const isFilled = !!dates[stage.name];
                        const dateObj = isFilled ? new Date(dates[stage.name]) : null;
                        
                        // Determina se il traguardo è raggiunto (per data o per livello attuale impostato)
                        const currentLevelIndex = currentLevelName 
                            ? CAREER_STAGES.findIndex(s => s.name.toLowerCase() === currentLevelName.toLowerCase()) 
                            : -1;
                        
                        const isReached = (dateObj && dateObj <= new Date()) || (currentLevelIndex >= index);
                        
                        const isCurrent = !isReached && (index === 0 || (!!dates[CAREER_STAGES[index - 1].name] && new Date(dates[CAREER_STAGES[index-1].name]) <= new Date()) || (currentLevelIndex >= index - 1));
                        const isFuture = !isFilled && !isCurrent && !isReached;
                        const isLeft = index % 2 === 0;

                        const isNextFilled = index < CAREER_STAGES.length - 1 && !!dates[CAREER_STAGES[index + 1].name];
                        const nextDateObj = isNextFilled ? new Date(dates[CAREER_STAGES[index + 1].name]) : null;
                        const isNextReached = nextDateObj && nextDateObj <= new Date();
                        const pathColor = isNextReached || isReached ? (isNextReached ? CAREER_STAGES[index + 1].color : stage.color) : "rgba(255,255,255,0.1)";

                        return (
                            <div key={stage.name} className={`relative flex items-center justify-center w-full ${index > 0 ? 'mt-28 sm:mt-32' : ''}`}>

                                {/* SVG Connecting Path */}
                                {index < CAREER_STAGES.length - 1 && (
                                    <svg
                                        className="absolute w-[11rem] sm:w-[14rem] h-28 sm:h-32 top-10 pointer-events-none z-0"
                                        style={{
                                            left: '50%',
                                            transform: `translateX(-50%) ${isLeft ? '' : 'scaleX(-1)'}`,
                                        }}
                                        viewBox="0 0 100 100"
                                        preserveAspectRatio="none"
                                    >
                                        <path
                                            d="M 5,0 C 50,0 50,100 95,100"
                                            fill="none"
                                            stroke={pathColor}
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeDasharray={(!isFilled || !isNextFilled) && !isCurrent ? "6 8" : "none"}
                                            className={isCurrent ? 'animate-pulse' : ''}
                                        />
                                    </svg>
                                )}

                                <div className={`relative z-10 flex items-center justify-center ${isLeft ? '-translate-x-[5.5rem] sm:-translate-x-[7rem]' : 'translate-x-[5.5rem] sm:translate-x-[7rem]'}`}>

                                    <div className={`absolute top-1/2 -translate-y-1/2 flex flex-col justify-center ${isLeft ? 'left-full ml-4 sm:ml-6 items-start text-left' : 'right-full mr-4 sm:mr-6 items-end text-right'} w-40 pointer-events-auto`}>
                                        <h3
                                            className={`text-sm md:text-base font-black leading-tight drop-shadow-md transition-colors ${isFuture ? 'text-slate-500' : 'text-white'}`}
                                            style={(isFilled || isCurrent) ? { color: stage.color, textShadow: `0 0 10px ${stage.color}80` } : {}}
                                        >
                                            {stage.name}
                                        </h3>
                                        {(isFilled || (manualQualification && manualQualification.toLowerCase() === stage.name.toLowerCase())) && (
                                            <div className="mt-1 flex items-center gap-2">
                                                {isFilled && (
                                                    <div className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 inline-flex items-center gap-1.5 shadow-xl">
                                                        <span className="text-[10px] sm:text-xs font-bold text-white/90 whitespace-nowrap">
                                                            {new Date(dates[stage.name]).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleResetIndividual(stage.name);
                                                    }}
                                                    className="p-1.5 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-500 transition-all border border-red-500/20 shadow-lg"
                                                    title="Azzera questa qualifica"
                                                >
                                                    <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                        <motion.button
                                            whileHover={{ scale: isFuture ? 1 : 1.1 }}
                                            whileTap={{ scale: isFuture ? 1 : 0.95 }}
                                            onClick={() => !isFuture && setSelectedStageIndex(index)}
                                            className={`relative w-24 h-24 sm:w-[7rem] sm:h-[7rem] rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-300 z-20 ${isFuture ? 'cursor-not-allowed grayscale-[0.8] opacity-70' : 'cursor-pointer hover:shadow-2xl'}`}
                                            style={{
                                                backgroundColor: isReached ? stage.color : (isFilled || isCurrent) ? `${stage.color}20` : '#1e293b',
                                                borderColor: isReached ? '#ffffff' : (isFilled || isCurrent) ? stage.color : '#334155',
                                                boxShadow: (isFilled || isCurrent) ? `0 0 25px ${stage.color}60, inset 0 0 20px ${stage.color}40` : 'none'
                                            }}
                                        >
                                            {isCurrent && (
                                                <span className="absolute inset-0 rounded-full animate-ping opacity-40 border-2" style={{ borderColor: stage.color }}></span>
                                            )}

                                            {isReached ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-14 sm:w-14 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : isFilled ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            ) : isFuture ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            ) : (
                                                <span className="text-3xl sm:text-5xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                                                    {index + 1}
                                                </span>
                                            )}
                                        </motion.button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Popup Modal for Date Entry */}
            <AnimatePresence>
                {selectedStage !== null && (
                    <motion.div
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedStageIndex(null)}></div>

                        <motion.div
                            className="w-full max-w-sm bg-slate-800 rounded-3xl p-6 shadow-2xl border border-white/20 relative overflow-hidden z-10"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 right-0 h-2 shadow-[0_0_15px_currentColor]" style={{ backgroundColor: selectedStage.color, color: selectedStage.color }}></div>

                            <button
                                onClick={() => setSelectedStageIndex(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-transparent hover:border-white/10 z-20"
                                aria-label="Chiudi"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            <h3 className="text-2xl font-black text-white mt-3 mb-2 drop-shadow-md" style={{ color: selectedStage.color }}>
                                {selectedStage.name}
                            </h3>
                            <p className="text-sm text-slate-300 mb-6 font-medium">
                                {dates[selectedStage.name] ? "Hai già inserito una data per questo traguardo. Desideri aggiornarla?" : "Imposta la data stimata in cui prevedi di raggiungere questo obiettivo."}
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Seleziona Data</label>
                                    <div className="relative flex items-center group bg-slate-900 border-2 border-slate-700/50 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/20 transition-all shadow-inner">
                                        <input
                                            type="date"
                                            value={dates[selectedStage.name] || ''}
                                            onChange={(e) => handleDateChange(selectedStage.name, e.target.value)}
                                            style={{ colorScheme: 'dark' }}
                                            className="w-full bg-transparent pl-4 pr-12 py-3.5 text-white !text-white font-black text-lg focus:outline-none relative z-10 min-h-[56px]"
                                        />
                                        {!dates[selectedStage.name] && (
                                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-0">
                                                <span className="text-white/40 font-black text-lg tracking-normal uppercase">gg/mm/aaaa</span>
                                            </div>
                                        )}
                                        {dates[selectedStage.name] && (
                                            <button
                                                onClick={() => handleDateChange(selectedStage.name, '')}
                                                className="absolute right-3 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors z-20"
                                                title="Cancella data"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedStageIndex(null)}
                                    className="w-full py-3.5 rounded-xl font-black text-white shadow-lg transition-transform active:scale-95 text-lg"
                                    style={{ backgroundColor: selectedStage.color, boxShadow: `0 4px 15px ${selectedStage.color}80` }}
                                >
                                    Conferma
                                </button>

                                {(dates[selectedStage.name] || (manualQualification && manualQualification.toLowerCase() === selectedStage.name.toLowerCase())) && (
                                    <button
                                        onClick={() => {
                                            handleResetIndividual(selectedStage.name);
                                            setSelectedStageIndex(null);
                                        }}
                                        className="w-full py-3.5 rounded-xl font-black text-white bg-red-500 shadow-lg shadow-red-500/30 transition-transform active:scale-95 text-lg"
                                    >
                                        Azzera Traguardo
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );

    if (isEmbedded) return content;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6 bg-slate-900/80 backdrop-blur-md animate-fade-in">
            {content}
        </div>
    );
};

export default CareerPathModal;
