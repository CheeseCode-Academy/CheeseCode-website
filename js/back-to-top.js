// ============================================
// 🧀 اسکرول به بالا | CheeseCode Academy
// نسخه: 2.0.0 - پشتیبانی از مودال‌ها
// ============================================

(function () {
    'use strict';

    var mainBtn = null;
    var modalBtns = {};
    var SHOW_AFTER = 300;

    // ============================================
    // ساخت دکمه‌ی اصلی (صفحه)
    // ============================================
    function createMainButton() {
        if (document.getElementById('backToTopBtn')) return;

        mainBtn = document.createElement('button');
        mainBtn.id = 'backToTopBtn';
        mainBtn.innerHTML = '⬆️';
        mainBtn.title = 'برگشت به بالا';
        mainBtn.style.cssText = `
            position: fixed;
            bottom: 25px;
            left: 25px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(245, 184, 27, 0.15);
            border: 1px solid rgba(245, 184, 27, 0.4);
            color: #f5b81b;
            font-size: 1.3rem;
            cursor: pointer;
            z-index: 9998;
            display: none;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
            opacity: 0;
            transform: translateY(20px);
        `;

        mainBtn.onmouseover = function () {
            this.style.background = 'rgba(245, 184, 27, 0.25)';
            this.style.borderColor = 'rgba(0, 212, 255, 0.6)';
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 8px 30px rgba(245, 184, 27, 0.3)';
        };
        mainBtn.onmouseout = function () {
            this.style.background = 'rgba(245, 184, 27, 0.15)';
            this.style.borderColor = 'rgba(245, 184, 27, 0.4)';
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.4)';
        };
        mainBtn.onclick = function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        document.body.appendChild(mainBtn);
    }

    // ============================================
    // نمایش/مخفی دکمه‌ی صفحه
    // ============================================
    function toggleMainButton() {
        if (!mainBtn) return;

        var scrolled = window.pageYOffset || document.documentElement.scrollTop;

        if (scrolled > SHOW_AFTER) {
            if (mainBtn.style.display === 'none' || !mainBtn.style.display) {
                mainBtn.style.display = 'flex';
                setTimeout(function () {
                    mainBtn.style.opacity = '1';
                    mainBtn.style.transform = 'translateY(0)';
                }, 10);
            }
        } else {
            if (mainBtn.style.display !== 'none') {
                mainBtn.style.opacity = '0';
                mainBtn.style.transform = 'translateY(20px)';
                setTimeout(function () {
                    if (mainBtn.style.opacity === '0') {
                        mainBtn.style.display = 'none';
                    }
                }, 300);
            }
        }
    }

    // ============================================
    // ساخت دکمه برای مودال‌ها
    // ============================================
    function createModalButton(modalSelector) {
        var modal = document.querySelector(modalSelector);
        if (!modal) return;

        var modalContent = modal.querySelector('.modal-content');
        if (!modalContent) return;

        var btnId = 'backToTop-' + modalSelector.replace(/[^a-zA-Z0-9]/g, '');
        if (modalBtns[btnId]) return;

        if (getComputedStyle(modalContent).position === 'static') {
            modalContent.style.position = 'relative';
        }

        var btn = document.createElement('button');
        btn.id = btnId;
        btn.innerHTML = '⬆️';
        btn.title = 'برگشت به بالا';
        btn.style.cssText = `
            position: absolute;
            bottom: 15px;
            left: 15px;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            background: rgba(245, 184, 27, 0.15);
            border: 1px solid rgba(245, 184, 27, 0.4);
            color: #f5b81b;
            font-size: 1.1rem;
            cursor: pointer;
            z-index: 50;
            display: none;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
            opacity: 0;
        `;

        btn.onmouseover = function () {
            this.style.background = 'rgba(245, 184, 27, 0.25)';
            this.style.transform = 'scale(1.1)';
        };
        btn.onmouseout = function () {
            this.style.background = 'rgba(245, 184, 27, 0.15)';
            this.style.transform = 'scale(1)';
        };

        btn.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();

            var scrollTarget = modalContent.querySelector('.lesson-content') ||
                modalContent.querySelector('.scroll-area') ||
                modalContent.querySelector('#modal-body-content') ||
                modalContent.querySelector('#quiz-content') ||
                modalContent.querySelector('#project-content') ||
                modalContent;

            scrollTarget.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };

        modalContent.appendChild(btn);
        modalBtns[btnId] = { btn: btn, modal: modal, content: modalContent };

        var scrollTarget = modalContent.querySelector('.lesson-content') ||
            modalContent.querySelector('.scroll-area') ||
            modalContent.querySelector('#modal-body-content') ||
            modalContent.querySelector('#quiz-content') ||
            modalContent.querySelector('#project-content') ||
            modalContent;

        scrollTarget.addEventListener('scroll', function () {
            toggleModalButton(btn, scrollTarget);
        }, { passive: true });

        var observer = new MutationObserver(function () {
            toggleModalButton(btn, scrollTarget);
        });
        observer.observe(scrollTarget, { childList: true, subtree: true });
    }

    function toggleModalButton(btn, scrollTarget) {
        var scrolled = scrollTarget.scrollTop;

        if (scrolled > SHOW_AFTER) {
            if (btn.style.display === 'none' || !btn.style.display) {
                btn.style.display = 'flex';
                setTimeout(function () {
                    btn.style.opacity = '1';
                }, 10);
            }
        } else {
            if (btn.style.display !== 'none') {
                btn.style.opacity = '0';
                setTimeout(function () {
                    if (btn.style.opacity === '0') {
                        btn.style.display = 'none';
                    }
                }, 300);
            }
        }
    }

    // ============================================
    // آماده‌سازی مودال‌ها
    // ============================================
    function setupModals() {
        var modals = [
            '#lessonModal',
            '#quizModal',
            '#projectModal',
            '#channelMenuModal',
            '#notesModal',
            '#settingsModal'
        ];

        modals.forEach(function (selector) {
            createModalButton(selector);
        });
    }

    // ============================================
    // شروع
    // ============================================
    function init() {
        createMainButton();
        setupModals();

        window.addEventListener('scroll', toggleMainButton, { passive: true });
        toggleMainButton();

        if (window.MutationObserver) {
            var observer = new MutationObserver(function (mutations) {
                mutations.forEach(function (m) {
                    if (m.attributeName === 'style' && m.target.classList) {
                        if (m.target.classList.contains('modal') || m.target.id) {
                            setTimeout(setupModals, 100);
                        }
                    }
                });
            });

            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['style'],
                subtree: true
            });
        }

        console.log('⬆️ Back to Top ready! (v2.0.0)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.BackToTop = {
        show: function () { if (mainBtn) mainBtn.style.display = 'flex'; },
        hide: function () { if (mainBtn) mainBtn.style.display = 'none'; },
        refresh: setupModals
    };

})();