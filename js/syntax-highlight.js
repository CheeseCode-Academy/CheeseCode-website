// ============================================
// 🧀 برجسته‌سازی سینتکس | CheeseCode Academy
// نسخه: 3.0.0 - Fixed completely
// ============================================

(function () {
    'use strict';

    var PYTHON_KEYWORDS = [
        'def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while',
        'break', 'continue', 'pass', 'import', 'from', 'as', 'try',
        'except', 'finally', 'raise', 'with', 'lambda', 'yield', 'global',
        'nonlocal', 'assert', 'del', 'in', 'is', 'not', 'and', 'or',
        'True', 'False', 'None', 'print', 'input', 'len', 'range',
        'int', 'str', 'float', 'list', 'dict', 'set', 'tuple', 'bool',
        'self', 'super', 'type', 'isinstance', 'enumerate', 'zip',
        'map', 'filter', 'sum', 'min', 'max', 'abs', 'round', 'open'
    ];

    var LINUX_COMMANDS = [
        'ls', 'cd', 'pwd', 'mkdir', 'rmdir', 'rm', 'cp', 'mv', 'touch',
        'cat', 'less', 'more', 'head', 'tail', 'grep', 'find', 'locate',
        'chmod', 'chown', 'chgrp', 'ps', 'top', 'htop', 'kill', 'killall',
        'ping', 'curl', 'wget', 'ssh', 'scp', 'rsync', 'tar', 'zip',
        'unzip', 'gzip', 'gunzip', 'man', 'sudo', 'su', 'apt', 'apt-get',
        'yum', 'dnf', 'pacman', 'systemctl', 'service', 'journalctl',
        'cron', 'crontab', 'alias', 'unalias', 'history', 'whoami',
        'id', 'uname', 'uptime', 'free', 'df', 'du', 'echo', 'export',
        'source', 'which', 'whereis', 'ln', 'file', 'stat', 'netstat',
        'ss', 'ufw', 'iptables', 'dmesg', 'mount', 'umount', 'fdisk',
        'lsblk', 'blkid', 'date', 'cal', 'who', 'w', 'last', 'reboot',
        'shutdown', 'exit', 'logout'
    ];

    // ============================================
    // Escape HTML (اول)
    // ============================================
    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ============================================
    // هایلایت پایتون — روش جدید و امن
    // ============================================
    function highlightPythonCode(rawCode) {
        // ۱. اول escape کن
        var text = escapeHtml(rawCode);

        // ۲. حالا با placeholder کار کن
        // از یه روش ایمن استفاده می‌کنیم: 
        // اول جایگزینی‌ها رو با placeholder انجام میدیم، بعد در آخر placeholder‌ها رو به span تبدیل می‌کنیم

        var placeholders = [];

        function addPlaceholder(className, content) {
            var id = '___PH' + placeholders.length + '___';
            placeholders.push({
                id: id,
                html: '<span class="' + className + '">' + content + '</span>'
            });
            return id;
        }

        // ۳. کامنت‌ها
        text = text.replace(/(#[^\n]*)/g, function (match) {
            return addPlaceholder('sh-comment', match);
        });

        // ۴. رشته‌ها
        text = text.replace(/(&quot;[^&\n]*?&quot;|&#39;[^&\n]*?&#39;)/g, function (match) {
            return addPlaceholder('sh-string', match);
        });

        // ۵. اعداد
        text = text.replace(/\b(\d+\.?\d*)\b/g, function (match) {
            return addPlaceholder('sh-number', match);
        });

        // ۶. کلمات کلیدی
        PYTHON_KEYWORDS.forEach(function (kw) {
            var regex = new RegExp('\\b(' + kw + ')\\b', 'g');
            text = text.replace(regex, function (match) {
                return addPlaceholder('sh-keyword', match);
            });
        });

        // ۷. حالا placeholderها رو با span جایگزین کن
        placeholders.forEach(function (ph) {
            text = text.split(ph.id).join(ph.html);
        });

        return text;
    }

    // ============================================
    // هایلایت لینوکس
    // ============================================
    function highlightLinuxCode(rawCode) {
        var text = escapeHtml(rawCode);
        var placeholders = [];

        function addPlaceholder(className, content) {
            var id = '___PH' + placeholders.length + '___';
            placeholders.push({
                id: id,
                html: '<span class="' + className + '">' + content + '</span>'
            });
            return id;
        }

        // کامنت‌ها
        text = text.replace(/(#[^\n]*)/g, function (match) {
            return addPlaceholder('sh-comment', match);
        });

        // دستورات
        LINUX_COMMANDS.forEach(function (cmd) {
            var regex = new RegExp('(^|[\\s;|&])(' + cmd + ')(?=\\s|$|[;|&])', 'gm');
            text = text.replace(regex, function (match, p1, p2) {
                return p1 + addPlaceholder('sh-command', p2);
            });
        });

        // فلگ‌ها
        text = text.replace(/(\s)(--?[a-zA-Z][a-zA-Z\-]*)/g, function (match, p1, p2) {
            return p1 + addPlaceholder('sh-flag', p2);
        });

        // جایگزینی placeholderها
        placeholders.forEach(function (ph) {
            text = text.split(ph.id).join(ph.html);
        });

        return text;
    }

    // ============================================
    // پردازش کد بلاک‌ها
    // ============================================
    function highlightAll() {
        var codeBlocks = document.querySelectorAll('.code-block:not([data-highlighted])');

        codeBlocks.forEach(function (block) {
            if (block.getAttribute('data-highlighted') === 'true') return;

            var oldBtn = block.querySelector('.copy-code-btn');
            if (oldBtn) oldBtn.remove();

            var rawCode = block.textContent || block.innerText;

            if (!rawCode || rawCode.trim() === '') return;

            try {
                block.innerHTML = highlightPythonCode(rawCode);
                block.setAttribute('data-highlighted', 'true');
                addCopyButton(block, rawCode);
            } catch (err) {
                console.warn('⚠️ خطا در هایلایت:', err);
                block.textContent = rawCode;
            }
        });

        var linuxBlocks = document.querySelectorAll('.code-block-output:not([data-highlighted])');

        linuxBlocks.forEach(function (block) {
            if (block.getAttribute('data-highlighted') === 'true') return;

            var oldBtn = block.querySelector('.copy-code-btn');
            if (oldBtn) oldBtn.remove();

            var rawCode = block.textContent || block.innerText;
            if (!rawCode || rawCode.trim() === '') return;

            try {
                block.innerHTML = highlightLinuxCode(rawCode);
                block.setAttribute('data-highlighted', 'true');
                addCopyButton(block, rawCode);
            } catch (err) {
                console.warn('⚠️ خطا در هایلایت:', err);
                block.textContent = rawCode;
            }
        });
    }

    // ============================================
    // دکمه‌ی کپی
    // ============================================
    function addCopyButton(block, rawCode) {
        if (block.querySelector('.copy-code-btn')) return;

        if (getComputedStyle(block).position === 'static') {
            block.style.position = 'relative';
        }

        var btn = document.createElement('button');
        btn.className = 'copy-code-btn';
        btn.innerHTML = '📋';
        btn.title = 'کپی کد';
        btn.style.cssText = `
            position: absolute;
            top: 8px;
            left: 8px;
            background: rgba(245, 184, 27, 0.15);
            border: 1px solid rgba(245, 184, 27, 0.3);
            border-radius: 6px;
            padding: 0.3rem 0.5rem;
            color: #f5b81b;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
            transition: all 0.2s ease;
            z-index: 5;
        `;

        btn.onmouseover = function () {
            this.style.background = 'rgba(245, 184, 27, 0.25)';
        };
        btn.onmouseout = function () {
            this.style.background = 'rgba(245, 184, 27, 0.15)';
        };

        btn.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();

            if (navigator.clipboard) {
                navigator.clipboard.writeText(rawCode).then(function () {
                    btn.innerHTML = '✅';
                    if (window.LoadingUtils) {
                        window.LoadingUtils.success('کد کپی شد!');
                    }
                    setTimeout(function () { btn.innerHTML = '📋'; }, 1500);
                }).catch(function () {
                    fallbackCopy(rawCode, btn);
                });
            } else {
                fallbackCopy(rawCode, btn);
            }
        };

        block.appendChild(btn);
    }

    function fallbackCopy(text, btn) {
        var textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            btn.innerHTML = '✅';
            if (window.LoadingUtils) {
                window.LoadingUtils.success('کد کپی شد!');
            }
            setTimeout(function () { btn.innerHTML = '📋'; }, 1500);
        } catch (e) {
            if (window.LoadingUtils) {
                window.LoadingUtils.error('کپی نشد!');
            }
        }
        document.body.removeChild(textarea);
    }

    // ============================================
    // MutationObserver
    // ============================================
    function observeChanges() {
        if (!window.MutationObserver) return;

        var debounceTimer = null;

        var observer = new MutationObserver(function (mutations) {
            var shouldHighlight = false;

            mutations.forEach(function (m) {
                m.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('code-block') && !node.hasAttribute('data-highlighted')) {
                            shouldHighlight = true;
                        }
                        if (node.querySelector && node.querySelector('.code-block:not([data-highlighted])')) {
                            shouldHighlight = true;
                        }
                    }
                });
            });

            if (shouldHighlight) {
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(highlightAll, 150);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ============================================
    // شروع
    // ============================================
    function init() {
        setTimeout(function () {
            highlightAll();
            observeChanges();
            console.log('🎨 Syntax Highlight ready! (v3.0.0)');
        }, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.SyntaxHighlight = {
        refresh: highlightAll,
        python: highlightPythonCode,
        linux: highlightLinuxCode
    };

})();