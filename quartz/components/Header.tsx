import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative, pathToRoot } from "../util/path"

const Header: QuartzComponent = ({ children, fileData }: QuartzComponentProps) => {
  const slug = (fileData.slug ?? "").toLowerCase()
  const isEnglish = slug.startsWith("en/") || slug === "en" || slug.includes("/en/")
  const baseDir = pathToRoot(fileData.slug!)

  // Path matches
  const isMicro = slug.startsWith("ar/micro") || slug === "micro"
  const isArticles = slug.startsWith("ar/articles") || slug === "post" || slug.startsWith("post/")
  const isPoetry = slug.startsWith("ar/poetry")
  const isAbout = slug.startsWith("about") || slug.startsWith("ar/about")

  if (!isEnglish) {
    return (
      <header class="site-header alfarhan-header" dir="rtl">
        <div class="site-header-inner alfarhan-header-inner">
          <div class="site-brand alfarhan-brand">
            <a href={resolveRelative(fileData.slug!, "" as FullSlug)} class="brand-link">
              <span class="brand-chevron">&gt;</span>
              <span class="brand-name">حامد الخطيب</span>
            </a>
          </div>
          <nav class="site-nav alfarhan-nav" aria-label="التنقل الرئيسي">
            <a
              href={resolveRelative(fileData.slug!, "ar/micro" as FullSlug)}
              class={`site-nav-link alfarhan-nav-link ${isMicro ? "is-active" : ""}`}
            >
              <span class="nav-ico">📍</span>
              <span>شذرات</span>
            </a>
            <a
              href={resolveRelative(fileData.slug!, "ar/articles" as FullSlug)}
              class={`site-nav-link alfarhan-nav-link ${isArticles ? "is-active" : ""}`}
            >
              <span class="nav-ico">🖊️</span>
              <span>تدوينات</span>
            </a>
            <a
              href="#newsletter"
              class="site-nav-link alfarhan-nav-link"
            >
              <span class="nav-ico">✉️</span>
              <span>النشرة</span>
            </a>
            <a
              href={resolveRelative(fileData.slug!, "ar/poetry" as FullSlug)}
              class={`site-nav-link alfarhan-nav-link ${isPoetry ? "is-active" : ""}`}
            >
              <span class="nav-ico">📜</span>
              <span>ديوان الشعر</span>
            </a>
            <a
              href={resolveRelative(fileData.slug!, "About" as FullSlug)}
              class={`site-nav-link alfarhan-nav-link ${isAbout ? "is-active" : ""}`}
            >
              <span class="nav-ico">👤</span>
              <span>عنّي</span>
            </a>
            <div class="site-nav-tools">
              {children}
            </div>
          </nav>
        </div>
      </header>
    )
  }

  // English Header
  return (
    <header class="site-header alfarhan-header" dir="ltr">
      <div class="site-header-inner alfarhan-header-inner">
        <div class="site-brand alfarhan-brand">
          <a href={baseDir} class="brand-link">
            <span class="brand-chevron">&gt;</span>
            <span class="brand-name">Hamed Alkhateeb</span>
          </a>
        </div>
        <nav class="site-nav alfarhan-nav" aria-label="Main Navigation">
          <a
            href={resolveRelative(fileData.slug!, "Experiences" as FullSlug)}
            class="site-nav-link alfarhan-nav-link"
          >
            <span class="nav-ico">🖊️</span>
            <span>Writings</span>
          </a>
          <a
            href={resolveRelative(fileData.slug!, "ar/micro" as FullSlug)}
            class="site-nav-link alfarhan-nav-link"
          >
            <span class="nav-ico">📍</span>
            <span>Snippets</span>
          </a>
          <a
            href={resolveRelative(fileData.slug!, "About" as FullSlug)}
            class="site-nav-link alfarhan-nav-link"
          >
            <span class="nav-ico">👤</span>
            <span>About</span>
          </a>
          <a
            href={baseDir}
            class="site-nav-link alfarhan-nav-link"
            title="النسخة العربية"
          >
            العربية
          </a>
          <div class="site-nav-tools">
            {children}
          </div>
        </nav>
      </div>
    </header>
  )
}

export default (() => Header) satisfies QuartzComponentConstructor
