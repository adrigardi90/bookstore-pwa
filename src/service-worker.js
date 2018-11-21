import { cacheThenNetwork, cacheNetworkFallback } from './service-worker-helper';
import { SYNC_BOOK, IDB_TABLE_SYNC } from './js/constants';
import { idbMethods } from './js/features/idb';
import { BookService } from './services/services';
import { options } from'./js/features/notifications';

const DYNAMIC_CACHE = 'DYNAMIC-153';
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
      // IndexDB cache
      cacheThenNetwork(DYNAMIC_CACHE, event)
    );
  } else {
    event.respondWith(
      // Dynamic cache with Network fallback 
      cacheNetworkFallback(STATIC_CACHE, DYNAMIC_CACHE, event)
    );
  }
});


// Background sync
self.addEventListener('sync', (event) => {
  console.log('[SYNC Service Worker] Background sync', event)

  if (event.tag === SYNC_BOOK) {
    console.log('[SYNC Service Worker] Syncing new book with tag ', SYNC_BOOK)
    event.waitUntil(
      idbMethods.getAllData(IDB_TABLE_SYNC).then((data) => {
        data.forEach(book => {
          console.log('[SYNC Service Worker] Sync book ', data)
          new BookService().createBook(book).then((res) => {
            console.log(`[SYNC Service Worker] Sync Book ${book.title} created `);
            idbMethods.delete(res.title, IDB_TABLE_SYNC).then(res => {
              console.log(`[SYNC Service Worker] Sync Book ${book.title} deleted from IDB `)
            })
          })
        })
      })
    )
  }
});


// Push notification from the server
self.addEventListener('push', (event) => {
  console.log(`[PUSH Service Worker] Notification received: ${event}`)
  const data = JSON.parse(event.data.text());
  const opt = {...options,
    body: ' NEW BOOK ADDED',
    data: {
      redirectTo: data.redirectTo,
    }
  }

  event.waitUntil(self.registration.showNotification(data.title, opt))
})


// Notification
self.addEventListener('notificationclick', (event) => {
  const action = event.action;
  const notification = event.notification;
  console.log(`[Notification] Notification with action: ${action}`)

  event.waitUntil(
    clients.matchAll().then(cl => {
      let clientOpen = cl.find(c => c.visibilityState === 'visible');

      if (clientOpen) {
        clientOpen.navigate(notification.data.redirectTo)
        clientOpen.focus()
      } else {
        clientOpen.openWindow(notification.data.redirectTo)
      }
      notification.close();
    })
  )
})

self.addEventListener('notificationclose', (e) => {
  console.log('[Notification] Notification close')
})