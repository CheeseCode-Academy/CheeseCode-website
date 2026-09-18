// ============================================
// 🧀 مقایسه با دوست | CheeseCode Academy
// نسخه: 1.0.0
// ============================================

(function () {
    'use strict';

    var COMPARE_KEY = 'cheese_challenge_compare_';

    // ============================================
    // ذخیره‌ی نتیجه‌ی کاربر
    // ============================================
    function saveMyResult(challengeId, score, timeSpent) {
        try {
            var key = COMPARE_KEY + challengeId + '_me';
            var result = {
                score: score,
                timeSpent: timeSpent,
                date: new Date().toISOString(),
                user: 'من'
            };
            localStorage.setItem(key, JSON.stringify(result));
            return true;
        } catch (e) {
            return false;
        }
    }

    function getMyResult(challengeId) {
        try {
            var key = COMPARE_KEY + challengeId + '_me';
            return JSON.parse(localStorage.getItem(key) || 'null');
        } catch (e) {
            return null;
        }
    }

    // ============================================
    // لینک چالش
    // ============================================
    function generateChallengeLink(challengeId, challengeTitle) {
        var baseUrl = window.location.origin + window.location.pathname;
        var link = baseUrl + '?challenge=' + encodeURIComponent(challengeId);
        return link;
    }

    // ============================================
    // اشتراک‌گذاری برای مقایسه
    // ============================================
    function shareForCompare(challenge) {
        if (!challenge) return;

        var link = generateChallengeLink(challenge.id, challenge.title);
        var myResult = getMyResult(challenge.id);

        var text = '🧀 چالش CheeseCode\n\n' +
            '🎯 ' + challenge.title + '\n\n' +
            '📝 ' + challenge.description + '\n\n';

        if (myResult) {
            text += '✅ من حلش کردم! (نمره: ' + myResult.score + ')\n\n';
            text += '💪 حالا نوبت توئه! بیا ببینیم کی بهتره!\n\n';
        } else {
            text += '💪 بیا با هم حلش کنیم و نتیجه رو مقایسه کنیم!\n\n';
        }

        text += link;

        if (navigator.share) {
            navigator.share({
                title: 'CheeseCode Challenge | ' + challenge.title,
                text: text,
                url: link
            }).then(function () {
                if (window.LoadingUtils) {
                    window.LoadingUtils.success('لینک چالش ارسال شد!');
                }
            }).catch(function (err) {
                if (err.name !== 'AbortError') {
                    fallbackCopy(text);
                }
            });
        } else {
            fallbackCopy(text);
        }
    }

    function fallbackCopy(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(function () {
                if (window.LoadingUtils) {
                    window.LoadingUtils.success('لینک چالش کپی شد!');
                }
            }).catch(function () {
                showCompareModal(text);
            });
        } else {
            showCompareModal(text);
        }
    }

    function showCompareModal(text) {
        var old = document.getElementById('compareModal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'compareModal';
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
            ">
                <h3 style="color: #f5b81b; margin: 0 0 1rem 0; text-align: center; font-size: 1.1rem;">
                    🆚 مقایسه با دوست
                </h3>
                <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.8rem; margin: 0 0 1rem 0; text-align: center;">
                    این متن رو برای دوستت بفرست:
                </p>
                <textarea readonly style="
                    width: 100%;
                    min-height: 150px;
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
                " id="compareTextArea">${escapeHtml(text)}</textarea>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="copyCompareText()" style="
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
                    ">📋 کپی</button>
                    <button onclick="document.getElementById('compareModal').remove()" style="
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

    function escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // ============================================
    // ساخت دکمه‌ی مقایسه
    // ============================================
    function createCompareButton(challenge) {
        var btn = document.createElement('button');
        btn.className = 'compare-btn';
        btn.innerHTML = '🆚 مقایسه با دوست';
        btn.title = 'چالش رو برای دوستت بفرست';
        btn.style.cssText = `
            background: rgba(245, 184, 27, 0.08);
            border: 1px solid rgba(245, 184, 27, 0.25);
            padding: 0.6rem 1.2rem;
            border-radius: 10px;
            color: #f5b81b;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 1rem;
            margin-right: 0.5rem;
        `;
        btn.onmouseover = function () {
            this.style.background = 'rgba(245, 184, 27, 0.15)';
            this.style.borderColor = 'rgba(245, 184, 27, 0.5)';
            this.style.transform = 'scale(1.02)';
        };
        btn.onmouseout = function () {
            this.style.background = 'rgba(245, 184, 27, 0.08)';
            this.style.borderColor = 'rgba(245, 184, 27, 0.25)';
            this.style.transform = 'scale(1)';
        };
        btn.onclick = function () {
            shareForCompare(challenge);
        };

        return btn;
    }

    // ============================================
    // پارامتر URL برای challenge
    // ============================================
    function checkChallengeParam() {
        var params = new URLSearchParams(window.location.search);
        var challengeId = params.get('challenge');

        if (challengeId) {
            // ذخیره برای نمایش
            try {
                localStorage.setItem('cheese_challenge_from_friend', challengeId);
            } catch (e) { }

            // نمایش پیام
            setTimeout(function () {
                if (window.LoadingUtils) {
                    window.LoadingUtils.info('🎯 دوستت این چالش رو برات فرستاده!');
                }
            }, 2000);
        }
    }

    // ============================================
    // API عمومی
    // ============================================
    window.ChallengeCompare = {
        share: shareForCompare,
        createButton: createCompareButton,
        saveMyResult: saveMyResult,
        getMyResult: getMyResult
    };

    window.copyCompareText = function () {
        var textarea = document.getElementById('compareTextArea');
        if (textarea) {
            textarea.select();
            document.execCommand('copy');
            if (window.LoadingUtils) {
                window.LoadingUtils.success('کپی شد!');
            }
            setTimeout(function () {
                var modal = document.getElementById('compareModal');
                if (modal) modal.remove();
            }, 500);
        }
    };

    // چک کردن پارامتر
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', checkChallengeParam);
    } else {
        checkChallengeParam();
    }

    console.log('🆚 Challenge Compare ready!');

})();