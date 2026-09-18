// ============================================
// 🧀 اشتراک‌گذاری نشان | CheeseCode Academy
// نسخه: 1.0.0
// ============================================

(function () {
    'use strict';

    // ============================================
    // اشتراک‌گذاری نشان
    // ============================================
    function shareBadge(badgeId, badgeName, badgeImage) {
        var badges = getBadges();
        var badge = badges[badgeId];

        if (!badge) {
            if (window.LoadingUtils) {
                window.LoadingUtils.error('نشان پیدا نشد!');
            }
            return;
        }

        var baseUrl = window.location.origin + window.location.pathname;
        var shareUrl = baseUrl.replace('challenges.html', 'index.html');

        var text = '🏆 من یه نشان جدید توی CheeseCode گرفتم!\n\n' +
            '🎖️ ' + badge.name + '\n' +
            '📅 ' + formatDate(badge.date) + '\n\n' +
            '🧀 آکادمی چیزکد — آموزش ساده پایتون\n' +
            shareUrl;

        if (navigator.share) {
            navigator.share({
                title: '🏆 نشان جدید در CheeseCode',
                text: text
            }).then(function () {
                if (window.LoadingUtils) {
                    window.LoadingUtils.success('نشان به اشتراک گذاشته شد!');
                }
            }).catch(function (err) {
                if (err.name !== 'AbortError') {
                    fallbackShare(text, badge);
                }
            });
        } else {
            fallbackShare(text, badge);
        }
    }

    function fallbackShare(text, badge) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function () {
                if (window.LoadingUtils) {
                    window.LoadingUtils.success('متن کپی شد! حالا برای دوستت بفرست.');
                }
            }).catch(function () {
                showBadgeModal(text, badge);
            });
        } else {
            showBadgeModal(text, badge);
        }
    }

    function showBadgeModal(text, badge) {
        var old = document.getElementById('badgeShareModal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'badgeShareModal';
        modal.style.cssText = `
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            direction: rtl;
            font-family: 'Courier New', monospace;
            backdrop-filter: blur(10px);
        `;

        modal.innerHTML = `
            <div style="
                background: rgba(15, 22, 38, 0.98);
                border: 1px solid rgba(245, 184, 27, 0.3);
                border-radius: 20px;
                padding: 1.5rem;
                max-width: 500px;
                width: 100%;
                text-align: center;
            ">
                <div style="font-size: 3rem; margin-bottom: 0.5rem;">🏆</div>
                <h3 style="color: #f5b81b; margin: 0 0 0.5rem 0; font-size: 1.1rem;">
                    ${escapeHtml(badge.name)}
                </h3>
                <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.8rem; margin: 0 0 1rem 0;">
                    📅 ${formatDate(badge.date)}
                </p>
                <textarea readonly style="
                    width: 100%;
                    min-height: 140px;
                    background: rgba(0, 0, 0, 0.4);
                    color: #f5b81b;
                    border: 1px solid rgba(245, 184, 27, 0.2);
                    border-radius: 10px;
                    padding: 0.8rem;
                    font-family: 'Courier New', monospace;
                    font-size: 0.75rem;
                    line-height: 1.6;
                    resize: none;
                    box-sizing: border-box;
                    direction: rtl;
                    margin-bottom: 1rem;
                " id="badgeTextArea">${escapeHtml(text)}</textarea>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="copyBadgeText()" style="
                        flex: 1;
                        background: rgba(245, 184, 27, 0.1);
                        border: 1px solid rgba(245, 184, 27, 0.3);
                        padding: 0.7rem;
                        border-radius: 10px;
                        color: #f5b81b;
                        cursor: pointer;
                        font-family: 'Courier New', monospace;
                        font-size: 0.85rem;
                        font-weight: 600;
                    ">📋 کپی متن</button>
                    <button onclick="document.getElementById('badgeShareModal').remove()" style="
                        flex: 1;
                        background: rgba(255, 68, 68, 0.1);
                        border: 1px solid rgba(255, 68, 68, 0.3);
                        padding: 0.7rem;
                        border-radius: 10px;
                        color: #ff6b6b;
                        cursor: pointer;
                        font-family: 'Courier New', monospace;
                        font-size: 0.85rem;
                        font-weight: 600;
                    ">✖ بستن</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // ============================================
    // ابزارها
    // ============================================
    function getBadges() {
        try {
            return JSON.parse(localStorage.getItem('cheese_earned_badges') || '{}');
        } catch (e) {
            return {};
        }
    }

    function formatDate(dateStr) {
        try {
            var d = new Date(dateStr);
            var persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
            var day = d.getDate();
            var month = d.getMonth();
            var year = d.getFullYear();
            return day + ' ' + persianMonths[month] + ' ' + year;
        } catch (e) {
            return dateStr;
        }
    }

    function escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // ============================================
    // API عمومی
    // ============================================
    window.ShareBadge = {
        share: shareBadge
    };

    window.copyBadgeText = function () {
        var textarea = document.getElementById('badgeTextArea');
        if (textarea) {
            textarea.select();
            document.execCommand('copy');
            if (window.LoadingUtils) {
                window.LoadingUtils.success('کپی شد!');
            }
            setTimeout(function () {
                var modal = document.getElementById('badgeShareModal');
                if (modal) modal.remove();
            }, 500);
        }
    };

    console.log('🏆 Share Badge ready!');

})();