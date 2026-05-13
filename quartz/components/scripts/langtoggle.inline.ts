document.addEventListener("nav", () => {
  const STORAGE_KEY = "quartz-lang"
  const ASKED_KEY = "quartz-lang-asked"
  const TRANSLATE_CACHE_PREFIX = "quartz-tr-"

  // Determine language from URL > localStorage > default
  const urlParams = new URLSearchParams(window.location.search)
  const urlLang = urlParams.get("lang")
  let currentLang = urlLang || localStorage.getItem(STORAGE_KEY) || "ar"

  if (urlLang) {
    localStorage.setItem(STORAGE_KEY, urlLang)
    localStorage.setItem(ASKED_KEY, "true")
  }

  // Auto-detection banner for first-time non-Arabic visitors
  if (!localStorage.getItem(ASKED_KEY) && !urlLang) {
    const browserLang = navigator.language || (navigator as any).languages?.[0] || "ar"
    if (!browserLang.startsWith("ar")) {
      showLanguageBanner()
    } else {
      localStorage.setItem(ASKED_KEY, "true")
    }
  }

  // Apply current language
  applyLanguage(currentLang)

  // Toggle button
  const toggleBtn = document.getElementById("lang-toggle-btn")
  if (toggleBtn) {
    const handler = () => {
      currentLang = currentLang === "ar" ? "en" : "ar"
      localStorage.setItem(STORAGE_KEY, currentLang)
      localStorage.setItem(ASKED_KEY, "true")
      // Remove banner if present
      document.querySelector(".lang-detect-banner")?.remove()
      applyLanguage(currentLang)
    }
    toggleBtn.addEventListener("click", handler)
    window.addCleanup(() => toggleBtn.removeEventListener("click", handler))
  }

  function applyLanguage(lang: string) {
    const html = document.documentElement

    if (lang === "en") {
      html.setAttribute("dir", "ltr")
      html.setAttribute("lang", "en")
      html.classList.add("lang-en")
      html.classList.remove("lang-ar")

      // Save original Arabic text and swap to English
      document.querySelectorAll("[data-lang-en]").forEach((el) => {
        if (!el.getAttribute("data-lang-ar")) {
          el.setAttribute("data-lang-ar", el.textContent || "")
        }
        el.textContent = el.getAttribute("data-lang-en") || ""
      })

      // Swap titles
      document.querySelectorAll("[data-lang-en-title]").forEach((el) => {
        if (!el.getAttribute("data-lang-ar-title")) {
          el.setAttribute("data-lang-ar-title", el.getAttribute("title") || "")
        }
        el.setAttribute("title", el.getAttribute("data-lang-en-title") || "")
      })

      // Swap placeholders
      document.querySelectorAll("[data-lang-en-placeholder]").forEach((el) => {
        if (!el.getAttribute("data-lang-ar-placeholder")) {
          el.setAttribute("data-lang-ar-placeholder", el.getAttribute("placeholder") || "")
        }
        el.setAttribute("placeholder", el.getAttribute("data-lang-en-placeholder") || "")
      })

      // Update toggle button label
      const label = document.getElementById("lang-label-show")
      if (label) label.textContent = "ع"

      // Handle page content
      handleEnglishContent()
    } else {
      html.setAttribute("dir", "rtl")
      html.setAttribute("lang", "ar")
      html.classList.add("lang-ar")
      html.classList.remove("lang-en")

      // Restore Arabic text
      document.querySelectorAll("[data-lang-ar]").forEach((el) => {
        el.textContent = el.getAttribute("data-lang-ar") || ""
      })

      // Restore titles
      document.querySelectorAll("[data-lang-ar-title]").forEach((el) => {
        el.setAttribute("title", el.getAttribute("data-lang-ar-title") || "")
      })

      // Restore placeholders
      document.querySelectorAll("[data-lang-ar-placeholder]").forEach((el) => {
        el.setAttribute("placeholder", el.getAttribute("data-lang-ar-placeholder") || "")
      })

      // Update toggle button label
      const label = document.getElementById("lang-label-show")
      if (label) label.textContent = "EN"

      // Remove translation notices
      document.querySelectorAll(".translation-notice").forEach((el) => el.remove())
    }
  }

  function handleEnglishContent() {
    const slug = document.body.dataset.slug || ""
    const isPoetry =
      slug.toLowerCase().startsWith("poetry/") &&
      slug !== "poetry/" &&
      !slug.endsWith("/index")

    if (isPoetry) {
      addTranslationNotice(
        `🤖 Poetry is not manually translated. <a href="https://translate.google.com/translate?sl=ar&tl=en&u=${encodeURIComponent(window.location.href)}" target="_blank" style="text-decoration: underline; color: var(--tertiary);">Translate via Google</a>`
      )
    }
  }

  function addTranslationNotice(message: string) {
    // Remove existing notices
    document.querySelectorAll(".translation-notice").forEach((el) => el.remove())

    const notice = document.createElement("div")
    notice.className = "translation-notice"
    notice.innerHTML = `<span>${message}</span>`

    const titleContainer = document.querySelector(".article-title-container")
    const beforeBody = document.querySelector(".popover-hint")
    const target = titleContainer || beforeBody
    if (target) {
      target.parentNode?.insertBefore(notice, target.nextSibling)
    }
  }

  function showLanguageBanner() {
    // Don't show if already exists
    if (document.querySelector(".lang-detect-banner")) return

    const banner = document.createElement("div")
    banner.className = "lang-detect-banner"
    banner.innerHTML = `
      <div class="lang-detect-inner">
        <span class="lang-detect-text">This site is available in English. Would you like to switch?</span>
        <div class="lang-detect-actions">
          <button class="lang-detect-btn lang-detect-switch">Switch to English</button>
          <button class="lang-detect-btn lang-detect-keep">Keep Arabic</button>
        </div>
      </div>
    `

    document.body.prepend(banner)
    requestAnimationFrame(() => banner.classList.add("banner-visible"))

    const switchBtn = banner.querySelector(".lang-detect-switch")
    const keepBtn = banner.querySelector(".lang-detect-keep")

    const handleSwitch = () => {
      localStorage.setItem(STORAGE_KEY, "en")
      localStorage.setItem(ASKED_KEY, "true")
      currentLang = "en"
      banner.classList.remove("banner-visible")
      setTimeout(() => banner.remove(), 400)
      applyLanguage("en")
    }

    const handleKeep = () => {
      localStorage.setItem(STORAGE_KEY, "ar")
      localStorage.setItem(ASKED_KEY, "true")
      banner.classList.remove("banner-visible")
      setTimeout(() => banner.remove(), 400)
    }

    switchBtn?.addEventListener("click", handleSwitch)
    keepBtn?.addEventListener("click", handleKeep)

    window.addCleanup(() => {
      switchBtn?.removeEventListener("click", handleSwitch)
      keepBtn?.removeEventListener("click", handleKeep)
      banner.remove()
    })
  }
})
