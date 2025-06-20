/**
 * Service Worker for MeanMachine PWA
 * Provides offline functionality and caching
 */

const CACHE_NAME = 'meanmachine-v1.1.0';
const STATIC_CACHE_NAME = 'meanmachine-static-v1.1.0';
const DYNAMIC_CACHE_NAME = 'meanmachine-dynamic-v1.1.0';

// Static assets to cache (don't include JS/CSS with hashes)
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/images/hero.jpg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== STATIC_CACHE_NAME && 
                     cacheName !== DYNAMIC_CACHE_NAME &&
                     cacheName.startsWith('meanmachine-');
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }
  
  // Skip JS/CSS files entirely - let browser handle them normally
  if (isJSOrCSS(request)) {
    return;
  }
  
  // Handle other types of requests
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});

/**
 * Cache first strategy - for static assets
 */
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    const cache = await caches.open(STATIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    console.error('[SW] Cache first failed:', error);
    return createOfflineResponse(request);
  }
}

/**
 * Network first strategy - for API requests
 */
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    console.error('[SW] Network first failed:', error);
    return createOfflineResponse(request);
  }
}

/**
 * Stale while revalidate strategy - for HTML pages
 */
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      cache.put(request, networkResponse.clone());
      return networkResponse;
    })
    .catch((error) => {
      console.error('[SW] Stale while revalidate fetch failed:', error);
      return cachedResponse;
    });
  
  return cachedResponse || fetchPromise;
}

/**
 * Check if request is for a static asset
 */
function isStaticAsset(request) {
  const url = new URL(request.url);
  // Don't cache JS/CSS files with content hashes - let them be handled dynamically
  return url.pathname.match(/\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)$/) && 
         !url.pathname.includes('main.') && 
         !url.pathname.includes('common.');
}

/**
 * Check if request is for an API endpoint
 */
function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || url.pathname.endsWith('.php');
}

/**
 * Check if request is for JS or CSS files (let them pass through)
 */
function isJSOrCSS(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(js|css)$/);
}

/**
 * Create offline response for failed requests
 */
function createOfflineResponse(request) {
  if (request.destination === 'document') {
    return new Response(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MeanMachine - Offline</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 40px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-align: center;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .offline-container {
            max-width: 400px;
            background: rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 20px;
            backdrop-filter: blur(10px);
          }
          h1 { margin: 0 0 20px 0; font-size: 2.5em; }
          p { margin: 0 0 30px 0; opacity: 0.9; line-height: 1.6; }
          .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 2px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 16px;
            transition: all 0.3s ease;
          }
          .retry-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
          }
        </style>
      </head>
      <body>
        <div class="offline-container">
          <h1>🔌 Offline</h1>
          <p>You're currently offline, but MeanMachine can still perform calculations with your cached data!</p>
          <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
        </div>
        <script>
          // Enable offline calculation functionality
          window.addEventListener('online', () => {
            window.location.reload();
          });
        </script>
      </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-cache'
      }
    });
  }
  
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Message handling for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Background sync for future enhancement
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-calculation') {
    console.log('[SW] Background sync triggered');
    // Future: Sync calculation history when back online
  }
});