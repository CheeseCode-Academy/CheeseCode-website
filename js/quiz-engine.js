// ============================================
// موتور کوییز | CheeseCode Academy
// نسخه: 1.1.0 — با اتصال به قفل درس‌ها
// ============================================

(function () {
    'use strict';

    var currentQuiz = null;
    var currentAnswers = [];
    var currentQuestionIndex = 0;
    var quizContainer = null;
    var onCloseCallback = null;

    function load(quiz, container, onClose) {
        currentQuiz = quiz;
        quizContainer = container;
        onCloseCallback = onClose;
        currentAnswers = [];
        currentQuestionIndex = 0;

        container.innerHTML = '<div style="text-align:center;padding:2rem;">⏳ در حال بارگذاری کوییز...</div>';

        var cacheKey = 'cheese_quiz_cache_' + quiz.file;
        var cached = null;

        try {
            cached = localStorage.getItem(cacheKey);
        } catch (e) { }

        if (cached) {
            try {
                var data = JSON.parse(cached);
                startQuiz(data);
                return;
            } catch (e) {
                console.warn('cache خرابه');
            }
        }

        fetch('quizzes/' + quiz.file + '?v=' + Date.now())
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(function (data) {
                try {
                    localStorage.setItem(cacheKey, JSON.stringify(data));
                } catch (e) { }
                startQuiz(data);
            })
            .catch(function (err) {
                container.innerHTML =
                    '<div style="text-align:center;padding:2rem;color:#ff6b6b;">' +
                    '❌ خطا در بارگذاری کوییز<br>' +
                    '<span style="font-size:0.8rem;color:rgba(255,255,255,0.3);">' + err.message + '</span>' +
                    '</div>';
            });
    }

    function startQuiz(data) {
        currentQuiz.data = data;
        currentAnswers = new Array(data.questions.length).fill(null);
        currentQuestionIndex = 0;
        renderIntro();
    }

    function renderIntro() {
        var data = currentQuiz.data;
        var results = JSON.parse(localStorage.getItem('cheese_quiz_results') || '{}');
        var lastResult = results[currentQuiz.file];

        var html = ''
            + '<div class="quiz-intro">'
            + '  <div class="quiz-intro-icon">🎓</div>'
            + '  <h2 class="quiz-intro-title">' + escapeHtml(data.title) + '</h2>'
            + '  <p class="quiz-intro-desc">' + escapeHtml(data.description || '') + '</p>'
            + '  <div class="quiz-intro-stats">'
            + '    <div class="quiz-stat">'
            + '      <div class="quiz-stat-icon">📝</div>'
            + '      <div class="quiz-stat-value">' + data.questions.length + '</div>'
            + '      <div class="quiz-stat-label">سؤال</div>'
            + '    </div>'
            + '    <div class="quiz-stat">'
            + '      <div class="quiz-stat-icon">🎯</div>'
            + '      <div class="quiz-stat-value">' + (data.passScore || 70) + '%</div>'
            + '      <div class="quiz-stat-label">حد قبولی</div>'
            + '    </div>'
            + '  </div>';

        if (lastResult) {
            var wasPass = lastResult.score >= (data.passScore || 70);
            html += ''
                + '<div class="quiz-last-result ' + (wasPass ? 'pass' : 'fail') + '">'
                + '  <div class="quiz-last-icon">' + (wasPass ? '✅' : '⚠️') + '</div>'
                + '  <div class="quiz-last-text">'
                + '    <div class="quiz-last-label">نتیجه‌ی قبلی شما:</div>'
                + '    <div class="quiz-last-score">' + lastResult.score + '% — ' + (wasPass ? 'قبول' : 'مردود') + '</div>'
                + '  </div>'
                + '</div>';
        }

        html += ''
            + '  <button class="quiz-btn quiz-btn-start" onclick="QuizEngine.start()">'
            + '    🚀 شروع کوییز'
            + '  </button>'
            + '</div>';

        quizContainer.innerHTML = html;
    }

    function start() {
        currentQuestionIndex = 0;
        renderQuestion();
    }

    function renderQuestion() {
        var data = currentQuiz.data;
        var q = data.questions[currentQuestionIndex];
        var total = data.questions.length;
        var current = currentQuestionIndex + 1;
        var percent = Math.round((current / total) * 100);

        var html = ''
            + '<div class="quiz-question-wrapper">'
            + '  <div class="quiz-question-header">'
            + '    <div class="quiz-question-progress">'
            + '      <span>سؤال ' + toPersianNumber(current) + ' از ' + toPersianNumber(total) + '</span>'
            + '      <span>' + toPersianNumber(percent) + '%</span>'
            + '    </div>'
            + '    <div class="quiz-progress-bar">'
            + '      <div class="quiz-progress-fill" style="width: ' + percent + '%;"></div>'
            + '    </div>'
            + '  </div>'
            + '  <div class="quiz-question-text">' + escapeHtml(q.question) + '</div>'
            + '  <div class="quiz-options" id="quizOptions">';

        q.options.forEach(function (option, i) {
            var selected = currentAnswers[currentQuestionIndex] === i;
            html += ''
                + '<button class="quiz-option ' + (selected ? 'selected' : '') + '" '
                + '        onclick="QuizEngine.selectOption(' + i + ')" '
                + '        data-option="' + i + '">'
                + '  <span class="quiz-option-num">' + toPersianNumber(i + 1) + '</span>'
                + '  <span class="quiz-option-text">' + escapeHtml(option) + '</span>'
                + '  <span class="quiz-option-check">✓</span>'
                + '</button>';
        });

        html += ''
            + '  </div>'
            + '  <div class="quiz-actions">'
            + '    <button class="quiz-btn quiz-btn-secondary" onclick="QuizEngine.prev()" '
            + (currentQuestionIndex === 0 ? 'disabled' : '') + '>'
            + '      ← قبلی'
            + '    </button>'
            + '    <button class="quiz-btn quiz-btn-primary" id="quizNextBtn" '
            + (currentAnswers[currentQuestionIndex] === null ? 'disabled' : '') + ' '
            + 'onclick="QuizEngine.next()">'
            + (current === total ? '🎯 پایان' : 'بعدی →')
            + '    </button>'
            + '  </div>'
            + '</div>';

        quizContainer.innerHTML = html;
    }

    function selectOption(optionIndex) {
        currentAnswers[currentQuestionIndex] = optionIndex;

        var options = quizContainer.querySelectorAll('.quiz-option');
        options.forEach(function (el, i) {
            if (i === optionIndex) {
                el.classList.add('selected');
            } else {
                el.classList.remove('selected');
            }
        });

        var nextBtn = document.getElementById('quizNextBtn');
        if (nextBtn) nextBtn.disabled = false;
    }

    function next() {
        var data = currentQuiz.data;
        if (currentQuestionIndex === data.questions.length - 1) {
            finish();
        } else {
            currentQuestionIndex++;
            renderQuestion();
        }
    }

    function prev() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    }

    function finish() {
        var data = currentQuiz.data;
        var correct = 0;
        var wrong = [];

        data.questions.forEach(function (q, i) {
            if (currentAnswers[i] === q.correct) {
                correct++;
            } else {
                wrong.push({
                    index: i,
                    question: q.question,
                    userAnswer: currentAnswers[i] !== null ? q.options[currentAnswers[i]] : '—',
                    correctAnswer: q.options[q.correct],
                    explanation: q.explanation || ''
                });
            }
        });

        var score = Math.round((correct / data.questions.length) * 100);
        var isPass = score >= (data.passScore || 70);

        var results = JSON.parse(localStorage.getItem('cheese_quiz_results') || '{}');
        results[currentQuiz.file] = {
            score: score,
            correct: correct,
            total: data.questions.length,
            date: new Date().toISOString(),
            passed: isPass,
            title: data.title
        };
        localStorage.setItem('cheese_quiz_results', JSON.stringify(results));

        if (isPass) {
            saveBadge(currentQuiz.file, data.title);
        }

        // اتصال به قفل درس‌ها
        if (window.LessonLock && currentQuiz) {
            LessonLock.onQuizFinished(
                currentQuiz.file,
                score,
                data.passScore || 70
            );
        }

        renderResult(score, correct, data.questions.length, isPass, wrong);
    }

    function renderResult(score, correct, total, isPass, wrong) {
        var html = ''
            + '<div class="quiz-result">'
            + '  <div class="quiz-result-icon ' + (isPass ? 'pass' : 'fail') + '">'
            + (isPass ? '🎉' : '😔')
            + '  </div>'
            + '  <h2 class="quiz-result-title">'
            + (isPass ? 'تبریک! قبول شدی' : 'متأسفانه قبول نشدی')
            + '  </h2>'
            + '  <div class="quiz-result-score ' + (isPass ? 'pass' : 'fail') + '">'
            + toPersianNumber(score) + '%'
            + '  </div>'
            + '  <p class="quiz-result-details">'
            + '    ' + toPersianNumber(correct) + ' از ' + toPersianNumber(total) + ' پاسخ درست'
            + '  </p>';

        if (wrong.length > 0) {
            html += ''
                + '<div class="quiz-result-wrongs">'
                + '  <h3 class="quiz-wrongs-title">📚 پاسخ‌های اشتباه:</h3>';

            wrong.forEach(function (w) {
                html += ''
                    + '<div class="quiz-wrong-item">'
                    + '  <div class="quiz-wrong-question">' + escapeHtml(w.question) + '</div>'
                    + '  <div class="quiz-wrong-answer">'
                    + '    <span class="quiz-wrong-label">پاسخ شما:</span> '
                    + '    <span class="quiz-wrong-user">' + escapeHtml(w.userAnswer) + '</span>'
                    + '  </div>'
                    + '  <div class="quiz-wrong-answer">'
                    + '    <span class="quiz-wrong-label">پاسخ درست:</span> '
                    + '    <span class="quiz-wrong-correct">' + escapeHtml(w.correctAnswer) + '</span>'
                    + '  </div>'
                    + (w.explanation ? '  <div class="quiz-wrong-explanation">💡 ' + escapeHtml(w.explanation) + '</div>' : '')
                    + '</div>';
            });

            html += '</div>';
        }

        html += '  <div class="quiz-actions">';

        if (isPass) {
            html += ''
                + '    <button class="quiz-btn quiz-btn-primary" id="btnBackToLessons">'
                + '      برگردیم به دروس'
                + '    </button>';
        } else {
            html += ''
                + '    <button class="quiz-btn quiz-btn-secondary" onclick="QuizEngine.retry()">'
                + '      🔄 تلاش دوباره'
                + '    </button>'
                + '    <button class="quiz-btn quiz-btn-primary" onclick="QuizEngine.close()">'
                + '      ✖ بستن'
                + '    </button>';
        }

        html += ''
            + '  </div>'
            + '</div>';

        quizContainer.innerHTML = html;

        var backBtn = document.getElementById('btnBackToLessons');
        if (backBtn) {
            backBtn.onclick = function () {
                var isLinux = (location.pathname || '').toLowerCase().indexOf('linux') !== -1;
                location.href = isLinux ? 'linux.html' : 'python.html';
            };
        }
    }

    function retry() {
        currentAnswers = new Array(currentQuiz.data.questions.length).fill(null);
        currentQuestionIndex = 0;
        renderIntro();
    }

    function saveBadge(quizId, title) {
        var badges = JSON.parse(localStorage.getItem('cheese_earned_badges') || '{}');
        if (!badges[quizId]) {
            badges[quizId] = {
                name: '🎓 ' + title,
                image: 'badges/quiz-badge.png',
                date: new Date().toISOString(),
                type: 'quiz'
            };
            localStorage.setItem('cheese_earned_badges', JSON.stringify(badges));
        }
    }

    function close() {
        if (onCloseCallback) onCloseCallback();
    }

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
        return String(num).replace(/\d/g, function (d) {
            return persian[d];
        });
    }

    window.QuizEngine = {
        load: load,
        start: start,
        next: next,
        prev: prev,
        selectOption: selectOption,
        retry: retry,
        close: close
    };

})();