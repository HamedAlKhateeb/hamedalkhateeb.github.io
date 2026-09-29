import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative, pathToRoot } from "../util/path"

const readingSettingsScript = `
function initReadingSettings() {
  const toggleBtn = document.getElementById("btn-reading-settings");
  const modal = document.getElementById("reading-modal");
  const backdrop = document.getElementById("reading-backdrop");
  const closeBtn = document.getElementById("btn-close-reading");

  if (!toggleBtn || !modal) return;

  const openModal = () => {
    modal.classList.remove("is-hidden");
    if (backdrop) backdrop.classList.remove("is-hidden");
    toggleBtn.classList.add("is-active");
  };

  const closeModal = () => {
    modal.classList.add("is-hidden");
    if (backdrop) backdrop.classList.add("is-hidden");
    toggleBtn.classList.remove("is-active");
  };

  toggleBtn.onclick = (e) => {
    e.stopPropagation();
    if (modal.classList.contains("is-hidden")) {
      openModal();
    } else {
      closeModal();
    }
  };

  if (closeBtn) {
    closeBtn.onclick = (e) => {
      e.stopPropagation();
      closeModal();
    };
  }

  if (backdrop) {
    backdrop.onclick = (e) => {
      e.stopPropagation();
      closeModal();
    };
  }

  const onDocClick = (e) => {
    if (!modal.contains(e.target) && !toggleBtn.contains(e.target)) {
      if (!modal.classList.contains("is-hidden")) {
        closeModal();
      }
    }
  };
  document.addEventListener("click", onDocClick);
  if (typeof window.addCleanup === "function") {
    window.addCleanup(() => document.removeEventListener("click", onDocClick));
  }

  const onKeyDown = (e) => {
    if (e.key === "Escape" && !modal.classList.contains("is-hidden")) {
      closeModal();
    }
  };
  document.addEventListener("keydown", onKeyDown);
  if (typeof window.addCleanup === "function") {
    window.addCleanup(() => document.removeEventListener("keydown", onKeyDown));
  }

  // 1. Site Background
  const applySiteBg = (bg) => {
    document.documentElement.style.setProperty("--site-bg", bg);
    if (document.body) document.body.style.setProperty("--site-bg", bg);
    localStorage.setItem("user-site-bg", bg);
    if (bg === "#181816") {
      document.documentElement.setAttribute("saved-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      if (document.documentElement.getAttribute("saved-theme") === "dark") {
        document.documentElement.setAttribute("saved-theme", "light");
        localStorage.setItem("theme", "light");
      }
    }
    document.querySelectorAll(".site-bg-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-site-bg") === bg);
    });
  };

  const savedSiteBg = localStorage.getItem("user-site-bg") || "#f4f0ea";
  applySiteBg(savedSiteBg);

  document.querySelectorAll(".site-bg-btn").forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      applySiteBg(b.getAttribute("data-site-bg"));
    };
  });

  // 2. Container Background
  const applyContainerBg = (bg) => {
    document.documentElement.style.setProperty("--container-bg", bg);
    if (document.body) document.body.style.setProperty("--container-bg", bg);
    localStorage.setItem("user-container-bg", bg);
    if (bg === "transparent") {
      document.documentElement.style.setProperty("--container-border", "none");
      document.documentElement.style.setProperty("--container-shadow", "none");
    } else {
      document.documentElement.style.removeProperty("--container-border");
      document.documentElement.style.removeProperty("--container-shadow");
    }
    document.querySelectorAll(".container-bg-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-container-bg") === bg);
    });
  };

  const savedContainerBg = localStorage.getItem("user-container-bg") || "#ffffff";
  applyContainerBg(savedContainerBg);

  document.querySelectorAll(".container-bg-btn").forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      applyContainerBg(b.getAttribute("data-container-bg"));
    };
  });

  // 3. Font Family
  const fontMap = {
    amiri: "'Amiri', serif",
    cairo: "'Cairo', 'IBM Plex Sans Arabic', sans-serif",
    ibm: "'IBM Plex Sans Arabic', sans-serif",
    ruqaa: "'Aref Ruqaa', 'Amiri', serif",
  };

  const applyFontFamily = (key) => {
    const val = fontMap[key] || fontMap.amiri;
    document.documentElement.style.setProperty("--font-arabic", val);
    if (document.body) document.body.style.setProperty("--font-arabic", val);
    localStorage.setItem("user-font-family", key);
    document.querySelectorAll(".font-family-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-font") === key);
    });
  };

  const savedFont = localStorage.getItem("user-font-family") || "amiri";
  applyFontFamily(savedFont);

  document.querySelectorAll(".font-family-btn").forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      applyFontFamily(b.getAttribute("data-font"));
    };
  });

  // 4. Font Size
  const applyFontSize = (size) => {
    document.documentElement.style.setProperty("--main-font-size", size);
    if (document.body) document.body.style.setProperty("--main-font-size", size);
    localStorage.setItem("user-font-size", size);
    document.querySelectorAll(".font-size-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-size") === size);
    });
  };

  const savedSize = localStorage.getItem("user-font-size") || "19px";
  applyFontSize(savedSize);

  document.querySelectorAll(".font-size-btn").forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      applyFontSize(b.getAttribute("data-size"));
    };
  });

  // 5. Line Height
  const applyLineHeight = (lh) => {
    document.documentElement.style.setProperty("--main-line-height", lh);
    if (document.body) document.body.style.setProperty("--main-line-height", lh);
    localStorage.setItem("user-line-height", lh);
    document.querySelectorAll(".line-height-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-line") === lh);
    });
  };

  const savedLine = localStorage.getItem("user-line-height") || "1.8";
  applyLineHeight(savedLine);

  document.querySelectorAll(".line-height-btn").forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      applyLineHeight(b.getAttribute("data-line"));
    };
  });

  // 6. Reading Width
  const applyReadingWidth = (w) => {
    document.documentElement.style.setProperty("--reading-width", w);
    if (document.body) document.body.style.setProperty("--reading-width", w);
    localStorage.setItem("user-reading-width", w);
    document.querySelectorAll(".reading-width-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-width") === w);
    });
  };

  const savedWidth = localStorage.getItem("user-reading-width") || "1100px";
  applyReadingWidth(savedWidth);

  document.querySelectorAll(".reading-width-btn").forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      applyReadingWidth(b.getAttribute("data-width"));
    };
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initReadingSettings);
} else {
  initReadingSettings();
}
document.addEventListener("nav", initReadingSettings);
`

