# Gestione Obiezione Store: "Abbiamo già gli account Apple e Google per My Union App"

**Data:** 24 Febbraio 2026
**Contesto:** Union chiede la pubblicazione sugli Store (Apple/Google). Alla tua obiezione sui costi e sulle policy, rispondono: *"Gli account li abbiamo già, siamo già iscritti perché abbiamo la nostra 'My Union App'"*.

Questa in realtà è un'**OTTIMA NOTIZIA** per te. Ti toglie il problema burocratico e i costi di iscrizione, ma ti lascia immutata la tua **vera leva negoziale: il tempo e il costo tecnico della conversione**.

Ecco come devi gestire questa precisa obiezione nella trattativa.

---

## 1. La tua reazione: "Perfetto, questo accelera la burocrazia, ma non la tecnica"

Il fatto che abbiano gli account pronti è un vantaggio, ma l'app che hai sviluppato tu è scritta in codice Web (React/Vite). Non importa se hanno l'account pronto per ricevere il pacchetto: **tu non hai un pacchetto nativo da dargli, e per crearlo serve lavoro extra**.

Devi separare nettamente le due cose agli occhi del management:
*   **Problema Amministrativo (Risolto da loro):** Account e certificati ci sono. Ottimo.
*   **Problema Ingegneristico (Il TUO costo):** L'app va convertita dal linguaggio Web al linguaggio Nativo/Ibrido per poter essere accettata da Apple.

## 2. La Risposta Esatta da dare a Union

Se ti dicono "Gli account li abbiamo già", rispondi esattamente così:

> *"Ottima notizia. Questo ci toglie di torno tutta la burocrazia infinita con Apple e Google per la verifica dell'azienda e ci fa risparmiare settimane sulle scartoffie.*
>
> *Rimane però il lato tecnico dell'ingegnerizzazione. Il Simulatore, per abbattere i costi e permettere aggiornamenti istantanei senza dover aspettare le approvazioni degli Store a ogni modifica dei prezzi, è stato sviluppato in tecnologia **PWA Enterprise**. Questo è lo standard che usano oggi aziende come Starbucks o Twitter per le loro web-app.*
>
> *Per prendere il mio codice e compilarlo in un file `.ipa` per l'App Store e `.aab` per Google Play, superando le rigidissime regole di Apple contro i 'siti web imbustati', mi serve fare un **porting del codice dell'interfaccia verso framework ibridi come React Native o Capacitor**.*
>
> *Non è un copia-incolla, è una conversione.** 

## 3. L'Affondo Commerciale (Le due vie)

A questo punto, avendo chiarito che il problema non erano gli account ma il "Porting", gli dai due alternative mettendo loro in mano la scelta (così non sembri tu quello che dice "no").

### Via A: Lancio Immediato (Senza Store)
> *"La mia proposta per massimizzare il ROI (Ritorno sull'Investimento) immediato della rete è **partire subito con la PWA**. A 15.000€ all'anno avete lo strumento domattina. I 600 agenti cliccano un link, salvano l'icona in home screen, e l'app funziona esattamente come un'app nativa. I calcoli sono in locale, la fluidità è totale. Così iniziamo subito a testare l'impatto sulle chiusure dei contratti."*

### Via B: Lancio Nativo (Con gli Store, pagando il tuo Porting)
> *"Se invece la delibera aziendale impone categoricamente di passare dagli Store per affiancare il Simulatore alla vostra 'My Union App', nessun problema. L'ingegnerizzazione e il testing del porting, inclusa la gestione del dialogo protetto con i vostri account Apple, richiederà circa **4-5 settimane di sviluppo esclusivo**. Questo richiederà di scorporare i costi: al canone annuo della licenza (15.000€) dovremo aggiungere una *fee una tantum* per lo **Sviluppo Porting Store di [Inserire cifra che vuoi: es. 3.500€ - 5.000€]**."*

---

## Il "Takeaway" Mentale per Te

*   **Non ti hanno "fregato" dicendo che hanno già l'account.** Hanno solo semplificato la parte legale.
*   **Non farti carico del porting gratis.** Non dire "ah ok allora lo carico io", perché se Apple te lo rifiuta (molto probabile se usi un wrapper base) finisci a dover lavorare un mese gratis sotto pressione per riscrivere il frontend in React Native.
*   **Usa la scusa di Apple.** Apple è notoria per le sue regole folli. Usa questa fama a tuo vantaggio: *"Apple è molto fiscale, devo adeguare il codice, ha un costo."*
*   Se vogliono la via B, sappi che dovrai usare strumenti come **Capacitor** o **Expo** e testare su dispositivi reali (e ti serve un Mac per IOS). Assicurati che il preventivo extra per il Porting valga il tuo stress. Se ti offrono 5.000€ extra solo per farle fare il salto sullo store, potresti anche pensarci. Se te lo chiedono gratis: Via A tutta la vita.
