# Session Log: Logo Update and Deployment Fix
**Date:** 2025-12-29
**Objective:** Replace application logo and deploy to Netlify.

## Summary of Changes

1.  **Logo Update:**
    - Replaced `public/logo.jpg` with the new image provided by the user.
    - Updated `index.html` to reference `/logo.jpg` instead of `/logo.png` for the apple-touch-icon.
    - Confirmed `manifest.json` and `service-worker.js` already referenced `/logo.jpg`.

2.  **Build Fixes:**
    - Encountered a build failure due to `jspdf` dependency resolution (`iobuffer` error).
    - Performed a clean install of dependencies.
    - Downgraded `jspdf` to version `2.5.1` to resolve the conflict with Vite/Rollup.
    - Successfully built the project (`npm run build`).

3.  **Deployment:**
    - Deployed the successfully built project to Netlify.
    - **Live URL:** [https://simulatore-sharing.netlify.app/](https://simulatore-sharing.netlify.app/)

## Key Files Modified
- `public/logo.jpg`
- `index.html`
- `package.json` (jspdf version)
- `package-lock.json`

## Verification
- Verified the live site loads.
- Verified the new logo is accessible at the live URL.
