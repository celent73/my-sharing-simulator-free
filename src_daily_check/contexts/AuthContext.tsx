import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { syncLocalDataToCloud } from '../services/storageService';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    signOut: () => Promise<void>;
    loading: boolean;
    isPasswordRecovery: boolean;
    setIsPasswordRecovery: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
            // Intercept password recovery link from email
            if (event === 'PASSWORD_RECOVERY') {
                setIsPasswordRecovery(true);
            }
        });

        // Fallback for reading tokens from URL in case the event doesn't fire immediately
        if (window.location.hash && window.location.hash.includes('type=recovery')) {
            setIsPasswordRecovery(true);
        }

        // Check sessionStorage flag set by the root App.tsx
        if (sessionStorage.getItem('pendingPasswordRecovery') === 'true') {
            setIsPasswordRecovery(true);
            sessionStorage.removeItem('pendingPasswordRecovery'); // Clear it so it doesn't trigger again on reload
        }

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        try {
            // Rimuoviamo SOLO le chiavi di autenticazione per preservare i dati locali (logs/settings)
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-') || key.includes('supabase.auth.token')) {
                    localStorage.removeItem(key);
                }
            });
            await supabase.auth.signOut();
            localStorage.removeItem('arena_team_id');
            
            // Redirect alla home
            window.location.href = '/';
        } catch (error) {
            console.error('Sign out error:', error);
            // Anche in caso di errore, NON puliamo tutto il localStorage.
            // Ci limitiamo a forzare l'uscita rimuovendo i token noti.
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-') || key.includes('supabase.auth.token')) {
                    localStorage.removeItem(key);
                }
            });
            window.location.href = '/';
        }
    };

    const value = { session, user, signOut, loading, isPasswordRecovery, setIsPasswordRecovery };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
