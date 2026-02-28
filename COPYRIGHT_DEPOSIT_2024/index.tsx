
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Fixed to default import

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// PWA Service Worker Registration with Cache Busting
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Unregister old workers first to be safe
    navigator.serviceWorker.getRegistrations().then(registrations => {
      for (let registration of registrations) {
        // Optional: unregister only if scope or other criteria match, but for now clean slate is safer
        registration.unregister();
      }

      // Register new one with version query param
      navigator.serviceWorker.register('/service-worker.js?v=1.1.0')
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);

          // Check for updates
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;
            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New content is available and will be used when all tabs for this page are closed.');
                  // Force reload could be done here but might be intrusive, let's rely on the fresh registration
                } else {
                  console.log('Content is cached for offline use.');
                }
              }
            };
          };
        })
        .catch((err) => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  });
}
