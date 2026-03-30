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
    const [showEmailOptions, setShowEmailOptions] = useState(false);

    const handleOAuthLogin = async (provider: 'google' | 'apple') => {
        setStatus('loading');
        setErrorMessage('');
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: window.location.origin.includes('http') ? window.location.origin : 'http://localhost:5173',
                }
            });
            if (error) throw error;
        } catch (error: any) {
            console.error(`Error with ${provider} login:`, error);
            setStatus('error');
            setErrorMessage(error.message || `Errore d'accesso con ${provider}.`);
        }
    };

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
                            <div className="space-y-4">
                                
                                {/* Pulsanti OAuth */}
                                <button
                                    onClick={() => handleOAuthLogin('google')}
                                    disabled={status === 'loading'}
                                    className="w-full relative flex items-center justify-center gap-3 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 group shadow-sm"
                                >
                                    <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    Accedi con Google
                                </button>

                                <button
                                    onClick={() => handleOAuthLogin('apple')}
                                    disabled={status === 'loading'}
                                    className="w-full relative flex items-center justify-center gap-3 py-3.5 bg-black text-white rounded-2xl font-bold hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 group shadow-sm"
                                >
                                    <svg viewBox="0 0 384 512" width="18" height="18" fill="currentColor">
                                        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
                                    </svg>
                                    Accedi con Apple
                                </button>

                                {status === 'error' && (
                                    <div className="flex items-start gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-xl mt-4">
                                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                                        <span>{errorMessage}</span>
                                    </div>
                                )}

                                <div className="py-4 flex items-center">
                                    <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
                                    <span className="px-4 text-xs font-medium text-slate-400">oppure</span>
                                    <div className="flex-1 border-t border-slate-200 dark:border-slate-700"></div>
                                </div>

                                {!showEmailOptions ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowEmailOptions(true)}
                                        className="w-full py-3.5 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                                    >
                                        Usa Indirizzo Email (Magic Link)
                                    </button>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
                                        <div>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="Inserisci la tua email..."
                                                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                                    required
                                                    disabled={status === 'loading'}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={status === 'loading' || !email}
                                            className="w-full relative flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 overflow-hidden group"
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
                                    </form>
                                )}

                                <p className="text-center text-[10px] text-slate-400 mt-6 leading-relaxed px-4">
                                    Registrandoti accetti le condizioni di elaborazione dati in cloud. È gratis.
                                </p>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
