import 'babel-polyfill';

import { idbMethods } from './js/features/idb.js';


export const cacheThenNetwork = async (cacheName, event) => {
    const response = await fetch(event.request);
    const data = await response.clone().json();
    
    // Remove old indexDB data
    const clearData = await idbMethods.clear();
    if (event.request.method === 'GET') {
        data.forEach(item => idbMethods.set(item));
    } else {
        idbMethods.set(data)
    }

    return response;
}

export const cacheNetworkFallback = async (staticCache, dynamicCache, event) => {
    const cacheResponse = await caches.match(event.request);

    // return response if it's cached
    if (cacheResponse) {
        console.log(`Found ${event.request.url} in cache`);
        return cacheResponse;
    } else {
        console.log(`${event.request.url} not found in cache. Tying to get it from the network...`);

        try {
            const networkResponse = await fetch(event.request);
            console.log(`${event.request.url} retrieved from the network`)

            const cache = await caches.open(dynamicCache);
            cache.add(event.request.url, networkResponse.clone());
            return networkResponse
        } catch (error) {
            console.log(`Error fetching from Network:  ${event.request.url}: ${error}`);

            const cache = await caches.open(staticCache);
            // We can check all content type here to return specific content
            if (event.request.headers.get('accept').includes('text/html')) {
                return cache.match('offline-support.html')
            }
        }
    }
}

export const trimCache = (cacheName, maxKeys) => {
    caches.open(cacheName)
        .then(cache => cache.keys())
        .then(keys => {
            if (keys.length > maxKeys) {
                cache.delete(keys[0]) // Remove the last one
                trimCache(cacheName, maxKeys);
            }
        })
}