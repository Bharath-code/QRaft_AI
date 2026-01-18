const CACHE_NAME = 'qraft-v1';
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS);
        })
    );
    // Activate immediately
    self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        })
    );
    // Claim clients immediately
    self.clients.claim();
});

// Fetch event - Network first, fallback to cache
self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip API calls and external resources
    if (request.url.includes('/api/') || !request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        fetch(request)
            .then((response) => {
                // Clone and cache the response
                const responseClone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(request, responseClone);
                });
                return response;
            })
            .catch(() => {
                // Fallback to cache
                return caches.match(request).then((cachedResponse) => {
                    return cachedResponse || new Response('Offline', { status: 503 });
                });
            })
    );
});

// Handle push notifications (optional, for future)
self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || 'QRaft';
    const options = {
        body: data.body || 'Your QR code is ready!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
