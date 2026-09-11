import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { resolveRelative } from "../util/path"
import { Date, getDate } from "./Date"
import readingTime from "reading-time"
import { i18n } from "../i18n"

export default (() => {
  const HomeArticles: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, allFiles, cfg } = props
    if (fileData.slug !== "index") return null

    // Filter out index pages, tags, and Arabic section pages for the English homepage
    const englishPages = allFiles
      .filter(
        (page) =>
          page.slug &&
          page.slug !== "index" &&
          !page.slug.endsWith("/index") &&
          !page.slug.startsWith("tags/") &&
          !page.slug.toLowerCase().startsWith("ar/"),
      )
      .sort((a, b) => {
        const aDate = a.dates?.published ?? new globalThis.Date("1970-01-01")
        const bDate = b.dates?.published ?? new globalThis.Date("1970-01-01")
        return bDate.getTime() - aDate.getTime()
      })

    const latestWritings = englishPages.slice(0, 6)
    const recentNotes = englishPages.slice(6, 12)

    return (
      <div class="en-main-layout" dir="ltr">
        <div class="en-content-column">
          {/* ══════ Latest Writings ══════ */}
          {latestWritings.length > 0 && (
            <section class="en-latest-articles">
              <div class="en-section-title-row">
                <h2>Latest Writings</h2>
              </div>
              <div class="en-articles-grid">
                {latestWritings.map((page) => {
                  const title = page.frontmatter?.title ?? "Untitled"
                  const desc = page.frontmatter?.description ?? page.description ?? ""
                  let minutesStr = ""
                  if (page.text) {
                    const { minutes } = readingTime(page.text)
                    minutesStr = i18n(cfg.locale).components.contentMeta.readingTime({
                      minutes: Math.ceil(minutes),
                    })
                  }
                  const cover = (page.frontmatter?.cover ?? page.frontmatter?.image) as
                    | string
                    | undefined
                  return (
                    <article class="en-card en-content-card">
                      {cover ? (
                        <div class="en-card-image" style={{ backgroundImage: `url('${cover}')` }}></div>
                      ) : (
                        <div class="en-card-image en-card-image-placeholder"></div>
                      )}
                      <div class="en-card-body">
                        <h3>
                          <a
                            href={resolveRelative(fileData.slug!, page.slug!)}
                            class="en-card-link"
                          >
                            {title}
                          </a>
                        </h3>
                        <p class="en-excerpt">
                          {desc.length > 120 ? desc.substring(0, 120) + "..." : desc}
                        </p>
                        <div class="en-card-meta">
                          <span>{page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}</span>
                          <span>{minutesStr}</span>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>
          )}

          {/* ══════ Recent Notes ══════ */}
          {recentNotes.length > 0 && (
            <section class="en-card en-recent-notes">
              <div class="en-section-title-row">
                <h2>Recent Notes</h2>
              </div>
              <ul class="en-recent-list">
                {recentNotes.map((page) => {
                  const title = page.frontmatter?.title ?? "Untitled"
                  return (
                    <li class="en-recent-item" key={page.slug}>
                      <a
                        href={resolveRelative(fileData.slug!, page.slug!)}
                        class="en-recent-link internal"
                      >
                        {title}
                      </a>
                      <span class="en-recent-date">
                        {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </section>
          )}
        </div>
      </div>
    )
  }

  HomeArticles.css = `
  .en-main-layout {
    margin-top: 20px;
    margin-bottom: 60px;
    direction: ltr;
  }
  .en-content-column {
    max-width: 1100px;
    margin: 0 auto;
  }
  .en-main-layout a { text-decoration: none; color: inherit; }
  .en-main-layout a:hover { color: var(--secondary); }

  .en-section-title-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 22px; padding-bottom: 10px;
    border-bottom: 1px dashed var(--lightgray);
  }
  .en-section-title-row h2 { font-size: 1.45rem; color: var(--dark); margin: 0; }

  .en-card {
    background-color: var(--light);
    border: 1px solid var(--lightgray);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 26px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .en-card:hover {
    box-shadow: 0 10px 25px rgba(0,0,0,0.06);
    transform: translateY(-4px);
  }
  .en-card-link::after {
    content: "";
    position: absolute;
    top: 0; right: 0; bottom: 0; left: 0;
    z-index: 1;
  }

  .en-articles-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(290px, 1fr)); gap: 24px; }
  .en-content-card { padding: 0; display: flex; flex-direction: column; height: 100%; }
  .en-card-image {
    height: 180px; background-size: cover; background-position: center;
    border-bottom: 1px solid var(--lightgray);
    transition: transform 0.5s ease;
  }
  .en-content-card:hover .en-card-image { transform: scale(1.03); }
  .en-card-image-placeholder {
    background: linear-gradient(135deg, var(--lightgray) 0%, var(--highlight) 100%);
  }
  .en-card-body { padding: 16px; display: flex; flex-direction: column; flex-grow: 1; }
  .en-content-card h3 { font-size: 1.15rem; color: var(--dark); margin: 0 0 10px 0; line-height: 1.5; font-weight: bold; }
  .en-excerpt { font-size: 0.92rem; color: var(--gray); margin-bottom: 12px; flex-grow: 1; line-height: 1.6; }
  .en-card-meta {
    display: flex; justify-content: space-between; font-size: 0.78rem;
    color: var(--gray); border-top: 1px solid var(--lightgray);
    padding-top: 10px; margin-top: auto;
  }

  .en-recent-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; }
  .en-recent-item {
    display: flex; align-items: center; justify-content: space-between; gap: 1rem;
    padding: 13px 0; border-bottom: 1px solid var(--lightgray);
    font-size: 1rem; line-height: 1.6;
  }
  .en-recent-item:last-child { border-bottom: none; }
  .en-recent-link { color: var(--dark); font-weight: 500; }
  .en-recent-link:hover { color: var(--secondary); }
  .en-recent-date { font-size: 0.85rem; color: var(--gray); white-space: nowrap; }

  @media (max-width: 600px) {
    .en-articles-grid { grid-template-columns: 1fr; }
    .en-recent-item { flex-direction: column; align-items: flex-start; gap: 0.2rem; }
  }
  `

  return HomeArticles
}) satisfies QuartzComponentConstructor
