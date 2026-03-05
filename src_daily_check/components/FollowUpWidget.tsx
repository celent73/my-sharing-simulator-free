import React, { useMemo } from 'react';
import { ActivityLog, Lead, ActivityType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface FollowUpWidgetProps {
    activityLogs: ActivityLog[];
    onEditLead: (type: ActivityType, lead: Lead) => void;
}

const FollowUpWidget: React.FC<FollowUpWidgetProps> = ({ activityLogs, onEditLead }) => {
    const followUps = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const allLeads: Lead[] = [];

        activityLogs.forEach(log => {
            if (log.leads) {
                log.leads.forEach(lead => {
                    if (lead.followUpDate && lead.status === 'pending') {
                        allLeads.push(lead);
                    }
                });
            }
        });

        // Filter and sort: Overdue first, then Today
        return allLeads
            .filter(lead => lead.followUpDate! <= today)
            .sort((a, b) => a.followUpDate!.localeCompare(b.followUpDate!));
    }, [activityLogs]);

    if (followUps.length === 0) return null;

    const getStatusColor = (date: string) => {
        const today = new Date().toISOString().split('T')[0];
        if (date < today) return 'text-red-500 bg-red-500/10 border-red-500/20';
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    };

    const getStatusLabel = (date: string) => {
        const today = new Date().toISOString().split('T')[0];
        if (date < today) return 'SCADUTO';
        return 'OGGI';
    };

    return (
        <div className="mb-8 w-full max-w-5xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🚀</span>
                <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Prossimi Follow-up</h3>
                <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{followUps.length}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <AnimatePresence mode="popLayout">
                    {followUps.map((lead) => (
                        <motion.div
                            key={lead.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                {/* Status Badge */}
                                <div className={`shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl border font-black text-[9px] ${getStatusColor(lead.followUpDate!)}`}>
                                    <span className="leading-none mb-1 text-base">📞</span>
                                    {getStatusLabel(lead.followUpDate!)}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h4 className="font-black text-slate-800 dark:text-white truncate">{lead.name}</h4>
                                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-bold">
                                        <span>{lead.phone}</span>
                                        {lead.note && <span className="opacity-50">•</span>}
                                        <span className="truncate italic">{lead.note}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            const message = encodeURIComponent(`Ciao ${lead.name}, sono un consulente di My Sharing. Ti contatto in merito alla nostra chiacchierata...`);
                                            window.open(`https://wa.me/${lead.phone.replace(/\s+/g, '')}?text=${message}`, '_blank');
                                        }}
                                        className="p-2.5 bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center"
                                        title="Invia WhatsApp"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 448 512">
                                            <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.7 17.7 69.4 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.1 0-65.6-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.2-8.5-44.2-27.2-16.4-14.6-27.4-32.7-30.6-38.1-3.2-5.5-.3-8.4 2.5-11.2 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.5-9.2 1.9-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => onEditLead(lead.type, lead)}
                                        className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Simple Progress line for visual flair */}
                            <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500/50 to-cyan-500/50 w-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FollowUpWidget;
