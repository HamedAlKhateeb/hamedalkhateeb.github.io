import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, joinSegments, resolveRelative } from "../util/path"

const Header: QuartzComponent = ({ children, displayName, fileData, cfg, tree }: QuartzComponentProps) => {
  return (
    <header>
      <div class="header-inner">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", margin: "0", flexWrap: "wrap", gap: "1rem" }}><h1><a href="https://hamedalkhateeb.github.io/">مدونة حامد الخطيب</a></h1><div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>{children}</div></div>
        <nav class="navbar">
          <a href={resolveRelative(fileData.slug!, "Math" as FullSlug)}>رياضيات</a>
          <a href={resolveRelative(fileData.slug!, "Culture" as FullSlug)}>ثقافة</a>
          <a href={resolveRelative(fileData.slug!, "Engineering" as FullSlug)}>هندسة</a>
          <a href={resolveRelative(fileData.slug!, "Programming" as FullSlug)}>برمجة</a>
          <a href={resolveRelative(fileData.slug!, "Experiences" as FullSlug)}>تجارب</a>
          <a href={resolveRelative(fileData.slug!, "Personal" as FullSlug)}>شخصي</a>
          <a href={resolveRelative(fileData.slug!, "Poetry" as FullSlug)}>أشعاري</a>
          <a href={resolveRelative(fileData.slug!, "Archive" as FullSlug)}>مقالات قديمة</a>
          <a href={resolveRelative(fileData.slug!, "About" as FullSlug)}>من أنا</a>
        </nav>
      </div>
    </header>
  )
}

export default (() => Header) satisfies QuartzComponentConstructor
