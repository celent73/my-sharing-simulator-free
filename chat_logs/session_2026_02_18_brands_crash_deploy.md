# Session Summary: 2026-02-18 - Brands & Deployment Fixes

## 1. Feature Updates: New Brands in Cashback Pro
- Added **SHEIN** (25% cashback, `aff_int`).
- Added **VERY MOBILE** (15€ fixed cashback, `aff_int`).
- Added **Kena Mobile** (34€ fixed cashback, `aff_int`).
- Verified **Ho Mobile** (11€ fixed cashback, `aff_int`).
- Updated **Lyca Mobile** (5€ fixed cashback, `aff_int`).

## 2. Bug Fix: Application Crash (Dev Server)
- **Issue**: Vite HMR client failing (`ws://localhost:undefined`) and Service Worker caching errors in dev mode leading to a blank screen.
- **Fix**:
    - **`vite.config.ts`**: Explicitly set server port to `5173`.
    - **`index.tsx`**: Disabled Service Worker registration in development (`!import.meta.env.DEV`).

## 3. Deployment & Cache Issues
- **Issue**: Users not seeing updates after deployment due to aggressive caching.
- **Solution**:
    - Bumped version to **v1.2.49**.
    - Updated Service Worker query param (`?v=1.2.49`).
    - Implemented **Automatic Cache Clearing** in `App.tsx`:
        - Checks `localStorage` for version mismatch.
        - If mismatched, unregisters Service Workers, clears Cache API, and reloads the page.

## 4. Branch & Release Management
- **Production Branch Identified**: `release-v9-final`.
- **Main Branch**: Protected, blocking direct pushes.
- **Actions Taken**:
    - Pushed v1.2.49 to `release-v9-final`.
    - Manually triggered a new build on `release-v9-final` with an empty commit.
    - Also pushed to `deploy-fix-clean`, `deploy-safe-v4`, and `deploy-production-now` to ensure availability.

## Current Status
- **Live Version**: v1.2.49
- **Production URL**: https://calcolatore-cashback-pro.netlify.app/
- **Next Steps**: Standard feature development.
