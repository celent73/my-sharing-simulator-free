import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, GraduationCap, FileText, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import EarningsSimulator from './light/EarningsSimulator';

import Community from './light/Community';
import ContractSimulator from './academy/ContractSimulator';
import { useLanguage } from '../contexts/LanguageContext';
import { useModalDispatch } from '../contexts/ModalContext';

interface SharingAcademyProps {
    isOpen: boolean;
    onClose: () => void;
}

// ─── Nav items ────────────────────────────────────────────────────────────────
// mainTab: 'tutorial' | 'contract' | 'video'
// tutorialTab (sub): 'simulator' | 'community'  (only visible when mainTab === 'tutorial')

const SharingAcademy: React.FC<SharingAcademyProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { openModal } = useModalDispatch();

    const [mainTab, setMainTab] = useState<'tutorial' | 'contract' | 'video'>('tutorial');
    const [tutorialTab, setTutorialTab] = useState('simulator');
    const [personalUnits, setPersonalUnits] = useState(3);
    const [expansionMode, setExpansionMode] = useState<'manual' | 'auto'>('auto');
    const [duplicationFactor, setDuplicationFactor] = useState(3);
    const [networkSize, setNetworkSize] = useState([3, 9, 27, 81, 243, 729]);
    const [monthRange, setMonthRange] = useState('1');
    const [utilityType, setUtilityType] = useState<'DOMESTIC' | 'BUSINESS'>('DOMESTIC');
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = React.useRef(0);

    useEffect(() => {
        if (isOpen) {
            setMainTab('tutorial');
            handleReset();
        }
    }, [isOpen]);

    const handleReset = () => {
        setNetworkSize([3, 9, 27, 81, 243, 729]);
        setPersonalUnits(3);
        setDuplicationFactor(3);
        setMonthRange('1');
        setUtilityType('DOMESTIC');
    };

    if (!isOpen) return null;

    const handleLevelChange = (index: number, value: number) => {
        const newSize = [...networkSize];
        newSize[index] = value;
        if (expansionMode === 'auto' && index === 0) {
            for (let i = 1; i < newSize.length; i++) {
                newSize[i] = newSize[i - 1] * duplicationFactor;
            }
        }
        setNetworkSize(newSize);
    };

    const handleFactorChange = (factor: number) => {
        setDuplicationFactor(factor);
        if (expansionMode === 'auto') {
            const newSize = [networkSize[0]];
            for (let i = 1; i < networkSize.length; i++) {
                newSize[i] = newSize[i - 1] * factor;
            }
            setNetworkSize(newSize);
        }
    };

    const handleModeToggle = (mode: 'manual' | 'auto') => {
        setExpansionMode(mode);
        if (mode === 'auto') handleFactorChange(duplicationFactor);
    };
    
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const currentScrollY = e.currentTarget.scrollTop;
        if (currentScrollY < lastScrollY.current || currentScrollY < 50) {
            setIsVisible(true);
        } else if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
            setIsVisible(false);
        }
        lastScrollY.current = currentScrollY;
    };

    // ─── All nav items in one flat list ───────────────────────────────────────
    // We flatten tutorial sub-tabs into the bottom dock directly.
    //   'simulator'  → sets mainTab='tutorial', tutorialTab='simulator'
    //   'community'  → sets mainTab='tutorial', tutorialTab='community'
    //   'contract'   → sets mainTab='contract'
    //   'video'      → sets mainTab='video'

    type DockItem = {
        id: string;
        icon: React.ElementType;
        label: string;
        disabled?: boolean;
        action: () => void;
        isActive: () => boolean;
    };

    const dockItems: DockItem[] = [
        {
            id: 'simulator',
            icon: GraduationCap,
            label: t('light_simulator.tab_simulator') || 'Simulatore',
            action: () => { setMainTab('tutorial'); setTutorialTab('simulator'); },
            isActive: () => mainTab === 'tutorial' && tutorialTab === 'simulator',
        },
        {
            id: 'community',
            icon: Users,
            label: t('light_simulator.tab_community') || 'Community',
            action: () => { setMainTab('tutorial'); setTutorialTab('community'); },
            isActive: () => mainTab === 'tutorial' && tutorialTab === 'community',
        },
        {
            id: 'contract',
            icon: FileText,
            label: t('academy.menu.contract') || 'Contratti',
            action: () => setMainTab('contract'),
            isActive: () => mainTab === 'contract',
        },
    ];

    return (
        <div className="fixed inset-0 z-[120] bg-slate-50 dark:bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">

            {/* ── Top Header (Floating Dark style) ── */}
            <motion.header 
                animate={{ 
                    y: isVisible ? 0 : -100, 
                    opacity: isVisible ? 1 : 0 
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                className="shrink-0 mx-4 mt-4 bg-[#1c1c1e]/90 backdrop-blur-3xl px-6 py-5 flex items-center justify-between z-50 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] border border-white/10"
            >
                <div className="flex items-center gap-5">
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5 shadow-inner"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight">
                            {t('academy.title')}
                        </h1>
                        <p className="text-[10px] md:text-xs text-[#22c55e] font-black uppercase tracking-[0.2em] mt-0.5 drop-shadow-[0_0_8px_rgba(34,197,94,0.6)]">
                            {t('academy.subtitle')}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-white/30 tracking-widest uppercase mb-1">
                        v1.3.27
                    </div>
                    <button
                        onClick={onClose}
                        className="w-12 h-12 flex items-center justify-center rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all border border-red-500/10 shadow-lg"
                    >
                        <X size={20} strokeWidth={3} />
                    </button>
                </div>
            </motion.header>

            {/* ── Main Content Area ── */}
            <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-black/50">

                {/* Tutorial: Simulator */}
                {mainTab === 'tutorial' && tutorialTab === 'simulator' && (
                    <div 
                        onScroll={handleScroll}
                        className="h-full overflow-y-auto custom-scrollbar p-6 pb-32 animate-in fade-in duration-200"
                    >
                        <EarningsSimulator
                            networkSize={networkSize}
                            onLevelChange={handleLevelChange}
                            personalUnits={personalUnits}
                            setPersonalUnits={setPersonalUnits}
                            expansionMode={expansionMode}
                            setExpansionMode={handleModeToggle}
                            duplicationFactor={duplicationFactor}
                            onFactorChange={handleFactorChange}
                            monthRange={monthRange}
                            setMonthRange={setMonthRange}
                            utilityType={utilityType}
                            setUtilityType={setUtilityType}
                            onReset={handleReset}
                        />
                    </div>
                )}

                {/* Tutorial: Community */}
                {mainTab === 'tutorial' && tutorialTab === 'community' && (
                    <div 
                        onScroll={handleScroll}
                        className="h-full overflow-y-auto custom-scrollbar p-6 pb-32 animate-in fade-in duration-200"
                    >
                        <Community personalUnits={personalUnits} />
                    </div>
                )}

                {/* Contract Simulator */}
                {mainTab === 'contract' && (
                    <div 
                        onScroll={handleScroll}
                        className="h-full overflow-y-auto p-4 md:p-8 animate-in slide-in-from-right duration-300"
                    >
                        <ContractSimulator />
                    </div>
                )}


            </div>

            {/* ── Unified Bottom Dock (pill) ── */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ 
                        y: isVisible ? 0 : 100, 
                        opacity: isVisible ? 1 : 0 
                    }}
                    transition={{ 
                        type: 'spring', 
                        stiffness: 260, 
                        damping: 20 
                    }}
                    className="flex items-center gap-3 p-3 bg-[#1c1c1e]/90 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 pointer-events-auto"
                >
                    {dockItems.map(item => {
                        const Icon = item.icon;
                        const active = item.isActive();
                        return (
                            <button
                                key={item.id}
                                onClick={item.action}
                                disabled={item.disabled}
                                className={[
                                    'flex items-center gap-3 px-10 py-5 rounded-[2rem] text-sm md:text-base font-black transition-all duration-300 whitespace-nowrap uppercase tracking-widest',
                                    active
                                        ? 'bg-[#166534] text-white shadow-[0_10px_30px_rgba(22,101,52,0.5)] scale-105'
                                        : item.disabled
                                            ? 'text-white/30 cursor-not-allowed'
                                            : 'text-white/70 hover:text-white hover:bg-white/10',
                                ].join(' ')}
                                title={item.disabled ? 'Coming soon' : undefined}
                            >
                                <Icon size={24} />
                                <span className="hidden sm:inline">{item.label}</span>
                            </button>
                        );
                    })}
                </motion.div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.3); border-radius: 20px; }
            `}</style>
        </div>
    );
};

export default SharingAcademy;
