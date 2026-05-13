# 📝 دليل نشر مقال ثنائي اللغة من Obsidian

## بنية الملفات

كل مقال يمكن أن يكون له نسخة إنجليزية مرافقة:

```
content/
├── Culture/
│   ├── my-article.md          ← النسخة العربية (الأصلية)
│   └── my-article.en.md       ← النسخة الإنجليزية (اختيارية)
├── poetry/
│   ├── 01_للعالم-الأعلى.md    ← القصيدة العربية (تُترجم تلقائياً)
│   └── ...
└── Engineering/
    ├── my-guide.md
    └── my-guide.en.md
```

> **ملاحظة**: القصائد في مجلد `poetry/` تُترجم تلقائياً عبر API ولا تحتاج ملف `.en.md` — لكن ستظهر مع تنبيه أنها ترجمة آلية.

---

## Frontmatter المطلوب

### الملف العربي (`article.md`)

```yaml
---
title: "عنوان المقال بالعربية"
title_en: "Article Title in English"   # اختياري - يظهر عند التبديل للإنجليزية
description: "وصف المقال"
tags:
  - ثقافة
created: 2024-01-15
---
```

### الملف الإنجليزي (`article.en.md`)

```yaml
---
title: "Article Title in English"
description: "Article description in English"
lang: en
tags:
  - culture
created: 2024-01-15
---

Your English content goes here...
```

> **مهم**: الملف الإنجليزي يجب أن يكون بنفس اسم الملف العربي مع إضافة `.en` قبل `.md`

---

## خطوات النشر من Obsidian

### 1. إنشاء المقال العربي
1. أنشئ ملف Markdown جديد في المجلد المناسب (مثلاً `Culture/my-article.md`)
2. أضف الـ frontmatter المطلوب
3. اكتب المحتوى بالعربية

### 2. إنشاء النسخة الإنجليزية (اختياري)
1. أنشئ ملف بنفس الاسم مع `.en.md` (مثلاً `Culture/my-article.en.md`)
2. أضف frontmatter إنجليزي مع `lang: en`
3. اكتب المحتوى بالإنجليزية

### 3. النشر عبر Obsidian Git Plugin
1. افتح Obsidian Command Palette (`Ctrl+P`)
2. اكتب "Git" واختر `Obsidian Git: Commit all changes`
3. أدخل رسالة الـ commit (مثلاً: `feat: add new article with EN translation`)
4. اختر `Obsidian Git: Push`

أو من Terminal:
```bash
cd /path/to/quartz
git add .
git commit -m "feat: add new bilingual article"
git push origin main
```

---

## التحقق قبل النشر

### قائمة المراجعة ✅

- [ ] اسم الملف الإنجليزي يطابق العربي مع `.en.md`
- [ ] الـ frontmatter يحتوي `title` في كلا الملفين
- [ ] الملف الإنجليزي يحتوي `lang: en` في الـ frontmatter
- [ ] المحتوى لا يحتوي أخطاء Markdown
- [ ] الصور والروابط تعمل في كلا الملفين

### اختبار محلي (اختياري)
```bash
npx quartz build --serve
```
ثم افتح `http://localhost:8080` وجرّب:
1. اضغط زر `EN` في الشريط العلوي
2. تأكد أن المحتوى يتبدل للإنجليزية
3. تأكد أن التخطيط يتحول لـ LTR

### التحقق بعد النشر
1. افتح المقال على الموقع
2. اضغط زر `EN` — يجب أن يظهر المحتوى الإنجليزي
3. جرّب الرابط المباشر: `https://hamedalkhateeb.pages.dev/Culture/my-article?lang=en`
4. تأكد أن المقال الإنجليزي **لا يظهر** في قائمة المقالات أو البحث

---

## كيف يعمل النظام

```
┌─────────────────────────────────────────────────┐
│  الزائر يفتح الموقع                              │
│                                                   │
│  ← لغة المتصفح عربية؟ → يعرض النسخة العربية      │
│  ← لغة المتصفح أجنبية؟ → يعرض بانر "Switch?"     │
│                                                   │
│  ← يضغط EN → يتحول لـ LTR + إنجليزي             │
│    ├── مقال عادي → يحمل article.en.html          │
│    ├── قصيدة → ترجمة آلية + تنبيه 🤖             │
│    └── لا يوجد ترجمة → "Not available yet"       │
│                                                   │
│  ← يضغط ع → يرجع للعربية RTL                     │
└─────────────────────────────────────────────────┘
```

---

## ملاحظات
- الاختيار يُحفظ في `localStorage` ولا يُسأل الزائر مرة أخرى
- يمكن مشاركة رابط بلغة محددة عبر `?lang=en` أو `?lang=ar`
- الملفات `.en.md` لا تظهر في Sitemap أو RSS أو البحث
- القصائد تُترجم آلياً عبر MyMemory API مع تخزين مؤقت
