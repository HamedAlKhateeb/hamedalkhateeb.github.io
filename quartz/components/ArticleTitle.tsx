import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title
  const cover = (fileData.frontmatter?.cover ?? fileData.frontmatter?.image) as string | undefined;
  
  if (title && title !== "الرئيسية") {
    return (
      <div class={classNames(displayClass, "article-title-container")}>
        <h1 class="article-title">{title}</h1>
        {cover && <img src={cover} alt={title} class="article-cover" />}
      </div>
    )
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title-container {
  margin: 2rem 0 0 0;
}

.article-title {
  margin: 0;
}

.article-cover {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-top: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: block;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
