import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Zap, Quote, Loader2, Target } from 'lucide-react';
import { generateCoachStrategy, CoachStrategy, CoachingContext } from '../services/aiCoachingService';
import { Goals } from '../types';

interface CoachStrategyWidgetProps {
  score: number;
  streak: number;
  firstName?: string;
  counts?: Record<string, number>;
  goals?: Goals;
}

const CoachStrategyWidget: React.FC<CoachStrategyWidgetProps> = ({ score, streak, firstName, counts, goals }) => {
  const [strategy, setStrategy] = useState<CoachStrategy | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Diagnostic logging for PC visibility troubleshooting
  useEffect(() => {
    console.log(`[CoachStrategyWidget] Render Info:`, {
        score,
        streak,
        hasCounts: !!counts && Object.keys(counts).length > 0,
        hasGoals: !!goals,
        isGenerating,
        hasStrategy: !!strategy
    });
  }, [score, streak, counts, goals, isGenerating, strategy]);

  useEffect(() => {
    const fetchStrategy = async () => {
      // Don't generate if score is too low - saves AI tokens and uses local fallback or locked state
      if (score < 80) {
          setStrategy(null);
          return;
      }
      if (!counts || !goals) return;
      
      setIsGenerating(true);
      try {
          const data = await generateCoachStrategy({
            score,
            streak,
            counts,
            goals,
            userName: firstName
          });
          if (data) setStrategy(data);
      } catch (err) {
          console.error("[CoachStrategyWidget] AI Generation Error:", err);
      } finally {
          setIsGenerating(false);
      }
    };

    fetchStrategy();
  }, [score, streak, counts, goals, firstName]);

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full p-6 rounded-3xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-[#800020]/20 shadow-xl overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent animate-shine" />
        <div className="flex flex-col items-center justify-center gap-4 py-4 text-center">
          <div className="w-12 h-12 border-4 border-[#800020]/10 border-t-[#D4AF37] rounded-full animate-spin" />
          <div>
            <h3 className="text-lg font-black text-[#800020] dark:text-[#D4AF37] uppercase tracking-widest">Elite Strategy Analyst</h3>
            <p className="text-sm font-medium text-slate-500 animate-pulse">Sincronizzazione dati e generazione strategia d'élite in corso...</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Handle score below 80 - Locked/Incentive State
  if (score < 80) {
      return (
        <div className="w-full bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] p-6 border-2 border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center text-center group hover:border-amber-500/30 transition-all duration-500">
            <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl mb-3 text-slate-400 group-hover:text-amber-500 group-hover:scale-110 transition-all">
                <Target size={24} />
            </div>
            <h3 className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Protocollo Elite</h3>
            <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 max-w-[200px] leading-relaxed">
                Raggiungi un punteggio di <span className="text-amber-500">80+</span> oggi per sbloccare l'Analisi Strategica del Coach.
            </p>
            {score > 0 && (
                <div className="mt-3 w-full max-w-[150px] h-1.5 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-amber-500/50" 
                        style={{ width: `${score}%` }}
                    />
                </div>
            )}
        </div>
      );
  }

  // 4. Final Fallback if everything else fails but performance is high
  if (!strategy && !isGenerating && score >= 80) {
    const fallbackStrategy: CoachStrategy = {
      title: "Consolidamento Dominio",
      insight: "Stai mantenendo una media da top performer. Il rischio ora è la zona di comfort.",
      action: "Raddoppia i contatti nell'ora di punta per scalare ulteriormente.",
      quote: "L'eccellenza non è un atto, ma un'abitudine."
    };
    
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full relative group"
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#d4af37] to-[#800020] rounded-[2.5rem] blur opacity-20 animate-pulse"></div>
        <div className="relative w-full bg-slate-900 rounded-[2.5rem] border border-[#d4af37]/30 p-6">
          <div className="flex items-center gap-2 mb-4">
             <Sparkles className="w-4 h-4 text-[#d4af37]" />
             <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">Protocollo Elite (Backup)</span>
          </div>
          <h4 className="text-xl font-black text-white mb-2 italic tracking-tight">{fallbackStrategy.title}</h4>
          <p className="text-slate-400 text-sm italic mb-4">"{fallbackStrategy.insight}"</p>
          <div className="bg-[#d4af37]/10 p-4 rounded-2xl border border-[#d4af37]/20 mb-4">
            <p className="text-[10px] font-black text-[#d4af37] uppercase mb-1">Azione d'Urto</p>
            <p className="text-white font-bold leading-tight">{fallbackStrategy.action}</p>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">— {fallbackStrategy.quote}</p>
        </div>
      </motion.div>
    );
  }

  if (!strategy && !isGenerating) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full relative group transition-all duration-700"
    >
      {/* Premium Glow Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#800020] via-[#d4af37]/40 to-[#4a0410] rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      
      <div className="relative w-full bg-slate-900/90 dark:bg-black/80 backdrop-blur-3xl rounded-[2.5rem] border border-[#d4af37]/20 overflow-hidden shadow-2xl">
        
        {/* Elite Header */}
        <div className="bg-gradient-to-r from-[#5c0514] to-[#3a030b] px-6 py-4 flex items-center justify-between border-b border-[#d4af37]/10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#d4af37]/20 rounded-xl border border-[#d4af37]/30">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.3em]">ELITE COACHING</p>
              <h3 className="text-lg font-black text-white tracking-tight">Strategia Personale</h3>
            </div>
          </div>
          {isGenerating && <Loader2 className="w-5 h-5 animate-spin text-[#d4af37]" />}
        </div>

        <div className={`p-6 transition-all duration-700 ${isGenerating ? 'opacity-30 blur-sm' : 'opacity-100 blur-0'}`}>
          {strategy && (
            <div className="space-y-6">
              {/* Strategy Title */}
              <div>
                <h4 className="text-2xl font-black text-[#d4af37] leading-tight mb-2 uppercase italic tracking-tighter">
                  {strategy.title}
                </h4>
                <div className="flex items-start gap-3 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <TrendingUp className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                  <p className="text-sm font-bold text-slate-300 leading-relaxed italic">
                    "{strategy.insight}"
                  </p>
                </div>
              </div>

              {/* Action Urgency */}
              <div className="relative overflow-hidden bg-gradient-to-br from-[#d4af37]/10 to-transparent p-5 rounded-3xl border border-[#d4af37]/20 group/action">
                <div className="absolute top-0 right-0 p-4 opacity-10 -rotate-12 group-hover/action:rotate-0 transition-transform">
                  <Target className="w-20 h-20 text-[#d4af37]" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                    <span className="text-[10px] font-black text-[#d4af37] uppercase tracking-widest">Azione Prioritaria</span>
                  </div>
                  <p className="text-lg font-black text-white leading-tight">
                    {strategy.action}
                  </p>
                </div>
              </div>

              {/* Motivational Quote */}
              <div className="flex items-center gap-4 px-2 pt-2">
                <Quote className="w-8 h-8 text-slate-600 rotate-180 flex-shrink-0 opacity-50" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-wide leading-snug">
                  {strategy.quote}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar Decorations */}
        <div className="h-1 bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent"></div>
      </div>
    </motion.div>
  );
};

export default CoachStrategyWidget;
