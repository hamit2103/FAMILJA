const CACHE = "diamond-v154";
const SHELL = ["./", "./index.html", "./admin.html", "./admin-manifest.webmanifest", "./styles.css?v=109", "./app.js?v=125", "./app-config.js", "./manifest.webmanifest", "./angel-icon.jpg", "./sports.js?v=11", "./games.js?v=106", "./tv.js?v=56", "./radio.js?v=57", "./recipes.js?v=1", "./quran.js?v=1", "./prayer-extras.js?v=2", "./news.js?v=3", "./nearby.js?v=3", "./diet.js?v=8", "./kingdom.js?v=2", "./uck.js?v=1", "./diamond-run.js?v=4", "./diamond-adventure.js?v=1", "./diamond-nations.js?v=2"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(new Request(event.request, { cache: "no-store" }))
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    fetch(new Request(event.request, { cache: "no-store" }))
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});


self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow("./");
    })
  );
});
