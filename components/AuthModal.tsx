import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    title?: string;
    subtitle?: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    title = "Accedi a Daily Chek",
    subtitle = "Inserisci la tua email per sincronizzare i tuoi obiettivi nel cloud in modo sicuro."
}) => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setErrorMessage('');

        try {
            const { error } = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    shouldCreateUser: true,
                    // Se siamo in un'app desktop (Tauri/Electron), window.location.origin potrebbe essere tauri:// o file://
                    // che Supabase rifiuta. Usiamo un fallback esplicito al localhost:5173 per lo sviluppo locale
                    emailRedirectTo: window.location.origin.includes('http') ? window.location.origin : 'http://localhost:5173',
                }
            });

            if (error) throw error;

            setStatus('success');
            // We don't call onSuccess right away because they need to check their email
            // The auth state change listener in the main app or modal will handle the redirect if needed
        } catch (error: any) {
            console.error('Error sending magic link:', error);
            setStatus('error');
            setErrorMessage(error.message || 'Errore durante l\'invio del link magico.');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
                        >
                            <X size={20} />
                        </button>

                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Mail size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm">{subtitle}</p>
                        </div>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-6 rounded-2xl text-center"
                            >
                                <CheckCircle2 size={48} className="mx-auto mb-4" />
                                <h3 className="text-lg font-bold mb-2">Controlla la tua email</h3>
                                <p className="text-sm">Ti abbiamo inviato un link magico. Cliccalo per accedere in modo sicuro (senza password).</p>
                                <button
                                    onClick={onClose}
                                    className="mt-6 w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors"
                                >
                                    Ho capito
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">
                                        Indirizzo Email
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="mario.rossi@esempio.com"
                                            className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                            required
                                            disabled={status === 'loading'}
                                        />
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-start gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">
                                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'loading' || !email}
                                    className="w-full relative flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 mt-6 overflow-hidden group"
                                >
                                    <span className={status === 'loading' ? 'opacity-0' : 'opacity-100 transition-opacity'}>
                                        Invia Link Magico
                                    </span>
                                    <ArrowRight size={18} className={`transition-all ${status === 'loading' ? 'opacity-0' : 'group-hover:translate-x-1'}`} />

                                    {status === 'loading' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        </div>
                                    )}
                                </button>

                                <p className="text-center text-[11px] text-slate-500 mt-4 leading-relaxed px-4">
                                    Utilizzando il servizio accetti le condizioni di elaborazione dati in cloud per i target giornalieri.
                                </p>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
