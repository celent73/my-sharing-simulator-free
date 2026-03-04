import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';

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

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        try {
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-') || key.includes('supabase.auth.token')) {
                    localStorage.removeItem(key);
                }
            });
            await supabase.auth.signOut();
            localStorage.removeItem('arena_team_id');
            window.location.href = '/';
        } catch (error) {
            console.error('Sign out error:', error);
            localStorage.clear();
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
