import { ComponentChildren } from "preact"
import { htmlToJsx } from "../../util/jsx"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { resolveRelative } from "../../util/path"
import { visit } from "unist-util-visit"
import { Root } from "hast"

const Content: QuartzComponent = ({ fileData, tree, allFiles }: QuartzComponentProps) => {
  let processedTree = tree as Root
  const isPoetry = fileData.slug !== undefined && fileData.slug.startsWith("poetry/") && !fileData.slug.endsWith("index")
  const isPoetryIndex = fileData.slug !== undefined && fileData.slug === "poetry/index"

  if (isPoetry) {
    processedTree = JSON.parse(JSON.stringify(tree))
    visit(processedTree, "element", (node: any) => {
      if (node.tagName === "p") {
        const hasPipe = node.children?.some((c: any) => c.type === "text" && c.value.includes("|"))
        if (hasPipe) {
          const textContent = node.children.map((c: any) => (c.type === "text" ? c.value : "")).join("")
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
                      tagName: "span",
                      properties: { className: ["first"] },
                      children: [{ type: "text", value: parts[0].trim() }],
                    },
                    {
                      type: "element",
                      tagName: "span",
                      properties: { className: ["second"] },
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
                children: [{ type: "text", value: line }]
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

  // --- Poetry Index: auto-list all poems ---
  if (isPoetryIndex) {
    const poems = allFiles
      .filter(f => f.slug?.startsWith("poetry/") && !f.slug.endsWith("index"))
    poems.sort((a, b) => (a.slug! > b.slug! ? 1 : -1))

    return (
      <article class={classString}>
        <div class="poetry-index-wrapper">
          <div class="poetry-index-header">
            <div class="poetry-index-ornament">✦</div>
            <h1 class="poetry-index-title">ديوان حامد الخطيب</h1>
            <p class="poetry-index-subtitle">أكتب الشعر العربي العمودي أحيانًا. وأبصر فيه دوحًا من الجمال، نمّى فيه إحساسًا عارمًا به؛ وأيقظ روحًا شغوفةً بنظمه والأنس به.</p>
            <div class="poetry-index-stats">
              <span>{poems.length} قصيدة</span>
            </div>
            <div class="poetry-index-ornament">❋ ❋ ❋</div>
          </div>

          <div class="poetry-index-list">
            {poems.map((poem, idx) => {
              const poemTitle = poem.frontmatter?.title || poem.slug!.split("/").pop()?.replace(/_/g, " ") || "بلا عنوان"
              const poemMeter = (poem.frontmatter as any)?.meter || ""
              const poemDescription = poem.frontmatter?.description || ""

              return (
                <a href={resolveRelative(fileData.slug!, poem.slug!)} class="poetry-index-card internal" key={idx}>
                  <div class="poetry-card-number">{idx + 1}</div>
                  <div class="poetry-card-content">
                    <h3 class="poetry-card-title">{poemTitle}</h3>
                    <div class="poetry-card-meta">
                      {poemMeter && <span class="poetry-card-meter">{poemMeter}</span>}
                      {poemDescription && <span class="poetry-card-desc">{poemDescription}</span>}
                    </div>
                  </div>
                  <div class="poetry-card-arrow">←</div>
                </a>
              )
            })}
          </div>

          <div class="poetry-index-footer">
            <a href="https://hamedalkhateeb.github.io/" class="poetry-back-blog">← العودة للمدونة</a>
          </div>
        </div>
      </article>
    )
  }

  // --- Poetry Poem Page: premium display with navigation ---
  if (isPoetry) {
    const uniquePoems = Array.from(
      new Map(
        allFiles.filter(f => f.slug?.startsWith("poetry/") && !f.slug.endsWith("index")).map(item => [item.slug, item])
      ).values()
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
      <article class={`${classString} poetry-page`}>
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
        <div class="poem-body">
          {content}
        </div>

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
          ) : <span class="nav-empty"></span>}
          
          <a href={resolveRelative(fileData.slug!, "poetry/index" as any)} class="nav-toc">
            <span class="nav-toc-icon">☰</span>
            <span>الفهرس</span>
          </a>
          
          {nextPoem ? (
            <a href={resolveRelative(fileData.slug!, nextPoem.slug!)} class="nav-next">
              <span class="nav-label">القصيدة التالية</span>
              <span class="nav-title">{nextPoem.frontmatter?.title || "التالية"}</span>
            </a>
          ) : <span class="nav-empty"></span>}
        </div>
      </article>
    )
  }

  // --- Normal article ---
  return (
    <article class={classString}>
      {content}
    </article>
  )
}

export default (() => Content) satisfies QuartzComponentConstructor
