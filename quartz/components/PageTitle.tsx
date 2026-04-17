import { pathToRoot } from "../util/path"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { i18n } from "../i18n"

const PageTitle: QuartzComponent = ({ fileData, cfg, displayClass }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? i18n(cfg.locale).propertyDefaults.title
  const baseDir = pathToRoot(fileData.slug!)
  return (
    <div class={classNames(displayClass, "page-title-container")}>
      <h1 class="page-title">
        <a href={baseDir}>{title}</a>
      </h1>
      <p class="page-subtitle">ما صفحت الأقلام، ما طوى الطير، وما يروي العليل</p>
    </div>
  )
}

PageTitle.css = `
.page-title-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0 1rem 0;
  width: 100%;
}

.page-title {
  font-size: 3.5rem;
  margin: 0;
  font-family: var(--titleFont);
  font-weight: 800;
}

.page-subtitle {
  color: var(--gray);
  font-size: 1.1rem;
  margin-top: 0.5rem;
  font-style: italic;
  font-family: var(--titleFont);
}
`

export default (() => PageTitle) satisfies QuartzComponentConstructor
