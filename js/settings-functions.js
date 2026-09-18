// ============================================
// 🧀 فانکشن‌های تنظیمات | CheeseCode Academy
// نسخه: 3.2.0 - پشتیبانی از بوکمارک‌ها
// ============================================

(function () {
    'use strict';

    // ============================================
    // ساخت بخش‌های تنظیمات
    // ============================================
    function renderSettings() {
        var container = document.getElementById('settingsContainer');
        if (!container) return;

        if (typeof window.settingsConfig === 'undefined' || !Array.isArray(window.settingsConfig)) {
            container.innerHTML = '<p style="color:#ff6b6b; text-align:center;">❌ settings-config.js پیدا نشد</p>';
            return;
        }

        container.innerHTML = '';

        window.settingsConfig.forEach(function (section) {
            var sectionEl = document.createElement('div');
            sectionEl.className = 'settings-section';

            var titleEl = document.createElement('h3');
            titleEl.className = 'section-title';
            titleEl.textContent = section.title;

            var descEl = document.createElement('p');
            descEl.className = 'section-desc';
            descEl.textContent = section.description || '';

            sectionEl.appendChild(titleEl);
            sectionEl.appendChild(descEl);

            // ============================================
            // modal-opener
            // ============================================
            if (section.type === 'modal-opener') {
                var openBtn = document.createElement('button');
                openBtn.type = 'button';
                openBtn.className = 'settings-opener-btn';

                var btnIcon = document.createElement('span');
                btnIcon.className = 'settings-opener-icon';
                btnIcon.textContent = section.icon || '⚙️';

                var btnText = document.createElement('span');
                btnText.className = 'settings-opener-text';
                btnText.textContent = section.buttonText || 'باز کردن';

                var btnArrow = document.createElement('span');
                btnArrow.className = 'settings-opener-arrow';
                btnArrow.textContent = '❯';

                openBtn.appendChild(btnIcon);
                openBtn.appendChild(btnText);
                openBtn.appendChild(btnArrow);

                openBtn.onclick = function (e) {
                    e.preventDefault();
                    openSettingsModal(section.modal);
                };

                sectionEl.appendChild(openBtn);
            }

            // ============================================
            // stats
            // ============================================
            if (section.type === 'stats') {
                var statsContainer = document.createElement('div');
                statsContainer.className = 'stats-container';
                statsContainer.id = 'statsContainer';
                sectionEl.appendChild(statsContainer);

                setTimeout(function () {
                    renderStats(statsContainer);
                }, 100);
            }

            // ============================================
            // bookmarks
            // ============================================
            if (section.type === 'bookmarks') {
                var bookmarksContainer = document.createElement('div');
                bookmarksContainer.className = 'bookmarks-container';
                bookmarksContainer.id = 'bookmarksContainer';
                sectionEl.appendChild(bookmarksContainer);

                setTimeout(function () {
                    if (window.BookmarksUtils) {
                        window.BookmarksUtils.render(bookmarksContainer);
                    } else {
                        bookmarksContainer.innerHTML = '<p style="color:#ff6b6b; text-align:center; font-size:0.8rem;">⚠️ bookmarks-utils.js لود نشده</p>';
                    }
                }, 100);
            }

            container.appendChild(sectionEl);
        });

        console.log('✅ تنظیمات ساخته شد');
    }

    // ============================================
    // نمایش آمار
    // ============================================
    function renderStats(container) {
        var pythonProgress = 0;
        var linuxProgress = 0;
        var answersProgress = 0;

        try {
            var p1 = JSON.parse(localStorage.getItem('cheese_progress_python') || '{}');
            var p2 = JSON.parse(localStorage.getItem('cheese_progress_linux') || '{}');
            var p3 = JSON.parse(localStorage.getItem('cheese_progress_answers_python') || '{}');
            var p4 = JSON.parse(localStorage.getItem('cheese_progress_answers_linux') || '{}');

            pythonProgress = Object.keys(p1).length;
            linuxProgress = Object.keys(p2).length;
            answersProgress = Object.keys(p3).length + Object.keys(p4).length;
        } catch (e) { }

        var badges = {};
        try {
            badges = JSON.parse(localStorage.getItem('cheese_earned_badges') || '{}');
        } catch (e) { }

        var badgeCount = Object.keys(badges).length;

        var quizResults = {};
        try {
            quizResults = JSON.parse(localStorage.getItem('cheese_quiz_results') || '{}');
        } catch (e) { }

        var quizCount = Object.keys(quizResults).length;
        var passedQuizCount = 0;
        var totalScore = 0;

        for (var key in quizResults) {
            if (quizResults[key].passed) passedQuizCount++;
            totalScore += quizResults[key].score || 0;
        }

        var avgScore = quizCount > 0 ? Math.round(totalScore / quizCount) : 0;

        var bookmarksCount = 0;
        try {
            var bookmarks = JSON.parse(localStorage.getItem('cheese_bookmarks') || '{}');
            bookmarksCount = Object.keys(bookmarks).length;
        } catch (e) { }

        var html = ''
            + '<div class="stats-grid">'
            + '  <div class="stat-card">'
            + '    <div class="stat-icon">🐍</div>'
            + '    <div class="stat-value">' + toPersianNumber(pythonProgress) + '</div>'
            + '    <div class="stat-label">درس پایتون</div>'
            + '  </div>'
            + '  <div class="stat-card">'
            + '    <div class="stat-icon">🐧</div>'
            + '    <div class="stat-value">' + toPersianNumber(linuxProgress) + '</div>'
            + '    <div class="stat-label">درس لینوکس</div>'
            + '  </div>'
            + '  <div class="stat-card">'
            + '    <div class="stat-icon">📝</div>'
            + '    <div class="stat-value">' + toPersianNumber(answersProgress) + '</div>'
            + '    <div class="stat-label">پاسخ دیده‌شده</div>'
            + '  </div>'
            + '  <div class="stat-card">'
            + '    <div class="stat-icon">🎓</div>'
            + '    <div class="stat-value">' + toPersianNumber(quizCount) + '</div>'
            + '    <div class="stat-label">کوییز انجام‌شده</div>'
            + '  </div>'
            + '  <div class="stat-card">'
            + '    <div class="stat-icon">✅</div>'
            + '    <div class="stat-value">' + toPersianNumber(passedQuizCount) + '</div>'
            + '    <div class="stat-label">کوییز قبول‌شده</div>'
            + '  </div>'
            + '  <div class="stat-card">'
            + '    <div class="stat-icon">🎯</div>'
            + '    <div class="stat-value">' + toPersianNumber(avgScore) + '%</div>'
            + '    <div class="stat-label">میانگین نمره</div>'
            + '  </div>'
            + '  <div class="stat-card">'
            + '    <div class="stat-icon">🏆</div>'
            + '    <div class="stat-value">' + toPersianNumber(badgeCount) + '</div>'
            + '    <div class="stat-label">نشان گرفته‌شده</div>'
            + '  </div>'
            + '  <div class="stat-card">'
            + '    <div class="stat-icon">⭐</div>'
            + '    <div class="stat-value">' + toPersianNumber(bookmarksCount) + '</div>'
            + '    <div class="stat-label">درس نشان‌شده</div>'
            + '  </div>'
            + '</div>';

        container.innerHTML = html;
    }

    // ============================================
    // ابزار: تبدیل عدد به فارسی
    // ============================================
    function toPersianNumber(num) {
        var persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(num).replace(/\d/g, function (d) { return persian[d]; });
    }

    // ============================================
    // باز کردن مودال
    // ============================================
    function openSettingsModal(modalConfig) {
        if (!modalConfig) return;

        var modal = document.getElementById('settingsModal');
        if (!modal) {
            createSettingsModal();
            modal = document.getElementById('settingsModal');
        }

        var titleEl = modal.querySelector('.modal-title');
        var descEl = modal.querySelector('.modal-desc');
        var contentEl = modal.querySelector('.modal-body');

        titleEl.textContent = modalConfig.title || 'تنظیمات';
        descEl.textContent = modalConfig.description || '';
        contentEl.innerHTML = '';

        // ============================================
        // theme-list
        // ============================================
        if (modalConfig.type === 'theme-list') {
            var currentTheme = window.CheeseUtils ? window.CheeseUtils.getTheme() : 'dark';

            modalConfig.items.forEach(function (theme) {
                var item = document.createElement('button');
                item.type = 'button';
                item.className = 'modal-item';
                if (theme.id === currentTheme) {
                    item.classList.add('active');
                }

                var icon = document.createElement('span');
                icon.className = 'modal-item-icon';
                icon.textContent = theme.icon;

                var info = document.createElement('div');
                info.className = 'modal-item-info';

                var name = document.createElement('div');
                name.className = 'modal-item-name';
                name.textContent = theme.name;

                var desc = document.createElement('div');
                desc.className = 'modal-item-desc';
                desc.textContent = theme.description || '';

                info.appendChild(name);
                info.appendChild(desc);

                var check = document.createElement('span');
                check.className = 'modal-item-check';
                check.textContent = '✓';

                item.appendChild(icon);
                item.appendChild(info);
                item.appendChild(check);

                item.onclick = function () {
                    if (window.CheeseUtils) {
                        window.CheeseUtils.setTheme(theme.id);
                    }

                    contentEl.querySelectorAll('.modal-item').forEach(function (el) {
                        el.classList.remove('active');
                    });
                    item.classList.add('active');
                };

                contentEl.appendChild(item);
            });
        }

        // ============================================
        // info-list
        // ============================================
        if (modalConfig.type === 'info-list') {
            modalConfig.items.forEach(function (info) {
                var item = document.createElement('div');
                item.className = 'modal-item info-item';

                var icon = document.createElement('span');
                icon.className = 'modal-item-icon';
                icon.textContent = info.icon || '📌';

                var infoDiv = document.createElement('div');
                infoDiv.className = 'modal-item-info';

                var name = document.createElement('div');
                name.className = 'modal-item-name';
                name.textContent = info.name;

                var desc = document.createElement('div');
                desc.className = 'modal-item-desc';
                desc.textContent = info.description || '';

                infoDiv.appendChild(name);
                infoDiv.appendChild(desc);

                item.appendChild(icon);
                item.appendChild(infoDiv);

                contentEl.appendChild(item);
            });
        }

        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    // ============================================
    // ساخت مودال
    // ============================================
    function createSettingsModal() {
        if (document.getElementById('settingsModal')) return;

        var overlay = document.createElement('div');
        overlay.id = 'settingsModalOverlay';
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

        var modal = document.createElement('div');
        modal.id = 'settingsModal';
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
            z-index: 10;
        `;
        closeBtn.onmouseover = function () {
            this.style.color = '#ff4444';
            this.style.borderColor = 'rgba(255, 68, 68, 0.3)';
        };
        closeBtn.onmouseout = function () {
            this.style.color = 'rgba(255, 255, 255, 0.5)';
            this.style.borderColor = 'rgba(245, 184, 27, 0.2)';
        };
        closeBtn.onclick = closeSettingsModal;

        var scrollArea = document.createElement('div');
        scrollArea.style.cssText = `
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            padding: 2rem 1.5rem;
            flex: 1;
            min-height: 0;
        `;

        var title = document.createElement('h3');
        title.className = 'modal-title';
        title.style.cssText = `
            color: #f5b81b;
            font-weight: 700;
            font-size: 1.2rem;
            margin: 0 0 0.5rem 0;
            font-family: 'Courier New', monospace;
        `;

        var desc = document.createElement('p');
        desc.className = 'modal-desc';
        desc.style.cssText = `
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.85rem;
            margin: 0 0 1.5rem 0;
            font-family: 'Courier New', monospace;
        `;

        var body = document.createElement('div');
        body.className = 'modal-body';
        body.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        `;

        scrollArea.appendChild(title);
        scrollArea.appendChild(desc);
        scrollArea.appendChild(body);

        content.appendChild(closeBtn);
        content.appendChild(scrollArea);
        modal.appendChild(content);

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeSettingsModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeSettingsModal();
            }
        });
    }

    // ============================================
    // بستن
    // ============================================
    function closeSettingsModal() {
        var modal = document.getElementById('settingsModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // ============================================
    // شروع
    // ============================================
    function init() {
        renderSettings();
        createSettingsModal();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.SettingsFunctions = {
        openModal: openSettingsModal,
        closeModal: closeSettingsModal,
        renderStats: renderStats,
        refresh: renderSettings
    };

})();