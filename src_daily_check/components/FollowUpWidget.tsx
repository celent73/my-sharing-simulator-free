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

                                <button
                                    onClick={() => onEditLead(lead.type, lead)}
                                    className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-blue-500 hover:text-white rounded-xl transition-all shadow-sm active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                            </div>

                            {/* Simple Progress line for visual flair */}
                            <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-blue-500/50 to-cyan-500/50 w-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FollowUpWidget;
