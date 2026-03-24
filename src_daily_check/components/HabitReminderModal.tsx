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
    currentCount?: number;
    onComplete: (stackId: string, count: number) => void;
    onSnooze: (stackId: string) => void;
    onClose: () => void;
}

const HabitReminderModal: React.FC<HabitReminderModalProps> = ({
    isOpen,
    stack,
    customLabels,
    currentCount = 0,
    onComplete,
    onSnooze,
    onClose
}) => {
    const [showSuccess, setShowSuccess] = useState(false);
    const [countToAdd, setCountToAdd] = useState(1);

    useEffect(() => {
        if (isOpen && stack) {
            setShowSuccess(false);
            const remaining = Math.max(1, (stack.targetCount || 0) - (currentCount || 0));
            setCountToAdd(remaining);
        }
    }, [isOpen, stack, currentCount]);

    if (!stack) return null;

    const actionText = stack.action === 'CUSTOM' 
        ? stack.customActionName 
        : (customLabels?.[stack.action as ActivityType] || ACTIVITY_LABELS[stack.action as ActivityType] || 'Azione');
    
    const safeTarget = stack.targetCount || 0;
    const countText = safeTarget > 0 ? `${safeTarget} ` : '';
    const fullActionText = `${countText}${actionText}`.trim();

    const isMissingActions = currentCount > 0;
    const titleText = isMissingActions 
        ? `Hai fatto i "${actionText}" mancanti?`
        : `Hai fatto "${fullActionText}"?`;

    const isGoalReached = safeTarget > 0 && (currentCount + countToAdd) >= safeTarget;
    const remaining = safeTarget > 0 ? Math.max(0, safeTarget - (currentCount + countToAdd)) : 0;

    const handleComplete = () => {
        setShowSuccess(true);
        if (isGoalReached) {
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, zIndex: 999999 });
        }
        setTimeout(() => {
            onComplete(stack.id, countToAdd);
            onClose();
        }, 2500);
    };

    const handleSnooze = () => {
        onSnooze(stack.id);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md" onClick={handleSnooze} />
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative w-full max-w-sm bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-2xl z-10 text-center border-2 border-orange-500/20">
                        {showSuccess ? (
                            <div className="py-8">
                                <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${isGoalReached ? 'from-orange-400 to-amber-500' : 'from-blue-400 to-blue-600'} rounded-full flex items-center justify-center text-white mb-6 shadow-xl`}>
                                    {isGoalReached ? <Sparkles className="w-10 h-10" /> : <Check className="w-10 h-10" />}
                                </div>
                                <h2 className="text-3xl font-black mb-4 leading-tight">
                                    {isGoalReached ? 'CAPOLAVORO!' : 'BRAVO! MA NON BASTA...'}
                                </h2>
                                <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">
                                    {isGoalReached 
                                        ? 'Obiettivo centrato! Sei un vero professionista.' 
                                        : `Registrate ${countToAdd} azioni. Ti mancano ancora ${remaining}! Sii più focalizzato e impegnati di più!`}
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-orange-500/20">
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                                    {titleText}
                                </h2>
                                <div className="flex items-center justify-center gap-6 mb-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700">
                                    <button 
                                        onClick={() => setCountToAdd(Math.max(1, countToAdd - 1))}
                                        className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-orange-500 hover:text-orange-500 transition-all font-black text-xl"
                                    >
                                        －
                                    </button>
                                    <span className="text-4xl font-black text-slate-900 dark:text-white w-12">{countToAdd}</span>
                                    <button 
                                        onClick={() => setCountToAdd(countToAdd + 1)}
                                        className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:border-orange-500 hover:text-orange-500 transition-all font-black text-xl"
                                    >
                                        ＋
                                    </button>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={handleComplete} 
                                        className="w-full py-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-2xl font-black text-lg shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform"
                                    >
                                        CONFERMA {countToAdd > 1 ? `${countToAdd} ` : ''}AZIONI
                                    </button>
                                    <button 
                                        onClick={handleSnooze} 
                                        className="w-full py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                    >
                                        NON ANCORA
                                    </button>
                                    <p className="text-[10px] text-slate-400 font-bold">(Riproponi tra 30 minuti)</p>
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
