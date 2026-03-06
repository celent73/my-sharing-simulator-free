import React from 'react';
import { X, Shield, FileText, Cookie, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type LegalType = 'privacy' | 'terms' | 'cookie' | 'none';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
  type: LegalType;
  mode: 'startup' | 'view';
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, onAccept, type, mode }) => {
  const content = {
    privacy: {
      title: "Privacy Policy",
      icon: <Shield size={24} className="text-emerald-400" />,
      text: (
        <div className="space-y-4">
          <p><strong>1. Titolare del Trattamento</strong><br />Il titolare del trattamento è <strong>Luca Celentano</strong>.<br />Per qualsiasi informazione o richiesta, puoi contattare il titolare all'indirizzo email: <strong>celesharing@gmail.com</strong></p>
          <p><strong>2. Dati Raccolti e Conservazione</strong><br />Questa applicazione raccoglie esclusivamente i dati tecnici strettamente necessari al funzionamento del simulatore (es. preferenze di calcolo inserite localmente nel tuo dispositivo). I dati possono essere memorizzati in cloud tramite infrastrutture sicure (es. Supabase) al solo scopo di permettere la persistenza delle simulazioni. I dati vengono conservati fino a quando non decidi di cancellarli tramite la funzione Reset o cancellazione della cache del browser.</p>
          <p><strong>3. Finalità del Trattamento</strong><br />I dati vengono utilizzati unicamente per fornire il servizio di simulazione economica e per migliorare l'esperienza utente. Nessun dato viene ceduto a terzi per finalità di marketing.</p>
          <p><strong>4. Diritti dell'Utente</strong><br />In conformità al GDPR, hai il diritto di chiedere l'accesso, la rettifica o la cancellazione dei tuoi dati contattando il titolare all'indirizzo sopra indicato.</p>
        </div>
      )
    },
    terms: {
      title: "Termini e Condizioni",
      icon: <FileText size={24} className="text-blue-400" />,
      text: (
        <div className="space-y-4">
          <p><strong>1. Accettazione dei Termini</strong><br />Utilizzando questa applicazione ("My Sharing Simulator"), accetti di essere vincolato dai presenti Termini e Condizioni. Se non accetti, ti invitiamo a non utilizzare l'app.</p>
          <p><strong>2. Scopo dell'App</strong><br />L'applicazione è uno strumento di simulazione matematica a scopo puramente illustrativo ed educativo. I risultati generati sono stime basate sui dati inseriti dall'utente e non costituiscono in alcun modo una promessa di guadagno, un'offerta finanziaria o una garanzia di risultato.</p>
          <p className="p-4 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-200"><strong>3. Limitazione di Responsabilità</strong><br />L'autore (Luca Celentano) non è responsabile per eventuali decisioni economiche prese sulla base delle simulazioni fornite. L'utente si assume la piena responsabilità dell'uso delle informazioni. <strong>Questa app NON è un prodotto ufficiale di Union Energia S.r.l.</strong></p>
          <p><strong>4. Rapporto con il Brand</strong><br />My Sharing Simulator è un'iniziativa privata di Luca Celentano, promoter indipendente. L'uso del nome 'Union Energia' all'interno del simulatore è fatto a scopo puramente descrittivo per identificare la natura dei servizi simulati. I marchi e i nomi commerciali citati appartengono ai rispettivi proprietari.</p>
          <p><strong>5. Volatilità del Piano Compensi e del Mercato</strong><br />I calcoli si basano sui parametri del piano compensi correnti al momento dell'ultimo aggiornamento. L'autore non garantisce che tali parametri rimangano invariati. Le simulazioni riguardanti <strong>Union Park</strong> sono basate su un valore PUN (Prezzo Zonale) stimato; il mercato energetico è volatile e i risultati reali potrebbero differire sensibilmente.</p>
          <p><strong>6. Proprietà Intellettuale</strong><br />Tutti i contenuti, il codice, il design e la logica di calcolo sono di proprietà esclusiva di Luca Celentano. È vietata la copia, la ridistribuzione o il reverse engineering senza autorizzazione.</p>
        </div>
      )
    },
    cookie: {
      title: "Cookie Policy",
      icon: <Cookie size={24} className="text-amber-400" />,
      text: (
        <div className="space-y-4">
          <p><strong>1. Cosa sono i cookie</strong><br />I cookie sono piccoli file di testo che i siti salvano sul tuo dispositivo per ricordare le tue preferenze.</p>
          <p><strong>2. Cookie Tecnici (Essenziali)</strong><br />Questa applicazione utilizza esclusivamente cookie tecnici e di sessione (LocalStorage) necessari per salvare le tue impostazioni (es. modalità scura, dati della simulazione) e garantire il corretto funzionamento dell'app. Non utilizziamo cookie di profilazione o di terze parti per tracciamento pubblicitario.</p>
          <p><strong>3. Gestione dei Cookie</strong><br />Puoi cancellare i dati salvati in qualsiasi momento tramite le impostazioni del tuo browser o utilizzando la funzione "Reset" all'interno dell'applicazione.</p>
        </div>
      )
    },
    startup: {
      title: "BENVENUTO",
      subtitle: "The Future of Energy",
      icon: <Shield size={32} className="text-white drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]" />,
      text: (
        <div className="space-y-6">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
            <p className="font-bold text-red-400 mb-2">⚠️ DISCLAIMER NON UFFICIALE</p>
            <p className="text-gray-300 text-sm leading-relaxed">Questo strumento è un simulatore indipendente creato da Luca Celentano per scopi illustrativi. I risultati non garantiscono guadagni reali.</p>
          </div>
          <p className="text-gray-400 text-sm text-center px-4">
            Continuando, dichiari di accettare i <span className="text-white font-medium">Termini e Condizioni</span> e di aver preso visione della <span className="text-white font-medium">Privacy Policy</span>.
          </p>
        </div>
      )
    }
  };

  const currentContent = mode === 'startup' ? content.startup : (type !== 'none' ? content[type] : content.privacy);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={mode === 'view' ? onClose : undefined}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[420px] bg-gray-900/80 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* Header Content */}
            <div className="pt-8 px-8 pb-4 text-center">
              <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                {currentContent.icon}
              </div>

              <h2 className="text-2xl font-black text-white mb-1 tracking-tight">
                {currentContent.title}
              </h2>
              {mode === 'startup' && (
                <p className="text-cyan-400 font-medium tracking-wide text-sm bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {content.startup.subtitle}
                </p>
              )}
            </div>

            {/* Scrollable Body */}
            <div className="px-8 pb-4 overflow-y-auto text-sm text-gray-300 leading-relaxed custom-scrollbar flex-1">
              {currentContent.text}
            </div>

            {/* Actions */}
            <div className="p-8 pt-4 flex flex-col gap-3">
              {mode === 'startup' && onAccept ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onAccept}
                  className="w-full py-4 bg-white text-black font-bold text-[17px] rounded-full hover:bg-gray-100 transition-colors shadow-lg shadow-black/20 flex items-center justify-center gap-2"
                >
                  Inizia il Viaggio <ChevronRight size={18} />
                </motion.button>
              ) : (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={onClose}
                  className="w-full py-4 bg-white text-black font-bold text-[17px] rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Chiudi
                </motion.button>
              )}
            </div>

            {/* Close Button for View Mode (Alternative position) */}
            {mode === 'view' && (
              <button
                onClick={onClose}
                className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};