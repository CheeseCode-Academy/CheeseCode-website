// ============================================
// 🧀 راهنمای نصب PWA | CheeseCode Academy
// نسخه: 2.0.0 - نمایش خودکار بعد از 120 ثانیه
// ============================================

(function () {
    'use strict';

    var deferredPrompt = null;
    var installModal = null;
    var AUTO_SHOW_DELAY = 120000; // 120 ثانیه
    var STORAGE_KEY = 'cheese_install_guide_shown';

    // ============================================
    // تشخیص مرورگر و سیستم‌عامل
    // ============================================
    function detectBrowserAndOS() {
        var ua = navigator.userAgent.toLowerCase();

        var browser = 'unknown';
        var os = 'unknown';

        if (ua.indexOf('samsungbrowser') > -1) {
            browser = 'samsung';
        } else if (ua.indexOf('edg/') > -1 || ua.indexOf('edga') > -1) {
            browser = 'edge';
        } else if (ua.indexOf('firefox') > -1 || ua.indexOf('fxios') > -1) {
            browser = 'firefox';
        } else if (ua.indexOf('chrome') > -1 || ua.indexOf('crios') > -1) {
            browser = 'chrome';
        } else if (ua.indexOf('safari') > -1) {
            browser = 'safari';
        }

        if (/android/.test(ua)) {
            os = 'android';
        } else if (/iphone|ipad|ipod/.test(ua)) {
            os = 'ios';
        } else if (/windows|mac|linux/.test(ua)) {
            os = 'desktop';
        }

        if (os === 'ios' && ua.indexOf('crios') === -1 && ua.indexOf('fxios') === -1) {
            browser = 'safari';
        }

        return { browser: browser, os: os };
    }

    // ============================================
    // انتخاب راهنما
    // ============================================
    function getGuideKey(browser, os) {
        if (browser === 'chrome' && os === 'ios') return 'chrome-ios';
        if (browser === 'chrome' && os === 'android') return 'chrome-android';
        if (browser === 'chrome' && os === 'desktop') return 'chrome-desktop';
        if (browser === 'edge' && os === 'desktop') return 'edge-desktop';
        if (browser === 'edge' && os === 'android') return 'edge-android';
        if (browser === 'samsung') return 'samsung';
        if (browser === 'firefox' && os === 'desktop') return 'firefox-desktop';
        if (browser === 'firefox' && os === 'android') return 'firefox-android';
        if (browser === 'safari' && os === 'ios') return 'safari-ios';
        return 'default';
    }

    // ============================================
    // چک PWA نصب‌شده
    // ============================================
    function isStandalone() {
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) return true;
        if (window.navigator.standalone === true) return true;
        return false;
    }

    // ============================================
    // ساخت مودال
    // ============================================
    function createInstallModal() {
        if (document.getElementById('installGuideModal')) return;

        var modal = document.createElement('div');
        modal.id = 'installGuideModal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 10001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            justify-content: center;
            align-items: center;
            padding: 1rem;
            overflow-y: auto;
            direction: rtl;
            font-family: 'Courier New', monospace;
        `;

        var content = document.createElement('div');
        content.id = 'installModalContent';
        content.style.cssText = `
            background: rgba(15, 22, 38, 0.98);
            border: 1px solid rgba(245, 184, 27, 0.3);
            border-radius: 24px;
            padding: 2rem 1.5rem;
            width: 100%;
            max-width: 480px;
            max-height: 90vh;
            overflow-y: auto;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
            border-top: 2px solid #f5b81b;
            position: relative;
            animation: modalSlide 0.3s ease;
        `;

        var closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            left: 1rem;
            top: 1rem;
            font-size: 1.5rem;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            z-index: 10;
        `;
        closeBtn.onmouseover = function () {
            this.style.color = '#ff4444';
            this.style.background = 'rgba(255, 68, 68, 0.1)';
        };
        closeBtn.onmouseout = function () {
            this.style.color = 'rgba(255, 255, 255, 0.5)';
            this.style.background = 'transparent';
        };
        closeBtn.onclick = closeModal;

        content.appendChild(closeBtn);
        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });

        installModal = modal;
    }

    // ============================================
    // نمایش مودال
    // ============================================
    function showInstallGuide() {
        if (isStandalone()) return;
        if (!installModal) createInstallModal();

        var config = window.installConfig;
        if (!config) {
            console.warn('⚠️ installConfig پیدا نشد');
            return;
        }

        var det = detectBrowserAndOS();
        var guideKey = getGuideKey(det.browser, det.os);
        var guide = config.guides[guideKey] || config.guides['default'];

        var content = document.getElementById('installModalContent');
        if (!content) return;

        var closeBtn = content.querySelector('span');
        content.innerHTML = '';
        content.appendChild(closeBtn);

        var title = document.createElement('h2');
        title.textContent = config.title;
        title.style.cssText = `
            color: #f5b81b;
            font-size: 1.2rem;
            margin: 0 0 0.5rem 0;
            font-family: 'Courier New', monospace;
        `;

        var desc = document.createElement('p');
        desc.textContent = config.description;
        desc.style.cssText = `
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.85rem;
            margin: 0 0 1.5rem 0;
            line-height: 1.6;
        `;

        var browserBadge = document.createElement('div');
        browserBadge.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.3);
            color: #00d4ff;
            padding: 0.4rem 1rem;
            border-radius: 60px;
            font-size: 0.8rem;
            margin-bottom: 1.5rem;
            font-weight: 600;
        `;
        browserBadge.innerHTML = guide.icon + ' ' + guide.browser + ' — ' + guide.os;

        var stepsContainer = document.createElement('div');
        stepsContainer.style.cssText = `
            text-align: right;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            padding: 1rem;
            margin-bottom: 1.5rem;
        `;

        guide.steps.forEach(function (step, i) {
            var stepEl = document.createElement('div');
            stepEl.style.cssText = `
                display: flex;
                align-items: flex-start;
                gap: 0.8rem;
                margin-bottom: ${i < guide.steps.length - 1 ? '0.8rem' : '0'};
                font-size: 0.85rem;
                color: rgba(255, 255, 255, 0.8);
                line-height: 1.6;
            `;

            var num = document.createElement('div');
            num.textContent = (i + 1);
            num.style.cssText = `
                background: rgba(245, 184, 27, 0.15);
                border: 1px solid rgba(245, 184, 27, 0.3);
                color: #f5b81b;
                width: 24px;
                height: 24px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                font-size: 0.75rem;
                flex-shrink: 0;
                margin-top: 2px;
            `;

            var text = document.createElement('div');
            text.textContent = step;
            text.style.flex = '1';

            stepEl.appendChild(num);
            stepEl.appendChild(text);
            stepsContainer.appendChild(stepEl);
        });

        var autoInstallBtn = null;
        if (deferredPrompt) {
            autoInstallBtn = document.createElement('button');
            autoInstallBtn.textContent = '📥 نصب خودکار (بدون راهنما)';
            autoInstallBtn.style.cssText = `
                width: 100%;
                background: rgba(0, 212, 255, 0.15);
                border: 1px solid rgba(0, 212, 255, 0.4);
                color: #00d4ff;
                padding: 0.8rem;
                border-radius: 12px;
                font-family: 'Courier New', monospace;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-bottom: 1rem;
            `;
            autoInstallBtn.onmouseover = function () {
                this.style.background = 'rgba(0, 212, 255, 0.25)';
            };
            autoInstallBtn.onmouseout = function () {
                this.style.background = 'rgba(0, 212, 255, 0.15)';
            };
            autoInstallBtn.onclick = function () {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then(function (choice) {
                        if (choice.outcome === 'accepted') {
                            closeModal();
                        }
                        deferredPrompt = null;
                    });
                }
            };
        }

        var benefitsContainer = document.createElement('div');
        benefitsContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.5rem;
            margin-top: 1rem;
        `;

        config.benefits.forEach(function (benefit) {
            var b = document.createElement('div');
            b.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.4rem;
                background: rgba(245, 184, 27, 0.05);
                border: 1px solid rgba(245, 184, 27, 0.15);
                border-radius: 8px;
                padding: 0.5rem;
                font-size: 0.75rem;
                color: rgba(255, 255, 255, 0.7);
            `;
            b.innerHTML = '<span style="font-size: 1rem;">' + benefit.icon + '</span> ' + benefit.text;
            benefitsContainer.appendChild(b);
        });

        content.appendChild(title);
        content.appendChild(desc);
        content.appendChild(browserBadge);
        if (autoInstallBtn) content.appendChild(autoInstallBtn);
        content.appendChild(stepsContainer);
        content.appendChild(benefitsContainer);

        installModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        console.log('🧀 مودال نصب نمایش داده شد');
    }

    // ============================================
    // بستن
    // ============================================
    function closeModal() {
        if (installModal) {
            installModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // ============================================
    // نمایش خودکار
    // ============================================
    function setupAutoShow() {
        if (isStandalone()) return;
        if (localStorage.getItem(STORAGE_KEY)) return;

        setTimeout(function () {
            if (localStorage.getItem(STORAGE_KEY)) return;
            if (isStandalone()) return;

            showInstallGuide();
            localStorage.setItem(STORAGE_KEY, Date.now().toString());
        }, AUTO_SHOW_DELAY);

        console.log('🧀 مودال نصب بعد از ' + (AUTO_SHOW_DELAY / 1000) + ' ثانیه نمایش داده میشه');
    }

    // ============================================
    // شروع
    // ============================================
    function init() {
        if (isStandalone()) return;

        createInstallModal();
        setupAutoShow();

        console.log('🧀 Install Helper ready!');
    }

    window.addEventListener('load', function () {
        setTimeout(init, 500);
    });

    window.addEventListener('beforeinstallprompt', function (e) {
        e.preventDefault();
        deferredPrompt = e;
    });

    window.addEventListener('appinstalled', function () {
        deferredPrompt = null;
        localStorage.setItem(STORAGE_KEY, 'installed');
    });

    window.InstallHelper = {
        showGuide: showInstallGuide,
        detect: detectBrowserAndOS,
        reset: function () {
            localStorage.removeItem(STORAGE_KEY);
            console.log('🧀 مودال نصب ریست شد');
        }
    };

})();