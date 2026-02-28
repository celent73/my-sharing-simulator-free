# Session Log - January 12, 2026 (Evening)

## Objective: AI Bill/Receipt Data Extraction

Implemented the ability to scan utility bill summaries (front page) using Google Gemini AI to automatically populate technical data and bill totals.

### Changes Made:

1.  **Dependency Added**: Installed `@google/generative-ai`.
2.  **AI Utility (`utils/aiService.ts`)**:
    *   Setup Gemini 1.5 Flash model interaction.
    *   Designed prompt to extract specific utility fields: Consumption, PUN, PSV, and Fixed Costs from an image.
3.  **Utility Analysis (`AnalisiUtenzeModal.tsx`)**:
    *   Added `file` input with `capture="environment"` (opens camera on mobile).
    *   Added Camera button in the header.
    *   Handles AI extraction to auto-fill PUN, PSV, Consumption (kWh/Smc), and Fixed costs.
4.  **Cashback Modal / Bill Eraser (`CashbackDetailedModal.tsx`)**:
    *   Added scanner button to the Bill Eraser section.
    *   Automatically calculates and sets the "Target Bill" based on extracted technical data.

### Important Note:
*   Requires `VITE_GEMINI_API_KEY` in `.env.local`.
*   **DEPLOY SKIPPED** per user request.

### Files Created/Modified:
*   `utils/aiService.ts` [NEW]
*   `components/AnalisiUtenzeModal.tsx`
*   `components/CashbackDetailedModal.tsx`
*   `package.json` (added `@google/generative-ai`)
