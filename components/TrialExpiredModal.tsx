import React, { useState } from 'react';
import { Lock, Star, ChevronRight, Key } from 'lucide-react';

interface TrialExpiredModalProps {
  isOpen: boolean;
  onActivate: (code: string) => void;
}

export const TrialExpiredModal: React.FC<TrialExpiredModalProps> = () => {
  return null;
};

const handleVerify = () => {
  if (inputCode.trim().length > 0) {
    onActivate(inputCode);
    setError(false);
  } else {
    setError(true);
  }
};

return (
  <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[60] flex items-center justify-center p-4">
    <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-700">

      <div className="p-8 text-center">
        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
          <Lock className="text-red-500" size={40} />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Periodo di Prova Terminato
        </h2>

        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Hai raggiunto il limite di utilizzi gratuiti. Per continuare a generare simulazioni e chiudere contratti, scegli un piano.
        </p>

        <div className="space-y-3 mb-8">
          {/* OPZIONE 1: ABBONAMENTO (3,99€) */}
          <a
            href="https://buy.stripe.com/5kQ9AUcjtdg4ccb8yJ3gk0i"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between w-full p-4 bg-white dark:bg-slate-700/50 border-2 border-gray-100 dark:border-slate-600 hover:border-union-blue-300 dark:hover:border-union-blue-500 text-left rounded-xl group transition-all"
          >
            <div>
              <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>Abbonamento Mensile</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Flessibile, disdici quando vuoi</div>
            </div>
            <div className="text-right">
              <span className="block font-bold text-lg text-union-blue-600 dark:text-union-blue-400">€3,99</span>
              <span className="text-[10px] text-gray-400">/mese</span>
            </div>
          </a>

          {/* OPZIONE 2: A VITA (29,90€) - EVIDENZIATA */}
          <a
            href="https://buy.stripe.com/bJe14obfpcc01xx5mx3gk0j"
            target="_blank"
            rel="noopener noreferrer"
            className="relative flex items-center justify-between w-full p-4 bg-gradient-to-r from-union-blue-600 to-purple-600 text-white text-left rounded-xl shadow-lg hover:shadow-union-blue-500/25 hover:scale-[1.02] transition-all"
          >
            <div className="absolute -top-3 right-4 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              PIÙ VENDUTO
            </div>
            <div>
              <div className="font-bold flex items-center gap-2">
                <Star size={16} className="fill-yellow-300 text-yellow-300" />
                <span>Sblocco a Vita</span>
              </div>
              <div className="text-xs text-blue-100">Paghi una volta, tuo per sempre</div>
            </div>
            <div className="text-right">
              <span className="block font-bold text-xl">€29,90</span>
              <span className="text-[10px] text-blue-100">una tantum</span>
            </div>
          </a>
        </div>

        {/* SEZIONE INSERIMENTO CODICE */}
        <div className="border-t border-gray-100 dark:border-slate-700 pt-6">
          <p className="text-xs text-gray-500 mb-3">Hai già acquistato? Inserisci il codice qui sotto:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Codice licenza..."
              className={`flex-1 px-4 py-2 bg-gray-50 dark:bg-slate-900 border ${error ? 'border-red-500' : 'border-gray-200 dark:border-slate-600'} rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-union-blue-500 dark:text-white`}
            />
            <button
              onClick={handleVerify}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-bold hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              Sblocca
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
);
};