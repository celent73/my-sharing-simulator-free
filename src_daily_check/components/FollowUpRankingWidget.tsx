import React, { useMemo } from 'react';
import { ActivityLog, Lead, ActivityType } from '../types';
import { motion } from 'framer-motion';
import { Flame, Clock, User, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';
import { format, isBefore, parseISO, startOfDay } from 'date-fns';

interface FollowUpRankingWidgetProps {
  activityLogs: ActivityLog[];
  onEditLead: (type: ActivityType, lead: Lead) => void;
}

const FollowUpRankingWidget: React.FC<FollowUpRankingWidgetProps> = ({ activityLogs, onEditLead }) => {
  const rankedLeads = useMemo(() => {
    const allLeads: Lead[] = [];
    activityLogs.forEach(log => {
      if (log.leads) allLeads.push(...log.leads);
    });

    const today = startOfDay(new Date());

    return allLeads
      .filter(l => l.status === 'pending')
      .map(lead => {
        let score = 0;
        
        // 1. Temperature logic
        if (lead.temperature === 'caldo') score += 15;
        else if (lead.temperature === 'tiepido') score += 7;
        else score += 2;

        // 2. Type logic
        if (lead.type === ActivityType.APPOINTMENTS) score += 5;
        else score += 2;

        // 3. Urgency logic (Follow-up date)
        if (lead.followUpDate) {
          const fDate = parseISO(lead.followUpDate);
          if (isBefore(fDate, today)) {
            score += 10; // Overdue is high priority
          } else if (format(fDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
            score += 8; // Today is high priority
          }
        }

        return { lead, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Top 3
  }, [activityLogs]);

  if (rankedLeads.length === 0) return null;

  return (
    <div className="w-full bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] p-6 border-2 border-black/5 dark:border-white/10 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-black uppercase tracking-[0.25em] text-orange-600 dark:text-orange-400">Priorità Follow-up</h4>
        </div>
        <span className="px-2.5 py-1 bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg text-xs font-black uppercase tracking-widest">Top AI Picks</span>
      </div>

      <div className="space-y-3">
        {rankedLeads.map(({ lead, score }, index) => (
          <motion.div
            key={lead.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onEditLead(lead.type, lead)}
            className="group relative flex items-center gap-4 p-4 bg-white dark:bg-slate-800/40 border border-black/5 dark:border-white/5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
              lead.temperature === 'caldo' ? 'bg-red-500/10 text-red-500' : 
              lead.temperature === 'tiepido' ? 'bg-orange-500/10 text-orange-500' : 
              'bg-blue-500/10 text-blue-500'
            }`}>
              {lead.temperature === 'caldo' ? <Flame className="w-6 h-6" /> : <User className="w-6 h-6" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-lg font-black text-slate-800 dark:text-white truncate">{lead.name}</p>
                {score > 25 && (
                  <span className="flex h-2 w-2 rounded-full bg-red-500 animate-ping" />
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> {lead.followUpDate ? format(parseISO(lead.followUpDate), 'd MMM') : 'Nessuna data'}
                </span>
                <span className={`text-[11px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${
                   lead.temperature === 'caldo' ? 'text-red-500 bg-red-500/5' : 
                   lead.temperature === 'tiepido' ? 'text-orange-500 bg-orange-500/5' : 
                   'text-blue-500 bg-blue-500/5'
                }`}>
                  {lead.type === ActivityType.APPOINTMENTS ? 'Appt' : 'Contatto'}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <p className="text-xs font-black text-slate-300 group-hover:text-blue-500 transition-colors uppercase tracking-widest">Dettaglio</p>
              <ArrowRight size={16} className="text-slate-300 group-hover:translate-x-1 group-hover:text-blue-500 transition-all" />
            </div>
          </motion.div>
        ))}
      </div>
      
      {rankedLeads.some(r => r.score > 20) && (
        <div className="mt-6 p-4 bg-orange-500/5 dark:bg-orange-500/10 rounded-2xl border border-orange-500/10 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed font-bold text-orange-700/80 dark:text-orange-400/80 uppercase tracking-tight">
            Il Coach suggerisce: Hai dei lead "caldi" o scaduti. Chiudi queste pendenze ora per massimizzare il rendimento!
          </p>
        </div>
      )}
    </div>
  );
};

export default FollowUpRankingWidget;
