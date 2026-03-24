import React from 'react';
import { Sparkles, Trophy, Flame, Target } from 'lucide-react';

interface CoachGreetingProps {
  firstName?: string;
  yesterdayScore: number;
  streak: number;
}

const CoachGreeting: React.FC<CoachGreetingProps> = ({ firstName, yesterdayScore, streak }) => {
  const getMessage = () => {
    if (streak >= 7) {
      return {
        title: `Inarrestabile, ${firstName}!`,
        text: `Sei al giorno ${streak} di pura coerenza. La tua mentalità è d'acciaio! 🏆`,
        icon: <Trophy className="w-6 h-6 text-yellow-500" />,
        bg: 'from-yellow-500/10 to-orange-500/5',
        border: 'border-yellow-500/20'
      };
    }
    
    if (streak >= 3) {
      return {
        title: `Grande ritmo, ${firstName}!`,
        text: `Giorno ${streak} 🔥. Stai costruendo un'abitudine potente, non mollare proprio ora.`,
        icon: <Flame className="w-6 h-6 text-orange-500" />,
        bg: 'from-orange-500/10 to-red-500/5',
        border: 'border-orange-500/20'
      };
    }

    if (yesterdayScore >= 80) {
      return {
        title: `Ieri sei stato un leone!`,
        text: `Hai chiuso con un punteggio di ${yesterdayScore}. Manteniamo questa energia anche oggi!`,
        icon: <Sparkles className="w-6 h-6 text-emerald-500" />,
        bg: 'from-emerald-500/10 to-teal-500/5',
        border: 'border-emerald-500/20'
      };
    }

    if (yesterdayScore > 0 && yesterdayScore < 50) {
      return {
        title: `Oggi ci riprendiamo tutto!`,
        text: `Ieri è stata dura, ma ogni giorno è una nuova opportunità. Qual è la prima azione di oggi?`,
        icon: <Target className="w-6 h-6 text-blue-500" />,
        bg: 'from-blue-500/10 to-indigo-500/5',
        border: 'border-blue-500/20'
      };
    }

    return {
      title: `Buongiorno, ${firstName}!`,
      text: "Pronto a conquistare i tuoi obiettivi? Un'azione alla volta, verso i tuoi sogni. 🎯",
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      bg: 'from-purple-500/10 to-blue-500/5',
      border: 'border-purple-500/20'
    };
  };

  const { title, text, icon, bg, border } = getMessage();

  return (
    <div className={`w-full bg-gradient-to-br ${bg} dark:from-slate-800/60 dark:to-slate-900/40 backdrop-blur-2xl rounded-3xl p-5 border ${border} shadow-xl shadow-black/[0.02] flex items-center gap-4 group transition-all hover:scale-[1.01]`}>
      <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-slate-800 flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider mb-0.5">{title}</h4>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-snug">{text}</p>
      </div>
    </div>
  );
};

export default CoachGreeting;
