import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { Date as DateComponent, getDate } from "./Date"
import readingTime from "reading-time"

export default (() => {
  const HomeArticlesAr: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, allFiles, cfg } = props
    if (fileData.slug !== "ar/index") return null

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

    const latestArticles = arabicArticles.slice(0, 3)
    const latestPoems = arabicPoems.slice(0, 4)
    
    // Select poem of the week (pinned or just first)
    const featuredPoems = arabicPoems.filter((p) => p.frontmatter?.pinned === true)
    const poemOfWeek = featuredPoems.length > 0 ? featuredPoems[0] : (arabicPoems.length > 0 ? arabicPoems[0] : null)
    
    // Archive
    const allArPages = allFiles.filter((page) => page.slug && page.slug.startsWith("ar/") && !page.slug.endsWith("/index"))
    const archivePages = [...allArPages].sort(() => 0.5 - Math.random()).slice(0, 2)
    
    // Random Quote from content
    const randomPage = allArPages.length > 0 ? allArPages[Math.floor(Math.random() * allArPages.length)] : null

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
            
            {/* حكمة اليوم */}
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

            {/* اقتباس عشوائي */}
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

            {/* آخر المقالات */}
            <section class="ar-latest-articles">
                <div class="ar-section-title-row">
                    <h2>آخر المقالات</h2>
                    <a href={resolveRelative(fileData.slug!, "ar/articles" as any)} class="ar-view-all">عرض الكل ←</a>
                </div>
                <div class="ar-grid-3">
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
                            {cover && <div class="ar-card-image" style={{backgroundImage: `url('${cover}')`}}></div>}
                            <div class="ar-card-body">
                                <h3><a href={resolveRelative(fileData.slug!, page.slug!)}>{title}</a></h3>
                                <p class="ar-excerpt">{desc}</p>
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

            {/* آخر الأشعار */}
            <section class="ar-latest-poems">
                <div class="ar-section-title-row">
                    <h2>آخر الأشعار</h2>
                    <a href={resolveRelative(fileData.slug!, "ar/poetry" as any)} class="ar-view-all">عرض الكل ←</a>
                </div>
                <div class="ar-grid-4">
                    {latestPoems.map((page) => {
                        const title = page.frontmatter?.title ?? "بدون عنوان"
                        const desc = page.frontmatter?.description ?? page.description ?? ""
                        const tags = page.frontmatter?.tags ?? []
                        const mainTag = tags.length > 0 ? tags[0] : "شعر"
                        return (
                        <article class="ar-card ar-content-card ar-text-center">
                            <div class="ar-poem-calligraphy">{mainTag}</div>
                            <div class="ar-card-body">
                                <h3><a href={resolveRelative(fileData.slug!, page.slug!)}>{title}</a></h3>
                                <p class="ar-excerpt">{desc}</p>
                                <div class="ar-card-meta ar-justify-center">
                                    <span>{page.dates && <DateComponent date={getDate(cfg, page)!} locale="ar-EG" />}</span>
                                </div>
                            </div>
                        </article>
                        )
                    })}
                </div>
            </section>

            <div class="ar-two-col-layout">
                {/* قصيدة الأسبوع */}
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

                {/* من الأرشيف */}
                <section class="ar-archive-section">
                    <div class="ar-section-title-row">
                        <h2>من الأرشيف</h2>
                    </div>
                    <div class="ar-grid-2">
                        {archivePages.map((page) => {
                            const title = page.frontmatter?.title ?? "بدون عنوان"
                            const cover = (page.frontmatter?.cover ?? page.frontmatter?.image) as string | undefined
                            return (
                            <article class="ar-card ar-content-card ar-small-card">
                                {cover && <div class="ar-card-image" style={{backgroundImage: `url('${cover}')`}}></div>}
                                <div class="ar-card-body">
                                    <h3><a href={resolveRelative(fileData.slug!, page.slug!)}>{title}</a></h3>
                                    <div class="ar-card-meta">
                                        <span>{page.dates && <DateComponent date={getDate(cfg, page)!} locale="ar-EG" />}</span>
                                    </div>
                                </div>
                            </article>
                            )
                        })}
                    </div>
                </section>
            </div>

            {/* خريطة المعرفة */}
            <section class="ar-card ar-knowledge-map">
                <div class="ar-section-header ar-text-center">
                    <h2>خريطة المعرفة</h2>
                    <p class="ar-subtitle">اختر موضوعاً لتستكشف المحتوى المرتبط به</p>
                </div>
                <div class="ar-nodes-container">
                    <a href={resolveRelative(fileData.slug!, "tags/رياضيات" as any)} class="ar-node"><span>رياضيات</span></a>
                    <div class="ar-connector"></div>
                    <a href={resolveRelative(fileData.slug!, "tags/فلسفة" as any)} class="ar-node"><span>فلسفة</span></a>
                    <div class="ar-connector"></div>
                    <a href={resolveRelative(fileData.slug!, "tags/لغة" as any)} class="ar-node"><span>لغة</span></a>
                    <div class="ar-connector"></div>
                    <a href={resolveRelative(fileData.slug!, "tags/أدب" as any)} class="ar-node"><span>أدب</span></a>
                    <div class="ar-connector"></div>
                    <a href={resolveRelative(fileData.slug!, "tags/شعر" as any)} class="ar-node"><span>شعر</span></a>
                </div>
            </section>
            
             <section class="ar-card ar-inspirational-quote ar-text-center">
                 <h2>"اقرأ لتعرف، واكتب لتفهم، وتأمل لتُدرك."</h2>
                 <div class="ar-ornament"></div>
             </section>

        </div>

        <aside class="ar-sidebar-column">
            
            {/* التقويم */}
            <div class="ar-card ar-calendar-widget ar-text-center">
                <h3 class="ar-day-name" id="ar-cal-day-name">الأربعاء</h3>
                <div class="ar-date-large" id="ar-cal-gregorian">3 يونيو 2026</div>
                <div class="ar-date-hijri" id="ar-cal-hijri">17 ذو الحجة 1447 هـ</div>
                <div class="ar-season" id="ar-cal-season">فصل الصيف</div>
            </div>

            {/* كلمة اليوم */}
            <div class="ar-card ar-word-of-day ar-text-center">
                <h3 class="ar-widget-title">كلمة اليوم</h3>
                <h2 class="ar-the-word">الوَجْد</h2>
                <p class="ar-definition">الحزن المصحوب بالشوق.</p>
                <p class="ar-root">أصلها: وجد - يجد - وجوداً</p>
            </div>

            {/* إحصائيات الموقع */}
            <div class="ar-card ar-stats-widget">
                <h3 class="ar-widget-title ar-text-center">إحصائيات الموقع</h3>
                <ul class="ar-stats-list">
                    <li>
                        <span class="ar-stat-label">المقالات</span>
                        <span class="ar-stat-value">{arabicArticles.length}</span>
                    </li>
                    <li>
                        <span class="ar-stat-label">الأشعار</span>
                        <span class="ar-stat-value">{arabicPoems.length}</span>
                    </li>
                    <li>
                        <span class="ar-stat-label">إجمالي الكلمات</span>
                        <span class="ar-stat-value">{totalWords}</span>
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
                <h4 class="ar-author-name">حامد</h4>
                <p class="ar-author-bio">مهندس يهتم بالرياضيات والفلسفة والأدب والشعر. يكتب ليفهم، ويقرأ ليتأمل.</p>
            </div>

        </aside>
      </div>
    )
  }

  HomeArticlesAr.afterDOMLoaded = `
    const updateCalendar = () => {
        const today = new Date();
        const gregorianOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const gregorianDate = today.toLocaleDateString('ar-EG', gregorianOptions);
        
        const hijriOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        const hijriDate = today.toLocaleDateString('ar-SA-u-ca-islamic', hijriOptions);
        
        const dayName = today.toLocaleDateString('ar-EG', { weekday: 'long' });
        
        const month = today.getMonth() + 1;
        let season = 'فصل الربيع';
        if (month >= 3 && month <= 5) season = 'فصل الربيع';
        else if (month >= 6 && month <= 8) season = 'فصل الصيف';
        else if (month >= 9 && month <= 11) season = 'فصل الخريف';
        else season = 'فصل الشتاء';

        const dn = document.getElementById('ar-cal-day-name');
        if(dn) dn.textContent = dayName;
        const g = document.getElementById('ar-cal-gregorian');
        if(g) g.textContent = gregorianDate;
        const h = document.getElementById('ar-cal-hijri');
        if(h) h.textContent = hijriDate;
        const s = document.getElementById('ar-cal-season');
        if(s) s.textContent = season;
    };

    const fallbackQuotes = [
        { quote: "الناس أعداء ما جهلوا", author: "علي بن أبي طالب" },
        { quote: "على قدر أهل العزم تأتي العزائم", author: "المتنبي" },
        { quote: "الأيام صحائف الأعمار، فخلدوها بأحسن الأعمال", author: "ابن الجوزي" },
        { quote: "إنما الأمم الأخلاق ما بقيت، فإن هم ذهبت أخلاقهم ذهبوا", author: "أحمد شوقي" }
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
            } else {
                throw new Error('API error');
            }
        } catch (error) {
            const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            quoteEl.textContent = "\\"" + random.quote + "\\"";
            authorEl.textContent = "- " + random.author;
        }
    };

    updateCalendar();
    
    const refreshBtn = document.getElementById('ar-refresh-quote');
    if(refreshBtn) {
        refreshBtn.addEventListener('click', fetchQuote);
    }
  `

  HomeArticlesAr.css = `
    .ar-main-layout {
        display: grid;
        grid-template-columns: 320px 1fr;
        gap: 30px;
        margin-top: 20px;
        margin-bottom: 60px;
        font-family: 'Amiri', serif;
        direction: rtl;
    }
    
    .ar-main-layout a {
        text-decoration: none;
        color: inherit;
    }
    
    .ar-main-layout a:hover {
        color: var(--secondary);
    }
    
    .ar-text-center { text-align: center; }
    
    .ar-card {
        background-color: var(--light);
        border: 1px solid var(--lightgray);
        border-radius: 8px;
        padding: 30px;
        margin-bottom: 30px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
    }
    
    .ar-card:hover {
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    
    .ar-section-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        margin-bottom: 20px;
        color: var(--secondary);
    }
    
    .ar-section-header h2 {
        font-size: 1.5rem;
        margin: 0;
    }
    
    .ar-decorator-icon {
        font-size: 1.2rem;
        color: var(--tertiary);
    }
    
    .ar-section-title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 25px;
        padding-bottom: 10px;
        border-bottom: 1px dashed var(--lightgray);
    }
    
    .ar-section-title-row h2 {
        font-size: 1.6rem;
        color: var(--dark);
        margin: 0;
    }
    
    .ar-view-all {
        font-size: 1rem;
        color: var(--gray);
    }
    
    /* Quote */
    .ar-quote-of-the-day blockquote {
        font-size: 2.2rem;
        font-weight: 700;
        color: var(--dark);
        margin-bottom: 20px;
        line-height: 1.6;
    }
    
    .ar-author {
        font-size: 1.2rem;
        color: var(--gray);
        margin-bottom: 30px;
    }
    
    .ar-btn {
        font-family: 'Amiri', serif;
        font-size: 1.1rem;
        padding: 8px 24px;
        border-radius: 30px;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: none;
    }
    
    .ar-btn-outline {
        background-color: transparent;
        border: 1px solid var(--lightgray);
        color: var(--gray);
    }
    
    .ar-btn-primary {
        background-color: var(--secondary);
        color: var(--light);
    }
    
    /* Random Quote */
    .ar-random-quote {
        background-color: var(--lightgray);
        border-right: 4px solid var(--secondary);
        border-left: none;
    }
    
    .ar-random-quote blockquote {
        font-size: 1.3rem;
        margin-bottom: 15px;
        color: var(--dark);
    }
    
    /* Grids */
    .ar-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
    .ar-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
    .ar-grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .ar-two-col-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    
    .ar-content-card { padding: 0; display: flex; flex-direction: column; }
    .ar-card-image { height: 160px; background-size: cover; background-position: center; border-bottom: 1px solid var(--lightgray); }
    .ar-card-body { padding: 20px; display: flex; flex-direction: column; flex-grow: 1; }
    .ar-content-card h3 { font-size: 1.2rem; color: var(--dark); margin: 0 0 10px 0; }
    .ar-excerpt { font-size: 1rem; color: var(--gray); margin-bottom: 20px; flex-grow: 1; }
    .ar-card-meta { display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--gray); border-top: 1px solid var(--lightgray); padding-top: 15px; margin-top: auto; }
    .ar-justify-center { justify-content: center; gap: 15px; }
    
    .ar-poem-calligraphy {
        height: 120px;
        background-color: var(--highlight);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2rem;
        color: var(--secondary);
        border-bottom: 1px solid var(--lightgray);
    }
    
    /* Sidebar */
    .ar-sidebar-column .ar-card { padding: 25px; }
    .ar-widget-title { font-size: 1.2rem; color: var(--secondary); margin-bottom: 15px; text-align: center; }
    
    .ar-date-large { font-size: 2rem; font-weight: bold; color: var(--dark); margin-bottom: 5px; }
    .ar-date-hijri { font-size: 1.1rem; color: var(--gray); margin-bottom: 15px; }
    
    .ar-the-word { font-size: 2.5rem; color: var(--dark); margin-bottom: 10px; margin-top: 0; }
    .ar-definition { font-size: 1.1rem; margin-bottom: 10px; }
    .ar-root { font-size: 0.9rem; color: var(--gray); }
    
    .ar-stats-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 15px; }
    .ar-stats-list li { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--lightgray); padding-bottom: 8px; }
    .ar-stat-label { color: var(--gray); }
    .ar-stat-value { font-size: 1.2rem; font-weight: bold; color: var(--dark); }
    
    .ar-guide-me-widget { background-color: var(--secondary); color: var(--light); border: none; }
    .ar-guide-me-widget h3 { color: var(--light); font-size: 1.5rem; margin: 0 0 10px 0; }
    .ar-btn-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
    
    /* Nodes */
    .ar-nodes-container { display: flex; justify-content: center; align-items: center; gap: 15px; padding: 30px 0; flex-wrap: wrap; }
    .ar-node { display: flex; flex-direction: column; align-items: center; gap: 10px; color: var(--dark); }
    .ar-node span { padding: 10px; border: 1px solid var(--lightgray); border-radius: 8px; }
    .ar-connector { width: 30px; height: 2px; background-color: var(--lightgray); }
    
    @media (max-width: 1024px) {
        .ar-main-layout { grid-template-columns: 1fr; }
        .ar-grid-3, .ar-grid-4, .ar-grid-2 { grid-template-columns: repeat(2, 1fr); }
        .ar-two-col-layout { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
        .ar-grid-3, .ar-grid-4, .ar-grid-2 { grid-template-columns: 1fr; }
    }
  `

  return HomeArticlesAr
}) satisfies QuartzComponentConstructor
