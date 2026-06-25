const CACHE_NAME = 'leva-traz-v20260625-gps-paciente';
const urlsToCache = ['/manifest.json'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE_NAME).then(function(c) { return c.addAll(urlsToCache); }));
  self.skipWaiting();
});

self.addEventListener('fetch', function(e) {
  // Páginas GPS e rastrear: sempre busca versão nova (não cacheia)
  var url = e.request.url;
  if(url.includes('/rastrear') || url.includes('/motorista') || url.includes('gps.json') || url.includes('api.github.com') || url.includes('raw.githubusercontent.com')){
    e.respondWith(fetch(e.request).catch(function(){ return new Response('{}', {headers:{'Content-Type':'application/json'}}); }));
    return;
  }
  // Para outros assets: tenta novo, fallback em cache
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
