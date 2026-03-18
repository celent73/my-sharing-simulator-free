import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Target, TrendingUp, X, ChevronRight, AlertCircle, Calendar } from 'lucide-react';

export type ReminderType = 'DAILY_MISSING' | 'WEEKLY_GOAL_NOT_REACHED' | 'MORNING_MOTIVATION';

interface GoalReminderModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: ReminderType;
    onGoToInput: () => void;
    dailyTarget?: number;
    weeklyTarget?: number;
    isSaturday?: boolean;
}

const GoalReminderModal: React.FC<GoalReminderModalProps> = ({ isOpen, type, onClose, onGoToInput, dailyTarget, weeklyTarget, isSaturday }) => {
    if (!isOpen) return null;

    const content = {
        DAILY_MISSING: {
            title: "Azione Giornaliera!",
            subtitle: "Non fermarti proprio ora",
            message: "La giornata sta per finire e non hai ancora registrato nessuna attività. Basta anche un solo contatto per mantenere attiva la tua serie!",
            icon: <Bell className="w-10 h-10 text-orange-500" />,
            buttonText: "Registra Attività",
            gradient: "from-orange-500/10 to-transparent",
            iconBg: "bg-orange-500/10",
            glowColor: "rgba(249, 115, 22, 0.4)",
            btnGradient: "from-orange-500 to-red-600 shadow-orange-500/25"
        },
        WEEKLY_GOAL_NOT_REACHED: {
            title: "Obiettivo Settimanale",
            subtitle: "Ultimo sforzo!",
            message: "La settimana si sta chiudendo e sei vicino ai tuoi obiettivi. Controlla cosa ti manca per completare la tua sfida settimanale!",
            icon: <Target className="w-10 h-10 text-blue-500" />,
            buttonText: "Vedi Obiettivi",
            gradient: "from-blue-500/10 to-transparent",
            iconBg: "bg-blue-500/10",
            glowColor: "rgba(59, 130, 246, 0.4)",
            btnGradient: "from-blue-500 to-indigo-600 shadow-blue-500/25"
        },
        MORNING_MOTIVATION: {
            title: isSaturday ? "Sforzo Finale!" : "Buongiorno Campione!",
            subtitle: isSaturday ? "CHIUDI LA SETTIMANA" : "Inizia alla grande",
            message: isSaturday && weeklyTarget
                ? `È sabato! Il tuo obiettivo settimanale è di ${weeklyTarget} contatti. Quanti ne mancano per vincere la sfida della settimana? Mettiamocela tutta!`
                : (dailyTarget 
                    ? `Oggi il tuo obiettivo è superare i ${dailyTarget} contatti. Sei pronto a vincere questa sfida? Ricorda: ogni grande traguardo nasce da un piccolo passo!`
                    : "Una nuova giornata è iniziata! Qual è il tuo obiettivo per oggi? Ricorda che ogni grande traguardo inizia con un piccolo passo. Mettiamoci al lavoro!"),
            icon: isSaturday ? <Target className="w-10 h-10 text-emerald-500" /> : <TrendingUp className="w-10 h-10 text-emerald-500" />,
            buttonText: isSaturday ? "Vinci la Settimana" : "Inizia Ora",
            gradient: "from-emerald-500/10 to-transparent",
            iconBg: "bg-emerald-500/10",
            glowColor: "rgba(16, 185, 129, 0.4)",
            btnGradient: "from-emerald-500 to-teal-600 shadow-emerald-500/25"
        }
    }[type];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                    onClick={onClose}
                />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative w-full max-w-sm bg-white/95 dark:bg-slate-900/95 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/20"
                >
                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="absolute top-6 right-6 z-[120] p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <div className="p-8 pb-4 flex flex-col items-center text-center relative overflow-hidden">
                        <div className={`absolute top-0 left-0 w-full h-24 bg-gradient-to-b ${content.gradient}`} />

                        <div className={`h-20 w-20 rounded-3xl ${content.iconBg} flex items-center justify-center mb-4 relative`}>
                            {content.icon}
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className={`absolute inset-0 rounded-3xl blur-xl`}
                                style={{ backgroundColor: content.glowColor }}
                            />
                        </div>

                        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-1">{content.title}</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]">{content.subtitle}</p>
                    </div>

                    {/* Content */}
                    <div className="px-8 pb-8 text-center">
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            {content.message}
                        </p>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-800/20 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={onGoToInput}
                                className={`w-full py-4 px-6 rounded-2xl font-black text-white bg-gradient-to-br ${content.btnGradient} shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all`}
                            >
                                {content.buttonText} <ChevronRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 px-6 rounded-2xl font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 active:scale-95 transition-all text-sm"
                            >
                                Domani lo faccio
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default GoalReminderModal;
