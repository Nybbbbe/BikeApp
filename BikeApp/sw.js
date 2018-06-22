var dataCacheName = 'bikeData-v1';
var cacheName = 'bike-final-1';
var filesToCache = [
  '/',
  '/index.html',
  '/index.js',
  '/main.css',
  'Images/pin-yellow.png',
  'Images/pin-red.png',
  'Images/pin-green.png',
  'Images/location-icon.png',
  'Images/my-location.png',
  'Images/bike-128x128.png',
  'Images/bike-144x144.png',
  'Images/bike-152x152.png',
  'Images/bike-192x192.png',
  'Images/bike-256x256.png',
];

self.addEventListener('install', function(e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== cacheName && key !== dataCacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  console.log('[Service Worker] Fetch', e.request.url);
    e.respondWith(
      caches.match(e.request).then(function(response) {
        return response || fetch(e.request);
      })
    );
});