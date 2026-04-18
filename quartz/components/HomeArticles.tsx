import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { PageList } from "./PageList"

export default (() => {
  const HomeArticles: QuartzComponent = (props: QuartzComponentProps) => {
    const { fileData, allFiles } = props
    if (fileData.slug !== 'index') return null

    // Filter out index pages and sort by date
    const pages = allFiles
      .filter(page => page.slug && page.slug !== 'index' && !page.slug.endsWith('/index') && !page.slug.startsWith('tags/'))
      .sort((a, b) => {
        const aDate = a.dates?.published ?? new Date('1970-01-01')
        const bDate = b.dates?.published ?? new Date('1970-01-01')
        return bDate.getTime() - aDate.getTime()
      })

    const listProps = { ...props, allFiles: pages }

    return (
      <div class="cards-grid">
        <PageList {...listProps} />
      </div>
    )
  }

  HomeArticles.css = PageList.css; return HomeArticles
}) satisfies QuartzComponentConstructor
