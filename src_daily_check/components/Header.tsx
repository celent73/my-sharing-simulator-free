import React from 'react';
import { UserProfile, Theme } from '../types';
import { CareerStatusInfo } from '../utils/careerUtils';

interface HeaderProps {
    userProfile: UserProfile;
    onOpenSettings: () => void;
    onOpenDeleteDataModal: () => void;
    careerStatus: CareerStatusInfo;
    isPremium: boolean;
    remainingTrialDays: number | null;
    onOpenPaywall: () => void;
    toggleTheme: () => void;
    currentTheme: Theme;
    onOpenMonthlyReport: () => void;
    onOpenGuide: () => void;
    streak: number;
    onOpenTeamChallenge: () => void;
    onOpenCareerPath: () => void;
    onCloseApp?: () => void;
    onOpenDailyRecap: () => void; // New prop
    // Auth Props
    isLoggedIn?: boolean;
    onLogin?: () => void;
    onLogout?: () => void;
}

const StreakBadge = ({ count }: { count: number }) => {
    return (
        <div className="flex items-center gap-1 bg-green-500/10 text-green-400 pl-3 pr-3 py-1.5 rounded-full text-[13px] font-black tracking-widest uppercase border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            DAILY CHEK
        </div>
    );
};

// Icons (kept same as before, added Logout/Login)
const QuestionMarkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
const SettingsIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066 2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);
const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);
const LogoutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
);
const DocumentIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
        <path d="M9 11a1 1 0 100-2 1 1 0 000 2zM9 14a1 1 0 100-2 1 1 0 000 2zM9 17a1 1 0 100-2 1 1 0 000 2zM12 17a1 1 0 100-2 1 1 0 000 2zM12 14a1 1 0 100-2 1 1 0 000 2z" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const InstallButton = () => {
    const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
    React.useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);
    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') setDeferredPrompt(null);
    };
    if (!deferredPrompt) return null;
    return (
        <button
            onClick={handleInstallClick}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 animate-pulse-slow"
        >
            <span className="hidden sm:inline">Installa App</span>
            <span className="sm:hidden">↓</span>
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({
    userProfile, onOpenSettings, onOpenDeleteDataModal, careerStatus, streak, isPremium, remainingTrialDays, onOpenPaywall, toggleTheme, currentTheme, onOpenMonthlyReport, onOpenGuide, onOpenTeamChallenge, onOpenCareerPath,
    onCloseApp,
    onOpenDailyRecap, // Added here
    isLoggedIn, onLogin, onLogout
}) => {

    const [isVisible, setIsVisible] = React.useState(true);
    React.useEffect(() => {
        const scrollContainer = document.getElementById('main-scroll-container');
        if (!scrollContainer) return;

        let lastScrollY = scrollContainer.scrollTop;
        const handleScroll = () => {
            const currentScrollY = scrollContainer.scrollTop;
            if (currentScrollY < lastScrollY || currentScrollY < 50) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
                setIsVisible(false);
            }
            lastScrollY = currentScrollY;
        };
        scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className="flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-8 mx-2 sm:mx-4 mt-2 sm:mt-4 rounded-[2rem] sm:rounded-[2.5rem] p-3 sm:p-6 border border-white/10 shadow-[0_32px_80px_0_rgba(0,0,0,0.8)] transition-all duration-500 relative z-50 bg-[#1c1c1e]">
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between relative z-10 gap-2">

                <div className="flex-shrink-0">
                    <StreakBadge count={streak} />
                </div>

                <div className="flex items-center gap-1 sm:gap-3 overflow-x-auto no-scrollbar py-1">
                    <InstallButton />

                    <div className={`flex gap-0 sm:gap-1 transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-[150%] opacity-0 pointer-events-none'}`}>
                        <button onClick={toggleTheme} className="p-1 sm:p-2 rounded-xl text-white hover:bg-white/10 transition-all font-medium" aria-label="Tema">
                            {currentTheme === 'light' ? <MoonIcon /> : <SunIcon />}
                        </button>
                        <button onClick={onOpenGuide} className="p-1 sm:p-2 rounded-xl text-white hover:bg-white/10 transition-all font-medium" aria-label="Guida">
                            <QuestionMarkIcon />
                        </button>
                        <button onClick={onOpenMonthlyReport} className="p-1 sm:p-2 rounded-xl text-white hover:bg-white/10 transition-all font-medium" aria-label="Report">
                            <DocumentIcon />
                        </button>
                        <button onClick={onOpenDailyRecap} className="p-1 sm:p-2 rounded-xl text-blue-400 hover:bg-blue-500/10 transition-all shadow-[0_0_15px_rgba(59,130,246,0.2)] animate-pulse-slow" aria-label="Recap Sessione">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </button>
                        <button onClick={onOpenDeleteDataModal} className="p-1 sm:p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all" aria-label="Cancella Dati">
                            <TrashIcon />
                        </button>
                        {isLoggedIn && onLogout && (
                            <button
                                onClick={onLogout}
                                className="p-1 sm:p-2 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                                aria-label="Disconnetti"
                            >
                                <LogoutIcon />
                            </button>
                        )}
                    </div>
                </div>

                {/* Close App Button */}
                {onCloseApp && (
                    <button
                        onClick={onCloseApp}
                        className="flex-shrink-0 p-2 sm:p-2.5 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-all border border-red-500/30 shadow-sm"
                        aria-label="Chiudi App"
                    >
                        <CloseIcon />
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;
