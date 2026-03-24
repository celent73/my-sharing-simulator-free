import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp } from 'lucide-react';

const DailyCheckApp = lazy(() => import('../src_daily_check/App'));

export const DailyCheckModal: React.FC<{ isOpen: boolean; onClose: () => void; initialView?: string }> = ({ isOpen, onClose, initialView }) => {
    // Body scroll lock
    useEffect(() => {
        if (isOpen) {
            const originalStyle = window.getComputedStyle(document.body).overflow;
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
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
                        <div className="flex-grow overflow-hidden w-full h-full relative scroll-smooth custom-scrollbar">
                            <Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white"></div></div>}>
                                <DailyCheckApp onClose={onClose} initialView={initialView} />
                            </Suspense>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
