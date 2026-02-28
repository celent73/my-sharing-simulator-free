import React from 'react';
import {
    Presentation,
    Share2,
    Fuel,
    Zap,
    Bot,
    Target,
    Ticket,
    BookOpen,
    ExternalLink,
    Download,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

interface GridMenuProps {
    isOpen: boolean;
    onClose: () => void;
    onOpenPresentation: () => void;
    onOpenUnionEcosystem: () => void;
    onOpenFuelPitch: () => void;
    onOpenFocusMode: () => void;
    toggleShary: () => void;
    isSharyActive: boolean;
    onOpenTarget: () => void;
    onOpenGuide: () => void;
    onOpenInstall: () => void;
    isPremium: boolean;
    viewMode: string;
    showInstall: boolean;
}

const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: "spring", damping: 15, stiffness: 100 }
    } as any,
    exit: { opacity: 0, scale: 0.8, y: 20 }
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        transition: {
            staggerChildren: 0.02,
            staggerDirection: -1
        }
    }
};

const MenuItem = ({ icon: Icon, label, onClick, colorClass = "bg-slate-500" }: any) => (
    <motion.button
        variants={itemVariants}
        onClick={(e) => {
            e.stopPropagation();
            onClick();
            // Note: We don't call onClose() here because opening another modal 
            // via openModal() automatically replaces the GridMenu in the global state.
        }}
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        className={`
            relative flex flex-col items-center justify-center 
            aspect-square w-full rounded-[2.5rem]
            bg-white
            shadow-[0_20px_40px_rgba(0,0,0,0.06)] 
            hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]
            border border-white/50
            group transition-all duration-300
            overflow-hidden
        `}
    >
        <div className={`
            p-4 sm:p-5 rounded-[1.8rem] mb-3 
            ${colorClass}
            flex items-center justify-center
            transition-transform duration-500 group-hover:scale-110
            shadow-lg
        `}>
            <Icon size={32} strokeWidth={2.5} className="text-white" />
        </div>
        <span className="text-[12px] sm:text-[14px] font-bold text-center text-slate-800 leading-tight tracking-tight px-2 relative z-10 uppercase">
            {label}
        </span>
    </motion.button>
);

const GridMenu: React.FC<GridMenuProps> = ({
    isOpen,
    onClose,
    onOpenPresentation,
    onOpenUnionEcosystem,
    onOpenFuelPitch,
    onOpenFocusMode,
    toggleShary,
    isSharyActive,
    onOpenTarget,
    onOpenGuide,
    onOpenInstall,
    isPremium,
    viewMode,
    showInstall
}) => {
    const { t } = useLanguage();

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100000] flex flex-col items-center justify-center overflow-hidden"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                >
                    <motion.div
                        className="absolute inset-0 bg-white/40 dark:bg-black/60 backdrop-blur-[60px]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={onClose}
                        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200 hover:bg-white hover:scale-110 active:scale-95 transition-all z-50 shadow-2xl"
                    >
                        <X size={24} />
                    </motion.button>

                    <motion.div
                        variants={containerVariants}
                        className="relative z-10 w-[94%] max-w-4xl h-auto max-h-[90vh] bg-white/80 dark:bg-white/5 border border-white/40 rounded-[3.5rem] p-6 py-10 sm:p-16 sm:py-20 backdrop-blur-3xl shadow-[0_60px_120px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center overflow-y-auto hide-scrollbar"
                    >
                        <div className="text-center mb-8">
                            <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">
                                Menu
                            </motion.h2>
                            <motion.p variants={itemVariants} className="text-slate-500 dark:text-slate-400 font-medium text-xs sm:text-base">
                                Tutte le app a portata di mano
                            </motion.p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 sm:gap-8 w-full">
                            <MenuItem icon={Presentation} label={t('menu.business')} colorClass="bg-purple-600" onClick={onOpenPresentation} />
                            <MenuItem icon={Share2} label={t('menu.revolution')} colorClass="bg-union-blue-500" onClick={onOpenUnionEcosystem} />
                            <MenuItem icon={Zap} label={t('menu.focus_mode')} colorClass="bg-union-orange-500" onClick={onOpenFocusMode} />
                            <MenuItem icon={Fuel} label={t('menu.fuel_pitch')} colorClass="bg-rose-500" onClick={onOpenFuelPitch} />
                            <MenuItem icon={Bot} label={isSharyActive ? t('menu.shary_active') : t('menu.activate_shary')} colorClass={isSharyActive ? "bg-emerald-500" : "bg-slate-500"} onClick={toggleShary} />
                            <MenuItem icon={Target} label={t('menu.calc_goal')} colorClass="bg-indigo-600" onClick={onOpenTarget} />
                        </div>

                        {/* ROW 3: Extra */}
                        <div className="grid grid-cols-3 gap-3 md:gap-4 lg:gap-6">
                            <MenuItem icon={BookOpen} label={t('menu.guide')} colorClass="bg-blue-600" onClick={onOpenGuide} />
                            <MenuItem icon={ExternalLink} label={t('menu.store')} colorClass="bg-slate-800" onClick={() => window.open('https://share.unionenergia.it/login?red=/il-mio-store/37633&nochecksession=true', '_blank')} />
                        </div>

                        {showInstall && (
                            <motion.div variants={itemVariants} className="mt-16 flex justify-center">
                                <button
                                    onClick={() => { onOpenInstall(); onClose(); }}
                                    className="flex items-center gap-3 px-10 py-5 rounded-[2rem] bg-slate-900 text-white font-bold text-sm tracking-tight hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-slate-900/20"
                                >
                                    <Download size={20} />
                                    {t('menu.install')}
                                </button>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default GridMenu;
