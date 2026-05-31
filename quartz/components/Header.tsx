import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative, pathToRoot } from "../util/path"

const Header: QuartzComponent = ({ children, fileData }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  const isArabic = slug.toLowerCase().startsWith("ar/") || slug.toLowerCase() === "ar"
  const isPoetry = slug.toLowerCase().startsWith("ar/poetry/") || slug.toLowerCase() === "ar/poetry"

  const baseDir = pathToRoot(fileData.slug!)

  if (isArabic) {
    const headerTitle = isPoetry ? "ديوان حامد" : "مجلة حامد"
    return (
      <header class="arabic-header">
        <div class="header-inner">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              margin: "0",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <h1>
              <a
                href={resolveRelative(fileData.slug!, "ar" as FullSlug)}
                class="arabic-header-title"
              >
                {headerTitle}
              </a>
            </h1>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>{children}</div>
          </div>
          <nav class="navbar arabic-navbar">
            <a href={resolveRelative(fileData.slug!, "ar/articles" as FullSlug)}>مقالاتي</a>
            <a href={resolveRelative(fileData.slug!, "ar/poetry" as FullSlug)}>أشعاري</a>
            <a
              href={resolveRelative(fileData.slug!, "index" as FullSlug)}
              class="language-portal-capsule"
              data-router-ignore
              style={{
                marginRight: "auto",
                marginLeft: "0",
                fontFamily: "var(--bodyFont)",
                direction: "ltr",
              }}
              title="English Version"
            >
              English
            </a>
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header>
      <div class="header-inner">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            margin: "0",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h1>
            <a href={baseDir} class="english-header-title">
              Hamed
            </a>
          </h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>{children}</div>
        </div>
        <nav class="navbar english-navbar">
          <a href={resolveRelative(fileData.slug!, "Math" as FullSlug)}>Math</a>
          <a href={resolveRelative(fileData.slug!, "Engineering" as FullSlug)}>Engineering</a>
          <a href={resolveRelative(fileData.slug!, "Culture" as FullSlug)}>Culture</a>
          <a href={resolveRelative(fileData.slug!, "Experiences" as FullSlug)}>Experiences</a>
          <a href={resolveRelative(fileData.slug!, "About" as FullSlug)}>About</a>
          <a href={resolveRelative(fileData.slug!, "ar" as FullSlug)} class="language-portal-capsule" style={{ marginLeft: "auto", marginRight: "0" }} title="النسخة العربية">
            العربية
          </a>
        </nav>
      </div>
    </header>
  )
}

export default (() => Header) satisfies QuartzComponentConstructor
