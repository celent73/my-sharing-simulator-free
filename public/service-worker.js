const CACHE_NAME = 'union-sim-v1.3.27-FORCE-REFRESH';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo_v2_main.png',
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

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 1; i < clientList.length; i++) {
          if (clientList[i].focused) client = clientList[i];
        }
        return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Ignora richieste non-http (es. WebSockets ws:// o chrome-extension://) che causano errori nel fetch()
  if (!event.request.url.startsWith('http')) return;
  
  // Se siamo in localhost (Sviluppo), saltiamo la cache e andiamo diretti al server per evitare conflitti con Vite
  if (event.request.url.includes('localhost')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Se la risposta è valida, la restituiamo e aggiorniamo la cache
        if (!networkResponse || networkResponse.status !== 200 || (networkResponse.type !== 'basic' && networkResponse.type !== 'cors')) {
          return networkResponse;
        }

        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (event.request.method === 'GET') {
            try {
              cache.put(event.request, responseToCache).catch(() => { });
            } catch (err) { }
          }
        });

        return networkResponse;
      })
      .catch(() => {
        // Se siamo offline o la rete fallisce, usiamo la cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          // Se non è neanche in cache e siamo offline, restituiamo un errore gestito invece di undefined
          return new Response('Offline: Risorsa non trovata', {
            status: 404,
            statusText: 'Offline',
            headers: { 'Content-Type': 'text/plain' }
          });
        });
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