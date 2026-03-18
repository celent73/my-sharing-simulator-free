import React, { useMemo, useState } from 'react';
import { ActivityLog, Lead, ActivityType } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { getTodayDateString } from '../utils/dateUtils';
import { format, subDays, isToday, isPast } from 'date-fns';
import { Clock, ChevronRight, AlertCircle, Calendar } from 'lucide-react';

interface FollowUpBannerProps {
    activityLogs: ActivityLog[];
    onEditLead: (type: ActivityType, lead: Lead) => void;
    onOpenChange?: (open: boolean) => void;
    nextFollowUp?: Lead | null;
}
const FollowUpBanner: React.FC<FollowUpBannerProps> = ({ activityLogs, onEditLead, onOpenChange, nextFollowUp }) => {
    const { followUps, staleLeads, recentLeads, futureLeads, unregisteredContacts, debugInfo } = useMemo(() => {
        const todayStr = getTodayDateString();
        const threeDaysAgoStr = format(subDays(new Date(), 3), 'yyyy-MM-dd');

        const scheduled: Lead[] = [];
        const stale: Lead[] = [];
        const recent: Lead[] = [];
        const future: Lead[] = [];
        const processedIds = new Set<string>();
        let totalContactsCount = 0;
        let registeredLeadsCount = 0;
        const countsByStatus: Record<string, number> = { pending: 0, won: 0, lost: 0, missing: 0 };
        const typesCount: Record<string, number> = {};
        const datesFound: string[] = [];

        activityLogs.forEach(log => {
            const logDateStr = log.date; 
            if (logDateStr >= threeDaysAgoStr) {
                totalContactsCount += log.counts[ActivityType.CONTACTS] || 0;
            }

            if (log.leads) {
                log.leads.forEach(lead => {
                    const status = lead.status || 'pending';
                    const type = lead.type || ActivityType.CONTACTS;
                    
                    if (!lead.status) countsByStatus.missing++;
                    else countsByStatus[lead.status] = (countsByStatus[lead.status] || 0) + 1;
                    
                    typesCount[type] = (typesCount[type] || 0) + 1;

                    if (status === 'pending') {
                        // RENDER-LEVEL DEDUPLICATION
                        if (lead.id && processedIds.has(lead.id)) return;
                        if (lead.id) processedIds.add(lead.id);

                        // Unifichiamo la data di riferimento...
                        const leadDateOnly = lead.date ? lead.date.split('T')[0] : logDateStr;
                        const leadRefDate = lead.followUpDate || leadDateOnly;
                        
                        // FIX: Protezione contro lead.id mancante (causa pagina bianca)
                        const safeId = lead.id || 'no-id';
                        datesFound.push(`${lead.name}:${leadRefDate}(${safeId.slice(-4)})`);

                        if (lead.followUpDate) {
                            if (lead.followUpDate <= todayStr) {
                                scheduled.push(lead);
                            } else {
                                future.push(lead);
                            }
                        } else {
                            if (leadRefDate <= todayStr) {
                                scheduled.push(lead);
                            } else {
                                future.push(lead);
                            }
                        }
                    }

                    // Qualsiasi lead registrato in questo periodo conta come "registrazione" riuscita,
                    // anche se è stato trasformato in Appuntamento o Cliente.
                    const leadDateOnly = lead.date ? lead.date.split('T')[0] : logDateStr;
                    if (leadDateOnly >= threeDaysAgoStr) {
                        registeredLeadsCount++;
                    }
                });
            }
        });

        return {
            followUps: scheduled.sort((a, b) => (a.followUpDate || '').localeCompare(b.followUpDate || '')),
            staleLeads: stale.sort((a, b) => (a.followUpDate || a.date || '').localeCompare(b.followUpDate || b.date || '')),
            recentLeads: recent.sort((a, b) => (b.followUpDate || b.date || '').localeCompare(a.followUpDate || a.date || '')),
            futureLeads: future.sort((a, b) => (a.followUpDate || '').localeCompare(b.followUpDate || '')),
            unregisteredContacts: Math.max(0, totalContactsCount - registeredLeadsCount),
            debugInfo: { todayStr, logsCount: activityLogs.length, totalContactsCount, registeredLeadsCount, countsByStatus, typesCount, datesFound: datesFound.slice(0, 5) }
        };
    }, [activityLogs]);


    const getStatusColor = (date: string, isStale: boolean = false) => {
        if (isStale) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        const today = getTodayDateString();
        if (date < today) return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (date === today) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    };

    const getStatusLabel = (date: string, isStale: boolean = false) => {
        if (isStale) return 'SOSPESO';
        const today = getTodayDateString();
        if (date < today) return 'SCADUTO';
        if (date === today) return 'OGGI';
        return 'FISSATO';
    };

    const renderLeadCard = (lead: Lead, isStale: boolean = false) => (
        <motion.div
            key={lead.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
        >
            <div className="flex items-center gap-4 relative z-10">
                {/* Status Badge */}
                <div className={`shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl border font-black text-[9px] ${getStatusColor(isStale ? lead.date : lead.followUpDate!, isStale)}`}>
                    <span className="leading-none mb-1 text-base">{isStale ? '⏳' : '📞'}</span>
                    {getStatusLabel(isStale ? lead.date : lead.followUpDate!, isStale)}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-800 dark:text-white truncate">{lead.name}</h4>
                        {lead.temperature && (
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                                lead.temperature === 'caldo' ? 'bg-emerald-500/20 text-emerald-600' :
                                lead.temperature === 'tiepido' ? 'bg-amber-500/20 text-amber-600' :
                                'bg-red-500/20 text-red-600'
                            }`}>
                                {lead.temperature === 'caldo' ? '🔥' : lead.temperature === 'tiepido' ? '🌤️' : '❄️'} {lead.temperature}
                            </span>
                        )}
                    </div>
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
    );

    const [isOpen, setIsOpen] = useState(false);

    const handleOpen = () => {
        setIsOpen(true);
        onOpenChange?.(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        onOpenChange?.(false);
    };

    // Rimosso il return null per garantire feedback visivo che il componente esiste
    const hasItems = followUps.length > 0 || staleLeads.length > 0 || recentLeads.length > 0 || futureLeads.length > 0 || unregisteredContacts > 0;

    return (
        <div className="mb-8 w-full max-w-5xl mx-auto">
            <button
                onClick={handleOpen}
                className="w-full flex items-center justify-between p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:scale-[1.01] hover:shadow-lg transition-all shadow-sm group"
            >
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        📝
                    </div>
                    <div className="text-left">
                        <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight text-sm sm:text-base">Gestione Follow-up</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1">
                            {hasItems ? (
                                <>
                                    <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                                        {followUps.length} programmati
                                    </span>
                                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md">
                                        {staleLeads.length} in sospeso
                                    </span>
                                    {recentLeads.length > 0 && (
                                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-md">
                                            {recentLeads.length} recenti da pianificare
                                        </span>
                                    )}
                                    {futureLeads.length > 0 && (
                                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md">
                                            {futureLeads.length} pianificati
                                        </span>
                                    )}
                                    {unregisteredContacts > 0 && (
                                        <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-md animate-pulse">
                                            {unregisteredContacts} contatti da registrare
                                        </span>
                                    )}
                                </>
                            ) : (
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md">
                                    ✅ Ottimo lavoro! Nessun follow-up in sospeso.
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 text-blue-500 font-bold px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    Apri
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </button>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-0 md:p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={handleClose}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col relative z-10 shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                        <span className="text-xl">📝</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-black text-slate-900 dark:text-white">Gestione Follow-up</h2>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Contatti in attesa di risposta o richiamata</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar space-y-8">
                                {nextFollowUp && (new Date(nextFollowUp.followUpDate!).getTime() < new Date().setHours(23,59,59,999)) && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-3xl flex items-center justify-between gap-4"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                                                <AlertCircle size={24} />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-orange-900 dark:text-orange-200 uppercase tracking-tighter">
                                                    {isPast(new Date(nextFollowUp.followUpDate!)) && !isToday(new Date(nextFollowUp.followUpDate!)) ? 'Follow-up Scaduto ⚠️' : 'Azione Richiesta Oggi 🚀'}
                                                </h4>
                                                <p className="text-xs font-bold text-orange-700 dark:text-orange-400">Non dimenticare di contattare {nextFollowUp.name}</p>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => onEditLead(nextFollowUp.type || ActivityType.CONTACTS, nextFollowUp)}
                                            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-xl shadow-lg transition-all active:scale-95"
                                        >
                                            GESTISCI ORA
                                        </button>
                                    </motion.div>
                                )}
                                {followUps.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">🚀</span>
                                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Prossimi Follow-up</h3>
                                            <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{followUps.length}</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {followUps.map(lead => renderLeadCard(lead, false))}
                                        </div>
                                    </div>
                                )}

                                {staleLeads.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">⚠️</span>
                                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Contatti in Sospeso</h3>
                                            <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{staleLeads.length}</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {staleLeads.map(lead => renderLeadCard(lead, true))}
                                        </div>
                                    </div>
                                )}

                                {futureLeads.length > 0 && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">📅</span>
                                            <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Prossimi giorni</h3>
                                            <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{futureLeads.length}</span>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-70">
                                            {futureLeads.map(lead => renderLeadCard(lead, false))}
                                        </div>
                                    </div>
                                )}

                                {unregisteredContacts > 0 && (
                                    <div className="p-6 bg-red-50 dark:bg-red-900/20 border-2 border-dashed border-red-200 dark:border-red-800 rounded-[2.5rem] text-center space-y-3">
                                        <div className="text-4xl">⚠️</div>
                                        <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight">Hai {unregisteredContacts} contatti non registrati</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                                            Hai incrementato il counter dei contatti per oggi, ma non hai inserito i loro dettagli (nome/telefono).
                                            Inserisci i dati per poterli gestire nei futuri follow-up.
                                        </p>
                                        <button
                                            onClick={() => { handleClose(); onEditLead(ActivityType.CONTACTS, {} as any); }}
                                            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-lg transition-all active:scale-95"
                                        >
                                            REGISTRA ORA
                                        </button>
                                    </div>
                                )}

                                {!hasItems && (
                                    <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
                                        <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center text-4xl shadow-inner animate-bounce">
                                            ✨
                                        </div>
                                        <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Tutto in Ordine!</h3>
                                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto font-medium">
                                            Non hai follow-up scaduti o nuovi contatti da gestire oggi. Continua così! 🚀
                                        </p>
                                    </div>
                                )}

                                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-[9px] font-mono opacity-30">
                                    DEBUG v1.3.1: Logs: {debugInfo.logsCount}, Contacts: {debugInfo.totalContactsCount}, Reg: {debugInfo.registeredLeadsCount}, P:{debugInfo.countsByStatus.pending} W:{debugInfo.countsByStatus.won} L:{debugInfo.countsByStatus.lost}, Types: {Object.entries(debugInfo.typesCount).map(([k,v]) => `${k}:${v}`).join(' ')}, Leads: {debugInfo.datesFound.join(' | ')}, Now: {debugInfo.todayStr}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FollowUpBanner;
