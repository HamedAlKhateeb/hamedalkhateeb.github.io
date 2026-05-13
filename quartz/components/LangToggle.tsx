// @ts-ignore
import langToggleScript from "./scripts/langtoggle.inline"
import styles from "./styles/langtoggle.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const LangToggle: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "lang-toggle-container")}>
      <button class="lang-toggle" id="lang-toggle-btn" title="Switch Language / تبديل اللغة" aria-label="Switch Language">
        <span class="lang-label" id="lang-label-show">EN</span>
      </button>
    </div>
  )
}

LangToggle.afterDOMLoaded = langToggleScript
LangToggle.css = styles

export default (() => LangToggle) satisfies QuartzComponentConstructor
