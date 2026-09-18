// ============================================
// 🧀 کانفیگ مرکز دانلود | CheeseCode Academy
// نسخه: 4.0.0 - Final
// ============================================

window.librariesConfig = {

    actionButtons: [
        {
            id: "cache-pages",
            icon: "📄",
            title: "کش کردن صفحات اصلی",
            action: "cacheMainPages"
        },
        {
            id: "check-update",
            icon: "🔄",
            title: "بررسی آپدیت",
            action: "checkUpdateNow"
        },
        {
            id: "clear-cache",
            icon: "🗑️",
            title: "حذف کامل کش",
            action: "clearAllCache",
            type: "danger"
        }
    ],

    mainPages: [
        './index.html',
        './python.html',
        './linux.html',
        './answers.html',
        './answers-python.html',
        './answers-linux.html',
        './quizzes.html',
        './python-quiz.html',
        './linux-quiz.html',
        './projects.html',
        './challenges.html',
        './terminal-python.html',
        './libraries.html',
        './settings.html',
        './notes.html',
        './version.json',
        './manifest.json',
        
        './styles/index-style.css',
        './styles/python-linux-style.css',
        './styles/challenges-style.css',
        './styles/terminal-python.css',
        './styles/libraries-style.css',
        './styles/settings-style.css',
        './styles/quizzes-style.css',
        './styles/projects-style.css',
        './styles/loading-style.css',
        './styles/notes-style.css',
        './styles/sticky-header.css',
        './styles/mobile-optimization.css',
        './styles/themes.css',
        
        './js/cheese-utils.js',
        './js/python-engine.js',
        './js/channel-modal.js',
        './js/settings-functions.js',
        './js/install-helper.js',
        './js/quiz-engine.js',
        './js/back-to-top.js',
        './js/bookmarks-utils.js',
        './js/challenge-compare.js',
        './js/share-badge.js',
        './js/notes-utils.js',
        './js/syntax-highlight.js',
        './js/focus-mode.js',
        './js/loading-utils.js',
        './js/global-search.js',
        './js/share-challenge.js',
        './js/diff-utils.js',
        './js/stories-utils.js',
        './js/lazy-load.js',
        './js/sticky-header.js',
        './js/navigate-highlight.js',
        
        './configs/index-config.js',
        './configs/python-config.js',
        './configs/linux-config.js',
        './configs/answers.js',
        './configs/answers-python-config.js',
        './configs/answers-linux-config.js',
        './configs/quizzes-config.js',
        './configs/python-quiz-config.js',
        './configs/linux-quiz-config.js',
        './configs/projects-config.js',
        './configs/libraries-config.js',
        './configs/libraries-functions.js',
        './configs/menu-config.js',
        './configs/settings-config.js',
        './configs/install-config.js',
        
        './configs/stories/python-stories.js',
        './configs/stories/linux-stories.js',
        
        './settings/challenges.json',
        
        './images/logo.jpeg',
        './images/icon-192.png',
        './images/icon-512.png'
    ],

    sections: [
        {
            id: "courses",
            title: "📚 دوره‌ها",
            description: "دوره‌ها را به صورت آفلاین دانلود یا کش کنید",
            type: "cacheable",
            items: [
                { courseKey: "python" },
                { courseKey: "linux" },
                { courseKey: "answers-python" },
                { courseKey: "answers-linux" }
            ]
        },
        {
            id: "quizzes",
            title: "🎓 کوییزها",
            description: "کوییزها را برای استفاده‌ی آفلاین کش کنید",
            type: "quiz-cacheable",
            items: [
                { courseKey: "python-quiz", title: "کوییزهای پایتون", icon: "🐍" },
                { courseKey: "linux-quiz", title: "کوییزهای لینوکس", icon: "🐧" }
            ]
        },
        {
            id: "zips",
            title: "📦 دانلود یکجای دوره‌ها (ZIP)",
            description: "کل دوره‌ها را در یک فایل ZIP دانلود کنید",
            type: "downloads",
            items: [
                {
                    title: "دوره پایتون (آفلاین)",
                    icon: "🐍",
                    description: "کل دوره پایتون + پاسخ‌ها در یک فایل ZIP",
                    size: "~ 5 مگابایت",
                    url: "downloads/python-course.zip",
                    version: "1.0.0"
                },
                {
                    title: "دوره لینوکس (آفلاین)",
                    icon: "🐧",
                    description: "کل دوره لینوکس + پاسخ‌ها در یک فایل ZIP",
                    size: "~ 4 مگابایت",
                    url: "downloads/linux-course.zip",
                    version: "1.0.0"
                },
                {
                    title: "همه‌ی دوره‌ها (آفلاین)",
                    icon: "📦",
                    description: "تمام دوره‌ها + پاسخ‌ها در یک فایل ZIP",
                    size: "~ 9 مگابایت",
                    url: "downloads/all-courses.zip",
                    version: "1.0.0"
                }
            ]
        },
        {
            id: "tools",
            title: "🛠️ ابزارهای برنامه‌نویس",
            description: "فایل‌های مفید برای برنامه‌نویس‌ها",
            type: "downloads",
            items: [
                {
                    title: "چیت‌شیت پایتون",
                    icon: "📄",
                    description: "همه‌ی دستورات پایتون در یک صفحه",
                    size: "~ 500 کیلوبایت",
                    url: "downloads/python-cheatsheet.pdf"
                },
                {
                    title: "چیت‌شیت لینوکس",
                    icon: "📄",
                    description: "همه‌ی دستورات لینوکس در یک صفحه",
                    size: "~ 500 کیلوبایت",
                    url: "downloads/linux-cheatsheet.pdf"
                },
                {
                    title: "قالب پروژه پایتون",
                    icon: "📝",
                    description: "قالب آماده برای شروع پروژه پایتون",
                    size: "~ 100 کیلوبایت",
                    url: "downloads/python-template.zip"
                }
            ]
        },
        {
            id: "resources",
            title: "🔗 منابع خارجی",
            description: "لینک به منابع معتبر یادگیری",
            type: "links",
            items: [
                {
                    title: "مستندات رسمی پایتون",
                    icon: "🐍",
                    description: "docs.python.org",
                    url: "https://docs.python.org/3/"
                },
                {
                    title: "مستندات لینوکس",
                    icon: "🐧",
                    description: "linux.org",
                    url: "https://www.linux.org/"
                },
                {
                    title: "W3Schools پایتون",
                    icon: "📖",
                    description: "w3schools.com",
                    url: "https://www.w3schools.com/python/"
                },
                {
                    title: "تمرین‌های برنامه‌نویسی",
                    icon: "💪",
                    description: "leetcode.com",
                    url: "https://leetcode.com/"
                },
                {
                    title: "محیط کد نویسی وب",
                    icon: "👨‍💻",
                    description: "vscode.dev",
                    url: "https://vscode.dev/"
                }
            ]
        }
    ]

};