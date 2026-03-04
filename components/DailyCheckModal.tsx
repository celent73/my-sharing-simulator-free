import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import DailyCheckApp from '../src_daily_check/App';

export const DailyCheckModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Attach scroll listener to the INNER scroll container (main-scroll-container)
    // after DailyCheckApp has mounted — use a small delay to wait for DOM
    useEffect(() => {
        if (!isOpen) return;
        const timer = setTimeout(() => {
            const el = document.getElementById('main-scroll-container');
            if (!el) return;
            const onScroll = () => setShowScrollTop(el.scrollTop > 250);
            el.addEventListener('scroll', onScroll);
            return () => el.removeEventListener('scroll', onScroll);
        }, 500);
        return () => clearTimeout(timer);
    }, [isOpen]);

    const scrollToTop = () => {
        document.getElementById('main-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100000] flex items-center justify-center p-0 md:p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative w-full h-full md:max-w-full md:h-screen flex flex-col bg-slate-50 dark:bg-slate-900 shadow-none overflow-hidden"
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 1, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* CONTENT: Daily Check App */}
                        <div className="flex-grow overflow-y-auto w-full h-full relative scroll-smooth custom-scrollbar">
                            <DailyCheckApp onClose={onClose} />
                        </div>

                        {/* Scroll-to-top arrow */}
                        <AnimatePresence>
                            {showScrollTop && (
                                <motion.button
                                    key="scroll-top-btn"
                                    initial={{ opacity: 0, scale: 0.6 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.6 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                                    onClick={scrollToTop}
                                    aria-label="Torna su"
                                    style={{ position: 'absolute', bottom: 110, right: 24, zIndex: 9999 }}
                                    className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-500 active:scale-90 text-white shadow-2xl shadow-blue-500/50 transition-colors"
                                >
                                    <ChevronUp size={22} strokeWidth={3} />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
