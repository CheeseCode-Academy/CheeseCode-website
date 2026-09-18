// ============================================
// 🧀 تنظیمات | CheeseCode Academy
// نسخه: 3.2.0
// ============================================

const settingsConfig = [
    {
        id: "themes",
        title: "🎨 تم",
        description: "ظاهر سایت رو تغییر بده",
        type: "modal-opener",
        icon: "🎨",
        buttonText: "انتخاب تم",
        modal: {
            id: "themeModal",
            title: "🎨 انتخاب تم",
            description: "یکی از تم‌های زیر رو انتخاب کن",
            type: "theme-list",
            items: [
                { id: "dark", name: "Dark", icon: "🌙", description: "طلایی روی مشکی" },
                { id: "midnight", name: "Midnight", icon: "🌌", description: "مشکی مطلق" },
                { id: "purple", name: "Purple", icon: "💜", description: "بنفش روی مشکی" },
                { id: "matrix", name: "Matrix", icon: "💚", description: "سبز ماتریکسی" },
                { id: "light-white", name: "White", icon: "⚪", description: "سفید روشن" },
                { id: "light-cream", name: "Cream", icon: "🟡", description: "کرم گرم" },
                { id: "light-blue", name: "Blue", icon: "🔵", description: "آبی ملایم" },
                { id: "light-gray", name: "Gray", icon: "⚫", description: "خاکستری مینیمال" }
            ]
        }
    },
    {
        id: "stats",
        title: "📊 آمار من",
        description: "پیشرفت خودت رو ببین",
        type: "stats",
        icon: "📊"
    },
    {
        id: "bookmarks",
        title: "⭐ نشان‌شده‌ها",
        description: "درس‌هایی که ستاره دادی",
        type: "bookmarks",
        icon: "⭐"
    },
    {
        id: "about",
        title: "ℹ️ درباره",
        description: "اطلاعات سایت",
        type: "modal-opener",
        icon: "ℹ️",
        buttonText: "مشاهده",
        modal: {
            id: "aboutModal",
            title: "ℹ️ درباره چیزکد",
            description: "اطلاعات سایت",
            type: "info-list",
            items: [
                { icon: "🧀", name: "برند", description: "CheeseCode Academy" },
                { icon: "📌", name: "نسخه", description: "1.0.0" },
                { icon: "💬", name: "ارتباط", description: "@cheese_code" },
                { icon: "📢", name: "کانال", description: "ble.ir/cheesecode" }
            ]
        }
    }
];

window.settingsConfig = settingsConfig;