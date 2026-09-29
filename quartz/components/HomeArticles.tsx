import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { getDate } from "./Date"

export default (() => {
  const HomeArticles: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, allFiles, cfg } = props
    const slug = (fileData.slug ?? "").toLowerCase()
    if (slug !== "en" && slug !== "en/index") return null

    // English pages (excluding indexes and Arabic paths)
    const englishPages = allFiles
      .filter(
        (page) =>
          page.slug &&
          page.slug !== "index" &&
          page.slug !== "en" &&
          !page.slug.endsWith("/index") &&
          !page.slug.startsWith("tags/") &&
          !page.slug.toLowerCase().startsWith("ar/"),
      )
      .sort((a, b) => {
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    const latestWritings = englishPages.slice(0, 10)

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
      .slice(0, 8)

    // Categories
    const categories = [
      {
        icon: "💡",
        name: "Experiences",
        desc: "Reflections on software, building tools, and workflows",
        slug: "Experiences",
      },
      {
        icon: "🏗️",
        name: "Engineering",
        desc: "Engineering problem solving, systems, and structures",
        slug: "Engineering",
      },
      {
        icon: "📐",
        name: "Math",
        desc: "Mathematical explorations and foundations",
        slug: "Math",
      },
      {
        icon: "🌍",
        name: "Culture",
        desc: "Books, reading, and intellectual notes",
        slug: "Culture",
      },
    ]

    return (
      <div class="alfarhan-home-container" dir="ltr">
        <h1 class="sr-only">Hamed Alkhateeb — Seeking Clarity and Understanding</h1>

        {/* ═══════════════ Card 1: Latest Writings ═══════════════ */}
        {latestWritings.length > 0 && (
          <section class="alfarhan-card-box tadwinat-box">
            <div class="alfarhan-card-banner">
              <a
                href={resolveRelative(fileData.slug!, "Experiences" as any)}
                class="alfarhan-banner-right-link"
              >
                <span class="alfarhan-icon-badge">🖊️</span>
                <span class="alfarhan-banner-title">Writings</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "Experiences" as any)}
                class="alfarhan-btn-all"
              >
                All →
              </a>
            </div>

            <div class="alfarhan-card-content tadwinat-content">
              <div class="tadwinat-list">
                {latestWritings.map((article) => {
                  const title = article.frontmatter?.title ?? "Untitled"
                  const dateObj = getDate(cfg, article)
                  const dateFormatted = dateObj
                    ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
                    : ""
                  return (
                    <div class="tadwinat-item" key={article.slug}>
                      <a
                        href={resolveRelative(fileData.slug!, article.slug!)}
                        class="tadwinat-title-link"
                      >
                        {title}
                      </a>
                      <span class="tadwinat-dots" />
                      <time class="tadwinat-date">{dateFormatted}</time>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════ Card 2: Taxonomy & Areas ═══════════════ */}
        <section class="alfarhan-card-box taxonomy-box">
          <div class="alfarhan-card-banner">
            <div class="alfarhan-banner-right">
              <span class="alfarhan-icon-badge">🧭</span>
              <span class="alfarhan-banner-title">Topics & Areas</span>
            </div>
            <span class="alfarhan-btn-all" style={{ cursor: "default" }}>
              {categories.length} Fields
            </span>
          </div>

          <div class="alfarhan-card-content" style={{ padding: "18px 20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "14px",
              }}
            >
              {categories.map((cat) => (
                <a
                  href={resolveRelative(fileData.slug!, cat.slug as any)}
                  key={cat.slug}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    padding: "12px 14px",
                    background: "var(--color-field, #fdfbf7)",
                    border: "1.5px solid var(--nb-line, #000)",
                    boxShadow: "2px 2px 0 0 var(--nb-line, #000)",
                    borderRadius: "6px",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translate(-1px, -1px)"
                    e.currentTarget.style.boxShadow = "3px 3px 0 0 var(--nb-line, #000)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "none"
                    e.currentTarget.style.boxShadow = "2px 2px 0 0 var(--nb-line, #000)"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "1.1rem" }}>{cat.icon}</span>
                    <strong style={{ fontSize: "1rem" }}>{cat.name}</strong>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-ink-muted, #6b665f)", lineHeight: 1.5 }}>
                    {cat.desc}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ Card 3: Tags ═══════════════ */}
        {topTags.length > 0 && (
          <section class="alfarhan-card-box tags-box">
            <div class="alfarhan-card-banner">
              <a
                href={resolveRelative(fileData.slug!, "tags" as any)}
                class="alfarhan-banner-right-link"
              >
                <span class="alfarhan-icon-badge">🏷️</span>
                <span class="alfarhan-banner-title">Tags</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "tags" as any)}
                class="alfarhan-btn-all"
              >
                All Tags →
              </a>
            </div>

            <div class="alfarhan-card-content" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {topTags.map(([tag, count]) => (
                  <a
                    href={resolveRelative(fileData.slug!, `tags/${tag}` as any)}
                    key={tag}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "4px 10px",
                      background: "var(--color-field, #fdfbf7)",
                      border: "1.5px solid var(--nb-line, #000)",
                      boxShadow: "1.5px 1.5px 0 0 var(--nb-line, #000)",
                      borderRadius: "4px",
                      fontSize: "0.86rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      color: "inherit",
                    }}
                  >
                    <span>#{tag.replace(/_/g, " ")}</span>
                    <span
                      style={{
                        background: "var(--nb-main, #f6c445)",
                        color: "#000",
                        padding: "1px 6px",
                        borderRadius: "10px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {count}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════ Card 4: About the Author ═══════════════ */}
        <section class="alfarhan-card-box about-box">
          <div class="alfarhan-card-banner">
            <a
              href={resolveRelative(fileData.slug!, "About" as any)}
              class="alfarhan-banner-right-link"
            >
              <span class="alfarhan-icon-badge">👤</span>
              <span class="alfarhan-banner-title">About</span>
            </a>
            <a
              href={resolveRelative(fileData.slug!, "About" as any)}
              class="alfarhan-btn-all"
            >
              Read More →
            </a>
          </div>

          <div class="alfarhan-card-content" style={{ padding: "20px 24px" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "1.15rem", fontWeight: 800 }}>
              Hamed Alkhateeb
            </h3>
            <p style={{ margin: "0 0 16px 0", fontSize: "0.95rem", lineHeight: 1.6, color: "var(--color-ink-muted, #6b665f)" }}>
              Product Manager & Applied Math Researcher. Documenting ideas, code experiments, and essays.
            </p>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <a
                href="https://x.com/HamedAlkhateeb5"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 10px",
                  background: "var(--color-field, #fdfbf7)",
                  border: "1.5px solid var(--nb-line, #000)",
                  boxShadow: "1.5px 1.5px 0 0 var(--nb-line, #000)",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.005 4.15H5.059z" />
                </svg>
                <span>X (Twitter)</span>
              </a>

              <a
                href="https://www.linkedin.com/in/hamed-al-khateeb-756661302/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 10px",
                  background: "var(--color-field, #fdfbf7)",
                  border: "1.5px solid var(--nb-line, #000)",
                  boxShadow: "1.5px 1.5px 0 0 var(--nb-line, #000)",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </a>

              <a
                href="/index.xml"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "5px 10px",
                  background: "var(--color-field, #fdfbf7)",
                  border: "1.5px solid var(--nb-line, #000)",
                  boxShadow: "1.5px 1.5px 0 0 var(--nb-line, #000)",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415c1.814 0 3.293 1.479 3.293 3.295 0 1.813-1.485 3.29-3.301 3.29C1.467 24 0 22.526 0 20.71s1.476-3.294 3.291-3.295zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z" />
                </svg>
                <span>RSS</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return HomeArticles
}) satisfies QuartzComponentConstructor
