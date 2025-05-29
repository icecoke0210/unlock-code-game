// 服務工作者緩存策略
const CACHE_NAME = 'unlock-code-game-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// 安裝階段：緩存重要資源
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('緩存已開啟');
        return cache.addAll(urlsToCache);
      })
  );
});

// 擷取階段：提供緩存的回應
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // 如果找到了緩存的回應，則返回緩存
        if (response) {
          return response;
        }
        
        // 如果沒有在緩存中找到，則從網絡獲取
        return fetch(event.request).then(
          function(response) {
            // 確保回應有效
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆回應，因為它是流式的，只能使用一次
            var responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          }
        );
      })
    );
});

// 活化階段：清理舊緩存
self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
