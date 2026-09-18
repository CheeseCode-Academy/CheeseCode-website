// ============================================
// 🧀 ابزارهای کامل آکادمی چیزکد
// نسخه: 10.0.0 - CheeseCode Edition Final
// ============================================

(function () {
    'use strict';

    var VERSION_KEY = 'cheese_version';

    // ============================================
    // ۰. کلیدهای کش و پیشرفت
    // ============================================

    function getCacheKey(courseType) {
        var keys = {
            'python': 'cheese_cache_python',
            'linux': 'cheese_cache_linux',
            'answers-python': 'cheese_cache_answers_python',
            'answers-linux': 'cheese_cache_answers_linux'
        };
        return keys[courseType] || 'cheese_cache';
    }

    function getProgressKey(courseType) {
        var keys = {
            'python': 'cheese_progress_python',
            'linux': 'cheese_progress_linux',
            'answers-python': 'cheese_progress_answers_python',
            'answers-linux': 'cheese_progress_answers_linux'
        };
        return keys[courseType] || 'cheese_progress';
    }

    function getBasePath(courseType) {
        var paths = {
            'python': 'python-lessons/',
            'linux': 'linux-lessons/',
            'answers-python': 'answers/python/',
            'answers-linux': 'answers/linux/',
            'python-quiz': 'quizzes/python/',
            'linux-quiz': 'quizzes/linux/'
        };
        return paths[courseType] || '';
    }

    // ============================================
    // ۱. کش
    // ============================================

    function saveToCache(file, content, courseType) {
        try {
            var key = getCacheKey(courseType);
            var cache = JSON.parse(localStorage.getItem(key)) || {};
            cache[file] = content;
            localStorage.setItem(key, JSON.stringify(cache));
        } catch (e) {
            console.log('Cache error:', e);
        }
    }

    function getFromCache(file, courseType) {
        try {
            var key = getCacheKey(courseType);
            var cache = JSON.parse(localStorage.getItem(key)) || {};
            return cache[file] || null;
        } catch (e) {
            return null;
        }
    }

    function getAllCache(courseType) {
        try {
            var key = getCacheKey(courseType);
            return JSON.parse(localStorage.getItem(key)) || {};
        } catch (e) {
            return {};
        }
    }

    function clearCache(courseType) {
        try {
            if (courseType) {
                localStorage.removeItem(getCacheKey(courseType));
            } else {
                localStorage.removeItem('cheese_cache_python');
                localStorage.removeItem('cheese_cache_linux');
                localStorage.removeItem('cheese_cache_answers_python');
                localStorage.removeItem('cheese_cache_answers_linux');
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    function isInCache(file, courseType) {
        var cache = getAllCache(courseType);
        return cache.hasOwnProperty(file);
    }

    function getCourseCacheCount(courseType) {
        var cache = getAllCache(courseType);
        return Object.keys(cache).length;
    }

    // ============================================
    // ۱.۵. پیشرفت (جدا از کش)
    // ============================================

    function markAsSeen(file, courseType) {
        try {
            var key = getProgressKey(courseType);
            var progress = JSON.parse(localStorage.getItem(key)) || {};
            progress[file] = Date.now();
            localStorage.setItem(key, JSON.stringify(progress));

            // ثبت آخرین فعالیت
            localStorage.setItem('cheese_last_activity', Date.now().toString());
        } catch (e) {
            console.log('Progress error:', e);
        }
    }

    function getProgressCount(courseType) {
        try {
            var key = getProgressKey(courseType);
            var progress = JSON.parse(localStorage.getItem(key)) || {};
            return Object.keys(progress).length;
        } catch (e) {
            return 0;
        }
    }

    function clearProgress(courseType) {
        try {
            if (courseType) {
                localStorage.removeItem(getProgressKey(courseType));
            } else {
                localStorage.removeItem('cheese_progress_python');
                localStorage.removeItem('cheese_progress_linux');
                localStorage.removeItem('cheese_progress_answers_python');
                localStorage.removeItem('cheese_progress_answers_linux');
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    // ============================================
    // ۲. آخرین درس
    // ============================================

    function saveLastLesson(file, title) {
        try {
            localStorage.setItem('cheese_last', JSON.stringify({
                file: file,
                title: title,
                timestamp: Date.now()
            }));
        } catch (e) { }
    }

    function getLastLesson() {
        try {
            return JSON.parse(localStorage.getItem('cheese_last'));
        } catch (e) {
            return null;
        }
    }

    function clearLastLesson() {
        localStorage.removeItem('cheese_last');
    }

    // ============================================
    // ۳. پیشرفت (نمایش)
    // ============================================

    function updateProgress(total, courseType) {
        var bar = document.getElementById('progressBar');
        var text = document.getElementById('progressText');
        if (!bar) return;

        try {
            var count = getProgressCount(courseType);
            var percent = Math.min(100, Math.round((count / total) * 100));

            bar.style.width = percent + '%';
            if (text) {
                text.textContent = count + ' / ' + total + ' (' + percent + '%)';
            }
        } catch (e) { }
    }

    // ============================================
    // ۴. جستجوی پیشرفته
    // ============================================

    function setupSearch() {
        var input = document.getElementById('searchInput');
        var list = document.getElementById('lessons-menu') ||
            document.getElementById('answers-menu') ||
            document.getElementById('quizzes-menu');
        if (!input || !list) return;

        var newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        input = newInput;

        input.addEventListener('input', function () {
            var query = this.value.trim().toLowerCase();
            var items = list.querySelectorAll('.menu-item');
            var found = false;

            if (query.length === 0) {
                items.forEach(function (item) {
                    item.style.display = 'flex';
                    item.style.backgroundColor = '';
                    item.style.borderColor = '';
                });
                var oldMsg = list.querySelector('.no-result');
                if (oldMsg) oldMsg.remove();
                return;
            }

            items.forEach(function (item) {
                item.style.backgroundColor = '';
                item.style.borderColor = '';
            });

            items.forEach(function (item) {
                var text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'flex';
                    found = true;
                } else {
                    item.style.display = 'none';
                }
            });

            if (!found) {
                var courseType = getCurrentCourseType();
                var cache = getAllCache(courseType);
                var results = [];

                for (var file in cache) {
                    var content = cache[file];
                    var plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').toLowerCase();

                    if (plainText.includes(query)) {
                        results.push(file);
                    }
                }

                if (results.length > 0) {
                    items.forEach(function (item) {
                        var itemText = item.textContent.toLowerCase();

                        var matched = results.some(function (file) {
                            var fileBase = file.replace('.html', '').replace(/[-_]/g, ' ').toLowerCase();
                            var words = fileBase.split(' ');

                            return words.some(function (word) {
                                return word.length > 3 && itemText.includes(word);
                            });
                        });

                        if (matched) {
                            item.style.display = 'flex';
                            item.style.backgroundColor = 'rgba(245, 184, 27, 0.12)';
                            item.style.borderColor = 'rgba(245, 184, 27, 0.4)';
                            found = true;
                        }
                    });
                }
            }

            var oldMsg = list.querySelector('.no-result');
            if (oldMsg) oldMsg.remove();

            if (!found) {
                var msg = document.createElement('div');
                msg.className = 'no-result';
                msg.textContent = '🧀 نتیجه‌ای یافت نشد';
                list.appendChild(msg);
            }
        });
    }

    function getCurrentCourseType() {
        var path = window.location.pathname;
        var search = window.location.search;

        if (path.includes('answers-python') || search.includes('answers-python')) return 'answers-python';
        if (path.includes('answers-linux') || search.includes('answers-linux')) return 'answers-linux';
        if (path.includes('python-quiz') || search.includes('python-quiz')) return 'python-quiz';
        if (path.includes('linux-quiz') || search.includes('linux-quiz')) return 'linux-quiz';
        if (path.includes('python')) return 'python';
        if (path.includes('linux')) return 'linux';

        return 'python';
    }

    // ============================================
    // ۵. دکمه‌ی ادامه
    // ============================================

    function setupResume() {
        var btn = document.getElementById('resumeBtn');
        if (!btn) return;

        var last = getLastLesson();
        if (last) {
            btn.style.display = 'block';
            btn.textContent = '▶️ ادامه: ' + last.title;
            btn.onclick = function () {
                var items = document.querySelectorAll('.menu-item');
                for (var i = 0; i < items.length; i++) {
                    if (items[i].textContent.includes(last.title)) {
                        items[i].click();
                        break;
                    }
                }
            };
        } else {
            btn.style.display = 'none';
        }
    }

    // ============================================
    // ۶. تم (چندگانه)
    // ============================================

    var THEMES = {
        'dark': { icon: '🌙', name: 'Dark' },
        'midnight': { icon: '🌌', name: 'Midnight' },
        'purple': { icon: '💜', name: 'Purple' },
        'matrix': { icon: '💚', name: 'Matrix' },
        'light-white': { icon: '⚪', name: 'White' },
        'light-cream': { icon: '🟡', name: 'Cream' },
        'light-blue': { icon: '🔵', name: 'Blue' },
        'light-gray': { icon: '⚫', name: 'Gray' }
    };

    function setTheme(themeName) {
        if (!THEMES[themeName]) themeName = 'dark';
        document.body.setAttribute('data-theme', themeName);
        localStorage.setItem('cheese_theme', themeName);
        updateThemeButton(themeName);
    }

    function getTheme() {
        return localStorage.getItem('cheese_theme') || 'dark';
    }

    function updateThemeButton(themeName) {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;
        var theme = THEMES[themeName] || THEMES['dark'];
        btn.textContent = theme.icon;
    }

    function loadTheme() {
        var saved = getTheme();
        document.body.setAttribute('data-theme', saved);
        updateThemeButton(saved);
    }

    function createThemeMenu() {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;

        if (document.getElementById('themeMenu')) return;

        var menu = document.createElement('div');
        menu.id = 'themeMenu';
        menu.className = 'theme-menu';

        var currentTheme = getTheme();

        for (var key in THEMES) {
            (function (themeKey) {
                var theme = THEMES[themeKey];
                var item = document.createElement('button');
                item.className = 'theme-menu-item';
                if (themeKey === currentTheme) item.classList.add('active');

                var preview = document.createElement('div');
                preview.className = 'theme-preview theme-' + themeKey;
                preview.textContent = 'Aa';

                var label = document.createElement('span');
                label.textContent = theme.icon + ' ' + theme.name;

                item.appendChild(preview);
                item.appendChild(label);

                item.addEventListener('click', function (e) {
                    e.stopPropagation();
                    setTheme(themeKey);
                    menu.querySelectorAll('.theme-menu-item').forEach(function (el) {
                        el.classList.remove('active');
                    });
                    item.classList.add('active');
                    menu.classList.remove('show');
                });

                menu.appendChild(item);
            })(key);
        }

        document.body.appendChild(menu);

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            menu.classList.toggle('show');
        });

        document.addEventListener('click', function (e) {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.classList.remove('show');
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                menu.classList.remove('show');
            }
        });
    }

    // ============================================
    // ۷. نسخه
    // ============================================

    function getLocalVersion() {
        try {
            return JSON.parse(localStorage.getItem(VERSION_KEY));
        } catch (e) {
            return null;
        }
    }

    function saveLocalVersion(versionData) {
        localStorage.setItem(VERSION_KEY, JSON.stringify(versionData));
    }

    function compareVersionsNumbers(v1, v2) {
        var parts1 = (v1 || '0.0.0').split('.').map(Number);
        var parts2 = (v2 || '0.0.0').split('.').map(Number);

        for (var i = 0; i < Math.max(parts1.length, parts2.length); i++) {
            var num1 = parts1[i] || 0;
            var num2 = parts2[i] || 0;
            if (num1 !== num2) {
                return num1 > num2 ? 1 : -1;
            }
        }
        return 0;
    }

    // ============================================
    // ۸. بررسی آپدیت
    // ============================================

    function checkForUpdates() {
        return fetch('version.json?v=' + Date.now())
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(function (remoteVersion) {
                var localVersion = getLocalVersion() || { courses: {} };
                var updates = [];

                for (var courseKey in remoteVersion.courses) {
                    var remoteCourse = remoteVersion.courses[courseKey];
                    var localCourse = localVersion.courses ? localVersion.courses[courseKey] : null;

                    var remoteVer = remoteCourse.version || '0.0.0';
                    var localVer = localCourse ? (localCourse.version || '0.0.0') : '0.0.0';

                    if (compareVersionsNumbers(remoteVer, localVer) > 0) {
                        updates.push({
                            course: courseKey,
                            title: remoteCourse.title,
                            icon: remoteCourse.icon,
                            version: remoteVer,
                            updateType: remoteCourse.updateType || 'minor',
                            changelog: remoteCourse.changelog || '',
                            lessons: remoteCourse.lessons
                        });
                    }
                }

                var priorityOrder = { 'critical': 3, 'normal': 2, 'minor': 1 };
                var highestPriority = 'minor';
                updates.forEach(function (u) {
                    if (priorityOrder[u.updateType] > priorityOrder[highestPriority]) {
                        highestPriority = u.updateType;
                    }
                });

                return {
                    hasUpdate: updates.length > 0,
                    isFirstTime: !localVersion.courses || Object.keys(localVersion.courses || {}).length === 0,
                    updates: updates,
                    highestPriority: highestPriority,
                    remote: remoteVersion,
                    local: localVersion
                };
            });
    }

    // ============================================
    // ۹. نمایش آپدیت
    // ============================================

    function showUpdateNotification(updateInfo) {
        if (!updateInfo.hasUpdate) return;
        if (document.getElementById('updateNotification')) return;
        if (document.getElementById('criticalUpdateModal')) return;

        var priority = updateInfo.highestPriority;

        if (priority === 'critical') {
            showCriticalUpdate(updateInfo);
        } else if (priority === 'normal') {
            showNormalUpdate(updateInfo);
        } else {
            showMinorUpdate(updateInfo);
        }
    }

    function showCriticalUpdate(updateInfo) {
        var criticalUpdates = updateInfo.updates.filter(function (u) {
            return u.updateType === 'critical';
        });

        var updatesList = criticalUpdates.map(function (u) {
            return '<li style="margin: 0.4rem 0; color: rgba(255,255,255,0.8);">' +
                u.icon + ' <strong>' + u.title + '</strong>: ' + u.changelog +
                '</li>';
        }).join('');

        var modal = document.createElement('div');
        modal.id = 'criticalUpdateModal';
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 520px; text-align: center; border-top-color: #ff4444;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
                <h2 style="color: #ff4444; margin-bottom: 1rem;">آپدیت حیاتی</h2>
                <p style="color: rgba(255,255,255,0.7); line-height: 1.8; margin: 1rem 0;">
                    یک آپدیت مهم منتشر شده که <strong style="color: #ff4444;">باید</strong> نصبش کنی.
                </p>
                <div style="background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.2); border-radius: 8px; padding: 0.8rem 1rem; margin: 1rem 0; text-align: right;">
                    <ul style="list-style: none; padding: 0; margin: 0;">${updatesList}</ul>
                </div>
                <button onclick="CheeseUtils.applyUpdate()" style="width: 100%; background: rgba(255,68,68,0.15); border: 1px solid rgba(255,68,68,0.4); padding: 0.8rem; border-radius: 12px; color: #ff4444; cursor: pointer; font-family: 'Courier New', monospace; font-size: 0.9rem; font-weight: 600;">
                    🚀 آپدیت اجباری
                </button>
                <p id="updateProgressText" style="color: rgba(255,255,255,0.4); font-size: 0.75rem; margin: 0.8rem 0 0 0;"></p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function showNormalUpdate(updateInfo) {
        var normalUpdates = updateInfo.updates.filter(function (u) {
            return u.updateType === 'normal' || u.updateType === 'critical';
        });

        var updatesList = normalUpdates.map(function (u) {
            return '<li style="margin: 0.3rem 0; color: rgba(255,255,255,0.7); font-size: 0.8rem;">' +
                u.icon + ' <strong>' + u.title + '</strong>: ' + u.changelog +
                '</li>';
        }).join('');

        var notification = document.createElement('div');
        notification.id = 'updateNotification';
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.8rem; margin-bottom: 1rem;">
                <span style="font-size: 2rem;">📢</span>
                <div>
                    <h3 style="color: #f5b81b; margin: 0; font-size: 1rem;">آپدیت جدید موجود است!</h3>
                    <p style="color: rgba(255,255,255,0.5); margin: 0.3rem 0 0 0; font-size: 0.75rem;">
                        ${normalUpdates.length} دوره آماده‌ی آپدیته
                    </p>
                </div>
            </div>
            <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 0.8rem; margin-bottom: 1rem;">
                <ul style="list-style: none; padding: 0; margin: 0;">${updatesList}</ul>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="CheeseUtils.applyUpdate()" style="flex: 1; background: rgba(245,184,27,0.1); border: 1px solid rgba(245,184,27,0.3); padding: 0.6rem; border-radius: 8px; color: #f5b81b; cursor: pointer; font-family: 'Courier New', monospace; font-size: 0.8rem; font-weight: 600;">
                    🚀 آپدیت الان
                </button>
                <button onclick="CheeseUtils.dismissUpdate()" style="background: transparent; border: 1px solid rgba(255,255,255,0.1); padding: 0.6rem 1rem; border-radius: 8px; color: rgba(255,255,255,0.4); cursor: pointer; font-family: 'Courier New', monospace; font-size: 0.8rem;">
                    ⏰ بعداً
                </button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            max-width: 420px;
            margin: 0 auto;
            background: rgba(15, 22, 38, 0.98);
            border: 1px solid rgba(245, 184, 27, 0.3);
            border-radius: 16px;
            padding: 1.2rem;
            z-index: 10000;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(20px);
            animation: slideUpNotif 0.4s ease;
            direction: rtl;
            font-family: 'Courier New', monospace;
        `;

        addSlideUpStyle();
        document.body.appendChild(notification);
    }

    function showMinorUpdate(updateInfo) {
        var minorUpdates = updateInfo.updates.filter(function (u) {
            return u.updateType === 'minor';
        });

        var toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 212, 255, 0.1);
            border: 1px solid rgba(0, 212, 255, 0.3);
            border-radius: 12px;
            padding: 0.8rem 1.5rem;
            color: #00d4ff;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            z-index: 10000;
            backdrop-filter: blur(20px);
            animation: slideUpNotif 0.4s ease;
            max-width: 90%;
            text-align: center;
        `;
        toast.innerHTML = `🧀 ${minorUpdates.length} آپدیت جزئی در حال اعمال...`;

        addSlideUpStyle();
        document.body.appendChild(toast);

        setTimeout(function () {
            applyUpdate(true).then(function () {
                toast.innerHTML = '✅ آپدیت‌های جزئی اعمال شد!';
                setTimeout(function () {
                    if (toast.parentNode) toast.remove();
                }, 2000);
            });
        }, 1000);
    }

    function addSlideUpStyle() {
        if (document.getElementById('cheese-slideup-style')) return;
        var style = document.createElement('style');
        style.id = 'cheese-slideup-style';
        style.textContent = `
            @keyframes slideUpNotif {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translate(-50%, 30px); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // ۱۰. اعمال آپدیت
    // ============================================

    function applyUpdate(silent) {
        var progressEl = document.getElementById('updateProgressText');

        if (progressEl) progressEl.textContent = '⏳ در حال دریافت اطلاعات...';

        return fetch('version.json?v=' + Date.now())
            .then(function (res) { return res.json(); })
            .then(function (remoteVersion) {
                if (progressEl) progressEl.textContent = '📥 در حال آپدیت فایل‌ها...';

                return updateAllCachedFiles(remoteVersion, progressEl)
                    .then(function () {
                        saveLocalVersion(remoteVersion);
                    });
            })
            .then(function () {
                if (progressEl) {
                    progressEl.textContent = '✅ آپدیت کامل شد!';
                    progressEl.style.color = '#00d4ff';
                }

                setTimeout(function () {
                    location.reload();
                }, 1500);
            })
            .catch(function (err) {
                console.error('❌ خطا در آپدیت:', err);
                if (progressEl) {
                    progressEl.textContent = '❌ خطا: ' + err.message;
                    progressEl.style.color = '#ff4444';
                }
            });
    }

    function updateAllCachedFiles(versionData, progressEl) {
        var promises = [];
        var totalFiles = 0;
        var completedFiles = 0;

        for (var course in versionData.courses) {
            totalFiles += versionData.courses[course].lessons.length;
        }

        for (var course in versionData.courses) {
            (function (courseName) {
                var course = versionData.courses[courseName];
                var basePath = getBasePath(courseName);

                course.lessons.forEach(function (lesson) {
                    var promise = fetch(basePath + lesson.name + '?v=' + Date.now())
                        .then(function (res) {
                            if (!res.ok) throw new Error('HTTP ' + res.status);
                            return res.text();
                        })
                        .then(function (content) {
                            saveToCache(lesson.name, content, courseName);
                            completedFiles++;

                            if (progressEl) {
                                var percent = Math.round((completedFiles / totalFiles) * 100);
                                progressEl.textContent = '📥 ' + completedFiles + ' / ' + totalFiles + ' (' + percent + '%)';
                            }
                        })
                        .catch(function (err) {
                            console.warn('⚠️ خطا در', lesson.name, err);
                            completedFiles++;
                        });

                    promises.push(promise);
                });
            })(course);
        }

        return Promise.all(promises);
    }

    function dismissUpdate() {
        var notification = document.getElementById('updateNotification');
        if (notification) {
            notification.style.transition = 'opacity 0.3s ease';
            notification.style.opacity = '0';
            setTimeout(function () {
                if (notification.parentNode) notification.remove();
            }, 300);
        }

        localStorage.setItem('cheese_update_dismissed', Date.now());
    }

    // ============================================
    // ۱۱. کش کردن دوره
    // ============================================

    async function cacheCourse(courseType, onProgress) {
        const res = await fetch('version.json?v=' + Date.now());
        const versionData = await res.json();

        const course = versionData.courses[courseType];
        if (!course) throw new Error('دوره یافت نشد');

        const lessons = course.lessons;
        const basePath = getBasePath(courseType);
        const total = lessons.length;
        let completed = 0;
        const errors = [];

        for (let i = 0; i < lessons.length; i++) {
            const lesson = lessons[i];
            const url = basePath + lesson.name + '?v=' + Date.now();

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }

                const content = await response.text();

                if (!content || content.trim().length === 0) {
                    throw new Error('فایل خالیه');
                }

                saveToCache(lesson.name, content, courseType);

                const saved = getFromCache(lesson.name, courseType);
                if (!saved) {
                    throw new Error('ذخیره نشد');
                }

                completed++;

                if (onProgress) {
                    onProgress(completed, total, lesson.name);
                }

            } catch (err) {
                errors.push({
                    name: lesson.name,
                    error: err.message
                });

                completed++;

                if (onProgress) {
                    onProgress(completed, total, lesson.name);
                }

                console.warn('⚠️ خطا در', lesson.name, err.message);
            }

            if (i % 5 === 0 && i > 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return {
            total: total,
            completed: completed,
            errors: errors,
            finalCount: getCourseCacheCount(courseType)
        };
    }

    function clearCourseCache(courseType) {
        clearCache(courseType);
        return true;
    }

    // ============================================
    // ۱۱.۵. کش کردن کوییز
    // ============================================

    async function cacheQuizCourse(courseType, onProgress) {
        const configKey = courseType === 'python-quiz' ? 'pythonQuizConfig' : 'linuxQuizConfig';
        const quizConfig = window[configKey];

        if (!quizConfig || !Array.isArray(quizConfig)) {
            throw new Error('کوییزهای ' + courseType + ' یافت نشد');
        }

        const total = quizConfig.length;
        let completed = 0;
        const errors = [];

        for (let i = 0; i < quizConfig.length; i++) {
            const quiz = quizConfig[i];
            const url = 'quizzes/' + quiz.file + '?v=' + Date.now();

            try {
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }

                const content = await response.text();

                if (!content || content.trim().length === 0) {
                    throw new Error('فایل خالیه');
                }

                const cacheKey = 'cheese_quiz_cache_' + quiz.file;
                localStorage.setItem(cacheKey, content);

                completed++;

                if (onProgress) {
                    onProgress(completed, total, quiz.title);
                }

            } catch (err) {
                errors.push({
                    name: quiz.title,
                    error: err.message
                });

                completed++;

                if (onProgress) {
                    onProgress(completed, total, quiz.title);
                }

                console.warn('⚠️ خطا در', quiz.file, err.message);
            }

            if (i % 5 === 0 && i > 0) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return {
            total: total,
            completed: completed,
            errors: errors
        };
    }

    // ============================================
    // ۱۲. اشتراک‌گذاری
    // ============================================

    function shareLesson(file, title, courseType) {
        var baseUrl = window.location.origin + window.location.pathname;
        var shareUrl = baseUrl + '?lesson=' + encodeURIComponent(file);

        var shareData = {
            title: 'CheeseCode | ' + title,
            text: '🧀 ' + title + '\n\nاز آکادمی چیزکد ببین:',
            url: shareUrl
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(function () {
                    console.log('✅ اشتراک‌گذاری موفق');
                })
                .catch(function (err) {
                    if (err.name !== 'AbortError') {
                        console.warn('⚠️ خطا در اشتراک‌گذاری:', err);
                        fallbackShare(shareUrl, title);
                    }
                });
        } else {
            fallbackShare(shareUrl, title);
        }
    }

    function fallbackShare(url, title) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(function () {
                showToast('✅ لینک کپی شد!');
            }).catch(function () {
                showCopyModal(url, title);
            });
        } else {
            showCopyModal(url, title);
        }
    }

    function showToast(message) {
        var toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 212, 255, 0.15);
            border: 1px solid rgba(0, 212, 255, 0.4);
            border-radius: 12px;
            padding: 0.8rem 1.5rem;
            color: #00d4ff;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            z-index: 10000;
            backdrop-filter: blur(20px);
            animation: slideUp 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(function () {
                if (toast.parentNode) toast.remove();
            }, 300);
        }, 2000);
    }

    function showCopyModal(url, title) {
        var modal = document.createElement('div');
        modal.id = 'shareModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.9);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1rem;
            direction: rtl;
            backdrop-filter: blur(10px);
        `;

        modal.innerHTML = `
            <div style="
                background: rgba(15, 22, 38, 0.98);
                border: 1px solid rgba(245, 184, 27, 0.3);
                border-radius: 16px;
                padding: 1.5rem;
                max-width: 500px;
                width: 100%;
                direction: rtl;
                font-family: 'Courier New', monospace;
            ">
                <h3 style="color: #f5b81b; margin: 0 0 1rem 0; text-align: center;">
                    🔗 اشتراک‌گذاری درس
                </h3>
                <p style="color: rgba(255,255,255,0.6); font-size: 0.85rem; margin: 0 0 1rem 0;">
                    ${title}
                </p>
                <input type="text" value="${url}" readonly style="
                    width: 100%;
                    padding: 0.6rem;
                    border-radius: 8px;
                    border: 1px solid rgba(245, 184, 27, 0.3);
                    background: rgba(0, 0, 0, 0.3);
                    color: #f5b81b;
                    font-family: 'Courier New', monospace;
                    font-size: 0.75rem;
                    direction: ltr;
                    text-align: left;
                    margin-bottom: 1rem;
                    box-sizing: border-box;
                " id="shareUrlInput">
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="CheeseUtils.copyShareUrl()" style="
                        flex: 1;
                        background: rgba(245, 184, 27, 0.1);
                        border: 1px solid rgba(245, 184, 27, 0.3);
                        padding: 0.7rem;
                        border-radius: 8px;
                        color: #f5b81b;
                        cursor: pointer;
                        font-family: 'Courier New', monospace;
                        font-size: 0.85rem;
                        font-weight: 600;
                    ">📋 کپی لینک</button>
                    <button onclick="document.getElementById('shareModal').remove()" style="
                        flex: 1;
                        background: rgba(255, 68, 68, 0.1);
                        border: 1px solid rgba(255, 68, 68, 0.3);
                        padding: 0.7rem;
                        border-radius: 8px;
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

        setTimeout(function () {
            var input = document.getElementById('shareUrlInput');
            if (input) input.select();
        }, 100);
    }

    function copyShareUrl() {
        var input = document.getElementById('shareUrlInput');
        if (input) {
            input.select();
            document.execCommand('copy');
            showToast('✅ لینک کپی شد!');
        }
    }

    // ============================================
    // ۱۳. پنجره‌های قابل جابه‌جایی
    // ============================================

    function makeDraggable(modalElement, windowId) {
        var modalContent = modalElement.querySelector('.modal-content');
        if (!modalContent) return;

        if (modalContent.dataset.draggableInitialized === 'true') {
            return;
        }
        modalContent.dataset.draggableInitialized = 'true';

        var titleBar = modalContent.querySelector('.window-titlebar');
        if (!titleBar) {
            titleBar = document.createElement('div');
            titleBar.className = 'window-titlebar';
            titleBar.innerHTML = `
                <div class="window-dots">
                    <span class="window-dot window-dot-close" title="بستن">❌</span>
                    <span class="window-dot window-dot-minimize" title="کوچک/بزرگ">🙈</span>
                    <span class="window-dot window-dot-maximize" title="تمام‌صفحه">🖥️</span>
                </div>
                <div class="window-title">🧀 CheeseCode</div>
            `;
            modalContent.insertBefore(titleBar, modalContent.firstChild);
        }

        titleBar.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            return false;
        });

        titleBar.style.userSelect = 'none';
        titleBar.style.webkitUserSelect = 'none';
        titleBar.style.webkitTouchCallout = 'none';
        titleBar.style.webkitTapHighlightColor = 'transparent';

        var savedPos = null;
        try {
            savedPos = JSON.parse(localStorage.getItem('cheese_window_pos_' + windowId));
        } catch (e) { }

        if (savedPos) {
            modalContent.style.position = 'fixed';
            modalContent.style.left = savedPos.posX + 'px';
            modalContent.style.top = savedPos.posY + 'px';
            modalContent.style.margin = '0';
            modalContent.style.maxWidth = '750px';
        }

        var isDragging = false;
        var startX = 0, startY = 0;
        var startLeft = 0, startTop = 0;
        var dragStarted = false;

        titleBar.addEventListener('pointerdown', startDrag);
        titleBar.addEventListener('pointermove', onDrag);
        titleBar.addEventListener('pointerup', stopDrag);
        titleBar.addEventListener('pointercancel', stopDrag);

        function startDrag(e) {
            if (e.target.classList.contains('window-dot')) return;
            if (e.pointerType === 'mouse' && e.button !== 0) return;

            isDragging = true;
            dragStarted = false;

            var rect = modalContent.getBoundingClientRect();

            modalContent.style.position = 'fixed';
            modalContent.style.margin = '0';
            modalContent.style.left = rect.left + 'px';
            modalContent.style.top = rect.top + 'px';

            startX = e.clientX;
            startY = e.clientY;
            startLeft = rect.left;
            startTop = rect.top;

            try {
                titleBar.setPointerCapture(e.pointerId);
            } catch (err) { }

            document.body.style.userSelect = 'none';
            document.body.style.webkitUserSelect = 'none';
        }

        function onDrag(e) {
            if (!isDragging) return;

            var dx = e.clientX - startX;
            var dy = e.clientY - startY;

            if (!dragStarted && Math.abs(dx) < 3 && Math.abs(dy) < 3) {
                return;
            }

            dragStarted = true;

            var newLeft = startLeft + dx;
            var newTop = startTop + dy;

            var maxLeft = window.innerWidth - modalContent.offsetWidth;
            var maxTop = window.innerHeight - modalContent.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxLeft));
            newTop = Math.max(0, Math.min(newTop, maxTop));

            modalContent.style.left = newLeft + 'px';
            modalContent.style.top = newTop + 'px';

            e.preventDefault();
        }

        function stopDrag(e) {
            if (!isDragging) return;
            isDragging = false;
            dragStarted = false;

            document.body.style.userSelect = '';
            document.body.style.webkitUserSelect = '';

            try {
                titleBar.releasePointerCapture(e.pointerId);
            } catch (err) { }

            try {
                localStorage.setItem('cheese_window_pos_' + windowId, JSON.stringify({
                    posX: parseInt(modalContent.style.left),
                    posY: parseInt(modalContent.style.top)
                }));
            } catch (e) { }
        }

        var closeBtn = titleBar.querySelector('.window-dot-close');
        var minimizeBtn = titleBar.querySelector('.window-dot-minimize');
        var maximizeBtn = titleBar.querySelector('.window-dot-maximize');

        // ============================================
        // دکمه‌ی بستن ❌
        // ============================================
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                modalElement.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }

        // دکمه‌ی کوچک/بزرگ
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                var isMinimized = modalContent.classList.toggle('window-minimized');
                minimizeBtn.innerHTML = isMinimized ? '🙉' : '🙈';
                minimizeBtn.title = isMinimized ? 'باز کردن' : 'کوچک کردن';
            });
        }

        // دکمه‌ی تمام‌صفحه
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                var isMaximized = modalContent.classList.toggle('window-maximized');

                if (isMaximized) {
                    modalContent.style.position = 'fixed';
                    modalContent.style.left = '0';
                    modalContent.style.top = '0';
                    modalContent.style.right = '0';
                    modalContent.style.bottom = '0';
                    modalContent.style.width = '100%';
                    modalContent.style.height = '100%';
                    modalContent.style.maxWidth = '100%';
                    modalContent.style.maxHeight = '100%';
                    modalContent.style.margin = '0';
                    modalContent.style.borderRadius = '0';
                    
                    maximizeBtn.innerHTML = '🗗';
                    maximizeBtn.title = 'خروج از تمام‌صفحه';
                } else {
                    modalContent.style.position = '';
                    modalContent.style.left = '';
                    modalContent.style.top = '';
                    modalContent.style.right = '';
                    modalContent.style.bottom = '';
                    modalContent.style.width = '';
                    modalContent.style.height = '';
                    modalContent.style.maxWidth = '';
                    modalContent.style.maxHeight = '';
                    modalContent.style.margin = '';
                    modalContent.style.borderRadius = '';
                    
                    maximizeBtn.innerHTML = '🖥️';
                    maximizeBtn.title = 'تمام‌صفحه';
                }
            });
        }
    }

    function makeWindow(modalSelector, windowId) {
        var modal = document.querySelector(modalSelector);
        if (!modal) return;
        makeDraggable(modal, windowId || modalSelector);
    }

    // ============================================
    // ۱۴. API عمومی
    // ============================================

    window.CheeseUtils = {
        saveToCache: saveToCache,
        getFromCache: getFromCache,
        getAllCache: getAllCache,
        clearCache: clearCache,
        isInCache: isInCache,
        getCourseCacheCount: getCourseCacheCount,

        markAsSeen: markAsSeen,
        getProgressCount: getProgressCount,
        clearProgress: clearProgress,
        updateProgress: updateProgress,

        saveLastLesson: saveLastLesson,
        getLastLesson: getLastLesson,
        clearLastLesson: clearLastLesson,

        setupSearch: setupSearch,
        setupResume: setupResume,

        setTheme: setTheme,
        getTheme: getTheme,
        loadTheme: loadTheme,
        createThemeMenu: createThemeMenu,
        THEMES: THEMES,

        getLocalVersion: getLocalVersion,
        saveLocalVersion: saveLocalVersion,
        compareVersionsNumbers: compareVersionsNumbers,
        checkForUpdates: checkForUpdates,
        showUpdateNotification: showUpdateNotification,
        applyUpdate: applyUpdate,
        dismissUpdate: dismissUpdate,

        cacheCourse: cacheCourse,
        cacheQuizCourse: cacheQuizCourse,
        clearCourseCache: clearCourseCache,

        shareLesson: shareLesson,
        copyShareUrl: copyShareUrl,

        makeWindow: makeWindow,
        makeDraggable: makeDraggable
    };

    // ============================================
    // ۱۵. مقداردهی اولیه
    // ============================================

    function init() {
        loadTheme();
        setupSearch();
        setupResume();
        createThemeMenu();

        if (navigator.onLine) {
            setTimeout(function () {
                checkForUpdates()
                    .then(function (result) {
                        if (result.hasUpdate && !result.isFirstTime) {
                            var lastDismiss = localStorage.getItem('cheese_update_dismissed');
                            var now = Date.now();

                            if (!lastDismiss || (now - parseInt(lastDismiss)) > 86400000) {
                                showUpdateNotification(result);
                            }
                        }

                        if (result.isFirstTime) {
                            saveLocalVersion(result.remote);
                        }
                    })
                    .catch(function (err) {
                        console.log('⚠️ خطا در چک آپدیت:', err);
                    });
            }, 3000);
        }

        console.log('🧀 CheeseUtils ready! (v10.0.0)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();