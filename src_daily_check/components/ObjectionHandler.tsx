import React, { useState } from 'react';

interface ObjectionHandlerProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Script {
    title: string;
    icon: string;
    trigger: string;
    response: string;
}

const SCRIPTS: Script[] = [
    {
        title: "Non ho tempo",
        icon: "⏱️",
        trigger: "Non ho tempo ora / Sono incasinato",
        response: "Ti capisco perfettamente, proprio per questo ti chiamo. La maggior parte delle persone che lavora con noi ha iniziato proprio perché voleva avere più tempo libero. Se ti mostrassi come guadagnare tempo oltre che denaro, mi dedicheresti 15 minuti?"
    },
    {
        title: "Non ho soldi",
        icon: "💸",
        trigger: "Non ho soldi da investire / Costa troppo",
        response: "Ottimo, allora è il motivo principale per cui dovresti ascoltarmi. Non cerco i tuoi soldi, cerco la tua ambizione. Se la questione economica non fosse un problema, il progetto in sé ti piacerebbe?"
    },
    {
        title: "È una piramide?",
        icon: "🔺",
        trigger: "È uno schema piramidale? / È come Herbalife/Amway?",
        response: "Capisco la tua domanda. Ti riferisci a quegli schemi illegali dove chi arriva prima guadagna su tutti? Assolutamente no. Qui vige la meritocrazia: Union Energia è un'azienda italiana regolamentata. Tu verresti pagato per il fatturato che generi, indipendentemente da chi ti ha inserito. Ti interessa valutare un business etico?"
    },
    {
        title: "Ci devo pensare",
        icon: "🤔",
        trigger: "Ci penso e ti faccio sapere",
        response: "Certo, è giusto pensarci. Ma dimmi sinceramente: c'è qualcosa in particolare che non ti convince o hai solo bisogno di approfondire qualche dettaglio? Perché se c'è un dubbio, meglio chiarirlo subito insieme."
    },
    {
        title: "Non fa per me",
        icon: "🙅",
        trigger: "Non sono capace a vendere / Non fa per me",
        response: "Nemmeno io ero capace all'inizio! La buona notizia è che non cerchiamo venditori porta a porta, ma persone che vogliano imparare un metodo. Abbiamo un sistema di formazione gratuito. Se ci fosse qualcuno che ti affianca passo passo, proveresti?"
    }
];

const ObjectionHandler: React.FC<ObjectionHandlerProps> = ({ isOpen, onClose }) => {
    const [selectedScript, setSelectedScript] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredScripts = SCRIPTS.filter(script =>
        script.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        script.trigger.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>

            {/* Panel */}
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out animate-slide-in-right border-l border-slate-200 dark:border-slate-700">

                <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🛡️</span>
                        <h2 className="font-bold text-xl text-slate-800 dark:text-white">Gestione Obiezioni</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Search Bar - Premium Style */}
                <div className="p-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition-opacity" />
                        <input
                            type="text"
                            placeholder="Cerca obiezione (es. tempo, soldi...)"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="relative w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all dark:text-white"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
                    {filteredScripts.length > 0 ? filteredScripts.map((script, index) => (
                        <div
                            key={index}
                            className={`bg-white dark:bg-slate-800 rounded-xl border transition-all duration-300 overflow-hidden shadow-sm ${selectedScript === index ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'}`}
                        >
                            <button
                                onClick={() => setSelectedScript(selectedScript === index ? null : index)}
                                className="w-full text-left p-4 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl bg-slate-100 dark:bg-slate-700 p-2 rounded-lg">{script.icon}</span>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-200">{script.title}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 italic">"{script.trigger}"</p>
                                    </div>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${selectedScript === index ? 'rotate-180' : ''}`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {selectedScript === index && (
                                <div className="px-4 pb-4 pt-0">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900/50">
                                        <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed font-medium">
                                            {script.response}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                            <span className="text-4xl mb-4 opacity-20">🔍</span>
                            <p className="text-sm font-bold uppercase tracking-widest opacity-40">Nessun risultato</p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-center text-slate-400 font-bold uppercase tracking-tighter">
                        Consiglio: Ascolta sempre prima di rispondere.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ObjectionHandler;
