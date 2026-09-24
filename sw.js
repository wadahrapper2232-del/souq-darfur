const CACHE_NAME = 'darfur-market-v28-sync-all';
const urlsToCache = ['./','./index.html','./manifest.json'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urlsToCache)).catch(()=>{})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  if(e.request.url.includes('supabase') || e.request.url.includes('qmzkdvph')) return;
  e.respondWith(fetch(e.request).then(r=>{ const c=r.clone(); caches.open(CACHE_NAME).then(cache=>cache.put(e.request,c)); return r; }).catch(()=>caches.match(e.request).then(r=>{ if(r) return r; if(e.request.mode==='navigate') return caches.match('./index.html'); return r; })));
});
