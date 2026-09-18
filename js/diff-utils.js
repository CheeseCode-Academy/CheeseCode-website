// ============================================
// 🧀 مقایسه کد | CheeseCode Academy
// نسخه: 1.0.0
// ============================================

(function () {
    'use strict';

    // ============================================
    // الگوریتم LCS برای diff
    // ============================================
    function computeDiff(oldLines, newLines) {
        var m = oldLines.length;
        var n = newLines.length;

        // جدول LCS
        var dp = [];
        for (var i = 0; i <= m; i++) {
            dp[i] = [];
            for (var j = 0; j <= n; j++) {
                dp[i][j] = 0;
            }
        }

        for (var i = 1; i <= m; i++) {
            for (var j = 1; j <= n; j++) {
                if (oldLines[i - 1] === newLines[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }

        // بازسازی diff
        var result = [];
        var i = m, j = n;

        while (i > 0 || j > 0) {
            if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
                result.unshift({ type: 'equal', line: oldLines[i - 1] });
                i--;
                j--;
            } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
                result.unshift({ type: 'add', line: newLines[j - 1] });
                j--;
            } else if (i > 0) {
                result.unshift({ type: 'remove', line: oldLines[i - 1] });
                i--;
            }
        }

        return result;
    }

    // ============================================
    // نمایش diff
    // ============================================
    function showDiff(userCode, correctCode, options) {
        options = options || {};
        var title = options.title || 'مقایسه کد';

        // تقسیم به خطوط
        var userLines = userCode.trim().split('\n');
        var correctLines = correctCode.trim().split('\n');

        // محاسبه diff
        var diff = computeDiff(userLines, correctLines);

        // آمار
        var stats = {
            add: 0,
            remove: 0,
            equal: 0
        };
        diff.forEach(function (d) {
            stats[d.type]++;
        });

        // ساخت مودال
        var modal = document.createElement('div');
        modal.id = 'diffModal';
        modal.style.cssText = `
            display: flex;
            position: fixed;
            z-index: 10004;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            justify-content: center;
            align-items: center;
            padding: 1rem;
            direction: rtl;
            font-family: 'Courier New', monospace;
        `;

        var content = document.createElement('div');
        content.style.cssText = `
            background: rgba(15, 22, 38, 0.98);
            border: 1px solid rgba(245, 184, 27, 0.3);
            border-radius: 20px;
            padding: 1.5rem;
            width: 100%;
            max-width: 700px;
            max-height: 90vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
            border-top: 2px solid #f5b81b;
            animation: modalSlide 0.3s ease;
        `;

        // هدر
        var header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
            padding-bottom: 0.8rem;
            border-bottom: 1px solid rgba(245, 184, 27, 0.2);
        `;

        var titleEl = document.createElement('h3');
        titleEl.textContent = '🔍 ' + title;
        titleEl.style.cssText = `
            color: #f5b81b;
            margin: 0;
            font-size: 1.1rem;
        `;

        var closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
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
        `;
        closeBtn.onmouseover = function () {
            this.style.color = '#ff4444';
            this.style.background = 'rgba(255, 68, 68, 0.1)';
        };
        closeBtn.onmouseout = function () {
            this.style.color = 'rgba(255, 255, 255, 0.5)';
            this.style.background = 'transparent';
        };
        closeBtn.onclick = function () {
            modal.remove();
            document.body.style.overflow = 'auto';
        };

        header.appendChild(titleEl);
        header.appendChild(closeBtn);

        // آمار
        var statsEl = document.createElement('div');
        statsEl.style.cssText = `
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1rem;
            flex-wrap: wrap;
        `;

        statsEl.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                gap: 0.4rem;
                background: rgba(0, 255, 100, 0.1);
                border: 1px solid rgba(0, 255, 100, 0.3);
                color: #00ff64;
                padding: 0.4rem 0.8rem;
                border-radius: 20px;
                font-size: 0.75rem;
            ">
                <span style="font-weight: bold;">+</span>
                <span>${toPersianNumber(stats.add)} خط اضافه</span>
            </div>
            <div style="
                display: flex;
                align-items: center;
                gap: 0.4rem;
                background: rgba(255, 68, 68, 0.1);
                border: 1px solid rgba(255, 68, 68, 0.3);
                color: #ff6b6b;
                padding: 0.4rem 0.8rem;
                border-radius: 20px;
                font-size: 0.75rem;
            ">
                <span style="font-weight: bold;">−</span>
                <span>${toPersianNumber(stats.remove)} خط حذف</span>
            </div>
            <div style="
                display: flex;
                align-items: center;
                gap: 0.4rem;
                background: rgba(245, 184, 27, 0.1);
                border: 1px solid rgba(245, 184, 27, 0.3);
                color: #f5b81b;
                padding: 0.4rem 0.8rem;
                border-radius: 20px;
                font-size: 0.75rem;
            ">
                <span style="font-weight: bold;">=</span>
                <span>${toPersianNumber(stats.equal)} خط یکسان</span>
            </div>
        `;

        // بدنه‌ی diff
        var diffBody = document.createElement('div');
        diffBody.style.cssText = `
            flex: 1;
            overflow-y: auto;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(245, 184, 27, 0.1);
            border-radius: 10px;
            padding: 0.8rem;
            direction: ltr;
            text-align: left;
            font-size: 0.8rem;
            line-height: 1.6;
            max-height: 55vh;
        `;

        diff.forEach(function (d) {
            var lineEl = document.createElement('div');
            lineEl.style.cssText = `
                padding: 0.15rem 0.5rem;
                border-radius: 4px;
                margin-bottom: 2px;
                white-space: pre-wrap;
                word-break: break-all;
                font-family: 'Courier New', monospace;
            `;

            if (d.type === 'add') {
                lineEl.style.background = 'rgba(0, 255, 100, 0.1)';
                lineEl.style.borderLeft = '3px solid #00ff64';
                lineEl.innerHTML = '<span style="color: #00ff64; font-weight: bold; user-select: none;">+ </span>' +
                    '<span style="color: rgba(255, 255, 255, 0.9);">' + escapeHtml(d.line || ' ') + '</span>';
            } else if (d.type === 'remove') {
                lineEl.style.background = 'rgba(255, 68, 68, 0.1)';
                lineEl.style.borderLeft = '3px solid #ff6b6b';
                lineEl.innerHTML = '<span style="color: #ff6b6b; font-weight: bold; user-select: none;">− </span>' +
                    '<span style="color: rgba(255, 255, 255, 0.6); text-decoration: line-through;">' + escapeHtml(d.line || ' ') + '</span>';
            } else {
                lineEl.style.background = 'transparent';
                lineEl.style.borderLeft = '3px solid transparent';
                lineEl.innerHTML = '<span style="color: rgba(255, 255, 255, 0.4); user-select: none;">  </span>' +
                    '<span style="color: rgba(255, 255, 255, 0.6);">' + escapeHtml(d.line || ' ') + '</span>';
            }

            diffBody.appendChild(lineEl);
        });

        // پیام
        var message = document.createElement('div');
        message.style.cssText = `
            margin-top: 1rem;
            padding: 0.8rem;
            border-radius: 10px;
            text-align: center;
            font-size: 0.85rem;
        `;

        if (stats.add === 0 && stats.remove === 0) {
            message.style.background = 'rgba(0, 255, 100, 0.1)';
            message.style.border = '1px solid rgba(0, 255, 100, 0.3)';
            message.style.color = '#00ff64';
            message.innerHTML = '🎉 کد شما دقیقاً مثل جوابه!';
        } else if (stats.add + stats.remove <= 3) {
            message.style.background = 'rgba(245, 184, 27, 0.1)';
            message.style.border = '1px solid rgba(245, 184, 27, 0.3)';
            message.style.color = '#f5b81b';
            message.innerHTML = '👍 خیلی نزدیک بودی! فقط چند تا خط فرق داره.';
        } else {
            message.style.background = 'rgba(0, 212, 255, 0.1)';
            message.style.border = '1px solid rgba(0, 212, 255, 0.3)';
            message.style.color = '#00d4ff';
            message.innerHTML = '💪 هنوز راه داری! به تفاوت‌ها نگاه کن.';
        }

        content.appendChild(header);
        content.appendChild(statsEl);
        content.appendChild(diffBody);
        content.appendChild(message);
        modal.appendChild(content);

        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';

        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        });

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                modal.remove();
                document.body.style.overflow = 'auto';
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // ============================================
    // ابزارها
    // ============================================
    function escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function toPersianNumber(num) {
        var persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(num).replace(/\d/g, function (d) { return persian[d]; });
    }

    // ============================================
    // API عمومی
    // ============================================
    window.DiffUtils = {
        show: showDiff,
        compute: computeDiff
    };

    console.log('🔍 Diff Utils ready!');

})();