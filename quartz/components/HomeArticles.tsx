import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { Date as DateComponent, getDate } from "./Date"

export default (() => {
  const HomeArticles: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, allFiles, cfg } = props
    if (fileData.slug !== "en" && fileData.slug !== "en/index") return null

    // English pages
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
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    const latestWritings = englishPages.slice(0, 8)

    // English tags
    const tagCounts = new Map<string, number>()
    for (const page of englishPages) {
      const tags = page.frontmatter?.tags ?? []
      for (const t of tags) {
        if (!t) continue
        tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
      }
    }
    const topTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)

    // Categories
    const categories = [
      { name: "Experiences", desc: "Reflections on software, building tools, and workflows", slug: "Experiences" },
      { name: "Engineering", desc: "Engineering problem solving, systems, and structures", slug: "Engineering" },
      { name: "Math", desc: "Mathematical explorations and foundations", slug: "Math" },
      { name: "Culture", desc: "Books, reading, and intellectual notes", slug: "Culture" },
    ]

    return (
      <div class="home-page" dir="ltr">
        <h1 class="sr-only">Hamed Alkhateeb — Personal writings, notes, and technical explorations.</h1>

        {/* ═══════════════ Section 1: Latest Writings ═══════════════ */}
        {latestWritings.length > 0 && (
          <section class="home-section">
            <div class="home-listing">
              <div class="home-listing-head">
                <h2 class="home-listing-title">
                  <a href={resolveRelative(fileData.slug!, "Experiences" as any)}>
                    <svg class="inline-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M17 3a2.83 2.83.0 114 4L7.5 20.5 2 22l1.5-5.5z"/>
                    </svg>
                    Latest Writings
                  </a>
                </h2>
                <a class="home-listing-all" href={resolveRelative(fileData.slug!, "Experiences" as any)}>All ←</a>
              </div>
              <div class="home-listing-body home-listing-body--plain">
                {latestWritings.map((article) => {
                  const title = article.frontmatter?.title ?? "Untitled"
                  const dateObj = getDate(cfg, article)
                  const dateFormatted = dateObj
                    ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
                    : ""
                  return (
                    <article class="post-item" key={article.slug}>
                      <div class="post-item-title-wrapper">
                        <h3 class="post-item-title">
                          <a href={resolveRelative(fileData.slug!, article.slug!)}>{title}</a>
                        </h3>
                        <div class="post-item-divider"></div>
                      </div>
                      <time class="post-item-date">
                        <a href={resolveRelative(fileData.slug!, article.slug!)}>{dateFormatted}</a>
                      </time>
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════ Section 2: Areas & Topics ═══════════════ */}
        <section class="home-section">
          <div class="home-tags-head">
            <h2 class="home-listing-title">
              <svg class="inline-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
              </svg>
              Taxonomy & Fields
            </h2>
          </div>
          <div class="tags-grid">
            {categories.map((cat) => (
              <a href={resolveRelative(fileData.slug!, cat.slug as any)} class="tags-grid-card" key={cat.slug}>
                <div class="tags-grid-fallback" style={{ background: "linear-gradient(135deg, var(--color-surface-sunken) 0%, var(--nb-main) 100%)" }}></div>
                <span class="tags-grid-scrim"></span>
                <span class="tags-grid-label">
                  <span class="tags-grid-name">{cat.name}</span>
                  <span class="tags-grid-count">{cat.desc}</span>
                </span>
              </a>
            ))}
          </div>
        </section>

        {/* ═══════════════ Section 3: Tags ═══════════════ */}
        {topTags.length > 0 && (
          <section class="home-section">
            <div class="home-tags-head">
              <h2 class="home-listing-title">
                <a href={resolveRelative(fileData.slug!, "tags" as any)}>
                  <svg class="inline-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12.586 2.586A2 2 0 0011.172 2H4A2 2 0 002 4v7.172a2 2 0 00.586 1.414l8.704 8.704a2.426 2.426.0 003.42.0l6.58-6.58a2.426 2.426.0 000-3.42z"/>
                    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>
                  </svg>
                  Tags
                </a>
              </h2>
              <a class="home-listing-all" href={resolveRelative(fileData.slug!, "tags" as any)}>All ←</a>
            </div>
            <div class="tags-grid">
              {topTags.map(([tag, count]) => (
                <a href={resolveRelative(fileData.slug!, `tags/${tag}` as any)} class="tags-grid-card" key={tag}>
                  <div class="tags-grid-fallback" style={{ background: "linear-gradient(135deg, var(--color-surface-sunken) 0%, var(--nb-main) 100%)" }}></div>
                  <span class="tags-grid-scrim"></span>
                  <span class="tags-grid-label">
                    <span class="tags-grid-name">{tag.replace(/_/g, " ")}</span>
                    <span class="tags-grid-count">{count}</span>
                  </span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════ About the Author ═══════════════ */}
        <section class="home-section">
          <div class="about-card">
            <div class="about-body">
              <h3 class="about-name">Hamed Alkhateeb</h3>
              <p class="about-tagline">Civil engineer turned software & mathematics enthusiast. Documenting ideas, code experiments, and essays.</p>
              <div class="about-social">
                <a href="https://x.com/HamedAlkhateeb5" target="_blank" rel="noopener noreferrer" class="site-social" aria-label="X">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/hamed-al-khateeb-756661302/" target="_blank" rel="noopener noreferrer" class="site-social" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                <a href="/index.xml" class="site-social" aria-label="RSS">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 11a9 9 0 019 9"/><path d="M4 4a16 16 0 0116 16"/><circle cx="5" cy="19" r="1"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return HomeArticles
}) satisfies QuartzComponentConstructor
