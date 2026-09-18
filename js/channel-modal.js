// ============================================
// 🧀 مودال اطلاعات + منو | CheeseCode Academy
// نسخه: 2.0.0 - Final
// ============================================

(function () {
    'use strict';

    function createChannelMenuModal() {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (currentPage === 'index.html' || currentPage === '' || currentPage === 'challenges.html') {
            return;
        }

        if (document.getElementById('channelMenuModal')) return;

        // ============================================
        // Overlay
        // ============================================
        var overlay = document.createElement('div');
        overlay.id = 'channelMenuOverlay';
        overlay.style.cssText = `
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        `;
        overlay.onclick = function () {
            closeModal();
        };

        // ============================================
        // مودال
        // ============================================
        var modal = document.createElement('div');
        modal.id = 'channelMenuModal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 10001;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            justify-content: center;
            align-items: center;
            padding: 1rem;
            direction: rtl;
            font-family: 'Courier New', monospace;
            pointer-events: none;
        `;

        // ============================================
        // محتوا
        // ============================================
        var content = document.createElement('div');
        content.className = 'modal-content';
        content.style.cssText = `
            background: rgba(15, 22, 38, 0.98);
            border: 1px solid rgba(245, 184, 27, 0.3);
            border-radius: 24px;
            padding: 0;
            width: 100%;
            max-width: 450px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
            border-top: 2px solid #f5b81b;
            position: relative;
            animation: modalSlide 0.3s ease;
            pointer-events: auto;
        `;

        // ============================================
        // دکمه‌ی بستن
        // ============================================
        var closeBtn = document.createElement('span');
        closeBtn.className = 'close-modal';
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
            background: rgba(15, 22, 38, 0.9);
            border: 1px solid rgba(245, 184, 27, 0.2);
            z-index: 20;
        `;
        closeBtn.onmouseover = function () {
            this.style.color = '#ff4444';
            this.style.borderColor = 'rgba(255, 68, 68, 0.3)';
        };
        closeBtn.onmouseout = function () {
            this.style.color = 'rgba(255, 255, 255, 0.5)';
            this.style.borderColor = 'rgba(245, 184, 27, 0.2)';
        };
        closeBtn.onclick = function () {
            closeModal();
        };

        // ============================================
        // ناحیه‌ی اسکرول
        // ============================================
        var scrollArea = document.createElement('div');
        scrollArea.className = 'scroll-area';
        scrollArea.style.cssText = `
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            padding: 2rem 1.5rem;
            flex: 1;
            min-height: 0;
        `;

        // ============================================
        // بخش اطلاعات
        // ============================================
        var infoSection = document.createElement('div');
        infoSection.style.cssText = 'margin-bottom: 1.5rem;';

        var logo = document.createElement('img');
        logo.src = 'images/logo.jpeg';
        logo.alt = 'CheeseCode';
        logo.style.cssText = `
            width: 130px;
            height: auto;
            border-radius: 20px;
            margin-bottom: 1rem;
            border: 1px solid rgba(245, 184, 27, 0.2);
        `;

        var title = document.createElement('h3');
        title.textContent = 'آکادمی چیزکد | CheeseCode';
        title.style.cssText = `
            color: #f5b81b;
            font-weight: 700;
            font-size: 1.2rem;
            margin: 0 0 0.5rem 0;
            font-family: 'Courier New', monospace;
        `;

        var slogan = document.createElement('p');
        slogan.textContent = 'آموزش ساده پایتون مثل خوردن پنیر 🍕';
        slogan.style.cssText = `
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.85rem;
            margin: 0 0 1rem 0;
            font-family: 'Courier New', monospace;
        `;

        var links = document.createElement('div');
        links.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        `;

        var channelLink = document.createElement('a');
        channelLink.href = 'https://ble.ir/cheesecode';
        channelLink.target = '_blank';
        channelLink.textContent = '👈 ورود به کانال بله 👉';
        channelLink.style.cssText = `
            color: #f5b81b;
            text-decoration: none;
            font-size: 0.9rem;
            font-weight: 600;
            padding: 0.6rem 1.5rem;
            border-radius: 60px;
            border: 1px solid rgba(245, 184, 27, 0.2);
            background: rgba(245, 184, 27, 0.08);
            transition: all 0.2s ease;
            font-family: 'Courier New', monospace;
            display: block;
        `;
        channelLink.onmouseover = function () {
            this.style.background = 'rgba(245, 184, 27, 0.15)';
            this.style.borderColor = 'rgba(245, 184, 27, 0.4)';
        };
        channelLink.onmouseout = function () {
            this.style.background = 'rgba(245, 184, 27, 0.08)';
            this.style.borderColor = 'rgba(245, 184, 27, 0.2)';
        };

        var adminLink = document.createElement('a');
        adminLink.href = 'https://ble.ir/cheese_code';
        adminLink.target = '_blank';
        adminLink.textContent = '💬 ارتباط با ادمین: @cheese_code';
        adminLink.style.cssText = `
            color: #00d4ff;
            text-decoration: none;
            font-size: 0.85rem;
            font-weight: 600;
            padding: 0.6rem 1.5rem;
            border-radius: 60px;
            border: 1px solid rgba(0, 212, 255, 0.2);
            background: rgba(0, 212, 255, 0.05);
            transition: all 0.2s ease;
            font-family: 'Courier New', monospace;
            display: block;
        `;
        adminLink.onmouseover = function () {
            this.style.background = 'rgba(0, 212, 255, 0.12)';
            this.style.borderColor = 'rgba(0, 212, 255, 0.4)';
        };
        adminLink.onmouseout = function () {
            this.style.background = 'rgba(0, 212, 255, 0.05)';
            this.style.borderColor = 'rgba(0, 212, 255, 0.2)';
        };

        links.appendChild(channelLink);
        links.appendChild(adminLink);

        infoSection.appendChild(logo);
        infoSection.appendChild(title);
        infoSection.appendChild(slogan);
        infoSection.appendChild(links);

        // ============================================
        // دکمه‌های سریع (جستجو + تنظیمات)
        // ============================================
        var quickActions = document.createElement('div');
        quickActions.style.cssText = `
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        `;

        // دکمه‌ی جستجو
        var searchBtn = document.createElement('button');
        searchBtn.innerHTML = '🔍 جستجو';
        searchBtn.style.cssText = `
            flex: 1;
            background: rgba(0, 212, 255, 0.08);
            border: 1px solid rgba(0, 212, 255, 0.2);
            color: #00d4ff;
            padding: 0.6rem 0.8rem;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        searchBtn.onmouseover = function () {
            this.style.background = 'rgba(0, 212, 255, 0.15)';
            this.style.transform = 'scale(1.02)';
        };
        searchBtn.onmouseout = function () {
            this.style.background = 'rgba(0, 212, 255, 0.08)';
            this.style.transform = 'scale(1)';
        };
        searchBtn.onclick = function () {
            closeModal();
            setTimeout(function () {
                if (window.GlobalSearch) {
                    window.GlobalSearch.open();
                }
            }, 200);
        };

        // دکمه‌ی تنظیمات
        var settingsBtn = document.createElement('button');
        settingsBtn.innerHTML = '⚙️ تنظیمات';
        settingsBtn.style.cssText = `
            flex: 1;
            background: rgba(245, 184, 27, 0.08);
            border: 1px solid rgba(245, 184, 27, 0.2);
            color: #f5b81b;
            padding: 0.6rem 0.8rem;
            border-radius: 10px;
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
        `;
        settingsBtn.onmouseover = function () {
            this.style.background = 'rgba(245, 184, 27, 0.15)';
            this.style.transform = 'scale(1.02)';
        };
        settingsBtn.onmouseout = function () {
            this.style.background = 'rgba(245, 184, 27, 0.08)';
            this.style.transform = 'scale(1)';
        };
        settingsBtn.onclick = function () {
            window.location.href = 'settings.html';
        };

        quickActions.appendChild(searchBtn);
        quickActions.appendChild(settingsBtn);

        // ============================================
        // جداکننده
        // ============================================
        var divider = document.createElement('div');
        divider.style.cssText = `
            display: flex;
            align-items: center;
            gap: 1rem;
            margin: 1.5rem 0;
            color: rgba(245, 184, 27, 0.5);
            font-size: 0.8rem;
            font-family: 'Courier New', monospace;
        `;
        divider.innerHTML = `
            <div style="flex: 1; height: 1px; background: rgba(245, 184, 27, 0.2);"></div>
            <span>🧀 منوی اصلی</span>
            <div style="flex: 1; height: 1px; background: rgba(245, 184, 27, 0.2);"></div>
        `;

        // ============================================
        // لیست منو
        // ============================================
        var menuSection = document.createElement('div');
        menuSection.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        `;

        if (typeof window.menuConfig !== 'undefined' && Array.isArray(window.menuConfig)) {
            window.menuConfig.forEach(function (item) {
                var isActive = item.url === currentPage;

                var link = document.createElement('a');
                link.href = item.url;
                link.textContent = item.title;
                link.style.cssText = `
                    display: block;
                    padding: 0.8rem 1rem;
                    border-radius: 10px;
                    text-decoration: none;
                    color: ${isActive ? '#00d4ff' : 'rgba(255, 255, 255, 0.75)'};
                    background: ${isActive ? 'rgba(0, 212, 255, 0.1)' : 'rgba(245, 184, 27, 0.03)'};
                    border: 1px solid ${isActive ? 'rgba(0, 212, 255, 0.3)' : 'rgba(245, 184, 27, 0.1)'};
                    font-family: 'Courier New', monospace;
                    font-size: 0.9rem;
                    transition: all 0.2s ease;
                    font-weight: ${isActive ? '600' : '500'};
                    text-align: right;
                `;

                link.onmouseover = function () {
                    if (!isActive) {
                        this.style.background = 'rgba(245, 184, 27, 0.1)';
                        this.style.borderColor = 'rgba(0, 212, 255, 0.3)';
                        this.style.color = '#f5b81b';
                        this.style.transform = 'translateX(-4px)';
                    }
                };
                link.onmouseout = function () {
                    if (!isActive) {
                        this.style.background = 'rgba(245, 184, 27, 0.03)';
                        this.style.borderColor = 'rgba(245, 184, 27, 0.1)';
                        this.style.color = 'rgba(255, 255, 255, 0.75)';
                        this.style.transform = 'translateX(0)';
                    }
                };

                menuSection.appendChild(link);
            });
        } else {
            var errorMsg = document.createElement('div');
            errorMsg.style.cssText = `
                color: #ff6b6b;
                padding: 1rem;
                background: rgba(255, 68, 68, 0.1);
                border: 1px solid rgba(255, 68, 68, 0.3);
                border-radius: 8px;
                font-size: 0.8rem;
                text-align: right;
            `;
            errorMsg.textContent = '⚠️ menuConfig پیدا نشد!';
            menuSection.appendChild(errorMsg);
        }

        // ============================================
        // ساختار نهایی
        // ============================================
        scrollArea.appendChild(infoSection);
        scrollArea.appendChild(quickActions);
        scrollArea.appendChild(divider);
        scrollArea.appendChild(menuSection);

        content.appendChild(closeBtn);
        content.appendChild(scrollArea);
        modal.appendChild(content);

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        // ESC برای بستن
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal();
            }
        });

        console.log('✅ مودال اطلاعات + منو ساخته شد');
    }

    // ============================================
    // باز/بسته کردن
    // ============================================
    function openModal() {
        var modal = document.getElementById('channelMenuModal');
        var overlay = document.getElementById('channelMenuOverlay');
        if (modal) {
            modal.style.display = 'flex';
            if (overlay) overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }

    function closeModal() {
        var modal = document.getElementById('channelMenuModal');
        var overlay = document.getElementById('channelMenuOverlay');
        if (modal) {
            modal.style.display = 'none';
            if (overlay) overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // ============================================
    // اتصال به لوگو
    // ============================================
    function attachToLogo() {
        var currentPage = window.location.pathname.split('/').pop() || 'index.html';

        if (currentPage === 'index.html' || currentPage === '' || currentPage === 'challenges.html') {
            return;
        }

        var logo = document.getElementById('logoBtn') ||
            document.querySelector('.brand-logo') ||
            document.querySelector('.main-logo');

        if (!logo) {
            console.warn('⚠️ لوگو پیدا نشد');
            return;
        }

        var newLogo = logo.cloneNode(true);
        logo.parentNode.replaceChild(newLogo, logo);
        logo = newLogo;

        logo.style.cursor = 'pointer';

        logo.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            openModal();
            return false;
        }, true);

        console.log('✅ لوگو به مودال متصل شد');
    }

    // ============================================
    // شروع
    // ============================================
    function init() {
        createChannelMenuModal();
        setTimeout(attachToLogo, 200);
    }

    window.addEventListener('load', function () {
        setTimeout(init, 300);
    });

    window.ChannelModal = {
        open: openModal,
        close: closeModal
    };

})();