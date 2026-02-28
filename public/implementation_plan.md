# Remove Payment and Premium Features

L'obiettivo è rimuovere ogni forma di pagamento (Stripe, controlli su abbonamento mensile/a vita) e sbloccare tutte le funzionalità per tutti gli utenti, rendendo di fatto l'app completamente gratuita e "Premium" di default.

## Proposed Changes

### Configuration & Utilities
#### [MODIFY] [featuresData.ts](file:///c:/Users/celen/OneDrive/Desktop/My%20Sharing%20Simulator/utils/featuresData.ts)
- Elimineremo interamente l'oggetto con `id: 'premium-features'` dall'array `FEATURES` per rimuovere la card che pubblicizza l'acquisto della licenza Premium.

---

### Core App Logic
#### [MODIFY] [App.tsx](file:///c:/Users/celen/OneDrive/Desktop/My%20Sharing%20Simulator/App.tsx)
- Rimuoveremo lo stato `isTrialExpired` e relativi controlli.
- Rimuoveremo il blocco delle funzioni Supabase `verifyLicenseStatus` e la logica di controllo licenze.
- Modificheremo `const [isPremium, setIsPremium] = useState(false)` in modo che sia sempre `true` oppure rimuoveremo completamente lo stato `isPremium`, sostituendolo con costanti `true` dove necessario per mantenere l'UI di "sblocco" senza i blocchi reali.
- Nella funzione `handleInputChange`, rimuoveremo i blocchi `if (!isPremium) { ... openModal('PREMIUM_UNLOCK') }` che impediscono di impostare `directRecruits > 2`, `indirectRecruits > 2`, `networkDepth > 2`, `contractsPerUser > 1` e `cashbackSpending > 500`.

#### [MODIFY] [ModalManager.tsx](file:///c:/Users/celen/OneDrive/Desktop/My%20Sharing%20Simulator/components/ModalManager.tsx)
- Rimuoveremo il rendering di `PremiumModal` e `PaymentSuccessModal` per pulire il codice non più necessario.

---

### Components (To Be Cleaned or Deleted)
#### [MODIFY] [PremiumModal.tsx](file:///c:/Users/celen/OneDrive/Desktop/My%20Sharing%20Simulator/components/PremiumModal.tsx)
- Anche se non verrebbe più aperta, la svuotiamo o la ritorniamo come `null` per assicurarci che non contenga più link Stripe nel codice, oppure eliminiamo direttamente il file se preferito (optiamo per svuotarla e ritornare `null` per evitare errori di import qualora sfuggisse qualcosa).

#### [MODIFY] [TrialExpiredModal.tsx](file:///c:/Users/celen/OneDrive/Desktop/My%20Sharing%20Simulator/components/TrialExpiredModal.tsx)
- Ritorneremo `null` da questo componente. Disabiliteremo così qualsiasi UI residua relativa al periodo di prova.

## Verification Plan

### Manual Verification
1. Aprire l'applicazione nel simulatore/browser locale avviando `npm run dev`.
2. Verificare che al click continuo sul titolo (che prima apriva il popup Premium) non succeda nulla.
3. Spostare i cursori dei Reclutati Diretti, Indiretti, Profondità Rete oltre i limiti (es. Reclutati Diretti a 5) e verificare che non compaia alcun popup di blocco e che il valore si aggiorni.
4. Verificare che non ci sia più il pulsante o la card "Premium Features" nel modale "Guida" o tra le features configurabili.
5. Verificare che la console non mostri errori di importazione mancanti.
