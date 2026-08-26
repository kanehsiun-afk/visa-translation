// 便签翻译件 —— Service Worker
// 提供离线能力：首次访问完成后，核心资源与 PDF 中文字体即被缓存，断网后仍可填写、预览、生成 PDF。

const CACHE_NAME = "visa-translation-v1";
const PRECACHE = [
  "/",
  "/manifest.webmanifest",
  "/privacy/",
  "/privacy-check/",
  "/translator/household-register/",
  "/translator/business-license/",
  "/translator/marriage-certificate/",
  "/translator/birth-certificate/",
  "/translator/property-certificate/",
  "/translator/employment-certificate/",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];
const FONT_URL = "/fonts/NotoSansSC-Regular.otf";

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await Promise.allSettled(PRECACHE.map((u) => cache.add(u)));
      // 字体单独缓存，失败不影响安装（仍可在线使用英文版）。
      try {
        await cache.add(FONT_URL);
      } catch {
        /* ignore */
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 静态资源（哈希命名）与字体：缓存优先。
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/fonts/")) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // 导航请求：网络优先，失败回退缓存。
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
    return;
  }

  // 其它同源 GET（图标、manifest 等）：缓存优先。
  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    return cached || cache.match("/");
  }
}
