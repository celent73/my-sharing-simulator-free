import React, { useState, useEffect } from 'react';
import { User, Users, Building2, GraduationCap, CalendarCheck, Sparkles, Lock, Bell } from 'lucide-react';
import { ClientModeIcon, FamilyModeIcon, CondoModeIcon } from './icons/ModeIcons';
import { useLanguage } from '../contexts/LanguageContext';
import { usePendingHabitStacks } from '../hooks/usePendingHabitStacks';

interface BottomDockProps {
    viewMode: string;
    handleModeChange: (mode: string) => void;
    onOpenLightSimulator: () => void;
    onOpenDailyCheck: () => void;
    isPremium: boolean;
}

const BottomDock: React.FC<BottomDockProps> = ({
    viewMode,
    handleModeChange,
    onOpenLightSimulator,
    onOpenDailyCheck,
    isPremium
}) => {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(true);
    const hasPendingStacks = usePendingHabitStacks();

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = (e: any) => {
            const target = e.target === document ? window : e.target;
            const currentScrollY = target.scrollY !== undefined ? target.scrollY : target.scrollTop;

            if (currentScrollY === undefined) return;

            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            }
            lastScrollY = currentScrollY;
        };

        const handleCustomControl = (e: any) => {
            if (e.detail && typeof e.detail.visible === 'boolean') {
                setIsVisible(e.detail.visible);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
        window.addEventListener('control-bottom-dock', handleCustomControl);

        return () => {
            window.removeEventListener('scroll', handleScroll, { capture: true } as any);
            window.removeEventListener('control-bottom-dock', handleCustomControl);
        };
    }, []);


    // Helper for button classes
    const getButtonClass = (isActive: boolean) => `
        relative flex flex-col items-center justify-center w-full h-full 
        transition-all duration-300 ease-out active:scale-95 group
        ${isActive ? 'text-white [.theme-union-colors_&]:!text-[#0077c8]' : 'text-slate-400 hover:text-slate-200 [.theme-union-colors_&]:!text-white'}
    `;

    const getIconContainerClass = (isActive: boolean) => `
        p-2 transition-all duration-300
        ${isActive ? 'transform -translate-y-1' : ''}
    `;

    return (
        <div className={`fixed bottom-4 left-2 right-2 z-[100] flex justify-center md:hidden transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[200%] opacity-0 pointer-events-none'}`}>
            <div
                className="flex items-center justify-between w-full max-w-xl md:max-w-2xl px-4 py-4 backdrop-blur-[64px] border border-white/10 shadow-[0_45px_100px_0_rgba(0,0,0,0.8)] rounded-[2.5rem] transition-all duration-300 relative overflow-visible"
                style={{ background: 'var(--footer-bg)' }}
            >
                <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

                {/* 1a. DAILY CHECK -> MY SHARING SIMULATOR */}
                <button
                    onClick={onOpenDailyCheck}
                    className={getButtonClass(false)}
                >
                    <div className="group-hover:scale-110 transition-transform flex flex-col items-center relative">
                        {hasPendingStacks && (
                            <div className="absolute -top-1.5 -right-1.5 z-20">
                                <div className="bg-red-500 rounded-full p-1 shadow-lg border border-white/40 animate-pulse">
                                    <Bell className="w-2.5 h-2.5 text-white fill-white" />
                                </div>
                            </div>
                        )}
                        <CalendarCheck className="w-7 h-7 text-union-green-400 [.theme-union-colors_&]:!text-white" />
                        <span className="text-[7px] font-black uppercase tracking-tighter text-union-green-400 mt-0.5">Daily Chek</span>
                    </div>
                </button>

                {/* 1b. SHARING SIMULATOR LIGHT */}
                <button
                    onClick={onOpenLightSimulator}
                    className={getButtonClass(false)}
                >
                    <div className="group-hover:scale-110 transition-transform">
                        <GraduationCap className="w-8 h-8 md:w-10 md:h-10 text-union-green-400 [.theme-union-colors_&]:!text-white" />
                    </div>
                </button>

                {/* 2. AMMINISTRATORI (CONDO) */}
                <button
                    onClick={() => handleModeChange('condo')}
                    className={getButtonClass(viewMode === 'condo')}
                >
                    {!isPremium && <div className="absolute top-1 right-2 bg-red-500 text-white p-0.5 rounded-full z-20 shadow-sm"><Lock size={8} /></div>}
                    <div className={getIconContainerClass(viewMode === 'condo')}>
                        <CondoModeIcon className={`w-8 h-8 md:w-10 md:h-10 transition-all ${viewMode !== 'condo' ? 'grayscale opacity-40 [.theme-union-colors_&]:!opacity-100 [.theme-union-colors_&]:brightness-[100]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`} />
                    </div>
                </button>

                {/* 3. FAMILY UTILITY */}
                <button
                    onClick={() => handleModeChange('family')}
                    className={getButtonClass(viewMode === 'family')}
                >
                    <div className={getIconContainerClass(viewMode === 'family')}>
                        <FamilyModeIcon className={`w-8 h-8 md:w-10 md:h-10 transition-all ${viewMode !== 'family' ? 'grayscale opacity-40 [.theme-union-colors_&]:!opacity-100 [.theme-union-colors_&]:brightness-[100]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`} />
                    </div>
                </button>

                {/* 4. CLIENTE SEMPLICE (CLIENT) - Rightmost */}
                <button
                    onClick={() => handleModeChange('client')}
                    className={getButtonClass(viewMode === 'client')}
                >
                    <div className={getIconContainerClass(viewMode === 'client')}>
                        <ClientModeIcon className={`w-8 h-8 md:w-10 md:h-10 transition-all ${viewMode !== 'client' ? 'grayscale opacity-40 [.theme-union-colors_&]:!opacity-100 [.theme-union-colors_&]:brightness-[100]' : 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]'}`} />
                    </div>
                </button>

            </div>
        </div>
    );
};

export default BottomDock;
