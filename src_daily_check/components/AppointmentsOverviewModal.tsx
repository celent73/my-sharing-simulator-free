import React, { useMemo } from 'react';
import { ActivityLog, ActivityType, Lead } from '../types';

interface AppointmentsOverviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    activityLogs: ActivityLog[];
}

const AppointmentsOverviewModal: React.FC<AppointmentsOverviewModalProps> = ({ isOpen, onClose, activityLogs }) => {

    // Process appointments directly from activity logs
    const appointments = useMemo(() => {
        if (!isOpen || !activityLogs) return [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming: Lead[] = [];

        activityLogs.forEach(log => {
            if (log.leads) {
                log.leads.forEach(lead => {
                    // Only appointments with a valid date and scheduled for today or the future
                    if (lead.type === ActivityType.APPOINTMENTS && lead.appointmentDate) {
                        const d = new Date(lead.appointmentDate);
                        if (d >= today) {
                            upcoming.push(lead);
                        }
                    }
                });
            }
        });

        // Sort upcoming from the nearest to the furthest
        upcoming.sort((a, b) => new Date(a.appointmentDate!).getTime() - new Date(b.appointmentDate!).getTime());
        return upcoming;
    }, [isOpen, activityLogs]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-slate-900 border border-slate-700/50 rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col relative z-10 shadow-2xl overflow-hidden transform transition-all">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-xl z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white">Appuntamenti Fissati</h2>
                            <p className="text-xs font-medium text-slate-400">I tuoi prossimi impegni programmati</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors border border-slate-700"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {appointments.length === 0 ? (
                        <div className="text-center py-16 px-4">
                            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                                <span className="text-3xl grayscale opacity-50">📅</span>
                            </div>
                            <h3 className="text-white font-black text-lg mb-2">Nessun appuntamento</h3>
                            <p className="text-slate-400 text-sm max-w-[250px] mx-auto">
                                Non hai ancora nessun appuntamento futuro programmato.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {appointments.map((app) => {
                                const d = new Date(app.appointmentDate!);
                                const dateStr = d.toLocaleDateString('it-IT', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
                                const timeStr = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

                                return (
                                    <div key={app.id} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 hover:bg-slate-800 hover:border-slate-600 transition-all group">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                            {/* Date/Time Badge */}
                                            <div className="flex items-center gap-3 bg-slate-900/80 border border-slate-700/50 rounded-xl px-4 py-2.5 shrink-0 min-w-[140px] justify-center">
                                                <div className="text-center">
                                                    <p className="text-[10px] font-black uppercase text-emerald-500 tracking-wider leading-none mb-1">{dateStr}</p>
                                                    <p className="text-lg font-black text-white leading-none">{timeStr}</p>
                                                </div>
                                            </div>

                                            {/* Contact Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-lg font-black text-white truncate mb-1">{app.name}</h4>

                                                <div className="flex flex-wrap items-center gap-3 mt-2">
                                                    {/* Location Badge */}
                                                    {app.locationType === 'online' ? (
                                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                            {app.platform || 'Online'}
                                                        </div>
                                                    ) : app.locationType === 'physical' ? (
                                                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                            {app.address ? (
                                                                <span className="truncate max-w-[150px]">{app.address}</span>
                                                            ) : 'Di Persona'}
                                                        </div>
                                                    ) : null}
                                                </div>

                                                {app.note && (
                                                    <p className="mt-3 text-sm text-slate-400 line-clamp-2 bg-slate-900/50 p-2.5 rounded-lg border border-slate-700/30">
                                                        <span className="text-xs font-bold text-slate-500 mr-2">NOTE:</span>
                                                        {app.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentsOverviewModal;
