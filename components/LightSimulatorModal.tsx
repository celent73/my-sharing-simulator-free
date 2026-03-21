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

            {/* ── Top Header ── */}
            <div className="shrink-0 h-20 bg-[#166534] px-6 flex items-center justify-between z-50 shadow-md">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-xl font-black text-white leading-none">
                            {t('academy.title')}
                        </h1>
                        <p className="text-xs text-green-200 font-medium mt-1">
                            {t('academy.subtitle')}
                        </p>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors font-bold text-sm"
                >
                    <span className="hidden sm:inline">{t('common.close') || 'Chiudi'}</span>
                    <X size={18} />
                </button>
            </div>

            {/* ── Main Content Area ── */}
            <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-black/50">

                {/* Tutorial: Simulator */}
                {mainTab === 'tutorial' && tutorialTab === 'simulator' && (
                    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32 animate-in fade-in duration-200">
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
                    <div className="h-full overflow-y-auto custom-scrollbar p-6 pb-32 animate-in fade-in duration-200">
                        <Community personalUnits={personalUnits} />
                    </div>
                )}

                {/* Contract Simulator */}
                {mainTab === 'contract' && (
                    <div className="h-full overflow-y-auto p-4 md:p-8 animate-in slide-in-from-right duration-300">
                        <ContractSimulator />
                    </div>
                )}


            </div>

            {/* ── Unified Bottom Dock (pill) ── */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-50 pointer-events-none">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 28 }}
                    className="flex items-center gap-1 p-2 bg-[#1c1c1e]/90 backdrop-blur-2xl rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/10 pointer-events-auto"
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
                                    'flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap',
                                    active
                                        ? 'bg-[#166534] text-white shadow-md'
                                        : item.disabled
                                            ? 'text-white/30 cursor-not-allowed'
                                            : 'text-white/70 hover:text-white hover:bg-white/10',
                                ].join(' ')}
                                title={item.disabled ? 'Coming soon' : undefined}
                            >
                                <Icon size={16} />
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
