// ============================================
// 🧀 پروژه‌های عملی | CheeseCode Academy
// نسخه: 1.0.0
// ============================================

const projectsConfig = [
    {
        id: "python-calculator",
        title: "ماشین حساب ساده",
        icon: "🧮",
        course: "python",
        level: "مبتدی",
        levelColor: "#00ff64",
        duration: "۳۰ دقیقه",
        description: "یه ماشین حساب ساده با پایتون بساز که چهار عمل اصلی رو انجام بده.",
        skills: ["متغیرها", "شرط‌ها", "توابع"],
        steps: [
            "تابع جمع بساز: def add(a, b): return a + b",
            "تابع تفریق، ضرب و تقسیم هم بساز",
            "از کاربر دو عدد بگیر: a = float(input())",
            "از کاربر عملگر بگیر: op = input()",
            "با if/elif عملگر رو چک کن",
            "نتیجه رو چاپ کن"
        ],
        starterCode: "# ماشین حساب ساده\ndef add(a, b):\n    # کد اینجا\n    pass\n\n# ...",
        hint: "از float() برای تبدیل ورودی به عدد اعشاری استفاده کن."
    },
    {
        id: "python-todo",
        title: "لیست کارها (Todo)",
        icon: "📝",
        course: "python",
        level: "متوسط",
        levelColor: "#f5b81b",
        duration: "۱ ساعت",
        description: "یه برنامه‌ی مدیریت کارها که بتونی اضافه، حذف و مشاهده کنی.",
        skills: ["لیست‌ها", "حلقه‌ها", "فایل"],
        steps: [
            "یه لیست خالی بساز: todos = []",
            "منوی انتخاب بساز (اضافه/حذف/نمایش/خروج)",
            "برای اضافه: از input() استفاده کن و append کن",
            "برای حذف: از pop() یا remove() استفاده کن",
            "برای نمایش: لیست رو با شماره چاپ کن",
            "با حلقه‌ی while ادامه بده"
        ],
        starterCode: "todos = []\n\nwhile True:\n    print('1. اضافه  2. حذف  3. نمایش  4. خروج')\n    # کد اینجا",
        hint: "از list.append() و list.pop() استفاده کن."
    },
    {
        id: "python-guess-game",
        title: "بازی حدس عدد",
        icon: "🎲",
        course: "python",
        level: "مبتدی",
        levelColor: "#00ff64",
        duration: "۲۰ دقیقه",
        description: "کامپیوتر یه عدد تصادفی انتخاب می‌کنه، تو باید حدسش بزنی.",
        skills: ["حلقه‌ها", "شرط‌ها", "تصادفی"],
        steps: [
            "import random رو بالای کد بنویس",
            "عدد تصادفی: target = random.randint(1, 100)",
            "حلقه‌ی while برای حدس‌ها",
            "اگر حدس کوچیک بود: بگو «بالاتر»",
            "اگر حدس بزرگ بود: بگو «پایین‌تر»",
            "اگر درست بود: تعداد تلاش رو نشون بده"
        ],
        starterCode: "import random\n\ntarget = random.randint(1, 100)\ntries = 0\n\n# حلقه اینجا",
        hint: "از یک متغیر برای شمارش تلاش‌ها استفاده کن."
    },
    {
        id: "python-file-organizer",
        title: "سازمان‌دهی فایل‌ها",
        icon: "📁",
        course: "python",
        level: "پیشرفته",
        levelColor: "#ff6b6b",
        duration: "۱.۵ ساعت",
        description: "یه اسکریپت که فایل‌ها رو بر اساس پسوند مرتب کنه.",
        skills: ["فایل", "ماژول os", "دیکشنری"],
        steps: [
            "import os رو اضافه کن",
            "مسیر رو بگیر: folder = input()",
            "لیست فایل‌ها: files = os.listdir(folder)",
            "برای هر فایل پسوند رو بگیر",
            "بر اساس پسوند، پوشه بساز",
            "فایل رو جابجا کن"
        ],
        starterCode: "import os\nimport shutil\n\nfolder = '.'\n# کد اینجا",
        hint: "از os.path.splitext() برای جدا کردن پسوند استفاده کن."
    },
    {
        id: "linux-log-analyzer",
        title: "تحلیل لاگ‌ها",
        icon: "📊",
        course: "linux",
        level: "متوسط",
        levelColor: "#f5b81b",
        duration: "۴۵ دقیقه",
        description: "با دستورات لینوکس، لاگ‌ها رو تحلیل کن.",
        skills: ["grep", "awk", "sort"],
        steps: [
            "لاگ رو دانلود کن: wget http://...",
            "خطوط خطا رو پیدا کن: grep ERROR log.txt",
            "تعداد خطاها: grep -c ERROR log.txt",
            "پرتکرارترین: sort | uniq -c | sort -rn",
            "نتیجه رو توی فایل بریز: > result.txt"
        ],
        starterCode: "# دستورات رو توی ترمینال بنویس\n# grep ERROR /var/log/syslog",
        hint: "از pipe (|) برای ترکیب دستورات استفاده کن."
    },
    {
        id: "linux-server-setup",
        title: "راه‌اندازی سرور وب",
        icon: "🌐",
        course: "linux",
        level: "پیشرفته",
        levelColor: "#ff6b6b",
        duration: "۲ ساعت",
        description: "یه سرور وب ساده با nginx راه‌اندازی کن.",
        skills: ["apt", "systemctl", "nginx"],
        steps: [
            "سیستم رو آپدیت کن: sudo apt update",
            "nginx نصب کن: sudo apt install nginx",
            "سرویس رو استارت کن: sudo systemctl start nginx",
            "وضعیت رو چک کن: sudo systemctl status nginx",
            "فایروال رو تنظیم کن: sudo ufw allow 'Nginx Full'",
            "توی مرورگر localhost رو باز کن"
        ],
        starterCode: "# توی ترمینال لینوکس\n# sudo apt update\n# sudo apt install nginx",
        hint: "از sudo برای دستورات نیازمند دسترسی root استفاده کن."
    }
];

window.projectsConfig = projectsConfig;