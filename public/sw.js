// Minimal service worker — exists ONLY to satisfy PWA installability
// requirements (browsers require a registered service worker before
// showing an "Install app" prompt).
//
// Deliberately does NOT cache any files or intercept fetch requests.
// Every load goes straight to the network, exactly like a normal browser
// tab, so the installed app always shows the latest deployed version,
// never a stale cached build.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// No 'fetch' listener on purpose — nothing gets intercepted or cached.
