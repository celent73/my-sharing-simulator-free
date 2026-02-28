# Session Log: APK Conversion Inquiry
**Date:** 2026-01-05

## Overview
The user inquired about the difficulty of converting the current PWA (React + Vite) into an Android APK.

## Discussion Points

### 1. Feasibility & Complexity
-   **Technical Difficulty:** Low/Medium.
-   **Tool:** Recommended **Capacitor** as the standard bridge for React apps.
-   **Process:** Install Capacitor -> Add Android Platform -> Build Native Project -> Generate APK via Android Studio.

### 2. Payment/Store Policy (Google Play)
-   **Clarification:** User asked about handling payments.
-   **Google Policy:**
    -   **Digital Goods (Games/Premium Features):** Must use Google Play Billing (15-30% fee).
    -   **Real World Goods/Services (Utilities, Physical Goods):** **MUST** use external payment methods (0% fee to Google).
-   **Conclusion for Project:** Since the app sells "Utility Contracts" and "Business Kits", it falls under the "Real World Goods" category. The current external links to `unionenergia.it` are compliant and widely preferred.

### 3. Decision
-   User decided to **stick with the PWA** approach for now.
-   **Reasons:** Instant updates, no store approval times, cross-platform compatibility without extra maintenance.

## Status
-   Project remains a PWA.
-   No code changes were made in this session.
-   Session closed to move to another app.
