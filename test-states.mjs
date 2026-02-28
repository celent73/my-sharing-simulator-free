import { createClient } from '@supabase/supabase-js';
const SUPABASE_URL = 'https://nkdlrycrrafrsglptkyk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rZGxyeWNycmFmcnNnbHB0a3lrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNTExMjEsImV4cCI6MjA4MDYyNzEyMX0.KAC5KsGMcCsrb3DJ-BPZIUaqbXEL2V2RHwnmOkvNQhc';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const run = async () => {
    try {
        console.log("Stato attuale auth:");
        // Per upsert senza auth l'RLS di Supabase blocca tutto se l'utente non è lo stesso?
        // Ma nel client c'è la sessione.
        // Nel test lo farò col service role o cerco di vedere il log sul browser dell'utente!
    } catch (e) {
        console.error(e);
    }
}
run();
