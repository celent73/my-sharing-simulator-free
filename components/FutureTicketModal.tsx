import React, { useState, useEffect } from 'react';
import { X, Plane, Star, ArrowRight, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FutureTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    monthlyRecurring: number;
    estimatedMonths: number;
    userName?: string;
}

const FutureTicketModal: React.FC<FutureTicketModalProps> = ({
    isOpen,
    onClose,
    monthlyRecurring,
    estimatedMonths,
    userName = "Prospect"
}) => {
    const { t } = useLanguage();
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => setShowContent(true), 100);
        } else {
            setShowContent(false);
        }
    }, [isOpen]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation (max 15 degrees)
        const rotateX = ((centerY - y) / centerY) * 15;
        const rotateY = ((x - centerX) / centerX) * 15;

        setTilt({ x: rotateX, y: rotateY });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
    };

    if (!isOpen) return null;

    const arrivalDate = new Date();
    arrivalDate.setMonth(arrivalDate.getMonth() + (estimatedMonths || 12));
    const dateString = arrivalDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

    return (
        <div className="fixed inset-0 z-[300] flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">

            {/* Close Button - Fixed position to ensure visibility */}
            <button
                onClick={onClose}
                className="fixed top-4 right-4 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-[301]"
            >
                <X size={24} />
            </button>

            <div className={`
                relative w-full max-w-2xl my-auto transform transition-all duration-700
                ${showContent ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-20'}
            `}>

                <h2 className="text-center text-xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 mb-4 md:mb-8 tracking-tighter drop-shadow-lg px-4 md:px-8 leading-tight">
                    {t('ticket.title') || "IL TUO BIGLIETTO PER IL FUTURO"}
                </h2>

                {/* 3D TICKET CONTAINER */}
                <div
                    className="relative perspective-1000 mx-auto"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{ perspective: '1000px' }}
                >
                    <div
                        className="relative w-full min-h-[400px] md:min-h-0 md:aspect-[2/1] rounded-[2rem] shadow-[0_20px_60px_rgba(251,191,36,0.3)] transition-transform duration-100 ease-out preserve-3d bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-visible md:overflow-hidden border border-amber-500/30 ring-1 ring-white/10"
                        style={{
                            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        {/* HOLOGRAPHIC SHINE OVERLAY - Hidden on mobile to prevent touch issues/visual clutter if overflow is visible */}
                        <div
                            className="absolute inset-0 z-20 pointer-events-none mix-blend-overlay opacity-50 bg-gradient-to-tr from-transparent via-white/40 to-transparent rounded-[2rem]"
                            style={{
                                transform: `translate(${tilt.y * 2}px, ${tilt.x * 2}px)`
                            }}
                        />

                        {/* TICKET CONTENT */}
                        <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-between text-white gap-6 md:gap-0">

                            {/* Header */}
                            <div className="flex justify-between items-start border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg animate-pulse">
                                        <Plane className="text-white transform -rotate-45" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase tracking-[0.2em] text-amber-500 font-bold">Boarding Pass</p>
                                        <h3 className="text-xl font-bold tracking-tight leading-none">FREEDOM AIRLINES</h3>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Classe</p>
                                    <p className="text-lg font-bold text-amber-400">V.I.P.</p>
                                </div>
                            </div>

                            {/* Main Info */}
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-6 py-2 md:py-4">
                                <div className="text-center md:text-left w-full md:w-auto">
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Passeggero</p>
                                    <p className="text-2xl md:text-3xl font-black truncate max-w-full">{userName}</p>
                                </div>

                                <div className="flex items-center gap-4 opacity-50 rotate-90 md:rotate-0 my-2 md:my-0">
                                    <div className="h-px w-8 bg-white/50"></div>
                                    <Plane className="rotate-90" />
                                    <div className="h-px w-8 bg-white/50"></div>
                                </div>

                                <div className="text-center md:text-right w-full md:w-auto">
                                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Destinazione</p>
                                    <p className="text-2xl md:text-3xl font-black text-amber-400">LIBERTÀ</p>
                                </div>
                            </div>

                            {/* Footer / Dynamic Data */}
                            <div className="bg-black/30 rounded-2xl p-4 backdrop-blur-sm border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                                <div className="w-full md:w-auto">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Arrivo Stimato</p>
                                    <p className="text-lg font-bold text-white">{dateString}</p>
                                </div>

                                <div className="h-px w-full md:w-px md:h-8 bg-white/10 block"></div>

                                <div className="w-full md:w-auto">
                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest">Valore Viaggio</p>
                                    <p className="text-xl md:text-2xl font-black text-emerald-400 break-words">€{monthlyRecurring.toLocaleString('it-IT')}<span className="text-sm text-white/70 font-normal">/mese</span></p>
                                </div>
                            </div>

                        </div>

                        {/* Decorative Circles */}
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full z-30 hidden md:block"></div>
                        <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-black rounded-full z-30 hidden md:block"></div>

                    </div>
                </div>

                {/* ACTION TEAR-OFFS */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                    <a
                        href="https://share.unionenergia.it/login?red=/il-mio-store/37633&nochecksession=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden bg-gradient-to-br from-indigo-600 to-blue-700 p-4 rounded-xl shadow-lg border-t border-white/20 hover:scale-[1.02] transition-all cursor-pointer block text-left animate-pulse hover:animate-none"
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">{t('ticket.economy_option')}</p>
                                <h4 className="text-lg font-bold text-white group-hover:text-blue-200 transition-colors">{t('ticket.become_client')}</h4>
                            </div>
                            <div className="p-2 bg-white/10 rounded-full text-white group-hover:bg-white group-hover:text-blue-700 transition-all">
                                <ArrowRight size={20} />
                            </div>
                        </div>
                    </a>

                    <a
                        href="https://share.unionenergia.it/login?red=/il-mio-store/37633&nochecksession=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 p-4 rounded-xl shadow-lg border-t border-white/20 hover:scale-[1.05] transition-all ring-2 ring-amber-400/50 hover:ring-amber-300 cursor-pointer block text-left animate-pulse hover:animate-none"
                    >
                        <div className="absolute top-0 right-0 p-1 bg-white text-orange-600 text-[10px] font-bold uppercase rounded-bl-lg">{t('ticket.recommended')}</div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-bold text-amber-100 uppercase tracking-widest mb-1">{t('ticket.business_option')}</p>
                                <h4 className="text-lg font-bold text-white group-hover:text-amber-100 transition-colors">{t('ticket.become_promoter')}</h4>
                            </div>
                            <div className="p-2 bg-white/20 rounded-full text-white group-hover:bg-white group-hover:text-orange-600 transition-all">
                                <Zap size={20} className="fill-current" />
                            </div>
                        </div>
                    </a>
                </div>

            </div>
        </div>
    );
};

export default FutureTicketModal;
