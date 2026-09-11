import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot, simplifySlug } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"
export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ||
      fileData.frontmatter?.description ||
      unescapeHTML(fileData.description?.trim() || "") ||
      i18n(cfg.locale).propertyDefaults.description

    const { css, js, additionalHead } = externalResources

    const origin = `https://${(cfg.baseUrl ?? "example.com").replace(/\/+$/, "")}`
    const url = new URL(origin + "/")
    const path = url.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/thumbnails/icon.png")

    // Url of current page (canonical: strip trailing `/index` via simplifySlug,
    // which keeps trailing `/` for folder indexes so Google doesn't discover
    // `/index` or `/ar` variants that 301 to `/` or `/ar/`)
    const slug = fileData.slug!
    const simplified = simplifySlug(slug)
    let canonicalUrl: string
    if (fileData.slug === "404" || simplified === "/") {
      canonicalUrl = origin + "/"
    } else {
      canonicalUrl = origin + "/" + simplified.replace(/^\/+|\/+$/g, "")
    }
    const socialUrl = canonicalUrl

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )
    const frontmatterImage = fileData.frontmatter?.cover ?? fileData.frontmatter?.image
    const resolveOgImage = (img: string): string => {
      // absolute URL already → use as-is (LinkedIn requires absolute https)
      if (/^https?:\/\//i.test(img)) return img
      // protocol-relative → force https
      if (img.startsWith("//")) return `https:${img}`
      // root-relative or vault-relative → join with origin
      const clean = img.startsWith("/") ? img : `/${img}`
      return `${origin}${clean}`
    }
    // Default: JPG 1200x630 — لينكدإن لا يدعم WebP بشكل موثوق، فاستخدم JPG
    const ogImageDefaultPath = frontmatterImage
      ? resolveOgImage(String(frontmatterImage))
      : `${origin}/static/thumbnails/og-image.jpg`
    const ogImageExt =
      getFileExtension(ogImageDefaultPath)?.replace(/^\./, "").toLowerCase() ?? "jpeg"
    const ogImageMime = ogImageExt === "jpg" ? "jpeg" : ogImageExt

    // article vs website: المقالات تكون article عشان لينكدإن يعرضها صح
    const isFolderOrIndex =
      slug === "index" || slug.endsWith("/index") || slug === "tags" || slug.startsWith("tags/")
    const ogType = isFolderOrIndex ? "website" : "article"
    const isArabicPage = slug.toLowerCase().startsWith("ar")
    const ogLocale = isArabicPage ? "ar_AR" : "en_US"
    const ogLocaleAlt = isArabicPage ? "en_US" : "ar_AR"

    return (
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3QGXK7JG0G"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-3QGXK7JG0G');
        `,
          }}
        ></script>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;600&family=Amiri:ital,wght@0,400;0,700;1,400&family=Aref+Ruqaa:wght@400;700&family=Cairo:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
            />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta property="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content={ogType} />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:locale:alternate" content={ogLocaleAlt} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={title} />
        <meta name="author" content={cfg.pageTitle} />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:secure_url" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta name="twitter:image:alt" content={title} />
            <meta property="og:image:type" content={`image/${ogImageMime}`} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
          </>
        )}

        {ogType === "article" && (
          <>
            {fileData.dates?.published && (
              <meta
                property="article:published_time"
                content={fileData.dates.published.toISOString()}
              />
            )}
            {fileData.dates?.modified && (
              <meta
                property="article:modified_time"
                content={fileData.dates.modified.toISOString()}
              />
            )}
            <meta property="article:author" content={cfg.pageTitle} />
            {(fileData.frontmatter?.tags ?? []).map((tag) => (
              <meta property="article:tag" content={tag} />
            ))}
          </>
        )}

        {cfg.baseUrl && (
          <>
            <link rel="canonical" href={canonicalUrl}></link>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
          </>
        )}

        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />
        <meta
          name="google-site-verification"
          content="RvjcbTmq75nTxaiEgp-3J8I6NuH6KvkhxUsITh_zUSU"
        />
        <script
          src={joinSegments(baseDir, "static/math-canvas.js")}
          defer
          data-persist="true"
        ></script>

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
