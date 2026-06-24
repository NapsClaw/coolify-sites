const CACHE_NAME = 'leva-traz-v20260624-excluir-fixos';
const urlsToCache = ['/manifest.json'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function(c) { return c.addAll(urlsToCache); }));
  self.skipWaiting();
});

self.addEventListener('fetch', function(e) {
  // Sempre tenta buscar a versão nova primeiro. Evita página/capa antiga presa no celular.
  e.respondWith(fetch(e.request).then(function(response) {
    return response;
  }).catch(function() {
    return caches.match(e.request).then(function(r) {
      return r || caches.match('/manifest.json');
    });
  }));
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k) { return k !== CACHE_NAME; }).map(function(k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
