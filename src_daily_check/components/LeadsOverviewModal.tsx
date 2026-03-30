import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactDOM from 'react-dom';
import { ActivityLog, ActivityType, Lead, ContractType } from '../types';
import { ACTIVITY_LABELS } from '../constants';
import { it } from 'date-fns/locale';
import { format } from 'date-fns';

interface LeadsOverviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (lead: Lead) => void;
    activityLogs: ActivityLog[];
    activityType: ActivityType;
    filterDate?: Date | null;
    customLabel?: string;
}

const LeadsOverviewModal: React.FC<LeadsOverviewModalProps> = ({ 
    isOpen, 
    onClose, 
    onEdit, 
    activityLogs, 
    activityType,
    filterDate,
    customLabel 
}) => {

    const capitalize = (str: string) => str ? str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ') : "";

    const leads = useMemo(() => {
        if (!isOpen || !activityLogs) return [];

        const filterStr = filterDate ? format(filterDate, 'yyyy-MM-dd') : null;
        const allLeads: Lead[] = [];

        activityLogs.forEach(log => {
            if (log.leads) {
                log.leads.forEach(lead => {
                    if (lead && lead.status !== 'lost') {
                        // Logic for Contacts
                        if (activityType === ActivityType.CONTACTS) {
                            if (lead.type === ActivityType.CONTACTS) {
                                // For Contacts list, only show pending ones without an appointment date
                                if (lead.status === 'pending' && !lead.appointmentDate && !lead.linkedAppointment) {
                                  if (!filterStr || log.date === filterStr) {
                                    allLeads.push(lead);
                                  }
                                }
                            }
                        } 
                        // Logic for Contracts and Family Utilities
                        else if (activityType === ActivityType.NEW_CONTRACTS) {
                             // "Nuovi Contratti" shows everything won (Normal Contracts + Family Utilities)
                             if ((lead.type === ActivityType.NEW_CONTRACTS || lead.type === ActivityType.NEW_FAMILY_UTILITY) && lead.status === 'won') {
                                 const updatedDateStr = lead.updatedAt ? lead.updatedAt.split('T')[0] : log.date;
                                 if (!filterStr || updatedDateStr === filterStr) {
                                     allLeads.push(lead);
                                 }
                             }
                        }
                        else if (activityType === ActivityType.NEW_FAMILY_UTILITY) {
                             // "Family Utility" shows its own type AND generic "NEW_CONTRACTS" that are "GREEN"
                             if ((lead.type === ActivityType.NEW_FAMILY_UTILITY || (lead.type === ActivityType.NEW_CONTRACTS && lead.contractType === ContractType.GREEN)) && lead.status === 'won') {
                                 const updatedDateStr = lead.updatedAt ? lead.updatedAt.split('T')[0] : log.date;
                                 if (!filterStr || updatedDateStr === filterStr) {
                                     allLeads.push(lead);
                                 }
                             }
                        }
                        // Default logic for other types (e.g., Appointments handled by other modals, but here for safety)
                        else if (lead.type === activityType) {
                            if (!filterStr || log.date === filterStr) {
                                allLeads.push(lead);
                            }
                        }
                    }
                });
            }
        });

        allLeads.sort((a, b) => {
            // Sort by update date (won date) if available, otherwise by creation date
            const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : (a.date ? new Date(a.date).getTime() : 0);
            const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : (b.date ? new Date(b.date).getTime() : 0);
            return dateB - dateA;
        });

        return allLeads;
    }, [isOpen, activityLogs, activityType, filterDate]);

    if (!isOpen) return null;

    const label = customLabel || ACTIVITY_LABELS[activityType] || 'Contatti';

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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">
                                    {label}
                                </h2>
                                <p className="text-sm font-medium text-white/70">
                                    {filterDate 
                                        ? format(filterDate, 'd MMMM yyyy', { locale: it })
                                        : `Elenco completo ${label.toLowerCase()}`}
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
                        {leads.length === 0 ? (
                            <div className="text-center py-20 px-4">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                                    <span className="text-4xl opacity-40">👥</span>
                                </div>
                                <h3 className="text-white font-medium text-xl mb-2">Nessun contatto</h3>
                                <p className="text-white/60 text-sm max-w-[280px] mx-auto">
                                    {filterDate 
                                        ? 'Non hai nessun contatto registrato per questa data.' 
                                        : 'Non hai ancora registrato nessun contatto.'}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 mt-4">
                                {leads.map((lead) => {
                                    const d = lead.date ? new Date(lead.date) : new Date();
                                    const dateStr = format(d, 'd MMM yyyy', { locale: it });
                                    const timeStr = format(d, 'HH:mm');

                                    return (
                                        <div key={lead.id} className="relative group">
                                            <div className="bg-white/[0.07] border border-white/10 rounded-[1.75rem] p-6 hover:bg-white/[0.12] transition-all flex flex-col sm:flex-row gap-6 items-start sm:items-center active:scale-[0.98]">
                                                
                                                {/* Date/Time - Refined iOS Style */}
                                                <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0 shrink-0 min-w-[80px]">
                                                    <span className="text-2xl font-bold text-white tracking-tighter">{timeStr}</span>
                                                    <div className="flex items-center gap-1 opacity-70">
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
                                                                {capitalize(lead.name || 'Senza Nome')}
                                                            </h4>
                                                            {lead.temperature && activityType === ActivityType.CONTACTS && (
                                                                <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter backdrop-blur-md border ${
                                                                    lead.temperature === 'caldo' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                                                                    lead.temperature === 'tiepido' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                                                                    'bg-blue-500/20 text-blue-400 border-blue-500/40'
                                                                }`}>
                                                                    {lead.temperature === 'caldo' ? 'Caldo 🔥' : lead.temperature === 'tiepido' ? 'Tiepido 🌤️' : 'Freddo ❄️'}
                                                                </div>
                                                            )}
                                                            {lead.status === 'won' && (
                                                                <div className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tighter bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 backdrop-blur-md">
                                                                    {lead.type === ActivityType.NEW_FAMILY_UTILITY ? 'Family Utility ✨' : 'Cliente Privilegiato ✨'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                                                        {lead.phone && (
                                                            <div className="flex items-center gap-1.5 text-white/80 text-xs font-bold">
                                                                <span className="opacity-60">📞</span>
                                                                {lead.phone}
                                                            </div>
                                                        )}
                                                        {lead.type && activityType === ActivityType.CONTACTS && (
                                                            <div className="flex items-center gap-1.5 text-white/50 text-[10px] font-black uppercase tracking-widest">
                                                                <span className="opacity-50 text-white">•</span>
                                                                <span>{ACTIVITY_LABELS[lead.type]}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <button
                                                    onClick={() => onEdit(lead)}
                                                    className="absolute top-6 right-6 sm:static p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white/60 hover:text-white transition-all border border-white/10 shadow-sm active:scale-90"
                                                >
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {/* Notes - Refined Style */}
                                            {lead.note && (
                                                <div className="mx-6 px-4 py-3 -mt-2 bg-white/[0.04] border-x border-b border-white/10 rounded-b-2xl">
                                                    <p className="text-[13px] text-white/80 leading-relaxed font-medium">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 mr-2 not-italic font-sans">Note:</span>
                                                        {lead.note}
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

export default LeadsOverviewModal;
