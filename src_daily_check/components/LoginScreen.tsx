import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

interface LoginScreenProps {
    onLoginSuccess: () => void;
}

type Mode = 'login' | 'register' | 'reset';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
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
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin,
                });
                if (error) throw error;
                setSuccessMsg('📧 Email di recupero inviata! Controlla la tua casella.');
            } else if (mode === 'login') {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                onLoginSuccess();
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                setSuccessMsg('✅ Registrazione completata! Controlla la tua email per confermare.');
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
        register: 'Crea il tuo account 🚀',
        reset: 'Recupera password 🔐',
    };
    const subtitles: Record<Mode, string> = {
        login: 'Accedi per monitorare i tuoi progressi.',
        register: 'Registrati e inizia a tracciare il tuo successo.',
        reset: 'Ti invieremo un link per reimpostare la password.',
    };
    const btnLabels: Record<Mode, string> = {
        login: 'Accedi',
        register: 'Registrati',
        reset: 'Invia link di recupero',
    };

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/15 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-indigo-500/10 rounded-full blur-[100px]" />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo / Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_50px_rgba(99,102,241,0.4)] mb-5">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Daily Check</h1>
                    <p className="text-slate-400 mt-1 text-sm font-medium">Il tuo simulatore di successo personale</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-black text-white mb-1">{titles[mode]}</h2>
                    <p className="text-slate-400 text-sm mb-6">{subtitles[mode]}</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="tuo@email.com"
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                            />
                        </div>

                        {/* Password (hidden in reset mode) */}
                        {mode !== 'reset' && (
                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Password</label>
                                    {mode === 'login' && (
                                        <button type="button" onClick={() => { setMode('reset'); resetState(); }} className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                            Dimenticata?
                                        </button>
                                    )}
                                </div>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-600 font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1">
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Error / Success */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-bold">
                                <span>⚠️</span><span>{error}</span>
                            </div>
                        )}
                        {successMsg && (
                            <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-bold">
                                <span>{successMsg}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-base shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                    Caricamento...
                                </span>
                            ) : btnLabels[mode]}
                        </button>
                    </form>

                    {/* Footer links */}
                    <div className="mt-5 text-center text-sm text-slate-500">
                        {mode === 'reset' ? (
                            <button onClick={() => { setMode('login'); resetState(); }} className="font-bold text-blue-400 hover:text-blue-300 transition-colors">
                                ← Torna al login
                            </button>
                        ) : mode === 'login' ? (
                            <span>Non hai un account?{' '}
                                <button onClick={() => { setMode('register'); resetState(); }} className="font-bold text-blue-400 hover:text-blue-300 transition-colors">Registrati</button>
                            </span>
                        ) : (
                            <span>Hai già un account?{' '}
                                <button onClick={() => { setMode('login'); resetState(); }} className="font-bold text-blue-400 hover:text-blue-300 transition-colors">Accedi</button>
                            </span>
                        )}
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-slate-600 text-xs mt-6 font-medium">
                    I tuoi dati sono salvati in modo sicuro e accessibili da qualsiasi dispositivo
                </p>
            </div>
        </div>
    );
};

export default LoginScreen;
