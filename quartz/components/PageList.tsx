import { isFolderPath, resolveRelative } from "../util/path"
import { QuartzPluginData } from "../plugins/vfile"
import { getDate } from "./Date"
import { QuartzComponent, QuartzComponentProps } from "./types"
import { GlobalConfiguration } from "../cfg"

export type SortFn = (f1: QuartzPluginData, f2: QuartzPluginData) => number

export function byDateAndAlphabetical(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    if (f1.dates && f2.dates) {
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }
    const f1Title = f1.frontmatter?.title.toLowerCase() ?? ""
    const f2Title = f2.frontmatter?.title.toLowerCase() ?? ""
    return f1Title.localeCompare(f2Title)
  }
}

export function byDateAndAlphabeticalFolderFirst(cfg: GlobalConfiguration): SortFn {
  return (f1, f2) => {
    const f1IsFolder = isFolderPath(f1.slug ?? "")
    const f2IsFolder = isFolderPath(f2.slug ?? "")
    if (f1IsFolder && !f2IsFolder) return -1
    if (!f1IsFolder && f2IsFolder) return 1

    if (f1.dates && f2.dates) {
      return getDate(cfg, f2)!.getTime() - getDate(cfg, f1)!.getTime()
    } else if (f1.dates && !f2.dates) {
      return -1
    } else if (!f1.dates && f2.dates) {
      return 1
    }
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
  let list = [...allFiles].sort(sorter)
  if (limit) {
    list = list.slice(0, limit)
  }

  const slug = (fileData.slug ?? "").toLowerCase()
  const isArabic = slug.startsWith("ar/") || slug === "ar" || slug.startsWith("tags/")

  return (
    <div class="tadwinat-list" id="article-list">
      {list.map((page) => {
        const title = page.frontmatter?.title ?? (isArabic ? "بدون عنوان" : "Untitled")
        const dateObj = getDate(cfg, page)
        const dateFormatted = dateObj
          ? `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}-${String(dateObj.getDate()).padStart(2, "0")}`
          : ""
        return (
          <div class="tadwinat-item" key={page.slug}>
            <a
              href={resolveRelative(fileData.slug!, page.slug!)}
              class="tadwinat-title-link"
            >
              {title}
            </a>
            <span class="tadwinat-dots" />
            <time class="tadwinat-date">{dateFormatted}</time>
          </div>
        )
      })}
    </div>
  )
}

PageList.css = `
.page-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0;
  list-style: none;
  margin-top: 2rem;
  width: 100%;
}

.page-item {
  display: flex;
  flex-direction: column;
  background-color: transparent;
  border: none;
  border-bottom: 1px dashed var(--lightgray);
  padding-bottom: 1.2rem;
  overflow: visible;
  transition: none;
}

.page-item:last-child {
  border-bottom: none;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;
}

.item-title {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 700;
  line-height: 1.4;
  font-family: var(--headerFont);
}

.item-title a, .item-title a.internal {
  color: var(--dark);
  text-decoration: none;
  background-color: transparent;
  padding: 0;
}

.item-title a:hover {
  color: var(--secondary);
  text-decoration: underline;
}

.item-date {
  font-size: 0.85rem;
  color: var(--gray);
  white-space: nowrap;
}

.item-description {
  color: var(--darkgray);
  font-size: 0.95rem;
  line-height: 1.6 !important;
  margin: 0.5rem 0 0 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-meta {
  margin-top: 0.6rem;
  font-size: 0.85rem;
  color: var(--gray);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.inline-tag {
  color: var(--secondary) !important;
  text-decoration: none !important;
  padding: 0 0.2rem !important;
  font-weight: 500;
}

.inline-tag:hover {
  text-decoration: underline !important;
}

.meta-dot {
  margin: 0 0.4rem;
}

.tag-spacer {
  margin-right: 0.4rem;
}

/* ==============================
   Article Pagination Controls
   ============================== */
.article-pagination {
  display: none;
  direction: ltr;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2.5rem 0 1rem;
  flex-wrap: wrap;
}

.article-pagination {
  display: flex;
}

.article-pagination button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 2.2rem;
  height: 2.2rem;
  padding: 0 0.6rem;
  border: 1px dashed var(--lightgray);
  border-radius: 6px;
  background: transparent;
  color: var(--dark);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.article-pagination button:hover:not(:disabled) {
  background: var(--highlight);
  border-color: var(--gray);
  color: var(--secondary);
}

.article-pagination button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.article-pagination button.active {
  background: var(--secondary);
  color: var(--light);
  border-color: var(--secondary);
  font-weight: bold;
}

.article-pagination .page-info {
  font-size: 0.85rem;
  color: var(--gray);
  padding: 0 0.5rem;
  white-space: nowrap;
}

[dir="rtl"] .article-pagination {
  direction: rtl;
}
`
