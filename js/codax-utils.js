// ============================================
// ⚡ ابزارهای کامل آکادمی CodaX
// نسخه: 5.0.0 - PWA + Search + Share
// ============================================

(function() {
    'use strict';

    var VERSION_KEY = 'codax_version';

    // ============================================
    // ۰. کلیدهای کش و پیشرفت
    // ============================================

    function getCacheKey(courseType) {
        var keys = {
            'python': 'codax_cache_python',
            'linux': 'codax_cache_linux',
            'answers-python': 'codax_cache_answers_python',
            'answers-linux': 'codax_cache_answers_linux'
        };
        return keys[courseType] || 'codax_cache';
    }

    function getProgressKey(courseType) {
        var keys = {
            'python': 'codax_progress_python',
            'linux': 'codax_progress_linux',
            'answers-python': 'codax_progress_answers_python',
            'answers-linux': 'codax_progress_answers_linux'
        };
        return keys[courseType] || 'codax_progress';
    }

    function getBasePath(courseType) {
        var paths = {
            'python': 'python-lessons/',
            'linux': 'linux-lessons/',
            'answers-python': 'answers/python/',
            'answers-linux': 'answers/linux/'
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
        } catch(e) {
            console.log('Cache error:', e);
        }
    }

    function getFromCache(file, courseType) {
        try {
            var key = getCacheKey(courseType);
            var cache = JSON.parse(localStorage.getItem(key)) || {};
            return cache[file] || null;
        } catch(e) {
            return null;
        }
    }

    function getAllCache(courseType) {
        try {
            var key = getCacheKey(courseType);
            return JSON.parse(localStorage.getItem(key)) || {};
        } catch(e) {
            return {};
        }
    }

    function clearCache(courseType) {
        try {
            if (courseType) {
                localStorage.removeItem(getCacheKey(courseType));
            } else {
                localStorage.removeItem('codax_cache_python');
                localStorage.removeItem('codax_cache_linux');
                localStorage.removeItem('codax_cache_answers_python');
                localStorage.removeItem('codax_cache_answers_linux');
            }
            return true;
        } catch(e) {
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
        } catch(e) {
            console.log('Progress error:', e);
        }
    }

    function getProgressCount(courseType) {
        try {
            var key = getProgressKey(courseType);
            var progress = JSON.parse(localStorage.getItem(key)) || {};
            return Object.keys(progress).length;
        } catch(e) {
            return 0;
        }
    }

    function clearProgress(courseType) {
        try {
            if (courseType) {
                localStorage.removeItem(getProgressKey(courseType));
            } else {
                localStorage.removeItem('codax_progress_python');
                localStorage.removeItem('codax_progress_linux');
                localStorage.removeItem('codax_progress_answers_python');
                localStorage.removeItem('codax_progress_answers_linux');
            }
            return true;
        } catch(e) {
            return false;
        }
    }

    // ============================================
    // ۲. آخرین درس
    // ============================================

    function saveLastLesson(file, title) {
        try {
            localStorage.setItem('codax_last', JSON.stringify({
                file: file,
                title: title
            }));
        } catch(e) {}
    }

    function getLastLesson() {
        try {
            return JSON.parse(localStorage.getItem('codax_last'));
        } catch(e) {
            return null;
        }
    }

    function clearLastLesson() {
        localStorage.removeItem('codax_last');
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
        } catch(e) {}
    }

    // ============================================
    // ۴. جستجوی پیشرفته
    // ============================================

    function setupSearch() {
        var input = document.getElementById('searchInput');
        var list = document.getElementById('lessons-menu') || document.getElementById('answers-menu');
        if (!input || !list) return;

        var newInput = input.cloneNode(true);
        input.parentNode.replaceChild(newInput, input);
        input = newInput;

        input.addEventListener('input', function() {
            var query = this.value.trim().toLowerCase();
            var items = list.querySelectorAll('.menu-item');
            var found = false;

            // اگه خالی بود، همه رو نشون بده
            if (query.length === 0) {
                items.forEach(function(item) {
                    item.style.display = 'flex';
                    item.style.backgroundColor = '';
                    item.style.borderColor = '';
                });
                var oldMsg = list.querySelector('.no-result');
                if (oldMsg) oldMsg.remove();
                return;
            }

            // پاک کردن هایلایت قبلی
            items.forEach(function(item) {
                item.style.backgroundColor = '';
                item.style.borderColor = '';
            });

            // مرحله ۱: جستجو در عنوان‌ها
            var titleMatches = [];
            items.forEach(function(item, index) {
                var text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'flex';
                    titleMatches.push(index);
                    found = true;
                } else {
                    item.style.display = 'none';
                }
            });

            // مرحله ۲: جستجو در محتوای کش‌شده
            var contentMatches = [];
            var courseType = getCurrentCourseType();
            var cache = getAllCache(courseType);

            for (var file in cache) {
                var content = cache[file];
                var plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').toLowerCase();
                
                if (plainText.includes(query)) {
                    contentMatches.push(file);
                }
            }

            // اگه توی محتوا پیدا شد، آیتم‌های مربوطه رو هایلایت کن
            if (contentMatches.length > 0) {
                items.forEach(function(item, index) {
                    var itemText = item.textContent.toLowerCase();
                    
                    var matched = contentMatches.some(function(file) {
                        var fileBase = file.replace('.html', '').replace(/[-_]/g, ' ').toLowerCase();
                        var words = fileBase.split(' ');
                        
                        // چک کن که حداقل یکی از کلمات فایل توی عنوان درس باشه
                        return words.some(function(word) {
                            return word.length > 3 && itemText.includes(word);
                        });
                    });
                    
                    if (matched) {
                        item.style.display = 'flex';
                        item.style.backgroundColor = 'rgba(0, 212, 255, 0.12)';
                        item.style.borderColor = 'rgba(0, 212, 255, 0.4)';
                        found = true;
                    }
                });
            }

            // پیام «نتیجه‌ای یافت نشد»
            var oldMsg = list.querySelector('.no-result');
            if (oldMsg) oldMsg.remove();

            if (!found) {
                var msg = document.createElement('div');
                msg.className = 'no-result';
                msg.textContent = '⚡ No results found';
                list.appendChild(msg);
            }
        });
    }

    function getCurrentCourseType() {
        var path = window.location.pathname;
        var search = window.location.search;
        
        if (path.includes('answers-python') || search.includes('answers-python')) return 'answers-python';
        if (path.includes('answers-linux') || search.includes('answers-linux')) return 'answers-linux';
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
            btn.onclick = function() {
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
        localStorage.setItem('codax_theme', themeName);
        updateThemeButton(themeName);
    }

    function getTheme() {
        return localStorage.getItem('codax_theme') || 'dark';
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
            (function(themeKey) {
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
                
                item.addEventListener('click', function(e) {
                    e.stopPropagation();
                    setTheme(themeKey);
                    menu.querySelectorAll('.theme-menu-item').forEach(function(el) {
                        el.classList.remove('active');
                    });
                    item.classList.add('active');
                    menu.classList.remove('show');
                });
                
                menu.appendChild(item);
            })(key);
        }
        
        document.body.appendChild(menu);
        
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            menu.classList.toggle('show');
        });
        
        document.addEventListener('click', function(e) {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.classList.remove('show');
            }
        });
        
        document.addEventListener('keydown', function(e) {
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
        } catch(e) {
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
            .then(function(res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(function(remoteVersion) {
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
                updates.forEach(function(u) {
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
        var criticalUpdates = updateInfo.updates.filter(function(u) {
            return u.updateType === 'critical';
        });

        var updatesList = criticalUpdates.map(function(u) {
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
                <h2 style="color: #ff4444; margin-bottom: 1rem;">Critical Update</h2>
                <p style="color: rgba(255,255,255,0.7); line-height: 1.8; margin: 1rem 0;">
                    یک آپدیت مهم منتشر شده که <strong style="color: #ff4444;">باید</strong> نصبش کنی.
                </p>
                
                <div style="background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.2); border-radius: 8px; padding: 0.8rem 1rem; margin: 1rem 0; text-align: right;">
                    <ul style="list-style: none; padding: 0; margin: 0;">
                        ${updatesList}
                    </ul>
                </div>
                
                <p style="color: rgba(255,255,255,0.4); font-size: 0.75rem; margin: 1rem 0;">
                    ⚠️ تا زمانی که آپدیت نکنی، نمی‌تونی از سایت استفاده کنی.
                </p>
                
                <button onclick="CodaXUtils.applyUpdate()" style="width: 100%; background: rgba(255,68,68,0.15); border: 1px solid rgba(255,68,68,0.4); padding: 0.8rem; border-radius: 12px; color: #ff4444; cursor: pointer; font-family: 'Courier New', monospace; font-size: 0.9rem; font-weight: 600;">
                    🚀 Update Now
                </button>
                <p id="updateProgressText" style="color: rgba(255,255,255,0.4); font-size: 0.75rem; margin: 0.8rem 0 0 0;"></p>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function showNormalUpdate(updateInfo) {
        var normalUpdates = updateInfo.updates.filter(function(u) {
            return u.updateType === 'normal' || u.updateType === 'critical';
        });

        var updatesList = normalUpdates.map(function(u) {
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
                    <h3 style="color: #00d4ff; margin: 0; font-size: 1rem;">New Update Available!</h3>
                    <p style="color: rgba(255,255,255,0.5); margin: 0.3rem 0 0 0; font-size: 0.75rem;">
                        ${normalUpdates.length} دوره آماده‌ی آپدیته
                    </p>
                </div>
            </div>
            
            <div style="background: rgba(0,0,0,0.2); border-radius: 8px; padding: 0.8rem; margin-bottom: 1rem;">
                <ul style="list-style: none; padding: 0; margin: 0;">
                    ${updatesList}
                </ul>
            </div>
            
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="CodaXUtils.applyUpdate()" style="flex: 1; background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); padding: 0.6rem; border-radius: 8px; color: #00d4ff; cursor: pointer; font-family: 'Courier New', monospace; font-size: 0.8rem; font-weight: 600;">
                    🚀 Update Now
                </button>
                <button onclick="CodaXUtils.dismissUpdate()" style="background: transparent; border: 1px solid rgba(255,255,255,0.1); padding: 0.6rem 1rem; border-radius: 8px; color: rgba(255,255,255,0.4); cursor: pointer; font-family: 'Courier New', monospace; font-size: 0.8rem;">
                    ⏰ Later
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
            border: 1px solid rgba(0, 212, 255, 0.3);
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
        var minorUpdates = updateInfo.updates.filter(function(u) {
            return u.updateType === 'minor';
        });

        var toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 255, 204, 0.1);
            border: 1px solid rgba(0, 255, 204, 0.3);
            border-radius: 12px;
            padding: 0.8rem 1.5rem;
            color: #00ffcc;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            z-index: 10000;
            backdrop-filter: blur(20px);
            animation: slideUpNotif 0.4s ease;
            max-width: 90%;
            text-align: center;
        `;
        toast.innerHTML = `✅ ${minorUpdates.length} آپدیت جزئی در حال اعمال...`;
        
        addSlideUpStyle();
        document.body.appendChild(toast);
        
        setTimeout(function() {
            applyUpdate(true).then(function() {
                toast.innerHTML = '✅ آپدیت‌های جزئی اعمال شد!';
                setTimeout(function() {
                    if (toast.parentNode) toast.remove();
                }, 2000);
            });
        }, 1000);
    }

    function addSlideUpStyle() {
        if (document.getElementById('codax-slideup-style')) return;
        var style = document.createElement('style');
        style.id = 'codax-slideup-style';
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
            .then(function(res) { return res.json(); })
            .then(function(remoteVersion) {
                if (progressEl) progressEl.textContent = '📥 در حال آپدیت فایل‌ها...';
                
                return updateAllCachedFiles(remoteVersion, progressEl)
                    .then(function() {
                        saveLocalVersion(remoteVersion);
                    });
            })
            .then(function() {
                if (progressEl) {
                    progressEl.textContent = '✅ آپدیت کامل شد!';
                    progressEl.style.color = '#00ffcc';
                }
                
                setTimeout(function() {
                    location.reload();
                }, 1500);
            })
            .catch(function(err) {
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
            (function(courseName) {
                var course = versionData.courses[courseName];
                var basePath = getBasePath(courseName);
                
                course.lessons.forEach(function(lesson) {
                    var promise = fetch(basePath + lesson.name + '?v=' + Date.now())
                        .then(function(res) {
                            if (!res.ok) throw new Error('HTTP ' + res.status);
                            return res.text();
                        })
                        .then(function(content) {
                            saveToCache(lesson.name, content, courseName);
                            completedFiles++;
                            
                            if (progressEl) {
                                var percent = Math.round((completedFiles / totalFiles) * 100);
                                progressEl.textContent = '📥 ' + completedFiles + ' / ' + totalFiles + ' (' + percent + '%)';
                            }
                        })
                        .catch(function(err) {
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
            setTimeout(function() {
                if (notification.parentNode) notification.remove();
            }, 300);
        }
        
        localStorage.setItem('codax_update_dismissed', Date.now());
    }

    // ============================================
    // ۱۱. کش کردن دوره (ترتیبی)
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
    // ۱۲. اشتراک‌گذاری
    // ============================================

    function shareLesson(file, title, courseType) {
        var baseUrl = window.location.origin + window.location.pathname;
        var shareUrl = baseUrl + '?lesson=' + encodeURIComponent(file);
        
        var shareData = {
            title: 'CodaX | ' + title,
            text: '📚 ' + title + '\n\nاز آکادمی CodaX ببین:',
            url: shareUrl
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(function() {
                    console.log('✅ اشتراک‌گذاری موفق');
                })
                .catch(function(err) {
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
            navigator.clipboard.writeText(url).then(function() {
                showToast('✅ لینک کپی شد!');
            }).catch(function() {
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
            background: rgba(0, 255, 204, 0.15);
            border: 1px solid rgba(0, 255, 204, 0.4);
            border-radius: 12px;
            padding: 0.8rem 1.5rem;
            color: #00ffcc;
            font-family: 'Courier New', monospace;
            font-size: 0.85rem;
            z-index: 10000;
            backdrop-filter: blur(20px);
            animation: slideUp 0.3s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(function() {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s ease';
            setTimeout(function() {
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
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 16px;
                padding: 1.5rem;
                max-width: 500px;
                width: 100%;
                direction: rtl;
                font-family: 'Courier New', monospace;
            ">
                <h3 style="color: #00d4ff; margin: 0 0 1rem 0; text-align: center;">
                    🔗 اشتراک‌گذاری درس
                </h3>
                <p style="color: rgba(255,255,255,0.6); font-size: 0.85rem; margin: 0 0 1rem 0;">
                    ${title}
                </p>
                <input type="text" value="${url}" readonly style="
                    width: 100%;
                    padding: 0.6rem;
                    border-radius: 8px;
                    border: 1px solid rgba(0, 212, 255, 0.3);
                    background: rgba(0, 0, 0, 0.3);
                    color: #00d4ff;
                    font-family: 'Courier New', monospace;
                    font-size: 0.75rem;
                    direction: ltr;
                    text-align: left;
                    margin-bottom: 1rem;
                    box-sizing: border-box;
                " id="shareUrlInput">
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="CodaXUtils.copyShareUrl()" style="
                        flex: 1;
                        background: rgba(0, 212, 255, 0.1);
                        border: 1px solid rgba(0, 212, 255, 0.3);
                        padding: 0.7rem;
                        border-radius: 8px;
                        color: #00d4ff;
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
        
        setTimeout(function() {
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
    // ۱۳. API عمومی
    // ============================================

    window.CodaXUtils = {
        // کش
        saveToCache: saveToCache,
        getFromCache: getFromCache,
        getAllCache: getAllCache,
        clearCache: clearCache,
        isInCache: isInCache,
        getCourseCacheCount: getCourseCacheCount,
        
        // پیشرفت
        markAsSeen: markAsSeen,
        getProgressCount: getProgressCount,
        clearProgress: clearProgress,
        updateProgress: updateProgress,
        
        // آخرین درس
        saveLastLesson: saveLastLesson,
        getLastLesson: getLastLesson,
        clearLastLesson: clearLastLesson,
        
        // جستجو و ادامه
        setupSearch: setupSearch,
        setupResume: setupResume,
        
        // تم
        setTheme: setTheme,
        getTheme: getTheme,
        loadTheme: loadTheme,
        createThemeMenu: createThemeMenu,
        THEMES: THEMES,
        
        // نسخه و آپدیت
        getLocalVersion: getLocalVersion,
        saveLocalVersion: saveLocalVersion,
        compareVersionsNumbers: compareVersionsNumbers,
        checkForUpdates: checkForUpdates,
        showUpdateNotification: showUpdateNotification,
        applyUpdate: applyUpdate,
        dismissUpdate: dismissUpdate,
        
        // کش دوره
        cacheCourse: cacheCourse,
        clearCourseCache: clearCourseCache,
        
        // اشتراک‌گذاری
        shareLesson: shareLesson,
        copyShareUrl: copyShareUrl
    };

    // ============================================
    // ۱۴. مقداردهی اولیه
    // ============================================

    function init() {
        loadTheme();
        setupSearch();
        setupResume();
        createThemeMenu();

        if (navigator.onLine) {
            setTimeout(function() {
                checkForUpdates()
                    .then(function(result) {
                        if (result.hasUpdate && !result.isFirstTime) {
                            var lastDismiss = localStorage.getItem('codax_update_dismissed');
                            var now = Date.now();
                            
                            if (!lastDismiss || (now - parseInt(lastDismiss)) > 86400000) {
                                showUpdateNotification(result);
                            }
                        }
                        
                        if (result.isFirstTime) {
                            saveLocalVersion(result.remote);
                        }
                    })
                    .catch(function(err) {
                        console.log('⚠️ خطا در چک آپدیت:', err);
                    });
            }, 3000);
        }

        console.log('⚡ CodaXUtils ready!');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();