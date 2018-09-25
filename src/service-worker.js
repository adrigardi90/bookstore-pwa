
const DYNAMIC_CACHE = 'DYNAMIC-13';
const STATIC_CACHE = 'STATIC';

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
        'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js'
      ]);
    })
  );
});

// Activation is activated by the browser
self.addEventListener('activate', (event) => {
  console.log('Activated Service Worker')

  // Remove the old cache if there is a new code version
  event.waitUntil(
      caches.keys().then( (keys) => {
          keys.forEach( (key, index, array) => {
            if(key !== DYNAMIC_CACHE && key !== STATIC_CACHE){
                caches.delete(key);
            }
          })
      })
  );
});

// Fetch is triggered by our app
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        } else {
            //return fetch(event.request);
          return fetch(event.request).then((response) => {
            // Most of the fetch are dynamic as we are using Parcel for bundle tool
            return caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.add(event.request.url, response.clone());
              return response;
            })
          })
        }
      }).catch( (error) => {
          console.log('Error fetching: '+ event.request + ':', error);
      })
  );
});