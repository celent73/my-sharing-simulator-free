import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, RotateCcw, Target as TargetIcon, X } from 'lucide-react';

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
    targetQualification?: string | null;
    onUpdateTarget?: (qualification: string | null) => void;
}

  

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
    currentLevelName,
    targetQualification,
    onUpdateTarget
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
        if (onUpdateDates) onUpdateDates(updated);
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
                if (onUpdateDates) onUpdateDates({});
            }
        }
    };

    if (!isOpen && !isEmbedded) return null;

    const selectedStage = selectedStageIndex !== null ? CAREER_STAGES[selectedStageIndex] : null;

    const content = (
        <div className={`relative w-full ${isEmbedded ? 'h-full' : 'h-full sm:h-[90vh] sm:max-w-2xl'} flex flex-col bg-slate-900 ${!isEmbedded ? 'sm:rounded-[2.5rem]' : 'rounded-3xl'} shadow-2xl overflow-hidden border-0 sm:border border-white/10`}>

            {/* Ambient Nebula Effect - More Dynamic */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ 
                        x: [0, 100, 0], 
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" 
                />
                <motion.div 
                    animate={{ 
                        x: [0, -80, 0], 
                        y: [0, 100, 0],
                        scale: [1, 1.3, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-48 -left-24 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[140px]" 
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/50 via-transparent to-slate-950/50 shadow-inner"></div>
            </div>

            {/* Header - More Elegant Apple Style */}
            <div className="relative z-30 flex items-center justify-between p-6 bg-slate-900/40 border-b border-white/5 backdrop-blur-xl">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] border border-white/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight leading-none">
                            Piano <span className="text-blue-400">Carriera</span>
                        </h2>
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Sviluppo RoadMap</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleResetAll}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-red-500/10 group"
                    >
                        <RotateCcw className="h-3.5 w-3.5 group-hover:rotate-[-45deg] transition-transform" />
                        Azzera
                    </button>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center transition-all border border-white/5 active:scale-95"
                        aria-label="Chiudi"
                    >
                        <X className="h-5 w-5" />
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
                        const isTarget = targetQualification && targetQualification.toLowerCase() === stage.name.toLowerCase();
                        
                        const isCurrent = !isReached && (index === 0 || (!!dates[CAREER_STAGES[index - 1].name] && new Date(dates[CAREER_STAGES[index-1].name]) <= new Date()) || (currentLevelIndex >= index - 1));
                        const isFuture = !isFilled && !isCurrent && !isReached;
                        const isLeft = index % 2 === 0;

                        const isNextFilled = index < CAREER_STAGES.length - 1 && !!dates[CAREER_STAGES[index + 1].name];
                        const nextDateObj = isNextFilled ? new Date(dates[CAREER_STAGES[index + 1].name]) : null;
                        const isNextReached = nextDateObj && nextDateObj <= new Date();
                        const pathColor = isNextReached || isReached ? (isNextReached ? CAREER_STAGES[index + 1].color : stage.color) : "rgba(255,255,255,0.1)";

                        return (
                            <div key={stage.name} className={`relative flex items-center justify-center w-full ${index > 0 ? 'mt-28 sm:mt-32' : ''}`}>

                                {/* SVG Connecting Path - Improved with Data Flow */}
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
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            className="opacity-20"
                                        />
                                        {(isReached || isNextReached) && (
                                            <motion.path
                                                d="M 5,0 C 50,0 50,100 95,100"
                                                fill="none"
                                                stroke={pathColor}
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                initial={{ pathLength: 0 }}
                                                animate={{ pathLength: 1 }}
                                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                                style={{ filter: `drop-shadow(0 0 8px ${pathColor})` }}
                                            />
                                        )}
                                        {/* Animated Dash Path for current progress */}
                                        {isCurrent && (
                                            <motion.path
                                                d="M 5,0 C 50,0 50,100 95,100"
                                                fill="none"
                                                stroke={stage.color}
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeDasharray="4 10"
                                                animate={{ strokeDashoffset: [0, -100] }}
                                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                                className="opacity-50"
                                            />
                                        )}
                                    </svg>
                                )}

                                <div className={`relative z-10 flex items-center justify-center ${isLeft ? '-translate-x-[5.5rem] sm:-translate-x-[7rem]' : 'translate-x-[5.5rem] sm:translate-x-[7rem]'}`}>

                                    <div className={`absolute top-1/2 -translate-y-1/2 flex flex-col justify-center ${isLeft ? 'left-full ml-6 sm:ml-8 items-start text-left' : 'right-full mr-6 sm:mr-8 items-end text-right'} w-44 pointer-events-auto`}>
                                        <div className={`p-3 rounded-2xl backdrop-blur-md border transition-all duration-500 ${isReached ? 'bg-white/10 border-white/20' : isCurrent ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-slate-900/40 border-white/5'} shadow-2xl`}>
                                            <h3
                                                className="text-sm font-black tracking-tight"
                                                style={(isFilled || isCurrent || isTarget) ? { color: stage.color } : { color: '#94a3b8' }}
                                            >
                                                {stage.name}
                                                {isTarget && (
                                                  <span className="ml-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-500 text-[8px] uppercase font-black border border-amber-500/30">
                                                    Target
                                                  </span>
                                                )}
                                            </h3>
                                            
                                            {(isFilled || (manualQualification && manualQualification.toLowerCase() === stage.name.toLowerCase())) && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    {isFilled && (
                                                        <div className="px-2 py-0.5 rounded-full bg-slate-950/60 border border-white/10 flex items-center gap-1 shadow-inner">
                                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage.color }}></div>
                                                            <span className="text-[10px] font-black text-white/60 lowercase tracking-tight">
                                                                {new Date(dates[stage.name]).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResetIndividual(stage.name);
                                                        }}
                                                        className="p-1.5 rounded-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white transition-all border border-red-500/10 active:scale-90"
                                                        title="Azzera questa qualifica"
                                                    >
                                                        <Trash2 size={10} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                        <motion.button
                                            whileHover={{ scale: 1.15, rotate: 5 }}
                                            whileTap={{ scale: 0.9 }}
                                            animate={(isCurrent || isTarget) ? { 
                                                y: [0, -8, 0],
                                                scale: [1, 1.05, 1],
                                                rotate: isCurrent ? [0, 2, -2, 0] : 0
                                            } : {}}
                                            transition={isCurrent || isTarget ? { 
                                                duration: 4, 
                                                repeat: Infinity, 
                                                ease: "easeInOut" 
                                            } : {}}
                                            onClick={() => setSelectedStageIndex(index)}
                                            className={`relative w-24 h-24 sm:w-[7.5rem] sm:h-[7.5rem] rounded-full flex items-center justify-center border transition-all duration-500 z-20 backdrop-blur-md overflow-hidden ${isFuture ? 'opacity-40 grayscale-[0.8]' : 'cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)]'}`}
                                            style={{
                                                backgroundColor: isReached ? stage.color : (isFilled || isCurrent || isTarget) ? `${stage.color}15` : 'rgba(15,23,42,0.6)',
                                                borderColor: isReached ? '#ffffff' : (isFilled || isCurrent || isTarget) ? `${stage.color}40` : 'rgba(255,255,255,0.05)',
                                            }}
                                        >
                                            {/* Aura for Active Node */}
                                            {(isCurrent || isTarget) && (
                                                <div 
                                                    className="absolute inset-0 animate-pulse-slow opacity-30 blur-xl"
                                                    style={{ backgroundColor: stage.color }}
                                                ></div>
                                            )}

                                            {/* Classic Ping Effect (like before) */}
                                            {(isCurrent || isTarget) && (
                                                <span 
                                                    className="absolute inset-0 rounded-full animate-ping opacity-60 border-4 z-0" 
                                                    style={{ borderColor: stage.color }}
                                                ></span>
                                            )}

                                            {/* External Pulsing Rings (New) */}
                                            {(isCurrent || isTarget) && (
                                                <>
                                                    <motion.div 
                                                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                                                        className="absolute inset-0 rounded-full border-2 pointer-events-none"
                                                        style={{ borderColor: stage.color }}
                                                    />
                                                    <motion.div 
                                                        animate={{ scale: [1, 1.2], opacity: [0.3, 0] }}
                                                        transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                                                        className="absolute inset-0 rounded-full border pointer-events-none"
                                                        style={{ borderColor: stage.color }}
                                                    />
                                                </>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>

                                            {isTarget && (
                                              <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-2 rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)] border-2 border-slate-900 z-30">
                                                <TargetIcon size={14} className="animate-bounce" />
                                              </div>
                                            )}

                                            {isReached ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-14 sm:w-14 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                                    <motion.path 
                                                        initial={{ pathLength: 0 }} 
                                                        animate={{ pathLength: 1 }}
                                                        strokeLinecap="round" 
                                                        strokeLinejoin="round" 
                                                        d="M5 13l4 4L19 7" 
                                                    />
                                                </svg>
                                            ) : isFilled ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            ) : isFuture ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 text-slate-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            ) : (
                                                <span 
                                                    className="text-4xl sm:text-6xl font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                                                    style={{ color: isCurrent ? 'white' : stage.color }}
                                                >
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
                                <div className="pt-2 border-t border-white/5 space-y-3">
                                  <button
                                      onClick={() => {
                                          if (onUpdateTarget) onUpdateTarget(selectedStage.name);
                                          setSelectedStageIndex(null);
                                      }}
                                      className="w-full py-3 px-4 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-900/40"
                                  >
                                      <TargetIcon size={18} />
                                      Imposta come Obiettivo
                                  </button>

                                  <button
                                      onClick={() => setSelectedStageIndex(null)}
                                      className="w-full py-3.5 rounded-xl font-black text-white shadow-lg transition-transform active:scale-95 text-lg"
                                      style={{ backgroundColor: selectedStage.color, boxShadow: `0 4px 15px ${selectedStage.color}80` }}
                                  >
                                      Conferma
                                  </button>
                                </div>

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
