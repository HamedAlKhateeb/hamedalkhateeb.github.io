import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { QuartzPluginData } from "../../plugins/vfile"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"
import { trieFromAllFiles } from "../../util/ctx"
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
    const { tree, fileData, allFiles } = props

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
            // regular file, proceed
            if (node.data) {
              return node.data
            }

            if (node.isFolder && options.showSubfolders) {
              // folders that dont have data need synthetic files
              const getMostRecentDates = (): QuartzPluginData["dates"] => {
                let maybeDates: QuartzPluginData["dates"] | undefined = undefined
                for (const child of node.children) {
                  if (child.data?.dates) {
                    // compare all dates and assign to maybeDates if its more recent or its not set
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

    const isArabicHome = fileData.slug === "ar" || fileData.slug === "ar/index"

    // Filter Arabic articles and poetry for the homepage
    const arabicArticles = allFiles.filter(
      (f) =>
        f.slug?.toLowerCase().startsWith("ar/articles/") &&
        !f.slug.toLowerCase().endsWith("index"),
    )
    const arabicPoetry = allFiles.filter(
      (f) =>
        f.slug?.toLowerCase().startsWith("ar/poetry/") &&
        !f.slug.toLowerCase().endsWith("index"),
    )

    const sortByDate = (a: QuartzPluginData, b: QuartzPluginData) => {
      const aDate = a.dates?.published ?? new Date("1970-01-01")
      const bDate = b.dates?.published ?? new Date("1970-01-01")
      return bDate.getTime() - aDate.getTime()
    }

    const latestArticles = arabicArticles.sort(sortByDate).slice(0, 2)
    const latestPoems = arabicPoetry.sort(sortByDate).slice(0, 2)

    return (
      <section class="page-container">
        {!isArabicHome && (
          <header class="main-header">
            {options.showFolderCount && fileData.slug !== "About/index" && (
              <p class="meta-data">{allPagesInFolder.length} مقال</p>
            )}
          </header>
        )}

        <div class="folder-content-body">{content}</div>

        {isArabicHome && (
          <div class="arabic-homepage-sections">
            {latestArticles.length > 0 && (
              <section class="homepage-section arabic-section">
                <h2 class="arabic-section-title">آخر المقالات</h2>
                <div class="cards-grid">
                  <PageList {...listProps} allFiles={latestArticles} />
                </div>
              </section>
            )}

            {latestPoems.length > 0 && (
              <section class="homepage-section arabic-section">
                <h2 class="arabic-section-title">آخر الأشعار</h2>
                <div class="cards-grid">
                  <PageList {...listProps} allFiles={latestPoems} />
                </div>
              </section>
            )}
          </div>
        )}

        {!isArabicHome && (
          <div class="cards-grid">
            <PageList {...listProps} />
          </div>
        )}
      </section>
    )
  }

  FolderContent.css = concatenateResources(style, PageList.css)

  FolderContent.afterDOMLoaded = paginationScript
  return FolderContent
}) satisfies QuartzComponentConstructor
