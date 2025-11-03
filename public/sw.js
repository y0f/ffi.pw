const CACHE_NAME = 'ffi-v2'
const RUNTIME_CACHE = 'ffi-runtime-v2'

const PRECACHE_URLS = [
  '/',
  '/index.html',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE]
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))
      )
      .then((cachesToDelete) =>
        Promise.all(cachesToDelete.map((cacheToDelete) => caches.delete(cacheToDelete)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    if (event.request.url.includes('/music/')) {
      return
    }

    // Network-first strategy for HTML and non-hashed assets
    if (event.request.mode === 'navigate' || event.request.url.includes('/index.html')) {
      event.respondWith(
        fetch(event.request)
          .then((response) => {
            const responseToCache = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseToCache)
            })
            return response
          })
          .catch(() => caches.match(event.request))
      )
      return
    }

    // Cache-first for hashed assets only (they are immutable)
    if (event.request.url.includes('/assets/')) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }
          return fetch(event.request).then((response) => {
            if (response.status === 200) {
              const responseToCache = response.clone()
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(event.request, responseToCache)
              })
            }
            return response
          })
        })
      )
      return
    }

    // Network-first for everything else
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response.status === 200) {
            const responseToCache = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return response
        })
        .catch(() => caches.match(event.request))
    )
  }
})
