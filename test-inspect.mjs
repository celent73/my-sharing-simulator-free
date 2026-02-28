import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkdlrycrrafrsglptkyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZGxyeWNycmFmcnNnbHB0a3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTExMjEsImV4cCI6MjA4MDYyNzEyMX0.KAC5KsGMcCsrb3DJ-BPZIUaqbXEL2V2RHwnmOkvNQhc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkUserStates() {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'nome2@prova.it',
        password: 'password123'
    });

    // if password is wrong we might need a general select using service role... but we are using anon key.
    // Wait, if we can't login, we can't read their state due to RLS.
    if (authError) {
        const { data: authData2, error: authError2 } = await supabase.auth.signInWithPassword({
            email: 'nome2@prova.it',
            password: '123456'
        });
        if (authError2) {
            console.error("Login fallito, impossibile leggere lo stato: ", authError2.message);
            return;
        }
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    console.log("Logged in as user:", user.id);

    const { data, error } = await supabase
        .from('user_states')
        .select('*')
        .eq('user_id', user.id);

    console.log('USER STATES IN DB:', JSON.stringify(data, null, 2));
}

checkUserStates();
