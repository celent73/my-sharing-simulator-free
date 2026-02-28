import React from 'react';
import { TrendingUp, Users, Target, ArrowRight, Zap, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { UNLOCK_CONDITIONS } from './constants';

interface DashboardProps {
    onNavigate: (tab: string) => void;
    personalUnits: number;
    setPersonalUnits: (value: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, personalUnits, setPersonalUnits }) => {

    const getRank = () => {
        if (personalUnits >= UNLOCK_CONDITIONS.LEVEL_5) return "Partner Pro";
        if (personalUnits >= UNLOCK_CONDITIONS.LEVEL_3) return "Family Pro";
        return "Member";
    };

    const nextMilestone = personalUnits < UNLOCK_CONDITIONS.LEVEL_1 ? UNLOCK_CONDITIONS.LEVEL_1 :
        personalUnits < UNLOCK_CONDITIONS.LEVEL_2 ? UNLOCK_CONDITIONS.LEVEL_2 :
            personalUnits < UNLOCK_CONDITIONS.LEVEL_3 ? UNLOCK_CONDITIONS.LEVEL_3 :
                personalUnits < UNLOCK_CONDITIONS.LEVEL_4 ? UNLOCK_CONDITIONS.LEVEL_4 :
                    personalUnits < UNLOCK_CONDITIONS.LEVEL_5 ? UNLOCK_CONDITIONS.LEVEL_5 : UNLOCK_CONDITIONS.LEVEL_5;

    const progress = Math.min(100, (personalUnits / nextMilestone) * 100);

    return (
        <div className="space-y-6 pb-20 sm:pb-0">
            {/* Rank Status Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card-light p-6 bg-gradient-to-br from-union-green-500 to-union-green-600 text-white border-none relative overflow-hidden shadow-[0_20px_50px_rgba(34,197,94,0.3)]"
            >
                <div className="relative z-10">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold mb-4 inline-block backdrop-blur-md">Qualifica Attuale</span>
                    <h2 className="text-3xl font-bold mb-2">{getRank()}</h2>
                    <div className="flex items-center gap-2 mb-6 text-white/80">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">
                            {personalUnits >= UNLOCK_CONDITIONS.LEVEL_5 ? 'Massimo livello raggiunto' : `Prossimo obiettivo: ${nextMilestone} utenze`}
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs font-bold">
                            <span>Progresso Community</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <div className="h-2.5 bg-black/20 rounded-full p-0.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                            ></motion.div>
                        </div>
                        <p className="text-[10px] opacity-80 italic text-right font-medium">
                            {personalUnits < nextMilestone ? `+${nextMilestone - personalUnits} utenze per completare` : 'Obiettivo raggiunto!'}
                        </p>
                    </div>
                </div>
                <Trophy className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10" />
            </motion.div>

            {/* Personal Units Slider */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card-light p-6 border-l-4 border-union-green-500"
            >
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-black text-union-black uppercase tracking-tight">Le Tue Utenze Personali</h4>
                    <span className="text-lg font-black text-union-green-500">{personalUnits}</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="20"
                    value={personalUnits}
                    onChange={(e) => setPersonalUnits(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-union-green-500"
                />
                <p className="text-[9px] mt-2 text-gray-400 font-medium italic">
                    Regola le tue utenze personali per sbloccare i livelli di rendita della community.
                </p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card-light p-4 hover:border-union-green-500/30 transition-colors"
                >
                    <div className="bg-union-green-500/10 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                        <Users className="text-union-green-500 w-5 h-5" />
                    </div>
                    <p className="text-xs opacity-60 font-bold mb-1 uppercase tracking-tight">Rete Totale</p>
                    <h3 className="text-2xl font-black text-union-black">142</h3>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card-light p-4 hover:border-union-green-500/30 transition-colors"
                >
                    <div className="bg-union-green-500/10 w-10 h-10 rounded-xl flex items-center justify-center mb-3">
                        <Zap className="text-union-green-500 w-5 h-5" />
                    </div>
                    <p className="text-xs opacity-60 font-bold mb-1 uppercase tracking-tight">Punti Union</p>
                    <h3 className="text-2xl font-black text-union-black">4.250</h3>
                </motion.div>
            </div>

            {/* Quick Actions */}
            <h4 className="font-bold text-xs uppercase tracking-widest opacity-40 px-2 mt-8">Azioni Consigliate</h4>
            <div className="space-y-3">
                {[
                    { id: 'road', title: 'Road to Zero', desc: 'Calcola lo sconto in bolletta', icon: TrendingUp, color: 'yellow' },
                    { id: 'onboarding', title: 'Onboarding 30gg', desc: 'Incentiva i nuovi membri', icon: Target, color: 'blue' }
                ].map((action, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + (i * 0.1) }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => action.id === 'road' && onNavigate('road')}
                        className="glass-card-light p-4 flex items-center justify-between hover:border-union-green-500/20 transition-all cursor-pointer group shadow-sm hover:shadow-md"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl transition-colors bg-opacity-10 ${i === 0 ? 'bg-yellow-500 text-yellow-600' : 'bg-blue-500 text-blue-600'}`}>
                                <action.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-union-black">{action.title}</p>
                                <p className="text-[10px] opacity-60 font-medium text-union-black">{action.desc}</p>
                            </div>
                        </div>
                        <ArrowRight className="w-4 h-4 opacity-20 group-hover:opacity-60 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
