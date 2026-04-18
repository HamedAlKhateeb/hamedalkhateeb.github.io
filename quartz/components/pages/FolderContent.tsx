import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"
import { QuartzPluginData } from "../../plugins/vfile"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"
import { trieFromAllFiles } from "../../util/ctx"
import { resolveRelative } from "../../util/path"

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

    const trie = (props.ctx.trie ??= trieFromAllFiles(allFiles))
    const folder = trie.findNode(fileData.slug!.split("/"))
    if (!folder) {
      return null
    }

    let allPagesInFolder: QuartzPluginData[] = []
    if (fileData.slug === "index") {
      allPagesInFolder = allFiles.filter(
        (page) => page.slug && page.slug !== "index" && !page.slug.endsWith("/index")
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
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")
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

    const totalMinutes = allPagesInFolder.reduce((acc, page) => {
      // Estimate reading time for all articles roughly or just omit
      return acc + 15 // Static estimate or calculate if possible
    }, 0)

    return (
      <section class="page-container">
        <header class="main-header">
          <h1 class="title">
            <a href={resolveRelative(fileData.slug!, fileData.slug!)} class="internal title-link">{fileData.frontmatter?.title || "مقالات"}</a>
          </h1>
          {fileData.description && <p class="subtitle">{fileData.description}</p>}

          {options.showFolderCount && (
             <p class="meta-data">{allPagesInFolder.length} مقال</p>
          )}
        </header>

        <div class="cards-grid">
          <PageList {...listProps} />
        </div>
      </section>
    )
  }

  FolderContent.css = concatenateResources(style, PageList.css, `
.page-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
}

.main-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 50px;
}

.main-header .title {
  margin-bottom: 0.5rem;
  font-family: var(--headerFont);
}

.title-link {
  color: inherit;
  text-decoration: none;
}
.title-link:hover {
  text-decoration: none;
  opacity: 0.8;
}

.main-header .subtitle {
  color: var(--gray);
  margin-bottom: 1.5rem;
}

.headers-container {
  margin: 20px 0;
  width: 100%;
}

.meta-data {
  color: var(--darkgray);
  font-size: 0.95rem;
  margin-top: 1rem;
}
  `)
  return FolderContent
}) satisfies QuartzComponentConstructor
