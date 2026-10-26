'use strict';
const CACHE = 'cueprompt-shell-v1';
const SHELL = ['/', '/style.css', '/app.js', '/workflow.js', '/install.js', '/i18n.js', '/align.js', '/manifest.webmanifest', '/assets/app-icon-192.png', '/assets/app-icon-512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(SHELL))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('cueprompt-shell-') && k !== CACHE).map(k => caches.delete(k))))));
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || url.search || url.pathname.startsWith('/vendor/')) return;
  // Never cache account traffic or third-party AI requests; only public static assets.
  if (!SHELL.includes(url.pathname) && !/^\/(?:i18n\/[\w-]+\.js|[a-z]{2}(?:-[a-z]{2})?\/)$/.test(url.pathname)) return;
  event.respondWith(fetch(event.request).then(response => {
    if (response.ok && response.type === 'basic' && !response.redirected) {
      const copy = response.clone(); event.waitUntil(caches.open(CACHE).then(cache => cache.put(event.request, copy)));
    }
    return response;
  }).catch(async () => (await caches.match(event.request)) || (event.request.mode === 'navigate' ? await caches.match('/') : Response.error())));
});
