self.addEventListener('fetch', function(event) {
   console.log(event)
   event.respondWith(fetch(event.request));
  });

  self.addEventListener('install', function (event) {
    console.log('Installing Service Worker')
  });

  self.addEventListener('activate', function (event) {
    console.log('Activated Service Worker')
  });