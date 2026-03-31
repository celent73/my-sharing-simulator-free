import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import { ActivityLog, ActivityType, Lead } from '../types';

interface AppointmentsOverviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (lead: Lead) => void;
    activityLogs: ActivityLog[];
    filterDate?: Date | null;
}

const AppointmentsOverviewModal: React.FC<AppointmentsOverviewModalProps> = ({ isOpen, onClose, onEdit, activityLogs, filterDate }) => {

    // Helper for capitalization
    const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : "";

    // Process appointments directly from activity logs
    const appointments = useMemo(() => {
        if (!isOpen || !activityLogs) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const filterStr = filterDate ? filterDate.toISOString().split('T')[0] : null;

        const upcoming: (Lead & { _displayDate: string, _isFollowUp: boolean })[] = [];

        activityLogs.forEach(log => {
            if (log.leads) {
                log.leads.forEach(lead => {
                    if (lead.status !== 'won' && lead.status !== 'lost') {
                        let isMatch = false;
                        let displayDate = '';
                        let isFollowUp = false;

                        if (filterStr) {
                            if (lead.appointmentDate?.startsWith(filterStr)) {
                                isMatch = true;
                                displayDate = lead.appointmentDate;
                            } else if (lead.followUpDate?.startsWith(filterStr)) {
                                isMatch = true;
                                displayDate = lead.followUpDate;
                                isFollowUp = true;
                            } else if ((log.date === filterStr || lead.updatedAt?.startsWith(filterStr)) && (lead.type === ActivityType.APPOINTMENTS || lead.appointmentDate)) {
                                isMatch = true;
                                displayDate = lead.appointmentDate || lead.date;
                            }
                        } else {
                            // Vista generale: SOLO appuntamenti futuri (escludiamo i Follow-Up qui per non confondere)
                            const isApp = lead.type === ActivityType.APPOINTMENTS || lead.appointmentDate;
                            const hasFutureApp = lead.appointmentDate && new Date(lead.appointmentDate) >= today;
                            
                            if (isApp && hasFutureApp) {
                                isMatch = true;
                                displayDate = lead.appointmentDate!;
                            } else if (isApp && !lead.appointmentDate && log.date === filterStr) {
                                // Se è nel log di oggi come Appuntamento ma senza data specifica (raro)
                                isMatch = true;
                                displayDate = log.date;
                            }
                        }

                        if (isMatch && displayDate) {
                            upcoming.push({ ...lead, _displayDate: displayDate, _isFollowUp: isFollowUp });
                        }
                    }
                });
            }
        });

        // Sort upcoming from the nearest to the furthest
        upcoming.sort((a, b) => new Date(a._displayDate).getTime() - new Date(b._displayDate).getTime());
        return upcoming;
    }, [isOpen, activityLogs]);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[200000] flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/80 backdrop-blur-2xl" 
                    onClick={onClose} 
                />
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 10 }}
                    className="bg-slate-900/95 border border-white/10 rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] flex flex-col relative z-10 shadow-[0_32px_64px_rgba(0,0,0,0.8)] overflow-hidden backdrop-blur-3xl"
                >
                    {/* Header */}
                    <div className="px-8 py-6 flex items-center justify-between sticky top-0 bg-transparent z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">
                                    {filterDate ? 'Agenda' : 'Prossimi Appuntamenti'}
                                </h2>
                                <p className="text-sm font-medium text-white/70">
                                    {filterDate 
                                        ? filterDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) 
                                        : 'Lista dei contatti e impegni salvati'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/10 text-white/80 hover:text-white hover:bg-white/20 flex items-center justify-center transition-all border border-white/10 active:scale-90"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-8 pb-8 overflow-y-auto flex-1 custom-scrollbar">
                        {appointments.length === 0 ? (
                            <div className="text-center py-20 px-4">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                                    <span className="text-4xl opacity-40">📅</span>
                                </div>
                                <h3 className="text-white font-medium text-xl mb-2">Nessun appuntamento</h3>
                                <p className="text-white/60 text-sm max-w-[280px] mx-auto">
                                    {filterDate 
                                        ? 'Nessun impegno salvato per questa giornata.' 
                                        : 'Non hai ancora registrato dei contatti o appuntamenti futuri.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 mt-4">
                                {appointments.map((app) => {
                                    const d = new Date(app._displayDate);
                                    const dateStr = d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' });
                                    const weekdayStr = d.toLocaleDateString('it-IT', { weekday: 'short' });
                                    const hasTime = app._displayDate.includes('T') && app._displayDate.split('T')[1].length >= 5;
                                    const timeStr = hasTime ? d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }) : '--:--';

                                    return (
                                        <div key={app.id} className="relative group">
                                            <div className="bg-white/[0.07] border border-white/10 rounded-[1.75rem] p-6 hover:bg-white/[0.12] transition-all flex flex-col sm:flex-row gap-6 items-start sm:items-center active:scale-[0.98]">
                                                
                                                {/* Date/Time - Refined iOS Style */}
                                                <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0 shrink-0 min-w-[80px]">
                                                    <span className="text-2xl font-bold text-white tracking-tighter">{timeStr}</span>
                                                    <div className="flex items-center gap-1 opacity-70">
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">{weekdayStr}</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white">{dateStr}</span>
                                                    </div>
                                                </div>

                                                {/* Divider for Desktop */}
                                                <div className="hidden sm:block w-[1px] h-10 bg-white/10" />

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2 truncate">
                                                            <h4 className="text-xl font-bold text-white truncate tracking-tight">
                                                                {capitalize(app.name)}
                                                            </h4>
                                                            {app._isFollowUp && (
                                                                <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter backdrop-blur-md border bg-purple-500/10 text-purple-400 border-purple-500/20">
                                                                    Follow-Up 🚀
                                                                </div>
                                                            )}
                                                            {!app._isFollowUp && app.temperature && (
                                                                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter backdrop-blur-md border ${
                                                                    app.temperature === 'caldo' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                                                    app.temperature === 'tiepido' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                                    'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                                }`}>
                                                                    {app.temperature === 'caldo' ? 'Caldo 🔥' : app.temperature === 'tiepido' ? 'Tiepido 🌤️' : 'Freddo ❄️'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                        {app.locationType === 'online' ? (
                                                            <div className="flex items-center gap-1.5 text-white/40 text-xs text font-medium">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
                                                                {app.platform || 'Online'}
                                                            </div>
                                                        ) : app.locationType === 'physical' ? (
                                                            <div className="flex items-center gap-1.5 text-white/40 text-xs text font-medium">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                                                                {app.address ? <span className="truncate max-w-[150px]">{app.address}</span> : 'In presenza'}
                                                            </div>
                                                        ) : null}
                                                        {app.phone && (
                                                            <div className="flex items-center gap-1.5 text-white/80 text-xs font-bold">
                                                                <span className="opacity-60">📞</span>
                                                                {app.phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <button
                                                    onClick={() => onEdit(app)}
                                                    className="absolute top-6 right-6 sm:static p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all border border-white/10 shadow-sm active:scale-90"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Notes - Refined Style */}
                                            {app.note && (
                                                <div className="mx-6 px-4 py-3 -mt-2 bg-white/[0.04] border-x border-b border-white/10 rounded-b-2xl">
                                                    <p className="text-[13px] text-white/80 leading-relaxed font-medium">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mr-2 not-italic font-sans">Note:</span>
                                                        {app.note}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default AppointmentsOverviewModal;
