# Session Log: Condo PDF Update & Deployment
**Date:** 2026-02-18
**Version:** v1.2.47

## Summary
Updated the Condo Business Plan PDF report to include new financial fields ("Spread Luce", "Spread Gas", "Oneri Di Commercializzazione") and deployed the changes.

## Key Changes

### 1. PDF Report Enhancements (`components/CondoResultsDisplay.tsx`, `components/CondoPDFTemplate.tsx`)
-   **New Fields**: Added inputs for:
    -   Spread Luce
    -   Spread Gas
    -   Oneri Di Commercializzazione
-   **Customization Modal**: Updated the "Personalizza" modal to include these three new fields.
-   **Template Update**: Modified the PDF template to display these values in a new "Offer Parameters" section if they are provided.

### 2. Deployment (v1.2.47)
-   **Version Bump**: Updated `package.json`, `App.tsx`, `LegalFooter.tsx`, and `NetworkVisualizerModal.tsx` to `v1.2.47`.
-   **Build**: Successfully built the production bundle.
-   **Push**: Pushed to `release-v1.2.47`, `release-v10-auth-fix`, `release-safe-v9`, and `release-v9-final` to ensure the correct production branch is updated.

## Status
-   **Current Version**: v1.2.47
-   **Deployment Branches**: `release-v1.2.47`, `release-v10-auth-fix`, `release-safe-v9`, `release-v9-final`

