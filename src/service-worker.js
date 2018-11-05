import { cacheThenNetwork, cacheNetworkFallback } from './service-worker-helper';

const DYNAMIC_CACHE = 'DYNAMIC-94';
const STATIC_CACHE = 'STATIC-1';
const STATIC_FILES = [
  'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
  'https://code.jquery.com/jquery-3.3.1.slim.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js',
  'offline-support.html'
];

// Install is activated by the browser
self.addEventListener('install', (event) => {
  console.log('[Service worker] Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Shell cache');
      cache.addAll(STATIC_FILES);
    })
  );
});

// Activation is activated by the browser
self.addEventListener('activate', (event) => {
  console.log('[Service worker] Activated Service Worker')

  // Remove the old cache if there is a new code version
  event.waitUntil(
    caches.keys().then((keys) => {
      keys.forEach((key, index, array) => {
        if (key !== DYNAMIC_CACHE && key !== STATIC_CACHE) {
          caches.delete(key);
        }
      })
    })
  );
});

// Fetch data
self.addEventListener('fetch', (event) => {
  const url = 'http://localhost:3000/books';

  // Books data
  if (event.request.url.indexOf(url) > -1) {
    event.respondWith(
      cacheThenNetwork(DYNAMIC_CACHE, event) // Cache then Network
    ); 
  } else {
    event.respondWith(
      cacheNetworkFallback(STATIC_CACHE, DYNAMIC_CACHE, event) // Cache with Network fallback 
    ); 
  }

});