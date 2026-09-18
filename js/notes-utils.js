// ============================================
// 🧀 یادداشت شخصی | CheeseCode Academy
// نسخه: 2.0.0 - رفع لگ + بهبود
// ============================================

(function () {
    'use strict';

    var NOTES_KEY = 'cheese_notes';
    var currentLessonKey = null;
    var currentLessonTitle = null;
    var currentCourseType = null;
    var notesModal = null;

    // ============================================
    // ذخیره‌سازی
    // ============================================
    function getAllNotes() {
        try {
            return JSON.parse(localStorage.getItem(NOTES_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function saveAllNotes(notes) {
        try {
            localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
            return true;
        } catch (e) {
            return false;
        }
    }

    function getNote(lessonKey) {
        var notes = getAllNotes();
        return notes[lessonKey] || '';
    }

    function saveNote(lessonKey, text, lessonTitle, courseType) {
        var notes = getAllNotes();

        if (text && text.trim()) {
            if (typeof notes[lessonKey] === 'string') {
                // نسخه‌ی قدیمی
                notes[lessonKey] = {
                    text: text,
                    title: lessonTitle || lessonKey,
                    course: courseType || 'python',
                    date: new Date().toISOString()
                };
            } else {
                notes[lessonKey] = {
                    text: text,
                    title: lessonTitle || (notes[lessonKey] && notes[lessonKey].title) || lessonKey,
                    course: courseType || (notes[lessonKey] && notes[lessonKey].course) || 'python',
                    date: new Date().toISOString()
                };
            }
        } else {
            delete notes[lessonKey];
        }

        return saveAllNotes(notes);
    }

    function deleteNote(lessonKey) {
        var notes = getAllNotes();
        delete notes[lessonKey];
        return saveAllNotes(notes);
    }

    function getNoteCount() {
        return Object.keys(getAllNotes()).length;
    }

    function getAllNotesArray() {
        var notes = getAllNotes();
        var result = [];

        for (var key in notes) {
            var note = notes[key];

            if (typeof note === 'string') {
                // نسخه‌ی قدیمی
                result.push({
                    key: key,
                    text: note,
                    title: key.replace('.html', '').replace(/-/g, ' '),
                    course: 'unknown',
                    date: null
                });
            } else {
                result.push({
                    key: key,
                    text: note.text,
                    title: note.title || key,
                    course: note.course || 'unknown',
                    date: note.date
                });
            }
        }

        // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
        result.sort(function (a, b) {
            if (!a.date) return 1;
            if (!b.date) return -1;
            return new Date(b.date) - new Date(a.date);
        });

        return result;
    }

    // ============================================
    // ساخت مودال یادداشت (یک بار)
    // ============================================
    function createNotesModal() {
        if (document.getElementById('notesModal')) {
            notesModal = document.getElementById('notesModal');
            return;
        }

        var modal = document.createElement('div');
        modal.id = 'notesModal';
        modal.className = 'modal';
        modal.style.cssText = 'display:none;position:fixed;z-index:10002;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.85);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);justify-content:center;align-items:center;padding:1rem;direction:rtl;font-family:Courier New,monospace;';

        modal.innerHTML = `
            <div class="modal-content notes-modal-content" style="background:rgba(15,22,38,0.98);border:1px solid rgba(245,184,27,0.3);border-radius:24px;padding:1.5rem;width:100%;max-width:500px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,0.7);border-top:2px solid #f5b81b;position:relative;">
                <span class="close-modal" id="notesCloseBtn" style="position:absolute;left:1rem;top:1rem;font-size:1.5rem;color:rgba(255,255,255,0.5);cursor:pointer;width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;transition:all 0.2s ease;background:transparent;border:1px solid transparent;z-index:10;">&times;</span>
                
                <h3 style="color:#f5b81b;font-weight:700;font-size:1.1rem;margin:0 0 0.3rem 0;text-align:center;">📝 یادداشت من</h3>
                <p id="notesLessonTitle" style="color:rgba(255,255,255,0.5);font-size:0.8rem;margin:0 0 1rem 0;text-align:center;"></p>
                
                <textarea id="notesTextarea" placeholder="یادداشت خودت رو اینجا بنویس...&#10;&#10;مثلاً:&#10;• نکات مهم درس&#10;• سؤال‌هایی که داری&#10;• کدهای مفید" style="width:100%;min-height:200px;background:rgba(0,0,0,0.4);color:#ffffff;border:1px solid rgba(245,184,27,0.2);border-right:2px solid #f5b81b;border-radius:8px;padding:1rem;font-family:Courier New,monospace;font-size:0.9rem;line-height:1.7;resize:vertical;box-sizing:border-box;outline:none;direction:rtl;text-align:right;margin-bottom:1rem;flex:1;"></textarea>
                
                <div id="notesStats" style="color:rgba(255,255,255,0.4);font-size:0.7rem;margin-bottom:1rem;display:flex;justify-content:space-between;"></div>
                
                <div style="display:flex;gap:0.5rem;">
                    <button id="notesSaveBtn" style="flex:1;background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.4);color:#00d4ff;padding:0.7rem;border-radius:10px;font-family:Courier New,monospace;font-size:0.9rem;font-weight:600;cursor:pointer;">💾 ذخیره</button>
                    <button id="notesDeleteBtn" style="background:rgba(255,68,68,0.1);border:1px solid rgba(255,68,68,0.3);color:#ff6b6b;padding:0.7rem 1rem;border-radius:10px;font-family:Courier New,monospace;font-size:0.9rem;font-weight:600;cursor:pointer;">🗑️ پاک کردن</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        notesModal = modal;

        // رویدادها
        var closeBtn = document.getElementById('notesCloseBtn');
        var textarea = document.getElementById('notesTextarea');
        var saveBtn = document.getElementById('notesSaveBtn');
        var deleteBtn = document.getElementById('notesDeleteBtn');

        closeBtn.onmouseover = function () {
            this.style.color = '#ff4444';
            this.style.borderColor = 'rgba(255, 68, 68, 0.2)';
        };
        closeBtn.onmouseout = function () {
            this.style.color = 'rgba(255, 255, 255, 0.5)';
            this.style.borderColor = 'transparent';
        };
        closeBtn.onclick = closeNotes;

        saveBtn.onmouseover = function () {
            this.style.background = 'rgba(0,212,255,0.2)';
        };
        saveBtn.onmouseout = function () {
            this.style.background = 'rgba(0,212,255,0.1)';
        };
        saveBtn.onclick = function () {
            var text = textarea.value;
            if (saveNote(currentLessonKey, text, currentLessonTitle, currentCourseType)) {
                if (window.LoadingUtils) {
                    window.LoadingUtils.success('یادداشت ذخیره شد!');
                }
                updateStats();
            } else {
                if (window.LoadingUtils) {
                    window.LoadingUtils.error('خطا در ذخیره!');
                }
            }
        };

        deleteBtn.onmouseover = function () {
            this.style.background = 'rgba(255,68,68,0.2)';
        };
        deleteBtn.onmouseout = function () {
            this.style.background = 'rgba(255,68,68,0.1)';
        };
        deleteBtn.onclick = function () {
            if (confirm('مطمئنی می‌خوای یادداشت رو پاک کنی؟')) {
                deleteNote(currentLessonKey);
                textarea.value = '';
                updateStats();
                if (window.LoadingUtils) {
                    window.LoadingUtils.info('یادداشت پاک شد');
                }
            }
        };

        textarea.addEventListener('input', updateStats);

        textarea.addEventListener('keydown', function (e) {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveBtn.click();
            }
        });

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeNotes();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeNotes();
            }
        });
    }

    function updateStats() {
        var textarea = document.getElementById('notesTextarea');
        var stats = document.getElementById('notesStats');
        if (!textarea || !stats) return;

        var text = textarea.value;
        var charCount = text.length;
        var wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

        stats.innerHTML = `
            <span>📝 ${toPersianNumber(wordCount)} کلمه</span>
            <span>💬 ${toPersianNumber(charCount)} کاراکتر</span>
        `;
    }

    function toPersianNumber(num) {
        var persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        return String(num).replace(/\d/g, function (d) { return persian[d]; });
    }

    // ============================================
    // باز کردن مودال
    // ============================================
    function openNotes(lessonKey, lessonTitle, courseType) {
        if (!notesModal) createNotesModal();

        currentLessonKey = lessonKey;
        currentLessonTitle = lessonTitle;
        currentCourseType = courseType || 'python';

        var textarea = document.getElementById('notesTextarea');
        var lessonTitleEl = document.getElementById('notesLessonTitle');

        if (lessonTitleEl) lessonTitleEl.textContent = lessonTitle || '';

        var noteData = getNote(lessonKey);
        if (typeof noteData === 'object' && noteData !== null) {
            noteData = noteData.text || '';
        }
        if (textarea) textarea.value = noteData || '';

        updateStats();
        notesModal.style.display = 'flex';

        setTimeout(function () {
            if (textarea) textarea.focus();
        }, 200);
    }

    function closeNotes() {
        if (notesModal) {
            notesModal.style.display = 'none';
        }
    }

    // ============================================
    // API عمومی
    // ============================================
    window.NotesUtils = {
        open: openNotes,
        close: closeNotes,
        get: getNote,
        save: saveNote,
        delete: deleteNote,
        count: getNoteCount,
        getAll: getAllNotes,
        getAllArray: getAllNotesArray
    };

    console.log('🧀 Notes Utils ready! (v2.0.0)');

})();