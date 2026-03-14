import React, { useState, useEffect } from 'react';
import { LayoutGrid } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useModalDispatch } from '../contexts/ModalContext';

interface HeaderMenuProps {
    onOpenPresentation: () => void;
    onOpenUnionEcosystem: () => void;
    onOpenFuelPitch: () => void;
    toggleShary: () => void;
    isSharyActive: boolean;
    onOpenTarget: () => void;
    onOpenDailyCheck: () => void;
    onOpenGuide: () => void;
    onOpenInstall: () => void;
    isPremium: boolean;
    viewMode: string;
    showInstall: boolean;
}

const HeaderMenu: React.FC<HeaderMenuProps> = (props) => {
    const { t } = useLanguage();
    const { openModal } = useModalDispatch();

    const handleOpenMenu = () => {
        openModal('GRID_MENU', { ...props });
    };

    return (
        <div className="flex items-center gap-2 relative">


            <button
                onClick={handleOpenMenu}
                className="flex p-2 sm:p-2.5 rounded-xl !bg-white !text-slate-900 hover:bg-gray-100 transition-all shadow-xl border border-slate-200 hover:scale-105 active:scale-95 items-center justify-center"
                title="Apri Menu"
            >
                <LayoutGrid size={18} className="sm:w-[20px] sm:h-[20px]" />
                <span className="hidden sm:inline ml-2 font-bold text-sm">Menu</span>
            </button>
        </div>
    );
};

export default HeaderMenu;
