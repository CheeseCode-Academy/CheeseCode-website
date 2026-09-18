// ============================================
// 🧀 راهنمای نصب PWA | CheeseCode Academy
// نسخه: 1.0.0
// ============================================

const installConfig = {

    title: "📱 نصب چیزکد روی دستگاه",
    description: "با نصب، چیزکد مثل یه اپ واقعی کار می‌کنه و آفلاین هم در دسترسه!",

    guides: {

        "chrome-android": {
            browser: "Chrome",
            os: "Android",
            icon: "🌐",
            steps: [
                "روی سه نقطه (⋮) بالای مرورگر بزن",
                "گزینه «Add to Home screen» یا «Install app» رو انتخاب کن",
                "اسم «CheeseCode» رو تأیید کن",
                "روی «Add» یا «Install» بزن",
                "آیکون چیزکد روی صفحه‌ی گوشی ظاهر میشه!"
            ]
        },

        "chrome-desktop": {
            browser: "Chrome",
            os: "Desktop",
            icon: "💻",
            steps: [
                "توی نوار آدرس، سمت راست، آیکون ⊕ (Install) رو بزن",
                "یا: منوی سه نقطه (⋮) → «Install CheeseCode»",
                "روی «Install» کلیک کن",
                "چیزکد توی یه پنجره‌ی مستقل باز میشه",
                "آیکونش روی دسکتاپ اضافه میشه!"
            ]
        },

        "edge-desktop": {
            browser: "Edge",
            os: "Desktop",
            icon: "🔷",
            steps: [
                "توی نوار آدرس، آیکون Install (یه صفحه با فلش) رو بزن",
                "یا: منوی سه نقطه (⋯) → «Apps» → «Install this site as an app»",
                "اسم «CheeseCode» رو تأیید کن",
                "روی «Install» کلیک کن",
                "چیزکد به عنوان اپ نصب میشه!"
            ]
        },

        "edge-android": {
            browser: "Edge",
            os: "Android",
            icon: "🔷",
            steps: [
                "روی سه نقطه (⋯) پایین صفحه بزن",
                "گزینه «Add to phone» رو انتخاب کن",
                "روی «Install» تأیید کن",
                "آیکون چیزکد روی صفحه‌ی گوشی ظاهر میشه!"
            ]
        },

        "samsung": {
            browser: "Samsung Internet",
            os: "Android",
            icon: "🌊",
            steps: [
                "روی آیکون سه خط (☰) پایین صفحه بزن",
                "گزینه «Add page to» رو انتخاب کن",
                "روی «Home screen» بزن",
                "اسم «CheeseCode» رو تأیید کن",
                "روی «Add» بزن",
                "آیکون چیزکد روی صفحه‌ی گوشی ظاهر میشه!"
            ]
        },

        "firefox-desktop": {
            browser: "Firefox",
            os: "Desktop",
            icon: "🦊",
            steps: [
                "Firefox به طور پیش‌فرض از نصب PWA پشتیبانی نمی‌کنه 😔",
                "برای نصب، از Chrome یا Edge استفاده کن",
                "یا افزونه‌ی «PWA for Firefox» رو نصب کن",
                "بعد از نصب افزونه، آیکون نصب توی نوار آدرس ظاهر میشه"
            ]
        },

        "firefox-android": {
            browser: "Firefox",
            os: "Android",
            icon: "🦊",
            steps: [
                "Firefox اندروید از نصب PWA پشتیبانی نمی‌کنه 😔",
                "برای نصب، از Chrome یا Samsung Internet استفاده کن",
                "Chrome معمولاً روی بیشتر گوشی‌های اندروید نصب هست"
            ]
        },

        "safari-ios": {
            browser: "Safari",
            os: "iOS",
            icon: "🧭",
            steps: [
                "روی آیکون Share (⬆️ مستطیل با فلش) پایین صفحه بزن",
                "توی منو، «Add to Home Screen» رو انتخاب کن",
                "اسم «CheeseCode» رو تأیید کن",
                "روی «Add» بزن",
                "آیکون چیزکد روی صفحه‌ی اصلی iPhone/iPad ظاهر میشه!"
            ]
        },

        "chrome-ios": {
            browser: "Chrome",
            os: "iOS",
            icon: "🌐",
            steps: [
                "روی سه نقطه (⋮) پایین صفحه بزن",
                "گزینه «Add to Home Screen» رو انتخاب کن",
                "اسم «CheeseCode» رو تأیید کن",
                "روی «Add» بزن",
                "آیکون چیزکد روی صفحه‌ی اصلی ظاهر میشه!"
            ]
        },

        "default": {
            browser: "مرورگر",
            os: "دستگاه",
            icon: "📱",
            steps: [
                "توی منوی مرورگر (سه نقطه یا سه خط)، بگرد دنبال گزینه‌ای مثل:",
                "• «Install app»",
                "• «Add to Home screen»",
                "• «Add to phone»",
                "روی اون گزینه بزن و تأیید کن",
                "آیکون چیزکد روی دستگاهت ظاهر میشه!"
            ]
        }
    },

    benefits: [
        { icon: "⚡", text: "بارگذاری سریع‌تر" },
        { icon: "📴", text: "کارکرد آفلاین" },
        { icon: "🏠", text: "آیکون روی صفحه‌ی اصلی" },
        { icon: "🖥️", text: "تجربه‌ی تمام‌صفحه" }
    ]
};

window.installConfig = installConfig;