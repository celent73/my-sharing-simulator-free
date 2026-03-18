import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient';
import { Mail, Lock, Eye, EyeOff, ArrowRight, X, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginScreenProps {
    onLoginSuccess: () => void;
    onClose?: () => void;
}

type Mode = 'login' | 'register' | 'reset';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, onClose }) => {
    const [mode, setMode] = useState<Mode>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const resetState = () => { setError(null); setSuccessMsg(null); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        resetState();

        try {
            if (mode === 'reset') {
                const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: siteUrl,
                });
                if (error) throw error;
                setSuccessMsg('Email di recupero inviata! Controlla la tua casella.');
            } else if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onLoginSuccess();
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setSuccessMsg('Registrazione completata! Controlla la tua email per confermare.');
                setMode('login');
            }
        } catch (err: any) {
            setError(err.message || 'Si è verificato un errore. Riprova.');
        } finally {
            setLoading(false);
        }
    };

    const titles: Record<Mode, string> = {
        login: 'Bentornato 👋',
        register: 'Crea Account 🚀',
        reset: 'Recupera Password 🔐',
    };
    const subtitles: Record<Mode, string> = {
        login: 'Accedi per monitorare i tuoi progressi.',
        register: 'Inizia a tracciare il tuo successo oggi.',
        reset: 'Ti invieremo un link per il ripristino.',
    };
    const btnLabels: Record<Mode, string> = {
        login: 'Accedi',
        register: 'Registrati',
        reset: 'Invia Link',
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-[420px]">
                {/* Header / Logo Section */}
                <div className="text-center mb-8 overflow-hidden">
                    <motion.div 
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="inline-flex items-center justify-center w-44 h-44 rounded-[3rem] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-[0_25px_50px_rgba(37,99,235,0.25)] mb-8 relative group"
                    >
                        <div className="absolute inset-0 bg-white/10 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <img 
                            src="/daily_check_logo.png" 
                            alt="Daily Check Logo" 
                            className="w-full h-full object-cover rounded-[3rem] shadow-sm transform group-hover:scale-105 transition-transform duration-500"
                        />
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-[26px] font-black text-slate-900 tracking-tight leading-tight mb-2"
                    >
                        My Sharing
                        <br />
                        <span className="text-orange-500">Simulator</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-black/40 text-sm font-bold uppercase tracking-[0.2em]"
                    >
                        PIANIFICA IL TUO SUCCESSO
                    </motion.p>
                </div>

                {/* Main Auth Card - iPhone Style */}
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-3xl border border-white/40 rounded-[2.5rem] p-8 shadow-[0_32px_64px_rgba(0,0,0,0.1)] relative"
                >
                    {onClose && (
                        <button 
                            onClick={onClose} 
                            className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full bg-black/5 text-black/40 hover:text-black hover:bg-black/10 transition-all border border-black/5 active:scale-90"
                        >
                            <X size={20} />
                        </button>
                    )}

                    <div className="mb-8">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{titles[mode]}</h2>
                        <p className="text-black/60 text-sm font-medium">{subtitles[mode]}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-black/50 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-blue-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="tuo@email.com"
                                    className="w-full bg-black/[0.04] border border-black/20 rounded-2xl py-4 pl-12 pr-4 text-slate-900 placeholder-black/30 font-bold focus:outline-none focus:border-blue-500/50 focus:bg-white transition-all shadow-sm focus:shadow-md"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        {mode !== 'reset' && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="block text-[10px] font-black text-black/50 uppercase tracking-widest">Password</label>
                                    {mode === 'login' && (
                                        <button 
                                            type="button" 
                                            onClick={() => { setMode('reset'); resetState(); }} 
                                            className="text-[10px] font-black text-blue-600 hover:text-blue-500 uppercase tracking-widest"
                                        >
                                            Dimenticata?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30 group-focus-within:text-blue-500 transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-black/[0.04] border border-black/20 rounded-2xl py-4 pl-12 pr-12 text-slate-900 placeholder-black/30 font-bold focus:outline-none focus:border-blue-500/50 focus:bg-white transition-all shadow-sm focus:shadow-md"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error/Success Feedback */}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-600 text-[13px] font-bold"
                            >
                                <AlertCircle size={18} className="shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}
                        {successMsg && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-3 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-emerald-600 text-[13px] font-bold"
                            >
                                <CheckCircle2 size={18} className="shrink-0" />
                                <span>{successMsg}</span>
                            </motion.div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-lg shadow-[0_10px_30px_rgba(37,99,235,0.25)] disabled:opacity-50 disabled:cursor-not-allowed transition-all relative flex items-center justify-center gap-2 overflow-hidden group active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{btnLabels[mode]}</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Mode Switching */}
                    <div className="mt-8 text-center text-sm">
                        {mode === 'reset' ? (
                            <button onClick={() => { setMode('login'); resetState(); }} className="font-bold text-black/40 hover:text-black transition-colors">
                                ← Torna al login
                            </button>
                        ) : mode === 'login' ? (
                            <p className="text-black/40 font-bold">
                                Non hai un account?{' '}
                                <button onClick={() => { setMode('register'); resetState(); }} className="text-blue-600 hover:text-blue-500 font-black">Registrati</button>
                            </p>
                        ) : (
                            <p className="text-black/40 font-bold">
                                Hai già un account?{' '}
                                <button onClick={() => { setMode('login'); resetState(); }} className="text-blue-600 hover:text-blue-500 font-black">Accedi</button>
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Footer Security Note */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center mt-10"
                >
                    <p className="text-black/40 text-xs font-bold leading-relaxed max-w-[280px] mx-auto">
                        I tuoi dati sono salvati in modo sicuro e accessibili da qualsiasi dispositivo
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default LoginScreen;
