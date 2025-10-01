/**
 * Service Worker for Therapy Council Website
 * 
 * Implements caching strategies for optimal performance:
 * - Cache static assets (CSS, JS, images)
 * - Network-first for HTML pages
 * - Cache-first for assets
 * - Offline fallback page
 * 
 * Version: 1.0.0
 */

const CACHE_VERSION = 'tc-v1.0.0';
const CACHE_NAME = `therapy-council-${CACHE_VERSION}`;

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  
  // CSS (use minified in production)
  '/css/base.min.css',
  '/css/header-footer.min.css',
  '/css/home.min.css',
  '/css/about.min.css',
  '/css/services.min.css',
  '/css/pricing.min.css',
  '/css/contact.min.css',
  '/css/blog.min.css',
  '/css/thank-you.min.css',
  
  // JavaScript
  '/script.js',
  
  // Logos
  '/logo/logo_white.png',
  '/logo/logo_black.png',
  
  // Favicons
  '/favicon_io/favicon.ico',
  '/favicon_io/favicon-32x32.png',
  '/favicon_io/favicon-16x16.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installed successfully');
        return self.skipWaiting(); // Activate immediately
      })
      .catch((error) => {
        console.error('[Service Worker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches
            if (cacheName !== CACHE_NAME) {
              console.log('[Service Worker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[Service Worker] Activated successfully');
        return self.clients.claim(); // Take control immediately
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip external requests (Google Analytics, Font Awesome, etc.)
  if (url.origin !== location.origin) {
    return;
  }
  
  // Different strategies for different resource types
  if (request.destination === 'document') {
    // HTML pages: Network-first (fresh content)
    event.respondWith(networkFirstStrategy(request));
  } else {
    // Static assets: Cache-first (fast loading)
    event.respondWith(cacheFirstStrategy(request));
  }
});

/**
 * Network-first strategy
 * Try network, fall back to cache, then offline page
 */
async function networkFirstStrategy(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Both failed, return offline page
    if (request.destination === 'document') {
      return caches.match('/offline.html');
    }
    
    // Return error for other resources
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Cache-first strategy
 * Serve from cache, update in background
 */
async function cacheFirstStrategy(request) {
  // Check cache first
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Return cached version immediately
    // Update cache in background (stale-while-revalidate)
    updateCache(request);
    return cachedResponse;
  }
  
  // Not in cache, fetch from network
  try {
    const networkResponse = await fetch(request);
    
    // Cache the new response
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] Fetch failed:', error);
    return new Response('Network error', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}

/**
 * Update cache in background
 */
async function updateCache(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse);
    }
  } catch (error) {
    // Silent fail - already serving from cache
  }
}

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.addAll(event.data.urls))
    );
  }
});

// Log cache status
self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    event.ports[0].postMessage({
      cacheSize: keys.length,
      cacheName: CACHE_NAME
    });
  }
});

