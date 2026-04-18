import { FullSlug, isFolderPath, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { Date, getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

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
    <ul class="section-ul page-grid">
      {list.map((page) => {
        const title = page.frontmatter?.title
        const tags = page.frontmatter?.tags ?? []
          const cover = (page.frontmatter?.cover ?? page.frontmatter?.image) as string | undefined
          const description = page.frontmatter?.description ?? page.description
  
        return (
          <li class="section-li page-card">
            {cover && (
              <a href={resolveRelative(fileData.slug!, page.slug!)} class="card-image-link">
                <img src={cover} alt={title} class="card-image" />
              </a>
            )}
            <div class="section card-content">
              {tags.length > 0 && (
                <ul class="tags card-tags">
                  {tags.slice(0, 3).map((tag) => (
                    <li>
                      <a
                        class="internal tag-link"
                        href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)}
                      >
                        {tag}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <div class="desc">
                <h3>
                  <a href={resolveRelative(fileData.slug!, page.slug!)} class="internal">
                    {title}
                  </a>
                </h3>
                {description && <p class="card-description">{description}</p>}
              </div>
              <p class="meta card-meta">
                {page.dates && <Date date={getDate(cfg, page)!} locale={cfg.locale} />}
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
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0;
  list-style: none;
  margin-top: 2rem;
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

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  list-style: none;
  padding: 0;
  justify-content: flex-start;
}

.card-tags .tag-link {
  background-color: var(--highlight);
  color: var(--secondary);
  padding: 0.2rem 0.6rem;
  border-radius: 50px;
  font-size: 0.8rem;
  text-decoration: none;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
}

.card-content h3 a {
  color: var(--dark);
  text-decoration: none;
}

.card-description {
  color: var(--gray);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  margin-top: auto;
  font-size: 0.85rem;
  color: var(--gray);
  padding-top: 1rem;
  border-top: 1px solid var(--lightgray);
}
`
