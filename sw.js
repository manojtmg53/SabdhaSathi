// SabdhaSathi Service Worker v4
const CACHE_NAME = 'sabdhasathi-v5';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './manifest.json',
    './sw.js',
    './vendor/font/MaterialSymbolsRounded.woff2',
    './vendor/tesseract/tesseract.min.js',
    './vendor/tesseract/worker.min.js',
    './vendor/tesseract/tesseract-core-simd.wasm.js',
    './vendor/tesseract/langs/eng.traineddata.gz',
    './vendor/tesseract/langs/nep.traineddata.gz',
    './assets/icons/icon-96.png',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './assets/icons/apple-touch-icon.png',
    './assets/icons/favicon.png',
    './assets/data/dictionary-final.json',
    './assets/data/dictionary-index.json',
    './assets/data/dictionary-inline.js',
    './js/app.js',
    './js/dictionary.js',
    './js/search.js',
    './js/levenshtein.js',
    './js/spellcheck.js',
    './js/ui.js',
    './js/favorites.js',
    './js/history.js',
    './js/utils.js',
    './js/ocrEditor.js',
    './js/pages.js',
    './js/imageProcessor.js'
];

// Install: cache core assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Caching app shell');
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[SW] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch: network-first for HTML (updates), cache-first for assets
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Network-first for HTML (always get latest)
    if (request.destination === 'document' || url.pathname.endsWith('.html')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    return response;
                })
                .catch(() => caches.match(request))
        );
        return;
    }

    // Cache-first for everything else (JS, CSS, JSON, icons)
    event.respondWith(
        caches.match(request).then((cached) => {
            if (cached) return cached;
            return fetch(request).then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                return response;
            });
        })
    );
});
