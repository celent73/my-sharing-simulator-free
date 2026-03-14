import React from 'react';
import { useTheme, AccentColor } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';

const PALETTES: { id: AccentColor; color: string; label: string }[] = [
    { id: 'original', color: '#1e293b', label: 'Originale' },
    { id: 'titan', color: '#475569', label: 'Titan Grey' },
    { id: 'night-blue', color: '#1e3a8a', label: 'Blu Notte' },
    { id: 'union-orange', color: '#2b0f07', label: 'Orange Union' },
    { id: 'union-colors', color: '#0077c8', label: 'Union Colors' },
    { id: 'verdone-scuro', color: '#05140a', label: 'Verdone Scuro' },
];

const PaletteSelector: React.FC = () => {
    const { accentColor, setAccentColor } = useTheme();
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 [.theme-union-colors_&]:!bg-white [.theme-union-colors_&]:!border-white"
                style={{ backgroundColor: accentColor === 'union-colors' ? 'transparent' : PALETTES.find(p => p.id === accentColor)?.color }}
            >
                <div className="w-4 h-4 rounded-full bg-white/30 [.theme-union-colors_&]:!bg-[#0077c8]" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[100]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                            className="absolute top-full mt-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-3xl p-3 shadow-2xl border border-gray-100 dark:border-white/10 z-[101] flex flex-col gap-2 min-w-[160px]"
                        >
                            {PALETTES.map((p) => (
                                <button
                                    key={p.id}
                                    onClick={() => {
                                        setAccentColor(p.id);
                                        setIsOpen(false);
                                    }}
                                    className={`flex items-center gap-3 w-full p-2 rounded-2xl transition-all ${accentColor === p.id ? 'bg-gray-100 dark:bg-white/5' : 'hover:bg-gray-50 dark:hover:bg-white/10'}`}
                                >
                                    <div
                                        className="w-8 h-8 rounded-full shadow-inner flex items-center justify-center"
                                        style={{ backgroundColor: p.color }}
                                    >
                                        {accentColor === p.id && <Check size={14} className="text-white" />}
                                    </div>
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${accentColor === p.id ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                        {p.label}
                                    </span>
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PaletteSelector;
