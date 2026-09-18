// ============================================
// 🧀 بوکمارک درس‌ها | CheeseCode Academy
// نسخه: 2.0.0 - پشتیبانی از ناوبری
// ============================================

(function () {
    'use strict';

    var BOOKMARKS_KEY = 'cheese_bookmarks';

    // ============================================
    // ذخیره‌سازی
    // ============================================
    function getAllBookmarks() {
        try {
            return JSON.parse(localStorage.getItem(BOOKMARKS_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function saveAllBookmarks(bookmarks) {
        try {
            localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
            return true;
        } catch (e) {
            return false;
        }
    }

    function isBookmarked(lessonKey) {
        var bookmarks = getAllBookmarks();
        return !!bookmarks[lessonKey];
    }

    function addBookmark(lessonKey, lessonTitle, courseType) {
        var bookmarks = getAllBookmarks();
        bookmarks[lessonKey] = {
            title: lessonTitle,
            course: courseType,
            date: new Date().toISOString()
        };
        return saveAllBookmarks(bookmarks);
    }

    function removeBookmark(lessonKey) {
        var bookmarks = getAllBookmarks();
        delete bookmarks[lessonKey];
        return saveAllBookmarks(bookmarks);
    }

    function toggleBookmark(lessonKey, lessonTitle, courseType) {
        if (isBookmarked(lessonKey)) {
            removeBookmark(lessonKey);
            return false;
        } else {
            addBookmark(lessonKey, lessonTitle, courseType);
            return true;
        }
    }

    function getBookmarksCount() {
        return Object.keys(getAllBookmarks()).length;
    }

    function getAllBookmarksArray() {
        var bookmarks = getAllBookmarks();
        var result = [];

        for (var key in bookmarks) {
            result.push({
                key: key,
                title: bookmarks[key].title,
                course: bookmarks[key].course,
                date: bookmarks[key].date
            });
        }

        result.sort(function (a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        return result;
    }

    // ============================================
    // ناوبری — لینک‌سازی
    // ============================================
    function buildBookmarkUrl(lessonKey, courseType) {
        var pageMap = {
            'python': 'python.html',
            'linux': 'linux.html',
            'answers-python': 'answers-python.html',
            'answers-linux': 'answers-linux.html',
            'python-quiz': 'python-quiz.html',
            'linux-quiz': 'linux-quiz.html'
        };

        var page = pageMap[courseType] || 'python.html';
        // ?lesson=<file> برای باز کردن خودکار مودال
        return page + '?lesson=' + encodeURIComponent(lessonKey);
    }

    function buildNoteUrl(lessonKey, courseType) {
        var pageMap = {
            'python': 'python.html',
            'linux': 'linux.html',
            'answers-python': 'answers-python.html',
            'answers-linux': 'answers-linux.html',
            'python-quiz': 'python-quiz.html',
            'linux-quiz': 'linux-quiz.html'
        };

        var page = pageMap[courseType] || 'python.html';
        // ?lesson=<file>&notes=1 برای باز کردن مودال + یادداشت
        return page + '?lesson=' + encodeURIComponent(lessonKey) + '&notes=1';
    }

    // ============================================
    // ساخت دکمه‌ی بوکمارک
    // ============================================
    function createBookmarkButton(lessonKey, lessonTitle, courseType) {
        var btn = document.createElement('button');
        btn.className = 'bookmark-btn';
        btn.innerHTML = isBookmarked(lessonKey) ? '⭐' : '☆';
        btn.title = isBookmarked(lessonKey) ? 'حذف از نشان‌شده‌ها' : 'افزودن به نشان‌شده‌ها';
        btn.style.cssText = `
            position: absolute;
            top: 0.2rem;
            left: 10rem;
            background: rgba(245, 184, 27, 0.1);
            border: 1px solid rgba(245, 184, 27, 0.3);
            border-radius: 8px;
            padding: 0.4rem 0.7rem;
            color: #f5b81b;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            z-index: 11;
            transition: all 0.2s ease;
        `;

        btn.onmouseover = function () {
            this.style.background = 'rgba(245, 184, 27, 0.2)';
            this.style.transform = 'scale(1.05)';
        };
        btn.onmouseout = function () {
            this.style.background = 'rgba(245, 184, 27, 0.1)';
            this.style.transform = 'scale(1)';
        };

        btn.onclick = function () {
            var isNowBookmarked = toggleBookmark(lessonKey, lessonTitle, courseType);
            btn.innerHTML = isNowBookmarked ? '⭐' : '☆';
            btn.title = isNowBookmarked ? 'حذف از نشان‌شده‌ها' : 'افزودن به نشان‌شده‌ها';

            if (window.LoadingUtils) {
                if (isNowBookmarked) {
                    window.LoadingUtils.success('به نشان‌شده‌ها اضافه شد!');
                } else {
                    window.LoadingUtils.info('از نشان‌شده‌ها حذف شد');
                }
            }
        };

        return btn;
    }

    // ============================================
    // نمایش بخش نشان‌شده‌ها (برای settings)
    // ============================================
    function renderBookmarksSection(container) {
        var bookmarks = getAllBookmarksArray();

        if (bookmarks.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 1.5rem; color: rgba(255, 255, 255, 0.4); font-size: 0.85rem; font-family: 'Courier New', monospace;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">☆</div>
                    هنوز درسی رو نشان نکردی
                    <div style="font-size: 0.7rem; margin-top: 0.5rem; color: rgba(255, 255, 255, 0.3);">
                        کنار هر درس، ⭐ بزن
                    </div>
                </div>
            `;
            return;
        }

        var html = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';

        bookmarks.forEach(function (b) {
            var courseIcon = getCourseIcon(b.course);
            var url = buildBookmarkUrl(b.key, b.course);

            html += `
                <a href="${url}" class="bookmark-item" style="
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    background: rgba(245, 184, 27, 0.03);
                    border: 1px solid rgba(245, 184, 27, 0.1);
                    border-radius: 10px;
                    padding: 0.7rem 1rem;
                    font-family: 'Courier New', monospace;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    color: inherit;
                "
                onmouseover="this.style.background='rgba(245, 184, 27, 0.08)'; this.style.borderColor='rgba(0, 212, 255, 0.3)'"
                onmouseout="this.style.background='rgba(245, 184, 27, 0.03)'; this.style.borderColor='rgba(245, 184, 27, 0.1)'">
                    <span style="font-size: 1.2rem;">⭐</span>
                    <span style="font-size: 1rem;">${courseIcon}</span>
                    <div style="flex: 1; text-align: right;">
                        <div style="color: rgba(255, 255, 255, 0.85); font-size: 0.85rem;">${escapeHtml(b.title)}</div>
                        <div style="color: rgba(255, 255, 255, 0.4); font-size: 0.7rem; margin-top: 0.2rem;">${getCourseName(b.course)}</div>
                    </div>
                    <span style="color: rgba(0, 212, 255, 0.5); font-size: 0.9rem;">❯</span>
                </a>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // ============================================
    // نمایش بخش یادداشت‌ها
    // ============================================
    function renderNotesSection(container) {
        var notes = [];
        if (window.NotesUtils) {
            notes = window.NotesUtils.getAllArray();
        }

        if (notes.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 1.5rem; color: rgba(255, 255, 255, 0.4); font-size: 0.85rem; font-family: 'Courier New', monospace;">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📝</div>
                    هنوز یادداشتی نداری
                    <div style="font-size: 0.7rem; margin-top: 0.5rem; color: rgba(255, 255, 255, 0.3);">
                        توی هر درس، 📝 بزن
                    </div>
                </div>
            `;
            return;
        }

        var html = '<div style="display: flex; flex-direction: column; gap: 0.5rem;">';

        notes.forEach(function (n) {
            var courseIcon = getCourseIcon(n.course);
            var url = buildNoteUrl(n.key, n.course);
            var preview = n.text.length > 60 ? n.text.substring(0, 60) + '...' : n.text;

            html += `
                <a href="${url}" class="note-item" style="
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    background: rgba(0, 212, 255, 0.03);
                    border: 1px solid rgba(0, 212, 255, 0.1);
                    border-radius: 10px;
                    padding: 0.7rem 1rem;
                    font-family: 'Courier New', monospace;
                    text-decoration: none;
                    transition: all 0.2s ease;
                    color: inherit;
                "
                onmouseover="this.style.background='rgba(0, 212, 255, 0.08)'; this.style.borderColor='rgba(0, 212, 255, 0.3)'"
                onmouseout="this.style.background='rgba(0, 212, 255, 0.03)'; this.style.borderColor='rgba(0, 212, 255, 0.1)'">
                    <span style="font-size: 1.2rem;">📝</span>
                    <span style="font-size: 1rem;">${courseIcon}</span>
                    <div style="flex: 1; text-align: right; min-width: 0;">
                        <div style="color: rgba(255, 255, 255, 0.85); font-size: 0.85rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(n.title)}</div>
                        <div style="color: rgba(255, 255, 255, 0.4); font-size: 0.7rem; margin-top: 0.2rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; direction: rtl;">${escapeHtml(preview)}</div>
                    </div>
                    <span style="color: rgba(0, 212, 255, 0.5); font-size: 0.9rem;">❯</span>
                </a>
            `;
        });

        html += '</div>';
        container.innerHTML = html;
    }

    // ============================================
    // ابزارها
    // ============================================
    function getCourseIcon(course) {
        var icons = {
            'python': '🐍',
            'linux': '🐧',
            'answers-python': '📝',
            'answers-linux': '📝',
            'python-quiz': '🎓',
            'linux-quiz': '🎓'
        };
        return icons[course] || '📄';
    }

    function getCourseName(course) {
        var names = {
            'python': '🐍 دوره پایتون',
            'linux': '🐧 دوره لینوکس',
            'answers-python': '📝 پاسخ‌های پایتون',
            'answers-linux': '📝 پاسخ‌های لینوکس',
            'python-quiz': '🎓 کوییز پایتون',
            'linux-quiz': '🎓 کوییز لینوکس'
        };
        return names[course] || course;
    }

    function escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    // ============================================
    // API عمومی
    // ============================================
    window.BookmarksUtils = {
        isBookmarked: isBookmarked,
        add: addBookmark,
        remove: removeBookmark,
        toggle: toggleBookmark,
        count: getBookmarksCount,
        getAll: getAllBookmarks,
        getAllArray: getAllBookmarksArray,
        createButton: createBookmarkButton,
        render: renderBookmarksSection,
        renderNotes: renderNotesSection,
        buildUrl: buildBookmarkUrl,
        buildNoteUrl: buildNoteUrl
    };

    console.log('⭐ Bookmarks ready! (v2.0.0)');

})();