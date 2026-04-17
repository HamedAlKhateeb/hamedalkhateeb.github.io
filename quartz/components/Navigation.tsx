import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { FullSlug, resolveRelative } from "../util/path"

const Navigation: QuartzComponent = ({ displayClass, fileData }: QuartzComponentProps) => {
  return null
}

Navigation.css = `
.top-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1.5rem 0 3rem 0;
  width: 100%;
}

.top-navigation ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 1.5rem;
  align-items: center;
  border-top: 2px solid var(--gray);
  border-bottom: 2px solid var(--gray);
  padding: 0.5rem 2rem;
  border-radius: 50px;
}

.top-navigation li a {
  text-decoration: none;
  color: var(--dark);
  font-weight: 600;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.top-navigation li a:hover {
  opacity: 1;
}

.top-navigation li.separator {
  color: var(--gray);
  font-size: 0.8rem;
  user-select: none;
}
`

export default (() => Navigation) satisfies QuartzComponentConstructor