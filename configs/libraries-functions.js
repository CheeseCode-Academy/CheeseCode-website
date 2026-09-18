// ============================================
// 🧀 فانکشن‌های مرکز دانلود | CheeseCode Academy
// نسخه: 4.0.0 - با کش کوییز
// ============================================

window.versionData = null;

// ============================================
// بارگذاری اطلاعات
// ============================================
async function loadAllData() {
    try {
        var sectionsContainer = document.getElementById('sectionsContainer');
        if (sectionsContainer) {
            sectionsContainer.innerHTML = '<p style="color:#f5b81b; text-align:center; padding:1rem;">⏳ در حال بارگذاری...</p>';
        }

        var text = null;

        // اول از cache
        try {
            const cache = await caches.open('cheese-v8');
            const cachedResponse = await cache.match('./version.json');

            if (cachedResponse) {
                text = await cachedResponse.text();
                console.log('📦 version.json از cache لود شد');
            }
        } catch (e) { }

        // بعد از شبکه
        if (!text) {
            const res = await fetch('version.json?v=' + Date.now());
            if (!res.ok) throw new Error('version.json - HTTP ' + res.status);
            text = await res.text();

            try {
                const cache = await caches.open('cheese-v8');
                await cache.put('./version.json', new Response(text, {
                    headers: { 'Content-Type': 'application/json' }
                }));
            } catch (e) { }
        }

        try {
            window.versionData = JSON.parse(text);
        } catch (jsonErr) {
            throw new Error('JSON خرابه: ' + jsonErr.message);
        }

        if (!window.versionData.courses) {
            throw new Error('فیلد courses توی version.json نیست');
        }

        renderActionButtons();
        renderAllSections();
        updateCacheStatus();

        console.log('✅ بارگذاری کامل شد');

    } catch (err) {
        console.error('❌ خطا:', err);

        var sectionsContainer = document.getElementById('sectionsContainer');
        if (sectionsContainer) {
            sectionsContainer.innerHTML = `
                <div style="background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.3);border-radius:12px;padding:1.5rem;text-align:center;font-family:'Courier New',monospace;color:#ff6b6b;">
                    <div style="font-size:3rem;margin-bottom:1rem;">❌</div>
                    <h3 style="margin:0 0 1rem 0;">خطا در بارگذاری اطلاعات</h3>
                    <p style="background:rgba(0,0,0,0.3);padding:0.8rem;border-radius:8px;font-size:0.8rem;color:rgba(255,255,255,0.8);direction:ltr;text-align:left;word-break:break-all;">${err.message}</p>
                    <button onclick="location.reload()" style="margin-top:1rem;background:rgba(245,184,27,0.1);border:1px solid rgba(245,184,27,0.3);padding:0.6rem 1.5rem;border-radius:8px;color:#f5b81b;cursor:pointer;font-family:'Courier New',monospace;font-size:0.85rem;">🔄 تلاش دوباره</button>
                </div>
            `;
        }
    }
}

// ============================================
// ساخت دکمه‌های عملیات
// ============================================
function renderActionButtons() {
    var container = document.getElementById('actionButtonsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (typeof window.librariesConfig === 'undefined' || !window.librariesConfig.actionButtons) {
        container.innerHTML = `
            <button class="btn-cache-pages" onclick="cacheMainPages()">📄 کش کردن صفحات اصلی</button>
            <button class="btn-check-update" onclick="checkUpdateNow()">🔄 بررسی آپدیت</button>
            <button class="btn-clear-all" onclick="clearAllCache()">🗑️ حذف کامل کش</button>
        `;
        return;
    }

    window.librariesConfig.actionButtons.forEach(function (btn) {
        var button = document.createElement('button');

        var btnClass = 'btn-check-update';
        if (btn.id === 'cache-pages') btnClass = 'btn-cache-pages';
        if (btn.id === 'clear-cache' || btn.type === 'danger') btnClass = 'btn-clear-all';

        button.className = btnClass;
        button.innerHTML = btn.icon + ' ' + btn.title;
        button.onclick = function () {
            if (typeof window[btn.action] === 'function') {
                window[btn.action]();
            }
        };

        container.appendChild(button);
    });
}

