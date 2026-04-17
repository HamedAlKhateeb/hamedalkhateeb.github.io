import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, joinSegments } from "../util/path"

const Header: QuartzComponent = ({ displayName, fileData, cfg, tree }: QuartzComponentProps) => {
  return (
    <header>
      <div class="header-inner">
        <h1>مدونة حامد الخطيب</h1>
        <nav class="navbar">
          <a href="/Math">رياضيات</a>
          <a href="/Culture">ثقافة</a>
          <a href="/Engineering">هندسة</a>
          <a href="/Programming">برمجة</a>
          <a href="/Experiences">تجارب</a>
          <a href="/Personal">شخصي</a>
          <a href="/Poetry">أشعاري</a>
          <a href="/Archive">مقالات قديمة</a>
          <a href="/About">من أنا</a>
        </nav>
      </div>
    </header>
  )
}

export default (() => Header) satisfies QuartzComponentConstructor
