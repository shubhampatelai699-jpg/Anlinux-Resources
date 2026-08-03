/* =====================================================
   Indian One Anime — Service Worker (sw.js)
   Cache-first for static assets, network-first for HTML
   ===================================================== */

var CACHE_NAME = 'ioa-v2';

var STATIC_ASSETS = [
  '/index.html',
  '/anime.html',
  '/anime-detail.html',
  '/watch.html',
  '/new-releases.html',
  '/dubkami.html',
  '/contact.html',
  '/404.html',
  '/search.html',
  '/schedule.html',
  '/genres.html',
  '/watchlist.html',
  '/style.css',
  '/app.js',
  '/manifest.json'
];

// Install: pre-cache static assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(STATIC_ASSETS).catch(function () {
        // Individual fetch failures should not block install
      });
    })
  );
  self.skipWaiting();
});

// Activate: remove old caches
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function (name) { return name !== CACHE_NAME; })
          .map(function (name) { return caches.delete(name); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first for CSS/JS, network-first for HTML
self.addEventListener('fetch', function (event) {
  if (event.request.method !== 'GET') return;

  var url = new URL(event.request.url);

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return;

  var isHTML = event.request.destination === 'document' ||
               url.pathname.endsWith('.html') ||
               url.pathname === '/';

  if (isHTML) {
    // Network-first for HTML pages (fresh content)
    event.respondWith(
      fetch(event.request).then(function (response) {
        if (response.ok) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      }).catch(function () {
        return caches.match(event.request).then(function (cached) {
          return cached || caches.match('/index.html');
        });
      })
    );
  } else {
    // Cache-first for static assets (CSS, JS, fonts)
    event.respondWith(
      caches.match(event.request).then(function (cached) {
        if (cached) return cached;
        return fetch(event.request).then(function (response) {
          if (response.ok) {
            var clone = response.clone();
            caches.open(CACHE_NAME).then(function (cache) {
              cache.put(event.request, clone);
            });
          }
          return response;
        });
      })
    );
  }
});
