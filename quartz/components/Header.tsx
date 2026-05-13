import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, joinSegments, resolveRelative, pathToRoot } from "../util/path"

const Header: QuartzComponent = ({ children, displayName, fileData, cfg, tree }: QuartzComponentProps) => {
  const isPoetry = fileData.slug !== undefined && fileData.slug.toLowerCase().startsWith("poetry/")

  const baseDir = pathToRoot(fileData.slug!)

  if (isPoetry) {
    return (
      <header class="poetry-header">
        <div class="header-inner">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", margin: "0", flexWrap: "wrap", gap: "1rem" }}>
            <h1><a href={resolveRelative(fileData.slug!, "poetry" as FullSlug)} data-lang-en="Hamed Al-Khateeb's Poetry">ديوان حامد الخطيب</a></h1>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>{children}</div>
          </div>
          <nav class="navbar poetry-navbar">
            <a href={resolveRelative(fileData.slug!, "poetry" as FullSlug)} data-lang-en="Poems Index">فهرس القصائد</a>
            <a href={baseDir} data-lang-en="Blog">المدونة</a>
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header>
      <div class="header-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", margin: "0", flexWrap: "wrap", gap: "1rem" }}><h1><a href={baseDir} data-lang-en="Hamed Al-Khateeb's Blog">مدونة حامد الخطيب</a></h1><div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>{children}</div></div>
        <nav class="navbar">
          <a href={resolveRelative(fileData.slug!, "Math" as FullSlug)} data-lang-en="Math">رياضيات</a>
          <a href={resolveRelative(fileData.slug!, "Culture" as FullSlug)} data-lang-en="Culture">ثقافة</a>
          <a href={resolveRelative(fileData.slug!, "Engineering" as FullSlug)} data-lang-en="Engineering">هندسة</a>
          <a href={resolveRelative(fileData.slug!, "Experiences" as FullSlug)} data-lang-en="Experiences">تجارب</a>
          <a href={resolveRelative(fileData.slug!, "Personal" as FullSlug)} data-lang-en="Personal">شخصي</a>
          <a href={resolveRelative(fileData.slug!, "poetry" as FullSlug)} data-lang-en="Poetry">أشعاري</a>
          <a href={resolveRelative(fileData.slug!, "About" as FullSlug)} data-lang-en="About">من أنا</a>
        </nav>
      </div>
    </header>
  )
}

export default (() => Header) satisfies QuartzComponentConstructor
