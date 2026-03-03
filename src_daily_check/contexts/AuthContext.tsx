import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    signOut: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };

        getSession();

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        try {
            // "Nuclear Logout": Manually clear all possible Supabase auth keys
            Object.keys(localStorage).forEach(key => {
                if (key.startsWith('sb-') || key.includes('supabase.auth.token')) {
                    localStorage.removeItem(key);
                }
            });

            // Standard Supabase sign out
            await supabase.auth.signOut();

            // Clear other local app state
            localStorage.removeItem('arena_team_id');

            // Force a clean redirect to home
            window.location.href = '/';
        } catch (error) {
            console.error('Sign out error:', error);
            // Even on error, force clear and redirect
            localStorage.clear();
            window.location.href = '/';
        }
    };

    const value = {
        session,
        user,
        signOut,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