const Header: QuartzComponent = ({ children, fileData }: QuartzComponentProps) => {
  const slug = (fileData.slug ?? "").toLowerCase()
  const isEnglish = slug.startsWith("en/") || slug === "en" || slug.includes("/en/")
  const baseDir = pathToRoot(fileData.slug!)

  // Path matches
  const isMicro = slug.startsWith("ar/micro") || slug === "micro"
  const isArticles = slug.startsWith("ar/articles") || slug === "post" || slug.startsWith("post/")
  const isPoetry = slug.startsWith("ar/poetry")
  const isAbout = slug.startsWith("about") || slug.startsWith("ar/about")
  const isNewsletter = slug === "ar/newsletter" || slug.startsWith("ar/newsletter")
  const isTags = slug === "tags" || slug.startsWith("tags/")

  return (
    <header class="site-header alfarhan-header" dir={isEnglish ? "ltr" : "rtl"}>
      <div class="site-header-inner alfarhan-header-inner">
        {/* Brand */}
        <div class="site-brand alfarhan-brand">
          <a href={resolveRelative(fileData.slug!, "" as FullSlug)} class="brand-link">
            <span class="brand-chevron">&gt;</span>
            <span class="brand-name">{isEnglish ? "Hamed Alkhateeb" : "حامد الخطيب"}</span>
          </a>
        </div>

        {/* Navigation links & Dynamic Reading Settings */}
        <nav class="site-nav alfarhan-nav" aria-label={isEnglish ? "Main Navigation" : "التنقل الرئيسي"}>
          {!isEnglish ? (
            <>
              <a
                href={resolveRelative(fileData.slug!, "ar/articles" as FullSlug)}
                class={`site-nav-link alfarhan-nav-link ${isArticles ? "is-active" : ""}`}
              >
                <span class="nav-ico">🖊️</span>
                <span>تدوينات</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "ar/micro" as FullSlug)}
                class={`site-nav-link alfarhan-nav-link ${isMicro ? "is-active" : ""}`}
              >
                <span class="nav-ico">📍</span>
                <span>شذرات</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "tags" as FullSlug)}
                class={`site-nav-link alfarhan-nav-link ${isTags ? "is-active" : ""}`}
              >
                <span class="nav-ico">🏷️</span>
                <span>وسوم</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "ar/newsletter" as FullSlug)}
                class={`site-nav-link alfarhan-nav-link ${isNewsletter ? "is-active" : ""}`}
              >
                <span class="nav-ico">✉️</span>
                <span>النشرة</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "ar/poetry" as FullSlug)}
                class={`site-nav-link alfarhan-nav-link ${isPoetry ? "is-active" : ""}`}
              >
                <span class="nav-ico">📜</span>
                <span>ديوان الشعر</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "en" as FullSlug)}
                class="site-nav-link alfarhan-nav-link lang-switch-link"
                title="English Version"
              >
                <span class="nav-ico">🌐</span>
                <span>English</span>
              </a>
            </>
          ) : (
            <>
              <a
                href={resolveRelative(fileData.slug!, "Experiences" as FullSlug)}
                class="site-nav-link alfarhan-nav-link"
              >
                <span class="nav-ico">🖊️</span>
                <span>Writings</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "ar/micro" as FullSlug)}
                class="site-nav-link alfarhan-nav-link"
              >
                <span class="nav-ico">📍</span>
                <span>Snippets</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "tags" as FullSlug)}
                class={`site-nav-link alfarhan-nav-link ${isTags ? "is-active" : ""}`}
              >
                <span class="nav-ico">🏷️</span>
                <span>Tags</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "About" as FullSlug)}
                class="site-nav-link alfarhan-nav-link"
              >
                <span class="nav-ico">👤</span>
                <span>About</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "" as FullSlug)}
                class="site-nav-link alfarhan-nav-link lang-switch-link"
                title="النسخة العربية"
              >
                <span class="nav-ico">🌐</span>
                <span>العربية</span>
              </a>
            </>
          )}

          {/* ── Dynamic Reading Settings Trigger ── */}
          <div class="reading-settings-anchor">
            <button
              id="btn-reading-settings"
              class="alfarhan-nav-link reading-settings-btn"
              type="button"
              aria-label={isEnglish ? "Reading Settings" : "إعدادات القراءة"}
              title={isEnglish ? "Reading & Appearance Settings" : "إعدادات القراءة والمظهر"}
            >
              <span class="nav-ico">⚙️</span>
              <span class="reading-btn-label">{isEnglish ? "Reading" : "إعدادات القراءة"}</span>
            </button>
          </div>

          <div class="site-nav-tools">
            {children}
          </div>
        </nav>
      </div>

      {/* ── Dynamic Popover Modal ── */}
      <div id="reading-backdrop" class="reading-backdrop is-hidden" />
      <div id="reading-modal" class="reading-modal is-hidden" role="dialog" aria-modal="true">
        <div class="reading-modal-head">
          <div class="reading-modal-title">
            <span class="reading-modal-ico">⚙️</span>
            <span>{isEnglish ? "Reading & Display Settings" : "إعدادات القراءة والمظهر"}</span>
          </div>
          <button id="btn-close-reading" class="reading-modal-close" type="button" aria-label="إغلاق">
            ✕
          </button>
        </div>

        <div class="reading-modal-body">
          {/* Site Background */}
          <div class="reading-setting-section">
            <div class="reading-setting-title">{isEnglish ? "Site Background" : "خلفية الموقع"}</div>
            <div class="reading-swatches-grid">
              <button type="button" class="site-bg-btn" data-site-bg="#f4f0ea" title="ورقي دافئ (افتراضي)">
                <span class="swatch-circle" style={{ background: "#f4f0ea", borderColor: "#000" }} />
                <span class="swatch-name">ورقي</span>
              </button>
              <button type="button" class="site-bg-btn" data-site-bg="#faf9f6" title="أبيض ناصع">
                <span class="swatch-circle" style={{ background: "#faf9f6", borderColor: "#000" }} />
                <span class="swatch-name">أبيض</span>
              </button>
              <button type="button" class="site-bg-btn" data-site-bg="#ebe7de" title="رمادي عاجي">
                <span class="swatch-circle" style={{ background: "#ebe7de", borderColor: "#000" }} />
                <span class="swatch-name">عاجي</span>
              </button>
              <button type="button" class="site-bg-btn" data-site-bg="#f4ecd8" title="سيبيا كلاسيك">
                <span class="swatch-circle" style={{ background: "#f4ecd8", borderColor: "#000" }} />
                <span class="swatch-name">سيبيا</span>
              </button>
              <button type="button" class="site-bg-btn" data-site-bg="#181816" title="داكن ليلي">
                <span class="swatch-circle" style={{ background: "#181816", borderColor: "#555" }} />
                <span class="swatch-name">داكن</span>
              </button>
            </div>
          </div>

          {/* Container Background */}
          <div class="reading-setting-section">
            <div class="reading-setting-title">{isEnglish ? "Text Container Background" : "خلفية حاوية النص والمقال"}</div>
            <div class="reading-swatches-grid">
              <button type="button" class="container-bg-btn" data-container-bg="#ffffff" title="بطاقة بيضاء ناصعة">
                <span class="swatch-box" style={{ background: "#ffffff", borderColor: "#000" }} />
                <span class="swatch-name">أبيض</span>
              </button>
              <button type="button" class="container-bg-btn" data-container-bg="#fdfbf7" title="بطاقة ورقية ناعمة">
                <span class="swatch-box" style={{ background: "#fdfbf7", borderColor: "#888" }} />
                <span class="swatch-name">ورقي</span>
              </button>
              <button type="button" class="container-bg-btn" data-container-bg="#f7f1e1" title="بطاقة سيبيا دافئة">
                <span class="swatch-box" style={{ background: "#f7f1e1", borderColor: "#b09e7a" }} />
                <span class="swatch-name">سيبيا</span>
              </button>
              <button type="button" class="container-bg-btn" data-container-bg="#22201d" title="بطاقة داكنة فخمة">
                <span class="swatch-box" style={{ background: "#22201d", borderColor: "#555" }} />
                <span class="swatch-name">داكن</span>
              </button>
              <button type="button" class="container-bg-btn" data-container-bg="transparent" title="بلا بطاقة (شفاف)">
                <span class="swatch-box swatch-transparent" />
                <span class="swatch-name">شفاف</span>
              </button>
            </div>
          </div>

          {/* Font Family */}
          <div class="reading-setting-section">
            <div class="reading-setting-title">{isEnglish ? "Font Family" : "نوع الخط"}</div>
            <div class="reading-options-row">
              <button type="button" class="font-family-btn font-amiri" data-font="amiri">أميري</button>
              <button type="button" class="font-family-btn font-cairo" data-font="cairo">كايرو</button>
              <button type="button" class="font-family-btn font-ibm" data-font="ibm">آي بي إم</button>
              <button type="button" class="font-family-btn font-ruqaa" data-font="ruqaa">عارف رقعة</button>
            </div>
          </div>

          {/* Font Size */}
          <div class="reading-setting-section">
            <div class="reading-setting-title">{isEnglish ? "Font Size" : "حجم الخط"}</div>
            <div class="reading-options-row">
              <button type="button" class="font-size-btn" data-size="16px">صغير</button>
              <button type="button" class="font-size-btn" data-size="19px">متوسط</button>
              <button type="button" class="font-size-btn" data-size="22px">كبير</button>
              <button type="button" class="font-size-btn" data-size="25px">ضخم</button>
            </div>
          </div>

          {/* Line Height */}
          <div class="reading-setting-section">
            <div class="reading-setting-title">{isEnglish ? "Line Height" : "ارتفاع السطر"}</div>
            <div class="reading-options-row">
              <button type="button" class="line-height-btn" data-line="1.5">ضيق</button>
              <button type="button" class="line-height-btn" data-line="1.8">متوازن</button>
              <button type="button" class="line-height-btn" data-line="2.1">مريح</button>
            </div>
          </div>

          {/* Reading Width */}
          <div class="reading-setting-section">
            <div class="reading-setting-title">{isEnglish ? "Reading Width" : "عرض المحتوى"}</div>
            <div class="reading-options-row">
              <button type="button" class="reading-width-btn" data-width="900px">ضيق</button>
              <button type="button" class="reading-width-btn" data-width="1100px">قياسي</button>
              <button type="button" class="reading-width-btn" data-width="1300px">واسع</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

Header.afterDOMLoaded = readingSettingsScript
export default (() => Header) satisfies QuartzComponentConstructor
