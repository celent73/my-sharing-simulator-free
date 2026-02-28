import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkdlrycrrafrsglptkyk.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZGxyeWNycmFmcnNnbHB0a3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTExMjEsImV4cCI6MjA4MDYyNzEyMX0.KAC5KsGMcCsrb3DJ-BPZIUaqbXEL2V2RHwnmOkvNQhc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkDatabase() {
    const testEmail = `debug_update_${Date.now()}@prova.it`;
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

    // Test 1: Insert initial data
    console.log('Testing INITIAL INSERT (Value: 0)...');
    const { data: insertData, error: insertError } = await supabase
        .from('user_states')
        .upsert({
            user_id: user.id,
            state_key: 'test_key',
            state_data: { value: 0 },
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,state_key' });

    if (insertError) console.error('INSERT FAILED:', insertError);

    // Test 2: Update same data
    console.log('Testing UPDATE (Value: 77)...');
    const { data: updateData, error: updateError } = await supabase
        .from('user_states')
        .upsert({
            user_id: user.id,
            state_key: 'test_key',
            state_data: { value: 77 },
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,state_key' });

    if (updateError) console.error('UPDATE FAILED:', updateError);

    // Test 3: Select
    console.log('Testing SELECT...');
    const { data: selectData, error: selectError } = await supabase
        .from('user_states')
        .select('*')
        .eq('user_id', user.id);

    if (selectError) {
        console.error('SELECT FAILED:', selectError);
    } else {
        console.log('SELECT RETRIEVED (Should be 77):', JSON.stringify(selectData, null, 2));
    }
}

checkDatabase();
