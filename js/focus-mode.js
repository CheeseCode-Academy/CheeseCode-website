// ============================================
// 🧀 حالت تمرکز | CheeseCode Academy
// نسخه: 1.0.0
// ============================================

(function () {
    'use strict';

    var isFocused = false;

    // ============================================
    // فعال/غیرفعال کردن حالت تمرکز
    // ============================================
    function toggleFocusMode() {
        isFocused = !isFocused;
        document.body.classList.toggle('focus-mode', isFocused);

        var btn = document.getElementById('focusToggle');
        if (btn) {
            btn.textContent = isFocused ? '✖' : '🧘';
            btn.title = isFocused ? 'خروج از حالت تمرکز' : 'حالت تمرکز';
        }

        // ذخیره در localStorage
        try {
            localStorage.setItem('cheese_focus_mode', isFocused ? 'true' : 'false');
        } catch (e) { }

        console.log('🧘 حالت تمرکز:', isFocused ? 'روشن' : 'خاموش');
    }

    // ============================================
    // بازیابی حالت
    // ============================================
    function restoreFocusMode() {
        try {
            var saved = localStorage.getItem('cheese_focus_mode');
            if (saved === 'true') {
                isFocused = true;
                document.body.classList.add('focus-mode');
                var btn = document.getElementById('focusToggle');
                if (btn) {
                    btn.textContent = '✖';
                    btn.title = 'خروج از حالت تمرکز';
                }
            }
        } catch (e) { }
    }

    // ============================================
    // شروع
    // ============================================
    function init() {
        var btn = document.getElementById('focusToggle');
        if (!btn) return;

        btn.addEventListener('click', toggleFocusMode);

        // ذخیره در localStorage
        try {
            var saved = localStorage.getItem('cheese_focus_mode');
            if (saved === 'true') {
                isFocused = true;
                document.body.classList.add('focus-mode');
                btn.textContent = '✖';
                btn.title = 'خروج از حالت تمرکز';
            }
        } catch (e) { }

        // ESC برای خروج
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isFocused) {
                toggleFocusMode();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.FocusMode = {
        toggle: toggleFocusMode,
        isActive: function () { return isFocused; }
    };

})();