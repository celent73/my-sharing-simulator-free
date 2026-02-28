import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nkdlrycrrafrsglptkyk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZGxyeWNycmFmcnNnbHB0a3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTExMjEsImV4cCI6MjA4MDYyNzEyMX0.KAC5KsGMcCsrb3DJ-BPZIUaqbXEL2V2RHwnmOkvNQhc';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const run = async () => {
    console.log('[Test] Initiating connection to Supabase...');
    const startTime = Date.now();
    try {
        const { data, error } = await supabase.from('licenses').select('*').ilike('code', 'LICENZA-TEST');
        console.log(`[Test] Completed in ${(Date.now() - startTime) / 1000}s`);
        console.log('Data:', data);
        console.log('Error:', error);
    } catch (e) {
        console.error(`[Test] Exception after ${(Date.now() - startTime) / 1000}s :`, e);
    }
}
run();