// ============================================
// نمایش همه‌ی بخش‌ها
// ============================================
function renderAllSections() {
    const container = document.getElementById('sectionsContainer');
    if (!container) return;

    container.innerHTML = '';

    if (typeof window.librariesConfig === 'undefined' || !window.librariesConfig.sections) {
        container.innerHTML = '<p style="color:#ff6b6b; text-align:center; padding:1rem;">❌ فایل libraries-config.js یافت نشد</p>';
        return;
    }

    window.librariesConfig.sections.forEach(section => {
        const sectionEl = document.createElement('section');
        sectionEl.className = 'libraries-section';

        sectionEl.innerHTML = `
            <h2 class="section-title">${section.title}</h2>
            <p class="section-desc">${section.description || ''}</p>
            <div class="download-cards" id="section-${section.id}"></div>
        `;

        container.appendChild(sectionEl);

        const contentContainer = sectionEl.querySelector(`#section-${section.id}`);

        if (section.type === 'cacheable') {
            renderCacheableItems(contentContainer, section.items);
        } else if (section.type === 'quiz-cacheable') {
            renderQuizCacheableItems(contentContainer, section.items);
        } else if (section.type === 'downloads') {
            renderDownloadItems(contentContainer, section.items);
        } else if (section.type === 'links') {
            renderLinkItems(contentContainer, section.items);
        }
    });
}

