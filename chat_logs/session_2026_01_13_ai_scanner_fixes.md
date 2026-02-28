# Session Log: AI Scanner Fixes & Security Updates
**Date:** 2026-01-13
**Objective:** Fix AI Bill Scanner failures, improve data accuracy, and resolve deployment issues.

## Summary of Work
1.  **AI Scanner Repair**:
    *   **PDF Support**: Implemented `convertPdfToImage` in `aiService.ts` to stitch the first 3 pages of PDF bills into a single image. This fixed the issue where the AI missed data located on subsequent pages.
    *   **Timeout Fix**: Increased the AI analysis timeout to 60 seconds and optimized the image scale (1.0) and compression (0.8) to prevent process failures on large files.
    *   **Model Fix**: Pinned the API model to `gemini-2.0-flash` to resolve 404 errors.

2.  **Data Extraction Accuracy**:
    *   **Prompt Engineering**: Rewrote the system prompt to explicitly handle "Oneri Commerciali" (PCV, CCV, QVD) and to normalize data to monthly values.
    *   **Logic Fix**: Strictly forbade the AI from returning mathematical formulas (e.g., "20+20") in the JSON response, enforcing proper numeric output to prevent syntax errors.

3.  **Deployment & Security**:
    *   **Build Fix**: Resolved a Netlify deployment block caused by exposed secrets.
    *   **Cleanup**: Removed `debug-models.mjs` and the `.env` file from the Git repository history.
    *   **Protection**: Updated `.gitignore` to prevent future accidental commits of environment files.

## Key Files Modified
- `utils/aiService.ts`
- `components/AIScannerModal.tsx`
- `.gitignore`

## Next Steps
- Verify the deployed version on Netlify once the build completes.
- Test the scanner with a variety of real-world bills to confirm stability.
