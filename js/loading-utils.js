// ============================================
// 🧀 انیمیشن لودینگ | CheeseCode Academy
// نسخه: 2.0.0 - نمایش خودکار هر 10 ثانیه (5 ثانیه نمایش)
// ============================================

(function () {
    'use strict';

    var loaderInterval = null;
    var loaderTimeout = null;
    var isAutoStarted = false;

    // ============================================
    // اسپینر پنیر خودکار
    // ============================================
    // ============================================
    // اسپینر پنیر خودکار — با پس‌زمینه سیاه
    // ============================================
    function showCheeseLoader(duration) {
        duration = duration || 2000;

        hideCheeseLoader();

        // ============================================
        // Overlay سیاه
        // ============================================
        var overlay = document.createElement('div');
        overlay.id = 'cheeseAutoLoaderOverlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            background: #000000;
            z-index: 99997;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.4s ease;
            pointer-events: all;
        `;

        // ============================================
        // لودر
        // ============================================
        var loader = document.createElement('div');
        loader.id = 'cheeseAutoLoader';
        loader.innerHTML = `
            <div class="cheese-auto-loader-icon">🧀</div>
            <div class="cheese-auto-loader-text">CheeseCode</div>
        `;
        loader.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            transform: scale(0.5);
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
            pointer-events: none;
        `;

        // اضافه کردن لودر داخل overlay
        overlay.appendChild(loader);
        document.body.appendChild(overlay);

        // انیمیشن ورود
        requestAnimationFrame(function () {
            overlay.style.opacity = '1';
            loader.style.opacity = '1';
            loader.style.transform = 'scale(1)';
        });

        // ذخیره در متغیر
        loaderTimeout = setTimeout(function () {
            hideCheeseLoader();
        }, duration);
    }

    // ============================================
    // مخفی کردن لودر
    // ============================================
    function hideCheeseLoader() {
        var overlay = document.getElementById('cheeseAutoLoaderOverlay');
        var loader = document.getElementById('cheeseAutoLoader');

        if (overlay) {
            overlay.style.opacity = '0';
            if (loader) {
                loader.style.opacity = '0';
                loader.style.transform = 'scale(0.5)';
            }
            setTimeout(function () {
                if (overlay && overlay.parentNode) overlay.remove();
            }, 400);
        }

        if (loaderTimeout) {
            clearTimeout(loaderTimeout);
            loaderTimeout = null;
        }
    }

    // ============================================
    // شروع نمایش خودکار — فقط یه بار
    // ============================================
    function startAutoLoader() {
        if (isAutoStarted) return;
        isAutoStarted = true;

        // ⚠️ فقط یه بار، ۵۰۰ms بعد
        setTimeout(function () {
            showCheeseLoader(2000);  // ۲ ثانیه نمایش
        }, 500);
    }

    function stopAutoLoader() {
        if (loaderInterval) {
            clearInterval(loaderInterval);
            loaderInterval = null;
        }
        hideCheeseLoader();
        isAutoStarted = false;
    }

    // ============================================
    // Overlay لودینگ (برای عملیات طولانی)
    // ============================================
    function showLoading(message, options) {
        options = options || {};

        hideLoading();

        var overlay = document.createElement('div');
        overlay.id = 'cheeseLoadingOverlay';
        overlay.className = 'cheese-loading-overlay';

        if (options.fullscreen !== false) {
            overlay.classList.add('fullscreen');
        }

        var loader = document.createElement('div');
        loader.innerHTML = '<div class="cheese-loader-icon">🧀</div>';

        var text = document.createElement('div');
        text.className = 'cheese-loading-text';
        text.textContent = message || 'در حال بارگذاری...';

        overlay.appendChild(loader);
        overlay.appendChild(text);
        document.body.appendChild(overlay);

        setTimeout(function () {
            overlay.classList.add('visible');
        }, 10);

        return overlay;
    }

    function hideLoading() {
        var overlay = document.getElementById('cheeseLoadingOverlay');
        if (overlay) {
            overlay.classList.remove('visible');
            setTimeout(function () {
                if (overlay.parentNode) overlay.remove();
            }, 300);
        }
    }

    // ============================================
    // توست
    // ============================================
    function showToast(message, type) {
        var toast = document.createElement('div');
        toast.className = 'cheese-toast cheese-toast-' + (type || 'info');

        var icon = '';
        if (type === 'success') icon = '✅ ';
        else if (type === 'error') icon = '❌ ';
        else if (type === 'warning') icon = '⚠️ ';
        else icon = '🧀 ';

        toast.textContent = icon + message;
        document.body.appendChild(toast);

        setTimeout(function () {
            toast.classList.add('visible');
        }, 10);

        setTimeout(function () {
            toast.classList.remove('visible');
            setTimeout(function () {
                if (toast.parentNode) toast.remove();
            }, 300);
        }, 2500);
    }

    function showSuccess(message) { showToast(message, 'success'); }
    function showError(message) { showToast(message, 'error'); }
    function showInfo(message) { showToast(message, 'info'); }
    function showWarning(message) { showToast(message, 'warning'); }

    // ============================================
    // اسکلت لودینگ
    // ============================================
    function showSkeleton(container, count) {
        count = count || 5;
        if (!container) return;

        container.innerHTML = '';
        for (var i = 0; i < count; i++) {
            var skeleton = document.createElement('div');
            skeleton.className = 'skeleton-item';
            container.appendChild(skeleton);
        }
    }

    // ============================================
    // شروع
    // ============================================
    function init() {
        startAutoLoader();
        console.log('🧀 Loading Utils ready! (v2.0.0)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // API عمومی
    window.LoadingUtils = {
        show: showLoading,
        hide: hideLoading,
        success: showSuccess,
        error: showError,
        info: showInfo,
        warning: showWarning,
        toast: showToast,
        skeleton: showSkeleton,
        showCheese: showCheeseLoader,
        hideCheese: hideCheeseLoader,
        startAuto: startAutoLoader,
        stopAuto: stopAutoLoader
    };

})();