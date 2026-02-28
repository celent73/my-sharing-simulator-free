import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkdlrycrrafrsglptkyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZGxyeWNycmFmcnNnbHB0a3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTExMjEsImV4cCI6MjA4MDYyNzEyMX0.KAC5KsGMcCsrb3DJ-BPZIUaqbXEL2V2RHwnmOkvNQhc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
    const testEmail = `debug_${Date.now()}@prova.it`;
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: 'securePassword123'
    });

    if (signUpError) {
        console.error('Error creating test user:', signUpError.message);
        return;
    }

    const user = signUpData.user;
    console.log('Created test user:', user.id);

    // Test 1: Insert
    console.log('Testing INSERT...');
    const { data: insertData, error: insertError } = await supabase
        .from('user_states')
        .upsert({
            user_id: user.id,
            state_key: 'test_key',
            state_data: { value: 100 },
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,state_key' });

    if (insertError) {
        console.error('INSERT FAILED:', insertError);
    } else {
        console.log('INSERT SUCCESS (or silent success)');
    }

    // Test 2: Select
    console.log('Testing SELECT...');
    const { data: selectData, error: selectError } = await supabase
        .from('user_states')
        .select('*')
        .eq('user_id', user.id);

    if (selectError) {
        console.error('SELECT FAILED:', selectError);
    } else {
        console.log('SELECT RETRIEVED:', selectData);
    }
}

checkDatabase();
