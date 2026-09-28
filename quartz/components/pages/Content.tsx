import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { resolveRelative, FullSlug } from "../../util/path"
import { visit } from "unist-util-visit"
import { Root } from "hast"
import { Date as DateComponent, getDate } from "../Date"
import readingTime from "reading-time"

const Content: QuartzComponent = ({ fileData, tree, allFiles, cfg }: QuartzComponentProps) => {
  let processedTree = tree as Root
  const slug = fileData.slug?.toLowerCase() ?? ""
  const isHome =
    slug === "" ||
    slug === "index" ||
    slug === "ar" ||
    slug === "ar/index" ||
    slug === "en" ||
    slug === "en/index"

  if (isHome) {
    return <></>
  }

  const isArticle = !slug.endsWith("index")
  const isPoetry =
    (slug.startsWith("ar/poetry/") || slug.startsWith("poetry/")) && !slug.endsWith("index")
  const isPoetryIndex =
    slug === "ar/poetry/index" ||
    slug === "poetry/index" ||
    slug === "ar/poetry" ||
    slug === "poetry"

  const isMicroIndex =
    slug === "ar/micro/index" ||
    slug === "ar/micro" ||
    slug === "micro/index" ||
    slug === "micro"
  const isMicroSingle =
    (slug.startsWith("ar/micro/") || slug.startsWith("micro/")) && !slug.endsWith("index")

  const isArticlesIndex =
    slug === "ar/articles/index" ||
    slug === "ar/articles" ||
    slug === "post" ||
    slug === "post/index"

  // ── Helper for Kind Icons ──
  const getKindIcon = (kind?: string) => {
    switch ((kind ?? "").trim()) {
      case "كتاب":
        return (
          <svg class="inline-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
          </svg>
        )
      case "رابط":
        return (
          <svg class="inline-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
          </svg>
        )
      case "يوتيوب":
        return (
          <svg class="inline-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2.5 17a24.12 24.12 0 010-10 2 2 0 011.4-1.4 49.56 49.56 0 0116.2 0A2 2 0 0121.5 7a24.12 24.12 0 010 10 2 2 0 01-1.4 1.4 49.55 49.55 0 01-16.2 0A2 2 0 012.5 17"/><path d="m10 15 5-3-5-3z"/>
          </svg>
        )
      case "صور":
        return (
          <svg class="inline-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 00-2.828 0L6 21"/>
          </svg>
        )
      default:
        return (
          <svg class="inline-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2A7 7 0 008 14.7V17h8v-2.3A7 7 0 0012 2z"/>
          </svg>
        )
    }
  }

  // ══════════════════════════════════════════════════════════════
  // 1. SHATHARAT TIMELINE PAGE (شذرات)
  // ══════════════════════════════════════════════════════════════
  if (isMicroIndex) {
    const microPosts = allFiles
      .filter(
        (f) =>
          f.slug &&
          (f.slug.startsWith("ar/micro/") || f.slug.startsWith("micro/")) &&
          !f.slug.endsWith("index"),
      )
      .sort((a, b) => {
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    const kinds = Array.from(new Set(microPosts.map((p) => (p.frontmatter?.kind as string) || "خواطر")))

    return (
      <div class="list-page micro-list-page" dir="rtl">
        <header class="tag-hero tag-hero--plain">
          <span class="tag-hero-scrim"></span>
          <div class="tag-hero-info">
            <h1 class="tag-hero-title">
              <svg class="inline-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2A7 7 0 008 14.7V17h8v-2.3A7 7 0 0012 2z"/>
              </svg>
              شذرات
            </h1>
            <p class="tag-hero-desc">روابط والتقاطات لمحتويات لفتت انتباهي من عالم الانترنت وحياتي اليومية.</p>
            <span class="tag-hero-count">{microPosts.length} شذرة</span>
          </div>
        </header>

        <nav class="topic-filter" aria-label="التصفية حسب الموضوع">
          <button class="topic-chip is-active" data-kind="all">
            كل الشذرات <span class="topic-chip-count">({microPosts.length})</span>
          </button>
          {kinds.map((k) => {
            const count = microPosts.filter((p) => ((p.frontmatter?.kind as string) || "خواطر") === k).length
            return (
              <button class="topic-chip" data-kind={k} key={k}>
                {getKindIcon(k)}
                {k}
                <span class="topic-chip-count">({count})</span>
              </button>
            )
          })}
        </nav>

        <div class="posts-list micro-posts-list micro-timeline">
          {microPosts.map((post) => {
            const kind = (post.frontmatter?.kind as string) || "خواطر"
            const dateObj = getDate(cfg, post)
            const dateFormatted = dateObj
              ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
              : ""
            const thumb = (post.frontmatter?.image ?? post.frontmatter?.cover) as string | undefined
            const link = post.frontmatter?.link as string | undefined

            return (
              <section class="micro-tl-item" data-kind={kind} key={post.slug}>
                <h2 class="micro-tl-date">
                  <a href={resolveRelative(fileData.slug!, post.slug!)}>
                    {getKindIcon(kind)}
                    <span>{dateFormatted}</span>
                  </a>
                </h2>
                <article class="post-card post-card-micro">
                  <div class="micro-card-header">
                    <span class="micro-card-topic" title={kind}>
                      {getKindIcon(kind)}
                    </span>
                    <time class="micro-card-date">
                      <a href={resolveRelative(fileData.slug!, post.slug!)}>{dateFormatted} ←</a>
                    </time>
                  </div>
                  <div class="micro-card-content">
                    {thumb && (
                      <p>
                        <img src={thumb} alt={post.frontmatter?.title ?? ""} loading="lazy" />
                      </p>
                    )}
                    {post.frontmatter?.title && (
                      <h3 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.15rem;">
                        <a href={resolveRelative(fileData.slug!, post.slug!)} style="text-decoration: none; color: inherit;">
                          {post.frontmatter.title}
                        </a>
                      </h3>
                    )}
                    <p>{post.text ?? post.description ?? ""}</p>
                    {link && (
                      <p>
                        <a href={link} target="_blank" rel="noopener noreferrer" class="meta-link">
                          رابط المصدر ↗
                        </a>
                      </p>
                    )}
                  </div>
                </article>
              </section>
            )
          })}
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════
  // 2. SINGLE MICRO POST PAGE (شذرة مفردة)
  // ══════════════════════════════════════════════════════════════
  if (isMicroSingle) {
    const contentJsx = htmlToJsx(fileData.filePath!, processedTree) as ComponentChildren
    const kind = (fileData.frontmatter?.kind as string) || "خاطرة"
    const dateObj = getDate(cfg, fileData)
    const dateFormatted = dateObj
      ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
      : ""
    const link = fileData.frontmatter?.link as string | undefined

    return (
      <div class="micro-single" dir="rtl">
        <div class="mp-tabwrap">
          <div class="mp-tab">
            <time>{dateFormatted}</time>
            <span class="meta-separator">•</span>
            <span class="meta-link">
              {getKindIcon(kind)}
              {kind}
            </span>
          </div>
        </div>
        <article class="post-card post-card-micro mp-card">
          <div class="micro-card-content">
            {fileData.frontmatter?.title && (
              <h2 class="post-single-title" style="margin-bottom: 1rem;">
                {fileData.frontmatter.title}
              </h2>
            )}
            {contentJsx}
            {link && (
              <p style="margin-top: 1.5rem;">
                <a href={link} target="_blank" rel="noopener noreferrer" class="more-posts-link">
                  الانتقال للمصدر الأصلي ↗
                </a>
              </p>
            )}
          </div>
          <div class="micro-navigation">
            <a href={resolveRelative(fileData.slug!, "ar/micro" as FullSlug)} class="nav-link-micro">
              <span class="nav-arrow">←</span>
              <span>العودة لجميع الشذرات</span>
            </a>
          </div>
        </article>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════
  // 3. ARTICLES TIMELINE PAGE (تدوينات)
  // ══════════════════════════════════════════════════════════════
  if (isArticlesIndex) {
    const articles = allFiles
      .filter((f) => f.slug && f.slug.startsWith("ar/articles/") && !f.slug.endsWith("index"))
      .sort((a, b) => {
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    // Group by Month Year
    const groups = new Map<string, typeof articles>()
    for (const a of articles) {
      const d = getDate(cfg, a) ?? new globalThis.Date("1970-01-01")
      const monthYear = d.toLocaleDateString("ar-EG", { month: "long", year: "numeric" })
      if (!groups.has(monthYear)) groups.set(monthYear, [])
      groups.get(monthYear)!.push(a)
    }

    return (
      <div class="list-page post-list-page" dir="rtl">
        <header class="tag-hero tag-hero--plain">
          <span class="tag-hero-scrim"></span>
          <div class="tag-hero-info">
            <h1 class="tag-hero-title">
              <svg class="inline-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 3a2.83 2.83.0 114 4L7.5 20.5 2 22l1.5-5.5z"/>
              </svg>
              تدوينات
            </h1>
            <p class="tag-hero-desc">تأملات وتدوينات عن الحياة والرياضيات والتقنية وأشياء أخرى لفتت انتباهي.</p>
            <span class="tag-hero-count">{articles.length} تدوينة</span>
          </div>
        </header>

        <div class="posts-list post-tl">
          {Array.from(groups.entries()).map(([monthYear, postList]) => (
            <section class="post-tl-item" key={monthYear}>
              <h2 class="post-tl-month">
                <span>{monthYear}</span>
              </h2>
              <div class="post-tl-card">
                <div class="home-listing-body home-listing-body--plain">
                  {postList.map((post) => {
                    const title = post.frontmatter?.title ?? "بدون عنوان"
                    const d = getDate(cfg, post)
                    const dateFormatted = d
                      ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
                      : ""
                    return (
                      <article class="post-item" key={post.slug}>
                        <div class="post-item-title-wrapper">
                          <h3 class="post-item-title">
                            <a href={resolveRelative(fileData.slug!, post.slug!)}>{title}</a>
                          </h3>
                          <div class="post-item-divider"></div>
                        </div>
                        <time class="post-item-date">
                          <a href={resolveRelative(fileData.slug!, post.slug!)}>{dateFormatted}</a>
                        </time>
                      </article>
                    )
                  })}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════
  // 4. POETRY HANDLING (Pipes & Verse Splitting)
  // ══════════════════════════════════════════════════════════════
  if (isPoetry) {
    processedTree = JSON.parse(JSON.stringify(tree))
    visit(processedTree, "element", (node: any) => {
      if (node.tagName === "p") {
        const hasPipe = node.children?.some((c: any) => c.type === "text" && c.value.includes("|"))
        if (hasPipe) {
          const textContent = node.children
            .map((c: any) => {
              if (c.type === "text") return c.value
              if (c.type === "element" && c.tagName === "br") return "\n"
              return ""
            })
            .join("")
          const lines = textContent.split("\n")
          const divChildren = lines
            .map((line: string) => {
              line = line.trim()
              if (!line) return { type: "text", value: "" }
              if (line.includes("|")) {
                const parts = line.split("|")
                return {
                  type: "element",
                  tagName: "div",
                  properties: { className: ["poem-line"] },
                  children: [
                    {
                      type: "element",
                      tagName: "div",
                      properties: { className: ["hemistich", "first"] },
                      children: [{ type: "text", value: parts[0].trim() }],
                    },
                    {
                      type: "element",
                      tagName: "div",
                      properties: { className: ["hemistich", "second"] },
                      children: [{ type: "text", value: parts[1].trim() }],
                    },
                  ],
                }
              }
              return {
                type: "element",
                tagName: "div",
                properties: { className: ["poem-text"] },
                children: [{ type: "text", value: line }],
              }
            })
            .filter((c: any) => c.type !== "text" || c.value !== "")

          node.tagName = "div"
          node.properties = { className: ["poem-container"] }
          node.children = divChildren
        }
      }
    })
  }

  const content = htmlToJsx(fileData.filePath!, processedTree) as ComponentChildren

  // ══════════════════════════════════════════════════════════════
  // 5. POETRY INDEX
  // ══════════════════════════════════════════════════════════════
  if (isPoetryIndex) {
    const poems = allFiles.filter(
      (f) =>
        (f.slug?.toLowerCase().startsWith("ar/poetry/") ||
          f.slug?.toLowerCase().startsWith("poetry/")) &&
        !f.slug.endsWith("index"),
    )
    poems.sort((a, b) => (a.slug! > b.slug! ? 1 : -1))

    return (
      <div class="list-page post-list-page" dir="rtl">
        <header class="tag-hero tag-hero--plain">
          <span class="tag-hero-scrim"></span>
          <div class="tag-hero-info">
            <h1 class="tag-hero-title">
              <svg class="inline-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                <path d="M6 6h10M6 10h10"/>
              </svg>
              ديوان الشعر
            </h1>
            <p class="tag-hero-desc">أكتب الشعر العربي العمودي أحيانًا، وأبصر فيه دوحًا من الجمال والأنس.</p>
            <span class="tag-hero-count">{poems.length} قصيدة</span>
          </div>
        </header>

        <div class="post-tl-card">
          <div class="home-listing-body home-listing-body--plain">
            {poems.map((poem) => {
              const poemTitle =
                poem.frontmatter?.title ||
                poem.slug!.split("/").pop()?.replace(/_/g, " ") ||
                "بلا عنوان"
              const d = getDate(cfg, poem)
              const dateFormatted = d
                ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
                : ""
              return (
                <article class="post-item" key={poem.slug}>
                  <div class="post-item-title-wrapper">
                    <h3 class="post-item-title">
                      <a href={resolveRelative(fileData.slug!, poem.slug!)}>{poemTitle}</a>
                    </h3>
                    <div class="post-item-divider"></div>
                  </div>
                  <time class="post-item-date">
                    <a href={resolveRelative(fileData.slug!, poem.slug!)}>{dateFormatted}</a>
                  </time>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════
  // 6. SINGLE POEM PAGE
  // ══════════════════════════════════════════════════════════════
  if (isPoetry) {
    const uniquePoems = Array.from(
      new Map(
        allFiles
          .filter(
            (f) =>
              (f.slug?.toLowerCase().startsWith("ar/poetry/") ||
                f.slug?.toLowerCase().startsWith("poetry/")) &&
              !f.slug.endsWith("index"),
          )
          .map((item) => [item.slug, item]),
      ).values(),
    )
    uniquePoems.sort((a, b) => (a.slug! > b.slug! ? 1 : -1))

    const currentIndex = uniquePoems.findIndex((f) => f.slug === fileData.slug)
    const prevPoem = currentIndex > 0 ? uniquePoems[currentIndex - 1] : null
    const nextPoem = currentIndex < uniquePoems.length - 1 ? uniquePoems[currentIndex + 1] : null
    const poemTitle = fileData.frontmatter?.title || ""

    return (
      <div class="post-single-card" dir="rtl">
        <div class="post-single-body">
          <div class="post-single-head">
            <h1 class="post-single-title">{poemTitle}</h1>
            <div class="post-single-meta">
              <span>حامد الخطيب</span>
              <span class="meta-sep">•</span>
              <span>شعر عمودي</span>
            </div>
          </div>
          <div class="post-content">{content}</div>
          <div class="post-navigation">
            {prevPoem ? (
              <a href={resolveRelative(fileData.slug!, prevPoem.slug!)} class="nav-previous">
                <span class="nav-label">القصيدة السابقة</span>
                <span class="nav-title">{prevPoem.frontmatter?.title || "السابقة"}</span>
              </a>
            ) : <span />}
            {nextPoem ? (
              <a href={resolveRelative(fileData.slug!, nextPoem.slug!)} class="nav-next">
                <span class="nav-label">القصيدة التالية</span>
                <span class="nav-title">{nextPoem.frontmatter?.title || "التالية"}</span>
              </a>
            ) : <span />}
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════
  // 7. REGULAR ARTICLE PAGE (Neo-Brutalist Post Single Card)
  // ══════════════════════════════════════════════════════════════
  if (isArticle) {
    const isAr = slug.startsWith("ar/") || fileData.frontmatter?.lang === "ar"
    const dir = isAr ? "rtl" : "ltr"
    const title = fileData.frontmatter?.title ?? ""
    const dateObj = getDate(cfg, fileData)
    const dateStr = dateObj
      ? isAr
        ? dateObj.toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" })
        : dateObj.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
      : ""

    let minutesStr = ""
    if (fileData.text) {
      const { minutes } = readingTime(fileData.text)
      minutesStr = isAr ? `${Math.ceil(minutes)} دقائق قراءة` : `${Math.ceil(minutes)} min read`
    }
    const tags = (fileData.frontmatter?.tags as string[]) ?? []

    return (
      <div class="post-single-card" dir={dir}>
        <div class="post-single-body">
          <div class="post-single-head">
            <h1 class="post-single-title">{title}</h1>
            <div class="post-accent-bar"></div>
            <div class="post-single-meta">
              {dateStr && <span>{dateStr}</span>}
              {dateStr && minutesStr && <span class="meta-sep">•</span>}
              {minutesStr && <span>{minutesStr}</span>}
            </div>
          </div>
          <div class="post-content">{content}</div>
          {tags.length > 0 && (
            <div class="post-single-tags tags-grid" style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px dashed var(--nb-line)" }}>
              {tags.map((t) => (
                <a href={resolveRelative(fileData.slug!, `tags/${t}` as FullSlug)} class="tag-item">
                  #{t}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  return <article class="page-content">{content}</article>
}

export default (() => Content) satisfies QuartzComponentConstructor