// ============================================
// آیتم‌های کش‌شدنی (دوره‌ها)
// ============================================
function renderCacheableItems(container, items) {
    container.innerHTML = '';

    items.forEach(item => {
        const courseKey = item.courseKey;
        const course = window.versionData.courses[courseKey];

        if (!course) return;

        const total = course.lessons.length;
        const cachedCount = window.CheeseUtils.getCourseCacheCount(courseKey);
        const percent = Math.round((cachedCount / total) * 100);

        const card = document.createElement('div');
        card.className = 'download-card';
        card.innerHTML = `
            <div class="card-header">
                <span class="card-icon">${course.icon}</span>
                <div class="card-info">
                    <h3>${course.title}</h3>
                    <p class="card-stats">${total} فایل</p>
                </div>
            </div>
            
            <div class="card-progress">
                <div class="progress-bar-track-small">
                    <div class="progress-bar-fill-small" style="width: ${percent}%;"></div>
                </div>
                <p class="progress-label">${cachedCount} / ${total} کش شده (${percent}%)</p>
            </div>
            
            <div class="card-actions">
                <button class="btn-cache" onclick="cacheCourse('${courseKey}')">
                    📦 کش کردن
                </button>
                ${cachedCount > 0 ? `
                    <button class="btn-clear" onclick="clearCourse('${courseKey}')">
                        🗑️ پاک کردن
                    </button>
                ` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

// ============================================
// آیتم‌های کوییز کش‌شدنی (جدید — باگ #10)
// ============================================
function renderQuizCacheableItems(container, items) {
    container.innerHTML = '';

    items.forEach(item => {
        const courseKey = item.courseKey;

        const configKey = courseKey === 'python-quiz' ? 'pythonQuizConfig' : 'linuxQuizConfig';
        const quizConfig = window[configKey];

        if (!quizConfig || !Array.isArray(quizConfig)) {
            console.warn('⚠️ ' + configKey + ' پیدا نشد');
            return;
        }

        const total = quizConfig.length;

        let cachedCount = 0;
        quizConfig.forEach(function (quiz) {
            const cacheKey = 'cheese_quiz_cache_' + quiz.file;
            if (localStorage.getItem(cacheKey)) {
                cachedCount++;
            }
        });

        const percent = total > 0 ? Math.round((cachedCount / total) * 100) : 0;

        const card = document.createElement('div');
        card.className = 'download-card';
        card.innerHTML = `
            <div class="card-header">
                <span class="card-icon">${item.icon || '🎓'}</span>
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <p class="card-stats">${total} کوییز</p>
                </div>
            </div>
            
            <div class="card-progress">
                <div class="progress-bar-track-small">
                    <div class="progress-bar-fill-small" style="width: ${percent}%;"></div>
                </div>
                <p class="progress-label">${cachedCount} / ${total} کش شده (${percent}%)</p>
            </div>
            
            <div class="card-actions">
                <button class="btn-cache" onclick="cacheQuizCourse('${courseKey}')">
                    📦 کش کردن
                </button>
                ${cachedCount > 0 ? `
                    <button class="btn-clear" onclick="clearQuizCourse('${courseKey}')">
                        🗑️ پاک کردن
                    </button>
                ` : ''}
            </div>
        `;
        container.appendChild(card);
    });
}

// ============================================
// آیتم‌های دانلودی
// ============================================
function renderDownloadItems(container, items) {
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'download-card';
        card.innerHTML = `
            <div class="card-header">
                <span class="card-icon">${item.icon || '📄'}</span>
                <div class="card-info">
                    <h3>${item.title}</h3>
                    <p class="card-desc">${item.description || ''}</p>
                    <p class="card-stats">
                        ${item.size ? '💾 ' + item.size : ''}
                        ${item.version ? ' | 📅 نسخه ' + item.version : ''}
                    </p>
                </div>
            </div>
            
            <div class="card-actions">
                <a href="${item.url}" download class="btn-download">
                    ⬇️ دانلود
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// ============================================
// آیتم‌های لینک
// ============================================
function renderLinkItems(container, items) {
    container.innerHTML = '';

    items.forEach(item => {
        const card = document.createElement('a');
        card.className = 'resource-card';
        card.href = item.url;
        card.target = '_blank';
        card.innerHTML = `
            <span class="resource-icon">${item.icon || '🔗'}</span>
            <div class="resource-info">
                <h4>${item.title}</h4>
                <p>${item.description || ''}</p>
            </div>
            <span class="resource-arrow">↗</span>
        `;
        container.appendChild(card);
    });
}

// ============================================
// کش کردن صفحات اصلی
// ============================================
async function cacheMainPages() {
    showProgress('📄 در حال کش کردن صفحات اصلی...');

    var mainPages = (typeof window.librariesConfig !== 'undefined' && window.librariesConfig.mainPages)
        ? window.librariesConfig.mainPages
        : [];

    if (mainPages.length === 0) {
        showProgress('❌ لیست صفحات اصلی خالیه!', 'error');
        setTimeout(hideProgress, 3000);
        return;
    }

    try {
        const cache = await caches.open('cheese-v8');
        let completed = 0;
        let errors = [];

        for (const url of mainPages) {
            try {
                const response = await fetch(url, { cache: 'no-store' });

                if (response.ok) {
                    await cache.put(url, response.clone());
                } else {
                    errors.push({ url: url, error: 'HTTP ' + response.status });
                }
                completed++;
                showProgress(`📄 ${completed} / ${mainPages.length}`);
            } catch (err) {
                errors.push({ url: url, error: err.message });
                completed++;
                showProgress(`📄 ${completed} / ${mainPages.length}`);
            }
        }

        if (errors.length > 0) {
            let errorMsg = `${completed - errors.length} از ${mainPages.length} کش شد\n`;
            errorMsg += `${errors.length} فایل خطا داد:\n\n`;

            errors.forEach(function (e, i) {
                errorMsg += (i + 1) + '. ' + e.url + '\n   → ' + e.error + '\n\n';
            });

            alert(errorMsg);
            showProgress(`⚠️ ${completed - errors.length} از ${mainPages.length} (${errors.length} خطا)`, 'error');
        } else {
            showProgress(`✅ ${completed} از ${mainPages.length} فایل کش شد!`, 'success');
        }

        setTimeout(() => {
            hideProgress();
            updateCacheStatus();
        }, 3000);

    } catch (err) {
        alert('❌ خطای کلی:\n' + err.message);
        showProgress('❌ خطا: ' + err.message, 'error');
        setTimeout(hideProgress, 3000);
    }
}

// ============================================
// کش کردن دوره
// ============================================
async function cacheCourse(courseKey) {
    showProgress('📥 در حال کش کردن...');

    try {
        const result = await window.CheeseUtils.cacheCourse(courseKey, (completed, total, name) => {
            const percent = Math.round((completed / total) * 100);
            showProgress(`📥 ${completed} / ${total} (${percent}%)`);
        });

        if (result.errors && result.errors.length > 0) {
            let errorMsg = `${result.completed} از ${result.total} فایل کش شد\n`;
            errorMsg += `${result.errors.length} فایل خطا داد`;
            showErrorModal(errorMsg, result.errors);
            showProgress(`⚠️ ${result.completed} از ${result.total} (${result.errors.length} خطا)`, 'error');
        } else {
            showProgress(`✅ ${result.completed} از ${result.total} فایل کش شد!`, 'success');
        }

        setTimeout(() => {
            renderAllSections();
            updateCacheStatus();
            hideProgress();
        }, 3000);

    } catch (err) {
        showProgress('❌ خطا: ' + err.message, 'error');
        setTimeout(hideProgress, 3000);
    }
}

// ============================================
// کش کردن کوییز (جدید — باگ #10)
// ============================================
async function cacheQuizCourse(courseKey) {
    showProgress('📥 در حال کش کردن کوییزها...');

    try {
        const result = await window.CheeseUtils.cacheQuizCourse(courseKey, (completed, total, name) => {
            const percent = Math.round((completed / total) * 100);
            showProgress(`📥 ${completed} / ${total} (${percent}%)`);
        });

        if (result.errors && result.errors.length > 0) {
            let errorMsg = `${result.completed} از ${result.total} کوییز کش شد\n`;
            errorMsg += `${result.errors.length} کوییز خطا داد`;
            showErrorModal(errorMsg, result.errors);
            showProgress(`⚠️ ${result.completed} از ${result.total} (${result.errors.length} خطا)`, 'error');
        } else {
            showProgress(`✅ ${result.completed} از ${result.total} کوییز کش شد!`, 'success');
        }

        setTimeout(() => {
            renderAllSections();
            updateCacheStatus();
            hideProgress();
        }, 3000);

    } catch (err) {
        showProgress('❌ خطا: ' + err.message, 'error');
        setTimeout(hideProgress, 3000);
    }
}

// ============================================
// پاک کردن کش دوره
// ============================================
function clearCourse(courseKey) {
    if (confirm('آیا مطمئنی می‌خوای کش این دوره رو پاک کنی؟')) {
        window.CheeseUtils.clearCourseCache(courseKey);
        renderAllSections();
        updateCacheStatus();
    }
}

// ============================================
// پاک کردن کش کوییز (جدید)
// ============================================
function clearQuizCourse(courseKey) {
    if (!confirm('آیا مطمئنی می‌خوای کش کوییزها رو پاک کنی؟')) {
        return;
    }

    const configKey = courseKey === 'python-quiz' ? 'pythonQuizConfig' : 'linuxQuizConfig';
    const quizConfig = window[configKey];

    if (!quizConfig || !Array.isArray(quizConfig)) {
        return;
    }

    quizConfig.forEach(function (quiz) {
        const cacheKey = 'cheese_quiz_cache_' + quiz.file;
        localStorage.removeItem(cacheKey);
    });

    renderAllSections();
    updateCacheStatus();
}

// ============================================
// حذف کامل کش
// ============================================
function clearAllCache() {
    if (!confirm('⚠️ آیا مطمئنی می‌خوای کل کش سایت رو حذف کنی؟')) {
        return;
    }

    try {
        localStorage.clear();

        if ('caches' in window) {
            caches.keys().then(function (names) {
                names.forEach(function (name) {
                    caches.delete(name);
                });
            });
        }

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(function (registrations) {
                registrations.forEach(function (registration) {
                    registration.unregister();
                });
            });
        }

        showProgress('✅ کش کامل پاک شد! در حال رفرش...', 'success');

        setTimeout(function () {
            location.reload();
        }, 1000);

    } catch (err) {
        showProgress('❌ خطا: ' + err.message, 'error');
    }
}

// ============================================
// بررسی آپدیت
// ============================================
async function checkUpdateNow() {
    showProgress('🔄 در حال بررسی آپدیت...');

    try {
        const result = await window.CheeseUtils.checkForUpdates();

        if (result.hasUpdate) {
            showProgress(`📢 ${result.updates.length} آپدیت موجود است!`, 'success');
            setTimeout(() => {
                window.CheeseUtils.showUpdateNotification(result);
                hideProgress();
            }, 1500);
        } else {
            showProgress('✅ شما از آخرین نسخه استفاده می‌کنید!', 'success');
            setTimeout(hideProgress, 2000);
        }
    } catch (err) {
        showProgress('❌ خطا: ' + err.message, 'error');
        setTimeout(hideProgress, 3000);
    }
}

// ============================================
// وضعیت کش
// ============================================
function updateCacheStatus() {
    if (!window.versionData) return;

    let totalCached = 0;
    let totalFiles = 0;

    // دوره‌ها
    for (const key in window.versionData.courses) {
        totalCached += window.CheeseUtils.getCourseCacheCount(key);
        totalFiles += window.versionData.courses[key].lessons.length;
    }

    // کوییزها
    var quizConfigs = ['pythonQuizConfig', 'linuxQuizConfig'];
    quizConfigs.forEach(function (configName) {
        var quizConfig = window[configName];
        if (quizConfig && Array.isArray(quizConfig)) {
            totalFiles += quizConfig.length;
            quizConfig.forEach(function (quiz) {
                if (localStorage.getItem('cheese_quiz_cache_' + quiz.file)) {
                    totalCached++;
                }
            });
        }
    });

    const percent = totalFiles > 0 ? Math.round((totalCached / totalFiles) * 100) : 0;

    const statusText = document.getElementById('cacheStatusText');
    const progressFill = document.getElementById('globalProgressFill');

    if (!statusText || !progressFill) return;

    if (totalCached === 0) {
        statusText.textContent = 'هیچ فایلی کش نشده — برای استفاده آفلاین، دوره‌ها را کش کنید';
    } else if (percent === 100) {
        statusText.textContent = `✅ تمام ${totalFiles} فایل کش شده — آماده استفاده آفلاین`;
    } else {
        statusText.textContent = `${totalCached} از ${totalFiles} فایل کش شده (${percent}%)`;
    }

    progressFill.style.width = percent + '%';
}

// ============================================
// نمایش پیشرفت
// ============================================
function showProgress(message, type) {
    let progressEl = document.getElementById('globalProgress');
    if (!progressEl) {
        progressEl = document.createElement('div');
        progressEl.id = 'globalProgress';
        progressEl.className = 'global-progress';
        document.body.appendChild(progressEl);
    }

    progressEl.className = 'global-progress ' + (type || '');
    progressEl.textContent = message;
    progressEl.style.display = 'block';
}

function hideProgress() {
    const progressEl = document.getElementById('globalProgress');
    if (progressEl) progressEl.style.display = 'none';
}

// ============================================
// مودال خطا
// ============================================
function showErrorModal(message, errors) {
    const oldModal = document.getElementById('cacheErrorModal');
    if (oldModal) oldModal.remove();

    let errorsList = '';
    if (errors && errors.length > 0) {
        errorsList = errors.map(function (err, i) {
            return `<div style="background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.2);border-radius:8px;padding:0.6rem;margin-bottom:0.5rem;font-size:0.75rem;font-family:'Courier New',monospace;">
                <div style="color:#ff6b6b;font-weight:bold;margin-bottom:0.2rem;">${i + 1}. ${err.name}</div>
                <div style="color:rgba(255,255,255,0.5);font-size:0.7rem;">${err.error}</div>
            </div>`;
        }).join('');
    }

    const modal = document.createElement('div');
    modal.id = 'cacheErrorModal';
    modal.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.9);z-index:99999;display:flex;align-items:center;justify-content:center;padding:1rem;direction:rtl;backdrop-filter:blur(10px);';

    modal.innerHTML = `
        <div style="background:rgba(15,22,38,0.98);border:1px solid rgba(255,68,68,0.3);border-radius:16px;padding:1.5rem;max-width:500px;width:100%;max-height:80vh;overflow-y:auto;direction:rtl;font-family:'Courier New',monospace;">
            <div style="text-align:center;margin-bottom:1rem;">
                <div style="font-size:3rem;margin-bottom:0.5rem;">⚠️</div>
                <h2 style="color:#ff6b6b;margin:0;font-size:1.2rem;">خطا در کش کردن</h2>
            </div>
            <div style="background:rgba(0,0,0,0.3);border-radius:8px;padding:0.8rem;margin-bottom:1rem;color:rgba(255,255,255,0.7);font-size:0.85rem;text-align:center;">${message.replace(/\n/g, '<br>')}</div>
            <div style="margin-bottom:1rem;">
                <h3 style="color:#ff6b6b;font-size:0.9rem;margin:0 0 0.5rem 0;">📋 فایل‌های خطادار:</h3>
                <div style="max-height:40vh;overflow-y:auto;">${errorsList}</div>
            </div>
            <div style="display:flex;gap:0.5rem;">
                <button onclick="copyErrorsToClipboard()" style="flex:1;background:rgba(245,184,27,0.1);border:1px solid rgba(245,184,27,0.3);padding:0.7rem;border-radius:8px;color:#f5b81b;cursor:pointer;font-family:'Courier New',monospace;font-size:0.8rem;font-weight:600;">📋 کپی خطاها</button>
                <button onclick="document.getElementById('cacheErrorModal').remove()" style="flex:1;background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.3);padding:0.7rem;border-radius:8px;color:#ff6b6b;cursor:pointer;font-family:'Courier New',monospace;font-size:0.8rem;font-weight:600;">✖ بستن</button>
            </div>
        </div>
    `;

    window._cacheErrors = errors;
    document.body.appendChild(modal);
}

function copyErrorsToClipboard() {
    if (!window._cacheErrors) return;

    let text = 'خطاهای کش:\n\n';
    window._cacheErrors.forEach(function (err, i) {
        text += (i + 1) + '. ' + err.name + ' - ' + err.error + '\n';
    });

    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () {
            alert('✅ خطاها کپی شد!');
        }).catch(function () {
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('✅ خطاها کپی شد!');
    } catch (e) {
        alert('❌ کپی نشد.');
    }
    document.body.removeChild(textarea);
}