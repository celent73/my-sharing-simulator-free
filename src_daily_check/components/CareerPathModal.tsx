import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CareerPathModalProps {
    isOpen: boolean;
    onClose: () => void;
    isEmbedded?: boolean;
}

const CAREER_STAGES = [
    { name: "Family pro", color: "#d21183" }, // Pink
    { name: "Family pro 3x3", color: "#815545" }, // Brown
    { name: "Family 3s", color: "#8000ff" }, // Purple
    { name: "Family 5s", color: "#1147e6" }, // Blue
    { name: "Top family", color: "#00c3eb" }, // Light Blue
    { name: "Pro manager", color: "#54cdb4" }, // Teal
    { name: "Regional manager", color: "#00b21a" }, // Green
    { name: "National manager", color: "#8fff33" }, // Light Green
    { name: "Director", color: "#e6e600" }, // Yellow
    { name: "Director pro", color: "#c88536" }, // Orange/Brown
    { name: "Ambassador", color: "#b3b3b3" }, // Light Gray
    { name: "President", color: "#c8b335" }  // Gold
];

const CareerPathModal: React.FC<CareerPathModalProps> = ({ isOpen, onClose, isEmbedded = false }) => {
    const [dates, setDates] = useState<Record<string, string>>({});
    const [selectedStageIndex, setSelectedStageIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen || isEmbedded) {
            const saved = localStorage.getItem('dailyCheck_careerPathDates');
            if (saved) {
                try {
                    setDates(JSON.parse(saved));
                } catch (e) {
                    console.error("Error loading career dates", e);
                }
            }
        }
    }, [isOpen, isEmbedded]);

    const handleDateChange = (stageName: string, newDate: string) => {
        const updated = { ...dates };
        if (newDate) {
            updated[stageName] = newDate;
        } else {
            delete updated[stageName];
        }
        setDates(updated);
        localStorage.setItem('dailyCheck_careerPathDates', JSON.stringify(updated));
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

            {/* Game Path Content */}
            <div className="relative z-10 flex-1 overflow-y-auto scrollbar-hide py-16 px-4 md:px-8">
                <div className="flex flex-col items-center max-w-sm mx-auto pb-32">
                    {CAREER_STAGES.map((stage, index) => {
                        const isFilled = !!dates[stage.name];
                        const isCurrent = !isFilled && (index === 0 || !!dates[CAREER_STAGES[index - 1].name]);
                        const isFuture = !isFilled && !isCurrent;
                        const isLeft = index % 2 === 0;

                        const isNextFilled = index < CAREER_STAGES.length - 1 && !!dates[CAREER_STAGES[index + 1].name];
                        const pathColor = isNextFilled || isFilled ? (isNextFilled ? CAREER_STAGES[index + 1].color : stage.color) : "rgba(255,255,255,0.1)";

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

                                    <div className={`absolute top-1/2 -translate-y-1/2 flex flex-col justify-center ${isLeft ? 'left-full ml-4 sm:ml-6 items-start text-left' : 'right-full mr-4 sm:mr-6 items-end text-right'} w-40 pointer-events-none`}>
                                        <h3
                                            className={`text-sm md:text-base font-black leading-tight drop-shadow-md transition-colors ${isFuture ? 'text-slate-500' : 'text-white'}`}
                                            style={(isFilled || isCurrent) ? { color: stage.color, textShadow: `0 0 10px ${stage.color}80` } : {}}
                                        >
                                            {stage.name}
                                        </h3>
                                        {isFilled && (
                                            <div className="mt-1 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10 inline-flex items-center gap-1.5 shadow-xl">
                                                <span className="text-[10px] sm:text-xs font-bold text-white/90 whitespace-nowrap">
                                                    {new Date(dates[stage.name]).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: isFuture ? 1 : 1.1 }}
                                        whileTap={{ scale: isFuture ? 1 : 0.95 }}
                                        onClick={() => !isFuture && setSelectedStageIndex(index)}
                                        className={`relative w-24 h-24 sm:w-[7rem] sm:h-[7rem] rounded-full flex items-center justify-center border-4 shadow-xl transition-all duration-300 z-20 ${isFuture ? 'cursor-not-allowed grayscale-[0.8] opacity-70' : 'cursor-pointer hover:shadow-2xl'}`}
                                        style={{
                                            backgroundColor: isFilled ? stage.color : isCurrent ? `${stage.color}20` : '#1e293b',
                                            borderColor: isFilled ? '#ffffff' : isCurrent ? stage.color : '#334155',
                                            boxShadow: (isFilled || isCurrent) ? `0 0 25px ${stage.color}60, inset 0 0 20px ${stage.color}40` : 'none'
                                        }}
                                    >
                                        {isCurrent && (
                                            <span className="absolute inset-0 rounded-full animate-ping opacity-40 border-2" style={{ borderColor: stage.color }}></span>
                                        )}

                                        {isFilled ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-14 sm:w-14 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
                        className="absolute inset-0 z-[200] flex items-center justify-center p-4 bg-black/60"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="absolute inset-0 backdrop-blur-sm cursor-pointer" onClick={() => setSelectedStageIndex(null)}></div>

                        <motion.div
                            className="w-full max-w-sm bg-slate-800 rounded-3xl p-6 shadow-2xl border border-white/20 relative overflow-hidden z-10"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 right-0 h-2 shadow-[0_0_15px_currentColor]" style={{ backgroundColor: selectedStage.color, color: selectedStage.color }}></div>

                            <h3 className="text-2xl font-black text-white mt-3 mb-2 drop-shadow-md" style={{ color: selectedStage.color }}>
                                {selectedStage.name}
                            </h3>
                            <p className="text-sm text-slate-300 mb-6 font-medium">
                                {dates[selectedStage.name] ? "Hai già inserito una data per questo traguardo. Desideri aggiornarla?" : "Imposta la data stimata in cui prevedi di raggiungere questo obiettivo."}
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Seleziona Data</label>
                                    <div className="relative flex items-center">
                                        <input
                                            type="date"
                                            value={dates[selectedStage.name] || ''}
                                            onChange={(e) => handleDateChange(selectedStage.name, e.target.value)}
                                            className="w-full bg-slate-900 border-2 border-slate-700/50 rounded-xl pl-4 pr-12 py-3.5 text-white font-black text-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all shadow-inner"
                                        />
                                        {dates[selectedStage.name] && (
                                            <button
                                                onClick={() => handleDateChange(selectedStage.name, '')}
                                                className="absolute right-3 p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
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
