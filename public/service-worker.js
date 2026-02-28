const CACHE_NAME = 'union-sim-v1.2.48-FORCE-REFRESH';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo_new.png',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.log('Non sono riuscito a salvare: ' + url);
            });
          })
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se la risposta è valida, la restituiamo e aggiorniamo la cache
        if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          try {
            cache.put(event.request, responseToCache);
          } catch (err) { }
        });

        return networkResponse;
      })
      .catch(() => {
        // Se siamo offline o la rete fallisce, usiamo la cache
        return caches.match(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});