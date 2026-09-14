// ============================================
// ⚡ Service Worker | CodaX Academy
// نسخه: 4.0.0 - PWA کامل
// ============================================

const CACHE_VERSION = 'codax-v4';
const PYODIDE_CACHE = 'codax-pyodide-v1';

// فایل‌های ضروری سایت
const STATIC_FILES = [
    './',
    './index.html',
    './python.html',
    './linux.html',
    './answers.html',
    './answers-python.html',
    './answers-linux.html',
    './libraries.html',
    './challenges.html',
    './terminal-python.html',
    './version.json',
    './manifest.json',
    
    './styles/index-style.css',
    './styles/python-linux-style.css',
    './styles/challenges-style.css',
    './styles/terminal-python.css',
    './styles/libraries-style.css',
    './styles/themes.css',
    
    './js/codax-utils.js',
    './js/python-engine.js',
    
    './configs/index-config.js',
    './configs/python-config.js',
    './configs/linux-config.js',
    './configs/answers.js',
    './configs/answers-python-config.js',
    './configs/answers-linux-config.js',
    './configs/libraries-config.js',
    
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
// نصب
// ============================================
self.addEventListener('install', function(event) {
    console.log('⚡ SW: نصب...');
    
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_VERSION).then(function(cache) {
                console.log('📦 کش فایل‌های استاتیک...');
                return Promise.all(
                    STATIC_FILES.map(function(file) {
                        return cache.add(file).catch(function(err) {
                            console.warn('⚠️ خطا:', file, err.message);
                        });
                    })
                );
            }),
            
            caches.open(PYODIDE_CACHE).then(function(cache) {
                console.log('📦 کش Pyodide...');
                return Promise.all(
                    PYODIDE_FILES.map(function(file) {
                        return fetch(file).then(function(response) {
                            if (response.ok) {
                                cache.put(file, response.clone());
                            }
                        }).catch(function(err) {
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
self.addEventListener('activate', function(event) {
    console.log('⚡ SW: فعال شد');
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(name) {
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
// Fetch
// ============================================
self.addEventListener('fetch', function(event) {
    var url = event.request.url;
    
    // Pyodide - Cache First
    if (url.includes('/pyodide/')) {
        event.respondWith(
            caches.match(event.request).then(function(cachedResponse) {
                if (cachedResponse) return cachedResponse;
                
                return fetch(event.request).then(function(response) {
                    if (response.ok) {
                        var clone = response.clone();
                        caches.open(PYODIDE_CACHE).then(function(cache) {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                });
            })
        );
        return;
    }
    
    // فایل‌های درس - Cache First
    if (url.includes('/python-lessons/') || 
        url.includes('/linux-lessons/') || 
        url.includes('/answers/')) {
        event.respondWith(
            caches.match(event.request).then(function(cachedResponse) {
                if (cachedResponse) return cachedResponse;
                
                return fetch(event.request).then(function(response) {
                    if (response.ok) {
                        var clone = response.clone();
                        caches.open(CACHE_VERSION).then(function(cache) {
                            cache.put(event.request, clone);
                        });
                    }
                    return response;
                }).catch(function() {
                    return new Response('❌ فایل آفلاین موجود نیست', {
                        status: 404,
                        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
                    });
                });
            })
        );
        return;
    }
    
    // بقیه - Network First با Fallback
    event.respondWith(
        fetch(event.request)
            .then(function(response) {
                if (response.ok && event.request.method === 'GET') {
                    var clone = response.clone();
                    caches.open(CACHE_VERSION).then(function(cache) {
                        cache.put(event.request, clone);
                    });
                }
                return response;
            })
            .catch(function() {
                return caches.match(event.request).then(function(cachedResponse) {
                    if (cachedResponse) return cachedResponse;
                    
                    if (event.request.headers.get('accept') && 
                        event.request.headers.get('accept').includes('text/html')) {
                        return new Response(`
                            <!DOCTYPE html>
                            <html dir="rtl">
                            <head>
                                <meta charset="UTF-8">
                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                <title>آفلاین | CodaX</title>
                            </head>
                            <body style="background:#0a0e1a;color:#00d4ff;font-family:'Courier New',monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;text-align:center;direction:rtl;">
                                <div>
                                    <div style="font-size:3rem;margin-bottom:1rem;">📡</div>
                                    <h1 style="color:#00d4ff;margin:0 0 1rem 0;">آفلاین هستید</h1>
                                    <p style="color:rgba(255,255,255,0.5);">این صفحه هنوز کش نشده. لطفاً به اینترنت وصل شوید.</p>
                                    <a href="./index.html" style="color:#00ffcc; text-decoration:none; margin-top:1.5rem; display:inline-block; border:1px solid rgba(0,255,204,0.3); padding:0.6rem 1.5rem; border-radius:8px;">→ بازگشت به خانه</a>
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
// پیام از کلاینت
// ============================================
self.addEventListener('message', function(event) {
    if (event.data && event.data.type === 'CACHE_COURSE') {
        var courseName = event.data.course;
        var files = event.data.files || [];
        var basePath = event.data.basePath || '';
        
        caches.open(CACHE_VERSION).then(function(cache) {
            var promises = files.map(function(file) {
                return fetch(basePath + file).then(function(response) {
                    if (response.ok) {
                        return cache.put(basePath + file, response);
                    }
                }).catch(function(err) {
                    console.warn('⚠️ خطا:', file, err.message);
                });
            });
            
            Promise.all(promises).then(function() {
                console.log('✅ دوره کش شد:', courseName);
                if (event.source) {
                    event.source.postMessage({
                        type: 'CACHE_COURSE_DONE',
                        course: courseName
                    });
                }
            });
        });
    }
});