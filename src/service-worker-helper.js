export const cacheThenNetwork = (cacheName, event) => {
    return caches.open(cacheName).then(cache => {
        return fetch(event.request).then(response => {
            cache.put(event.request, response.clone())
            return response;
        })
    })
}

export const cacheNetworkFallback = (staticCache, dynamicCache, event) => {
    return caches.match(event.request).then((response) => {
        if (response) { // return response if it's cached
            console.log(`Found ${event.request.url} in cache`);
            return response;
        } else {
            console.log(`${event.request.url} not found in cache. Tying to get it from the network...`);
            return fetch(event.request).then((response) => {
                console.log(`${event.request.url} retrieved from the network`)
                // Most of the fetch are dynamic as we are using Parcel as a tool
                return caches.open(dynamicCache).then((cache) => {
                    cache.add(event.request.url, response.clone());
                    return response;
                })
            }).catch(error => {
                console.log(`Error fetching from Network:  ${event.request}: ${error}`);

                return caches.open(staticCache).then(cache => {
                    // We can check all content type here to return specific content
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return cache.match('offline-support.html')
                    }
                })
            })
        }
    }).catch((error) => {
        console.log(`Error fetching: ${event.request}: ${error}`);
    })
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