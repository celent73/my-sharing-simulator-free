import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Target, 
  ChevronRight, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Lead, ActivityType, ActivityLog } from '../types';
import { calculateVelocityTrend, getHotLeads, identifyBottleneck } from '../utils/statsUtils';
import { generateEliteStrategy, EliteStrategy } from '../services/aiCoachingService';

interface AIStrategyWidgetProps {
    activityLogs: ActivityLog[];
    userName: string;
    onEditLead: (type: ActivityType, lead: Lead) => void;
}

const AIStrategyWidget: React.FC<AIStrategyWidgetProps> = ({ activityLogs, userName, onEditLead }) => {
    const [strategy, setStrategy] = useState<EliteStrategy | null>(null);
    const [loading, setLoading] = useState(true);

    const trends = calculateVelocityTrend(activityLogs, ActivityType.CONTACTS);
    const hotLeads = getHotLeads(activityLogs);
    const bottleneck = identifyBottleneck(activityLogs);

    useEffect(() => {
        const fetchStrategy = async () => {
            setLoading(true);
            const res = await generateEliteStrategy({
                userName,
                trends,
                bottleneck,
                hotLeads
            });
            setStrategy(res);
            setLoading(false);
        };
        fetchStrategy();
    }, [userName, bottleneck, trends.percentChange]);

    if (loading) {
        return (
            <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 animate-pulse">
                <div className="h-4 w-32 bg-white/10 rounded mb-6" />
                <div className="h-24 w-full bg-white/5 rounded-2xl mb-4" />
                <div className="h-24 w-full bg-white/5 rounded-2xl" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header / Trend Summary */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${trends.velocity === 'up' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                            {trends.velocity === 'up' ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Velocità di Vendita</p>
                            <h3 className="text-2xl font-black text-white">
                                {trends.percentChange > 0 ? `+${trends.percentChange}%` : `${trends.percentChange}%`}
                            </h3>
                        </div>
                    </div>

                    <div className="flex-1 max-w-sm">
                        <p className="text-xs text-slate-400 font-medium leading-relaxed italic">
                            "{strategy?.trendAnalysis || 'Analisi del trend in corso...'}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Elite Insight & Action Plan */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-24">
                {/* Strategy Card */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 flex flex-col gap-6 shadow-2xl relative overflow-hidden group/card">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10 flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                <Sparkles size={20} />
                            </div>
                            <h4 className="text-sm font-black text-white uppercase tracking-widest">Analisi Elite</h4>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Punto Critico</p>
                                <p className="text-xs text-white font-bold leading-relaxed">{strategy?.bottleneckFix || bottleneck}</p>
                            </div>
                            
                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Piano d'Azione</p>
                                {strategy?.actionPlan.map((action, idx) => (
                                    <motion.div 
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-all cursor-default"
                                    >
                                        <div className="w-6 h-6 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[10px] font-black">
                                            {idx + 1}
                                        </div>
                                        <span className="text-xs text-slate-200 font-bold">{action}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hot Leads Widget */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 border border-white/10 flex flex-col gap-6 shadow-2xl relative overflow-hidden group/card">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10 flex flex-col gap-6 h-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                                    <Zap size={20} />
                                </div>
                                <h4 className="text-sm font-black text-white uppercase tracking-widest">Lead Prioritari</h4>
                            </div>
                            <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase">
                                Da Chiamare
                            </div>
                        </div>

                        <div className="flex-1 space-y-3">
                            {hotLeads.length > 0 ? hotLeads.map((lead) => (
                                <button
                                    key={lead.id}
                                    onClick={() => onEditLead(ActivityType.CONTACTS, lead)}
                                    className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 transition-all group"
                                >
                                    <div className="text-left">
                                        <p className="text-xs font-black text-white mb-0.5">{lead.name}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-1.5 rounded-full ${(lead as any).temperature === 'caldo' ? 'bg-red-500' : 'bg-orange-500'}`} />
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{(lead as any).temperature || 'Tiepido'}</p>
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                                </button>
                            )) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                    <AlertCircle size={32} className="text-slate-600 mb-2" />
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight">Tutti i lead sono aggiornati!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIStrategyWidget;
