import React from 'react';
import { useShary } from '../contexts/SharyContext';

import { useLanguage } from '../contexts/LanguageContext';

interface SharyTriggerProps {
    message: string;
    messageDe?: string;
    messageEn?: string;
    highlightId?: string;
}

const SharyTrigger: React.FC<SharyTriggerProps> = ({ message, messageDe, messageEn, highlightId }) => {
    const { isActive, speak } = useShary();
    const { language } = useLanguage();

    if (!isActive) return null;

    const textToSpeak = (() => {
        if (language === 'de' && messageDe) return messageDe;
        if (language === 'en' && messageEn) return messageEn;
        return message;
    })();

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                speak(textToSpeak, highlightId);
            }}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-200 hover:scale-110 transition-all cursor-pointer shadow-sm border border-cyan-200 mx-2 animate-pulse"
            title="Chiedi a Shary"
        >
            <span className="text-base">🤖</span>
        </button>
    );
};

export default SharyTrigger;
