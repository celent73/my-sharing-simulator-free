import React, { useState } from 'react';
import { X, Check, Star, Zap, Mail } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { supabase, supabaseUrl, supabaseStateless } from '../utils/supabaseClient';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock?: () => void; // Opzionale, se serve per test
  licenseCode?: string; // Ora opzionale
  setLicenseCode?: (code: string) => void; // Ora opzionale
  loading?: boolean; // Ora opzionale
  error?: string; // Ora opzionale
  forceLock?: boolean; // Se true, non mostra la X per chiudere (blocco totale)
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  onUnlock,
  licenseCode: propsLicenseCode,
  setLicenseCode,
  loading: propsLoading,
  error: propsError,
  forceLock,
}) => {
  // STATO INTERNO - Sincronizzato con props se presenti, altrimenti locale per indipendenza
  const [localLicenseCode, setLocalLicenseCode] = useState(propsLicenseCode || '');
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(propsError || '');

  if (!isOpen) return null;

  // Link per i pagamenti
  const LINK_ABBONAMENTO = "https://buy.stripe.com/5kQ9AUcjtdg4ccb8yJ3gk0i";
  const LINK_VITA = "https://buy.stripe.com/bJe14obfpcc01xx5mx3gk0j";

  // FUNZIONE DI VERIFICA INTEGRATA
  const handleVerifyCode = async () => {
    if (!localLicenseCode.trim()) {
      setLocalError('Inserisci un codice licenza');
      return;
    }

    setLocalLoading(true);
    setLocalError('');

    try {
      console.log("[PremiumModal] Inizio verifica per:", localLicenseCode);
      // Pulisci il codice
      let cleanCode = localLicenseCode.replace(/\s+/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '').toUpperCase();

      // Crea un client stateless temporaneo per evitare i Navigator Logs cross-tab della libreria JS
      // che, in alcuni casi post-logout profondo con pulizia DOM manuale, congelano i check per 10 minuti.
      const statelessSupabase = supabaseStateless; // Usa quello centralizzato

      // Funzione helper per l'upsert protetto da timeout 
      const fetchWithTimeout = async (promiseFn: () => Promise<any>, ms: number = 8000) => {
        let timeout: NodeJS.Timeout;
        const timeoutPromise = new Promise((_, reject) => {
          timeout = setTimeout(() => reject(new Error('Timeout Connessione Supabase. La query ha impiegato più di 8 secondi e si è bloccata.')), ms);
        });
        try {
          return await Promise.race([promiseFn(), timeoutPromise]);
        } finally {
          //@ts-ignore
          clearTimeout(timeout);
        }
      };

      console.log("[PremiumModal] Chiamata DB 1...");
      let { data: licenses, error: dbError } = await fetchWithTimeout(
        async () => await statelessSupabase.from('licenses').select('*').ilike('code', cleanCode)
      );

      // Prova senza trattini
      if ((!licenses || licenses.length === 0) && cleanCode.includes('-')) {
        console.log("[PremiumModal] Chiamata DB 2 (no dashes)...");
        const noDashes = cleanCode.replace(/-/g, '');
        const { data: retryData } = await fetchWithTimeout(
          async () => await statelessSupabase.from('licenses').select('*').ilike('code', noDashes)
        );
        if (retryData && retryData.length > 0) {
          licenses = retryData;
          cleanCode = noDashes;
        }
      }

      // Prova con trattini formattati
      if ((!licenses || licenses.length === 0) && !cleanCode.includes('-') && cleanCode.length === 12) {
        console.log("[PremiumModal] Chiamata DB 3 (formatted)...");
        const formatted = `${cleanCode.slice(0, 4)}-${cleanCode.slice(4, 8)}-${cleanCode.slice(8, 12)}`;
        const { data: retryData2 } = await fetchWithTimeout(
          async () => await statelessSupabase.from('licenses').select('*').ilike('code', formatted)
        );
        if (retryData2 && retryData2.length > 0) {
          licenses = retryData2;
          cleanCode = formatted;
        }
      }

      console.log("[PremiumModal] Risultati DB:", { licenses, dbError });

      if (dbError || !licenses || licenses.length === 0) {
        setLocalError('Codice non valido o errato');
        setLocalLoading(false);
        return;
      }

      const data = licenses[0];
      const currentUses = data.uses || 0;
      const maxUses = data.max_uses || 3;

      if (currentUses >= maxUses) {
        setLocalError(`Limite dispositivi raggiunto (${maxUses}/${maxUses})`);
        setLocalLoading(false);
        return;
      }

      console.log("[PremiumModal] Aggiornamento counter...", data.id);
      // Incrementa contatore
      await fetchWithTimeout(
        async () => await statelessSupabase.from('licenses').update({ uses: currentUses + 1 }).eq('id', data.id)
      );

      console.log("[PremiumModal] Salvataggio e aggiornamento stato...");
      // 1. Salvataggio locale "legacy" per velocità
      localStorage.setItem('is_premium', 'true');

      // 2. Aggiornamento stato parent (useSmartState) - Questo innesca anche il salvataggio cloud
      if (setLicenseCode) {
        setLicenseCode(cleanCode);
      } else {
        localStorage.setItem('licenseCode', JSON.stringify(cleanCode));
      }

      // 3. Callback di sblocco
      if (onUnlock) {
        onUnlock();
      }

      alert('✅ Codice valido! App sbloccata.');
      onClose();

    } catch (err: any) {
      console.error('Errore verifica:', err);
      setLocalError(err.message || 'Errore di sistema. Riprova.');
    }

    setLocalLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="bg-gray-950 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-white/10 ring-1 ring-white/5">

        {/* Intestazione */}
        <div className="p-6 md:p-10 text-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-gray-950 relative border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none"></div>
          {!forceLock && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={24} />
            </button>
          )}

          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
            Sblocca il Potenziale <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">PRO</span>
          </h2>

          <div className="space-y-2 text-gray-400 text-lg">
            <p className="flex items-center justify-center gap-2">
              <Zap size={20} className="text-amber-400 fill-amber-400" />
              Sblocca tutta la potenzialità della App
            </p>
            <p className="flex items-center justify-center gap-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              Sarà un grande Supporto per la tua Attività
            </p>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-600/20 border border-amber-500/30 text-amber-200 rounded-full text-sm font-medium">
            <Mail size={16} />
            Durante l'acquisto scrivi la tua mail per ricevere il codice
          </div>
        </div>

        {/* Sezione Prezzi (Card) */}
        <div className="p-6 md:p-10 bg-gray-950 flex-grow overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-10 max-w-3xl mx-auto items-stretch">

            {/* OPZIONE 1: ABBONAMENTO 3.99€ (SILVER) */}
            <div className="relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/30 transition-all hover:bg-white/10 group">
              <h3 className="text-xl font-bold text-gray-300 mb-2 uppercase tracking-widest">Mensile</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-white drop-shadow-md">€3,99</span>
                <span className="text-gray-400">/mese</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-gray-400">
                <li className="flex gap-2"><Check size={16} className="text-gray-300" /> Accesso completo</li>
                <li className="flex gap-2"><Check size={16} className="text-gray-300" /> Disdici quando vuoi</li>
              </ul>
              <a
                href={LINK_ABBONAMENTO}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 bg-gray-800 hover:bg-gray-700 border border-gray-600 text-gray-200 font-bold rounded-xl text-center transition-all uppercase tracking-wider text-sm"
              >
                Scegli Mensile
              </a>
            </div>

            {/* OPZIONE 2: A VITA 29.90€ (GOLD VIP) */}
            <div className="relative p-1 rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-500 to-yellow-800 shadow-[0_0_40px_rgba(234,179,8,0.3)] transform md:-translate-y-4 hover:scale-[1.02] transition-transform duration-300 group">

              {/* Contenuto Card */}
              <div className="bg-gray-950 rounded-xl p-6 h-full relative overflow-hidden">

                {/* Shine Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                {/* Targhetta Consigliato -> BEST VALUE */}
                <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 text-black px-6 py-1.5 rounded-b-xl text-xs font-black shadow-lg uppercase tracking-widest flex items-center gap-1 border border-yellow-200">
                  <Star size={12} className="fill-black" /> BEST VALUE <Star size={12} className="fill-black" />
                </div>

                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-600 mb-2 mt-4 uppercase tracking-widest text-center">A Vita</h3>

                <div className="flex items-baseline justify-center gap-1 mb-6">
                  <span className="text-5xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">€29,90</span>
                  <span className="text-amber-500 font-bold">una tantum</span>
                </div>

                <ul className="space-y-3 mb-8 text-sm text-gray-300 border-t border-white/10 pt-6">
                  <li className="flex gap-3 items-center"><div className="p-1 rounded-full bg-amber-500/20"><Check size={12} className="text-amber-400" /></div> <span className="font-semibold text-white">Paghi una volta sola</span></li>
                  <li className="flex gap-3 items-center"><div className="p-1 rounded-full bg-amber-500/20"><Check size={12} className="text-amber-400" /></div> <span className="font-semibold text-white">Aggiornamenti inclusi</span></li>
                  <li className="flex gap-3 items-center"><div className="p-1 rounded-full bg-amber-500/20"><Check size={12} className="text-amber-400" /></div> <span className="font-semibold text-white">Nessun abbonamento</span></li>
                </ul>

                <a
                  href={LINK_VITA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 px-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 hover:from-yellow-300 hover:via-amber-400 hover:to-yellow-500 text-black font-black rounded-xl text-center transition-all shadow-lg shadow-amber-500/20 uppercase tracking-widest text-lg relative overflow-hidden"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">Sblocca ORA <Zap size={20} className="fill-black" /></span>
                </a>
              </div>
            </div>

          </div>

          {/* Area Inserimento Codice */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-center text-sm text-gray-500 mb-4">Hai già ricevuto il codice via email?</p>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="INCOLLA IL TUO CODICE LICENZA QUI..."
                value={localLicenseCode}
                onChange={(e) => setLocalLicenseCode(e.target.value.toUpperCase())}
                className="w-full p-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-center font-mono text-lg tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all uppercase placeholder:text-sm md:placeholder:text-base text-gray-900 dark:text-white"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="characters"
                spellCheck="false"
              />

              {localError && (
                <div className="text-red-500 text-sm text-center font-medium animate-pulse">
                  {localError}
                </div>
              )}

              <button
                onClick={handleVerifyCode}
                disabled={!localLicenseCode || localLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2
                  ${!localLicenseCode || localLoading
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-[1.02] active:scale-95'
                  }`}
              >
                {localLoading ? (
                  <span className="animate-spin">⏳</span>
                ) : (
                  <>Attiva Licenza <Check size={20} /></>
                )}
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              Pagamento sicuro via Stripe. Il codice arriva immediatamente via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};