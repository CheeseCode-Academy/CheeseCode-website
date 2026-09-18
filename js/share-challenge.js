// ============================================
// 🧀 اشتراک‌گذاری چالش | CheeseCode Academy
// نسخه: 1.0.0
// ============================================

(function () {
    'use strict';

    // ============================================
    // اشتراک‌گذاری چالش
    // ============================================
    function shareChallenge(challenge) {
        if (!challenge) return;

        var baseUrl = window.location.origin + window.location.pathname;
        var shareUrl = baseUrl + '?challenge=' + encodeURIComponent(challenge.id);

        var shareText = '🧀 چالش CheeseCode\n\n' +
            '📝 ' + challenge.title + '\n\n' +
            '💡 ' + (challenge.description || '') + '\n\n' +
            '🎯 بیا حلش کنیم و نشان بگیریم!';

        var shareData = {
            title: 'CheeseCode | ' + challenge.title,
            text: shareText,
            url: shareUrl
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(function () {
                    console.log('✅ اشتراک‌گذاری موفق');
                    if (window.LoadingUtils) {
                        window.LoadingUtils.success('اشتراک‌گذاری شد!');
                    }
                })
                .catch(function (err) {
                    if (err.name !== 'AbortError') {
                        fallbackShare(shareUrl, shareText, challenge.title);
                    }
                });
        } else {
            fallbackShare(shareUrl, shareText, challenge.title);
        }
    }

    function fallbackShare(url, text, title) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text + '\n\n' + url).then(function () {
                if (window.LoadingUtils) {
                    window.LoadingUtils.success('لینک کپی شد!');
                }
            }).catch(function () {
                showShareModal(url, text, title);
            });
        } else {
            showShareModal(url, text, title);
        }
    }

    // ============================================
    // مودال اشتراک‌گذاری
    // ============================================
    function showShareModal(url, text, title) {
        var old = document.getElementById('challengeShareModal');
        if (old) old.remove();

        var modal = document.createElement('div');
        modal.id = 'challengeShareModal';
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

        var content = document.createElement('div');
        content.style.cssText = `
            background: rgba(15, 22, 38, 0.98);
            border: 1px solid rgba(245, 184, 27, 0.3);
            border-radius: 20px;
            padding: 1.5rem;
            max-width: 500px;
            width: 100%;
            animation: modalSlide 0.3s ease;
        `;

        content.innerHTML = `
            <h3 style="color: #f5b81b; margin: 0 0 0.5rem 0; text-align: center; font-size: 1.1rem;">
                🎯 اشتراک‌گذاری چالش
            </h3>
            <p style="color: rgba(255, 255, 255, 0.5); font-size: 0.8rem; margin: 0 0 1rem 0; text-align: center;">
                ${escapeHtml(title)}
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
                font-size: 0.8rem;
                line-height: 1.6;
                resize: none;
                box-sizing: border-box;
                direction: rtl;
                margin-bottom: 1rem;
            " id="shareTextArea">${escapeHtml(text + '\n\n' + url)}</textarea>
            
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="copyChallengeShare()" style="
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
                
                <button onclick="document.getElementById('challengeShareModal').remove()" style="
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
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) modal.remove();
        });
    }

    // ============================================
    // کپی
    // ============================================
    function copyChallengeShare() {
        var textarea = document.getElementById('shareTextArea');
        if (!textarea) return;

        textarea.select();
        try {
            document.execCommand('copy');
            if (window.LoadingUtils) {
                window.LoadingUtils.success('کپی شد!');
            }
            setTimeout(function () {
                var modal = document.getElementById('challengeShareModal');
                if (modal) modal.remove();
            }, 1000);
        } catch (e) {
            if (window.LoadingUtils) {
                window.LoadingUtils.error('کپی نشد!');
            }
        }
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    // ============================================
    // ساخت دکمه‌ی اشتراک‌گذاری
    // ============================================
    function createShareButton(challenge) {
        var btn = document.createElement('button');
        btn.className = 'challenge-share-btn';
        btn.innerHTML = '🔗 اشتراک‌گذاری';
        btn.title = 'اشتراک‌گذاری چالش';
        btn.style.cssText = `
            background: rgba(0, 212, 255, 0.08);
            border: 1px solid rgba(0, 212, 255, 0.2);
            padding: 0.6rem 1.2rem;
            border-radius: 10px;
            color: #00d4ff;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-top: 1rem;
        `;
        btn.onmouseover = function () {
            this.style.background = 'rgba(0, 212, 255, 0.15)';
            this.style.borderColor = 'rgba(0, 212, 255, 0.4)';
            this.style.transform = 'scale(1.02)';
        };
        btn.onmouseout = function () {
            this.style.background = 'rgba(0, 212, 255, 0.08)';
            this.style.borderColor = 'rgba(0, 212, 255, 0.2)';
            this.style.transform = 'scale(1)';
        };
        btn.onclick = function () {
            shareChallenge(challenge);
        };

        return btn;
    }

    // ============================================
    // API عمومی
    // ============================================
    window.ShareChallenge = {
        share: shareChallenge,
        createButton: createShareButton
    };

    window.copyChallengeShare = copyChallengeShare;

    console.log('🎯 Share Challenge ready!');

})();