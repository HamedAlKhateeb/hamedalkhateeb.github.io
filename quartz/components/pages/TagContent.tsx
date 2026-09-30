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
        <div class="post-timeline-page tags-index-page" dir="rtl">
          <header class="post-timeline-header">
            <h1>🏷️ الوسوم</h1>
            <p>استكشف جميع الموضوعات والوسوم في الموقع ({tags.length} وسم)</p>
          </header>

          <div
            class="tags-cloud-wrapper"
            style={{
              marginTop: "2rem",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            {tags.map((t) => {
              const count = tagItemMap.get(t)?.length ?? 0
              return (
                <a
                  key={t}
                  href={resolveRelative(fileData.slug!, `tags/${t}` as FullSlug)}
                  class="tag-item"
                >
                  #{t} <span class="tag-count">({count})</span>
                </a>
              )
            })}
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

      const isMicro = (doc: QuartzPluginData) =>
        Boolean(
          doc.slug &&
            (doc.slug.startsWith("ar/micro/") || doc.slug.startsWith("micro/")) &&
            !doc.slug.endsWith("index"),
        )

      const microPosts = pages.filter(isMicro)
      const articles = pages.filter((doc) => !isMicro(doc))

      const getKindEmojiOrIcon = (kind?: string) => {
        const k = (kind ?? "").trim()
        if (k === "يوتيوب" || k === "فيديو") return "🎥"
        if (k === "كتاب" || k === "قراءة") return "📖"
        if (k === "رابط") return "🔗"
        if (k === "صور" || k === "صورة") return "🖼️"
        if (k === "صوت" || k === "بودكاست") return "🎙️"
        return "💡"
      }

      // Group articles by Month/Year
      const articleGroups = new Map<string, QuartzPluginData[]>()
      for (const doc of articles) {
        const dateObj = getDate(cfg, doc)
        const key = dateObj
          ? dateObj.toLocaleDateString("ar-u-nu-latn", { year: "numeric", month: "long" })
          : "أرشيف عام"
        if (!articleGroups.has(key)) articleGroups.set(key, [])
        articleGroups.get(key)!.push(doc)
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
                : `المحتويات الموسومة بـ «${tag}» (${pages.length})`}
            </p>
          </header>

          {/* 1. Shadharat Section (Raw Content Timeline Cards) */}
          {microPosts.length > 0 && (
            <div class="tag-micro-section" style={{ marginTop: "2rem" }}>
              {articles.length > 0 && (
                <h2
                  class="tag-section-heading"
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    margin: "0 0 1.5rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>📍</span>
                  <span>الشذرات ({microPosts.length})</span>
                </h2>
              )}

              <div class="timeline-tree-container shadhra-timeline-tree">
                {microPosts.map((post) => {
                  const kind = (post.frontmatter?.kind as string) || "خواطر"
                  const dateObj = getDate(cfg, post)
                  const dateFormatted = dateObj
                    ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
                    : ""
                  const link = post.frontmatter?.link as string | undefined
                  const postTags = (post.frontmatter?.tags as string[]) ?? []
                  const rawHtml =
                    post.html ||
                    (post.description ? `<p>${post.description}</p>` : `<p>${post.text || ""}</p>`)

                  return (
                    <div class="timeline-shadhra-block" data-kind={kind} key={post.slug}>
                      {/* Spine Node */}
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

                      {/* Full Content Card */}
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
                              رابط المصدر ↗
                            </a>
                          </div>
                        )}

                        {postTags.length > 0 && (
                          <div class="shadhra-tags-row">
                            {postTags.map((t) => (
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
          )}

          {/* 2. Articles Section (Timeline Tree) */}
          {articles.length > 0 && (
            <div
              class="tag-articles-section"
              style={{ marginTop: microPosts.length > 0 ? "3.5rem" : "2rem" }}
            >
              {microPosts.length > 0 && (
                <h2
                  class="tag-section-heading"
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 800,
                    margin: "0 0 1.5rem 0",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <span>🖊️</span>
                  <span>التدوينات ({articles.length})</span>
                </h2>
              )}

              <div class="timeline-tree-container">
                {Array.from(articleGroups.entries()).map(([monthName, docs]) => (
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
          )}
        </div>
      )
    }
  }

  TagContent.css = style
  return TagContent
}) satisfies QuartzComponentConstructor
