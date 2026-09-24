const CACHE_NAME = 'darfur-market-v43-compact';
const SENSITIVE = ['supabase','qmzkdvph','emailjs','jsdelivr','googleapis','gstatic'];
self.addEventListener('install', e => { 
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(['./','./index.html']).catch(()=>{}))); 
  self.skipWaiting(); 
});
self.addEventListener('activate', e => { 
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))))); 
  self.clients.claim(); 
});
self.addEventListener('fetch', e => {
  const url = e.request.url.toLowerCase();
  if(SENSITIVE.some(s=>url.includes(s))) return;
  if(e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r=>{
      if(!r || r.status!==200 || r.type!=='basic') return r;
      const c=r.clone(); 
      caches.open(CACHE_NAME).then(cache=>cache.put(e.request,c)).catch(()=>{}); 
      return r; 
    }).catch(()=>caches.match(e.request).then(r=> r || (e.request.mode==='navigate' ? caches.match('./index.html') : r)))
  );
});
