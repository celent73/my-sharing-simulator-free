import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, Clock, X } from 'lucide-react';
import { HabitStack, ActivityType } from '../types';
import { ACTIVITY_LABELS } from '../constants';
import confetti from 'canvas-confetti';

interface HabitReminderModalProps {
    isOpen: boolean;
    stack: HabitStack | null;
    customLabels?: Record<ActivityType, string>;
    onComplete: (stackId: string) => void;
    onSnooze: (stackId: string) => void;
    onClose: () => void;
}

const HabitReminderModal: React.FC<HabitReminderModalProps> = ({
    isOpen,
    stack,
    customLabels,
    onComplete,
    onSnooze,
    onClose
}) => {
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowSuccess(false);
        }
    }, [isOpen]);

    if (!stack) return null;

    const actionText = stack.action === 'CUSTOM' 
        ? stack.customActionName 
        : (customLabels?.[stack.action as ActivityType] || ACTIVITY_LABELS[stack.action as ActivityType]);
    
    const countText = stack.targetCount > 0 ? `${stack.targetCount} ` : '';
    const fullActionText = `${countText}${actionText}`.trim();

    const handleComplete = () => {
        setShowSuccess(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#f97316', '#eab308', '#3b82f6'] // orange, yellow, blue
        });
        
        setTimeout(() => {
            onComplete(stack.id);
            onClose();
        }, 2000);
    };

    const handleSnooze = () => {
        onSnooze(stack.id);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md"
                        onClick={handleSnooze}
                    />
                    
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-2 border-orange-500/20 overflow-hidden text-center z-10"
                    >
                        {/* Decorative background */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[40px] translate-y-1/2 -translate-x-1/2"></div>

                        {showSuccess ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center py-8"
                            >
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white mb-6 shadow-xl shadow-orange-500/30">
                                    <Sparkles className="w-10 h-10" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                    OTTIMO LAVORO!
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-medium mt-2">
                                    Abitudine registrata con successo.
                                </p>
                            </motion.div>
                        ) : (
                            <>
                                <button 
                                    onClick={handleSnooze}
                                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-orange-500/20">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400 mb-2">
                                    Promemoria Habit Stacking
                                </p>
                                
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                                    Ehi! Hai già fatto "{fullActionText}"?
                                </h2>
                                
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8 mt-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                    Ricorda lo stack: <br/>Dopo <span className="text-orange-500">"{stack.trigger}"</span>
                                </p>

                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={handleComplete}
                                        className="w-full py-4 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-2xl font-black text-lg transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
                                    >
                                        <Check className="w-6 h-6" />
                                        SÌ, FATTO!
                                    </button>
                                    
                                    <button
                                        onClick={handleSnooze}
                                        className="w-full py-4 px-6 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Clock className="w-5 h-5" />
                                        Non ancora
                                    </button>
                                    <p className="text-[10px] text-slate-400 -mt-1 font-bold">(Ricordamelo tra 30 minuti)</p>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default HabitReminderModal;
