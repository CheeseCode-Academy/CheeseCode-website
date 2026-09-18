// ============================================
// 🧀 جستجوی سراسری | CheeseCode Academy
// نسخه: 3.0.0 - ناوبری هوشمند + فیلتر چالش‌ها
// ============================================

(function () {
    'use strict';

    var searchModal = null;
    var searchInput = null;
    var resultsContainer = null;

    // ============================================
    // ساخت مودال جستجو
    // ============================================
    function createSearchModal() {
        if (document.getElementById('globalSearchModal')) {
            searchModal = document.getElementById('globalSearchModal');
            searchInput = document.getElementById('globalSearchInput');
            resultsContainer = document.getElementById('globalSearchResults');
            return;
        }

        var modal = document.createElement('div');
        modal.id = 'globalSearchModal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 10003;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            justify-content: center;
            align-items: flex-start;
            padding: 3rem 1rem 1rem 1rem;
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
            max-width: 600px;
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
            border-top: 2px solid #f5b81b;
        `;

        var closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            left: 1.5rem;
            top: 3rem;
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
            z-index: 10;
        `;
        closeBtn.onmouseover = function () { this.style.color = '#ff4444'; };
        closeBtn.onmouseout = function () { this.style.color = 'rgba(255, 255, 255, 0.5)'; };
        closeBtn.onclick = closeSearch;

        var title = document.createElement('h3');
        title.textContent = '🔍 جستجوی سراسری';
        title.style.cssText = `
            color: #f5b81b;
            font-weight: 700;
            font-size: 1.1rem;
            margin: 0 0 1rem 0;
            text-align: center;
        `;

        var inputWrapper = document.createElement('div');
        inputWrapper.style.cssText = 'position: relative; margin-bottom: 1rem;';

        var input = document.createElement('input');
        input.id = 'globalSearchInput';
        input.type = 'text';
        input.placeholder = 'جستجو در درس‌ها، پاسخ‌ها، کوییزها و پروژه‌ها...';
        input.style.cssText = `
            width: 100%;
            padding: 0.9rem 1rem 0.9rem 3rem;
            background: rgba(0, 0, 0, 0.4);
            color: #ffffff;
            border: 1px solid rgba(245, 184, 27, 0.3);
            border-radius: 12px;
            font-family: 'Courier New', monospace;
            font-size: 0.95rem;
            outline: none;
            box-sizing: border-box;
            transition: all 0.2s ease;
            direction: rtl;
        `;
        input.onfocus = function () {
            this.style.borderColor = '#f5b81b';
            this.style.boxShadow = '0 0 20px rgba(245, 184, 27, 0.2)';
        };
        input.onblur = function () {
            this.style.borderColor = 'rgba(245, 184, 27, 0.3)';
            this.style.boxShadow = 'none';
        };

        var searchIcon = document.createElement('span');
        searchIcon.textContent = '🔍';
        searchIcon.style.cssText = `
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1rem;
            pointer-events: none;
            opacity: 0.5;
        `;

        inputWrapper.appendChild(input);
        inputWrapper.appendChild(searchIcon);

        var results = document.createElement('div');
        results.id = 'globalSearchResults';
        results.style.cssText = `
            flex: 1;
            overflow-y: auto;
            max-height: 55vh;
            padding: 0.2rem;
        `;

        results.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.4); font-size: 0.85rem;">
                <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
                شروع به تایپ کن...
                <div style="font-size: 0.7rem; margin-top: 0.5rem; color: rgba(255, 255, 255, 0.3);">
                    حداقل ۲ حرف
                </div>
            </div>
        `;

        content.appendChild(closeBtn);
        content.appendChild(title);
        content.appendChild(inputWrapper);
        content.appendChild(results);
        modal.appendChild(content);
        document.body.appendChild(modal);

        searchModal = modal;
        searchInput = input;
        resultsContainer = results;

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeSearch();
        });

        var searchTimeout = null;
        input.addEventListener('input', function () {
            var query = this.value.trim();

            if (searchTimeout) clearTimeout(searchTimeout);

            if (query.length < 2) {
                results.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.4); font-size: 0.85rem;">
                        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
                        شروع به تایپ کن...
                    </div>
                `;
                return;
            }

            searchTimeout = setTimeout(function () {
                performSearch(query);
            }, 250);
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                var firstResult = results.querySelector('.search-result-item');
                if (firstResult) firstResult.click();
            }
            if (e.key === 'Escape') closeSearch();
        });
    }

    // ============================================
    // جستجو
    // ============================================
    function performSearch(query) {
        var q = query.toLowerCase();
        var allResults = [];
        var searchPromises = [];

        // ============================================
        // ۱. جستجو در کش دوره‌ها (درس + پاسخ)
        // ============================================
        var cacheKeys = [
            { key: 'cheese_cache_python', type: 'python', title: 'دوره پایتون', icon: '🐍', page: 'python.html' },
            { key: 'cheese_cache_linux', type: 'linux', title: 'دوره لینوکس', icon: '🐧', page: 'linux.html' },
            { key: 'cheese_cache_answers_python', type: 'answers-python', title: 'پاسخ‌های پایتون', icon: '📝', page: 'answers-python.html' },
            { key: 'cheese_cache_answers_linux', type: 'answers-linux', title: 'پاسخ‌های لینوکس', icon: '📝', page: 'answers-linux.html' }
        ];

        cacheKeys.forEach(function (c) {
            try {
                var cache = JSON.parse(localStorage.getItem(c.key) || '{}');
                for (var file in cache) {
                    var content = cache[file];
                    var plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');

                    if (plainText.toLowerCase().includes(q)) {
                        var idx = plainText.toLowerCase().indexOf(q);
                        var snippet = plainText.substring(Math.max(0, idx - 50), idx + 80);

                        allResults.push({
                            type: c.type,
                            icon: c.icon,
                            course: c.title,
                            title: file.replace('.html', '').replace(/-/g, ' '),
                            snippet: '...' + snippet + '...',
                            page: c.page,
                            lessonFile: file,
                            matchText: query
                        });
                    }
                }
            } catch (e) { }
        });

        // ============================================
        // ۲. جستجو در کوییزها
        // ============================================
        var quizConfigs = [
            { config: window.pythonQuizConfig, type: 'python-quiz', title: 'کوییز پایتون', icon: '🎓', page: 'python-quiz.html' },
            { config: window.linuxQuizConfig, type: 'linux-quiz', title: 'کوییز لینوکس', icon: '🎓', page: 'linux-quiz.html' }
        ];

        quizConfigs.forEach(function (qc) {
            if (!qc.config || !Array.isArray(qc.config)) return;

            qc.config.forEach(function (quiz) {
                var cacheKey = 'cheese_quiz_cache_' + quiz.file;
                var cached = localStorage.getItem(cacheKey);

                if (cached) {
                    try {
                        var data = JSON.parse(cached);
                        var titleMatch = (data.title || '').toLowerCase().includes(q);
                        var questionMatch = data.questions.some(function (question) {
                            return (question.question || '').toLowerCase().includes(q);
                        });

                        if (titleMatch || questionMatch) {
                            allResults.push({
                                type: qc.type,
                                icon: qc.icon,
                                course: qc.title,
                                title: data.title || quiz.title,
                                snippet: data.description || '',
                                page: qc.page,
                                lessonFile: quiz.file,
                                matchText: query
                            });
                        }
                    } catch (e) { }
                } else {
                    if (quiz.title.toLowerCase().includes(q)) {
                        allResults.push({
                            type: qc.type,
                            icon: qc.icon,
                            course: qc.title,
                            title: quiz.title,
                            snippet: '(هنوز کش نشده)',
                            page: qc.page,
                            lessonFile: quiz.file,
                            matchText: query
                        });
                    }
                }
            });
        });

        // ============================================
        // ۳. جستجو در پروژه‌ها
        // ============================================
        if (window.projectsConfig && Array.isArray(window.projectsConfig)) {
            window.projectsConfig.forEach(function (project) {
                if ((project.title || '').toLowerCase().includes(q) ||
                    (project.description || '').toLowerCase().includes(q)) {
                    allResults.push({
                        type: 'project',
                        icon: project.icon || '💼',
                        course: 'پروژه‌ها',
                        title: project.title,
                        snippet: project.description || '',
                        page: 'projects.html',
                        lessonFile: project.id,
                        matchText: query
                    });
                }
            });
        }

        // ============================================
        // ۴. جستجو در چالش‌ها (فقط فعال‌ها)
        // ============================================
        searchPromises.push(
            fetch('settings/challenges.json?v=' + Date.now())
                .then(function (r) { return r.json(); })
                .then(function (challenges) {
                    var today = new Date();
                    today.setHours(0, 0, 0, 0);

                    challenges.forEach(function (ch) {
                        // ⚠️ فقط چالش‌های فعال (غیر منقضی)
                        var isExpired = false;
                        if (ch.expirationDate) {
                            var expDate = new Date(ch.expirationDate);
                            expDate.setHours(23, 59, 59, 999);
                            if (expDate < today) isExpired = true;
                        }

                        if (isExpired) return; // چالش منقضی رو نشون نده

                        if ((ch.title || '').toLowerCase().includes(q) ||
                            (ch.description || '').toLowerCase().includes(q)) {
                            allResults.push({
                                type: 'challenge',
                                icon: '🎯',
                                course: 'چالش فعال',
                                title: ch.title,
                                snippet: ch.description || '',
                                page: 'challenges.html',
                                challengeId: ch.id,
                                matchText: query
                            });
                        }
                    });
                })
                .catch(function () { })
        );

        Promise.all(searchPromises).then(function () {
            renderResults(allResults, query);
        });
    }

    // ============================================
    // نمایش نتایج
    // ============================================
    function renderResults(results, query) {
        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.4); font-size: 0.85rem;">
                    <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">😔</div>
                    نتیجه‌ای برای «${escapeHtml(query)}» یافت نشد
                    <div style="font-size: 0.7rem; margin-top: 0.5rem; color: rgba(255, 255, 255, 0.3);">
                        مطمئن شو محتوا رو کش کردی
                    </div>
                </div>
            `;
            return;
        }

        var html = '<div style="font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); margin-bottom: 0.5rem; padding: 0 0.3rem;">📋 ' + toPersianNumber(results.length) + ' نتیجه</div>';

        results.forEach(function (r, index) {
            var snippet = r.snippet ? highlightText(r.snippet, query) : '';

            html += `
                <div class="search-result-item" 
                     data-index="${index}"
                     data-page="${r.page}"
                     data-lesson="${r.lessonFile || ''}"
                     data-challenge="${r.challengeId || ''}"
                     data-match="${escapeHtml(query)}"
                     style="display: block; text-decoration: none; padding: 0.8rem; margin-bottom: 0.5rem; background: rgba(245, 184, 27, 0.03); border: 1px solid rgba(245, 184, 27, 0.1); border-radius: 10px; transition: all 0.2s ease; color: inherit; cursor: pointer;"
                     onmouseover="this.style.background='rgba(245, 184, 27, 0.08)'; this.style.borderColor='rgba(0, 212, 255, 0.3)'"
                     onmouseout="this.style.background='rgba(245, 184, 27, 0.03)'; this.style.borderColor='rgba(245, 184, 27, 0.1)'">
                    <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.3rem;">
                        <span style="font-size: 1.2rem;">${r.icon}</span>
                        <span style="color: #f5b81b; font-size: 0.75rem; font-family: 'Courier New', monospace;">${r.course}</span>
                    </div>
                    <div style="color: rgba(255, 255, 255, 0.9); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.2rem; font-family: 'Courier New', monospace;">
                        ${highlightText(r.title, query)}
                    </div>
                    ${snippet ? '<div style="color: rgba(255, 255, 255, 0.4); font-size: 0.7rem; line-height: 1.5; direction: ltr; text-align: left;">' + snippet + '</div>' : ''}
                </div>
            `;
        });

        resultsContainer.innerHTML = html;

        // کلیک روی نتیجه
        resultsContainer.querySelectorAll('.search-result-item').forEach(function (item) {
            item.addEventListener('click', function () {
                navigateToResult(item);
            });
        });
    }

    // ============================================
    // ناوبری به نتیجه
    // ============================================
    function navigateToResult(item) {
        var page = item.dataset.page;
        var lessonFile = item.dataset.lesson;
        var challengeId = item.dataset.challenge;
        var matchText = item.dataset.match;

        closeSearch();

        setTimeout(function () {
            var url = page;

            if (challengeId) {
                // چالش
                url += '?challenge=' + encodeURIComponent(challengeId);
            } else if (lessonFile) {
                // درس/پاسخ/کوییز
                url += '?lesson=' + encodeURIComponent(lessonFile);
                // ⚠️ برای اسکرول و هایلایت
                if (matchText) {
                    url += '&highlight=' + encodeURIComponent(matchText);
                }
            }

            window.location.href = url;
        }, 200);
    }

    // ============================================
    // هایلایت متن جستجو
    // ============================================
    function highlightText(text, query) {
        if (!text) return '';
        var escaped = escapeHtml(text);
        var regex = new RegExp('(' + escapeRegex(query) + ')', 'gi');
        return escaped.replace(regex, '<mark style="background: rgba(245, 184, 27, 0.3); color: #f5b81b; padding: 0 2px; border-radius: 3px;">$1</mark>');
    }

    function escapeHtml(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function toPersianNumber(num) {
        var persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(num).replace(/\d/g, function (d) { return persian[d]; });
    }

    // ============================================
    // باز/بسته کردن
    // ============================================
    function openSearch() {
        if (!searchModal) createSearchModal();
        searchModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        setTimeout(function () {
            if (searchInput) {
                searchInput.value = '';
                searchInput.focus();
                if (resultsContainer) {
                    resultsContainer.innerHTML = `
                        <div style="text-align: center; padding: 2rem; color: rgba(255, 255, 255, 0.4); font-size: 0.85rem;">
                            <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
                            شروع به تایپ کن...
                            <div style="font-size: 0.7rem; margin-top: 0.5rem; color: rgba(255, 255, 255, 0.3);">
                                حداقل ۲ حرف
                            </div>
                        </div>
                    `;
                }
            }
        }, 100);
    }

    function closeSearch() {
        if (searchModal) {
            searchModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // ============================================
    // اضافه کردن دکمه به هدر
    // ============================================
    function addSearchButton() {
        if (document.getElementById('globalSearchBtn')) return;

        var heroPanel = document.querySelector('.hero-panel');
        if (!heroPanel) return;

        var btn = document.createElement('button');
        btn.id = 'globalSearchBtn';
        btn.title = 'جستجوی سراسری (Ctrl+K)';
        btn.innerHTML = '🔍';
        btn.style.cssText = `
            background: rgba(0, 212, 255, 0.08);
            border: 1px solid rgba(0, 212, 255, 0.2);
            border-radius: 8px;
            color: #00d4ff;
            cursor: pointer;
            font-size: 1.2rem;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 51.19px;
            height: 51.19px;
            padding: 0;
            box-sizing: border-box;
            flex-shrink: 0;
        `;
        btn.onmouseover = function () {
            this.style.background = 'rgba(0, 212, 255, 0.15)';
            this.style.borderColor = 'rgba(0, 212, 255, 0.4)';
            this.style.transform = 'scale(1.05)';
        };
        btn.onmouseout = function () {
            this.style.background = 'rgba(0, 212, 255, 0.08)';
            this.style.borderColor = 'rgba(0, 212, 255, 0.2)';
            this.style.transform = 'scale(1)';
        };
        btn.onclick = openSearch;

        var headerActions = heroPanel.querySelector('div[style*="display:flex"]');
        if (headerActions) {
            headerActions.insertBefore(btn, headerActions.firstChild);
        }
    }

    // ============================================
    // شروع
    // ============================================
    function init() {
        createSearchModal();
        addSearchButton();

        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                openSearch();
            }
        });

        console.log('🔍 Global Search ready! (v3.0.0)');
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.GlobalSearch = {
        open: openSearch,
        close: closeSearch
    };

})();