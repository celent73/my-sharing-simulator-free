import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAZIONE ---
// Per generare licenze (scrivere nel DB), serve la chiave "SERVICE_ROLE" (Admin).
// La chiave "ANON" (pubblica) che trovi in .env ha solo permessi di lettura per sicurezza.

// 1. Vai su Supabase Dashboard -> Project Settings -> API.
// 2. Copia la chiave "service_role" (secret).
// 3. Incollala qui sotto al posto di 'INCOLLA_QUI_LA_TUA_SERVICE_ROLE_KEY'.

const supabaseUrl = 'https://nkdlrycrrafrsglptkyk.supabase.co';
const supabaseServiceKey = 'INCOLLA_QUI_LA_TUA_SERVICE_ROLE_KEY';

// ----------------------

if (supabaseServiceKey === 'INCOLLA_QUI_LA_TUA_SERVICE_ROLE_KEY') {
    console.error('❌ ERRORE: Devi inserire la SERVICE_ROLE_KEY nello script prima di eseguirlo.');
    console.log('Apri il file generating_license.js e segui le istruzioni in alto.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const generateCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    // Format: AAAA-BBBB-CCCC
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (i < 2) code += '-';
    }
    return code;
};

const createLicense = async () => {
    const code = generateCode();
    console.log(`\n🔄 Generazione nuova licenza...`);

    // Inserisce una nuova licenza con:
    // uses: 0
    // max_uses: 2 (o cambia questo numero)
    const { data, error } = await supabase
        .from('licenses')
        .insert([
            { code: code, uses: 0, max_uses: 2 }
        ])
        .select();

    if (error) {
        console.error('❌ Errore Supabase:', error.message);
    } else {
        console.log('\n✅ LICENZA GENERATA CON SUCCESSO!');
        console.log('------------------------------------------------');
        console.log(`CODICE:   ${code}`);
        console.log('------------------------------------------------\n');
    }
};

createLicense();
