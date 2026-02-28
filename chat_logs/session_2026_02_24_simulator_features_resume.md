# Simulatore Sharing: Funzionalità e Architettura (Brochure Tecnica per Union)

**Data:** 24 Febbraio 2026
**Uso:** Da integrare nel pitch o da inviare come documentazione a supporto dell'elevato valore dell'app e del costo di licenza.

---

## 🚀 IL CUORE DELLA PIATTAFORMA: La Vendita "Zero Obiezioni"

L'app "Simulatore Sharing" non è un semplice foglio di calcolo, ma un vero e proprio strumento di intelligenza commerciale sviluppato per **chiudere contratti sul momento**. Genera simulazioni istantanee, comparative e visivamente ineccepibili, progettate specificamente per abbattere le obiezioni dei clienti.

### 1. 📊 Motore di Simulazione e Comparazione (Core Business)
Il fulcro dell'app, capace di processare centinaia di variabili in frazioni di secondo:
*   **Preventivazione Singola e Multipla:** Possibilità di configurare da una singola utenza (es. Luce) fino a complessi "Pacchetti Casa" o "Piani Business".
*   **Analisi "Cost vs. Benefit" in Tempo Reale:** Calcola all'istante l'ipotetico costo mensile odierno del cliente e lo compara con l'offerta Union, calcolando con precisione il margine di **Cashback** generato.
*   **Focus Mode "Zero Distrazioni" (Design Esclusivo):** Un'interfaccia proprietaria in stile "Neumorfismo / Glass iOS" oscurata e progettata appositamente per essere mostrata al cliente: nasconde le provvigioni dell'agente ed evidenzia esclusivamente, a tutto schermo, **i vantaggi, il risparmio netto e i bonus di benvenuto per l'utente finale**.
*   **Visualizzazione Ibrida:** Supporto alla presentazione affiancata o separata dei risparmi luce/gas e dei vantaggi SIM/Fonia.
*   **Supporto Multilingua Istituzionale:** Tradotto e validato da madrelingua in Italiano, Inglese e Tedesco, coprendo l'intero bacino di utenza target della rete attuale.

### 2. 👥 L'Ecosistema Rete (Gestione Promotori)
Un'area segregata e sicura (Autenticazione Protetta) concepita per la gestione, motivazione e formazione dell'agente sul territorio:
*   **Autenticazione Avanzata (Magic Links):** Login senza password, tramite link inviato per email (flusso OTP via Supabase), garantendo accessi fulminei ma estremamente sicuri.
*   **Sessione Privata "Partner / Builder":** L'app riconosce se l'utente è un semplice cliente o un promotore, abilitando solo a quest'ultimo i calcoli provvigionali.
*   **Dashboard Guadagni e Calcolatore Provvigioni:** Il promotore può simulare in base ai parametri stabiliti dal piano compensi Union (Ricorrente, Punti Valore PV, Bonus di Rete, Bonus Start) **quanto incasserà esattamente** qualora chiudesse il contratto nel mese in corso.
*   **Simulatore Costruzione Rete (Network Builder):** Permette ad un promotore (livello Sprinter/Builder/Family Pro) di visualizzare le provvigioni indirette derivanti dall'assunzione teorica di collaboratori nella sua struttura. Un potente strumento di Gamification.
*   **Badge e Riconoscimenti (Gamification KPI):** Calcolo e assegnazione dinamica di badge di status (Es: "Family Pro", "Partner", "Client") sulla base di complessi algoritmi che incrociano Contratti Diretti, Reclute Indirette e Unità Personali.
*   **"HUD" Interattivo:** Un cruscotto visivo in stile aeronautico (Glassmorphism HUD) che monitora il progresso live per lo sblocco dei Bonus Extra (Es. Bonus "3x3").

### 3. 🏢 Sezione "Condo Admin" (Il Business B2B)
Fiore all'occhiello per la penetrazione commerciale nel mercato condominiale/PMI:
*   **Simulatore ROI per Amministratori di Condominio:** Un motore di calcolo distaccato in grado di aggregare multipli POD (Contatori Condominiali).
*   **Proiezioni su Base Biennale/Triennale:** Oltre al puro risparmio mensile, permette all'amministratore di presentare in assemblea il ritorno economico (Cashback del Condominio) generato negli anni.
*   **UI Adattiva B2B:** Design premium differenziato rispetto alla sezione "Famiglia", improntato a sobrietà, autorevolezza ed estrazione dati nudi e crudi.

### 4. 📄 Ingegnerizzazione Distributiva e Architettura
Costruita per eliminare i colli di bottiglia e far lavorare gli agenti sul territorio *anche in condizioni critiche*:
*   **Tecnologia "PWA Enterprise" (Progressive Web App):** L'applicazione è indipendente dagli Store (Google Play / App Store). **Si installa direttamente** sui dispositivi dei promotori (iOS e Android) tramite icona su Home Screen. Nessuna percentuale del 30% trattenuta o giorni di attesa per la validazione di un banale aggiornamento. L'app si aggiorna per tutti i device all'istante alla pubblicazione ricaricando la pagina, a garanzia del 100% dell'affidabilità nei listini prezzi.
*   **Database Cloud Scalabile (Supabase/PostgreSQL):** L'intero storage documentale e l'identità dell'utenza sono architettati su server Postgres Enterprise, la medesima infrastruttura in grado di scalare sino a gestire milioni di record senza flessioni prestazionali (Row-Level Security implementata nativamente per proteggere i calcoli sensibili dei guadagni della rete e per proteggere il simulatore da accessi non autorizzati).
*   **Dark Mode Nativo:** Ottimizzato per lavorare negli uffici, su strada, tramite Tablet per la visibilità in ambienti scuri tutelando il risparmio energetico e l'affaticamento visivo.
*   **Generazione Integrata di Referti PDF (In corso di perfezionamento):** Motore interno predisposto per esportare in un PDF non modificabile la simulazione della proposta, lasciando un asset tangibile e pulito nelle mani dell'utente finale a trattativa terminata.
