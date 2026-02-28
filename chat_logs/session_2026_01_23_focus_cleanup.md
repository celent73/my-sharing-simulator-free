# Session Log: 2026-01-23 - FOCUS Fix & Version Update

## Summary of Changes
1.  **FOCUS Button on Mobile**:
    -   Modified `ResultsDisplay.tsx` to hide the "FOCUS" button on screen sizes smaller than `sm` (mobile).
    -   This prevents layout breakage on small screens where the full-screen table view is not optimized.

2.  **Version Update**:
    -   Updated version string to `v1.1.13`.
    -   Files updated:
        -   `App.tsx` (Fixed header/overlay indicator)
        -   `LegalFooter.tsx` (Footer copyright section)

3.  **UI Cleanup (Totals Row)**:
    -   Removed redundant "singolo mese: ..." text from the footer row of the results table in `ResultsDisplay.tsx`.
    -   The displays are now cleaner and avoid repetition.

## Deployment
-   Ran `npm run build` successfully.
-   Deployed to Netlify (`prod`).

## Next Steps
-   Resume session in the afternoon.
