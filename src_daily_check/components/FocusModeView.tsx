import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageCircle, CheckCircle2, XCircle, Timer, Power, ChevronRight, Share2, Star } from 'lucide-react';
import { Lead, ActivityType, ActivityLog } from '../types';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface FocusModeViewProps {
    activityLogs: ActivityLog[];
    onClose: () => void;
    onEditLead: (type: ActivityType, lead: Lead) => void;
    onCompleteLead: (lead: Lead, status: 'won' | 'lost') => void;
}

const FocusModeView: React.FC<FocusModeViewProps> = ({ 
    activityLogs, 
    onClose, 
    onEditLead,
    onCompleteLead
}) => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    // Filter leads that need follow-up today
    const leadsToProcess = useMemo(() => {
        const todayStr = format(new Date(), 'yyyy-MM-dd');
        return activityLogs
            .flatMap(log => log.leads || [])
            .filter(lead => 
                lead.status === 'pending' && 
                (lead.followUpDate === todayStr || (!lead.followUpDate && lead.type === ActivityType.CONTACTS))
            );
    }, [activityLogs]);

    const currentLead = leadsToProcess[currentIndex];

    useEffect(() => {
        let interval: any = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleNext = () => {
        if (currentIndex < leadsToProcess.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handleAction = (type: 'call' | 'whatsapp') => {
        if (!currentLead?.phone) return;
        const phone = currentLead.phone.replace(/\Ds/g, '');
        if (type === 'call') {
            window.location.href = `tel:${phone}`;
        } else {
            window.open(`https://wa.me/${phone}`, '_blank');
        }
    };

    if (leadsToProcess.length === 0) {
        return (
            <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center mb-8 border border-emerald-500/20">
                    <CheckCircle2 size={64} className="text-emerald-500" />
                </div>
                <h2 className="text-4xl font-black text-white mb-4">Ottimo Lavoro!</h2>
                <p className="text-slate-400 text-lg max-w-sm">Tutti i follow-up di oggi sono stati gestiti. Goditi il resto della giornata o trova nuovi lead!</p>
                <button 
                    onClick={onClose}
                    className="mt-12 px-12 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-lg shadow-2xl active:scale-95 transition-all"
                >
                    Torna alla Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col overflow-hidden">
            {/* Header / Stats */}
            <div className="px-8 pt-12 pb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={onClose}
                        className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white"
                    >
                        <Power size={20} className="text-red-500" />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-widest uppercase">Focus Mode</h2>
                        <div className="flex items-center gap-2 text-slate-500 font-bold text-xs">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                             {leadsToProcess.length - currentIndex} CONTATTI RIMANENTI
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 shadow-inner">
                    <Timer size={18} className="text-indigo-400" />
                    <span className="font-mono text-2xl font-black text-white tracking-tighter">{formatTime(seconds)}</span>
                </div>
            </div>

            {/* Main Card Area */}
            <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 max-w-4xl mx-auto w-full">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentLead?.id}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -50, scale: 0.9 }}
                        className="relative"
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full -z-10" />

                        <div className="bg-white/[0.05] border border-white/10 rounded-[3.5rem] p-8 sm:p-12 shadow-[0_32px_64px_rgba(0,0,0,0.5)] backdrop-blur-3xl relative overflow-hidden">
                            {/* Temperature Tag */}
                            <div className="absolute top-8 right-8">
                                <span className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${
                                    currentLead.temperature === 'caldo' ? 'bg-orange-500/20 text-orange-400 border-orange-500/20' :
                                    currentLead.temperature === 'tiepido' ? 'bg-amber-500/20 text-amber-400 border-amber-500/20' :
                                    'bg-blue-500/20 text-blue-400 border-blue-500/20'
                                }`}>
                                    {currentLead.temperature || 'Contatto'} {currentLead.temperature === 'caldo' ? '🔥' : ''}
                                </span>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                                        {currentLead.name || 'Senza Nome'}
                                    </h3>
                                    <p className="text-xl sm:text-2xl font-bold text-slate-500 mt-2">
                                        {currentLead.phone || 'Nessun numero'}
                                    </p>
                                </div>

                                {currentLead.note && (
                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                                        <p className="text-white/70 text-lg leading-relaxed font-medium">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">ULTIME NOTE</span>
                                            "{currentLead.note}"
                                        </p>
                                    </div>
                                )}

                                {/* Action Phase Buttons */}
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <button 
                                        onClick={() => handleAction('call')}
                                        className="h-24 bg-indigo-500 hover:bg-indigo-600 text-white rounded-[2.5rem] flex flex-col items-center justify-center gap-2 shadow-2xl shadow-indigo-500/30 transition-all active:scale-95 group"
                                    >
                                        <Phone className="group-hover:scale-110 transition-transform" />
                                        <span className="font-black text-[10px] uppercase tracking-widest">Chiama Ora</span>
                                    </button>
                                    <button 
                                        onClick={() => handleAction('whatsapp')}
                                        className="h-24 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[2.5rem] flex flex-col items-center justify-center gap-2 shadow-2xl shadow-emerald-500/30 transition-all active:scale-95 group"
                                    >
                                        <MessageCircle className="group-hover:scale-110 transition-transform" />
                                        <span className="font-black text-[10px] uppercase tracking-widest">WhatsApp</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Controls */}
            <div className="px-8 pb-12 pt-6 bg-slate-950/80 backdrop-blur-md">
                <div className="max-w-4xl mx-auto flex gap-4">
                    <button 
                        onClick={() => onCompleteLead(currentLead, 'lost')}
                        className="flex-1 py-6 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-[2rem] font-black text-sm uppercase tracking-widest border border-red-500/20 transition-all"
                    >
                        Perso ❌
                    </button>
                    
                    <button 
                        onClick={() => onCompleteLead(currentLead, 'won')}
                        className="flex-[2] py-6 bg-white text-slate-950 hover:bg-emerald-50 rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3"
                    >
                        Chiuso ✨ VITTORIA!
                    </button>

                    <button 
                        onClick={handleNext}
                        className="flex-1 py-6 bg-white/10 hover:bg-white/20 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center border border-white/10"
                    >
                        Salta <ChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FocusModeView;
