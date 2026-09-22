// ============================================
// قفل مرحله‌ای درس + اتصال به کوییز | CheeseCode
// ============================================

(function () {
    'use strict';

    // ---------- تنظیمات ----------
    var REQUIRE_QUIZ = true;
    var QUIZ_MIN_SCORE = 70;
    var UNLOCK_MSG_KEY = 'cheese_unlock_msg';

    // ---------- کمک‌ها ----------
    function isLinuxPage() {
        return (location.pathname || '').toLowerCase().indexOf('linux') !== -1;
    }

    function courseType() {
        return isLinuxPage() ? 'linux' : 'python';
    }

    function progressKey() {
        return courseType() === 'linux'
            ? 'cheese_progress_linux'
            : 'cheese_progress_python';
    }

    function quizPassKey() {
        return courseType() === 'linux'
            ? 'cheese_quiz_pass_linux'
            : 'cheese_quiz_pass_python';
    }

    function lessonsConfig() {
        if (courseType() === 'linux') return window.linuxLessonsConfig || [];
        return window.pythonLessonsConfig || [];
    }

    function quizConfig() {
        if (courseType() === 'linux') return window.linuxQuizConfig || [];
        return window.pythonQuizConfig || [];
    }

    function getSeen() {
        try {
            return JSON.parse(localStorage.getItem(progressKey())) || {};
        } catch (e) {
            return {};
        }
    }

    function getQuizPass() {
        try {
            return JSON.parse(localStorage.getItem(quizPassKey())) || {};
        } catch (e) {
            return {};
        }
    }

    function toast(msg) {
        if (window.CheeseUtils && typeof CheeseUtils.showToast === 'function') {
            CheeseUtils.showToast(msg);
            return;
        }
        alert(msg);
    }

    // ---------- نگاشت lesson <-> quiz با شماره ----------
    function lessonToQuizFile(lessonFile) {
        var m = String(lessonFile).match(/lesson-(\d+)/);
        if (!m) return null;
        var num = m[1];
        var list = quizConfig();
        for (var i = 0; i < list.length; i++) {
            if (String(list[i].file).indexOf('quiz-' + num) !== -1) {
                return list[i].file;
            }
        }
        return null;
    }

    function quizToLessonFile(quizFile) {
        var m = String(quizFile).match(/quiz-(\d+)/);
        if (!m) return null;
        var num = m[1];
        var list = lessonsConfig();
        for (var i = 0; i < list.length; i++) {
            if (String(list[i].file).indexOf('lesson-' + num) !== -1) {
                return list[i].file;
            }
        }
        var idx = parseInt(num, 10) - 1;
        return list[idx] ? list[idx].file : null;
    }

    function findLessonIndex(file) {
        var list = lessonsConfig();
        for (var i = 0; i < list.length; i++) {
            if (list[i].file === file) return i;
        }
        return -1;
    }

    function isLessonComplete(file) {
        var seen = getSeen();
        if (!seen[file]) return false;
        if (!REQUIRE_QUIZ) return true;
        var quiz = getQuizPass();
        if (!quiz[file]) return false;
        return (quiz[file].score || 0) >= QUIZ_MIN_SCORE;
    }

    function isUnlocked(index) {
        if (index <= 0) return true;
        var list = lessonsConfig();
        var prev = list[index - 1];
        if (!prev) return true;
        return isLessonComplete(prev.file);
    }

    // ---------- API قفل ----------
    function markQuizPassed(lessonFile, score) {
        if (!lessonFile) return;
        var data = getQuizPass();
        data[lessonFile] = {
            score: score || 100,
            at: Date.now()
        };
        localStorage.setItem(quizPassKey(), JSON.stringify(data));
        applyLocks();
    }

    function applyLocks() {
        var list = lessonsConfig();
        if (!list.length) return;

        var items = document.querySelectorAll('.menu-item');
        items.forEach(function (item, i) {
            var file = item.getAttribute('data-file');
            var idx = file ? findLessonIndex(file) : i;
            if (idx < 0) idx = i;

            var unlocked = isUnlocked(idx);

            var old = item.querySelector('.lock-badge');
            if (old) old.remove();

            if (!unlocked) {
                item.classList.add('lesson-locked');
                item.style.opacity = '0.55';
                var badge = document.createElement('span');
                badge.className = 'lock-badge';
                badge.textContent = ' 🔒';
                item.appendChild(badge);
            } else {
                item.classList.remove('lesson-locked');
                item.style.opacity = '';
            }
        });
    }

    function guardLockedClicks() {
        document.addEventListener('click', function (e) {
            var item = e.target.closest && e.target.closest('.menu-item');
            if (!item || !item.classList.contains('lesson-locked')) return;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            toast(
                REQUIRE_QUIZ
                    ? 'اول درس قبلی را بخوان و کوییزش را قبول شو تا این درس باز شود.'
                    : 'اول درس قبلی را کامل کن تا این درس باز شود.'
            );
        }, true);
    }

    // ---------- دکمه «خوندم، بریم کوییز» در مودال درس ----------
    function addGoQuizButton(lesson) {
        if (!lesson || !lesson.file) return;

        var modalBody =
            document.getElementById('modalBody') ||
            document.querySelector('#lessonModal .modal-body') ||
            document.querySelector('#lessonModal .story-content') ||
            document.querySelector('#lessonModal .modal-content');

        if (!modalBody) return;

        var old = modalBody.querySelector('.go-quiz-btn');
        if (old) old.remove();

        var quizFile = lessonToQuizFile(lesson.file);
        if (!quizFile) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'go-quiz-btn';
        btn.textContent = 'خوندم، بریم کوییز';
        btn.style.cssText =
            'width:100%;margin-top:1.2rem;padding:0.9rem;border-radius:12px;' +
            'border:1px solid #f5b81b;background:rgba(245,184,27,0.15);' +
            'color:#f5b81b;font-size:1rem;cursor:pointer;';

        btn.onclick = function () {
            if (window.CheeseUtils && CheeseUtils.markAsSeen) {
                CheeseUtils.markAsSeen(lesson.file, courseType());
            }

            var quizPage = isLinuxPage() ? 'linux-quiz.html' : 'python-quiz.html';
            location.href = quizPage + '?open=' + encodeURIComponent(quizFile);
        };

        modalBody.appendChild(btn);
    }

    // هر بار مودال درس پر شد، دکمه را اضافه کن
    function watchLessonModal() {
        var observer = new MutationObserver(function () {
            // اگر CheeseUtils آخرین درس را ذخیره کرده باشد
            var last = null;
            try {
                if (window.CheeseUtils && CheeseUtils.getLastLesson) {
                    last = CheeseUtils.getLastLesson();
                } else {
                    last = JSON.parse(localStorage.getItem('cheese_last') || 'null');
                }
            } catch (e) {}

            if (!last || !last.file) return;

            // فقط اگر مودال باز است
            var modal = document.getElementById('lessonModal');
            if (!modal) return;
            var style = window.getComputedStyle(modal);
            if (style.display === 'none' || style.visibility === 'hidden') return;

            addGoQuizButton({ file: last.file, title: last.title || '' });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ---------- باز کردن خودکار کوییز با ?open= ----------
    function autoOpenQuizFromQuery() {
        var path = (location.pathname || '').toLowerCase();
        if (path.indexOf('quiz') === -1) return;

        var params = new URLSearchParams(location.search);
        var openFile = params.get('open');
        if (!openFile) return;

        var tries = 0;
        var timer = setInterval(function () {
            tries++;
            if (tries > 25) {
                clearInterval(timer);
                return;
            }

            // اگر API موتور کوییز موجود باشد
            if (window.QuizEngine) {
                if (typeof QuizEngine.load === 'function') {
                    clearInterval(timer);
                    QuizEngine.load(openFile);
                    return;
                }
                if (typeof QuizEngine.open === 'function') {
                    clearInterval(timer);
                    QuizEngine.open(openFile);
                    return;
                }
            }

            // کلیک روی آیتم منو
            var items = document.querySelectorAll('.menu-item');
            for (var i = 0; i < items.length; i++) {
                var outer = items[i].outerHTML || '';
                var dataFile = items[i].getAttribute('data-file') || '';
                if (dataFile === openFile || outer.indexOf(openFile) !== -1) {
                    clearInterval(timer);
                    items[i].click();
                    return;
                }
            }
        }, 200);
    }

    // ---------- بعد از تمام شدن کوییز (برای صدا زدن از quiz-engine) ----------
    function onQuizFinished(quizFile, score, passScore) {
        var min = typeof passScore === 'number' ? passScore : QUIZ_MIN_SCORE;
        var isPass = (score || 0) >= min;
        if (!isPass) return;

        var lessonFile = quizToLessonFile(quizFile);
        if (lessonFile) {
            markQuizPassed(lessonFile, score);
        }

        try {
            sessionStorage.setItem(
                UNLOCK_MSG_KEY,
                JSON.stringify({
                    lessonFile: lessonFile,
                    score: score,
                    at: Date.now()
                })
            );
        } catch (e) {}
    }

    // دکمه برگشت به دروس در نتیجه کوییز
    function injectBackToLessonsButton(container) {
        if (!container) return;
        if (container.querySelector('#btnBackToLessons')) return;

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'btnBackToLessons';
        btn.className = 'quiz-btn quiz-btn-primary';
        btn.textContent = 'برگردیم به دروس';
        btn.style.marginTop = '0.8rem';
        btn.onclick = function () {
            location.href = isLinuxPage() ? 'linux.html' : 'python.html';
        };
        container.appendChild(btn);
    }

    // ---------- پیام باز شدن درس بعدی در صفحه دوره ----------
    function showUnlockMessageIfAny() {
        var path = (location.pathname || '').toLowerCase();
        if (path.indexOf('python.html') === -1 && path.indexOf('linux.html') === -1) {
            // بعضی hostها path بدون .html
            if (path.indexOf('quiz') !== -1) return;
        }

        var raw = null;
        try {
            raw = sessionStorage.getItem(UNLOCK_MSG_KEY);
        } catch (e) {}
        if (!raw) return;

        try {
            sessionStorage.removeItem(UNLOCK_MSG_KEY);
            var data = JSON.parse(raw);
            toast('آفرین! کوییز قبول شد (' + data.score + '٪). درس بعدی برات باز شد.');
        } catch (e) {}
    }

    // ---------- API عمومی ----------
    window.LessonLock = {
        apply: applyLocks,
        markQuizPassed: markQuizPassed,
        onQuizFinished: onQuizFinished,
        lessonToQuizFile: lessonToQuizFile,
        quizToLessonFile: quizToLessonFile,
        addGoQuizButton: addGoQuizButton,
        injectBackToLessonsButton: injectBackToLessonsButton,
        unlockAll: function () {
            var list = lessonsConfig();
            var seen = getSeen();
            var quiz = getQuizPass();
            list.forEach(function (l) {
                seen[l.file] = Date.now();
                quiz[l.file] = { score: 100, at: Date.now() };
            });
            localStorage.setItem(progressKey(), JSON.stringify(seen));
            localStorage.setItem(quizPassKey(), JSON.stringify(quiz));
            applyLocks();
        },
        resetQuizPass: function () {
            localStorage.removeItem(quizPassKey());
            applyLocks();
        }
    };

    // ---------- شروع ----------
    function init() {
        guardLockedClicks();
        watchLessonModal();
        autoOpenQuizFromQuery();

        setTimeout(function () {
            applyLocks();
            showUnlockMessageIfAny();
        }, 400);

        setTimeout(applyLocks, 1200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();