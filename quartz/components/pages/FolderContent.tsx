import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { QuartzPluginData } from "../../plugins/vfile"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"
import { trieFromAllFiles } from "../../util/ctx"
import { resolveRelative } from "../../util/path"
import { getDate } from "../Date"
// @ts-ignore
import paginationScript from "../scripts/pagination.inline"

interface FolderContentOptions {
  /**
   * Whether to display number of folders
   */
  showFolderCount: boolean
  showSubfolders: boolean
  sort?: SortFn
}

const defaultOptions: FolderContentOptions = {
  showFolderCount: true,
  showSubfolders: true,
}

export default ((opts?: Partial<FolderContentOptions>) => {
  const options: FolderContentOptions = { ...defaultOptions, ...opts }

  const FolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props
    const slug = fileData.slug?.toLowerCase() ?? ""

    const isHome =
      slug === "" ||
      slug === "index" ||
      slug === "ar" ||
      slug === "ar/index" ||
      slug === "en" ||
      slug === "en/index"
    if (isHome) {
      return null
    }

    const isMicroIndex =
      slug === "ar/micro" ||
      slug === "ar/micro/index" ||
      slug === "micro" ||
      slug === "micro/index"

    const isArabicArticles =
      slug === "ar/articles" ||
      slug === "ar/articles/index" ||
      slug === "articles" ||
      slug === "articles/index" ||
      slug === "post" ||
      slug === "post/index"

    const isEnglishArticles =
      slug === "experiences" ||
      slug === "experiences/index" ||
      slug === "writings" ||
      slug === "writings/index" ||
      slug === "en/articles" ||
      slug === "en/articles/index" ||
      slug === "culture" ||
      slug === "culture/index" ||
      slug === "engineering" ||
      slug === "engineering/index" ||
      slug === "math" ||
      slug === "math/index" ||
      slug === "personal" ||
      slug === "personal/index"

    const isArticlesIndex = isArabicArticles || isEnglishArticles

    const isPoetryIndex =
      slug === "ar/poetry" ||
      slug === "ar/poetry/index" ||
      slug === "poetry" ||
      slug === "poetry/index"

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
    // 1. SHATHARAT TIMELINE VIEW (alfarhan.ws/micro parity)
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
        <div class="micro-timeline-page" dir="rtl">
          <header class="micro-hero">
            <h1 class="micro-hero-title">شذرات</h1>
            <p class="micro-hero-desc">روابط والتقاطات لمحتويات لفتت انتباهي من عالم الانترنت وحياتي اليومية.</p>
          </header>

          <nav class="topic-filter" aria-label="التصفية حسب الموضوع">
            <button class="topic-chip active" data-kind="all">
              كل الشذرات ({microPosts.length})
            </button>
            {kinds.map((k) => {
              const count = microPosts.filter((p) => ((p.frontmatter?.kind as string) || "خواطر") === k).length
              return (
                <button class="topic-chip" data-kind={k} key={k}>
                  {getKindIcon(k)}
                  <span>{k}</span>
                  <span>({count})</span>
                </button>
              )
            })}
          </nav>

          <div class="micro-timeline">
            {microPosts.map((post) => {
              const kind = (post.frontmatter?.kind as string) || "خواطر"
              const dateObj = getDate(cfg, post)
              const dateFormatted = dateObj
                ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
                : ""
              const thumb = (post.frontmatter?.image ?? post.frontmatter?.cover) as string | undefined
              const link = post.frontmatter?.link as string | undefined

              return (
                <div class="micro-tl-item" data-kind={kind} key={post.slug}>
                  <div class="micro-tl-date">
                    <a href={resolveRelative(fileData.slug!, post.slug!)} style="text-decoration: none; color: inherit;">
                      {dateFormatted}
                    </a>
                  </div>
                  <div class="micro-tl-content">
                    <article class="post-card-micro">
                      <div class="micro-meta-bar">
                        <span class="micro-topic-badge">
                          {getKindIcon(kind)}
                          <span>{kind}</span>
                        </span>
                        <a href={resolveRelative(fileData.slug!, post.slug!)} class="micro-time-link">
                          {dateFormatted} ←
                        </a>
                      </div>
                      <div class="micro-body">
                        {thumb && (
                          <p>
                            <img src={thumb} alt={post.frontmatter?.title ?? ""} loading="lazy" />
                          </p>
                        )}
                        {post.frontmatter?.title && (
                          <h3 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 1.2rem; font-weight: 800;">
                            <a href={resolveRelative(fileData.slug!, post.slug!)} style="text-decoration: none; color: inherit;">
                              {post.frontmatter.title}
                            </a>
                          </h3>
                        )}
                        <p>{post.description || post.text || ""}</p>
                        {link && (
                          <p style="margin-top: 0.75rem;">
                            <a href={link} target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 700; color: var(--color-ink); text-decoration: underline;">
                              رابط المصدر ↗
                            </a>
                          </p>
                        )}
                      </div>
                    </article>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    // ══════════════════════════════════════════════════════════════
    // 2. ARTICLES TIMELINE VIEW (Parity with User's Reference Image)
    // ══════════════════════════════════════════════════════════════
    if (isArticlesIndex) {
      const isRtl = isArabicArticles
      let articles: QuartzPluginData[] = []

      if (isRtl) {
        articles = allFiles
          .filter(
            (f) =>
              f.slug &&
              (f.slug.startsWith("ar/articles/") || f.slug.startsWith("articles/")) &&
              !f.slug.endsWith("index"),
          )
      } else {
        // English articles: check if specific folder or general writings
        if (slug.startsWith("culture")) {
          articles = allFiles.filter((f) => f.slug?.startsWith("culture/") && !f.slug.endsWith("index"))
        } else if (slug.startsWith("engineering")) {
          articles = allFiles.filter((f) => f.slug?.startsWith("engineering/") && !f.slug.endsWith("index"))
        } else if (slug.startsWith("math")) {
          articles = allFiles.filter((f) => f.slug?.startsWith("math/") && !f.slug.endsWith("index"))
        } else if (slug.startsWith("personal")) {
          articles = allFiles.filter((f) => f.slug?.startsWith("personal/") && !f.slug.endsWith("index"))
        } else {
          // General English writings / experiences: include all English non-index posts
          articles = allFiles.filter(
            (f) =>
              f.slug &&
              !f.slug.toLowerCase().startsWith("ar/") &&
              !f.slug.endsWith("index") &&
              !f.slug.startsWith("tags/") &&
              f.slug !== "index" &&
              f.slug !== "en" &&
              f.slug.toLowerCase() !== "about",
          )
        }
      }

      articles.sort((a, b) => {
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

      // Group by Month/Year
      const groups = new Map<string, QuartzPluginData[]>()
      for (const doc of articles) {
        const dateObj = getDate(cfg, doc)
        let key = ""
        if (dateObj) {
          key = isRtl
            ? dateObj.toLocaleDateString("ar-u-nu-latn", { year: "numeric", month: "long" })
            : dateObj.toLocaleDateString("en-US", { year: "numeric", month: "long" })
        } else {
          key = isRtl ? "أرشيف عام" : "Archive"
        }
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(doc)
      }

      const headerTitle = isRtl
        ? "التدوينات"
        : (fileData.frontmatter?.title ?? "Writings")
      const headerDesc = isRtl
        ? `مقالات مطولة وأفكار وتجارب حول المعرفة والهندسة والحياة (${articles.length} تدوينة)`
        : `Essays, thoughts, and experiments on software, engineering, and life (${articles.length} article${articles.length === 1 ? "" : "s"})`

      return (
        <div class="post-timeline-page" dir={isRtl ? "rtl" : "ltr"}>
          <header class="post-timeline-header">
            <h1>{headerTitle}</h1>
            <p>{headerDesc}</p>
          </header>

          <div class="timeline-tree-container">
            {Array.from(groups.entries()).map(([monthName, docs]) => (
              <div class="timeline-month-block" key={monthName}>
                {/* Node on the spine line */}
                <div class="timeline-spine-node">
                  <span class="timeline-node-square" />
                  <span class="timeline-node-branch" />
                </div>

                {/* Month Badge */}
                <div class="timeline-badge-wrap">
                  <span class="timeline-month-badge">{monthName}</span>
                </div>

                {/* Month Articles Card */}
                <div class="timeline-month-card">
                  {docs.map((doc) => {
                    const dateObj = getDate(cfg, doc)
                    const dateFormatted = dateObj
                      ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
                      : ""
                    const title = doc.frontmatter?.title ?? (isRtl ? "بدون عنوان" : "Untitled")

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
    // 3. POETRY DIWAN GRID VIEW
    // ══════════════════════════════════════════════════════════════
    if (isPoetryIndex) {
      const poems = allFiles
        .filter(
          (f) =>
            f.slug &&
            (f.slug.startsWith("ar/poetry/") || f.slug.startsWith("poetry/")) &&
            !f.slug.endsWith("index"),
        )
        .sort((a, b) => {
          const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
          const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
          return bDate.getTime() - aDate.getTime()
        })

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
    // 4. STANDARD FOLDER VIEW (Fallback for other directories)
    // ══════════════════════════════════════════════════════════════
    const trie = (props.ctx.trie ??= trieFromAllFiles(allFiles))
    const folder = trie.findNode(fileData.slug!.split("/"))
    if (!folder) {
      return null
    }

    let allPagesInFolder: QuartzPluginData[] = []
    if (fileData.slug === "index") {
      allPagesInFolder = allFiles.filter(
        (page) => page.slug && page.slug !== "index" && !page.slug.endsWith("/index"),
      )
    } else {
      allPagesInFolder =
        (folder.children
          .map((node) => {
            if (node.data) {
              return node.data
            }

            if (node.isFolder && options.showSubfolders) {
              const getMostRecentDates = (): QuartzPluginData["dates"] => {
                let maybeDates: QuartzPluginData["dates"] | undefined = undefined
                for (const child of node.children) {
                  if (child.data?.dates) {
                    if (!maybeDates) {
                      maybeDates = { ...child.data.dates }
                    } else {
                      if (child.data.dates.created > maybeDates.created) {
                        maybeDates.created = child.data.dates.created
                      }
                      if (child.data.dates.modified > maybeDates.modified) {
                        maybeDates.modified = child.data.dates.modified
                      }
                      if (child.data.dates.published > maybeDates.published) {
                        maybeDates.published = child.data.dates.published
                      }
                    }
                  }
                }
                return (
                  maybeDates ?? {
                    created: new Date(),
                    modified: new Date(),
                    published: new Date(),
                  }
                )
              }

              return {
                slug: node.slug,
                dates: getMostRecentDates(),
                frontmatter: {
                  title: node.displayName,
                  tags: [],
                },
              }
            }
          })
          .filter((page) => page !== undefined) as QuartzPluginData[]) ?? []
    }

    const listProps = {
      ...props,
      sort: options.sort,
      allFiles: allPagesInFolder,
    }

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren

    return (
      <section class="page-container">
        <header class="main-header">
          {options.showFolderCount && fileData.slug !== "About/index" && (
            <p class="meta-data">{allPagesInFolder.length} مقال</p>
          )}
        </header>

        <div class="folder-content-body">{content}</div>

        <div class="tadwinat-list-wrap">
          <PageList {...listProps} />
        </div>
      </section>
    )
  }

  FolderContent.css = concatenateResources(style, PageList.css)
  FolderContent.afterDOMLoaded = `
${paginationScript}

document.addEventListener("nav", () => {
  const chips = document.querySelectorAll(".topic-chip");
  if (!chips.length) return;
  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active", "is-active"));
      chip.classList.add("active");
      const kind = chip.getAttribute("data-kind");
      const items = document.querySelectorAll(".micro-tl-item");
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
  return FolderContent
}) satisfies QuartzComponentConstructor
