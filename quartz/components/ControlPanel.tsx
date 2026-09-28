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
  const goBackTitle = isArabic ? "رجوع للصفحة السابقة" : "Go Back"
  const readingSettingsTitle = isArabic ? "إعدادات القراءة" : "Reading Settings"
  const fontSizeLabel = isArabic ? "حجم الخط" : "Font Size"
  const largeLabel = isArabic ? "كبير" : "Large"
  const mediumLabel = isArabic ? "متوسط" : "Medium"
  const smallLabel = isArabic ? "صغير" : "Small"
  const lineHeightLabel = isArabic ? "ارتفاع السطر" : "Line Height"
  const wideLabel = isArabic ? "واسع" : "Wide"
  const narrowLabel = isArabic ? "ضيق" : "Narrow"
  const themeLabel = isArabic ? "وضع الألوان" : "Color Theme"
  const darkLabel = isArabic ? "داكن" : "Dark"
  const sepiaLabel = isArabic ? "رملي" : "Sepia"
  const lightLabel = isArabic ? "فاتح" : "Light"
  const readingWidthLabel = isArabic ? "عرض القراءة" : "Reading Width"
  const audioLabel = isArabic ? "الصوت" : "Audio"
  const tocLabel = isArabic ? "الفهرس" : "TOC"
  const audioToggleTitle = isArabic ? "تفعيل / إيقاف الصوت" : "Toggle Audio"
  const tocToggleTitle = isArabic ? "تفعيل / إيقاف الفهرس" : "Toggle TOC"
  const audioActiveText = isArabic ? "مفعل" : "On"
  const audioInactiveText = isArabic ? "إيقاف" : "Off"
  const toggleOpenText = isArabic ? "تفعيل" : "Open"

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

      {/* Back Button - Top Right */}
      {slug !== "index" && (
        <div class="back-to-prev-dock">
          <button id="btn-back" class="dock-btn" title={goBackTitle}>
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
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>
      )}

    </div>
  )
}

ControlPanel.afterDOMLoaded = controlPanelScript + "\n" + readingEnhancementsScript
ControlPanel.css = styles

export default (() => ControlPanel) satisfies QuartzComponentConstructor
