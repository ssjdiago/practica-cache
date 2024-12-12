const CACHE_NAME = "v1_cache_practica";
const DYNAMIC_CACHE_NAME = "dynamic_cache";
const MAX_DYNAMIC_ITEMS = 5;

const ASSETS = [
  "/index.html",
  "/css/bootstrap.css",
  "/css/animate.css",
  "/css/icomoon.css",
  "/css/style.css",
  "/js/jquery.min.js",
  "/js/jquery.easing.1.3.js",
  "/js/bootstrap.min.js",
  "/js/jquery.waypoints.min.js",
  "/js/jquery.stellar.min.js",
  "/js/main.js",
  "/js/app.js",
  "/images/hero_1.jpg",
  "/images/hero_2.jpg",
  "/offline.html",
  "/manifest.json",
  "/images/no-found.png"

];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME && cache !== DYNAMIC_CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((fetchResponse) => {
          return caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            cache.keys().then((keys) => {
              if (keys.length > MAX_DYNAMIC_ITEMS) {
                cache.delete(keys[0]);
              }
            });

            return fetchResponse;
          });
        })
        .catch(() => {
          if (event.request.destination === "document") {
            return caches.match("/offline.html");
          }
          if (event.request.destination === "image") {
            return caches.match("/images/no-found.png");
          }
        });
    })
  );
});
