import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { Date, getDate } from "./Date"
import readingTime from "reading-time"
import { i18n } from "../i18n"

export default (() => {
  const HomeArticles: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, allFiles, cfg } = props
    if (fileData.slug !== "index") return null

    // Filter out index pages, tags, and Arabic section pages for the English homepage
    const englishPages = allFiles
      .filter(
        (page) =>
          page.slug &&
          page.slug !== "index" &&
          !page.slug.endsWith("/index") &&
          !page.slug.startsWith("tags/") &&
          !page.slug.toLowerCase().startsWith("ar/"),
      )
      .sort((a, b) => {
        const aPinned = a.frontmatter?.pinned ? 1 : 0
        const bPinned = b.frontmatter?.pinned ? 1 : 0
        if (aPinned !== bPinned) {
          return bPinned - aPinned
        }
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    // Separate featured (pinned or top) from general recent
    const featuredPages = englishPages.filter((p) => p.frontmatter?.pinned === true)
    const displayFeatured =
      featuredPages.length > 0 ? featuredPages.slice(0, 3) : englishPages.slice(0, 2)
    const recentPages = englishPages.filter((p) => !displayFeatured.includes(p)).slice(0, 3)

    return (
      <div class="homepage-container">
        {/* Hero Section */}
        <section class="homepage-hero">
          <h1 class="hero-title">Hamed</h1>
          <p class="hero-subtitle">Structural Engineer & Applied Mathematician</p>
        </section>

        {/* Short Introduction */}
        <section class="homepage-intro">
          <p>
            Welcome to my digital garden. I am Hamed, a structural engineer from Egypt, currently
            pursuing a Master's degree in Applied Mathematics. This space is an intellectual
            playground where I explore thoughts, document my learning process, and share insights
            across disciplines—from mathematical analysis and structural design to cultural
            observations.
          </p>
        </section>

        {/* Featured Writings */}
        {displayFeatured.length > 0 && (
          <section class="homepage-section">
            <h2 class="section-title">Featured Writings</h2>
            <ul class="featured-list">
              {displayFeatured.map((page) => {
                const title = page.frontmatter?.title ?? "Untitled"
                const desc = page.frontmatter?.description ?? page.description ?? ""
                let readingStr = ""
                if (page.text) {
                  const { minutes } = readingTime(page.text)
                  readingStr = i18n(cfg.locale).components.contentMeta.readingTime({
                    minutes: Math.ceil(minutes),
                  })
                }

                return (
                  <li class="featured-item" key={page.slug}>
                    <a
                      href={resolveRelative(fileData.slug!, page.slug!)}
                      class="featured-link internal"
                    >
                      {title}
                    </a>
                    {desc && <p class="featured-desc">{desc}</p>}
                    <p class="featured-meta">
                      {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
                      {readingStr && (
                        <span>
                          <span class="meta-dot"> • </span>
                          {readingStr}
                        </span>
                      )}
                    </p>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* Main Categories */}
        <section class="homepage-section">
          <h2 class="section-title">Main Categories</h2>
          <div class="categories-grid">
            <a
              href={resolveRelative(fileData.slug!, "Math" as FullSlug)}
              class="category-pill internal"
            >
              📐 Mathematics
            </a>
            <a
              href={resolveRelative(fileData.slug!, "Engineering" as FullSlug)}
              class="category-pill internal"
            >
              🏗️ Engineering
            </a>
            <a
              href={resolveRelative(fileData.slug!, "Culture" as FullSlug)}
              class="category-pill internal"
            >
              🌍 Culture
            </a>
            <a
              href={resolveRelative(fileData.slug!, "Experiences" as FullSlug)}
              class="category-pill internal"
            >
              💡 Experiences
            </a>
            <a
              href={resolveRelative(fileData.slug!, "ar/poetry" as FullSlug)}
              class="category-pill internal"
            >
              📜 Poetry
            </a>
            <a
              href={resolveRelative(fileData.slug!, "About" as FullSlug)}
              class="category-pill internal"
            >
              ℹ️ About Me
            </a>
          </div>
        </section>

        {/* Recent Posts */}
        {recentPages.length > 0 && (
          <section class="homepage-section">
            <h2 class="section-title">Recent Notes</h2>
            <ul class="recent-list">
              {recentPages.map((page) => {
                const title = page.frontmatter?.title ?? "Untitled"
                return (
                  <li class="recent-item" key={page.slug}>
                    <span class="recent-date">
                      {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
                    </span>
                    <a
                      href={resolveRelative(fileData.slug!, page.slug!)}
                      class="recent-link internal"
                    >
                      {title}
                    </a>
                  </li>
                )
              })}
            </ul>
          </section>
        )}

        {/* Arabic Publication Portal Banner */}
        <section class="arabic-portal-section">
          <div class="arabic-portal-card">
            <div class="portal-ornament">❊</div>
            <div class="portal-content">
              <h3 class="portal-title">القسم العربي (Arabic Section)</h3>
              <p class="portal-description">
                أهلاً بك في الفناء العربي الرقمي الخاص بي. هنا أدون خواطري، أشعاري، ومقالات في
                الرياضيات، الفلسفة، والهندسة.
              </p>
              <a
                href={resolveRelative(fileData.slug!, "ar" as FullSlug)}
                class="portal-button internal"
              >
                دخول المجلة العربية ←
              </a>
            </div>
          </div>
        </section>
      </div>
    )
  }

  HomeArticles.css = `
  .homepage-container {
    max-width: 800px;
    margin: 2rem auto;
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .homepage-hero {
    text-align: center;
    border-bottom: 1px dashed var(--lightgray);
    padding-bottom: 2rem;
  }

  .hero-title {
    font-size: 3.5rem !important;
    font-weight: 800;
    margin: 0 0 0.5rem 0 !important;
    font-family: var(--headerFont);
    color: var(--dark);
  }

  .hero-subtitle {
    font-size: 1.2rem;
    color: var(--gray);
    font-style: italic;
    margin: 0;
    font-family: var(--headerFont);
  }

  .homepage-intro {
    font-size: 1.1rem;
    line-height: 1.8 !important;
    color: var(--darkgray);
    text-align: justify;
  }

  .homepage-section {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  .section-title {
    font-size: 1.4rem !important;
    font-weight: 700;
    margin: 0 !important;
    border-bottom: 1px dashed var(--lightgray);
    padding-bottom: 0.5rem;
    color: var(--secondary);
    font-family: var(--headerFont);
  }

  .featured-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .featured-item {
    padding-bottom: 1rem;
    border-bottom: 1px dashed var(--lightgray);
  }

  .featured-item:last-child {
    border-bottom: none;
  }

  .featured-link {
    font-size: 1.3rem;
    font-weight: 600;
    text-decoration: none;
    color: var(--dark);
  }

  .featured-link:hover {
    color: var(--secondary);
    text-decoration: underline;
  }

  .featured-desc {
    color: var(--gray);
    font-size: 0.95rem;
    margin: 0.4rem 0 0.5rem 0;
    line-height: 1.5 !important;
  }

  .featured-meta, .recent-date {
    font-size: 0.85rem;
    color: var(--gray);
    margin: 0;
  }

  .meta-dot {
    margin: 0 0.3rem;
  }

  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
    width: 100%;
  }

  .category-pill {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.8rem 1rem;
    background: var(--lightgray);
    border-radius: 8px;
    font-size: 0.95rem;
    color: var(--darkgray);
    text-decoration: none !important;
    transition: all 0.2s ease;
    font-weight: 600;
    text-align: center;
    border: 1px solid transparent;
  }

  .category-pill:hover {
    background: var(--highlight);
    color: var(--secondary);
    border-color: var(--gray);
  }

  .recent-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .recent-item {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .recent-link {
    font-size: 1.1rem;
    text-decoration: none;
    color: var(--dark);
    font-weight: 500;
  }

  .recent-link:hover {
    color: var(--secondary);
    text-decoration: underline;
  }

  /* Arabic publication portal gate */
  .arabic-portal-section {
    margin-top: 1rem;
  }

  .arabic-portal-card {
    background: #fcfaf2;
    border: 1px dashed #6c764a;
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    box-shadow: 0 4px 12px rgba(108, 118, 74, 0.03);
  }

  .portal-ornament {
    font-size: 1.5rem;
    color: #6c764a;
    margin-bottom: 0.5rem;
  }

  .portal-title {
    font-family: "Noto Sans Arabic", sans-serif;
    color: #6c764a !important;
    font-size: 1.4rem !important;
    margin: 0 0 0.8rem 0 !important;
  }

  .portal-description {
    font-family: "Amiri", serif;
    color: #4a4640;
    font-size: 1.1rem;
    max-width: 550px;
    margin: 0 auto 1.5rem auto;
    line-height: 1.8 !important;
    direction: rtl;
  }

  .portal-button {
    display: inline-block;
    padding: 0.6rem 2rem;
    background: #6c764a;
    color: #fff !important;
    text-decoration: none !important;
    border-radius: 20px;
    font-weight: 600;
    font-size: 1rem;
    transition: background 0.2s ease;
    font-family: "Noto Sans Arabic", sans-serif;
  }

  .portal-button:hover {
    background: #565e3b;
  }

  @media (max-width: 600px) {
    .homepage-container {
      gap: 2rem;
      margin: 1rem auto;
    }
    .hero-title {
      font-size: 2.5rem !important;
    }
    .categories-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    .recent-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
      border-bottom: 1px dashed var(--lightgray);
      padding-bottom: 0.6rem;
      width: 100%;
    }
    .recent-item:last-child {
      border-bottom: none;
    }
  }
  `

  return HomeArticles
}) satisfies QuartzComponentConstructor
