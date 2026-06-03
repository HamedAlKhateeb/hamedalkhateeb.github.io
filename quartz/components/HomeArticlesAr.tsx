import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { Date as DateComponent, getDate } from "./Date"
import readingTime from "reading-time"

export default (() => {
  const HomeArticlesAr: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, allFiles, cfg } = props
    if (fileData.slug !== "ar/index" && fileData.slug !== "ar" && fileData.slug !== "ar/") return null

    const arabicArticles = allFiles
      .filter((page) => page.slug && page.slug.startsWith("ar/articles/") && !page.slug.endsWith("/index"))
      .sort((a, b) => {
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    const arabicPoems = allFiles
      .filter((page) => page.slug && page.slug.startsWith("ar/poetry/") && !page.slug.endsWith("/index"))
      .sort((a, b) => {
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    const latestArticles = arabicArticles.slice(0, 6)
    const latestPoems = arabicPoems.slice(0, 6)

    // Select poem of the week (pinned or just first)
    const featuredPoems = arabicPoems.filter((p) => p.frontmatter?.pinned === true)
    const poemOfWeek = featuredPoems.length > 0 ? featuredPoems[0] : (arabicPoems.length > 0 ? arabicPoems[0] : null)

    // Archive — 4 random items
    const allArPages = allFiles.filter((page) => page.slug && page.slug.startsWith("ar/") && !page.slug.endsWith("/index"))
    const archivePages = [...allArPages].sort(() => 0.5 - Math.random()).slice(0, 4)

    // Random Quote from content
    const randomPage = allArPages.length > 0 ? allArPages[Math.floor(Math.random() * allArPages.length)] : null

    // Most read (longest articles as proxy)
    const mostRead = [...allArPages]
      .filter((p) => p.text)
      .sort((a, b) => (b.text?.length ?? 0) - (a.text?.length ?? 0))
      .slice(0, 3)

    // Stats
    const totalWords = allArPages.reduce((acc, page) => {
        if (page.text) {
            const { words } = readingTime(page.text)
            return acc + words
        }
        return acc
    }, 0)

    return (
      <div class="ar-main-layout container" dir="rtl">
        <div class="ar-content-column">

            {/* ══════ آخر المقالات ══════ */}
            <section class="ar-latest-articles">
                <div class="ar-section-title-row">
                    <h2>آخر المقالات</h2>
                    <a href={resolveRelative(fileData.slug!, "ar/articles" as any)} class="ar-view-all">عرض الكل ←</a>
                </div>
                <div class="ar-articles-grid">
                    {latestArticles.map((page) => {
                        const title = page.frontmatter?.title ?? "بدون عنوان"
                        const desc = page.frontmatter?.description ?? page.description ?? ""
                        let minutesStr = ""
                        if (page.text) {
                            const { minutes } = readingTime(page.text)
                            minutesStr = Math.ceil(minutes) + " دقائق"
                        }
                        const cover = (page.frontmatter?.cover ?? page.frontmatter?.image) as string | undefined
                        return (
                        <article class="ar-card ar-content-card">
                            {cover ? <div class="ar-card-image" style={{backgroundImage: `url('${cover}')`}}></div>
                                   : <div class="ar-card-image ar-card-image-placeholder"></div>}
                            <div class="ar-card-body">
                                <h3><a href={resolveRelative(fileData.slug!, page.slug!)} class="ar-card-link">{title}</a></h3>
                                <p class="ar-excerpt">{desc.length > 70 ? desc.substring(0, 70) + '...' : desc}</p>
                                <div class="ar-card-meta">
                                    <span>{page.dates && <DateComponent date={getDate(cfg, page)!} locale="ar-EG" />}</span>
                                    <span>{minutesStr}</span>
                                </div>
                            </div>
                        </article>
                        )
                    })}
                </div>
            </section>

            {/* ══════ آخر الأشعار ══════ */}
            <section class="ar-latest-poems">
                <div class="ar-section-title-row">
                    <h2>آخر الأشعار</h2>
                    <a href={resolveRelative(fileData.slug!, "ar/poetry" as any)} class="ar-view-all">عرض الكل ←</a>
                </div>
                <div class="ar-poems-grid">
                    {latestPoems.map((page) => {
                        const title = page.frontmatter?.title ?? "بدون عنوان"
                        const desc = page.frontmatter?.description ?? page.description ?? ""
                        const tags = page.frontmatter?.tags ?? []
                        const mainTag = tags.length > 0 ? tags[0] : "شعر"
                        return (
                        <article class="ar-card ar-content-card ar-text-center">
                            <div class="ar-poem-calligraphy">{mainTag}</div>
                            <div class="ar-card-body">
                                <h3><a href={resolveRelative(fileData.slug!, page.slug!)} class="ar-card-link">{title}</a></h3>
                                <p class="ar-excerpt">{desc.split('|')[0].trim()}...</p>
                                <div class="ar-card-meta ar-justify-center">
                                    <span>{page.dates && <DateComponent date={getDate(cfg, page)!} locale="ar-EG" />}</span>
                                </div>
                            </div>
                        </article>
                        )
                    })}
                </div>
            </section>

            {/* ══════ حكمة اليوم ══════ */}
            <section class="ar-card ar-quote-of-the-day ar-text-center">
                <div class="ar-section-header">
                    <span class="ar-decorator-icon">❊</span>
                    <h2>حكمة اليوم</h2>
                    <span class="ar-decorator-icon mirror">❊</span>
                </div>
                <blockquote id="ar-daily-quote-text">"الناس أعداء ما جهلوا"</blockquote>
                <p id="ar-daily-quote-author" class="ar-author">- علي بن أبي طالب</p>
                <button id="ar-refresh-quote" class="ar-btn ar-btn-outline">حكمة أخرى</button>
            </section>

            {/* ══════ اقتباس عشوائي ══════ */}
            {randomPage && (
            <section class="ar-card ar-random-quote">
                <div class="ar-quote-content">
                    <div class="ar-section-header">
                        <h2>اقتباس عشوائي من الموقع</h2>
                    </div>
                    <blockquote>{randomPage.frontmatter?.description ?? randomPage.description ?? randomPage.frontmatter?.title}</blockquote>
                    <a href={resolveRelative(fileData.slug!, randomPage.slug!)} class="ar-read-more-link">اقرأ المقال ←</a>
                </div>
            </section>
            )}

            {/* ══════ قصيدة الأسبوع + من الأرشيف ══════ */}
            <div class="ar-two-col-layout">
                {/* من الأرشيف — first child → RIGHT in RTL */}
                <section class="ar-archive-section">
                    <div class="ar-section-title-row">
                        <h2>من الأرشيف</h2>
                        <a href={resolveRelative(fileData.slug!, "ar/articles" as any)} class="ar-view-all">عرض الكل ←</a>
                    </div>
                    <div class="ar-grid-2">
                        {archivePages.map((page) => {
                            const title = page.frontmatter?.title ?? "بدون عنوان"
                            const cover = (page.frontmatter?.cover ?? page.frontmatter?.image) as string | undefined
                            return (
                            <article class="ar-card ar-content-card ar-small-card">
                                {cover ? <div class="ar-card-image ar-card-image-sm" style={{backgroundImage: `url('${cover}')`}}></div>
                                       : <div class="ar-card-image ar-card-image-sm ar-card-image-placeholder"></div>}
                                <div class="ar-card-body">
                                    <h3><a href={resolveRelative(fileData.slug!, page.slug!)} class="ar-card-link">{title}</a></h3>
                                    <div class="ar-card-meta">
                                        <span>{page.dates && <DateComponent date={getDate(cfg, page)!} locale="ar-EG" />}</span>
                                    </div>
                                </div>
                            </article>
                            )
                        })}
                    </div>
                </section>

                {/* قصيدة الأسبوع — second child → LEFT in RTL */}
                {poemOfWeek && (
                <section class="ar-card ar-poem-of-week ar-featured-card">
                    <div class="ar-section-header">
                        <h2>قصيدة الأسبوع</h2>
                    </div>
                    <h3 class="ar-poem-title">{poemOfWeek.frontmatter?.title}</h3>
                    <div class="ar-poem-verses">
                        <p>{poemOfWeek.frontmatter?.description ?? poemOfWeek.description}</p>
                    </div>
                    <a href={resolveRelative(fileData.slug!, poemOfWeek.slug!)} class="ar-btn ar-btn-primary mt-3">اقرأ القصيدة كاملة ←</a>
                </section>
                )}
            </div>

            {/* ══════ خريطة المعرفة + الأكثر قراءة ══════ */}
            <div class="ar-two-col-layout">
                {/* خريطة المعرفة — first child → RIGHT in RTL */}
                <section class="ar-card ar-knowledge-map">
                    <div class="ar-section-header">
                        <h2>خريطة المعرفة</h2>
                    </div>
                    <p class="ar-subtitle ar-text-center">اختر موضوعاً لتستكشف المحتوى المرتبط به</p>
                    <div class="ar-nodes-container">
                        <a href={resolveRelative(fileData.slug!, "tags/رياضيات" as any)} class="ar-node">
                            <span class="ar-node-icon">∑</span>
                            <span>رياضيات</span>
                        </a>
                        <a href={resolveRelative(fileData.slug!, "tags/فلسفة" as any)} class="ar-node">
                            <span class="ar-node-icon">φ</span>
                            <span>فلسفة</span>
                        </a>
                        <a href={resolveRelative(fileData.slug!, "tags/لغة" as any)} class="ar-node">
                            <span class="ar-node-icon">ع</span>
                            <span>لغة</span>
                        </a>
                        <a href={resolveRelative(fileData.slug!, "tags/أدب" as any)} class="ar-node">
                            <span class="ar-node-icon">📖</span>
                            <span>أدب</span>
                        </a>
                        <a href={resolveRelative(fileData.slug!, "tags/شعر" as any)} class="ar-node">
                            <span class="ar-node-icon">✒</span>
                            <span>شعر</span>
                        </a>
                    </div>
                </section>

                {/* الأكثر قراءة — second child → LEFT in RTL */}
                <section class="ar-card ar-most-read">
                    <div class="ar-section-title-row">
                        <h2>الأكثر قراءة</h2>
                        <a href={resolveRelative(fileData.slug!, "ar/articles" as any)} class="ar-view-all">عرض الكل ←</a>
                    </div>
                    <ol class="ar-most-read-list">
                        {mostRead.map((page) => {
                            const title = page.frontmatter?.title ?? "بدون عنوان"
                            return (
                            <li>
                                <a href={resolveRelative(fileData.slug!, page.slug!)}>{title}</a>
                            </li>
                            )
                        })}
                    </ol>
                </section>
            </div>

            {/* ══════ اقرأ لتعرف ══════ */}
            <section class="ar-card ar-inspirational-quote ar-text-center">
                <h2>"اقرأ لتعرف، واكتب لتفهم، وتأمل لتُدرك."</h2>
                <div class="ar-ornament"></div>
            </section>

        </div>

        {/* ══════════════════════════ الشريط الجانبي ══════════════════════════ */}
        <aside class="ar-sidebar-column">

            {/* التقويم */}
            <div class="ar-card ar-calendar-widget ar-text-center">
                <h3 class="ar-day-name" id="ar-cal-day-name">الأربعاء</h3>
                <div class="ar-date-large" id="ar-cal-gregorian">3 يونيو 2026</div>
                <div class="ar-date-hijri" id="ar-cal-hijri">17 ذو الحجة 1447 هـ</div>
                <div class="ar-season" id="ar-cal-season">☀ فصل الصيف</div>
            </div>

            {/* في مثل هذا اليوم */}
            <div class="ar-card ar-on-this-day-widget">
                <h3 class="ar-widget-title ar-on-this-day-title">
                    <span class="ar-otd-icon">🔖</span>
                    في مثل هذا اليوم
                </h3>
                <p id="ar-on-this-day-text" class="ar-on-this-day-text">جارِ التحميل...</p>
            </div>

            {/* إحصائيات الموقع */}
            <div class="ar-card ar-stats-widget">
                <h3 class="ar-widget-title ar-text-center">إحصائيات الموقع</h3>
                <ul class="ar-stats-list">
                    <li>
                        <span class="ar-stat-label">📝 المقالات</span>
                        <span class="ar-stat-value">{arabicArticles.length}</span>
                    </li>
                    <li>
                        <span class="ar-stat-label">📜 الأشعار</span>
                        <span class="ar-stat-value">{arabicPoems.length}</span>
                    </li>
                    <li>
                        <span class="ar-stat-label">📖 إجمالي الكلمات</span>
                        <span class="ar-stat-value">{totalWords.toLocaleString('ar-EG')}</span>
                    </li>
                </ul>
            </div>

            {/* دلني على شيء */}
            <div class="ar-card ar-guide-me-widget ar-text-center">
                <h3>دلّني على شيء</h3>
                <p>اقرأ شيئاً عشوائياً من الموقع</p>
                {randomPage && <a href={resolveRelative(fileData.slug!, randomPage.slug!)} class="ar-btn-overlay stretched-link"></a>}
            </div>

            {/* عن الكاتب */}
            <div class="ar-card ar-author-widget ar-text-center">
                <h3 class="ar-widget-title">عن الكاتب</h3>
                <div class="ar-author-avatar">👤</div>
                <h4 class="ar-author-name">حامد</h4>
                <p class="ar-author-bio">مهندس يهتم بالرياضيات والفلسفة والأدب والشعر. يكتب ليفهم، ويقرأ ليتأمل.</p>
                <a href={resolveRelative(fileData.slug!, "ar/" as any)} class="ar-about-link">حول الموقع →</a>
            </div>

        </aside>
      </div>
    )
  }

  HomeArticlesAr.afterDOMLoaded = `
    // ── Calendar ──
    const updateCalendar = () => {
        const today = new Date();
        const gregorianDate = today.toLocaleDateString('ar-EG', { day: 'numeric', month: 'long', year: 'numeric' });
        const hijriDate = today.toLocaleDateString('ar-SA-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' });
        const dayName = today.toLocaleDateString('ar-EG', { weekday: 'long' });
        const month = today.getMonth() + 1;
        let season = '🌸 فصل الربيع';
        if (month >= 3 && month <= 5) season = '🌸 فصل الربيع';
        else if (month >= 6 && month <= 8) season = '☀ فصل الصيف';
        else if (month >= 9 && month <= 11) season = '🍂 فصل الخريف';
        else season = '❄ فصل الشتاء';

        const dn = document.getElementById('ar-cal-day-name');
        if(dn) dn.textContent = dayName;
        const g = document.getElementById('ar-cal-gregorian');
        if(g) g.textContent = gregorianDate;
        const h = document.getElementById('ar-cal-hijri');
        if(h) h.textContent = hijriDate;
        const s = document.getElementById('ar-cal-season');
        if(s) s.textContent = season;
    };

    // ── On This Day ──
    const updateOnThisDay = () => {
        const events = [
            { m:1, d:1,  t:"في عام 622م بدأ التقويم الهجري، تخليداً لهجرة النبي محمد ﷺ من مكة إلى المدينة." },
            { m:1, d:15, t:"في عام 1929 ولد مارتن لوثر كينغ جونيور، قائد حركة الحقوق المدنية الأمريكية." },
            { m:1, d:27, t:"في عام 1756 ولد فولفغانغ أماديوس موتسارت، أحد أعظم المؤلفين الموسيقيين في التاريخ." },
            { m:2, d:7,  t:"في عام 1812 ولد الروائي الإنجليزي تشارلز ديكنز، صاحب «قصة مدينتين»." },
            { m:2, d:19, t:"في عام 1473 ولد نيكولاس كوبرنيكوس، الذي أثبت أن الأرض تدور حول الشمس." },
            { m:3, d:14, t:"في عام 1879 ولد ألبرت أينشتاين، صاحب نظرية النسبية وأحد أعظم علماء الفيزياء." },
            { m:3, d:21, t:"اليوم العالمي للشعر، اعتمدته اليونسكو عام 1999 للاحتفاء بالتنوع اللغوي والإبداع الشعري." },
            { m:3, d:22, t:"في عام 1945 تأسست جامعة الدول العربية في القاهرة بعضوية سبع دول عربية مؤسسة." },
            { m:4, d:15, t:"في عام 1452 ولد ليوناردو دا فينشي، الفنان والعالم والمخترع الإيطالي." },
            { m:4, d:23, t:"اليوم العالمي للكتاب وحقوق المؤلف، اعتمدته اليونسكو عام 1995." },
            { m:5, d:5,  t:"في عام 1818 ولد كارل ماركس، الفيلسوف والاقتصادي الألماني مؤسس الفلسفة المادية." },
            { m:5, d:27, t:"في عام 1332 ولد عبد الرحمن بن خلدون في تونس، مؤسس علم العمران والاجتماع البشري." },
            { m:6, d:3,  t:"في عام 1769 رصد الكابتن جيمس كوك عبور كوكب الزهرة أمام الشمس من تاهيتي، حدث فلكي نادر." },
            { m:6, d:15, t:"في عام 1215 صدرت وثيقة الماغنا كارتا في إنجلترا، أول ميثاق لتقييد السلطة المطلقة." },
            { m:6, d:28, t:"في عام 1889 ولد الأديب المصري عباس محمود العقاد، صاحب سلسلة العبقريات الشهيرة." },
            { m:7, d:14, t:"في عام 1789 اقتحم الشعب الفرنسي سجن الباستيل، إيذاناً ببدء الثورة الفرنسية." },
            { m:7, d:20, t:"في عام 1969 هبط أول إنسان على سطح القمر، نيل أرمسترونغ في مهمة أبولو 11." },
            { m:8, d:15, t:"في عام 1947 استقلت الهند عن الإمبراطورية البريطانية بقيادة المهاتما غاندي." },
            { m:8, d:25, t:"في عام 1530 توفي ظهير الدين بابر، مؤسس الإمبراطورية المغولية في الهند." },
            { m:9, d:1,  t:"في عام 1939 بدأت الحرب العالمية الثانية بغزو ألمانيا النازية لبولندا." },
            { m:9, d:23, t:"في عام 1932 أُعلن توحيد المملكة العربية السعودية باسمها الحالي." },
            { m:10,d:6,  t:"في عام 1973 بدأت حرب أكتوبر / العاشر من رمضان بين العرب وإسرائيل." },
            { m:10,d:16, t:"في عام 1868 ولد أمير الشعراء أحمد شوقي، أحد أعلام الشعر العربي الحديث." },
            { m:10,d:24, t:"في عام 1945 تأسست منظمة الأمم المتحدة بهدف حفظ السلام والأمن الدوليين." },
            { m:11,d:9,  t:"في عام 1989 سقط جدار برلين، رمزاً لنهاية الحرب الباردة وبداية عصر جديد." },
            { m:11,d:14, t:"في عام 1889 ولد طه حسين في المنيا بمصر، الذي أصبح عميد الأدب العربي." },
            { m:12,d:10, t:"في عام 1948 تبنت الأمم المتحدة الإعلان العالمي لحقوق الإنسان في باريس." },
            { m:12,d:18, t:"اليوم العالمي للغة العربية، اعتمدته اليونسكو تقديراً لإسهامها الكبير في الحضارة الإنسانية." },
            { m:12,d:25, t:"في عام 1642 ولد إسحاق نيوتن، مؤسس الميكانيكا الكلاسيكية وحساب التفاضل والتكامل." },
        ];
        const today = new Date();
        const m = today.getMonth() + 1;
        const d = today.getDate();
        let best = events[0];
        let bestDist = 400;
        for (const e of events) {
            const dist = Math.abs((e.m * 31 + e.d) - (m * 31 + d));
            if (dist < bestDist) { bestDist = dist; best = e; }
        }
        const el = document.getElementById('ar-on-this-day-text');
        if (el) el.textContent = best.t;
    };

    // ── Quotes ──
    const fallbackQuotes = [
        { quote: "الناس أعداء ما جهلوا", author: "علي بن أبي طالب" },
        { quote: "على قدر أهل العزم تأتي العزائم", author: "المتنبي" },
        { quote: "الأيام صحائف الأعمار، فخلدوها بأحسن الأعمال", author: "ابن الجوزي" },
        { quote: "إنما الأمم الأخلاق ما بقيت، فإن هم ذهبت أخلاقهم ذهبوا", author: "أحمد شوقي" },
        { quote: "العلم صيد والكتابة قيده", author: "الإمام الشافعي" },
        { quote: "من طلب العلا سهر الليالي", author: "الإمام الشافعي" },
        { quote: "إذا أردت أن تطاع فأمر بما يستطاع", author: "حكمة عربية" },
        { quote: "ما ندمت على سكوتي مرة، لكنني ندمت على الكلام مراراً", author: "حكمة عربية" },
    ];

    const fetchQuote = async () => {
        const quoteEl = document.getElementById('ar-daily-quote-text');
        const authorEl = document.getElementById('ar-daily-quote-author');
        if(!quoteEl) return;
        try {
            const response = await fetch('https://kalimatapi.com/api/v1/quotes/random', {
                headers: { 'Authorization': "Bearer YOUR_TOKEN" }
            });
            if (response.ok) {
                const data = await response.json();
                quoteEl.textContent = "\\"" + (data.quote || data.content) + "\\"";
                authorEl.textContent = "- " + (data.author || data.author_name);
            } else { throw new Error('API error'); }
        } catch (error) {
            const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            quoteEl.textContent = "\\"" + random.quote + "\\"";
            authorEl.textContent = "- " + random.author;
        }
    };

    updateCalendar();
    updateOnThisDay();
    const refreshBtn = document.getElementById('ar-refresh-quote');
    if(refreshBtn) { refreshBtn.addEventListener('click', fetchQuote); }
  `

  HomeArticlesAr.css = `
    /* ═══════════════ Global Layout Overrides for Arabic Homepage ═══════════════ */
    @media (min-width: 801px) {
        body.is-list .page:has(.ar-main-layout) {
            max-width: 1500px !important;
            width: 95% !important;
            margin: 0 auto !important;
        }
        body.is-list .page > #quartz-body:has(.ar-main-layout) {
            grid-template-columns: 1fr minmax(auto, 1400px) 1fr !important;
            column-gap: 0 !important;
            grid-template-areas: "grid-header grid-header grid-header" "grid-sidebar-left grid-center grid-sidebar-right" "grid-footer grid-footer grid-footer" !important;
        }
        body.is-list .page > #quartz-body:has(.ar-main-layout) .left.sidebar,
        body.is-list .page > #quartz-body:has(.ar-main-layout) .right.sidebar {
            display: none !important;
        }
    }

    /* ═══════════════ Layout ═══════════════ */
    .ar-main-layout {
        display: grid;
        grid-template-columns: 1fr 340px;
        gap: 32px;
        margin-top: 20px;
        margin-bottom: 60px;
        font-family: 'Amiri', serif;
        direction: rtl;
    }
    .ar-content-column { grid-column: 1; }
    .ar-sidebar-column { grid-column: 2; }
    .ar-main-layout a { text-decoration: none; color: inherit; }
    .ar-main-layout a:hover { color: var(--secondary); }
    .ar-text-center { text-align: center; }

    /* ═══════════════ Cards ═══════════════ */
    .ar-card {
        background-color: var(--light);
        border: 1px solid var(--lightgray);
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 26px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    .ar-card:hover { 
        box-shadow: 0 10px 25px rgba(0,0,0,0.06); 
        transform: translateY(-4px);
    }
    .ar-card-link::after {
        content: "";
        position: absolute;
        top: 0; right: 0; bottom: 0; left: 0;
        z-index: 1;
    }

    /* ═══════════════ Section Headers ═══════════════ */
    .ar-section-header {
        display: flex; align-items: center; justify-content: center;
        gap: 15px; margin-bottom: 20px; color: var(--secondary);
    }
    .ar-section-header h2 { font-size: 1.5rem; margin: 0; }
    .ar-decorator-icon { font-size: 1.2rem; color: var(--tertiary); }
    .ar-section-title-row {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 22px; padding-bottom: 10px;
        border-bottom: 1px dashed var(--lightgray);
    }
    .ar-section-title-row h2 { font-size: 1.45rem; color: var(--dark); margin: 0; }
    .ar-view-all { font-size: 0.95rem; color: var(--gray); white-space: nowrap; }

    /* ═══════════════ Quote of the Day ═══════════════ */
    .ar-quote-of-the-day blockquote {
        font-size: 2rem; font-weight: 700; color: var(--dark);
        margin-bottom: 18px; line-height: 1.7;
    }
    .ar-author { font-size: 1.1rem; color: var(--gray); margin-bottom: 25px; }

    /* ═══════════════ Buttons ═══════════════ */
    .ar-btn {
        font-family: 'Amiri', serif; font-size: 1.05rem;
        padding: 8px 24px; border-radius: 30px; cursor: pointer;
        display: inline-flex; align-items: center; gap: 8px;
        border: none; transition: all 0.2s ease;
    }
    .ar-btn-outline {
        background-color: transparent; border: 1px solid var(--lightgray); color: var(--gray);
    }
    .ar-btn-outline:hover { border-color: var(--secondary); color: var(--secondary); }
    .ar-btn-primary { background-color: var(--secondary); color: var(--light); }
    .ar-btn-primary:hover { opacity: 0.9; }

    /* ═══════════════ Random Quote ═══════════════ */
    .ar-random-quote {
        background-color: var(--lightgray);
        border-right: 4px solid var(--secondary); border-left: none;
    }
    .ar-random-quote blockquote { font-size: 1.25rem; margin-bottom: 15px; color: var(--dark); line-height: 1.8; }
    .ar-read-more-link { font-size: 0.95rem; color: var(--secondary) !important; }

    /* ═══════════════ Grids ═══════════════ */
    .ar-articles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 24px; }
    .ar-poems-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
    .ar-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .ar-two-col-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 0; }

    /* ═══════════════ Content Cards ═══════════════ */
    .ar-content-card { padding: 0; display: flex; flex-direction: column; height: 100%; }
    .ar-card-image {
        height: 120px; background-size: cover; background-position: center;
        border-bottom: 1px solid var(--lightgray);
        transition: transform 0.5s ease;
    }
    .ar-card:hover .ar-card-image {
        transform: scale(1.03);
    }
    .ar-card-image-placeholder {
        background: linear-gradient(135deg, var(--lightgray) 0%, var(--highlight) 100%);
    }
    .ar-card-image-sm { height: 110px; }
    .ar-card-body { padding: 16px; display: flex; flex-direction: column; flex-grow: 1; }
    .ar-content-card h3 { font-size: 1.15rem; color: var(--dark); margin: 0 0 10px 0; line-height: 1.5; font-weight: bold; }
    .ar-excerpt { font-size: 0.92rem; color: var(--gray); margin-bottom: 12px; flex-grow: 1; line-height: 1.6; }
    .ar-card-meta {
        display: flex; justify-content: space-between; font-size: 0.78rem;
        color: var(--gray); border-top: 1px solid var(--lightgray);
        padding-top: 10px; margin-top: auto;
    }
    .ar-justify-center { justify-content: center; gap: 12px; }
    .ar-small-card h3 { font-size: 0.95rem; }

    /* ═══════════════ Poem Calligraphy ═══════════════ */
    .ar-poem-calligraphy {
        height: 140px; 
        background: linear-gradient(135deg, rgba(40, 75, 99, 0.05) 0%, rgba(132, 165, 157, 0.12) 100%);
        display: flex; align-items: center; justify-content: center;
        font-size: 2rem; color: var(--secondary);
        border-bottom: 1px solid var(--lightgray);
        font-family: 'Aref Ruqaa', serif;
        position: relative;
    }
    .ar-poem-calligraphy::after {
        content: "❦";
        position: absolute;
        bottom: 8px;
        font-size: 1rem;
        color: var(--tertiary);
        opacity: 0.7;
    }

    /* ═══════════════ Poem of Week ═══════════════ */
    .ar-poem-title { font-size: 1.5rem; color: var(--secondary); margin: 0 0 14px 0; }
    .ar-poem-verses { font-size: 1.05rem; line-height: 2; color: var(--darkgray); margin-bottom: 18px; }
    .mt-3 { margin-top: 1rem; }

    /* ═══════════════ Sidebar ═══════════════ */
    .ar-sidebar-column .ar-card { padding: 24px; }
    .ar-widget-title { font-size: 1.1rem; color: var(--secondary); margin-bottom: 14px; text-align: center; }

    /* Calendar */
    .ar-day-name { font-size: 1.15rem; color: var(--secondary); margin-bottom: 6px; }
    .ar-date-large { font-size: 1.7rem; font-weight: bold; color: var(--dark); margin-bottom: 4px; }
    .ar-date-hijri { font-size: 0.95rem; color: var(--gray); margin-bottom: 10px; }
    .ar-season { font-size: 0.9rem; color: var(--gray); }

    /* On This Day */
    .ar-on-this-day-title {
        display: flex !important; align-items: center; gap: 8px; justify-content: center;
    }
    .ar-otd-icon { font-size: 1.3rem; }
    .ar-on-this-day-text {
        font-size: 0.98rem; line-height: 1.8; color: var(--darkgray); text-align: center;
    }

    /* Stats */
    .ar-stats-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 13px; }
    .ar-stats-list li {
        display: flex; justify-content: space-between; align-items: center;
        border-bottom: 1px dashed var(--lightgray); padding-bottom: 8px;
    }
    .ar-stat-label { color: var(--gray); font-size: 0.93rem; }
    .ar-stat-value { font-size: 1.1rem; font-weight: bold; color: var(--dark); }

    /* Guide Me */
    .ar-guide-me-widget { background-color: var(--secondary); color: var(--light); border: none; }
    .ar-guide-me-widget h3 { color: var(--light); font-size: 1.35rem; margin: 0 0 8px 0; }
    .ar-guide-me-widget p { color: rgba(255,255,255,0.85); margin: 0; }
    .ar-btn-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }

    /* Author */
    .ar-author-avatar {
        width: 68px; height: 68px; border-radius: 50%;
        background-color: var(--lightgray); display: flex;
        align-items: center; justify-content: center;
        font-size: 1.8rem; margin: 0 auto 10px;
        color: var(--gray); border: 2px solid var(--lightgray);
    }
    .ar-author-name { font-size: 1.15rem; color: var(--dark); margin: 0 0 8px 0; }
    .ar-author-bio { font-size: 0.92rem; color: var(--gray); line-height: 1.7; margin-bottom: 10px; }
    .ar-about-link { font-size: 0.88rem; color: var(--secondary) !important; }

    /* ═══════════════ Knowledge Map ═══════════════ */
    .ar-nodes-container {
        display: flex; justify-content: center; align-items: flex-start;
        gap: 24px; padding: 20px 0; flex-wrap: wrap;
    }
    .ar-node {
        display: flex; flex-direction: column; align-items: center;
        gap: 8px; color: var(--dark); transition: all 0.2s ease;
    }
    .ar-node:hover { transform: translateY(-3px); }
    .ar-node-icon {
        width: 60px; height: 60px; border-radius: 50%;
        border: 2px solid var(--lightgray); display: flex;
        align-items: center; justify-content: center;
        font-size: 1.45rem; color: var(--secondary);
        background-color: var(--light); transition: all 0.3s ease;
    }
    .ar-node:hover .ar-node-icon { border-color: var(--secondary); background-color: var(--highlight); }
    .ar-node span:last-child { font-size: 0.88rem; }
    .ar-subtitle { font-size: 0.92rem; color: var(--gray); margin-bottom: 8px; }

    /* ═══════════════ Most Read ═══════════════ */
    .ar-most-read-list {
        list-style: none; padding: 0; margin: 0; counter-reset: most-read;
    }
    .ar-most-read-list li {
        counter-increment: most-read; padding: 13px 0;
        border-bottom: 1px solid var(--lightgray);
        display: flex; align-items: center; gap: 12px;
        font-size: 1rem; line-height: 1.6;
    }
    .ar-most-read-list li:last-child { border-bottom: none; }
    .ar-most-read-list li::before {
        content: counter(most-read);
        font-size: 1.6rem; font-weight: bold; color: var(--secondary);
        min-width: 32px; text-align: center; opacity: 0.5;
    }
    .ar-most-read-list a { color: var(--dark); }
    .ar-most-read-list a:hover { color: var(--secondary); }

    /* ═══════════════ Inspirational Quote ═══════════════ */
    .ar-inspirational-quote h2 { font-size: 1.4rem; line-height: 2; color: var(--secondary); margin: 0; }
    .ar-ornament { width: 60px; height: 2px; background: var(--lightgray); margin: 14px auto 0; }

    /* ═══════════════ Archive ═══════════════ */
    .ar-archive-section { margin-bottom: 0; }

    /* ═══════════════ Responsive ═══════════════ */
    @media (max-width: 1024px) {
        .ar-main-layout { grid-template-columns: 1fr; }
        .ar-content-column, .ar-sidebar-column { grid-column: 1; }
        .ar-sidebar-column {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 20px;
        }
        .ar-sidebar-column .ar-card { margin-bottom: 0; }
    }
    @media (max-width: 900px) {
        .ar-articles-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
        .ar-poems-grid { grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }
        .ar-two-col-layout { grid-template-columns: 1fr; }
    }
    @media (max-width: 600px) {
        .ar-articles-grid { grid-template-columns: 1fr; }
        .ar-poems-grid { grid-template-columns: 1fr; }
        .ar-grid-2 { grid-template-columns: 1fr; }
        .ar-sidebar-column { grid-template-columns: 1fr; }
        .ar-sidebar-column .ar-card { margin-bottom: 0; }
    }
    @media (max-width: 480px) {
        .ar-card { padding: 20px; margin-bottom: 20px; }
        .ar-nodes-container { gap: 14px; }
        .ar-node-icon { width: 48px; height: 48px; font-size: 1.2rem; }
        .ar-date-large { font-size: 1.5rem; }
    }
  `

  return HomeArticlesAr
}) satisfies QuartzComponentConstructor
