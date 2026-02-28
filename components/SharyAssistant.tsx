import React, { useEffect, useState } from 'react';
import { useShary } from '../contexts/SharyContext';
import { Bot, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SharyAssistant: React.FC = () => {
    const { isActive, currentMessage, silence } = useShary();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (currentMessage) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [currentMessage]);

    if (!isActive) return null;

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="fixed bottom-24 left-4 sm:left-6 z-[9999] pointer-events-auto"
                >
                    <div className="flex items-end gap-3 sm:gap-4 max-w-[320px] sm:max-w-md relative">

                        {/* HUD AVATAR */}
                        <div className="relative w-14 h-14 sm:w-16 sm:h-16 shrink-0 group cursor-pointer">
                            {/* Outer rotating ring */}
                            <div className="absolute inset-[-4px] rounded-full border border-cyan-500/30 border-t-cyan-400 border-l-cyan-400 animate-[spin_4s_linear_infinite]" />
                            {/* Inner rotating ring (reverse) */}
                            <div className="absolute inset-[-8px] rounded-full border border-blue-500/20 border-b-blue-500 border-r-blue-500 animate-[spin_6s_linear_infinite_reverse]" />

                            {/* Core Avatar */}
                            <div className="w-full h-full rounded-full bg-slate-900 border border-cyan-500/50 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20" />
                                <Bot size={28} className="text-cyan-400 relative z-10 group-hover:scale-110 transition-transform duration-300" />

                                {/* Scanning line effect */}
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-300/80 blur-[1px] shadow-[0_0_8px_#67e8f9] animate-[scan_2s_ease-in-out_infinite]" />
                            </div>

                            {/* Status Indicator */}
                            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-500 border-2 border-slate-900"></span>
                            </span>
                        </div>

                        {/* SPEECH BUBBLE (HUD Panel) */}
                        <div className="bg-slate-900/90 backdrop-blur-xl p-4 sm:p-5 rounded-2xl sm:rounded-3xl rounded-bl-sm sm:rounded-bl-none shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-cyan-500/30 relative">
                            {/* Corner Accents */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-500 rounded-tl-xl sm:rounded-tl-2xl" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-500 rounded-br-2xl sm:rounded-br-3xl" />

                            <button
                                onClick={silence}
                                className="absolute -top-3 -right-3 bg-slate-800 rounded-full p-1.5 text-cyan-500/50 hover:text-cyan-400 hover:bg-slate-700 hover:shadow-[0_0_10px_rgba(6,182,212,0.3)] shadow-md border border-cyan-500/30 transition-all duration-300 z-10"
                            >
                                <X size={16} strokeWidth={3} />
                            </button>

                            <div className="flex items-start gap-2 mb-1">
                                <Zap size={14} className="text-cyan-400 mt-1 shrink-0 animate-pulse" />
                                <p className="text-sm sm:text-base text-cyan-50 font-medium leading-relaxed tracking-wide">
                                    {currentMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SharyAssistant;
