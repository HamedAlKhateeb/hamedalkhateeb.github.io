import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative, pathToRoot } from "../util/path"

const readingSettingsScript = `
function initReadingSettings() {
  const toggleBtn = document.getElementById("btn-reading-settings");
  const modal = document.getElementById("reading-modal");
  const backdrop = document.getElementById("reading-backdrop");
  const closeBtn = document.getElementById("btn-close-reading");

  if (!toggleBtn || !modal) return;

  // IDEMPOTENT re-init (critical). This function runs once directly AND again
  // on the initial "nav" event (the SPA router fires "nav" on page load, and
  // our code sits BEFORE the router in the bundle, so no cleanup runs in
  // between). Without an explicit teardown, the toggle would get TWO click
  // handlers and one press would open+instantly-close the modal — looking dead.
  // We keep the disposer on the button element itself, so it works whether
  // SPA morphing preserves or replaces DOM nodes.
  if (typeof toggleBtn._rsTeardown === "function") {
    try { toggleBtn._rsTeardown(); } catch (_) {}
    toggleBtn._rsTeardown = null;
  }
  const _rsDisposers = [];
  const track = (target, type, handler, opts) => {
    target.addEventListener(type, handler, opts);
    const dispose = () => target.removeEventListener(type, handler, opts);
    _rsDisposers.push(dispose);
    if (typeof window.addCleanup === "function") {
      window.addCleanup(dispose);
    }
  };
  toggleBtn._rsTeardown = () => {
    _rsDisposers.forEach((d) => { try { d(); } catch (_) {} });
  };

  const openModal = () => {
    modal.classList.remove("is-hidden");
    if (backdrop) backdrop.classList.remove("is-hidden");
    toggleBtn.classList.add("is-active");
    toggleBtn.setAttribute("aria-expanded", "true");
    // Lock background scroll on mobile while sheet is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    if (modal.classList.contains("is-hidden")) return;
    modal.classList.add("is-hidden");
    if (backdrop) backdrop.classList.add("is-hidden");
    toggleBtn.classList.remove("is-active");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  const toggleModal = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (modal.classList.contains("is-hidden")) {
      openModal();
    } else {
      closeModal();
    }
  };

  toggleBtn.setAttribute("aria-expanded", "false");
  toggleBtn.setAttribute("aria-controls", "reading-modal");
  // Use addEventListener (not .onclick) so SPA re-morphs and other scripts can't clobber it.
  // 'click' covers tap on mobile; touch-action:manipulation in CSS removes 300ms delay.
  // track() registers the disposer so a repeated init never stacks handlers.
  track(toggleBtn, "click", toggleModal);

  const onCloseClick = (e) => {
    if (e) e.stopPropagation();
    closeModal();
  };
  if (closeBtn) {
    track(closeBtn, "click", onCloseClick);
  }

  if (backdrop) {
    const onBackdropClick = (e) => {
      if (e) e.stopPropagation();
      closeModal();
    };
    track(backdrop, "click", onBackdropClick);
  }

  const onDocClick = (e) => {
    const t = e.target;
    if (t instanceof Element) {
      if (modal.contains(t) || toggleBtn.contains(t)) return;
    }
    if (!modal.classList.contains("is-hidden")) {
      closeModal();
    }
  };
  // Use capture=false; toggle uses stopPropagation so this won't fire for the opening tap.
  track(document, "click", onDocClick);

  const onTouchOutside = (e) => {
    const t = e.target;
    if (t instanceof Element) {
      if (modal.contains(t) || toggleBtn.contains(t)) return;
    }
    if (!modal.classList.contains("is-hidden")) {
      closeModal();
    }
  };
  track(document, "touchend", onTouchOutside, { passive: true });

  const onKeyDown = (e) => {
    if (e.key === "Escape" && !modal.classList.contains("is-hidden")) {
      closeModal();
    }
  };
  track(document, "keydown", onKeyDown);

  function applySavedPrefs() {
    const isHome = (document.body && document.body.classList.contains("is-home-page")) || document.querySelector(".alfarhan-home-container") !== null;
    if (isHome) {
      document.documentElement.style.setProperty("--reading-width", "950px");
      if (document.body) document.body.style.setProperty("--reading-width", "950px");
      return;
    }
    try {
      const savedSiteBg = localStorage.getItem("user-site-bg") || "#f4f0ea";
      applySiteBg(savedSiteBg);
    } catch (_) {}
    try {
      const savedContainerBg = localStorage.getItem("user-container-bg") || "#ffffff";
      applyContainerBg(savedContainerBg);
    } catch (_) {}
    try {
      const savedFont = localStorage.getItem("user-font-family") || "amiri";
      applyFontFamily(savedFont);
    } catch (_) {}
    try {
      const savedSize = localStorage.getItem("user-font-size") || "19px";
      applyFontSize(savedSize);
    } catch (_) {}
    try {
      const savedLine = localStorage.getItem("user-line-height") || "1.8";
      applyLineHeight(savedLine);
    } catch (_) {}
    try {
      const validWidths = ["950px", "1150px", "1400px"];
      let savedWidth = localStorage.getItem("user-reading-width");
      if (!savedWidth || !validWidths.includes(savedWidth)) savedWidth = "950px";
      applyReadingWidth(savedWidth);
    } catch (_) {}
  }

  // 1. Site Background
  const applySiteBg = (bg) => {
    document.documentElement.style.setProperty("--site-bg", bg);
    if (document.body) document.body.style.setProperty("--site-bg", bg);
    try { localStorage.setItem("user-site-bg", bg); } catch (_) {}
    if (bg === "#181816") {
      document.documentElement.setAttribute("saved-theme", "dark");
      try { localStorage.setItem("theme", "dark"); } catch (_) {}
    } else {
      if (document.documentElement.getAttribute("saved-theme") === "dark") {
        document.documentElement.setAttribute("saved-theme", "light");
        try { localStorage.setItem("theme", "light"); } catch (_) {}
      }
    }
    document.querySelectorAll(".site-bg-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-site-bg") === bg);
    });
  };

  document.querySelectorAll(".site-bg-btn").forEach((b) => {
    const h = (e) => {
      if (e) e.stopPropagation();
      applySiteBg(b.getAttribute("data-site-bg"));
    };
    track(b, "click", h);
  });

  // 2. Container Background
  const applyContainerBg = (bg) => {
    document.documentElement.style.setProperty("--container-bg", bg);
    if (document.body) document.body.style.setProperty("--container-bg", bg);
    try { localStorage.setItem("user-container-bg", bg); } catch (_) {}
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

  document.querySelectorAll(".container-bg-btn").forEach((b) => {
    const h = (e) => {
      if (e) e.stopPropagation();
      applyContainerBg(b.getAttribute("data-container-bg"));
    };
    track(b, "click", h);
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
    try { localStorage.setItem("user-font-family", key); } catch (_) {}
    document.querySelectorAll(".font-family-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-font") === key);
    });
  };

  document.querySelectorAll(".font-family-btn").forEach((b) => {
    const h = (e) => {
      if (e) e.stopPropagation();
      applyFontFamily(b.getAttribute("data-font"));
    };
    track(b, "click", h);
  });

  // 4. Font Size
  const applyFontSize = (size) => {
    document.documentElement.style.setProperty("--main-font-size", size);
    if (document.body) document.body.style.setProperty("--main-font-size", size);
    try { localStorage.setItem("user-font-size", size); } catch (_) {}
    document.querySelectorAll(".font-size-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-size") === size);
    });
  };

  document.querySelectorAll(".font-size-btn").forEach((b) => {
    const h = (e) => {
      if (e) e.stopPropagation();
      applyFontSize(b.getAttribute("data-size"));
    };
    track(b, "click", h);
  });

  // 5. Line Height
  const applyLineHeight = (lh) => {
    document.documentElement.style.setProperty("--main-line-height", lh);
    if (document.body) document.body.style.setProperty("--main-line-height", lh);
    try { localStorage.setItem("user-line-height", lh); } catch (_) {}
    document.querySelectorAll(".line-height-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-line") === lh);
    });
  };

  document.querySelectorAll(".line-height-btn").forEach((b) => {
    const h = (e) => {
      if (e) e.stopPropagation();
      applyLineHeight(b.getAttribute("data-line"));
    };
    track(b, "click", h);
  });

  // 6. Reading Width
  const applyReadingWidth = (w) => {
    document.documentElement.style.setProperty("--reading-width", w);
    if (document.body) document.body.style.setProperty("--reading-width", w);
    try { localStorage.setItem("user-reading-width", w); } catch (_) {}
    document.querySelectorAll(".reading-width-btn").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-width") === w);
    });
  };

  document.querySelectorAll(".reading-width-btn").forEach((b) => {
    const h = (e) => {
      if (e) e.stopPropagation();
      applyReadingWidth(b.getAttribute("data-width"));
    };
    track(b, "click", h);
  });

  applySavedPrefs();
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
  const isEnglish =
    slug.startsWith("en/") ||
    slug === "en" ||
    slug.includes("/en/") ||
    fileData.frontmatter?.lang === "en" ||
    (!slug.startsWith("ar/") &&
      slug !== "index" &&
      slug !== "" &&
      fileData.frontmatter?.lang !== "ar" &&
      (slug.startsWith("experiences") ||
        slug.startsWith("engineering") ||
        slug.startsWith("math") ||
        slug.startsWith("culture") ||
        slug.startsWith("about") ||
        slug.startsWith("personal")))
  const baseDir = pathToRoot(fileData.slug!)

  // Path matches
  const isMicro = slug.startsWith("ar/micro") || slug === "micro" || slug.startsWith("en/micro")
  const isArticles = slug.startsWith("ar/articles") || slug === "post" || slug.startsWith("post/")
  const isPoetry = slug.startsWith("ar/poetry")
  const isAbout = slug.startsWith("about") || slug.startsWith("ar/about")
  const isNewsletter = slug === "ar/newsletter" || slug.startsWith("ar/newsletter")
  const isTags = slug === "tags" || slug.startsWith("tags/")

  return (
    <header class="site-header alfarhan-header" dir={isEnglish ? "ltr" : "rtl"}>
      <div class="site-header-inner alfarhan-header-inner">
        {/* Brand — "Hamed Alkhateeb" goes to the English section, Arabic brand to root */}
        <div class="site-brand alfarhan-brand">
            <a
              href={resolveRelative(fileData.slug!, (isEnglish ? "en" : "") as FullSlug)}
              class="brand-link"
            >
              <span class="brand-chevron">&gt;</span>
              <span class="brand-name">{isEnglish ? "Hamed Alkhateeb" : "حامد الخطيب"}</span>
            </a>
          </div>
          <div class="site-nav-tools header-tools">
            {children}
            {/* Reading settings trigger lives here so it is ALWAYS visible (never scrolled away) */}
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
          </div>

        {/* Navigation links (middle column on desktop, full row on mobile) */}
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
                href={resolveRelative(fileData.slug!, "en/micro" as FullSlug)}
                class={`site-nav-link alfarhan-nav-link ${isMicro ? "is-active" : ""}`}
              >
                <span class="nav-ico">📍</span>
                <span>Snippets</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "About" as FullSlug)}
                class="site-nav-link alfarhan-nav-link"
              >
                <span class="nav-ico">👤</span>
                <span>About</span>
              </a>
              <a
                href={resolveRelative(fileData.slug!, "tags" as FullSlug)}
                class={`site-nav-link alfarhan-nav-link ${isTags ? "is-active" : ""}`}
              >
                <span class="nav-ico">🏷️</span>
                <span>Tags</span>
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

        </nav>
      </div>

      {/* ── Dynamic Popover Modal ── */}
      <div id="reading-backdrop" class="reading-backdrop is-hidden" />
      <div id="reading-modal" class="reading-modal is-hidden" role="dialog" aria-modal="true" dir={isEnglish ? "ltr" : "rtl"}>
        <div class="reading-modal-head">
          <div class="reading-modal-title">
            <span class="reading-modal-ico">⚙️</span>
            <span>{isEnglish ? "Reading & Display Settings" : "إعدادات القراءة والمظهر"}</span>
          </div>
          <button id="btn-close-reading" class="reading-modal-close" type="button" aria-label={isEnglish ? "Close" : "إغلاق"}>
            ✕
          </button>
        </div>

        <div class="reading-modal-body">
          {/* Site Background */}
          <div class="reading-setting-section">
            <div class="reading-setting-title">{isEnglish ? "Site Background" : "خلفية الموقع"}</div>
            <div class="reading-swatches-grid">
              <button type="button" class="site-bg-btn" data-site-bg="#f4f0ea" title={isEnglish ? "Warm Paper (Default)" : "ورقي دافئ (افتراضي)"}>
                <span class="swatch-circle" style={{ background: "#f4f0ea", borderColor: "#000" }} />
                <span class="swatch-name">{isEnglish ? "Paper" : "ورقي"}</span>
              </button>
              <button type="button" class="site-bg-btn" data-site-bg="#faf9f6" title={isEnglish ? "Pure White" : "أبيض ناصع"}>
                <span class="swatch-circle" style={{ background: "#faf9f6", borderColor: "#000" }} />
                <span class="swatch-name">{isEnglish ? "White" : "أبيض"}</span>
              </button>
              <button type="button" class="site-bg-btn" data-site-bg="#ebe7de" title={isEnglish ? "Ivory Gray" : "رمادي عاجي"}>
                <span class="swatch-circle" style={{ background: "#ebe7de", borderColor: "#000" }} />
                <span class="swatch-name">{isEnglish ? "Ivory" : "عاجي"}</span>
              </button>
              <button type="button" class="site-bg-btn" data-site-bg="#f4ecd8" title={isEnglish ? "Classic Sepia" : "سيبيا كلاسيك"}>
                <span class="swatch-circle" style={{ background: "#f4ecd8", borderColor: "#000" }} />
                <span class="swatch-name">{isEnglish ? "Sepia" : "سيبيا"}</span>
              </button>
              <button type="button" class="site-bg-btn" data-site-bg="#181816" title={isEnglish ? "Night Dark" : "داكن ليلي"}>
                <span class="swatch-circle" style={{ background: "#181816", borderColor: "#555" }} />
                <span class="swatch-name">{isEnglish ? "Dark" : "داكن"}</span>
              </button>
            </div>
          </div>

          {/* Container Background */}
          <div class="reading-setting-section">
            <div class="reading-setting-title">{isEnglish ? "Content Container Background" : "خلفية حاوية النص والمقال"}</div>
            <div class="reading-swatches-grid">
              <button type="button" class="container-bg-btn" data-container-bg="#ffffff" title={isEnglish ? "Pure White Card" : "بطاقة بيضاء ناصعة"}>
                <span class="swatch-box" style={{ background: "#ffffff", borderColor: "#000" }} />
                <span class="swatch-name">{isEnglish ? "White" : "أبيض"}</span>
              </button>
              <button type="button" class="container-bg-btn" data-container-bg="#fdfbf7" title={isEnglish ? "Soft Paper Card" : "بطاقة ورقية ناعمة"}>
                <span class="swatch-box" style={{ background: "#fdfbf7", borderColor: "#888" }} />
                <span class="swatch-name">{isEnglish ? "Paper" : "ورقي"}</span>
              </button>
              <button type="button" class="container-bg-btn" data-container-bg="#f7f1e1" title={isEnglish ? "Warm Sepia Card" : "بطاقة سيبيا دافئة"}>
                <span class="swatch-box" style={{ background: "#f7f1e1", borderColor: "#b09e7a" }} />
                <span class="swatch-name">{isEnglish ? "Sepia" : "سيبيا"}</span>
              </button>
              <button type="button" class="container-bg-btn" data-container-bg="#22201d" title={isEnglish ? "Rich Dark Card" : "بطاقة داكنة فخمة"}>
                <span class="swatch-box" style={{ background: "#22201d", borderColor: "#555" }} />
                <span class="swatch-name">{isEnglish ? "Dark" : "داكن"}</span>
              </button>
              <button type="button" class="container-bg-btn" data-container-bg="transparent" title={isEnglish ? "Transparent (No Card)" : "بلا بطاقة (شفاف)"}>
                <span class="swatch-box swatch-transparent" />
                <span class="swatch-name">{isEnglish ? "Clear" : "شفاف"}</span>
              </button>
            </div>
          </div>

          {/* Font Family */}
          <div class="reading-setting-section">
            <div class="reading-setting-title">{isEnglish ? "Font Family" : "نوع الخط"}</div>
            <div class="reading-options-row">
              <button type="button" class="font-family-btn font-amiri" data-font="amiri">{isEnglish ? "Amiri" : "أميري"}</button>
              <button type="button" class="font-family-btn font-cairo" data-font="cairo">{isEnglish ? "Cairo" : "كايرو"}</button>
              <button type="button" class="font-family-btn font-ibm" data-font="ibm">{isEnglish ? "IBM Plex" : "آي بي إم"}</button>
              <button type="button" class="font-family-btn font-ruqaa" data-font="ruqaa">{isEnglish ? "Aref Ruqaa" : "عارف رقعة"}</button>
            </div>
          </div>

          {/* Font Size */}
          <div class="reading-setting-section">
            <div class="reading-setting-title">{isEnglish ? "Font Size" : "حجم الخط"}</div>
            <div class="reading-options-row">
              <button type="button" class="font-size-btn" data-size="16px">{isEnglish ? "Small" : "صغير"}</button>
              <button type="button" class="font-size-btn" data-size="19px">{isEnglish ? "Medium" : "متوسط"}</button>
              <button type="button" class="font-size-btn" data-size="22px">{isEnglish ? "Large" : "كبير"}</button>
              <button type="button" class="font-size-btn" data-size="25px">{isEnglish ? "Huge" : "ضخم"}</button>
            </div>
          </div>

          {/* Line Height */}
          <div class="reading-setting-section">
            <div class="reading-setting-title">{isEnglish ? "Line Height" : "ارتفاع السطر"}</div>
            <div class="reading-options-row">
              <button type="button" class="line-height-btn" data-line="1.5">{isEnglish ? "Compact" : "ضيق"}</button>
              <button type="button" class="line-height-btn" data-line="1.8">{isEnglish ? "Normal" : "متوازن"}</button>
              <button type="button" class="line-height-btn" data-line="2.1">{isEnglish ? "Spacious" : "مريح"}</button>
            </div>
          </div>

          {/* Reading Width — hidden on phones (meaningless there), see CSS */}
          <div class="reading-setting-section reading-width-section">
            <div class="reading-setting-title">{isEnglish ? "Content Width" : "عرض المحتوى"}</div>
            <div class="reading-options-row">
              <button type="button" class="reading-width-btn" data-width="950px">{isEnglish ? "Narrow" : "ضيق"}</button>
              <button type="button" class="reading-width-btn" data-width="1150px">{isEnglish ? "Standard" : "قياسي"}</button>
              <button type="button" class="reading-width-btn" data-width="1400px">{isEnglish ? "Wide" : "واسع"}</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

Header.afterDOMLoaded = readingSettingsScript
export default (() => Header) satisfies QuartzComponentConstructor
