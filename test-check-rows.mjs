import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkdlrycrrafrsglptkyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZGxyeWNycmFmcnNnbHB0a3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTExMjEsImV4cCI6MjA4MDYyNzEyMX0.KAC5KsGMcCsrb3DJ-BPZIUaqbXEL2V2RHwnmOkvNQhc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
    const testEmail = `debug_dup_${Date.now()}@prova.it`;
    const { data: signUpData } = await supabase.auth.signUp({
        email: testEmail,
        password: 'securePassword123'
    });
    const user = signUpData.user;
    console.log('User:', user.id);

    await supabase.from('user_states').upsert({
        user_id: user.id, state_key: 'test_key', state_data: { value: 1 }
    });
    await supabase.from('user_states').upsert({
        user_id: user.id, state_key: 'test_key', state_data: { value: 2 }
    });

    const { data, error } = await supabase.from('user_states').select('*').eq('user_id', user.id);
    console.log('ROWS:', data?.length);

    const { data: singleData, error: singleError } = await supabase.from('user_states').select('*').eq('user_id', user.id).single();
    console.log('SINGLE ERROR:', singleError);
}

checkDatabase();
