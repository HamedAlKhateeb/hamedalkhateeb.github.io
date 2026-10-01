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
    slug === "micro" ||
    slug === "en/micro/index" ||
    slug === "en/micro"
  const isMicroSingle =
    (slug.startsWith("ar/micro/") || slug.startsWith("micro/") || slug.startsWith("en/micro/")) &&
    !slug.endsWith("index")
  // Complete AR/EN separation: English snippets live under en/micro with LTR English UI
  const isEnMicro = slug.startsWith("en/micro")
  const microIsRtl = !isEnMicro
  const microHomeSlug = (isEnMicro ? "en/micro" : "ar/micro") as FullSlug
  const microDefaultKind = isEnMicro ? "Snippet" : "خواطر"

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

  // ── Helper for Kind Emojis / Icons ──
  const getKindEmojiOrIcon = (kind?: string) => {
    const k = (kind ?? "").trim()
    if (k === "يوتيوب" || k === "فيديو") return "🎥"
    if (k === "كتاب" || k === "قراءة") return "📖"
    if (k === "رابط") return "🔗"
    if (k === "صور" || k === "صورة") return "🖼️"
    if (k === "صوت" || k === "بودكاست") return "🎙️"
    return "💡"
  }

  // ══════════════════════════════════════════════════════════════
  // 1. SHATHARAT TIMELINE PAGE (شذرات)
  // ══════════════════════════════════════════════════════════════
  if (isMicroIndex) {
    const microPosts = allFiles
      .filter(
        (f) =>
          f.slug &&
          !f.slug.endsWith("index") &&
          (isEnMicro
            ? f.slug.startsWith("en/micro/")
            : f.slug.startsWith("ar/micro/") || f.slug.startsWith("micro/")),
      )
      .sort((a, b) => {
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    const kinds = Array.from(
      new Set(microPosts.map((p) => (p.frontmatter?.kind as string) || microDefaultKind)),
    )
    const microCountLabel = isEnMicro
      ? `(${microPosts.length} snippet${microPosts.length === 1 ? "" : "s"})`
      : `(${microPosts.length} شذرة)`

    return (
      <div class="post-timeline-page shadhra-timeline-page" dir={microIsRtl ? "rtl" : "ltr"}>
        <header class="post-timeline-header">
          <h1>{isEnMicro ? "📍 Snippets" : "📍 شذرات"}</h1>
          <p>
            {isEnMicro
              ? `Links, captures and reflections that caught my attention ${microCountLabel}`
              : `روابط والتقاطات وتأملات لمحتويات لفتت انتباهي من عالم الإنترنت والحياة اليومية ${microCountLabel}`}
          </p>
        </header>

        <nav
          class="topic-filter"
          aria-label={isEnMicro ? "Filter by topic" : "التصفية حسب الموضوع"}
          style={{ marginBottom: "2.5rem" }}
        >
          <button class="topic-chip active" data-kind="all">
            {isEnMicro ? `All snippets (${microPosts.length})` : `كل الشذرات (${microPosts.length})`}
          </button>
          {kinds.map((k) => {
            const count = microPosts.filter(
              (p) => ((p.frontmatter?.kind as string) || microDefaultKind) === k,
            ).length
            return (
              <button class="topic-chip" data-kind={k} key={k}>
                <span>{getKindEmojiOrIcon(k)}</span>
                <span>{k}</span>
                <span>({count})</span>
              </button>
            )
          })}
        </nav>

        <div class="timeline-tree-container shadhra-timeline-tree">
          {microPosts.map((post) => {
            const kind = (post.frontmatter?.kind as string) || microDefaultKind
            const dateObj = getDate(cfg, post)
            const dateFormatted = dateObj
              ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
              : ""
            const link = post.frontmatter?.link as string | undefined
            const tags = (post.frontmatter?.tags as string[]) ?? []
            const rawHtml =
              post.html ||
              (post.description ? `<p>${post.description}</p>` : `<p>${post.text || ""}</p>`)

            return (
              <div class="timeline-shadhra-block" data-kind={kind} key={post.slug}>
                {/* Spine Node: Square marker + branch line to badge */}
                <div class="timeline-spine-node">
                  <span class="timeline-node-square" />
                  <span class="timeline-node-branch" />
                </div>

                {/* Date + Kind Badge */}
                <div class="timeline-badge-wrap">
                  <a
                    href={resolveRelative(fileData.slug!, post.slug!)}
                    class="timeline-month-badge timeline-shadhra-badge"
                  >
                    <span class="shadhra-date-text">{dateFormatted}</span>
                    <span class="shadhra-kind-icon">{getKindEmojiOrIcon(kind)}</span>
                  </a>
                </div>

                {/* Shadhra Full Content Card */}
                <article class="timeline-shadhra-card">
                  {post.frontmatter?.title && (
                    <h2 class="shadhra-title">
                      <a href={resolveRelative(fileData.slug!, post.slug!)}>
                        {post.frontmatter.title}
                      </a>
                    </h2>
                  )}

                  <div
                    class="shadhra-raw-content"
                    dangerouslySetInnerHTML={{ __html: rawHtml }}
                  />

                  {link && (
                    <div class="shadhra-source-wrap">
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="shadhra-source-link"
                      >
                        {isEnMicro ? "Source link ↗" : "رابط المصدر ↗"}
                      </a>
                    </div>
                  )}

                  {tags.length > 0 && (
                    <div class="shadhra-tags-row">
                      {tags.map((t) => (
                        <a
                          href={resolveRelative(fileData.slug!, `tags/${t}` as FullSlug)}
                          class="shadhra-tag-chip"
                        >
                          #{t}
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              </div>
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
    const kind = (fileData.frontmatter?.kind as string) || microDefaultKind
    const dateObj = getDate(cfg, fileData)
    const dateFormatted = dateObj
      ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
      : ""
    const link = fileData.frontmatter?.link as string | undefined
    const tags = (fileData.frontmatter?.tags as string[]) ?? []
    const title = fileData.frontmatter?.title

    return (
      <div class="post-timeline-page shadhra-single-page" dir={microIsRtl ? "rtl" : "ltr"}>
        <div style={{ marginBottom: "1.75rem" }}>
          <a
            href={resolveRelative(fileData.slug!, microHomeSlug)}
            class="shadhra-tag-chip"
            style={{
              padding: "6px 14px",
              fontSize: "0.92rem",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>←</span>
            <span>{isEnMicro ? "Back to all snippets" : "العودة لجميع الشذرات"}</span>
          </a>
        </div>

        <div class="timeline-tree-container shadhra-timeline-tree">
          <div class="timeline-shadhra-block" data-kind={kind}>
            <div class="timeline-spine-node">
              <span class="timeline-node-square" />
              <span class="timeline-node-branch" />
            </div>

            <div class="timeline-badge-wrap">
              <div class="timeline-month-badge timeline-shadhra-badge">
                <span class="shadhra-date-text">{dateFormatted}</span>
                <span class="shadhra-kind-icon">{getKindEmojiOrIcon(kind)}</span>
              </div>
            </div>

            <article class="timeline-shadhra-card">
              {title && <h1 class="shadhra-title">{title}</h1>}

              <div class="shadhra-raw-content">
                {contentJsx}
              </div>

              {link && (
                <div class="shadhra-source-wrap">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="shadhra-source-link"
                  >
                    {isEnMicro ? "Open original source ↗" : "الانتقال للمصدر الأصلي ↗"}
                  </a>
                </div>
              )}

              {tags.length > 0 && (
                <div class="shadhra-tags-row">
                  {tags.map((t) => (
                    <a
                      href={resolveRelative(fileData.slug!, `tags/${t}` as FullSlug)}
                      class="shadhra-tag-chip"
                    >
                      #{t}
                    </a>
                  ))}
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    )
  }

  // ══════════════════════════════════════════════════════════════
  // 3. ARTICLES TIMELINE PAGE (تدوينات)
  // ══════════════════════════════════════════════════════════════
  if (isArticlesIndex) {
    const articles = allFiles
      .filter(
        (f) =>
          f.slug &&
          (f.slug.startsWith("ar/articles/") || f.slug.startsWith("articles/")) &&
          !f.slug.endsWith("index"),
      )
      .sort((a, b) => {
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    // Group by Month Year
    const groups = new Map<string, typeof articles>()
    for (const a of articles) {
      const d = getDate(cfg, a) ?? new globalThis.Date("1970-01-01")
      const monthYear = d.toLocaleDateString("ar-u-nu-latn", { year: "numeric", month: "long" })
      if (!groups.has(monthYear)) groups.set(monthYear, [])
      groups.get(monthYear)!.push(a)
    }

    return (
      <div class="post-timeline-page" dir="rtl">
        <header class="post-timeline-header">
          <h1>التدوينات</h1>
          <p>مقالات مطولة وأفكار وتجارب حول المعرفة والهندسة والحياة ({articles.length} تدوينة)</p>
        </header>

        <div class="timeline-tree-container">
          {Array.from(groups.entries()).map(([monthName, docs]) => (
            <div class="timeline-month-block" key={monthName}>
              <div class="timeline-spine-node">
                <span class="timeline-node-square" />
                <span class="timeline-node-branch" />
              </div>
              <div class="timeline-badge-wrap">
                <span class="timeline-month-badge">{monthName}</span>
              </div>
              <div class="timeline-month-card">
                {docs.map((doc) => {
                  const dateObj = getDate(cfg, doc)
                  const dateFormatted = dateObj
                    ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
                    : ""
                  const title = doc.frontmatter?.title ?? "بدون عنوان"
                  return (
                    <div class="timeline-article-row" key={doc.slug}>
                      <a
                        href={resolveRelative(fileData.slug!, doc.slug!)}
                        class="timeline-article-title"
                      >
                        {title}
                      </a>
                      <span class="timeline-article-dots" />
                      <time class="timeline-article-date">{dateFormatted}</time>
                    </div>
                  )
                })}
              </div>
            </div>
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
      <div class="poetry-index-page" dir="rtl">
        <header class="post-tl-header">
          <h1>ديوان الشعر</h1>
          <p style="color: var(--color-ink-muted); margin: 0;">قصائد وتأملات شعرية باللغة العربية الفصحى ({poems.length} قصيدة)</p>
        </header>

        <div class="poetry-grid" style="margin-top: 2rem;">
          {poems.map((poem) => (
            <a href={resolveRelative(fileData.slug!, poem.slug!)} class="poetry-card" key={poem.slug}>
              <h3 class="poetry-card-title">{poem.frontmatter?.title ?? "قصيدة"}</h3>
              <p class="poetry-card-excerpt">{poem.description || poem.text?.slice(0, 100) || "شعر عربي"}</p>
            </a>
          ))}
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

Content.afterDOMLoaded = `
document.addEventListener("nav", () => {
  const chips = document.querySelectorAll(".topic-chip");
  if (!chips.length) return;
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active", "is-active"));
      chip.classList.add("active");
      const kind = chip.getAttribute("data-kind");
      const items = document.querySelectorAll(".timeline-shadhra-block, .micro-tl-item");
      items.forEach((item) => {
        if (kind === "all" || item.getAttribute("data-kind") === kind) {
          item.style.display = "flex";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
});
`

export default (() => Content) satisfies QuartzComponentConstructor
