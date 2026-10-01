import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"
import { AutoRTL } from "./quartz/plugins/transformers/autoRTL"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "حامد الخطيب",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "hamedalkhateeb.pages.dev",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Noto Sans Arabic",
        body: "Amiri",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#f5f0e8",
          lightgray: "#e7e0d3",
          gray: "#78716c",
          darkgray: "#292524",
          dark: "#1c1917",
          secondary: "#1c1917",
          tertiary: "#d97706",
          highlight: "rgba(251, 191, 36, 0.18)",
          textHighlight: "#fbbf2488",
        },
        darkMode: {
          light: "#191716",
          lightgray: "#292524",
          gray: "#a8a29e",
          darkgray: "#e7e5e4",
          dark: "#fafaf9",
          secondary: "#fbbf24",
          tertiary: "#f59e0b",
          highlight: "rgba(251, 191, 36, 0.15)",
          textHighlight: "#fbbf2488",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest", openLinksInNewTab: true }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
      AutoRTL(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
        rssLimit: 25,
      }),
      // فيد عربي مستقل (ar.xml) وفيد إنجليزي مستقل (en.xml) — sitemap يبقى كاملًا
      Plugin.ContentIndex({
        enableSiteMap: false,
        enableRSS: true,
        rssLimit: 25,
        rssSlug: "ar",
        rssFilter: (slug) => slug === "ar" || slug.startsWith("ar/"),
      }),
      Plugin.ContentIndex({
        enableSiteMap: false,
        enableRSS: true,
        rssLimit: 25,
        rssSlug: "en",
        rssFilter: (slug) => !(slug === "ar" || slug.startsWith("ar/")),
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      // Plugin.CustomOgImages(),
    ],
  },
}

export default config
