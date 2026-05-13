import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [
    Component.LangToggle(),
    Component.Search(),
    Component.Darkmode(),
  ],
  afterBody: [
    Component.Comments({
      provider: 'firebase',
      options: {
        apiKey: "AIzaSyAlNrI6ZSHNcQtlsgJP0pILiSd_RkBnxZY",
        authDomain: "myblog-713fc.firebaseapp.com",
        projectId: "myblog-713fc",
        storageBucket: "myblog-713fc.firebasestorage.app",
        messagingSenderId: "147793270885",
        appId: "1:147793270885:web:e2b3b36914a06a25108e8c",
        measurementId: "G-KDJLN0GLCH"
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
      "Facebook": "https://www.facebook.com/profile.php?id=61570158555241",
      "RSS": "/index.xml"
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
