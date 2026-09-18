// ============================================
// 🧀 هدر چسبنده | CheeseCode Academy
// نسخه: 1.0.0
// ============================================

(function () {
    'use strict';

    var header = null;
    var ticking = false;

    // ============================================
    // پیدا کردن هدر
    // ============================================
    function findHeader() {
        header = document.querySelector('.hero-panel');

        if (!header) {
            header = document.querySelector('body > header');
        }

        return header;
    }

    // ============================================
    // آپدیت هدر بر اساس اسکرول
    // ============================================
    function updateHeader() {
        if (!header) return;

        var scrolled = window.pageYOffset || document.documentElement.scrollTop;

        if (scrolled > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        ticking = false;
    }

    // ============================================
    // رویداد اسکرول
    // ============================================
    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    // ============================================
    // شروع
    // ============================================
    function init() {
        header = findHeader();

        if (!header) {
            return;
        }

        // بررسی کن که توی index نیستیم
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';
        if (currentPage === 'index.html' || currentPage === '') {
            console.log('ℹ️ Sticky Header: صفحه اصلی، غیرفعال');
            return;
        }

        header.style.position = 'sticky';
        header.style.top = '0';
        header.style.zIndex = '100';

        window.addEventListener('scroll', onScroll, { passive: true });
        updateHeader();

        console.log('📌 Sticky Header ready!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.StickyHeader = {
        refresh: function () {
            header = findHeader();
            updateHeader();
        }
    };

})();