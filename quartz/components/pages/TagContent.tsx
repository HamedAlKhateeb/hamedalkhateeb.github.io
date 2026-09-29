import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, resolveRelative, simplifySlug } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"
// @ts-ignore
import paginationScript from "../scripts/pagination.inline"

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
    const { tree, fileData, allFiles, cfg } = props
    const slug = fileData.slug

    if (!(slug?.startsWith("tags/") || slug === "tags")) {
      throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`)
    }

    const tag = simplifySlug(slug.slice("tags/".length) as FullSlug)
    const allPagesWithTag = (tag: string) =>
      allFiles.filter((file) =>
        (file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes).includes(tag),
      )

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")
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
      const pages = allPagesWithTag(tag)
      const listProps = {
        ...props,
        allFiles: pages,
      }

      return (
        <div class="list-page post-list-page tag-single-page" dir="rtl">
          <header class="tag-hero tag-hero--plain">
            <span class="tag-hero-scrim"></span>
            <div class="tag-hero-info">
              <h1 class="tag-hero-title">
                <span style={{ opacity: 0.6, marginLeft: "6px" }}>#</span>
                {tag}
              </h1>
              {fileData.description && <p class="tag-hero-desc">{fileData.description}</p>}
              <span class="tag-hero-count">{pages.length} تدوينة / مقال</span>
            </div>
          </header>

          <div class="cards-grid">
            <PageList {...listProps} sort={options?.sort} />
          </div>
        </div>
      )
    }
  }

  TagContent.css = concatenateResources(style, PageList.css)
  TagContent.afterDOMLoaded = paginationScript
  return TagContent
}) satisfies QuartzComponentConstructor
