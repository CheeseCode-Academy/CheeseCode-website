// ============================================
// ⚡ کانفیگ مرکز دانلود | CodaX Academy
// ============================================

const librariesConfig = {

    // ============================================
    // بخش‌های مختلف صفحه
    // ============================================
    sections: [

        // ===== بخش دوره‌ها =====
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

        // ===== بخش ZIP =====
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

        // ===== بخش ابزارها =====
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

        // ===== بخش منابع خارجی =====
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
                }
            ]
        }

    ]

};