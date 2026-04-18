import { FullSlug, isFolderPath, resolveRelative, slugifyFilePath } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"
import readingTime from "reading-time"
import { i18n } from "../i18n"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byDateAndAlphabeticalFolderFirst(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    // Sort folders first
    const f1IsFolder = isFolderPath(f1.slug ?? "")
    const f2IsFolder = isFolderPath(f2.slug ?? "")
    if (f1IsFolder && !f2IsFolder) return -1
    if (!f1IsFolder && f2IsFolder) return 1

    // If both are folders or both are files, sort by date/alphabetical
    if (f1.dates && f2.dates) {
      // sort descending
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      // prioritize files with dates
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }

    // otherwise, sort lexographically by title
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

type Props = {
  limit?: number
  sort?: SortFn
} & QuartzComponentProps

export const PageList: QuartzComponent = ({ cfg, fileData, allFiles, limit, sort }: Props) => {
  const sorter = sort ?? byDateAndAlphabeticalFolderFirst(cfg)
  let list = allFiles.sort(sorter)
  if (limit) {
    list = list.slice(0, limit)
  }

  return (
    <ul class="cards-grid page-grid">
      {list.map((page) => {
        const title = page.frontmatter?.title
        const tags = page.frontmatter?.tags ?? []
        const cover = (page.frontmatter?.cover ?? page.frontmatter?.image) as string | undefined
        const description = page.frontmatter?.description ?? page.description
        
        let displayedTime = ""
        if (page.text) {
          const { minutes } = readingTime(page.text)
          displayedTime = i18n(cfg.locale).components.contentMeta.readingTime({
            minutes: Math.ceil(minutes),
          })
        }
  
        return (
          <li class="page-card">
            {cover && (
              <a href={resolveRelative(fileData.slug!, page.slug!)} class="card-image-link">
                <img src={cover} alt={title} class="card-image" />
              </a>
            )}
            <div class="card-body card-content">
              <div class="desc card-text-center">
                <h3 class="card-title">
                  <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                    {title}
                  </a>
                </h3>
              </div>
              {tags.length > 0 && (
                <div class="card-tags-joined-container">
                  <div class="card-tags-joined">
                    {tags.slice(0, 4).map((tag, i) => (
                      <span key={tag}>
                        <a
                          class="internal tag-link inline-tag"
                          href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                        >
                          {tag}
                        </a>
                        {i < Math.min(tags.length, 4) - 1 && <span class="tag-separator"> · </span>}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div class="desc card-text-center">
                {description && <p class="card-description">{description}</p>}
              </div>
              <div class="card-divider"></div>
              <p class="meta card-meta-inline">
                {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
                {displayedTime && (
                  <span class="card-reading-time">
                    <span class="meta-dot"> • </span>{displayedTime}
                  </span>
                )}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

PageList.css = `
.page-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 300px), 1fr));
  gap: 2rem;
  padding: 0;
  list-style: none;
  margin-top: 2rem;
}

.cards-grid {
  /* wrapper styles if any, block by default */
  width: 100%;
}

.page-card {
  display: flex;
  flex-direction: column;
  background-color: var(--light);
  border: 1px solid var(--lightgray);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.page-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

.card-image-link {
  display: block;
  width: 100%;
  aspect-ratio: 16/9;
  border-bottom: 1px solid var(--lightgray);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  margin: 0;
}

.card-content, .card-body {
  padding: clamp(1.2rem, 4vw, 2.5rem) clamp(1rem, 4vw, 2rem);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  align-items: center; /* Center horizontally */
  text-align: center;
}

.card-tags-joined-container {
  display: block;
  width: 100%;
  margin-bottom: 1.2rem;
  text-align: center;
}

.card-tags-joined {
  background-color: var(--highlight);
  color: var(--secondary);
  padding: 0.3rem 1.2rem;
  border-radius: 50px;
  font-size: 0.8rem;
  display: inline-block;
  font-weight: 600;
  font-family: 'IBM Plex Sans Arabic', sans-serif;
}

.card-tags-joined .tag-link.inline-tag {
  background-color: transparent;
  color: var(--secondary);
  padding: 0;
  border-radius: 0;
  text-decoration: none;
}

.card-tags-joined .tag-link.inline-tag:hover {
  text-decoration: underline;
}

.tag-separator {
  margin: 0 0.3rem;
  color: var(--secondary);
  opacity: 0.7;
}

.card-text-center {
  text-align: center;
  width: 100%;
}

.card-title {
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.4;
  font-family: 'Aref Ruqaa', var(--headerFont);
}

.card-title a, .card-title a.internal {
  color: var(--dark);
  text-decoration: none;
  background-color: transparent;
  padding: 0;
}

.card-description {
  color: var(--gray);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-family: 'Amiri', var(--bodyFont);
}

.card-divider {
  border: 0;
  height: 1px;
  background-color: var(--lightgray);
  margin: 1.5rem auto 1rem auto;
  width: 90%;
}

.card-meta-inline {
  font-size: 0.85rem;
  color: var(--gray);
  margin: auto 0 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Space out date and read time */
  flex-wrap: wrap;
  width: 100%;
  padding: 0;
  font-family: 'IBM Plex Sans Arabic', sans-serif;
}

.meta-dot {
  display: none; /* Hide the dot since they are spaced apart */
}
`
