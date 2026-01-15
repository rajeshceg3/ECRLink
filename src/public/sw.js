const CACHE_NAME = 'ecrlink-v1';

// Strategy:
// 1. HTML (Navigations): Network First (freshness), Fallback to Cache.
// 2. Assets (JS/CSS/Images): Stale-While-Revalidate (speed + freshness).

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  const isSameOrigin = url.origin === self.location.origin;

  // Skip cross-origin requests unless they are from trusted CDNs (like Unsplash/Mixkit) that support CORS
  // For safety, we only cache same-origin assets + specific trusted domains if needed.
  // Given strict CSP, we know the domains. But to avoid Opaque Response issues, let's stick to Same Origin
  // OR verify the response type.
  // For this "Production Ready" goal, we want robustness. Caching bad opaque responses is bad.
  // Simple rule: Cache same-origin only for now to be 100% safe.
  if (!isSameOrigin) return;


  // Strategy 1: Network First for HTML (Navigation)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
           // Guard Clause: Check for valid response
           if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
             return networkResponse;
           }
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // Strategy 2: Stale-While-Revalidate for everything else (Assets)
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
             // Guard Clause: Check for valid response before updating cache
             if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
               return networkResponse;
             }
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          })
          .catch((err) => {
            // Network failed, nothing to do.
            // If we have no cached response, this promise chain will fail later?
            // No, we return cachedResponse || fetchPromise.
          });

        return cachedResponse || fetchPromise;
      });
    })
  );
});
