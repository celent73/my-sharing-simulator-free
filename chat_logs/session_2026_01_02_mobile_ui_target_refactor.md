# Session Update: 2026-01-02

## Summary of Changes

### 1. Mobile UI Refinements (`AnalisiUtenzeModal.tsx`)
- **Spacing Adjustment:** Increased top padding in the content area for mobile devices to prevent overlap with the header.
- **Header/Footer Optimization:** Reduced padding and height of the header and footer (and the close button) on mobile to maximize visible screen real estate.

### 2. Label Update (`utils/translations.ts`)
- **Condo Admin Section:** Changed the text label `% Adesione al Network` to `Passaggi a Union Energia` in the Italian translation.

### 3. Target Calculator Refactor (`TargetCalculatorModal.tsx`)
- **Modes:** Replaced "Conservative/Balanced/Aggressive" speed modes with **"Basic / Part Time"** and **"Pro / Full Time"**.
- **UI Update:** Updated the mode selector to use new specific buttons with icons and colors.
- **Logic Update:** Implemented a new time estimation logic based on a specific lookup table + linear interpolation:
    - **Basic:** 500€ (12m), 1000€ (24m), 2500€ (36m), 5000€ (48m), 10000€ (60m), 50000€ (78m).
    - **Pro:** 500€ (6m), 1000€ (12m), 2500€ (18m), 5000€ (30m), 10000€ (42m), 50000€ (60m).

## Deploy Status
- **Build:** Successful (`npm run build`).
- **Deploy:** Deployed to Netlify (`netlify deploy --prod`).
