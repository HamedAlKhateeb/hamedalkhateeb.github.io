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
  const bookmarksLabel = isArabic ? "الإشارات" : "Bookmarks"
  const bookmarksHeaderLabel = isArabic ? "الإشارات المرجعية" : "Bookmarks"
  const emptyBookmarksLabel = isArabic
    ? "لا توجد علامات مرجعية بعد. يمكنك حفظ أي فقرة عند القراءة."
    : "No bookmarks yet. You can save any paragraph while reading."
  const audioToggleTitle = isArabic ? "تفعيل / إيقاف الصوت" : "Toggle Audio"
  const tocToggleTitle = isArabic ? "تفعيل / إيقاف الفهرس" : "Toggle TOC"
  const bookmarksToggleTitle = isArabic ? "عرض الإشارات المرجعية" : "View Bookmarks"
  const audioActiveText = isArabic ? "مفعل" : "On"
  const audioInactiveText = isArabic ? "إيقاف" : "Off"
  const toggleOpenText = isArabic ? "فتح" : "Open"
  const closeLabel = isArabic ? "إغلاق" : "Close"

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

      {/* Settings Gear - Bottom Right, completely isolated */}
      {slug !== "index" && !slug.endsWith("index") && !slug.startsWith("tags/") && (
        <>
          <div class="isolated-gear-dock">
            <button id="btn-settings-toggle" class="dock-btn" title={readingSettingsTitle}>
              <svg
                class="gear-icon-svg"
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
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>

          {/* Settings Popover - Stacked immediately above the gear using CSS, not DOM nesting */}
          <div id="settings-panel" class="control-panel panel-collapsed isolated-settings-panel">
            {/* Font Size Control */}
            <div class="control-group">
              <span class="control-label">{fontSizeLabel}</span>
              <div class="control-buttons">
                <button id="btn-font-large" class="ctrl-btn" title={largeLabel}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="4 7 4 4 20 4 20 7"></polyline>
                    <line x1="9" y1="20" x2="15" y2="20"></line>
                    <line x1="12" y1="4" x2="12" y2="20"></line>
                  </svg>
                  <span class="btn-text">{largeLabel}</span>
                </button>
                <button id="btn-font-medium" class="ctrl-btn active" title={mediumLabel}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="4 7 4 4 20 4 20 7"></polyline>
                    <line x1="9" y1="20" x2="15" y2="20"></line>
                    <line x1="12" y1="4" x2="12" y2="20"></line>
                  </svg>
                  <span class="btn-text">{mediumLabel}</span>
                </button>
                <button id="btn-font-small" class="ctrl-btn" title={smallLabel}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="4 7 4 4 20 4 20 7"></polyline>
                    <line x1="9" y1="20" x2="15" y2="20"></line>
                    <line x1="12" y1="4" x2="12" y2="20"></line>
                  </svg>
                  <span class="btn-text">{smallLabel}</span>
                </button>
              </div>
            </div>

            <div class="control-divider"></div>

            {/* Line Height Control */}
            <div class="control-group">
              <span class="control-label">{lineHeightLabel}</span>
              <div class="control-buttons">
                <button id="btn-line-large" class="ctrl-btn" title={wideLabel}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m3 16 4 4 4-4"></path>
                    <path d="M7 20V4"></path>
                    <path d="m11 8-4-4-4 4"></path>
                    <path d="M15 12h6"></path>
                    <path d="M15 18h6"></path>
                    <path d="M15 6h6"></path>
                  </svg>
                  <span class="btn-text">{wideLabel}</span>
                </button>
                <button id="btn-line-medium" class="ctrl-btn active" title={mediumLabel}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m3 16 4 4 4-4"></path>
                    <path d="M7 20V4"></path>
                    <path d="m11 8-4-4-4 4"></path>
                    <path d="M15 12h6"></path>
                    <path d="M15 18h6"></path>
                    <path d="M15 6h6"></path>
                  </svg>
                  <span class="btn-text">{mediumLabel}</span>
                </button>
                <button id="btn-line-small" class="ctrl-btn" title={narrowLabel}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m3 16 4 4 4-4"></path>
                    <path d="M7 20V4"></path>
                    <path d="m11 8-4-4-4 4"></path>
                    <path d="M15 12h6"></path>
                    <path d="M15 18h6"></path>
                    <path d="M15 6h6"></path>
                  </svg>
                  <span class="btn-text">{narrowLabel}</span>
                </button>
              </div>
            </div>

            <div class="control-divider"></div>

            {/* Color Theme Control */}
            <div class="control-group">
              <span class="control-label">{themeLabel}</span>
              <div class="control-buttons">
                <button id="btn-theme-dark" class="ctrl-btn mode-dark" title={darkLabel}>
                  <div class="color-swatch swatch-dark"></div>
                  <span class="btn-text">{darkLabel}</span>
                </button>
                <button id="btn-theme-sepia" class="ctrl-btn mode-sepia" title={sepiaLabel}>
                  <div class="color-swatch swatch-sepia"></div>
                  <span class="btn-text">{sepiaLabel}</span>
                </button>
                <button id="btn-theme-light" class="ctrl-btn mode-light active" title={lightLabel}>
                  <div class="color-swatch swatch-light"></div>
                  <span class="btn-text">{lightLabel}</span>
                </button>
              </div>
            </div>

            <div class="control-divider"></div>

            {/* Content Width Control */}
            <div class="control-group">
              <span class="control-label">{readingWidthLabel}</span>
              <div class="control-buttons">
                <button id="btn-width-wide" class="ctrl-btn" title={wideLabel}>
                  <span class="btn-text-only">{wideLabel}</span>
                </button>
                <button id="btn-width-medium" class="ctrl-btn active" title={mediumLabel}>
                  <span class="btn-text-only">{mediumLabel}</span>
                </button>
                <button id="btn-width-narrow" class="ctrl-btn" title={narrowLabel}>
                  <span class="btn-text-only">{narrowLabel}</span>
                </button>
              </div>
            </div>

            <div class="control-divider"></div>

            {/* Toggles */}
            <div class="control-group toggles-list">
              <div class="toggle-row">
                <span class="toggle-label">{audioLabel}</span>
                <button id="btn-toggle-audio" class="small-action-btn" title={audioToggleTitle}>
                  <span class="audio-on-text" style="display:none">
                    {audioActiveText}
                  </span>
                  <span class="audio-off-text">{audioInactiveText}</span>
                </button>
              </div>
              <div class="toggle-row">
                <span class="toggle-label">{tocLabel}</span>
                <button id="btn-toggle-toc" class="small-action-btn" title={tocToggleTitle}>
                  <span>{toggleOpenText}</span>
                </button>
              </div>
              <div class="toggle-row">
                <span class="toggle-label">{bookmarksLabel}</span>
                <button
                  id="btn-toggle-bookmarks-sidebar"
                  class="small-action-btn"
                  title={bookmarksToggleTitle}
                >
                  <span>{toggleOpenText}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Left Sidebar for Bookmarks */}
          <div id="bookmarks-sidebar" class="bookmarks-sidebar sidebar-hidden">
            <div class="bookmarks-header">
              <h3 class="control-label">{bookmarksHeaderLabel}</h3>
              <button id="btn-close-bookmarks" class="close-sidebar-btn" title={closeLabel}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <div id="bookmarks-container" class="bookmarks-list">
              <div class="empty-bookmarks">{emptyBookmarksLabel}</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

ControlPanel.afterDOMLoaded = controlPanelScript + "\n" + readingEnhancementsScript
ControlPanel.css = styles

export default (() => ControlPanel) satisfies QuartzComponentConstructor
