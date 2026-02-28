# Costi e Fattibilità: Pubblicazione su App Store e Google Play Store

**Data:** 24 Febbraio 2026
**Scenario:** L'azienda Union è interessata al "Simulatore Sharing" ma pone come condizione vincolante la pubblicazione dell'app sugli store ufficiali (Apple App Store e Google Play Store).

Di seguito l'analisi dei costi reali, dei tempi e delle sfide tecniche per convertire l'attuale PWA (Progressive Web App) in un'app nativa/ibrida distribuibile sugli store.

---

## 1. I Costi Bui (Account Sviluppatore)
Questi sono i costi diretti da pagare ad Apple e Google solo per avere il diritto di pubblicare.
*   **Google Play Store (Android):** Costo *una tantum* di **25$** (circa 23€). Paghi una volta e l'account è tuo per sempre.
*   **Apple App Store (iOS):** Abbonamento annuale di **99$** (circa 92€/anno). Se smetti di pagare, l'app viene rimossa dallo store.
*   **Note per Union:** Idealmente, questi account dovrebbero essere aperti a nome dell'azienda (Union), non a nome tuo personale, per questioni legali e di responsabilità (Privacy Policy, P.IVA, ecc.). Se li apri tu, ti devi accollare l'onere legale dell'app.

## 2. I Costi Tecnici di Conversione (Il vero "Scoglio")
Attualmente, il Simulatore è una Web App (React/Vite). Per metterla sugli store, **non basta caricarla**. Apple e Google non accettano file HTML/JS diretti, ma richiedono pacchetti nativi (`.apk`/`.aab` per Android, `.ipa` per iOS).

Per "imbustare" la tua Web App in un'app nativa ci sono tre strade, con costi e tempi diversi:

### Strada A: Il "Wrapper" Rapido (Costo Basso, Rischio Rifiuto Alto)
*   **Come funziona:** Si usa un servizio o uno strumento (es. Capacitor, Cordova, o un servizio online come "PWABuilder") che prende il tuo sito e lo "incapsula" in un browser senza bordi (WebView) che diventa un'app installabile.
*   **Costo per te:** Se lo fai tu con PWABuilder (Android) o Capacitor (iOS/Android) ci metti **dai 3 ai 7 giorni** di lavoro. Se paghi uno sviluppatore freelance/servizio online per farti i file pronti per gli store: dai **150€ ai 500€**.
*   **Il Problema (Attenzione Apple):** Google Play di solito accetta i wrapper senza troppe storie. **Apple li odia**. Le linee guida Apple (App Store Review Guidelines) affermano esplicitamente che rifiutano app che sono "solo un sito web pacchettizzato" senza funzionalità native specifiche (come notifiche push non web, uso della fotocamera nativa, bluetooth, ecc.). C'è un **altissimo rischio (80%) che Apple ti bocci l'app**.

### Strada B: Sviluppo Ibrido con React Native / Expo (La Scelta Professionale Standard)
*   **Come funziona:** Devi riscrivere parte del codice dell'interfaccia (trasformare i normali `<div>` e `<p>` in componenti React Native come `<View>` e `<Text>`) o usare Expo per creare una vera app nativa che compila sia per iOS che per Android.
*   **Tempo per te:** Questa non è una conversione automatica. È un vero e proprio "porting". Potresti doverci dedicare **da 1 a 2 mesi** di lavoro intenso per rifare le schermate e testarle sui dispositivi fisici.
*   **Costo (se lo appalti):** Se paghi uno sviluppatore per farti il porting da React a React Native/Expo, il costo va dai **3.000€ ai 7.000€**.
*   **Il Problema Aggiuntivo (Mac obbligatorio):** Per compilare e pubblicare un'app per iOS **devi obbligatoriamente possedere un Mac** (o pagare l'affitto di un Mac in cloud, es. MacStadium, a ~30€/mese). Non puoi compilare per iPhone da Windows.

### Strada C: Distribuzione B2B Equivalente (La Controproposta)
*   Gli store pubblici sono pensati per app "Consumer" (scaricabili da chiunque). Un simulatore di contratti aziendali con login protetto spingerà Apple a farti domande: *"Perché un utente normale dovrebbe scaricarla se non ha un account Union?"*. Apple spesso richiede che l'app sia spostata sull'**Apple Business Manager** (distribuzione per aziende private, non c'è nello store pubblico).

---

## Come Rispondere all'Azienda (La Strategia)

Se Union pone la pubblicazione sugli store come "condizione vincolante", la tua strategia deve essere quella di **traslare il costo economico e temporale su di loro**.

Ecco come dovresti rispondere:

> *"Certamente, la pubblicazione sugli App Store è una mossa molto valida dal punto di vista dell'immagine aziendale.*
> *Tuttavia, dovete considerare che l'architettura attuale è sviluppata come **PWA (Progressive Web App) Enterprise** di altissimo livello. Il vantaggio della PWA è che si installa già oggi su iPhone e Android istantaneamente, saltando i 30% di commissioni eventuali degli store o i lunghi processi di approvazione di Apple.*
>
> *Se il requisito è comparire ufficialmente su iOS e Android:*
> 1.  *L'azienda dovrà aprire a suo nome (e a sue spese, 99$/anno Apple, 25$ Google) gli account sviluppatore aziendali, per questioni di Policy e Privacy.*
> 2.  *Il porting del codice da Web App a codice Nativo (React Native/Expo) per passare la rigida validazione di Apple richiederà circa **4-6 settimane di sviluppo extra**, più i tempi tecnici di approvazione di Apple (da 2 a 15 giorni).*
> 3.  *Questo comporterebbe un **costo di "Ingegnerizzazione per Store" aggiuntivo al preventivo di [Inserisci Cifra: es. 4.000€ - 5.000€]**, oltre al costo della licenza software.*
>
> *Se volete lo facciamo senza problemi, ma sappiate che la PWA attuale offre la stessa esperienza utente, zero costi di distribuzione e aggiornamenti in tempo reale senza aspettare che Google o Apple approvino le nuove versioni."*

### Sintesi Spese per Te
Se accetti di farlo "gratuitamente" per chiudere il contratto a 15k/anno, ti costerà:
*   Account: ~115€ (se li accoli tu).
*   Mac: Devi avere/comprare un Mac o affittare spazio cloud per compilare iOS.
*   Tempo: Settimane di lavoro per il porting (se Apple rifiuta il semplice wrapper).
*   Stress: Preparati a combattere con le assurde Review Guideline di Apple.
