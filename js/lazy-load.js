// ============================================
// 🧀 Lazy Loading | CheeseCode Academy
// نسخه: 2.0.0
// ============================================

(function () {
    'use strict';

    // ============================================
    // فعال کردن lazy loading برای تصاویر
    // ============================================
    function enableLazyLoading() {
        var images = document.querySelectorAll('img:not([loading])');

        images.forEach(function (img) {
            var rect = img.getBoundingClientRect();
            var isAboveFold = rect.top < window.innerHeight && rect.bottom > 0;

            if (!isAboveFold) {
                img.setAttribute('loading', 'lazy');
            }

            img.setAttribute('decoding', 'async');
        });
    }

    // ============================================
    // IntersectionObserver برای تصاویر
    // ============================================
    function setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;

                    if (img.dataset.src && !img.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }

                    if (img.dataset.srcset && !img.srcset) {
                        img.srcset = img.dataset.srcset;
                        img.removeAttribute('data-srcset');
                    }

                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.4s ease';

                    setTimeout(function () {
                        img.style.opacity = '1';
                    }, 50);

                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px 0px',
            threshold: 0.01
        });

        var lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(function (img) {
            observer.observe(img);
        });

        window._lazyImageObserver = observer;
    }

    // ============================================
    // Lazy Loading برای iframe
    // ============================================
    function enableLazyFrames() {
        var iframes = document.querySelectorAll('iframe:not([loading])');
        iframes.forEach(function (iframe) {
            iframe.setAttribute('loading', 'lazy');
        });
    }

    // ============================================
    // Defer برای اسکریپت‌ها
    // ============================================
    function deferScripts() {
        var scripts = document.querySelectorAll('script[src]:not([defer]):not([async])');
        scripts.forEach(function (script) {
            if (script.parentNode && script.parentNode.tagName !== 'HEAD') {
                script.setAttribute('defer', '');
            }
        });
    }

    // ============================================
    // Preload لینک‌های مهم
    // ============================================
    function preloadCritical() {
        var criticalPages = [
            'python.html',
            'linux.html',
            'answers.html',
            'quizzes.html'
        ];

        if (!navigator.onLine) return;

        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage !== 'index.html' && currentPage !== '') return;

        setTimeout(function () {
            criticalPages.forEach(function (page) {
                var link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = page;
                document.head.appendChild(link);
            });
        }, 5000);
    }

    // ============================================
    // رصد تغییرات DOM
    // ============================================
    function observeDOM() {
        if (!window.MutationObserver) return;

        var observer = new MutationObserver(function (mutations) {
            var hasNewImages = false;

            mutations.forEach(function (m) {
                if (m.addedNodes.length > 0) {
                    m.addedNodes.forEach(function (node) {
                        if (node.nodeType === 1) {
                            if (node.tagName === 'IMG' && !node.hasAttribute('loading')) {
                                node.setAttribute('loading', 'lazy');
                                node.setAttribute('decoding', 'async');
                                hasNewImages = true;
                            }
                            var childImages = node.querySelectorAll ? node.querySelectorAll('img:not([loading])') : [];
                            childImages.forEach(function (img) {
                                img.setAttribute('loading', 'lazy');
                                img.setAttribute('decoding', 'async');
                                hasNewImages = true;
                            });
                        }
                    });
                }
            });

            if (hasNewImages && window._lazyImageObserver) {
                document.querySelectorAll('img[data-src]').forEach(function (img) {
                    window._lazyImageObserver.observe(img);
                });
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ============================================
    // شروع
    // ============================================
    function init() {
        enableLazyLoading();
        setupIntersectionObserver();
        enableLazyFrames();
        deferScripts();
        preloadCritical();
        observeDOM();

        console.log('⚡ Lazy Loading ready! (v2.0.0)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.LazyLoad = {
        refresh: enableLazyLoading,
        observe: setupIntersectionObserver
    };

})();