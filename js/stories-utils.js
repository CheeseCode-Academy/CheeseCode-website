// ============================================
// 🧀 داستان‌گویی | CheeseCode Academy
// نسخه: 3.0.0 - Fixed mobile display
// ============================================

(function() {
    'use strict';

    var STORY_SHOWN_KEY = 'cheese_story_shown_';
    var currentModal = null;

    function findStory(fileName) {
        if (window.pythonStories && window.pythonStories[fileName]) {
            return window.pythonStories[fileName];
        }
        if (window.linuxStories && window.linuxStories[fileName]) {
            return window.linuxStories[fileName];
        }
        return null;
    }

    function showStory(fileName, lessonTitle) {
        var storyData = findStory(fileName);
        if (!storyData) return;

        var shownKey = STORY_SHOWN_KEY + fileName;
        if (localStorage.getItem(shownKey)) return;

        try {
            localStorage.setItem(shownKey, 'true');
        } catch(e) {}

        createStoryModal(storyData, lessonTitle);
    }

    function createStoryModal(storyData, lessonTitle) {
        if (currentModal) closeStoryModal();

        // ⚠️ Overlay
        var overlay = document.createElement('div');
        overlay.id = 'storyModal';
        overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;background:rgba(0,0,0,0.95);z-index:10005;display:flex;align-items:center;justify-content:center;padding:1rem;direction:rtl;font-family:Courier New,monospace;opacity:0;transition:opacity 0.3s ease;overflow-y:auto;box-sizing:border-box;';

        // ⚠️ Content
        var content = document.createElement('div');
        content.className = 'story-content';
        content.style.cssText = 'background:linear-gradient(145deg,rgba(15,22,38,0.98),rgba(25,35,55,0.98));border:1px solid rgba(245,184,27,0.3);border-radius:24px;padding:2rem 1.5rem;width:100%;max-width:550px;max-height:90vh;overflow-y:auto;box-shadow:0 20px 80px rgba(0,0,0,0.8),0 0 40px rgba(245,184,27,0.1);border-top:3px solid #f5b81b;position:relative;text-align:center;box-sizing:border-box;transform:scale(0.9);transition:transform 0.3s ease;';

        var iconHtml = '<div style="font-size:4rem;margin-bottom:1rem;filter:drop-shadow(0 0 20px rgba(245,184,27,0.5));">' + storyData.icon + '</div>';
        var titleHtml = '<h2 style="color:#f5b81b;font-size:1.3rem;margin:0 0 0.5rem 0;font-family:Courier New,monospace;">' + escapeHtml(storyData.title) + '</h2>';
        var lessonHtml = lessonTitle ? '<div style="color:rgba(0,212,255,0.7);font-size:0.8rem;margin-bottom:1.5rem;">📖 ' + escapeHtml(lessonTitle) + '</div>' : '<div style="height:1rem;"></div>';
        var dividerHtml = '<div style="display:flex;align-items:center;gap:0.8rem;margin:1.5rem 0;color:rgba(245,184,27,0.4);font-size:0.7rem;"><div style="flex:1;height:1px;background:linear-gradient(to right,transparent,rgba(245,184,27,0.3),transparent);"></div><span>✨ داستان این درس ✨</span><div style="flex:1;height:1px;background:linear-gradient(to left,transparent,rgba(245,184,27,0.3),transparent);"></div></div>';
        var storyHtml = '<p style="color:rgba(255,255,255,0.85);font-size:0.95rem;line-height:2;margin:0 0 1.5rem 0;text-align:justify;text-align-last:center;">' + escapeHtml(storyData.story) + '</p>';
        var btnHtml = '<button class="story-close-btn" style="width:100%;background:linear-gradient(135deg,rgba(245,184,27,0.15),rgba(0,212,255,0.15));border:1px solid rgba(245,184,27,0.4);color:#f5b81b;padding:0.9rem;border-radius:12px;font-family:Courier New,monospace;font-size:1rem;font-weight:600;cursor:pointer;min-height:52px;">📚 بریم سراغ درس!</button>';

        content.innerHTML = iconHtml + titleHtml + lessonHtml + dividerHtml + storyHtml + btnHtml;

        overlay.appendChild(content);
        document.body.appendChild(overlay);
        currentModal = overlay;

        // ⚠️ نمایش — با تأخیر مناسب
        setTimeout(function() {
            overlay.style.opacity = '1';
            content.style.transform = 'scale(1)';
        }, 50);

        // رویدادها
        var closeBtn = content.querySelector('.story-close-btn');
        closeBtn.onclick = closeStoryModal;

        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) closeStoryModal();
        });

        document.addEventListener('keydown', handleEsc);

        function handleEsc(e) {
            if (e.key === 'Escape') closeStoryModal();
        }

        overlay._escHandler = handleEsc;
    }

    function closeStoryModal() {
        if (!currentModal) return;

        var modal = currentModal;
        var content = modal.querySelector('.story-content');

        modal.style.opacity = '0';
        if (content) content.style.transform = 'scale(0.9)';

        setTimeout(function() {
            if (modal._escHandler) {
                document.removeEventListener('keydown', modal._escHandler);
            }
            if (modal.parentNode) modal.remove();
            if (currentModal === modal) currentModal = null;
        }, 300);
    }

    function escapeHtml(text) {
        if (!text) return '';
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function resetAll() {
        var keys = [];
        for (var i = 0; i < localStorage.length; i++) {
            var key = localStorage.key(i);
            if (key && key.indexOf(STORY_SHOWN_KEY) === 0) {
                keys.push(key);
            }
        }
        keys.forEach(function(k) { localStorage.removeItem(k); });
        console.log('🧀 داستان‌ها ریست شدن');
    }

    window.StoriesUtils = {
        show: showStory,
        close: closeStoryModal,
        reset: resetAll,
        find: findStory
    };

    console.log('🧀 Stories Utils ready! (v3.0.0)');

})();