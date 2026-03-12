
import React, { useState, useMemo } from 'react';
import { Search, Copy, Sparkles, X, ChevronRight, MessageSquare, Target, Clock, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SALES_SCRIPTS, ScriptCategory, SalesScript } from '../constants/scriptData';

interface ScriptLibraryProps {
    isOpen: boolean;
    onClose: () => void;
}

const CATEGORIES: ScriptCategory[] = ['All', 'Primo Contatto', 'Follow-Up', 'Obiezioni', 'Chiusura'];

export const ScriptLibrary: React.FC<ScriptLibraryProps> = ({ isOpen, onClose }) => {
    const [activeCategory, setActiveCategory] = useState<ScriptCategory>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filteredScripts = useMemo(() => {
        return SALES_SCRIPTS.filter(script => {
            const matchesCategory = activeCategory === 'All' || script.category === activeCategory;
            const matchesSearch = script.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                 script.text.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, searchQuery]);

    const handleCopy = (script: SalesScript) => {
        navigator.clipboard.writeText(script.text);
        setCopiedId(script.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Modal Container */}
            <motion.div 
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                className="relative w-full max-w-4xl h-full sm:h-[85vh] bg-[#f2f2f7] dark:bg-slate-950 sm:rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden border border-white/20 dark:border-white/5"
            >
                {/* Header */}
                <div className="p-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center transition-colors">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Script Library</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Potenzia la tua comunicazione</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all active:scale-90"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="px-6 py-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 space-y-4">
                    {/* Search Bar */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Cerca per titolo o contenuto..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border-none rounded-2xl text-sm font-medium shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-blue-500 transition-all outline-none text-slate-800 dark:text-white"
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                    activeCategory === cat 
                                    ? 'bg-slate-800 dark:bg-white text-white dark:text-black shadow-lg scale-105' 
                                    : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }`}
                            >
                                {cat === 'All' ? 'Tutti' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Scripts List */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 no-scrollbar">
                    <AnimatePresence mode="popLayout">
                        {filteredScripts.length > 0 ? filteredScripts.map((script, idx) => (
                            <motion.div
                                key={script.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
                            >
                                {/* Category Badge */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest rounded-full">
                                            {script.category}
                                        </span>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white">{script.title}</h3>
                                    </div>
                                    <span className="text-2xl opacity-80 group-hover:scale-125 transition-transform duration-500">{script.icon}</span>
                                </div>

                                {script.description && (
                                    <p className="text-xs text-slate-400 dark:text-slate-500 italic mb-4 font-medium">
                                        {script.description}
                                    </p>
                                )}

                                {/* Script Text Box */}
                                <div className="relative p-5 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
                                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                                        {script.text}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-3">
                                    <button 
                                        onClick={() => handleCopy(script)}
                                        className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                                            copiedId === script.id 
                                            ? 'bg-green-500 text-white shadow-[0_0_20px_rgba(34,197,94,0.3)]' 
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm'
                                        }`}
                                    >
                                        <Copy size={18} />
                                        {copiedId === script.id ? 'Copiato negli Appunti!' : 'Copia Script'}
                                    </button>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 opacity-40">
                                <Search size={48} className="mb-4" strokeWidth={1} />
                                <p className="text-sm font-bold uppercase tracking-widest">Nessun script trovato</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Tip */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                        Tip: Personalizza sempre lo script per renderlo naturale
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
