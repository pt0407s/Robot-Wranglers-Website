// Service Worker for Robot Wranglers Website
const CACHE_NAME = 'robot-wranglers-v10';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/animations.js',
  '/pages/about.html',
  '/pages/events.html',
  '/pages/social.html',
  '/pages/archive.html',
  '/pages/more.html',
  '/visuals/lrlogo.png',
  '/visuals/bankgothic.ttf',
  '/visuals/best_robotics_noText.png',
  '/visuals/factoids.png',
  '/visuals/teamphoto.jpg',
  '/visuals/teamphoto2.jpg',
  '/visuals/teamphoto3.jpg'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
