import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { SortFn } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, resolveRelative, simplifySlug } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { getDate } from "../Date"

interface TagContentOptions {
  sort?: SortFn
  numPages: number
}

const defaultOptions: TagContentOptions = {
  numPages: 10,
}

export default ((opts?: Partial<TagContentOptions>) => {
  const options: TagContentOptions = { ...defaultOptions, ...opts }

  const TagContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, allFiles, cfg } = props
    const slug = fileData.slug

    if (!(slug?.startsWith("tags/") || slug === "tags")) {
      throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`)
    }

    const tag = simplifySlug(slug.slice("tags/".length) as FullSlug)
    const allPagesWithTag = (tag: string) =>
      allFiles.filter((file) =>
        (file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes).includes(tag),
      )
    if (tag === "/") {
      const tags = [
        ...new Set(
          allFiles.flatMap((data) => data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes),
        ),
      ].sort((a, b) => a.localeCompare(b))
      const tagItemMap: Map<string, QuartzPluginData[]> = new Map()
      for (const tag of tags) {
        tagItemMap.set(tag, allPagesWithTag(tag))
      }
      return (
        <div class="list-page post-list-page tags-index-page" dir="rtl">
          <header class="tag-hero tag-hero--plain">
            <span class="tag-hero-scrim"></span>
            <div class="tag-hero-info">
              <h1 class="tag-hero-title">
                <svg
                  class="inline-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                  <line x1="7" y1="7" x2="7.01" y2="7"></line>
                </svg>
                وسوم
              </h1>
              <p class="tag-hero-desc">استكشف جميع الوسوم والموضوعات في الموقع.</p>
              <span class="tag-hero-count">{tags.length} وسم</span>
            </div>
          </header>

          <div class="post-tl-card" style={{ marginBottom: "2rem" }}>
            <div
              class="tags-cloud-wrapper"
              style={{
                padding: "1.25rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.6rem",
              }}
            >
              {tags.map((t) => {
                const count = tagItemMap.get(t)?.length ?? 0
                return (
                  <a
                    key={t}
                    href={resolveRelative(fileData.slug!, `tags/${t}` as FullSlug)}
                    class="tag-item"
                    style={{
                      padding: "6px 14px",
                      background: "var(--color-surface-elevated, #fff)",
                      border: "1.5px solid var(--nb-line, #000)",
                      borderRadius: "6px",
                      boxShadow: "2px 2px 0 0 var(--nb-line, #000)",
                      textDecoration: "none",
                      color: "inherit",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    #{t}{" "}
                    <span style={{ opacity: 0.65, fontSize: "0.85em", marginRight: "4px" }}>
                      ({count})
                    </span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )
    } else {
      const pages = allPagesWithTag(tag).sort(
        options?.sort ??
          ((a, b) => {
            const aDate = getDate(cfg, a) ?? new globalThis.Date("1970-01-01")
            const bDate = getDate(cfg, b) ?? new globalThis.Date("1970-01-01")
            return bDate.getTime() - aDate.getTime()
          }),
      )

      // نفس سلوك صفحة المقالات: تجميع زمني شهر/سنة (تسلسل زمني) — بدون أي كروت قديمة
      const groups = new Map<string, QuartzPluginData[]>()
      for (const doc of pages) {
        const dateObj = getDate(cfg, doc)
        const key = dateObj
          ? dateObj.toLocaleDateString("ar-u-nu-latn", { year: "numeric", month: "long" })
          : "أرشيف عام"
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(doc)
      }

      return (
        <div class="post-timeline-page tag-single-page" dir="rtl">
          <header class="post-timeline-header">
            <h1>
              <span style={{ opacity: 0.6, marginLeft: "6px" }}>#</span>
              {tag}
            </h1>
            <p>
              {fileData.description
                ? fileData.description
                : `كل المقالات والشذرات الموسومة بـ «${tag}» (${pages.length})`}
            </p>
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
  }

  TagContent.css = style
  return TagContent
}) satisfies QuartzComponentConstructor
