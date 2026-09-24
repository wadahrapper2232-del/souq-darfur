const CACHE_NAME = 'darfur-market-v6-whatsapp-auto';
const urlsToCache = ['./','./index.html','./manifest.json','https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Amiri:wght@700&display=swap'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(urlsToCache)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.url.includes('supabase') || e.request.url.includes('qmzkdvph')) {
    return;
  }
  e.respondWith(
    fetch(e.request).then(res=>{
      const clone = res.clone();
      caches.open(CACHE_NAME).then(c=>c.put(e.request, clone)).catch(()=>{});
      return res;
    }).catch(()=>{
      return caches.match(e.request).then(r=>{
        if(r) return r;
        if(e.request.mode === 'navigate' || e.request.destination === 'document'){
          return caches.match('./index.html') || caches.match('/');
        }
        return r;
      });
    })
  );
});
