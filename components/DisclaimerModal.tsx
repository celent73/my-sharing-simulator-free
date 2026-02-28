import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface DisclaimerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DisclaimerModal = ({ isOpen, onClose }: DisclaimerModalProps) => {
    const { t } = useLanguage();
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/30 max-w-md w-full p-6 md:p-8 relative transform transition-all animate-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">{t('app.disclaimer_btn')}</h3>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed text-justify">
                    <p>{t('app.simulation_note')}</p>
                    <p>Il presente simulatore ha finalità puramente illustrative. Gli importi mostrati rappresentano una stima teorica basata sui dati inseriti manualmente dall'utente.</p>
                </div>
                <button onClick={onClose} className="mt-8 w-full bg-union-blue-500/90 hover:bg-union-blue-600 text-white font-bold py-3 px-4 rounded-2xl transition-colors duration-200 shadow-lg shadow-union-blue-500/30 focus:outline-none">
                    {t('app.disclaimer_btn').replace('Leggi il ', '').replace('Completo', 'Chiudi').replace('Disclaimer', 'OK')}
                </button>
            </div>
        </div>
    );
};

export default DisclaimerModal;
