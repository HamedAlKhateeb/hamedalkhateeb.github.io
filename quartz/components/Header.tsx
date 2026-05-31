import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative, pathToRoot } from "../util/path"

const Header: QuartzComponent = ({ children, fileData }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  const isArabic = slug.toLowerCase().startsWith("ar/") || slug.toLowerCase() === "ar"
  const isPoetry = slug.toLowerCase().startsWith("ar/poetry/") || slug.toLowerCase() === "ar/poetry"

  const baseDir = pathToRoot(fileData.slug!)

  if (isArabic) {
    if (isPoetry) {
      return (
        <header class="poetry-header">
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
                <a href={resolveRelative(fileData.slug!, "ar/poetry" as FullSlug)}>
                  ديوان حامد الخطيب
                </a>
              </h1>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>{children}</div>
            </div>
            <nav class="navbar poetry-navbar">
              <a href={resolveRelative(fileData.slug!, "ar" as FullSlug)}>الصدر</a>
              <a href={resolveRelative(fileData.slug!, "About" as FullSlug)}>تواصل معي</a>
              <a href={resolveRelative(fileData.slug!, "ar/poetry" as FullSlug)}>أشعاري</a>
              <a href={resolveRelative(fileData.slug!, "ar/articles" as FullSlug)}>مقالاتي</a>
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
              <a href={resolveRelative(fileData.slug!, "ar" as FullSlug)}>مدونة حامد الخطيب</a>
            </h1>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>{children}</div>
          </div>
          <nav class="navbar">
            <a href={resolveRelative(fileData.slug!, "ar" as FullSlug)}>الصدر</a>
            <a href={resolveRelative(fileData.slug!, "About" as FullSlug)}>تواصل معي</a>
            <a href={resolveRelative(fileData.slug!, "ar/poetry" as FullSlug)}>أشعاري</a>
            <a href={resolveRelative(fileData.slug!, "ar/articles" as FullSlug)}>مقالاتي</a>
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
            <a href={baseDir}>Hamed Al-Khateeb</a>
          </h1>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>{children}</div>
        </div>
        <nav class="navbar">
          <a href={resolveRelative(fileData.slug!, "Math" as FullSlug)}>Math</a>
          <a href={resolveRelative(fileData.slug!, "Culture" as FullSlug)}>Culture</a>
          <a href={resolveRelative(fileData.slug!, "Engineering" as FullSlug)}>Engineering</a>
          <a href={resolveRelative(fileData.slug!, "Experiences" as FullSlug)}>Experiences</a>
          <a href={resolveRelative(fileData.slug!, "Personal" as FullSlug)}>Personal</a>
          <a href={resolveRelative(fileData.slug!, "ar/poetry" as FullSlug)}>Poetry</a>
          <a href={resolveRelative(fileData.slug!, "About" as FullSlug)}>About</a>
          <a
            href={resolveRelative(fileData.slug!, "ar" as FullSlug)}
            style={{ fontWeight: "bold", color: "var(--tertiary)" }}
          >
            العربية
          </a>
        </nav>
      </div>
    </header>
  )
}

export default (() => Header) satisfies QuartzComponentConstructor
