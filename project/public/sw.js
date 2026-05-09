self.addEventListener("install", () => {
  console.log("Service Worker installed");
});

self.addEventListener("fetch", (event) => {
  // basic pass-through (no caching for now)
  event.respondWith(fetch(event.request));
});