import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { resolveRelative, FullSlug } from "../../util/path"
import { visit } from "unist-util-visit"
import { Root } from "hast"
import { Date, getDate } from "../Date"

const Content: QuartzComponent = ({ fileData, tree, allFiles, cfg }: QuartzComponentProps) => {
  let processedTree = tree as Root
  const slug = fileData.slug?.toLowerCase() ?? ""
  const isArticle = !slug.endsWith("index")
  const isPoetry =
    (slug.startsWith("ar/poetry/") || slug.startsWith("poetry/")) && !slug.endsWith("index")
  const isPoetryIndex =
    slug === "ar/poetry/index" ||
    slug === "poetry/index" ||
    slug === "ar/poetry" ||
    slug === "poetry"

  if (isPoetry) {
    processedTree = JSON.parse(JSON.stringify(tree))
    visit(processedTree, "element", (node: any) => {
      if (node.tagName === "p") {
        const hasPipe = node.children?.some((c: any) => c.type === "text" && c.value.includes("|"))
        if (hasPipe) {
          // Convert both text types and <br/> tags to resolve lines robustly
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
              // Not a pipe line, preserve as is
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
  const classes: string[] = fileData.frontmatter?.cssclasses ?? []
  const classString = ["popover-hint", ...classes].join(" ")

  // --- Poetry Index: auto-list all poems in a beautiful literary grid ---
  if (isPoetryIndex) {
    const poems = allFiles.filter(
      (f) =>
        (f.slug?.toLowerCase().startsWith("ar/poetry/") ||
          f.slug?.toLowerCase().startsWith("poetry/")) &&
        !f.slug.endsWith("index"),
    )
    poems.sort((a, b) => (a.slug! > b.slug! ? 1 : -1))

    return (
      <article class={classString}>
        <div class="poetry-index-wrapper">
          <div class="poetry-index-header">
            <div class="poetry-index-ornament">✦</div>
            <h1 class="poetry-index-title">ديوان حامد</h1>
            <p class="poetry-index-subtitle">
              أكتب الشعر العربي العمودي أحيانًا. وأبصر فيه دوحًا من الجمال، نمّى فيه إحساسًا عارمًا
              به؛ وأيقظ روحًا شغوفةً بنظمه والأنس به.
            </p>
            <div class="poetry-index-stats">
              <span>{poems.length} قصيدة</span>
            </div>
            <div class="poetry-index-ornament">❋ ❋ ❋</div>
          </div>

          <ul class="article-magazine-grid rtl" id="article-magazine-grid" dir="rtl">
            {poems.map((poem, idx) => {
              const poemTitle =
                poem.frontmatter?.title ||
                poem.slug!.split("/").pop()?.replace(/_/g, " ") ||
                "بلا عنوان"
              const poemMeter = (poem.frontmatter as any)?.meter || ""

              const cover = (poem.frontmatter?.cover ??
                poem.frontmatter?.image ??
                "/static/thumbnails/arabic-graffiti.webp") as string

              const poemText = poem.text ?? ""
              const description = poem.frontmatter?.description
              let excerpt = ""
              let isExcerptPoem = false

              if (description) {
                excerpt = description
              } else {
                const lines = poemText
                  .split("\n")
                  .map((l) => l.trim())
                  .filter((l) => l.includes("|"))
                  .slice(0, 2)
                excerpt = lines.join("\n")
                isExcerptPoem = true
              }

              return (
                <li class="magazine-card poetry-card" key={idx}>
                  <a
                    href={resolveRelative(fileData.slug!, poem.slug!)}
                    class="card-thumbnail-link internal"
                  >
                    <img
                      src={cover}
                      alt={poemTitle}
                      class="card-thumbnail"
                      loading="lazy"
                      width="400"
                      height="300"
                    />
                  </a>
                  <a
                    href={resolveRelative(fileData.slug!, poem.slug!)}
                    class="poetry-card-content-link internal"
                  >
                    <div class="poetry-card-number">{idx + 1}</div>
                    <h3 class="poetry-card-title">{poemTitle}</h3>

                    {excerpt && (
                      <p class={isExcerptPoem ? "card-excerpt poem" : "card-excerpt prose"}>
                        {excerpt}
                      </p>
                    )}

                    <div class="poetry-card-meta">
                      {poemMeter && <span class="poetry-card-meter">{poemMeter}</span>}
                      {poem.dates && (
                        <span class="poetry-card-date">
                          <Date date={getDate(cfg, poem)!} locale={cfg.locale} />
                        </span>
                      )}
                    </div>
                  </a>
                </li>
              )
            })}
          </ul>

          <div class="article-pagination" id="article-pagination-controls"></div>

          <div class="poetry-index-footer">
            <a href={resolveRelative(fileData.slug!, "ar" as FullSlug)} class="poetry-back-blog">
              ← العودة للرئيسية
            </a>
          </div>
        </div>
      </article>
    )
  }

  // --- Poetry Poem Page: premium display with navigation ---
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

    const poet = (fileData.frontmatter as any)?.poet || "حامد الخطيب"
    const meter = (fileData.frontmatter as any)?.meter || ""
    const poemTitle = fileData.frontmatter?.title || ""

    // Count poem lines from the text
    const lineCount = fileData.text
      ? fileData.text.split("\n").filter((l: string) => l.trim().includes("|")).length
      : 0

    return (
      <article class={`${classString} poetry-page page-content`}>
        {/* Poem Header */}
        <div class="poem-page-header">
          <div class="poem-ornament-top">❋</div>
          <h1 class="poem-page-title">{poemTitle}</h1>
          <div class="poem-page-poet">{poet}</div>
          <div class="poem-page-meta">
            {meter && <span class="poem-meta-meter">{meter}</span>}
            {lineCount > 0 && <span class="poem-meta-count">{lineCount} أبيات</span>}
          </div>
          <div class="poem-ornament-divider">
            <span>⟡</span>
          </div>
        </div>

        {/* Poem Content */}
        <div class="poem-body">{content}</div>

        {/* Poem Footer Ornament */}
        <div class="poem-end-ornament">
          <span>✦ ✦ ✦</span>
        </div>

        {/* Navigation */}
        <div class="poetry-navigation">
          {prevPoem ? (
            <a href={resolveRelative(fileData.slug!, prevPoem.slug!)} class="nav-prev">
              <span class="nav-label">القصيدة السابقة</span>
              <span class="nav-title">{prevPoem.frontmatter?.title || "السابقة"}</span>
            </a>
          ) : (
            <span class="nav-empty"></span>
          )}

          <a href={resolveRelative(fileData.slug!, "ar/poetry" as FullSlug)} class="nav-toc">
            <span class="nav-toc-icon">☰</span>
            <span>الفهرس</span>
          </a>

          {nextPoem ? (
            <a href={resolveRelative(fileData.slug!, nextPoem.slug!)} class="nav-next">
              <span class="nav-label">القصيدة التالية</span>
              <span class="nav-title">{nextPoem.frontmatter?.title || "التالية"}</span>
            </a>
          ) : (
            <span class="nav-empty"></span>
          )}
        </div>
      </article>
    )
  }

  // --- Normal article ---
  return <article class={isArticle ? `${classString} page-content` : classString}>{content}</article>
}

export default (() => Content) satisfies QuartzComponentConstructor
