import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Send, Loader2, Clipboard, ArrowRight } from 'lucide-react';
import { parseLeadFromText } from '../services/aiCoachingService';
import { ActivityType } from '../types';

interface QuickAddWidgetProps {
    onOpenLeadCapture: (type: ActivityType, initialData: any) => void;
}

const QuickAddWidget: React.FC<QuickAddWidgetProps> = ({ onOpenLeadCapture }) => {
    const [text, setText] = useState('');
    const [isParsing, setIsParsing] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleParse = async () => {
        if (!text.trim()) return;
        
        setIsParsing(true);
        try {
            const parsedData = await parseLeadFromText(text);
            // Safe Fallback: Even if parsing fails (null), we open the modal with raw text in notes.
            onOpenLeadCapture(ActivityType.CONTACTS, {
                name: parsedData?.name || '',
                phone: parsedData?.phone || '',
                note: parsedData?.note || text, 
                status: 'pending'
            });
            setText('');
            setIsExpanded(false);
        } catch (error) {
            console.error("Quick add error:", error);
        } finally {
            setIsParsing(false);
        }
    };

    const handlePaste = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText();
            setText(clipboardText);
            if (!isExpanded) setIsExpanded(true);
        } catch (err) {
            console.error('Failed to read clipboard', err);
        }
    };

    return (
        <div className="w-full">
            <motion.div 
                layout
                className={`bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-2xl overflow-hidden transition-all duration-500 ${isExpanded ? 'p-8' : 'p-4'}`}
            >
                {!isExpanded ? (
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                <Zap size={20} fill="currentColor" />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Inserimento Rapido Leads</h4>
                                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Incolla un messaggio per estrarre nome e numero</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setIsExpanded(true)}
                            className="px-4 py-2 bg-slate-100 dark:bg-white/10 hover:bg-indigo-500 hover:text-white rounded-xl transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                            Apri
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                    <Zap size={20} fill="currentColor" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Smart AI Entry</h3>
                            </div>
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => setText("Ciao, sono Marco Rossi, il mio numero è 3331234567, chiamami domani per l'offerta.")}
                                    className="text-[9px] font-black uppercase text-indigo-500 hover:text-indigo-600 bg-indigo-500/10 px-2 py-1 rounded-md transition-colors"
                                >
                                    Provalo con un esempio 💡
                                </button>
                                <button 
                                    onClick={() => setIsExpanded(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                                >
                                    <ArrowRight className="rotate-180" size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Esempio: Ciao, sono Luca Rossi, il mio numero è 3331234567, chiamami domani..."
                                className="w-full h-32 bg-slate-100/50 dark:bg-white/5 border-2 border-transparent focus:border-indigo-500 rounded-[1.5rem] p-4 text-sm font-medium text-slate-900 dark:text-white outline-none transition-all resize-none placeholder:text-slate-400"
                            />
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button 
                                    onClick={handlePaste}
                                    className="p-3 bg-white dark:bg-slate-800 text-slate-500 rounded-xl shadow-md hover:text-indigo-500 transition-colors"
                                    title="Incolla dagli appunti"
                                >
                                    <Clipboard size={18} />
                                </button>
                                <button
                                    onClick={handleParse}
                                    disabled={!text.trim() || isParsing}
                                    className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl transition-all active:scale-95 ${
                                        text.trim() && !isParsing 
                                        ? 'bg-indigo-500 text-white shadow-indigo-500/20' 
                                        : 'bg-slate-200 dark:bg-white/10 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    {isParsing ? (
                                        <Loader2 size={16} className="animate-spin" />
                                    ) : (
                                        <Send size={16} />
                                    )}
                                    {isParsing ? 'Analisi...' : 'Crea Contatto'}
                                </button>
                            </div>
                        </div>

                        <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
                            L'IA estrarrà nome, numero e note in automatico. ✨
                        </p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default QuickAddWidget;
