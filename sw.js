var cacheStorageKey = 'minimal-pwa-2'
var cacheList = [
    '/steve.github.io/',
    '/index.html',
    'main.css',
    'icon-32.png'
]
console.log('self', self);
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheStorageKey)
            .then(cache => cache.addAll(cacheList))
            .then(() => self.skipWaiting())
    )
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (response) {
            console.log('[Service Worker] Fetching resource: '+e.request.url);
            if (response != null) {
                return response
            }
            return fetch(e.request.url)
        })
    )
})


self.addEventListener('activate', function (e) {
    e.waitUntil(
        //获取所有cache名称
        caches.keys().then(cacheNames => {
            return Promise.all(
                // 获取所有不同于当前版本名称cache下的内容
                cacheNames.filter(cacheNames => {
                    return cacheNames !== cacheStorageKey
                }).map(cacheNames => {
                    return caches.delete(cacheNames)
                })
            )
        }).then(() => {
            return self.clients.claim()
        })
    )
})