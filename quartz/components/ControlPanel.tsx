// @ts-ignore
import controlPanelScript from "./scripts/controlpanel.inline"
import styles from "./styles/controlpanel.scss"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ControlPanel: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  return (
    <div class="control-panel-root">

      {/* Scroll to Top - Bottom Left */}
      <div class="scroll-to-top-dock">
        <button id="btn-scroll-top" class="dock-btn" title="أعلى الصفحة">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 19V5"/>
            <path d="m5 12 7-7 7 7"/>
          </svg>
        </button>
      </div>

      {/* Back Button - Top Right */}
      {fileData.slug !== "index" && (
        <div class="back-to-prev-dock">
          <button id="btn-back" class="dock-btn" title="رجوع للصفحة السابقة">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
        </div>
      )}

      {/* Settings Gear - Bottom Right, completely isolated */}
      {fileData.slug !== "index" && (fileData.frontmatter?.cssclasses?.includes("المقالات") || fileData.frontmatter?.tags?.includes("المقالات")) && (
        <>
          <div class="isolated-gear-dock">
            <button id="btn-settings-toggle" class="dock-btn" title="إعدادات القراءة">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
            </button>
          </div>

          {/* Settings Popover - Stacked immediately above the gear using CSS, not DOM nesting */}
          <div id="settings-panel" class="control-panel panel-collapsed isolated-settings-panel">

          {/* Font Size Control */}
          <div class="control-group">
            <span class="control-label">حجم الخط</span>
            <div class="control-buttons">
              <button id="btn-font-large" class="ctrl-btn" title="خط كبير">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="4 7 4 4 20 4 20 7"></polyline>
                  <line x1="9" y1="20" x2="15" y2="20"></line>
                  <line x1="12" y1="4" x2="12" y2="20"></line>
                </svg>
                <span class="btn-text">كبير</span>
              </button>
              <button id="btn-font-medium" class="ctrl-btn active" title="خط متوسط">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="4 7 4 4 20 4 20 7"></polyline>
                  <line x1="9" y1="20" x2="15" y2="20"></line>
                  <line x1="12" y1="4" x2="12" y2="20"></line>
                </svg>
                <span class="btn-text">متوسط</span>
              </button>
              <button id="btn-font-small" class="ctrl-btn" title="خط صغير">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="4 7 4 4 20 4 20 7"></polyline>
                  <line x1="9" y1="20" x2="15" y2="20"></line>
                  <line x1="12" y1="4" x2="12" y2="20"></line>
                </svg>
                <span class="btn-text">صغير</span>
              </button>
            </div>
          </div>

          <div class="control-divider"></div>

          {/* Color Theme Control */}
          <div class="control-group">
            <span class="control-label">وضع الألوان</span>
            <div class="control-buttons">
              <button id="btn-theme-dark" class="ctrl-btn mode-dark" title="داكن">
                <div class="color-swatch swatch-dark"></div>
                <span class="btn-text">داكن</span>
              </button>
              <button id="btn-theme-sepia" class="ctrl-btn mode-sepia" title="رملي">
                <div class="color-swatch swatch-sepia"></div>
                <span class="btn-text">رملي</span>
              </button>
              <button id="btn-theme-light" class="ctrl-btn mode-light active" title="فاتح">
                <div class="color-swatch swatch-light"></div>
                <span class="btn-text">فاتح</span>
              </button>
            </div>
          </div>

          <div class="control-divider"></div>

          {/* Content Width Control */}
          <div class="control-group">
            <span class="control-label">عرض القراءة</span>
            <div class="control-buttons">
              <button id="btn-width-wide" class="ctrl-btn" title="عريض">
                <span class="btn-text-only">عريض</span>
              </button>
              <button id="btn-width-medium" class="ctrl-btn active" title="متوسط">
                <span class="btn-text-only">متوسط</span>
              </button>
              <button id="btn-width-narrow" class="ctrl-btn" title="ضيق">
                <span class="btn-text-only">ضيق</span>
              </button>
            </div>
          </div>

          <div class="control-divider"></div>

          {/* Toggles */}
          <div class="control-group toggles-list">
            <div class="toggle-row">
              <span class="toggle-label">الصوت</span>
              <button id="btn-toggle-audio" class="small-action-btn" title="تفعيل / إيقاف الصوت">
                <span class="audio-on-text" style="display:none">إيقاف</span>
                <span class="audio-off-text">تفعيل</span>
              </button>
            </div>
            <div class="toggle-row">
              <span class="toggle-label">الفهرس</span>
              <button id="btn-toggle-toc" class="small-action-btn" title="تفعيل / إيقاف الفهرس">
                <span>تفعيل</span>
              </button>
            </div>
          </div>

        </div>
        </>
      )}

    </div>
  )
}

ControlPanel.afterDOMLoaded = controlPanelScript
ControlPanel.css = styles

export default (() => ControlPanel) satisfies QuartzComponentConstructor
