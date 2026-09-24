const CACHE_NAME = 'darfur-market-v38-fixed';
const urlsToCache = ['./','./index.html'];
self.addEventListener('install', e => { 
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(urlsToCache).catch(()=>{})).catch(()=>{})); 
  self.skipWaiting(); 
});
self.addEventListener('activate', e => { 
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))); 
  self.clients.claim(); 
});
self.addEventListener('fetch', e => {
  if(e.request.url.includes('supabase') || e.request.url.includes('qmzkdvph') || e.request.url.includes('emailjs') || e.request.url.includes('jsdelivr')) return;
  e.respondWith(
    fetch(e.request).then(r=>{
      const c=r.clone(); 
      caches.open(CACHE_NAME).then(cache=>cache.put(e.request,c)).catch(()=>{}); 
      return r; 
    }).catch(()=>caches.match(e.request).then(r=>{
      if(r) return r; 
      if(e.request.mode==='navigate') return caches.match('./index.html'); 
      return r; 
    }))
  );
});
