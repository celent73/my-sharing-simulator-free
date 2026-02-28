import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkdlrycrrafrsglptkyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZGxyeWNycmFmcnNnbHB0a3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTExMjEsImV4cCI6MjA4MDYyNzEyMX0.KAC5KsGMcCsrb3DJ-BPZIUaqbXEL2V2RHwnmOkvNQhc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
    console.log('Logging in as nome2@prova.it...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'nome2@prova.it',
        password: 'password123' // ipotetica, proveremo le più comuni se fallisce, o create un utente fittizio
    });

    if (authError) {
        console.log('Login failed with typical password, creating a test user instead...');
        const userEmail = 'test_debug_' + Date.now() + '@prova.it';
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: userEmail,
            password: 'testPassword123'
        });

        if (signUpError) {
            console.error('Signup failed:', signUpError);
            return;
        }
        console.log('Logged in as test user:', userEmail);
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        console.log('No session');
        return;
    }

    // Proviamo a inserire un dato finto
    console.log('Testing INSERT on user_states...');
    const { data: insertData, error: insertError } = await supabase
        .from('user_states')
        .upsert({
            user_id: session.user.id,
            state_key: 'test_key',
            state_data: { test: 123 },
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,state_key' });

    if (insertError) {
        console.error('INSERT ERROR:', insertError);
    } else {
        console.log('INSERT SUCCESS:', insertData);
    }

    // Proviamo a leggere
    console.log('Testing SELECT on user_states...');
    const { data: selectData, error: selectError } = await supabase
        .from('user_states')
        .select('*')
        .eq('user_id', session.user.id);

    if (selectError) {
        console.error('SELECT ERROR:', selectError);
    } else {
        console.log('SELECT SUCCESS:', selectData);
    }
}

testSupabase();
