// Kill-Switch für den Service Worker des alten Chirpy-Themes.
//
// Chirpy hat /sw.js registriert und Seiten offline gecacht. Browser prüfen
// /sw.js regelmäßig auf Updates; diese Version ersetzt den alten Worker,
// löscht alle Caches, meldet sich ab und lädt offene Tabs neu, damit sie
// die neue Seite direkt vom Netz holen. Nicht löschen, solange alte
// Besucher den Worker noch installiert haben könnten.
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })(),
  );
});
