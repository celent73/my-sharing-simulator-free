import React from 'react';
import {
    Calendar,
    BarChart2,
    Trophy,
    Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

export type ActiveView = 'today' | 'stats' | 'career' | 'settings';

interface FocusNavigationProps {
    activeView: ActiveView;
    onViewChange: (view: ActiveView) => void;
}

const navItems = [
    { id: 'today', label: 'Oggi', icon: Calendar },
    { id: 'stats', label: 'Analisi', icon: BarChart2 },
    { id: 'career', label: 'Carriera', icon: Trophy },
    { id: 'settings', label: 'Profilo', icon: Settings },
];

export const FocusNavigation: React.FC<FocusNavigationProps> = ({ activeView, onViewChange }) => {
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
        <>
            {/* Desktop Sidebar (Left) */}
            <aside className="hidden lg:flex flex-col w-20 fixed left-0 top-0 h-screen bg-white/10 dark:bg-black/20 backdrop-blur-xl border-r border-white/10 dark:border-white/5 z-50 items-center py-10 transition-all hover:w-24 group">
                <div className="flex flex-col gap-8 w-full px-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onViewChange(item.id as ActiveView)}
                            className={`relative group flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 ${activeView === item.id
                                ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
                                : 'text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <item.icon className={`h-7 w-7 transition-transform duration-300 ${activeView === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                            <span className="text-[10px] font-bold mt-1.5 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.label}
                            </span>
                            {activeView === item.id && (
                                <motion.div
                                    layoutId="activeNavIndicator"
                                    className="absolute -right-2 w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6]"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </aside>

            {/* Mobile Floating Tab Bar (Bottom) */}
            <nav className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-sm h-16 bg-slate-900/95 backdrop-blur-3xl rounded-full border border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] px-2 flex items-center justify-around transition-all duration-500 ease-in-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[200%] opacity-0 pointer-events-none'}`}>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id as ActiveView)}
                        className={`relative flex flex-col items-center justify-center h-12 w-12 rounded-full transition-all duration-300 ${activeView === item.id ? 'text-white bg-white/10' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                            }`}
                    >
                        <item.icon className={`h-5 w-5 ${activeView === item.id ? 'scale-110 drop-shadow-md' : ''}`} />
                    </button>
                ))}
            </nav>
        </>
    );
};
