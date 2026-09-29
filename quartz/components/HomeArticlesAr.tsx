import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { getDate } from "./Date"

export default (() => {
  const HomeArticlesAr: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, allFiles, cfg } = props
    const slug = (fileData.slug ?? "").toLowerCase()
    const isRootOrAr =
      slug === "index" ||
      slug === "" ||
      slug === "ar/index" ||
      slug === "ar" ||
      slug === "ar/"
    if (!isRootOrAr) return null

    // 1. Articles (تدوينات)
    const arabicArticles = allFiles
      .filter(
        (page) =>
          page.slug &&
          (page.slug.startsWith("ar/articles/") || page.slug.startsWith("articles/")) &&
          !page.slug.endsWith("/index"),
      )
      .sort((a, b) => {
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    // 2. Micro posts (شذرات)
    const arabicMicro = allFiles
      .filter(
        (page) =>
          page.slug &&
          (page.slug.startsWith("ar/micro/") || page.slug.startsWith("micro/")) &&
          !page.slug.endsWith("/index"),
      )
      .sort((a, b) => {
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    // 3. Poems (شعر)
    const arabicPoems = allFiles
      .filter(
        (page) =>
          page.slug &&
          page.slug.startsWith("ar/poetry/") &&
          !page.slug.endsWith("/index"),
      )
      .sort((a, b) => {
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    const latestArticles = arabicArticles.slice(0, 10)
    const latestMicro = arabicMicro.slice(0, 8)
    const latestPoems = arabicPoems.slice(0, 6)

    // 4. Arabic tags
    const tagCounts = new Map<string, number>()
    for (const page of allFiles) {
      if (
        !page.slug ||
        (!page.slug.startsWith("ar/articles/") && !page.slug.startsWith("ar/micro/"))
      )
        continue
      const tags = page.frontmatter?.tags ?? []
      for (const t of tags) {
        if (!t) continue
        tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1)
      }
    }
    const topTags = Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)

    // Helper for kind icons
    const getKindMeta = (item: any) => {
      const kind = (item.frontmatter?.kind as string) || "خاطرة"
      let icon = "💡"
      if (kind.includes("كتاب")) icon = "📖"
      else if (kind.includes("رابط")) icon = "🔗"
      else if (kind.includes("فيديو") || kind.includes("يوتيوب")) icon = "📺"
      else if (kind.includes("صورة") || kind.includes("صور")) icon = "🖼️"

      // Relative or formatted date
      const dateObj = getDate(cfg, item)
      const dateStr = dateObj
        ? dateObj.toLocaleDateString("ar-EG", { month: "short", day: "numeric" })
        : ""

      return { icon, label: `${kind} · ${dateStr}` }
    }

    return (
      <div class="alfarhan-home-container" dir="rtl">
        <h1 class="sr-only">مدونة حامد الخطيب — شذرات، تدوينات، وتأملات</h1>

        {/* ═══════════════ البطاقة الأولى: شذرات (Micro-posts) ═══════════════ */}
        {latestMicro.length > 0 && (
          <section class="alfarhan-card-box shatharat-box">
            <div class="alfarhan-card-banner">
              <div class="alfarhan-banner-right">
                <span class="alfarhan-icon-badge">💡</span>
                <span class="alfarhan-banner-title">شذرات</span>
              </div>
              <a
                href={resolveRelative(fileData.slug!, "ar/micro" as any)}
                class="alfarhan-btn-all"
              >
                الكل —
              </a>
            </div>

            <div class="alfarhan-card-content shatharat-content">
              <div class="shatharat-timeline-track">
                {latestMicro.map((item) => {
                  const meta = getKindMeta(item)
                  const thumb = (item.frontmatter?.image ?? item.frontmatter?.cover) as
                    | string
                    | undefined
                  const text = item.text ?? item.description ?? ""
                  const cleanText = text.replace(/^[#>\s-]+/gm, "").trim().slice(0, 220)

                  return (
                    <article class="shatharat-timeline-row" key={item.slug}>
                      <span class="timeline-dot" />
                      <div class="shatharat-body">
                        <div class="shatharat-meta">
                          <span class="meta-icon">{meta.icon}</span>
                          <span class="meta-text">{meta.label}</span>
                        </div>
                        <a
                          href={resolveRelative(fileData.slug!, item.slug!)}
                          class="shatharat-text-link"
                        >
                          <p class="shatharat-excerpt">{cleanText} ...</p>
                        </a>
                      </div>
                      {thumb && (
                        <a
                          href={resolveRelative(fileData.slug!, item.slug!)}
                          class="shatharat-thumb-wrap"
                        >
                          <img
                            src={thumb}
                            alt={item.frontmatter?.title ?? ""}
                            class="shatharat-thumb-img"
                            loading="lazy"
                          />
                        </a>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════ البطاقة الثانية: تدوينات (Articles) ═══════════════ */}
        {latestArticles.length > 0 && (
          <section class="alfarhan-card-box tadwinat-box">
            <div class="alfarhan-card-banner">
              <div class="alfarhan-banner-right">
                <span class="alfarhan-icon-badge">🖊️</span>
                <span class="alfarhan-banner-title">تدوينات</span>
              </div>
              <a
                href={resolveRelative(fileData.slug!, "ar/articles" as any)}
                class="alfarhan-btn-all"
              >
                الكل —
              </a>
            </div>

            <div class="alfarhan-card-content tadwinat-content">
              <div class="tadwinat-list">
                {latestArticles.map((article) => {
                  const title = article.frontmatter?.title ?? "بدون عنوان"
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

        {/* ═══════════════ البطاقة الثالثة: ديوان الشعر ═══════════════ */}
        {latestPoems.length > 0 && (
          <section class="alfarhan-card-box poetry-box">
            <div class="alfarhan-card-banner">
              <div class="alfarhan-banner-right">
                <span class="alfarhan-icon-badge">📜</span>
                <span class="alfarhan-banner-title">ديوان الشعر</span>
              </div>
              <a
                href={resolveRelative(fileData.slug!, "ar/poetry" as any)}
                class="alfarhan-btn-all"
              >
                الكل —
              </a>
            </div>

            <div class="alfarhan-card-content tadwinat-content">
              <div class="tadwinat-list">
                {latestPoems.map((poem) => {
                  const title = poem.frontmatter?.title ?? "قصيدة"
                  return (
                    <div class="tadwinat-item" key={poem.slug}>
                      <a
                        href={resolveRelative(fileData.slug!, poem.slug!)}
                        class="tadwinat-title-link"
                      >
                        {title}
                      </a>
                      <span class="tadwinat-dots" />
                      <span class="tadwinat-tag">شعر</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════ البطاقة الرابعة: وسوم (Tags) ═══════════════ */}
        {topTags.length > 0 && (
          <section class="alfarhan-card-box tags-box">
            <div class="alfarhan-card-banner">
              <div class="alfarhan-banner-right">
                <span class="alfarhan-icon-badge">🏷️</span>
                <span class="alfarhan-banner-title">وسوم</span>
              </div>
              <a
                href={resolveRelative(fileData.slug!, "tags" as any)}
                class="alfarhan-btn-all"
              >
                كل الوسوم —
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
      </div>
    )
  }

  return HomeArticlesAr
}) satisfies QuartzComponentConstructor
