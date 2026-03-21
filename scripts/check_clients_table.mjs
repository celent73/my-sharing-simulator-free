import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Funzione semplice per caricare .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('URL o KEY di Supabase non trovati in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable() {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .limit(1);
        
        if (error) {
            console.log('ERRORE:', error.message);
            if (error.message.includes('relation "public.clients" does not exist')) {
                console.log('LA TABELLA CLIENTS NON ESISTE ANCORA.');
            }
        } else {
            console.log('LA TABELLA CLIENTS ESISTE CORRETTAMENTE.');
        }
    } catch (e) {
        console.error('ECCEZIONE:', e.message);
    }
}

checkTable();
