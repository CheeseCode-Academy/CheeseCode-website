// ============================================
// 🧀 ناوبری + هایلایت | CheeseCode Academy
// نسخه: 1.0.0
// ============================================

(function () {
    'use strict';

    // ============================================
    // هایلایت متن توی مودال
    // ============================================
    function highlightAndScroll(searchText) {
        if (!searchText) return;

        // صبر کن تا مودال باز بشه و محتوا لود بشه
        setTimeout(function () {
            var modalContent = document.querySelector('#lessonModal .modal-content') ||
                document.querySelector('#quizModal .modal-content') ||
                document.querySelector('.modal-content');

            if (!modalContent) return;

            var contentArea = modalContent.querySelector('.lesson-content') ||
                modalContent.querySelector('#modal-body-content') ||
                modalContent.querySelector('#quiz-content') ||
                modalContent;

            if (!contentArea) return;

            // جستجو در متن
            var walker = document.createTreeWalker(
                contentArea,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            var matches = [];
            var node;

            while (node = walker.nextNode()) {
                var text = node.nodeValue;
                var lowerText = text.toLowerCase();
                var lowerSearch = searchText.toLowerCase();
                var index = lowerText.indexOf(lowerSearch);

                if (index !== -1) {
                    matches.push({
                        node: node,
                        index: index,
                        length: searchText.length
                    });
                }
            }

            if (matches.length === 0) return;

            // هایلایت همه‌ی matches
            // از آخر به اول تا اندیس‌ها تغییر نکنن
            for (var i = matches.length - 1; i >= 0; i--) {
                var match = matches[i];
                var textNode = match.node;
                var text = textNode.nodeValue;

                var before = text.substring(0, match.index);
                var middle = text.substring(match.index, match.index + match.length);
                var after = text.substring(match.index + match.length);

                var mark = document.createElement('mark');
                mark.className = 'search-highlight';
                mark.style.cssText = 'background: rgba(245, 184, 27, 0.4); color: #f5b81b; padding: 2px 4px; border-radius: 4px; font-weight: 700; box-shadow: 0 0 10px rgba(245, 184, 27, 0.5);';
                mark.textContent = middle;

                var fragment = document.createDocumentFragment();
                if (before) fragment.appendChild(document.createTextNode(before));
                fragment.appendChild(mark);
                if (after) fragment.appendChild(document.createTextNode(after));

                textNode.parentNode.replaceChild(fragment, textNode);
            }

            // اسکرول به اولین هایلایت
            setTimeout(function () {
                var firstHighlight = contentArea.querySelector('.search-highlight');
                if (firstHighlight) {
                    firstHighlight.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });

                    // انیمیشن چشمک
                    firstHighlight.style.animation = 'pulseHighlight 1.5s ease 3';
                }
            }, 300);

        }, 1500); // صبر برای باز شدن مودال و لود محتوا
    }

    // ============================================
    // اضافه کردن انیمیشن
    // ============================================
    function addPulseAnimation() {
        if (document.getElementById('pulse-highlight-style')) return;

        var style = document.createElement('style');
        style.id = 'pulse-highlight-style';
        style.textContent = `
            @keyframes pulseHighlight {
                0%, 100% { 
                    background: rgba(245, 184, 27, 0.4); 
                    box-shadow: 0 0 10px rgba(245, 184, 27, 0.5);
                }
                50% { 
                    background: rgba(245, 184, 27, 0.7); 
                    box-shadow: 0 0 25px rgba(245, 184, 27, 0.8);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // ============================================
    // شروع — چک پارامتر highlight
    // ============================================
    function init() {
        addPulseAnimation();

        var params = new URLSearchParams(window.location.search);
        var highlight = params.get('highlight');

        if (highlight) {
            highlightAndScroll(decodeURIComponent(highlight));
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            setTimeout(init, 800);
        });
    } else {
        setTimeout(init, 800);
    }

    window.NavigateHighlight = {
        highlight: highlightAndScroll
    };

    console.log('🔦 Navigate Highlight ready!');

})();