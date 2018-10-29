
const DYNAMIC_CACHE = 'DYNAMIC-81';
const STATIC_CACHE = 'STATIC-1';

// Install is activated by the browser
self.addEventListener('install', (event) => {
  console.log('Installing Service Worker...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Shell cache');
      cache.addAll([
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css',
        'https://code.jquery.com/jquery-3.3.1.slim.min.js',
        'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js',
        'offline-support.html'
      ]);
    })
  );
});

// Activation is activated by the browser
self.addEventListener('activate', (event) => {
  console.log('Activated Service Worker')

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

// Fetch is triggered by our app
self.addEventListener('fetch', (event) => {
  const url = 'http://localhost:3000/books';

  // Books data
  if (event.request.url.indexOf(url) > -1) {
    // Cache then Network
    event.respondWith(
      caches.open(DYNAMIC_CACHE)
        .then(cache => {
          return fetch(event.request)
            .then(response => {
              cache.put(event.request, response.clone())
              return response;
            })
        })
    );

  } else {
    event.respondWith(
      // Cache with Network fallback
      caches.match(event.request)
        .then((response) => {
          if (response) { // return response if it's cached
            console.log('Found ', event.request.url, ' in cache');
            return response;
          } else {
            return fetch(event.request).then((response) => {
              // Most of the fetch are dynamic as we are using Parcel as a tool
              return caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.add(event.request.url, response.clone());
                return response;
              })
            }).catch(error => {
              console.log('Error fetching from Network: ' + event.request + ':', error);

              return caches.open(STATIC_CACHE).then(cache => {
                if (event.request.url.indexOf('/new/new.html') > -1) {
                  return cache.match('offline-support.html')
                }
              })
            })
          }
        }).catch((error) => {
          console.log('Error fetching: ' + event.request + ':', error);
          // to DO offline html
        })
    );
  }

});