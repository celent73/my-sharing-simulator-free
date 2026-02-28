import React from 'react';
import CrownIconSVG from './icons/CrownIcon';

interface PaymentSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PaymentSuccessModal = ({ isOpen, onClose }: PaymentSuccessModalProps) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl w-full max-w-md p-8 relative border border-union-orange-400/50 text-center animate-in zoom-in-95">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(74,222,128,0.4)] relative">
                    <CrownIconSVG className="w-10 h-10 text-green-600 dark:text-green-400 animate-bounce" />
                    <div className="absolute -top-2 -right-2 text-3xl animate-pulse">🎉</div>
                </div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2">Pagamento Riuscito!</h2>
                <p className="text-lg text-green-600 dark:text-green-400 font-bold mb-6">Grazie per il tuo acquisto</p>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-6 text-left border border-blue-100 dark:border-blue-800">
                    <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed font-medium">
                        Il sistema sta generando la tua licenza univoca.
                        <br /><br />
                        📩 <strong>Controlla la tua Email:</strong> riceverai il tuo CODICE DI ATTIVAZIONE personale entro pochi minuti.
                    </p>
                </div>
                <button onClick={onClose} className="w-full py-4 bg-union-blue-600 text-white rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-lg shadow-blue-500/30">
                    Ho capito, controllo la mail
                </button>
            </div>
        </div>
    );
};

export default PaymentSuccessModal;
