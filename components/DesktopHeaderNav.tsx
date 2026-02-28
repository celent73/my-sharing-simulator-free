import React from 'react';
import { GraduationCap, Sparkles, Lock } from 'lucide-react';
import { ClientModeIcon, FamilyModeIcon, CondoModeIcon } from './icons/ModeIcons';
import { useLanguage } from '../contexts/LanguageContext';

interface DesktopHeaderNavProps {
    viewMode: string;
    handleModeChange: (mode: string) => void;
    onOpenLightSimulator: () => void;
    isPremium: boolean;
}

export const DesktopHeaderNav: React.FC<DesktopHeaderNavProps> = ({
    viewMode,
    handleModeChange,
    onOpenLightSimulator,
    isPremium
}) => {
    const { t } = useLanguage();

    // Helper for button classes
    const getButtonClass = (isActive: boolean) => `
        relative flex flex-col items-center justify-center h-full px-6 py-2
        transition-all duration-300 ease-out active:scale-95 group rounded-xl
        ${isActive ? 'text-white bg-white/10 shadow-inner' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}
    `;

    return (
        <div className="hidden md:flex items-center justify-center p-1 rounded-[2rem] bg-slate-900/50 border border-slate-700/50 shadow-inner relative overflow-hidden mx-4">
            {/* Glow effect */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-50" />

            {/* 1. SHARING SIMULATOR LIGHT */}
            <button
                onClick={onOpenLightSimulator}
                className={getButtonClass(false)}
            >
                <div className={`mb-1 transition-transform group-hover:scale-110 ${viewMode === 'light' ? 'text-union-green-400' : 'text-union-green-500/70'}`}>
                    <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold leading-none text-union-green-400 flex items-center gap-1">
                    {t('nav.light')} <Sparkles size={8} className="animate-pulse text-union-green-300" />
                </span>
            </button>

            <div className="w-px h-8 bg-slate-700/50 mx-1" />

            {/* 2. AMMINISTRATORI (CONDO) */}
            <button
                onClick={() => handleModeChange('condo')}
                className={getButtonClass(viewMode === 'condo')}
            >
                {!isPremium && <div className="absolute top-1 right-2 bg-red-500 text-white p-0.5 rounded-full z-20 shadow-sm"><Lock size={8} /></div>}
                <CondoModeIcon className={`w-6 h-6 mb-1 transition-all ${viewMode !== 'condo' ? 'grayscale opacity-70' : ''}`} />
                <span className="text-[10px] font-bold leading-none tracking-wide">{t('nav.admin')}</span>
            </button>

            <div className="w-px h-8 bg-slate-700/50 mx-1" />

            {/* 3. FAMILY UTILITY */}
            <button
                onClick={() => handleModeChange('family')}
                className={getButtonClass(viewMode === 'family')}
            >
                <FamilyModeIcon className={`w-6 h-6 mb-1 transition-all ${viewMode !== 'family' ? 'grayscale opacity-70' : ''}`} />
                <span className="text-[10px] font-bold leading-none tracking-wide">{t('nav.partner')}</span>
            </button>

            <div className="w-px h-8 bg-slate-700/50 mx-1" />

            {/* 4. CLIENTE SEMPLICE (CLIENT) */}
            <button
                onClick={() => handleModeChange('client')}
                className={getButtonClass(viewMode === 'client')}
            >
                <ClientModeIcon className={`w-6 h-6 mb-1 transition-all ${viewMode !== 'client' ? 'grayscale opacity-70' : ''}`} />
                <span className="text-[10px] font-bold leading-none tracking-wide">{t('nav.client')}</span>
            </button>

        </div>
    );
};
