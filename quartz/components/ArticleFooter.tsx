import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"
import readingTime from "reading-time"
import { getDate } from "./Date"
import { resolveRelative } from "../util/path"

const ArticleFooter: QuartzComponent = (props: QuartzComponentProps) => {
  const { fileData, allFiles, displayClass, cfg } = props
  const text = fileData.text

  const slug = (fileData.slug ?? "").toLowerCase()
  const isPoetry = slug.startsWith("ar/poetry/") || slug.startsWith("poetry/")
  const isMicro = slug.startsWith("ar/micro/") || slug.startsWith("micro/")
  const isHome =
    slug === "" ||
    slug === "index" ||
    slug === "ar" ||
    slug === "ar/index" ||
    slug === "en" ||
    slug === "en/index"

  // Only render on actual articles — not on home, folder index, tags, poetry, or micro
  if (
    !text ||
    isHome ||
    slug.endsWith("/index") ||
    slug.startsWith("tags/") ||
    isPoetry ||
    isMicro ||
    slug === "about"
  ) {
    return null
  }

  const isRtl = slug.startsWith("ar/") || slug.startsWith("ar-")
  const { minutes } = readingTime(text)
  const time = isRtl
    ? i18n("ar-SA").components.contentMeta.readingTime({ minutes: Math.ceil(minutes) })
    : i18n("en-US").components.contentMeta.readingTime({ minutes: Math.ceil(minutes) })
  const date = getDate(cfg, fileData)

  // Filter candidate articles in the same language
  const candidateArticles = allFiles
    .filter((f) => {
      if (!f.slug || f.slug.endsWith("/index") || f.slug.startsWith("tags/") || f.slug === "index" || f.slug === "about") {
        return false
      }
      const s = f.slug.toLowerCase()
      if (s.startsWith("ar/poetry/") || s.startsWith("poetry/") || s.startsWith("ar/micro/") || s.startsWith("micro/")) {
        return false
      }
      if (isRtl) {
        return s.startsWith("ar/articles/") || s.startsWith("articles/") || s.startsWith("post/")
      } else {
        return !s.startsWith("ar/")
      }
    })
    .sort((a, b) => {
      const aDate = getDate(cfg, a)?.getTime() ?? 0
      const bDate = getDate(cfg, b)?.getTime() ?? 0
      return bDate - aDate // Newest first
    })

  const currentIdx = candidateArticles.findIndex((f) => f.slug === fileData.slug)
  const newerArticle = currentIdx > 0 ? candidateArticles[currentIdx - 1] : undefined
  const olderArticle =
    currentIdx >= 0 && currentIdx < candidateArticles.length - 1
      ? candidateArticles[currentIdx + 1]
      : undefined
  const hasNavigation = Boolean(newerArticle || olderArticle)

  return (
    <div class={classNames(displayClass, "article-footer-wrapper")}>
      {/* 1. Next & Previous Split Box (Image 2 Parity) */}
      {hasNavigation && (
        <nav
          class="post-navigation-container"
          aria-label={isRtl ? "تنقل بين المقالات" : "Article navigation"}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {isRtl ? (
            <>
              {olderArticle ? (
                <a
                  href={resolveRelative(fileData.slug!, olderArticle.slug!)}
                  class="post-nav-box post-nav-prev"
                  title={olderArticle.frontmatter?.title}
                >
                  <span class="post-nav-title">
                    {olderArticle.frontmatter?.title ?? "المقال السابق"}
                  </span>
                  <svg
                    class="post-nav-arrow"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              ) : (
                <div class="post-nav-box post-nav-empty" aria-hidden="true" />
              )}

              {newerArticle ? (
                <a
                  href={resolveRelative(fileData.slug!, newerArticle.slug!)}
                  class="post-nav-box post-nav-next"
                  title={newerArticle.frontmatter?.title}
                >
                  <svg
                    class="post-nav-arrow"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <span class="post-nav-title">
                    {newerArticle.frontmatter?.title ?? "المقال التالي"}
                  </span>
                </a>
              ) : (
                <div class="post-nav-box post-nav-empty" aria-hidden="true" />
              )}
            </>
          ) : (
            <>
              {olderArticle ? (
                <a
                  href={resolveRelative(fileData.slug!, olderArticle.slug!)}
                  class="post-nav-box post-nav-prev"
                  title={olderArticle.frontmatter?.title}
                >
                  <svg
                    class="post-nav-arrow"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                  <span class="post-nav-title">
                    {olderArticle.frontmatter?.title ?? "Previous"}
                  </span>
                </a>
              ) : (
                <div class="post-nav-box post-nav-empty" aria-hidden="true" />
              )}

              {newerArticle ? (
                <a
                  href={resolveRelative(fileData.slug!, newerArticle.slug!)}
                  class="post-nav-box post-nav-next"
                  title={newerArticle.frontmatter?.title}
                >
                  <span class="post-nav-title">
                    {newerArticle.frontmatter?.title ?? "Next"}
                  </span>
                  <svg
                    class="post-nav-arrow"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="9 18 15 12 9 6"></polyline>
                  </svg>
                </a>
              ) : (
                <div class="post-nav-box post-nav-empty" aria-hidden="true" />
              )}
            </>
          )}
        </nav>
      )}

      {/* 2. Separator */}
      <div class="footer-separator top-sep">
        <span class="separator-diamond">✧</span>
      </div>

      {/* 3. Separator */}
      <div class="footer-separator bottom-sep">
        <span>◇ ~ (x) ~ ◇</span>
      </div>

      {/* 4. Meta Block */}
      <div class="article-end-meta" dir={isRtl ? "rtl" : "ltr"}>
        <h2 class="footer-article-title">{fileData.frontmatter?.title}</h2>
        <p class="footer-category">
          {isRtl ? "من المقالات في نفس التصنيف" : "Related articles in the same category"}
        </p>

        <div class="footer-info">
          <a
            href={isRtl ? "/" : resolveRelative(fileData.slug!, "en" as FullSlug)}
            class="internal author-link"
          >
            {isRtl ? "مدونة حامد الخطيب" : "Hamed Alkhateeb's Blog"}
          </a>
          <span class="dot">|</span>
          <span>
            {date
              ? date.toLocaleDateString(isRtl ? "ar-SA" : "en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : ""}
          </span>
          <span class="dot">|</span>
          <span>{time}</span>
        </div>

        <button class="back-to-start" id="btn-footer-top">
          {isRtl ? "↑ العودة للبداية" : "↑ Back to top"}
        </button>

        <a
          href={
            isRtl
              ? resolveRelative(fileData.slug!, "ar/articles" as FullSlug)
              : resolveRelative(fileData.slug!, "Experiences" as FullSlug)
          }
          class="all-articles-link"
        >
          {isRtl ? "-- جميع المقالات --" : "-- All Articles --"}
        </a>
      </div>
    </div>
  )
}

ArticleFooter.css = `
.article-footer-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px dashed var(--lightgray);
  width: 100%;
}

/* ── Next & Previous Article Navigation (Image 2 Parity) ── */
.post-navigation-container {
  display: flex;
  width: 100%;
  max-width: var(--reading-width, 950px);
  margin: 1.5rem auto 2.5rem auto;
  background: var(--color-surface-elevated, #fff);
  border: 2px solid var(--nb-line, #000);
  box-shadow: 4px 4px 0 0 var(--nb-line, #000);
  border-radius: 4px;
  overflow: hidden;
  box-sizing: border-box;
}

.post-nav-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 1.25rem 1.75rem;
  text-decoration: none !important;
  color: var(--color-ink, #000) !important;
  transition: background-color 0.15s ease;
  min-width: 0;
  box-sizing: border-box;
}

.post-nav-box:not(.post-nav-empty):hover {
  background-color: var(--color-field, #fcfbf7);
}

.post-nav-box:first-child {
  border-inline-end: 2px solid var(--nb-line, #000);
}

.post-nav-title {
  font-weight: 700;
  font-size: 1.05rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.post-nav-prev .post-nav-title {
  text-align: inherit;
}

.post-nav-next .post-nav-title {
  text-align: inherit;
}

.post-nav-arrow {
  flex-shrink: 0;
  color: var(--color-ink, #000);
}

.post-nav-empty {
  visibility: hidden;
  pointer-events: none;
}

@media (max-width: 640px) {
  .post-navigation-container {
    flex-direction: column;
  }

  .post-nav-box:first-child {
    border-inline-end: none;
    border-bottom: 2px solid var(--nb-line, #000);
  }

  .post-nav-title {
    white-space: normal;
  }
}

/* Separators */
.footer-separator {
  margin: 3rem 0;
  color: #c9a7ab;
  text-align: center;
  font-size: 1.2rem;
  user-select: none;
}
.separator-diamond {
  color: #8a252c;
  font-size: 1.5rem;
}



/* End Meta Block */
.article-end-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  padding-bottom: 3rem;
}
.footer-article-title {
  font-family: var(--headerFont);
  font-size: 1.8rem;
  color: var(--dark);
  margin: 0 0 0.5rem 0;
}
.footer-category {
  color: var(--gray);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}
.footer-info {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  color: var(--gray);
  margin-bottom: 2rem;
}
.footer-info .dot {
  color: var(--lightgray);
}
.author-link {
  color: inherit;
  text-decoration: none;
  font-weight: 600;
}
.author-link:hover {
  text-decoration: underline;
}
.back-to-start {
  background-color: var(--light);
  color: var(--darkgray);
  border: 1px solid var(--lightgray);
  padding: 0.5rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  margin-bottom: 3rem;
}
.back-to-start:hover {
  background-color: var(--lightgray);
}
.all-articles-link {
  color: var(--gray);
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s;
}
.all-articles-link:hover {
  color: var(--darkgray);
}
`

ArticleFooter.afterDOMLoaded = `
document.addEventListener("nav", () => {
  const btn = document.getElementById("btn-footer-top")
  if (btn) {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" })
    btn.addEventListener("click", scrollToTop)
    window.addCleanup(() => btn.removeEventListener("click", scrollToTop))
  }
})
`

export default (() => ArticleFooter) satisfies QuartzComponentConstructor
