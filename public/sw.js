// Versione cache: incrementare ad ogni deploy importante per forzare la pulizia
// della cache vecchia sui dispositivi che hanno già installato la PWA.
const CACHE_NAME = '13th-tracker-v2';
const ASSETS = [
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isHtmlOrRoot = event.request.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html');

  if(isHtmlOrRoot){
    // NETWORK-FIRST per l'HTML: prova sempre a scaricare l'ultima versione dal server.
    // Usa la cache SOLO se la rete non risponde (es. offline), mai come scelta preferita.
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if(response && response.status === 200){
            const respClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // CACHE-FIRST per asset statici (icone, manifest): cambiano raramente, ok servirli da cache.
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((response) => {
        if (event.request.method === 'GET' && response.status === 200) {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, respClone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
