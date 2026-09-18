// ============================================
// 🧀 Service Worker | CheeseCode Academy
// نسخه: 9.0.0 - فقط کش دستی
// ============================================

const CACHE_VERSION = 'cheese-v9';
const PYODIDE_CACHE = 'cheese-pyodide-v1';

const ESSENTIAL_FILES = [
    './images/logo.jpeg',
    './images/icon-192.png',
    './images/icon-512.png'
];

const PYODIDE_FILES = [
    './pyodide/pyodide.js',
    './pyodide/pyodide.asm.js',
    './pyodide/pyodide.asm.wasm',
    './pyodide/pyodide.asm.data',
    './pyodide/python_stdlib.zip',
    './pyodide/pyodide-lock.json'
];

// ============================================
// نصب — فقط فایل‌های ضروری
// ============================================
self.addEventListener('install', function (event) {
    console.log('🧀 SW: نصب نسخه 9.0.0...');

    event.waitUntil(
        Promise.all([
            caches.open(CACHE_VERSION).then(function (cache) {
                return Promise.all(
                    ESSENTIAL_FILES.map(function (file) {
                        return cache.add(file).catch(function (err) {
                            console.warn('⚠️ خطا:', file, err.message);
                        });
                    })
                );
            }),

            caches.open(PYODIDE_CACHE).then(function (cache) {
                return Promise.all(
                    PYODIDE_FILES.map(function (file) {
                        return fetch(file).then(function (response) {
                            if (response.ok) {
                                cache.put(file, response.clone());
                            }
                        }).catch(function (err) {
                            console.warn('⚠️ خطا:', file, err.message);
                        });
                    })
                );
            })
        ])
    );

    self.skipWaiting();
});

// ============================================
// فعال‌سازی
// ============================================
self.addEventListener('activate', function (event) {
    console.log('🧀 SW: فعال شد');

    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (name) {
                    if (name !== CACHE_VERSION && name !== PYODIDE_CACHE) {
                        console.log('🗑️ پاک کردن کش قدیمی:', name);
                        return caches.delete(name);
                    }
                })
            );
        })
    );

    return self.clients.claim();
});

// ============================================
// Fetch — فقط از cache در حالت آفلاین
// ============================================
self.addEventListener('fetch', function (event) {
    var url = event.request.url;

    // ===== Pyodide: Cache First =====
    if (url.includes('/pyodide/')) {
        event.respondWith(
            caches.match(event.request).then(function (cachedResponse) {
                if (cachedResponse) return cachedResponse;

                return fetch(event.request).then(function (response) {
                    if (response.ok) {
                        var clone = response.clone();
                        caches.open(PYODIDE_CACHE).then(function (cache) {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                });
            })
        );
        return;
    }

    // ===== بقیه: اول شبکه، اگه نبود cache =====
    // ⚠️ Offline First غیرفعال — فقط وقتی آفلاینیم از cache استفاده کن
    event.respondWith(
        fetch(event.request).then(function (response) {
            return response;
        }).catch(function () {
            // آفلاینیم — از cache بگیر
            return caches.match(event.request).then(function (cachedResponse) {
                if (cachedResponse) {
                    return cachedResponse;
                }

                // اگه HTML خواست و توی cache نبود
                if (event.request.headers.get('accept') &&
                    event.request.headers.get('accept').includes('text/html')) {
                    return new Response(`
                        <!DOCTYPE html>
                        <html dir="rtl">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>آفلاین | CheeseCode</title>
                        </head>
                        <body style="background:#0a0e1a;color:#f5b81b;font-family:'Courier New',monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;direction:rtl;">
                            <div>
                                <div style="font-size:3rem;margin-bottom:1rem;">📡</div>
                                <h1 style="color:#f5b81b;margin:0 0 1rem 0;">آفلاین هستید</h1>
                                <p style="color:rgba(255,255,255,0.5);">این صفحه کش نشده. برای دسترسی، از مرکز دانلود کش کن.</p>
                                <a href="./libraries.html" style="color:#00d4ff;text-decoration:none;margin-top:1.5rem;display:inline-block;border:1px solid rgba(0,212,255,0.3);padding:0.6rem 1.5rem;border-radius:8px;">📦 مرکز دانلود</a>
                            </div>
                        </body>
                        </html>
                    `, {
                        headers: { 'Content-Type': 'text/html; charset=utf-8' }
                    });
                }

                return new Response('❌ آفلاین', { status: 404 });
            });
        })
    );
});

// ============================================
// پیام‌ها
// ============================================
self.addEventListener('message', function (event) {
    if (event.data && event.data.type === 'CACHE_URLS') {
        var urls = event.data.urls || [];

        caches.open(CACHE_VERSION).then(function (cache) {
            var promises = urls.map(function (url) {
                return fetch(url).then(function (response) {
                    if (response.ok) {
                        return cache.put(url, response);
                    }
                }).catch(function (err) {
                    console.warn('⚠️ خطا:', url, err.message);
                });
            });

            Promise.all(promises).then(function () {
                if (event.source) {
                    event.source.postMessage({
                        type: 'CACHE_URLS_DONE',
                        count: urls.length
                    });
                }
            });
        });
    }
});