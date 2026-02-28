# Session Log: Condo Admin Earnings & Version 1.2.20 Update
**Date**: 2026-01-30
**Version**: 1.2.20

## Summary of Changes

### 1. Condo Administrator Recurring Earnings
- **Target**: "Vista Partner Sharing" (Condo Admin View)
- **Logic**:
  - One-Time Bonus (Una Tantum): Fixed at **€30** per user.
  - Recurring Bonus (Rendita): Fixed at **€2** per month (flat for 3 years, no growth multipliers).
  - Included a granular breakdown of these earnings in the results display.
- **UI Updates**:
  - Modified `CondoInputPanel.tsx` to display real-time calculations directly in the "Network Est Result" card (Card Wow).
  - Specific breakdown added: One-Time, Monthly Recurring, Annual Recurring, 3-Year Total.
  - Added **+ / -** buttons to the "Passaggi di utenza" slider for precise adjustment.

### 2. Results Display Enhancements
- Updated `CondoResultsDisplay.tsx` to clarify "Totale extra" (Network Earnings).
- Explicitly split the "Extra" amount into:
  - **Una Tantum** component.
  - **Rendita** component.
- This ensures transparency on how the total is derived.

### 3. Version Update
- Bumping version to **v1.2.20**.
- Updated in:
  - `package.json`
  - `App.tsx` (Debug indicator)
  - `LegalFooter.tsx` (User visible footer)

## Deployment
- Executed `npm run build`
- Executed `netlify deploy --prod`

## Next Steps
- Monitor user feedback on the new breakdown clarity.

### 4. Bug Fix (Regression)
- **Issue**: Accidental deletion of Year 3 calculation logic in `useCondoSimulation.ts` caused a crash/white screen.
- **Fix**: Restored the missing code block for Year 3 calculations, ensuring all variables are correctly defined.

### 5. UI Refinement
- **Enhancement**: Improved contrast for Year 3 Network Earnings box.
- **Change**: Switched background from light purple (`bg-purple-50`) to dark slate (`bg-slate-900`) with high-contrast white/purple text.
- **Status**: Live in production.

### 6. Version Update
- **Action**: Updated application version to **v1.1.21** as requested.
- **Locations**: Updated in `package.json`, `LegalFooter.tsx` (bottom), and `index.html` title (top).
- **Status**: Deployed to production.
