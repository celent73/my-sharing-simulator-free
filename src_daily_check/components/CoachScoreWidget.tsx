import React, { useEffect, useState } from 'react';
import { getScoreLabel } from '../utils/coachScoreUtils';
import { ActivityType, Goals } from '../types';
import { generateCoachTip, CoachingContext } from '../services/aiCoachingService';
import { Sparkles, Loader2, Target } from 'lucide-react';

interface CoachScoreWidgetProps {
  score: number;
  streak: number;
  firstName?: string;
  counts?: Record<string, number>;
  goals?: Goals;
}

const CoachScoreWidget: React.FC<CoachScoreWidgetProps> = ({ score, streak, firstName, counts, goals }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const label = getScoreLabel(score);
  const isHighPerformance = score >= 80;

  // Animated score count-up
  useEffect(() => {
    setDisplayScore(0);
    let start = 0;
    const step = Math.max(1, Math.floor(score / 40));
    const interval = setInterval(() => {
      start += Math.ceil(step); // Ensure at least 1
      if (start >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(start);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [score]);

  // AI Tip Generation
  useEffect(() => {
    const fetchTip = async () => {
      if (!counts || !goals) return;
      
      setIsGenerating(true);
      const tip = await generateCoachTip({
        score,
        streak,
        counts,
        goals,
        userName: firstName
      });
      
      if (tip) setAiTip(tip);
      setIsGenerating(false);
    };

    fetchTip();
  }, [score, streak, counts, goals, firstName]);

  // Fallback static message if AI is not available or still loading
  const staticMessage = 
    score >= 90 ? '🏆 Hai dominato la giornata. Sei un esempio per tutti!' :
    score >= 75 ? '🔥 Stai bruciando! Un ultimo sprint e sarai al top.' :
    score >= 50 ? '💪 Buon lavoro. Hai ancora tempo per migliorare oggi.' :
    score >= 25 ? '😤 Sei indietro. Ricorda il tuo "perché" e riparti adesso!' :
    score > 0 ? '⚠️ Giornata difficile. Un\'azione ora cambia tutto.' :
    '😴 Ancora nessuna azione. Inizia con una piccola cosa — subito!';

  // Ring geometry
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  // Color based on score
  const ringColor =
    score >= 80 ? '#10b981' :
    score >= 50 ? '#f59e0b' :
    '#ef4444';

  const ringGlow =
    score >= 80 ? 'rgba(16,185,129,0.35)' :
    score >= 50 ? 'rgba(245,158,11,0.35)' :
    'rgba(239,68,68,0.35)';

  const bgGradient =
    score >= 80 ? 'from-emerald-500/10 to-teal-500/5' :
    score >= 50 ? 'from-amber-500/10 to-orange-500/5' :
    'from-red-500/10 to-pink-500/5';

  return (
    <div className={`w-full bg-gradient-to-br ${bgGradient} dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] p-6 border-[3px] ${isHighPerformance ? 'border-amber-400 dark:border-amber-500 shadow-[0_20px_50px_rgba(251,191,36,0.15)]' : 'border-white/40 dark:border-white/10'} shadow-2xl shadow-black/[0.04] overflow-hidden relative group transition-all duration-500`}>
      
      {/* Elite Badge (Matching Strategy Widget) */}
      <div className={`absolute top-4 left-4 z-20 flex items-center gap-1.5 ${isHighPerformance ? 'bg-gradient-to-r from-[#800020] to-[#5c0514] border-[#d4af37]/30 text-[#d4af37]' : 'bg-amber-400 text-white border-white/20'} px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg animate-pulse border`}>
        <Sparkles className="w-3.5 h-3.5" /> {isHighPerformance ? 'ELITE COACHING' : 'Premium Coaching'}
      </div>

      {/* Decorative Background Icon */}
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
        <Target className="w-48 h-48 text-slate-500 dark:text-white -rotate-12" />
      </div>

      {/* Background glow */}
      <div
        className="absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl opacity-30 pointer-events-none group-hover:opacity-40 transition-opacity duration-1000"
        style={{ backgroundColor: ringColor }}
      />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 mt-8 relative z-10">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            COACH SCORE
          </p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-1 tracking-tight">
            {firstName ? `Ciao ${firstName}, ecco il tuo focus:` : 'Il tuo focus oggi:'}
          </p>
        </div>

        {/* Streak Badge */}
        {streak > 0 && (
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/40 dark:border-white/10 shadow-lg shadow-orange-500/10 animate-pulse-slow">
            <span className="text-xl">🔥</span>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white leading-none">{streak}</p>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mt-0.5">streak</p>
            </div>
          </div>
        )}
      </div>

      {/* Score Ring + Number */}
      <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
        <div className="relative flex-shrink-0">
          <svg width="140" height="140" viewBox="0 0 132 132">
            {/* Background track */}
            <circle
              cx="66" cy="66" r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="12"
              className="text-black/5 dark:text-white/5"
            />
            {/* Animated progress ring */}
            <circle
              cx="66" cy="66" r={radius}
              fill="none"
              stroke={ringColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 66 66)"
              style={{
                transition: 'stroke-dashoffset 0.6s ease-out',
                filter: `drop-shadow(0 0 10px ${ringGlow})`
              }}
            />
          </svg>
          {/* Score text inside ring */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">
              {displayScore}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">/100</span>
          </div>
        </div>

        {/* Right side: label + AI tip */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-xl bg-white/10 ${isHighPerformance ? 'bg-amber-400/20' : ''}`}>
               <span className="text-3xl">{label.emoji}</span>
            </div>
            <span className="text-2xl font-black tracking-tight" style={{ color: ringColor }}>{label.label}</span>
          </div>

          {/* AI Coach Insight */}
          <div className="relative bg-white/40 dark:bg-black/20 backdrop-blur-md p-4 rounded-2xl border border-white/20 dark:border-white/5">
            <div className={`transition-all duration-500 ${isGenerating ? 'opacity-50 blur-sm scale-95' : 'opacity-100 blur-0 scale-100'}`}>
              <p className="text-[13px] text-slate-700 dark:text-slate-200 font-bold leading-relaxed italic">
                "{aiTip || staticMessage}"
              </p>
            </div>
            {isGenerating && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500 opacity-50" />
              </div>
            )}
          </div>

          {/* Streak message */}
          {streak > 0 && (
            <div className="mt-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
              <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Performance:</span>
              <span className="text-[11px] font-black" style={{ color: ringColor }}>
                {streak === 1 ? 'PRIMO GIORNO' :
                 streak < 7 ? `${streak} GIORNI ATTIVI` :
                 streak < 14 ? `${streak} GIORNI 🔥 LIVELLO TOP` :
                 `${streak} GIORNI 🏆 LEGGENDA`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoachScoreWidget;

