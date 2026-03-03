import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, GraduationCap, FileText, PlayCircle } from 'lucide-react';
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

const SharingAcademy: React.FC<SharingAcademyProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();
    const { openModal } = useModalDispatch();

    // Main Navigation State
    const [mainTab, setMainTab] = useState<'tutorial' | 'contract' | 'video'>('tutorial');

    // Tutorial Internal State (Old LightSimulator tabs)
    const [tutorialTab, setTutorialTab] = useState('simulator');
    const [personalUnits, setPersonalUnits] = useState(5);
    const [expansionMode, setExpansionMode] = useState<'manual' | 'auto'>('auto');
    const [duplicationFactor, setDuplicationFactor] = useState(3);
    const [networkSize, setNetworkSize] = useState([5, 15, 45, 100, 250, 500]);
    const [monthRange, setMonthRange] = useState('1');
    const [utilityType, setUtilityType] = useState<'DOMESTIC' | 'BUSINESS'>('DOMESTIC');

    useEffect(() => {
        if (isOpen) {
            // Reset to default on open
            setMainTab('tutorial');
            handleReset();
        }
    }, [isOpen]);

    const handleReset = () => {
        setNetworkSize([0, 0, 0, 0, 0, 0]);
        setPersonalUnits(0);
        setDuplicationFactor(1);
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

    const renderTutorialContent = () => (
        <div className="h-full flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 pb-32">
                <AnimatePresence mode="wait">
                    {tutorialTab === 'simulator' && (
                        <EarningsSimulator
                            key="sim"
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
                    )}
                    {tutorialTab === 'community' && <Community key="comm" personalUnits={personalUnits} />}

                </AnimatePresence>
            </div>

            {/* Bottom Tab Navigation for Tutorial */}
            <div className="absolute bottom-6 left-0 right-0 px-6 flex justify-center pointer-events-none">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 p-1.5 rounded-full shadow-2xl pointer-events-auto flex gap-1 transform transition-all hover:scale-105">
                    {[
                        { id: 'simulator', label: t('light_simulator.tab_simulator') },
                        { id: 'community', label: t('light_simulator.tab_community') }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setTutorialTab(tab.id)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${tutorialTab === tab.id
                                ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg'
                                : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[120] bg-slate-50 dark:bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-300">
            {/* Top Navigation Bar */}
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

                {/* Deskop/Tablet Menu */}
                <div className="hidden md:flex bg-gray-100 dark:bg-white/5 p-1 rounded-xl">
                    {[
                        { id: 'tutorial', icon: GraduationCap, label: t('academy.menu.tutorial') },
                        { id: 'contract', icon: FileText, label: t('academy.menu.contract') },
                    ].map(item => {
                        const Icon = item.icon;
                        const isActive = mainTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setMainTab(item.id as any)}
                                disabled={item.id === 'video'}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isActive
                                    ? 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                                    } ${item.id === 'video' ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <Icon size={16} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>

                <button
                    onClick={onClose}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors font-bold text-sm"
                >
                    <span className="hidden sm:inline">{t('common.close') || 'Chiudi'}</span>
                    <X size={18} />
                </button>
            </div>

            {/* Mobile Menu (below header) */}
            <div className="md:hidden border-b border-green-900 overflow-x-auto no-scrollbar bg-[#14532d]">
                <div className="flex p-2 gap-2 min-w-max">
                    {[
                        { id: 'tutorial', icon: GraduationCap, label: t('academy.menu.tutorial') },
                        { id: 'contract', icon: FileText, label: t('academy.menu.contract') },
                        { id: 'video', icon: PlayCircle, label: t('academy.menu.video') }
                    ].map(item => {
                        const Icon = item.icon;
                        const isActive = mainTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setMainTab(item.id as any)}
                                disabled={item.id === 'video'}
                                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${isActive
                                    ? 'bg-white/20 text-white shadow-sm'
                                    : 'text-green-200 hover:text-white'
                                    } ${item.id === 'video' ? 'opacity-50' : ''}`}
                            >
                                <Icon size={16} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-hidden relative bg-slate-50 dark:bg-black/50">
                {mainTab === 'tutorial' && renderTutorialContent()}

                {mainTab === 'contract' && (
                    <div className="h-full overflow-y-auto p-4 md:p-8 animate-in slide-in-from-right duration-300">
                        <ContractSimulator />
                    </div>
                )}

                {mainTab === 'video' && (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <PlayCircle size={64} className="mb-4 opacity-50" />
                        <h3 className="text-xl font-bold">Coming Soon</h3>
                        <p>La Video Academy sarà disponibile a breve.</p>
                    </div>
                )}
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(156, 163, 175, 0.3);
                    border-radius: 20px;
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

export default SharingAcademy;
