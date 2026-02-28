import React, { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CompensationPlanResult, PlanInput } from '../types';

interface AICoachProps {
    planResult: CompensationPlanResult;
    inputs: PlanInput;
}

const TIPS = [
    {
        condition: (r: CompensationPlanResult, i: PlanInput) => i.directRecruits < 3,
        message: "💡 Sapevi che con soli 3 diretti sblocchi il primo livello di profondità? Aggiungine uno!",
        mood: 'encouraging'
    },
    {
        condition: (r: CompensationPlanResult, i: PlanInput) => r.totalRecurringYear1 > 1000 && r.totalRecurringYear1 < 2000,
        message: "🚀 Ottimo inizio! Sei sopra i 1.000€/mese. Hai già coperto l'affitto?",
        mood: 'excited'
    },
    {
        condition: (r: CompensationPlanResult, i: PlanInput) => r.totalRecurringYear3 > 5000,
        message: "💎 Con queste cifre entri nel top 5% dei redditi in Italia. Fantastico!",
        mood: 'celebratory'
    },
    {
        condition: (r: CompensationPlanResult, i: PlanInput) => i.contractsPerUser < 1,
        message: "⚡ Suggerimento: Se ogni utente porta anche un solo contratto extra, il tuo guadagno esplode. Prova!",
        mood: 'hint'
    }
];

const AICoach: React.FC<AICoachProps> = ({ planResult, inputs }) => {
    const [activeTip, setActiveTip] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        // Check tips periodically or on input change
        const checkBrief = () => {
            const matched = TIPS.find(t => t.condition(planResult, inputs));
            if (matched && matched.message !== activeTip) {
                setIsVisible(false);
                setTimeout(() => {
                    setActiveTip(matched.message);
                    setIsVisible(true);
                }, 500);
            }
        };

        const timer = setTimeout(checkBrief, 2000); // Small delay to not spam while sliding
        return () => clearTimeout(timer);
    }, [planResult, inputs, activeTip]);

    if (!activeTip) return null;

    return (
        <div className={`
        fixed bottom-6 left-6 z-50 flex items-end gap-3 max-w-[300px] pointer-events-none transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
    `}>
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-lg border-2 border-white flex items-center justify-center text-2xl animate-bounce-slow">
                🤖
            </div>

            {/* Bubble */}
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none shadow-2xl border border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-200 font-medium relative animate-in zoom-in-95 origin-bottom-left">
                {activeTip}
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-600 rounded-full p-1 text-gray-500 hover:text-red-500 pointer-events-auto"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default AICoach;
