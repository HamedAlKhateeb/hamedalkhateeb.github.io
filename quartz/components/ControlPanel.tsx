// @ts-ignore
import controlPanelScript from "./scripts/controlpanel.inline"
// @ts-ignore
import readingEnhancementsScript from "./scripts/readingenhancements.inline"
import styles from "./styles/controlpanel.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ControlPanel: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const slug = fileData.slug ?? ""
  const isArabic = slug.toLowerCase().startsWith("ar/") || slug.toLowerCase() === "ar"

  // Localization variables
  const scrollTopTitle = isArabic ? "أعلى الصفحة" : "Top of Page"

  return (
    <div class={classNames(displayClass, "control-panel-root")}>
      {/* Top Reading Progress Bar */}
      <div id="reading-progress-bar"></div>

      {/* Scroll to Top - Bottom Left */}
      <div class="scroll-to-top-dock">
        <div id="reading-time-info" class="reading-time-info" style="display: none;">
          <span id="reading-time-remaining"></span>
        </div>
        <button id="btn-scroll-top" class="dock-btn" title={scrollTopTitle}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M12 19V5" />
            <path d="m5 12 7-7 7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

ControlPanel.afterDOMLoaded = controlPanelScript + "\n" + readingEnhancementsScript
ControlPanel.css = styles

export default (() => ControlPanel) satisfies QuartzComponentConstructor
