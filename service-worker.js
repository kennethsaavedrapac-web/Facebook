// Service Worker para Facebook PWA
const CACHE_NAME = 'facebook-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/fb2018/css/main.css',
  '/fb2018/css/feed.css',
  '/fb2018/css/profile.css',
  '/fb2018/css/messenger.css',
  '/fb2018/css/notifications.css',
  '/fb2018/js/main.js',
  '/fb2018/js/feed.js',
  '/fb2018/js/profile.js',
  '/fb2018/js/messenger.js',
  '/fb2018/js/notifications.js',
  '/fb2018/js/router.js',
  '/fb2018/js/data.js'
];

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cacheando archivos');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Error al cachear:', err))
  );
  self.skipWaiting();
});

// Activar service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activado');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Borrando caché antigua:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Solo cachear peticiones GET
  if (request.method !== 'GET') {
    return;
  }

  // No cachear peticiones a dominios externos (excepto Google Fonts)
  const url = new URL(request.url);
  if (url.origin !== location.origin && !url.origin.includes('googleapis.com') && !url.origin.includes('gstatic.com')) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((response) => {
        // Si está en caché, devolverlo
        if (response) {
          return response;
        }

        // Si no está en caché, intentar traerlo de internet
        return fetch(request)
          .then((response) => {
            // No cachear respuestas no válidas
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clonar la respuesta para poder usarla
            const responseToCache = response.clone();

            // Cachear dinámicamente
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Si falla la petición, intentar devolver una página offline
            console.log('Offline - no se pudo cargar:', request.url);
            // Podrías devolver una página offline aquí
          });
      })
  );
});

// Mensaje de actualización
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
