import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, TrendingUp, Lightbulb, Target, Sparkles, Loader2, Calendar } from 'lucide-react';
import { generateWeeklyReport, WeeklyContext } from '../services/aiCoachingService';
import { ActivityLog, Goals } from '../types';
import { getWeekIdentifier } from '../utils/dateUtils';

interface WeeklyAIReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLog[];
  goals: Goals;
  userName?: string;
}

const WeeklyAIReportModal: React.FC<WeeklyAIReportModalProps> = ({ isOpen, onClose, logs, goals, userName }) => {
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !report) {
      const fetchReport = async () => {
        setLoading(true);
        const weekId = getWeekIdentifier(new Date());
        // Filter logs for the current week
        // (Simplified for now, using the last 7 logs if not enough data)
        const relevantLogs = logs.slice(0, 7);
        
        const result = await generateWeeklyReport({
          logs: relevantLogs,
          goals,
          userName,
          weekId
        });
        setReport(result);
        setLoading(false);
      };
      fetchReport();
    }
  }, [isOpen, report, logs, goals, userName]);

  if (!isOpen) return null;

  const sections = report ? report.split('\n').filter(s => s.trim() !== '') : [];

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xl"
        onClick={onClose}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-2xl bg-[#f2f2f7] dark:bg-slate-950 rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 flex flex-col max-h-[90vh]"
      >
        <div className="p-8 bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2 bg-white/20 w-fit px-3 py-1 rounded-full backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Report Strategico AI</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight">Il Punto del Coach</h2>
            <p className="opacity-80 text-sm font-bold mt-1">Analisi performance della settimana</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-all active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Analisi dati in corso...</p>
            </div>
          ) : report ? (
            <div className="space-y-6">
              {sections.map((section, idx) => {
                let icon = <Award className="text-amber-500" />;
                if (section.includes('TREND')) icon = <TrendingUp className="text-blue-500" />;
                if (section.includes('CONSIGLIO')) icon = <Lightbulb className="text-purple-500" />;
                if (section.includes('MISSIONE')) icon = <Target className="text-emerald-500" />;

                const [title, ...content] = section.split(':');

                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-black/5 dark:border-white/5 shadow-sm"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        {icon}
                      </div>
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</h3>
                    </div>
                    <p className="text-lg font-bold text-slate-800 dark:text-white leading-relaxed">
                      {content.join(':').trim()}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="p-10 text-center text-slate-400 bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
              Impossibile generare il report. Riprova più tardi.
            </div>
          )}
        </div>

        <div className="p-8 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-t border-black/5 dark:border-white/5 text-center">
          <button 
            onClick={onClose}
            className="px-12 py-4 bg-slate-950 dark:bg-white text-white dark:text-black rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl"
          >
            Fissato! Andiamo 🚀
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WeeklyAIReportModal;
