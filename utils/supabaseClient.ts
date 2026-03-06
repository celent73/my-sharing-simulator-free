import { createClient } from '@supabase/supabase-js';

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cqgxokjqljwgrtcksryc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxZ3hva2pxbGp3Z3J0Y2tzcnljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3ODI3MTYsImV4cCI6MjA4ODM1ODcxNn0.3xgA9vQTLsISofYClPxVlGfWJwqA-Ga-K0urm2TgtfA';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.warn("Mancano le variabili d'ambiente Supabase. Le funzionalità database non saranno disponibili.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: 'sb-auth-token-v2',
        flowType: 'implicit'  // 'pkce' richiedeva un ?code= redirect fisso -> rotto su localhost
    }
});
// Client stateless per operazioni che non devono essere influenzate dallo stato di auth (es. verifica licenze)
export const supabaseStateless = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    }
});
