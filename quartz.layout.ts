import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.Search(),
    Component.Darkmode(),
  ],
  afterBody: [
    Component.Comments({
      provider: 'giscus',
      options: {
        // from data-repo
        repo: 'HamedAlKhateeb/HamedAlKhateeb.github.io', // أو [ضع رابط المستودع هنا] بصيغة (user/repo)
        // from data-repo-id
        repoId: '[ضع معرف المستودع هنا]',
        // from data-category
        category: '[ضع اسم القسم هنا]',
        // from data-category-id
        categoryId: '[ضع معرف القسم هنا]',
        mapping: 'pathname',
        strict: false,
        reactionsEnabled: true,
        inputPosition: 'bottom',
        lang: 'ar'
      }
    }),
    Component.Newsletter(),
    Component.ArticleFooter(),
    Component.ControlPanel(),
  ],
  footer: Component.Footer({
    links: {
      "LinkedIn": "https://www.linkedin.com/in/hamed-al-khateeb-756661302/",
      "X": "https://x.com/HamedAlkhateeb5",
      "Facebook": "https://www.facebook.com/profile.php?id=61570158555241"
    },
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ArticleTitle(),
    Component.TagList(),
    Component.HomeArticles(),
  ],
  left: [],
  right: [Component.TableOfContents()],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs()],
  left: [],
  right: [],
}
